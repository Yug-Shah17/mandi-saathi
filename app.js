const ids=['crop','quantity','nameA','priceA','transportA','otherA','nameB','priceB','transportB','otherB'];
const defaults=['Onion','5','Lasalgaon APMC','3900','400','0','Pimpalgaon Baswant','4400','1200','0'];
const $=id=>document.getElementById(id); let lang='en', last=null;
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n);
const canSpeak=typeof window!=='undefined'&&'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
const say=n=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:0}).format(n);
const t=(en,mr,hi)=>lang==='hi'?hi:lang==='mr'?mr:en;

function speechText(){
  if(!last)return'';
  const[a,b]=last,d=Math.abs(a.net-b.net),tie=d<0.005,win=a.net>=b.net?a:b;
  if(lang==='hi')return `ढुलाई और दूसरे खर्च निकालने के बाद: ${a.name}, ${say(a.net)} रुपये। ${b.name}, ${say(b.net)} रुपये। ${tie?'दोनों अनुमान बराबर हैं।':`${win.name} इस माल पर लगभग ${say(d)} रुपये आगे है।`} ये अनुमान आपके भरे हुए भाव और खर्च पर आधारित हैं। यात्रा से पहले आज का भाव जाँचें।`;
  if(lang==='mr')return `वाहतूक व इतर खर्चानंतर: ${a.name}, ${say(a.net)} रुपये. ${b.name}, ${say(b.net)} रुपये. ${tie?'दोन्ही अंदाज सारखे आहेत.':`${win.name} सुमारे ${say(d)} रुपयांनी पुढे आहे.`} हे तुम्ही भरलेल्या भावावर आधारित अंदाज आहेत. प्रवासापूर्वी आजचा भाव तपासा.`;
  return `After transport and other costs: ${a.name}, ${say(a.net)} rupees. ${b.name}, ${say(b.net)} rupees. ${tie?'The two estimates are the same.':`${win.name} is ahead by about ${say(d)} rupees for this lot.`} These are estimates from the prices and costs you entered. Check today's price before travelling.`;
}

function speak(){
  if(!canSpeak)return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(speechText());
  u.lang=lang==='mr'?'mr-IN':lang==='hi'?'hi-IN':'en-IN';
  u.rate=.92;
  speechSynthesis.speak(u);
}

function calculate(){
  const q=Number($('quantity').value);
  return ['A','B'].map(k=>{
    const price=Number($('price'+k).value),transport=Number($('transport'+k).value),other=Number($('other'+k).value);
    return {name:$('name'+k).value.trim(),price,gross:q*price,transport,other,net:q*price-transport-other};
  });
}

function explain(a,b){
  if(a.price===b.price)return t('Both entered prices are equal; the cost difference determines this comparison.','दोन्ही भरलेले भाव समान आहेत; खर्चातील फरक तुलना ठरवतो.','दोनों भरे हुए भाव बराबर हैं; खर्च का अंतर तुलना तय करता है।');
  const hi=a.price>b.price?a:b,lo=hi===a?b:a,priceGap=hi.price-lo.price,costGap=(hi.transport+hi.other)-(lo.transport+lo.other);
  if(costGap<=0)return t(`${hi.name} has the higher price and no greater entered costs.`,`${hi.name} चा भाव जास्त आहे आणि भरलेला खर्च जास्त नाही.`,`${hi.name} का भाव ज़्यादा है और भरा हुआ खर्च ज़्यादा नहीं है।`);
  const threshold=costGap/priceGap,fmt=new Intl.NumberFormat('en-IN',{maximumFractionDigits:2}).format(threshold);
  return t(
    `${hi.name} offers ${money(priceGap)} more per quintal but has ${money(costGap)} more in entered costs. At these fixed costs, the estimates are equal at approximately ${fmt} quintals.`,
    `${hi.name} चा भाव प्रति क्विंटल ${money(priceGap)} जास्त आहे, पण भरलेला खर्च ${money(costGap)} जास्त आहे. हे खर्च स्थिर मानल्यास अंदाजे ${fmt} क्विंटलवर अंदाज समान आहेत.`,
    `${hi.name} का भाव प्रति क्विंटल ${money(priceGap)} ज़्यादा है, पर भरा हुआ खर्च ${money(costGap)} ज़्यादा है। इन खर्चों को स्थिर मानने पर लगभग ${fmt} क्विंटल पर दोनों अनुमान बराबर हैं।`
  );
}

