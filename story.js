(()=>{
const dialog=document.getElementById('story-screen'),openButton=document.getElementById('open-story'),back=document.getElementById('story-back'),scroller=document.getElementById('story-scroll'),toggle=document.getElementById('story-auto'),restart=document.getElementById('story-restart');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let running=false,frame=0,last=0,position=0,startAt=0,previousOverflow='';
function render(){toggle.textContent=running?'Ⅱ Pausa scorrimento':'▶ Scorri automaticamente';toggle.setAttribute('aria-pressed',String(running))}
function stop(){running=false;cancelAnimationFrame(frame);frame=0;last=0;render()}
function tick(now){if(!dialog.open||!running)return;if(document.hidden||now<startAt){last=now;frame=requestAnimationFrame(tick);return}const dt=last?Math.min((now-last)/1000,.1):0;last=now;position=Math.max(position,scroller.scrollTop)+dt*18;scroller.scrollTop=position;if(position>=scroller.scrollHeight-scroller.clientHeight-1){stop();return}frame=requestAnimationFrame(tick)}
function play(delay=0){cancelAnimationFrame(frame);position=scroller.scrollTop;last=0;startAt=performance.now()+delay;running=true;render();frame=requestAnimationFrame(tick)}
function open(){previousOverflow=document.body.style.overflow;dialog.showModal();document.body.classList.add('story-open');document.body.style.overflow='hidden';scroller.scrollTop=0;position=0;if(reduced.matches)stop();else play(1800);back.focus({preventScroll:true})}
function close(){if(dialog.open)dialog.close()}
openButton.addEventListener('click',open);back.addEventListener('click',close);
dialog.addEventListener('close',()=>{stop();document.body.classList.remove('story-open');document.body.style.overflow=previousOverflow;openButton.focus({preventScroll:true})});
dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
dialog.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();close()}else if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)&&event.target===scroller)stop()});
for(const type of ['wheel','touchstart','pointerdown'])scroller.addEventListener(type,stop,{passive:true});
toggle.addEventListener('click',()=>{if(running)stop();else{if(scroller.scrollTop>=scroller.scrollHeight-scroller.clientHeight-2)scroller.scrollTop=0;play()}});
restart.addEventListener('click',()=>{stop();scroller.scrollTop=0;position=0;if(!reduced.matches)play(1800)});
document.addEventListener('visibilitychange',()=>{last=0});
render();
})();
