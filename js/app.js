!function() {
  "use strict";
  function e(e,t,a) {
    var i=document.createElement(e);
    return t&&(i.className=t),null!=a&&(i.textContent=a),i
  }
  function t(e) {
    return document.getElementById(e)
  }
  function a(e) {
    for(;
    e.firstChild;
    )e.removeChild(e.firstChild)
  }
  function i(e,t,a,i,n) {
    return e.style.position="absolute",e.style.left=t+"px",e.style.top=a+"px",void 0!==i&&(e.style.width=i+"px"),void 0!==n&&(e.style.height=n+"px"),e
  }
  function n(e,t) {
    for(;
    e&&e!==document;
    ) {
      if(1===e.nodeType&&e.matches&&e.matches(t))return e;
      e=e.parentNode
    }
    return null
  }
  function r(e) {
    return e<10?"0"+e:""+e
  }
  function o(e) {
    return(e=String(e).toLowerCase()).normalize&&(e=e.normalize("NFD").replace(/[\u0300-\u036f]/g,"")),e
  }
  var s=["Acción","Drama","Comedia","Suspenso","Aventura","Animación","Familiar","Ciencia ficción"],l=[],d= {
    Destacado:"destacado","Película":"pelicula",Serie:"serie",Gratis:"gratis",Infantil:"infantil",UHD:"uhd",Extra:"extra"
  }
  ;
  function c(e,t,a) {
    for(var i=1;
    i<=t;
    i++) {
      var n=s[(a+i)%s.length],o=s[(a+i+3)%s.length];
      l.push( {
        id:l.length+1,title:e+" demo "+r(i),category:d[e]||"",score:(7.9+(a+i)%16/10).toFixed(1),year:2018+(a+i)%7,duration:1+(a+i)%2+" h "+(10+(7*a+5*i)%45)+" min",genres:n===o?[n]:[n,o],director:"Director demo "+r(i),actors:"Actor demo "+r(i)+", Actriz demo "+r(i+1),synopsis:"Sinopsis de demostración para "+e.toLowerCase()+" demo "+r(i)+'. Este texto sólo existe para comprobar el recorte a dos líneas, el interlineado y la sangría de la etiqueta "Sinopsis :" definidos en activity_voddetails.',kind:e.toLowerCase()
      }
      )
    }
  }
  c("Destacado",5,1),c("Película",7,2),c("Serie",7,3),c("Gratis",5,4),c("Infantil",8,5),c("UHD",4,6),c("Extra",4,7);
  var p=window.XUPERTV_API|| {
  }
  ,u=/[?&]service=([^&]+)/.exec(window.location.search||"");
  u&&(p.devServiceUrl=decodeURIComponent(u[1]));
  var v= {
    loading:!1,source:"demo",error:null
  }
  ,f= {
    refreshing:!1,lastSync:0,roots:0,error:null
  }
  ,h=["featured","movies","series","anime","kids","free"];
  function g(e) {
    if("[object Array]"===Object.prototype.toString.call(e))return e;
    if(!e)return[];
    for(var t=["items","movies","results","recommendList","movieList","totalMovieList","programList","data"],a=0;
    a<t.length;
    a++) {
      if("[object Array]"===Object.prototype.toString.call(e[t[a]]))return e[t[a]];
      if(e[t[a]]&&"object"==typeof e[t[a]]) {
        var i=g(e[t[a]]);
        if(i.length)return i
      }
    }
    return[]
  }
  function m(e) {
    var t=p[e+"Url"];
    if(t)return String(t);
    var a=String(p.baseUrl||"").replace(/\/$/,""),i=String(p[e+"Path"]||"");
    return a&&i?a+("/"===i.charAt(0)?i:"/"+i):""
  }
  function y() {
    var e=p.session|| {
    }
    ;
    return {
      userId:String(e.userId||""),userToken:String(e.userToken||""),portalCode:String(e.portalCode||""),homePageCode:String(e.homePageCode||""),version:String(e.version||"4.34.4")
    }
  }
  function b() {
    var e=y();
    return!!(e.userId&&e.userToken&&e.portalCode)
  }
  function C(e,t) {
    var a=y();
    return"catalog"===e? {
      userId:a.userId,userToken:a.userToken,portalCode:a.portalCode,homePageCode:a.homePageCode,version:a.version
    }
    :"search"===e? {
      userToken:a.userToken,userId:a.userId,portalCode:a.portalCode,columnId:"",value:t||"",type:"",pageSize:20,pageNum:1,filter:""
    }
    : {
      userToken:a.userToken,userId:a.userId,portalCode:a.portalCode,programId:t
    }
  }
  function w(e) {
    return e?(e=String(e),/^https?:\/\//i.test(e)||0===e.indexOf("data:")?e:p.imageBaseUrl?String(p.imageBaseUrl).replace(/\/$/,"")+"/"+e.replace(/^\//,""):e):""
  }
  function x(e,t) {
    return null==e||""===e?t:String(e)
  }
  function S(e) {
    return!!e&&("teleplay"===e.type||"series"===e.type||"serie"===e.kind||e.category&&-1!==e.category.indexOf("serie")||e.episodes&&e.episodes.length>0||e.seasons&&e.seasons.length>0||e.volumeCount&&parseInt(e.volumeCount,10)>1)
  }
  function _(e,t) {
    var a=(e=e|| {
    }
    ).genres||e.genre||[];
    "string"==typeof a&&(a=a.split(",")),"[object Array]"!==Object.prototype.toString.call(a)&&(a=[]);
    for(var i=[],n=0;
    n<a.length;
    n++)i.push("string"==typeof a[n]?a[n]:a[n].name||"");
    var r=e.duration||e.runtime||e.runtimeMinutes||"";
    "number"==typeof r&&(r=Math.floor(r/60)+" h "+r%60+" min");
    var s=x(e.type||e.programType,""),l="teleplay"===s||"series"===s||"serie"===o(x(e.kind||"",""))||-1!==o(x(e.category||"","")).indexOf("serie")||e.episodes&&e.episodes.length>0||e.seasons&&e.seasons.length>0||e.volumeCount&&parseInt(e.volumeCount,10)>1||e.volumnCount&&parseInt(e.volumnCount,10)>1;
    return {
      id:x(e.id||e.vodId||e.programId||e.program_id||e.tmdb_id,"api-"+t),title:x(e.title||e.name||e.programName||e.programTitle||e.original_title,"Sin título"),category:o(x(e.category||e.section||e.collection||e.homeSection,"")),score:x(e.score||e.vote_average||e.rating||e.movieRate||e.programScore,"—"),year:x(e.year||e.release_year||e.programYear||(e.releaseDate||e.releaseTime||e.release_date||"").slice(0,4),"—"),duration:x(r,"—"),genres:i.length?i:["Sin clasificar"],director:x(e.director,"—"),actors:x(e.actors||e.actorDisplay||e.cast,"—"),synopsis:x(e.synopsis||e.overview||e.description||e.programUpdateContent,"Sin sinopsis disponible."),kind:l?"serie":x(e.kind||e.media_type,"película"),poster:w(e.posterUrl||e.poster_url||e.poster||e.poster_path||e.image||e.imageUrl||e.cover||e.coverUrl||e.programPoster||e.programImage),landscape:w(e.landscapeUrl||e.landscape_url||e.landscape||e.wideImage||e.bannerImage),backdrop:w(e.backdropUrl||e.backdrop_url||e.backdrop||e.backdrop_path),streamUrl:e.streamUrl||e.stream_url||"",type:s||(l?"teleplay":"movie"),row:x(e.row,""),alias:x(e.alias,""),country:x(e.country||e.originalCountry,""),releaseDate:x(e.releaseDate||e.releaseTime,""),tagline:x(e.tagline||e.viewPoint,""),volumeCount:parseInt(e.volumeCount||e.volumnCount,10)||0,updateCount:parseInt(e.updateCount,10)||0,episodes:e.episodes||[],seasons:e.seasons||[],moreAudio:void 0!==e.moreAudio?e.moreAudio:0,moreSubtitle:void 0!==e.moreSubtitle?e.moreSubtitle:0,_portal:!0===e.portal||!0===e._portal||p&&"portal"===p.mode&&String(e.id||"").length>10
    }
  }
  function k(e,t,a) {
    a=a|| {
    }
    ;
    var i=new XMLHttpRequest,n=!1,r=parseInt(p.timeoutMs,10)||1e4;
    function o(e,a) {
      n||(n=!0,t(e,a))
    }
    i.open(a.method||"GET",e,!0),i.timeout=r;
    var s=p.headers|| {
    }
    ;
    for(var l in s)Object.prototype.hasOwnProperty.call(s,l)&&i.setRequestHeader(l,s[l]);
    void 0===a.body||s["Content-Type"]||s["content-type"]||i.setRequestHeader("Content-Type","application/json;charset=utf-8"),i.onreadystatechange=function() {
      if(4===i.readyState)if(i.status<200||i.status>=300)o("HTTP "+i.status);
      else try {
        o(null,JSON.parse(i.responseText))
      }
      catch(e) {
        o("La API no devolvió JSON válido")
      }
    }
    ,i.onerror=function() {
      o("Error de red o CORS")
    }
    ,i.ontimeout=function() {
      o("Tiempo de espera agotado")
    }
    ;
    try {
      i.send(void 0===a.body?null:JSON.stringify(a.body))
    }
    catch(e) {
      o(e.message||"No se pudo iniciar la petición")
    }
  }
  function L(e) {
    if(!e||!S(e))return null;
    var t=String(e.title||e.alias||"").replace(/\s+/g," ").replace(/^\s+|\s+$/g,""),a=/^(.*?)(?:\s*[-–:|]?\s*(?:temporada|season)\s*(\d+)|\s*[-–:|]?\s*[st]\s*0?(\d+))\s*$/i.exec(t);
    if(!a||!a[1])return null;
    var i=parseInt(a[2]||a[3],10);
    return!i||i>99?null: {
      title:a[1].replace(/\s+$/,""),number:i
    }
  }
  function M(e,a,i) {
    if(!e.length)return!1;
    for(var r= {
    }
    ,s=0;
    s<l.length;
    s++)r[String(l[s].id)]=l[s];
    l.splice(0,l.length);
    for(var d=[],c=0;
    c<e.length;
    c++) {
      var p=_(e[c],c+1);
      i&&!1!==e[c].portal&&(p._portal=!0);
      var u=r[String(p.id)];
      u&&(u.episodes&&(p.episodes=u.episodes),u.seasons&&(p.seasons=u.seasons),u._detailsLoaded&&(p._detailsLoaded=!0),!p.streamUrl&&u.streamUrl&&(p.streamUrl=u.streamUrl)),d.push(p)
    }
    for(var f=function(e) {
      for(var t= {
      }
      ,a=[],i=0;
      i<e.length;
      i++) {
        var n=L(e[i]);
        n?(t[r=o(n.title)]||(t[r]= {
          title:n.title,items:[]
        }
        ),t[r].items.push( {
          item:e[i],number:n.number
        }
        )):a.push(e[i])
      }
      for(var r in t)if(t.hasOwnProperty(r)) {
        var s=t[r];
        if(s.items.length<2)a.push(s.items[0].item);
        else {
          s.items.sort(function(e,t) {
            return e.number-t.number
          }
          );
          var l=s.items[0].item,d= {
          }
          ;
          l._catalogSeasons=[],l._seriesGroup=!0,l._seriesTitle=s.title,l.title=s.title,l.alias=s.title,l.seasons=[];
          for(var c=0;
          c<s.items.length;
          c++) {
            for(var p=s.items[c],u=String(p.item.category||"").split(","),v=0;
            v<u.length;
            v++)u[v]&&(d[u[v]]=!0);
            var f= {
              id:p.item.id,number:p.number,title:s.title
            }
            ;
            l._catalogSeasons.push(f),l.seasons.push(f)
          }
          l.category=Object.keys(d).join(","),a.push(l)
        }
      }
      return a
    }
    (d),h=0;
    h<f.length;
    h++)l.push(f[h]);
    if($.detail) {
      for(var g=!1,m=0;
      m<l.length;
      m++)if(String(l[m].id)===String($.detail.id)) {
        $.detail=l[m],g=!0;
        break
      }
      g||($.detail=l[0])
    }
    return v.source=a,v.error=null,function() {
      if(Re) {
        var e=t("home-tabs"),a=!(!e||!e.classList.contains("is-expanded")||e.classList.contains("is-collapsed")),i=!(!$.focus||void 0===$.focus._tab),r=!(!$.focus||!n($.focus,"#home-notify")),o=!(!$.focus||!n($.focus,".home-page"));
        if(He=[],Ue=[],ht(),mt($.tab,!1),"home"===$.screen) {
          if(i&&Ue[$.tab])it(Ue[$.tab],!0);
          else if(r) {
            var s=nt(t("home-notify"));
            s&&it(s,!0)
          }
          else if(o) {
            var l=He[z[$.tab].page],d=l?nt(l):null;
            d&&it(d,!0)
          }
          if(a&&e) {
            e.classList.add("is-expanded"),e.classList.remove("is-collapsed");
            var c=document.querySelector(".home-sidebar-bg");
            c&&c.classList.add("is-on")
          }
        }
      }
      ce&&(la(),$.searchQuery&&ga());
      $.detail&&ia($.detail)
    }
    (),!0
  }
  function I() {
    var e=window.XUPERTV_CATALOG;
    return e?g(e):[]
  }
  function T() {
    return!window.PalmServiceBridge||window.webOS&&window.webOS.service||(window.webOS=window.webOS|| {
    }
    ,window.webOS.service= {
      request:function(e,t) {
        t=t|| {
        }
        ;
        var a=new window.PalmServiceBridge;
        a.onservicecallback=function(e) {
          var a;
          try {
            a=JSON.parse(e)
          }
          catch(t) {
            a= {
              returnValue:!1,errorText:e
            }
          }
          !1===a.returnValue?t.onFailure&&t.onFailure(a):t.onSuccess&&t.onSuccess(a)
        }
        ;
        var i=t.method?e.replace(/\/$/,"")+"/"+t.method:e;
        return a.call(i,JSON.stringify(t.parameters|| {
        }
        )),a
      }
    }
    ),!!(window.webOS&&window.webOS.service&&window.webOS.service.request)
  }
  var E="La TV tiene bloqueado el servicio de XuperTV. Desenchufa la TV 10 segundos y vuelve a abrir la app; si sigue igual, reinstala con el instalador.";
  var q= {
    live:null,vod:null
  }
  ;
  function D(e,t) {
    try {
      if(!t)return;
      var a=t.url||"";
      if(!/^https?:\/\//i.test(a))return;
      if(/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/i.test(a))return;
      q[e]= {
        url:a,headers:t.headers|| {
        }
      }
    }
    catch(e) {
    }
  }
  function O(e,t,a,i) {
    var n=p.serviceId||"com.webosflux.xuptertv.fidelity.service",r=!1;
    function o(e,t) {
      var i,n;
      r||(r=!0,a(e?(i=e,n=String(null==i?"":i),/denied|permission|not permitted/i.test(n)?E+" ("+n+")":n):e,t))
    }
    if(T()&&window.PalmServiceBridge)try {
      return window.webOS.service.request("luna://"+n, {
        method:e,parameters:t|| {
        }
        ,timeout:i||parseInt(p.timeoutMs,10)||2e4,onSuccess:function(e) {
          o(null,e)
        }
        ,onFailure:function(e) {
          o(e&&e.errorText||"Error del servicio XuperTV",null)
        }
      }
      ),!0
    }
    catch(e) {
      if(!p.devServiceUrl)return o("Error comunicando con el servicio: "+(e.message||e),null),!1
    }
    return p.devServiceUrl?(k(String(p.devServiceUrl).replace(/\/$/,"")+"/"+e+"?"+function(e) {
      var t=[];
      for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.push(encodeURIComponent(a)+"="+encodeURIComponent(e[a]));
      return t.join("&")
    }
    (t|| {
    }
    ),function(e,t) {
      o(e,t)
    }
    ,null),!0):(o("El servicio XuperTV no está disponible",null),!1)
  }
  function N(e) {
    var t= {
    }
    ,a=[],i= {
    }
    ;
    function n(e) {
      if(e&&e.id) {
        var n=String(e.id);
        if(t[n]) {
          var r=t[n];
          for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&""!==e[o]&&"—"!==e[o]&&null!==e[o]&&void 0!==e[o]&&(r[o]=e[o])
        }
        else t[n]=e,a.push(n);
        var s=String(e.category||"").split(",");
        i[n]=i[n]|| {
        }
        ;
        for(var l=0;
        l<s.length;
        l++)s[l]&&(i[n][s[l]]=!0)
      }
    }
    for(var r=0;
    r<h.length;
    r++)for(var o=e[h[r]]||[],s=0;
    s<o.length;
    s++)o[s].portal=!0,n(o[s]);
    if(a.length) {
      for(var l=[],d=0;
      d<a.length;
      d++) {
        var c=t[a[d]];
        c.category=Object.keys(i[a[d]]).join(","),l.push(c)
      }
      for(var p=function() {
        for(var e=I(),t=[],a=0;
        a<e.length;
        a++)if(e[a]&&e[a].streamUrl) {
          var i= {
          }
          ;
          for(var n in e[a])Object.prototype.hasOwnProperty.call(e[a],n)&&(i[n]=e[a][n]);
          i.category="demo",i.portal=!1,t.push(i)
        }
        return t
      }
      (),u=0;
      u<p.length;
      u++)l.push(p[u]);
      l.length&&M(l,"portal",!0)
    }
  }
  function A() {
    if(!f.refreshing) {
      f.refreshing=!0,f.error=null;
      var e= {
      }
      ,t=0;
      !function a() {
        if(t>=h.length)return f.refreshing=!1,f.lastSync=Date.now(),void N(e);
        var i=h[t++];
        O("home", {
          root:i
        }
        ,function(t,n) {
          !t&&n&&!1!==n.returnValue&&n.items&&n.items.length?(e[i]=n.items,f.roots++):t&&(f.error=t),a()
        }
        )
      }
      ()
    }
  }
  function P() {
    var e,t=(e=window.XUPERTV_PORTAL)?g(e):[];
    t.length&&M(t,"portal-snapshot",!0),!1!==p.refresh?A():t.length||(v.error="Sin snapshot del portal")
  }
  function R(e,t) {
    return M(I(),e||"bundled")?(t&&(v.error=t),!0):(v.error=t||"No hay catálogo local ni remoto",!1)
  }
  function H() {
    if(p.enabled)if("portal"!==p.mode)if("static"!==p.mode) {
      var e=m("catalog");
      "xuper"!==p.mode||b()?e?(v.loading=!0,k(e,function(e,t) {
        v.loading=!1;
        var a=function(e) {
          if(!e||"object"!=typeof e)return"";
          var t=e.returnCode||e.code||e.errorCode||"",a=e.errorMessage||e.message||e.msg||"";
          return t||a?(t?String(t)+": ":"")+(a?String(a):"La API rechazó la petición"):""
        }
        (t);
        if(e||a||!M(g(t),"api")) {
          var i=e||a||"La API no devolvió películas";
          R("bundled-fallback",i)||(v.error=i)
        }
      }
      ,"xuper"===p.mode? {
        method:"POST",body:C("catalog")
      }
      :null)):p.useBundledCatalog?R("bundled",null):v.error="Falta baseUrl/catalogUrl del catálogo autorizado":v.error="Falta la sesión XuperTV (userId, userToken y portalCode)"
    }
    else R("bundled",null);
    else P()
  }
  function U(e,t) {
    var a=e&&e._seriesGroup?e.id:null,i=e&&e._seriesGroup?e._seriesTitle:null,n=_(t,e.id);
    for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&"—"!==n[r]&&""!==n[r]&&"Sin sinopsis disponible."!==n[r]&&(e[r]=n[r]);
    null!==a&&(e.id=a,e.title=i,e.alias=i,e.seasons=e._catalogSeasons||e.seasons)
  }
  function B(e,t) {
    if(t=t||function() {
    }
    ,!e)return t(null);
    if(e._detailsLoaded)return t(e);
    if(e._detailLoading)return e._detailWait=e._detailWait||[],void e._detailWait.push(t);
    if("portal"===p.mode&&e._portal)return e._detailLoading=!0,e._detailWait=[t],void O("detail", {
      contentId:e.id
    }
    ,function(t,a) {
      if(e._detailLoading=!1,!t&&a&&!1!==a.returnValue&&a.item) {
        if(U(e,a.item),e.episodes=a.episodes||[],e.seasons=e._catalogSeasons||a.seasons||[],e.seasonId||(e.seasonId=e.id),e.seasons&&e.seasons.length&&e.seasons.sort(function(e,t) {
          return(parseInt(e.number,10)||0)-(parseInt(t.number,10)||0)
        }
        ),(!e.seasons||!e.seasons.length)&&S(e)) {
          var i=1,n=/S(\d+)/i.exec(e.alias||"")||/T(\d+)/i.exec(e.title||"");
          n&&(i=parseInt(n[1],10)||1),e.seasons=[ {
            id:e.id,number:i
          }
          ]
        }
        if(e.seasons&&e.seasons.length) {
          for(var r=0,o=0;
          o<e.seasons.length;
          o++)if(e.seasons[o].id===e.id) {
            r=o;
            break
          }
          $.detailSeason=r
        }
        e.episodes&&e.episodes.length&&!$.detailEpisode&&($.detailEpisode=e.episodes[0]),zi(e),e._detailsLoaded=!0
      }
      var s=e._detailWait||[];
      e._detailWait=[];
      for(var l=0;
      l<s.length;
      l++)s[l](e);
      $.detail===e&&"detail"===$.screen&&(ia(e),Se&&Se.src&&!Se.paused||Cr(e,$.detailEpisode))
    }
    );
    var a=m("detail");
    return p.enabled&&a&&("xuper"!==p.mode||b())?(e._detailLoading=!0,void k(a.replace("{id}",encodeURIComponent(e.id)),function(a,i) {
      if(e._detailLoading=!1,!a) {
        var n=g(i),r=n.length?n[0]:i&&(i.item||i.movie||i);
        r&&"object"==typeof r&&(U(e,r),e._detailsLoaded=!0,$.detail===e&&"detail"===$.screen&&(ia(e),Se&&Se.src&&!Se.paused||Cr(e,$.detailEpisode)))
      }
      t(e)
    }
    ,"xuper"===p.mode? {
      method:"POST",body:C("detail",e.id)
    }
    :null)):t(e)
  }
  var F=[],V= {
    tv:'<svg viewBox="0 0 33 33"><rect x="3.5" y="7" width="26" height="17" rx="2.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M11 24.5v3h11v-3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',thumb:'<svg viewBox="0 0 33 33"><path d="M12 15.5V28H7.6A2.6 2.6 0 0 1 5 25.4v-7.3a2.6 2.6 0 0 1 2.6-2.6H12z" fill="currentColor"/><path d="M14 15.6l4.3-9.2a2.2 2.2 0 0 1 4 1.6V13h5.6a2.9 2.9 0 0 1 2.8 3.6l-2 9A3.4 3.4 0 0 1 25.4 28H14z" fill="currentColor"/></svg>',film:'<svg viewBox="0 0 33 33"><circle cx="16.5" cy="16.5" r="11.5" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="16.5" cy="16.5" r="2.4" fill="currentColor"/><circle cx="16.5" cy="9.5" r="2.1" fill="currentColor"/><circle cx="16.5" cy="23.5" r="2.1" fill="currentColor"/><circle cx="9.5" cy="16.5" r="2.1" fill="currentColor"/><circle cx="23.5" cy="16.5" r="2.1" fill="currentColor"/></svg>',strip:'<svg viewBox="0 0 33 33"><rect x="4" y="7" width="25" height="19" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M9 7v19M24 7v19" stroke="currentColor" stroke-width="1.8"/><rect x="5.6" y="9" width="2.4" height="2.6" fill="currentColor"/><rect x="5.6" y="15.2" width="2.4" height="2.6" fill="currentColor"/><rect x="5.6" y="21.4" width="2.4" height="2.6" fill="currentColor"/><rect x="25" y="9" width="2.4" height="2.6" fill="currentColor"/><rect x="25" y="15.2" width="2.4" height="2.6" fill="currentColor"/><rect x="25" y="21.4" width="2.4" height="2.6" fill="currentColor"/></svg>',kids:'<svg viewBox="0 0 33 33"><circle cx="8.6" cy="8.6" r="4" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="24.4" cy="8.6" r="4" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="16.5" cy="18" r="9.6" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="13" cy="17" r="1.5" fill="currentColor"/><circle cx="20" cy="17" r="1.5" fill="currentColor"/><ellipse cx="16.5" cy="21.6" rx="2.4" ry="1.7" fill="currentColor"/></svg>',anime:'<svg viewBox="0 0 33 33"><circle cx="8.5" cy="9" r="4.5" fill="currentColor"/><circle cx="24.5" cy="9" r="4.5" fill="currentColor"/><path d="M16.5 9c5.8 0 10.5 4.6 10.5 10.3 0 5.7-4.7 9.7-10.5 9.7S6 25 6 19.3C6 13.6 10.7 9 16.5 9z" fill="currentColor"/><circle cx="12.5" cy="18" r="1.6" fill="#0b0b0b"/><circle cx="20.5" cy="18" r="1.6" fill="#0b0b0b"/><ellipse cx="16.5" cy="23" rx="3" ry="2" fill="#0b0b0b"/></svg>',compass:'<svg viewBox="0 0 33 33"><circle cx="16.5" cy="16.5" r="11.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M22 11l-3.2 7.8L11 22l3.2-7.8z" fill="currentColor"/></svg>',novel:'<svg viewBox="0 0 33 33"><path d="M5 6.5h9.5c2.2 0 3.7 1 4.5 2.3.8-1.3 2.3-2.3 4.5-2.3H28v20h-5.5c-2.1 0-3.4.6-4.5 1.8-1.1-1.2-2.4-1.8-4.5-1.8H5z" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M18 9v19" stroke="currentColor" stroke-width="2.2"/></svg>',history:'<svg viewBox="0 0 33 33"><circle cx="16.5" cy="17" r="10.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16.5 10.5V17l5 3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M8 7v6h6" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>'
  }
  ,z=[ {
    label:"TV",page:0,icon:"tv"
  }
  , {
    label:"DESTACADOS",page:1,icon:"thumb"
  }
  , {
    label:"PELICULA",page:2,icon:"film"
  }
  , {
    label:"SERIES",page:3,icon:"strip"
  }
  , {
    label:"KIDS",page:4,icon:"kids"
  }
  , {
    label:"ANIME",page:5,icon:"anime"
  }
  , {
    label:"NOVELAS",page:6,icon:"novel"
  }
  , {
    label:"EXPLORAR",page:7,icon:"compass"
  }
  , {
    label:"HISTORIAL",page:-1,icon:"history",action:"history"
  }
  ],j=[ {
    id:"profile",label:"Mi cuenta"
  }
  , {
    id:"history",label:"Mi lista"
  }
  , {
    id:"share",label:"Compartir APP"
  }
  , {
    id:"parent",label:"Bloqueo"
  }
  , {
    id:"playback",label:"Configuración global"
  }
  , {
    id:"netdiag",label:"Diagnóstico"
  }
  , {
    id:"feedback",label:"Ayuda y Feedback"
  }
  , {
    id:"about",label:"Sobre nosotros"
  }
  ],W= {
    profile:'<svg viewBox="0 0 32 32"><circle cx="16" cy="10" r="5"/><path d="M6 27c.7-6 4.3-9 10-9s9.3 3 10 9"/></svg>',history:'<svg viewBox="0 0 32 32"><rect x="4" y="4" width="9" height="9"/><rect x="19" y="4" width="9" height="9"/><rect x="4" y="19" width="9" height="9"/><rect x="19" y="19" width="9" height="9"/></svg>',share:'<svg viewBox="0 0 32 32"><circle cx="8" cy="16" r="3"/><circle cx="24" cy="7" r="3"/><circle cx="24" cy="25" r="3"/><path d="M10.6 14.5l10.8-6M10.6 17.5l10.8 6"/></svg>',parent:'<svg viewBox="0 0 32 32"><rect x="7" y="14" width="18" height="14" rx="2"/><path d="M11 14V10a5 5 0 0 1 10 0v4"/><path d="M16 19v4"/></svg>',playback:'<svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" rx="3"/><path d="M13 11l8 5-8 5z"/></svg>',netdiag:'<svg viewBox="0 0 32 32"><path d="M3 13a19 19 0 0 1 26 0"/><path d="M8 18a12 12 0 0 1 16 0"/><path d="M13 23a6 6 0 0 1 6 0"/><circle cx="16" cy="27.5" r="1.2"/></svg>',feedback:'<svg viewBox="0 0 32 32"><path d="M6 4h15l5 5v19H6z"/><path d="M20 4v6h6M10 16h12M10 21h8"/></svg>',about:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12"/><path d="M16 14v8M16 10h.1"/></svg>'
  }
  ,$= {
    screen:"welcome",tab:0,channel:0,focus:null,detail:null,detailReturn:null,detailRange:0,detailSeason:0,detailNeedsRebuild:!1,playerReturn:null,playerMode:"live",playerItem:null,playerEpisode:null,playerSeasonIndex:0,episodeBrowserOpen:!1,categoryPickerOpen:!1,browserSeason:0,streamError:"",streamMode:"normal",trackIndex:0,channelsOpen:!1,infobar:!0,infoTimer:null,searchQuery:"",searchNumeric:!1,searchSeq:0,searchFocus:null,playback: {
      streamMode:"normal",screen:0,audio:0,subLang:0,size:0,style:0,subtitle:!0
    }
    ,crOn:!1,favs: {
    }
  }
  ,X="xuper_local_profile_v1",G="xuper_global_playback_v1",Q= {
    id:"",createdAt:0,history:[]
  }
  ;
  function J(e,t) {
    try {
      var a=localStorage.getItem(e);
      return a?JSON.parse(a):t
    }
    catch(e) {
      return t
    }
  }
  function K(e,t) {
    try {
      localStorage.setItem(e,JSON.stringify(t))
    }
    catch(e) {
    }
  }
  function Y() {
    K(G,$.playback)
  }
  function Z(e) {
    if(!e||!e.id)return!1;
    var t=String(e.id),a=!$.favs[t];
    return a?$.favs[t]=!0:delete $.favs[t],Q.favs=$.favs,K(X,Q),a
  }
  !function() {
    var e=J(G,null);
    if(e)for(var t in $.playback)$.playback.hasOwnProperty(t)&&void 0!==e[t]&&($.playback[t]=e[t]);
    // Migracion: versiones anteriores guardaban "smooth" por defecto, que
    // recodifica y pierde calidad. Una sola vez pasamos a "normal".
    if(e&&!e.normalDefaultMigrated) {
      $.playback.streamMode="normal",$.playback.normalDefaultMigrated=!0,K(G,$.playback)
    }
    var a=J(X,null);
    a&&a.id?(Q=a).history&&Q.history.length||(Q.history=[]):(Q.id="TV-"+String(Date.now()).slice(-8),Q.createdAt=Date.now(),K(X,Q)),Q.favs||(Q.favs= {
    }
    ),$.favs=Q.favs
  }
  ();
  var ee,te,ae,ie,ne,re,oe,se,le,de,ce,pe,ue,ve,fe,he,ge,me,ye,be,Ce,we,xe,Se,_e,ke,Le,Me,Ie,Te,Ee,qe,De,Oe,Ne,Ae,Pe,Re=!1,He=[],Ue=[],Be=[],Fe=[],Ve= {
  }
  ,ze=[],je="history",We= {
  }
  ,$e=null,Xe=null,Ge=null,Qe="",Je=48,Ke=!1,Ye=0,Ze=null;
  function et(e) {
    if(!e||!e.getBoundingClientRect)return!1;
    if(null===e.offsetParent)return!1;
    var t=e.getBoundingClientRect();
    if(t.width<1||t.height<1)return!1;
    if($.episodeBrowserOpen)return!!n(e,"#player-episodes");
    if($.categoryPickerOpen)return!!n(e,"#player-categories");
    if(Li)return!!n(e,"#dialog-playsettings");
    if(ki)return!!n(e,"#player-playsetting-view");
    var a=n(e,".home-page");
    if(a&&!a.classList.contains("is-current"))return!1;
    var i=n(e,".settings-panel");
    if(i&&!i.classList.contains("is-active"))return!1;
    var r=n(e,".search-hot");
    if(r&&r.classList.contains("is-hidden"))return!1;
    var o=n(e,".search-results");
    if(o&&!o.classList.contains("is-active"))return!1;
    var s=n(e,".player-channels");
    if(s&&!s.classList.contains("is-active"))return!1;
    var l=n(e,".player-infobar");
    return!(l&&!l.classList.contains("is-active"))
  }
  function tt() {
    for(var e=document.querySelectorAll(".focusable"),t=[],a=0;
    a<e.length;
    a++)et(e[a])&&t.push(e[a]);
    return t
  }
  function at(e) {
    for(var t=n(e,".scrollable");
    t;
    ) {
      var a=e.getBoundingClientRect(),i=t.getBoundingClientRect();
      a.top<i.top?t.scrollTop-=i.top-a.top+12:a.bottom>i.bottom&&(t.scrollTop+=a.bottom-i.bottom+12),t.scrollWidth>t.clientWidth+1&&(a.left<i.left?t.scrollLeft-=i.left-a.left+12:a.right>i.right&&(t.scrollLeft+=a.right-i.right+12)),t=n(t.parentNode,".scrollable")
    }
  }
  function it(e,a) {
    if(e)if($.focus!==e) {
      $.focus&&$.focus.classList.remove("is-focused"),$.focus=e,e.classList.add("is-focused"),e._onFocus&&e._onFocus(),mn();
      var i=t("home-tabs");
      if(i&&"home"===$.screen) {
        var r=n(e,".home-tabs");
        i.classList.toggle("is-expanded",!!r),i.classList.toggle("is-collapsed",!r);
        var o=document.querySelector(".home-sidebar-bg");
        o&&o.classList.toggle("is-on",!!r);
        var s=t("screen-home");
        s&&s.classList.toggle("is-rail-open",!!r)
      }
      a||at(e),bt()
    }
    else a||at(e)
  }
  function nt(e) {
    for(var t=e.querySelectorAll(".focusable"),a=0;
    a<t.length;
    a++)if(et(t[a]))return t[a];
    return null
  }
  function rt(e) {
    if($.focus) {
      if(!$.focus._onMove||!$.focus._onMove(e)) {
        for(var t="home"===$.screen&&n($.focus,".home-page"),a="home"===$.screen&&n($.focus,".home-tabs"),i=tt(),r=$.focus.getBoundingClientRect(),o=r.left+r.width/2,s=r.top+r.height/2,l=null,d=1e9,c=0;
        c<i.length;
        c++) {
          var p=i[c];
          if(p!==$.focus&&((!t||!n(p,".home-tabs"))&&(!a||n(p,".home-tabs")))) {
            var u,v,f,h=p.getBoundingClientRect(),g=h.left+h.width/2-o,m=h.top+h.height/2-s;
            if("left"===e) {
              if(g>-4)continue;
              u=Math.max(0,r.left-h.right),v=Math.abs(m),f=h.bottom>r.top+2&&h.top<r.bottom-2
            }
            else if("right"===e) {
              if(g<4)continue;
              u=Math.max(0,h.left-r.right),v=Math.abs(m),f=h.bottom>r.top+2&&h.top<r.bottom-2
            }
            else if("up"===e) {
              if(m>-4)continue;
              u=Math.max(0,r.top-h.bottom),v=Math.abs(g),f=h.right>r.left+2&&h.left<r.right-2
            }
            else {
              if(m<4)continue;
              u=Math.max(0,h.top-r.bottom),v=Math.abs(g),f=h.right>r.left+2&&h.left<r.right-2
            }
            var y=u+2*v+(f?0:320);
            y<d&&(d=y,l=p)
          }
        }
        l?it(l):"left"===e&&t&&Ue[$.tab]&&it(Ue[$.tab])
      }
    }
    else {
      var b=tt();
      b.length&&it(b[0])
    }
  }
  function ot(e) {
    for(var a=document.querySelectorAll(".screen"),i=0;
    i<a.length;
    i++)a[i].classList.remove("is-active");
    var n=t("screen-"+e);
    if(n&&n.classList.add("is-active"),$.screen=e,"player"!==e&&$.episodeBrowserOpen&&_n(!0),"player"!==e&&$.categoryPickerOpen&&Xn(!0),"player"!==e&&"detail"!==e) {
      Li&&Pn(),ki&&hn();
      var r=t("screen-player");
      r&&(r.classList.remove("is-mini"),r.classList.remove("is-active")),gr(),Oi++,Wi=[],_i&&(_i.innerHTML="")
    }
    bt()
  }
  var st=0,chanNum="",chanNumTimer=null;
  function channelZap(e) {
    if(!F.length)return;
    var t=Math.max(0,Math.min(F.length-1,e));
    Wt(t,"player"===$.screen&&"live"===$.playerMode),"player"===$.screen&&Xa()
  }
  function channelDigits(e) {
    chanNum+=String(e),chanNumTimer&&clearTimeout(chanNumTimer),chanNumTimer=setTimeout(function() {
      var e=parseInt(chanNum,10);
      chanNum="",chanNumTimer=null,e>0&&e<=F.length&&channelZap(e-1)
    }
    ,1200)
  }
  function toggleSynopsis(e) {
    var t=document.getElementById("screen-detail");
    if(!t)return;
    var a="boolean"==typeof e?e:!t.classList.contains("is-synopsis-open");
    t.classList.toggle("is-synopsis-open",a);
    var i=t.querySelector(".detail-more");
    i&&(i.textContent=a?"Menos":"Más")
  }
  function lt() {
    var e=Date.now();
    if(!(e-st<250))if(st=e,Li)Pn();
    else {
      if("player"===$.screen)return Ke?void vr(!1):$.categoryPickerOpen?(st=Date.now(),void Xn()):$.episodeBrowserOpen?(st=Date.now(),void _n()):ki?void hn():void($.channelsOpen?Tr():$.infobar?Ga():$.vodInfobarVisible?Ja():function() {
        Ga(),Ja();
        var e=$.playerReturn;
        if(e&&"detail"===e.screen) {
          var a=t("screen-player"),i=t("screen-detail");
          a&&(a.classList.add("is-mini"),a.classList.add("is-active")),i&&i.classList.add("is-active"),$.screen="detail";
          var n=!1;
          if($.detailNeedsRebuild&&$.detail) {
            $.detailNeedsRebuild=!1,ia($.detail),n=!0;
            var r=de?de.querySelector(".detail-season"):null;
            r&&it(r)
          }
          else $.detail&&qn($.detail);
          if(!n)if(e.focus&&et(e.focus))it(e.focus);
          else {
            var o=le?le.querySelector(".focusable"):null;
            o&&it(o)
          }
        }
        else {
          gr();
          var s=t("screen-player");
          s&&(s.classList.remove("is-mini"),s.classList.remove("is-active")),e&&"search"===e.screen?(ot("search"),it(e.focus)):(ot("home"),mt($.tab,!1),e&&e.focus&&et(e.focus)?it(e.focus):Ue[$.tab]&&it(Ue[$.tab]))
        }
      }
      ());
      if("detail"!==$.screen) {
        if("search"===$.screen)return ha(),ot("home"),mt($.tab,!1),void(Ue[$.tab]&&it(Ue[$.tab]));
        if("settings"===$.screen)return ot("home"),mt($.tab,!1),void(Ue[$.tab]&&it(Ue[$.tab]));
        if("home"===$.screen) {
          if(0!==$.tab)return mt(0,!0),void(Ue[0]&&it(Ue[0]));
          window.webOSTV&&window.webOSTV.platformBack?window.webOSTV.platformBack():window.PalmSystem&&window.PalmSystem.platformBack&&window.PalmSystem.platformBack()
        }
      }
      else {
        if(oa) {
          sa();
          var a=de?de.querySelector(".detail-season"):null;
          return void(a&&it(a))
        }
        var i=t("screen-detail");
        if(i&&i.classList.contains("is-synopsis-open"))return void toggleSynopsis();
        gr();
        var n=t("screen-player");
        n&&(n.classList.remove("is-mini"),n.classList.remove("is-active"));
        var r=$.detailReturn;
        r&&"search"===r.screen?(ot("search"),it(r.focus)):(ot("home"),mt($.tab,!1),r&&r.focus&&et(r.focus)?it(r.focus):Ue[$.tab]&&it(Ue[$.tab]))
      }
    }
  }
  function dt() {
    $.focus&&$.focus._activate&&$.focus._activate()
  }
  function ct(e) {
    var t=e.keyCode||e.which,a=e.key||"",i=!0;
    if(461===t||27===t||8===t||"Back"===a||"GoBack"===a||"Escape"===a)return $.categoryPickerOpen?(Xn(),e.preventDefault&&e.preventDefault(),void(e.stopPropagation&&e.stopPropagation())):$.episodeBrowserOpen?(_n(),e.preventDefault&&e.preventDefault(),void(e.stopPropagation&&e.stopPropagation())):Rt?(st=Date.now(),Xt(),e.preventDefault&&e.preventDefault(),void(e.stopPropagation&&e.stopPropagation())):Li?(st=Date.now(),Pn(),e.preventDefault&&e.preventDefault(),void(e.stopPropagation&&e.stopPropagation())):ki?(st=Date.now(),hn(),e.preventDefault&&e.preventDefault(),void(e.stopPropagation&&e.stopPropagation())):(lt(),e.preventDefault&&e.preventDefault(),void(e.stopPropagation&&e.stopPropagation()));
    // Mando Samsung: ChannelUp/ChannelDown/ChannelList y digitos 0-9.
    if(427===t||428===t) {
      return("player"===$.screen&&"live"===$.playerMode||"home"===$.screen&&0===$.tab)&&channelZap($.channel+(428===t?1:-1)),void(e.preventDefault&&e.preventDefault())
    }
    if(10073===t) {
      return"player"===$.screen&&"live"===$.playerMode&&Tr(),"home"===$.screen&&0===$.tab&&Be.length&&it(Be[Math.max(0,Math.min(Be.length-1,$.channel))]||Be[0]),void(e.preventDefault&&e.preventDefault())
    }
    if(t>=48&&t<=57&&("player"===$.screen&&"live"===$.playerMode||"home"===$.screen&&0===$.tab)) {
      return channelDigits(t-48),void(e.preventDefault&&e.preventDefault())
    }
    if($.categoryPickerOpen)return 37===t?rt("left"):38===t?rt("up"):39===t?rt("right"):40===t?rt("down"):13===t||32===t?dt():i=!1,void(i&&e.preventDefault&&e.preventDefault());
    if($.episodeBrowserOpen) {
      var r=n($.focus,"#pe-seasons"),o=n($.focus,"#pe-episodes");
      if(37===t) {
        if(o&&ui&&"none"!==ui.style.display) {
          var s=pi?pi.children[$.browserSeason]||nt(pi):null;
          s&&it(s)
        }
      }
      else if(39===t) {
        if(r) {
          var l=vi?vi.querySelector(".pe-ep.is-current")||nt(vi):null;
          l&&it(l)
        }
      }
      else 38===t?rt("up"):40===t?rt("down"):13===t||32===t?dt():i=!1;
      i&&e.preventDefault&&e.preventDefault()
    }
    else {
      var d=415===t||"MediaPlay"===a||"Play"===a,c=19===t||"MediaPause"===a||"Pause"===a,p=10252===t||"MediaPlayPause"===a,u=417===t||"MediaFastForward"===a||"FastForward"===a,v=412===t||"MediaRewind"===a||"Rewind"===a,f=413===t||"MediaStop"===a||"Stop"===a;
      if("player"===$.screen) {
        if(d) {
          if(Se&&Se.paused) {
            try {
              Se.play()
            }
            catch(e) {
            }
            za("none"),Xa()
          }
          return void(e.preventDefault&&e.preventDefault())
        }
        if(c) {
          if(Se&&!Se.paused) {
            try {
              Se.pause()
            }
            catch(e) {
            }
            za("pause"),Xa()
          }
          return void(e.preventDefault&&e.preventDefault())
        }
        if(p)return Wa(),void(e.preventDefault&&e.preventDefault());
        if(u)return ja(15),void(e.preventDefault&&e.preventDefault());
        if(v)return ja(-15),void(e.preventDefault&&e.preventDefault());
        if(f)return lt(),void(e.preventDefault&&e.preventDefault())
      }
      var h=457===t||93===t||467===t||"Menu"===a||"ContextMenu"===a;
      if("player"===$.screen&&"vod"===$.playerMode&&h)return Li?Pn():ki?hn():fn(),void(e.preventDefault&&e.preventDefault());
      if("player"===$.screen&&(37===t||38===t||39===t||40===t)) {
        if(Li)return 37===t?rt("left"):38===t?rt("up"):39===t?rt("right"):40===t&&rt("down"),void(e.preventDefault&&e.preventDefault());
        if(ki)return vn(),37===t?rt("left"):38===t?rt("up"):39===t?rt("right"):40===t&&rt("down"),void(e.preventDefault&&e.preventDefault());
        if("vod"===$.playerMode) {
          if($.focus===De&&Ke) {
            if(37===t)return hr(-1),void(e.preventDefault&&e.preventDefault());
            if(39===t)return hr(1),void(e.preventDefault&&e.preventDefault());
            if(38===t||40===t)return vr(!1),void(e.preventDefault&&e.preventDefault())
          }
          if(37===t)return ja(-10),void(e.preventDefault&&e.preventDefault());
          if(39===t)return ja(10),void(e.preventDefault&&e.preventDefault());
          if(40===t)return fn(),void(e.preventDefault&&e.preventDefault());
          if(38===t)return fr(),void(e.preventDefault&&e.preventDefault())
        }
        else {
          var g=$.focus&&n($.focus,".player-channels");
          if($.channelsOpen||g) {
            if($.focus&&$.focus.classList&&$.focus.classList.contains("pc-cat-pill"))return 37===t?rt("left"):38===t?rt("up"):39===t?rt("right"):40===t&&rt("down"),void(e.preventDefault&&e.preventDefault());
            if(38===t) {
              if(0===(y=$.focus&&void 0!==$.focus._channel?$.focus._channel:$.channel)) {
                var m=xe?xe.querySelector(".pc-cat-pill.is-selected")||xe.querySelector(".pc-cat-pill"):null;
                m&&it(m)
              }
              else {
                Qn(y-1)
              }
              return void(e.preventDefault&&e.preventDefault())
            }
            if(40===t) {
              var y=$.focus&&void 0!==$.focus._channel?$.focus._channel:$.channel;
              return Qn(Math.min(F.length-1,y+1)),void(e.preventDefault&&e.preventDefault())
            }
            if(39===t)return Tr(),void(e.preventDefault&&e.preventDefault())
          }
          else {
            if(38===t)return $.channel>0?Wt($.channel-1,!1):F.length&&Wt(F.length-1,!1),Xa(),void(e.preventDefault&&e.preventDefault());
            if(40===t)return $.channel<F.length-1?Wt($.channel+1,!1):F.length&&Wt(0,!1),Xa(),void(e.preventDefault&&e.preventDefault());
            if(37===t)return Ir(),void(e.preventDefault&&e.preventDefault());
            $.infobar?$a():Xa()
          }
        }
      }
      if(37===t)rt("left");
      else if(38===t)rt("up");
      else if(39===t)rt("right");
      else if(40===t)rt("down");
      else if(13===t||32===t) {
        if($.episodeBrowserOpen)return void dt();
        if(Li)dt();
        else if(ki)vn(),dt();
        else if("player"===$.screen&&"vod"===$.playerMode&&$.focus===De&&Ke)vr(!0);
        else if("player"===$.screen&&$.streamError&&Se&&Se.src&&!n($.focus,".player-channels")) {
          var b=Se.play();
          b&&b.catch&&b.catch(function() {
          }
          ),$.streamError="",mr("")
        }
        else"player"===$.screen&&"vod"===$.playerMode?Wa():dt()
      }
      else i=!1;
      i&&e.preventDefault&&e.preventDefault()
    }
  }
  function pt() {
    Ze&&(clearInterval(Ze),Ze=null),Re||ht(),ot("home"),mt(0,!1),it(ne);
    var e=t("home-tabs");
    e&&(e.classList.add("is-expanded"),e.classList.remove("is-collapsed"));
    var a=document.querySelector(".home-sidebar-bg");
    a&&a.classList.add("is-on");
    var i=t("screen-home");
    i&&i.classList.add("is-rail-open")
  }
  var ut=[function(t) {
    ie=e("div","live-main"),(Dt=document.createElement("video")).className="live-preview-video",Dt.preload="auto",Dt.muted=!0,Dt.volume=0,Dt.setAttribute("muted","muted"),Dt.setAttribute("playsinline",""),Dt.setAttribute("webkit-playsinline",""),ie.appendChild(Dt),ie.appendChild(e("div","live-frame")),ie.appendChild(e("div","live-logo")),Ot=e("div","live-preview-status"),ie.appendChild(Ot),t.appendChild(ie);
    var a=e("div","live-info");
    (ae=e("div","live-channel")).style.right="112.5px",a.appendChild(ae);
    var i=e("div","live-fullscreen");
    i._activate=function() {
      xr("live")
    }
    ,a.appendChild(i),ie.appendChild(a);
    var n=e("div","live-arrow-up"),r=e("div","live-arrow-down");
    t.appendChild(n),t.appendChild(r),re=e("div","live-list scrollable"),t.appendChild(re),zt(!1),Vt(),(ne=e("div","live-focus focusable"))._onMove=function(e) {
      if("up"===e)return $.channel>0&&Wt($.channel-1),!0;
      if("down"===e)return $.channel<F.length-1&&Wt($.channel+1),!0;
      if("right"===e) {
        var t=Be.filter(function(e) {
          return e._channel===$.channel
        }
        )[0];
        return t?it(t):Be.length&&it(Be[0]),!0
      }
      return"left"===e&&(Ue[0]&&it(Ue[0]),!0)
    }
    ,ne._activate=function() {
      xr("live")
    }
    ,t.appendChild(ne)
  }
  ,function(e) {
    var t=ea("destacado"),a=t.slice(0,6),i=!(!a[0]||!a[0]._portal);
    Zt(e,a, {
      titles:i,dots:i?4:0,shade:i
    }
    );
    var n=t.slice(6);
    n.length&&ta(e,n,860,"Títulos destacados")
  }
  ,function(e) {
    var t=ea("pelicula"),a=t.slice(0,6),i=!(!a[0]||!a[0]._portal);
    Zt(e,a, {
      titles:i,dots:i?4:0,shade:i
    }
    );
    var n=t.slice(6);
    n.length&&ta(e,n,860,"Más películas")
  }
  ,function(e) {
    var t=ea("serie"),a=t.slice(0,6),i=!(!a[0]||!a[0]._portal);
    Zt(e,a, {
      titles:i,dots:i?3:2,shade:i
    }
    );
    var n=t.slice(6);
    n.length&&ta(e,n,860,"Más series")
  }
  ,function(t) {
    var a=function(e,t,a) {
      var i,n=[];
      if(e)for(i=0;
      i<l.length;
      i++)-1!==o(l[i].category||"").split(",").indexOf(e)&&n.push(l[i]);
      if(n.length||(n=l.slice(a,a+t)),n.length||(n=l.slice(0,t)),n.length<t&&l.length) {
        var r= {
        }
        ;
        for(i=0;
        i<n.length;
        i++)r[String(n[i].id)]=!0;
        for(var s=0;
        n.length<t&&s<2*l.length;
        ) {
          var d=l[s%l.length];
          s++,r[String(d.id)]||(n.push(d),r[String(d.id)]=!0)
        }
      }
      return n
    }
    ("infantil",12,0);
    a.length||(a=l);
    var n=!(!a[0]||!a[0]._portal);
    t.appendChild(Kt(a[0],192,38.5,831,534, {
      shade:!0,title:n
    }
    ));
    for(var r=[[1029,38.5],[1446,38.5],[1029,269.5],[1446,269.5]],s=0;
    s<r.length;
    s++)t.appendChild(Kt(a[(s+1)%a.length],r[s][0],r[s][1],413,222, {
    }
    ));
    if(t.appendChild(Yt(833,468.5,4,0)),a[0]) {
      var d=e("div","kids-subtitle",a[0].tagline||a[0].title);
      i(d,192,526.5,1249,40),t.appendChild(d)
    }
    var c=e("div","poster-row");
    i(c,192,578.5,1920,310);
    for(var p=0;
    p<7;
    p++) {
      var u=a[p%a.length];
      if(!u)break;
      c.appendChild(wt(u,266*p,0,266,310, {
        gold:!0
      }
      ))
    }
    t.appendChild(c)
  }
  ,function(e) {
    var t=ea("anime"),a=t.slice(0,6),i=!(!a[0]||!a[0]._portal);
    Zt(e,a, {
      titles:i,dots:i?3:2,shade:i
    }
    );
    var n=t.slice(6);
    n.length&&ta(e,n,860,"Anime y animación")
  }
  ,function(t) {
    var a=function() {
      for(var e=[],t=0;
      t<l.length;
      t++) {
        var a=l[t],i=o([a.row||"",a.category||"",a.kind||"",a.title||"",a.alias||"",a.genres&&a.genres.join?a.genres.join(" "):a.genres||""].join(" "));
        -1===i.indexOf("novela")&&-1===i.indexOf("telenovela")||e.push(a)
      }
      return e
    }
    ();
    if(a.length) {
      var n=a.slice(0,6),r=!(!n[0]||!n[0]._portal);
      Zt(t,n, {
        titles:r,dots:r?3:2,shade:r
      }
      ),ta(t,a,860,"Más novelas")
    }
    else {
      var s=e("div","catalog-empty","No se encontraron novelas en el catálogo actual.");
      i(s,192,170,1500,80),t.appendChild(s)
    }
  }
  ,function(t) {
    var a=l.length?l:[];
    t.appendChild(Kt(a[0],192,38.5,1249,703, {
      shade:!0
    }
    ));
    for(var n=0;
    n<3;
    n++)t.appendChild(Kt(a[(n+1)%a.length],1446,38.5+231*n,413,226, {
      badge:2===n?"Adult":""
    }
    ));
    t.appendChild(e("div","explore-row-title","Netflix"));
    var r=e("div","explore-strip");
    i(r,192,811.5,1920,130);
    for(var o=0;
    o<8;
    o++) {
      var s=e("div","explore-logo");
      i(s,272*o,0,260,120),r.appendChild(s)
    }
    t.appendChild(r)
  }
  ],vt= {
  }
  ;
  function ft(e) {
    !vt[e]&&He[e]&&ut[e]&&(vt[e]=!0,ut[e](He[e]))
  }
  function ht() {
    Re=!0,ee=t("home-pages"),te=t("home-notify"),a(ee),He=[],vt= {
    }
    ;
    for(var i=0;
    i<ut.length;
    i++) {
      var n=e("div","home-page scrollable");
      0===i&&n.classList.add("is-current"),ee.appendChild(n),He.push(n)
    }
    ft(z[$.tab]&&z[$.tab].page>=0?z[$.tab].page:0),function() {
      var i=t("home-tabs");
      a(i),i.classList.add("scrollable"),i.classList.add("is-expanded"),Ue=[];
      for(var n=0;
      n<z.length;
      n++) {
        var r=e("div","tab-item focusable");
        r.appendChild(e("div","tab-pill"));
        var o=e("div","tab-icon");
        o.innerHTML=V[z[n].icon]||"",r.appendChild(o);
        var s=e("div","tab-title",z[n].label);
        r.appendChild(s),r._tab=n,r._activate=function(e) {
          return function() {
            if("history"===z[e].action)return je="history",xa(),void Sa(1,!0);
            if(mt(e,!1),0===e) {
              var t=Be.filter(function(e) {
                return e._channel===$.channel
              }
              )[0];
              t?it(t):Be.length?it(Be[0]):ne&&it(ne)
            }
            else if(z[e].page>=0) {
              var a=nt(He[z[e].page]);
              a&&it(a)
            }
          }
        }
        (n),r._onMove=function(e) {
          return function(t) {
            if("up"===t)return e>0&&Ue[e-1]&&(it(Ue[e-1]),mt(e-1,!1)),!0;
            if("down"===t)return e<Ue.length-1&&Ue[e+1]&&(it(Ue[e+1]),mt(e+1,!1)),!0;
            if("left"===t)return!0;
            if("right"===t) {
              if("history"===z[e].action)return je="history",xa(),Sa(1,!0),!0;
              if(mt(e,!1),0===e) {
                var a=Be.filter(function(e) {
                  return e._channel===$.channel
                }
                )[0];
                a?it(a):Be.length?it(Be[0]):ne&&it(ne)
              }
              else if(z[e].page>=0) {
                var i=nt(He[z[e].page]);
                i&&it(i)
              }
              return!0
            }
            return!1
          }
        }
        (n),i.appendChild(r),Ue.push(r)
      }
    }
    (),function() {
      a(te);
      for(var t=[ {
        cls:"search",icon:"assets/original/home/icon_notify_search.png",small:!0
      }
      , {
        cls:"filter",icon:"assets/original/search/icon_category_filter_n.png",small:!0
      }
      , {
        cls:"personal",icon:"assets/original/home/icon_notify_personal.png",small:!0
      }
      ],i=0;
      i<t.length;
      i++) {
        var n=t[i],r=e("div","notify-item focusable "+n.cls+(n.small?" is-small":"")),o=e("div","n-normal");
        o.style.backgroundImage="url("+n.icon+")",r.appendChild(o),"personal"===n.cls?r._activate=function() {
          xa()
        }
        :"search"===n.cls?r._activate=function() {
          ca()
        }
        :r._activate=function() {
        }
        ,te.appendChild(r)
      }
      var s=e("div","notify-divider");
      te.appendChild(s);
      var l=e("div","notify-wifi");
      l.innerHTML='<svg viewBox="0 0 30 22"><path d="M15 19.5a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2z" fill="currentColor"/><path d="M8.4 12.2a9.6 9.6 0 0 1 13.2 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M4.2 7.6a15.6 15.6 0 0 1 21.6 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',te.appendChild(l);
      var d=e("div","notify-time");
      d.id="notify-time",te.appendChild(d),gt(),setInterval(gt,3e4)
    }
    ()
  }
  function gt() {
    var e=t("notify-time");
    if(e) {
      var a=new Date,i=a.getHours(),n=i>=12?"PM":"AM";
      0===(i%=12)&&(i=12);
      var o=a.getMinutes();
      e.textContent=i+":"+r(o)+" "+n
    }
  }
  function mt(e,t) {
    var a=z[e];
    if(a&&!a.action) {
      var i=z[$.tab]?z[$.tab].page:a.page;
      $.tab=e;
      for(var n=0;
      n<Ue.length;
      n++)Ue[n].classList.toggle("is-selected",n===e);
      a.page>=0&&ft(a.page),0===a.page?Ut(F[$.channel]):Ht();
      for(var r=0;
      r<He.length;
      r++)He[r].classList.remove("is-entering","from-left","from-right"),He[r].classList.toggle("is-current",r===a.page);
      if(a.page!==i&&He[a.page]) {
        var o=He[a.page];
        o.classList.add("is-entering",a.page>i?"from-right":"from-left"),setTimeout(function() {
          o.classList.remove("is-entering","from-left","from-right")
        }
        ,320)
      }
      if(t)if(0===a.page) {
        var s=Be.filter(function(e) {
          return e._channel===$.channel
        }
        )[0];
        s?it(s):Be.length?it(Be[0]):ne&&it(ne)
      }
      else {
        var l=nt(He[a.page]);
        l&&it(l)
      }
      bt()
    }
  }
  var yt=null;
  function bt() {
    yt&&clearTimeout(yt),yt=setTimeout(function() {
      yt=null,function() {
        for(var e=document.querySelectorAll("img[data-poster-src]"),t=window.innerWidth||1920,a=window.innerHeight||1080,i=0;
        i<e.length;
        i++) {
          var r=e[i],o=n(r,".poster, .bento"),s=o&&o.getBoundingClientRect?o.getBoundingClientRect():null;
          if(Ct(r)&&s&&s.bottom>-420&&s.top<a+420&&s.right>-320&&s.left<t+320)r.getAttribute("src")||(r.style.display="",r.src=r.getAttribute("data-poster-src"));
          else if(r.getAttribute("src")) {
            r.removeAttribute("src");
            try {
              r.src=""
            }
            catch(e) {
            }
          }
        }
      }
      ()
    }
    ,80)
  }
  function Ct(e) {
    if("home"===$.screen) {
      var t=n(e,".home-page");
      return!(!t||!t.classList.contains("is-current"))
    }
    if("search"===$.screen) {
      var a=n(e,".search-results"),i=n(e,".search-hot");
      return!!(a&&a.classList.contains("is-active")||i&&!i.classList.contains("is-hidden"))
    }
    if("detail"===$.screen) {
      var r=n(e,"#screen-detail");
      return!(!r||!r.classList.contains("is-active"))
    }
    return!1
  }
  function wt(t,a,n,r,o,s) {
    var l=e("div","poster focusable"+((s=s|| {
    }
    ).gold?" gold":"")+(s.type3?" type3":""));
    if(i(l,a,n,r,o),t.poster) {
      var d=e("img","p-img");
      d.setAttribute("data-poster-src",t.poster),d.onerror=function() {
        this.style.display="none"
      }
      ,l.appendChild(d)
    }
    return s.gold||(l.appendChild(e("div","p-shade")),l.appendChild(e("div","p-title",t.title))),l._item=t,l._activate=function() {
      aa(t)
    }
    ,bt(),l
  }
  var xt=[ {
    id:"es_tdt",name:"España - Canales Nacionales y TDT",url:"https://iptv-org.github.io/iptv/countries/es.m3u",desc:"320+ canales: La 1, La 2, Antena 3, Telecinco, laSexta, autonómicas"
  }
  , {
    id:"latam_spa",name:"Latinoamérica y Deportes (Hispano)",url:"https://iptv-org.github.io/iptv/languages/spa.m3u",desc:"Canales en español de Colombia, México, Argentina, Chile y Perú"
  }
  , {
    id:"sports_iptv",name:"Deportes Internacionales",url:"https://iptv-org.github.io/iptv/categories/sports.m3u",desc:"Transmisiones deportivas y canales de competiciones"
  }
  , {
    id:"movies_iptv",name:"Cine y Series 24/7",url:"https://iptv-org.github.io/iptv/categories/movies.m3u",desc:"Cine clásico, cine de acción y canales continuos de series"
  }
  ];
  function St() {
    try {
      var e=localStorage.getItem("xuper_m3u_addons");
      if(e) {
        var t=JSON.parse(e);
        if(Array.isArray(t)&&t.length)return t
      }
    }
    catch(e) {
    }
    var a=[xt[0]];
    try {
      localStorage.setItem("xuper_m3u_addons",JSON.stringify(a))
    }
    catch(e) {
    }
    return a
  }
  function _t(e) {
    try {
      localStorage.setItem("xuper_m3u_addons",JSON.stringify(e||[]))
    }
    catch(e) {
    }
  }
  var kt=[],Lt=null,Mt=!1,It=!1,Tt=!1,Et=0,qt=null,Dt=null,Ot=null,Nt=0,At=null,Pt="",Rt=!1;
  function Ht() {
    if(Nt++,Pt="",At&&(clearTimeout(At),At=null),ie&&ie.classList.remove("is-preview-playing","is-preview-loading"),Ot&&(Ot.textContent=""),Dt) {
      try {
        Dt.pause()
      }
      catch(e) {
      }
      Dt.removeAttribute("src");
      try {
        Dt.src="",Dt.load()
      }
      catch(e) {
      }
    }
  }
  function Ut(e) {
    At&&clearTimeout(At),At=setTimeout(function() {
      At=null,function(e) {
        if(Dt&&e&&(e.channelCode||e.streamUrl)&&"home"===$.screen&&0===$.tab) {
          var t=e.channelCode||e.streamUrl;
          if(t!==Pt||!ie||!ie.classList.contains("is-preview-loading")&&!ie.classList.contains("is-preview-playing")) {
            Ht(),Pt=t;
            var a=++Nt;
            ie.classList.add("is-preview-loading"),Ot&&(Ot.textContent="Cargando "+(e.name||"canal")+"…"),O("resolveLive",e.streamUrl? {
              streamUrl:e.streamUrl
            }
            : {
              channelCode:e.channelCode
            }
            ,function(e,t) {
              if(a===Nt&&"home"===$.screen&&0===$.tab) {
                !e&&t&&D("live",t);
                var i=!e&&t&&!1!==t.returnValue&&(t.proxyPath||t.url);
                if(!i)return ie.classList.remove("is-preview-loading"),void(Ot&&(Ot.textContent=""));
                Dt.onloadeddata=function() {
                  a===Nt&&(ie.classList.remove("is-preview-loading"),ie.classList.add("is-preview-playing"),Ot&&(Ot.textContent=""))
                }
                ,Dt.onerror=function() {
                  a===Nt&&(ie.classList.remove("is-preview-loading","is-preview-playing"),Ot&&(Ot.textContent=""))
                }
                ;
                try {
                  Dt.src=i,Dt.load();
                  var n=Dt.play();
                  n&&n.catch&&n.catch(function() {
                  }
                  )
                }
                catch(e) {
                  ie.classList.remove("is-preview-loading")
                }
              }
            }
            )
          }
        }
      }
      (e||F[$.channel])
    }
    ,220)
  }
  function Bt(e,t) {
    e&&(Lt=e,jn(),e.isAddon?Ft(function() {
      t&&t()
    }
    ):Vt(e.id,function() {
      t&&t()
    }
    ))
  }
  function Ft(e) {
    var t=St();
    if(!t||!t.length)return F.splice(0,F.length),zt(!1),Jn(),void(e&&e());
    mr("Cargando canales de Addon…");
    for(var a=[],i=t.length,n=0;
    n<t.length;
    n++)(function(t) {
      O("fetchM3u", {
        url:t.url
      }
      ,function(t,n) {
        if(n&&n.channels&&n.channels.length)for(var r=0;
        r<n.channels.length;
        r++)a.push(n.channels[r]);
        if(--i<=0) {
          mr(""),F.splice(0,F.length);
          for(var o=0;
          o<a.length;
          o++)a[o].index=o+1,F.push(a[o]);
          $.channel=0,zt(!1),Jn(),F[0]&&ae&&(ae.textContent=F[0].name),"player"===$.screen&&"live"===$.playerMode&&(Lr(),kr(F[0],!0)),e&&e()
        }
      }
      )
    }
    )(t[n])
  }
  function loadLiveCats(e) {
    if(Mt&&kt.length)return e&&e(null,kt);
    O("liveCategories", {
    }
    ,function(t,a) {
      var i=[];
      if(a&&a.categories&&a.categories.length)for(var n=0;
      n<a.categories.length;
      n++) {
        var r=a.categories[n],o=r.name;
        "ChannelList"!==o&&76182!==r.id||(o="Todos"),i.push( {
          id:r.id,name:o,code:r.code,isAddon:!1
        }
        )
      }
      else i=[ {
        id:76182,name:"Todos"
      }
      , {
        id:76206,name:"Deportes"
      }
      , {
        id:76205,name:"Cine y Series"
      }
      , {
        id:76188,name:"Colombia"
      }
      , {
        id:76191,name:"España"
      }
      , {
        id:76197,name:"México"
      }
      ];
      i.push( {
        id:"addons",name:"➕ Addons M3U",isAddon:!0
      }
      ),kt=i,Mt=!0,Lt||(Lt=kt[0]),jn(),e&&e(null,kt)
    }
    )
  }
  function Vt(e,t) {
    var a=e||76182;
    if(!Tt||qt!==a) {
      var i=++Et;
      qt=a,Tt=!0,It=!1,F.splice(0,F.length),$.channel=0,zt(!1),Jn();
      var n=1,r=!1,fails=0;
      !function load() {
        O("liveChannels", {
          columnId:a,pageNum:n,pageSize:250
        }
        ,function(o,s) {
          if(i!==Et)return;
          var l=s&&s.channels?s.channels:[];
          if(!o&&l.length) {
            for(var d= {
            }
            ,c=0;
            c<F.length;
            c++)F[c]&&F[c].channelCode&&(d[F[c].channelCode]=!0);
            for(var p=0;
            p<l.length;
            p++) {
              var u=l[p];
              !u||u.channelCode&&d[u.channelCode]||(u.channelCode&&(d[u.channelCode]=!0),F.push(u))
            }
          }
          else o&&fails++;
          r||(r=!0,loadLiveCats());
          if(!o&&s&&s.hasMore&&l.length&&fails<3)return n++,void setTimeout(load,25);
          // Renderizar una sola vez al terminar la paginacion (antes se
          // reconstruian los +1.000 nodos en cada pagina y se congelaba el foco).
          It=!!F.length,zt(!1),Jn(),$.channel>=F.length&&($.channel=0),F[$.channel]&&ae&&(ae.textContent=F[$.channel].name),"player"===$.screen&&"live"===$.playerMode?Lr():Ut(F[$.channel]),Tt=!1,t&&t(o,s),o&&!It&&setTimeout(function() {
            i===Et&&Vt(a)
          }
          ,2500)
        }
        )
      }
      ()
    }
  }
  function zt(t) {
    if(re)if(a(re),Be=[],F.length) {
      for(var i=0;
      i<F.length;
      i++)if(!t||F[i].fav) {
        var n=e("div","live-row focusable");
        n._channel=i;
        var r=e("div","row-icon");
        F[i].logo&&(r.style.backgroundImage="url("+F[i].logo+")",r.style.backgroundSize="contain",r.style.backgroundRepeat="no-repeat",r.style.backgroundPosition="center");
        var o=e("div","row-play"),s=e("div","row-name",F[i].name);
        n.appendChild(r),n.appendChild(o),n.appendChild(s),i===$.channel&&n.classList.add("is-current"),n._activate=function(e) {
          return function() {
            Wt(e,!0),xr("live")
          }
        }
        (i),n._onMove=function(e) {
          return function(t) {
            return"left"===t?(ne?it(ne):Ue[0]&&it(Ue[0]),!0):"up"===t?(e>0&&Be[e-1]&&it(Be[e-1]),!0):"down"===t&&(e<Be.length-1&&Be[e+1]&&it(Be[e+1]),!0)
          }
        }
        (i),re.appendChild(n),Be.push(n)
      }
      F[$.channel]&&ae&&(ae.textContent=F[$.channel].name),jt()
    }
    else re.appendChild(e("div","live-list-status",It?"No se encontraron canales":"Cargando canales…"))
  }
  function jt() {
    if(Be.length) {
      var e=Be.filter(function(e) {
        return e._channel===$.channel
      }
      )[0];
      if(e) {
        var t=120*Be.indexOf(e),a=Math.max(0,re.scrollHeight-re.clientHeight),i=re.scrollTop;
        t<i&&(i=t),t+100.5>i+re.clientHeight&&(i=t+100.5-re.clientHeight),re.scrollTop=Math.max(0,Math.min(a,i))
      }
    }
  }
  function Wt(e,t) {
    e<0&&(e=0),e>F.length-1&&(e=F.length-1),$.channel=e;
    for(var a=0;
    a<Be.length;
    a++)Be[a].classList.toggle("is-current",Be[a]._channel===e);
    F[e]&&ae&&(ae.textContent=F[e].name),jt(),"player"===$.screen?(!function() {
      if(!Ce)return;
      Lr()
    }
    (),"live"===$.playerMode&&kr(F[e],!!t)):"home"===$.screen&&0===$.tab&&Ut(F[e])
  }
  function $t() {
    Rt=!0;
    var e=t("dialog-addons");
    if(e) {
      e.classList.add("is-active"),Gt();
      var a=e.querySelector(".focusable");
      a&&it(a)
    }
  }
  function Xt() {
    Rt=!1;
    var e=t("dialog-addons");
    if(e&&(e.classList.remove("is-active"),$.channelsOpen)) {
      var a=xe?xe.querySelector("#pc-btn-addons"):null;
      it(a||Ce)
    }
  }
  function Gt() {
    for(var i=t("da-presets-list"),n=t("da-installed-list"),r=St(),o= {
    }
    ,s=0;
    s<r.length;
    s++)o[r[s].url]=!0;
    if(i) {
      a(i);
      for(var l=0;
      l<xt.length;
      l++)(function(t) {
        var a=e("div","da-preset-item"),n=e("div","da-preset-info");
        n.appendChild(e("div","da-preset-name",t.name)),n.appendChild(e("div","da-preset-desc",t.desc)),a.appendChild(n);
        var r=!!o[t.url],s=e("button","da-preset-btn focusable"+(r?" is-installed":""),r?"✔ Instalado":"+ Instalar");
        s._activate=function() {
          r||(s.textContent="Instalando…",Qt(t,function(e,t) {
            e?(s.textContent="Error",setTimeout(function() {
              s.textContent="+ Instalar"
            }
            ,2e3)):(Gt(),Lt&&Lt.isAddon&&Ft())
          }
          ))
        }
        ,a.appendChild(s),i.appendChild(a)
      }
      )(xt[l])
    }
    if(n)if(a(n),r.length)for(var d=0;
    d<r.length;
    d++)(function(t,a) {
      var i=e("div","da-installed-item"),o=e("div","da-installed-info"),s=e("div","da-preset-name",t.name),l=e("div","da-preset-desc",(t.count?t.count+" canales • ":"")+t.url);
      o.appendChild(s),o.appendChild(l),i.appendChild(o);
      var d=e("button","da-del-btn focusable","Eliminar");
      d._activate=function() {
        r.splice(a,1),_t(r),Gt(),Lt&&Lt.isAddon&&Ft()
      }
      ,i.appendChild(d),n.appendChild(i)
    }
    )(r[d],d);
    else n.appendChild(e("div","da-installed-empty","No hay addons personalizados instalados aún. Instala una lista recomendada arriba o escribe una URL."));
    var c=t("da-btn-add-custom");
    c&&(c._activate=function() {
      var e=t("da-custom-url"),a=e?(e.value||"").trim():"";
      a&&/^https?:\/\//i.test(a)?(c.textContent="Descargando…",Qt( {
        id:"custom_"+Date.now(),name:"Lista Personalizada",url:a
      }
      ,function(t,a) {
        c.textContent="Agregar",t?alert("No se pudo cargar la lista M3U: "+t):(e&&(e.value=""),Gt(),Lt&&Lt.isAddon&&Ft())
      }
      )):alert("Por favor introduce una URL válida (http:// o https://)")
    }
    );
    var p=t("da-btn-exit");
    p&&(p._activate=function() {
      Xt()
    }
    )
  }
  function Qt(e,t) {
    O("fetchM3u", {
      url:e.url
    }
    ,function(a,i) {
      if(!a&&i&&i.channels&&i.channels.length) {
        for(var n=St(),r=!1,o=0;
        o<n.length;
        o++)if(n[o].url===e.url) {
          n[o].count=i.channels.length,r=!0;
          break
        }
        r||n.push( {
          id:e.id||"addon_"+Date.now(),name:e.name||"Lista M3U",url:e.url,count:i.channels.length
        }
        ),_t(n),t&&t(null,i.channels.length)
      }
      else t&&t(a||"No se encontraron canales en la lista")
    }
    )
  }
  var Jt= {
    bigW:831,bigH:534,bigY:38.5,smallW:413,smallH:222,smallY:578.5,bigX:[192,1029],smallX:[192,609,1028,1446]
  }
  ;
  function Kt(t,a,n,r,o,s) {
    s=s|| {
    }
    ;
    var l=e("div","bento focusable");
    i(l,a,n,r,o);
    var d=t?t.landscape||t.poster:"";
    if(d) {
      var c=e("img","bento-img");
      c.setAttribute("data-poster-src",d),c.onerror=function() {
        this.style.display="none"
      }
      ,l.appendChild(c)
    }
    return s.shade&&l.appendChild(e("div","bento-shade")),s.title&&t&&l.appendChild(e("div","bento-title",t.title)),s.badge&&l.appendChild(e("div","bento-badge",s.badge)),l._item=t,t&&(l._activate=function() {
      aa(t)
    }
    ),bt(),l
  }
  function Yt(t,a,n,r) {
    var o=e("div","bento-dots");
    i(o,t,a,21+40*Math.max(0,n-1),11);
    for(var s=0;
    s<n;
    s++)o.appendChild(e("span","bento-dot"+(s===r?" is-active":"")));
    return o
  }
  function Zt(e,t,a) {
    a=a|| {
    }
    ;
    var i=t.length?t:l;
    if(i.length) {
      var n;
      for(n=0;
      n<2;
      n++)e.appendChild(Kt(i[n%i.length],Jt.bigX[n],Jt.bigY,Jt.bigW,Jt.bigH, {
        shade:!1!==a.shade,title:a.titles
      }
      ));
      for(n=0;
      n<4;
      n++)e.appendChild(Kt(i[(n+2)%i.length],Jt.smallX[n],Jt.smallY,Jt.smallW,Jt.smallH, {
      }
      ));
      a.dots&&e.appendChild(Yt(848,535.5,a.dots,0))
    }
  }
  function ea(e) {
    var t,a=[];
    if(e)for(t=0;
    t<l.length;
    t++) {
      (-1!==o(l[t].category||"").split(",").indexOf(e)||l[t].kind&&-1!==o(l[t].kind).indexOf(e))&&a.push(l[t])
    }
    return a.length?a:l
  }
  function ta(t,a,n,r) {
    if(a&&a.length) {
      var o=n||860,s=e("div","kids-subtitle",r||"Catálogo");
      i(s,192,o,1249,40),t.appendChild(s),o+=50;
      for(var l=Math.min(a.length,60),d=0;
      d<l;
      d++) {
        var c=192+276*(d%6),p=o+390*Math.floor(d/6);
        t.appendChild(wt(a[d],c,p,250,360, {
          gold:!0
        }
        ))
      }
    }
  }
  function aa(e) {
    if($.playerMode="vod",$.detail=e,$.detailReturn= {
      screen:$.screen,focus:$.focus
    }
    ,$.detailRange=0,$.detailSeason=0,$.detailEpisode=null,e.seasons&&e.seasons.length)for(var a=0;
    a<e.seasons.length;
    a++)if(e.seasons[a].id===e.id) {
      $.detailSeason=a;
      break
    }
    e.episodes&&e.episodes.length&&($.detailEpisode=e.episodes[0]),zi(e),on(),nn(e),dn(e),ia(e),ot("detail"),Ce||zn();
    var i=t("screen-player");
    i&&(i.classList.add("is-mini"),i.classList.add("is-active"));
    var n=le?le.querySelector(".focusable"):null;
    n&&it(n),e._detailsLoaded?Cr(e,$.detailEpisode):(mr("Preparando la reproducción…"),B(e,function(e) {
      e&&"detail"===$.screen&&$.detail===e&&(zi(e),Cr(e,$.detailEpisode))
    }
    ))
  }
  function ia(n) {
    oe=t("detail-left"),se=t("detail-player"),le=t("detail-buttons"),de=t("detail-bottom"),a(oe),a(le),a(de);
    var r,o=e("div","detail-titlewrap");
    if(o.appendChild(e("div","detail-title",n.title)),o.appendChild(e("div","detail-score",n.score)),oe.appendChild(o),n.country||n.releaseDate||n.tagline) {
      var s=[];
      n.country&&s.push(n.country),n.releaseDate&&s.push(n.releaseDate),n.tagline&&s.push(n.tagline),r=s.join(" | ")
    }
    else {
      var d=[];
      n.year&&"—"!==n.year&&d.push(n.year),n.duration&&"—"!==n.duration&&d.push(n.duration),d.push("HD"),r=d.join("  ·  ")
    }
    if(oe.appendChild(e("div","detail-meta",r)),S(n)) {
      var c=0,p=/S(\d+)/i.exec(n.alias||"")||/T(\d+)/i.exec(n.title||"");
      if(p&&(c=parseInt(p[1],10)||0),!c&&n.seasons&&n.seasons.length) {
        var u=n.seasons[$.detailSeason]||n.seasons[0];
        c=u&&u.number||1
      }
      c||(c=1);
      var v=n.updateCount||n.volumeCount||(n.episodes?n.episodes.length:0);
      v&&oe.appendChild(e("div","detail-update","T"+c+" - E"+v))
    }
    var f=e("div","detail-genres");
    f.appendChild(e("span","label","Género : "));
    for(var h=0;
    h<n.genres.length;
    h++) {
      var g=e("div","chip",n.genres[h]);
      f.appendChild(g)
    }
    oe.appendChild(f);
    var m=e("div","detail-row");
    m.appendChild(document.createTextNode("Director : "));
    var y=e("span","val",n.director);
    m.appendChild(y),oe.appendChild(m);
    var b=e("div","detail-row");
    b.appendChild(document.createTextNode("Actores : "));
    var C=e("span","val",n.actors);
    b.appendChild(C),oe.appendChild(b);
    var w=e("div","detail-synopsis");
    w.appendChild(e("span","label","Sinopsis : ")),w.appendChild(e("div","text",n.synopsis));
    var x=e("div","detail-more","Más");
    x.classList.add("focusable"),x._activate=function() {
      toggleSynopsis()
    }
    ,x._onMove=function() {
      return!1
    }
    ,w.appendChild(x),oe.appendChild(w),a(se),se.classList.add("focusable"),se._activate=function() {
      wr(n,$.detailEpisode)
    }
    ,se._onMove=function() {
      return!1
    }
    ;
    var _=[ {
      icon:"icon_detail_fullscreen.png",label:"Pantalla completa",kind:"fullscreen"
    }
    , {
      icon:"icon_detail_subtitle_audio.png",label:"Idioma",kind:"language"
    }
    , {
      icon:"icon_detail_favorite.png",label:"Favorito",kind:"favorite"
    }
    ];
    S(n)&&_.push( {
      icon:"icon_detail_subscribe.png",label:"Notificaciones",kind:"subscribe"
    }
    );
    for(var k=0;
    k<_.length;
    k++) {
      var L=e("div","detail-btn focusable"),M=e("img");
      M.src="assets/original/vod/"+_[k].icon,M.alt="",L.appendChild(M),L.appendChild(e("span",null,_[k].label)),L._kind=_[k].kind,"favorite"===_[k].kind&&$.favs[String(n.id)]&&(L.classList.add("is-selected"),L.querySelector("span").textContent="En favoritos"),L._activate=function(e,t) {
        return function() {
          if("fullscreen"===e)wr(t,$.detailEpisode);
          else if("language"===e)An(t);
          else if("favorite"===e) {
            var a=Z(t);
            this.classList.toggle("is-selected",a);
            var i=this.querySelector("span");
            i&&(i.textContent=a?"En favoritos":"Favorito")
          }
          else if("subscribe"===e) {
            var n=this.querySelector("img"),r=-1===n.src.indexOf("subscribed");
            n.src="assets/original/vod/icon_detail_"+(r?"subscribed":"subscribe")+".png"
          }
        }
      }
      (_[k].kind,n),le.appendChild(L)
    }
    var I=e("div","detail-btn focusable"),T=e("img");
    T.src="assets/original/vod/icon_detail_quality.png",T.alt="",I.appendChild(T);
    var E=e("span",null,"smooth"===$.streamMode?"Modo fluido: Sí":"Modo fluido: No");
    I.appendChild(E),I._activate=function() {
      rn(n,"smooth"!==$.streamMode),E.textContent="smooth"===$.streamMode?"Modo fluido: Sí":"Modo fluido: No"
    }
    ,le.appendChild(I),function(t) {
      var a=S(t)&&t.episodes?t.episodes:[],n=a.length>0,r=na(a.length);
      $.detailRange>=r.length&&($.detailRange=0);
      if(S(t)) {
        var o=e("div","detail-season focusable");
        i(o,80,42,280,53),o.appendChild(e("span","season-text",function(e) {
          var t=0;
          if(e.seasons&&e.seasons.length>0) {
            var a=e.seasons[$.detailSeason]||e.seasons[0];
            t=a&&a.number?a.number:$.detailSeason+1
          }
          if(!t) {
            var i=/S(\d+)/i.exec(e.alias||"")||/T(\d+)/i.exec(e.title||"");
            i&&(t=parseInt(i[1],10)||0)
          }
          return"Temporada "+(t||1)
        }
        (t)));
        var s=e("img","season-arrow");
        s.src="assets/original/vod/ic_down_icon.png",s.alt="▼",o.appendChild(s),o._activate=function() {
          !t.seasons||t.seasons.length<2||function(t,a) {
            if(oa)return void sa();
            if(!a.seasons||a.seasons.length<2)return;
            var n=t.querySelector(".season-arrow");
            n&&n.classList.add("is-open");
            i(oa=e("div","season-popup"),80,100,280,Math.min(320,54*a.seasons.length));
            for(var r=0;
            r<a.seasons.length;
            r++)(function(t) {
              var i=a.seasons[t],n=e("div","season-popup-item focusable"+(t===$.detailSeason?" is-selected":"")),r="Temporada "+(i.number||t+1);
              n.appendChild(e("span","season-item-text",r));
              var o=e("img","season-item-check");
              o.src="assets/original/vod/icon_nation_selected.png",o.alt="",n.appendChild(o),n._activate=function() {
                if(sa(),$.detailSeason!==t) {
                  $.detailSeason=t,$.detailRange=0,$.detailEpisode=null;
                  var e=a.seasons[t];
                  e&&e.id&&(mr("Cargando temporada…"),O("detail", {
                    contentId:e.id
                  }
                  ,function(t,i) {
                    !t&&i&&!1!==i.returnValue&&(i.item&&U(a,i.item),a.episodes=i.episodes||[],a.seasonId=e.id,e._episodes=a.episodes,$.detailEpisode=a.episodes[0]||null),ia(a),$.detailEpisode&&Cr(a,$.detailEpisode);
                    var n=de?de.querySelector(".detail-season"):null;
                    n&&it(n)
                  }
                  ))
                }
                else {
                  var i=de?de.querySelector(".detail-season"):null;
                  i&&it(i)
                }
              }
              ,oa.appendChild(n)
            }
            )(r);
            de.appendChild(oa);
            var o=oa.children[$.detailSeason]||oa.children[0];
            o&&it(o)
          }
          (o,t)
        }
        ,de.appendChild(o)
      }
      if(n&&a.length>20) {
        var d=e("div","detail-ranges");
        i(d,398,51,1522,46);
        for(var c=0;
        c<r.length;
        c++)(function(a) {
          var n=e("div","detail-range focusable"+(a===$.detailRange?" is-selected":""),r[a].start+1+"-"+r[a].end);
          i(n,160*a,0,150,46),n._activate=function() {
            ra(a,t)
          }
          ,d.appendChild(n)
        }
        )(c);
        de.appendChild(d)
      }
      if(n) {
        var p=r[$.detailRange]|| {
          start:0,end:a.length
        }
        ,u=e("div","detail-episodes scrollable");
        i(u,80,149,1840,65);
        for(var v=p.start;
        v<p.end;
        v++)(function(a,n) {
          var r=e("div","detail-episode focusable"+($.detailEpisode&&($.detailEpisode.id===a.id||$.detailEpisode===a)?" is-playing":""));
          i(r,160*n,0,150,65);
          var o=void 0!==a.number&&null!==a.number?String(a.number):String(v+1);
          r.appendChild(e("span","ep-num",o)),r._ep=a,r._activate=function() {
            In(t,a)
          }
          ,u.appendChild(r)
        }
        )(a[v],v-p.start);
        de.appendChild(u)
      }
      var f=n?240:25,h=n?290:91,g=e("div","detail-related","Quizás te guste");
      i(g,80,f,400,44),de.appendChild(g);
      var m=e("div","detail-grid scrollable");
      i(m,80,h,1750,n?180:380);
      var y=parseInt(t.id,10);
      if(isNaN(y)) {
        y=0;
        for(var b=0;
        b<l.length;
        b++)if(l[b]===t) {
          y=b;
          break
        }
      }
      for(var C=3*y%Math.max(1,l.length-6),w=0;
      w<8;
      w++) {
        var x=l[(C+w)%l.length];
        if(x) {
          var _=e("div","cell");
          _.appendChild(wt(x,0,0,210,308, {
            gold:!0
          }
          )),_.appendChild(e("div","d-name",x.title)),m.appendChild(_)
        }
      }
      de.appendChild(m)
    }
    (n)
  }
  function na(e) {
    for(var t=[],a=0;
    a<e;
    a+=20)t.push( {
      start:a,end:Math.min(e,a+20)
    }
    );
    return t
  }
  function ra(e,t) {
    $.detailRange=e,ia(t);
    var a=de.querySelector(".detail-range.is-selected");
    a&&it(a)
  }
  var oa=null;
  function sa() {
    oa&&oa.parentNode&&(oa.parentNode.removeChild(oa),oa=null);
    var e=de?de.querySelector(".season-arrow"):null;
    e&&e.classList.remove("is-open")
  }
  function la() {
    ce=t("search-keyboard"),pe=t("search-hot"),ue=t("search-results"),ve=t("search-empty"),fe=t("search-hot-grid"),he=t("search-result-grid"),me=t("search-nav"),a(ce),a(fe),a(he),ue&&ue.classList.add("scrollable"),(ge=e("div","kb-edit focusable"))._activate=function() {
    }
    ,ce.appendChild(ge);
    for(var i=e("div","kb-actions"),n=[ {
      cls:"switch",w:100.5
    }
    , {
      cls:"clear",w:100.5
    }
    , {
      cls:"del",w:100.5
    }
    , {
      cls:"go",w:120
    }
    ],r=0;
    r<n.length;
    r++) {
      var o=e("div","kb-action focusable "+n[r].cls);
      o.style.width=n[r].w+"px","go"===n[r].cls?o.textContent="Busca":o.appendChild(e("div","ico")),o._kind=n[r].cls,o._activate=function(e) {
        return function() {
          "switch"===e?Ca():"clear"===e?fa(""):"del"===e?fa($.searchQuery.slice(0,-1)):ga()
        }
      }
      (n[r].cls),i.appendChild(o)
    }
    ce.appendChild(i),Fe=[];
    for(var s=[["A","Á","B","C","D","E","É"],["F","G","H","I","Í","J","K"],["L","M","N","Ñ","O","Ó","P"],["Q","R","S","T","U","Ú","Ü"],["V","W","X","Y","Z"," "]],l=0;
    l<s.length;
    l++) {
      var d=e("div","kb-row");
      d.style.top=264+88.5*l+"px";
      for(var c=0;
      c<s[l].length;
      c++) {
        var p=e("div","kb-key focusable"+(" "===s[l][c]?" space":"")," "===s[l][c]?"":s[l][c]);
        p._char=s[l][c],p._activate=function(e) {
          return function() {
            fa($.searchQuery+e)
          }
        }
        (s[l][c]),d.appendChild(p),Fe.push(p)
      }
      ce.appendChild(d)
    }
    var u=e("div","kb-feedback focusable","Feedback");
    u._activate=function() {
    }
    ,ce.appendChild(u),ua(),ue.classList.remove("is-active"),ve.classList.remove("is-active"),pe.classList.remove("is-hidden"),va()
  }
  function da(t,a) {
    var n=e("div","search-cell");
    return i(n,a%5*246,437*Math.floor(a/5),246,437),n.appendChild(wt(t,0,0,222,329, {
      gold:!0
    }
    )),n.appendChild(e("div","s-name",t.title)),n
  }
  function ca() {
    ce||la(),ot("search"),$.searchQuery||ua(),it(ge)
  }
  function pa() {
    var e=ea("destacado"),t=e&&e.length?e.slice(0,10):[];
    return t.length||(t=function() {
      for(var e=I(),t=[],a=0;
      a<e.length;
      a++)-1!==String(e[a]&&e[a].category||"").toLowerCase().indexOf("busqueda")&&t.push(_(e[a],a+1));
      return t
    }
    ()),t.length||(t=l.slice(0,10)),t
  }
  function ua() {
    if(fe&&!$.searchQuery) {
      a(fe);
      for(var e=pa(),t=0;
      t<e.length;
      t++)fe.appendChild(da(e[t],t));
      bt()
    }
  }
  function va() {
    ge&&($.searchQuery?(ge.textContent=$.searchQuery,ge.classList.remove("is-placeholder")):(ge.textContent="Buscar películas, series, directores y actores.",ge.classList.add("is-placeholder")))
  }
  function fa(e) {
    $.searchQuery=e,va(),ga()
  }
  function ha() {
    $.searchTimer&&(clearTimeout($.searchTimer),$.searchTimer=null),$.searchQuery="",va(),he&&a(he),$.searchMatches=[],$.searchPage=0,me&&(me.textContent=""),ue&&ue.classList.remove("is-active"),ve&&ve.classList.remove("is-active"),pe&&pe.classList.remove("is-hidden")
  }
  function ga() {
    var e=$.searchQuery||"",t=o(e.trim());
    if(t) {
      for(var a=[],i=0;
      i<l.length;
      i++) {
        var n=o(l[i].title||""),r=l[i].alias?o(l[i].alias):"";
        (-1!==n.indexOf(t)||r&&-1!==r.indexOf(t))&&a.push(l[i])
      }
      if(ya(a),$.searchTimer&&clearTimeout($.searchTimer),"portal"===p.mode&&t.length>=2) {
        var s=++$.searchSeq;
        $.searchTimer=setTimeout(function() {
          O("search", {
            value:e.trim()
          }
          ,function(e,t) {
            if(s===$.searchSeq&&!e&&t&&!1!==t.returnValue&&t.items&&t.items.length) {
              for(var i=a.slice(),n= {
              }
              ,r=0;
              r<i.length;
              r++)n[String(i[r].id)]=!0;
              for(var o=0;
              o<t.items.length;
              o++) {
                var l=_(t.items[o],i.length+1);
                n[String(l.id)]||(n[String(l.id)]=!0,i.push(l))
              }
              ya(i)
            }
          }
          )
        }
        ,350)
      }
    }
    else ha()
  }
  var ma=10;
  function ya(e) {
    $.searchMatches=e||[],$.searchPage=0,ba(0,-1)
  }
  function ba(e,t) {
    var i=$.searchMatches||[];
    if(pe.classList.add("is-hidden"),ue.classList.add("is-active"),a(he),0===i.length)return ve.classList.add("is-active"),void(me&&(me.textContent=""));
    ve.classList.remove("is-active");
    var r=Math.ceil(i.length/ma),o=Math.max(0,Math.min(r-1,e||0));
    $.searchPage=o;
    var s=o*ma,l=Math.min(i.length,s+ma);
    me&&(me.textContent="Resultados "+(s+1)+"-"+l+" de "+i.length+(r>1?"  ·  Página "+(o+1)+"/"+r:""));
    for(var d=s;
    d<l;
    d++) {
      var c=d-s,p=da(_(i[d],d+1),c),u=p.querySelector(".poster");
      u&&function(e,t) {
        u._onMove=function(a) {
          return"down"===a&&e>=5&&l<i.length?(ba(o+1,t),!0):"up"===a&&e<5&&s>0&&(ba(o-1,5+t),!0)
        }
      }
      (c,c%5),he.appendChild(p)
    }
    if(he.style.height="874px",t>=0) {
      var v=he.querySelectorAll(".poster.focusable")[t];
      v||(v=nt(he)),v&&it(v)
    }
    else if("search"===$.screen&&(n($.focus,".search-hot")||n($.focus,".search-results"))) {
      var f=nt(he);
      f&&it(f)
    }
  }
  function Ca() {
    $.searchNumeric=!$.searchNumeric;
    var t=ce.querySelector(".kb-action.switch .ico");
    t&&(t.style.backgroundImage="url(assets/original/search/"+($.searchNumeric?"ic_vod_search_abc.png":"ic_vod_search_123.png")+")");
    var a=ce.querySelectorAll(".kb-row:not(.kb-row-num)");
    if($.searchNumeric) {
      for(var i=0;
      i<a.length;
      i++)a[i].classList.add("hidden");
      if(!ce.querySelector(".kb-row-num"))for(var n=[["1","2","3","4","5","6","7"],["8","9","0"," "]],r=0;
      r<n.length;
      r++) {
        var o=e("div","kb-row kb-row-num");
        o.style.top=264+88.5*r+"px";
        for(var s=0;
        s<n[r].length;
        s++) {
          var l=e("div","kb-key focusable"+(" "===n[r][s]?" space":"")," "===n[r][s]?"":n[r][s]);
          l._activate=function(e) {
            return function() {
              fa($.searchQuery+e)
            }
          }
          (n[r][s]),o.appendChild(l)
        }
        ce.appendChild(o)
      }
      for(var d=ce.querySelectorAll(".kb-row-num"),c=0;
      c<d.length;
      c++)d[c].classList.remove("hidden")
    }
    else {
      for(var p=0;
      p<a.length;
      p++)a[p].classList.remove("hidden");
      Fe.forEach(function(e) {
        e.classList.remove("hidden")
      }
      );
      for(var u=ce.querySelectorAll(".kb-row-num"),v=0;
      v<u.length;
      v++)u[v].classList.add("hidden")
    }
  }
  function wa() {
    ye=t("settings-menu"),be=t("settings-right"),a(ye),a(be),ze=[];
    for(var n=0;
    n<j.length;
    n++) {
      var r=e("div","settings-item focusable");
      r.innerHTML='<span class="settings-icon">'+(W[j[n].id]||"")+'</span><span class="settings-label">'+j[n].label+"</span>",r._index=n,r._activate=function(e) {
        return function() {
          Sa(e,!0)
        }
      }
      (n),r._onMove=function(e) {
        if("right"===e) {
          var t=nt(be.querySelector(".settings-panel.is-active"));
          return t&&it(t),!0
        }
        return!1
      }
      ,ye.appendChild(r),ze.push(r)
    }
    var o;
    for(var s in(Ve= {
    }
    ).profile=La(),Ve.history=Ma(),Ve.share=((o=_a("Compartir APP")).appendChild(e("div","sp-hr")),o.appendChild(e("div","share-copy","Instala XuperTV en otro televisor Samsung desde TizenBrew. El historial de este perfil permanece privado en este TV.")),o),Ve.playback=function() {
      var t=_a("Configuración global de reproducción");
      t.appendChild(e("div","sp-hr")),t.appendChild(e("div","sp-global-note","Estas preferencias se aplican automáticamente a todas las películas y series nuevas.")),ka(t,198,"Reproductor",["Normal (directo)","Modo fluido"],"streamMode","smooth"===$.playback.streamMode?1:0),ka(t,307,"Formato de pantalla",["Pantalla completa","Normal","16:9","4:3"],"screen",$.playback.screen),ka(t,416,"Audio preferido",["Español","Portugués","Inglés"],"audio",$.playback.audio),t.appendChild(i(e("div","sp-hr"),0,535,1498,1)),t.appendChild(e("div","sp-subtitle-h","Subtitulos"));
      var a=e("div","sp-switch focusable "+($.playback.subtitle?"on":"off"));
      return a._activate=function() {
        $.playback.subtitle=!$.playback.subtitle,a.className="sp-switch focusable "+($.playback.subtitle?"on":"off"),Y(),it(a)
      }
      ,t.appendChild(a),ka(t,680,"Idioma",["Español","Portugués","Inglés"],"subLang",$.playback.subLang),ka(t,793,"Tamaño",["Normal","Grande","Pequeño"],"size",$.playback.size),function(t,a) {
        var i=e("div","pb-row");
        i.style.top=a+"px",i.appendChild(e("div","pb-label","Estilo"));
        for(var n=["#ffffff","#f6e33f","#ffffff"],r=0;
        r<3;
        r++) {
          var o=e("div","pb-opt focusable"+(r===$.playback.style?" is-checked":""));
          o.style.marginLeft=(0===r?0:28)+"px",o.appendChild(e("div","radio"));
          var s=e("span",null,"Aa");
          s.style.color=n[r],2===r&&(s.style.background="#000000",s.style.display="inline-block",s.style.width="94px",s.style.height="50px",s.style.lineHeight="50px",s.style.fontSize="28px"),o.appendChild(s),o._group="style",o._index=r,o._activate=function() {
            $.playback.style=this._index,Hi(),Y();
            for(var e=t.querySelectorAll(".pb-opt"),a=0;
            a<e.length;
            a++)"style"===e[a]._group&&e[a].classList.toggle("is-checked",e[a]._index===this._index)
          }
          ,i.appendChild(o)
        }
        t.appendChild(i)
      }
      (t,906),t
    }
    (),Ve.netdiag=function() {
      var t=_a("Diagnóstico de red");
      t.appendChild(e("div","dg-note","Comprueba si tu operador de internet está bloqueando los servidores de XuperTV. La app ya usa un DNS seguro (DNS-over-HTTPS) para evitarlo; esta prueba solo lo muestra.")),t.appendChild(i(e("div","sp-hr"),0,216,1478,1));
      var n=e("div","dg-btn focusable","Analizar red");
      i(n,52,242,330,66);
      var r=e("div","dg-btn dg-report-btn focusable","Generar reporte");
      i(r,400,242,330,66);
      var o=e("div","dg-summary",'Pulsa "Analizar red" para empezar.');
      i(o,750,242,676,66);
      var s=e("div","dg-head");
      i(s,52,336,1380,40),s.appendChild(e("span","dg-host","Dominio")),s.appendChild(e("span","dg-local","DNS del televisor")),s.appendChild(e("span","dg-state","Estado")),s.appendChild(e("span","dg-ip","Dirección real (DNS seguro)"));
      var l=e("div","dg-list");
      i(l,52,378,1380,450);
      var d=e("div","dg-env","");
      i(d,52,832,1380,32),Ta=d;
      var c=e("div","dg-foot",'Si el estado dice "Bloqueado", tu operador está interceptando el nombre del servidor, pero la app ya conecta por la dirección real. El reproductor Normal y el Modo Fluido usan este mismo DNS seguro. Si el vídeo sigue sin abrir con la conexión en verde, el bloqueo es por dirección: hace falta un túnel (VPN local).');
      return i(c,52,872,1380,150),n._activate=function() {
        Aa(n,o,l)
      }
      ,r._activate=function() {
        !function(t,i) {
          if(!Ia.report) {
            Ia.runId++,Ia.running=!1;
            var n=window.__xuperViewport|| {
            }
            ;
            Ia.report= {
              version:(document.querySelector(".welcome-version")|| {
              }
              ).textContent||"desconocida",verdict:"sin respuesta",partial:!0,pending:!0,screen: {
                w:n.w||0,h:n.h||0,scale:n.scale||0,panelW:n.panelW||0,panelH:n.panelH||0
              }
              ,layers: {
              }
              ,hosts:[]
            }
          }
          a(i);
          var r=e("div","dg-report",function(e) {
            var t=[],a=e.screen|| {
            }
            ,i=e.layers|| {
            }
            ,n=e.hosts||[];
            t.push("REPORTE DE SOPORTE XUPERTV"),t.push("Versión: "+(e.version||"desconocida")),t.push("Pantalla: "+(a.w&&a.h?a.w+"×"+a.h:"sin datos")+(a.panelW&&a.panelH?" | panel "+a.panelW+"×"+a.panelH:"")+(a.scale?" | escala "+a.scale:"")),t.push("Red: "+(e.verdict||"sin resultado")+(e.partial?" (parcial)":"")),e.pending&&t.push("Diagnóstico: sin respuesta / detenido para generar este reporte");
            e.serviceError&&t.push("Servicio: "+Oa(e.serviceError));
            t.push("Portal: "+Na(i.portal)),t.push("Sesión: "+Na(i.session)),t.push("TV en vivo: "+Na(i.live)),t.push("Películas/series: "+Na(i.vod)),t.push("Reproductor: "+($.playerMode||"sin reproducción")+" | modo "+($.streamMode||"normal")+($.streamError?" | error "+Oa($.streamError):""));
            for(var r=0;
            r<n.length&&r<5;
            r++)t.push("Host "+(r+1)+": "+Oa(n[r].host)+" — "+Oa(n[r].verdict||"sin datos"));
            return t.push(""),t.push("Privacidad: este reporte no incluye enlaces, tokens, cabeceras ni historial."),t.push("Toma una foto de esta pantalla y envíala al soporte."),t.join("\n")
          }
          (Ia.report));
          i.appendChild(r),t.className="dg-summary ok",t.textContent="Reporte listo. Toma una foto de esta pantalla y envíala al soporte."
        }
        (o,l)
      }
      ,t._ensureDiag=function() {
        Ia.report?Da(o,l,Ia.report):Aa(n,o,l)
      }
      ,t.appendChild(n),t.appendChild(r),t.appendChild(o),t.appendChild(s),t.appendChild(l),t.appendChild(d),t.appendChild(c),t
    }
    (),Ve.parent=function() {
      var t=e("div","settings-panel");
      t.appendChild(e("div","pl-title","Configuraciones del Control Parental")),t.appendChild(e("div","pl-tip","Ingrese la contraseña de cuatro dígitos e ingrese viendo el programa de bloqueo.")),t.appendChild(e("div","pl-label","Contraseña inicial:"));
      for(var a=e("div","pl-boxes"),i=0;
      i<4;
      i++) {
        var n=e("div","pl-box focusable");
        n._activate=function() {
        }
        ,a.appendChild(n),i<3&&a.appendChild(e("div","pl-sep"))
      }
      t.appendChild(a),t.appendChild(e("div","pl-note",""));
      var r=e("div","pl-ok focusable","OK");
      return r._activate=function() {
      }
      ,t.appendChild(r),t
    }
    (),Ve.feedback=function() {
      var t=e("div","settings-panel");
      t.appendChild(e("div","fb-title","Ayuda y Feedback")),t.appendChild(e("div","fb-hr")),t.appendChild(e("div","fb-contact","Si tiene alguna duda, puede ponerse en contacto con nosotros a través de los siguientes medios:")),t.appendChild(e("div","fb-qr-note","Escanee el código QR para enviar sugerencias o comentarios."));
      var a=e("div","fb-qr");
      t.appendChild(a);
      var i=e("div","fb-help focusable","Ayuda");
      return i._activate=function() {
      }
      ,t.appendChild(i),t
    }
    (),Ve.about=function() {
      var t=e("div","settings-panel");
      t.appendChild(e("div","sp-title plain","Sobre nosotros")),t.appendChild(i(e("div","sp-hr soft"),0,165,1498,1)),t.appendChild(e("div","sp-about-body","Xuper TV se dedica a ofrecer a los usuarios una amplia variedad de recursos de alta calidad. Aquí encontrarás miles de películas, series, animes y canales en vivo, todo reunido en un solo lugar. Brindamos una experiencia estable, diversa y siempre actualizada, además de contenidos gratuitos para disfrutar.")),t.appendChild(e("div","sp-about-port","XuperTV para Samsung Tizen"));
      var a=e("div","sp-about-mail"),n=e("img");
      return n.src="assets/original/settings/vod_email_icon.png",n.alt="",a.appendChild(n),a.appendChild(e("span",null,"escuchamos-tv@outlook.com")),t.appendChild(a),t
    }
    (),Ve)Ve.hasOwnProperty(s)&&be.appendChild(Ve[s])
  }
  function xa() {
    ye||wa(),ot("settings"),Sa(0,!1),it(ze[0])
  }
  function Sa(e,a) {
    var i=j[e]&&j[e].id||"profile",n=t("screen-settings");
    if(n&&n.classList.toggle("is-history-view","history"===i),"profile"===i&&Ve.profile&&be) {
      var r=La();
      be.replaceChild(r,Ve.profile),Ve.profile=r
    }
    else if("history"===i&&Ve.history&&be) {
      var o=Ma();
      be.replaceChild(o,Ve.history),Ve.history=o
    }
    else"netdiag"===i&&Ve.netdiag&&Ve.netdiag._ensureDiag&&Ve.netdiag._ensureDiag();
    for(var s=0;
    s<ze.length;
    s++)ze[s].classList.toggle("is-selected",s===e);
    for(var l in Ve)Ve.hasOwnProperty(l)&&Ve[l].classList.toggle("is-active",l===i);
    a&&it(nt(Ve[i])||ze[e])
  }
  function _a(t) {
    var a=e("div","settings-panel");
    return a.appendChild(e("div","sp-title",t)),a
  }
  function ka(t,a,i,n,r,o) {
    var s=e("div","pb-row");
    s.style.top=a+"px",s.appendChild(e("div","pb-label",i));
    for(var l=0;
    l<n.length;
    l++) {
      var d=e("div","pb-opt focusable"+(l===o?" is-checked":""));
      d.style.marginLeft=(0===l?0:28)+"px",d.appendChild(e("div","radio")),d.appendChild(e("span",null,n[l])),d._group=r,d._index=l,d._activate=function() {
        "streamMode"===this._group?($.playback.streamMode=1===this._index?"smooth":"normal",en= {
        }
        ,$.playerItem&&nn($.playerItem)):$.playback[this._group]=this._index,Hi(),Y();
        for(var e=t.querySelectorAll(".pb-opt"),a=0;
        a<e.length;
        a++)e[a]._group===this._group&&e[a].classList.toggle("is-checked",e[a]._index===this._index)
      }
      ,s.appendChild(d)
    }
    t.appendChild(s)
  }
  function La() {
    var t=e("div","settings-panel account-panel"),a=e("div","account-avatar");
    a.innerHTML=W.profile,t.appendChild(a),t.appendChild(e("div","account-number",Q.id)),t.appendChild(e("div","account-type","Perfil local de este televisor"));
    var i=e("div","account-card");
    i.appendChild(e("div","account-card-title","Tu cuenta está lista")),i.appendChild(e("div","account-card-text","Las preferencias, el historial y el capítulo que estabas viendo se guardan automáticamente en este TV.")),t.appendChild(i);
    var n=e("div","account-history-btn focusable","Ver mi lista");
    n._activate=function() {
      Sa(1,!0)
    }
    ,t.appendChild(n);
    var r=e("div","account-card account-card-small");
    return r.appendChild(e("div","account-card-title","Sin registro ni contraseña")),r.appendChild(e("div","account-card-text","Este perfil no envía tus datos a ningún servidor.")),t.appendChild(r),t
  }
  function Ma() {
    for(var t=e("div","settings-panel history-panel"),a=e("div","history-tabs"),i=[ {
      id:"history",label:"Historia"
    }
    , {
      id:"favs",label:"Mi favoritos"
    }
    ],n=0;
    n<i.length;
    n++)(function(t) {
      var i=e("div","history-tab focusable"+(je===t.id?" is-selected":""),t.label);
      i._activate=function() {
        je=t.id,Sa(1,!0)
      }
      ,a.appendChild(i)
    }
    )(i[n]);
    t.appendChild(a),t.appendChild(e("div","history-rule"));
    var r=[];
    if("history"===je)r=Q.history||[];
    else if("favs"===je)for(var o=0;
    o<l.length;
    o++)$.favs&&$.favs[l[o].id]&&r.push( {
      id:l[o].id,title:l[o].title,poster:l[o].poster||l[o].cover,series:S(l[o]),position:0
    }
    );
    var s=e("div","history-total","Total ");
    s.appendChild(e("span",null,String(r.length))),t.appendChild(s);
    var d=e("div","history-grid");
    if(r.length)for(var c=0;
    c<r.length&&c<15;
    c++)(function(t) {
      var a=e("div","history-card focusable"),i=document.createElement("img");
      i.className="history-poster",i.alt="",i.src=t.poster||"assets/original/common/bg_placehoder_vertical.png",a.appendChild(i);
      var n=t.series?"Ya miró hasta "+(t.episodeNumber?"epis. "+t.episodeNumber:"un episodio"):"Ya miró hasta "+Ha(t.position||0);
      a.appendChild(e("div","history-progress",n)),a.appendChild(e("div","history-card-title",t.title||"Contenido")),a._activate=function() {
        ji(t)
      }
      ,d.appendChild(a)
    }
    )(r[c]);
    else d.appendChild(e("div","history-grid-empty","No hay títulos para mostrar todavía."));
    return t.appendChild(d),t
  }
  var Ia= {
    running:!1,report:null,error:null,runId:0
  }
  ,Ta=null;
  function Ea(e) {
    if(!e)return"Sin datos";
    switch(e.verdict) {
      case"ok":return"Correcto";
      case"dns-distinto":return"DNS alterado";
      case"dns-local-falla":return"Bloqueado";
      case"sin-tcp":return"Sin conexión";
      case"tls-falla":return"HTTPS falla";
      case"sin-tiempo":return"Sin respuesta";
      default:return"Sin datos"
    }
  }
  function qa(e) {
    return e?"ok"===e.verdict?"ok":"dns-distinto"===e.verdict||"dns-local-falla"===e.verdict||"sin-tiempo"===e.verdict||e.timeout?"warn":"bad":""
  }
  function Da(t,i,n) {
    a(i);
    var r=function(e) {
      switch(e) {
        case"ok":return {
          cls:"ok",text:"La conexión está bien: el catálogo y los servidores de vídeo responden."
        }
        ;
        case"dns-distinto":return {
          cls:"warn",text:"Tu operador devuelve direcciones distintas a las reales (bloqueo por DNS). La app ya las esquiva sola."
        }
        ;
        case"dns-local-falla":return {
          cls:"warn",text:"Tu operador bloquea el DNS del televisor (no devuelve estos dominios). La app ya lo esquiva con su DNS seguro."
        }
        ;
        case"doh-sin-respuesta":return {
          cls:"bad",text:"El DNS seguro no devolvió respuesta. Revisa la conexión del televisor."
        }
        ;
        case"doh-bloqueado":return {
          cls:"bad",text:"La red bloquea el DNS seguro (Cloudflare y Google por HTTPS)."
        }
        ;
        case"sin-salida":return {
          cls:"bad",text:"Los servidores no aceptan la conexión desde esta red."
        }
        ;
        case"algun-servidor":return {
          cls:"warn",text:"Un servidor de vídeo no respondió (suele rotar). El resto del catálogo sí responde: vuelve a analizar."
        }
        ;
        case"incompleto":return {
          cls:"warn",text:"La prueba no terminó: la TV no recibió respuesta de ningún servidor a tiempo. Vuelve a analizar; si se repite, apaga y enciende la TV."
        }
        ;
        case"servicio-sin-respuesta":return {
          cls:"bad",text:"El servicio de fondo no respondió. El reporte indica si fue el servicio completo o solo el diagnóstico."
        }
        ;
        default:return {
          cls:"",text:"Sin resultado todavía."
        }
      }
    }
    (n.verdict);
    t.textContent=r.text,t.className="dg-summary"+(r.cls?" "+r.cls:"");
    for(var o=n.hosts||[],s=0;
    s<o.length;
    s++) {
      var l=o[s],d=e("div","dg-row "+qa(l)),c=l.doh&&l.doh.ok&&l.doh.ips.length?l.doh.ips:l.system.ips||[],p=l.system&&l.system.ok?l.system.ips.join(", "):"sin respuesta";
      d.appendChild(e("span","dg-host",l.host)),d.appendChild(e("span","dg-local",p)),d.appendChild(e("span","dg-state",Ea(l))),d.appendChild(e("span","dg-ip",c.join(", "))),i.appendChild(d)
    }
    for(var u=n.providers||[],v=[],f=[],h=0;
    h<u.length;
    h++)u[h].reachable?v.push(u[h].ip):f.push(u[h].ip);
    var g=u.length>0,m=e("div","dg-row dns");
    m.appendChild(e("span","dg-host","DNS seguro (DoH)")),m.appendChild(e("span","dg-local",g?v.length+"/"+u.length+" disponibles":"sin datos")),m.appendChild(e("span","dg-state",g?v.length?"Correcto":"Bloqueado":"No evaluado")),m.appendChild(e("span","dg-ip",v.join(", "))),g?v.length?m.className="dg-row dns ok":m.className="dg-row dns bad":m.className="dg-row dns warn",i.appendChild(m);
    var y=n.codec|| {
    }
    ,b=!!(y.h264||y.hevc||y.hls),C=e("div","dg-row"+(b?" ok":" warn")),w=["H.264: "+(y.h264||"no informado"),"HEVC: "+(y.hevc||"no informado"),"HLS: "+(y.hls||"no informado")].join("  ");
    C.appendChild(e("span","dg-host","Códec")),C.appendChild(e("span","dg-local","")),C.appendChild(e("span","dg-state",b?"Informado":"No confirmado")),C.appendChild(e("span","dg-ip",w)),i.appendChild(C);
    for(var x=n.layers|| {
    }
    ,S=[ {
      key:"portal",label:"Portal"
    }
    , {
      key:"session",label:"Sesión"
    }
    , {
      key:"live",label:"Live CDN"
    }
    , {
      key:"vod",label:"VOD CDN"
    }
    ],_=!1,k=!1,L=0;
    L<S.length;
    L++) {
      var M=S[L],I=x[M.key];
      if(I) {
        "live"!==M.key||I.ok||I.timeout||(_=!0),"vod"!==M.key||I.ok||I.timeout||(k=!0);
        var T=e("div","dg-row "+(I.ok?"ok":I.timeout?"warn":"bad")),E=I.error||(I.status?"HTTP "+I.status:I.ok?"OK":"Error");
        "session"===M.key&&(E="userId "+(I.userId||"?")+"  token "+(I.token||"?"));
        var q=I.ms?" "+I.ms+" ms":"";
        T.appendChild(e("span","dg-host",M.label)),T.appendChild(e("span","dg-local","")),T.appendChild(e("span","dg-state",I.ok?"OK":I.timeout?"Sin respuesta":"Error")),T.appendChild(e("span","dg-ip",E+q)),i.appendChild(T)
      }
    }
    "ok"===r.cls&&(_||k)&&(r= {
      cls:"bad",text:"El DNS responde bien, pero "+(_&&k?"los canales en vivo y las películas":_?"los canales en vivo":"las películas")+" no se pueden abrir: tu operador bloquea las direcciones de vídeo (bloqueo por IP/SNI). Ese bloqueo no se arregla desde la app; hace falta una VPN en el router."
    }
    ,t.textContent=r.text,t.className="dg-summary "+r.cls);
    if(n.partial&&"bad"!==r.cls&&(t.textContent+=" (La prueba no terminó a tiempo: vuelve a analizar.)"),Ta) {
      var D=n.screen|| {
      }
      ,O=[];
      D.w&&D.h&&O.push("Pantalla "+D.w+"×"+D.h),D.panelW&&D.panelH&&O.push("panel "+D.panelW+"×"+D.panelH),D.scale&&O.push("escala "+Math.round(100*D.scale)/100),n.version&&O.push("versión "+n.version),Ta.textContent=O.join(" · ")
    }
  }
  function Oa(e) {
    var t=String(null==e?"":e);
    return(t=(t=(t=t.replace(/https?:\/\/[^\s"']+/gi,"[URL OCULTA]")).replace(/(token|signature|authorization|cookie|key)=?[^\s,&]*/gi,"$1=[OCULTO]")).replace(/[\r\n]+/g," ").replace(/\s+/g," ")).slice(0,150)
  }
  function Na(e) {
    return e?e.ok?e.status?"OK (HTTP "+e.status+")":"OK":e.timeout?"sin respuesta":"error"+(e.error?": "+Oa(e.error):""):"sin datos"
  }
  function Aa(t,i,n) {
    var r=Ia.runId+1;
    function o(e) {
      var a;
      Ia.runId===r&&Ia.running&&(Ia.running=!1,Ia.runId++,Ia.report= {
        version:(document.querySelector(".welcome-version")|| {
        }
        ).textContent||"desconocida",verdict:"servicio-sin-respuesta",partial:!0,serviceError:e,screen:(a=window.__xuperViewport|| {
        }
        , {
          w:a.w||0,h:a.h||0,scale:a.scale||0,panelW:a.panelW||0,panelH:a.panelH||0
        }
        ),layers: {
        }
        ,hosts:[],providers:[]
      }
      ,t.textContent="Analizar de nuevo",Da(i,n,Ia.report))
    }
    Ia.runId=r,Ia.running=!0,Ia.error=null,t.textContent="Analizando…",i.className="dg-summary",i.textContent="Consultando el DNS del televisor, el DNS seguro y los servidores…",a(n),n.appendChild(e("div","dg-row","Analizando…"));
    var s=!1,l=setTimeout(function() {
      s||(s=!0,o("ping no respondió en 25 segundos (el servicio no arrancó)"))
    }
    ,25e3);
    O("ping", {
    }
    ,function(e,t) {
      s||(s=!0,clearTimeout(l),!e&&t||o("ping falló: "+Oa(e||"sin respuesta")))
    }
    ,24e3);
    var d=setTimeout(function() {
      Ia.running&&Ia.runId===r&&(i.textContent="Analizando… tu red está respondiendo lento, espera un momento.")
    }
    ,9e3),c=setTimeout(function() {
      Ia.running&&Ia.runId===r&&o("ping respondió, pero netdiag no devolvió resultado en 32 segundos")
    }
    ,32e3);
    O("netdiag",function() {
      var e=window.__xuperViewport|| {
      }
      ,t=Se||document.querySelector("video");
      function a(e) {
        return t&&t.canPlayType(e)||""
      }
      return {
        screenW:e.w||0,screenH:e.h||0,screenScale:e.scale||0,panelW:e.panelW||0,panelH:e.panelH||0,codecH264:a('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'),codecHEVC:a('video/mp4; codecs="hvc1.1.6.L93.B0"'),codecHLS:a("application/x-mpegURL"),liveUrl:q.live&&q.live.url||"",liveHeaders:q.live&&q.live.headers|| {
        }
        ,vodUrl:q.vod&&q.vod.url||"",vodHeaders:q.vod&&q.vod.headers|| {
        }
      }
    }
    (),function(e,a) {
      if(Ia.runId===r)if(clearTimeout(d),clearTimeout(c),Ia.running=!1,t.textContent="Analizar de nuevo",t.parentNode&&-1!==t.parentNode.className.indexOf("is-active")&&it(t),!e&&a)Ia.report=a,Da(i,n,a);
      else {
        Ia.error=e||"sin respuesta",i.className="dg-summary bad";
        var o=String(e||"");
        /denied|permission|not permitted|bloqueado el servicio/i.test(o)?i.textContent=E:/exist|not found|no disponible/i.test(o)?i.textContent="El servicio de fondo no está instalado en la TV. Reinstala la app desde TizenBrew":/timeout|tiempo|espera/i.test(o)?i.textContent="Tiempo de espera agotado. La conexión es muy lenta o el DNS de tu operador no responde.":i.textContent="No se pudo ejecutar la prueba ("+(o||"el servicio no respondió")+")."
      }
    }
    ,45e3)
  }
  var Pa=5e3,Ra=null;
  function Ha(e) {
    e=Math.max(0,Math.floor(e||0));
    var t=Math.floor(e/3600),a=Math.floor(e%3600/60),i=e%60;
    return r(t)+":"+r(a)+":"+r(i)
  }
  function Ua(e) {
    if("number"==typeof e&&isFinite(e)&&e>0)return e;
    if("string"!=typeof e)return 0;
    var t=e.trim();
    if(!t||"—"===t||"-"===t)return 0;
    var a=t.match(/(\d+)\s*h(?:our|ora|s)?/i),i=t.match(/(\d+)\s*m(?:in|uto|s)?/i),n=t.match(/(\d+)\s*s(?:ec|eg)?/i);
    if(a||i||n)return 3600*(a?parseInt(a[1],10):0)+60*(i?parseInt(i[1],10):0)+(n?parseInt(n[1],10):0);
    if(-1!==t.indexOf(":")) {
      var r=t.split(":");
      if(2===r.length) {
        var o=Number(r[0]),s=Number(r[1]);
        if(isFinite(o)&&isFinite(s)&&o>=0&&s>=0)return 60*o+s
      }
      else if(3===r.length) {
        o=Number(r[0]),s=Number(r[1]);
        var l=Number(r[2]);
        if(isFinite(o)&&isFinite(s)&&isFinite(l)&&o>=0&&s>=0&&l>=0)return 3600*o+60*s+l
      }
    }
    var d=Number(t);
    return isFinite(d)&&d>0?d:0
  }
  var Ba=null;
  function Fa() {
    Ba&&(clearInterval(Ba),Ba=null)
  }
  function Va(e,t) {
    if(Ee&&qe&&Oe) {
      Ke&&(e=Ye);
      var a=Ua(t);
      if(!a&&$.playerEpisode&&$.playerEpisode.duration&&(a=Ua($.playerEpisode.duration)),!a&&$.playerItem&&$.playerItem.duration&&(a=Ua($.playerItem.duration)),!a&&Se&&isFinite(Se.duration)&&Se.duration>0&&(a=Se.duration),!a&&Wi&&Wi.length) {
        var i=Wi[Wi.length-1];
        i&&i.end>0&&(a=Math.round(i.end+60))
      }
      if(e=Number(e)||0,Ee.textContent=Ha(e),!a||a<=0)e>(a=S($.playerItem)?2700:6300)&&(a=Math.round(1.15*e));
      qe.textContent=Ha(a);
      var n=Math.min(100,Math.max(0,e/a*100));
      if(Oe.style.width=n.toFixed(2)+"%",Ae&&(Ae.style.left=n.toFixed(2)+"%"),Se&&Se.buffered&&Se.buffered.length>0)try {
        var r=Se.buffered.end(Se.buffered.length-1);
        er&&(r+=tr);
        var o=Math.min(100,Math.max(0,r/a*100));
        Ne&&(Ne.style.width=o.toFixed(2)+"%")
      }
      catch(e) {
      }
    }
  }
  function za(e) {
    Pe||(Pe=t("player-osd-icon")),Pe&&(Ra&&(clearTimeout(Ra),Ra=null),"pause"===e?(Pe.style.backgroundImage="url(assets/original/common/icon_status_pause.png)",Pe.classList.add("is-active")):"forward"===e?(Pe.style.backgroundImage="url(assets/original/common/icon_status_forward.png)",Pe.classList.add("is-active"),Ra=setTimeout(function() {
      Pe.classList.remove("is-active")
    }
    ,900)):"backward"===e?(Pe.style.backgroundImage="url(assets/original/common/icon_status_backward.png)",Pe.classList.add("is-active"),Ra=setTimeout(function() {
      Pe.classList.remove("is-active")
    }
    ,900)):Pe.classList.remove("is-active"))
  }
  function ja(e) {
    if(Se) {
      var t=Se.duration;
      (isNaN(t)||t<=0)&&(t=86400);
      var a=Se.currentTime||0,i=Math.max(0,Math.min(t,a+e));
      try {
        Se.currentTime=i
      }
      catch(e) {
      }
      Va(i,Se.duration),Xa(),za(e>0?"forward":"backward")
    }
  }
  function Wa() {
    if(Se)if(Se.paused) {
      try {
        var e=Se.play();
        e&&e.catch&&e.catch(function() {
        }
        )
      }
      catch(e) {
      }
      za("none"),Xa()
    }
    else {
      try {
        Se.pause()
      }
      catch(e) {
      }
      za("pause"),Xa()
    }
  }
  function $a() {
    $.infoTimer&&clearTimeout($.infoTimer),$.infoTimer=setTimeout(function() {
      $.infoTimer=null,"player"!==$.screen||$.channelsOpen||Ga()
    }
    ,Pa)
  }
  function Xa() {
    $.infobar=!0,"vod"===$.playerMode?(Me&&Me.classList.add("is-active"),we&&we.classList.remove("is-active")):(we&&we.classList.add("is-active"),Me&&Me.classList.remove("is-active")),$a()
  }
  function Ga() {
    $.infoTimer&&(clearTimeout($.infoTimer),$.infoTimer=null),$.infobar=!1,we&&we.classList.remove("is-active"),Me&&Me.classList.remove("is-active")
  }
  function Qa() {
    Xa()
  }
  function Ja() {
    Ga()
  }
  var Ka=null,Ya=null,Za=null,ei=null,ti=null,ai=null,ii=null,ni=null,ri=null,oi=null,si=null,li=null,di=null,ci=null,pi=null,ui=null,vi=null,fi=null,hi=null,gi=null,mi=null,yi=null,bi=null,Ci=null,wi=null,xi=null,Si=null,_i=null,ki=!1,Li=!1,Mi=null,Ii=0,Ti=!1,Ei=null,qi=!1,Di=!1,Oi=0,Ni="normal",Ai="white",Pi="contain",Ri=0;
  function Hi() {
    Ni=["normal","big","small"][Number($.playback.size)||0]||"normal",Ai=["white","yellow","black"][Number($.playback.style)||0]||"white",Di||(qi=!!$.playback.subtitle),Nn(["cover","contain","16-9","4-3"][Number($.playback.screen)||0]||"contain"),Ki()
  }
  function Ui() {
    return["es","pt","en"][Number($.playback.subLang)||0]||"es"
  }
  function Bi(e,t) {
    var a=String(e||t||"").toLowerCase(),i=t||"es";
    return"es"===i?/^(es|spa|esp|lat|cast)|espa|latino|latin|castell/i.test(a):"pt"===i?/^(pt|por)|portu/.test(a):"en"===i&&/^(en|eng|ing)|ingl/.test(a)
  }
  function Fi(e,t,a) {
    var i=$.playerItem;
    if(i&&i.id&&!(e<3)) {
      var n=Date.now();
      if(a||!(n-Ri<15e3)) {
        Ri=n;
        for(var r=$.playerEpisode,o=String(i.id),s=[ {
          id:o,title:i.title||i.name||"Contenido",poster:i.poster||i.cover||"",series:!!S(i),episodeId:r&&r.id?String(r.id):"",episodeNumber:r&&(r.number||r.seriesNumber)||"",position:Math.floor(e),duration:Math.floor(t||i.duration||0),updatedAt:n
        }
        ],l=Q.history||[],d=0;
        d<l.length&&s.length<30;
        d++)String(l[d].id)!==o&&s.push(l[d]);
        Q.history=s,K(X,Q)
      }
    }
  }
  var Vi=null;
  function zi(e) {
    var t=Vi;
    if(t&&e&&String(t.id)===String(e.id)&&t.episodeId&&e.episodes)for(var a=0;
    a<e.episodes.length;
    a++)if(String(e.episodes[a].id)===t.episodeId)return $.detailEpisode=e.episodes[a],void($.playerEpisode=e.episodes[a])
  }
  function ji(e) {
    if(e) {
      for(var t=0;
      t<l.length;
      t++)if(String(l[t].id)===String(e.id))return Vi=e,void aa(l[t]);
      for(var a=o(e.title||""),i=0;
      i<l.length;
      i++) {
        for(var n=l[i],r=n._catalogSeasons||[],s=!1,d=0;
        d<r.length;
        d++)if(String(r[d].id)===String(e.id)) {
          s=!0;
          break
        }
        if(s||a&&o(n.title||"")===a)return Vi=e,void aa(n)
      }
      var c=_( {
        id:e.id,title:e.title,poster:e.poster,type:e.series?"teleplay":"movie",portal:!0
      }
      ,0);
      c._portal=!0,Vi=e,aa(c)
    }
  }
  var Wi=[],$i= {
  }
  ,Xi= {
  }
  ,Gi=null;
  function Qi(e) {
    if(!e)return 0;
    var t=e.replace(",",".").split(":");
    return 3===t.length?3600*parseFloat(t[0])+60*parseFloat(t[1])+parseFloat(t[2]):0
  }
  function Ji(e) {
    var t=++Oi;
    if(!e||!e.url)return Wi=[],void(_i&&(_i.innerHTML=""));
    try {
      var a=new XMLHttpRequest;
      a.open("GET",e.url,!0),a.onload=function() {
        t===Oi&&a.status>=200&&a.status<300&&(Wi=function(e) {
          var t=[];
          if(!e)return t;
          for(var a=e.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n\n"),i=0;
          i<a.length;
          i++) {
            var n=a[i].trim().split("\n");
            if(n.length>=2) {
              var r=-1!==n[0].indexOf("--\x3e")?n[0]:n[1],o=-1!==n[0].indexOf("--\x3e")?n.slice(1):n.slice(2);
              if(r&&-1!==r.indexOf("--\x3e")) {
                var s=r.split("--\x3e"),l=Qi(s[0].trim()),d=Qi(s[1].trim()),c=o.join("<br>").replace(/<font[^>]*>/gi,"").replace(/<\/font>/gi,"").trim();
                c&&t.push( {
                  start:l,end:d,text:c
                }
                )
              }
            }
          }
          return t
        }
        (a.responseText))
      }
      ,a.send()
    }
    catch(e) {
    }
  }
  function Ki() {
    _i&&(_i.classList.remove("size-small","size-normal","size-big"),_i.classList.add("size-"+Ni),_i.classList.remove("color-white","color-yellow","color-black"),_i.classList.add("color-"+Ai))
  }
  function Yi(e) {
    if(_i)if(qi&&Wi&&Wi.length) {
      for(var t=null,a=0;
      a<Wi.length;
      a++)if(e>=Wi[a].start&&e<=Wi[a].end) {
        t=Wi[a];
        break
      }
      if(t) {
        var i='<span class="player-subtitles-text">'+t.text+"</span>";
        _i.innerHTML!==i&&(_i.innerHTML=i)
      }
      else""!==_i.innerHTML&&(_i.innerHTML="")
    }
    else""!==_i.innerHTML&&(_i.innerHTML="")
  }
  function Zi() {
    return"detail"===$.screen?$.detail||null:$.playerItem||$.detail||null
  }
  var en= {
  }
  ,tn="";
  function an(e) {
    if(!e)return"";
    var t=sn(e);
    return t&&t.id?t.id:e.id||""
  }
  function nn(e) {
    var t=an(e);
    t&&en.hasOwnProperty(t)?$.streamMode=en[t]?"smooth":"normal":$.streamMode="smooth"===$.playback.streamMode?"smooth":"normal"
  }
  function rn(e,t) {
    var a=an(e);
    $.streamMode=t?"smooth":"normal",a&&(en[a]=!!t)
  }
  function on() {
    tn="",Ii=0,Ti=!1,Ei=null,qi=!1,Di=!1,Oi++,$.trackIndex=0,Wi=[],_i&&(_i.innerHTML="")
  }
  function sn(e) {
    return e&&S(e)?"player"===$.screen&&$.playerEpisode?$.playerEpisode:$.detailEpisode?$.detailEpisode:e.episodes&&e.episodes[0]||null:null
  }
  function ln(e) {
    if(!e)return"";
    var t=sn(e);
    return t&&t.id?t.id:e.id||""
  }
  function dn(e,t) {
    if(t=t||function() {
    }
    ,!e)return t(null);
    var a=ln(e);
    if(!a)return t(null);
    if($i[a])return un($i[a]),t($i[a]);
    if(Xi[a])Xi[a].push(t);
    else {
      Xi[a]=[t];
      var i=sn(e),n= {
        contentId:a
      }
      ,r=e.seasonId||e.id;
      i&&i.id&&r&&i.id!==r&&(n.seriesContentId=r),O("mediaInfo",n,function(e,t) {
        var i=Xi[a]||[];
        delete Xi[a];
        var n=!e&&t&&!1!==t.returnValue?t:null;
        n&&($i[a]=n,un(n));
        for(var r=0;
        r<i.length;
        r++)try {
          i[r](n)
        }
        catch(e) {
        }
      }
      )
    }
  }
  function cn(e) {
    for(var t=(e||"").split(/[,\/]/),a=["es","pt","en"][Number($.playback.audio)||0]||"es",i=0;
    i<t.length;
    i++)if(Bi(t[i].trim(),a))return i;
    return 0
  }
  function pn(e) {
    for(var t=[],a=e&&e.subtitles||[],i=0;
    i<a.length;
    i++)t.push( {
      lang:a[i].lang,url:a[i].url,format:a[i].format
    }
    );
    return t.sort(function(e,t) {
      return(/^(es|spa|esp)$/i.test(e.lang||"")?0:1)-(/^(es|spa|esp)$/i.test(t.lang||"")?0:1)
    }
    ),t
  }
  function un(e) {
    var t=pn(e);
    if(Di) {
      if(qi) {
        if(!t.length)return qi=!1,Ei=null,void Ji(null);
        var a=!1;
        if(Ei)for(var i=0;
        i<t.length;
        i++)if(t[i].url===Ei.url) {
          Ei=t[i],a=!0;
          break
        }
        a||Ji(Ei=t[0])
      }
    }
    else {
      if(!$.playback.subtitle)return qi=!1,Ei=null,void Ji(null);
      if(!t.length)return qi=!1,Ei=null,void Ji(null);
      qi=!0,Ei=t[0];
      for(var n=0;
      n<t.length;
      n++)if(Bi(t[n].lang,Ui())) {
        Ei=t[n];
        break
      }
      Ji(Ei)
    }
  }
  function vn() {
    Mi&&clearTimeout(Mi),Mi=setTimeout(function() {
      hn()
    }
    ,8e3)
  }
  function fn() {
    if(Ka||zn(),Ka) {
      ki=!0,Li=!1,Ga(),gn(),Ka.classList.add("is-active"),_i&&_i.classList.add("shift-up"),dn($.playerItem,function() {
        ki&&gn()
      }
      ),vn();
      var e=$.playerItem;
      if(S(e)&&ei) {
        var t=ei.querySelector(".psv-ep-btn");
        if(t)return void it(t)
      }
      S(e)&&si?it(si):ti&&it(ti)
    }
  }
  function hn() {
    Mi&&(clearTimeout(Mi),Mi=null),ki=!1,Ka&&Ka.classList.remove("is-active"),_i&&_i.classList.remove("shift-up"),"player"!==$.screen||Li||it(Ce)
  }
  function gn() {
    var e=$.focus?n($.focus,".psv-row"):null,t=e?e.id:"",a=e&&$.focus?$.focus.textContent:"";
    if(yn(),function() {
      if(!ni)return;
      ni.classList.remove("is-hidden")
    }
    (),Dn(),On(),mn(),ki&&t&&Ka)for(var i=Ka.querySelectorAll(".psv-row"),r=0;
    r<i.length;
    r++)if(i[r].id===t) {
      for(var o=i[r].querySelectorAll(".focusable"),s=null,l=0;
      l<o.length;
      l++)if(o[l].textContent===a) {
        s=o[l];
        break
      }
      var d=s||nt(i[r]);
      d&&it(d,!0);
      break
    }
  }
  function mn() {
    if(Ka) {
      for(var e=Ka.querySelectorAll(".psv-row"),t=0;
      t<e.length;
      t++)e[t].classList.remove("is-row-focused");
      var a=$.focus?n($.focus,".psv-row"):null;
      a&&a.classList.add("is-row-focused")
    }
  }
  function yn() {
    if(Za) {
      var t=$.playerItem;
      if(t&&S(t)) {
        if(Za.style.display="block",ei) {
          a(ei);
          var i=bn(t),n=i[$.playerSeasonIndex]||i[0],r=n&&n.id===(t.seasonId||t.id)&&t.episodes&&t.episodes.length?t.episodes:n&&n._episodes||t.episodes||[];
          if(r.length) {
            for(var o=0,s=0;
            s<r.length;
            s++)if($.playerEpisode&&(r[s].id===$.playerEpisode.id||r[s].number===$.playerEpisode.number)) {
              o=s;
              break
            }
            var l=na(r.length);
            (void 0===$.playerEpisodeRange||$.playerEpisodeRange>=l.length)&&($.playerEpisodeRange=Math.floor(o/20));
            for(var d=l[$.playerEpisodeRange]||l[0],c=e("div","psv-episode-numbers scrollable"),p=d.start;
            p<d.end;
            p++)(function(t,a) {
              var i=a===o?"▶":String(void 0!==t.number&&null!==t.number?t.number:a+1),n=e("button","psv-ep-btn focusable"+(a===o?" is-selected":""),i);
              n._activate=function() {
                Mn(t)
              }
              ,c.appendChild(n)
            }
            )(r[p],p);
            ei.appendChild(c);
            for(var u=e("div","psv-episode-ranges scrollable"),v=0;
            v<l.length;
            v++)(function(t,a) {
              var i=e("button","psv-range-btn focusable"+(t===$.playerEpisodeRange?" is-selected":""),a.start+1+"-"+a.end);
              i._activate=function() {
                $.playerEpisodeRange=t,yn();
                var e=ei.querySelector(".psv-ep-btn");
                e&&it(e)
              }
              ,u.appendChild(i)
            }
            )(v,l[v]);
            ei.appendChild(u)
          }
          else ei.appendChild(e("div","psv-selection-empty","Temporadas y episodios"))
        }
      }
      else Za.style.display="none"
    }
  }
  function bn(e) {
    return e&&e.seasons&&e.seasons.length?e.seasons:[ {
      id:e?e.id:"",number:1
    }
    ]
  }
  function Cn(e,t,a) {
    return a=a||function() {
    }
    ,e&&t?t.id===(e.seasonId||e.id)&&e.episodes&&e.episodes.length?(t._episodes=e.episodes,a(e.episodes)):t._episodes?a(t._episodes):t._loading?(t._wait=t._wait||[],void t._wait.push(a)):(t._loading=!0,t._wait=[a],void O("detail", {
      contentId:t.id
    }
    ,function(e,a) {
      t._loading=!1;
      var i=!e&&a&&!1!==a.returnValue&&a.episodes?a.episodes:[];
      i.length&&(t._episodes=i);
      var n=t._wait||[];
      t._wait=[];
      for(var r=0;
      r<n.length;
      r++)try {
        n[r](i)
      }
      catch(e) {
      }
    }
    )):a([])
  }
  function wn(e,t,a) {
    var i=t&&void 0!==t.number&&null!==t.number?t.number:a+1,n=String(t&&(t.title||t.name)||"").trim(),r=String(e&&e.title||"").trim().replace(/[\s\-–_]*[TtSs]\d+$/,"");
    return r&&0===n.indexOf(r)&&(n=n.substring(r.length)),(n=n.replace(/^[\s\-–_:.]+/,"").trim())&&!/^(?:[TtSs]?\d+[\s\-–_.:]*)+$/.test(n)||(n="Episodio "+i),n
  }
  function xn(e) {
    var t=String(e&&e.duration||"").trim(),a=/^(\d+):(\d+)(?::(\d+))?$/.exec(t);
    return a?a[3]?(parseInt(a[1],10)||0)+" h "+(parseInt(a[2],10)||0)+" min":(parseInt(a[1],10)||0)+" min":t
  }
  function Sn() {
    var t=$.playerItem;
    if(t&&S(t)&&(ki&&hn(),li||zn(),li)) {
      if(!(t.episodes&&t.episodes.length||t._detailsLoaded))return mr("Cargando capítulos…"),void B(t,function() {
        "player"===$.screen&&(!$.playerEpisode&&t.episodes&&t.episodes.length&&($.playerEpisode=t.episodes[0],$.detailEpisode=t.episodes[0]),Sn())
      }
      );
      !$.playerEpisode&&t.episodes&&t.episodes.length&&($.playerEpisode=t.episodes[0],$.detailEpisode=t.episodes[0],$.playerSeasonIndex=$.detailSeason||0),$.episodeBrowserOpen=!0,$.browserSeason=$.playerSeasonIndex||0,li.classList.add("is-active"),Ja(),function() {
        var t=$.playerItem;
        if(!t||!li)return;
        var i=bn(t);
        $.browserSeason>=i.length&&($.browserSeason=0);
        $.browserSeason<0&&($.browserSeason=0);
        var n=i[$.browserSeason],r=i[$.playerSeasonIndex]||i[0],o=$.playerEpisode;
        di&&(di.textContent=t.title||"");
        if(ci)if(o) {
          var s=[];
          r&&r.number&&s.push("T"+r.number),o.number&&s.push("E"+o.number),ci.textContent="Reproduciendo "+s.join(" ")+" · "+wn(t,o)
        }
        else ci.textContent="Elige un episodio";
        fi&&(fi.textContent="Episodios · Temporada "+(n&&n.number||$.browserSeason+1));
        (function(t,i) {
          if(!pi||!ui)return;
          a(pi),ui.style.display="flex";
          for(var n=0;
          n<i.length;
          n++)(function(t) {
            var a=e("div","pe-season focusable","Temporada "+(i[t].number||t+1));
            t===$.browserSeason&&a.classList.add("is-selected"),a._onFocus=function() {
              $.browserSeason!==t&&Ln(t,!1)
            }
            ,a._activate=function() {
              Ln(t,!0)
            }
            ,pi.appendChild(a)
          }
          )(n)
        }
        )(0,i),kn(t,n)
      }
      ();
      var i=(vi?vi.querySelector(".pe-ep.is-current"):null)||(vi?nt(vi):null)||(ui&&"none"!==ui.style.display?nt(pi):null);
      i&&it(i)
    }
  }
  function _n(e) {
    li&&$.episodeBrowserOpen&&($.episodeBrowserOpen=!1,li.classList.remove("is-active"),!e&&"player"===$.screen&&Ce&&it(Ce))
  }
  function kn(t,i) {
    if(vi&&i) {
      a(vi);
      var r=i.id===(t.seasonId||t.id)&&t.episodes&&t.episodes.length?t.episodes:i._episodes||[];
      if(!r.length)return vi.appendChild(e("div","pe-loading","Cargando episodios…")),void Cn(t,i,function(e) {
        if($.episodeBrowserOpen&&(bn(t)[$.browserSeason]===i&&(kn(t,i),n($.focus,"#pe-episodes")))) {
          var a=vi.querySelector(".pe-ep.is-current")||nt(vi);
          a&&it(a)
        }
      }
      );
      for(var o=Math.min(r.length,24),s=0;
      s<o;
      s++)(function(a,i) {
        var n=e("div","pe-ep focusable"),r=void 0!==a.number&&null!==a.number?a.number:i+1;
        n.appendChild(e("div","pe-num",String(r)));
        var o=e("div","pe-thumb"),s=e("div","pe-thumb-play","▶");
        o.appendChild(s),n.appendChild(o);
        var l=e("div","pe-info");
        l.appendChild(e("div","pe-name",wn(t,a,i)));
        var d=[],c=xn(a);
        c&&d.push(c),a.quality&&d.push(String(a.quality).split(",")[0].toUpperCase()),l.appendChild(e("div","pe-meta",d.join("   ·   "))),a.description&&l.appendChild(e("div","pe-desc",a.description)),n.appendChild(l);
        var p=$.playerEpisode&&($.playerEpisode.id===a.id||void 0!==$.playerEpisode.number&&$.playerEpisode.number===a.number);
        n.appendChild(e("div","pe-badge","▶ REPRODUCIENDO")),p&&n.classList.add("is-current"),n._activate=function() {
          Mn(a)
        }
        ,vi.appendChild(n)
      }
      )(r[s],s);
      r.length>o&&vi.appendChild(e("div","pe-loading","Mostrando los primeros "+o+" capítulos"))
    }
  }
  function Ln(e,t) {
    var a=$.playerItem,i=bn(a);
    if(i[e]&&($.browserSeason=e,function() {
      if(pi)for(var e=pi.children,t=0;
      t<e.length;
      t++)e[t].classList.toggle("is-selected",t===$.browserSeason)
    }
    (),fi&&(fi.textContent="Episodios · Temporada "+(i[e].number||e+1)),kn(a,i[e]),t)) {
      var n=vi?vi.querySelector(".pe-ep.is-current")||nt(vi):null;
      n&&it(n)
    }
  }
  function Mn(e) {
    var t=$.playerItem;
    if(t&&e) {
      var a=bn(t),i=a[$.playerSeasonIndex];
      i&&i.id===(t.seasonId||t.id)&&t.episodes&&t.episodes.length&&(i._episodes=t.episodes);
      var n=void 0!==$.playerSeasonIndex&&null!==$.playerSeasonIndex?$.playerSeasonIndex:$.browserSeason||0,r=a[n];
      r&&($.detailSeason!==n&&($.detailSeason=n,$.detailNeedsRebuild=!0),r.id&&(t.seasonId=r.id),r._episodes&&(t.episodes=r._episodes)),_n(),ki&&hn(),In(t,e)
    }
  }
  function In(e,t) {
    if(e&&t) {
      $.playerItem=e,$.playerEpisode=t,$.detailEpisode=t,$.playerSeasonIndex=$.detailSeason||0,Ce&&we&&Lr(),qn(e),$.episodeSwitchTimer&&clearTimeout($.episodeSwitchTimer),$.episodeSwitchSeq=($.episodeSwitchSeq||0)+1;
      var a=$.episodeSwitchSeq;
      gr(),mr("Cambiando capítulo…"),$.episodeSwitchTimer=setTimeout(function() {
        $.episodeSwitchTimer=null,a===$.episodeSwitchSeq&&"player"===$.screen&&Cr(e,t)
      }
      ,600)
    }
  }
  function Tn() {
    Le||(Le=t("next-episode-loading")),Le&&(Le.classList.remove("is-active"),Le.style.backgroundImage="")
  }
  function En() {
    var e=$.playerItem;
    if(e&&S(e)&&"player"===$.screen) {
      for(var a=function(e) {
        var t=bn(e),a=t[$.playerSeasonIndex]||t[0];
        return a?a.id===(e.seasonId||e.id)&&e.episodes&&e.episodes.length?e.episodes:a._episodes||[]:[]
      }
      (e),i=$.playerEpisode,n=-1,r=0;
      r<a.length;
      r++)if(i&&(a[r].id===i.id||a[r].number===i.number)) {
        n=r;
        break
      }
      if(!(n<0))if(function(e) {
        if(Le||(Le=t("next-episode-loading")),Le) {
          var a=e&&(e.backdrop||e.landscape||e.poster)||"";
          Le.style.backgroundImage=a?'url("'+String(a).replace(/"/g,"%22")+'")':"",Le.classList.add("is-active")
        }
      }
      (e),n+1<a.length)In(e,a[n+1]);
      else {
        var o=bn(e),s=($.playerSeasonIndex||0)+1,l=o[s];
        if(l) {
          var d=i;
          Cn(e,l,function(t) {
            $.playerItem===e&&$.playerEpisode===d&&"player"===$.screen&&(t&&t.length?($.detailSeason=s,$.playerSeasonIndex=s,e.seasonId=l.id||e.seasonId,e.episodes=t,l._episodes=t,In(e,t[0])):Tn())
          }
          )
        }
        else Tn()
      }
    }
  }
  function qn(e) {
    if(de)for(var t=de.querySelectorAll(".detail-episode"),a=0;
    a<t.length;
    a++) {
      var i=!(!t[a]._ep||!$.detailEpisode||t[a]._ep.id!==$.detailEpisode.id);
      t[a].classList.toggle("is-playing",i)
    }
  }
  function Dn() {
    var e="relay"===$.streamMode||"smooth"===$.streamMode;
    if(ai) {
      ai.classList.toggle("is-selected",e);
      var t=ai.querySelector(".psv-check");
      t&&(t.style.display=e?"block":"none")
    }
    if(ii) {
      ii.classList.toggle("is-selected",!e);
      var a=ii.querySelector(".psv-check");
      a&&(a.style.display=e?"none":"block")
    }
  }
  function On() {
    if(oi)for(var e=oi.querySelectorAll(".psv-btn"),t=0;
    t<e.length;
    t++) {
      var a=e[t].getAttribute("data-aspect")===Pi;
      e[t].classList.toggle("is-selected",a);
      var i=e[t].querySelector(".psv-check");
      i&&(i.style.display=a?"block":"none")
    }
  }
  function Nn(e) {
    Pi=e||"contain",Se&&(Se.classList.remove("aspect-cover","aspect-contain","aspect-16-9","aspect-4-3"),Se.classList.add("aspect-"+Pi)),On()
  }
  function An(e) {
    if(Ya||zn(),Ya) {
      Mi&&(clearTimeout(Mi),Mi=null),Li=!0,Gi=$.focus;
      var t=e||Zi();
      "detail"===$.screen&&(t=$.detail||t),Rn(),Hn(),Ki(),Ya.classList.add("is-active"),dn(t,function() {
        Li&&(Rn(),Hn())
      }
      );
      var a=hi&&hi.querySelector(".focusable")||gi||Si;
      a&&it(a)
    }
  }
  function Pn() {
    Li=!1,Ya&&Ya.classList.remove("is-active"),ki?(ti&&it(ti),vn()):Gi&&et(Gi)?it(Gi):"player"===$.screen&&it(Ce),Gi=null
  }
  function Rn() {
    if(hi) {
      a(hi);
      var t=$i[ln(Zi())];
      t&&!Ti&&(Ii=cn(t.audio));
      var i=function(e) {
        for(var t=[],a=(e&&e.audio||"").split(/[,\/]/),i=0;
        i<a.length;
        i++) {
          var n=a[i].trim();
          n&&t.push( {
            index:i,code:n,label:Un(n)
          }
          )
        }
        return t
      }
      (t);
      i.length||(i=[ {
        index:Ii||0,label:"Español"
      }
      ]);
      for(var n=0;
      n<i.length;
      n++)(function(t) {
        var a=e("button","dps-btn focusable");
        a.textContent=t.label,Ii===t.index&&a.classList.add("is-selected"),a._activate=function() {
          Fn(t.index),Rn(),vn()
        }
        ,hi.appendChild(a)
      }
      )(i[n])
    }
  }
  function Hn() {
    var t=pn($i[ln(Zi())]);
    if(gi) {
      var i=gi.parentNode;
      i&&i.classList.toggle("is-hidden",!t.length),gi.classList.toggle("is-on",qi);
      var n=gi.querySelector(".dps-switch-text");
      n&&(n.textContent=qi?"ON":"OFF")
    }
    if(mi&&mi.classList.toggle("is-visible",qi&&t.length>0),yi&&yi.classList.toggle("is-visible",qi&&t.length>0),bi&&bi.classList.toggle("is-visible",qi&&t.length>0),qi) {
      if(Ci) {
        a(Ci);
        for(var r=0;
        r<t.length;
        r++)(function(t) {
          var a=e("button","dps-btn focusable");
          a.textContent=Un(t.lang||"Sub"),Ei&&Ei.url===t.url&&a.classList.add("is-selected"),a._activate=function() {
            Ei=t,qi=!0,Di=!0,Ji(t),Hn(),vn()
          }
          ,Ci.appendChild(a)
        }
        )(t[r])
      }
      if(wi)for(var o=wi.querySelectorAll(".dps-btn"),s=0;
      s<o.length;
      s++) {
        var l=o[s].getAttribute("data-size");
        o[s].classList.toggle("is-selected",l===Ni)
      }
      if(xi)for(var d=xi.querySelectorAll(".dps-btn"),c=0;
      c<d.length;
      c++) {
        var p=d[c].getAttribute("data-style");
        d[c].classList.toggle("is-selected",p===Ai)
      }
    }
  }
  function Un(e) {
    var t=(e||"").toLowerCase().trim().split(/[-_]/)[0];
    return/^(spa|esp|es|castellano|latino|lat|latam)$/.test(t)?"Español":/^(eng|ing|en)$/.test(t)?"Inglés":/^(jpn|jap|ja)$/.test(t)?"Japonés":/^(kor|cor|ko)$/.test(t)?"Coreano":/^(por|pt)$/.test(t)?"Portugués":/^(fra|fre|fr|franc)$/.test(t)?"Francés":/^(ita|it)$/.test(t)?"Italiano":/^(deu|ger|de)$/.test(t)?"Alemán":/^(chi|zho|zh)$/.test(t)?"Chino":t?t.charAt(0).toUpperCase()+t.slice(1):"Pista"
  }
  function Bn(e) {
    if(!Se)return!1;
    var t;
    try {
      t=Se.audioTracks
    }
    catch(e) {
      return!1
    }
    if(!t||!t.length||!(e>=0&&e<t.length))return!1;
    try {
      for(var a=0;
      a<t.length;
      a++)t[a].enabled=a===e;
      return!0
    }
    catch(e) {
      return!1
    }
  }
  function Fn(e) {
    if("player"!==$.screen||!Se)return Ii=e,void(Ti=!0);
    if("relay"===$.streamMode||"smooth"===$.streamMode)if(Ii=e,Ti=!0,er) {
      var t=tr+(Se.currentTime||0);
      yr(er+"?start="+Math.floor(t)+"&a="+e)
    }
    else Vn();
    else Bn(e)?(Ii=e,Ti=!0,mr("Idioma cambiado")):mr("Esta TV no permite cambiar audio en Normal. Usa Modo Fluido para esa pista.")
  }
  function Vn() {
    if(Se) {
      var e=er?tr+(Se.currentTime||0):Se.currentTime||0,t=$.playerItem;
      gr(),mr("Cambiando reproductor…"),br(t,function(t) {
        if(t) {
          if(-1!==t.indexOf(":8787/s/")) {
            var a=t+"?start="+Math.floor(e);
            Ii&&(a+="&a="+Ii),yr(a)
          }
          else if(yr(t),e>0)try {
            Se.currentTime=e
          }
          catch(e) {
          }
        }
        else $.streamError||mr("Sin fuente de reproducción")
      }
      )
    }
  }
  function zn() {
    if(Ce=t("player-stage"),we=t("player-infobar"),Me=t("player-vod-infobar"),xe=t("player-channels"),$e=t("player-categories"),Xe=t("pcat-grid"),Ge=t("pcat-sub"),Se=t("player-video"),ke=t("player-status"),Le=t("next-episode-loading"),Pe=t("player-osd-icon"),_e=Ce?Ce.querySelector(".player-frame"):null,Ie=t("vod-infobar-poster"),Te=t("vod-infobar-title"),Ee=t("vod-time-current"),qe=t("vod-time-total"),De=t("vod-seekbar"),Oe=t("vod-seek-progress"),Ne=t("vod-seek-buffered"),Ae=t("vod-seek-thumb"),De&&(De.classList.add("focusable"),De._activate=function() {
      vr(!0)
    }
    ,De._onMove=function(e) {
      return"left"===e?(hr(-1),!0):"right"===e?(hr(1),!0):("down"===e||"up"===e)&&(vr(!1),!0)
    }
    ),Ka=t("player-playsetting-view"),Za=t("psv-sec-selection"),ei=t("psv-episodes-row"),si=t("psv-btn-episodes"),ti=t("psv-btn-config"),ai=t("psv-btn-p1"),ii=t("psv-btn-p2"),ni=t("psv-sec-audio"),t("psv-sec-quality"),t("psv-quality-row"),t("psv-sec-aspect"),t("psv-sec-player"),ri=t("psv-btn-feedback"),oi=t("psv-aspect-row"),li=t("player-episodes"),di=t("pe-title"),ci=t("pe-sub"),pi=t("pe-seasons"),ui=t("pe-seasons-col"),vi=t("pe-episodes"),fi=t("pe-season-label"),si&&(si._activate=function() {
      Sn()
    }
    ),ri&&(ri._activate=function() {
      vn()
    }
    ),ti&&(ti._activate=function() {
      An()
    }
    ),ai&&(ai._activate=function() {
      rn(Zi(),!0),Dn(),vn(),Vn()
    }
    ),ii&&(ii._activate=function() {
      rn(Zi(),!1),Dn(),vn(),Vn()
    }
    ),oi)for(var i=oi.querySelectorAll(".psv-btn"),n=0;
    n<i.length;
    n++)(function(e) {
      e._activate=function() {
        Nn(e.getAttribute("data-aspect"))
      }
    }
    )(i[n]);
    if(Ya=t("dialog-playsettings"),hi=t("dps-audio-options"),gi=t("dps-sub-switch"),mi=t("dps-row-lang"),yi=t("dps-row-size"),bi=t("dps-row-style"),Ci=t("dps-lang-options"),wi=t("dps-size-options"),xi=t("dps-style-options"),Si=t("dps-btn-exit"),_i=t("player-subtitles"),gi&&(gi._activate=function() {
      if(Di=!0,qi=!qi) {
        var e=pn($i[ln(Zi())]);
        !Ei&&e.length&&(Ei=e[0]),Ei&&Ji(Ei)
      }
      else Ji(null);
      Hn(),vn()
    }
    ),wi)for(var r=wi.querySelectorAll(".dps-btn"),o=0;
    o<r.length;
    o++)(function(e) {
      e._activate=function() {
        Ni=e.getAttribute("data-size")||"normal",Ki(),Hn()
      }
    }
    )(r[o]);
    if(xi)for(var s=xi.querySelectorAll(".dps-btn"),l=0;
    l<s.length;
    l++)(function(e) {
      e._activate=function() {
        Ai=e.getAttribute("data-style")||"white",Ki(),Hn()
      }
    }
    )(s[l]);
    Si&&(Si._activate=function() {
      Pn()
    }
    ),Ki(),Hi(),a(we),a(xe),Ce.classList.add("focusable"),Ce._onMove=function(e) {
      return"vod"===$.playerMode?"left"===e?(ja(-10),!0):"right"===e?(ja(10),!0):"down"===e?(fn(),!0):"up"===e&&(fr(),!0):"left"===e?(Ir(),!0):"right"===e?(Tr(),!0):"up"===e?(Wt($.channel-1),!0):"down"===e&&(Wt($.channel+1),!0)
    }
    ,Ce._activate=function() {
      "vod"!==$.playerMode?$.infobar?Ga():Xa():Wa()
    }
    ,we.appendChild(e("div","pi-logo")),we.appendChild(e("div","pi-index"));
    var d=e("div","pi-namerow"),c=e("div","pi-name");
    d.appendChild(c);
    var p=e("div","pi-uhd");
    p.style.left="20px",d.appendChild(p),we.appendChild(d),we.appendChild(e("div","pi-date")),we.appendChild(e("div","pi-range")),we.appendChild(e("div","pi-now")),we.appendChild(e("div","pi-next"));
    var u=e("div","pi-seek");
    u.appendChild(e("div","bar")),we.appendChild(u),we.appendChild(e("div","pi-menu","info")),we.appendChild(e("div","pi-quality","HD")),we.appendChild(e("div","pi-scale","Normal")),we.appendChild(e("div","pi-func","Selecion de función"));
    for(var v=e("div","pi-actions"),f=[ {
      label:"Pip",right:446,w:67,hidden:!0
    }
    , {
      label:"HD",right:389,w:67
    }
    , {
      label:"Anterior",right:333,w:67
    }
    , {
      label:"Formato",right:249,w:120
    }
    , {
      label:"Favorito",right:219,w:67
    }
    , {
      label:"Reproductor 1",right:151,w:90
    }
    , {
      label:"Bloquear",right:107,w:67
    }
    , {
      label:"Feedback",right:50,w:67
    }
    ],h=0;
    h<f.length;
    h++) {
      var g=f[h];
      if(!g.hidden) {
        var m=e("div","pi-act focusable",g.label);
        m.style.width=1.5*g.w+"px",m.style.left=1920-1.5*g.right-1.5*g.w+"px",m._kind=g.label,m._activate=function(e) {
          return function() {
            if("Anterior"===e)Wt($.channel-1);
            else if("Formato"===e) {
              var t=we.querySelector(".pi-scale");
              t.textContent="Normal"===t.textContent?"16:9":"16:9"===t.textContent?"4:3":"Normal",Mr()
            }
            else if("Favorito"===e) {
              var a=F[$.channel];
              a.fav=!a.fav
            }
          }
        }
        (g.label),v.appendChild(m)
      }
    }
    we.appendChild(v);
    var y=e("div","pc-header");
    y.appendChild(e("div","pc-title","Canales de TV")),xe.appendChild(y);
    var b=e("div","pc-categories scrollable");
    b.id="pc-categories",xe.appendChild(b),xe.appendChild(e("div","pc-div"));
    var C=e("div","pc-list scrollable");
    xe.appendChild(C),jn(),Jn();
    var w=e("div","pc-menu");
    w.appendChild(e("div","ic")),w.appendChild(e("div","l1","Presione [OK] para reproducir")),w.appendChild(e("div","l2","(Arriba: Categorías · OK: Filtrar)")),xe.appendChild(w)
  }
  function jn() {
    if(xe) {
      var t=xe.querySelector(".pc-categories");
      if(t) {
        for(var i=kt&&kt.length?kt:[ {
          id:76182,name:"Todos"
        }
        , {
          id:76206,name:"Deportes"
        }
        , {
          id:76205,name:"Cine y Series"
        }
        , {
          id:76188,name:"Colombia"
        }
        , {
          id:76191,name:"España"
        }
        , {
          id:76197,name:"México"
        }
        , {
          id:"addons",name:"➕ Addons M3U",isAddon:!0
        }
        ],n="",r=0;
        r<i.length;
        r++)n+=i[r].id+"|";
        var o=$.focus&&$.focus._cat?$.focus._cat:null;
        if(n!==Qe) {
          a(t);
          for(var s=[],l=0;
          l<i.length;
          l++) {
            var d=i[l],c=e("button","pc-cat-pill focusable",d.name);
            c._cat=d,c._idx=l,c._activate=function(e) {
              return function() {
                Bt(e)
              }
            }
            (d),c._onMove=function(e) {
              return function(a) {
                if("left"===a)return e>0&&s[e-1]&&(it(s[e-1]),Gn(t,s[e-1])),!0;
                if("right"===a)return e<s.length-1&&s[e+1]?(it(s[e+1]),Gn(t,s[e+1])):it(Ce),!0;
                if("up"===a)return $n(),!0;
                if("down"===a) {
                  var i=xe.querySelector(".pc-row-addon-promo");
                  if(i)return it(i),!0;
                  if(F.length)return Qn($.channel),!0
                }
                return!1
              }
            }
            (l),t.appendChild(c),s.push(c)
          }
          t._pills=s,Qe=n
        }
        for(var p=Lt||i[0],u=t._pills||[],v=0;
        v<u.length;
        v++) {
          var f=u[v];
          f._cat&&p&&f._cat.id===p.id?f.classList.add("is-selected"):f.classList.remove("is-selected")
        }
        if(o) {
          for(var h=null,g=0;
          g<u.length;
          g++)if(u[g]._cat&&u[g]._cat.id===o.id) {
            h=u[g];
            break
          }
          h&&($.focus!==h&&it(h),Gn(t,h))
        }
      }
    }
  }
  function Wn() {
    if(xe) {
      var e=xe.querySelector(".pc-categories"),t=e?e.querySelector(".pc-cat-pill.is-selected"):null;
      e&&t&&Gn(e,t)
    }
  }
  function $n() {
    if($e||($e=t("player-categories"),Xe=t("pcat-grid"),Ge=t("pcat-sub")),$e&&Xe) {
      $.categoryPickerOpen=!0,$e.classList.add("is-active"),Ga(),function() {
        if(!Xe)return;
        var t=kt&&kt.length?kt:[];
        a(Xe),Ge&&(Ge.textContent=t.length?t.length+" categorías · elige una para filtrar los canales":"Cargando categorías…");
        for(var i=0;
        i<t.length;
        i++)(function(t) {
          var a=e("div","pcat-tile focusable");
          a.appendChild(e("div","pcat-name",t.name)),Lt&&Lt.id===t.id&&a.classList.add("is-selected"),a._cat=t,a._activate=function() {
            Bt(t),Xn(!0);
            var e=xe?xe.querySelector(".pc-cat-pill.is-selected"):null;
            e?(it(e),Wn()):Tr()
          }
          ,Xe.appendChild(a)
        }
        )(t[i])
      }
      ();
      var i=Xe.querySelector(".pcat-tile.is-selected")||nt(Xe);
      i&&it(i)
    }
  }
  function Xn(e) {
    if($e&&$.categoryPickerOpen&&($.categoryPickerOpen=!1,$e.classList.remove("is-active"),!e)) {
      var t=xe?xe.querySelector(".pc-cat-pill.is-selected"):null;
      t?(it(t),Wn()):"player"===$.screen&&Ce&&it(Ce)
    }
  }
  function Gn(e,t) {
    if(e&&t) {
      var a=t.offsetLeft,i=t.offsetWidth,n=e.scrollLeft,r=e.clientWidth;
      a<n?e.scrollLeft=a-20:a+i>n+r&&(e.scrollLeft=a+i-r+20)
    }
  }
  function Qn(e) {
    F.length&&(e=Math.max(0,Math.min(F.length-1,Number(e)||0)),We[e]||Jn(e),We[e]&&it(We[e]))
  }
  function Jn(t) {
    if(xe) {
      var i=xe.querySelector(".pc-list");
      if(i) {
        if(a(i),We= {
        }
        ,Lt&&Lt.isAddon) {
          var n=e("div","pc-row-addon-promo focusable");
          n.appendChild(e("div","promo-icon","⚙️"));
          var o=e("div","promo-info");
          o.appendChild(e("div","promo-text","➕ Administrar Addons y Listas M3U")),o.appendChild(e("div","promo-sub","Instala listas recomendadas o agrega tu enlace")),n.appendChild(o),n._activate=function() {
            $t()
          }
          ,n._onMove=function(e) {
            if("up"===e) {
              var t=xe.querySelector(".pc-cat-pill.is-selected")||xe.querySelector(".pc-cat-pill");
              return t&&it(t),!0
            }
            return"down"===e?(F.length&&Qn(0),!0):"right"===e&&(it(Ce),!0)
          }
          ,i.appendChild(n)
        }
        if(!F.length) {
          var s=e("div","pc-empty-channels","No hay canales disponibles en esta categoría");
          return s.style.padding="30px",s.style.color="#888",s.style.fontSize="20px",void i.appendChild(s)
        }
        t=Number(t),isFinite(t)||(t=$.channel),t=Math.max(0,Math.min(F.length-1,t||0));
        for(var l=Math.max(0,t-Math.floor(Je/2)),d=Math.min(F.length,l+Je),c=l=Math.max(0,d-Je);
        c<d;
        c++) {
          var p=e("div","pc-row focusable");
          p._channel=c;
          var u=e("div","ic");
          F[c].logo&&(u.style.backgroundImage="url("+F[c].logo+")",u.style.backgroundSize="contain",u.style.backgroundRepeat="no-repeat",u.style.backgroundPosition="center");
          var v=e("div","num",r(F[c].index||c+1)),f=e("div","nm",F[c].name),h=e("div","epg",F[c].now||"En vivo");
          p.appendChild(u),p.appendChild(v),p.appendChild(f),p.appendChild(h),c===$.channel&&p.classList.add("is-current"),p._activate=function(e) {
            return function() {
              Wt(e,!0),Tr(),it(Ce)
            }
          }
          (c),p._onMove=function(e) {
            return function(t) {
              if("right"===t)return it(Ce),!0;
              if("up"===t) {
                if(e>0)Qn(e-1);
                else if(0===e) {
                  var a=xe.querySelector(".pc-row-addon-promo");
                  if(a)it(a);
                  else {
                    var i=xe.querySelector(".pc-cat-pill.is-selected")||xe.querySelector(".pc-cat-pill");
                    i&&it(i)
                  }
                }
                return!0
              }
              return"down"===t&&(e<F.length-1&&Qn(e+1),!0)
            }
          }
          (c),i.appendChild(p),We[c]=p
        }
      }
    }
  }
  var Kn="",Yn="",Zn=0,er="",tr=0,ar=0,ir=null,nr=null;
  function rr() {
    nr&&(clearTimeout(nr),nr=null)
  }
  function or(e) {
    nr||$.streamError||(nr=setTimeout(function() {
      nr=null,!$.streamError&&Se&&!Se.paused&&Se.readyState<3&&mr(e)
    }
    ,700))
  }
  var sr=!1,lr=null;
  function dr() {
    sr=!1,lr&&(clearTimeout(lr),lr=null)
  }
  function cr() {
    if(ir=null,Se&&ar) {
      if(er) {
        if(sr)return void(ar=0);
        sr=!0;
        var e=tr+(Se.currentTime||0),t=Math.max(0,e+ar);
        ar=0;
        var a=$.playerItem&&$.playerItem.duration||Se.duration||0;
        a>0&&t>a-2&&(t=Math.max(0,a-2)),tr=Math.floor(t);
        var i=er+"?start="+tr;
        return lr=setTimeout(dr,12e3),void yr(i)
      }
      var n=(Se.currentTime||0)+ar;
      ar=0;
      var r=Se.duration||0;
      n<0&&(n=0),r>0&&n>r-1&&(n=r-1);
      try {
        Se.currentTime=n
      }
      catch(e) {
      }
    }
    else ar=0
  }
  function ja(e) {
    Se&&(ar+=e,ir&&clearTimeout(ir),ir=setTimeout(cr,800),za(e>0?"fwd":"rew"),setTimeout(function() {
      za("none")
    }
    ,600))
  }
  function pr() {
    return Se?er?tr+(Se.currentTime||0):Se.currentTime||0:0
  }
  function ur() {
    var e=Se&&isFinite(Se.duration)&&Se.duration>0?Se.duration:0;
    return!e&&$.playerEpisode&&$.playerEpisode.duration&&(e=Ua($.playerEpisode.duration)),!e&&$.playerItem&&$.playerItem.duration&&(e=Ua($.playerItem.duration)),e||0
  }
  function vr(e) {
    if(Ke) {
      var t=Ye,a=pr();
      Ke=!1,De&&De.classList.remove("is-scrubbing"),e&&Math.abs(t-a)>=1&&ja(t-a),Va(pr(),ur()),it(Ce),$a()
    }
  }
  function fr() {
    var e=ur();
    De&&e?(Ye=Math.max(0,Math.min(e-1,pr())),Ke=!0,De.classList.add("is-scrubbing"),Xa(),$.infoTimer&&(clearTimeout($.infoTimer),$.infoTimer=null),Va(Ye,e),it(De)):Xa()
  }
  function hr(e) {
    var t=ur();
    if(Ke&&t) {
      var a=Math.max(60,Math.min(300,Math.round(.05*t)));
      Va(Ye=Math.max(0,Math.min(t-1,Ye+e*a)),t)
    }
  }
  var hlsPlayer=null,nativeFallbackSrc="";
  function gr() {
    "vod"===$.playerMode&&Se&&Fi(er?tr+(Se.currentTime||0):Se.currentTime||0,Se&&isFinite(Se.duration)&&Se.duration>0?Se.duration:Ua($.playerEpisode&&$.playerEpisode.duration||$.playerItem&&$.playerItem.duration||0),!0);
    if(hlsPlayer) {
      try {
        hlsPlayer.stopLoad(),hlsPlayer.detachMedia(),hlsPlayer.destroy()
      }
      catch(e) {
      }
      hlsPlayer=null
    }
    $.streamError="",rr(),mr(""),za("none"),Fa(),ir&&(clearTimeout(ir),ir=null,ar=0),dr(),er="",tr=0,Zn++;
    var e=Kn;
    if(!e&&Yn&&-1!==Yn.indexOf("127.0.0.1")) {
      var t=/^(http:\/\/127\.0\.0\.1:\d+)/.exec(Yn);
      t&&(e=t[1])
    }
    // No llamar a /abortMedia aquí: se lanzaba en paralelo con el nuevo
    // Se.src y mataba la conexión recién abierta (race). El relay corta el
    // ffmpeg/proxy anterior al recibir la nueva petición.
    if(Yn="",Kn="",Se) {
      Se.onerror=null,Se.onwaiting=null,Se.onstalled=null,Se.onloadeddata=null,Se.oncanplay=null,Se.onloadedmetadata=null,Se.ondurationchange=null,Se.onplaying=null,Se.onended=null,Se.ontimeupdate=null,Se.onpause=null,Se.onplay=null;
      try {
        Se.pause()
      }
      catch(e) {
      }
      try {
        Se.currentTime=0
      }
      catch(e) {
      }
      Se.removeAttribute("src");
      try {
        Se.src=""
      }
      catch(e) {
      }
      for(;
      Se.firstChild;
      )Se.removeChild(Se.firstChild);
      Se.classList.remove("is-active"),_e&&(_e.style.display="block")
    }
  }
  function mr(e) {
    ke||(ke=t("player-status")),ke&&(e?(ke.textContent=e,ke.classList.add("is-active")):(ke.textContent="",ke.classList.remove("is-active")))
  }
  function yr(e,t) {
    if(Se&&e) {
      var a=!!(t=t|| {
      }
      ).nativeHls;
      gr(),Yn=e;
      var i=/^(http:\/\/127\.0\.0\.1:\d+)/.exec(e);
      if(i&&(Kn=i[1]),-1!==e.indexOf(":8787/s/")) {
        er=e.split("?")[0];
        var n=/[?&]start=(\d+)/.exec(e);
        tr=n?parseInt(n[1],10):0
      }
      else er="",tr=0;
      mr("Conectando con el vídeo…"),$.streamError="";
      try {
        Se.preload="auto"
      }
      catch(e) {
      }
      var r=$.playerItem&&$.playerItem.streamMime||"",o=-1!==e.indexOf(".m3u8")||-1!==r.indexOf("mpegurl")||!(!$.playerItem||!$.playerItem.isHls),s=o?"application/vnd.apple.mpegurl":-1!==e.indexOf(".mp4")||-1!==r.indexOf("mp4")?"video/mp4":"video/mp2t",useHls=!!((o||t&&t.forceHls)&&window.Hls&&Hls.isSupported());
      window.__xuperDiag= {
        mode:$.playerMode,engine:useHls?"hls.js":"native",mime:s,isHls:o,readyState:0,networkState:0,error:null,hlsEvents:[]
      }
      ;
      Se.onerror=function() {
        Tn(),dr();
        var t=Se.error&&Se.error.code;
        window.__xuperDiag&&(window.__xuperDiag.error=t,window.__xuperDiag.readyState=Se.readyState,window.__xuperDiag.networkState=Se.networkState);
        // Mientras hls.js tenga reintentos, dejar que su recuperacion de
        // red/media controle el error en vez de abortar el <video>.
        if(useHls&&hlsPlayer&&hlsErrors<2)return;
        // VOD TS nativo (Tizen soporta HEVC/H.264 dentro de MPEG-TS): si el
        // decodificador nativo lo rechaza, reintentar el mismo token como HLS.
        if(4===t&&"vod"===$.playerMode&&!useHls&&$.playerItem&&$.playerItem.hlsPath&&nativeFallbackSrc!==e) {
          return nativeFallbackSrc=e,void yr($.playerItem.hlsPath, {
            forceHls:!0
          })
        }
        if(4===t&&"vod"===$.playerMode&&"normal"===$.streamMode&&$.playerItem&&window.__XUPER_RELAY_INFO&&window.__XUPER_RELAY_INFO.relayAvailable) {
          var n=$.playerItem,r=ln(n)||an(n);
          if(tn!==r)return tn=r,$.streamMode="smooth",mr("Reintentando película en modo compatible…"),void setTimeout(function() {
            "vod"===$.playerMode&&$.playerItem===n&&"smooth"===$.streamMode&&Vn()
          }
          ,0)
        }
        $.streamError="No se pudo abrir el stream (código "+(t||"error")+")",Se.classList.remove("is-active"),_e&&(_e.style.display="block"),mr($.streamError)
      }
      ,Se.onloadeddata=v,Se.oncanplay=function() {
        window.__xuperDiag&&(window.__xuperDiag.readyState=Se.readyState,window.__xuperDiag.networkState=Se.networkState),dr(),v()
      }
      ,Se.onloadedmetadata=function() {
        if(v(),"vod"===$.playerMode&&"normal"===$.streamMode) {
          var e=$.playerItem&&$.playerItem.streamAudioInfo,t=Ti?Ii:cn(e);
          Bn(t)&&(Ii=t)
        }
        if("vod"===$.playerMode) {
          var a=er?tr:Se.currentTime||0,i=Se&&isFinite(Se.duration)&&Se.duration>0?Se.duration:0,n=$.playerEpisode&&$.playerEpisode.duration?Ua($.playerEpisode.duration):0,r=$.playerItem&&$.playerItem.duration?Ua($.playerItem.duration):0;
          Va(a,i||n||r||0)
        }
      }
      ,Se.ondurationchange=function() {
        if("vod"===$.playerMode) {
          var e=er?tr+(Se.currentTime||0):Se.currentTime||0,t=Se&&isFinite(Se.duration)&&Se.duration>0?Se.duration:0,a=$.playerEpisode&&$.playerEpisode.duration?Ua($.playerEpisode.duration):0,i=$.playerItem&&$.playerItem.duration?Ua($.playerItem.duration):0;
          Va(e,t||a||i||0)
        }
      }
      ,Se.onplaying=function() {
        window.__xuperDiag&&(window.__xuperDiag.readyState=Se.readyState,window.__xuperDiag.networkState=Se.networkState,window.__xuperDiag.error=null),Tn(),v()
      }
      ,Se.onended=function() {
        "vod"===$.playerMode&&En()
      }
      ,Se.ontimeupdate=function() {
        if(Se.currentTime>0&&v(),"vod"===$.playerMode) {
          var e=er?tr+(Se.currentTime||0):Se.currentTime||0,t=Se&&isFinite(Se.duration)&&Se.duration>0?Se.duration:0,a=$.playerEpisode&&$.playerEpisode.duration?Ua($.playerEpisode.duration):0,i=$.playerItem&&$.playerItem.duration?Ua($.playerItem.duration):0,n=t||a||i||0;
          Va(e,n),Yi(e),Fi(e,n)
        }
      }
      ,Se.onpause=function() {
        (Fa(),"vod"===$.playerMode)&&(Fi(er?tr+(Se.currentTime||0):Se.currentTime||0,Se&&isFinite(Se.duration)&&Se.duration>0?Se.duration:Ua($.playerEpisode&&$.playerEpisode.duration||$.playerItem&&$.playerItem.duration||0),!0),za("pause"))
      }
      ,Se.onplay=function() {
        "vod"===$.playerMode&&(za("none"),Fa(),Ba=setInterval(function() {
          if("player"===$.screen&&"vod"===$.playerMode&&Se&&!Se.paused) {
            var e=er?tr+(Se.currentTime||0):Se.currentTime||0,t=Se&&isFinite(Se.duration)&&Se.duration>0?Se.duration:0,a=$.playerEpisode&&$.playerEpisode.duration?Ua($.playerEpisode.duration):0,i=$.playerItem&&$.playerItem.duration?Ua($.playerItem.duration):0,n=t||a||i||0;
            Va(e,n),Yi(e),Fi(e,n)
          }
        }
        ,500))
      }
      ,Se.onwaiting=function() {
        or("Cargando vídeo…")
      }
      ,Se.onstalled=function() {
        or("Conectando…")
      }
      ;
      for(;
      Se.firstChild;
      )Se.removeChild(Se.firstChild);
      try {
        Se.removeAttribute("src")
      }
      catch(e) {
      }
      try {
        Se.mediaOption=null
      }
      catch(e) {
      }
      // Tizen no reproduce manifiestos HLS en <video> de forma fiable (error 4).
      // hls.js los convierte a MSE, que si soporta el motor de la TV.
      if(useHls) {
        try {
          var hlsErrors=0,h=new Hls( {
            enableWorker:!1,lowLatencyMode:!1,backBufferLength:15,maxBufferLength:20,maxMaxBufferLength:30,maxBufferHole:.5,liveSyncDurationCount:3,liveMaxLatencyDurationCount:8,manifestLoadingTimeOut:1e4,manifestLoadingMaxRetry:2,levelLoadingTimeOut:1e4,fragLoadingTimeOut:15e3,fragLoadingMaxRetry:3
          }
          );
          hlsPlayer=h,h.on(Hls.Events.MEDIA_ATTACHED,function() {
            window.__xuperDiag&&window.__xuperDiag.hlsEvents.push("MEDIA_ATTACHED");
            if(hlsPlayer===h&&e)try {
              h.loadSource(e)
            }
            catch(t) {
              hlsPlayer===h&&($.streamError="No se pudo abrir el flujo HLS",mr($.streamError))
            }
          }
          ),h.on(Hls.Events.MANIFEST_PARSED,function() {
            window.__xuperDiag&&window.__xuperDiag.hlsEvents.push("MANIFEST_PARSED");
            if(hlsPlayer!==h)return;
            hlsErrors=0;
            try {
              var e=Se.play();
              e&&e.catch&&e.catch(function() {
                Se.error||($.streamError="Pulsa OK para iniciar la reproducción",mr($.streamError))
              }
              )
            }
            catch(e) {
            }
          }
          ),h.on(Hls.Events.ERROR,function(e,t) {
            window.__xuperDiag&&window.__xuperDiag.hlsEvents.push("ERR:"+(t&&t.details||"unknown"));
            if(hlsPlayer!==h||!t||!t.fatal)return;
            if(t.type===Hls.ErrorTypes.NETWORK_ERROR&&hlsErrors<2)return hlsErrors++,void h.startLoad();
            if(t.type===Hls.ErrorTypes.MEDIA_ERROR&&hlsErrors<2)return hlsErrors++,void h.recoverMediaError();
            $.streamError="No se pudo reproducir el flujo (HLS: "+(t.details||"error")+")",Se.classList.remove("is-active"),_e&&(_e.style.display="block"),mr($.streamError)
          }
          ),h.attachMedia(Se)
        }
        catch(t) {
          useHls=!1;
          try {
            Se.src=e
          }
          catch(e) {
          }
        }
      }
      else try {
        Se.src=e
      }
      catch(e) {
      }
      Se.classList.add("is-active"),_e&&(_e.style.display="none");
      if(!useHls)try {
        // Solo en reproduccion nativa: tocar currentTime con un MediaSource
        // cerrado (hls.js aun no ha parseado el manifiesto) rompe MSE en Tizen.
        Se.currentTime=0,Se.load();
        var u=Se.play();
        u&&u.catch&&u.catch(function() {
          Se.error||($.streamError="Pulsa OK para iniciar la reproducción",mr($.streamError))
        }
        )
      }
      catch(e) {
        $.streamError="Pulsa OK para iniciar la reproducción",mr($.streamError)
      }
    }
    function v() {
      rr(),mr("")
    }
  }
  function br(e,t) {
    var a=Zn;
    function i() {
      var i= {
        contentId:e.id
      }
      ;
      i.playbackMode=$.streamMode,i.forceRelay="smooth"===$.streamMode||"relay"===$.streamMode,i.trackIndex=$.trackIndex||0;
      var n=$.playerEpisode,r=n&&n.id||e&&e.id||"",o=$i[r]||$i[ln(e)],s=o&&o.audio||n&&n.streamAudioInfo||e.streamAudioInfo||"";
      if(Ii=Ti?Math.max(0,Number(Ii)||0):cn(s),i.audioTrack=Ii||0,S(e)) {
        var l=$.playerEpisode,d=e.seasonId||e.id;
        if(l&&l.id)i.contentId=l.id,i.seriesContentId=d;
        else {
          if(!e.episodes||!e.episodes.length)return t("");
          $.playerEpisode=e.episodes[0],i.contentId=e.episodes[0].id,i.seriesContentId=d
        }
      }
      O(i.forceRelay?"resolveSmooth":"resolve",i,function(i,n) {
        if(a===Zn) {
          if(i||!n||!1===n.returnValue)return $.streamError="No se pudo resolver el título"+(i?": "+i:""),mr($.streamError),t("");
          D("vod",n),e.streamMime=n.mime||"",e.streamCodec=n.codec||"",n.duration>0?(e.duration=n.duration,$.playerEpisode&&($.playerEpisode.duration=n.duration)):e.duration=e.duration||0,e.subtitles=n.subtitles||[],e.streamAudioInfo=n.audio||e.streamAudioInfo||"",$.playerEpisode&&($.playerEpisode.streamAudioInfo=n.audio||""),e.isHls=!!n.isHls,e.hlsPath=n.hlsPath||"",!Ti&&n.audio&&(Ii=cn(n.audio));
          var r= {
            audio:n.audio||e.streamAudioInfo,subtitles:e.subtitles,tracks:n.availableTracks||[],selected:n.selectedTrack|| {
            }
            ,duration:n.duration||0
          }
          ;
          $i[ln(e)]=r,un(r);
          try {
            window.__xuperStreamInfo= {
              selectedTrack:n.selectedTrack|| {
              }
              ,availableTracks:n.availableTracks||[]
            }
          }
          catch(e) {
          }
          t(n.proxyPath||n.url||"")
        }
      }
      )
    }
    if(S(e)&&!$.playerEpisode&&(!e.episodes||!e.episodes.length)&&!e._detailsLoaded)return mr("Cargando capítulos…"),void B(e,function() {
      a===Zn&&i()
    }
    );
    i()
  }
  function Cr(e,t) {
    if(Se) {
      t&&($.playerEpisode=t,$.playerSeasonIndex=$.detailSeason||0),e&&($.playerItem=e);
      var a=e||$.playerItem;
      if(a&&nn(a),gr(),a) {
        Ti=!1,Ii=0;
        var i=t||$.playerEpisode,n=i&&i.id||a&&a.id||"",r=n?$i[n]:null,o=r&&r.audio||i&&i.streamAudioInfo||"";
        if(a._portal&&!Ti&&!o) {
          var s=!1,l=Zn,d=function() {
            if(!s&&l===Zn) {
              s=!0;
              var e=t&&(t.number||t.seriesNumber)||"";
              mr(e?"Cargando capítulo "+e+"…":"Cargando capítulo…"),br(a,function(e) {
                e?yr(e):$.streamError||mr("Sin fuente de reproducción")
              }
              )
            }
          }
          ;
          return setTimeout(d,2500),void dn(a,function(e) {
            d()
          }
          )
        }
        if(a._portal) {
          var c=t&&(t.number||t.seriesNumber)||"";
          return mr(c?"Cargando capítulo "+c+"…":"Cargando capítulo…"),void br(a,function(e) {
            e?yr(e):$.streamError||mr("Sin fuente de reproducción")
          }
          )
        }
        a.streamUrl&&yr(a.streamUrl)
      }
    }
  }
  function wr(e,a) {
    Ce||zn();
    var i=!a||!$.playerEpisode||$.playerEpisode===a||$.playerEpisode.id===a.id,n="detail"===$.screen&&Se&&!!Se.src&&$.playerItem===e&&i;
    $.playerMode="vod",e&&$.playerItem!==e&&on(),e&&($.playerItem=e),a&&($.playerEpisode=a),e&&nn(e),$.playerReturn= {
      screen:"detail",focus:$.focus
    }
    ;
    var r=t("screen-player"),o=t("screen-detail");
    r&&(r.classList.remove("is-mini"),r.classList.add("is-active")),o&&o.classList.remove("is-active"),$.screen="player",Ce.classList.add("is-vod"),Lr(),it(Ce),Qa(),n||Cr($.playerItem,$.playerEpisode)
  }
  function xr(e,t,a) {
    "vod"!==e||"detail"!==$.screen?(Ce||zn(),"live"===e&&Ht(),$.playerMode=e,t&&$.playerItem!==t&&on(),$.playerItem=t||null,$.playerEpisode=a||null,"vod"===e&&t&&nn(t),$.playerReturn= {
      screen:$.screen,focus:$.focus
    }
    ,$.channelsOpen=!1,we.classList.remove("is-active"),xe.classList.remove("is-active"),Ce.classList.toggle("is-vod","vod"===e),Lr(),ot("player"),it(Ce),Lr(),"vod"===e?(Qa(),Cr($.playerItem,$.playerEpisode)):(Xa(),kr(F[$.channel]))):wr(t,a)
  }
  var Sr=0,_r=null;
  function kr(e,t) {
    if(_r&&(clearTimeout(_r),_r=null),e||(e=F[$.channel]),e&&(e.channelCode||e.streamUrl)) {
      var a=function() {
        var t=++Sr;
        mr("Cargando señal "+(e.name||"")+"…"),O("resolveLive",e.streamUrl? {
          streamUrl:e.streamUrl
        }
        : {
          channelCode:e.channelCode
        }
        ,function(e,a) {
          if(t===Sr) {
            if(e||!a||!1===a.returnValue)return $.streamError="No se pudo conectar con la señal"+(e?": "+e:""),void mr($.streamError);
            D("live",a);
            var i=a.proxyPath||a.url;
            if(!i)return $.streamError="Señal no disponible",void mr($.streamError);
            mr(""),Xa(),yr(i)
          }
        }
        )
      }
      ;
      t?a():_r=setTimeout(a,180)
    }
  }
  function Lr() {
    var e="live"===$.playerMode,t=F[$.channel]|| {
    }
    ,a=we.querySelector(".pi-index"),i=we.querySelector(".pi-name"),n=we.querySelector(".pi-date"),o=we.querySelector(".pi-range"),s=we.querySelector(".pi-now"),d=we.querySelector(".pi-next"),c=we.querySelector(".pi-uhd"),p=we.querySelector(".pi-logo");
    if(e)Me&&Me.classList.remove("is-active"),we&&(we.style.display=""),a.style.display="block",a.textContent=r(t.index||$.channel+1),i.textContent=t.name||"",function() {
      var e=we.querySelector(".pi-namerow");
      if(!e)return;
      we.querySelector(".pi-index");
      var t=e.querySelector(".pi-name"),a=e.querySelector(".pi-uhd"),i=165;
      e.style.position="absolute",e.style.left=367.5+i+"px",e.style.top="13.5px",e.style.width="480px",e.style.height="58px",e.style.display="block",t.style.position="absolute",t.style.left="0px",t.style.top="8px",t.style.width="480px",t.style.height="50px",t.style.lineHeight="50px",a&&(a.style.left=t.offsetWidth+30+"px",a.style.top="18.5px")
    }
    (),n.textContent="Hoy",o.textContent=t.time||"",s.style.display="block",s.textContent=t.now||"En vivo",d.style.display=t.next?"block":"none",t.next&&(d.textContent="Siguiente: "+t.next),c.style.display=t.uhd?"block":"none",p.style.display="block",p&&(t.logo?p.style.backgroundImage="url("+t.logo+")":p.style.backgroundImage="");
    else {
      we&&(we.classList.remove("is-active"),we.style.display="none");
      var u=$.playerItem||l[0];
      if(Te)if(S(u)&&$.playerEpisode) {
        var v=$.playerEpisode.title||$.playerEpisode.name,f=$.playerEpisode.number||$.playerEpisode.seriesNumber,h=v||(f?"Capítulo "+f:"");
        Te.textContent=h?u.title+" - "+h:u.title
      }
      else Te.textContent=u.title;
      Ie&&(Ie.src=u.poster||u.cover||"assets/original/common/bg_placehoder_vertical.png"),Va(Se?Se.currentTime:0,Se?Se.duration:0)
    }
    for(var g in We)We.hasOwnProperty(g)&&We[g].classList.toggle("is-current",We[g]._channel===$.channel);
    Mr()
  }
  function Mr() {
    var e=we.querySelector(".pi-quality"),t=we.querySelector(".pi-scale"),a=we.querySelector(".pi-func");
    e&&t&&a&&(e.style.left="517.5px",t.style.left=e.offsetLeft+e.offsetWidth+30+"px",a.style.left=t.offsetLeft+t.offsetWidth+30+"px")
  }
  function Ir() {
    if("live"===$.playerMode) {
      $.channelsOpen=!0,xe.classList.add("is-active"),jn(),Jn($.channel),Wn();
      var e=We[$.channel];
      if(e) {
        it(e);
        var t=e.parentNode,a=111*$.channel;
        (a<t.scrollTop||a+109.5>t.scrollTop+t.clientHeight)&&(t.scrollTop=Math.max(0,a-120))
      }
    }
  }
  function Tr() {
    $.channelsOpen=!1,xe.classList.remove("is-active"),"player"===$.screen&&it(Ce)
  }
  function Er() {
    var e=t("app");
    if(e) {
      var a=function() {
        var e=window.innerWidth||document.documentElement&&document.documentElement.clientWidth||0,t=window.innerHeight||document.documentElement&&document.documentElement.clientHeight||0;
        e&&t||(e=1920,t=1080);
        var a=Math.floor(screen&&screen.width||0),i=Math.floor(screen&&screen.height||0),n=e/t,r=a&&i?a/i:0;
        return a>=2560&&a>=1.25*e&&i>=1.25*t&&Math.abs(n-r)<.03&&(e=a,t=i), {
          w:e,h:t,panel:a>0&&i>0? {
            w:a,h:i
          }
          :null
        }
      }
      (),i=a.w,n=a.h,r=Math.min(i/1920,n/1080);
      (!isFinite(r)||r<=0)&&(r=1),r=Math.round(1e4*r)/1e4;
      var o=Math.max(0,Math.round((i-1920*r)/2)),s=Math.max(0,Math.round((n-1080*r)/2));
      e.style.left=o+"px",e.style.top=s+"px",e.style.webkitTransform="scale("+r+")",e.style.transform="scale("+r+")",window.__xuperViewport= {
        w:i,h:n,scale:r,panelW:a.panel?a.panel.w:0,panelH:a.panel?a.panel.h:0
      }
    }
  }
  function qr() {
    var e,a;
    Er(),window.addEventListener("resize",Er,!1),window.addEventListener("orientationchange",Er,!1),document.addEventListener("visibilitychange",Er,!1),setTimeout(Er,250),setTimeout(Er,1200),setTimeout(Er,3e3),document.addEventListener("keydown",ct,!1),document.addEventListener("keyup",function(e) {
      461!==(e.keyCode||e.which)&&"Back"!==e.key&&"GoBack"!==e.key||ct(e)
    }
    ,!1),window.addEventListener("popstate",function() {
      lt()
    }
    ,!1),document.addEventListener("click",function(e) {
      var t=n(e.target,".focusable");
      t&&(it(t,!0),t._activate&&t._activate())
    }
    ),la(),function() {
      if(T()) {
        var e=p.serviceId||"com.webosflux.xuptertv.fidelity.service";
        try {
          window.webOS.service.request("luna://"+e, {
            method:"keepAlive",parameters: {
              subscribe:!0
            }
            ,resubscribe:!0,onSuccess:function() {
            }
            ,onFailure:function() {
            }
          }
          )
        }
        catch(e) {
        }
        setInterval(function() {
          try {
            window.webOS.service.request("luna://"+e, {
              method:"heartbeat",parameters: {
              }
              ,onSuccess:function() {
              }
              ,onFailure:function() {
              }
            }
            )
          }
          catch(e) {
          }
        }
        ,15e3)
      }
    }
    (),e=t("welcome-loading-img"),a=1,Ze=setInterval(function() {
      ++a>16?pt():e.src="assets/original/welcome/img_welcome_loading"+a+".png"
    }
    ,250),H(),Vt(),window.__xuper= {
      version:"4.34.4",state:$,vod:l,channels:F,api:v,portal:f,service:O,refreshPortal:A,reloadVod:H,skipWelcome:pt,show:function(e) {
        "home"===e?pt():"detail"===e?aa(l[0]):"search"===e?ca():"settings"===e?xa():"player"===e?xr("live"):ot(e)
      }
      ,selectTab:function(e) {
        pt(),mt(e,!0)
      }
      ,openDetail:function(e) {
        aa(l[e]||l[0])
      }
      ,openSearch:ca,openSettings:xa,openPlayer:function(e,t) {
        xr(e||"live",l[t]||null)
      }
      ,focus:function(e) {
        var t="string"==typeof e?document.querySelector(e):e;
        t&&it(t)
      }
      ,key:function(e) {
        ct( {
          keyCode:e,preventDefault:function() {
          }
        }
        )
      }
      ,search:function(e) {
        ca(),fa(e)
      }
      ,settingsPanel:function(e) {
        xa(),Sa(e,!0)
      }
    }
    ,function() {
      var e=String(location.search||"").replace(/^\?/,"");
      if(!e)return;
      for(var t= {
      }
      ,a=e.split("&"),i=0;
      i<a.length;
      i++)if(a[i]) {
        var n=a[i].split("=");
        t[decodeURIComponent(n[0])]=decodeURIComponent(n.slice(1).join("=")||"")
      }
      if(void 0!==t.ch) {
        var r=parseInt(t.ch,10)||0;
        $.channel=Math.max(0,Math.min(F.length-1,r))
      }
      var o=t.screen||"home";
      if("welcome"===o)return;
      pt(),void 0!==t.tab?mt(parseInt(t.tab,10)||0,!0):(mt(0,!1),it(ne));
      "detail"===o?aa(l[parseInt(t.vod,10)||0]):"search"===o?(ca(),t.q&&fa(t.q)):"settings"===o?(xa(),void 0!==t.panel&&Sa(parseInt(t.panel,10)||0,!0)):"player"===o&&(xr("vod"===t.mode?"vod":"live",l[parseInt(t.vod,10)||0]),"1"===t.channels&&Ir());
      if(t.focus) {
        var s=document.querySelector(t.focus);
        s&&it(s)
      }
    }
    ()
  }
  function Dr() {
    gr(),ha()
  }
  window.addEventListener("beforeunload",Dr),window.addEventListener("unload",Dr),document.addEventListener("visibilitychange",function() {
    document.hidden&&Dr()
  }
  ),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",qr):qr()
}
();
