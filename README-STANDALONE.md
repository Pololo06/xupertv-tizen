# XuperTV Standalone 3.0.0

WGT independiente: UI web + servicio Tizen con el relay embebido. No necesita TizenBrew.

## Arquitectura

- UI: `index.html`, `js/app.js`, `js/tizen.js`.
- Servicio Tizen: `service/index.js` (relay en `127.0.0.1:8915`, proxy `8795`).
- La UI lanza el servicio con `tizen.application.launchAppControl` si `/ping` no responde.
- `service/index.js` se genera desde `xuper-relay-service.js`:

```bash
node tools/build-standalone-service.js
```

## Construir y firmar

Requisitos: Tizen Studio con un perfil de certificado Samsung TV.

```bash
# Desde la carpeta del proyecto standalone
tizen package -t wgt -s <PERFIL> -o build -- .
```

O con el empaquetador del proyecto principal:

```bash
cd XuperTV
TIZEN_DIR="/ruta/a/xupertv-standalone" BUILD_DIR="/ruta/a/xupertv-standalone/build" \
  bash tools/build.sh
```

Si el empaquetador genera el WGT sin firmar, fírmalo con Tizen Studio
(`Project > Build Signed Package`) antes de instalarlo.

## Instalar

```bash
tizen install -n XuperTV-3.0.0-tizen.wgt -t <TV>
```

o con sdb:

```bash
sdb connect <IP_TV>
sdb install XuperTV-3.0.0-tizen.wgt
```

## Matriz de compatibilidad

| TV | Año | Tizen | Web Engine | Notas |
|---|---|---|---|---|
| MU6120 | 2017 | 3.0 | Chromium M47 | Objetivo crítico. Sin async/await. Node del servicio 4.4.3. |
| QN70F | 2025 | 9.0 | Chromium M120 | Objetivo moderno. |

El servicio usa Node 4.4.3 en Tizen 3.0. El relay es ES5 y tiene fallbacks
para `Buffer.from`/`Buffer.alloc`.

## Puertos

- API: `127.0.0.1:8915`
- Proxy: `127.0.0.1:8795`
- Relay ffmpeg: `8790` (deshabilitado en TV)

No usa `8910`/`8788` para poder convivir con TizenBrew durante las pruebas.

## Diagnóstico

- `http://127.0.0.1:8915/ping`
- `http://127.0.0.1:8915/health`
- Overlay de error de `js/tizen.js` (window.onerror, unhandledrejection, recursos).
- El reloj de arranque espera hasta 20 s a que el servicio responda.

## Limitaciones conocidas

- El relay embebido no tiene ffmpeg: no hace upscaling 1080p/4K.
- Tizen 3.0 puede no soportar MSE HEVC; el camino nativo TS es el principal.
- Si el servicio no arranca en un modelo antiguo, usar relay en PC por LAN.