function fareBreakEven(q,priceA,priceB,transportA,otherA,otherB){
  const priceGap=priceB-priceA,maxFareB=transportA+q*priceGap+(otherA-otherB);
  return {priceGap,totalGain:q*priceGap,maxFareB,never:maxFareB<0};
}

function fareNote(a,b){
  const q=Number($('quantity').value),f=fareBreakEven(q,a.price,b.price,a.transport,a.other,b.other);let m;
  if(f.never)return t(
    `At the entered prices and other costs, no fare to ${b.name} — not even a free trip — would make it as good as ${a.name}.`,
    `भरलेल्या भाव व इतर खर्चांप्रमाणे, ${b.name}पर्यंत कोणतेही भाडे — मोफत प्रवासही — ${a.name}इतका चांगला सौदा करू शकत नाही.`,
    `भरे हुए भाव और दूसरे खर्चों के हिसाब से ${b.name} तक कोई भी भाड़ा — मुफ़्त यात्रा भी — ${a.name} जितना अच्छा सौदा नहीं बना सकता।`
  );
  if(f.priceGap===0)return t(
    `Both entered prices are ${money(a.price)} per quintal. For the whole trip to ${b.name}, only fares up to ${money(f.maxFareB)} keep ${b.name} at least as good as ${a.name}; anything higher makes ${a.name} the better choice. Ask a local transport operator instead of assuming a fare.`,
    `दोन्ही भरलेले भाव ${money(a.price)} प्रति क्विंटल आहेत. ${b.name}चा पूर्ण प्रवास ${money(f.maxFareB)}हून कमी झाला तरी तो ${a.name}इतका चांगला आहे; जास्त झाल्यास ${a.name} निवडा. भाडे गृहीत न धरता स्थानिक वाहतुकदाराला विचारा.`,
    `दोनों भरे हुए भाव ${money(a.price)} प्रति क्विंटल हैं। ${b.name} की पूरी यात्रा पर ${money(f.maxFareB)} तक का खर्च होने पर भी ${b.name}, ${a.name} जितना अच्छा है; उससे ज़्यादा होने पर ${a.name} चुनें। भाड़ा मान न लें, स्थानीय वाहन चालक से पूछें।`
  );
  if(f.priceGap>0)return t(
    `${b.name} pays ${money(f.priceGap)} more per quintal — ${money(f.totalGain)} more for this lot of ${q} quintals. If the fare to ${b.name} is unknown: with your other entered costs unchanged, the trip to ${b.name} can cost up to ${money(f.maxFareB)} in total and ${b.name} still won't do worse than ${a.name}. Above that, ${a.name} is the better choice. Ask a tempo or truck operator for a real fare instead of estimating.`,
    `${b.name} प्रति क्विंटल ${money(f.priceGap)} जास्त देत आहे — ${q} क्विंटलच्या मालावर एकूण ${money(f.totalGain)}. ${b.name}चे भाडे अजून ठाऊक नसल्यास: इतर भरलेले खर्च तसेच असतील, तर प्रवासाचा एकूण खर्च ${money(f.maxFareB)} पर्यंत झाला तरी ${b.name}, ${a.name}इतका वाईट सौदा नाही. त्याहून जास्त झाल्यास ${a.name} निवडा. भाडे अंदाजे न धरता तेथील टेम्पो किंवा ट्रकचालकाला विचारा.`,
    `${b.name} प्रति क्विंटल ${money(f.priceGap)} ज़्यादा दे रही है — ${q} क्विंटल के इस माल पर कुल ${money(f.totalGain)} ज़्यादा। अगर ${b.name} का भाड़ा अभी पता नहीं: दूसरे भरे खर्च वही रहने पर, ${b.name} की पूरी यात्रा पर ${money(f.maxFareB)} तक खर्च होने पर भी ${b.name}, ${a.name} से खराब नहीं रहेगी। उससे ज़्यादा होने पर ${a.name} बेहतर है। अंदाज़ा न लगाएँ, टेम्पो या ट्रक चालक से असली भाड़ा पूछें।`
  );
  return t(
    `${b.name} pays ${money(f.priceGap)} per quintal less. To stay at least as good as ${a.name}, the whole trip to ${b.name} must cost no more than ${money(f.maxFareB)} — cheaper than reaching ${a.name}. Ask a transport operator before assuming.`,
    `${b.name} प्रति क्विंटल ${money(f.priceGap)} कमी देत आहे. ${a.name}इतका चांगला सौदा राहण्यासाठी ${b.name}पर्यंतचा पूर्ण प्रवास ${money(f.maxFareB)}हून जास्त नसावा — हा खर्च ${a.name}पेक्षा कमी असावा लागेल. गृहीत न धरता वाहतुकदाराला विचारा.`,
    `${b.name} प्रति क्विंटल ${money(f.priceGap)} कमी दे रही है। ${a.name} जितना अच्छा रहने के लिए ${b.name} की पूरी यात्रा ${money(f.maxFareB)} से ज़्यादा खर्च नहीं होनी चाहिए — ${a.name} तक पहुँचने से कम। मानने से पहले वाहन चालक से पूछें।`
  );
}

