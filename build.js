// Monta o site em public/ a partir dos arquivos de src/.
// Uso: node build.js
const fs = require('fs'), z = require('zlib'), path = require('path');
const src = p => fs.readFileSync(path.join(__dirname, 'src', p), 'utf8');
const out = path.join(__dirname, 'public');
fs.mkdirSync(out, { recursive: true });

// Página: cabeçalho + CSS + telas (com o conteúdo dos temas) + scripts
const shell = src('shell.html')
  .replace('<!--REDES-->', src('conteudo/redes.html'))
  .replace('<!--C-->', src('conteudo/c.html'))
  .replace('<!--OUTROS-->', src('conteudo/outros.html') + '\n' + src('conteudo/temas-gerais.html'));
const js = src('questoes.js') + '\n' + src('cartoes.js') + '\n' + src('questoes-gerais.js') + '\n' + src('questoes-provas.js') + '\n' + src('questoes-fg.js') + '\n' + src('explicacoes.js') + '\n' + src('discursivas.js') + '\n' + src('app.js');
let html = src('head.html') + src('style.css') + '</style>\n</head>\n<body>\n' + shell +
  '<script>\n' + js + '</script>\n</body>\n</html>\n';

// Ícones
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#F4680A"/><circle cx="32" cy="32" r="19" fill="none" stroke="#FFF6EE" stroke-width="5"/><circle cx="32" cy="32" r="8" fill="#FFF6EE"/></svg>';
fs.writeFileSync(path.join(out, 'favicon.svg'), svg);
function png(S) {
  const B = [0xf4, 0x68, 0x0a], W = [0xff, 0xf6, 0xee], k = S / 64, n = 4, raw = Buffer.alloc(S * (S * 3 + 1));
  for (let y = 0; y < S; y++) {
    raw[y * (S * 3 + 1)] = 0;
    for (let x = 0; x < S; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < n; sy++) for (let sx = 0; sx < n; sx++) {
        const u = (x + (sx + .5) / n) / k - 32, v = (y + (sy + .5) / n) / k - 32, d = Math.hypot(u, v);
        const c = d <= 8 ? W : (d >= 16.5 && d <= 21.5) ? W : B;
        r += c[0]; g += c[1]; b += c[2];
      }
      const o = y * (S * 3 + 1) + 1 + x * 3;
      raw[o] = r / n / n; raw[o + 1] = g / n / n; raw[o + 2] = b / n / n;
    }
  }
  const T = new Int32Array(256).map((_, i) => { let c = i; for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = bf => { let c = -1; for (const x of bf) c = T[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const ch = (t, d) => {
    const l = Buffer.alloc(4); l.writeUInt32BE(d.length);
    const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([l, td, c]);
  };
  const h = Buffer.alloc(13); h.writeUInt32BE(S, 0); h.writeUInt32BE(S, 4); h[8] = 8; h[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', h), ch('IDAT', z.deflateSync(raw)), ch('IEND', Buffer.alloc(0))]);
}
fs.writeFileSync(path.join(out, 'apple-touch-icon.png'), png(180));

const a = html.split('\n'), i = a.findIndex(l => l.startsWith('<title>'));
a.splice(i + 1, 0,
  '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
  '<meta name="theme-color" content="#FFFDFB" media="(prefers-color-scheme: light)">',
  '<meta name="theme-color" content="#16232A" media="(prefers-color-scheme: dark)">');
html = a.join('\n');
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('public/index.html', Buffer.byteLength(html), 'bytes');
