let installPrompt=null;const installButtons=[...document.querySelectorAll('.install-app')],installHelp=document.getElementById('install-help');
function installed(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function refreshInstall(){installButtons.forEach(button=>button.hidden=installed())}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;refreshInstall()});
window.addEventListener('appinstalled',()=>{installPrompt=null;installButtons.forEach(button=>button.hidden=true)});
for(const button of installButtons)button.addEventListener('click',async()=>{if(mode==='playing')pause();if(installPrompt){const prompt=installPrompt;installPrompt=null;try{await prompt.prompt();await prompt.userChoice}catch{}return}const apple=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);document.getElementById('install-instructions').textContent=apple?'Apri questo gioco in Safari. Tocca Condividi, poi “Aggiungi alla schermata Home” e conferma con “Aggiungi”.':'Apri il gioco in Chrome o Edge. Nel menu del browser scegli “Installa app” o “Installa pagina come app”. Se il comando non appare, ricarica la pagina dopo il primo accesso. Su altri browser cerca “Aggiungi alla schermata Home”.';installHelp.showModal()});
document.getElementById('close-install').onclick=()=>installHelp.close();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
refreshInstall();
