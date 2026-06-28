/* =====================================================================
   WHISPER LIST — script.js
   Aplikasi multi-halaman (hash router). Auth + data lokal (localStorage).
   Catatan: auth ini bersifat LOKAL/offline — bukan akun cloud.
   ===================================================================== */

(() => {
  "use strict";

  const USERS_KEY = "whisperList_users";
  const SESSION_KEY = "whisperList_session";
  const dataKey = (email) => "whisperList_data::" + email;

  /* ---------- Ikon SVG ---------- */
  const ICONS = {
    feather: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 3.8a5 5 0 0 0-7 0L4 13v7h7l9.2-9.2a5 5 0 0 0 0-7z"/><path d="M16 8 6 18M14 5l-2 2M19 10l-2 2"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 8-4 13-9 13z"/><path d="M4 20c2.5-5 6-7.5 11-9"/></svg>',
    crescent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 11 4a6.5 6.5 0 0 0 9 10.5z"/><path d="M18 3l.6 1.6L20 5l-1.4.4L18 7l-.6-1.6L16 5l1.4-.4z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v5H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M19 8v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7z"/><path d="M9 12h6M9 16h4"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    checkSmall: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4M4 4h12l-2 4 2 4H4"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z"/></svg>'
  };

  /* ---------- Util tanggal ---------- */
  const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const DAYS_FULL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const pad = (n) => String(n).padStart(2, "0");
  const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseKey = (k) => { const [y, m, dd] = k.split("-").map(Number); return new Date(y, m - 1, dd); };
  const todayKey = () => keyOf(new Date());
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  function startOfWeek(d) {
    const x = new Date(d); const day = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - day); x.setHours(0, 0, 0, 0); return x;
  }
  const fmtLong = (d) => `${DAYS_FULL[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  const fmtShort = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  function greeting() {
    const h = new Date().getHours();
    if (h < 11) return "Selamat pagi";
    if (h < 15) return "Selamat siang";
    if (h < 19) return "Selamat sore";
    return "Selamat malam";
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------- State default ---------- */
  const DEFAULT_HABITS = [
    "Minum air putih (8 gelas)", "Olahraga / gerak ≥ 15 menit",
    "Makan buah & sayur", "Tidur 7–8 jam", "Kurangi gawai sebelum tidur"
  ];
  const DEFAULT_IBADAH = [
    "Sholat Subuh", "Sholat Dzuhur", "Sholat Ashar", "Sholat Maghrib", "Sholat Isya",
    "Tilawah Al-Qur'an", "Dzikir pagi & petang"
  ];
  function freshState() {
    return {
      days: {}, weekly: {},
      habits: DEFAULT_HABITS.slice(), ibadahItems: DEFAULT_IBADAH.slice(),
      notes: []
    };
  }

  /* ---------- Variabel sesi ---------- */
  let currentUser = null;     // { email, name }
  let state = freshState();
  let selectedKey = todayKey();
  let viewWeekStart = startOfWeek(new Date());
  let calMonth = new Date(); calMonth.setDate(1);
  let editingId = null;
  let currentRoute = "dashboard";

  /* ---------- Util DOM ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const page = () => $("#page");
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* =====================================================================
     AUTENTIKASI (lokal)
     ===================================================================== */
  function getUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; } }
  function setUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

  async function hashPass(salt, password) {
    const data = new TextEncoder().encode(salt + ":" + password);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function randSalt() {
    const a = new Uint8Array(16); crypto.getRandomValues(a);
    return [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function register(name, email, password) {
    email = email.trim().toLowerCase();
    const users = getUsers();
    if (users[email]) throw new Error("Email ini sudah terdaftar. Silakan masuk.");
    const salt = randSalt();
    users[email] = { name: name.trim(), salt, hash: await hashPass(salt, password) };
    setUsers(users);
    return email;
  }
  async function login(email, password) {
    email = email.trim().toLowerCase();
    const users = getUsers();
    const u = users[email];
    if (!u) throw new Error("Email belum terdaftar. Daftar dulu, yuk.");
    const h = await hashPass(u.salt, password);
    if (h !== u.hash) throw new Error("Kata sandi salah.");
    return email;
  }
  function startSession(email) {
    const users = getUsers();
    currentUser = { email, name: users[email]?.name || email };
    localStorage.setItem(SESSION_KEY, email);
    state = loadData(email);
    selectedKey = todayKey();
    viewWeekStart = startOfWeek(new Date());
    calMonth = new Date(); calMonth.setDate(1);
    showApp();
  }
  function logout() {
    localStorage.removeItem(SESSION_KEY);
    currentUser = null; state = freshState();
    showAuth();
  }

  /* ---------- Persistensi data (per pengguna) ---------- */
  function loadData(email) {
    try {
      const raw = localStorage.getItem(dataKey(email));
      if (!raw) return freshState();
      const d = JSON.parse(raw); const base = freshState();
      return {
        days: d.days || {}, weekly: d.weekly || {},
        habits: (Array.isArray(d.habits) && d.habits.length) ? d.habits : base.habits,
        ibadahItems: (Array.isArray(d.ibadahItems) && d.ibadahItems.length) ? d.ibadahItems : base.ibadahItems,
        notes: Array.isArray(d.notes) ? d.notes : []
      };
    } catch { return freshState(); }
  }
  function save() {
    if (!currentUser) return;
    try { localStorage.setItem(dataKey(currentUser.email), JSON.stringify(state)); }
    catch { toast("Gagal menyimpan data."); }
  }

  /* ---------- Akses data ---------- */
  function dayData(k) {
    if (!state.days[k]) state.days[k] = { todos: [], health: {}, ibadah: {}, haid: false };
    const d = state.days[k];
    d.todos = d.todos || []; d.health = d.health || {}; d.ibadah = d.ibadah || {};
    if (typeof d.haid !== "boolean") d.haid = false;
    return d;
  }
  function weekData(weekKey) {
    if (!state.weekly[weekKey]) state.weekly[weekKey] = { learn: [] };
    state.weekly[weekKey].learn = state.weekly[weekKey].learn || [];
    return state.weekly[weekKey];
  }
  const currentWeekKey = () => keyOf(viewWeekStart);
  const isSholat = (name) => /^sholat\b/i.test(name);

  /* =====================================================================
     KOMPONEN HTML
     ===================================================================== */
  function weekStripHTML() {
    const end = addDays(viewWeekStart, 6);
    const sameMonth = viewWeekStart.getMonth() === end.getMonth();
    const range = sameMonth
      ? `${viewWeekStart.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`
      : `${fmtShort(viewWeekStart)} – ${fmtShort(end)} ${end.getFullYear()}`;
    let pills = "";
    for (let i = 0; i < 7; i++) {
      const d = addDays(viewWeekStart, i), k = keyOf(d);
      const todos = (state.days[k] && state.days[k].todos) || [];
      const total = todos.length, done = todos.filter((t) => t.done).length;
      let dot = "day__dot";
      if (total > 0 && done === total) dot += " day__dot--done";
      else if (done > 0) dot += " day__dot--partial";
      let cls = "day";
      if (k === selectedKey) cls += " day--selected";
      if (k === todayKey()) cls += " day--today";
      pills += `<button type="button" class="${cls}" data-day="${k}">
        <span class="day__name">${DAYS_SHORT[d.getDay()]}</span>
        <span class="day__num">${d.getDate()}</span><span class="${dot}"></span></button>`;
    }
    return `<div class="weeknav">
      <button class="weeknav__arrow" data-week="-1" aria-label="Pekan sebelumnya">${ICONS.chevL}</button>
      <div class="weeknav__body"><div class="weeknav__range">${range}</div>
      <div class="weeknav__strip">${pills}</div></div>
      <button class="weeknav__arrow" data-week="1" aria-label="Pekan berikutnya">${ICONS.chevR}</button></div>`;
  }

  function cardHead(icon, title, hint, right = "") {
    return `<div class="card__head"><span class="chip">${ICONS[icon]}</span>
      <div class="card__titles"><h2 class="card__title">${title}</h2>
      <p class="card__hint">${hint}</p></div>${right}</div>`;
  }
  function quickAddHTML(kind, placeholder, ghost = false) {
    return `<form class="quickadd${ghost ? " quickadd--ghost" : ""}" data-add="${kind}" autocomplete="off">
      <input class="quickadd__input" type="text" placeholder="${placeholder}" aria-label="${placeholder}" />
      <button class="quickadd__btn" type="submit" aria-label="Tambah">${ICONS.plus}</button></form>`;
  }

  function todoRowHTML(t, k, opts = {}) {
    const editing = editingId === t.id;
    const sub = opts.showDate
      ? `<span class="item__sub">${DAYS_SHORT[parseKey(k).getDay()]}, ${fmtShort(parseKey(k))}</span>` : "";
    const mid = editing
      ? `<input class="item__edit" data-act="edit-input" value="${escapeHtml(t.text)}" />`
      : `<span class="item__text">${escapeHtml(t.text)}${sub}</span>`;
    const flag = opts.flag
      ? `<button class="iconbtn iconbtn--flag${t.urgent ? " on" : ""}" type="button" data-act="flag" aria-label="Tandai urgen">${ICONS.flag}</button>` : "";
    return `<li class="item${t.done ? " done" : ""}" data-id="${t.id}" data-key="${k}">
      <button class="tick${t.done ? " on" : ""}" type="button" data-act="toggle" aria-label="Tandai selesai">${ICONS.checkSmall}</button>
      ${mid}${flag}
      <button class="iconbtn" type="button" data-act="edit" aria-label="Edit">${ICONS.edit}</button>
      <button class="iconbtn iconbtn--danger" type="button" data-act="delete" aria-label="Hapus">${ICONS.trash}</button></li>`;
  }
  function listHTML(items, k, opts, empty) {
    if (!items.length) return `<ul class="list"><li class="empty">${empty}</li></ul>`;
    return `<ul class="list">${items.map((t) => todoRowHTML(t, k, opts)).join("")}</ul>`;
  }

  /* =====================================================================
     HALAMAN
     ===================================================================== */
  function pageDashboard() {
    const k = todayKey();
    const todos = dayData(k).todos;
    const urgent = [];
    Object.keys(state.days).forEach((dk) => dayData(dk).todos.forEach((t) => { if (t.urgent && !t.done) urgent.push({ t, k: dk }); }));
    urgent.sort((a, b) => a.k.localeCompare(b.k));
    const urgentRows = urgent.length
      ? `<ul class="list">${urgent.map(({ t, k }) => todoRowHTML(t, k, { flag: true, showDate: true })).join("")}</ul>`
      : `<ul class="list"><li class="empty">Tidak ada hal mendesak. Tetap tenang.</li></ul>`;

    const tiles = [
      ["kalender", "calendar", "Kalender", "Lihat seluruh bulan"],
      ["todo", "check", "To-Do List", "Kelola semua tugas"],
      ["pencapaian", "trophy", "Pencapaian", "Yang sudah selesai"],
      ["sehat", "leaf", "Hidup Sehat", "Kebiasaan baik"],
      ["ibadah", "crescent", "Ibadah", "Catatan harian"],
      ["belajar", "book", "Tools Belajar", "Target pekan ini"],
      ["catatan", "note", "Catatan Cepat", "Biar tak lupa"]
    ].map(([route, icon, name, sub]) =>
      `<a class="tile" href="#/${route}" data-nav="${route}"><span class="tile__chip" data-accent="${route}">${ICONS[icon]}</span>
       <span class="tile__name">${name}</span><span class="tile__sub">${sub}</span></a>`).join("");

    return `<section class="hero">
        <p class="hero__hi">${greeting()}, ${escapeHtml(currentUser.name)}</p>
        <h1 class="hero__date">${fmtLong(new Date())}</h1>
      </section>
      <div class="grid2">
        <article class="card card--urgent" data-accent="urgent">
          ${cardHead("alert", "Hal Urgen", "Wajib diselesaikan segera", `<span class="badge">${urgent.length}</span>`)}
          ${quickAddHTML("urgent", "Tambah hal mendesak…")}
          ${urgentRows}
        </article>
        <article class="card" data-accent="today">
          ${cardHead("sun", "Kegiatan Hari Ini", fmtLong(new Date()), `<span class="badge">${todos.filter((t) => !t.done).length}</span>`)}
          ${quickAddHTML("today", "Tambah kegiatan hari ini…")}
          ${listHTML(todos, k, { flag: true }, "Belum ada kegiatan hari ini.")}
        </article>
      </div>
      <h2 class="section-title">Jelajahi</h2>
      <div class="tiles">${tiles}</div>`;
  }

  function pageCalendar() {
    const first = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1);
    const lead = (first.getDay() + 6) % 7; // Senin awal
    const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();
    let cells = "";
    for (let i = 0; i < lead; i++) cells += `<div class="cal__cell cal__cell--empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(calMonth.getFullYear(), calMonth.getMonth(), d);
      const k = keyOf(date);
      const todos = (state.days[k] && state.days[k].todos) || [];
      const total = todos.length, done = todos.filter((t) => t.done).length;
      let dot = "";
      if (total) dot = `<span class="cal__dot ${done === total ? "cal__dot--done" : (done ? "cal__dot--partial" : "")}"></span>`;
      let cls = "cal__cell";
      if (k === todayKey()) cls += " cal__cell--today";
      if (k === selectedKey) cls += " cal__cell--selected";
      cells += `<button type="button" class="${cls}" data-cal="${k}">
        <span class="cal__num">${d}</span>${dot}
        ${total ? `<span class="cal__count">${done}/${total}</span>` : ""}</button>`;
    }
    const dows = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map((x) => `<span class="cal__dow">${x}</span>`).join("");
    return `<div class="pagehead"><h1 class="pagehead__title">${ICONS.calendar}<span>Kalender</span></h1>
        <p class="pagehead__sub">Pilih tanggal untuk membuka tugasnya.</p></div>
      <article class="card" data-accent="today">
        <div class="cal__bar">
          <button class="weeknav__arrow" data-month="-1" aria-label="Bulan sebelumnya">${ICONS.chevL}</button>
          <div class="cal__month">${MONTHS[calMonth.getMonth()]} ${calMonth.getFullYear()}</div>
          <button class="weeknav__arrow" data-month="1" aria-label="Bulan berikutnya">${ICONS.chevR}</button>
        </div>
        <div class="cal__dows">${dows}</div>
        <div class="cal__grid">${cells}</div>
        <div class="cal__legend">
          <span><i class="cal__dot cal__dot--partial"></i> sebagian selesai</span>
          <span><i class="cal__dot cal__dot--done"></i> semua selesai</span>
        </div>
      </article>`;
  }

  function pageTodo() {
    const k = selectedKey;
    const todos = dayData(k).todos;
    const isToday = k === todayKey();
    return `<div class="pagehead"><h1 class="pagehead__title">${ICONS.check}<span>To-Do List</span></h1>
        <p class="pagehead__sub">${isToday ? "Tugas hari ini" : "Tugas untuk " + fmtLong(parseKey(k))}</p></div>
      ${weekStripHTML()}
      <article class="card" data-accent="todo">
        ${cardHead("check", "Daftar Tugas", isToday ? "Hari ini" : fmtShort(parseKey(k)), `<span class="badge">${todos.filter((t) => !t.done).length}</span>`)}
        ${quickAddHTML("todo", "Tambah tugas baru…")}
        ${listHTML(todos, k, { flag: true }, "Belum ada tugas. Tambahkan satu di atas.")}
      </article>`;
  }

  function pageAchievements() {
    let total = 0, done = 0; const completed = [];
    for (let i = 0; i < 7; i++) {
      const k = keyOf(addDays(viewWeekStart, i)); const dd = state.days[k];
      if (!dd) continue;
      (dd.todos || []).forEach((t) => { total++; if (t.done) { done++; completed.push({ t, k }); } });
    }
    const pct = total ? Math.round((done / total) * 100) : 0;
    const items = completed.length
      ? completed.map(({ t, k }) => `<li class="item done"><span class="tick on">${ICONS.checkSmall}</span>
          <span class="item__text">${escapeHtml(t.text)}<span class="item__sub">${DAYS_SHORT[parseKey(k).getDay()]}, ${fmtShort(parseKey(k))}</span></span></li>`).join("")
      : `<li class="empty">Selesaikan tugas, pencapaianmu muncul di sini.</li>`;
    return `<div class="pagehead"><h1 class="pagehead__title">${ICONS.trophy}<span>Pencapaian Minggu Ini</span></h1>
        <p class="pagehead__sub">Hal yang sudah berhasil kamu selesaikan.</p></div>
      ${weekStripHTML()}
      <article class="card" data-accent="win">
        <div class="progress"><div class="progress__row"><span>${done} dari ${total} tugas selesai</span>
          <span class="progress__pct">${pct}%</span></div>
          <div class="progress__track"><div class="progress__fill" style="width:${pct}%"></div></div></div>
        <ul class="list list--compact">${items}</ul>
      </article>`;
  }

  function checklistHTML(items, store, kind, haid) {
    if (!items.length) return `<ul class="checklist"><li class="empty">Belum ada item.</li></ul>`;
    return `<ul class="checklist">${items.map((name) => {
      const excused = haid && isSholat(name);
      const on = !!store[name] && !excused;
      return `<li class="habit${on ? " on" : ""}${excused ? " habit--excused" : ""}" data-kind="${kind}" data-name="${escapeHtml(name)}">
        <button class="tick${on ? " on" : ""}" type="button" data-act="toggle" ${excused ? "disabled" : ""} aria-label="Tandai">${ICONS.checkSmall}</button>
        <span class="habit__label">${escapeHtml(name)}${excused ? ' <em class="udzur">udzur</em>' : ""}</span>
        <button class="iconbtn iconbtn--danger" type="button" data-act="remove" aria-label="Hapus">${ICONS.trash}</button></li>`;
    }).join("")}</ul>`;
  }
  function ringStyle(items, store, haid) {
    const applicable = items.filter((n) => !(haid && isSholat(n)));
    const total = applicable.length;
    const done = applicable.filter((n) => store[n]).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { style: `--p:${pct}`, text: `${done}/${total}` };
  }

  function pageHealth() {
    const k = selectedKey, dd = dayData(k);
    const r = ringStyle(state.habits, dd.health, false);
    return `<div class="pagehead"><h1 class="pagehead__title">${ICONS.leaf}<span>Hidup Sehat</span></h1>
        <p class="pagehead__sub">Kebiasaan baik ${k === todayKey() ? "hari ini" : "pada " + fmtShort(parseKey(k))}.</p></div>
      ${weekStripHTML()}
      <article class="card" data-accent="health">
        ${cardHead("leaf", "Checklist Harian", "Centang yang sudah dilakukan", `<span class="ring" style="${r.style}">${r.text}</span>`)}
        ${checklistHTML(state.habits, dd.health, "health", false)}
        ${quickAddHTML("health", "Tambah kebiasaan sehat…", true)}
      </article>`;
  }

  function pageIbadah() {
    const k = selectedKey, dd = dayData(k);
    const r = ringStyle(state.ibadahItems, dd.ibadah, dd.haid);
    return `<div class="pagehead"><h1 class="pagehead__title">${ICONS.crescent}<span>Ibadah</span></h1>
        <p class="pagehead__sub">Catatan ibadah ${k === todayKey() ? "hari ini" : "pada " + fmtShort(parseKey(k))}.</p></div>
      ${weekStripHTML()}
      <article class="card" data-accent="ibadah">
        ${cardHead("crescent", "Amalan Harian", "Centang yang sudah ditunaikan", `<span class="ring" style="${r.style}">${r.text}</span>`)}
        <div class="haid${dd.haid ? " on" : ""}" data-act="haid">
          <span class="haid__ic">${ICONS.drop}</span>
          <div class="haid__txt"><strong>Sedang haid (udzur)</strong>
            <span>Sholat wajib ditandai gugur sementara untuk hari ini.</span></div>
          <span class="switch${dd.haid ? " on" : ""}" aria-hidden="true"><span class="switch__dot"></span></span>
        </div>
        ${checklistHTML(state.ibadahItems, dd.ibadah, "ibadah", dd.haid)}
        ${quickAddHTML("ibadah", "Tambah amalan…", true)}
      </article>`;
  }

  function pageLearn() {
    const learn = weekData(currentWeekKey()).learn;
    const end = addDays(viewWeekStart, 6);
    const range = `${fmtShort(viewWeekStart)} – ${fmtShort(end)}`;
    const rows = learn.length ? learn.map((t) => {
      const editing = editingId === t.id;
      const mid = editing
        ? `<input class="item__edit" data-act="edit-input" value="${escapeHtml(t.text)}" />`
        : `<span class="item__text">${escapeHtml(t.text)}</span>`;
      return `<li class="item${t.done ? " done" : ""}" data-id="${t.id}" data-learn="1">
        <button class="tick${t.done ? " on" : ""}" type="button" data-act="toggle" aria-label="Tandai">${ICONS.checkSmall}</button>
        ${mid}
        <button class="iconbtn" type="button" data-act="edit" aria-label="Edit">${ICONS.edit}</button>
        <button class="iconbtn iconbtn--danger" type="button" data-act="delete" aria-label="Hapus">${ICONS.trash}</button></li>`;
    }).join("") : `<li class="empty">Belum ada target. mis. “Menulis essay untuk lomba”.</li>`;
    return `<div class="pagehead"><h1 class="pagehead__title">${ICONS.book}<span>Tools Belajar</span></h1>
        <p class="pagehead__sub">Target belajar untuk pekan ${range}.</p></div>
      <div class="weeknav weeknav--simple">
        <button class="weeknav__arrow" data-week="-1" aria-label="Pekan sebelumnya">${ICONS.chevL}</button>
        <div class="weeknav__range">Pekan ${range}</div>
        <button class="weeknav__arrow" data-week="1" aria-label="Pekan berikutnya">${ICONS.chevR}</button></div>
      <article class="card" data-accent="learn">
        ${cardHead("book", "Target Pekan Ini", "Tambah & tandai progres", `<span class="badge">${learn.filter((t) => !t.done).length}</span>`)}
        ${quickAddHTML("learn", "mis. Menulis essay untuk lomba…")}
        <ul class="list">${rows}</ul>
      </article>`;
  }

  function pageNotes() {
    const notes = state.notes.length
      ? state.notes.map((n) => `<div class="sticky" data-id="${n.id}">${escapeHtml(n.text)}
          <button class="sticky__del" type="button" data-act="delete" aria-label="Hapus">${ICONS.x}</button></div>`).join("")
      : `<p class="empty">Catatan kecilmu akan tampil di sini.</p>`;
    return `<div class="pagehead"><h1 class="pagehead__title">${ICONS.note}<span>Catatan Cepat</span></h1>
        <p class="pagehead__sub">Ruang untuk hal-hal yang mudah lupa.</p></div>
      <article class="card" data-accent="note">
        ${quickAddHTML("note", "Tulis catatan kecil…")}
        <div class="notes">${notes}</div>
      </article>`;
  }

  /* ---------- Router ---------- */
  const ROUTES = {
    dashboard: pageDashboard, kalender: pageCalendar, todo: pageTodo,
    pencapaian: pageAchievements, sehat: pageHealth, ibadah: pageIbadah,
    belajar: pageLearn, catatan: pageNotes
  };
  function parseRoute() {
    const h = (location.hash || "").replace(/^#\/?/, "").split("?")[0];
    return ROUTES[h] ? h : "dashboard";
  }
  function renderRoute() {
    currentRoute = parseRoute();
    editingId = null;
    page().innerHTML = ROUTES[currentRoute]();
    page().scrollIntoView({ block: "start" });
    paintNav();
    focusFirstField();
  }
  function focusFirstField() { /* tidak auto-fokus agar tidak ganggu mobile */ }

  function paintNav() {
    const nav = $("#nav");
    const links = [
      ["dashboard", "home", "Dashboard"], ["kalender", "calendar", "Kalender"],
      ["todo", "check", "To-Do"], ["pencapaian", "trophy", "Pencapaian"],
      ["sehat", "leaf", "Sehat"], ["ibadah", "crescent", "Ibadah"],
      ["belajar", "book", "Belajar"], ["catatan", "note", "Catatan"]
    ];
    nav.innerHTML = links.map(([r, ic, label]) =>
      `<a class="navlink${r === currentRoute ? " is-active" : ""}" href="#/${r}" data-nav="${r}">
        <span class="navlink__ic">${ICONS[ic]}</span><span>${label}</span></a>`).join("");
  }

  /* ---------- Re-render halaman aktif ---------- */
  function refresh() { page().innerHTML = ROUTES[currentRoute](); }

  /* =====================================================================
     PENCARIAN & MUTASI DATA
     ===================================================================== */
  function findTodo(id) {
    for (const k of Object.keys(state.days)) {
      const arr = state.days[k].todos || [];
      const idx = arr.findIndex((t) => t.id === id);
      if (idx > -1) return { arr, idx, obj: arr[idx], k };
    }
    return null;
  }
  function findLearn(id) {
    const arr = weekData(currentWeekKey()).learn;
    const idx = arr.findIndex((t) => t.id === id);
    return idx > -1 ? { arr, idx, obj: arr[idx] } : null;
  }

  function handleAdd(kind, text) {
    if (kind === "today") dayData(todayKey()).todos.push({ id: uid(), text, done: false, urgent: false });
    else if (kind === "todo") dayData(selectedKey).todos.push({ id: uid(), text, done: false, urgent: false });
    else if (kind === "urgent") { dayData(currentRoute === "dashboard" ? todayKey() : selectedKey).todos.push({ id: uid(), text, done: false, urgent: true }); toast("Ditandai sebagai hal urgen."); }
    else if (kind === "learn") weekData(currentWeekKey()).learn.push({ id: uid(), text, done: false });
    else if (kind === "note") state.notes.unshift({ id: uid(), text });
    else if (kind === "health") { if (!state.habits.includes(text)) state.habits.push(text); }
    else if (kind === "ibadah") { if (!state.ibadahItems.includes(text)) state.ibadahItems.push(text); }
    save(); refresh();
  }

  function commitEdit(input) {
    const li = input.closest(".item"); const val = input.value.trim();
    if (li.dataset.learn) { const f = findLearn(li.dataset.id); if (f && val) f.obj.text = val; }
    else { const f = findTodo(li.dataset.id); if (f && val) f.obj.text = val; }
    editingId = null; save(); refresh();
  }

  /* =====================================================================
     EVENT DELEGATION (di #page, dipasang sekali)
     ===================================================================== */
  function wirePage() {
    const root = page();

    root.addEventListener("submit", (e) => {
      const form = e.target.closest("form[data-add]");
      if (!form) return;
      e.preventDefault();
      const input = form.querySelector(".quickadd__input");
      const val = input.value.trim();
      if (val) handleAdd(form.dataset.add, val);
    });

    root.addEventListener("click", (e) => {
      // navigasi tile (link punya href, biarkan default kecuali perlu)
      const dayBtn = e.target.closest("[data-day]");
      if (dayBtn) { selectedKey = dayBtn.dataset.day; if (parseKey(selectedKey) < viewWeekStart || parseKey(selectedKey) > addDays(viewWeekStart,6)) viewWeekStart = startOfWeek(parseKey(selectedKey)); refresh(); return; }

      const calBtn = e.target.closest("[data-cal]");
      if (calBtn) { selectedKey = calBtn.dataset.cal; viewWeekStart = startOfWeek(parseKey(selectedKey)); location.hash = "#/todo"; return; }

      const wk = e.target.closest("[data-week]");
      if (wk) { viewWeekStart = addDays(viewWeekStart, parseInt(wk.dataset.week,10) * 7); refresh(); return; }

      const mo = e.target.closest("[data-month]");
      if (mo) { calMonth.setMonth(calMonth.getMonth() + parseInt(mo.dataset.month,10)); refresh(); return; }

      const haid = e.target.closest("[data-act='haid']");
      if (haid) { const dd = dayData(selectedKey); dd.haid = !dd.haid; save(); refresh(); return; }

      // aksi pada item todo
      const item = e.target.closest(".item");
      if (item && item.dataset.id) {
        const act = e.target.closest("[data-act]")?.dataset.act;
        if (!act) return;
        if (item.dataset.learn) {
          const f = findLearn(item.dataset.id); if (!f) return;
          if (act === "toggle") { f.obj.done = !f.obj.done; save(); refresh(); }
          else if (act === "delete") { f.arr.splice(f.idx, 1); save(); refresh(); }
          else if (act === "edit") { editingId = editingId === f.obj.id ? null : f.obj.id; refresh(); }
        } else {
          const f = findTodo(item.dataset.id); if (!f) return;
          if (act === "toggle") { f.obj.done = !f.obj.done; save(); refresh(); }
          else if (act === "flag") { f.obj.urgent = !f.obj.urgent; save(); refresh(); }
          else if (act === "delete") { f.arr.splice(f.idx, 1); save(); refresh(); }
          else if (act === "edit") { editingId = editingId === f.obj.id ? null : f.obj.id; refresh(); }
        }
        return;
      }

      // checklist sehat/ibadah
      const habit = e.target.closest(".habit");
      if (habit) {
        const act = e.target.closest("[data-act]")?.dataset.act;
        const name = habit.dataset.name; const kind = habit.dataset.kind;
        const dd = dayData(selectedKey);
        const store = kind === "health" ? dd.health : dd.ibadah;
        if (act === "remove") {
          const list = kind === "health" ? state.habits : state.ibadahItems;
          const i = list.indexOf(name); if (i > -1) list.splice(i, 1);
          delete store[name]; save(); refresh();
        } else if (act === "toggle") {
          if (store[name]) delete store[name]; else store[name] = true; save(); refresh();
        }
        return;
      }

      // catatan hapus
      const sticky = e.target.closest(".sticky");
      if (sticky && e.target.closest("[data-act='delete']")) {
        const i = state.notes.findIndex((n) => n.id === sticky.dataset.id);
        if (i > -1) { state.notes.splice(i, 1); save(); refresh(); }
        return;
      }
    });

    root.addEventListener("keydown", (e) => {
      if (!e.target.matches(".item__edit")) return;
      if (e.key === "Enter") { e.preventDefault(); commitEdit(e.target); }
      else if (e.key === "Escape") { editingId = null; refresh(); }
    });
    root.addEventListener("focusout", (e) => { if (e.target.matches(".item__edit")) commitEdit(e.target); });
  }

  /* ---------- Navigasi (link data-nav) ---------- */
  document.addEventListener("click", (e) => {
    const nav = e.target.closest("[data-nav]");
    if (nav) { /* href hash menangani routing; biarkan default */ }
  });
  window.addEventListener("hashchange", renderRoute);

  /* =====================================================================
     TAMPILAN AUTH vs APP
     ===================================================================== */
  function showAuth() { $("#appView").hidden = true; $("#authView").hidden = false; }
  function showApp() {
    $("#authView").hidden = true; $("#appView").hidden = false;
    $("#userName").textContent = currentUser.name;
    if (!location.hash) location.hash = "#/dashboard";
    renderRoute();
  }

  function wireAuth() {
    document.querySelectorAll(".auth__tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".auth__tab").forEach((t) => t.classList.toggle("is-active", t === tab));
        const isLogin = tab.dataset.tab === "login";
        $("#loginForm").hidden = !isLogin; $("#registerForm").hidden = isLogin;
        $("#loginErr").hidden = true; $("#registerErr").hidden = true;
      });
    });

    $("#loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target; const err = $("#loginErr"); err.hidden = true;
      const email = f.elements["email"].value, password = f.elements["password"].value;
      try {
        const ok = await login(email, password);
        f.reset(); startSession(ok);
      } catch (ex) { err.textContent = ex.message; err.hidden = false; }
    });

    $("#registerForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target; const err = $("#registerErr"); err.hidden = true;
      const name = f.elements["name"].value, email = f.elements["email"].value, password = f.elements["password"].value;
      try {
        const ok = await register(name, email, password);
        f.reset(); startSession(ok); toast("Akun dibuat. Selamat datang!");
      } catch (ex) { err.textContent = ex.message; err.hidden = false; }
    });

    $("#logoutBtn").addEventListener("click", logout);
  }

  /* ---------- Tema (terang/gelap) ---------- */
  const THEME_KEY = "whisperList_theme";
  const currentTheme = () => document.documentElement.getAttribute("data-theme") || "light";
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = $("#themeBtn");
    if (btn) btn.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#1B1A24" : "#F5F3ED");
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }
  function initTheme() {
    let saved = null; try { saved = localStorage.getItem(THEME_KEY); } catch {}
    if (!saved) saved = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    applyTheme(saved);
    const btn = $("#themeBtn");
    if (btn) btn.addEventListener("click", () => applyTheme(currentTheme() === "dark" ? "light" : "dark"));
  }

  /* ---------- Init ---------- */
  function init() {
    initTheme();
    wireAuth();
    wirePage();
    const session = localStorage.getItem(SESSION_KEY);
    const users = getUsers();
    if (session && users[session]) startSession(session);
    else showAuth();
  }
  init();
})();