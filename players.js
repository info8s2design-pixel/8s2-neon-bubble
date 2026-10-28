(()=>{
 'use strict';
 const KEY='8s2-neon-bubble-players-v1',LEGACY='8s2-neon-bubble-best';
 const clean=value=>Array.from(String(value||'').normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g,'').replace(/\s+/g,' ').trim()).slice(0,20).join('');
 const number=value=>Math.max(0,Math.min(Number.MAX_SAFE_INTEGER,Math.floor(Number(value)||0)));
 let data={version:1,activeId:null,legacyBest:0,players:[]},allTimeBest=0,storageOK=true,timer=0,run=null;
 try{
  allTimeBest=number(localStorage.getItem(LEGACY));
  const raw=JSON.parse(localStorage.getItem(KEY)||'null');
  if(raw&&raw.version===1&&Array.isArray(raw.players)){
   const ids=new Set();
   data.players=raw.players.filter(p=>p&&typeof p.id==='string'&&clean(p.name)&&!ids.has(p.id)&&ids.add(p.id)).map(p=>({id:p.id,name:clean(p.name),bestScore:number(p.bestScore),maxLevel:number(p.maxLevel),games:number(p.games)}));
   data.activeId=data.players.some(p=>p.id===raw.activeId)?raw.activeId:null;
   data.legacyBest=number(raw.legacyBest);
  }else data.legacyBest=allTimeBest;
 }catch{storageOK=false;data.legacyBest=allTimeBest}
 const home=document.getElementById('home-player-name'),nickname=document.getElementById('profile-name'),dialog=document.getElementById('players-screen'),list=document.getElementById('players-list'),message=document.getElementById('players-status'),opener=document.getElementById('open-players');
 const active=()=>data.players.find(p=>p.id===data.activeId);
 function storageMessage(){return storageOK?'Ogni giocatore ha il proprio record. I dati restano salvati in questo browser, su questo dispositivo.':'Il salvataggio non è disponibile. Per questa sessione i dati restano in memoria.'}
 function flush(){clearTimeout(timer);timer=0;try{localStorage.setItem(KEY,JSON.stringify(data));storageOK=true}catch{storageOK=false}document.getElementById('players-storage-note').textContent=storageMessage()}
 function schedule(){if(!timer)timer=setTimeout(flush,350)}
 function best(){return active()?.bestScore||0}
 function updateHUD(){if(typeof bestScore!=='undefined'){bestScore=best();document.getElementById('best').textContent=String(bestScore).padStart(5,'0');if(typeof hudValues!=='undefined')hudValues.best=String(bestScore).padStart(5,'0')}}
 function reflect(){const p=active();home.value=p?.name||'';nickname.value=p?.name||'';document.getElementById('players-storage-note').textContent=storageMessage()}
 function choose(value,input){
  const name=clean(value);
  if(!name){input.setCustomValidity('Inserisci il nome giocatore.');input.reportValidity();input.focus();return false}
  input.setCustomValidity('');
  let p=data.players.find(p=>p.name.toLocaleLowerCase('it')===name.toLocaleLowerCase('it'));
  if(!p){p={id:globalThis.crypto?.randomUUID?.()||'p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),name,bestScore:0,maxLevel:0,games:0};data.players.push(p)}
  data.activeId=p.id;flush();reflect();updateHUD();render();return true;
 }
 function ensure(){return choose(home.value,home)}
 function begin(){if(!active()&&!ensure())return false;finish();const p=active();run={playerId:p.id};p.games++;p.maxLevel=Math.max(p.maxLevel,1);flush();return true}
 function record(points,stage){
  const p=run&&data.players.find(p=>p.id===run.playerId);
  if(p){const nextScore=Math.max(p.bestScore,number(points)),nextLevel=Math.max(p.maxLevel,number(stage));if(nextScore!==p.bestScore||nextLevel!==p.maxLevel){p.bestScore=nextScore;p.maxLevel=nextLevel;schedule()}
   if(number(points)>allTimeBest){allTimeBest=number(points);try{localStorage.setItem(LEGACY,String(allTimeBest))}catch{storageOK=false}}
  }
  return best();
 }
 function finish(points,stage){if(run){record(points,stage);run=null;flush()}}
 function render(){
  list.replaceChildren();
  const profiles=[...data.players].sort((a,b)=>b.bestScore-a.bestScore||b.maxLevel-a.maxLevel||a.name.localeCompare(b.name,'it'));
  for(const p of profiles){
   const row=document.createElement('tr');if(p.id===data.activeId)row.classList.add('selected-player');
   for(const [label,value] of [['Giocatore',p.name],['Record',p.bestScore.toLocaleString('it-IT')],['Livello max',p.maxLevel||'—'],['Partite',p.games]]){const cell=document.createElement('td');cell.dataset.label=label;cell.textContent=value;row.append(cell)}
   const cell=document.createElement('td'),button=document.createElement('button');button.type='button';button.textContent=p.id===data.activeId?'Selezionato':'Usa';button.setAttribute('aria-label','Usa il giocatore '+p.name);button.setAttribute('aria-pressed',String(p.id===data.activeId));button.addEventListener('click',()=>{choose(p.name,nickname);message.textContent='Giocatore selezionato: '+p.name});cell.append(button);row.append(cell);list.append(row);
  }
  document.getElementById('players-empty').hidden=profiles.length>0;
  const legacy=document.getElementById('legacy-record');legacy.hidden=!data.legacyBest;legacy.textContent='Record precedente (senza nome): '+data.legacyBest.toLocaleString('it-IT')+' punti.';
 }
 let oldOverflow='';
 opener.addEventListener('click',()=>{oldOverflow=document.body.style.overflow;nickname.value=clean(home.value)||active()?.name||'';render();message.textContent='';dialog.showModal();document.body.style.overflow='hidden';document.getElementById('players-back').focus({preventScroll:true})});
 document.getElementById('players-back').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;opener.focus({preventScroll:true})});
 dialog.addEventListener('keydown',event=>event.stopPropagation());
 for(const input of [home,nickname])input.addEventListener('input',()=>input.setCustomValidity(''));
 home.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Enter'){event.preventDefault();document.getElementById('enter-game').click()}});
 document.getElementById('player-form').addEventListener('submit',event=>{event.preventDefault();if(choose(nickname.value,nickname))message.textContent='Giocatore selezionato: '+active().name});
 window.addEventListener('pagehide',flush);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)flush()});
 const music=document.getElementById('home-music-toggle');
 function musicLabel(){music.textContent=typeof musicEnabled==='undefined'||musicEnabled?'Musica ON':'Musica OFF';music.setAttribute('aria-pressed',String(typeof musicEnabled==='undefined'||musicEnabled))}
 music.addEventListener('click',()=>{document.getElementById('music').click();if(typeof syncHomeMusic==='function')syncHomeMusic();musicLabel()});
 document.getElementById('music').addEventListener('click',musicLabel);
 document.addEventListener('DOMContentLoaded',musicLabel);
 window.NeonProfiles={ensure,begin,record,finish,best};
 reflect();render();
})();
