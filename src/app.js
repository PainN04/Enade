(function(){
const LETTERS='ABCDE';
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
BANK.forEach((q,i)=>q.id=i);
const NAMES={'r-camadas':'Camadas e protocolos','r-tcp':'TCP x UDP','r-portas':'Portas','r-ip':'Sub-redes e IPv4','r-rot':'Roteamento','r-enl':'Enlace e Wi-Fi',
'c-ptr':'Ponteiros e parâmetros','c-vet':'Vetores','c-str':'Strings e char','c-op':'Operadores','c-rec':'Recursão','c-static':'Variável static','c-lacos':'Laços e switch','c-conc':'Threads e concorrência',
'a-arq':'Arquitetura e circuitos','a-alg':'Algoritmos e complexidade','a-ed':'Estruturas de dados','a-grafo':'Grafos','a-teo':'Teoria da computação e compiladores','a-so':'Sistemas operacionais','a-bd':'Banco de dados','a-es':'Engenharia de software e IHC','a-log':'Lógica e matemática discreta','a-ia':'Inteligência artificial','a-seg':'Segurança e nuvem'};
const TOPICS=Object.keys(NAMES);
const AREA={'a-arq':'Hardware','a-alg':'Algoritmos','a-ed':'Algoritmos','a-grafo':'Algoritmos','a-teo':'Fundamentos','a-log':'Fundamentos','a-so':'Sistemas','a-bd':'Sistemas','a-seg':'Sistemas','a-es':'Software','a-ia':'Inteligência artificial'};
const AREAS=['Algoritmos','Programação em C','Hardware','Redes','Sistemas','Fundamentos','Software','Inteligência artificial'];
const area=k=>k==='prova'?'Sobre a prova':AREA[k]||(k[0]==='r'?'Redes':'Programação em C');
const DIAG=['a-alg','a-ed','a-grafo','a-arq','a-teo','a-log','a-so','a-bd','a-es','a-ia','a-seg','r-tcp','r-ip','c-ptr','c-vet','c-rec'];
const VIEWS=['inicio','estudar','ler','praticar','progresso'];
const ALIAS={simulado:'praticar',plano:'progresso',redes:'estudar',c:'estudar',outros:'ler/prova'};
const TABOF={inicio:'inicio',estudar:'estudar',ler:'estudar',praticar:'praticar',progresso:'progresso'};
const INEP='https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enade/provas-e-gabaritos';
const PLAN=[
{d:'2026-11-12',foco:0},
{d:'2026-11-13',foco:1},
{d:'2026-11-14',foco:2},
{d:'2026-11-15',foco:3},
{d:'2026-11-16',t:'Simulado: só o componente específico da prova de 2021 (questões 9 a 35), em 2 horas.',x:1},
{d:'2026-11-17',t:'Arquitetura e circuitos: tabela-verdade, simplificação de expressões, pipeline e memória cache.',st:'topic:a-arq',k:'a-arq'},
{d:'2026-11-18',t:'Algoritmos e complexidade: notação O, ordenação, busca, recorrências e algoritmos gulosos.',st:'topic:a-alg',k:'a-alg'},
{d:'2026-11-19',t:'Teoria da computação e compiladores: autômatos, gramáticas, P x NP, LL e LR.',st:'topic:a-teo',k:'a-teo'},
{d:'2026-11-20',t:'Estruturas de dados e grafos: árvore binária de busca, AVL, heap, Dijkstra, Kruskal e busca em profundidade.',st:'topic:a-ed',k:'a-ed'},
{d:'2026-11-21',t:'Prova completa de 2017, em 4 horas, com correção pelo gabarito.',x:1},
{d:'2026-11-22',t:'Engenharia de software e IHC; banco de dados (SQL e normalização).',st:'topic:a-bd',k:'a-bd'},
{d:'2026-11-23',t:'Lógica e matemática discreta; sistemas operacionais (escalonamento, paginação e deadlock).',st:'topic:a-so',k:'a-so'},
{d:'2026-11-24',t:'Inteligência artificial e aprendizado de máquina; segurança e computação em nuvem.',st:'topic:a-ia',k:'a-ia'},
{d:'2026-11-25',t:'Prova completa de 2014, em 4 horas, com correção pelo gabarito.',x:1},
{d:'2026-11-26',t:'Refazer as questões que você errou e revisar seus temas mais fracos.',st:'erros'},
{d:'2026-11-27',t:'Prova completa de 2011, em 4 horas.',x:1},
{d:'2026-11-28',t:'Revisão leve com os cartões de memorização.',st:'cards'},
{d:'2026-11-29',t:'Dia da prova. Descanse e chegue cedo.'}];
const WD=['dom','seg','ter','qua','qui','sex','sáb'];

/* ---------- perfil: local para visitante, nuvem para quem entra ---------- */
function blank(){return {stats:{},diag:null,hist:[],plan:{},err:{},seen:{},read:{},fc:{},days:[]}}
function norm(p){p=p&&typeof p==='object'?p:{};
['stats','plan','err','seen','read','fc'].forEach(k=>{if(!p[k]||typeof p[k]!=='object'||Array.isArray(p[k]))p[k]={}});
['hist','days'].forEach(k=>{if(!Array.isArray(p[k]))p[k]=[]});
if(!p.diag)p.diag=null;return p}
function hasAny(p){return Object.keys(p.stats).length||p.hist.length||Object.keys(p.plan).length||Object.keys(p.fc).length||Object.keys(p.read).length}
let LOCAL=norm(store.get('enade-local',null));
const API='/api/perfil';
const CLOUD={on:false,p:null,nome:'',token:'',writing:false,dirty:false,pending:false,err:'',timer:null};
function prof(){return CLOUD.on?CLOUD.p:LOCAL}
async function api(body){const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});let j={};try{j=await r.json()}catch(e){}if(!r.ok)throw Object.assign(new Error(j.erro||'erro'),{code:j.erro||'erro',status:r.status});return j}
function save(){if(CLOUD.on){CLOUD.pending=true;clearTimeout(CLOUD.timer);CLOUD.timer=setTimeout(cloudWrite,600)}else store.set('enade-local',LOCAL)}
async function cloudWrite(){CLOUD.pending=false;if(!CLOUD.on)return;CLOUD.dirty=true;if(CLOUD.writing)return;CLOUD.writing=true;renderSync();
try{while(CLOUD.dirty&&CLOUD.on){CLOUD.dirty=false;await api({acao:'salvar',nome:CLOUD.nome,token:CLOUD.token,dados:CLOUD.p})}CLOUD.err=''}
catch(e){if(e.code==='sessao'){endSession();CLOUD.err='sessao';refreshAll()}else{CLOUD.err='fail';CLOUD.pending=true;clearTimeout(CLOUD.timer);CLOUD.timer=setTimeout(cloudWrite,8000)}}
finally{CLOUD.writing=false;renderSync()}}
function endSession(){clearTimeout(CLOUD.timer);CLOUD.on=false;CLOUD.p=null;CLOUD.nome='';CLOUD.token='';CLOUD.pending=false;CLOUD.dirty=false;store.set('enade-sessao',null)}
function renderSync(){const el=$('#syncNote');
if(CLOUD.on)el.innerHTML='<span class="sdot'+(CLOUD.writing?'':CLOUD.err==='fail'?' bad':' ok')+'"></span>'+(CLOUD.writing?'Salvando...':CLOUD.err==='fail'?'Sem conexão agora. Seu progresso será salvo assim que a internet voltar.':'Tudo salvo. Entre com o mesmo nome e senha em qualquer aparelho.');
else if(CLOUD.err==='sessao')el.innerHTML='<span class="sdot"></span>Sua sessão expirou. Entre de novo com seu nome e senha.';
else el.innerHTML=''}
function openLogin(){const d=$('#loginDlg');$('#loginMsg').textContent='';$('#loginMsg').className='empty msg';const b=$('#btnLogin');b.removeAttribute('aria-busy');b.disabled=false;
if(d.showModal){if(!d.open)d.showModal()}else d.setAttribute('open','');setTimeout(()=>$('#nomeIn').focus(),30)}
function closeLogin(){const d=$('#loginDlg');if(d.close&&d.open)d.close();else d.removeAttribute('open')}
async function login(name,senha){name=name.trim().replace(/\s+/g,' ').slice(0,40);const msg=$('#loginMsg');
const btn=$('#btnLogin'),say=(t,c)=>{msg.textContent=t;msg.className='empty msg'+(c?' '+c:'')};
if(!name){say('Digite seu nome.','err');$('#nomeIn').focus();return}
if(!senha||senha.length<4){say('A senha precisa ter pelo menos 4 caracteres.','err');$('#senhaIn').focus();return}
say('Entrando...');btn.setAttribute('aria-busy','true');btn.disabled=true;
try{const j=await api({acao:'entrar',nome:name,senha});
CLOUD.nome=j.nome;CLOUD.token=j.token;CLOUD.err='';
const remote=j.dados?norm(j.dados):null;
if(remote&&(hasAny(remote)||!hasAny(LOCAL))){CLOUD.p=remote;CLOUD.on=true}
else{CLOUD.p=LOCAL;CLOUD.on=true;LOCAL=blank();store.set('enade-local',LOCAL);cloudWrite()}
store.set('enade-sessao',{nome:CLOUD.nome,token:CLOUD.token});$('#senhaIn').value='';closeLogin();refreshAll()}
catch(e){btn.removeAttribute('aria-busy');btn.disabled=false;say(e.code==='senha_errada'?'Esse nome já existe e a senha não confere. Confira a senha ou use outro nome.':e.code==='senha_curta'?'A senha precisa ter pelo menos 4 caracteres.':'Não deu para conectar agora. Tente de novo em instantes.','err')}}
function logout(){if(CLOUD.pending||CLOUD.dirty)flush();endSession();resetPractice();location.hash='inicio';refreshAll()}
function flush(){try{fetch(API,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({acao:'salvar',nome:CLOUD.nome,token:CLOUD.token,dados:CLOUD.p})})}catch(e){}}
async function initCloud(){const s=store.get('enade-sessao',null);if(!s||!s.token)return;
try{const j=await api({acao:'carregar',nome:s.nome,token:s.token});if(cur||fc||CLOUD.pending||CLOUD.dirty)return;
CLOUD.on=true;CLOUD.nome=j.nome;CLOUD.token=s.token;CLOUD.p=norm(j.dados);refreshAll()}
catch(e){if(e.code==='sessao'){endSession();CLOUD.err='sessao';refreshAll()}}}
window.addEventListener('pagehide',()=>{if(CLOUD.on&&(CLOUD.pending||CLOUD.dirty))flush()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&CLOUD.on&&!CLOUD.writing&&!CLOUD.pending&&!CLOUD.dirty&&!cur&&!fc)initCloud()});

