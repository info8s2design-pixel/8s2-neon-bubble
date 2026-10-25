const splash=document.getElementById('splash'),gameShell=document.getElementById('game-shell');
function enterGame(){if(splash.hidden)return;splash.hidden=true;gameShell.hidden=false;start();syncMusic();document.getElementById('pause').focus({preventScroll:true});window.scrollTo(0,0)}
document.getElementById('enter-game').onclick=enterGame;
window.addEventListener('keydown',event=>{if(!splash.hidden&&(event.code==='Enter'||event.code==='Space')){event.preventDefault();enterGame()}},true);
