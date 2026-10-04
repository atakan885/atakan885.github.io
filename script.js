'use strict';
// Keep one expanded implementation panel at a time when more case studies are added.
document.querySelectorAll('details').forEach(panel=>panel.addEventListener('toggle',()=>{if(panel.open)document.querySelectorAll('details').forEach(other=>{if(other!==panel)other.open=false;});}));

// Preserve the current section and remember an explicitly chosen language.
(function(){
 const current=document.documentElement.lang;
 document.querySelectorAll('[data-language]').forEach(link=>{
  const target=link.getAttribute('href');
  link.addEventListener('click',()=>{
   try{localStorage.setItem('portfolio-language',link.dataset.language);}catch(e){}
   link.href=target+window.location.hash;
  });
 });
 // Explicit language pages remain shareable; only the root entry follows a saved preference.
 if(current==='en' && !window.location.pathname.endsWith('/index.html')){
  try{if(localStorage.getItem('portfolio-language')==='de')window.location.replace('de.html'+window.location.hash);}catch(e){}
 }
})();
