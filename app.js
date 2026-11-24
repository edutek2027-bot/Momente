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
  const MOODS = [5, 4, 3, 2, 1];
  const MOOD_EMOJI = { 1: '😢', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };
  const FEELS = [
    { key: 'happy', emoji: '😄', mood: 5 },
    { key: 'calm', emoji: '😌', mood: 4 },
    { key: 'neutral', emoji: '😐', mood: 3 },
    { key: 'tired', emoji: '😴', mood: 3 },
    { key: 'sad', emoji: '😔', mood: 2 },
    { key: 'anxious', emoji: '😟', mood: 2 },
    { key: 'angry', emoji: '😠', mood: 1 }
  ];
  const FEEL = Object.fromEntries(FEELS.map(f => [f.key, f]));
  const EMOJI_PALETTE = ['🥰', '🤩', '😍', '🥳', '😂', '😊', '🤗', '😇', '😎', '🤔', '😶', '🙄', '😬', '😳', '🥺', '😢',
    '😭', '😤', '😩', '🤒', '🤯', '😱', '🙏', '💪', '✨', '🌿', '☀️', '🌧️', '❤️', '💔', '🎉', '☕'];
  const TAGS = ['family', 'friends', 'work', 'school', 'idea', 'health', 'nature', 'gratitude'];
  const TAG_EMOJI = { family: '🏡', friends: '🤝', work: '💼', school: '📚', idea: '💡', health: '💪', nature: '🌳', gratitude: '🙏' };
  const VIEWS = ['pages', 'calendar', 'today', 'settings'];
  const REVIEW_FIELDS = ['grateful', 'different', 'intention'];
  const PALETTES = {
    sage: { cover: '#5c9c74', accent: '#3d9467' },
    sea: { cover: '#5b93b3', accent: '#3b82a6' },
    lavender: { cover: '#8f7bc4', accent: '#7a62b8' },
    sand: { cover: '#c99572', accent: '#c07a4a' },
    rose: { cover: '#c47f94', accent: '#b8607a' }
  };
  const PAPERS = ['lined', 'dotted', 'grid', 'plain'];
  const FONTS = { serif: '"Lora", Georgia, serif', sans: '"Inter", system-ui, sans-serif', hand: '"Patrick Hand", "Comic Sans MS", cursive' };
  const PRESETS = {
    classic: { palette: 'sage', paper: 'lined', font: 'serif' },
    bullet: { palette: 'sand', paper: 'dotted', font: 'hand' },
    journal: { palette: 'lavender', paper: 'plain', font: 'serif' },
    grid: { palette: 'sea', paper: 'grid', font: 'sans' }
  };
  const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ICONS = {
    today: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    pages: svg('<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2Z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7Z"/>'),
    review: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'),
    calendar: svg('<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    settings: svg('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>'),
    edit: svg('<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    trash: svg('<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>'),
    leaf: svg('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>')
  };
  const COVER_LOGO = `
    <svg class="logo" viewBox="0 0 120 120" aria-hidden="true">
      <circle class="logo-ring" cx="60" cy="60" r="44" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="2"/>
      <g class="logo-orbit"><circle cx="60" cy="16" r="5" fill="#f1d27a"/></g>
      <path class="logo-spark" fill="#fff" d="M60 34C62 52 68 58 86 60 68 62 62 68 60 86 58 68 52 62 34 60 52 58 58 52 60 34Z"/>
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
  const wideMQ = window.matchMedia('(min-width: 900px)');
  const isWide = () => wideMQ.matches;
  const trunc = (s, n) => (s || '').length > n ? s.slice(0, n) + '…' : (s || '');
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* egal */ } }
  };

  /* ---------- Zustand ---------- */
  const defaultState = () => ({ settings: { lang: null, theme: 'light', young: false, name: '', corner: 'quote', customFeels: [], planStart: 7, planEnd: 21, palette: 'sage', paper: 'lined', font: 'serif', size: 'm' }, days: {} });
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
    draft: { title: '', time: '', text: '', mood: null, tags: [] },
    draftFeel: { feel: null, words: [], note: '' },
    editFeel: { feel: null, words: [], note: '' },
    emojiPanel: null,
    todaySub: 'moments',
    openMoments: new Set(),
    detailsOpen: false,
    editing: null,
    editMood: null,
    pageIndex: null,
    pagesMonth: (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); })(),
    reviewOpen: false,
    quoteShift: 0,
    calMonth: (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); })(),
    onbLang: detectLang(),
    justAdded: null,
    coverTimer: null
  };

  /* ---------- i18n ---------- */
  const lang = () => state.settings.lang || ui.onbLang || 'en';
  function t(key, ...args) {
    const dict = I18N[lang()] || I18N.en;
    const v = dict[key] ?? I18N.en[key] ?? key;
    return typeof v === 'function' ? v(...args) : v;
  }
  const young = () => !!state.settings.young;
  const tq = key => (young() && I18N[lang()]['y_' + key]) ? t('y_' + key) : t(key);

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
  const hhmm = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  function timeOn(k, value) { const d = dateOf(k); const [h, mi] = value.split(':').map(Number); d.setHours(h || 0, mi || 0, 0, 0); return d.getTime(); }

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

  function quote() {
    const list = t('quotes');
    const d = new Date();
    const doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
    return list[(doy + ui.quoteShift) % list.length];
  }
  function dailyCorner() {
    const mode = state.settings.corner || 'quote';
    if (mode === 'off') return '';
    if (mode === 'question') return `<p class="spark"><span class="spark-label">${esc(t('sparkLabel'))}</span><span>${esc(spark())}</span></p>`;
    const q = quote();
    return `
      <figure class="quote">
        <span class="spark-label">${esc(t('quoteLabel'))}</span>
        <blockquote>${esc(q.t)}</blockquote>
        <figcaption>— ${esc(q.a || t('proverbLabel'))}</figcaption>
        <button class="icon-btn small ghost quote-next" data-action="next-quote" aria-label="${esc(t('anotherQuote'))}" title="${esc(t('anotherQuote'))}">↻</button>
      </figure>`;
  }

  /* ---------- Datenzugriff ---------- */
  const day = k => state.days[k];
  const ensureDay = k => (state.days[k] ||= { moments: [], review: null });
  const reviewFilled = r => !!r && !!(r.savedAt || REVIEW_FIELDS.some(f => (r[f] || '').trim()));
  const hasContent = k => { const d = day(k); return !!d && (d.moments.length > 0 || reviewFilled(d.review) || (d.todos || []).length > 0 || Object.values(d.plan || {}).some(v => (v || '').trim())); };
  function cleanup(k) { if (day(k) && !hasContent(k)) delete state.days[k]; }
  function dayMood(k) {
    const d = day(k); if (!d) return 0;
    const ms = d.moments.filter(m => m.mood).map(m => m.mood);
    return ms.length ? Math.round(ms.reduce((a, b) => a + b, 0) / ms.length) : 0;
  }
  function streak() {
    let k = todayKey(), n = 0;
    if (!hasContent(k)) k = addDays(k, -1);
    while (hasContent(k)) { n++; k = addDays(k, -1); }
    return n;
  }
  const writtenDays = () => Object.keys(state.days).filter(hasContent).sort();
  const pageList = () => ['toc', ...writtenDays()];

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
  const moodChips = (action, cur) => MOODS.map(v => `
    <button class="mchip ${cur === v ? 'on' : ''}" data-action="${action}" data-v="${v}" aria-pressed="${cur === v}" style="--c:var(--mood-${v})">
      ${young() ? `<span aria-hidden="true">${MOOD_EMOJI[v]}</span>` : '<i class="mdot" aria-hidden="true"></i>'}${esc(t('mood' + v))}
    </button>`).join('');
  const tagLabel = tag => `${young() ? TAG_EMOJI[tag] + ' ' : ''}${esc(t('tag_' + tag))}`;
  const heading = text => `<h2 class="h2"><span>${esc(text)}</span></h2>`;

  /* ---------- Bereich: Heute ---------- */
  function memoryCard(k) {
    for (const [label, key] of [[t('agoYear'), shiftMonths(k, -12)], [t('agoMonth'), shiftMonths(k, -1)]]) {
      const m = day(key)?.moments.find(x => x.text || x.title);
      if (m) {
        return `
          <button class="memory" data-action="open-day" data-k="${key}">
            <span class="memory-label">${esc(t('memory'))} · ${esc(label)}</span>
            <span class="memory-text">${esc(trunc(m.title || m.text, 140))}</span>
          </button>`;
      }
    }
    return '';
  }

  const customFeels = () => Array.isArray(state.settings.customFeels) ? state.settings.customFeels : [];
  // Gefühl auflösen: eines der 7 festen oder ein eigenes Emoji („c:🥳“)
  function feelInfo(key, name) {
    if (!key) return null;
    if (key.startsWith('c:')) {
      const emoji = key.slice(2);
      const c = customFeels().find(x => x.emoji === emoji);
      return { key, emoji, name: name || c?.name || '', mood: 0, custom: true };
    }
    const f = FEEL[key];
    return f ? { ...f, name: t('feel_' + key) } : null;
  }

  function feelPicker(scope, sel) {
    const f = feelInfo(sel.feel);
    const words = f && !f.custom ? t('feelWords_' + f.key) : [];
    const btn = (key, emoji, label, mood) => `
      <button class="femoji ${sel.feel === key ? 'on' : ''}" data-action="pick-feel" data-scope="${scope}" data-feel="${esc(key)}" role="radio" aria-checked="${sel.feel === key}" style="--c:var(--mood-${mood})" title="${esc(label)}">
        <span class="fe" aria-hidden="true">${emoji}</span><span class="fl">${esc(label)}</span>
      </button>`;
    const mine = customFeels();
    return `
      <div class="feel" data-scope="${scope}">
        <span class="feel-q">${esc(t('feelQ'))}</span>
        <div class="feel-emojis" role="radiogroup" aria-label="${esc(t('feelQ'))}">
          ${FEELS.map(x => btn(x.key, x.emoji, t('feel_' + x.key), x.mood)).join('')}
          ${mine.map(c => btn('c:' + c.emoji, esc(c.emoji), c.name || '', 0)).join('')}
          ${sel.feel && sel.feel.startsWith('c:') && !mine.some(c => 'c:' + c.emoji === sel.feel) ? btn(sel.feel, esc(sel.feel.slice(2)), sel.name || '', 0) : ''}
          <button class="femoji add ${ui.emojiPanel === scope ? 'on' : ''}" data-action="emoji-panel" data-scope="${scope}" aria-expanded="${ui.emojiPanel === scope}">
            <span class="fe" aria-hidden="true">＋</span><span class="fl">${esc(t('addOwnEmoji'))}</span>
          </button>
        </div>
        ${ui.emojiPanel === scope ? `
          <div class="emoji-panel">
            <span class="feel-hint">${esc(t('emojiPanelTitle'))}</span>
            <div class="ep-row">
              <input id="${scope}-emoji-type" class="ep-type" type="text" maxlength="8" placeholder="${esc(t('emojiTypePh'))}" aria-label="${esc(t('emojiTypePh'))}">
              <input id="${scope}-emoji-name" class="ep-name" type="text" maxlength="24" placeholder="${esc(t('emojiNamePh'))}" aria-label="${esc(t('emojiNamePh'))}">
              <button class="btn primary sm" data-action="emoji-add" data-scope="${scope}">${esc(t('addBtn'))}</button>
            </div>
            <div class="ep-grid">
              ${EMOJI_PALETTE.map(e => `<button class="ep" data-action="emoji-pick" data-scope="${scope}" data-emoji="${e}" aria-label="${e}">${e}</button>`).join('')}
            </div>
            ${mine.length ? `
              <span class="feel-hint">${esc(t('myEmojis'))}</span>
              <div class="ep-mine">
                ${mine.map(c => `<span class="ep-chip">${esc(c.emoji)} ${esc(c.name)}<button data-action="emoji-remove" data-scope="${scope}" data-emoji="${esc(c.emoji)}" aria-label="${esc(t('removeLabel'))}" title="${esc(t('removeLabel'))}">×</button></span>`).join('')}
              </div>` : ''}
          </div>` : ''}
        ${words.length ? `
          <div class="feel-more">
            <span class="feel-hint">${esc(t('feelWordsHint'))}</span>
            <div class="feel-words">
              ${words.map(w => `<button class="fword ${sel.words.includes(w) ? 'on' : ''}" data-action="toggle-word" data-scope="${scope}" data-word="${esc(w)}" aria-pressed="${sel.words.includes(w)}">${esc(w)}</button>`).join('')}
            </div>
          </div>` : ''}
        <textarea id="${scope}-feelnote" class="feel-note" rows="1" placeholder="${esc(t('feelNotePh'))}" aria-label="${esc(t('feelNotePh'))}">${esc(sel.note)}</textarea>
      </div>`;
  }

  // Gefühl eines Moments als Anzeige
  function feelView(m) {
    const f = feelInfo(m.feel, m.feelName);
    const note = (m.feelNote || '').trim();
    if (!f && !m.mood && !note) return '';
    const name = f ? f.name : (m.mood ? t('mood' + m.mood) : '');
    const emoji = f ? f.emoji : (m.mood ? MOOD_EMOJI[m.mood] : '');
    return `
      <div class="m-feel" style="--c:var(--mood-${f ? f.mood : (m.mood || 0)})">
        ${emoji ? `<span class="m-feel-head"><span class="fe" aria-hidden="true">${esc(emoji)}</span>${name ? `<b>${esc(name)}</b>` : ''}${(m.feelWords || []).map(w => `<span class="fword sm">${esc(w)}</span>`).join('')}</span>` : ''}
        ${note ? `<p class="m-feel-note">${esc(note)}</p>` : ''}
      </div>`;
  }
  const feelEmoji = m => feelInfo(m.feel, m.feelName)?.emoji || (m.mood ? MOOD_EMOJI[m.mood] : '');

  function refreshPicker(scope) {
    const sel = scope === 'edit' ? ui.editFeel : ui.draftFeel;
    const box = $(`.feel[data-scope="${scope}"]`);
    if (box) box.outerHTML = feelPicker(scope, sel);
    autosize($(`#${scope}-feelnote`) || document.createElement('textarea'));
  }
  function addCustomFeel(scope, emoji, name) {
    emoji = (emoji || '').trim();
    if (!emoji) { toast(t('emojiMissing')); return; }
    const list = customFeels().slice();
    const ex = list.find(c => c.emoji === emoji);
    if (ex) { if (name) ex.name = name; } else list.push({ emoji, name: name || '' });
    state.settings.customFeels = list.slice(-12);
    persist();
    const sel = scope === 'edit' ? ui.editFeel : ui.draftFeel;
    sel.feel = 'c:' + emoji; sel.words = []; sel.name = name || ex?.name || '';
    ui.emojiPanel = null;
    refreshPicker(scope);
  }

  const momentLabel = m => (m.title || '').trim() || trunc((m.text || '').split('\n')[0], 60) || (m.mood ? t('mood' + m.mood) : '');

  // Nummerierte, aufklappbare Liste der Momente (Heute und Buchseiten)
  function momentList(list, readOnly = false) {
    return `<ol class="mlist">${list.map((m, i) => momentItem(m, i, readOnly)).join('')}</ol>`;
  }

  function momentItem(m, i, readOnly) {
    const num = `<span class="mnum">${i + 1}</span>`;
    if (!readOnly && ui.editing === m.id) {
      return `
        <li class="mitem open editing" data-id="${m.id}">
          <div class="mhead static">${num}<span class="mtitle">${esc(t('edit'))}</span><time class="mtime">${esc(fmtTime(m.time))}</time></div>
          <div class="mbody">
            <div class="mt-row">
              <input id="edit-title" class="moment-title" type="text" maxlength="80" placeholder="${esc(t('momentTitlePh'))}" value="${esc(m.title || '')}">
              <label class="time-pick" title="${esc(t('timeLabel'))}"><span class="sr">${esc(t('timeLabel'))}</span><input id="edit-time" type="time" value="${hhmm(new Date(m.time))}"></label>
            </div>
            <textarea id="edit-text" class="lined" rows="2" aria-label="${esc(t('edit'))}">${esc(m.text)}</textarea>
            ${feelPicker('edit', ui.editFeel)}
            <div class="edit-actions">
              <button class="btn ghost sm" data-action="cancel-edit">${esc(t('cancel'))}</button>
              <button class="btn primary sm" data-action="save-edit" data-id="${m.id}">${esc(t('saveChanges'))}</button>
            </div>
          </div>
        </li>`;
    }
    const open = ui.openMoments.has(m.id);
    const tags = (m.tags || []).map(tag => `<span class="chip mini">${tagLabel(tag)}</span>`).join('');
    const hasTitle = !!(m.title || '').trim();
    return `
      <li class="mitem ${open ? 'open' : ''} ${ui.justAdded === m.id ? 'pop' : ''}" data-id="${m.id}" style="--i:${i}">
        <button class="mhead" data-action="toggle-moment" data-id="${m.id}" aria-expanded="${open}">
          ${num}
          <span class="mtitle ${hasTitle ? '' : 'plain'}">${esc(momentLabel(m))}</span>
          ${feelEmoji(m) ? `<span class="mfe" aria-hidden="true">${feelEmoji(m)}</span>` : ''}
          <time class="mtime">${esc(fmtTime(m.time))}</time>
          <span class="chev" aria-hidden="true">⌄</span>
        </button>
        <div class="details ${open ? 'open' : ''}">
          <div class="details-inner">
            <div class="mbody">
              ${m.text ? `<p class="m-text">${highlightTags(esc(m.text))}</p>` : ''}
              ${feelView(m)}
              ${tags ? `<div class="m-tags">${tags}</div>` : ''}
              ${readOnly ? '' : `
                <div class="m-foot">
                  ${m.editedAt ? `<span class="m-edited">${esc(t('editedLabel'))}</span>` : '<span></span>'}
                  <span class="m-actions">
                    <button class="icon-btn small ghost" data-action="edit-moment" data-id="${m.id}" aria-label="${esc(t('edit'))}" title="${esc(t('edit'))}">${ICONS.edit}</button>
                    <button class="icon-btn small ghost" data-action="delete-moment" data-id="${m.id}" aria-label="${esc(t('delete'))}" title="${esc(t('delete'))}">${ICONS.trash}</button>
                  </span>
                </div>`}
            </div>
          </div>
        </div>
      </li>`;
  }

  const subTabs = () => `
    <div class="subtabs" role="tablist">
      ${['moments', 'plan'].map(sub => `<button class="${ui.todaySub === sub ? 'on' : ''}" role="tab" aria-selected="${ui.todaySub === sub}" data-action="today-sub" data-sub="${sub}">${esc(t(sub === 'moments' ? 'subMoments' : 'subPlan'))}</button>`).join('')}
    </div>`;

  /* ---------- Plan: Stundenplan und To-do (Bullet Journal) ---------- */
  function planHours() {
    let a = Number(state.settings.planStart), b = Number(state.settings.planEnd);
    if (!(a >= 0 && a <= 23)) a = 7;
    if (!(b >= 0 && b <= 23)) b = 21;
    if (b < a) [a, b] = [b, a];
    return { start: a, end: b };
  }

  function scheduleBlock(k) {
    const d = day(k);
    const plan = d?.plan || {};
    const { start, end } = planHours();
    const now = new Date();
    const isToday = k === todayKey();
    const byHour = {};
    (d?.moments || []).forEach(m => { const h = new Date(m.time).getHours(); (byHour[h] ||= []).push(m); });
    let rows = '';
    for (let h = start; h <= end; h++) {
      const hh = pad(h);
      const cur = isToday && now.getHours() === h;
      const past = isToday && h < now.getHours();
      const ms = (byHour[h] || []).sort((a, b) => a.time - b.time);
      rows += `
        <div class="hrow ${cur ? 'now' : ''} ${past ? 'past' : ''}" ${cur ? `style="--f:${(now.getMinutes() / 60).toFixed(3)}"` : ''}>
          <span class="htime">${hh}:00${cur ? `<small>${esc(t('nowLabel'))}</small>` : ''}</span>
          <div class="hbody">
            <input class="hinput" type="text" maxlength="120" data-hour="${hh}" value="${esc(plan[hh] || '')}" aria-label="${hh}:00">
            ${ms.length ? `<span class="hmoments">${ms.map(m => `<button class="hm" data-action="goto-moment" data-id="${m.id}">${esc(feelEmoji(m) || '•')} ${esc(trunc(momentLabel(m), 22))}</button>`).join('')}</span>` : ''}
          </div>
        </div>`;
    }
    return `
      <section class="block schedule">
        ${heading(t('schedule'))}
        <p class="hint">${esc(t('planHint'))}</p>
        <div class="hours">${rows}</div>
      </section>`;
  }

  const todoBullet = x => x.state === 'done' ? '×' : x.state === 'moved' ? '>' : '•';
  function todoItem(x) {
    return `
      <li class="todo ${x.state} ${x.prio ? 'prio' : ''}" data-id="${x.id}">
        <button class="tb" data-action="todo-toggle" data-id="${x.id}" aria-label="${esc(x.text)}" aria-pressed="${x.state === 'done'}" ${x.state === 'moved' ? 'disabled' : ''}>${todoBullet(x)}</button>
        ${x.prio ? '<span class="tprio" aria-hidden="true">✱</span>' : ''}
        <input class="tinput" type="text" maxlength="160" data-id="${x.id}" value="${esc(x.text)}" ${x.state === 'moved' ? 'readonly' : ''} aria-label="${esc(t('todos'))}">
        <span class="tactions">
          <button class="icon-btn small ghost ${x.prio ? 'on' : ''}" data-action="todo-prio" data-id="${x.id}" aria-label="${esc(t('priority'))}" title="${esc(t('priority'))}">✱</button>
          ${x.state === 'open' ? `<button class="icon-btn small ghost" data-action="todo-move" data-id="${x.id}" aria-label="${esc(t('moveTomorrow'))}" title="${esc(t('moveTomorrow'))}">&gt;</button>` : ''}
          <button class="icon-btn small ghost" data-action="todo-delete" data-id="${x.id}" aria-label="${esc(t('delete'))}" title="${esc(t('delete'))}">${ICONS.trash}</button>
        </span>
      </li>`;
  }

  function todoBlock(k) {
    const todos = day(k)?.todos || [];
    const active = todos.filter(x => x.state !== 'moved');
    const done = active.filter(x => x.state === 'done').length;
    const yOpen = k === todayKey() ? (day(addDays(k, -1))?.todos || []).filter(x => x.state === 'open') : [];
    return `
      <section class="block todos-block">
        <h2 class="h2"><span>${esc(t('todos'))}</span>${active.length ? `<em class="h2-count">${done}/${active.length}</em>` : ''}</h2>
        ${yOpen.length ? `<button class="carry" data-action="carry-over">↪ ${esc(t('carryOver', yOpen.length))}</button>` : ''}
        <div class="todo-add">
          <span class="tb static" aria-hidden="true">•</span>
          <input id="todo-input" type="text" maxlength="160" placeholder="${esc(t('todoPh'))}" aria-label="${esc(t('todoPh'))}">
          <button class="btn primary sm" data-action="add-todo">${esc(t('addTask'))}</button>
        </div>
        ${todos.length ? `<ul class="todos">${todos.map(todoItem).join('')}</ul>` : `<p class="hint">${esc(t('todoEmpty'))}</p>`}
        ${active.length ? `<div class="progress" aria-label="${esc(t('todoDone', done, active.length))}"><i style="width:${Math.round(done / active.length * 100)}%"></i></div><p class="hint">${esc(t('todoDone', done, active.length))}</p>` : ''}
        <p class="bullet-key">${esc(t('bulletKey'))}</p>
      </section>`;
  }

  function renderPlan() {
    const k = ui.date;
    const l = `
      <header class="hero">
        <p class="eyebrow">${esc(fmt(dateOf(k), { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
        <h1 class="title">${esc(t('subPlan'))}</h1>
      </header>
      ${subTabs()}
      ${dayNav(k)}
      ${scheduleBlock(k)}`;
    return { l, r: todoBlock(k) };
  }

  function renderToday() {
    if (ui.todaySub === 'plan') return renderPlan();
    const k = ui.date, isToday = k === todayKey();
    const d = day(k);
    const moments = d ? [...d.moments].sort((a, b) => a.time - b.time) : [];
    const name = state.settings.name.trim();
    const title = isToday
      ? `${esc(greeting())}${name ? `, <span class="accent-text">${esc(name)}</span>` : ''}`
      : esc(fmt(dateOf(k), { weekday: 'long' }));
    const picked = ui.draft.tags.length;
    const l = `
      <header class="hero">
        <p class="eyebrow">${esc(fmt(dateOf(k), { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
        <h1 class="title">${title}</h1>
        ${isToday ? dailyCorner() : ''}
      </header>
      ${subTabs()}
      ${dayNav(k)}
      <section class="composer" id="composer">
        <div class="mt-row">
          <input id="moment-title" class="moment-title" type="text" maxlength="80" placeholder="${esc(t('momentTitlePh'))}" aria-label="${esc(t('momentTitlePh'))}" value="${esc(ui.draft.title)}">
          <label class="time-pick" title="${esc(t('timeLabel'))}"><span class="sr">${esc(t('timeLabel'))}</span><input id="moment-time" type="time" value="${esc(ui.draft.time || hhmm(new Date()))}"></label>
        </div>
        <textarea id="moment-text" class="lined" rows="4" placeholder="${esc(tq('placeholder'))}" aria-label="${esc(t('placeholder'))}">${esc(ui.draft.text)}</textarea>
        ${feelPicker('draft', ui.draftFeel)}
        <div class="details ${ui.detailsOpen ? 'open' : ''}" id="details">
          <div class="details-inner">
            <span class="label">${esc(t('topics'))}</span>
            <div class="tags">
              ${TAGS.map(tag => `<button class="chip ${ui.draft.tags.includes(tag) ? 'on' : ''}" data-action="toggle-tag" data-tag="${tag}" aria-pressed="${ui.draft.tags.includes(tag)}">${tagLabel(tag)}</button>`).join('')}
            </div>
          </div>
        </div>
        <div class="composer-actions">
          <button class="link-btn" data-action="toggle-details" aria-expanded="${ui.detailsOpen}" aria-controls="details">
            <span class="plus ${ui.detailsOpen ? 'open' : ''}" aria-hidden="true">+</span>${esc(t('addTopics'))}<span class="badge" ${picked ? '' : 'hidden'}>${picked}</span>
          </button>
          <button class="btn primary sm" data-action="save-moment">${esc(t('save'))}</button>
        </div>
      </section>
      ${memoryCard(k)}`;
    const r = `
      <h2 class="h2"><span>${esc(t('momentsHeading'))}</span>${moments.length ? `<em class="h2-count">${moments.length}</em>` : ''}</h2>
      ${moments.length
        ? momentList(moments)
        : `<div class="empty"><div class="empty-orb">${ICONS.leaf}</div><p>${esc(isToday ? t('emptyDay') : t('emptyPast'))}</p></div>`}
      ${reviewPanel(k)}`;
    return { l, r };
  }

  // Tagesbewertung: aufklappbar im Bereich „Heute“
  function reviewPanel(k) {
    const r = day(k)?.review || {};
    const open = ui.reviewOpen;
    const field = f => `
      <label class="field">
        <span class="field-label">${esc(tq(f))}</span>
        <textarea class="lined" rows="2" data-field="${f}" placeholder="${esc(t('fieldPlaceholder'))}">${esc(r[f] || '')}</textarea>
      </label>`;
    return `
      <section class="review-panel ${open ? 'open' : ''}" id="review-panel">
        <button class="review-toggle" data-action="toggle-review" aria-expanded="${open}" aria-controls="review-body">
          <span class="rv-icon">${ICONS.review}</span>
          <span class="rv-text"><strong>${esc(t('reviewTitle'))}</strong><small>${esc(t('reviewIntro'))}</small></span>
          ${r.savedAt ? '<span class="rv-done" aria-hidden="true">✓</span>' : ''}
          <span class="chev" aria-hidden="true">⌄</span>
        </button>
        <div class="details ${open ? 'open' : ''}" id="review-body">
          <div class="details-inner">
            <div class="rv-content">
              ${REVIEW_FIELDS.map(field).join('')}
              <button class="btn primary" data-action="save-review">${esc(t('saveReview'))}</button>
              ${r.savedAt ? `<p class="done-note">✓ ${esc(t('reviewDone'))} · ${esc(fmtTime(r.savedAt))}</p>` : ''}
            </div>
          </div>
        </div>
      </section>`;
  }

  /* ---------- Bereich: Seiten (das Buch selbst) ---------- */
  function miniCalendar(list) {
    const idx = {};
    list.forEach((k, i) => { if (i) idx[k] = i; });
    const m = ui.pagesMonth;
    const daysIn = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const offset = (new Date(m.getFullYear(), m.getMonth(), 1).getDay() + 6) % 7;
    const tk = todayKey();
    const now = new Date();
    const atCurrent = m.getFullYear() === now.getFullYear() && m.getMonth() === now.getMonth();
    let cells = Array.from({ length: 7 }, (_, i) => `<span class="wd">${esc(fmt(new Date(2024, 0, 1 + i), { weekday: 'narrow' }))}</span>`).join('');
    cells += '<span></span>'.repeat(offset);
    for (let n = 1; n <= daysIn; n++) {
      const k = keyOf(new Date(m.getFullYear(), m.getMonth(), n));
      cells += idx[k]
        ? `<button class="mday ${k === tk ? 'today' : ''}" data-action="goto-page" data-i="${idx[k]}" style="--c:var(--mood-${dayMood(k)})" title="${esc(day(k).title || '')}">${n}</button>`
        : `<span class="mday ${k === tk ? 'today' : ''}">${n}</span>`;
    }
    return `
      <div class="mini-cal">
        <div class="mini-head">
          <button class="icon-btn small" data-action="pcal-prev" aria-label="${esc(t('prevMonth'))}">‹</button>
          <strong>${esc(fmt(m, { month: 'long', year: 'numeric' }))}</strong>
          <button class="icon-btn small" data-action="pcal-next" aria-label="${esc(t('nextMonth'))}" ${atCurrent ? 'disabled' : ''}>›</button>
        </div>
        <div class="mini-grid">${cells}</div>
      </div>`;
  }

  function tocPage(list) {
    const days = list.slice(1);
    let html = `<div class="page-content toc"><h2 class="toc-title">${esc(t('toc'))}</h2>${miniCalendar(list)}`;
    if (!days.length) return html + `<div class="empty"><p>${esc(t('bookEmpty'))}</p></div></div>`;
    const groups = [];
    days.forEach((k, i) => {
      const mKey = k.slice(0, 7);
      if (!groups.length || groups[groups.length - 1].key !== mKey) groups.push({ key: mKey, items: [] });
      groups[groups.length - 1].items.push({ k, no: i + 1 });
    });
    for (const g of groups) {
      html += `
        <section class="toc-group">
          <h3 class="toc-month"><span>${esc(fmt(dateOf(g.items[0].k), { month: 'long', year: 'numeric' }))}</span><small>${esc(t('daysCount', g.items.length))}</small></h3>
          <ol class="toc-list">
            ${g.items.map(({ k, no }) => {
              const dd = day(k);
              const titles = dd.moments.slice().sort((a, b) => a.time - b.time).map(momentLabel).filter(Boolean);
              const title = titles.join(' · ');
              const d = dateOf(k);
              return `
                <li><button class="toc-item" data-action="goto-page" data-i="${no}">
                  <span class="toc-date"><b>${d.getDate()}</b><small>${esc(fmt(d, { weekday: 'short' }))}</small></span>
                  <span class="toc-text ${title ? 'titled' : ''}">${esc(title || t('review'))}</span>
                  <i class="mdot-s" style="--c:var(--mood-${dayMood(k)})" aria-hidden="true"></i>
                  <span class="toc-no">${no}</span>
                </button></li>`;
            }).join('')}
          </ol>
        </section>`;
    }
    return html + '</div>';
  }

  function dayPage(k, no) {
    const d = day(k);
    const ms = [...d.moments].sort((a, b) => a.time - b.time);
    const r = d.review;
    const moods = ms.filter(m => m.mood);
    const feels = [...new Set(ms.map(feelEmoji).filter(Boolean))];
    const notes = REVIEW_FIELDS.filter(f => (r?.[f] || '').trim());
    return `
      <div class="page-content">
        <div class="page-head">
          <span class="page-weekday">${esc(fmt(dateOf(k), { weekday: 'long' }))}</span>
          <h2 class="page-title">${esc(fmt(dateOf(k), { day: 'numeric', month: 'long', year: 'numeric' }))}</h2>
        </div>
        <div class="facts">
          <div class="fact"><span class="fact-label">${esc(t('momentsHeading'))}</span><span class="fact-val">${ms.length}</span></div>
          <div class="fact"><span class="fact-label">${esc(t('feelingsLabel'))}</span><span class="fact-val fact-emojis">${feels.length ? feels.join(' ') : '—'}</span></div>
          ${moods.length ? `<div class="fact"><span class="fact-label">&nbsp;</span><span class="mood-strip" aria-hidden="true">${moods.map(m => `<i style="--c:var(--mood-${m.mood})"></i>`).join('')}</span></div>` : ''}
        </div>
        ${ms.length ? momentList(ms, true) : ''}
        ${(d.todos || []).length ? `
          <h3 class="page-sub">${esc(t('todos'))}</h3>
          <ul class="todos ro">${d.todos.map(x => `<li class="todo ${x.state} ${x.prio ? 'prio' : ''}"><span class="tb static">${todoBullet(x)}</span>${x.prio ? '<span class="tprio">✱</span>' : ''}<span class="ttext">${esc(x.text)}</span></li>`).join('')}</ul>` : ''}
        ${Object.keys(d.plan || {}).filter(h => (d.plan[h] || '').trim()).length ? `
          <h3 class="page-sub">${esc(t('schedule'))}</h3>
          <ul class="plan-ro">${Object.keys(d.plan).sort().filter(h => (d.plan[h] || '').trim()).map(h => `<li><time>${h}:00</time><span>${esc(d.plan[h])}</span></li>`).join('')}</ul>` : ''}
        ${notes.length ? `
          <div class="page-review">
            <h3>${esc(t('review'))}</h3>
            ${notes.map(f => `<p class="pr-line"><span class="pr-label">${esc(tq(f))}</span>${esc(r[f])}</p>`).join('')}
          </div>` : ''}
        <div class="ruled-fill" aria-hidden="true"></div>
        <footer class="page-foot">
          <button class="link-btn" data-action="open-day" data-k="${k}">${esc(t('openDay'))} →</button>
          <span class="page-no">${no}</span>
        </footer>
      </div>`;
  }

  function pageContent(list, i) {
    if (i >= list.length) return `<div class="page-content"><div class="page-end"><span class="fleuron" aria-hidden="true">❦</span><p>${esc(t('toBeContinued'))}</p></div><div class="ruled-fill" aria-hidden="true"></div></div>`;
    return list[i] === 'toc' ? tocPage(list) : dayPage(list[i], i);
  }

  function renderPages() {
    const list = pageList();
    if (ui.pageIndex === null || ui.pageIndex >= list.length) ui.pageIndex = list.length - 1;
    if (ui.pageIndex < 0) ui.pageIndex = 0;
    if (isWide()) {
      const s = ui.pageIndex - (ui.pageIndex % 2);
      return { l: pageContent(list, s), r: pageContent(list, s + 1) };
    }
    return { l: pageContent(list, ui.pageIndex), r: '' };
  }

  function pageBounds() {
    const list = pageList();
    const step = isWide() ? 2 : 1;
    const cur = isWide() ? ui.pageIndex - (ui.pageIndex % 2) : ui.pageIndex;
    return { list, step, cur, canPrev: cur - step >= 0, canNext: cur + step < list.length };
  }

  const corner = (dir, enabled) => `
    <button class="corner corner-${dir}" data-action="page-${dir}" aria-label="${esc(t(dir === 'prev' ? 'prevPage' : 'nextPage'))}" ${enabled ? '' : 'hidden'}>
      <span aria-hidden="true">${dir === 'prev' ? '‹' : '›'}</span>
    </button>`;

  /* ---------- Bereich: Kalender ---------- */
  function renderCalendar() {
    const m = ui.calMonth;
    const total = Object.values(state.days).reduce((a, d) => a + d.moments.length, 0);
    const written = writtenDays().length;
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
      const future = k > tk;
      cells += `
        <button class="cday ${has ? 'has' : ''} ${k === tk ? 'today' : ''}" data-action="open-day" data-k="${k}" ${future ? 'disabled' : ''}
          style="--c:${dayMood(k) ? `var(--mood-${dayMood(k)})` : 'color-mix(in srgb, var(--accent) 28%, var(--paper))'}; --i:${dnum}" aria-label="${esc(fmt(dateOf(k), { day: 'numeric', month: 'long' }))}">
          <span>${dnum}</span>${day(k)?.review?.savedAt ? '<i class="rdot" aria-hidden="true"></i>' : ''}
        </button>`;
    }
    const now = new Date(); const atCurrent = m.getFullYear() === now.getFullYear() && m.getMonth() === now.getMonth();
    const l = `
      <header class="hero">
        <p class="eyebrow">Momente</p>
        <h1 class="title">${esc(t('calendar'))}</h1>
      </header>
      <section class="block cal">
        <div class="cal-head">
          <button class="icon-btn" data-action="prev-month" aria-label="${esc(t('prevMonth'))}">‹</button>
          <strong>${esc(fmt(m, { month: 'long', year: 'numeric' }))}</strong>
          <button class="icon-btn" data-action="next-month" aria-label="${esc(t('nextMonth'))}" ${atCurrent ? 'disabled' : ''}>›</button>
        </div>
        <div class="cal-grid">${cells}</div>
      </section>`;
    const r = `
      <section class="block">
        ${heading(t('searchTitle'))}
        <input type="search" id="search" class="search" placeholder="${esc(t('search'))}" aria-label="${esc(t('search'))}">
        <ul class="results" id="results"></ul>
      </section>`;
    return { l, r };
  }

  function runSearch(q) {
    const box = $('#results'); if (!box) return;
    q = q.trim().toLocaleLowerCase();
    if (!q) { box.innerHTML = ''; return; }
    const hits = [];
    for (const k of Object.keys(state.days).sort().reverse()) {
      const d = state.days[k];
      if ((d.title || '').toLocaleLowerCase().includes(q)) hits.push({ k, text: d.title, mood: dayMood(k) });
      for (const m of d.moments) { const tx = [m.title, m.text, m.feelNote, ...(m.feelWords || [])].filter(Boolean).join(' — '); if (tx.toLocaleLowerCase().includes(q)) hits.push({ k, text: tx, mood: m.mood }); }
      for (const x of d.todos || []) if ((x.text || '').toLocaleLowerCase().includes(q)) hits.push({ k, text: todoBullet(x) + ' ' + x.text, mood: 0 });
      for (const [h, v] of Object.entries(d.plan || {})) if ((v || '').toLocaleLowerCase().includes(q)) hits.push({ k, text: `${h}:00 ${v}`, mood: 0 });
      if (d.review) for (const f of REVIEW_FIELDS) {
        const v = d.review[f] || '';
        if (v.toLocaleLowerCase().includes(q)) hits.push({ k, text: v, mood: 0 });
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
        <span class="result-date"><i class="rdot-inline" style="--c:var(--mood-${h.mood || 0})"></i>${esc(fmt(dateOf(h.k), { day: 'numeric', month: 'short', year: 'numeric' }))}</span>
        <span class="result-text">${mark(h.text)}</span>
      </button></li>`).join('');
  }

  /* ---------- Bereich: Einstellungen ---------- */
  const langCards = (action, current) => LANGS.map(l => `
    <button class="lang ${current === l.code ? 'on' : ''}" data-action="${action}" data-lang="${l.code}" aria-pressed="${current === l.code}" lang="${l.code}">
      <span class="flag">${l.flag}</span>
      <span class="lang-name">${l.name}</span>
      <span class="lang-check" aria-hidden="true">✓</span>
    </button>`).join('');

  const choice = (pref, val, cur, inner, cls = '') =>
    `<button class="${cls} ${cur === val ? 'on' : ''}" data-action="set-pref" data-pref="${pref}" data-val="${val}" aria-pressed="${cur === val}">${inner}</button>`;
  const preview = (palette, paper, font) =>
    `<span class="pv" data-pv-paper="${paper}" style="--pv-cover:${PALETTES[palette].cover};--pv-accent:${PALETTES[palette].accent};--pv-font:${FONTS[font].replace(/"/g, "'")}" aria-hidden="true"><span class="pv-title">Aa</span><span class="pv-text">${esc(t('momentsHeading'))}</span></span>`;

  function renderSettings() {
    const s = state.settings;
    const presetOn = name => Object.entries(PRESETS[name]).every(([k, v]) => s[k] === v);
    const l = `
      <header class="hero">
        <p class="eyebrow">Momente</p>
        <h1 class="title">${esc(t('settings'))}</h1>
      </header>
      <section class="block" data-group="appearance">
        ${heading(t('personalize'))}
        <span class="label">${esc(t('presets'))}</span>
        <div class="presets">
          ${Object.keys(PRESETS).map(n => `
            <button class="preset ${presetOn(n) ? 'on' : ''}" data-action="apply-preset" data-preset="${n}" aria-pressed="${presetOn(n)}">
              ${preview(PRESETS[n].palette, PRESETS[n].paper, PRESETS[n].font)}
              <span class="preset-name">${esc(t('preset_' + n))}</span>
              <small>${esc(t('pdesc_' + n))}</small>
            </button>`).join('')}
        </div>
        <span class="label">${esc(t('palette'))}</span>
        <div class="swatches" data-group="palette">
          ${Object.keys(PALETTES).map(p => choice('palette', p, s.palette, `<i style="--sw:${PALETTES[p].cover};--sw2:${PALETTES[p].accent}"></i><span>${esc(t('pal_' + p))}</span>`, 'swatch')).join('')}
        </div>
        <span class="label">${esc(t('paper'))}</span>
        <div class="papers" data-group="paper">
          ${PAPERS.map(p => choice('paper', p, s.paper, `<span class="pv mini" data-pv-paper="${p}" aria-hidden="true"></span><span>${esc(t('paper_' + p))}</span>`, 'paper-tile')).join('')}
        </div>
        <span class="label">${esc(t('fontLabel'))}</span>
        <div class="seg" data-group="font">
          ${Object.keys(FONTS).map(f => choice('font', f, s.font, `<span class="font-aa" style="font-family:${FONTS[f].replace(/"/g, "'")}">Aa</span> ${esc(t('font_' + f))}`)).join('')}
        </div>
        <span class="label">${esc(t('sizeLabel'))}</span>
        <div class="seg" data-group="size">
          ${['s', 'm', 'l'].map(z => choice('size', z, s.size, esc(t('size_' + z)))).join('')}
        </div>
        <span class="label">${esc(t('modeLabel'))}</span>
        <div class="seg seg-theme" role="radiogroup">
          ${['light', 'dark', 'auto'].map(th => `<button class="${s.theme === th ? 'on' : ''}" data-action="set-theme" data-theme="${th}" role="radio" aria-checked="${s.theme === th}">${esc(t('theme' + th[0].toUpperCase() + th.slice(1)))}</button>`).join('')}
        </div>
      </section>`;
    const r = `
      <section class="block">
        ${heading(t('language'))}
        <div class="langs">${langCards('set-lang', s.lang)}</div>
      </section>
      <section class="block">
        ${heading(t('cornerTitle'))}
        <div class="seg seg-corner wrap" role="radiogroup">
          ${['quote', 'question', 'off'].map(c => `<button class="${(s.corner || 'quote') === c ? 'on' : ''}" data-action="set-corner" data-corner="${c}" role="radio" aria-checked="${(s.corner || 'quote') === c}">${esc(t('corner_' + c))}</button>`).join('')}
        </div>
      </section>
      <section class="block">
        ${heading(t('planHours'))}
        <div class="plan-hours">
          <label>${esc(t('planFrom'))} <select id="plan-start">${Array.from({ length: 13 }, (_, i) => i + 4).map(h => `<option value="${h}" ${planHours().start === h ? 'selected' : ''}>${pad(h)}:00</option>`).join('')}</select></label>
          <label>${esc(t('planTo'))} <select id="plan-end">${Array.from({ length: 12 }, (_, i) => i + 12).map(h => `<option value="${h}" ${planHours().end === h ? 'selected' : ''}>${pad(h)}:00</option>`).join('')}</select></label>
        </div>
      </section>
      <section class="block">
        ${heading(t('profile'))}
        <label class="field">
          <span class="field-label">${esc(t('nameLabel'))}</span>
          <input type="text" id="name-input" class="lined-input" maxlength="30" value="${esc(s.name)}" autocomplete="given-name">
        </label>
        <label class="switch-row">
          <span><strong>${esc(t('youngMode'))}</strong><small>${esc(t('youngDesc'))}</small></span>
          <input type="checkbox" class="switch" id="young-toggle" ${s.young ? 'checked' : ''}>
        </label>
      </section>
      <section class="block">
        ${heading(t('data'))}
        <p class="muted">${esc(t('privacy'))}</p>
        <div class="btn-row">
          <button class="btn soft" data-action="export">${esc(t('export'))}</button>
          <button class="btn soft" data-action="import">${esc(t('import'))}</button>
        </div>
        <input type="file" id="import-file" accept="application/json,.json" hidden>
        <button class="btn danger" data-action="wipe">${esc(t('wipe'))}</button>
      </section>
      <p class="muted center small">${esc(t('installTip'))}</p>
      <p class="muted center small">Momente · v2.2</p>`;
    return { l, r };
  }

  /* ---------- Rendering ---------- */
  const RENDERERS = { pages: renderPages, calendar: renderCalendar, today: renderToday, settings: renderSettings };

  function buildNav() {
    $('#nav').innerHTML = VIEWS.map((v, i) =>
      `<button class="tab" data-action="nav" data-v="${v}" style="--tc:var(--tab-${i + 1})">${ICONS[v]}<span class="tab-label"></span></button>`).join('');
  }
  function updateNav() {
    $$('.tab').forEach(b => {
      const on = b.dataset.v === ui.view;
      b.classList.toggle('on', on);
      on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
      const label = t(b.dataset.v);
      $('.tab-label', b).textContent = label;
      b.title = label;
    });
  }

  function render({ anim = true } = {}) {
    const { l, r } = RENDERERS[ui.view]();
    const name = state.settings.name.trim();
    const pages = ui.view === 'pages';
    const pb = pages ? pageBounds() : null;
    const wide = isWide();
    const keepScroll = !anim ? $$('#app .page-body').map(e => e.scrollTop) : [];
    $('#app').innerHTML = `
      <div class="spread view-${ui.view} ${anim ? 'enter' : ''} ${!wide && !r ? 'single' : ''}">
        <section class="page page-l">
          <header class="running"><span>Momente</span><span>${esc(name)}</span></header>
          <div class="page-body">${l}</div>
          ${pages ? corner('prev', pb.canPrev) : ''}
          ${pages && !wide ? corner('next', pb.canNext) : ''}
        </section>
        <section class="page page-r">
          <header class="running"><span>${esc(t(ui.view))}</span><span>${esc(fmt(new Date(), { day: 'numeric', month: 'long' }))}</span></header>
          <div class="page-body">${r}</div>
          ${pages && wide ? corner('next', pb.canNext) : ''}
        </section>
      </div>`;
    keepScroll.forEach((top, i) => { const pb = $$('#app .page-body')[i]; if (pb) pb.scrollTop = top; });
    postRender(anim);
  }

  function postRender(anim) {
    document.documentElement.lang = lang();
    document.title = `Momente · ${t(ui.view)}`;
    updateNav();
    ui.justAdded = null;
    $$('#app textarea').forEach(autosize);
    if (ui.view === 'calendar') countUp(anim);
    if (ui.view === 'pages') bindSwipe();
    const edit = $('#edit-text');
    if (edit) { edit.focus({ preventScroll: false }); edit.setSelectionRange(edit.value.length, edit.value.length); }
  }

  // Seite umblättern: das alte Blatt dreht sich um den Buchrücken, darunter liegt schon die neue Seite
  let flipping = false;
  function flip(dir, mutate) {
    if (flipping) return;
    const spread = $('.spread');
    if (prefersReduced() || !spread || !dir) { mutate(); render({ anim: !spread }); return; }
    flipping = true;
    window.scrollTo({ top: 0, behavior: 'auto' });
    const wide = isWide();
    const oldL = $('.page-l').innerHTML, oldR = $('.page-r').innerHTML;
    const oldSpread = spread.innerHTML;
    const oldHeight = spread.offsetHeight;
    mutate();
    render({ anim: false });
    const ns = $('.spread');
    const leaf = document.createElement('div');
    let land = () => {};
    if (wide) {
      if (dir > 0) {
        const newL = $('.page-l').innerHTML;
        $('.page-l').innerHTML = oldL;
        leaf.className = 'leaf leaf-r turn-next';
        leaf.innerHTML = `<div class="leaf-face front page page-r">${oldR}</div><div class="leaf-face back page page-l">${newL}</div>`;
        land = () => { $('.page-l').innerHTML = newL; };
      } else {
        const newR = $('.page-r').innerHTML;
        $('.page-r').innerHTML = oldR;
        leaf.className = 'leaf leaf-l turn-prev';
        leaf.innerHTML = `<div class="leaf-face front page page-l">${oldL}</div><div class="leaf-face back page page-r">${newR}</div>`;
        land = () => { $('.page-r').innerHTML = newR; };
      }
    } else {
      const h = Math.min(Math.max(oldHeight, ns.offsetHeight), window.innerHeight + 40);
      if (dir > 0) {
        leaf.className = 'leaf leaf-n turn-next';
        leaf.innerHTML = `<div class="leaf-face front clone">${oldSpread}</div><div class="leaf-face back blank"></div>`;
      } else {
        const newHTML = ns.innerHTML;
        ns.innerHTML = oldSpread;
        leaf.className = 'leaf leaf-n turn-prev-in';
        leaf.innerHTML = `<div class="leaf-face front clone">${newHTML}</div><div class="leaf-face back blank"></div>`;
        land = () => { ns.innerHTML = newHTML; };
      }
      leaf.style.height = h + 'px';
    }
    leaf.setAttribute('aria-hidden', 'true');
    ns.appendChild(leaf);
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      land();
      leaf.remove();
      flipping = false;
      postRender(false);
    };
    leaf.addEventListener('animationend', finish, { once: true });
    setTimeout(finish, 1200);
  }

  function go(view) {
    if (view === ui.view) return;
    const dir = Math.sign(VIEWS.indexOf(view) - VIEWS.indexOf(ui.view));
    flip(dir, () => {
      ui.view = view;
      ui.editing = null;
      if (view === 'pages') ui.pageIndex = null;
    });
  }

  function turnPage(dir) {
    const b = pageBounds();
    if (dir > 0 && !b.canNext) return;
    if (dir < 0 && !b.canPrev) return;
    flip(dir, () => { ui.pageIndex = b.cur + dir * b.step; });
  }

  function bindSwipe() {
    const sp = $('.spread'); if (!sp || sp.dataset.swipe) return;
    sp.dataset.swipe = '1';
    let x0 = null, y0 = null;
    sp.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    sp.addEventListener('touchend', e => {
      if (x0 === null || ui.view !== 'pages') return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) turnPage(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  /* ---------- Einband (Cover) ---------- */
  function renderCover(first) {
    const el = $('#cover');
    const nameVal = $('#onb-name')?.value ?? '';
    const name = state.settings.name.trim();
    el.innerHTML = `
      <div class="cover-scene" lang="${lang()}">
        <div class="cover ${first ? 'first' : ''}" ${first ? 'role="dialog" aria-modal="true" aria-label="Momente"' : 'data-action="open-book" role="button" tabindex="0" aria-label="' + esc(t('tapToOpen')) + '"'}>
          <div class="cover-inner">
            ${COVER_LOGO}
            <h1 class="cover-title">Momente</h1>
            <p class="cover-tagline">${esc(t('tagline'))}</p>
            ${first ? `
              <div class="cover-form">
                <p class="cover-label">${esc(t('chooseLang'))}</p>
                <div class="langs">${langCards('onb-lang', ui.onbLang)}</div>
                <input id="onb-name" class="cover-input" type="text" maxlength="30" placeholder="${esc(t('yourName'))}" value="${esc(nameVal)}" autocomplete="given-name">
                <button class="btn cover-btn" data-action="onb-start">${esc(t('start'))} →</button>
              </div>` : `
              <div class="cover-foot">
                ${name ? `<p class="cover-name">${esc(name)}</p>` : ''}
                <p class="cover-year">${new Date().getFullYear()}</p>
                <p class="cover-hint">${esc(t('tapToOpen'))}</p>
              </div>`}
          </div>
        </div>
      </div>`;
    if (!first) {
      clearTimeout(ui.coverTimer);
      ui.coverTimer = setTimeout(openBook, 3000);
    }
  }

  function openBook() {
    clearTimeout(ui.coverTimer);
    const el = $('#cover');
    if (!$('.cover', el)) return;
    session.set('momente.opened', '1');
    if (prefersReduced()) { el.innerHTML = ''; return; }
    el.classList.add('opening');
    setTimeout(() => { el.innerHTML = ''; el.classList.remove('opening'); }, 1750);
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

  // Kleine Blätter fliegen beim Speichern auf
  function burst(target) {
    if (prefersReduced() || !target) return;
    const r = target.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const colors = ['#3d9467', '#7cc895', '#b6dfbd', '#e9c46a', '#5fae7f'];
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const ang = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
      const dist = 60 + Math.random() * 70;
      const size = 6 + Math.random() * 7;
      p.style.cssText = `left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;background:${colors[i % colors.length]};` +
        `--dx:${Math.cos(ang) * dist}px;--dy:${Math.sin(ang) * dist - 40}px;--rot:${Math.random() * 360 - 180}deg`;
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }

  function celebrate(text) {
    const el = document.createElement('div');
    el.className = 'celebrate';
    const stars = Array.from({ length: 18 }, () =>
      `<i style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${(Math.random() * 1.2).toFixed(2)}s">✦</i>`).join('');
    el.innerHTML = `<div class="cel-stars">${stars}</div><div class="cel-moon" aria-hidden="true"></div><p class="cel-text">${esc(text)}</p>`;
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

  // Eigener Bestätigungsdialog (statt confirm(), das in eingebetteten Seiten blockiert ist)
  function ask(msg, okLabel) {
    return new Promise(resolve => {
      const prev = document.activeElement;
      const el = document.createElement('div');
      el.className = 'modal';
      el.innerHTML = `
        <div class="modal-card" role="alertdialog" aria-modal="true" aria-label="${esc(msg)}">
          <p>${esc(msg)}</p>
          <div class="btn-row">
            <button class="btn soft" data-r="0">${esc(t('cancel'))}</button>
            <button class="btn danger-solid" data-r="1">${esc(okLabel)}</button>
          </div>
        </div>`;
      document.body.appendChild(el);
      const done = v => {
        el.classList.add('out');
        setTimeout(() => el.remove(), 260);
        prev?.focus?.();
        resolve(v);
      };
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-r]');
        if (b) done(b.dataset.r === '1');
        else if (e.target === el) done(false);
      });
      el.addEventListener('keydown', e => { if (e.key === 'Escape') done(false); });
      $('[data-r="0"]', el).focus();
    });
  }

  function shake(el) { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

  /* ---------- Theme ---------- */
  function applyAppearance() {
    const s = state.settings;
    const root = document.documentElement.dataset;
    root.palette = PALETTES[s.palette] ? s.palette : 'sage';
    root.paper = PAPERS.includes(s.paper) ? s.paper : 'lined';
    root.font = FONTS[s.font] ? s.font : 'serif';
    root.size = ['s', 'm', 'l'].includes(s.size) ? s.size : 'm';
  }

  function applyTheme() {
    applyAppearance();
    const th = state.settings.theme;
    if (th === 'auto') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = th;
    const dark = th === 'dark' || (th === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    $('meta[name="theme-color"]')?.setAttribute('content', dark ? '#121a15' : '#eef4ea');
  }

  /* ---------- Aktionen ---------- */
  function toggleChip(el, groupSel) {
    const v = Number(el.dataset.v);
    const box = el.closest(groupSel);
    let cur = null;
    $$('.mchip', box).forEach(b => {
      const on = b === el && !b.classList.contains('on');
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
      if (on) cur = v;
    });
    return cur;
  }
  function updateBadge() {
    const n = (ui.draft.mood ? 1 : 0) + ui.draft.tags.length;
    const b = $('.composer .badge');
    if (b) { b.textContent = n; b.hidden = !n; }
  }

  const actions = {
    nav: el => go(el.dataset.v),
    'prev-day': () => flip(-1, () => { ui.date = addDays(ui.date, -1); ui.editing = null; }),
    'next-day': () => { if (ui.date < todayKey()) flip(1, () => { ui.date = addDays(ui.date, 1); ui.editing = null; }); },
    'go-today': () => flip(1, () => { ui.date = todayKey(); ui.editing = null; }),
    'open-day': el => {
      const k = el.dataset.k;
      const dir = ui.view === 'today' ? (k < ui.date ? -1 : 1) : Math.sign(VIEWS.indexOf('today') - VIEWS.indexOf(ui.view));
      flip(dir, () => { ui.date = k; ui.view = 'today'; ui.editing = null; });
    },
    'goto-page': el => flip(1, () => { ui.pageIndex = Number(el.dataset.i); }),
    'page-prev': () => turnPage(-1),
    'toggle-moment': el => {
      const id = el.dataset.id;
      const open = !ui.openMoments.has(id);
      open ? ui.openMoments.add(id) : ui.openMoments.delete(id);
      const li = el.closest('.mitem');
      li.classList.toggle('open', open);
      $('.details', li)?.classList.toggle('open', open);
      el.setAttribute('aria-expanded', open);
    },
    'pcal-prev': () => { ui.pagesMonth = new Date(ui.pagesMonth.getFullYear(), ui.pagesMonth.getMonth() - 1, 1); render({ anim: false }); },
    'pcal-next': () => { ui.pagesMonth = new Date(ui.pagesMonth.getFullYear(), ui.pagesMonth.getMonth() + 1, 1); render({ anim: false }); },
    'next-quote': el => {
      ui.quoteShift++;
      const fig = el.closest('.quote');
      if (!fig) return;
      fig.outerHTML = dailyCorner();
      $('.quote')?.classList.add('swap');
    },
    'toggle-review': el => {
      ui.reviewOpen = !ui.reviewOpen;
      const panel = $('#review-panel');
      panel.classList.toggle('open', ui.reviewOpen);
      $('#review-body').classList.toggle('open', ui.reviewOpen);
      el.setAttribute('aria-expanded', ui.reviewOpen);
      if (ui.reviewOpen) $$('#review-body textarea').forEach(autosize);
    },
    'set-pref': el => {
      state.settings[el.dataset.pref] = el.dataset.val;
      persist();
      applyAppearance();
      render({ anim: false });
    },
    'apply-preset': el => {
      Object.assign(state.settings, PRESETS[el.dataset.preset]);
      persist();
      applyAppearance();
      render({ anim: false });
    },
    'set-corner': el => {
      state.settings.corner = el.dataset.corner;
      persist();
      $$('.seg-corner button').forEach(b => { const on = b.dataset.corner === state.settings.corner; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    },
    'page-next': () => turnPage(1),
    'open-book': () => openBook(),

    'toggle-details': el => {
      ui.detailsOpen = !ui.detailsOpen;
      $('#details').classList.toggle('open', ui.detailsOpen);
      $('.plus', el).classList.toggle('open', ui.detailsOpen);
      el.setAttribute('aria-expanded', ui.detailsOpen);
    },
    'pick-mood': el => { ui.draft.mood = toggleChip(el, '.mchips'); updateBadge(); },
    'pick-feel': el => {
      const scope = el.dataset.scope;
      const sel = scope === 'edit' ? ui.editFeel : ui.draftFeel;
      const key = el.dataset.feel;
      if (sel.feel === key) { sel.feel = null; sel.words = []; }
      else { sel.feel = key; sel.words = []; }
      refreshPicker(scope);
      const nb = $(`.feel[data-scope="${scope}"]`);
      nb?.querySelector('.feel-more')?.classList.add('appear');
      nb?.querySelector(`[data-feel="${key}"]`)?.focus();
    },
    'emoji-panel': el => {
      ui.emojiPanel = ui.emojiPanel === el.dataset.scope ? null : el.dataset.scope;
      refreshPicker(el.dataset.scope);
      $(`#${el.dataset.scope}-emoji-type`)?.focus();
    },
    'emoji-pick': el => addCustomFeel(el.dataset.scope, el.dataset.emoji, ($(`#${el.dataset.scope}-emoji-name`)?.value || '').trim()),
    'emoji-add': el => addCustomFeel(el.dataset.scope, $(`#${el.dataset.scope}-emoji-type`)?.value, ($(`#${el.dataset.scope}-emoji-name`)?.value || '').trim()),
    'emoji-remove': el => {
      state.settings.customFeels = customFeels().filter(c => c.emoji !== el.dataset.emoji);
      persist();
      refreshPicker(el.dataset.scope);
    },
    'today-sub': el => {
      const sub = el.dataset.sub;
      if (sub === ui.todaySub) return;
      flip(sub === 'plan' ? 1 : -1, () => { ui.todaySub = sub; ui.editing = null; });
    },
    'goto-moment': el => {
      ui.openMoments.add(el.dataset.id);
      flip(-1, () => { ui.todaySub = 'moments'; });
    },
    'add-todo': () => {
      const inp = $('#todo-input');
      const text = (inp?.value || '').trim();
      if (!text) { inp?.focus(); return; }
      (ensureDay(ui.date).todos ||= []).push({ id: uid(), text, state: 'open', prio: false });
      persist();
      render({ anim: false });
      $('#todo-input')?.focus();
    },
    'todo-toggle': el => {
      const x = (day(ui.date)?.todos || []).find(y => y.id === el.dataset.id);
      if (!x || x.state === 'moved') return;
      x.state = x.state === 'done' ? 'open' : 'done';
      persist();
      if (x.state === 'done') burst(el);
      render({ anim: false });
    },
    'todo-prio': el => {
      const x = (day(ui.date)?.todos || []).find(y => y.id === el.dataset.id);
      if (!x) return;
      x.prio = !x.prio;
      persist();
      render({ anim: false });
    },
    'todo-move': el => {
      const x = (day(ui.date)?.todos || []).find(y => y.id === el.dataset.id);
      if (!x || x.state !== 'open') return;
      x.state = 'moved';
      (ensureDay(addDays(ui.date, 1)).todos ||= []).push({ id: uid(), text: x.text, state: 'open', prio: !!x.prio, from: ui.date });
      persist();
      toast(t('movedToast'));
      render({ anim: false });
    },
    'todo-delete': el => {
      const d = day(ui.date);
      if (!d) return;
      d.todos = (d.todos || []).filter(y => y.id !== el.dataset.id);
      cleanup(ui.date);
      persist();
      render({ anim: false });
    },
    'carry-over': () => {
      const y = day(addDays(ui.date, -1));
      const open = (y?.todos || []).filter(x => x.state === 'open');
      const list = (ensureDay(ui.date).todos ||= []);
      open.forEach(x => { x.state = 'moved'; list.push({ id: uid(), text: x.text, state: 'open', prio: !!x.prio, from: addDays(ui.date, -1) }); });
      persist();
      render({ anim: false });
    },
    'toggle-word': el => {
      const sel = el.dataset.scope === 'edit' ? ui.editFeel : ui.draftFeel;
      const w = el.dataset.word;
      const i = sel.words.indexOf(w);
      i >= 0 ? sel.words.splice(i, 1) : sel.words.push(w);
      el.classList.toggle('on', i < 0);
      el.setAttribute('aria-pressed', i < 0);
    },
    'toggle-tag': el => {
      const tag = el.dataset.tag;
      const i = ui.draft.tags.indexOf(tag);
      i >= 0 ? ui.draft.tags.splice(i, 1) : ui.draft.tags.push(tag);
      el.classList.toggle('on', i < 0);
      el.setAttribute('aria-pressed', i < 0);
      updateBadge();
    },
    'save-moment': el => {
      const text = ($('#moment-text')?.value || '').trim();
      const title = ($('#moment-title')?.value || '').trim();
      const df = ui.draftFeel;
      if (!text && !title && !df.feel && !df.note.trim()) { shake($('#composer')); toast(t('writeSomething')); $('#moment-text')?.focus(); return; }
      const now = new Date();
      const tv = $('#moment-time')?.value || '';
      let time = now.getTime();
      if (tv && (ui.draft.time || ui.date !== todayKey())) time = timeOn(ui.date, tv);
      const fi = feelInfo(df.feel, df.name);
      const m = { id: uid(), time, title, text, mood: fi && fi.mood ? fi.mood : null, feel: df.feel, feelName: fi?.custom ? fi.name : '', feelWords: [...df.words], feelNote: df.note.trim(), tags: [...ui.draft.tags] };
      ensureDay(ui.date).moments.push(m);
      persist();
      burst(el);
      ui.draft = { title: '', time: '', text: '', mood: null, tags: [] };
      ui.draftFeel = { feel: null, words: [], note: '' };
      ui.emojiPanel = null;
      ui.detailsOpen = false;
      ui.justAdded = m.id;
      render({ anim: false });
      toast(t('saved'));
    },

    'edit-moment': el => {
      const m = day(ui.date)?.moments.find(x => x.id === el.dataset.id);
      if (!m) return;
      ui.editing = m.id;
      ui.editFeel = { feel: m.feel || null, name: m.feelName || '', words: [...(m.feelWords || [])], note: m.feelNote || '' };
      ui.emojiPanel = null;
      render({ anim: false });
    },
    'edit-mood': el => {
      ui.editMood = toggleChip(el, '.mchips');

    },
    'cancel-edit': () => { ui.editing = null; render({ anim: false }); },
    'save-edit': el => {
      const m = day(ui.date)?.moments.find(x => x.id === el.dataset.id);
      const text = ($('#edit-text')?.value || '').trim();
      const title = ($('#edit-title')?.value || '').trim();
      if (!m) return;
      const ef = ui.editFeel;
      if (!text && !title && !ef.feel && !m.mood && !ef.note.trim()) { shake(el.closest('.mbody')); toast(t('writeSomething')); return; }
      const tv = $('#edit-time')?.value || '';
      const newTime = tv && tv !== hhmm(new Date(m.time)) ? timeOn(ui.date, tv) : m.time;
      const feelChanged = ef.feel !== (m.feel || null) || (ef.name || '') !== (m.feelName || '') || ef.note.trim() !== (m.feelNote || '') || ef.words.join('|') !== (m.feelWords || []).join('|');
      if (text !== m.text || title !== (m.title || '') || feelChanged || newTime !== m.time) {
        m.text = text;
        m.title = title;
        m.time = newTime;
        if (ef.feel || m.feel) { const fi = feelInfo(ef.feel, ef.name); m.feel = ef.feel; m.mood = fi && fi.mood ? fi.mood : null; m.feelName = fi?.custom ? fi.name : ''; }
        m.feelWords = ef.feel ? [...ef.words] : [];
        m.feelNote = ef.note.trim();
        m.editedAt = Date.now();
        persist();
        toast(t('edited'));
      }
      ui.editing = null;
      ui.openMoments.add(m.id);
      render({ anim: false });
    },
    'delete-moment': async el => {
      if (!(await ask(t('confirmDelete'), t('delete')))) return;
      const id = el.dataset.id;
      const li = el.closest('.mitem');
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
      burst(el);
      celebrate(t('reviewSaved'));
      ui.reviewOpen = false;
      render({ anim: false });
    },

    'prev-month': () => { ui.calMonth = new Date(ui.calMonth.getFullYear(), ui.calMonth.getMonth() - 1, 1); render({ anim: false }); animateGrid(); },
    'next-month': () => { ui.calMonth = new Date(ui.calMonth.getFullYear(), ui.calMonth.getMonth() + 1, 1); render({ anim: false }); animateGrid(); },

    'set-lang': el => { state.settings.lang = el.dataset.lang; persist(); render({ anim: false }); },
    'set-theme': el => {
      state.settings.theme = el.dataset.theme;
      persist();
      applyTheme();
      $$('.seg-theme button').forEach(b => { const on = b.dataset.theme === state.settings.theme; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    },
    export: () => {
      const json = JSON.stringify({ app: 'momente', version: 1, exportedAt: new Date().toISOString(), ...state }, null, 2);
      // In eingebetteten Seiten sind Downloads gesperrt → Sicherung in die Zwischenablage
      if (window.self !== window.top && navigator.clipboard) {
        navigator.clipboard.writeText(json).then(() => toast(t('copied')), () => toast(t('storageError')));
        return;
      }
      const blob = new Blob([json], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `momente-${todayKey()}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    },
    import: () => $('#import-file')?.click(),
    wipe: async () => {
      if (!(await ask(t('wipeConfirm'), t('wipe')))) return;
      state.days = {};
      persist();
      toast(t('wiped'));
      render({ anim: false });
    },

    'onb-lang': el => { ui.onbLang = el.dataset.lang; renderCover(true); render({ anim: false }); },
    'onb-start': () => {
      state.settings.lang = ui.onbLang;
      state.settings.name = ($('#onb-name')?.value || '').trim();
      persist();
      render();
      openBook();
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
              cur.moments.push({ id: String(m.id), time: m.time, title: String(m.title || '').slice(0, 80), text: String(m.text || ''), feel: (FEEL[m.feel] || (typeof m.feel === 'string' && m.feel.startsWith('c:'))) ? m.feel : null, feelName: String(m.feelName || '').slice(0, 24), feelWords: Array.isArray(m.feelWords) ? m.feelWords.map(String).slice(0, 12) : [], feelNote: String(m.feelNote || ''), mood: [1, 2, 3, 4, 5].includes(m.mood) ? m.mood : null, tags: Array.isArray(m.tags) ? m.tags.filter(x => TAGS.includes(x)) : [], ...(m.editedAt ? { editedAt: Number(m.editedAt) } : {}) });
            }
          }
          if (d.review && typeof d.review === 'object' && !reviewFilled(cur.review)) cur.review = d.review;
          if (Array.isArray(d.todos)) { const ids = new Set((cur.todos || []).map(x => x.id)); cur.todos = [...(cur.todos || []), ...d.todos.filter(x => x && x.id && !ids.has(x.id)).map(x => ({ id: String(x.id), text: String(x.text || ''), state: ['open', 'done', 'moved'].includes(x.state) ? x.state : 'open', prio: !!x.prio }))]; }
          if (d.plan && typeof d.plan === 'object') { cur.plan = { ...(cur.plan || {}) }; for (const [h, v] of Object.entries(d.plan)) if (/^\d\d$/.test(h) && !cur.plan[h]) cur.plan[h] = String(v); }
          if (typeof d.title === 'string' && !(cur.title || '').trim()) cur.title = d.title.slice(0, 80);
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
    else if (el.id === 'moment-title') ui.draft.title = el.value;
    else if (el.id === 'moment-time') ui.draft.time = el.value;
    else if (el.id === 'draft-feelnote') ui.draftFeel.note = el.value;
    else if (el.classList.contains('hinput')) {
      const d = ensureDay(ui.date);
      d.plan ||= {};
      if (el.value.trim()) d.plan[el.dataset.hour] = el.value; else delete d.plan[el.dataset.hour];
      cleanup(ui.date);
      persist(false);
    }
    else if (el.classList.contains('tinput')) {
      const x = (day(ui.date)?.todos || []).find(y => y.id === el.dataset.id);
      if (x) { x.text = el.value; persist(false); }
    }
    else if (el.id === 'edit-feelnote') ui.editFeel.note = el.value;
    else if (el.id === 'search') runSearch(el.value);
    else if (el.id === 'day-title') { ensureDay(ui.date).title = el.value; cleanup(ui.date); persist(false); }
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
    if (e.target.id === 'plan-start') { state.settings.planStart = Number(e.target.value); persist(); }
    if (e.target.id === 'plan-end') { state.settings.planEnd = Number(e.target.value); persist(); }
    if (e.target.id === 'import-file' && e.target.files[0]) { importFile(e.target.files[0]); e.target.value = ''; }
  });

  document.addEventListener('keydown', e => {
    const mod = e.key === 'Enter' && (e.metaKey || e.ctrlKey);
    if (e.target.id === 'todo-input' && e.key === 'Enter') { e.preventDefault(); actions['add-todo'](); return; }
    if (e.target.classList?.contains('hinput') && e.key === 'Enter') { e.preventDefault(); const all = $$('.hinput'); const i = all.indexOf(e.target); all[i + 1]?.focus(); return; }
    if (/-emoji-(type|name)$/.test(e.target.id || '') && e.key === 'Enter') { e.preventDefault(); const sc = e.target.id.split('-')[0]; addCustomFeel(sc, $(`#${sc}-emoji-type`)?.value, ($(`#${sc}-emoji-name`)?.value || '').trim()); }
    else if ((e.target.id === 'moment-text' || e.target.id === 'moment-title') && mod) { e.preventDefault(); actions['save-moment']($('[data-action="save-moment"]')); }
    else if ((e.target.id === 'edit-text' || e.target.id === 'edit-title') && mod) { e.preventDefault(); actions['save-edit']($('[data-action="save-edit"]')); }
    else if (e.target.id === 'edit-text' && e.key === 'Escape') actions['cancel-edit']();
    else if (e.target.classList?.contains('cover') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openBook(); }
    else if (ui.view === 'pages' && !/INPUT|TEXTAREA/.test(e.target.tagName) && !$('.modal') && !$('#cover .cover')) {
      if (e.key === 'ArrowRight') turnPage(1);
      if (e.key === 'ArrowLeft') turnPage(-1);
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
  wideMQ.addEventListener?.('change', () => render({ anim: false }));

  /* ---------- Start ---------- */
  applyTheme();
  buildNav();
  render();
  const firstRun = !state.settings.lang;
  if (firstRun || (!session.get('momente.opened') && !prefersReduced())) renderCover(firstRun);

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && window.self === window.top) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
