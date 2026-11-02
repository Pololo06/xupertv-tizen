/*
 * XuperTV - capa de adaptacion para Samsung Tizen (2018/2019, Tizen 4/5).
 *
 * Se carga DESPUES de config/api.js y ANTES de js/app.js.
 *
 * - Detecta Tizen y apunta XUPERTV_API.devServiceUrl al relay de la LAN.
 * - Overlay de configuracion si el relay no responde.
 * - Ajuste "Servidor" dentro de #screen-settings.
 * - Teclas Tizen: Back (10009) -> 461, Exit (10182) -> cerrar app.
 * - Registra las teclas multimedia del mando.
 */
(function () {
  "use strict";

  var isTizen = typeof tizen !== "undefined";
  window.__XUPER_TIZEN__ = isTizen;

  var STORAGE_KEY = "xuper.relayUrl";
  var API = window.XUPERTV_API || (window.XUPERTV_API = {});
  // En TizenBrew el relay va dentro del servicio Node de la propia TV.
  var embeddedRelay = location.port === "8081" && location.pathname.indexOf("/module/") === 0;
  var DEFAULT_URL = embeddedRelay
    ? "http://127.0.0.1:8910"
    : API.devServiceUrl || "http://192.168.1.19:8910";

  // Modo de reproducción inicial si el usuario aún no tiene uno guardado
  try {
    var globalPlayback = JSON.parse(localStorage.getItem("xuper_global_playback_v1") || "{}");
    if (!globalPlayback.streamMode) {
      globalPlayback.streamMode = "normal";
      localStorage.setItem("xuper_global_playback_v1", JSON.stringify(globalPlayback));
    }
  } catch (e) {}

  /* ---------------------------------------------------------------- */
  /* URL del relay                                                     */
  /* ---------------------------------------------------------------- */

  function normalizeUrl(value) {
    var url = String(value || "").trim();
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) url = "http://" + url;
    url = url.replace(/\/+$/, "");
    return url;
  }

  function storedUrl() {
    try {
      return normalizeUrl(localStorage.getItem(STORAGE_KEY) || "");
    } catch (e) {
      return "";
    }
  }

  function currentUrl() {
    return normalizeUrl(API.devServiceUrl || DEFAULT_URL);
  }

  function persistUrl(value) {
    var url = normalizeUrl(value);
    if (!url) return "";
    API.devServiceUrl = url;
    try {
      localStorage.setItem(STORAGE_KEY, url);
    } catch (e) {}
    return url;
  }

  // URL guardada (o default) antes de que arranque app.js
  API.devServiceUrl = storedUrl() || normalizeUrl(DEFAULT_URL);

  /* ---------------------------------------------------------------- */
  /* Ping al relay                                                     */
  /* ---------------------------------------------------------------- */

  function ping(url, callback) {
    var done = false,
      target = normalizeUrl(url);

    function finish(ok, data, error) {
      if (done) return;
      done = true;
      callback(ok, data || null, error || "");
    }

    if (!target) return finish(false, null, "URL vacia");

    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", target + "/ping", true);
      xhr.timeout = 3000;
      xhr.onload = function () {
        var data = null;
        try {
          data = JSON.parse(xhr.responseText);
        } catch (e) {}
        var ok = xhr.status >= 200 && xhr.status < 300 && data && data.returnValue !== false;
        finish(ok, data, ok ? "" : "HTTP " + xhr.status);
      };
      xhr.onerror = function () {
        finish(false, null, "sin conexion");
      };
      xhr.ontimeout = function () {
        finish(false, null, "tiempo agotado");
      };
      xhr.send();
    } catch (e) {
      finish(false, null, e.message || "error");
    }
  }

  // El servicio TizenBrew arranca en paralelo a la pagina. Se reintenta
  // mientras se muestra un aviso de inicio, no un error definitivo.
  function waitForRelay(url, tries, callback) {
    var warning = setTimeout(function () {
      showOverlay(embeddedRelay ? "Iniciando relay interno…" : "Conectando con " + url);
    }, embeddedRelay ? 3000 : 1200);
    (function attempt(left) {
      ping(url, function (ok, data, error) {
        if (ok) {
          clearTimeout(warning);
          return callback(true);
        }
        if (left <= 0) {
          clearTimeout(warning);
          return callback(false, error);
        }
        setTimeout(function () {
          attempt(left - 1);
        }, 400);
      });
    })(tries);
  }

  // Si TizenBrew no arranco el servicio, pedirle que lo inicie por su
  // WebSocket interno (mismo puerto que sirve esta pagina).
  function ensureEmbeddedService(callback) {
    if (!embeddedRelay || typeof WebSocket === "undefined") return callback(false, "");
    var ws, done = false, timer;
    function finish(ok, error) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try {
        ws && ws.close();
      } catch (e) {}
      callback(ok, error || "");
    }
    try {
      ws = new WebSocket("ws://127.0.0.1:8081");
    } catch (e) {
      return finish(false, e.message || "WebSocket no disponible");
    }
    timer = setTimeout(function () {
      finish(false, "TizenBrew no respondio");
    }, 6000);
    ws.onerror = function () {
      finish(false, "TizenBrew no respondio");
    };
    ws.onopen = function () {
      ws.send(JSON.stringify({ type: 7 })); // GetServiceStatuses
    };
    ws.onmessage = function (event) {
      var data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        return;
      }
      if (data.type === 8) return finish(false, String(data.payload || "error de TizenBrew"));
      if (data.type === 7) {
        var list = data.payload || [],
          status = null,
          i;
        for (i = 0; i < list.length; i++) {
          if (list[i] && String(list[i].name).indexOf("xupertv-tizen") !== -1) status = list[i];
        }
        if (status && !status.hasCrashed) return finish(true);
        ws.send(JSON.stringify({ type: 4, payload: true })); // GetModules
        return;
      }
      if (data.type === 4) {
        var modules = data.payload || [],
          mod = null,
          j;
        for (j = 0; j < modules.length; j++) {
          if (modules[j] && String(modules[j].fullName).indexOf("xupertv-tizen") !== -1) mod = modules[j];
        }
        if (!mod || !mod.serviceFile) return finish(false, "el modulo no declara relay");
        ws.send(JSON.stringify({ type: 6, payload: mod })); // StartService
        setTimeout(function () {
          finish(true);
        }, 2500);
      }
    };
  }

  /* ---------------------------------------------------------------- */
  /* Overlay de configuracion                                          */
  /* ---------------------------------------------------------------- */

  var overlay = null,
    overlayVisible = false,
    inputEl = null,
    testBtn = null,
    saveBtn = null,
    statusEl = null;

  function buildOverlay() {
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.id = "xuper-relay-overlay";
    overlay.innerHTML =
      '<div class="xr-card">' +
      '<div class="xr-brand">XuperTV</div>' +
      '<div class="xr-title">Configurar servidor</div>' +
      '<div class="xr-desc">XuperTV necesita el relay que se ejecuta en tu PC o Raspberry, en la misma red que la TV.</div>' +
      '<input id="xr-url" class="xr-input" type="text" inputmode="url" spellcheck="false" autocomplete="off" autocapitalize="off" />' +
      '<div class="xr-row">' +
      '<button id="xr-test" class="xr-btn" type="button">Probar</button>' +
      '<button id="xr-save" class="xr-btn xr-primary" type="button">Guardar</button>' +
      "</div>" +
      '<div id="xr-status" class="xr-status"></div>' +
      '<div class="xr-hint">Ejemplo: http://192.168.1.19:8910 &nbsp;·&nbsp; Flechas para moverte &nbsp;·&nbsp; OK para elegir</div>' +
      "</div>";

    var host = document.getElementById("app") || document.body;
    host.appendChild(overlay);

    inputEl = document.getElementById("xr-url");
    testBtn = document.getElementById("xr-test");
    saveBtn = document.getElementById("xr-save");
    statusEl = document.getElementById("xr-status");

    testBtn.addEventListener("click", function () {
      testConnection();
    });
    saveBtn.addEventListener("click", function () {
      saveConnection();
    });
    inputEl.addEventListener("keydown", function (e) {
      // Que el IME de la TV reciba el texto; el handler global ya aisla inputs.
      if ((e.keyCode || e.which) === 13) e.stopPropagation();
    });
  }

  function setStatus(text, kind) {
    if (!statusEl) return;
    statusEl.textContent = text || "";
    statusEl.className = "xr-status" + (kind ? " is-" + kind : "");
  }

  function showOverlay(message) {
    buildOverlay();
    if (!overlayVisible) {
      inputEl.value = currentUrl();
      overlay.classList.add("is-visible");
      overlayVisible = true;
    }
    if (message) setStatus(message, "err");
    try {
      inputEl.focus();
      inputEl.select();
    } catch (e) {}
  }

  function hideOverlay() {
    if (!overlay) return;
    overlayVisible = false;
    overlay.classList.remove("is-visible");
    try {
      inputEl.blur();
    } catch (e) {}
  }

  function overlayButtons() {
    return [inputEl, testBtn, saveBtn];
  }

  function moveOverlayFocus(direction) {
    var list = overlayButtons(),
      index = list.indexOf(document.activeElement),
      next;
    if (index < 0) index = 0;
    if (direction === "up" || direction === "left") next = (index - 1 + list.length) % list.length;
    else next = (index + 1) % list.length;
    try {
      list[next].focus();
    } catch (e) {}
  }

  function testConnection() {
    var url = normalizeUrl(inputEl && inputEl.value);
    if (!url) {
      setStatus("Escribe la direccion del relay.", "err");
      return;
    }
    setStatus("Probando " + url + " ...", "");
    if (testBtn) testBtn.disabled = true;
    if (saveBtn) saveBtn.disabled = true;
    ping(url, function (ok, data, error) {
      if (testBtn) testBtn.disabled = false;
      if (saveBtn) saveBtn.disabled = false;
      if (ok) {
        var version = data && data.version ? " (v" + data.version + ")" : "";
        setStatus("Conectado al relay XuperTV" + version, "ok");
      } else {
        setStatus("No se pudo conectar: " + (error || "revisa la IP y el firewall"), "err");
      }
    });
  }

  function saveConnection() {
    var url = normalizeUrl(inputEl && inputEl.value);
    if (!url) {
      setStatus("Escribe la direccion del relay.", "err");
      return;
    }
    setStatus("Probando " + url + " ...", "");
    ping(url, function (ok, data, error) {
      if (!ok) {
        setStatus("No se pudo conectar: " + (error || "revisa la IP y el relay"), "err");
        return;
      }
      persistUrl(url);
      setStatus("Guardado. Recargando...", "ok");
      setTimeout(function () {
        window.location.reload();
      }, 400);
    });
  }

  /* ---------------------------------------------------------------- */
  /* Ajuste "Servidor" en #screen-settings                             */
  /* ---------------------------------------------------------------- */

  var SERVER_ICON =
    '<svg viewBox="0 0 32 32"><rect x="4" y="5" width="24" height="9" rx="2"/><rect x="4" y="18" width="24" height="9" rx="2"/><circle cx="9" cy="9.5" r="1.4" fill="#000"/><circle cx="9" cy="22.5" r="1.4" fill="#000"/></svg>';

  function isServerItem(el) {
    return el && el.className && String(el.className).indexOf("xr-settings-item") !== -1;
  }

  function hideServerPanel() {
    var panel = document.querySelector(".xr-server-panel");
    if (panel) panel.classList.remove("is-active");
  }

  function activateServerPanel() {
    var panel = document.querySelector(".xr-server-panel");
    if (!panel) return;

    var panels = document.querySelectorAll("#settings-right .settings-panel"),
      items = document.querySelectorAll("#settings-menu .settings-item"),
      i;

    for (i = 0; i < panels.length; i++) panels[i].classList.remove("is-active");
    panel.classList.add("is-active");

    for (i = 0; i < items.length; i++) {
      items[i].classList.toggle("is-selected", isServerItem(items[i]));
    }
  }

  function buildServerPanel() {
    var panel = document.createElement("div");
    panel.className = "settings-panel xr-server-panel";

    panel.innerHTML =
      '<div class="sp-title">Servidor</div>' +
      '<div class="sp-hr"></div>' +
      '<div class="xr-settings-note">Direccion del relay XuperTV en tu PC o Raspberry (API, puerto 8910).</div>' +
      '<div class="pb-row xr-server-row">' +
      '<div class="pb-label">Servidor</div>' +
      '<input class="xr-input focusable xr-server-input" type="text" inputmode="url" spellcheck="false" autocomplete="off" autocapitalize="off" />' +
      "</div>" +
      '<div class="pb-row xr-server-actions">' +
      '<div class="pb-opt focusable xr-server-test">Probar</div>' +
      '<div class="pb-opt focusable xr-server-save">Guardar</div>' +
      "</div>" +
      '<div class="xr-settings-status"></div>';

    var input = panel.querySelector(".xr-server-input"),
      test = panel.querySelector(".xr-server-test"),
      save = panel.querySelector(".xr-server-save"),
      status = panel.querySelector(".xr-settings-status");

    input.value = currentUrl();

    function setPanelStatus(text, kind) {
      status.textContent = text || "";
      status.className = "xr-settings-status" + (kind ? " is-" + kind : "");
    }

    input._activate = function () {
      try {
        input.focus();
        input.select();
      } catch (e) {}
    };

    test._activate = function () {
      var url = normalizeUrl(input.value);
      if (!url) return setPanelStatus("Escribe la direccion del relay.", "err");
      setPanelStatus("Probando " + url + " ...", "");
      ping(url, function (ok, data, error) {
        if (ok) {
          var version = data && data.version ? " (v" + data.version + ")" : "";
          setPanelStatus("Conectado al relay XuperTV" + version, "ok");
        } else {
          setPanelStatus("No se pudo conectar: " + (error || "revisa la IP y el relay"), "err");
        }
      });
    };

    save._activate = function () {
      var url = normalizeUrl(input.value);
      if (!url) return setPanelStatus("Escribe la direccion del relay.", "err");
      setPanelStatus("Probando " + url + " ...", "");
      ping(url, function (ok, data, error) {
        if (!ok) return setPanelStatus("No se pudo conectar: " + (error || "revisa la IP y el relay"), "err");
        persistUrl(url);
        setPanelStatus("Guardado. Recargando...", "ok");
        setTimeout(function () {
          window.location.reload();
        }, 400);
      });
    };

    return panel;
  }

  function wrapOtherItems(menu) {
    var items = menu.querySelectorAll(".settings-item"),
      i;
    for (i = 0; i < items.length; i++) {
      (function (item) {
        if (isServerItem(item)) return;

        var prevFocus = item._onFocus,
          prevActivate = item._activate;

        item._onFocus = function () {
          hideServerPanel();
          if (prevFocus) prevFocus.call(this);
        };

        item._activate = function () {
          hideServerPanel();
          if (prevActivate) return prevActivate.apply(this, arguments);
        };
      })(items[i]);
    }
  }

  function injectSettings() {
    var menu = document.getElementById("settings-menu"),
      right = document.getElementById("settings-right");
    if (!menu || !right) return;

    var item = menu.querySelector(".xr-settings-item");
    if (!item) {
      item = document.createElement("div");
      item.className = "settings-item focusable xr-settings-item";
      item.innerHTML =
        '<span class="settings-icon">' + SERVER_ICON + "</span>" +
        '<span class="settings-label">Servidor</span>';
      item._index = 99;
      item._activate = function () {
        activateServerPanel();
      };
      item._onMove = function (direction) {
        if (direction === "right") {
          var panel = document.querySelector(".xr-server-panel");
          var target = panel && panel.querySelector(".focusable");
          // El sistema de foco de la app hara el movimiento espacial;
          // solo aseguramos que el panel este visible.
          activateServerPanel();
          return false;
        }
        return false;
      };
      menu.appendChild(item);
    }

    wrapOtherItems(menu);

    if (!right.querySelector(".xr-server-panel")) {
      right.appendChild(buildServerPanel());
    }
  }

  function watchSettings() {
    var menu = document.getElementById("settings-menu"),
      right = document.getElementById("settings-right");
    if (!menu || !right) return;

    if (typeof MutationObserver !== "undefined") {
      var observer = new MutationObserver(function () {
        injectSettings();
      });
      observer.observe(menu, { childList: true });
      observer.observe(right, { childList: true });
    }

    // Respaldo por si el observer no esta disponible.
    setInterval(injectSettings, 1500);
  }

  /* ---------------------------------------------------------------- */
  /* Teclado Tizen                                                     */
  /* ---------------------------------------------------------------- */

  function isTextField(el) {
    return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
  }

  function exitApp() {
    try {
      if (typeof history !== "undefined" && history.length > 1) {
        history.back();
        return;
      }
    } catch (e) {}
    try {
      if (isTizen && tizen.application) {
        tizen.application.getCurrentApplication().exit();
        return;
      }
    } catch (e) {}
    try {
      window.location.href = "http://127.0.0.1:8081/tizenbrew-ui/dist/index.html";
    } catch (e) {}
  }

  function synthBack() {
    var event;
    try {
      event = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Back",
        keyCode: 461,
        which: 461
      });
    } catch (e) {
      event = document.createEvent("Event");
      event.initEvent("keydown", true, true);
    }
    try {
      Object.defineProperty(event, "keyCode", { get: function () { return 461; } });
      Object.defineProperty(event, "which", { get: function () { return 461; } });
    } catch (e) {}
    event.__xuperMapped = true;
    document.dispatchEvent(event);
  }

  function onKeyDown(event) {
    if (event.__xuperMapped) return;

    var code = event.keyCode || event.which || 0;

    // Exit de Tizen: cerrar la app.
    if (code === 10182) {
      event.preventDefault();
      event.stopPropagation();
      exitApp();
      return;
    }

    // Back de Tizen.
    if (code === 10009) {
      if (overlayVisible) {
        event.preventDefault();
        event.stopPropagation();
        if (storedUrl()) hideOverlay();
        else setStatus("Configura el servidor para continuar.", "err");
        return;
      }
      if (isTextField(document.activeElement)) {
        try {
          document.activeElement.blur();
        } catch (e) {}
      }
      // Si estamos en la pantalla principal en la primera pestana, salir/volver a TizenBrew
      if (window.__xuper && window.__xuper.state && window.__xuper.state.screen === "home" && window.__xuper.state.tab === 0) {
        event.preventDefault();
        event.stopPropagation();
        exitApp();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      synthBack();
      return;
    }

    // Overlay modal: navegacion propia.
    if (overlayVisible) {
      if (isTextField(document.activeElement)) {
        if (code === 38 || code === 40) {
          event.preventDefault();
          event.stopPropagation();
          moveOverlayFocus(code === 38 ? "up" : "down");
          return;
        }
        if (code === 27) {
          event.preventDefault();
          event.stopPropagation();
          hideOverlay();
          return;
        }
        return; // dejar escribir al input
      }

      event.preventDefault();
      event.stopPropagation();

      if (code === 38 || code === 40 || code === 37 || code === 39) {
        moveOverlayFocus(code === 38 || code === 37 ? "up" : "down");
        return;
      }
      if (code === 13 || code === 32) {
        var active = document.activeElement;
        if (active && active.click) active.click();
        return;
      }
      return;
    }

    // Input del panel "Servidor": aislar la app mientras se escribe.
    if (isTextField(document.activeElement)) {
      if (code === 27) {
        try {
          document.activeElement.blur();
        } catch (e) {}
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (code === 37 || code === 38 || code === 39 || code === 40) {
        // Salir del campo y devolver el control al foco de la app.
        try {
          document.activeElement.blur();
        } catch (e) {}
        return;
      }
      event.stopPropagation();
      return;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Teclas multimedia                                                 */
  /* ---------------------------------------------------------------- */

  function registerTvKeys() {
    if (!isTizen || !window.tizen || !tizen.tvinputdevice) return;
    var keys = ["MediaPlayPause", "MediaPlay", "MediaPause", "MediaStop", "MediaFastForward", "MediaRewind", "ChannelUp", "ChannelDown", "ChannelList", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (var i = 0; i < keys.length; i++) {
      try {
        tizen.tvinputdevice.registerKey(keys[i]);
      } catch (e) {}
    }
  }

  /* ---------------------------------------------------------------- */
  /* Arranque                                                          */
  /* ---------------------------------------------------------------- */

  function start() {
    buildOverlay();
    document.addEventListener("keydown", onKeyDown, true);
    registerTvKeys();
    watchSettings();

    setTimeout(function () {
      var url = currentUrl();
      waitForRelay(url, embeddedRelay ? 30 : 4, function (ok, error) {
        if (ok) {
          API.devServiceUrl = url;
          // Si el aviso llego a mostrarse, recargar para que la app vuelva a
          // pedir el catalogo con el relay ya disponible.
          if (overlayVisible) window.location.reload();
          else hideOverlay();
          return;
        }
        if (!embeddedRelay) {
          showOverlay("No se pudo conectar con " + url + (error ? " (" + error + ")" : ""));
          return;
        }
        showOverlay("Iniciando relay interno…");
        ensureEmbeddedService(function (started, serviceError) {
          if (!started) {
            showOverlay("No se pudo iniciar el relay interno: " + serviceError);
            return;
          }
          waitForRelay(url, 20, function (ok2, error2) {
            if (ok2) {
              API.devServiceUrl = url;
              window.location.reload();
            } else {
              showOverlay("Relay interno sin respuesta" + (error2 ? " (" + error2 + ")" : ""));
            }
          });
        });
      });
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, false);
  } else {
    start();
  }

  // API minima para depurar desde la consola o desde la app.
  window.__XUPER_RELAY__ = {
    show: showOverlay,
    hide: hideOverlay,
    ping: ping,
    url: currentUrl,
    save: persistUrl
  };
})();
