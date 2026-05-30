const API     = 'https://api.coingecko.com/api/v3';
const BINANCE = 'https://api.binance.com/api/v3';
const FG_API  = 'https://api.alternative.me';

let currency      = 'usd';
let currentPeriod = '7';
let mainChart     = null;

const SYM    = { usd: '$',    brl: 'R$' };
const LOCALE = { usd: 'en-US', brl: 'pt-BR' };

// Mapeamento período → parâmetros Binance klines
const BINANCE_MAP = {
    '1':    { interval: '5m', limit: 288  },
    '7':    { interval: '1h', limit: 168  },
    '30':   { interval: '4h', limit: 180  },
    '90':   { interval: '1d', limit: 90   },
    '365':  { interval: '1d', limit: 365  },
    '1825': { interval: '1w', limit: 261  },
    'max':  { interval: '1w', limit: 1000 },
};

// ── API ──────────────────────────────────────────────────────────────────────

async function get(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// CoinGecko — apenas dados de preço atual e dominância (2 chamadas totais)
const fetchCoin   = () => get(`${API}/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
const fetchGlobal = () => get(`${API}/global`);

// Alternative.me — Fear & Greed (API separada, opcional)
const fetchFearGreed = () => get(`${FG_API}/fng/?limit=1`);

// Binance — todos os dados históricos de preço (sem rate limit relevante)
function klinesToPrices(klines) {
    return klines.map(k => [k[0], parseFloat(k[4])]);
}

async function fetchBinanceChart(period) {
    let interval, limit;

    if (period === 'ytd') {
        const days = parseInt(resolveDays('ytd'));
        interval   = days <= 90 ? '4h' : '1d';
        limit      = days <= 90 ? days * 6 : days;
    } else {
        const p  = BINANCE_MAP[period] || BINANCE_MAP['7'];
        interval = p.interval;
        limit    = p.limit;
    }

    const klines = await get(`${BINANCE}/klines?symbol=BTCUSDT&interval=${interval}&limit=${limit}`);
    return klinesToPrices(klines);
}

async function fetchBinanceRange(fromSec, toSec) {
    const daysDiff = Math.round((toSec - fromSec) / 86400);
    const interval = daysDiff <= 90 ? '4h' : '1d';
    const url = `${BINANCE}/klines?symbol=BTCUSDT&interval=${interval}&startTime=${fromSec * 1000}&endTime=${toSec * 1000}&limit=1000`;
    return klinesToPrices(await get(url));
}

async function fetchBinanceMayer() {
    const klines = await get(`${BINANCE}/klines?symbol=BTCUSDT&interval=1d&limit=201`);
    return klinesToPrices(klines);
}

// ── Period helpers ────────────────────────────────────────────────────────────

function resolveDays(period) {
    if (period === 'ytd') {
        const now  = new Date();
        const jan1 = new Date(now.getFullYear(), 0, 1);
        return String(Math.max(1, Math.ceil((now - jan1) / 86400000)));
    }
    return period;
}

function labelDays(period) {
    if (period === 'max') return 9999;
    return parseInt(resolveDays(period));
}

// ── Formatters ────────────────────────────────────────────────────────────────

const sym = () => SYM[currency];

function fmtPrice(v) {
    return v.toLocaleString(LOCALE[currency], { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtLarge(v) {
    if (v >= 1e12) return (v / 1e12).toFixed(2) + ' T';
    if (v >= 1e9)  return (v / 1e9).toFixed(2)  + ' B';
    if (v >= 1e6)  return (v / 1e6).toFixed(2)  + ' M';
    return v.toLocaleString();
}

function fmtLabel(ts, days) {
    const d = new Date(ts);
    if (days <= 2)   return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (days <= 90)  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (days <= 730) return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    return String(d.getFullYear());
}

// ── Cards (CoinGecko) ─────────────────────────────────────────────────────────

function setText(id, text) { document.getElementById(id).textContent = text; }

function setVariation(id, value) {
    const el = document.getElementById(id);
    if (value == null) { el.textContent = '--'; el.className = 'card-value'; return; }
    el.textContent = (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
    el.className = 'card-value ' + (value >= 0 ? 'positive' : 'negative');
}

function updateCards(coin, global) {
    const m = coin.market_data;
    const c = currency;
    setText('price',     sym() + ' ' + fmtPrice(m.current_price[c]));
    setText('high24h',   sym() + ' ' + fmtPrice(m.high_24h[c]));
    setText('low24h',    sym() + ' ' + fmtPrice(m.low_24h[c]));
    setText('volume',    sym() + ' ' + fmtLarge(m.total_volume[c]));
    setText('marketcap', sym() + ' ' + fmtLarge(m.market_cap[c]));
    setText('dominance', global.data.market_cap_percentage.btc.toFixed(1) + '%');
    setText('last-update', new Date().toLocaleTimeString('pt-BR'));
    setVariation('change24h', m.price_change_percentage_24h);
    setVariation('change7d',  m.price_change_percentage_7d);
    setVariation('change30d', m.price_change_percentage_30d);
    setVariation('change1y',  m.price_change_percentage_1y);
}

// ── Fear & Greed ──────────────────────────────────────────────────────────────

const FG_PT = {
    'Extreme Fear':  'Medo Extremo',
    'Fear':          'Medo',
    'Neutral':       'Neutro',
    'Greed':         'Ganância',
    'Extreme Greed': 'Ganância Extrema'
};

function fgColor(v) {
    if (v <= 24) return '#f44336';
    if (v <= 44) return '#ff7043';
    if (v <= 55) return '#888';
    if (v <= 75) return '#69f0ae';
    return '#00c853';
}

function updateFearGreed(fgData) {
    const value = parseInt(fgData.value);
    const color = fgColor(value);
    const label = FG_PT[fgData.value_classification] || fgData.value_classification;

    const numEl = document.getElementById('fg-value');
    numEl.textContent = value;
    numEl.style.color = color;

    const clsEl = document.getElementById('fg-class');
    clsEl.textContent = label;
    clsEl.style.color = color;

    document.getElementById('fg-bar').style.left = Math.min(Math.max(value, 2), 98) + '%';
}

function fgUnavailable() {
    setText('fg-value', 'N/D');
    const cl = document.getElementById('fg-class');
    cl.textContent = 'Indisponível';
    cl.style.color = '';
}

// ── Mayer Multiple (Binance) ──────────────────────────────────────────────────

function updateMayer(prices) {
    const last200   = prices.slice(-200).map(p => p[1]);
    const ma200     = last200.reduce((a, b) => a + b, 0) / last200.length;
    const lastPrice = prices[prices.length - 1][1];
    const multiple  = lastPrice / ma200;

    let label, cls;
    if (multiple < 0.8)       { label = 'Subvalorizado'; cls = 'sub'; }
    else if (multiple < 1.0)  { label = 'Abaixo MM200';  cls = 'sub'; }
    else if (multiple <= 2.4) { label = 'Zona Normal';   cls = 'norm'; }
    else                      { label = 'Sobreaquecido'; cls = 'hot'; }

    setText('mayer-value', '×' + multiple.toFixed(2));
    setText('mayer-sub', 'MM200: $' + fmtLarge(ma200));
    const badge = document.getElementById('mayer-badge');
    badge.textContent = label;
    badge.className   = 'badge ' + cls;
}

function mayerUnavailable() {
    setText('mayer-value', 'N/D');
    setText('mayer-sub', '--');
    const badge = document.getElementById('mayer-badge');
    badge.textContent = '--';
    badge.className   = 'badge norm';
}

// ── Chart (Binance) ───────────────────────────────────────────────────────────

function buildChart(existing, prices, period) {
    if (existing) existing.destroy();
    const days   = labelDays(period);
    const labels = prices.map(p => fmtLabel(p[0], days));
    const values = prices.map(p => p[1]);

    return new Chart(document.getElementById('main-chart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data: values,
                borderColor: '#f7931a',
                backgroundColor: 'rgba(247,147,26,0.07)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: item => '$ ' + fmtPrice(item.parsed.y)
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#888', maxTicksLimit: 8, maxRotation: 0 },
                    grid:  { color: '#1e1e1e' }
                },
                y: {
                    position: 'right',
                    ticks: { color: '#888', callback: v => '$ ' + fmtLarge(v) },
                    grid:  { color: '#1e1e1e' }
                }
            }
        }
    });
}

// ── Load functions ────────────────────────────────────────────────────────────

function setLoading(on) {
    document.getElementById('loading').style.display = on ? 'block' : 'none';
}

function showError(msg) {
    const el = document.getElementById('loading');
    el.style.display = 'block';
    el.textContent   = msg;
}

async function loadAdvancedIndicators() {
    try {
        const fgRes = await fetchFearGreed();
        updateFearGreed(fgRes.data[0]);
    } catch (e) {
        console.warn('[Dashboard] Fear & Greed indisponível:', e.message);
        fgUnavailable();
    }

    try {
        const prices = await fetchBinanceMayer();
        updateMayer(prices);
    } catch (e) {
        console.warn('[Dashboard] Mayer Multiple indisponível:', e.message);
        mayerUnavailable();
    }
}

async function refreshCards() {
    try {
        const [coin, global] = await Promise.all([fetchCoin(), fetchGlobal()]);
        updateCards(coin, global);
    } catch (e) {
        console.warn('[Dashboard] Refresh dos cards falhou:', e.message);
    }
}

async function loadMainChart(period) {
    setLoading(true);
    try {
        const prices = await fetchBinanceChart(period);
        mainChart    = buildChart(mainChart, prices, period);
    } catch (e) {
        console.error('[Dashboard] Erro ao carregar gráfico:', e.message);
        showError('Não foi possível carregar o período. Aguarde e tente novamente.');
        return;
    }
    setLoading(false);
}

async function loadMainChartRange(fromSec, toSec) {
    setLoading(true);
    try {
        const daysDiff = String(Math.round((toSec - fromSec) / 86400));
        const prices   = await fetchBinanceRange(fromSec, toSec);
        mainChart      = buildChart(mainChart, prices, daysDiff);
    } catch (e) {
        console.error('[Dashboard] Erro ao carregar intervalo:', e.message);
        showError('Não foi possível carregar o período. Aguarde e tente novamente.');
        return;
    }
    setLoading(false);
}

async function loadAll() {
    setLoading(true);

    // Fase 1 — Gráfico via Binance (crítico, sempre deve funcionar)
    try {
        const prices = await fetchBinanceChart(currentPeriod);
        mainChart    = buildChart(mainChart, prices, currentPeriod);
    } catch (e) {
        console.error('[Dashboard] Erro ao carregar gráfico (Binance):', e.message);
        showError('Não foi possível carregar dados. Verifique sua conexão e recarregue a página.');
        return;
    }

    setLoading(false);

    // Fase 2 — Cards via CoinGecko (opcional: falha silenciosa, cards ficam em --)
    try {
        const [coin, global] = await Promise.all([fetchCoin(), fetchGlobal()]);
        updateCards(coin, global);
    } catch (e) {
        console.warn('[Dashboard] CoinGecko indisponível (cards não atualizados):', e.message);
    }

    // Fase 3 — Indicadores avançados (não bloqueiam a página)
    loadAdvancedIndicators();
}

// ── Events ────────────────────────────────────────────────────────────────────

document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        if (btn.classList.contains('active')) return;

        const allBtns = document.querySelectorAll('.period-btn');
        allBtns.forEach(b => { b.classList.remove('active'); b.disabled = true; });
        btn.classList.add('active');
        currentPeriod = btn.dataset.period;
        document.getElementById('date-from').value = '';
        document.getElementById('date-to').value   = '';

        await loadMainChart(currentPeriod);

        allBtns.forEach(b => { b.disabled = false; });
    });
});

document.getElementById('btn-apply-dates').addEventListener('click', async () => {
    const fromVal = document.getElementById('date-from').value;
    const toVal   = document.getElementById('date-to').value;
    if (!fromVal || !toVal) return;

    const from = Math.floor(new Date(fromVal).getTime() / 1000);
    const to   = Math.floor(new Date(toVal + 'T23:59:59').getTime() / 1000);

    if (from >= to) { alert('A data inicial deve ser anterior à data final.'); return; }

    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    await loadMainChartRange(from, to);
});

document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        if (btn.dataset.currency === currency) return;
        document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currency = btn.dataset.currency;
        await loadAll();
    });
});

// ── Init ──────────────────────────────────────────────────────────────────────

setInterval(refreshCards, 60_000);
loadAll();
