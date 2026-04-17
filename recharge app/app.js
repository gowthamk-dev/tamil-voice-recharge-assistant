// ═══════════════════════════════════════════════
// Tamil Voice Recharge Assistant - Application Logic
// Designed for low-literacy rural users
// ═══════════════════════════════════════════════

// ── STATE ──
const state = {
  type: 'mobile',
  typeLabel: 'மொபைல் ரீசார்ஜ்',
  number: '',
  operator: '',
  amount: 0,
  payment: '',
  lastSpoken: '',
  lang: 'ta'
};

const MESSAGES = {
  welcome: {
    ta: 'வணக்கம்! மொபைல் நம்பர் சொல்லுங்க. மைக் பட்டனை தட்டி நீங்க பேசலாம்.',
    en: 'Welcome! Please tell your mobile number. You can tap the mic button to speak.'
  },
  loginPrompt: {
    ta: 'பாதுகாப்பாக உள்நுழைக. உங்கள் மொபைல் எண்ணை சொல்லுங்கள்.',
    en: 'Login securely. Please say your mobile number.'
  },
  otpSent: {
    ta: 'OTP அனுப்பப்பட்டது. நான்கு இலக்க OTP குறியீட்டை உள்ளிடவும். டெமோவிற்கு ஒன்னு ரெண்டு மூணு நாலு என்று தட்டவும்.',
    en: 'OTP sent. Please enter the 4-digit OTP. For demo, use 1 2 3 4.'
  },
  otpError: {
    ta: 'தவறான OTP. நான்கு இலக்கங்கள் மட்டும் உள்ளிடவும்.',
    en: 'Invalid OTP. Please enter exactly 4 digits.'
  },
  loginSuccess: {
    ta: 'வெற்றிகரமாக உள்நுழைந்துவிட்டீர்கள்!',
    en: 'Logged in successfully!'
  },
  dashboard: {
    ta: 'வணக்கம்! உங்களுக்கு இப்போ எந்த ரீசார்ஜ் வேணும்? மொபைல் ரீசார்ஜ், டிடிஹெச், மின்சாரம் அல்லது கேஸ் - இதுல ஒன்ன சொல்லுங்க.',
    en: 'Hello! Which recharge do you want? Say Mobile, DTH, Electricity, or Gas.'
  },
  selectService: {
    ta: '{service} தேர்வு செய்துள்ளீர்கள். இப்போ அந்த நம்பரை சொல்லுங்க.',
    en: 'You selected {service}. Now please tell the number.'
  },
  invalidNumber: {
    ta: 'நம்பர் தப்பா இருக்கு. {min} முதல் {max} இலக்கங்கள் மட்டும் சொல்லுங்க.',
    en: 'Invalid number. Please say {min} to {max} digits.'
  },
  detectOp: {
    ta: '{op} சிம் கண்டுபிடிக்கப்பட்டது. இப்போ ரீசார்ஜ் தொகையை சொல்லுங்க.',
    en: '{op} detected. Now please tell the recharge amount.'
  },
  selectAmt: {
    ta: 'ரூபாய் {amt} திட்டம் தேர்வு செய்துள்ளீர்கள். தொடர பச்சை நிற பட்டனை தட்டவும்.',
    en: 'You selected {amt} rupees plan. Tap the green button to continue.'
  },
  confirmDetail: {
    ta: 'தயவுசெய்து சரிபார்க்கவும். {service}, எண் {num}, தொகை ரூபாய் {amt}. இப்போ கட்டண முறையை சொல்லுங்க.',
    en: 'Please confirm. {service}, number {num}, amount {amt} rupees. Now select a payment method.'
  },
  paySelected: {
    ta: '{method} தேர்வு செய்துள்ளீர்கள். பணம் செலுத்த கீழே தட்டவும்.',
    en: 'You selected {method}. Tap below to pay.'
  },
  paySuccess: {
    ta: 'வாழ்த்துக்கள்! உங்கள் {service} வெற்றிகரமாக முடிந்தது. ஐந்து ரூபாய் காஷ்பேக் கிடைத்துள்ளது. நன்றி!',
    en: 'Congratulations! Your {service} was successful. You received 5 rupees cashback. Thank you!'
  },
  voiceFail: {
    ta: 'மன்னிக்கவும், குரல் கேட்கவில்லை. மீண்டும் மைக் தட்டி சொல்லுங்க.',
    en: 'Sorry, I couldn\'t hear you. Please tap the mic and try again.'
  },
  notUnderstood: {
    ta: 'மன்னிக்கவும், புரியவில்லை. மீண்டும் ஒருமுறை சொல்லுங்க.',
    en: 'Sorry, I didn\'t understand. Please say it again.'
  }
};

