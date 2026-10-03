'use strict';
// Keep one expanded implementation panel at a time when more case studies are added.
document.querySelectorAll('details').forEach(panel=>panel.addEventListener('toggle',()=>{if(panel.open)document.querySelectorAll('details').forEach(other=>{if(other!==panel)other.open=false;});}));
