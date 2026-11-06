// Hold / Sell Later scenario script
// Multilingual support: English, Marathi, Hindi

const holdForm = document.getElementById('hold-form');
const holdResult = document.getElementById('hold-result');
const holdIds = ['hold-quantity', 'hold-now', 'hold-later', 'hold-cost', 'hold-loss'];
const readHold = id => Number(document.getElementById(id).value);

// -----------------------------------------------------------------------------
// Audio-read-aloud button
const holdOutput = document.getElementById('hold-output');
let audioBtn = document.getElementById('hold-audio-btn');
if (!audioBtn && typeof document !== 'undefined') {
  audioBtn = document.createElement('button');
  audioBtn.id = 'hold-audio-btn';
  audioBtn.type = 'button';
  audioBtn.textContent = '🔊 Listen';
  audioBtn.title = 'Listen to the summary';
  if (audioBtn.style) {
    audioBtn.style.marginLeft = '8px';
    audioBtn.style.cursor = 'pointer';
  }
  if (holdOutput && holdOutput.parentNode && holdOutput.parentNode.insertBefore) {
    holdOutput.parentNode.insertBefore(audioBtn, holdOutput.nextSibling);
  }
}

if (audioBtn && audioBtn.addEventListener) {
  audioBtn.addEventListener('click', () => {
    const text = holdOutput ? holdOutput.textContent : '';
    if (!text) return;
    if (typeof SpeechSynthesisUtterance === 'undefined' || typeof window === 'undefined' || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    const lang = (document.documentElement && document.documentElement.lang) || 'en';
    utter.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  });
}

// -----------------------------------------------------------------------------
// Core rendering logic
function renderHold() {
  const q = readHold('hold-quantity'),
        now = readHold('hold-now'),
        later = readHold('hold-later'),
        cost = readHold('hold-cost'),
        loss = readHold('hold-loss');

  const sellNow = q * now;
  const remaining = q * (1 - loss / 100);
  const future = remaining * later - cost;
  const breakEven = (sellNow + cost) / remaining;

  const format = x => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(x);

  const lang = (document.documentElement && document.documentElement.lang) || 'en';

  if (lang === 'hi') {
    document.getElementById('hold-output').textContent = `अभी बिक्री: ${format(sellNow)}। आपके माने हुए भाव पर बाद में: ${format(future)}। बराबर रकम के लिए बाद का भाव: ${format(breakEven)} प्रति क्विंटल।`;
  } else if (lang === 'mr') {
    document.getElementById('hold-output').textContent = `आता विक्री: ${format(sellNow)}. गृहीत धरलेल्या भावाने नंतर: ${format(future)}. समान रक्कम मिळण्यासाठी नंतरचा भाव: ${format(breakEven)} प्रति क्विंटल.`;
  } else {
    document.getElementById('hold-output').textContent = `Sell now: ${format(sellNow)}. Later at your assumed price: ${format(future)}. Break-even later price: ${format(breakEven)} per quintal.`;
  }

  if (holdResult) holdResult.hidden = false;
  else if (document.getElementById('hold-result')) document.getElementById('hold-result').hidden = false;
}

if (holdForm) {
  holdForm.addEventListener('submit', event => {
    event.preventDefault();
    if (holdForm.reportValidity()) renderHold();
  });

  holdForm.addEventListener('input', () => {
    const el = holdResult || document.getElementById('hold-result');
    if (el) el.hidden = true;
  });
}

document.addEventListener('languagechange', () => {
  const el = holdResult || document.getElementById('hold-result');
  if (el && !el.hidden) renderHold();
});

const legacyLang = document.getElementById('language');
if (legacyLang) {
  legacyLang.addEventListener('click', () => {
    const el = holdResult || document.getElementById('hold-result');
    if (el && !el.hidden) renderHold();
  });
}
