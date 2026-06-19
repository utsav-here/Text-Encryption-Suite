/**
 * algos.js — CipherForge encryption algorithm definitions
 * Uses CryptoJS (loaded via CDN in index.html)
 *
 * Each entry exposes:
 *   info    — description shown in the info bar
 *   bits    — key size in bits
 *   keyLabel — label shown next to the key input
 *   statLabel — short name for the stats card
 *   encrypt(plaintext, key) → ciphertext string
 *   decrypt(ciphertext, key) → plaintext string | null
 */

const ALGOS = {

  AES: {
    info: 'AES-256 — Advanced Encryption Standard. Military-grade symmetric block cipher. 256-bit key. The global standard for secure data encryption.',
    bits: 256,
    keyLabel: 'SECRET KEY',
    statLabel: 'AES-256',

    encrypt(msg, key) {
      return CryptoJS.AES.encrypt(msg, key).toString();
    },

    decrypt(ct, key) {
      try {
        const bytes = CryptoJS.AES.decrypt(ct, key);
        return bytes.toString(CryptoJS.enc.Utf8) || null;
      } catch { return null; }
    }
  },

  DES: {
    info: 'DES — Data Encryption Standard. Legacy 56-bit symmetric cipher developed in the 1970s. Educational use only — considered cryptographically weak.',
    bits: 56,
    keyLabel: 'SECRET KEY (8 chars)',
    statLabel: 'DES',

    _iv: CryptoJS.enc.Utf8.parse('CFRG_IV1'),

    _key(raw) {
      return CryptoJS.enc.Utf8.parse(raw.padEnd(8, '0').slice(0, 8));
    },

    encrypt(msg, key) {
      return CryptoJS.DES.encrypt(msg, this._key(key), { iv: this._iv }).toString();
    },

    decrypt(ct, key) {
      try {
        const bytes = CryptoJS.DES.decrypt(ct, this._key(key), { iv: this._iv });
        return bytes.toString(CryptoJS.enc.Utf8) || null;
      } catch { return null; }
    }
  },

  TripleDES: {
    info: '3DES — Triple DES. Applies DES cipher three times per block for 168-bit effective security. Stronger than DES but slower than AES.',
    bits: 168,
    keyLabel: 'SECRET KEY (24 chars)',
    statLabel: '3DES',

    encrypt(msg, key) {
      return CryptoJS.TripleDES.encrypt(msg, key).toString();
    },

    decrypt(ct, key) {
      try {
        const bytes = CryptoJS.TripleDES.decrypt(ct, key);
        return bytes.toString(CryptoJS.enc.Utf8) || null;
      } catch { return null; }
    }
  },

  RSA: {
    info: 'RSA (simulated) — Asymmetric public-key cipher. Browser demo uses PBKDF2 key derivation + AES. Full asymmetric RSA requires a server-side backend.',
    bits: 2048,
    keyLabel: 'PASSPHRASE (RSA sim)',
    statLabel: 'RSA*',

    _prefix: 'RSA::',

    _deriveKey(passphrase) {
      return CryptoJS.PBKDF2(passphrase, 'cf-rsa-salt-v1', {
        keySize: 8,
        iterations: 2000,
        hasher: CryptoJS.algo.SHA256
      }).toString();
    },

    encrypt(msg, passphrase) {
      const k  = this._deriveKey(passphrase);
      const ct = CryptoJS.AES.encrypt(msg, k).toString();
      return this._prefix + ct;
    },

    decrypt(ct, passphrase) {
      try {
        if (!ct.startsWith(this._prefix)) return null;
        const k     = this._deriveKey(passphrase);
        const bytes = CryptoJS.AES.decrypt(ct.slice(this._prefix.length), k);
        return bytes.toString(CryptoJS.enc.Utf8) || null;
      } catch { return null; }
    }
  },

  Rabbit: {
    info: 'Rabbit — High-performance stream cipher with 128-bit key and IV. Designed for fast software encryption. Good balance of speed and security.',
    bits: 128,
    keyLabel: 'SECRET KEY',
    statLabel: 'RABBIT',

    encrypt(msg, key) {
      return CryptoJS.Rabbit.encrypt(msg, key).toString();
    },

    decrypt(ct, key) {
      try {
        const bytes = CryptoJS.Rabbit.decrypt(ct, key);
        return bytes.toString(CryptoJS.enc.Utf8) || null;
      } catch { return null; }
    }
  },

  RC4: {
    info: 'RC4 — Rivest Cipher 4. Variable key-length stream cipher, fast and simple. Now considered legacy; avoid for sensitive production workloads.',
    bits: 128,
    keyLabel: 'SECRET KEY',
    statLabel: 'RC4',

    encrypt(msg, key) {
      return CryptoJS.RC4.encrypt(msg, key).toString();
    },

    decrypt(ct, key) {
      try {
        const bytes = CryptoJS.RC4.decrypt(ct, key);
        return bytes.toString(CryptoJS.enc.Utf8) || null;
      } catch { return null; }
    }
  }

};
