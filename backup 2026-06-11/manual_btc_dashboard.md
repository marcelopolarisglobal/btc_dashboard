# Manual do Projeto — Bitcoin Dashboard

**Polaris Global Strategies Ltd.**  
Versão 1.0 · Junho 2025

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Como Executar](#como-executar)
4. [Arquitetura Técnica](#arquitetura-técnica)
5. [Fontes de Dados (APIs)](#fontes-de-dados-apis)
6. [Funcionalidades](#funcionalidades)
7. [Indicadores de Mercado](#indicadores-de-mercado)
8. [Lógica do app.js](#lógica-do-appjs)
9. [Estilo Visual (style.css)](#estilo-visual-stylecss)
10. [Comportamentos Automáticos](#comportamentos-automáticos)
11. [Limites e Decisões de Escopo](#limites-e-decisões-de-escopo)

---

## Visão Geral

O Bitcoin Dashboard é uma aplicação web de página única que exibe dados de mercado do Bitcoin em tempo real. Desenvolvido para a Polaris Global Strategies Ltd., o projeto apresenta preços, variações históricas, indicadores avançados de análise de mercado e um gráfico interativo.

**Princípio de design central:** zero dependências instaladas e zero processo de build. O projeto consiste em três arquivos estáticos (`index.html`, `style.css`, `app.js`) que funcionam diretamente no navegador, sem servidor, sem Node.js, sem compilação.

---

## Estrutura de Arquivos

```
btc_dashboard/
├── index.html              → Estrutura HTML completa da página
├── style.css               → Todo o visual: tema escuro/claro, responsividade, cores
├── app.js                  → Toda a lógica: fetch de APIs, gráfico, cálculos, eventos
├── plan.md                 → Plano de desenvolvimento do projeto
├── CLAUDE.md               → Instruções para o assistente de IA
└── manual_btc_dashboard.md → Este documento
```

Cada arquivo tem responsabilidade única: estrutura, apresentação e comportamento separados — o princípio clássico de separação de responsabilidades da web.

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

O único componente de terceiro é a biblioteca de gráficos [Chart.js](https://www.chartjs.org/), carregada via CDN (Content Delivery Network) diretamente no `index.html`:

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
       └─ Carrega style.css e app.js
            └─ app.js executa loadAll()
                 ├─ Binance API → Dados do gráfico principal
                 ├─ CoinGecko API → Preços e variações dos cards
                 ├─ Alternative.me API → Fear & Greed Index
                 └─ Mempool.space API → Altura atual da blockchain (halving)
```

---

## Fontes de Dados (APIs)

O projeto consome quatro APIs públicas e gratuitas, sem autenticação:

### 1. Binance API
**Base:** `https://api.binance.com/api/v3`

Usada para o **gráfico principal** e o **Múltiplo de Mayer**. Fornece dados de candlestick (klines) do par BTCUSDT. A Binance foi escolhida porque sua API de klines permite controle preciso de intervalo e quantidade de candles, sem limite de requisições agressivo.

Endpoint utilizado:
```
GET /klines?symbol=BTCUSDT&interval=1d&limit=200
```

Parâmetros relevantes:
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

Usada para os **cards de preço e variação** e a **dominância de mercado**. É a API mais rica em metadados de mercado, retornando variações de 24h/7d/30d/1y já calculadas.

Endpoints utilizados:
```
GET /coins/bitcoin?localization=false&tickers=false&market_data=true&...
GET /global
```

O primeiro endpoint retorna o objeto `market_data` com preços em múltiplas moedas (USD e BRL), volumes, market cap e variações percentuais. O segundo retorna `market_cap_percentage.btc` — a dominância do Bitcoin no mercado global de cripto.

### 3. Alternative.me API
**Base:** `https://api.alternative.me`

Usada exclusivamente para o **Fear & Greed Index**.

```
GET /fng/?limit=1
```

Retorna o valor atual (0–100) e a classificação textual em inglês (`Extreme Fear`, `Fear`, `Neutral`, `Greed`, `Extreme Greed`). O código traduz essas classificações para português via o objeto `FG_PT`.

### 4. Mempool.space API
**Base:** `https://mempool.space/api`

Usada para a **contagem regressiva do halving**.

```
GET /blocks/tip/height
```

Retorna um único número inteiro: a altura atual da blockchain Bitcoin (total de blocos minerados desde o bloco gênese). Com esse número, o código calcula blocos restantes até o próximo halving e estima a data.

---

## Funcionalidades

### Cards de preço

Dois grupos de cards exibem dados do CoinGecko:

**Cards principais:**
- Preço atual (USD ou BRL, conforme seleção)
- Variação 24h, 7 dias, 30 dias e 1 ano (coloridos: verde para positivo, vermelho para negativo)

**Cards secundários:**
- Máxima e mínima das últimas 24h
- Volume total nas últimas 24h
- Market cap total do Bitcoin

### Seletor de moeda (USD / BRL)

Botões no header alternam entre dólar americano e real brasileiro. A troca recarrega todos os dados via `loadAll()`, pois CoinGecko fornece ambas as cotações no mesmo endpoint. O gráfico principal permanece sempre em USD (dados da Binance não têm conversão direta para BRL).

### Tema claro / escuro

Botão no header alterna entre os dois temas. A preferência é:
1. Salva no `localStorage` do navegador (persiste entre visitas)
2. Se nunca salvo, detectada pela preferência do sistema operacional via `prefers-color-scheme`

A troca de tema reconstrói o gráfico com as cores corretas de grid e eixos.

### Gráfico histórico de preços

Renderizado pelo Chart.js em um `<canvas>`. É um gráfico de linha com área preenchida, eixo Y à direita e sem pontos visíveis (apenas ao passar o mouse via tooltip).

**Seletor de períodos:** 8 botões predefinidos (1D, 7D, 1M, 3M, YTD, 1A, 5A, ALL) que mapeiam para diferentes configurações de intervalo e limite de candles na Binance:

| Botão | Intervalo | Candles |
|-------|-----------|---------|
| 1D    | 5 minutos | 288     |
| 7D    | 1 hora    | 168     |
| 1M    | 4 horas   | 180     |
| 3M    | 1 dia     | 90      |
| YTD   | 4h ou 1d  | calculado |
| 1A    | 1 dia     | 365     |
| 5A    | 1 semana  | 261     |
| ALL   | 1 semana  | 1000    |

**YTD** (Year To Date — do início do ano até hoje) é calculado dinamicamente: conta os dias entre 1º de janeiro do ano corrente e a data atual, depois escolhe `4h` para até 90 dias ou `1d` para além disso.

**Intervalo personalizado:** inputs de data permitem qualquer intervalo desde 28/04/2013 (data mais antiga disponível na Binance). O código converte as datas para timestamps Unix e usa o endpoint `/klines` com `startTime` e `endTime`.

---

## Indicadores de Mercado

### Fear & Greed Index

**Fonte:** Alternative.me  
**Frequência de atualização:** a cada carregamento inicial

Mede o sentimento do mercado de criptomoedas numa escala de 0 a 100, calculado pela Alternative.me com base em volatilidade, volume, mídias sociais, dominância e tendências de busca.

| Faixa | Classificação | Cor |
|-------|---------------|-----|
| 0–24  | Medo Extremo  | Vermelho |
| 25–44 | Medo          | Laranja |
| 45–55 | Neutro        | Cinza |
| 56–75 | Ganância      | Verde claro |
| 76–100| Ganância Extrema | Verde |

Visualizado com: número grande em destaque, rótulo de classificação, barra de gradiente com agulha indicadora de posição.

### Múltiplo de Mayer

**Fonte:** Calculado localmente a partir dos dados da Binance  
**Fórmula:** `Preço atual ÷ Média Móvel dos últimos 200 dias (MM200)`

A Binance retorna os últimos 201 candles diários. O código soma os 200 preços de fechamento, divide por 200 para obter a MM200, e divide o preço atual por essa média.

| Múltiplo | Classificação | Badge |
|----------|---------------|-------|
| < 0,80   | Subvalorizado | Verde |
| 0,80–1,0 | Abaixo MM200  | Verde |
| 1,0–2,4  | Zona Normal   | Cinza |
| > 2,4    | Sobreaquecido | Vermelho |

A MM200 é exibida em dólares abaixo do múltiplo como referência.

### Dominância BTC

**Fonte:** CoinGecko `/global`  
Percentual do market cap total do mercado cripto que pertence ao Bitcoin. Atualizado junto com os cards de preço.

### Contagem Regressiva do Halving

**Fonte:** Mempool.space (altura da blockchain)

O próximo halving ocorre no bloco 1.050.000. O cálculo é:
1. Obter altura atual da blockchain (ex: 900.000)
2. Calcular blocos restantes: `1.050.000 - 900.000 = 150.000`
3. Estimar dias: `150.000 ÷ 144 = 1.041 dias` (144 blocos/dia em média, pois cada bloco leva ~10 minutos)
4. Estimar data: `hoje + 1.041 dias`

O resultado exibe: dias restantes, bloco atual vs. bloco-alvo, e data estimada.

### MVRV Z-Score

Indicador on-chain que compara o preço de mercado com o "Realized Price" (preço médio pelo qual cada bitcoin mudou de mãos pela última vez). Requer dados proprietários não disponíveis em APIs gratuitas. O card exibe uma nota explicativa e link para [LookIntoBitcoin.com](https://www.lookintobitcoin.com/charts/mvrv-zscore/).

---

## Lógica do app.js

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
1. **Timeout de 8 segundos** via `AbortController` — cancela requisições lentas
2. **Retry automático** com até 2 tentativas adicionais
3. **Backoff exponencial** entre tentativas: 500ms, depois 1000ms — evita sobrecarregar a API

A função `cachedGet(url)` adiciona uma camada de cache em memória com TTL de 60 segundos. Chamadas para CoinGecko são roteadas por aqui para evitar requisições duplicadas durante o mesmo ciclo de atualização.

### Carregamento paralelo: `loadAll()`

```javascript
const [chartResult, cardsResult] = await Promise.allSettled([
    fetchBinanceChart(currentPeriod),
    Promise.all([fetchCoin(), fetchGlobal()])
]);
```

`Promise.allSettled()` lança as requisições em paralelo e aguarda **todas** terminarem, independentemente de falhas. Isso é diferente de `Promise.all()`, que cancela tudo se uma requisição falhar. Com `allSettled`, se a Binance estiver lenta mas a CoinGecko responder rápido, os cards já aparecem enquanto o gráfico ainda carrega.

### Formatação de valores

- `fmtPrice(v)`: formata com 2 casas decimais e separadores locais (`.` para USD, `,` para BRL)
- `fmtLarge(v)`: abrevia valores grandes: `1.234.567.890` → `1.23 B`
- `fmtLabel(ts, days)`: formata timestamps do eixo X do gráfico de acordo com o período — horas para períodos curtos, meses para períodos longos, anos para máximos

### Sistema de temas

O CSS usa variáveis CSS (`--bg`, `--card-bg`, `--text`, etc.) definidas em `:root` (tema escuro) e sobrescritas em `[data-theme="light"]`. O JavaScript simplesmente adiciona ou remove o atributo `data-theme="light"` no elemento `<html>` — o CSS faz o resto sozinho.

### Evento de troca de período

Quando o usuário clica em um botão de período:
1. Todos os botões são desabilitados (evita cliques duplos durante o carregamento)
2. O botão clicado recebe a classe `active`
3. `loadMainChart(period)` é chamado
4. Ao terminar (sucesso ou erro), todos os botões são reabilitados

---

## Estilo Visual (style.css)

### Variáveis CSS

Todo o sistema de cores é centralizado em variáveis no seletor `:root`:

```css
:root {
    --bg:       #0d0d0d;   /* fundo da página */
    --card-bg:  #1a1a2e;   /* fundo dos cards */
    --positive: #00c853;   /* variações positivas */
    --negative: #f44336;   /* variações negativas */
    --accent:   #f7931a;   /* laranja Bitcoin */
}
```

Para criar um terceiro tema ou ajustar uma cor, basta modificar essas variáveis — nenhum seletor específico precisa ser alterado.

### Grid responsivo

Os cards usam CSS Grid com `auto-fit` e `minmax`:

```css
.main-cards { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
```

Isso significa: "coloque quantas colunas couberem, mas cada uma deve ter no mínimo 150px". O grid se adapta automaticamente ao tamanho da tela sem media queries adicionais.

Breakpoints explícitos:
- `≤ 960px`: indicadores avançados em 2 colunas
- `≤ 640px`: indicadores em 1 coluna, gráfico com altura reduzida

### Barra do Fear & Greed

A barra é implementada com CSS puro: um `div` com `background: linear-gradient(...)` e dentro dele uma "agulha" (retângulo branco) posicionada com `left: X%` via JavaScript. A transição suave da agulha é animada por CSS (`transition: left 0.4s ease`).

---

## Comportamentos Automáticos

| Comportamento | Mecanismo | Frequência |
|---------------|-----------|------------|
| Atualização dos cards de preço | `setInterval(refreshCards, 60_000)` | A cada 60 segundos |
| Persistência do tema | `localStorage` | Ao clicar no botão |
| Detecção de tema do sistema | `prefers-color-scheme` | Na primeira visita |
| Carregamento inicial completo | `loadAll()` ao final do `app.js` | Uma vez, ao abrir a página |

A atualização automática usa `refreshCards()`, que busca apenas CoinGecko (mais leve). O gráfico e os indicadores avançados só recarregam quando o usuário interage (troca de período, troca de moeda) ou recarrega a página.

---

## Limites e Decisões de Escopo

| Decisão | Motivo |
|---------|--------|
| Gráfico sempre em USD | Binance fornece dados do par BTCUSDT; não há API gratuita com klines em BRL |
| MVRV Z-Score sem dados ao vivo | Exige Realized Cap, dado on-chain proprietário; APIs gratuitas não fornecem |
| Histórico a partir de 28/04/2013 | Data mais antiga disponível na API da Binance para BTCUSDT |
| Sem back-end | Aplicação puramente client-side; dados públicos não requerem proxy |
| Sem mini gráficos individuais | Foram avaliados e removidos do escopo para manter o foco no gráfico principal |
| Contagem do halving em dias estimados | Tempo por bloco varia; a estimativa usa 144 blocos/dia como média histórica |

---

*Desenvolvido para Polaris Global Strategies Ltd. · © 2025 · Todos os direitos reservados.*