// ── PLANS DATA ──
const PLANS = {
  mobile: [
    { amt: 99, desc: '28 நாட்கள் | 1GB/நாள்' },
    { amt: 199, desc: '28 நாட்கள் | 1.5GB/நாள்' },
    { amt: 299, desc: '84 நாட்கள் | 1GB/நாள்' },
    { amt: 499, desc: '84 நாட்கள் | 2GB/நாள்' },
    { amt: 999, desc: '365 நாட்கள் | 2GB/நாள்' }
  ],
  dth: [
    { amt: 150, desc: 'பேசிக் | 1 மாதம்' },
    { amt: 299, desc: 'ஸ்டாண்டர்ட் | 1 மாதம்' },
    { amt: 499, desc: 'பிரீமியம் | 1 மாதம்' },
    { amt: 999, desc: 'அல்ட்ரா | 6 மாதம்' }
  ],
  electricity: [
    { amt: 200, desc: '₹200' },
    { amt: 500, desc: '₹500' },
    { amt: 1000, desc: '₹1000' },
    { amt: 2000, desc: '₹2000' }
  ],
  gas: [
    { amt: 500, desc: '₹500' },
    { amt: 800, desc: '₹800' },
    { amt: 1000, desc: '₹1000' },
    { amt: 1500, desc: '₹1500' }
  ]
};

// ── VALIDATION RULES ──
const VALIDATION = {
  mobile: { min: 10, max: 10, pattern: /^[6-9]\d{9}$/, errorTa: 'தவறான மொபைல் எண். 6-9 இல் தொடங்கும் 10 இலக்க எண் மட்டும் உள்ளிடவும்', hintTa: '10 இலக்க மொபைல் எண் (6-9 இல் தொடங்கும்)', placeholder: '10 இலக்க எண் உள்ளிடவும்' },
  dth: { min: 6, max: 12, pattern: /^\d{6,12}$/, errorTa: 'தவறான DTH எண். 6 முதல் 12 இலக்கங்கள் மட்டும் உள்ளிடவும்', hintTa: '6-12 இலக்க DTH கட்டொலி எண்', placeholder: 'DTH ID உள்ளிடவும்' },
  electricity: { min: 8, max: 15, pattern: /^\d{8,15}$/, errorTa: 'தவறான கணக்கு எண். 8 முதல் 15 இலக்கங்கள் மட்டும் உள்ளிடவும்', hintTa: '8-15 இலக்க கணக்கு எண்', placeholder: 'கணக்கு எண் உள்ளிடவும்' },
  gas: { min: 10, max: 17, pattern: /^\d{10,17}$/, errorTa: 'தவறான நுகர்வோர் எண். 10 முதல் 17 இலக்கங்கள் மட்டும் உள்ளிடவும்', hintTa: '10-17 இலக்க நுகர்வோர் எண்', placeholder: 'நுகர்வோர் எண் உள்ளிடவும்' }
};

const ICONS = { mobile: '📱', dth: '📺', electricity: '💡', gas: '🔥' };
const LABELS = { mobile: '📱 மொபைல் எண்', dth: '📺 கட்டொலி எண்', electricity: '💡 கணக்கு எண்', gas: '🔥 நுகர்வோர் எண்' };

// ── TAMIL NUMBER MAP ──
const TAMIL_NUMS = {
  'ஒன்று': '1', 'ஒண்ணு': '1', 'ஒன்னு': '1', 'one': '1',
  'இரண்டு': '2', 'ரெண்டு': '2', 'two': '2',
  'மூன்று': '3', 'மூணு': '3', 'three': '3',
  'நான்கு': '4', 'நாலு': '4', 'four': '4',
  'ஐந்து': '5', 'அஞ்சு': '5', 'five': '5',
  'ஆறு': '6', 'six': '6',
  'ஏழு': '7', 'seven': '7',
  'எட்டு': '8', 'eight': '8',
  'ஒன்பது': '9', 'nine': '9',
  'பூஜ்ஜியம்': '0', 'பூஜியம்': '0', 'ஜீரோ': '0', 'zero': '0'
};

function tamilToDigits(text) {
  let s = text.toLowerCase();
  for (const [w, n] of Object.entries(TAMIL_NUMS)) {
    s = s.replace(new RegExp(w, 'g'), n);
  }
  return s.replace(/[^0-9]/g, '');
}

