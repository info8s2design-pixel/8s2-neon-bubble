const introAudio=document.getElementById('intro-audio'),introToggle=document.getElementById('intro-toggle');
introAudio.volume=.5;
function introLabel(){const playing=!introAudio.paused;introToggle.textContent=playing?'Ⅱ Ferma intro':'▶ Ascolta intro';introToggle.setAttribute('aria-pressed',String(playing))}
async function playIntro(){if(splash.hidden||!musicEnabled)return;try{await introAudio.play();if(splash.hidden){introAudio.pause();introAudio.currentTime=0}}catch{}introLabel()}
introToggle.onclick=()=>{if(introAudio.paused){introAudio.currentTime=0;playIntro()}else{introAudio.pause();introLabel()}};
introAudio.addEventListener('ended',introLabel);introAudio.addEventListener('pause',introLabel);introAudio.addEventListener('play',introLabel);
document.addEventListener('visibilitychange',()=>{if(document.hidden)introAudio.pause()});window.addEventListener('blur',()=>introAudio.pause());
playIntro();
