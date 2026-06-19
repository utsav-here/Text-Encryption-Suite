# 🔐 CipherForge — Secure Data Encryption Suite

A cyberpunk-themed, browser-based encryption tool supporting **AES-256, DES, 3DES, RSA (simulated), Rabbit, and RC4**.  
All encryption runs **100% locally in your browser** — no data is ever transmitted.

---

## 📁 Project Structure

```
cipherforge/
├── index.html          ← Main page (open this in browser)
├── css/
│   └── style.css       ← Neon-green cyberpunk stylesheet
├── js/
│   ├── algos.js        ← Encryption algorithm definitions (CryptoJS wrappers)
│   └── app.js          ← App logic, UI events, keyboard shortcuts
└── README.md
```

---

## 🚀 How to Run

**Option 1 — Open directly:**
Just open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

**Option 2 — Local dev server (recommended):**
```bash
# Python 3
python3 -m http.server 8080

# Node (npx)
npx serve .

# VS Code: use the "Live Server" extension
```
Then visit `http://localhost:8080`

---

## 🔑 Algorithms

| Tab       | Algorithm            | Key size    | Notes                              |
|-----------|----------------------|-------------|-------------------------------------|
| AES-256   | AES (CBC mode)       | 256-bit     | Military-grade, recommended         |
| DES       | Data Encryption Std  | 56-bit      | Legacy — educational only           |
| 3DES      | Triple DES           | 168-bit     | Stronger DES, legacy                |
| RSA       | RSA (simulated)      | 2048-bit*   | PBKDF2 + AES in browser; real RSA needs backend |
| RABBIT    | Rabbit stream cipher | 128-bit     | Fast, modern stream cipher          |
| RC4       | Rivest Cipher 4      | 128-bit     | Legacy stream cipher                |

---

## ⌨️ Keyboard Shortcuts

| Shortcut              | Action   |
|-----------------------|----------|
| `Ctrl/Cmd + Enter`    | Encrypt  |
| `Ctrl/Cmd + Shift + Enter` | Decrypt |

---

## 📦 Dependencies

- **[CryptoJS 4.2.0](https://github.com/brix/crypto-js)** — loaded via CDN, no npm needed
- **[Exo 2 + Share Tech Mono](https://fonts.google.com)** — Google Fonts (requires internet)

For a fully offline build, download CryptoJS locally:
```bash
npm install crypto-js
# then update the <script> src in index.html to ./node_modules/crypto-js/crypto-js.js
```

---

## 🛡️ Security Notes

- This tool is for **educational and demonstration purposes**.
- For production use, always use AES-256 and store keys in a secrets manager.
- The RSA tab is a **simulated** asymmetric flow — real RSA requires server-side key pair generation.
- Never reuse keys. Use the ⚡ GEN KEY button to generate random keys.

---

## 🎨 Customisation

| What               | Where                        |
|--------------------|------------------------------|
| Colors / theme     | `css/style.css` → `:root` variables |
| Knight SVG         | `index.html` → `#knight-bg` SVG block |
| Add algorithm      | `js/algos.js` → add entry to `ALGOS` object |
| Extend UI          | `index.html` + `js/app.js`   |

---
Free to use, modify, and distribute.