// ═══ SPEECH SYNTHESIS (TTS) ═══
let isSpeaking = false;
let currentUtterance = null; // Prevent garbage collection

function speak(key, replacements = {}) {
  if (!window.speechSynthesis) return;
  
  // Get text from map or use direct string if key not found
  let text = key;
  if (MESSAGES[key]) {
    text = MESSAGES[key][state.lang];
    // Replace placeholders like {amt}
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(`{${k}}`, v);
    }
  }

  state.lastSpoken = text;
  window.speechSynthesis.cancel();
  isSpeaking = true;
  setSpeakingBar(true);
  setOrbSpeaking(true);

  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = state.lang === 'ta' ? 'ta-IN' : 'en-IN';
  utt.rate = state.lang === 'ta' ? 0.88 : 0.95;
  utt.pitch = 1.0;
  utt.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  let preferredVoice;
  if (state.lang === 'ta') {
    preferredVoice = voices.find(v => v.lang === 'ta-IN') || voices.find(v => v.lang.startsWith('ta'));
  } else {
    preferredVoice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en'));
  }
  if (preferredVoice) utt.voice = preferredVoice;

  utt.onend = () => { isSpeaking = false; setSpeakingBar(false); setOrbSpeaking(false); };
  utt.onerror = () => { isSpeaking = false; setSpeakingBar(false); setOrbSpeaking(false); };

  window.speechSynthesis.speak(utt);
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  isSpeaking = false;
  setSpeakingBar(false);
  setOrbSpeaking(false);
}

function replayVoice() {
  if (state.lastSpoken) speak(state.lastSpoken);
}

function setSpeakingBar(on) {
  document.getElementById('speakingBar').classList.toggle('active', on);
}

function setOrbSpeaking(on) {
  document.querySelectorAll('.orb').forEach(o => {
    if (on) o.classList.add('speaking');
    else o.classList.remove('speaking');
  });
  document.querySelectorAll('.transcript').forEach(t => {
    if (on) t.classList.add('speaking');
    else t.classList.remove('speaking');
  });
}

// Load voices
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

function setLanguage(lang, btn) {
  state.lang = lang;
  
  // Update Buttons UI
  if (btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  // Update small buttons globally for consistency
  document.querySelectorAll('.lang-btn-sm').forEach(b => {
    const isTa = b.textContent === 'தமிழ்';
    b.classList.toggle('active', (lang === 'ta' && isTa) || (lang === 'en' && !isTa));
  });

  // Announce change
  const msg = lang === 'ta' ? 'தமிழ் மொழி தேர்வு செய்யப்பட்டுள்ளது.' : 'Language switched to English.';
  speak(msg);
}

// ═══ SPEECH RECOGNITION (STT) ═══
let recognition = null;
let recognitionActive = false;

function stopListening() {
  recognitionActive = false;
  if (recognition) { try { recognition.stop(); } catch (e) {} recognition = null; }
  document.querySelectorAll('.orb, .mic-btn').forEach(b => b.classList.remove('listening'));
  document.querySelectorAll('.transcript').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.input-row').forEach(r => r.classList.remove('active'));
}

function startSTT(callback, onError) {
  stopListening();
  stopSpeaking();
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    speak('உலாவி குரல் அங்கீகாரிப்பை ஆதரிக்கவில்லை.');
    return;
  }
  recognition = new SpeechRec();
  recognitionActive = true;
  recognition.continuous = false;
  recognition.lang = state.lang === 'ta' ? 'ta-IN' : 'en-IN';
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;

  recognition.onresult = (e) => {
    const r = e.results[e.results.length - 1];
    const transcript = r[0].transcript.trim();
    
    // Show interim results in the UI instantly
    const activeTranscript = document.querySelector('.transcript.active span');
    if (activeTranscript) {
      activeTranscript.textContent = transcript;
    }

    if (r.isFinal) {
      stopListening();
      callback(transcript);
    }
  };
  recognition.onerror = (e) => {
    stopListening();
    if (onError) onError(e);
  };
  recognition.onend = () => {
    if (recognitionActive) {
      try { recognition.start(); } catch (err) { recognitionActive = false; }
    }
  };
  recognition.start();
}

// ═══ SCREEN NAVIGATION ═══
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function startApp() {
  showScreen('loginScreen');
  speak('welcome');
}

function goHome() {
  stopListening();
  stopSpeaking();
  showScreen('homeScreen');
  speak('dashboard');
}

