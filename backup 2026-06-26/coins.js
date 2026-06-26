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
    },

    ethereum: {
        id:               'ethereum',
        symbol:           'ETH',
        name:             'Ethereum',
        icon:             'Ξ',
        binancePair:      'ETHUSDT',
        dominanceKey:     'eth',
        startDate:        '2015-07-30',
        accentColor:      '#627eea',
        accentColorAlpha: { light: 'rgba(98,126,234,0.10)', dark: 'rgba(98,126,234,0.07)' },
        hasHalving:       false,
        nextHalvingBlock: null,
        halvingBlockTime: null,
        halvingBlockApi:  null,
        mayer:            { low: 0.8, mid: 1.0, high: 2.4 },
        mvrvLink:         'https://www.lookintobitcoin.com/charts/ethereum-mvrv-zscore/',
        mvrvLinkText:     'Ver gráfico em LookIntoBitcoin →',

        glossaryIndicators: [
            {
                id:    'fear-greed',
                title: 'O que é o Fear &amp; Greed Index?',
                html:  `<p>Mede o sentimento predominante do mercado de criptomoedas numa escala de 0 a 100. Valores próximos de 0 indicam <strong>Medo Extremo</strong> — os investidores estão nervosos e o preço pode estar deprimido além do que os fundamentos justificam, criando possíveis oportunidades para quem tem visão de longo prazo. Valores próximos de 100 indicam <strong>Ganância Extrema</strong> — o mercado está eufórico e historicamente esse excesso de otimismo precede correções de preço.</p>
                <p>O índice é calculado com base em volatilidade, volume de mercado, redes sociais, dominância e tendências de busca. É um indicador global do mercado cripto — não é específico do Ethereum, mas reflete o humor geral do ambiente em que o ETH está inserido.</p>
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
                html:  `<p>Divide o preço atual do Ethereum pela sua <strong>Média Móvel de 200 dias (MM200)</strong>. A MM200 é a média dos preços de fechamento dos últimos 200 dias, calculada a partir dos dados do par ETHUSDT na Binance, e funciona como referência de tendência de longo prazo.</p>
                <p>Um múltiplo de <strong>1,0</strong> significa que o preço está exatamente na MM200. Valores <strong>abaixo de 0,8</strong> indicam que o ETH está sendo negociado bem abaixo da sua média histórica recente — zonas que historicamente representaram oportunidades de acumulação. Valores <strong>acima de 2,4</strong> sugerem sobreaquecimento de curto prazo.</p>`
            },
            {
                id:    'dominance',
                title: 'O que é a Dominância do Ethereum?',
                html:  `<p>É o percentual do valor total de todas as criptomoedas que pertence ao Ethereum. O ETH é a segunda maior criptomoeda do mundo e a maior das chamadas <em>altcoins</em> (toda criptomoeda que não é o Bitcoin), de modo que sua dominância costuma ser a segunda mais alta do mercado, atrás apenas do Bitcoin.</p>
                <p>Aumentos na dominância do ETH frequentemente acompanham períodos de maior apetite por risco, quando capital migra do Bitcoin para o ecossistema de aplicativos, contratos inteligentes e finanças descentralizadas construído sobre o Ethereum.</p>`
            },
            {
                id:    'mvrv',
                title: 'O que é o MVRV Z-Score?',
                html:  `<p>Compara o preço de mercado do Ethereum com o seu <strong>Realized Price</strong> — o preço médio pelo qual cada ETH existente mudou de mãos pela última vez na blockchain. O Z-Score mede o quanto o preço atual desvia da média histórica dessa relação.</p>
                <p>Quando o Z-Score está <strong>próximo de zero ou negativo</strong>, o mercado está vendendo próximo do custo médio de aquisição — historicamente uma zona de acumulação. Quando está <strong>elevado</strong>, o preço está muito acima do custo médio, o que historicamente precedeu topos de ciclo.</p>
                <p>Este indicador exige dados on-chain proprietários (o Realized Cap) que não estão disponíveis em APIs gratuitas sem autenticação. Para visualizar o gráfico em tempo real, acesse gratuitamente: <a href="https://www.lookintobitcoin.com/charts/ethereum-mvrv-zscore/" target="_blank" rel="noopener">LookIntoBitcoin.com</a>.</p>`
            }
        ],

        originSection: {
            title: 'Ethereum: O Computador Mundial Programável',
            items: [
                {
                    title: 'O que é o Ethereum e por que foi criado?',
                    html:  `<p>O Ethereum foi proposto em 2013 pelo programador <strong>Vitalik Buterin</strong> e lançado em <strong>30 de julho de 2015</strong>. Se o Bitcoin foi criado para ser "dinheiro digital" — uma forma de transferir valor sem bancos —, o Ethereum nasceu com uma ambição mais ampla: ser uma <strong>plataforma programável</strong>, um "computador mundial" descentralizado onde qualquer pessoa pode publicar aplicativos que rodam exatamente como foram escritos.</p>
                    <p>Em vez de um único caso de uso (pagamentos), o Ethereum oferece uma base sobre a qual desenvolvedores constroem programas que funcionam sem servidor central, sem dono e sem a possibilidade de serem censurados ou desligados por uma única autoridade. É essa flexibilidade que transformou o Ethereum no alicerce de boa parte do ecossistema cripto atual.</p>`
                },
                {
                    title: "O que é o Ether (ETH) e o que é 'gas'?",
                    html:  `<p>O <strong>Ether (ETH)</strong> é o token nativo do Ethereum — o ativo que aparece neste dashboard. Ele tem duas funções principais: serve como reserva de valor e meio de troca, como o Bitcoin, mas também é o "combustível" que paga pela execução de operações na rede.</p>
                    <p>Cada operação — enviar ETH, executar um contrato, registrar um token — consome uma quantidade de <strong>gas</strong>, e o usuário paga essa taxa em ETH. Quanto mais congestionada a rede, mais cara fica a taxa, num sistema de leilão por espaço nos blocos. Desde uma atualização de 2021 (<em>EIP-1559</em>), parte de cada taxa paga é <strong>queimada</strong> — destruída permanentemente —, o que reduz a oferta de ETH em circulação e pode, em períodos de uso intenso, tornar o Ether deflacionário.</p>`
                },
                {
                    title: 'O que são smart contracts?',
                    html:  `<p>Os <strong>contratos inteligentes</strong> (<em>smart contracts</em>) são a grande inovação do Ethereum. São programas armazenados na blockchain que executam regras automaticamente quando determinadas condições são atendidas — a lógica "se isto acontecer, então faça aquilo" — sem precisar de um intermediário humano para garantir o cumprimento.</p>
                    <p>Esses programas rodam em um ambiente padronizado chamado <strong>Ethereum Virtual Machine (EVM)</strong>, replicado em milhares de computadores ao redor do mundo. Como o código é público e executado por toda a rede, ninguém pode alterá-lo unilateralmente nem impedir sua execução. É isso que permite construir, por exemplo, um sistema de empréstimo que libera fundos automaticamente quando uma garantia é depositada, sem banco no meio.</p>`
                },
                {
                    title: 'Proof of Stake x Proof of Work',
                    html:  `<p>Para registrar transações de forma confiável, toda blockchain precisa de um mecanismo de consenso. O <strong>Bitcoin usa Proof of Work (Prova de Trabalho)</strong>: mineradores competem gastando enormes quantidades de energia elétrica para resolver cálculos e ganhar o direito de adicionar o próximo bloco.</p>
                    <p>O Ethereum começou também em Proof of Work, mas em <strong>setembro de 2022</strong>, num evento chamado <em>The Merge</em>, migrou para <strong>Proof of Stake (Prova de Participação)</strong>. Nesse modelo não há mineração: participantes chamados <strong>validadores</strong> depositam ETH como garantia — um processo conhecido como <em>staking</em> — e são sorteados para validar blocos. Quem age de forma desonesta perde parte do ETH depositado. A mudança reduziu o consumo de energia da rede em cerca de <strong>99,9%</strong>.</p>
                    <p>Como não há mineradores recebendo recompensa por bloco no mesmo modelo do Bitcoin, o Ethereum <strong>não tem halving</strong> — por isso este dashboard não exibe a contagem regressiva de halving para o ETH.</p>`
                },
                {
                    title: 'Principais diferenças para o Bitcoin',
                    html:  `<p>Bitcoin e Ethereum são frequentemente comparados, mas têm propósitos distintos. O <strong>Bitcoin</strong> foi desenhado para ser dinheiro digital escasso: tem oferta fixa de <strong>21 milhões</strong> de unidades e usa Proof of Work. O <strong>Ethereum</strong> é uma plataforma de aplicativos: usa Proof of Stake e <strong>não tem um teto rígido de oferta</strong>, embora a queima de taxas (EIP-1559) possa, em momentos de uso intenso, reduzir a quantidade de ETH em circulação.</p>
                    <p>Em resumo: o Bitcoin se concentra em ser a forma mais segura e previsível de reserva de valor; o Ethereum prioriza a flexibilidade para servir de base a contratos inteligentes, tokens e aplicativos descentralizados. São abordagens complementares, não necessariamente concorrentes.</p>`
                },
                {
                    title: 'Stablecoins, tokens e NFTs sobre o Ethereum',
                    html:  `<p>Boa parte do valor do ecossistema cripto não está em moedas próprias, mas em <strong>ativos registrados sobre o Ethereum</strong> por meio de contratos inteligentes que seguem padrões técnicos abertos. O padrão <strong>ERC-20</strong> define tokens <em>fungíveis</em> (intercambiáveis entre si), categoria que inclui milhares de projetos e, principalmente, as <strong>stablecoins</strong> — tokens atrelados ao valor de uma moeda tradicional, como o dólar. As mais conhecidas são a <strong>USDT</strong> (Tether) e a <strong>USDC</strong>, amplamente usadas para transacionar sem a volatilidade típica das criptomoedas.</p>
                    <p>Já os padrões <strong>ERC-721</strong> e <strong>ERC-1155</strong> definem os <strong>NFTs</strong> (<em>non-fungible tokens</em>): tokens <em>únicos</em>, em que cada unidade é distinta e indivisível, usados para representar a propriedade de itens como arte digital, colecionáveis e itens de jogos. Sobre essa mesma base também se construiu o universo das <strong>finanças descentralizadas (DeFi)</strong> — empréstimos, câmbio e investimentos operados inteiramente por contratos inteligentes, sem instituições financeiras no meio.</p>`
                }
            ]
        }
    },

    solana: {
        id:               'solana',
        symbol:           'SOL',
        name:             'Solana',
        icon:             '◎',
        binancePair:      'SOLUSDT',
        dominanceKey:     'sol',
        startDate:        '2020-08-11',
        accentColor:      '#9945FF',
        accentColorAlpha: { light: 'rgba(153,69,255,0.10)', dark: 'rgba(153,69,255,0.07)' },
        hasHalving:       false,
        nextHalvingBlock: null,
        halvingBlockTime: null,
        halvingBlockApi:  null,
        mayer:            { low: 0.8, mid: 1.0, high: 2.4 },
        mvrvLink:         'https://messari.io/asset/solana/metrics',
        mvrvLinkText:     'Ver métricas no Messari →',

        glossaryIndicators: [
            {
                id:    'fear-greed',
                title: 'O que é o Fear &amp; Greed Index?',
                html:  `<p>Mede o sentimento predominante do mercado de criptomoedas numa escala de 0 a 100. Valores próximos de 0 indicam <strong>Medo Extremo</strong> — os investidores estão nervosos e o preço pode estar deprimido além do que os fundamentos justificam, criando possíveis oportunidades para quem tem visão de longo prazo. Valores próximos de 100 indicam <strong>Ganância Extrema</strong> — o mercado está eufórico e historicamente esse excesso de otimismo precede correções de preço.</p>
                <p>O índice é calculado com base em volatilidade, volume de mercado, redes sociais, dominância e tendências de busca. É um indicador global do mercado cripto — não é específico do Solana, mas reflete o humor geral do ambiente em que a SOL está inserida.</p>
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
                html:  `<p>Divide o preço atual do Solana pela sua <strong>Média Móvel de 200 dias (MM200)</strong>. A MM200 é a média dos preços de fechamento dos últimos 200 dias, calculada a partir dos dados do par SOLUSDT na Binance, e funciona como referência de tendência de longo prazo.</p>
                <p>Um múltiplo de <strong>1,0</strong> significa que o preço está exatamente na MM200. Valores <strong>abaixo de 0,8</strong> indicam que a SOL está sendo negociada bem abaixo da sua média histórica recente — zonas que historicamente representaram oportunidades de acumulação. Valores <strong>acima de 2,4</strong> sugerem sobreaquecimento de curto prazo.</p>`
            },
            {
                id:    'dominance',
                title: 'O que é a Dominância do Solana?',
                html:  `<p>É o percentual do valor total de todas as criptomoedas que pertence ao Solana. A SOL é uma das maiores <em>altcoins</em> (criptomoedas que não são o Bitcoin) e figura consistentemente entre os ativos de maior valor de mercado, de modo que sua dominância é uma das mais relevantes fora de Bitcoin e Ethereum.</p>
                <p>Aumentos na dominância da SOL costumam acompanhar períodos de maior apetite por risco, quando capital migra em busca de redes rápidas e de baixo custo para aplicativos, contratos inteligentes e finanças descentralizadas.</p>`
            },
            {
                id:    'mvrv',
                title: 'O que é o MVRV Z-Score?',
                html:  `<p>Compara o preço de mercado do Solana com o seu <strong>Realized Price</strong> — o preço médio pelo qual cada SOL existente mudou de mãos pela última vez na blockchain. O Z-Score mede o quanto o preço atual desvia da média histórica dessa relação.</p>
                <p>Quando o Z-Score está <strong>próximo de zero ou negativo</strong>, o mercado está vendendo próximo do custo médio de aquisição — historicamente uma zona de acumulação. Quando está <strong>elevado</strong>, o preço está muito acima do custo médio, o que historicamente precedeu topos de ciclo.</p>
                <p>Este indicador exige dados on-chain (o Realized Cap) que não estão disponíveis em APIs gratuitas sem autenticação. Para visualizar métricas do Solana em tempo real, acesse: <a href="https://messari.io/asset/solana/metrics" target="_blank" rel="noopener">Messari.io</a>.</p>`
            }
        ],

        originSection: {
            title: 'Solana: A Blockchain de Alta Velocidade',
            items: [
                {
                    title: 'De onde veio o Solana?',
                    html:  `<p>O Solana foi proposto em <strong>2017</strong> pelo engenheiro <strong>Anatoly Yakovenko</strong>, ex-Qualcomm, em um whitepaper que descrevia uma forma de fazer uma blockchain processar milhares de transações por segundo. A rede principal (<em>mainnet beta</em>) foi lançada em <strong>16 de março de 2020</strong>, desenvolvida pela <strong>Solana Labs</strong> e mantida pela <strong>Solana Foundation</strong>.</p>
                    <p>O token nativo é o <strong>SOL</strong> — o ativo exibido neste dashboard. Ele tem duas funções centrais: pagar as taxas de transação da rede e ser depositado pelos validadores como garantia no processo de <em>staking</em>, que sustenta a segurança da blockchain.</p>`
                },
                {
                    title: 'O que é o Proof of History (PoH)?',
                    html:  `<p>A grande inovação do Solana é o <strong>Proof of History</strong> (Prova de Histórico). Em blockchains tradicionais, os computadores da rede precisam "conversar" entre si para concordar sobre a ordem e o horário de cada transação — um processo que consome tempo. O PoH resolve isso criando um <strong>relógio criptográfico</strong>: uma sequência matemática contínua que carimba cada transação com uma marca temporal verificável <em>antes</em> de o consenso acontecer.</p>
                    <p>Com a ordem do tempo já estabelecida por esse relógio, os validadores não precisam negociar quando cada evento ocorreu. Isso, combinado com um motor de execução chamado <strong>Sealevel</strong> — que processa várias transações em <strong>paralelo</strong> em vez de uma de cada vez —, é o que permite a vazão extremamente alta da rede.</p>`
                },
                {
                    title: 'Velocidade e custo: a vantagem sobre o Ethereum',
                    html:  `<p>O Solana foi projetado para desempenho bruto. Seus blocos são produzidos a cada <strong>~400 milissegundos</strong>, contra cerca de <strong>12 segundos</strong> do Ethereum, e a rede processa milhares de transações por segundo com taxas de <strong>frações de centavo de dólar</strong> — enquanto no Ethereum as taxas de <em>gas</em> são variáveis e, em períodos de congestionamento, historicamente chegaram a vários dólares por operação.</p>
                    <p>A diferença de estratégia é estrutural: o Solana é <strong>monolítico</strong>, ou seja, tenta fazer tudo rápido em uma única camada principal; o Ethereum adotou uma abordagem de <strong>camadas adicionais (camada‑2)</strong>, redes construídas por cima para ganhar escala. Essa velocidade tem um custo honesto de mencionar: validar a rede Solana exige <strong>hardware mais potente</strong>, o que tende a concentrar mais os participantes, e a rede já enfrentou <strong>episódios de instabilidade e paradas</strong> ao longo de sua história.</p>`
                },
                {
                    title: 'Principais diferenças para o Bitcoin',
                    html:  `<p>O <strong>Bitcoin</strong> foi desenhado para ser dinheiro digital escasso: usa <strong>Proof of Work</strong> (mineração por gasto de energia) e tem oferta fixa de <strong>21 milhões</strong> de unidades. O <strong>Solana</strong> é uma plataforma programável de aplicativos: usa <strong>Proof of Stake combinado com Proof of History</strong>, sem mineração e sem teto rígido de oferta.</p>
                    <p>Em vez de um limite fixo, o SOL segue um modelo de <strong>inflação decrescente</strong> — a emissão de novas moedas começa mais alta e cai gradualmente ano a ano. Além disso, <strong>50% de cada taxa de transação é queimada</strong> (destruída permanentemente), o que contrabalança parte dessa emissão. São propósitos distintos: o Bitcoin prioriza ser reserva de valor previsível; o Solana prioriza velocidade e capacidade de rodar aplicativos.</p>`
                },
                {
                    title: 'Principais diferenças para o Ethereum',
                    html:  `<p>Solana e Ethereum competem no mesmo território — ambos são plataformas de <strong>contratos inteligentes</strong>, programas que rodam na blockchain sem intermediário. A diferença está em <em>como</em> executam esses programas. O Ethereum processa transações em <strong>sequência</strong>, uma após a outra, na sua máquina virtual (a EVM), com programas escritos em <strong>Solidity</strong>. O Solana processa transações que não dependem umas das outras em <strong>paralelo</strong> (via Sealevel), com programas escritos em <strong>Rust e C</strong>.</p>
                    <p>Na prática, o Solana troca parte da descentralização e da simplicidade do Ethereum por <strong>desempenho bruto</strong>: mais transações, mais rápido e mais barato, em uma única camada. O Ethereum, por sua vez, aposta em um ecossistema maior e mais maduro de aplicativos e em escalar por meio de camadas‑2. São visões complementares de como uma plataforma descentralizada deve crescer.</p>`
                },
                {
                    title: 'Documentação oficial',
                    html:  `<p>Para aprofundar o funcionamento técnico da rede, o ecossistema de aplicativos e o processo de <em>staking</em>, a fonte primária é a documentação oficial mantida pela Solana Foundation.</p>
                    <p><a href="https://solana.com/docs" target="_blank" rel="noopener">Documentação oficial do Solana</a> · <a href="https://solana.com/solana-whitepaper.pdf" target="_blank" rel="noopener">Whitepaper original (PDF)</a></p>`
                }
            ]
        }
    }
};