function shareMessage(){
  if(!last)return '';
  const[a,b]=last,q=Number($('quantity').value),delta=Math.abs(a.net-b.net),tie=delta<0.005,winner=a.net>b.net?a:b;
  const lines=[];
  if(lang==='hi'){
    lines.push('मंडी साथी — मेरी तुलना','');
    lines.push(`${a.name}: मंडी भाव ${money(a.price)} प्रति क्विंटल चालू दर × ${q} क्विंटल`);
    lines.push(`बिक्री ${money(a.gross)} − ढुलाई / गाड़ी भाड़ा ${money(a.transport)} − पल्लेदारी व तुलाई ${money(a.other)} = मुनाफा / हाथ में आने वाली रकम ${money(a.net)}`);
    lines.push(`${b.name}: मंडी भाव ${money(b.price)} प्रति क्विंटल चालू दर × ${q} क्विंटल`);
    lines.push(`बिक्री ${money(b.gross)} − ढुलाई / गाड़ी भाड़ा ${money(b.transport)} − पल्लेदारी व तुलाई ${money(b.other)} = मुनाफा / हाथ में आने वाली रकम ${money(b.net)}`);
    lines.push('',tie?'दोनों अनुमान बराबर हैं।':`${winner.name} में लगभग ${money(delta)} ज़्यादा बचेगा।`);
    lines.push('यह सिर्फ़ अनुमान है, पक्की बोली नहीं। यात्रा से पहले आज का मंडी भाव और अपने खर्च जाँचें।');
    return lines.join('\n');
  }
  if(lang==='mr'){
    lines.push('मंडी साथी — माझी तुलना','');
    lines.push(`${a.name}: बाजारभाव ${money(a.price)} प्रति क्विंटल × ${q} क्विंटल`);
    lines.push(`विक्री ${money(a.gross)} − वाहतूक ${money(a.transport)} − इतर खर्च ${money(a.other)} = भरलेल्या खर्चानंतर अंदाजित रक्कम ${money(a.net)}`);
    lines.push(`${b.name}: बाजारभाव ${money(b.price)} प्रति क्विंटल × ${q} क्विंटल`);
    lines.push(`विक्री ${money(b.gross)} − वाहतूक ${money(b.transport)} − इतर खर्च ${money(b.other)} = भरलेल्या खर्चानंतर अंदाजित रक्कम ${money(b.net)}`);
    lines.push('',tie?'दोन्ही अंदाज समान आहेत.':`${winner.name} येथे सुमारे ${money(delta)} जास्त राहील.`);
    lines.push('हा फक्त अंदाज आहे, हमीभाव नाही. प्रवासापूर्वी आजचा बाजारभाव आणि तुमचा खर्च तपासा.');
    return lines.join('\n');
  }
  lines.push('Mandi Saathi — my comparison','');
  lines.push(`${a.name}: mandi price ${money(a.price)} per quintal × ${q} quintals`);
  lines.push(`Sale ${money(a.gross)} − transport ${money(a.transport)} − other costs ${money(a.other)} = estimated take-home ${money(a.net)}`);
  lines.push(`${b.name}: mandi price ${money(b.price)} per quintal × ${q} quintals`);
  lines.push(`Sale ${money(b.gross)} − transport ${money(b.transport)} − other costs ${money(b.other)} = estimated take-home ${money(b.net)}`);
  lines.push('',tie?'Both estimates are equal.':`${winner.name} leaves about ${money(delta)} more.`);
  lines.push('This is an estimate, not a guaranteed bid. Check today\'s mandi price and your costs before travelling.');
  return lines.join('\n');
}

