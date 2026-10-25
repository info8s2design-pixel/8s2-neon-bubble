const soundtrack=document.getElementById('soundtrack'),musicButton=document.getElementById('music');
let musicEnabled=true,musicPending=false;
soundtrack.volume=.35;
try{musicEnabled=localStorage.getItem('8s2-music')!=='off'}catch{}
function musicLabel(){musicButton.textContent=musicEnabled?'♫ Musica':'♫ Muta';musicButton.setAttribute('aria-pressed',String(musicEnabled));musicButton.setAttribute('aria-label',musicEnabled?'Disattiva musica':'Attiva musica')}
function syncMusic(){if(!musicEnabled||mode!=='playing'){soundtrack.pause();return}if(soundtrack.paused&&!musicPending){musicPending=true;const result=soundtrack.play();if(result&&result.then)result.catch(()=>{}).finally(()=>{musicPending=false;if(!musicEnabled||mode!=='playing')soundtrack.pause()});else musicPending=false}}
musicButton.onclick=()=>{musicEnabled=!musicEnabled;try{localStorage.setItem('8s2-music',musicEnabled?'on':'off')}catch{}musicLabel();syncMusic()};
document.addEventListener('click',()=>syncMusic());
document.addEventListener('keydown',()=>syncMusic());
window.addEventListener('blur',()=>soundtrack.pause());
musicLabel();let previousMusicMode=mode;setInterval(()=>{if(previousMusicMode!==mode){previousMusicMode=mode;syncMusic()}},100);