function goToRecharge() {
  stopListening();
  stopSpeaking();
  showScreen('rechargeScreen');
  const serviceNames = {
    mobile: state.lang === 'ta' ? 'மொபைல் ரீசார்ஜ்' : 'Mobile Recharge',
    dth: state.lang === 'ta' ? 'DTH ரீசார்ஜ்' : 'DTH Recharge',
    electricity: state.lang === 'ta' ? 'மின்சார பில்' : 'Electricity Bill',
    gas: state.lang === 'ta' ? 'கேஸ் பில்' : 'Gas Bill'
  };
  speak('selectService', { service: serviceNames[state.type] });
}

function resetAll() {
  state.number = '';
  state.operator = '';
  state.amount = 0;
  state.payment = '';
  goHome();
}

// ═══ LOGIN FLOW ═══
function setLoginStatus(type, text) {
  const e = document.getElementById('loginStatus');
  e.className = 'status-bar' + (type ? ' ' + type : '');
  document.getElementById('loginStatusText').textContent = text;
}

function startLoginVoice() {
  const orb = document.getElementById('loginOrb');
  const tr = document.getElementById('loginTranscript');
  const trTxt = document.getElementById('loginTranscriptText');
  orb.classList.add('listening');
  tr.classList.add('active');
  trTxt.textContent = 'கேட்கிறேன்…';
  setLoginStatus('info', '🎙️ மொபைல் எண்ணை சொல்லுங்கள்…');

  startSTT(t => {
    trTxt.textContent = '"' + t + '"';
    processLoginVoice(t);
  }, () => {
    trTxt.textContent = state.lang === 'ta' ? 'மீண்டும் தட்டவும்' : 'Tap to try again';
    setLoginStatus('error', state.lang === 'ta' ? '❌ குரல் கேட்கவில்லை' : '❌ Voice not heard');
    speak('voiceFail');
  });
}

function processLoginVoice(text) {
  const digits = tamilToDigits(text);
  let cur = document.getElementById('loginInput').value;
  if (cur.length === 10) cur = '';
  const val = (cur + digits).substring(0, 10);
  document.getElementById('loginInput').value = val;
  onLoginInput();
  if (val.length > 0) {
    speak('நீங்கள் உள்ளிட்ட எண்: ' + val.split('').join(' '));
  }
}

function onLoginInput() {
  const v = document.getElementById('loginInput').value.replace(/\D/g, '');
  document.getElementById('loginInput').value = v;
  const ok = v.length === 10 && /^[6-9]\d{9}$/.test(v);
  document.getElementById('getOTPBtn').disabled = !ok;
  if (ok) {
    setLoginStatus('success', state.lang === 'ta' ? '✅ சரியான எண். OTP பெறவும்.' : '✅ Valid number. Get OTP.');
  } else if (v.length === 10) {
    const err = state.lang === 'ta' ? '❌ தவறான மொபைல் எண்' : '❌ Invalid mobile number';
    setLoginStatus('error', err);
    speak('invalidNumber', { min: 6, max: 9 }); // Specifically for 10 digits starting 6-9
  } else if (v.length > 0) {
    setLoginStatus('', '📱 ' + v.length + '/10 ' + (state.lang === 'ta' ? 'இலக்கங்கள்' : 'digits'));
  } else {
    setLoginStatus('', state.lang === 'ta' ? 'மொபைல் எண்ணை உள்ளிடவும்' : 'Enter mobile number');
  }
}

function requestOTP() {
  document.getElementById('getOTPBtn').style.display = 'none';
  document.getElementById('otpSection').style.display = 'flex';
  document.getElementById('otpSection').style.flexDirection = 'column';
  document.getElementById('otpSection').style.gap = '8px';
  // Update step dots
  const steps = document.querySelectorAll('#loginScreen .step-dot');
  if (steps[0]) steps[0].classList.replace('active', 'done');
  if (steps[1]) steps[1].classList.add('active');
  setLoginStatus('success', state.lang === 'ta' ? '✅ OTP அனுப்பப்பட்டது' : '✅ OTP Sent');
  speak('otpSent');
}

function onOTPInput() {
  const v = document.getElementById('otpInput').value.replace(/\D/g, '');
  document.getElementById('otpInput').value = v.substring(0, 4);
  document.getElementById('verifyOTPBtn').disabled = v.length < 4;
}