/* ---------- contas do perfil ---------- */
function fmtISO(n){return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')}
function todayISO(){return fmtISO(new Date())}
function isoAdd(iso,k){const [y,m,d]=iso.split('-').map(Number);return fmtISO(new Date(y,m-1,d+k))}
function fmtD(iso){const [y,m,d]=iso.split('-').map(Number);const dt=new Date(y,m-1,d);return {dm:String(d).padStart(2,'0')+'/'+String(m).padStart(2,'0'),wd:WD[dt.getDay()],day:d}}
function acc(st){const v=prof().stats[st];return v&&v[1]?v[0]/v[1]:null}
function level(a){return a===null?['na','Não treinado']:a>=.75?['ok','Bom']:a>=.4?['mid','Revisar']:['bad','Estudar']}
function weakTopics(){return TOPICS.map(k=>[k,acc(k)]).filter(([,a])=>a!==null&&a<.75).sort((a,b)=>a[1]-b[1]).map(x=>x[0])}
function hasData(){return Object.keys(prof().stats).length>0}
/* ordem pessoal: mais fracos primeiro, depois os não treinados, depois os bons */
function ordered(){const rank=k=>{const a=acc(k);return a===null?1:a<.75?a:2+a};return TOPICS.slice().sort((x,y)=>rank(x)-rank(y)||TOPICS.indexOf(x)-TOPICS.indexOf(y))}
function adaptPlan(){const w=weakTopics(),P=prof();PLAN.forEach(p=>{if(p.foco===undefined)return;
if(!P.diag&&!w.length){p.t=p.foco===0?'Fazer o diagnóstico para descobrir seus temas mais fracos.':'Reforço dos seus temas mais fracos (definidos pelo diagnóstico).';p.st=p.foco===0?'diag':'';p.k=null;return}
const ks=w.slice(p.foco*2,p.foco*2+2);
if(!ks.length){p.t='Revisão livre: um treino de 10 questões de todos os temas.';p.st='foco';p.k=null;return}
p.t=ks.length>1?'Reforço em dois temas: '+NAMES[ks[0]]+'; '+NAMES[ks[1]]+'.':'Reforço: '+NAMES[ks[0]]+'.';p.st='topic:'+ks[0];p.k=ks[0]})}
function totals(){let o=0,n=0;Object.values(prof().stats).forEach(v=>{o+=v[0];n+=v[1]});return [o,n]}
function errIds(){return Object.keys(prof().err).map(Number).filter(i=>BANK[i])}
function touchDay(){const P=prof(),t=todayISO();if(P.days[P.days.length-1]!==t){P.days.push(t);P.days=P.days.slice(-60)}}
function streak(){const s=new Set(prof().days);let d=todayISO();if(!s.has(d))d=isoAdd(d,-1);let n=0;while(s.has(d)){n++;d=isoAdd(d,-1)}return n}
function record(q,right){const P=prof();const v=P.stats[q.s]||[0,0];v[1]++;if(right)v[0]++;P.stats[q.s]=v;P.seen[q.id]=1;
if(!right)P.err[q.id]=0;else if(q.id in P.err){P.err[q.id]++;if(P.err[q.id]>=2)delete P.err[q.id]}
touchDay()}
function daysLeft(){const now=new Date();const t=new Date(2026,10,29);const a=new Date(now.getFullYear(),now.getMonth(),now.getDate());return Math.round((t-a)/864e5)}
function daysTxt(){const d=daysLeft();return d>1?d+' dias até a prova (29/11)':d===1?'Amanhã é a prova':d===0?'Hoje é a prova. Boa sorte!':'A prova já passou'}

/* ---------- pedaços comuns ---------- */
function chip(k){const [c,l]=level(acc(k));return '<span class="lv '+c+'">'+l+(acc(k)!==null?' · '+Math.round(100*acc(k))+'%':'')+'</span>'}
function topicRow(k){const P=prof(),has=!!CHUNK[k];
return '<div class="trow2"><div class="tinfo">'+(has?'<a class="tname" href="#ler/'+k+'">'+NAMES[k]+'</a>':'<span class="tname">'+NAMES[k]+'</span>')+'<span class="tmeta">'+area(k)+(P.read[k]?' · <span class="readmark">lido</span>':'')+'</span></div>'+chip(k)+
'<div class="tact">'+(has?'<a class="btnlink" href="#ler/'+k+'">Ler</a>':'')+'<button type="button" class="mini" data-topic="'+k+'">Treinar</button></div></div>'}
function nextStep(){const P=prof(),t=todayISO(),e=errIds().length,w=weakTopics();
if(!P.diag)return {e:'Próximo passo',t:'Faça o diagnóstico',d:'São 16 questões, uma de cada tema, em cerca de 15 minutos. Depois disso o site mostra o que você precisa estudar primeiro.',b:'Fazer o diagnóstico',a:'diag'};
const p=PLAN.find(x=>x.d===t);
if(p&&!P.plan[t]){const o={e:'Plano de hoje · '+fmtD(t).dm,t:p.t,d:'',day:t};
if(p.st==='diag')Object.assign(o,{b:'Fazer o diagnóstico',a:'diag'});
else if(p.st&&p.st.indexOf('topic:')===0)Object.assign(o,{b:'Treinar '+NAMES[p.k],a:p.st,l:CHUNK[p.k]?'#ler/'+p.k:'',lb:'Ler o resumo antes'});
else if(p.st==='erros')Object.assign(o,{b:'Refazer meus erros',a:'erros'});
else if(p.st==='cards')Object.assign(o,{b:'Abrir os cartões',a:'cards'});
else if(p.st==='foco')Object.assign(o,{b:'Começar treino',a:'foco'});
else Object.assign(o,{b:'Marcar como feito',a:'done:'+t,x:p.x});
return o}
const lastDiag=P.hist[0]&&P.hist[0].tema==='diag';
if(w.length&&lastDiag)return {e:'Próximo passo',t:'Comece por '+NAMES[w[0]],d:'É o seu tema com menor acerto no diagnóstico. Leia o resumo e faça um treino curto de 6 questões.',b:'Treinar este tema',a:'topic:'+w[0],l:CHUNK[w[0]]?'#ler/'+w[0]:'',lb:'Ler o resumo antes'};
if(e>=5)return {e:'Próximo passo',t:'Refaça seus erros',d:'Você tem '+e+' questões erradas guardadas. Cada uma sai da lista depois de dois acertos seguidos.',b:'Refazer '+e+' erros',a:'erros'};
if(w.length)return {e:'Próximo passo',t:'Reforce '+NAMES[w[0]],d:'É o seu tema com menor acerto agora ('+Math.round(100*acc(w[0]))+'%). Leia o resumo e faça um treino curto.',b:'Treinar este tema',a:'topic:'+w[0],l:CHUNK[w[0]]?'#ler/'+w[0]:'',lb:'Ler o resumo'};
return {e:'Próximo passo',t:'Faça um simulado com tempo',d:'Você está com 75% ou mais em todos os temas que treinou. Teste o ritmo com 10 questões corrigidas só no fim.',b:'Começar simulado',a:'prova'}}

/* ---------- início ---------- */
function renderHome(){const P=prof(),el=$('#homeBody');
$('#hello').textContent=CLOUD.on?'Olá, '+CLOUD.nome+'!':'Olá!';
let h='<p class="sub-h">'+daysTxt()+'</p>';
if(!P.diag){
h+='<div class="welcome"><h2>Como funciona</h2><ol class="steps">'+
'<li class="on"><b>Faça o diagnóstico</b><span>16 questões, cerca de 15 minutos. Mostra em quais temas você está bem e em quais precisa estudar.</span></li>'+
'<li><b>Estude seus temas mais fracos</b><span>A aba Estudar passa a mostrar os resumos na ordem do que você mais precisa.</span></li>'+
'<li><b>Pratique todo dia</b><span>Treinos curtos com questões de provas anteriores. Seus erros voltam até você acertar.</span></li></ol>'+
'<div class="btns"><button class="primary big" data-act="diag">Fazer o diagnóstico</button></div>'+
(CLOUD.on?'':'<p class="empty">Já usou em outro aparelho? <a href="#" data-login>Entre com seu nome e senha</a>.</p>')+'</div>';
el.innerHTML=h;return}
const n=nextStep();
h+='<div class="today"><div class="eyebrow">'+esc(n.e)+'</div><h2>'+esc(n.t)+'</h2>'+(n.d?'<p class="today-t">'+esc(n.d)+'</p>':'')+'<div class="btns"><button class="primary big" data-act="'+n.a+'">'+esc(n.b)+'</button>'+(n.l?'<a class="btnlink" href="'+n.l+'">'+n.lb+'</a>':'')+(n.x?'<a class="btnlink" href="'+INEP+'" target="_blank" rel="noopener">Baixar as provas no site do Inep</a>':'')+'</div>'+
(n.day&&n.a.indexOf('done:')!==0?'<button type="button" class="linkbtn" data-act="done:'+n.day+'">Já fiz o de hoje</button>':'')+'</div>';
const w=weakTopics().slice(0,3);
if(w.length)h+='<div class="blk"><h2 class="sub">Seus temas para reforçar</h2><div class="tlist">'+w.map(topicRow).join('')+'</div><p class="more"><a href="#estudar">Ver todos os temas</a></p></div>';
const t=todayISO(),up=PLAN.filter(p=>p.d>t).slice(0,3);
if(up.length)h+='<div class="blk"><h2 class="sub">Próximos dias</h2><ul class="upnext">'+up.map(p=>{const f=fmtD(p.d);return '<li><span class="d">'+f.wd+' '+f.dm+'</span><span>'+esc(p.t)+'</span></li>'}).join('')+'</ul><p class="more"><a href="#progresso">Ver o plano completo</a></p></div>';
if(!CLOUD.on)h+='<div class="loginbar"><span>Seu progresso está salvo só neste navegador.</span><a href="#" data-login>Entrar para salvar</a></div>';
el.innerHTML=h}

/* ---------- estudar ---------- */
const CHUNK={};
function decorate(){const lib=$('#lib');
$$('#lib section').forEach(sec=>{let cur=null;Array.from(sec.children).forEach(n=>{
if(n.tagName==='H2'&&n.id){cur={id:n.id,title:n.textContent.trim(),html:''};CHUNK[n.id]=cur;return}
if(cur&&!(n.classList.contains('btns')&&n.querySelector('[data-start]')))cur.html+=n.outerHTML})});
const o=$('#lib-outros');if(o){let h='<div class="panel"><h2>Como é a prova</h2><p>40 questões em 4 horas. Formação geral tem 10 (8 objetivas e 2 discursivas) e o componente específico tem 30 (27 objetivas e 3 discursivas).</p><div class="anatomy" role="img" aria-label="10 questões de formação geral e 30 do componente específico"><div class="fg">Geral · 10</div><div class="ce">Específico · 30</div></div><p><a href="'+INEP+'" target="_blank" rel="noopener">Provas e gabaritos oficiais no site do Inep</a></p></div><h2>O que mais cai</h2>';
Array.from(o.children).forEach(n=>{if(n.tagName==='H1'||n.classList.contains('eyebrow')||n.classList.contains('btns')||n.classList.contains('note'))return;h+=n.outerHTML});
CHUNK.prova={id:'prova',title:'Como é a prova e o que mais cai',html:h}}
if(CHUNK['r-ex'])CHUNK['r-ex'].title='Exercícios de fixação: redes';
if(CHUNK['c-ex'])CHUNK['c-ex'].title='Exercícios de fixação: programação';
lib.innerHTML=''}
function renderStudy(){const P=prof();
$('#estLead').innerHTML=hasData()?'Os temas estão na ordem do que você mais precisa: primeiro os que você mais erra. Leia o resumo e treine logo depois.':'São '+TOPICS.length+' temas da prova, cada um com um resumo curto e um treino. <a href="#" data-act="diag">Faça o diagnóstico</a> para esta lista se ordenar pelo que você mais precisa.';
if(!hasData()){$('#tlist').innerHTML=AREAS.map(ar=>[ar,TOPICS.filter(k=>area(k)===ar)]).filter(x=>x[1].length).map(([t,ks])=>'<div class="tgrp">'+t+'</div>'+ks.map(topicRow).join('')).join('');return}
const o=ordered(),g=[['Para estudar agora',o.filter(k=>acc(k)!==null&&acc(k)<.75)],['Ainda não treinados',o.filter(k=>acc(k)===null)],['Você já está bem',o.filter(k=>acc(k)!==null&&acc(k)>=.75)]];
$('#tlist').innerHTML=g.filter(x=>x[1].length).map(([t,ks])=>'<div class="tgrp">'+t+'</div>'+ks.map(topicRow).join('')).join('')}
let readId='';
function renderReader(){const k=readId,c=CHUNK[k];if(!c){location.hash='estudar';return}
const P=prof(),isT=!!NAMES[k],list=ordered().filter(x=>CHUNK[x]),i=list.indexOf(k),nx=isT&&i>=0&&i<list.length-1?list[i+1]:null;
$('#rhead').innerHTML='<div class="eyebrow">'+area(k)+'</div><h1>'+esc(c.title)+'</h1>'+(isT?'<div class="rmeta">'+chip(k)+'<label class="readck" for="rdk"><input type="checkbox" id="rdk" data-read="'+k+'"'+(P.read[k]?' checked':'')+'><span>Já li</span></label></div>':'');
$('#reader').innerHTML=c.html;
$('#rfoot').innerHTML=isT?'<div class="rend"><b>Terminou de ler?</b><span>Treine agora com questões deste tema para fixar.</span><div class="btns"><button class="primary" data-topic="'+k+'">Treinar '+esc(NAMES[k])+'</button>'+(nx?'<a class="btnlink" href="#ler/'+nx+'">Próximo tema: '+esc(NAMES[nx])+'</a>':'')+'</div></div>':'<div class="btns"><a class="btnlink" href="#estudar">Voltar para a lista de temas</a></div>'}
document.addEventListener('change',e=>{const r=e.target.closest('[data-read]');if(!r)return;const P=prof();if(r.checked){P.read[r.dataset.read]=1;touchDay()}else delete P.read[r.dataset.read];save()});

/* ---------- progresso ---------- */
function renderAcct(){const el=$('#acct'),who=$('#who');
if(CLOUD.on){who.innerHTML='<b>'+esc(CLOUD.nome)+'</b>';who.title='Sua conta';
el.innerHTML='<span>Você entrou como <b>'+esc(CLOUD.nome)+'</b>.</span><button type="button" class="ghost" id="btnOut">Sair</button>'}
else{who.textContent='Entrar';who.title='Entrar para salvar seu progresso';
el.innerHTML='<span>Sem conta, o progresso fica só neste navegador.</span><button type="button" class="primary" data-login>Entrar</button>'}}
function renderStats(){const [o,n]=totals(),s=streak(),e=errIds().length;
const st=(v,l)=>'<div class="stat"><b>'+v+'</b><span>'+l+'</span></div>';
$('#stats').innerHTML=st(n,n===1?'questão respondida':'questões respondidas')+st(n?Math.round(100*o/n)+'%':'–','de acerto')+st(s,s===1?'dia seguido':'dias seguidos')+st(e,e===1?'erro para refazer':'erros para refazer')}
function mapRows(){const P=prof();return ordered().map(k=>{const a=acc(k),[c,l]=level(a),st=P.stats[k];
return '<div class="drow"><a class="nm" href="'+(CHUNK[k]?'#ler/'+k:'#estudar')+'">'+NAMES[k]+'</a><span class="meter '+c+'"><i style="width:'+(a===null?0:Math.max(6,100*a))+'%"></i></span><span class="lv '+c+'">'+l+(st?' '+st[0]+'/'+st[1]:'')+'</span><button class="mini" data-topic="'+k+'">Treinar</button></div>'}).join('')}
function renderMap(){const el=$('#mapBox');
if(!hasData()){el.innerHTML='<div class="panel"><p class="empty">Depois do diagnóstico aparece aqui como você está em cada tema.</p><div class="btns"><button class="primary" data-act="diag">Fazer o diagnóstico</button></div></div>';return}
el.innerHTML='<div class="panel"><div class="dmap">'+mapRows()+'</div><p class="empty">Bom: 75% ou mais de acerto. Revisar: de 40% a 74%. Estudar: abaixo de 40%.</p><div class="btns"><button class="ghost" data-act="diag">Refazer o diagnóstico</button></div></div>'}
function temaName(t){return ({tudo:'Todos os temas',redes:'Redes',c:'Programação em C',erros:'Meus erros',diag:'Diagnóstico',foco:'Treino focado',prova:'Simulado'})[t]||NAMES[t]||t}
function renderHist(){const h=prof().hist,el=$('#hist');
if(!h.length){el.innerHTML='<p class="empty">Nenhum treino ainda.</p>';return}
el.innerHTML=h.slice(0,6).map(r=>{const p=Math.round(100*r.ok/r.n);const d=new Date(r.when);
return '<div class="row"><span class="when">'+d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})+'</span><span>'+esc(temaName(r.tema))+'</span><span class="bar"><i style="width:'+p+'%"></i></span><b>'+r.ok+'/'+r.n+'</b></div>'}).join('')}
function renderPlan(){const P=prof(),done=P.plan,t=todayISO();
const li=(p,i)=>{const f=fmtD(p.d),late=p.d<t&&!done[p.d];
return '<li class="'+(done[p.d]?'done ':'')+(p.d===t?'today ':'')+(late?'late':'')+'"><label for="pl'+i+'"><input type="checkbox" id="pl'+i+'" data-d="'+p.d+'"'+(done[p.d]?' checked':'')+'><span class="d"><b>'+f.dm+'</b><small>'+(p.d===t?'hoje':f.wd)+'</small></span><span class="t">'+esc(p.t)+'</span></label></li>'};
let s0=PLAN.findIndex(p=>p.d>=t);if(s0<0)s0=PLAN.length;const vis=PLAN.map((p,i)=>[p,i]).filter(([p,i])=>i>=s0&&i<s0+5),rest=PLAN.map((p,i)=>[p,i]).filter(([p,i])=>i<s0||i>=s0+5);
$('#plan').innerHTML=vis.map(([p,i])=>li(p,i)).join('');$('#planMore').innerHTML=rest.length?'<details class="allplan"><summary>Ver os outros '+rest.length+' dias</summary><ol class="days">'+rest.map(([p,i])=>li(p,i)).join('')+'</ol></details>':''}
document.addEventListener('change',e=>{const c=e.target.closest('.days input');if(!c)return;const P=prof();if(c.checked){P.plan[c.dataset.d]=1;touchDay()}else delete P.plan[c.dataset.d];save();renderPlan();renderHome()});

