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

// Authored branching practice: no AI connection and no learner-data storage.
(()=>{
 const feedback={
 en:["This response explains the delay but does not acknowledge its impact or establish a clear next step. Try opening with recognition and a realistic commitment.","A strong starting point: acknowledge the gap, listen to the customer and agree an achievable next step. Follow through on that commitment.","A quick promise may reassure the customer, but an unverified commitment can create a second disappointment. Check what is achievable before promising a deadline."],
 de:["Diese Antwort erklärt die Verzögerung, erkennt deren Auswirkungen aber nicht an und legt keinen nächsten Schritt fest. Beginnen Sie mit Anerkennung und einer realistischen Zusage.","Ein guter Einstieg: Erkennen Sie die Lücke an, hören Sie zu und vereinbaren Sie einen erreichbaren nächsten Schritt. Halten Sie diese Zusage anschließend ein.","Eine schnelle Zusage kann beruhigen, aber ein ungeprüftes Versprechen kann erneut enttäuschen. Prüfen Sie, was möglich ist, bevor Sie einen Termin zusagen."]};
 document.querySelectorAll('.learning-demo').forEach(demo=>{
  const options=demo.querySelectorAll('[data-choice]'),output=demo.querySelector('.demo-feedback'),reset=demo.querySelector('.demo-reset');
  if(!reset)return;
  options.forEach(button=>{button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>{
   options.forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
   output.textContent=feedback[demo.dataset.demoLanguage][Number(button.dataset.choice)];reset.hidden=false;
  });});
  reset.addEventListener('click',()=>{output.textContent='';reset.hidden=true;options.forEach(option=>option.setAttribute('aria-pressed','false'));options[0].focus();});
 });
})();

// Keep the dropdown open while crossing from its trigger to the panel.
document.querySelectorAll('.project-menu').forEach(menu=>{
 const button=menu.querySelector('.project-menu-toggle'),panel=menu.querySelector('.project-dropdown');let closeTimer;
 menu.addEventListener('pointerenter',event=>{clearTimeout(closeTimer);if(event.pointerType==='mouse'){panel.hidden=false;button.setAttribute('aria-expanded','true');}});
 menu.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){closeTimer=setTimeout(()=>{if(!menu.matches(':hover')&&!menu.contains(document.activeElement)){panel.hidden=true;button.setAttribute('aria-expanded','false');}},220);}});
 panel.addEventListener('pointerenter',()=>clearTimeout(closeTimer));
});

