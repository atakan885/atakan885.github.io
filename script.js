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

(function(){
 const button=document.getElementById('theme-toggle');
 if(!button)return;
 const root=document.documentElement;
 const german=root.lang==='de';
 function sync(){
  const dark=root.dataset.theme==='dark';
  button.setAttribute('aria-pressed',String(dark));
  const label=german?(dark?'Hellmodus aktivieren':'Dunkelmodus aktivieren'):(dark?'Enable light mode':'Enable dark mode');
  button.setAttribute('aria-label',label);button.title=label;
  button.querySelector('[aria-hidden]').textContent=dark?'☀':'☾';
  button.querySelector('.theme-label').textContent=german?(dark?'Hell':'Dunkel'):(dark?'Light':'Dark');
 }
 button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('portfolio-theme',root.dataset.theme);}catch(e){}sync();});
 const system=window.matchMedia('(prefers-color-scheme: dark)');
 if(system.addEventListener)system.addEventListener('change',event=>{let saved;try{saved=localStorage.getItem('portfolio-theme');}catch(e){}if(saved!=='dark'&&saved!=='light'){root.dataset.theme=event.matches?'dark':'light';sync();}});
 sync();
})();
