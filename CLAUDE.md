# CLAUDE.md — BTC Dashboard

## O que é este projeto

Dashboard web multi-ativo de criptomoedas, construído em HTML/CSS/JS puro (sem framework, sem build step).
Consome a CoinGecko API e a Alternative.me API (ambas gratuitas, sem autenticação) para exibir preço, variações históricas, indicadores avançados de mercado e gráfico interativo.
O ativo exibido é selecionável na barra superior; cada ativo tem seus próprios indicadores e seção educativa.

Desenvolvido para a Polaris Global Strategies Ltd.

## Estrutura de arquivos

```
btc_dashboard/
├── index.html   → Layout: header com seletor de ativo, cards, indicadores, gráfico, glossário dinâmico, footer
├── style.css    → Tema escuro, cores condicionais, responsividade
├── coins.js     → Registro de moedas: metadados de API + conteúdo educativo por ativo
├── app.js       → Lógica completa: fetch das APIs, Chart.js, interatividade, indicadores, troca de ativo
├── plan.md      → Plano detalhado de desenvolvimento
└── CLAUDE.md    → Este arquivo
```

## Stack e dependências

- **Zero dependências instaladas** — tudo via CDN no `index.html`
- **Chart.js** (CDN): renderização do gráfico principal
- **CoinGecko API v3**: dados de preço, variações e dominância
- **Alternative.me API**: Fear & Greed Index
- **Binance API**: gráfico histórico e Mayer Multiple
- **Mempool.space API**: altura do bloco Bitcoin para o contador de halving
- **Blockchair API** (reservado): altura do bloco para ativos com halving não suportados pelo mempool.space (ex: Zcash)

## Registro de moedas (`coins.js`)

Cada entrada em `COINS` define tudo que varia por ativo:

| Campo | Descrição |
|---|---|
| `id` | ID da CoinGecko |
| `symbol` / `name` / `icon` | Exibição no header |
| `binancePair` | Par Binance para gráfico e Mayer (ex: `BTCUSDT`) |
| `dominanceKey` | Chave em `market_cap_percentage` da CoinGecko |
| `startDate` | Data mínima do histórico disponível |
| `accentColor` / `accentColorAlpha` | Cor de destaque do ativo |
| `hasHalving` | Se o card de halving deve ser exibido |
| `nextHalvingBlock` / `halvingBlockTime` | Dados do próximo halving |
| `halvingBlockApi` | `'mempool'` \| `'blockchair'` \| `null` |
| `mayer` | Faixas `{ low, mid, high }` do Múltiplo de Mayer |
| `mvrvLink` / `mvrvLinkText` | Link externo para MVRV Z-Score |
| `glossaryIndicators` | Array `{ id, title, html }` — seção "Entenda os Indicadores" |
| `originSection` | `{ title, items: [{ title, html }] }` — seção de origem do ativo |

Para adicionar um novo ativo, basta inserir uma entrada em `COINS` com todos esses campos preenchidos.

## Endpoints usados

```
Base CoinGecko: https://api.coingecko.com/api/v3

GET /coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false
  → preço atual, variações 24h/7d/30d/1y, volume, market cap, máx/mín 24h

GET /coins/bitcoin/market_chart?vs_currency=usd&days=7
  → array de [timestamp, preço] — aceita days=1|7|30|90|365|1825|max

GET /coins/bitcoin/market_chart/range?vs_currency=usd&from=UNIX&to=UNIX
  → histórico por intervalo de datas personalizadas

GET /global
  → dominância de mercado do BTC (market_cap_percentage.btc)

Base Alternative.me: https://api.alternative.me

GET /fng/?limit=1
  → Fear & Greed Index: { value, value_classification }
```

## Mapeamento de períodos

| Botão | Parâmetro               |
|-------|-------------------------|
| 1D    | days=1                  |
| 7D    | days=7                  |
| 1M    | days=30                 |
| 3M    | days=90                 |
| YTD   | calculado: dias desde 01/01 do ano atual |
| 1A    | days=365                |
| 5A    | days=1825               |
| ALL   | days=max                |

## Indicadores avançados

| Indicador       | Fonte               | Método                                           |
|-----------------|---------------------|--------------------------------------------------|
| Fear & Greed    | Alternative.me API  | Fetch direto, valor 0–100                        |
| Múltiplo de Mayer | CoinGecko histórico | Preço atual ÷ média dos últimos 200 preços diários |
| Dominância BTC  | CoinGecko /global   | `market_cap_percentage.btc`                      |
| MVRV Z-Score    | Não disponível free | Card informativo + link para LookIntoBitcoin.com |

## Faixas de classificação dos indicadores

### Fear & Greed
- 0–24: Medo Extremo (vermelho)
- 25–44: Medo (laranja)
- 45–55: Neutro (cinza)
- 56–75: Ganância (verde claro)
- 76–100: Ganância Extrema (verde)

### Múltiplo de Mayer
- < 0,8: Zona histórica de fundo (roxo/azul)
- 0,8–1,0: Subvalorizado (verde)
- 1,0–2,4: Zona normal (neutro)
- > 2,4: Sobreaquecimento (vermelho)

### MVRV Z-Score (referência — sem dados ao vivo)
- < 0: Subvalorizado
- 0–6: Neutro / aquecido
- > 6: Zona de topo histórico

## Convenções do projeto

- Sem comentários desnecessários no código
- Funções nomeadas de forma descritiva
- Cores: `#00c853` positivo, `#f44336` negativo, `#f7931a` accent/Bitcoin
- Tema escuro: fundo `#0d0d0d`, cards `#1a1a2e`
- Glossário colapsável com `<details>/<summary>` HTML nativo — sem JS adicional
- Um único gráfico principal (mini gráficos foram removidos)

## Comportamentos esperados

- Cards atualizam automaticamente a cada **60 segundos**
- Mayer Multiple recalculado a cada atualização (usa histórico 200 dias)
- Fear & Greed atualizado junto com os cards
- Seletor de período: 8 botões rápidos (1D 7D 1M 3M YTD 1A 5A ALL) + inputs de data
- Troca de moeda USD ↔ BRL: afeta preços e gráfico

## Rodapé — Disclaimer

Exibir no `<footer>` com `font-size` pequeno e cor `var(--muted)`:

> As informações exibidas neste dashboard são fornecidas exclusivamente para fins informativos e educacionais, com base em dados públicos de mercado. Não constituem recomendação de investimento, aconselhamento financeiro, consultoria de valores mobiliários ou oferta de compra e venda de ativos. Rentabilidade passada não é garantia de rentabilidade futura. Criptoativos são investimentos de alto risco e podem resultar em perda total do capital investido. Antes de tomar qualquer decisão de investimento, consulte um profissional financeiro habilitado.
>
> © 2025 Polaris Global Strategies Ltd. Todos os direitos reservados.

## O que NÃO fazer

- Não adicionar back-end, servidor local ou processo de build
- Não usar frameworks (React, Vue, etc.)
- Não adicionar funcionalidades além das descritas no `plan.md`
- Não criar mini gráficos adicionais (foram removidos do escopo)
- Não buscar MVRV de APIs não gratuitas ou com autenticação

## Como testar

Abrir `index.html` diretamente no navegador. Não requer servidor local.
Se a API retornar erro 429 (rate limit), aguardar 1 minuto e recarregar.

## Referência visual

Site de referência: https://investimentos.com.br/ativos/cripto/
Indicadores relevantes observados: preço, variações por período, volume, market cap, dominância, máx/mín 24h, Fear & Greed, MVRV Z-Score, Múltiplo de Mayer, gráfico de histórico com seletor de período.