function verifyOTP() {
  const otp = document.getElementById('otpInput').value;
  if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
    speak('தவறான OTP. நான்கு இலக்கங்கள் மட்டும் உள்ளிடவும்.');
    setLoginStatus('error', '❌ 4 இலக்க OTP தேவை');
    return;
  }
  if (otp === '1234') {
    setLoginStatus('success', state.lang === 'ta' ? '✅ உள்நுழைவு வெற்றி!' : '✅ Login Success!');
    speak('loginSuccess');
    setTimeout(() => goHome(), 1500);
  } else {
    setLoginStatus('error', state.lang === 'ta' ? '❌ தவறான OTP. சரியான OTP: 1234' : '❌ Invalid OTP. Correct: 1234');
    speak('otpError');
  }
}

// ═══ HOME SCREEN ═══
function setHomeStatus(type, text) {
  const e = document.getElementById('homeStatus');
  e.className = 'status-bar' + (type ? ' ' + type : '');
  document.getElementById('homeStatusText').textContent = text;
}

function startHomeVoice() {
  const orb = document.getElementById('homeOrb');
  const tr = document.getElementById('homeTranscript');
  const trTxt = document.getElementById('homeTranscriptText');
  orb.classList.add('listening');
  tr.classList.add('active');
  trTxt.textContent = 'கேட்கிறேன்…';
  setHomeStatus('info', '🎙️ கேட்கிறேன்…');

  startSTT(t => {
    trTxt.textContent = '"' + t + '"';
    processHomeVoice(t);
  }, () => {
    trTxt.textContent = state.lang === 'ta' ? 'மீண்டும் முயற்சிக்கவும்' : 'Try again';
    setHomeStatus('error', state.lang === 'ta' ? '❌ குரல் கேட்கவில்லை' : '❌ Voice not heard');
    speak('voiceFail');
  });
}

function processHomeVoice(text) {
  const l = text.toLowerCase();
  if (l.includes('மொபைல்') || l.includes('mobile') || l.includes('போன்') || l.includes('phone')) {
    highlightCard('mobile');
    setHomeStatus('success', '✅ மொபைல் ரீசார்ஜ் தேர்வு');
    selectType('mobile', 'மொபைல் ரீசார்ஜ்');
  } else if (l.includes('dth') || l.includes('டிடிஹெச்') || l.includes('டிவி') || l.includes('tv') || l.includes('dish')) {
    highlightCard('dth');
    setHomeStatus('success', '✅ DTH ரீசார்ஜ் தேர்வு');
    selectType('dth', 'DTH ரீசார்ஜ்');
  } else if (l.includes('மின்') || l.includes('electricity') || l.includes('கரண்ட்') || l.includes('current') || l.includes('light')) {
    highlightCard('electricity');
    setHomeStatus('success', '✅ மின்சார பில் தேர்வு');
    selectType('electricity', 'மின்சார பில்');
  } else if (l.includes('கேஸ்') || l.includes('gas') || l.includes('சிலிண்டர்') || l.includes('cylinder')) {
    highlightCard('gas');
    setHomeStatus('success', state.lang === 'ta' ? '✅ கேஸ் பில் தேர்வு' : '✅ Gas Bill Selected');
    selectType('gas', state.lang === 'ta' ? 'கேஸ் பில்' : 'Gas Bill');
  } else {
    setHomeStatus('error', state.lang === 'ta' ? '❓ புரியவில்லை' : '❓ Not understood');
    speak('notUnderstood');
  }
}

function highlightCard(type) {
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('card-' + type);
  if (card) card.classList.add('selected');
}

// ═══ SELECT SERVICE TYPE ═══
function selectType(type, label) {
  state.type = type;
  state.typeLabel = label;
  state.number = '';
  state.operator = '';
  state.amount = 0;

  const icon = ICONS[type] || '📱';
  document.getElementById('rechargeTitleIcon').textContent = icon + ' ' + label;
  document.getElementById('numberLabel').textContent = LABELS[type];

  const rule = VALIDATION[type];
  document.getElementById('numberInput').value = '';
  document.getElementById('numberInput').placeholder = rule.placeholder;
  document.getElementById('numberInput').maxLength = rule.max;
  document.getElementById('validationHint').textContent = rule.hintTa;
  document.getElementById('amountInput').value = '';
  document.getElementById('operatorTag').style.display = 'none';
  document.getElementById('amountSection').style.display = 'none';
  document.getElementById('proceedBtn').disabled = true;

  // Update hints
  const hints = {
    mobile: 'மைக் தட்டி மொபைல் எண்ணை சொல்லுங்கள்…',
    dth: 'மைக் தட்டி DTH ID சொல்லுங்கள்…',
    electricity: 'மைக் தட்டி கணக்கு எண் சொல்லுங்கள்…',
    gas: 'மைக் தட்டி நுகர்வோர் எண் சொல்லுங்கள்…'
  };
  document.getElementById('rechargeTranscriptText').textContent = hints[type];

  // Build plan chips
  buildPlans(type);

  // Update steps
  updateSteps(1);

  showScreen('rechargeScreen');

  const announcements = {
    mobile: state.lang === 'ta' ? 'மொபைல் ரீசார்ஜ்' : 'Mobile Recharge',
    dth: state.lang === 'ta' ? 'DTH ரீசார்ஜ்' : 'DTH Recharge',
    electricity: state.lang === 'ta' ? 'மின்சார பில்' : 'Electricity Bill',
    gas: state.lang === 'ta' ? 'கேஸ் பில்' : 'Gas Bill'
  };
  speak('selectService', { service: announcements[type] });
}

