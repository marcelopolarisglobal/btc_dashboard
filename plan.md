# Plano de Desenvolvimento — BTC Dashboard

## Objetivo

Dashboard web estático sobre Bitcoin, com foco em visualização clara de dados históricos de preço, indicadores de mercado e gráficos interativos. Voltado para iniciantes, com stack simples e sem necessidade de back-end ou autenticação de API.

---

## Stack Técnica

| Camada        | Tecnologia         | Motivo da escolha                                               |
|---------------|--------------------|------------------------------------------------------------------|
| Estrutura     | HTML5              | Base universal, sem dependências                                |
| Estilo        | CSS3 (puro)        | Simples de manter; sem necessidade de build                     |
| Lógica        | JavaScript vanilla | Sem framework — ideal para iniciantes, sem etapa de compilação  |
| Gráficos      | Chart.js (CDN)     | Biblioteca madura, fácil de usar, belas visualizações           |
| Dados         | CoinGecko API v3   | Gratuita, sem chave de API, bem documentada                     |
| Fear & Greed  | Alternative.me API | Gratuita, sem autenticação, retorna índice atualizado           |

> Sem Node.js, sem npm, sem build step. Tudo roda abrindo o `index.html` no navegador.

---

## Endpoints da API Utilizados

### CoinGecko API (pública, sem autenticação)
```
Base URL: https://api.coingecko.com/api/v3
```

| Endpoint                                | Dados retornados                              | Uso no dashboard                       |
|-----------------------------------------|-----------------------------------------------|----------------------------------------|
| `/coins/bitcoin`                        | Preço atual, variações, volume, market cap    | Cards de indicadores                   |
| `/coins/bitcoin/market_chart`           | Histórico de preço (timestamps + valores)     | Gráfico principal (todos os períodos)  |
| `/coins/bitcoin/market_chart/range`     | Histórico por intervalo de datas (unix)       | Seletor de datas personalizado         |
| `/global`                               | Dominância de mercado BTC                     | Card de dominância                     |

Parâmetros relevantes para `market_chart`:
- `vs_currency=usd` ou `brl`
- `days=1` → minutely/horário (últimas 24h)
- `days=7`, `30`, `90`, `365`, `1825` → períodos fixos
- `days=max` → série histórica completa (desde 2013)
- YTD: calculado como dias corridos desde 01/01 do ano atual até hoje

### Alternative.me API (pública, sem autenticação)
```
GET https://api.alternative.me/fng/?limit=1
```
Retorna o Fear & Greed Index atual (valor 0–100 + classificação textual).

---

## Indicadores a Exibir

### Cards superiores (dados em tempo quase real)
- Preço atual em USD ou BRL
- Variação 24h (% colorida)
- Variação 7 dias (%)
- Variação 30 dias (%)
- Variação 1 ano (%)
- Máxima 24h / Mínima 24h
- Volume 24h
- Market Cap

### Bloco de Indicadores Avançados (nova seção)

| Indicador          | Fonte de dados                     | Cálculo                                        |
|--------------------|------------------------------------|------------------------------------------------|
| Fear & Greed Index | Alternative.me API                 | Direto da API, valor 0–100                     |
| Múltiplo de Mayer  | CoinGecko (histórico 200 dias)     | Preço atual ÷ Média Móvel de 200 dias          |
| Dominância BTC     | CoinGecko `/global`                | Percentual do market cap global que é BTC      |
| MVRV Z-Score       | Estático com link externo *        | Requer dados on-chain (Realized Cap)           |

> **(*) Nota sobre MVRV Z-Score:** Este indicador exige dados de "Realized Cap" — o custo médio de aquisição de todos os bitcoins em circulação. Esse dado só está disponível em plataformas on-chain como Glassnode (autenticação obrigatória) ou CryptoQuant (pago). No dashboard, o card do MVRV exibirá uma explicação do indicador e um link direto para a fonte pública mais acessível (LookIntoBitcoin.com), que exibe o gráfico gratuitamente sem necessidade de conta.

---

## Filtros de Período (atualizado)

