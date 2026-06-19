/**
 * app.js — CipherForge main application logic
 * Depends on: algos.js (ALGOS object) + CryptoJS (CDN)
 */

/* ── State ── */
let currentAlgoKey = 'AES';

/* ── DOM refs ── */
const elInfoBar     = document.getElementById('info-bar');
const elRsaNote     = document.getElementById('rsa-note');
const elKeyLabel    = document.getElementById('key-label');
const elKeyInput    = document.getElementById('key-input');
const elPlainInput  = document.getElementById('plain-input');
const elCipherOut   = document.getElementById('cipher-output');
const elStatusLine  = document.getElementById('status-line');
const elStatAlgo    = document.getElementById('stat-algo');
const elStatBits    = document.getElementById('stat-bits');
const elStatIn      = document.getElementById('stat-in');
const elStatOut     = document.getElementById('stat-out');
const elStatRatio   = document.getElementById('stat-ratio');

/* ── Algorithm selection ── */
function selectAlgo(key, tabEl) {
  currentAlgoKey = key;
  const algo = ALGOS[key];

  /* update tabs */
  document.querySelectorAll('.algo-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  if (tabEl) {
    tabEl.classList.add('active');
    tabEl.setAttribute('aria-selected', 'true');
  }

  /* update info */
  elInfoBar.textContent  = algo.info;
  elKeyLabel.textContent = algo.keyLabel;
  elStatAlgo.textContent = algo.statLabel;
  elStatBits.textContent = algo.bits;

  /* RSA notice */
  if (key === 'RSA') {
    elRsaNote.classList.remove('hidden');
  } else {
    elRsaNote.classList.add('hidden');
  }

  clearStatus();
}

/* ── Encrypt ── */
function doEncrypt() {
  const msg = elPlainInput.value.trim();
  const key = elKeyInput.value.trim();

  if (!msg) { setStatus('Input plaintext is empty.', 'warn'); return; }
  if (!key) { setStatus('A secret key is required.', 'err');  return; }

  try {
    const ct = ALGOS[currentAlgoKey].encrypt(msg, key);
    elCipherOut.value = ct;
    updateStats(msg, ct);
    setStatus('Encryption successful — ' + ALGOS[currentAlgoKey].statLabel + ' cipher applied.', 'ok');
  } catch (e) {
    setStatus('Encryption failed: ' + e.message, 'err');
  }
}

/* ── Decrypt ── */
function doDecrypt() {
  /* Accept ciphertext from the output box first; fall back to plain input */
  const ct  = (elCipherOut.value.trim() || elPlainInput.value.trim());
  const key = elKeyInput.value.trim();

  if (!ct)  { setStatus('No ciphertext to decrypt.', 'warn'); return; }
  if (!key) { setStatus('A secret key is required.', 'err');  return; }

  try {
    const result = ALGOS[currentAlgoKey].decrypt(ct, key);
    if (!result) {
      setStatus('Decryption failed — wrong key or corrupted ciphertext.', 'err');
      return;
    }
    elPlainInput.value  = result;
    elCipherOut.value   = ct;
    updateStats(result, ct);
    setStatus('Decryption successful — plaintext recovered.', 'ok');
  } catch (e) {
    setStatus('Decryption error: ' + e.message, 'err');
  }
}

/* ── Clear ── */
function doClear() {
  elPlainInput.value  = '';
  elCipherOut.value   = '';
  elStatIn.textContent    = '0';
  elStatOut.textContent   = '0';
  elStatRatio.textContent = '—';
  clearStatus();
}

/* ── Generate random key ── */
function genKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  const len   = currentAlgoKey === 'DES' ? 8 : 24;
  let k = '';
  for (let i = 0; i < len; i++) {
    k += chars[Math.floor(Math.random() * chars.length)];
  }
  elKeyInput.value = k;
  setStatus('Random ' + len + '-char key generated — store it securely!', 'warn');
}

/* ── Copy ciphertext ── */
function copyOutput() {
  const v = elCipherOut.value;
  if (!v) { setStatus('Nothing to copy.', 'warn'); return; }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(v)
      .then(() => setStatus('Ciphertext copied to clipboard.', 'ok'))
      .catch(() => fallbackCopy(v));
  } else {
    fallbackCopy(v);
  }
}

function fallbackCopy(text) {
  elCipherOut.select();
  document.execCommand('copy');
  setStatus('Ciphertext copied (fallback).', 'ok');
}

/* ── Stats ── */
function updateStats(plain, cipher) {
  const inBytes  = new TextEncoder().encode(plain).length;
  const outBytes = cipher ? cipher.length : 0;
  elStatIn.textContent    = inBytes;
  elStatOut.textContent   = outBytes;
  elStatRatio.textContent = inBytes > 0
    ? (outBytes / inBytes).toFixed(1) + 'x'
    : '—';
}

/* ── Status messages ── */
function setStatus(msg, type = 'ok') {
  elStatusLine.textContent = msg ? '> ' + msg : '';
  elStatusLine.className   = type;
}

function clearStatus() {
  elStatusLine.textContent = '';
  elStatusLine.className   = '';
}

/* ── Keyboard shortcuts ── */
document.addEventListener('keydown', (e) => {
  /* Ctrl/Cmd + Enter → Encrypt */
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    doEncrypt();
  }
  /* Ctrl/Cmd + Shift + Enter → Decrypt */
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
    e.preventDefault();
    doDecrypt();
  }
});

/* ── Init ── */
(function init() {
  elStatAlgo.textContent = ALGOS[currentAlgoKey].statLabel;
  elStatBits.textContent = ALGOS[currentAlgoKey].bits;
})();
