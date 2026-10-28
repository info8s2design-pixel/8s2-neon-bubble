const splash=document.getElementById('splash'),gameShell=document.getElementById('game-shell');
function enterGame(){if(splash.hidden)return;const intro=document.getElementById('intro-audio');if(intro){intro.pause();intro.currentTime=0}splash.hidden=true;gameShell.hidden=false;mode='ready';for(const key in keys)keys[key]=false;overlay('Pronto a giocare?','Muoviti, schiva le bolle e raccogli le armi. Premi START per iniziare.','START');document.getElementById('start').focus({preventScroll:true});window.scrollTo(0,0);if(typeof fitFullscreenOrientation==='function')fitFullscreenOrientation()}
document.getElementById('enter-game').onclick=enterGame;
function returnToMenu(){
 mode='ready';
 for(const key in keys)keys[key]=false;
 if(typeof stopLevelWin==='function')stopLevelWin();
 for(const audio of document.querySelectorAll('audio')){audio.pause();audio.currentTime=0}
 if(typeof popPools!=='undefined')for(const pool of Object.values(popPools))for(const voice of pool){voice.audio.pause();voice.audio.currentTime=0}
 if(typeof syncMusic==='function')syncMusic();
 gameShell.hidden=true;splash.hidden=false;
 if(typeof leaveFullscreen==='function')leaveFullscreen();
 window.scrollTo(0,0);
 document.getElementById('enter-game').focus({preventScroll:true});
}
document.getElementById('return-menu').addEventListener('click',returnToMenu);