// Interactive example gallery; all values are illustrative and local.
document.querySelectorAll('.demo-carousel').forEach(demo=>{
 const de=demo.dataset.demoLanguage==='de',panels=[...demo.querySelectorAll('.demo-panel')];let current=0;
 const back=demo.querySelector('[data-demo-nav="back"]'),next=demo.querySelector('[data-demo-nav="next"]');
 function navigate(index){current=index;panels.forEach((p,i)=>p.hidden=i!==current);back.disabled=current===0;next.disabled=current===panels.length-1;demo.querySelector('.demo-counter').textContent=`${current+1} / ${panels.length}`;if(document.activeElement.disabled)(current===0?next:back).focus();}
 back.addEventListener('click',()=>navigate(Math.max(0,current-1)));next.addEventListener('click',()=>navigate(Math.min(panels.length-1,current+1)));
 const incoming=demo.querySelector('[data-sim="incoming"]'),team=demo.querySelector('[data-sim="team"]');
 function simulate(){const demand=Number(incoming.value),people=Number(team.value),capacity=people*10,queue=Math.max(0,demand-capacity);
  demo.querySelector('[data-value="incoming"]').textContent=demand;demo.querySelector('[data-value="team"]').textContent=people;
  demo.querySelector('[data-meter="incoming"]').value=demand;demo.querySelector('[data-meter="capacity"]').value=capacity;
  demo.querySelector('.simulation-result').textContent=de?(queue?`${queue} unbearbeitete Anfragen pro Stunde. Erhöhen Sie die Kapazität oder reduzieren Sie das Volumen.`:capacity===demand?'Kapazität und Nachfrage sind gleich. Es gibt keinen Puffer für Schwankungen.':`${capacity-demand} Anfragen pro Stunde als Kapazitätspuffer.`):(queue?`${queue} unhandled requests per hour. Increase capacity or reduce incoming demand.`:capacity===demand?'Capacity matches demand. There is no buffer for variation.':`${capacity-demand} requests per hour of spare capacity.`);
 }
 incoming.addEventListener('input',simulate);team.addEventListener('input',simulate);simulate();
 let step=0;const buttons=[...demo.querySelectorAll('[data-step]')],feedback=demo.querySelector('.workflow-feedback'),progress=demo.querySelector('.workflow-progress');
 buttons.forEach(button=>button.addEventListener('click',()=>{
  if(Number(button.dataset.step)!==step){feedback.textContent=de?'Noch nicht. Zuerst die Frage definieren, dann die Datengrundlage prüfen, visualisieren und die Ergebnisse überprüfen.':'Not yet. Define the question first, then check the data, build the visual summary and review the findings.';return;}
  const li=document.createElement('li');li.textContent=button.textContent;progress.append(li);button.disabled=true;step++;
  feedback.textContent=step===4?(de?'Abgeschlossen: Der Ablauf verbindet ein klares Ziel mit geprüften Daten und überprüfbaren Ergebnissen.':'Complete: this workflow connects a clear purpose with checked data and reviewable findings.'):(de?'Richtig. Wählen Sie den nächsten Schritt.':'Correct. Choose the next step.');
 }));
 demo.querySelector('.workflow-reset').addEventListener('click',()=>{step=0;progress.replaceChildren();feedback.textContent='';buttons.forEach(b=>b.disabled=false);buttons[0].focus();});
});