function buildPlans(type) {
  const row = document.getElementById('planRow');
  row.innerHTML = '';
  const plans = PLANS[type] || [];
  plans.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'plan-chip';
    chip.innerHTML = `<div class="amount">₹${p.amt}</div><div class="desc">${p.desc}</div>`;
    chip.onclick = () => selectPlan(chip, p.amt);
    row.appendChild(chip);
  });
}

function updateSteps(current) {
  const dots = document.querySelectorAll('#rechargeSteps .step-dot');
  dots.forEach((d, i) => {
    d.classList.remove('active', 'done');
    if (i + 1 < current) d.classList.add('done');
    else if (i + 1 === current) d.classList.add('active');
  });
}

// ═══ NUMBER INPUT ═══
function setRechargeStatus(type, text) {
  const e = document.getElementById('rechargeStatus');
  e.className = 'status-bar' + (type ? ' ' + type : '');
  document.getElementById('rechargeStatusText').textContent = text;
}

function startNumberVoice() {
  const mic = document.getElementById('numberMic');
  const tr = document.getElementById('rechargeTranscript');
  const trTxt = document.getElementById('rechargeTranscriptText');
  const row = document.getElementById('numberRow');

  mic.classList.add('listening');
  tr.classList.add('active');
  row.classList.add('active');
  trTxt.textContent = 'கேட்கிறேன்…';
  setRechargeStatus('info', '🎙️ எண்ணை சொல்லுங்கள்…');

  startSTT(t => {
    trTxt.textContent = '"' + t + '"';
    processNumberVoice(t);
  }, () => {
    trTxt.textContent = state.lang === 'ta' ? 'மீண்டும் தட்டவும்' : 'Tap to try again';
    setRechargeStatus('error', state.lang === 'ta' ? '❌ குரல் கேட்கவில்லை' : '❌ Voice not heard');
    speak('voiceFail');
  });
}

function processNumberVoice(text) {
  const digits = tamilToDigits(text);
  const rule = VALIDATION[state.type];
  let cur = document.getElementById('numberInput').value;
  if (cur.length >= rule.max) cur = '';
  const val = (cur + digits).substring(0, rule.max);
  document.getElementById('numberInput').value = val;
  onNumberInput();
  if (val.length > 0) {
    speak('நீங்கள் உள்ளிட்ட எண்: ' + val.split('').join(' '));
  }
}

function onNumberInput() {
  const v = document.getElementById('numberInput').value.replace(/\D/g, '');
  document.getElementById('numberInput').value = v;
  const rule = VALIDATION[state.type];

  if (v.length >= rule.min && v.length <= rule.max && rule.pattern.test(v)) {
    // Valid
    state.number = v;
    if (state.type === 'mobile') detectOperator(v);
    const sec = document.getElementById('amountSection');
    sec.style.display = 'flex';
    sec.style.flexDirection = 'column';
    sec.style.gap = '12px';
    updateSteps(2);
    setRechargeStatus('success', state.lang === 'ta' ? '✅ சரியான எண். தொகை தேர்வு செய்யவும்' : '✅ Valid number. Select Amount');
  } else if (v.length >= rule.max) {
    setRechargeStatus('error', '❌ ' + (state.lang === 'ta' ? rule.errorTa : 'Invalid Number'));
    document.getElementById('operatorTag').style.display = 'none';
    speak('invalidNumber', { min: rule.min, max: rule.max });
  } else if (v.length > 0) {
    setRechargeStatus('', '📝 ' + v.length + '/' + rule.min + '-' + rule.max + ' ' + (state.lang === 'ta' ? 'இலக்கங்கள்' : 'digits'));
    document.getElementById('operatorTag').style.display = 'none';
  } else {
    setRechargeStatus('', state.lang === 'ta' ? 'எண்ணை உள்ளிடவும்' : 'Enter the number');
    document.getElementById('operatorTag').style.display = 'none';
  }
  checkProceed();
}