function openShare(){
  const text=shareMessage();
  if(!text)return;
  window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
}

function show(){
  if(!last)return;
  if(canSpeak)speechSynthesis.cancel();
  const [a,b]=last,delta=Math.abs(a.net-b.net),tie=delta<0.005,winner=a.net>b.net?a:b;

  // --- Arbitrage variance metrics -------------------------------------------
  const lowerNet=Math.min(a.net,b.net);
  const pctVariance=lowerNet>0?((delta/lowerNet)*100).toFixed(1):'0.0';
  const hiPrice=a.price>=b.price?a:b;
  const loPrice=hiPrice===a?b:a;
  const negativeTrap=hiPrice.price>loPrice.price&&hiPrice.net<loPrice.net;

  // --- Verdict banner --------------------------------------------------------
  if(tie){
    $('result-title').textContent=t('Both estimates are equal.','दोन्ही अंदाज समान आहेत.','दोनों अनुमान बराबर हैं।');
    $('result-description').textContent=t('Compare other factors before choosing.','निवड करण्यापूर्वी इतर बाबी तपासा.','चुनने से पहले दूसरी बातें देखें।');
  } else if(negativeTrap){
    $('result-title').textContent=t('Negative Arbitrage Trap','नकारात्मक आर्बिट्राज सापळा','नकारात्मक आर्बिट्राज जाल');
    $('result-description').textContent=t(
      `Higher headline price at ${hiPrice.name} is wiped out by freight costs (-${money(loPrice.net-hiPrice.net)} net loss).`,
      `${hiPrice.name} येथील जास्त बाजारभाव वाहतूक खर्चामुळे संपला (-${money(loPrice.net-hiPrice.net)} निव्वळ तोटा).`,
      `${hiPrice.name} का ज़्यादा भाव ढुलाई खर्च से खत्म हो गया (-${money(loPrice.net-hiPrice.net)} शुद्ध नुकसान)।`
    );
  } else {
    $('result-title').textContent=t('Arbitrage Opportunity','आर्बिट्राज संधी','आर्बिट्राज अवसर');
    $('result-description').textContent=t(
      `${winner.name} yields +${money(delta)} (+${pctVariance}%) higher net realization after freight.`,
      `${winner.name} वाहतुकीनंतर +${money(delta)} (+${pctVariance}%) जास्त निव्वळ रक्कम देते.`,
      `${winner.name} ढुलाई के बाद +${money(delta)} (+${pctVariance}%) ज़्यादा शुद्ध रकम देता है।`
    );
  }

  $('result-reason').textContent=explain(a,b);
  $('fare-help').textContent=fareNote(a,b);
  $('results').replaceChildren(...last.map(x=>{
    const isWinner = (!tie && x === winner);
    const card=document.createElement('article');
    card.className='result-card' + (isWinner ? ' winner-card' : '');

    if (isWinner) {
      const badge = document.createElement('div');
      badge.className = 'winner-badge';
      badge.textContent = t('🏆 Highest Take-Home', '🏆 सर्वाधिक निव्वळ नफा', '🏆 सबसे ज़्यादा मुनाफ़ा');
      card.appendChild(badge);
    }

    const h=document.createElement('h3');h.textContent=x.name;

    // --- Financial Waterfall ledger -----------------------------------------
    const ledger=document.createElement('div');
    ledger.className='waterfall-ledger';

    const grossRow=document.createElement('div');
    grossRow.className='ledger-row';
    const grossLabel=document.createElement('span');
    grossLabel.textContent=t('Gross Realization','एकूण विक्री','कुल बिक्री');
    const grossVal=document.createElement('span');
    grossVal.className='num';
    grossVal.textContent=money(x.gross);
    grossRow.append(grossLabel,grossVal);

    const freightPct=x.gross>0?((x.transport/x.gross)*100).toFixed(1):'0.0';
    const freightRow=document.createElement('div');
    freightRow.className='ledger-row deduction';
    const freightLabel=document.createElement('span');
    freightLabel.textContent=t('Freight & Transit','वाहतूक खर्च','ढुलाई / गाड़ी भाड़ा');
    const freightVal=document.createElement('span');
    freightVal.className='num';
    freightVal.textContent=`-${money(x.transport)} (${freightPct}%)`;
    freightRow.append(freightLabel,freightVal);

    const levyRow=document.createElement('div');
    levyRow.className='ledger-row deduction';
    const levyLabel=document.createElement('span');
    levyLabel.textContent=t('Statutory APMC Levy','वैधानिक एपीएमसी सेस','वैधानिक एपीएमसी सेस');
    const levyVal=document.createElement('span');
    levyVal.className='num';
    levyVal.textContent=`-${money(x.other)}`;
    levyRow.append(levyLabel,levyVal);

    const divider=document.createElement('div');
    divider.className='ledger-divider';

    const netRow=document.createElement('div');
    netRow.className='ledger-row total';
    const netLabel=document.createElement('span');
    netLabel.textContent=t('Net Realized Settlement','निव्वळ हातात येणारी रक्कम','शुद्ध हाथ में आने वाली रकम');
    const netVal=document.createElement('span');
    netVal.className='num bold';
    netVal.textContent=money(x.net);
    netRow.append(netLabel,netVal);

    ledger.append(grossRow,freightRow,levyRow,divider,netRow);

    card.append(h,ledger);
    return card;
  }));
  $('result').hidden=false;
  if(canSpeak && $('speak')) {
    $('speak').hidden = false;
    $('speak').style.display = 'inline-flex';
  }
  if($('share')){ $('share').hidden=false; $('share').style.display='inline-flex'; }

  // Trigger rich voice verdict banner update
  if(window.updateVerdict){
    window.updateVerdict({nameA:a.name,netA:a.net,nameB:b.name,netB:b.net,diff:a.net-b.net,preferred:a.net>b.net?'A':'B',lang});
  }
}

