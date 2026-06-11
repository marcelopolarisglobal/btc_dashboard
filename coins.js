const COINS = {
    bitcoin: {
        id:               'bitcoin',
        symbol:           'BTC',
        name:             'Bitcoin',
        icon:             '₿',
        binancePair:      'BTCUSDT',
        dominanceKey:     'btc',
        startDate:        '2013-04-28',
        accentColor:      '#f7931a',
        accentColorAlpha: { light: 'rgba(247,147,26,0.10)', dark: 'rgba(247,147,26,0.07)' },
        hasHalving:       true,
        nextHalvingBlock: 1_050_000,
        halvingBlockTime: 600,
        halvingBlockApi:  'mempool',
        mayer:            { low: 0.8, mid: 1.0, high: 2.4 },
        mvrvLink:         'https://www.lookintobitcoin.com/charts/mvrv-zscore/',
        mvrvLinkText:     'Ver gráfico em LookIntoBitcoin →',

        glossaryIndicators: [
            {
                id:    'fear-greed',
                title: 'O que é o Fear &amp; Greed Index?',
                html:  `<p>Mede o sentimento predominante do mercado de criptomoedas numa escala de 0 a 100. Valores próximos de 0 indicam <strong>Medo Extremo</strong> — os investidores estão nervosos e o preço pode estar deprimido além do que os fundamentos justificam, criando possíveis oportunidades para quem tem visão de longo prazo. Valores próximos de 100 indicam <strong>Ganância Extrema</strong> — o mercado está eufórico e historicamente esse excesso de otimismo precede correções de preço.</p>
                <div class="fg-scale">
                    <span class="scale-item fear-extreme">0–24 · Medo Extremo</span>
                    <span class="scale-item fear">25–44 · Medo</span>
                    <span class="scale-item neutral">45–55 · Neutro</span>
                    <span class="scale-item greed">56–75 · Ganância</span>
                    <span class="scale-item greed-extreme">76–100 · Ganância Extrema</span>
                </div>`
            },
            {
                id:    'mayer',
                title: 'O que é o Múltiplo de Mayer?',
                html:  `<p>Divide o preço atual do Bitcoin pela sua <strong>Média Móvel de 200 dias (MM200)</strong>. A MM200 é a média dos preços de fechamento dos últimos 200 dias e é amplamente usada como referência de tendência de longo prazo. O múltiplo indica se o preço está "barato" ou "caro" em relação ao seu próprio histórico.</p>
                <p>Um múltiplo de <strong>1,0</strong> significa que o preço está exatamente na MM200. Acima de <strong>2,4</strong>, o Bitcoin historicamente entrou em território de sobreaquecimento. Abaixo de <strong>0,8</strong>, historicamente representou zonas de fundo de ciclo. A média histórica do múltiplo é aproximadamente <strong>1,4</strong>.</p>`
            },
            {
                id:    'dominance',
                title: 'O que é a Dominância do Bitcoin?',
                html:  `<p>É o percentual do valor total de todas as criptomoedas que pertence ao Bitcoin. Quando a dominância está <strong>alta (acima de 60%)</strong>, os investidores estão preferindo o ativo mais estabelecido e seguro do setor — geralmente um sinal de aversão ao risco. Quando a dominância está <strong>baixa</strong>, significa que capital está migrando para altcoins em busca de retornos maiores, fenômeno conhecido como <em>altseason</em>.</p>`
            },
            {
                id:    'halving',
                title: 'O que é o Halving do Bitcoin?',
                html:  `<p>O Halving é um evento programado diretamente no código-fonte do Bitcoin que reduz à metade a recompensa recebida pelos mineradores a cada bloco minerado. Ocorre a cada <strong>210.000 blocos</strong> — aproximadamente a cada quatro anos. Essa mecânica garante que a emissão de novos bitcoins desacelere progressivamente até o limite fixo de 21 milhões de unidades, tornando o Bitcoin deflacionário por design. A recompensa atual (desde abril de 2024) é de <strong>3,125 BTC por bloco</strong>; no próximo halving passará a <strong>1,5625 BTC</strong>.</p>
                <p>A contagem exibida é calculada a partir da <strong>altura atual da blockchain</strong> — o número total de blocos minerados até agora — subtraída do número do próximo bloco de halving (1.050.000). Multiplicando os blocos restantes pelo tempo médio de <strong>10 minutos por bloco</strong>, obtemos a estimativa de dias. Como a dificuldade de mineração se reajusta automaticamente a cada 2.016 blocos, o tempo médio pode variar ligeiramente, tornando a data uma estimativa, não uma certeza.</p>
                <p>Historicamente, os halvings precederam ciclos de alta expressivos: o Bitcoin tende a se apreciar nos 12–18 meses seguintes, pois a oferta de novos BTC é reduzida enquanto a demanda pode permanecer estável ou crescer. Os halvings anteriores ocorreram em novembro de 2012, julho de 2016, maio de 2020 e abril de 2024.</p>`
            },
            {
                id:    'mvrv',
                title: 'O que é o MVRV Z-Score?',
                html:  `<p>Compara o preço de mercado do Bitcoin com o seu <strong>Realized Price</strong> — o preço médio pelo qual cada bitcoin existente mudou de mãos pela última vez na blockchain. O Z-Score mede o quanto o preço atual desvia da média histórica dessa relação.</p>
                <p>Quando o Z-Score está <strong>muito negativo ou próximo de zero</strong>, o mercado está vendendo próximo (ou abaixo) do custo médio de aquisição — historicamente uma zona de acumulação. Quando está <strong>acima de 6</strong>, o preço está muito acima do custo médio, o que historicamente coincidiu com topos de ciclo.</p>
                <p>Este indicador exige dados on-chain proprietários (o Realized Cap) que não estão disponíveis em APIs gratuitas sem autenticação. Para visualizar o gráfico em tempo real, acesse gratuitamente: <a href="https://www.lookintobitcoin.com/charts/mvrv-zscore/" target="_blank" rel="noopener">LookIntoBitcoin.com</a>.</p>`
            }
        ],

        originSection: {
            title: 'Bitcoin: A Ideia Original de Satoshi',
            items: [
                {
                    title: 'Por que o Bitcoin foi criado?',
                    html:  `<p>Imagine que você quer pagar alguém pela internet sem usar um banco. Hoje, qualquer transferência digital depende de uma instituição financeira que atua como intermediária: ela confirma que você tem o dinheiro e que a transação aconteceu. Satoshi Nakamoto publicou em 2008 uma proposta para eliminar esse intermediário, criando um sistema em que duas pessoas podem transacionar diretamente, com segurança matemática, sem precisar confiar em ninguém no meio.</p>`
                },
                {
                    title: 'O problema do gasto duplo',
                    html:  `<p>O problema central que Satoshi resolveu chama-se "gasto duplo": como impedir que alguém use o mesmo dinheiro digital duas vezes? Com dinheiro físico isso não existe, pois se você me dá uma nota, não tem mais ela. Com arquivos digitais, copiar é trivial. A solução foi criar um registro público compartilhado (a blockchain), onde cada transação é gravada em ordem cronológica e visível para todos os participantes da rede.</p>`
                },
                {
                    title: 'Como funciona a prova de trabalho?',
                    html:  `<p>Esse registro é mantido por milhares de computadores ao redor do mundo simultaneamente. Para adicionar uma nova página (bloco) ao livro-caixa, é preciso resolver um problema matemático difícil, a chamada prova de trabalho. Isso torna qualquer tentativa de fraude extremamente custosa: para alterar uma transação passada, o fraudador teria que refazer o trabalho de todos os blocos seguintes e ainda superar o poder computacional combinado de toda a rede honesta.</p>`
                },
                {
                    title: 'Uma rede sem dono nem autoridade central',
                    html:  `<p>A rede não tem dono, servidor central nem autoridade. Os participantes entram e saem livremente, e o sistema continua funcionando porque segue uma regra simples: a cadeia mais longa, ou seja, aquela com mais trabalho acumulado, é considerada a verdade. Quem tenta trapacear precisaria controlar mais da metade de todo o poder de processamento do planeta, o que tornaria a fraude menos rentável do que simplesmente participar honestamente.</p>
                    <p>O resultado é dinheiro que existe apenas como matemática e consenso coletivo: sem banco central, sem intermediário, sem fronteiras. Satoshi chamou isso de "sistema de pagamento eletrônico ponto a ponto", e essa ideia de 9 páginas deu origem a todo o ecossistema de criptoativos que existe hoje.</p>
                    <p><a href="https://bitcoin.org/bitcoin.pdf" target="_blank" rel="noopener">Ler o whitepaper original (PDF)</a></p>`
                }
            ]
        }
    }
};