/* ---------- praticar ---------- */
let cur=null,fc=null,tick=null;
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function renderPractice(){const P=prof(),e=errIds().length,k=CARDS.filter((c,i)=>P.fc[i]).length,w=weakTopics();
let m;
if(!P.diag)m=['Comece pelo diagnóstico','16 questões, uma de cada tema, corrigidas no fim. Cerca de 15 minutos.','Fazer o diagnóstico','diag'];
else if(w.length)m=['Treino focado em você','10 questões, com mais peso em: '+w.slice(0,3).map(x=>NAMES[x]).join(', ')+'. Explicação logo depois de cada resposta.','Começar treino focado','foco'];
else m=['Treino geral','10 questões de todos os temas, com explicação logo depois de cada resposta.','Começar treino','foco'];
$('#mainPrac').innerHTML='<div class="today"><div class="eyebrow">Recomendado</div><h2>'+m[0]+'</h2><p class="today-t">'+m[1]+'</p><div class="btns"><button class="primary big" data-act="'+m[3]+'">'+m[2]+'</button></div></div>';
const qc=(a,t,d,s,off)=>'<button class="qc" type="button" data-act="'+a+'"'+(off?' disabled':'')+'><b>'+t+'</b><span>'+d+'</span><small>'+s+'</small></button>';
$('#quick').innerHTML=qc('prova','Simulado com tempo','10 questões reais de provas anteriores, de todos os temas, corrigidas só no fim.','Cerca de 25 min')+
qc('erros','Refazer meus erros',e?'As questões que você errou. Cada uma sai da lista depois de dois acertos seguidos.':'Quando você errar uma questão, ela fica guardada aqui.',e+(e===1?' questão':' questões'),!e)+
qc('cards','Cartões de memorização','Perguntas rápidas para decorar fórmulas, complexidades, portas e pegadinhas.',k+' de '+CARDS.length+' que você já sabe');
const sel=$('#temaSel');if(!sel.options.length)sel.innerHTML='<option value="tudo">Todos os temas</option>'+AREAS.map(ar=>'<optgroup label="'+ar+'">'+TOPICS.filter(x=>area(x)===ar).map(x=>'<option value="'+x+'">'+NAMES[x]+'</option>').join('')+'</optgroup>').join('');
const re=BANK.filter(q=>q.src).length,seen=BANK.filter(q=>P.seen[q.id]).length;
$('#bankInfo').textContent=BANK.length+' questões no banco, '+re+' delas de provas anteriores. Você já respondeu '+seen+'.'}
function go(fn){resetPractice();if(location.hash!=='#praticar')location.hash='praticar';fn()}
function startDiag(){const ids=DIAG.map(st=>shuffle(BANK.filter(q=>q.s===st&&!q.src))[0].id);startQuiz({ids,label:'diag',keep:true,mode:'prova'})}
function startErrors(){const ids=errIds();if(ids.length)startQuiz({ids:shuffle(ids).slice(0,15),label:'erros',mode:'treino'})}
function startTopic(st){const ids=shuffle(BANK.filter(q=>q.s===st)).slice(0,6).map(q=>q.id);startQuiz({ids,label:st,mode:'treino'})}
function pickSpread(list,n,max){const c={},out=[];list.forEach(q=>{if(out.length<n&&(c[q.s]||0)<max){c[q.s]=(c[q.s]||0)+1;out.push(q)}});return shuffle(out)}
function mixed(pool,n){const g={};shuffle(pool).forEach(q=>(g[q.s]=g[q.s]||[]).push(q));const ks=shuffle(Object.keys(g)),out=[];while(out.length<n&&ks.some(k=>g[k].length))ks.forEach(k=>{if(out.length<n&&g[k].length)out.push(g[k].pop())});return shuffle(out)}
function startQuiz(o){o=o||{};let pool,label=o.label;let mode=o.mode;
if(o.ids){pool=o.ids.map(i=>BANK[i]);if(!o.keep)pool=shuffle(pool)}
else if(o.foco){label=hasData()&&weakTopics().length?'foco':'tudo';mode='treino';const P=prof();
const w=q=>{const a=acc(q.s),seen=P.stats[q.s]?P.stats[q.s][1]:0;return (a===null?.6:1-a)+(seen<3?.15:0)+(q.id in P.err?.2:0)+Math.random()*.3};
pool=hasData()?pickSpread(BANK.map(q=>[w(q),q]).sort((a,b)=>b[0]-a[0]).map(x=>x[1]),10,2):mixed(BANK,10)}
else if(o.prova){label='prova';mode='prova';pool=mixed(BANK.filter(q=>q.src),10)}
else{const tema=$('#temaSel').value,fonte=$('#fonteSel').value,qtd=+$('#qtdSel').value;mode=$('#modoSel').value;label=tema;
pool=BANK.filter(q=>(tema==='tudo'||q.s===tema)&&(fonte==='todas'||(fonte==='real')===!!q.src));const n=Math.min(qtd,pool.length);
pool=tema==='tudo'?mixed(pool,n):shuffle(pool).slice(0,n)}
if(!pool.length){$('#bankInfo').textContent='Não há questões com essa combinação. Mude o tema ou a origem.';return}
mode=mode||'treino';
cur={qs:pool.map(q=>({q,perm:q.fixed?[0,1,2,3,4]:shuffle([0,1,2,3,4]),pick:null,graded:false,right:false})),tema:label,mode,i:0,done:false,t0:Date.now()};
$('#setup').hidden=true;$('#cards').hidden=true;$('#result').hidden=true;$('#result').innerHTML='';
renderQuiz();$('#bar').hidden=false;updBar();clearInterval(tick);tick=setInterval(updTimer,1000);updTimer();window.scrollTo(0,0)}
function renderQuiz(){const solo=cur.mode==='treino';
$('#quiz').innerHTML=cur.qs.map((it,k)=>{const q=it.q;
return '<article class="qcard" id="q'+k+'"'+(solo&&k?' hidden':'')+'><div class="qhead"><span class="qn">Questão '+(k+1)+' de '+cur.qs.length+'</span>'+(cur.tema==='diag'?'':'<span class="chip">'+(NAMES[q.s]||area(q.s))+'</span>')+(q.src?'<span class="chip real">'+q.src+'</span>':'')+'</div>'+
'<div class="qtext">'+q.q+'</div>'+(q.code?'<pre><code>'+esc(q.code)+'</code></pre>':'')+
(q.items?'<ol class="items">'+q.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>':'')+(q.stem?'<div class="qtext">'+q.stem+'</div>':'')+
'<div class="opts" role="radiogroup" aria-label="Alternativas da questão '+(k+1)+'">'+it.perm.map((oi,pos)=>
'<label class="opt" data-oi="'+oi+'" for="q'+k+'o'+pos+'"><input type="radio" name="q'+k+'" id="q'+k+'o'+pos+'" value="'+oi+'"><span class="bub">'+LETTERS[pos]+'</span><span class="txt">'+esc(q.o[oi])+'</span></label>').join('')+
'</div><div class="fbslot"></div></article>'}).join('');
$$('#quiz input[type=radio]').forEach(inp=>inp.addEventListener('change',e=>{const k=+e.target.name.slice(1);if(cur.qs[k].graded)return;cur.qs[k].pick=+e.target.value;updBar()}))}
function fmtT(ms){const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function updTimer(){if(cur&&!cur.done)$('#timer').textContent=fmtT(Date.now()-cur.t0)}
function updBar(){const n=cur.qs.length,g=$('#btnGrade'),c=$('#btnCancel');
if(cur.mode==='treino'){const it=cur.qs[cur.i],ok=cur.qs.filter(x=>x.right).length,done=cur.qs.filter(x=>x.graded).length;
$('#progTxt').textContent='Questão '+(cur.i+1)+' de '+n+' · '+ok+(ok===1?' acerto':' acertos');$('#progBar').style.width=(100*done/n)+'%';
g.textContent=it.graded?(cur.i<n-1?'Próxima':'Ver resultado'):(it.pick===null?'Não sei, ver resposta':'Responder');c.textContent='Encerrar'}
else{const a=cur.qs.filter(x=>x.pick!==null).length;$('#progTxt').textContent=a+' de '+n+' respondidas';$('#progBar').style.width=(100*a/n)+'%';
g.textContent=a<n?'Corrigir ('+(n-a)+' em branco)':'Corrigir';c.textContent='Cancelar'}}
function gradeCard(k){const it=cur.qs[k],q=it.q,card=document.getElementById('q'+k);it.graded=true;it.right=it.pick===q.a;
card.classList.add('graded');card.querySelectorAll('input').forEach(i=>i.disabled=true);
card.querySelectorAll('.opt').forEach(l=>{const oi=+l.dataset.oi;if(oi===q.a)l.classList.add('right');else if(oi===it.pick)l.classList.add('wrong')});
const letter=LETTERS[it.perm.indexOf(q.a)],r=it.right;
const opt=oi=>{const t=q.o[oi];return '<b>'+LETTERS[it.perm.indexOf(oi)]+')</b> '+(t.length>140?'<span class="fbdim">(alternativa destacada acima)</span>':esc(t))};
const rev=CHUNK[q.s]?'<a class="fbrev" href="#ler/'+q.s+'">'+(r?'Rever o resumo de ':'Estudar o resumo de ')+esc(NAMES[q.s])+'</a>':'';
card.querySelector('.fbslot').innerHTML='<div class="fb '+(r?'ok':'no')+'">'+
(r?'<p class="fbh ok">Acertou!</p><p class="fbl"><span>Resposta</span>'+opt(q.a)+'</p>'
:'<p class="fbh no">'+(it.pick===null?'Você deixou em branco.':'Não foi dessa vez.')+'</p>'+(it.pick===null?'':'<p class="fbl"><span>Você marcou</span>'+opt(it.pick)+'</p>')+'<p class="fbl"><span>Resposta certa</span>'+opt(q.a)+'</p>')+
'<div class="fbwhy"><span>Por quê</span><p>'+q.e+'</p></div>'+
(!r&&q.items?'<p class="fbtip">Dica: em questões com itens I, II, III, julgue cada item sozinho antes de olhar as alternativas.</p>':'')+
(!r&&q.code?'<p class="fbtip">Dica: refaça o código no papel, anotando o valor de cada variável linha por linha.</p>':'')+
(!r?'<p class="fbtip">Esta questão foi guardada em "Refazer meus erros".</p>':'')+rev+'</div>';
record(q,r)}
function mainAction(){if(!cur||cur.done)return;
if(cur.mode==='prova'){finish();return}
const it=cur.qs[cur.i];
if(!it.graded){gradeCard(cur.i);save();updBar();const fb=document.querySelector('#q'+cur.i+' .fbslot');if(fb){const r=fb.getBoundingClientRect(),bar=$('#bar'),bt=bar&&!bar.hidden?bar.getBoundingClientRect().top:innerHeight;if(r.top>bt-160||r.bottom>bt)fb.scrollIntoView({block:r.height>bt-120?'start':'end',behavior:'smooth'})};return}
if(cur.i<cur.qs.length-1){document.getElementById('q'+cur.i).hidden=true;cur.i++;document.getElementById('q'+cur.i).hidden=false;updBar();window.scrollTo(0,0)}
else finish()}
function finish(){clearInterval(tick);const P=prof();
if(cur.mode==='prova')cur.qs.forEach((it,k)=>{if(!it.graded)gradeCard(k)});
const list=cur.qs.map((it,k)=>[it,k]).filter(x=>x[0].graded);
if(!list.length){resetPractice();return}
cur.done=true;cur.qs.forEach((it,k)=>{document.getElementById('q'+k).hidden=!it.graded});
let ok=0;const weak={};
list.forEach(([it])=>{if(it.right)ok++;else weak[it.q.s]=(weak[it.q.s]||0)+1});
const n=list.length,p=Math.round(100*ok/n),ms=Date.now()-cur.t0,mins=Math.max(1,Math.round(ms/60000));
const isDiag=cur.tema==='diag';
if(isDiag){const res={};list.forEach(([it])=>res[it.q.s]=it.right?1:0);P.diag={when:Date.now(),res}}
P.hist.unshift({when:Date.now(),tema:cur.tema,ok,n,modo:cur.mode});P.hist=P.hist.slice(0,30);touchDay();save();
const wrongIds=list.filter(([it])=>!it.right).map(([it])=>it.q.id),w=weakTopics();
let verdict=p>=80?'Ótimo resultado.':p>=60?'Bom caminho. Revise os temas abaixo.':p>=40?'Ainda dá para subir bastante. Leia o resumo dos temas que você errou antes de tentar de novo.':'Vale ler o resumo antes do próximo treino. Comece pelos temas abaixo.';
if(isDiag)verdict=w.length?'Pronto. Agora o site sabe em quais temas você precisa estudar. Comece pelo primeiro da lista abaixo.':'Você acertou todos os temas. O próximo passo é um simulado com tempo.';
if(wrongIds.length&&!isDiag)verdict+=' As questões erradas ficam guardadas em "Refazer meus erros".';
const weakList=Object.entries(weak).sort((a,b)=>b[1]-a[1]).map(([s,c])=>(CHUNK[s]?'<a href="#ler/'+s+'">'+NAMES[s]+'</a>':NAMES[s])+' ('+c+')').join(' · ');
const sheet=list.map(([it,k])=>{const cls=it.right?'ok':(it.pick===null?'no skip':'no');const L=it.pick===null?'–':LETTERS[it.perm.indexOf(it.pick)];return '<a href="#praticar" class="'+cls+'" data-q="'+k+'" title="Questão '+(k+1)+'"><span>'+(k+1)+'</span><b>'+L+'</b></a>'}).join('');
const R=$('#result');R.hidden=false;
const next=isDiag&&w.length?'<button class="primary" data-topic="'+w[0]+'">Treinar '+esc(NAMES[w[0]])+'</button>'+(CHUNK[w[0]]?'<a class="btnlink" href="#ler/'+w[0]+'">Ler o resumo</a>':''):
(wrongIds.length?'<button class="primary" id="btnRedo">Refazer só os erros ('+wrongIds.length+')</button>':'');
R.innerHTML='<div class="result"><div class="eyebrow">'+esc(temaName(cur.tema))+'</div><div class="score"><span class="big">'+ok+'/'+n+'</span><span class="of">'+p+'% de acerto · '+mins+' min</span></div><p class="verdict">'+verdict+'</p>'+
(isDiag?'<div class="field" style="gap:10px"><span>Seus temas, do mais fraco ao mais forte</span><div class="dmap">'+mapRows()+'</div></div>':(weakList?'<p><strong>Para revisar:</strong> '+weakList+'</p>':'<p><strong>Nenhum erro.</strong></p>'))+
'<div class="btns">'+next+'<button id="btnNew" type="button">Outro treino</button><a class="btnlink" href="#inicio">Voltar ao início</a></div>'+
'<details class="sheetbox"><summary>Ver cartão-resposta</summary><div class="sheet">'+sheet+'</div><div class="legend"><span>Verde: acerto</span><span>Vermelho: erro</span><span>Tracejado: em branco</span></div></details></div>';
R.querySelectorAll('[data-q]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();scrollToId('q'+a.dataset.q)}));
const rd=$('#btnRedo');if(rd)rd.onclick=()=>go(()=>startQuiz({ids:wrongIds,label:'erros',mode:'treino'}));
$('#btnNew').onclick=()=>{resetPractice();window.scrollTo(0,0)};$('#bar').hidden=true;window.scrollTo(0,0)}
function resetPractice(){clearInterval(tick);cur=null;fc=null;$('#quiz').innerHTML='';$('#result').hidden=true;$('#result').innerHTML='';$('#bar').hidden=true;$('#cards').hidden=true;$('#cards').innerHTML='';$('#setup').hidden=false;renderPractice()}
function cancelQuiz(){if(!cur)return;if(cur.mode==='prova'&&!cur.done&&cur.qs.some(x=>x.pick!==null)&&!confirm('Sair sem corrigir? Suas respostas serão perdidas.'))return;if(cur.mode==='treino'&&!cur.done&&cur.qs.some(x=>x.graded))finish();else{resetPractice();window.scrollTo(0,0)}}
document.addEventListener('keydown',e=>{if(!cur||cur.done||cur.mode!=='treino'||e.ctrlKey||e.metaKey||e.altKey||$('#v-praticar').hidden)return;
const k=e.key.toLowerCase(),pos='abcde'.indexOf(k)>=0?'abcde'.indexOf(k):'12345'.indexOf(k);
if(pos>=0&&k.length===1&&!cur.qs[cur.i].graded){const inp=document.getElementById('q'+cur.i+'o'+pos);if(inp){inp.checked=true;inp.dispatchEvent(new Event('change',{bubbles:true}))}}
else if(e.key==='Enter'&&e.target.tagName!=='BUTTON'&&e.target.tagName!=='A'){e.preventDefault();mainAction()}});

/* ---------- cartões de memorização ---------- */
function startCards(only){const P=prof();const idx=only||CARDS.map((c,i)=>i);
const list=only?shuffle(idx):shuffle(idx.filter(i=>!P.fc[i])).concat(shuffle(idx.filter(i=>P.fc[i]))).slice(0,12);
fc={list,i:0,ok:0,miss:[],shown:false};$('#setup').hidden=true;$('#quiz').innerHTML='';$('#result').hidden=true;$('#bar').hidden=true;$('#cards').hidden=false;renderCard();window.scrollTo(0,0)}
function renderCard(){const el=$('#cards');
if(fc.i>=fc.list.length){const n=fc.list.length,k=CARDS.filter((c,i)=>prof().fc[i]).length;
el.innerHTML='<div class="result"><div class="eyebrow">Cartões de memorização</div><div class="score"><span class="big">'+fc.ok+'/'+n+'</span><span class="of">você já sabia</span></div><p class="verdict">'+(fc.miss.length?'Os cartões que você não sabia voltam primeiro na próxima rodada.':'Rodada perfeita.')+' No total, você já sabe '+k+' de '+CARDS.length+'.</p><div class="btns">'+(fc.miss.length?'<button class="primary" id="fcRedo">Repetir os que errei ('+fc.miss.length+')</button>':'')+'<button id="fcMore">Outra rodada</button><button class="ghost" id="fcOut">Voltar</button></div></div>';
const miss=fc.miss.slice();const r=$('#fcRedo');if(r)r.onclick=()=>startCards(miss);$('#fcMore').onclick=()=>startCards();$('#fcOut').onclick=resetPractice;return}
const c=CARDS[fc.list[fc.i]];
el.innerHTML='<div class="eyebrow">Cartões de memorização</div><div class="fcard"><div class="qhead"><span class="qn">Cartão '+(fc.i+1)+' de '+fc.list.length+'</span><span class="chip">'+(c.t==='redes'?'Redes':c.t==='c'?'Programação em C':'Geral')+'</span></div><div class="fc-front">'+c.f+'</div>'+(fc.shown?'<div class="fc-back">'+c.b+'</div>':'')+'</div>'+
'<div class="btns">'+(fc.shown?'<button id="fcNo">Ainda não sei</button><button class="primary" id="fcYes">Eu sabia</button>':'<button class="primary" id="fcShow">Ver resposta</button>')+'<button class="ghost" id="fcOut">Sair</button></div>'+
'<p class="empty">Responda de cabeça antes de virar o cartão.</p>';
$('#fcOut').onclick=resetPractice;
if(fc.shown){const mark=y=>{const P=prof(),id=fc.list[fc.i];if(y){P.fc[id]=1;fc.ok++}else{delete P.fc[id];fc.miss.push(id)}touchDay();save();fc.i++;fc.shown=false;renderCard()};$('#fcYes').onclick=()=>mark(true);$('#fcNo').onclick=()=>mark(false);$('#fcYes').focus()}
else{$('#fcShow').onclick=()=>{fc.shown=true;renderCard()};$('#fcShow').focus()}}

/* ---------- navegação ---------- */
function act(a){
if(a==='diag')return go(startDiag);
if(a==='erros')return go(startErrors);
if(a==='cards')return go(()=>startCards());
if(a==='prova')return go(()=>startQuiz({prova:true}));
if(a==='foco')return go(()=>startQuiz({foco:true}));
if(a.indexOf('done:')===0){const P=prof();P.plan[a.slice(5)]=1;touchDay();save();refreshAll();return}
if(a.indexOf('topic:')===0)return go(()=>startTopic(a.slice(6)))}
function scrollToId(id){const el=document.getElementById(id);if(!el)return;const y=el.getBoundingClientRect().top+window.scrollY-110;window.scrollTo({top:y,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
function renderTop(){const c=$('#countdown'),d=daysLeft();c.innerHTML=d>1?'<b>'+d+'</b> dias':d===1?'<b>1</b> dia':d===0?'<b>Hoje</b>':''}
function refreshAll(){adaptPlan();renderTop();renderAcct();renderHome();renderStudy();if(readId&&!$('#v-ler').hidden)renderReader();renderStats();renderSync();renderMap();renderHist();renderPlan();if(!cur&&!fc)renderPractice()}
function route(){let h=decodeURIComponent((location.hash||'#inicio').slice(1));if(ALIAS[h])h=ALIAS[h];let v=h;
if(h.indexOf('ler/')===0){v='ler';readId=h.slice(4);if(!CHUNK[readId]){v='estudar';readId=''}}
if(!VIEWS.includes(v)||(v==='ler'&&!readId))v='inicio';return v}
function show(){const v=route();
if(v!=='praticar'&&((cur&&cur.done)||(fc&&fc.i>=fc.list.length)))resetPractice();
$$('.view').forEach(s=>s.hidden=s.dataset.view!==v);
$$('nav.tabs a').forEach(a=>{if(a.getAttribute('href')==='#'+TABOF[v])a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
refreshAll();if(v==='ler')renderReader();window.scrollTo(0,0)}
window.addEventListener('hashchange',show);
document.addEventListener('click',e=>{const t=e.target;
if(t.closest('#who')){if(CLOUD.on)location.hash='progresso';else openLogin();return}
if(t.closest('#btnOut')){logout();return}
if(t.closest('[data-login]')){e.preventDefault();openLogin();return}
if(t.closest('#dlgClose')){closeLogin();return}
const tp=t.closest('[data-topic]');if(tp){e.preventDefault();go(()=>startTopic(tp.dataset.topic));return}
const a=t.closest('[data-act]');if(a){e.preventDefault();act(a.dataset.act);return}
const j=t.closest('[data-jump]');if(j&&CHUNK[j.dataset.jump]){e.preventDefault();location.hash='ler/'+j.dataset.jump}});
$('#nameForm').addEventListener('submit',e=>{e.preventDefault();login($('#nomeIn').value,$('#senhaIn').value)});
$('#loginDlg').addEventListener('click',e=>{if(e.target===e.currentTarget)closeLogin()});
$('#btnStart').onclick=()=>startQuiz();
$('#btnGrade').onclick=mainAction;
$('#btnCancel').onclick=cancelQuiz;
decorate();
show();
initCloud();
})();
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();const v=document.querySelector('section.view:not([hidden])')||document.getElementById('conteudo');const t=v.querySelector('h1')||v;t.setAttribute('tabindex','-1');t.focus()});
(function(){const b=document.getElementById('themeBtn');if(!b)return;const R=document.documentElement;
const cur=()=>R.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
const lab=()=>{const d=cur()==='dark';b.setAttribute('aria-label',d?'Mudar para o tema claro':'Mudar para o tema escuro');b.title=d?'Tema claro':'Tema escuro'};
b.addEventListener('click',()=>{const n=cur()==='dark'?'light':'dark';R.dataset.theme=n;try{localStorage.setItem('enade-tema',n)}catch(e){}lab()});lab()})();