// Evidence investigation and adaptive follow-up examples.
document.querySelectorAll('.demo-carousel').forEach(demo=>{
 const de=demo.dataset.demoLanguage==='de',seen=new Set();
 const clues=de?['Bestelleingang: 98 % der Bestellungen werden innerhalb von 5 Minuten bestätigt.','Verpackung: 40 Bestellungen pro Stunde treffen ein; das Team verpackt 25.','Abholung: Der Kurier kommt täglich pünktlich. Nicht verpackte Bestellungen bleiben zurück.']:['Order entry: 98% of orders are confirmed within 5 minutes.','Packing: 40 orders arrive per hour; the team packs 25.','Pickup: the courier arrives on time each day. Unpacked orders are left behind.'];
 demo.querySelectorAll('[data-clue]').forEach(b=>b.addEventListener('click',()=>{seen.add(Number(b.dataset.clue));b.setAttribute('aria-pressed','true');demo.querySelector('.clue-output').textContent=clues[Number(b.dataset.clue)];}));
 demo.querySelectorAll('[data-cause]').forEach(b=>b.addEventListener('click',()=>{
  demo.querySelector('.diagnosis-feedback').textContent=seen.size<3?(de?'Prüfen Sie zuerst alle drei Hinweise. Eine plausible Vermutung reicht noch nicht aus.':'Inspect all three clues first. A plausible guess is not enough yet.'):
  Number(b.dataset.cause)===1?(de?'Die Verpackung ist der erkennbare Engpass: 15 Bestellungen pro Stunde bleiben unbearbeitet. Prüfen Sie Kapazität und Ablauf, bevor Sie eine Lösung auswählen.':'Packing is the visible bottleneck: 15 orders per hour remain unhandled. Investigate capacity and workflow before selecting a remedy.'):(de?'Die Hinweise stützen diese Ursache nicht. Vergleichen Sie das eingehende Volumen mit der Verpackungskapazität.':'The evidence does not support this cause. Compare incoming demand with packing capacity.');
 }));
 const follow=demo.querySelector('.adaptive-followup');
 demo.querySelectorAll('[data-adapt]').forEach(b=>b.addEventListener('click',()=>{
  const advanced=b.dataset.adapt==='1';follow.hidden=false;demo.querySelector('.adaptive-feedback').textContent='';
  demo.querySelector('.adaptive-guidance').textContent=advanced?(de?'Gute Entscheidung. Überprüfen Sie Nachrichten über einen bekannten, unabhängigen Zugang. Jetzt folgt ein anspruchsvollerer Fall.':'Good choice. Verify messages through a known, independent route. Now try a more demanding case.'):(de?'Zeitdruck kann zum unüberlegten Klicken verleiten. Nutzen Sie einen bekannten Zugang statt eines ungeprüften Links. Üben Sie nun den nächsten Schritt.':'Urgency can prompt an unconsidered click. Use a known route instead of an unverified link. Now practise the next step.');
  demo.querySelector('.adaptive-question').textContent=advanced?(de?'Die Nachricht nennt Ihren Vorgesetzten. Was ändert das?':'The message names your manager. What does that change?'):(de?'Wie überprüfen Sie die Nachricht am besten?':'How should you verify the message?');
  const options=advanced?(de?['Der Name beweist die Echtheit.','Namen sind kein Beweis; über einen bekannten Kanal überprüfen.']:['The name proves it is authentic.','Names are not proof; verify through a known channel.']):(de?['Über das bekannte Portal oder einen offiziellen Kontakt.','Über die Telefonnummer in der verdächtigen Nachricht.']:['Through the known portal or an official contact.','Through the phone number in the suspicious message.']);
  const holder=demo.querySelector('.adaptive-options');holder.replaceChildren();
  options.forEach((text,i)=>{const option=document.createElement('button');option.type='button';option.textContent=text;option.addEventListener('click',()=>{const correct=i===(advanced?1:0);demo.querySelector('.adaptive-feedback').textContent=correct?(de?'Richtig: Ein unabhängiger, vertrauenswürdiger Kanal ist der entscheidende Prüfschritt.':'Correct: an independent, trusted channel is the key verification step.'):(de?'Versuchen Sie es erneut. Angaben in einer verdächtigen Nachricht können ebenfalls gefälscht sein.':'Try again. Details inside a suspicious message can also be fabricated.');});holder.append(option);});
 }));
 demo.querySelector('.adaptive-reset').addEventListener('click',()=>{follow.hidden=true;demo.querySelector('.adaptive-options').replaceChildren();demo.querySelector('[data-adapt]').focus();});
});

