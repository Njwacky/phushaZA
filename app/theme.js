/* Pusha — theme boot.
   Loaded synchronously in <head> so the page never flashes the wrong colour
   scheme before the stylesheet paints. Deliberately tiny; no dependencies. */
try{var _t=localStorage.getItem("pusha_theme");_t=_t?JSON.parse(_t):(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",_t);}catch(e){document.documentElement.setAttribute("data-theme","light");}
