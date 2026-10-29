const holdForm=document.getElementById('hold-form');
const holdIds=['hold-quantity','hold-now','hold-later','hold-cost','hold-loss'];
const readHold=id=>Number(document.getElementById(id).value);
function renderHold(){const q=readHold('hold-quantity'),now=readHold('hold-now'),later=readHold('hold-later'),cost=readHold('hold-cost'),loss=readHold('hold-loss');const sellNow=q*now,remaining=q*(1-loss/100),future=remaining*later-cost,breakEven=(sellNow+cost)/remaining;const format=x=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(x);const mr=document.documentElement.lang==='mr';document.getElementById('hold-output').textContent=mr?`आता विक्री: ${format(sellNow)}. गृहीत धरलेल्या भावाने नंतर: ${format(future)}. समान रक्कम मिळण्यासाठी नंतरचा भाव: ${format(breakEven)} प्रति क्विंटल.`:`Sell now: ${format(sellNow)}. Later at your assumed price: ${format(future)}. Break-even later price: ${format(breakEven)} per quintal.`;document.getElementById('hold-result').hidden=false;}
holdForm.addEventListener('submit',event=>{event.preventDefault();if(holdForm.reportValidity())renderHold();});
holdForm.addEventListener('input',()=>{document.getElementById('hold-result').hidden=true;});
document.getElementById('language').addEventListener('click',()=>{if(!document.getElementById('hold-result').hidden)renderHold();});
