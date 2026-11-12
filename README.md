# Caderno ENADE Computação

Site de estudo para o ENADE de Ciência da Computação: resumos por tema, diagnóstico, treinos, simulado e plano de estudo até a prova. Em produção em https://caderno-enade.vercel.app.

## Estrutura

- `src/head.html`, `src/style.css`, `src/shell.html`: cabeçalho, estilo e telas.
- `src/conteudo/`: resumos dos temas (redes, C, assuntos gerais e os demais temas da prova).
- `src/questoes.js`, `src/questoes-gerais.js`, `src/cartoes.js`: banco de questões e cartões de revisão.
- `src/app.js`: navegação, diagnóstico, treinos e plano.
- `api/perfil.js`: login por nome e senha e progresso salvo no Vercel Blob.
- `build.js`: junta tudo em `public/index.html` e gera os ícones.

## Rodar

```
node build.js
```

O resultado fica em `public/`. Na Vercel, o build roda `node build.js` (ver `vercel.json`). A API precisa da variável `BLOB_READ_WRITE_TOKEN`, criada pela Vercel ao ligar o Blob ao projeto; ela não fica no repositório.
