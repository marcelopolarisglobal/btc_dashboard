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
    },

    zcash: {
        id:               'zcash',
        symbol:           'ZEC',
        name:             'Zcash',
        icon:             'ⓩ',
        binancePair:      'ZECUSDT',
        dominanceKey:     'zec',
        startDate:        '2016-10-28',
        accentColor:      '#F4B728',
        accentColorAlpha: { light: 'rgba(244,183,40,0.10)', dark: 'rgba(244,183,40,0.07)' },
        hasHalving:       true,
        nextHalvingBlock: 4_200_000,
        halvingBlockTime: 90,
        halvingBlockApi:  'blockchair',
        mayer:            { low: 0.8, mid: 1.0, high: 2.4 },
        mvrvLink:         'https://messari.io/asset/zcash/metrics',
        mvrvLinkText:     'Ver métricas no Messari →',

        glossaryIndicators: [
            {
                id:    'fear-greed',
                title: 'O que é o Fear &amp; Greed Index?',
                html:  `<p>Mede o sentimento predominante do mercado de criptomoedas numa escala de 0 a 100. Valores próximos de 0 indicam <strong>Medo Extremo</strong> — os investidores estão nervosos e o preço pode estar deprimido além do que os fundamentos justificam, criando possíveis oportunidades para quem tem visão de longo prazo. Valores próximos de 100 indicam <strong>Ganância Extrema</strong> — o mercado está eufórico e historicamente esse excesso de otimismo precede correções de preço.</p>
                <p>O índice é calculado com base em volatilidade, volume de mercado, redes sociais, dominância e tendências de busca. É um indicador global do mercado cripto — não é específico do Zcash, mas reflete o humor geral do ambiente em que o ZEC está inserido.</p>
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
                html:  `<p>Divide o preço atual do Zcash pela sua <strong>Média Móvel de 200 dias (MM200)</strong>. A MM200 é a média dos preços de fechamento dos últimos 200 dias, calculada a partir dos dados do par ZECUSDT na Binance, e funciona como referência de tendência de longo prazo.</p>
                <p>Um múltiplo de <strong>1,0</strong> significa que o preço está exatamente na MM200. Valores <strong>abaixo de 0,8</strong> indicam que o ZEC está sendo negociado bem abaixo da sua média histórica recente — zonas que historicamente representaram oportunidades de acumulação. Valores <strong>acima de 2,4</strong> sugerem sobreaquecimento de curto prazo.</p>`
            },
            {
                id:    'dominance',
                title: 'O que é a Dominância do Zcash?',
                html:  `<p>É o percentual do valor total de todas as criptomoedas que pertence ao Zcash. Por ser um ativo de nicho focado em privacidade, a dominância do ZEC é naturalmente baixa em relação a Bitcoin e Ethereum, mas é um indicador útil para acompanhar o fluxo de capital em direção às moedas de privacidade ao longo do tempo.</p>
                <p>Aumentos na dominância do ZEC podem indicar interesse renovado na tese de privacidade — especialmente em períodos de maior escrutínio regulatório ou debates sobre vigilância financeira.</p>`
            },
            {
                id:    'halving',
                title: 'O que é o Halving do Zcash?',
                html:  `<p>O Halving do Zcash é um evento programado no protocolo que reduz à metade a recompensa dos mineradores a cada <strong>840.000 blocos</strong> — o equivalente a aproximadamente dois a três anos, dado o tempo médio observado de <strong>90 segundos por bloco</strong>. Essa mecânica é idêntica à do Bitcoin em estrutura, mas mais frequente em número de blocos por ano por causa do intervalo mais curto entre blocos.</p>
                <p>A recompensa atual é de <strong>0,78125 ZEC por bloco</strong> (após o halving de maio de 2026). No próximo halving, passará a <strong>0,390625 ZEC</strong>. O fornecimento máximo do Zcash é de <strong>21 milhões de unidades</strong> — o mesmo limite do Bitcoin.</p>
                <p>A contagem regressiva é calculada a partir da altura atual da blockchain Zcash — obtida via API do Blockchair — subtraída do número do próximo bloco de halving (4.200.000). Multiplicando os blocos restantes pelo tempo médio por bloco (aproximadamente 90 segundos), obtemos a estimativa de dias até o evento.</p>`
            },
            {
                id:    'mvrv',
                title: 'O que é o MVRV Z-Score?',
                html:  `<p>Compara o preço de mercado do Zcash com o seu <strong>Realized Price</strong> — o preço médio pelo qual cada ZEC existente mudou de mãos pela última vez na blockchain. O Z-Score mede o quanto o preço atual desvia da média histórica dessa relação.</p>
                <p>Quando o Z-Score está <strong>próximo de zero ou negativo</strong>, o mercado está vendendo próximo do custo médio de aquisição — historicamente uma zona de acumulação. Quando está <strong>elevado</strong>, o preço está muito acima do custo médio, o que historicamente precedeu topos de ciclo.</p>
                <p>Este indicador exige dados on-chain (o Realized Cap) que não estão disponíveis em APIs gratuitas sem autenticação. Para visualizar métricas do Zcash em tempo real, acesse: <a href="https://messari.io/asset/zcash/metrics" target="_blank" rel="noopener">Messari.io</a>.</p>`
            }
        ],

        originSection: {
            title: 'Zcash: A Moeda da Privacidade por Padrão',
            items: [
                {
                    title: 'De onde veio o Zcash?',
                    html:  `<p>O Zcash foi lançado em <strong>28 de outubro de 2016</strong> pela <strong>Electric Coin Company</strong>, fundada por <strong>Zooko Wilcox</strong>. Seu código-fonte é um fork direto do Bitcoin — a estrutura de blocos, o modelo de UTXO e o limite de 21 milhões de unidades são idênticos. A diferença fundamental está em uma camada de privacidade adicionada sobre essa base: as transações podem ser completamente invisíveis para observadores externos, incluindo o remetente, o destinatário e o valor transferido.</p>`
                },
                {
                    title: 'O que são zk-SNARKs?',
                    html:  `<p>A tecnologia central do Zcash chama-se <strong>zk-SNARK</strong>, abreviação de <em>zero-knowledge succinct non-interactive argument of knowledge</em>. Em termos simples: é uma prova matemática que permite a alguém demonstrar que conhece uma informação sem revelá-la, como provar que possui fundos suficientes para uma transação sem expor o saldo.</p>
                    <p>Imagine que você quer pagar por um serviço online sem que o destinatário, o processador ou qualquer observador saiba quem você é ou quanto transferiu. Com zk-SNARKs, o protocolo verifica matematicamente que a transação é válida e que não há criação ilegal de moeda, tudo sem expor quem pagou, quem recebeu ou o valor transferido.</p>`
                },
                {
                    title: 'Endereços transparentes e blindados',
                    html:  `<p>O Zcash oferece dois tipos de endereços. Os <strong>endereços transparentes</strong> (prefixo <code>t</code>) funcionam exatamente como os do Bitcoin: todas as transações são públicas e rastreáveis na blockchain. Os <strong>endereços blindados</strong> (prefixo <code>z</code>) utilizam zk-SNARKs para ocultar completamente os dados da transação.</p>
                    <p>Essa dualidade permite que o Zcash seja compatível com exchanges e serviços que exigem rastreabilidade, ao mesmo tempo em que oferece privacidade total para quem precisa. O usuário escolhe o nível de privacidade que deseja para cada transação.</p>`
                },
                {
                    title: 'Emissão, halving e o Founders Reward',
                    html:  `<p>Assim como o Bitcoin, o Zcash tem emissão programada e deflacionária, com halvings a cada 840.000 blocos (~2,5 anos). Nos primeiros quatro anos de existência (2016–2020), <strong>20% de cada recompensa de bloco</strong> foi destinada automaticamente à Electric Coin Company, à Zcash Foundation e aos fundadores do protocolo — este mecanismo foi chamado de <em>Founders Reward</em> e foi responsável por financiar o desenvolvimento inicial.</p>
                    <p>Após o encerramento do Founders Reward em novembro de 2020 (bloco 1.046.400), ele foi substituído pelo <strong>Dev Fund</strong> — um modelo em que 20% da recompensa continua sendo direcionado para desenvolvimento, mas agora distribuído entre a Electric Coin Company (7%), a Zcash Foundation (5%) e doações a terceiros (8%). O objetivo é garantir financiamento sustentável para o protocolo sem depender de investidores externos.</p>`
                }
            ]
        }
    }
};
