# Manual do Projeto — Crypto Dashboard

**Polaris Global Strategies Ltd.**  
Versão 2.0 · Junho 2026

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Como Executar](#como-executar)
4. [Arquitetura Técnica](#arquitetura-técnica)
5. [Registro de Moedas (coins.js)](#registro-de-moedas-coinsjs)
6. [Fontes de Dados (APIs)](#fontes-de-dados-apis)
7. [Funcionalidades](#funcionalidades)
8. [Indicadores de Mercado](#indicadores-de-mercado)
9. [Lógica do app.js](#lógica-do-appjs)
10. [Estilo Visual (style.css)](#estilo-visual-stylecss)
11. [Comportamentos Automáticos](#comportamentos-automáticos)
12. [Adicionando um Novo Ativo](#adicionando-um-novo-ativo)
13. [Limites e Decisões de Escopo](#limites-e-decisões-de-escopo)

---

## Visão Geral

O Crypto Dashboard é uma aplicação web de página única que exibe dados de mercado de criptoativos em tempo real. Desenvolvido para a Polaris Global Strategies Ltd., o projeto apresenta preços, variações históricas, indicadores avançados de análise de mercado e um gráfico interativo.

O ativo exibido é selecionável na barra superior. Cada ativo possui seus próprios indicadores, parâmetros de API e seções educativas — nada de um ativo aparece quando outro está selecionado. Atualmente os ativos disponíveis são **Bitcoin (BTC)**, **Zcash (ZEC)** e **Ethereum (ETH)**; a arquitetura está preparada para receber novos ativos (ex: Solana) sem alterações estruturais.

**Princípio de design central:** zero dependências instaladas e zero processo de build. O projeto consiste em quatro arquivos estáticos (`index.html`, `style.css`, `coins.js`, `app.js`) que funcionam diretamente no navegador, sem servidor, sem Node.js, sem compilação.

---

## Estrutura de Arquivos

```
btc_dashboard/
├── index.html              → Estrutura HTML: header com seletor, cards, gráfico, glossário dinâmico
├── style.css               → Todo o visual: tema escuro/claro, responsividade, cores
├── coins.js                → Registro de moedas: metadados de API e conteúdo educativo por ativo
├── app.js                  → Toda a lógica: fetch de APIs, gráfico, cálculos, eventos, troca de ativo
├── plan.md                 → Plano de desenvolvimento do projeto
├── CLAUDE.md               → Instruções para o assistente de IA
└── manual_btc_dashboard.md → Este documento
```

A responsabilidade de cada arquivo:

| Arquivo | Responsabilidade |
|---------|-----------------|
| `index.html` | Estrutura e placeholders — nenhum conteúdo educativo hardcodado |
| `style.css` | Apresentação — usa `--accent` como variável dinâmica trocada por JS |
| `coins.js` | Dados por ativo — metadados de API, thresholds de indicadores, textos educativos |
| `app.js` | Comportamento — lê `coins.js`, gerencia estado, chama APIs, atualiza DOM |

---

## Como Executar

1. Abrir o arquivo `index.html` diretamente no navegador (duplo clique, ou arrastar para o Chrome/Firefox/Safari).
2. Não é necessário servidor local, instalação de pacotes ou terminal.
3. O dashboard carrega automaticamente e começa a buscar dados das APIs.

**Atenção:** se as APIs retornarem erro 429 (muitas requisições), aguardar 1 minuto e recarregar a página. Esse limite é imposto pelos servidores das APIs gratuitas, não pelo código.

---

## Arquitetura Técnica

### Sem framework, sem build step

A escolha de HTML/CSS/JS puro é deliberada. Frameworks como React ou Vue adicionam uma camada de abstração e exigem um processo de compilação, o que adiciona complexidade de manutenção. Para um dashboard de uma única página com dados externos, JavaScript nativo é suficiente e mais fácil de auditar.

### Dependência externa: Chart.js via CDN

O único componente de terceiro é a biblioteca de gráficos [Chart.js](https://www.chartjs.org/), carregada via CDN diretamente no `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"
        integrity="sha384-NrKB+u6Ts6AtkIhwPixiKTzgSKNblyhlk0Sohlgar9UHUBzai/sgnNNWWd291xqt"
        crossorigin="anonymous"></script>
```

O atributo `integrity` é um hash criptográfico (SHA-384) que garante que o arquivo baixado é exatamente o esperado — proteção contra adulteração em trânsito.

### Fluxo de dados

```
Navegador
  └─ Abre index.html
       └─ Carrega style.css, coins.js e app.js
            └─ app.js executa initCoin() → loadAll()
                 ├─ Binance API  → Dados do gráfico + Múltiplo de Mayer
                 ├─ CoinGecko API → Preços, variações e dominância
                 ├─ Alternative.me API → Fear & Greed Index
                 └─ Mempool.space API → Altura da blockchain (halving BTC)
```

### Ordem de inicialização

```javascript
initTheme();      // 1. aplica tema salvo ou preferência do sistema
initCoin();       // 2. lê ativo salvo no localStorage, popula header e glossário
setInterval(...); // 3. agenda atualização de cards a cada 60s
loadAll();        // 4. carrega gráfico, cards e indicadores em paralelo
```

`initCoin()` é síncrono — `activeCoin` está definido antes de qualquer fetch começar.

---

## Registro de Moedas (`coins.js`)

`coins.js` é o único arquivo que precisa ser editado para adicionar um novo ativo. Ele define o objeto global `COINS`, onde cada chave é o ID do ativo na CoinGecko.

### Campos por ativo

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | ID na CoinGecko (ex: `'bitcoin'`) |
| `symbol` | string | Ticker exibido (ex: `'BTC'`) |
| `name` | string | Nome completo (ex: `'Bitcoin'`) |
| `icon` | string | Símbolo Unicode (ex: `'₿'`) |
| `binancePair` | string | Par Binance para gráfico e Mayer (ex: `'BTCUSDT'`) |
| `dominanceKey` | string | Chave em `market_cap_percentage` da CoinGecko (ex: `'btc'`) |
| `startDate` | string | Data mínima do histórico disponível (`'YYYY-MM-DD'`) |
| `accentColor` | string | Cor de destaque em hex (ex: `'#f7931a'`) |
| `accentColorAlpha` | object | `{ light, dark }` — fill do gráfico com transparência |
| `hasHalving` | boolean | Se o card de halving deve ser exibido |
| `nextHalvingBlock` | number | Número do próximo bloco de halving |
| `halvingBlockTime` | number | Segundos médios por bloco (BTC: 600, ZEC: 90) |
| `halvingBlockApi` | string | `'mempool'` \| `'blockchair'` \| `null` |
| `mayer` | object | Thresholds `{ low, mid, high }` do Múltiplo de Mayer |
| `mvrvLink` | string | URL do gráfico MVRV externo |
| `mvrvLinkText` | string | Texto do link MVRV no card |
| `glossaryIndicators` | array | Items `{ id, title, html }` — seção "Entenda os Indicadores" |
| `originSection` | object | `{ title, items: [{title, html}] }` — seção de origem do ativo |

### Conteúdo educativo por ativo

Os textos do glossário ("Entenda os Indicadores" e a seção de origem) são armazenados como strings HTML dentro de `coins.js`. Quando o usuário troca de ativo, `updateGlossarySections()` injeta o conteúdo correto no DOM — nenhum texto de outro ativo aparece na página.

---

## Fontes de Dados (APIs)

O projeto consome quatro APIs públicas e gratuitas, sem autenticação:

### 1. Binance API
**Base:** `https://api.binance.com/api/v3`

Usada para o **gráfico principal** e o **Múltiplo de Mayer**. Fornece dados de candlestick (klines) do par configurado em `activeCoin.binancePair`. A Binance foi escolhida porque sua API de klines permite controle preciso de intervalo e quantidade de candles, sem limite de requisições agressivo.

Endpoint utilizado:
```
GET /klines?symbol={binancePair}&interval=1d&limit=200
```

Parâmetros relevantes:
- `symbol`: par de negociação (ex: `BTCUSDT`, `ETHUSDT`)
- `interval`: resolução temporal (`5m`, `1h`, `4h`, `1d`, `1w`)
- `limit`: número de candles retornados
- `startTime` / `endTime`: timestamps Unix em milissegundos (para intervalos personalizados)

A resposta é um array de arrays. Cada elemento representa um candle:
```
[timestamp_abertura, abertura, máxima, mínima, fechamento, volume, ...]
```
O código extrai apenas `[timestamp, fechamento]` via a função `klinesToPrices()`.

### 2. CoinGecko API
**Base:** `https://api.coingecko.com/api/v3`

Usada para os **cards de preço e variação** e a **dominância de mercado**. É a API mais rica em metadados de mercado.

Endpoints utilizados:
```
GET /coins/{activeCoin.id}?localization=false&tickers=false&market_data=true&...
GET /global
```

O primeiro endpoint retorna `market_data` com preços em USD e BRL, volumes, market cap e variações percentuais em múltiplas moedas (`price_change_percentage_*_in_currency`). O segundo retorna `market_cap_percentage` — o objeto do qual se extrai a chave `activeCoin.dominanceKey` para a dominância do ativo selecionado.

Um terceiro endpoint é utilizado para o card YTD:
```
GET /coins/{activeCoin.id}/history?date=01-01-{ano}&localization=false
```
Retorna o preço histórico em USD e BRL em 01/01 do ano corrente. Chamado uma vez por ativo (na carga inicial e ao trocar de ativo), com resultado em cache na variável `jan1Prices`.

### 3. Alternative.me API
**Base:** `https://api.alternative.me`

Usada exclusivamente para o **Fear & Greed Index** — indicador global de sentimento do mercado cripto, não específico de nenhum ativo.

```
GET /fng/?limit=1
```

Retorna o valor atual (0–100) e a classificação textual em inglês. O código traduz para português via o objeto `FG_PT`.

### 4. Mempool.space API
**Base:** `https://mempool.space/api`

Usada para a **contagem regressiva do halving do Bitcoin**.

```
GET /blocks/tip/height
```

Retorna a altura atual da blockchain Bitcoin. Usada quando `activeCoin.halvingBlockApi === 'mempool'`.

### 5. Blockchair API (reservado)
**Base:** `https://api.blockchair.com`

Reservado para ativos com halving cuja blockchain não é suportada pelo Mempool.space — especificamente **Zcash**. Quando `activeCoin.halvingBlockApi === 'blockchair'`, o código usa:

```
GET /{activeCoin.id}/stats
```

O campo `data.blocks` retorna a altura atual. Esta API está integrada na lógica mas não é chamada enquanto apenas Bitcoin (com `halvingBlockApi: 'mempool'`) estiver ativo.

---

## Funcionalidades

### Seletor de ativo

Barra de botões no header (entre o logo e os controles de moeda/tema) que alterna o ativo exibido. A troca:
1. Incrementa o contador `loadGeneration` — cancela resultados de fetches anteriores em voo
2. Atualiza `activeCoin` com a entrada correspondente de `coins.js`
3. Reseta moeda para USD e período para 7D
4. Atualiza o header (ícone, nome, ticker, cor de destaque via `--accent`)
5. Injeta o glossário e a seção de origem do novo ativo
6. Chama `loadAll()` para carregar os dados do novo ativo

A seleção persiste no `localStorage` entre visitas.

### Cards de preço

Dois grupos de cards exibem dados do CoinGecko:

**Cards principais:**
- Preço atual (USD ou BRL, conforme seleção)
- Variação 24h, 7 dias, 30 dias e YTD (verde para positivo, vermelho para negativo)

As variações percentuais de 24h, 7 dias e 30 dias refletem a moeda selecionada: em BRL, o cálculo inclui o efeito da variação cambial do período, podendo diferir significativamente dos valores em USD. O card YTD é calculado localmente a partir do preço do ativo em 01/01 do ano corrente, buscado via CoinGecko `/history`.

**Cards secundários:**
- Máxima e mínima das últimas 24h
- Volume total nas últimas 24h
- Market cap total do ativo

### Seletor de moeda (USD / BRL)

Botões no header alternam entre dólar americano e real brasileiro. A troca recarrega todos os dados via `loadAll()`. O gráfico converte os preços Binance (sempre em USD) para BRL aplicando a taxa de câmbio implícita calculada a partir dos preços do CoinGecko (`current_price.brl / current_price.usd`), armazenada na variável `usdToBrl`.

### Tema claro / escuro

Botão no header alterna entre os dois temas. A preferência é salva no `localStorage` e detectada na primeira visita via `prefers-color-scheme`. A troca de tema reconstrói o gráfico preservando os dados e as cores do ativo atualmente selecionado (`lastCoin`).

### Gráfico histórico de preços

Renderizado pelo Chart.js em um `<canvas>`. Gráfico de linha com área preenchida, eixo Y à direita e tooltip interativo. A cor da linha e do fill usa `activeCoin.accentColor` — cada ativo terá sua cor característica.

**Seletor de períodos:** 8 botões predefinidos:

| Botão | Intervalo | Candles |
|-------|-----------|---------|
| 24H   | 5 minutos | 288     |
| 7D    | 1 hora    | 168     |
| 1M    | 4 horas   | 180     |
| 3M    | 1 dia     | 90      |
| YTD   | 4h ou 1d  | calculado |
| 1A    | 1 dia     | 365     |
| 5A    | 1 semana  | 261     |
| ALL   | 1 semana  | 1000    |

**Intervalo personalizado:** inputs de data permitem qualquer intervalo a partir de `activeCoin.startDate`. A data mínima dos inputs é atualizada automaticamente ao trocar de ativo.

### Glossário dinâmico

Duas seções colapsáveis (`<details>/<summary>`) são renderizadas dinamicamente a partir de `coins.js`:
- **Entenda os Indicadores** — explicações contextualizadas para o ativo selecionado
- **Seção de origem** — história e fundamentos do ativo (ex: "Bitcoin: A Ideia Original de Satoshi")

Ao trocar de ativo, o conteúdo anterior é completamente substituído.

---

## Indicadores de Mercado

### Fear & Greed Index

**Fonte:** Alternative.me — indicador global de sentimento cripto  
Disponível para todos os ativos.

| Faixa | Classificação | Cor |
|-------|---------------|-----|
| 0–24  | Medo Extremo  | Vermelho |
| 25–44 | Medo          | Laranja |
| 45–55 | Neutro        | Cinza |
| 56–75 | Ganância      | Verde claro |
| 76–100| Ganância Extrema | Verde |

### Múltiplo de Mayer

**Fonte:** calculado localmente a partir dos dados da Binance  
**Fórmula:** `Preço atual ÷ Média Móvel dos últimos 200 dias (MM200)`

Os thresholds de classificação são definidos por ativo em `activeCoin.mayer`:

| Múltiplo (BTC) | Classificação | Badge |
|----------------|---------------|-------|
| < 0,80         | Subvalorizado | Verde |
| 0,80–1,0       | Abaixo MM200  | Verde |
| 1,0–2,4        | Zona Normal   | Cinza |
| > 2,4          | Sobreaquecido | Vermelho |

### Dominância

**Fonte:** CoinGecko `/global`  
Percentual do market cap total do mercado cripto que pertence ao ativo selecionado. A chave lida em `market_cap_percentage` é `activeCoin.dominanceKey` — para BTC é `'btc'`, para ETH será `'eth'`, etc.

### Contagem Regressiva do Halving

Exibida apenas quando `activeCoin.hasHalving === true`. O cálculo usa os parâmetros do ativo:

1. Obter altura atual da blockchain via API (`halvingBlockApi`)
2. Calcular blocos restantes: `activeCoin.nextHalvingBlock - height`
3. Se `remaining ≤ 0`, exibe "N/D" (halving já ocorreu — atualizar `nextHalvingBlock` em `coins.js`)
4. Estimar dias: `remaining ÷ (86400 / activeCoin.halvingBlockTime)`
5. Estimar data: `hoje + remaining × halvingBlockTime segundos`

Para Bitcoin: 144 blocos/dia (~10 min/bloco). Para Zcash: 960 blocos/dia (~90 seg/bloco, média observada).

### MVRV Z-Score

Link externo para recurso específico do ativo, configurado em `activeCoin.mvrvLink`. Não requer dados ao vivo — o card exibe nota informativa e direciona para gráfico externo gratuito.

---

## Lógica do app.js

### Estado global

```javascript
let activeCoin      = null;                    // entrada ativa de COINS
let currency        = 'usd';                   // moeda selecionada
let currentPeriod   = '7';                     // período do gráfico
let mainChart       = null;                    // instância Chart.js
let lastPrices      = null;                    // dados do último gráfico renderizado
let lastChartPeriod = '7';                     // período do último gráfico renderizado
let lastCoin        = null;                    // ativo do último gráfico renderizado
let loadGeneration  = 0;                       // contador para cancelar fetches obsoletos
let jan1Prices      = { usd: null, brl: null }; // preço em 01/01 para cálculo YTD
let usdToBrl        = 1;                       // taxa de câmbio USD→BRL (atualizada pelo CoinGecko)
```

### Cancelamento de requisições em voo: `loadGeneration`

`loadAll()` incrementa `loadGeneration` no início e captura o valor atual em `gen`. Antes de qualquer atualização do DOM, verifica `if (gen !== loadGeneration) return` — se o usuário trocou de ativo enquanto os fetches estavam em andamento, a geração terá aumentado e os resultados obsoletos são descartados silenciosamente.

```javascript
async function loadAll() {
    const gen = ++loadGeneration;
    // ...fetches...
    if (gen !== loadGeneration) return;  // ativo trocado: descarta
    // atualiza DOM
    loadAdvancedIndicators(gen);         // passa gen para verificações internas
}
```

O mesmo mecanismo é aplicado dentro de `loadAdvancedIndicators(gen)`, que verifica `gen !== loadGeneration` após cada `await` antes de chamar `updateFearGreed()`, `updateMayer()` e `updateHalving()`.

### Consistência de cores do gráfico: `lastCoin`

`buildChart(existing, prices, period, coin = activeCoin)` aceita o ativo explicitamente e grava `lastCoin = coin`. O toggle de tema usa `buildChart(mainChart, lastPrices, lastChartPeriod, lastCoin)` — garante que a reconstrução do gráfico use sempre as cores do ativo cujos dados estão em `lastPrices`, mesmo que `activeCoin` tenha mudado após uma falha de rede.

### Camada de rede: `get()` e `cachedGet()`

A função `get(url)` é o ponto central de todas as requisições HTTP:

```javascript
async function get(url, attempt = 0) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT_MS); // 8s
    // ...
}
```

Três mecanismos de resiliência:
1. **Timeout de 8 segundos** via `AbortController`
2. **Retry automático** com até 2 tentativas adicionais
3. **Backoff exponencial** entre tentativas: 500ms, depois 1000ms

`cachedGet(url)` adiciona cache em memória com TTL de 60 segundos para chamadas CoinGecko.

### Carregamento paralelo: `loadAll()`

```javascript
const [chartResult, cardsResult] = await Promise.allSettled([
    fetchBinanceChart(currentPeriod),
    Promise.all([
        fetchCoin(),
        fetchGlobal(),
        jan1Prices.usd === null ? fetchJan1Prices(activeCoin.id) : Promise.resolve()
    ])
]);
```

`Promise.allSettled()` lança as requisições em paralelo e aguarda todas terminarem, independentemente de falhas. Se a Binance estiver lenta mas a CoinGecko responder rápido, os cards já aparecem enquanto o gráfico ainda carrega. O fetch do preço de 01/01 (`fetchJan1Prices`) só é disparado quando `jan1Prices.usd === null` — ou seja, na carga inicial e ao trocar de ativo, nunca no refresh de 60 segundos.

O bloco de cards é processado **antes** do bloco do gráfico dentro de `loadAll()`. Isso garante que `usdToBrl` esteja atualizado quando `buildChart()` for chamado — necessário para que a conversão USD→BRL funcione já na primeira renderização após a troca de moeda.

### Troca de ativo: `switchCoin(id)`

```javascript
function switchCoin(id) {
    activeCoin    = COINS[id];
    currency      = 'usd';
    currentPeriod = '7';
    jan1Prices    = { usd: null, brl: null }; // invalida cache YTD do ativo anterior
    localStorage.setItem('btc-dashboard-coin', id);
    // reset visual de botões e inputs
    updateCoinHeader();       // header, title, --accent
    updateDateInputMin();     // min dos inputs de data
    updateGlossarySections(); // injeta textos do novo ativo
    loadAll();                // (incrementa loadGeneration internamente)
}
```

### Formatação de valores

- `fmtPrice(v)`: formata com 2 casas decimais e separadores locais
- `fmtLarge(v)`: abrevia valores grandes (`1.234.567.890` → `1.23 B`)
- `fmtLabel(ts, days)`: formata timestamps do eixo X conforme o período selecionado

---

## Estilo Visual (style.css)

### Variáveis CSS e cor de destaque dinâmica

Todo o sistema de cores é centralizado em variáveis no seletor `:root`:

```css
:root {
    --bg:       #0d0d0d;   /* fundo da página */
    --card-bg:  #1a1a2e;   /* fundo dos cards */
    --positive: #00c853;   /* variações positivas */
    --negative: #f44336;   /* variações negativas */
    --accent:   #f7931a;   /* cor de destaque do ativo atual */
}
```

A variável `--accent` é redefinida via JavaScript ao trocar de ativo:
```javascript
document.documentElement.style.setProperty('--accent', activeCoin.accentColor);
```
Todos os elementos que usam `var(--accent)` — botões ativos, bordas de destaque, cor do ícone, fill do gráfico — adaptam-se automaticamente à cor do ativo selecionado.

### Seletor de ativo (`.coin-selector`)

Visualmente idêntico ao `.currency-toggle` — borda arredondada, botões sem borda interna, fundo `--accent` no item ativo.

### Grid responsivo

Os cards usam CSS Grid com `auto-fit` e `minmax`:

```css
.main-cards { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
```

Breakpoints explícitos:
- `≤ 960px`: indicadores avançados em 2 colunas
- `≤ 640px`: indicadores em 1 coluna, gráfico com altura reduzida

---

## Comportamentos Automáticos

| Comportamento | Mecanismo | Frequência |
|---------------|-----------|------------|
| Atualização dos cards de preço | `setInterval(refreshCards, 60_000)` | A cada 60 segundos |
| Persistência do tema | `localStorage` | Ao clicar no botão |
| Persistência do ativo | `localStorage` | Ao trocar de ativo |
| Detecção de tema do sistema | `prefers-color-scheme` | Na primeira visita |
| Carregamento inicial completo | `loadAll()` ao final do `app.js` | Uma vez, ao abrir a página |
| Cancelamento de fetches obsoletos | `loadGeneration` counter | A cada troca de ativo |

A atualização automática usa `refreshCards()`, que busca apenas CoinGecko. O gráfico e os indicadores avançados só recarregam quando o usuário interage ou recarrega a página.

---

## Adicionando um Novo Ativo

Para adicionar, por exemplo, **Ethereum (ETH)**:

**1. `coins.js`** — inserir entrada no objeto `COINS`:

```javascript
ethereum: {
    id:               'ethereum',
    symbol:           'ETH',
    name:             'Ethereum',
    icon:             'Ξ',
    binancePair:      'ETHUSDT',
    dominanceKey:     'eth',
    startDate:        '2015-08-08',
    accentColor:      '#627eea',
    accentColorAlpha: { light: 'rgba(98,126,234,0.10)', dark: 'rgba(98,126,234,0.07)' },
    hasHalving:       false,   // Ethereum não tem halving (Proof of Stake)
    nextHalvingBlock: null,
    halvingBlockTime: null,
    halvingBlockApi:  null,
    mayer:            { low: 0.8, mid: 1.0, high: 2.4 },
    mvrvLink:         'https://www.lookintobitcoin.com/charts/ethereum-mvrv-zscore/',
    mvrvLinkText:     'Ver gráfico externo →',
    glossaryIndicators: [ /* textos específicos do ETH */ ],
    originSection:      { title: 'Ethereum: A Plataforma de Contratos Inteligentes', items: [...] }
}
```

**2. `index.html`** — adicionar botão no seletor:

```html
<nav class="coin-selector" role="group" aria-label="Selecionar criptoativo">
    <button class="coin-btn" data-coin="bitcoin"  aria-label="Bitcoin">BTC</button>
    <button class="coin-btn" data-coin="ethereum" aria-label="Ethereum">ETH</button>
</nav>
```

Nenhuma outra alteração é necessária.

**Nota sobre Zcash:** ZEC já está implementado. Usa `halvingBlockApi: 'blockchair'`, halving a cada 840.000 blocos (~90 seg/bloco, média observada), próximo halving no bloco 4.200.000.

**Nota sobre Ethereum:** ETH já está implementado, com `startDate: '2015-07-30'` (lançamento da mainnet). Por ser **Proof of Stake** desde *The Merge* (setembro de 2022), usa `hasHalving: false` — o card de halving fica oculto e nenhuma API de altura de bloco é chamada. Os demais indicadores (Fear & Greed, Mayer, Dominância, MVRV) e o gráfico funcionam sem ajuste de código.

---

## Limites e Decisões de Escopo

| Decisão | Motivo |
|---------|--------|
| Gráfico em USD ou BRL | Binance fornece klines apenas em USD; a conversão para BRL é aplicada em `buildChart()` usando a taxa `usdToBrl` derivada do CoinGecko (`current_price.brl / current_price.usd`) |
| MVRV Z-Score sem dados ao vivo | Exige Realized Cap, dado on-chain proprietário; APIs gratuitas não fornecem |
| `startDate` por ativo | Cada ativo tem uma data de início diferente na Binance — BTC: 28/04/2013, ETH: ~08/08/2015 |
| Sem back-end | Aplicação puramente client-side; dados públicos não requerem proxy |
| Halving exibe N/D se bloco já passou | `updateHalving()` testa `remaining ≤ 0` — deve-se atualizar `nextHalvingBlock` em `coins.js` após cada halving |
| `loadGeneration` em vez de AbortController por fetch | Mais simples e suficiente para o caso de uso; AbortController seria necessário apenas para economizar banda, não para corretude do DOM |
| Conteúdo educativo em `coins.js` (não HTML estático) | Permite que a página só mostre informações do ativo selecionado, sem conteúdo oculto de outros ativos |

---

*Desenvolvido para Polaris Global Strategies Ltd. · © 2026 · Todos os direitos reservados.*
