const API        = 'https://api.coingecko.com/api/v3';
const BINANCE    = 'https://api.binance.com/api/v3';
const FG_API     = 'https://api.alternative.me';
const MEMPOOL    = 'https://mempool.space/api';
const BLOCKCHAIR = 'https://api.blockchair.com';

const CONFIG = {
    REFRESH_MS:        60_000,
    MAYER_DAYS:        200,
    FETCH_TIMEOUT_MS:  8_000,
    FETCH_MAX_RETRIES: 2,
    CACHE_TTL_MS:      60_000,
    FG_BANDS:          [24, 44, 55, 75],
    FG_COLORS:         ['#f44336', '#ff7043', '#888', '#69f0ae', '#00c853'],
    ERR_CHART:         'Não foi possível carregar o período. Aguarde e tente novamente.',
};

let activeCoin      = null;
let currency        = 'usd';
let currentPeriod   = '7';
let mainChart       = null;
let lastPrices      = null;
let lastChartPeriod = '7';
let lastCoin        = null;
let loadGeneration  = 0;
let jan1Prices      = { usd: null, brl: null };

const SYM    = { usd: '$',    brl: 'R$' };
const LOCALE = { usd: 'en-US', brl: 'pt-BR' };

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

async function get(url, attempt = 0) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT_MS);
    try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (e) {
        clearTimeout(timer);
        if (attempt >= CONFIG.FETCH_MAX_RETRIES) throw e;
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt)));
        return get(url, attempt + 1);
    }
}

const cache = {};
function cachedGet(url) {
    const entry = cache[url];
    if (entry && Date.now() - entry.ts < CONFIG.CACHE_TTL_MS) return Promise.resolve(entry.data);
    return get(url).then(data => { cache[url] = { data, ts: Date.now() }; return data; });
}

