// Boot: wire modules and load the default specimen.

import { initSearch, loadByName } from "./search.js";
import { cycleStyle, toggleSpin, recenter } from "./viewer.js";
import { initLists } from "./lists.js";
import { initFullscreen } from "./fullscreen.js";

function initControls(){
  document.getElementById("spinBtn").addEventListener("click", toggleSpin);
  document.getElementById("styleBtn").addEventListener("click", cycleStyle);
  document.getElementById("centerBtn").addEventListener("click", recenter);
}

function boot(){
  initSearch();
  initControls();
  initFullscreen();
  initLists();
  loadByName("Ipamorelin");
}

if(document.readyState === "loading"){
  window.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