function detectOperator(num) {
  let op;
  const first = parseInt(num[0]);
  if (first <= 7) op = 'Airtel';
  else if (num.startsWith('99') || num.startsWith('97')) op = 'Vi';
  else op = 'Jio';

  state.operator = op;
  document.getElementById('operatorTag').style.display = 'block';
  document.getElementById('operatorText').textContent = '✓ ' + op + (state.lang === 'ta' ? ' கண்டுபிடிக்கப்பட்டது' : ' Detected');

  speak('detectOp', { op: op });
}

// ═══ PLAN / AMOUNT ═══
function selectPlan(el, amt) {
  document.querySelectorAll('.plan-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.amount = amt;
  document.getElementById('amountInput').value = amt;
  updateSteps(3);
  setRechargeStatus('success', state.lang === 'ta' ? '✅ ₹' + amt + ' திட்டம் தேர்வு செய்துள்ளீர்கள்' : '✅ Plan ₹' + amt + ' Selected');
  speak('selectAmt', { amt: amt });
  checkProceed();
}

function onAmountInput() {
  const v = document.getElementById('amountInput').value.replace(/\D/g, '');
  document.getElementById('amountInput').value = v;
  state.amount = parseInt(v) || 0;
  document.querySelectorAll('.plan-chip').forEach(c => c.classList.remove('selected'));
  if (state.amount > 0) updateSteps(3);
  checkProceed();
}

function startAmountVoice() {
  document.getElementById('amountMic').classList.add('listening');
  const prompt = state.lang === 'ta' ? 'தொகையை சொல்லுங்கள்' : 'Please say the amount';
  speak(prompt);
  setTimeout(() => {
    startSTT(text => {
      const num = text.replace(/[^0-9]/g, '');
      if (num) {
        document.getElementById('amountInput').value = num;
        state.amount = parseInt(num);
        document.querySelectorAll('.plan-chip').forEach(c => {
          c.classList.toggle('selected', c.querySelector('.amount').textContent === '₹' + num);
        });
        updateSteps(3);
        setRechargeStatus('success', state.lang === 'ta' ? '✅ ₹' + num + ' உள்ளிடப்பட்டது' : '✅ ₹' + num + ' Entered');
        speak('selectAmt', { amt: num });
        checkProceed();
      } else {
        speak('notUnderstood');
      }
    }, () => speak('voiceFail'));
  }, 1200);
}

function checkProceed() {
  const num = document.getElementById('numberInput').value;
  const amt = state.amount || parseInt(document.getElementById('amountInput').value) || 0;
  const rule = VALIDATION[state.type];
  const numValid = rule.pattern.test(num);
  document.getElementById('proceedBtn').disabled = !(numValid && amt >= 10);
}

// ═══ CONFIRM SCREEN ═══
function goToConfirm() {
  const num = document.getElementById('numberInput').value;
  const amt = state.amount || parseInt(document.getElementById('amountInput').value) || 0;
  const rule = VALIDATION[state.type];

  if (!num || !rule.pattern.test(num)) {
    speak('invalidNumber', { min: rule.min, max: rule.max });
    return;
  }
  if (!amt || amt < 10) {
    const msg = state.lang === 'ta' ? 'தொகையை தேர்வு செய்யவும்' : 'Please select an amount';
    speak(msg);
    return;
  }

  state.number = num;
  state.amount = amt;

  // Fill confirm card
  document.getElementById('cfService').textContent = ICONS[state.type] + ' ' + state.typeLabel;
  document.getElementById('cfNumber').textContent = num;
  document.getElementById('cfAmount').textContent = '₹' + amt;

  if (state.type === 'mobile' && state.operator) {
    document.getElementById('cfOperatorRow').style.display = 'flex';
    document.getElementById('cfOperator').textContent = state.operator;
  } else {
    document.getElementById('cfOperatorRow').style.display = 'none';
  }

  // Reset payment
  state.payment = '';
  document.querySelectorAll('.pay-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('payBtn').disabled = true;

  showScreen('confirmScreen');
  speak('confirmDetail', { service: state.typeLabel, num: num.split('').join(' '), amt: amt });
}

function setConfirmStatus(type, text) {
  const e = document.getElementById('confirmStatus');
  e.className = 'status-bar' + (type ? ' ' + type : '');
  document.getElementById('confirmStatusText').textContent = text;
}

function startConfirmVoice() {
  const orb = document.getElementById('confirmOrb');
  const tr = document.getElementById('confirmTranscript');
  const trTxt = document.getElementById('confirmTranscriptText');
  orb.classList.add('listening');
  tr.classList.add('active');
  trTxt.textContent = 'கேட்கிறேன்…';

  startSTT(t => {
    trTxt.textContent = '"' + t + '"';
    processConfirmVoice(t);
  }, () => {
    trTxt.textContent = state.lang === 'ta' ? 'மீண்டும் தட்டவும்' : 'Tap to try again';
    speak('voiceFail');
  });
}

function processConfirmVoice(text) {
  const l = text.toLowerCase();

  // Payment method detection
  if (l.includes('phonep') || l.includes('போன்பே') || l.includes('phone pe')) {
    selectPayment(null, 'PhonePe');
  } else if (l.includes('gpay') || l.includes('google') || l.includes('கூகுள்')) {
    selectPayment(null, 'GPay');
  } else if (l.includes('paytm') || l.includes('பேடிஎம்')) {
    selectPayment(null, 'Paytm');
  } else if (l.includes('bank') || l.includes('நெட்') || l.includes('net') || l.includes('வங்கி')) {
    selectPayment(null, 'NetBanking');
  }

  // Confirm / cancel
  if (l.includes('உறுதி') || l.includes('confirm') || l.includes('proceed') || l.includes('செலுத்து') || l.includes('pay') || l.includes('ஓகே') || l.includes('ok') || l.includes('yes') || l.includes('ஆம்')) {
    if (state.payment) {
      processPayment();
    } else {
      const msg = state.lang === 'ta' ? 'முதலில் கட்டண முறையை தேர்வு செய்யுங்கள்.' : 'First select a payment method.';
      speak(msg);
    }
  } else if (l.includes('ரத்து') || l.includes('cancel') || l.includes('back') || l.includes('திரும்ப') || l.includes('வேண்டாம்')) {
    const msg = state.lang === 'ta' ? 'ரத்து செய்கிறோம்.' : 'Cancelling.';
    speak(msg);
    setTimeout(() => goToRecharge(), 1000);
  }
}

// ═══ PAYMENT ═══
function selectPayment(el, method) {
  document.querySelectorAll('.pay-card').forEach(c => c.classList.remove('selected'));
  if (el) {
    el.classList.add('selected');
  } else {
    const nameMap = { 'GPay': 'Google Pay', 'NetBanking': 'Net Banking' };
    const displayName = nameMap[method] || method;
    document.querySelectorAll('.pay-card').forEach(c => {
      if (c.querySelector('.pay-name').textContent === displayName) c.classList.add('selected');
    });
  }
  state.payment = method;
  document.getElementById('payBtn').disabled = false;
  setConfirmStatus('success', '✅ ' + method + (state.lang === 'ta' ? ' தேர்வு' : ' Selected'));

  speak('paySelected', { method: method });
}

function processPayment() {
  if (!state.payment) {
    speak('கட்டண முறை தேர்வு செய்யவும்.');
    return;
  }

  const txn = Math.floor(100000 + Math.random() * 900000);
  document.getElementById('txnId').textContent = txn;

  const tamilPayment = { 'PhonePe': 'போன்பே', 'GPay': 'கூகுள் பே', 'Paytm': 'பேடிஎம்', 'NetBanking': 'நெட் பேங்கிங்' };
  document.getElementById('successDetail').innerHTML =
    '<strong>' + state.typeLabel + '</strong> வெற்றிகரமாக முடிந்தது!<br>' +
    'எண்: ' + state.number + '<br>' +
    'தொகை: ₹' + state.amount + '<br>' +
    (state.lang === 'ta' ? ' மூலம் கட்டணம்' : ' Payment');
    
  showScreen('successScreen');
  launchConfetti();

  speak('paySuccess', { service: state.typeLabel });
}

// ═══ CONFETTI ═══
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  container.innerHTML = '';
  const colors = ['#f97316', '#22c55e', '#38bdf8', '#fbbf24', '#a78bfa', '#f472b6'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
  }

  setTimeout(() => { container.innerHTML = ''; }, 4000);
}

// ═══ INIT ═══
window.addEventListener('DOMContentLoaded', () => {
  showScreen('welcomeScreen');
});
