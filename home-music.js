(()=>{
 const audio=document.getElementById('intro-audio');
 let pending=false;
 audio.volume=.5;audio.loop=true;
 const shouldPlay=()=>gameShell.hidden&&!document.hidden&&(typeof musicEnabled==='undefined'||musicEnabled);
 function syncHomeMusic(){
  if(!shouldPlay()){audio.pause();return}
  if(pending||!audio.paused)return;
  try{
   pending=true;
   const result=audio.play();
   if(result&&typeof result.then==='function')result.then(()=>{if(!shouldPlay())audio.pause()}).catch(()=>{}).finally(()=>{pending=false});
   else pending=false;
  }catch{pending=false}
 }
 window.syncHomeMusic=syncHomeMusic;
 for(const event of ['pointerdown','touchstart','keydown','click'])document.addEventListener(event,syncHomeMusic,{passive:true});
 document.addEventListener('visibilitychange',syncHomeMusic);
 window.addEventListener('pageshow',syncHomeMusic);
 window.addEventListener('focus',syncHomeMusic);
 window.addEventListener('blur',()=>audio.pause());
 syncHomeMusic();
})();
