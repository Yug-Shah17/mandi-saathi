// Fixed third-party reproduction of historical AGMARKNET reports, not a live feed.
const snapshot={date:'27 Oct 2026',source:'https://www.maikisaan.com/mandi-bhav/onion/maharashtra/nashik/',records:[{market:'APMC Manmad',price:4000},{market:'APMC Pimpalgaon Baswant',price:4100}]};
document.getElementById('load-snapshot').addEventListener('click',()=>{
 document.getElementById('crop').value='Onion · Unhali';
 for(const [i,k] of ['A','B'].entries()) {document.getElementById('name'+k).value=snapshot.records[i].market;document.getElementById('price'+k).value=snapshot.records[i].price;}
 document.getElementById('transportA').value='';document.getElementById('transportB').value='';document.getElementById('otherA').value='0';document.getElementById('otherB').value='0';
 document.getElementById('comparison').dispatchEvent(new Event('input',{bubbles:true}));
 document.getElementById('snapshot-status').hidden=false;
 document.getElementById('compare').scrollIntoView({block:'start'});
});
document.getElementById('comparison').addEventListener('input',event=>{if(['crop','nameA','priceA','nameB','priceB'].includes(event.target.id))document.getElementById('snapshot-status').hidden=true;});