// Offline demonstration of an AI role-play product: explicit authored rules.
document.querySelectorAll('.rehearsal-studio').forEach(studio=>{
 const de=studio.dataset.studioLang==='de',selects=[...studio.querySelectorAll('[data-build]')],review=studio.querySelector('.studio-review');let profile=0;
 const names=['Maya','Alex','Sam'];
 const responses=de?[
 ['Ich wusste nicht, welchen Teil ich zuerst erledigen sollte. Können wir die Erwartungen klären?','Ich verstehe. Mir war die Priorität nicht klar. Ein kurzer Rückmeldetermin würde helfen.'],
 ['Der Umfang wurde kurzfristig verändert. Warum liegt die Verantwortung nur bei mir?','Der Umfang hat sich verändert. Lassen Sie uns festlegen, was bis zum nächsten Termin realistisch ist.'],
 ['Ich hatte drei dringende Aufgaben gleichzeitig. Ich kann nicht alles zuerst erledigen.','Danke fürs Nachfragen. Können wir die Prioritäten klären und eine Aufgabe verschieben?']
 ]:[
 ['I was not sure which part to prioritise. Can we clarify what you expected?','I understand. The priority was not clear to me. A short check-in would help.'],
 ['The scope changed at the last minute. Why is this being treated as only my responsibility?','The scope changed. Let’s agree what is realistic for the next milestone.'],
 ['I had three urgent tasks at once. I cannot do everything first.','Thanks for asking. Could we clarify priorities and move one task back?']
 ];
 function draft(){studio.querySelector('.studio-draft-text').textContent=selects.map(s=>s.value==='custom'?studio.querySelector('[data-custom-for="'+s.dataset.build+'"]').value:s.selectedOptions[0].textContent).join(' ');review.hidden=true;}
 studio.querySelectorAll('[data-profile]').forEach(b=>b.addEventListener('click',()=>{profile=Number(b.dataset.profile);studio.querySelectorAll('[data-profile]').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));review.hidden=true;}));
 selects.forEach(s=>s.addEventListener('change',draft));draft();
 function test(){const values=selects.map(s=>s.value==='custom'?null:Number(s.selectedOptions[0].dataset.quality));review.hidden=false;studio.querySelector('.studio-speaker').textContent=names[profile]+(de?' · Beispielreaktion':' · Example response');studio.querySelector('.studio-response').textContent=values.some(v=>v===null)?(de?'Ihre eigene Formulierung ist im Einstieg enthalten. In einer angebundenen Version würde die KI darauf individuell reagieren. Prüfen Sie für diese Vorschau die Kriterien unten.':'Your custom wording is included in the opening. In a connected version, AI would respond to it individually. For this preview, review the criteria below.'):responses[profile][values[0]&&values[1]?1:0];
  const labels=de?['Sachlicher Einstieg','Perspektive erfragen','Konkreter nächster Schritt']:['Factual opening','Invite perspective','Specific next step'];
  const metrics=studio.querySelector('.studio-metrics');metrics.replaceChildren();labels.forEach((label,i)=>{const item=document.createElement('p');item.className=values[i]?'criterion-met':'criterion-improve';item.textContent=(values[i]===null?'◇ ':values[i]?'✓ ':'↗ ')+label+' · '+(values[i]===null?(de?'eigener Text · selbst prüfen':'custom text · self-review'):values[i]?(de?'erfüllt':'met'):(de?'verbessern':'revise'));metrics.append(item);});
  const tips=de?['Beschreiben Sie das beobachtbare Ereignis, ohne der Person ein Etikett zu geben.','Fragen Sie nach Hindernissen, bevor Sie eine Schlussfolgerung ziehen.','Vereinbaren Sie einen überprüfbaren nächsten Schritt.']:['Describe the observable event without labelling the person.','Ask about barriers before drawing a conclusion.','Agree a next step that can be checked.'];
  studio.querySelector('.studio-coach').textContent=values.some(v=>v===null)?(de?'Prüfen Sie Ihre Formulierung: sachliche Beobachtung, offene Frage und überprüfbare Vereinbarung. Freitext wird hier nicht automatisch bewertet.':'Review your wording for a factual observation, an open question and a checkable agreement. Free text is not automatically evaluated here.'):values.every(Boolean)?(de?'Ihr Einstieg verbindet Klarheit, Zuhören und Verbindlichkeit. Üben Sie nun mit einem anderen Profil; die Hindernisse können unterschiedlich sein.':'Your opening combines clarity, listening and accountability. Try another profile: the barriers may differ.'):tips.filter((t,i)=>!values[i]).join(' ');
 }
 studio.querySelector('.studio-test').addEventListener('click',test);
 studio.querySelector('.studio-revise').addEventListener('click',()=>{selects.forEach(s=>{if(s.value!=='custom')s.value='1';});draft();test();});
 const hear=studio.querySelector('.studio-hear');if(!('speechSynthesis' in window))hear.hidden=true;
 hear.addEventListener('click',()=>{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(studio.querySelector('.studio-draft-text').textContent);u.lang=de?'de-DE':'en-GB';window.speechSynthesis.speak(u);});
});