| Botão | Parâmetro API              | Descrição                                      |
|-------|----------------------------|------------------------------------------------|
| 1D    | `days=1`                   | Últimas 24 horas (granularidade: minutos)      |
| 7D    | `days=7`                   | Últimos 7 dias (granularidade: horária)        |
| 1M    | `days=30`                  | Últimos 30 dias (granularidade: horária)       |
| 3M    | `days=90`                  | Últimos 90 dias (granularidade: horária)       |
| YTD   | calculado (01/01 → hoje)   | Do início do ano até hoje                      |
| 1A    | `days=365`                 | Últimos 365 dias (granularidade: diária)       |
| 5A    | `days=1825`                | Últimos 5 anos (granularidade: diária)         |
| ALL   | `days=max`                 | Série histórica completa desde 2013            |

---

## Explicações Textuais dos Indicadores Avançados

Cada indicador avançado terá um bloco colapsável (ou seção dedicada) com explicação contextual:

### Fear & Greed Index (Índice de Medo e Ganância)
> Mede o sentimento predominante do mercado de criptomoedas numa escala de 0 a 100. Valores próximos de 0 indicam "Medo Extremo" — investidores estão nervosos e pode haver oportunidades de compra para quem tem visão de longo prazo. Valores próximos de 100 indicam "Ganância Extrema" — o mercado está eufórico e historicamente precede correções de preço.
>
> **Faixas:** 0–24 Medo Extremo · 25–44 Medo · 45–55 Neutro · 56–75 Ganância · 76–100 Ganância Extrema

### Múltiplo de Mayer
> Divide o preço atual do Bitcoin pela sua Média Móvel de 200 dias (MM200). A MM200 é amplamente usada como referência de tendência de longo prazo. O múltiplo indica se o preço está "barato" ou "caro" em relação ao seu histórico.
>
> **Referência:** < 1,0 historicamente subvalorizado · 1,0–2,4 zona normal · > 2,4 zona de sobreaquecimento · Média histórica: ~1,4

### Dominância BTC
> Percentual do total de capitalização de mercado de todas as criptomoedas que pertence ao Bitcoin. Alta dominância (> 60%) geralmente indica que os investidores preferem o ativo mais seguro do setor. Baixa dominância pode indicar rotação para altcoins (fenômeno conhecido como "altseason").

### MVRV Z-Score
> Compara o preço de mercado do Bitcoin com o seu "Realized Price" — o preço médio pelo qual cada bitcoin mudou de mãos pela última vez. O Z-Score mede o quanto o preço atual desvia da média histórica desse indicador.
>
> **Referência:** < 0 historicamente subvalorizado (zona de acumulação) · 0–6 zona neutra/aquecida · > 6 zona de topo histórico (alta probabilidade de euforia)
>
> **Disponibilidade:** exige dados on-chain proprietários. O dashboard exibe a explicação e redireciona para LookIntoBitcoin.com para visualização gratuita do gráfico.

---

## Funcionalidades Interativas

- **Seletor de período**: botões rápidos (1D, 7D, 1M, 3M, YTD, 1A, 5A, ALL) + campos de data personalizada
- **Troca de moeda**: USD / BRL (via parâmetro da CoinGecko)
- **Cores condicionais**: verde para variações positivas, vermelho para negativas
- **Tooltip nos gráficos**: data e preço exato ao passar o mouse
- **Atualização automática**: cards de preço atualizam a cada 60 segundos
- **Explicações colapsáveis**: cada indicador avançado tem descrição expandível inline

---

## Estrutura de Arquivos

```
btc_dashboard/
├── index.html      → Layout: header, cards, indicadores avançados, gráfico, rodapé
├── style.css       → Tema escuro, tipografia, responsividade
├── app.js          → Lógica: fetch das APIs, gráfico, interatividade, Mayer Multiple
├── plan.md         → Este documento
└── CLAUDE.md       → Contexto do projeto para o Claude Code
```

---

## Design Visual

### Paleta de cores (tema escuro)
| Elemento                    | Cor                          |
|-----------------------------|------------------------------|
| Fundo principal             | `#0d0d0d`                    |
| Fundo cards                 | `#1a1a2e`                    |
| Borda cards                 | `#2a2a4a`                    |
| Texto principal             | `#e0e0e0`                    |
| Variação positiva           | `#00c853` (verde)            |
| Variação negativa           | `#f44336` (vermelho)         |
| Linha do gráfico            | `#f7931a` (laranja Bitcoin)  |
| Destaque / accent           | `#f7931a`                    |
| Fear & Greed — medo extremo | `#f44336`                    |
| Fear & Greed — neutro       | `#888`                       |
| Fear & Greed — ganância     | `#00c853`                    |

