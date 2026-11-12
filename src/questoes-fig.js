// Questões do ENADE 2021 (Ciência da Computação) que dependem de figura. As figuras foram redesenhadas em SVG a partir da prova.
(function(){
const ST='fill="none" stroke="currentColor" stroke-width="1.6"';
const wrap=(vb,inner,alt)=>'<figure class="qfig"><svg viewBox="'+vb+'" role="img" aria-label="'+alt+'" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" fill="currentColor"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>'+inner+'</svg></figure>';
const T=(x,y,s,a)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(a||'middle')+'">'+s+'</text>';
const P=(d,arrow)=>'<path d="'+d+'" '+ST+(arrow?' marker-end="url(#ah)"':'')+'/>';
const gate=(x,y,w,h,l)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" '+ST+'/>'+T(x+w/2,y+h/2+4,l);

/* Q16: circuito lógico */
const circ=wrap('0 0 420 190',
 T(8,34,'X₁','start')+T(8,104,'X₂','start')+T(8,149,'X₃','start')+
 P('M30 30H60')+gate(60,15,40,30,'NÃO')+P('M100 30H200V40H240')+
 P('M30 100H60')+gate(60,85,40,30,'NÃO')+P('M100 100H130V115H160')+
 P('M30 145H160')+gate(160,105,50,50,'E')+P('M210 130H225V70H240')+
 gate(240,30,50,50,'OU')+P('M290 55H310')+gate(310,40,40,30,'NÃO')+P('M350 55H400',1),
 'Circuito com três entradas X1, X2 e X3. X1 passa por uma porta NÃO. X2 passa por uma porta NÃO e entra numa porta E junto com X3. A saída da porta NÃO de X1 e a saída da porta E entram numa porta OU, e a saída da OU passa por uma porta NÃO.');

/* Q27: histograma */
const hist=(()=>{const d=[[134,30],[144,30],[146,30],[149,50],[151,180],[154,600],[156,590],[158,1270],[161,1370],[163,1670],[166,1570],[168,1850],[171,1670],[173,1500],[175,1380],[178,1500],[180,1300],[183,1400],[185,780],[188,600],[190,330],[192,190],[195,90],[197,40],[200,10]];
const x0=50,y0=170,sx=3.9,sy=140/2000;let s='';
[0,500,1000,1500,2000].forEach(v=>{const y=y0-v*sy;s+='<line x1="'+x0+'" x2="400" y1="'+y+'" y2="'+y+'" stroke="currentColor" stroke-opacity=".2"/>'+T(x0-6,y+4,v,'end')});
d.forEach(([c,f])=>{s+='<rect x="'+(x0+(c-122)*sx)+'" y="'+(y0-f*sy)+'" width="9" height="'+(f*sy)+'" fill="#4B9DB8"/>'});
[130,150,170,190,210].forEach(c=>{s+=T(x0+(c-122)*sx+4,y0+14,c)});
s+=T(225,y0+30,'Capacidade (requisições simultâneas)')+'<text x="12" y="95" transform="rotate(-90 12 95)" text-anchor="middle">Frequência</text>'+
'<rect x="262" y="10" width="140" height="36" '+ST+'/>'+T(272,26,'Média','start')+T(392,26,'171','end')+T(272,41,'Desvio padrão','start')+T(392,41,'10','end');
return wrap('0 0 410 210',s,'Histograma de 20 000 servidores. A distribuição tem forma de sino, com pico perto de 168 requisições (cerca de 1 850 servidores). Média 171 e desvio padrão 10.')+'<p class="qfign">Figura redesenhada; as alturas das barras são aproximadas. O que importa para a resposta é a média (171) e o desvio padrão (10).</p>'})();

/* Q31: máquina de Turing */
const circle=(x,y,l,dbl)=>'<circle cx="'+x+'" cy="'+y+'" r="24" '+ST+'/>'+(dbl?'<circle cx="'+x+'" cy="'+y+'" r="19" '+ST+'/>':'')+T(x,y+4,l);
const loop=(x,y,l,up)=>{const s=up?-1:1;return P('M'+(x-12)+' '+(y+s*22)+'C'+(x-22)+' '+(y+s*52)+' '+(x+22)+' '+(y+s*52)+' '+(x+12)+' '+(y+s*22),1)+T(x,y+s*(up?62:66),l)+''};
const tm=wrap('0 -12 640 372',
 circle(110,165,'q0')+circle(230,70,'q1')+circle(330,70,'q2')+circle(430,70,'q3')+circle(520,165,'qf',1)+circle(330,165,'q4')+circle(230,280,'q5')+circle(330,280,'q6')+circle(430,280,'q7')+
 P('M110 141V70H206',1)+T(125,60,'0/B D','middle')+
 loop(230,70,'0/0 D, 1/1 D',1)+
 P('M254 70H306',1)+T(280,62,'B/B E')+
 P('M354 70H406',1)+T(380,62,'0/B E')+
 P('M454 70H520V141',1)+T(490,62,'B/B D')+
 P('M424 94V153H354',1)+T(416,126,'0/0 E, 1/1 E','end')+
 loop(330,165,'0/0 E, 1/1 E',0)+
 P('M306 165H134',1)+T(220,183,'B/B D')+
 P('M110 189V280H206',1)+T(125,302,'1/B D')+
 loop(230,280,'0/0 D, 1/1 D',0)+
 P('M254 280H306',1)+T(280,272,'B/B E')+
 P('M354 280H406',1)+T(380,272,'1/B E')+
 P('M454 280H520V189',1)+T(490,302,'B/B D')+
 P('M436 256V177H354',1)+T(448,215,'0/0 E, 1/1 E','start'),
 'Diagrama de estados da máquina de Turing M, com os estados q0 a q7 e qf, e as transições descritas na figura da prova.').replace('class="qfig"','class="qfig wide"');

/* Q34: grafo de Dijkstra */
const N={D:[40,115],A:[115,35],B:[250,75],C:[390,25],E:[390,115],F:[215,195],G:[390,195]};
const edge=(a,b,w,dx,dy)=>{const [x1,y1]=N[a],[x2,y2]=N[b];const L=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/L,uy=(y2-y1)/L,r=15;
 return P('M'+(x1+ux*r).toFixed(1)+' '+(y1+uy*r).toFixed(1)+'L'+(x2-ux*(r+2)).toFixed(1)+' '+(y2-uy*(r+2)).toFixed(1),1)+T((x1+x2)/2+(dx||0),(y1+y2)/2+(dy||0),'<tspan font-weight="700">'+w+'</tspan>')};
const gr=wrap('0 0 430 230',
 edge('D','A',5,-10,-4)+edge('A','B',2,0,-8)+edge('B','C',8,0,-10)+edge('D','B',9,0,-6)+edge('D','E',5,0,14)+edge('E','B',1,0,-8)+edge('E','C',5,12,0)+edge('D','F',1,-8,10)+edge('F','E',3,10,6)+edge('F','G',1,0,14)+edge('G','E',1,12,0)+
 Object.keys(N).map(k=>'<circle cx="'+N[k][0]+'" cy="'+N[k][1]+'" r="15" fill="var(--sheet,#fff)" '+ST+'/>'+T(N[k][0],N[k][1]+4,k)).join(''),
 'Grafo dirigido com pesos: D→A 5, A→B 2, B→C 8, D→B 9, D→E 5, E→B 1, E→C 5, D→F 1, F→E 3, F→G 1, G→E 1.');

const AS=['As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.'];
BANK.push(
{"t":"geral","s":"a-log","src":"ENADE 2021 · Questão 16","fixed":1,"q":"Em 1938, o matemático americano Claude Shannon notou o paralelismo entre a lógica proposicional e a lógica dos circuitos e percebeu que a álgebra booleana teria um papel importante na sistematização deste ramo da eletrônica. Cada um dos conectivos básicos da lógica são instâncias das operações básicas da álgebra booleana (\"+\", \".\" e \" ' \"). Expressões booleanas combinando operações e variáveis podem ser usadas para representar circuitos combinacionais formados por portas lógicas. As portas básicas são a porta \"e\" (and, símbolo \".\"), a porta \"ou\" (or, símbolo \"+\") e a porta \"não\" (not, símbolo \"'\"). A partir das informações apresentadas, considere o circuito combinacional da figura a seguir."+circ+"Qual das alternativas apresenta a expressão booleana correspondente?","o":["(X3 . X2') + X1'","(X3 . (X2') + (X1'))'","((X3 . X2)' + X1')'","(X3 . X2')' + X1'","((X3 . X2')' + X1')'"],"a":1,"e":"<b>Método:</b> siga o sinal da esquerda para a direita, escrevendo a expressão de cada porta.<br><b>1.</b> X1 passa por um NÃO e vira <b>X1'</b>. X2 passa por um NÃO e vira <b>X2'</b>.<br><b>2.</b> A porta E recebe X2' e X3, então a saída dela é <b>X3 . X2'</b> (sem nenhum NÃO depois dela).<br><b>3.</b> A porta OU junta X1' e (X3 . X2'): <b>(X3 . X2') + X1'</b>.<br><b>4.</b> Por fim, a saída da OU passa por um último NÃO, que coloca um apóstrofo em tudo: <b>((X3 . X2') + X1')'</b>.<br>É essa a forma da alternativa <b>B</b>, que escreve (X3 . (X2') + (X1'))'. A alternativa A esquece o NÃO final; C troca X2' por X2 dentro da E; D e E colocam um NÃO extra depois da porta E, que não existe no circuito."},
{"t":"geral","s":"a-ia","src":"ENADE 2021 · Questão 27","fixed":1,"q":"A figura a seguir mostra o histograma de uma amostra composta de 20 000 servidores. O eixo x apresenta a quantidade de requisições simultâneas desses servidores. Por exemplo, o valor 168 indica que há 1 850 servidores com capacidade de atender 168 requisições simultâneas."+hist+"É possível afirmar que ao conectarmo-nos a um servidor dessa amostra, ao acaso, há aproximadamente","o":["34,13% de chance que sua capacidade esteja no intervalo [141, 201].","34,13% de chance que sua capacidade esteja no intervalo [161, 181].","76,68% de chance que sua capacidade esteja no intervalo [171, 191].","95,44% de chance que sua capacidade esteja no intervalo [151, 191].","99,74% de chance que sua capacidade esteja no intervalo [161, 181]."],"a":3,"e":"<b>Ideia:</b> o histograma tem formato de sino, então vale a regra 68–95–99,7 da distribuição normal. Com média 171 e desvio padrão 10, cada \"degrau\" de desvio padrão vale 10 unidades.<br><b>Faixas:</b> ±1 desvio = [161, 181] com cerca de 68,26%; ±2 desvios = [151, 191] com cerca de 95,44%; ±3 desvios = [141, 201] com cerca de 99,74%.<br><b>Por que D:</b> [151, 191] vai de 171 − 20 a 171 + 20, ou seja, dois desvios para cada lado: 95,44%.<br><b>Por que não as outras:</b> A e E trocam os números das faixas (141–201 tem 99,74%, não 34,13%); B usa 34,13%, que é só <i>um lado</i> (de 161 a 171 ou de 171 a 181); C usa um intervalo [171, 191] que não é simétrico em torno da média."},
{"t":"geral","s":"a-teo","src":"ENADE 2021 · Questão 31","fixed":1,"q":"Semelhante a um autômato finito mas com uma memória ilimitada e irrestrita, uma máquina de Turing é um modelo muito mais preciso de um computador de propósito geral. Uma máquina de Turing pode fazer tudo o que um computador real pode fazer, entretanto mesmo ela não pode resolver certos problemas. Considere a seguinte máquina de Turing M que aceita apenas números binários palíndromos cujo comprimento é par. No diagrama, as transições estão representadas no formato \"Leitura/Escrita Movimento\", onde a direção pode ser \"D\" (direita) ou \"E\" (esquerda). Exemplo: \"0/B D\" significa que o símbolo lido é \"0\", o símbolo escrito é \"B\" e o movimento é para a direita."+tm+"Considerando que o estado inicial de M é q0, que a sua fita se encontra inicializada com a entrada 110011 e infinitos símbolos \"B\" à esquerda e à direita, e que a cabeça de leitura encontra-se inicialmente no símbolo mais à esquerda da entrada, avalie as afirmações a seguir.","items":["Após 4 movimentos de M, o conteúdo da fita, excluindo-se os símbolos \"B\", é \"110011\".","Após 8 movimentos de M, o conteúdo da fita, excluindo-se os símbolos \"B\", é \"1001\".","A máquina irá certamente travar num estado de aceitação.","Existe um autômato com pilha que também aceita a linguagem de M."],"stem":"É correto apenas o que se afirma em","o":["I e II.","I e IV.","II e III.","I, III e IV.","II, III e IV."],"a":4,"e":"<b>Simule passo a passo.</b> Fita 110011, cabeça no primeiro 1, estado q0.<br><b>Movimento 1:</b> q0 lê 1, escreve B (apaga o primeiro 1) e vai para a direita, estado q5.<br><b>Movimentos 2 a 4:</b> q5 só anda para a direita sobre 1, 0 e 0, sem alterar nada.<br>Então, após 4 movimentos, a fita é \"10011\" (o primeiro 1 sumiu): <b>I é falsa</b>.<br><b>Movimentos 5 a 6:</b> q5 anda sobre 1 e 1. <b>Movimento 7:</b> lê B (fim da entrada) e volta uma casa à esquerda, estado q6. <b>Movimento 8:</b> q6 lê o último 1, apaga e vai para q7. A fita fica \"1001\": <b>II é verdadeira</b>.<br><b>III (verdadeira):</b> 110011 é um palíndromo de comprimento par. A máquina continua apagando uma ponta e a outra e comparando (passando por q4 de volta ao começo) até não sobrar nada, e então chega em qf. Como qf não tem transições de saída, a máquina <i>para</i> ali, aceitando a entrada.<br><b>IV:</b> palíndromos de comprimento par formam uma linguagem livre de contexto, e toda linguagem livre de contexto é aceita por um autômato com pilha: <b>verdadeira</b>.<br>Certos: II, III e IV."},
{"t":"geral","s":"a-grafo","src":"ENADE 2021 · Questão 34","fixed":1,"q":"O algoritmo de Dijkstra para o problema do caminho mínimo em dígrafos com pesos utiliza uma fila de prioridades de vértices, na qual as prioridades são uma estimativa do custo final. A cada iteração, um vértice é retirado da fila, e os arcos que começam nesse vértice são analisados. Considere o seguinte grafo, no qual deseja-se conhecer o custo de um caminho mínimo para cada vértice, a partir do vértice D. Considere que -1 representa um custo \"infinito\", ou seja, nenhum caminho até o vértice foi até o momento descoberto."+gr+"Com base nas informações e no grafo apresentados, assinale a alternativa que represente a estimativa de custo após duas iterações do algoritmo.","o":["A: 5 B: 6 C: 10 D: 0 E: 4 F: 1 G: -1","A: 5 B: 9 C: -1 D: 0 E: 5 F: 1 G: -1","A: 5 B: 9 C: -1 D: 0 E: 4 F: 1 G: 2","A: 5 B: 7 C: 8 D: 0 E: 4 F: 1 G: 2","A: 5 B: 6 C: 8 D: 0 E: 3 F: 1 G: 2"],"a":2,"e":"<b>Método:</b> em cada iteração, retire da fila o vértice com a menor estimativa e atualize os vizinhos dele (relaxamento).<br><b>Começo:</b> D = 0 e todos os outros = -1 (infinito).<br><b>Iteração 1 (sai D, custo 0):</b> A = 0+5 = 5; B = 0+9 = 9; E = 0+5 = 5; F = 0+1 = 1. C e G continuam -1.<br><b>Iteração 2 (sai o menor entre os que restam: F, custo 1):</b> pelo arco F→E, 1+3 = 4 é menor que 5, então E passa a 4; pelo arco F→G, 1+1 = 2, então G = 2.<br><b>Resultado:</b> A 5, B 9, C -1, D 0, E 4, F 1, G 2: alternativa <b>C</b>.<br>Cuidado: B só melhora na iteração seguinte (quando A sair), e C continua infinito porque ainda não saiu nenhum vértice que chegue até ele."}
);
})();
