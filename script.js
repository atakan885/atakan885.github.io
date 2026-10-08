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
 if(current==='en' && window.location.pathname.endsWith('/')){
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

// Hide on downward scroll; show on upward scroll, keyboard focus or page top.
(function(){
 const header=document.querySelector('header');
 if(!header)return;
 let previous=Math.max(0,window.scrollY),distance=0,direction=0,pending=false;
 function show(){header.classList.remove('header-hidden');}
 function update(){
  pending=false;
  const y=Math.max(0,window.scrollY),delta=y-previous;
  previous=y;
  header.classList.toggle('header-scrolled',y>8);
  if(y<32){show();distance=0;direction=0;return;}
  if(!delta)return;
  const nextDirection=delta>0?1:-1;
  if(nextDirection!==direction){distance=0;direction=nextDirection;}
  distance+=Math.abs(delta);
  if(distance<12)return;
  if(direction<0||header.contains(document.activeElement))show();
  else if(y>header.offsetHeight+24)header.classList.add('header-hidden');
  distance=0;
 }
 window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
 header.addEventListener('focusin',show);
 window.addEventListener('pageshow',()=>{previous=Math.max(0,window.scrollY);distance=0;show();header.classList.toggle('header-scrolled',previous>8);});
})();

// Project navigation disclosure, usable by mouse, touch and keyboard.
(function(){
 const holder=document.querySelector('.project-menu');
 if(!holder)return;
 const button=holder.querySelector('.project-menu-toggle');
 const panel=holder.querySelector('.project-dropdown');
 function setOpen(open){button.setAttribute('aria-expanded',String(open));panel.hidden=!open;}
 button.addEventListener('click',()=>setOpen(panel.hidden));
 document.addEventListener('click',event=>{if(!holder.contains(event.target))setOpen(false);});
 holder.addEventListener('keydown',event=>{if(event.key==='Escape'){setOpen(false);button.focus();event.preventDefault();}});
 holder.addEventListener('focusout',event=>{if(!holder.contains(event.relatedTarget))setOpen(false);});
 panel.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{setOpen(false);if(link.getAttribute('href').includes('#'))button.blur();}));
})();

// Desktop hover reveals the overview; touch opens the project directly.
(()=>{
 const hover=window.matchMedia('(hover: hover) and (pointer: fine)');
 document.querySelectorAll('.flip-card').forEach(card=>{
  const front=card.querySelector('.flip-front'),back=card.querySelector('.flip-back');
  function show(value){
   card.classList.toggle('is-flipped',value);
   front.inert=value;back.inert=!value;
   front.setAttribute('aria-hidden',String(value));
   back.setAttribute('aria-hidden',String(!value));
  }
  card.addEventListener('pointerenter',()=>{if(hover.matches&&!card.contains(document.activeElement))show(true);});
  card.addEventListener('pointerleave',()=>{if(!card.contains(document.activeElement))show(false);});
  card.addEventListener('focusout',event=>{if(!card.contains(event.relatedTarget))show(false);});
  card.addEventListener('keydown',event=>{if(event.key==='Escape'){show(false);card.focus({preventScroll:true});}});
  hover.addEventListener('change',()=>show(false));
 });
})();

// Clicking the card surface opens its project; explicit controls keep their action.
document.querySelectorAll('.flip-card[data-project-url]').forEach(card=>{
 card.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.target.closest('a,button'))return;
  if(window.getSelection().toString().trim())return;
  const url=card.dataset.projectUrl;
  if(event.ctrlKey||event.metaKey)window.open(url,'_blank','noopener');
  else window.location.assign(url);
 });
});

// Whole-card links remain available to keyboard users.
document.querySelectorAll('.flip-card[data-project-url]').forEach(card=>{
 card.addEventListener('keydown',event=>{
  if(event.target===card&&event.key==='Enter'){event.preventDefault();window.location.assign(card.dataset.projectUrl);}
 });
});