### Layout (wireframe em texto)
```
┌─────────────────────────────────────────────────────────┐
│  ₿ BITCOIN DASHBOARD                    [USD] [BRL]     │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│ Preço    │ Var 24h  │ Var 7D   │ Var 30D  │ Var 1A      │
│ $XX,XXX  │ +X.XX%   │ +X.XX%   │ +X.XX%   │ +X.XX%      │
├──────────┴──────────┴──────────┴──────────┴─────────────┤
│ Vol 24h: $XXB  │ Máx 24h: $XX,XXX  │ Mín 24h: $XX,XXX  │
├─────────────────────────────────────────────────────────┤
│ Fear&Greed [██░░░] 72 · Ganância  │ Mayer ×1.42 Neutro  │
│ Dominância BTC  54.3%              │ MVRV → LookIntoBTC  │
├─────────────────────────────────────────────────────────┤
│ [1D][7D][1M][3M][YTD][1A][5A][ALL]  De:[__] Até:[__] ▶  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   GRÁFICO DE PREÇO — período selecionado                │
│   (linha laranja, fundo escuro, tooltip ao hover)       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  ▼ O que é o Fear & Greed?   ▼ O que é o Mayer?        │
│  ▼ O que é a Dominância?     ▼ O que é o MVRV?         │
├─────────────────────────────────────────────────────────┤
│  Disclaimer — Polaris Global Strategies Ltd.            │
└─────────────────────────────────────────────────────────┘
```

---

## Disclaimer — Polaris Global Strategies Ltd.

Texto proposto para o rodapé:

> **Aviso Legal**
> As informações exibidas neste dashboard são fornecidas exclusivamente para fins informativos e educacionais, com base em dados públicos de mercado. Não constituem recomendação de investimento, aconselhamento financeiro, consultoria de valores mobiliários ou oferta de compra e venda de ativos. Rentabilidade passada não é garantia de rentabilidade futura. Criptoativos são investimentos de alto risco e podem resultar em perda total do capital investido. Antes de tomar qualquer decisão de investimento, consulte um profissional financeiro habilitado.
>
> © 2025 Polaris Global Strategies Ltd. Todos os direitos reservados.

---

## Ordem de Implementação (revisada)

### Etapa 1 — Remover mini gráficos ✅ (planejado)
- [ ] Remover `#weekly-chart` e `#yearly-chart` do HTML
- [ ] Remover `.mini-charts` do CSS
- [ ] Remover `loadMiniCharts()` e referências do JS

### Etapa 2 — Novos botões de período
- [ ] Adicionar botões: 1D, YTD, 5A, ALL
- [ ] Implementar cálculo de YTD (dias desde 01/01 do ano corrente)
- [ ] Usar `days=max` para ALL

### Etapa 3 — Bloco de indicadores avançados
- [ ] Buscar Fear & Greed em `api.alternative.me`
- [ ] Calcular Mayer Multiple a partir do histórico de 200 dias (CoinGecko)
- [ ] Exibir Dominância BTC com destaque visual
- [ ] Card de MVRV com link externo e badge informativo

### Etapa 4 — Explicações textuais (accordion/colapsável)
- [ ] Criar seção de glossário com 4 itens colapsáveis
- [ ] Textos em português, tom direto e sem jargão excessivo

### Etapa 5 — Rodapé com disclaimer
- [ ] Adicionar `<footer>` com disclaimer
- [ ] Estilizar em tom sutil (texto pequeno, cor muted)

---

## Limitações Conhecidas

- A CoinGecko API pública tem rate limit de ~10–30 req/min — suficiente para uso normal
- Dados com delay de 1–5 minutos (não são em tempo real)
- MVRV Z-Score não disponível gratuitamente sem autenticação — exibir explicação + link
- Período `ALL` pode retornar ~4.000+ pontos (desde 2013); Chart.js processa sem problema
- `days=max` retorna granularidade diária independente do período
