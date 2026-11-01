(()=>{
'use strict';
const pdfUrl=window.LAESEBLIK_BOOK_PDF,canvas=document.getElementById('lb-book-canvas'),shell=document.getElementById('lb-book-shell'),status=document.getElementById('lb-book-status');
const prev=document.getElementById('lb-prev'),next=document.getElementById('lb-next'),label=document.getElementById('lb-page-label'),full=document.getElementById('lb-fullscreen');
if(!canvas||!shell||!pdfUrl)return;
let doc=null,page=1,rendering=false,pending=null,zoom=1;
const ctx=canvas.getContext('2d',{alpha:false});
function announce(message){if(status){status.textContent=message;status.hidden=false;}}
function update(){prev.disabled=!doc||page<=1;next.disabled=!doc||page>=doc.numPages;label.textContent=doc?`Side ${page} af ${doc.numPages}`:'Åbner bogen …';}
async function render(num){if(!doc)return;if(rendering){pending=num;return;}rendering=true;
try{const pg=await doc.getPage(num),base=pg.getViewport({scale:1});const width=Math.min(shell.clientWidth-28,1100);const scale=Math.max(0.2,width/base.width)*zoom;const view=pg.getViewport({scale});const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.floor(view.width*dpr);canvas.height=Math.floor(view.height*dpr);canvas.style.width=Math.floor(view.width)+'px';canvas.style.height=Math.floor(view.height)+'px';ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);await pg.render({canvasContext:ctx,viewport:view,transform:[dpr,0,0,dpr,0,0]}).promise;page=num;if(status)status.hidden=true;let fb=document.getElementById('lb-book-fallback');if(fb)fb.hidden=true;update();}
catch(e){announce('Siden kunne ikke vises. Åbn i stedet original-PDF’en via knappen nedenfor.');console.error(e);}finally{rendering=false;if(pending!==null){let n=pending;pending=null;if(n!==page)render(n);}}}
function go(delta){if(doc){let n=Math.min(doc.numPages,Math.max(1,page+delta));if(n!==page)render(n)}}
prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
full.addEventListener('click',()=>{shell.classList.toggle('lb-book-large');full.textContent=shell.classList.contains('lb-book-large')?'Normal størrelse':'Vis større';render(page);});
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1)});
let touchX=0;canvas.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX},{passive:true});canvas.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>65)go(dx<0?1:-1)},{passive:true});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(doc)render(page)},180)});
async function init(){if(!window.pdfjsLib){announce('Bogvisningen kan ikke hente sin læsemotor. Åbn original-PDF’en via knappen nedenfor.');return;}try{pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';doc=await pdfjsLib.getDocument({url:pdfUrl}).promise;update();await render(1)}catch(e){announce('Bogen kunne ikke indlæses her. Prøv knappen til original-PDF’en nedenfor.');label.textContent='Bogen kunne ikke indlæses';console.error(e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();