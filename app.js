(() => {
  'use strict';

  /* ---------- Konstanten ---------- */
  const STORE_KEY = 'momente.v1';
  const LANGS = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'bs', name: 'Bosanski', flag: '🇧🇦' }
  ];
  const LOCALES = { de: 'de-DE', tr: 'tr-TR', en: 'en-GB', bs: 'bs-BA' };
  const MOODS = [1, 2, 3, 4, 5];
  const MOOD_EMOJI = { 1: '😢', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };
  const TAGS = ['family', 'friends', 'work', 'school', 'idea', 'health', 'nature', 'gratitude'];
  const TAG_EMOJI = { family: '🏡', friends: '🤝', work: '💼', school: '📚', idea: '💡', health: '💪', nature: '🌳', gratitude: '🙏' };
  const VIEWS = ['today', 'review', 'calendar', 'settings'];
  const REVIEW_FIELDS = ['best', 'grateful', 'different', 'intention'];
  const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ICONS = {
    today: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    review: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'),
    calendar: svg('<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    settings: svg('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>')
  };
  const LOGO = `
    <svg class="logo" viewBox="0 0 120 120" aria-hidden="true">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a76"/><stop offset="1" stop-color="#8a6cf0"/></linearGradient></defs>
      <circle class="logo-glow" cx="60" cy="60" r="44" fill="url(#lg)"/>
      <g class="logo-orbit"><circle cx="60" cy="9" r="5" fill="#ffd27a"/></g>
      <path class="logo-spark" fill="#fff" d="M60 32C62 51 69 58 88 60 69 62 62 69 60 88 58 69 51 62 32 60 51 58 58 51 60 32Z"/>
    </svg>`;

  /* ---------- Hilfsfunktionen ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dateOf = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const todayKey = () => keyOf(new Date());
  const addDays = (k, n) => { const d = dateOf(k); d.setDate(d.getDate() + n); return keyOf(d); };
  const shiftMonths = (k, n) => { const d = dateOf(k); const day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n); const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return keyOf(d); };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Zustand ---------- */
  const defaultState = () => ({ settings: { lang: null, theme: 'auto', young: false, name: '' }, days: {} });
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        return { settings: { ...defaultState().settings, ...(s.settings || {}) }, days: s.days || {} };
      }
    } catch (e) { /* leer starten */ }
    return defaultState();
  }
  let state = load();
  let saveTimer = null;
  function persist(now = true) {
    const write = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { toast(t('storageError')); } };
    clearTimeout(saveTimer);
    if (now) write(); else saveTimer = setTimeout(write, 350);
  }

  const detectLang = () => {
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if (nav === 'hr' || nav === 'sr') return 'bs';
    return LANGS.some(l => l.code === nav) ? nav : 'en';
  };

  const ui = {
    view: 'today',
    date: todayKey(),
    lastToday: todayKey(),
    draft: { text: '', mood: null, tags: [] },
    calMonth: (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); })(),
    onbLang: detectLang(),
    justAdded: null
  };

  /* ---------- i18n ---------- */
  const lang = () => state.settings.lang || ui.onbLang || 'en';
  function t(key, ...args) {
    const dict = I18N[lang()] || I18N.en;
    const v = dict[key] ?? I18N.en[key] ?? key;
    return typeof v === 'function' ? v(...args) : v;
  }
  const tq = key => (state.settings.young && I18N[lang()]['y_' + key]) ? t('y_' + key) : t(key);
  // Bosnisch: nicht jeder Browser hat Kalenderdaten für "bs" → eigene Namen als Rückfall
  const BS_SUPPORTED = (() => { try { return Intl.DateTimeFormat.supportedLocalesOf(['bs-BA']).length > 0 && new Intl.DateTimeFormat('bs-BA', { month: 'long' }).format(new Date(2024, 10, 1)).toLowerCase().includes('nov'); } catch (e) { return false; } })();
  const BS_MONTHS = ['januar', 'februar', 'mart', 'april', 'maj', 'juni', 'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar'];
  const BS_DAYS = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'];
  const BS_NARROW = ['N', 'P', 'U', 'S', 'Č', 'P', 'S'];
  function fmtBs(d, o) {
    if (o.hour) return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    if (o.weekday === 'narrow') return BS_NARROW[d.getDay()];
    const parts = [];
    if (o.weekday) parts.push(BS_DAYS[d.getDay()] + (o.day || o.month ? ',' : ''));
    if (o.day) parts.push(d.getDate() + '.');
    if (o.month) parts.push(o.month === 'short' ? BS_MONTHS[d.getMonth()].slice(0, 3) : BS_MONTHS[d.getMonth()]);
    if (o.year) parts.push(d.getFullYear() + '.');
    return parts.join(' ');
  }
  const fmt = (d, opts) => (lang() === 'bs' && !BS_SUPPORTED)
    ? fmtBs(d, opts)
    : new Intl.DateTimeFormat(LOCALES[lang()] || 'en-GB', opts).format(d);
  const fmtTime = ts => fmt(new Date(ts), { hour: '2-digit', minute: '2-digit' });

  function greeting() {
    const h = new Date().getHours();
    if (h < 5) return t('greetNight');
    if (h < 12) return t('greetMorning');
    if (h < 18) return t('greetDay');
    if (h < 22) return t('greetEvening');
    return t('greetNight');
  }
  function spark() {
    const list = t('sparks');
    const d = new Date();
    const doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
    return list[doy % list.length];
  }

  /* ---------- Datenzugriff ---------- */
  const day = k => state.days[k];
  const ensureDay = k => (state.days[k] ||= { moments: [], review: null });
  const reviewFilled = r => !!r && (r.savedAt || r.rating || r.word || REVIEW_FIELDS.some(f => (r[f] || '').trim()));
  const hasContent = k => { const d = day(k); return !!d && (d.moments.length > 0 || reviewFilled(d.review)); };
  function cleanup(k) { const d = day(k); if (d && !d.moments.length && !reviewFilled(d.review)) delete state.days[k]; }
  function dayMood(k) {
    const d = day(k); if (!d) return 0;
    const ms = d.moments.filter(m => m.mood).map(m => m.mood);
    if (ms.length) return Math.round(ms.reduce((a, b) => a + b, 0) / ms.length);
    return d.review?.rating || 0;
  }
  function streak() {
    let k = todayKey(), n = 0;
    if (!hasContent(k)) k = addDays(k, -1);
    while (hasContent(k)) { n++; k = addDays(k, -1); }
    return n;
  }

  /* ---------- Gemeinsame Bausteine ---------- */
  function dayNav(k) {
    const isToday = k === todayKey();
    return `
      <div class="daynav">
        <button class="icon-btn" data-action="prev-day" aria-label="${esc(t('prevDay'))}">‹</button>
        <span class="daynav-date">${esc(fmt(dateOf(k), { day: 'numeric', month: 'short', year: 'numeric' }))}</span>
        <button class="icon-btn" data-action="next-day" aria-label="${esc(t('nextDay'))}" ${isToday ? 'disabled' : ''}>›</button>
        ${isToday ? '' : `<button class="pill" data-action="go-today">${esc(t('backToday'))}</button>`}
      </div>`;
  }
  const highlightTags = html => html.replace(/(^|\s)(#[\p{L}\p{N}_-]+)/gu, '$1<span class="hash">$2</span>');

  /* ---------- Ansicht: Heute ---------- */
  function memoryCard(k) {
    for (const [label, key] of [[t('agoYear'), shiftMonths(k, -12)], [t('agoMonth'), shiftMonths(k, -1)]]) {
      const d = day(key);
      const m = d?.moments.find(x => x.text);
      if (m) {
        return `
          <button class="card memory" data-action="open-day" data-k="${key}">
            <span class="memory-label">🕰️ ${esc(t('memory'))} · ${esc(label)}</span>
            <span class="memory-text">${m.mood ? MOOD_EMOJI[m.mood] + ' ' : ''}${esc(m.text.length > 120 ? m.text.slice(0, 120) + '…' : m.text)}</span>
          </button>`;
      }
    }
    return '';
  }

  function momentItem(m, i) {
    const tags = (m.tags || []).map(tag => `<span class="chip mini">${TAG_EMOJI[tag] || ''} ${esc(t('tag_' + tag))}</span>`).join('');
    return `
      <li class="moment ${ui.justAdded === m.id ? 'pop' : ''}" data-id="${m.id}" style="--i:${i}">
        <div class="m-dot" style="--c:var(--mood-${m.mood || 0})" title="${m.mood ? esc(t('mood' + m.mood)) : ''}">${m.mood ? MOOD_EMOJI[m.mood] : '✦'}</div>
        <div class="m-body">
          <div class="m-meta">
            <time>${esc(fmtTime(m.time))}</time>
            <button class="icon-btn small ghost" data-action="delete-moment" data-id="${m.id}" aria-label="${esc(t('delete'))}">×</button>
          </div>
          ${m.text ? `<p class="m-text">${highlightTags(esc(m.text))}</p>` : ''}
          ${tags ? `<div class="m-tags">${tags}</div>` : ''}
        </div>
      </li>`;
  }

  function renderToday() {
    const k = ui.date, isToday = k === todayKey();
    const d = day(k);
    const moments = d ? [...d.moments].sort((a, b) => b.time - a.time) : [];
    const name = state.settings.name.trim();
    const title = isToday
      ? `${esc(greeting())}${name ? `, <span class="grad">${esc(name)}</span>` : ''}`
      : esc(fmt(dateOf(k), { weekday: 'long' }));
    return `
      <header class="hero">
        <p class="eyebrow">${esc(fmt(dateOf(k), { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
        <h1 class="title">${title}</h1>
        ${isToday ? `<p class="spark"><span class="spark-label">💭 ${esc(t('sparkLabel'))}</span><span>${esc(spark())}</span></p>` : ''}
      </header>
      ${dayNav(k)}
      <section class="card composer" id="composer">
        <textarea id="moment-text" rows="3" placeholder="${esc(tq('placeholder'))}" aria-label="${esc(t('placeholder'))}">${esc(ui.draft.text)}</textarea>
        <div class="composer-row">
          <span class="label">${esc(t('howFeel'))}</span>
          <div class="moods" role="radiogroup" aria-label="${esc(t('howFeel'))}">
            ${MOODS.map(v => `<button class="mood ${ui.draft.mood === v ? 'on' : ''}" data-action="pick-mood" data-v="${v}" role="radio" aria-checked="${ui.draft.mood === v}" title="${esc(t('mood' + v))}" aria-label="${esc(t('mood' + v))}">${MOOD_EMOJI[v]}</button>`).join('')}
          </div>
        </div>
        <div class="tags">
          ${TAGS.map(tag => `<button class="chip ${ui.draft.tags.includes(tag) ? 'on' : ''}" data-action="toggle-tag" data-tag="${tag}" aria-pressed="${ui.draft.tags.includes(tag)}">${TAG_EMOJI[tag]} ${esc(t('tag_' + tag))}</button>`).join('')}
        </div>
        <button class="btn primary" data-action="save-moment">✨ ${esc(t('save'))}</button>
      </section>
      ${memoryCard(k)}
      <h2 class="section-title">${esc(t('momentsCount', moments.length))}</h2>
      ${moments.length
        ? `<ol class="timeline">${moments.map(momentItem).join('')}</ol>`
        : `<div class="empty"><div class="empty-orb">🌱</div><p>${esc(isToday ? t('emptyDay') : t('emptyPast'))}</p></div>`}
    `;
  }

  /* ---------- Ansicht: Rückblick ---------- */
  function renderReview() {
    const k = ui.date;
    const d = day(k);
    const r = d?.review || {};
    const moments = d ? [...d.moments].sort((a, b) => a.time - b.time) : [];
    const field = f => `
      <label class="field">
        <span class="field-label">${esc(tq(f))}</span>
        <textarea rows="2" data-field="${f}" placeholder="${esc(t('fieldPlaceholder'))}">${esc(r[f] || '')}</textarea>
      </label>`;
    return `
      <header class="hero">
        <p class="eyebrow">${esc(fmt(dateOf(k), { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
        <h1 class="title">${esc(t('reviewTitle'))}</h1>
        <p class="sub">${esc(t('reviewIntro'))}</p>
      </header>
      ${dayNav(k)}
      ${moments.length ? `
        <section class="card">
          <h2 class="h2">${esc(t('todaysMoments'))}</h2>
          <div class="strip">
            ${moments.map(m => `
              <div class="mini-moment" style="--c:var(--mood-${m.mood || 0})">
                <span class="mini-emoji">${m.mood ? MOOD_EMOJI[m.mood] : '✦'}</span>
                <small>${esc(fmtTime(m.time))}</small>
                <p>${esc((m.text || '').length > 70 ? m.text.slice(0, 70) + '…' : (m.text || ''))}</p>
              </div>`).join('')}
          </div>
        </section>` : ''}
      <section class="card">
        <h2 class="h2">${esc(t('rating'))}</h2>
        <div class="stars" role="radiogroup" aria-label="${esc(t('rating'))}">
          ${[1, 2, 3, 4, 5].map(v => `<button class="star ${(r.rating || 0) >= v ? 'on' : ''}" data-action="rate" data-v="${v}" role="radio" aria-checked="${r.rating === v}" aria-label="${v}/5">★</button>`).join('')}
        </div>
      </section>
      <section class="card form">
        ${REVIEW_FIELDS.map(field).join('')}
        <label class="field">
          <span class="field-label">${esc(t('word'))}</span>
          <input type="text" data-field="word" maxlength="40" placeholder="${esc(t('wordPlaceholder'))}" value="${esc(r.word || '')}">
        </label>
      </section>
      <button class="btn primary big" data-action="save-review">🌙 ${esc(t('saveReview'))}</button>
      ${r.savedAt ? `<p class="done-note">✓ ${esc(t('reviewDone'))} · ${esc(fmtTime(r.savedAt))}</p>` : ''}
    `;
  }

  /* ---------- Ansicht: Kalender ---------- */
  function renderCalendar() {
    const m = ui.calMonth;
    const total = Object.values(state.days).reduce((a, d) => a + d.moments.length, 0);
    const written = Object.keys(state.days).filter(hasContent).length;
    const first = new Date(m.getFullYear(), m.getMonth(), 1);
    const daysIn = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const offset = (first.getDay() + 6) % 7; // Montag zuerst
    const tk = todayKey();
    const heads = Array.from({ length: 7 }, (_, i) => fmt(new Date(2024, 0, 1 + i), { weekday: 'narrow' }));
    let cells = heads.map(h => `<span class="wd">${esc(h)}</span>`).join('');
    cells += '<span></span>'.repeat(offset);
    for (let dnum = 1; dnum <= daysIn; dnum++) {
      const k = keyOf(new Date(m.getFullYear(), m.getMonth(), dnum));
      const has = hasContent(k);
      const mood = dayMood(k);
      const future = k > tk;
      cells += `
        <button class="cday ${has ? 'has' : ''} ${k === tk ? 'today' : ''}" data-action="open-day" data-k="${k}" ${future ? 'disabled' : ''}
          style="--c:var(--mood-${mood}); --i:${dnum}" aria-label="${esc(fmt(dateOf(k), { day: 'numeric', month: 'long' }))}">
          <span>${dnum}</span>${day(k)?.review?.savedAt ? '<i class="rdot" aria-hidden="true"></i>' : ''}
        </button>`;
    }
    const nowMonth = new Date(); const atCurrent = m.getFullYear() === nowMonth.getFullYear() && m.getMonth() === nowMonth.getMonth();
    return `
      <header class="hero">
        <p class="eyebrow">${esc(t('calendar'))}</p>
        <h1 class="title">${esc(fmt(m, { month: 'long', year: 'numeric' }))}</h1>
      </header>
      <section class="stats">
        <div class="stat"><span class="stat-num" data-count="${streak()}">0</span><span class="stat-label">🔥 ${esc(t('streak'))}</span></div>
        <div class="stat"><span class="stat-num" data-count="${total}">0</span><span class="stat-label">✨ ${esc(t('totalMoments'))}</span></div>
        <div class="stat"><span class="stat-num" data-count="${written}">0</span><span class="stat-label">📖 ${esc(t('daysWritten'))}</span></div>
      </section>
      <section class="card cal">
        <div class="cal-head">
          <button class="icon-btn" data-action="prev-month" aria-label="${esc(t('prevMonth'))}">‹</button>
          <strong>${esc(fmt(m, { month: 'long', year: 'numeric' }))}</strong>
          <button class="icon-btn" data-action="next-month" aria-label="${esc(t('nextMonth'))}" ${atCurrent ? 'disabled' : ''}>›</button>
        </div>
        <div class="cal-grid">${cells}</div>
        <div class="legend"><span>${esc(t('moodLegend'))}</span>${MOODS.map(v => `<i style="--c:var(--mood-${v})" title="${esc(t('mood' + v))}">${MOOD_EMOJI[v]}</i>`).join('')}</div>
      </section>
      <section class="card">
        <input type="search" id="search" class="search" placeholder="🔍 ${esc(t('search'))}" aria-label="${esc(t('search'))}">
        <ul class="results" id="results"></ul>
      </section>
    `;
  }

  function runSearch(q) {
    const box = $('#results'); if (!box) return;
    q = q.trim().toLocaleLowerCase();
    if (!q) { box.innerHTML = ''; return; }
    const hits = [];
    for (const k of Object.keys(state.days).sort().reverse()) {
      const d = state.days[k];
      for (const m of d.moments) if ((m.text || '').toLocaleLowerCase().includes(q)) hits.push({ k, text: m.text, mood: m.mood });
      if (d.review) for (const f of [...REVIEW_FIELDS, 'word']) {
        const v = d.review[f] || '';
        if (v.toLocaleLowerCase().includes(q)) hits.push({ k, text: v, mood: 0, review: true });
      }
      if (hits.length >= 40) break;
    }
    if (!hits.length) { box.innerHTML = `<li class="muted">${esc(t('noResults'))}</li>`; return; }
    const mark = s => {
      const i = s.toLocaleLowerCase().indexOf(q);
      const start = Math.max(0, i - 40);
      const snip = (start ? '…' : '') + s.slice(start, i + q.length + 80);
      const j = snip.toLocaleLowerCase().indexOf(q);
      return esc(snip.slice(0, j)) + '<mark>' + esc(snip.slice(j, j + q.length)) + '</mark>' + esc(snip.slice(j + q.length));
    };
    box.innerHTML = hits.map((h, i) => `
      <li style="--i:${i}"><button class="result" data-action="open-day" data-k="${h.k}">
        <span class="result-date">${h.review ? '🌙' : (h.mood ? MOOD_EMOJI[h.mood] : '✦')} ${esc(fmt(dateOf(h.k), { day: 'numeric', month: 'short', year: 'numeric' }))}</span>
        <span class="result-text">${mark(h.text)}</span>
      </button></li>`).join('');
  }

  /* ---------- Ansicht: Einstellungen ---------- */
  const langCards = (action, current) => LANGS.map(l => `
    <button class="lang ${current === l.code ? 'on' : ''}" data-action="${action}" data-lang="${l.code}" aria-pressed="${current === l.code}" lang="${l.code}">
      <span class="flag">${l.flag}</span>
      <span class="lang-name">${l.name}</span>
      <span class="lang-check" aria-hidden="true">✓</span>
    </button>`).join('');

  function renderSettings() {
    const s = state.settings;
    return `
      <header class="hero">
        <p class="eyebrow">Momente</p>
        <h1 class="title">${esc(t('settings'))}</h1>
      </header>
      <section class="card">
        <h2 class="h2">🌍 ${esc(t('language'))}</h2>
        <div class="langs">${langCards('set-lang', s.lang)}</div>
      </section>
      <section class="card">
        <h2 class="h2">🎨 ${esc(t('appearance'))}</h2>
        <div class="seg" role="radiogroup">
          ${['auto', 'light', 'dark'].map(th => `<button class="${s.theme === th ? 'on' : ''}" data-action="set-theme" data-theme="${th}" role="radio" aria-checked="${s.theme === th}">${{ auto: '🌗', light: '☀️', dark: '🌙' }[th]} ${esc(t('theme' + th[0].toUpperCase() + th.slice(1)))}</button>`).join('')}
        </div>
      </section>
      <section class="card">
        <h2 class="h2">👤 ${esc(t('profile'))}</h2>
        <label class="field">
          <span class="field-label">${esc(t('nameLabel'))}</span>
          <input type="text" id="name-input" maxlength="30" value="${esc(s.name)}" autocomplete="given-name">
        </label>
        <label class="switch-row">
          <span><strong>🧒 ${esc(t('youngMode'))}</strong><small>${esc(t('youngDesc'))}</small></span>
          <input type="checkbox" class="switch" id="young-toggle" ${s.young ? 'checked' : ''}>
        </label>
      </section>
      <section class="card">
        <h2 class="h2">🔒 ${esc(t('data'))}</h2>
        <p class="muted">${esc(t('privacy'))}</p>
        <div class="btn-row">
          <button class="btn soft" data-action="export">⬇️ ${esc(t('export'))}</button>
          <button class="btn soft" data-action="import">⬆️ ${esc(t('import'))}</button>
        </div>
        <input type="file" id="import-file" accept="application/json,.json" hidden>
        <button class="btn danger" data-action="wipe">🗑️ ${esc(t('wipe'))}</button>
      </section>
      <p class="muted center small">📱 ${esc(t('installTip'))}</p>
      <p class="muted center small">Momente · v1.0</p>
    `;
  }

  /* ---------- Onboarding ---------- */
  function renderOnboarding() {
    const el = $('#onboarding');
    const nameVal = $('#onb-name')?.value ?? '';
    el.innerHTML = `
      <div class="onb" lang="${ui.onbLang}">
        <div class="onb-card">
          ${LOGO}
          <h1 class="onb-title">Momente</h1>
          <p class="onb-tagline">${esc(t('tagline'))}</p>
          <p class="label">${esc(t('chooseLang'))}</p>
          <div class="langs">${langCards('onb-lang', ui.onbLang)}</div>
          <input id="onb-name" class="onb-input" type="text" maxlength="30" placeholder="${esc(t('yourName'))}" value="${esc(nameVal)}" autocomplete="given-name">
          <button class="btn primary big" data-action="onb-start">${esc(t('start'))} →</button>
        </div>
      </div>`;
  }

  /* ---------- Rendering ---------- */
  function buildNav() {
    $('#nav').innerHTML = `<span class="nav-ind" aria-hidden="true"></span>` +
      VIEWS.map(v => `<button class="nav-btn" data-action="nav" data-v="${v}">${ICONS[v]}<span class="nav-label"></span></button>`).join('');
  }
  function updateNav() {
    const idx = VIEWS.indexOf(ui.view);
    $('#nav').style.setProperty('--idx', idx);
    $$('.nav-btn').forEach(b => {
      const on = b.dataset.v === ui.view;
      b.classList.toggle('on', on);
      on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
      $('.nav-label', b).textContent = t(b.dataset.v);
    });
  }

  function render({ anim = true } = {}) {
    const html = { today: renderToday, review: renderReview, calendar: renderCalendar, settings: renderSettings }[ui.view]();
    $('#app').innerHTML = `<div class="view ${anim ? 'enter' : ''}">${html}</div>`;
    document.documentElement.lang = lang();
    document.title = `Momente · ${t(ui.view)}`;
    updateNav();
    ui.justAdded = null;
    $$('textarea').forEach(autosize);
    if (ui.view === 'calendar') countUp(anim);
    if (anim) window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' });
  }

  function go(view) {
    if (view === ui.view) return;
    ui.view = view;
    render();
  }

  /* ---------- Effekte ---------- */
  function autosize(el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }

  function countUp(anim) {
    $$('.stat-num').forEach(el => {
      const to = Number(el.dataset.count);
      if (!anim || prefersReduced() || to === 0) { el.textContent = to; return; }
      const t0 = performance.now(), dur = 900;
      const step = now => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function burst(target, symbols = ['✨', '💛', '⭐', '🌸', '✦']) {
    if (prefersReduced() || !target) return;
    const r = target.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.textContent = symbols[i % symbols.length];
      const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const dist = 70 + Math.random() * 70;
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(ang) * dist - 40 + 'px');
      p.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }

  function celebrate(text) {
    const el = document.createElement('div');
    el.className = 'celebrate';
    const stars = Array.from({ length: 18 }, () =>
      `<i style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${(Math.random() * 1.2).toFixed(2)}s">✦</i>`).join('');
    el.innerHTML = `<div class="cel-stars">${stars}</div><div class="cel-moon">🌙</div><p class="cel-text">${esc(text)}</p>`;
    document.body.appendChild(el);
    const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 500); };
    el.addEventListener('click', close);
    setTimeout(close, prefersReduced() ? 1400 : 2400);
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function shake(el) { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

  /* ---------- Theme ---------- */
  function applyTheme() {
    const th = state.settings.theme;
    if (th === 'auto') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = th;
    const dark = th === 'dark' || (th === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    $('meta[name="theme-color"]').setAttribute('content', dark ? '#17131d' : '#fbf5ee');
  }

  /* ---------- Aktionen ---------- */
  const actions = {
    nav: el => go(el.dataset.v),
    'prev-day': () => { ui.date = addDays(ui.date, -1); render(); },
    'next-day': () => { if (ui.date < todayKey()) { ui.date = addDays(ui.date, 1); render(); } },
    'go-today': () => { ui.date = todayKey(); render(); },
    'open-day': el => { ui.date = el.dataset.k; ui.view = 'today'; render(); },

    'pick-mood': el => {
      const v = Number(el.dataset.v);
      ui.draft.mood = ui.draft.mood === v ? null : v;
      $$('.mood').forEach(b => {
        const on = Number(b.dataset.v) === ui.draft.mood;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', on);
      });
    },
    'toggle-tag': el => {
      const tag = el.dataset.tag;
      const i = ui.draft.tags.indexOf(tag);
      i >= 0 ? ui.draft.tags.splice(i, 1) : ui.draft.tags.push(tag);
      el.classList.toggle('on', i < 0);
      el.setAttribute('aria-pressed', i < 0);
    },
    'save-moment': el => {
      const text = ($('#moment-text')?.value || '').trim();
      if (!text && !ui.draft.mood) { shake($('#composer')); toast(t('writeSomething')); return; }
      const now = new Date();
      let time = now.getTime();
      if (ui.date !== todayKey()) { const d = dateOf(ui.date); d.setHours(now.getHours(), now.getMinutes()); time = d.getTime(); }
      const m = { id: uid(), time, text, mood: ui.draft.mood, tags: [...ui.draft.tags] };
      ensureDay(ui.date).moments.push(m);
      persist();
      burst(el);
      ui.draft = { text: '', mood: null, tags: [] };
      ui.justAdded = m.id;
      render({ anim: false });
      toast(t('saved'));
    },
    'delete-moment': el => {
      if (!confirm(t('confirmDelete'))) return;
      const id = el.dataset.id;
      const li = el.closest('.moment');
      const finish = () => {
        const d = day(ui.date);
        if (d) { d.moments = d.moments.filter(m => m.id !== id); cleanup(ui.date); persist(); }
        render({ anim: false });
      };
      if (li && !prefersReduced()) { li.classList.add('leaving'); setTimeout(finish, 380); } else finish();
    },

    rate: el => {
      const v = Number(el.dataset.v);
      const d = ensureDay(ui.date);
      d.review = { ...(d.review || {}), rating: v };
      persist();
      $$('.star').forEach(s => {
        const sv = Number(s.dataset.v);
        s.classList.toggle('on', sv <= v);
        s.setAttribute('aria-checked', sv === v);
        s.classList.remove('bump');
        if (sv <= v) { void s.offsetWidth; s.style.animationDelay = (sv - 1) * 60 + 'ms'; s.classList.add('bump'); }
      });
    },
    'save-review': el => {
      const d = ensureDay(ui.date);
      d.review = { ...(d.review || {}), savedAt: Date.now() };
      $$('[data-field]').forEach(f => { d.review[f.dataset.field] = f.value; });
      persist();
      burst(el, ['⭐', '✦', '🌟', '💫']);
      celebrate(t('reviewSaved'));
      render({ anim: false });
    },

    'prev-month': () => { ui.calMonth = new Date(ui.calMonth.getFullYear(), ui.calMonth.getMonth() - 1, 1); render({ anim: false }); animateGrid(); },
    'next-month': () => { ui.calMonth = new Date(ui.calMonth.getFullYear(), ui.calMonth.getMonth() + 1, 1); render({ anim: false }); animateGrid(); },

    'set-lang': el => {
      state.settings.lang = el.dataset.lang;
      persist();
      render();
    },
    'set-theme': el => {
      state.settings.theme = el.dataset.theme;
      persist();
      applyTheme();
      $$('.seg button').forEach(b => { const on = b.dataset.theme === state.settings.theme; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    },
    export: () => {
      const blob = new Blob([JSON.stringify({ app: 'momente', version: 1, exportedAt: new Date().toISOString(), ...state }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `momente-${todayKey()}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    },
    import: () => $('#import-file')?.click(),
    wipe: () => {
      if (!confirm(t('wipeConfirm'))) return;
      state.days = {};
      persist();
      toast(t('wiped'));
      render({ anim: false });
    },

    'onb-lang': el => { ui.onbLang = el.dataset.lang; renderOnboarding(); document.documentElement.lang = ui.onbLang; },
    'onb-start': () => {
      state.settings.lang = ui.onbLang;
      state.settings.name = ($('#onb-name')?.value || '').trim();
      persist();
      const onb = $('.onb');
      render();
      if (onb && !prefersReduced()) { onb.classList.add('closing'); setTimeout(() => { $('#onboarding').innerHTML = ''; }, 600); }
      else $('#onboarding').innerHTML = '';
    }
  };

  function animateGrid() {
    const grid = $('.cal-grid');
    if (grid) { grid.classList.remove('flip'); void grid.offsetWidth; grid.classList.add('flip'); }
  }

  function importFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data.days !== 'object') throw new Error('format');
        for (const [k, d] of Object.entries(data.days)) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || !d) continue;
          const cur = ensureDay(k);
          const ids = new Set(cur.moments.map(m => m.id));
          for (const m of (Array.isArray(d.moments) ? d.moments : [])) {
            if (m && m.id && !ids.has(m.id) && typeof m.time === 'number') {
              cur.moments.push({ id: String(m.id), time: m.time, text: String(m.text || ''), mood: MOODS.includes(m.mood) ? m.mood : null, tags: Array.isArray(m.tags) ? m.tags.filter(x => TAGS.includes(x)) : [] });
            }
          }
          if (d.review && typeof d.review === 'object' && !reviewFilled(cur.review)) cur.review = d.review;
          cleanup(k);
        }
        persist();
        toast(t('importDone'));
        render({ anim: false });
      } catch (e) { toast(t('importError')); }
    };
    reader.readAsText(file);
  }

  /* ---------- Events ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el, e); }
  });

  document.addEventListener('input', e => {
    const el = e.target;
    if (el.tagName === 'TEXTAREA') autosize(el);
    if (el.id === 'moment-text') ui.draft.text = el.value;
    else if (el.id === 'search') runSearch(el.value);
    else if (el.id === 'name-input') { state.settings.name = el.value.trim(); persist(false); }
    else if (el.dataset.field) {
      const d = ensureDay(ui.date);
      d.review = { ...(d.review || {}), [el.dataset.field]: el.value };
      cleanup(ui.date);
      persist(false);
    }
  });

  document.addEventListener('change', e => {
    if (e.target.id === 'young-toggle') { state.settings.young = e.target.checked; persist(); }
    if (e.target.id === 'import-file' && e.target.files[0]) { importFile(e.target.files[0]); e.target.value = ''; }
  });

  document.addEventListener('keydown', e => {
    if (e.target.id === 'moment-text' && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      actions['save-moment']($('[data-action="save-moment"]'));
    }
  });

  // Neuer Tag nach Mitternacht
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    const tk = todayKey();
    if (tk !== ui.lastToday) {
      if (ui.date === ui.lastToday) ui.date = tk;
      ui.lastToday = tk;
      render({ anim: false });
    }
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);

  /* ---------- Start ---------- */
  applyTheme();
  buildNav();
  render();
  if (!state.settings.lang) renderOnboarding();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
