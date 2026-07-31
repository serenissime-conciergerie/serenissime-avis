const ACCESS_KEY = 'BzpVDCYUQLl7E1aI0qdHig';
const PROXY_BASE = 'https://hostify-proxy.boulangerjeanjacques16.workers.dev';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (key !== ACCESS_KEY) {
      return new Response('Accès refusé. URL invalide.', { status: 403 });
    }

    return new Response(HTML_PAGE, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};

const HTML_PAGE = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sérénissime — Suivi des avis voyageurs</title>
<style>
  :root {
    --bordeaux: #8D1733;
    --beige: #E7D8B5;
    --bordeaux-dark: #6d1227;
    --gray-bg: #f7f5f2;
    --text: #2a2a2a;
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
    background: var(--gray-bg);
    color: var(--text);
    margin: 0;
    padding: 0;
  }
  header {
    background: var(--bordeaux);
    color: white;
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  header h1 { margin: 0; font-size: 1.4em; font-weight: 600; }
  header .subtitle { font-size: 0.85em; opacity: 0.85; margin-top: 4px; }
  .controls {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  .controls label { font-size: 0.85em; color: white; }
  .controls input[type=date], .controls select {
    padding: 6px 10px;
    border-radius: 6px;
    border: none;
    font-size: 0.9em;
  }
  .controls button {
    background: var(--beige);
    color: var(--bordeaux-dark);
    border: none;
    padding: 7px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9em;
  }
  .controls button:hover { opacity: 0.9; }
  main { padding: 24px 32px; max-width: 1100px; margin: 0 auto; }
  #loading { text-align: center; padding: 60px; color: #888; }
  #globalStats {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .stat-card {
    background: white;
    border-radius: 10px;
    padding: 16px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    flex: 1;
    min-width: 140px;
  }
  .stat-card .value { font-size: 1.8em; font-weight: 700; color: var(--bordeaux); }
  .stat-card .label { font-size: 0.8em; color: #777; margin-top: 2px; }
  .property {
    background: white;
    border-radius: 10px;
    margin-bottom: 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    overflow: hidden;
  }
  .property-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    cursor: pointer;
    user-select: none;
  }
  .property-header:hover { background: var(--gray-bg); }
  .property-name { font-weight: 600; font-size: 1.05em; }
  .property-meta { display: flex; gap: 20px; align-items: center; }
  .badge-note {
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.95em;
    color: white;
  }
  .note-excellent { background: #2e7d32; }
  .note-bonne { background: #558b2f; }
  .note-moyenne { background: #e09b1a; }
  .note-faible { background: var(--bordeaux); }
  .nb-avis { color: #888; font-size: 0.85em; }
  .chevron { transition: transform 0.2s; color: #aaa; }
  .chevron.open { transform: rotate(90deg); }
  .stays-table {
    width: 100%;
    border-collapse: collapse;
    display: none;
  }
  .stays-table.open { display: table; }
  .stays-table th {
    background: var(--beige);
    color: var(--bordeaux-dark);
    text-align: left;
    padding: 8px 12px;
    font-size: 0.78em;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .stays-table td {
    padding: 9px 12px;
    border-top: 1px solid #eee;
    font-size: 0.88em;
    vertical-align: top;
  }
  .stays-table tr:hover td { background: #fafafa; }
  .source-tag {
    font-size: 0.72em;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 600;
  }
  .source-airbnb { background: #ffe4e9; color: #c81e5f; }
  .source-booking { background: #dceefb; color: #003b95; }
  .comment-row td {
    background: var(--gray-bg);
    font-style: italic;
    color: #555;
    padding: 10px 16px;
    border-top: none;
    font-size: 0.85em;
  }
  .comment-row td b { color: var(--bordeaux-dark); font-style: normal; }
  .stay-row:not(:first-child) td { border-top: 2px solid #f0f0f0; }
  .property-meta .source-tag { font-size: 0.78em; padding: 4px 10px; }
  .stays-table td:nth-child(4), .stays-table td:nth-child(5),
  .stays-table td:nth-child(6), .stays-table td:nth-child(7),
  .stays-table td:nth-child(8) { text-align: center; color: #555; }
  #error { color: var(--bordeaux); text-align: center; padding: 40px; }
</style>
</head>
<body>

<header>
  <div>
    <h1>🏡 Sérénissime — Suivi des avis voyageurs</h1>
    <div class="subtitle" id="periodLabel">Chargement...</div>
  </div>
  <div class="controls">
    <label>Du</label>
    <input type="date" id="dateFrom">
    <label>au</label>
    <input type="date" id="dateTo">
    <button onclick="loadData()">Actualiser</button>
  </div>
</header>

<main>
  <div id="loading">Chargement des avis…</div>
  <div id="error" style="display:none;"></div>
  <div id="content" style="display:none;">
    <div id="globalStats"></div>
    <div id="properties"></div>
  </div>
</main>

<script>
const PROXY_BASE = '${PROXY_BASE}';

function currentYearRange() {
  const y = new Date().getFullYear();
  return { from: y + '-01-01', to: y + '-12-31' };
}

function noteClass(note) {
  if (note >= 4.7) return 'note-excellent';
  if (note >= 4.3) return 'note-bonne';
  if (note >= 3.8) return 'note-moyenne';
  return 'note-faible';
}

function normalizeNote(rating) {
  return rating > 5 ? +(rating / 2).toFixed(2) : rating;
}

async function loadData() {
  const from = document.getElementById('dateFrom').value;
  const to = document.getElementById('dateTo').value;
  document.getElementById('loading').style.display = 'block';
  document.getElementById('content').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('periodLabel').textContent = 'Période : ' + from + ' → ' + to;

  try {
    const [listData, revData] = await Promise.all([
      fetch(PROXY_BASE + '/listings').then(r => r.json()),
      fetch(PROXY_BASE + '/reviews?created_from=' + from + '&created_to=' + to).then(r => r.json())
    ]);

    const idToName = {};
    (listData.listings || []).forEach(l => { idToName[l.id] = l.nickname || l.name; });

    const byProperty = {};
    (revData.reviews || []).forEach(r => {
      const name = idToName[r.listing_id]
        || idToName[r.parent_listing_id]
        || ('Listing ' + r.listing_id + ' (non identifié)');
      if (!byProperty[name]) byProperty[name] = [];
      byProperty[name].push(r);
    });

    renderGlobalStats(revData.reviews || []);
    renderProperties(byProperty);

    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  } catch (e) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.getElementById('error').textContent = 'Erreur de chargement : ' + e.message;
  }
}

function renderGlobalStats(reviews) {
  const total = reviews.length;
  const avg = total ? (reviews.reduce((s, r) => s + normalizeNote(r.rating), 0) / total).toFixed(2) : '—';
  const airbnb = reviews.filter(r => r.rating <= 5);
  const booking = reviews.filter(r => r.rating > 5);
  const avgAirbnb = airbnb.length ? (airbnb.reduce((s, r) => s + normalizeNote(r.rating), 0) / airbnb.length).toFixed(2) : '—';
  const avgBooking = booking.length ? (booking.reduce((s, r) => s + normalizeNote(r.rating), 0) / booking.length).toFixed(2) : '—';
  const el = document.getElementById('globalStats');
  el.innerHTML = \`
    <div class="stat-card"><div class="value">\${total}</div><div class="label">Avis sur la période</div></div>
    <div class="stat-card"><div class="value">\${avg}</div><div class="label">Note moyenne globale /5</div></div>
    <div class="stat-card"><div class="value">\${avgAirbnb}</div><div class="label">Airbnb (\${airbnb.length} avis)</div></div>
    <div class="stat-card"><div class="value">\${avgBooking}</div><div class="label">Booking.com (\${booking.length} avis)</div></div>
  \`;
}

function renderProperties(byProperty) {
  const el = document.getElementById('properties');
  const entries = Object.entries(byProperty).map(([name, reviews]) => {
    const avg = reviews.reduce((s, r) => s + normalizeNote(r.rating), 0) / reviews.length;
    const airbnb = reviews.filter(r => r.rating <= 5);
    const booking = reviews.filter(r => r.rating > 5);
    const avgAirbnb = airbnb.length ? airbnb.reduce((s, r) => s + normalizeNote(r.rating), 0) / airbnb.length : null;
    const avgBooking = booking.length ? booking.reduce((s, r) => s + normalizeNote(r.rating), 0) / booking.length : null;
    return { name, reviews, avg, avgAirbnb, avgBooking, nbAirbnb: airbnb.length, nbBooking: booking.length };
  }).sort((a, b) => b.avg - a.avg);

  el.innerHTML = entries.map((p, idx) => {
    const rows = p.reviews
      .sort((a, b) => (b.created || '').localeCompare(a.created || ''))
      .map(r => {
        const source = r.rating > 5 ? 'booking' : 'airbnb';
        const sourceLabel = source === 'booking' ? 'Booking.com' : 'Airbnb';
        const note = normalizeNote(r.rating);
        const cell = v => (v != null ? normalizeNote(v) : '—');
        const commentRow = r.comments
          ? \`<tr class="comment-row"><td colspan="8"><b>Commentaire :</b> \${r.comments}</td></tr>\`
          : '';
        return \`<tr class="stay-row">
          <td>\${(r.created || '').substring(0,10)}</td>
          <td><span class="source-tag source-\${source}">\${sourceLabel}</span></td>
          <td><b>\${note}</b>/5</td>
          <td>\${cell(r.clean_rating)}</td>
          <td>\${cell(r.communication_rating)}</td>
          <td>\${cell(r.location_rating)}</td>
          <td>\${cell(r.value_rating)}</td>
          <td>\${cell(r.checkin_rating)}</td>
        </tr>\${commentRow}\`;
      }).join('');

    const subBadges = \`
      \${p.avgAirbnb != null ? \`<span class="source-tag source-airbnb">Airbnb \${p.avgAirbnb.toFixed(2)} (\${p.nbAirbnb})</span>\` : ''}
      \${p.avgBooking != null ? \`<span class="source-tag source-booking">Booking \${p.avgBooking.toFixed(2)} (\${p.nbBooking})</span>\` : ''}
    \`;

    return \`
      <div class="property">
        <div class="property-header" onclick="toggleProperty(\${idx})">
          <div class="property-name">\${p.name}</div>
          <div class="property-meta">
            \${subBadges}
            <span class="nb-avis">\${p.reviews.length} avis</span>
            <span class="badge-note \${noteClass(p.avg)}">\${p.avg.toFixed(2)} / 5</span>
            <span class="chevron" id="chevron-\${idx}">▶</span>
          </div>
        </div>
        <table class="stays-table" id="table-\${idx}">
          <thead><tr><th>Date</th><th>Plateforme</th><th>Note</th><th>Propreté</th><th>Communication</th><th>Emplacement</th><th>Valeur</th><th>Enregist.</th></tr></thead>
          <tbody>\${rows}</tbody>
        </table>
      </div>
    \`;
  }).join('');
}

function toggleProperty(idx) {
  document.getElementById('table-' + idx).classList.toggle('open');
  document.getElementById('chevron-' + idx).classList.toggle('open');
}

// Init
const { from, to } = currentYearRange();
document.getElementById('dateFrom').value = from;
document.getElementById('dateTo').value = to;
loadData();
</script>
</body>
</html>`;
