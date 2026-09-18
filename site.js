'use strict';
const menu=document.querySelector('.menu');
const nav=document.querySelector('#main-nav');
function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Menü öffnen');}
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasOpen=nav?.classList.contains('open');closeMenu();if(wasOpen)menu.focus();}});
document.addEventListener('click',e=>{if(nav?.classList.contains('open')&&!nav.contains(e.target)&&!menu.contains(e.target))closeMenu();});
const down='M5 5 19 19M6 19h13V6',up='M5 19 19 5M6 5h13v13';
function normalPath(path){return path.replace(/index\.html$/,'');}
function anchorArrows(){document.querySelectorAll('a[href] .ui-arrow').forEach(svg=>{const a=svg.closest('a');const u=new URL(a.href,location.href);if(u.origin!==location.origin||normalPath(u.pathname)!==normalPath(location.pathname)||!u.hash)return;let id;try{id=decodeURIComponent(u.hash.slice(1))}catch{return;}const target=document.getElementById(id);if(!target)return;const isBelow=target.getBoundingClientRect().top>a.getBoundingClientRect().top;svg.querySelector('path')?.setAttribute('d',isBelow?down:up);});}
anchorArrows();window.addEventListener('load',anchorArrows);window.addEventListener('resize',anchorArrows);document.addEventListener('toggle',anchorArrows,true);
const form=document.querySelector('#inquiry-form');
if(form){
 form.querySelectorAll('button[disabled]').forEach(b=>b.disabled=false);
 const product=new URLSearchParams(location.search).get('produkt');
 if(['Norm','Hard'].includes(product)){form.elements.produkt.value=product;form.elements.anliegen.value='Angebot anfragen';}
 const status=document.querySelector('#form-status'),preview=document.querySelector('#email-preview'),output=document.querySelector('#email-text'),open=document.querySelector('#open-email');
 function makeInquiry(){const d=new FormData(form);const val=k=>String(d.get(k)||'').trim();const fields=[['Anliegen','anliegen'],['Produkt','produkt'],['Name','name'],['Firma','firma'],['E-Mail','email'],['Telefon','telefon'],['Menge (m³)','menge'],['Lieferform','lieferform'],['Lieferung','lieferung'],['Postleitzahl / Ort','ort']];const body='Guten Tag Policell-Team,\n\n'+fields.map(([label,key])=>label+': '+(val(key)||'—')).join('\n')+'\n\n'+val('nachricht')+'\n\nFreundliche Grüße\n'+val('name');return {body,subject:val('anliegen')+' – '+val('name')};}
 function prepare(){const data=makeInquiry();output.textContent=data.body;open.href='mailto:office@policell.at?subject='+encodeURIComponent(data.subject)+'&body='+encodeURIComponent(data.body);preview.hidden=false;return data;}
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;prepare();status.textContent='Ihre Anfrage ist vorbereitet, aber noch nicht versendet. Prüfen Sie den Text und öffnen Sie Ihr E-Mail-Programm.';preview.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
 document.querySelector('#copy-inquiry').addEventListener('click',async()=>{if(!form.reportValidity())return;const {body}=prepare();try{await navigator.clipboard.writeText(body);status.textContent='Anfrage kopiert. Sie können sie in eine E-Mail an office@policell.at einfügen.';}catch{status.textContent='Bitte markieren und kopieren Sie den vorbereiteten Text unten.';const range=document.createRange();range.selectNodeContents(output);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);}});
}