const fetchCoin      = () => cachedGet(`${API}/coins/${activeCoin.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
const fetchGlobal    = () => cachedGet(`${API}/global`);
const fetchFearGreed = () => get(`${FG_API}/fng/?limit=1`);

async function fetchBlockHeight() {
    if (activeCoin.halvingBlockApi === 'mempool') {
        return get(`${MEMPOOL}/blocks/tip/height`);
    }
    if (activeCoin.halvingBlockApi === 'blockchair') {
        const data = await get(`${BLOCKCHAIR}/${activeCoin.id}/stats`);
        return data?.data?.blocks;
    }
    return null;
}

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
    const klines = await get(`${BINANCE}/klines?symbol=${activeCoin.binancePair}&interval=${interval}&limit=${limit}`);
    return klinesToPrices(klines);
}

async function fetchBinanceRange(fromSec, toSec) {
    const daysDiff = Math.round((toSec - fromSec) / 86400);
    const interval = daysDiff <= 90 ? '4h' : '1d';
    const url = `${BINANCE}/klines?symbol=${activeCoin.binancePair}&interval=${interval}&startTime=${fromSec * 1000}&endTime=${toSec * 1000}&limit=1000`;
    return klinesToPrices(await get(url));
}

async function fetchBinanceMayer() {
    const klines = await get(`${BINANCE}/klines?symbol=${activeCoin.binancePair}&interval=1d&limit=${CONFIG.MAYER_DAYS + 1}`);
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

// ── Theme ─────────────────────────────────────────────────────────────────────

function chartColors(coin) {
    const light = document.documentElement.dataset.theme === 'light';
    return {
        grid: light ? '#e0e0e0' : '#1e1e1e',
        tick: light ? '#555'    : '#888',
        fill: coin.accentColorAlpha[light ? 'light' : 'dark'],
    };
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
}

function initTheme() {
    const saved = localStorage.getItem('btc-theme');
    const pref  = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(pref);
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    const next    = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('btc-theme', next);
    if (mainChart && lastPrices && lastCoin) {
        mainChart = buildChart(mainChart, lastPrices, lastChartPeriod, lastCoin);
    }
});

// ── Cards (CoinGecko) ─────────────────────────────────────────────────────────

function setText(id, text) { document.getElementById(id).textContent = text; }

function setVariation(id, value) {
    const el = document.getElementById(id);
    if (value == null) { el.textContent = '--'; el.className = 'card-value'; return; }
    el.textContent = (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
    el.className = 'card-value ' + (value >= 0 ? 'positive' : 'negative');
}

function updateCards(coin, global) {
    const m = coin?.market_data;
    const c = currency;
    if (!m) return;
    setText('price',          sym() + ' ' + fmtPrice(m.current_price?.[c] ?? 0));
    setText('high24h',        sym() + ' ' + fmtPrice(m.high_24h?.[c] ?? 0));
    setText('low24h',         sym() + ' ' + fmtPrice(m.low_24h?.[c] ?? 0));
    setText('volume',         sym() + ' ' + fmtLarge(m.total_volume?.[c] ?? 0));
    setText('marketcap',      sym() + ' ' + fmtLarge(m.market_cap?.[c] ?? 0));
    setText('dominance',      (global?.data?.market_cap_percentage?.[activeCoin.dominanceKey] ?? 0).toFixed(1) + '%');
    setText('last-update',    new Date().toLocaleTimeString('pt-BR'));
    setVariation('change24h', m.price_change_percentage_24h_in_currency?.[c] ?? m.price_change_percentage_24h);
    setVariation('change7d',  m.price_change_percentage_7d_in_currency?.[c]  ?? m.price_change_percentage_7d);
    setVariation('change30d', m.price_change_percentage_30d_in_currency?.[c] ?? m.price_change_percentage_30d);
    const currentPrice = m.current_price?.[c];
    const jan1Price    = jan1Prices[c];
    setVariation('changeYtd', (currentPrice != null && jan1Price)
        ? ((currentPrice - jan1Price) / jan1Price) * 100
        : null);
}

async function fetchJan1Prices(coinId) {
    const year = new Date().getFullYear();
    const data = await get(`${API}/coins/${coinId}/history?date=01-01-${year}&localization=false`);
    jan1Prices = {
        usd: data?.market_data?.current_price?.usd ?? null,
        brl: data?.market_data?.current_price?.brl ?? null,
    };
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
    const b = CONFIG.FG_BANDS;
    const c = CONFIG.FG_COLORS;
    if (v <= b[0]) return c[0];
    if (v <= b[1]) return c[1];
    if (v <= b[2]) return c[2];
    if (v <= b[3]) return c[3];
    return c[4];
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
    if (prices.length < CONFIG.MAYER_DAYS) { mayerUnavailable(); return; }
    const last200   = prices.slice(-CONFIG.MAYER_DAYS).map(p => p[1]);
    const ma200     = last200.reduce((a, b) => a + b, 0) / last200.length;
    const lastPrice = prices[prices.length - 1][1];
    const multiple  = lastPrice / ma200;

    const { low, mid, high } = activeCoin.mayer;
    let label, cls;
    if (multiple < low)        { label = 'Subvalorizado'; cls = 'sub'; }
    else if (multiple < mid)   { label = 'Abaixo MM200';  cls = 'sub'; }
    else if (multiple <= high) { label = 'Zona Normal';   cls = 'norm'; }
    else                       { label = 'Sobreaquecido'; cls = 'hot'; }

    setText('mayer-value', '×' + multiple.toFixed(2));
    setText('mayer-sub',   'MM200: $' + fmtLarge(ma200));
    const badge = document.getElementById('mayer-badge');
    badge.textContent = label;
    badge.className   = 'badge ' + cls;
}

function mayerUnavailable() {
    setText('mayer-value', 'N/D');
    setText('mayer-sub',   '--');
    const badge = document.getElementById('mayer-badge');
    badge.textContent = '--';
    badge.className   = 'badge norm';
}

// ── Halving Countdown ─────────────────────────────────────────────────────────

function updateHalving(height) {
    const remaining    = activeCoin.nextHalvingBlock - height;
    if (remaining <= 0) { halvingUnavailable(); return; }
    const blocksPerDay = 86400 / activeCoin.halvingBlockTime;
    const days         = Math.ceil(remaining / blocksPerDay);
    const estDate      = new Date(Date.now() + remaining * activeCoin.halvingBlockTime * 1000);
    const dateStr      = estDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    setText('halving-days',  days.toLocaleString('pt-BR') + ' dias');
    setText('halving-block', 'Bloco ' + height.toLocaleString('pt-BR') + ' / ' + activeCoin.nextHalvingBlock.toLocaleString('pt-BR'));
    setText('halving-date',  'Previsão: ' + dateStr);
}

function halvingUnavailable() {
    setText('halving-days',  'N/D');
    setText('halving-block', '--');
    setText('halving-date',  '--');
}

// ── Chart (Binance) ───────────────────────────────────────────────────────────

function buildChart(existing, prices, period, coin = activeCoin) {
    if (existing) { try { existing.destroy(); } catch (_) {} }
    lastPrices      = prices;
    lastChartPeriod = period;
    lastCoin        = coin;

    const days   = labelDays(period);
    const labels = prices.map(p => fmtLabel(p[0], days));
    const values = prices.map(p => p[1]);
    const { grid, tick, fill } = chartColors(coin);

    return new Chart(document.getElementById('main-chart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data: values,
                borderColor: coin.accentColor,
                backgroundColor: fill,
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
                    ticks: { color: tick, maxTicksLimit: 8, maxRotation: 0 },
                    grid:  { color: grid }
                },
                y: {
                    position: 'right',
                    ticks: { color: tick, callback: v => '$ ' + fmtLarge(v) },
                    grid:  { color: grid }
                }
            }
        }
    });
}

// ── Coin header & glossary ────────────────────────────────────────────────────

function renderGlossaryItems(items) {
    return items.map(item => `
        <details class="glossary-item">
            <summary>${item.title}</summary>
            <div class="glossary-body">${item.html}</div>
        </details>
    `).join('');
}

function updateGlossarySections() {
    document.getElementById('glossary-indicators-content').innerHTML =
        renderGlossaryItems(activeCoin.glossaryIndicators);
    document.getElementById('origin-section-title').textContent = activeCoin.originSection.title;
    document.getElementById('glossary-origin-content').innerHTML =
        renderGlossaryItems(activeCoin.originSection.items);
}

function updateDateInputMin() {
    document.getElementById('date-from').min = activeCoin.startDate;
    document.getElementById('date-to').min   = activeCoin.startDate;
}

function updateCoinHeader() {
    setText('coin-icon',       activeCoin.icon);
    setText('coin-name',       activeCoin.name);
    setText('coin-ticker',     activeCoin.symbol);
    setText('chart-note',      activeCoin.symbol + '/USD · Binance');
    setText('dominance-label', 'Dominância ' + activeCoin.symbol);
    document.getElementById('main-chart').setAttribute('aria-label', 'Gráfico de preço histórico de ' + activeCoin.name);
    document.getElementById('mvrv-link').href        = activeCoin.mvrvLink;
    document.getElementById('mvrv-link').textContent = activeCoin.mvrvLinkText;
    document.title = activeCoin.name + ' Dashboard — Polaris Global Strategies';
    document.documentElement.style.setProperty('--accent', activeCoin.accentColor);
}

function switchCoin(id) {
    activeCoin    = COINS[id];
    currency      = 'usd';
    currentPeriod = '7';
    jan1Prices    = { usd: null, brl: null };
    localStorage.setItem('btc-dashboard-coin', id);

    document.querySelectorAll('.coin-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.coin-btn[data-coin="' + id + '"]').classList.add('active');
    document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.currency-btn[data-currency="usd"]').classList.add('active');
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.period-btn[data-period="7"]').classList.add('active');
    document.getElementById('date-from').value = '';
    document.getElementById('date-to').value   = '';

    updateCoinHeader();
    updateDateInputMin();
    updateGlossarySections();
    loadAll();
}

function initCoin() {
    const saved = localStorage.getItem('btc-dashboard-coin');
    const id    = (saved && COINS[saved]) ? saved : 'bitcoin';
    activeCoin  = COINS[id];
    updateCoinHeader();
    updateDateInputMin();
    updateGlossarySections();
    document.querySelector('.coin-btn[data-coin="' + id + '"]')?.classList.add('active');
}

// ── Load functions ────────────────────────────────────────────────────────────

function setLoading(on) {
    const el = document.getElementById('loading');
    el.style.display = on ? 'block' : 'none';
    if (on) el.textContent = 'Carregando dados...';
}

function showError(msg) {
    const el = document.getElementById('loading');
    el.style.display = 'block';
    el.textContent   = msg;
}

async function loadAdvancedIndicators(gen) {
    const cardHalving = document.getElementById('card-halving');
    cardHalving.style.display = activeCoin.hasHalving ? '' : 'none';
    if (activeCoin.hasHalving) halvingUnavailable();

    try {
        const fgRes = await fetchFearGreed();
        if (gen !== loadGeneration) return;
        if (!fgRes?.data?.length) throw new Error('Dados indisponíveis');
        updateFearGreed(fgRes.data[0]);
    } catch (e) {
        if (gen !== loadGeneration) return;
        console.warn('[Dashboard] Fear & Greed indisponível:', e.message);
        fgUnavailable();
    }

    try {
        const prices = await fetchBinanceMayer();
        if (gen !== loadGeneration) return;
        updateMayer(prices);
    } catch (e) {
        if (gen !== loadGeneration) return;
        console.warn('[Dashboard] Mayer Multiple indisponível:', e.message);
        mayerUnavailable();
    }

    if (activeCoin.hasHalving) {
        try {
            const height = await fetchBlockHeight();
            if (gen !== loadGeneration) return;
            if (height != null) updateHalving(height);
            else halvingUnavailable();
        } catch (e) {
            if (gen !== loadGeneration) return;
            console.warn('[Dashboard] Halving indisponível:', e.message);
            halvingUnavailable();
        }
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
        setLoading(false);
    } catch (e) {
        console.error('[Dashboard] Erro ao carregar gráfico:', e.message);
        showError(CONFIG.ERR_CHART);
    }
}

async function loadMainChartRange(fromSec, toSec) {
    setLoading(true);
    try {
        const daysDiff = String(Math.round((toSec - fromSec) / 86400));
        const prices   = await fetchBinanceRange(fromSec, toSec);
        mainChart      = buildChart(mainChart, prices, daysDiff);
        setLoading(false);
    } catch (e) {
        console.error('[Dashboard] Erro ao carregar intervalo:', e.message);
        showError(CONFIG.ERR_CHART);
    }
}

async function loadAll() {
    const gen = ++loadGeneration;
    setLoading(true);

    const [chartResult, cardsResult] = await Promise.allSettled([
        fetchBinanceChart(currentPeriod),
        Promise.all([
            fetchCoin(),
            fetchGlobal(),
            jan1Prices.usd === null ? fetchJan1Prices(activeCoin.id) : Promise.resolve()
        ])
    ]);

    if (gen !== loadGeneration) return;

    if (chartResult.status === 'fulfilled') {
        mainChart = buildChart(mainChart, chartResult.value, currentPeriod);
        setLoading(false);
    } else {
        console.error('[Dashboard] Erro ao carregar gráfico:', chartResult.reason.message);
        showError('Não foi possível carregar dados. Verifique sua conexão e recarregue a página.');
    }

    if (cardsResult.status === 'fulfilled') {
        const [coin, global] = cardsResult.value;
        updateCards(coin, global);
    } else {
        console.warn('[Dashboard] CoinGecko indisponível:', cardsResult.reason.message);
    }

    loadAdvancedIndicators(gen);
}

// ── Events ────────────────────────────────────────────────────────────────────

document.querySelectorAll('.coin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.dataset.coin === activeCoin.id) return;
        switchCoin(btn.dataset.coin);
    });
});

document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        if (btn.classList.contains('active')) return;
        const allBtns = document.querySelectorAll('.period-btn');
        allBtns.forEach(b => { b.classList.remove('active'); b.disabled = true; });
        btn.classList.add('active');
        currentPeriod = btn.dataset.period;
        document.getElementById('date-from').value = '';
        document.getElementById('date-to').value   = '';
        try {
            await loadMainChart(currentPeriod);
        } finally {
            allBtns.forEach(b => { b.disabled = false; });
        }
    });
});

document.getElementById('btn-apply-dates').addEventListener('click', async () => {
    const fromVal = document.getElementById('date-from').value;
    const toVal   = document.getElementById('date-to').value;
    if (!fromVal || !toVal) return;

    const today = new Date().toISOString().split('T')[0];
    if (fromVal < activeCoin.startDate) {
        const startFormatted = new Date(activeCoin.startDate + 'T00:00:00').toLocaleDateString('pt-BR');
        alert('A data inicial deve ser posterior a ' + startFormatted + ' (início do histórico de ' + activeCoin.name + ' disponível).');
        return;
    }
    if (toVal > today) {
        alert('A data final não pode ser no futuro.');
        return;
    }

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

initTheme();
initCoin();
setInterval(refreshCards, CONFIG.REFRESH_MS);
loadAll();