function setLanguage(next){
  lang=next;
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-en]').forEach(el=>{
    const value=el.dataset[lang];
    if(value)el.textContent=value;
  });
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.lang===lang)));
  document.dispatchEvent(new Event('languagechange'));
  show();
}

document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));

// Fallback legacy #language button support if clicked
if($('language')){
  $('language').addEventListener('click',()=>{
    const nextLang=lang==='en'?'mr':lang==='mr'?'hi':'en';
    setLanguage(nextLang);
  });
}

$('comparison').addEventListener('submit',e=>{
  e.preventDefault();
  if(!$('comparison').reportValidity())return;
  if(!$('nameA').value.trim()||!$('nameB').value.trim()||!$('crop').value.trim())return;
  last=calculate();
  show();
  $('result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
});

$('reset').addEventListener('click',()=>{
  ids.forEach((id,i)=>$(id).value=defaults[i]);
  last=null;
  $('result').hidden=true;
  if($('snapshot-status'))$('snapshot-status').hidden=true;
  if($('verdict-card'))$('verdict-card').hidden=true;
});

$('comparison').addEventListener('input',()=>{
  last=null;
  $('result').hidden=true;
  if($('verdict-card'))$('verdict-card').hidden=true;
});

document.querySelectorAll('.apmc-calc-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const q=Number($('quantity').value)||5;
    const total=q*16;
    $(btn.dataset.target).value=total;
    const input=$(btn.dataset.target);
    input.dispatchEvent(new Event('input',{bubbles:true}));
  });
});

if($('speak'))$('speak').addEventListener('click',speak);
if($('share'))$('share').addEventListener('click',openShare);
