// API do Caderno ENADE: entrar com nome e senha, carregar e salvar o progresso.
// Cada perfil fica num blob privado: perfis/<sha256(nome normalizado)>.json
const { put, get } = require('@vercel/blob');
const crypto = require('crypto');

const MAX = 200 * 1024;
const norm = n => String(n || '').trim().replace(/\s+/g, ' ').slice(0, 40);
const keyOf = n => 'perfis/' + crypto.createHash('sha256').update(norm(n).toLowerCase()).digest('hex') + '.json';
const hashPw = (pw, salt) => crypto.scryptSync(String(pw), salt, 32).toString('hex');
const tokHash = t => crypto.createHash('sha256').update(t).digest('hex');
const safeEq = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

async function load(nome) {
  const r = await get(keyOf(nome), { access: 'private', useCache: false });
  if (!r || r.statusCode !== 200 || !r.stream) return null;
  return JSON.parse(await new Response(r.stream).text());
}
async function save(nome, rec) {
  await put(keyOf(nome), JSON.stringify(rec), {
    access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json'
  });
}
// Perfis que pediram para recomeçar do zero. O número é a vez do pedido: cada vez
// que ele sobe, o progresso é apagado uma vez (a senha continua a mesma) e as
// sessões abertas são encerradas.
const RECOMECAR = { paulo: 2 };
function recomecar(rec, nome) {
  const vez = RECOMECAR[norm(nome).toLowerCase()];
  const feito = rec ? (rec.recomecouVez || (rec.recomecou ? 1 : 0)) : 0;
  if (!rec || !vez || feito >= vez) return false;
  rec.dados = null; rec.tokens = []; rec.recomecou = Date.now(); rec.recomecouVez = vez;
  return true;
}
function checkToken(rec, token) {
  if (!rec || typeof token !== 'string' || token.length < 20) return false;
  const h = tokHash(token);
  return (rec.tokens || []).some(t => safeEq(t, h));
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ erro: 'metodo' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b) } catch { b = {} } }
  b = b || {};
  const nome = norm(b.nome);
  if (!nome) return res.status(400).json({ erro: 'nome' });
  try {
    if (b.acao === 'entrar') {
      const senha = String(b.senha || '');
      if (senha.length < 4 || senha.length > 100) return res.status(400).json({ erro: 'senha_curta' });
      let rec = await load(nome);
      let novo = false;
      if (!rec) {
        const salt = crypto.randomBytes(16).toString('hex');
        rec = { nome, salt, pw: hashPw(senha, salt), tokens: [], dados: null, criado: Date.now() };
        novo = true;
      } else if (!safeEq(hashPw(senha, rec.salt), rec.pw)) {
        return res.status(401).json({ erro: 'senha_errada' });
      } else {
        recomecar(rec, nome);
      }
      const token = crypto.randomBytes(24).toString('hex');
      rec.tokens = [tokHash(token)].concat(rec.tokens || []).slice(0, 10);
      await save(nome, rec);
      return res.json({ ok: true, novo, nome: rec.nome, token, dados: rec.dados });
    }
    if (b.acao === 'carregar' || b.acao === 'salvar') {
      const rec = await load(nome);
      if (recomecar(rec, nome)) { await save(nome, rec); return res.status(401).json({ erro: 'sessao' }); }
      if (!checkToken(rec, b.token)) return res.status(401).json({ erro: 'sessao' });
      if (b.acao === 'carregar') return res.json({ ok: true, nome: rec.nome, dados: rec.dados });
      const dados = b.dados;
      if (!dados || typeof dados !== 'object') return res.status(400).json({ erro: 'dados' });
      if (JSON.stringify(dados).length > MAX) return res.status(413).json({ erro: 'grande' });
      rec.dados = dados; rec.atualizado = Date.now();
      await save(nome, rec);
      return res.json({ ok: true });
    }
    return res.status(400).json({ erro: 'acao' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: 'servidor' });
  }
};
