/* Keep 0.1 — Luminary chassis, Soft Uncanny skin. Local-state prototype. */
(function () {
  const VERSION = "0.1";
  const STORAGE = "keep.v1";
  const BOOKS = window.BOOKS;
  const ICONS = {
    read: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h7.5A3.5 3.5 0 0 1 15 9v10.5H7.5A3.5 3.5 0 0 0 4 16V5.5z"/><path d="M20 5.5h-7.5A3.5 3.5 0 0 0 9 9v10.5h7.5A3.5 3.5 0 0 1 20 16V5.5z"/></svg>',
    library: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h9.2a2.3 2.3 0 0 1 2.3 2.3V20l-5.4-2.4L6.7 20V6.8A2.3 2.3 0 0 1 9 4.5"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="1.2"/><path d="M4 10h16M8 4v4M16 4v4"/></svg>',
    you: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3.1"/><path d="M6.2 19c1.4-2.6 3.4-3.9 5.8-3.9s4.4 1.3 5.8 3.9"/></svg>',
    fav: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.4S4.8 15.2 4.8 9.7A4.35 4.35 0 0 1 9.2 5.4c1.5 0 2.7.8 2.8 2 .2-1.2 1.4-2 2.8-2a4.35 4.35 0 0 1 4.4 4.3c0 5.5-7.2 10.7-7.2 10.7z"/></svg>'
  };

  /* Chrome is English-only. Chinese is editorial (titles, quotes, body, resonance). */
  const UI = {
    read: "Read",
    library: "Library",
    favourites: "Favourites",
    calendar: "Calendar",
    you: "You",
    coreThesis: "Core thesis",
    chapter: "02 Chapter summary",
    extra: "Extra reading",
    extraOpen: "Show extras",
    extraClose: "Collapse extras",
    east: "03 Eastern resonance",
    practice: "04 Behavior practice",
    today: "Today",
    logged: "Logged",
    pro: "Pro",
    journalPh: "A private line. It stays on this device.",
    searchPh: "Search title, author, Chinese",
    all: "All",
    weekly: "Weekly review",
    booksRead: "Books read",
    practices: "Practices applied",
    export: "Export markdown",
    bilingual: "Language",
    bilingualOn: "EN + Chinese",
    bilingualOff: "English",
    script: "Script",
    membership: "Membership",
    free: "Free daily",
    proMem: "Pro library",
    disclaimer: "This is a reading sanctuary, not therapy. Nothing here is a diagnosis, a couple’s program, or a substitute for care.",
    gate: "This book sits in the Pro library. The rest of the shelf is visible; membership lives under You.",
    goYou: "Open You",
    readAsPro: "Read as Pro",
    emptyDay: "Nothing logged.",
    weeklyEmpty: "Nothing logged this week yet.",
    noBooks: "No books found",
    noSaved: "No saved books yet.",
    save: "Save",
    saved: "Saved",
    weeklyNotePh: "Optional weekly note — private.",
    canon: "Shelf",
    month: "Month",
    dateLog: "Selected date log",
    openBook: "Open book",
    statusPractice: "Status: practice completed",
    statusRead: "Status: read",
    statusNoted: "Status: noted",
    readUnit: "Read",
    appliedUnit: "Applied"
  };

  const MONTHS_CN = {
    tc: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
    sc: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]
  };

  const defaultState = () => {
    const now = new Date();
    return {
      view: "reader",
      bookId: dailyBook().id,
      bilingual: true,
      script: "tc",
      membership: "free",
      extraOpen: false,
      filter: "ALL",
      query: "",
      selectedDate: isoDate(now),
      calYear: now.getFullYear(),
      calMonth: now.getMonth(),
      logs: {},
      saved: [],
      weeklyNote: "",
      gateId: null
    };
  };

  let STATE = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return defaultState();
      const next = Object.assign(defaultState(), JSON.parse(raw));
      if (!Array.isArray(next.saved)) next.saved = [];
      return next;
    } catch {
      return defaultState();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(STATE));
    } catch {
      /* private mode */
    }
  }

  function ui() {
    return UI;
  }

  function cn(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return STATE.script === "sc" ? obj.sc : obj.tc;
  }

  function quotedNote(note) {
    const t = String(note || "").trim();
    if (!t) return "";
    if (/^[“"「『]/.test(t)) return t;
    return `“${t}”`;
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function dailyBook() {
    return BOOKS.find((b) => b.isDailyFree) || BOOKS[0];
  }

  function bookById(id) {
    return BOOKS.find((b) => b.id === id) || dailyBook();
  }

  function isoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function todayIso() {
    return isoDate(new Date());
  }

  const FREE_REREAD = 7;

  function isActiveLog(log) {
    return !!(log && (log.read || log.practice || (log.note && String(log.note).trim())));
  }

  function recentReadIds(limit) {
    const latest = new Map();
    let seq = 0;
    Object.keys(STATE.logs)
      .sort()
      .forEach((date) => {
        const day = STATE.logs[date];
        Object.keys(day).forEach((id) => {
          if (!isActiveLog(day[id])) return;
          latest.set(id, seq++);
        });
      });
    return [...latest.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
  }

  function canRead(book) {
    if (!book) return false;
    if (STATE.membership === "pro" || book.isDailyFree) return true;
    return recentReadIds(FREE_REREAD).includes(book.id);
  }

  function savedIds() {
    return Array.isArray(STATE.saved) ? STATE.saved : [];
  }

  function isSaved(id) {
    return savedIds().includes(id);
  }

  function toggleSave(id) {
    const cur = savedIds();
    STATE.saved = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
    save();
  }

  function isLoggedBook(id) {
    return Object.values(STATE.logs).some((day) => isActiveLog(day[id]));
  }

  function logFor(date, bookId) {
    const day = STATE.logs[date] || {};
    return day[bookId] || { read: false, practice: false, note: "" };
  }

  function patchLog(date, bookId, patch) {
    if (!STATE.logs[date]) STATE.logs[date] = {};
    STATE.logs[date][bookId] = Object.assign({ read: false, practice: false, note: "" }, STATE.logs[date][bookId], patch);
    save();
  }

  function weekBounds() {
    const now = new Date();
    const day = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - day);
    start.setHours(0, 0, 0, 0);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const x = new Date(start);
      x.setDate(start.getDate() + i);
      dates.push(isoDate(x));
    }
    return dates;
  }

  function weekStats() {
    const dates = weekBounds();
    const bookRead = new Set();
    const bookPracticed = new Set();
    const rows = [];
    dates.forEach((d) => {
      const day = STATE.logs[d];
      if (!day) return;
      Object.entries(day).forEach(([id, log]) => {
        if (!isActiveLog(log)) return;
        rows.push({ date: d, id, log });
        bookRead.add(id);
        if (log.practice) bookPracticed.add(id);
      });
    });
    return { books: bookRead.size, practices: bookPracticed.size, rows };
  }

  function categories() {
    const set = [];
    BOOKS.forEach((b) => {
      if (!set.includes(b.categoryFilter)) set.push(b.categoryFilter);
    });
    return set;
  }

  function filteredBooks() {
    const q = (STATE.query || "").trim().toLowerCase();
    return BOOKS.filter((b) => {
      if (STATE.filter !== "ALL" && b.categoryFilter !== STATE.filter) return false;
      if (!q) return true;
      const blob = [
        b.titleFlatEn,
        b.titleLinesEn.join(" "),
        cn(b.titleCn),
        b.authorLine,
        b.themeEn,
        cn(b.themeCn),
        b.leadEn,
        ...(b.highlights || []).map((h) => h.titleEn + " " + cn(h.titleCn))
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }

  /* ---------- stipple field (type/grain only) ---------- */
  function paintStipple() {
    const canvas = document.getElementById("stipple");
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const colors = [
      [28, 20, 44],
      [90, 48, 72],
      [196, 120, 106],
      [212, 165, 116],
      [90, 122, 146],
      [36, 56, 74]
    ];

    function lerpC(t) {
      const x = t * (colors.length - 1);
      const i = Math.min(colors.length - 2, Math.floor(x));
      const f = x - i;
      const a = colors[i];
      const b = colors[i + 1];
      return [
        a[0] + (b[0] - a[0]) * f,
        a[1] + (b[1] - a[1]) * f,
        a[2] + (b[2] - a[2]) * f
      ];
    }

    const count = Math.min(72000, Math.floor((w * h) / 4.2));
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const t = y / h;
      const jitter = (Math.random() - 0.5) * 0.12;
      const c = lerpC(Math.min(1, Math.max(0, t + jitter)));
      const drift = (Math.random() - 0.5) * 28;
      ctx.fillStyle = `rgba(${c[0] + drift},${c[1] + drift},${c[2] + drift},${0.12 + Math.random() * 0.42})`;
      const s = Math.random() < 0.18 ? 1.8 : 1.05;
      ctx.fillRect(x, y, s, s);
    }
  }

  /* ---------- routing ---------- */
  function parseHash() {
    const raw = (location.hash || "#/read").replace(/^#/, "");
    const parts = raw.split("/").filter(Boolean);
    const view = parts[0] || "read";
    if (view === "library") return { view: "library" };
    if (view === "favourites" || view === "favorites") return { view: "favourites" };
    if (view === "calendar") return { view: "calendar" };
    if (view === "profile" || view === "you") return { view: "profile" };
    if (view === "read" || view === "reader") {
      return { view: "reader", bookId: parts[1] || STATE.bookId };
    }
    return { view: "reader" };
  }

  function setHash(view, bookId) {
    let h = "#/" + view;
    if (view === "reader" && bookId) h += "/" + bookId;
    if (location.hash !== h) history.replaceState(null, "", h);
  }

  function go(view, bookId) {
    STATE.view = view;
    STATE.gateId = null;
    if (bookId) STATE.bookId = bookId;
    if (view === "reader") {
      const book = bookById(STATE.bookId);
      if (!canRead(book)) {
        STATE.view = "library";
        STATE.gateId = book.id;
        setHash("library");
        save();
        render();
        return;
      }
      setHash("reader", STATE.bookId);
    } else {
      setHash(view === "profile" ? "profile" : view);
    }
    save();
    render();
    document.getElementById("content")?.scrollTo(0, 0);
  }

  /* ---------- render ---------- */
  function render() {
    document.documentElement.classList.toggle("en-only", !STATE.bilingual);
    document.documentElement.lang = "en";
    renderSpine();
    renderContent();
    renderDock();
  }

  function spinePair(en, zh) {
    return `<div class="spine-pair">
      <span class="spine-en">${esc(en)}</span>
      <span class="spine-cn cn-only">${esc(zh)}</span>
    </div>`;
  }

  function renderSpine() {
    const el = document.getElementById("spine");
    const t = ui();
    const catCn = STATE.script === "sc" ? "类别" : "類別";
    if (STATE.view === "reader") {
      const book = bookById(STATE.bookId);
      el.innerHTML = `
        ${spinePair(book.durationEn, cn(book.durationCn))}
        <span class="spine-rule"></span>
        ${spinePair(book.themeEn, cn(book.themeCn))}`;
      return;
    }
    if (STATE.view === "library") {
      el.innerHTML = spinePair("Category", catCn);
      return;
    }
    if (STATE.view === "favourites") {
      el.innerHTML = spinePair("Saved", "收藏");
      return;
    }
    if (STATE.view === "calendar") {
      el.innerHTML = spinePair(t.month, "月");
      return;
    }
    el.innerHTML = spinePair("You", "我");
  }

  function renderDock() {
    const t = ui();
    const dock = document.getElementById("dock");
    const tabs = [
      ["reader", "read", t.read],
      ["library", "library", t.library],
      ["favourites", "fav", t.favourites],
      ["calendar", "calendar", t.calendar],
      ["profile", "you", t.you]
    ];
    dock.innerHTML = tabs
      .map(
        ([view, icon, label]) => `
      <button type="button" data-go="${view}" ${STATE.view === view ? 'aria-current="page"' : ""}>
        ${ICONS[icon]}
        <span>${esc(label)}</span>
      </button>`
      )
      .join("");
  }

  function renderContent() {
    const root = document.getElementById("content");
    if (STATE.view === "reader") root.innerHTML = readerHTML();
    else if (STATE.view === "library") root.innerHTML = libraryHTML();
    else if (STATE.view === "favourites") root.innerHTML = favouritesHTML();
    else if (STATE.view === "calendar") root.innerHTML = calendarHTML();
    else root.innerHTML = profileHTML();
  }

  function readerHTML() {
    const book = bookById(STATE.bookId);
    const t = ui();
    const bilingual = STATE.bilingual;
    const d = todayIso();
    const log = logFor(d, book.id);
    const extra = STATE.extraOpen;

    const highlights = book.highlights
      .map(
        (h) => `
      <article class="principle">
        <div class="num">${h.num}</div>
        <h3>${esc(h.titleEn)}</h3>
        <p class="concept">${esc(h.conceptEn)}</p>
        <p class="plain">${esc(h.plainEn)}</p>
        ${bilingual ? `<p class="plain cn-only">${esc(cn(h.plainCn))}</p>` : ""}
      </article>`
      )
      .join("");

    const extras = book.extraHighlights
      .map(
        (h) => `
      <article class="principle">
        <div class="num">${h.num}</div>
        <h3>${esc(h.titleEn)}</h3>
        <p class="concept">${esc(h.conceptEn)}</p>
        <p class="plain">${esc(h.plainEn)}</p>
        ${bilingual ? `<p class="plain cn-only">${esc(cn(h.plainCn))}</p>` : ""}
      </article>`
      )
      .join("");

    const saved = isSaved(book.id);
    return `
      <header class="row-top">
        <div class="pills">
          <span class="pill">${esc(book.topLabelEn)} <span class="sep">|</span> ${esc(book.categoryEn)}</span>
        </div>
        <button type="button" class="heart" data-save="${esc(book.id)}" aria-pressed="${saved ? "true" : "false"}" aria-label="${esc(saved ? t.saved : t.save)}">${ICONS.fav}</button>
      </header>
      <div class="title-block">
        <h1>${book.titleLinesEn.map((l) => esc(l)).join("<br>")}</h1>
        ${bilingual ? `<p class="title-cn cn-only">${esc(cn(book.titleCn))}</p>` : ""}
        <p class="author">${esc(book.authorLine)}</p>
      </div>
      <div class="ornament"><span class="dot"></span></div>
      <blockquote class="quote">${esc(book.quoteEn)}</blockquote>
      ${bilingual ? `<p class="quote-cn cn-only">${esc(cn(book.quoteCn))}</p>` : ""}
      <p class="section-label">${esc(t.coreThesis)}</p>
      <p class="thesis">${esc(book.thesisEn)}</p>
      ${bilingual ? `<p class="thesis-cn cn-only">${esc(cn(book.thesisCn))}</p>` : ""}

      <section class="module" id="chapter">
        <div class="module-head">
          <p class="kicker">${esc(t.chapter)} <span class="sep">|</span> ${esc(book.categoryEn)}</p>
        </div>
        ${highlights}
      </section>

      <section class="module">
        <div class="module-head">
          <p class="kicker">${esc(t.extra)}</p>
          <button type="button" class="toggle" data-extra>${esc(extra ? t.extraClose : t.extraOpen)}</button>
        </div>
        <div class="extra-list ${extra ? "open" : ""}">${extras}</div>
        ${extra ? `<button type="button" class="toggle" data-extra>${esc(t.extraClose)}</button>` : ""}
      </section>

      ${
        bilingual
          ? `<section class="module cn-only" id="east">
        <div class="module-head">
          <p class="kicker">${esc(t.east)}</p>
        </div>
        <p class="east-quote">${esc(cn(book.easternResonance.quote))}</p>
        <p class="east-source">${esc(cn(book.easternResonance.source))}</p>
        <p class="prose-cn">${esc(cn(book.easternResonance.commentary))}</p>
      </section>`
          : ""
      }

      <section class="module" id="practice">
        <div class="module-head"><p class="kicker">${esc(t.practice)}</p></div>
        <p class="practice-prompt">${esc(book.actionPromptEn)}</p>
        ${bilingual ? `<p class="prose-cn cn-only">${esc(cn(book.actionPromptCn))}</p>` : ""}
        <div class="check-row">
          <button type="button" class="check" data-practice aria-pressed="${log.practice ? "true" : "false"}" aria-label="${esc(t.practice)}"></button>
          <span class="check-meta">${esc(t.today)}</span>
        </div>
        <textarea class="journal" data-journal placeholder="${esc(t.journalPh)}">${esc(log.note)}</textarea>
      </section>

      <p class="disclaimer">${esc(t.disclaimer)}</p>
    `;
  }

  function libraryHTML() {
    const t = ui();
    const bilingual = STATE.bilingual;
    const cats = categories();
    const chipLabel = {
      ALL: t.all,
      "SELF IN RELATION": "Self",
      "ATTACHMENT & BONDING": "Attachment",
      "MARRIAGE & PARTNERSHIP": "Marriage"
    };
    const chips = [`ALL`, ...cats]
      .map((c) => {
        const label = chipLabel[c] || c;
        return `<button type="button" class="chip" data-filter="${esc(c)}" aria-pressed="${STATE.filter === c}">${esc(label)}</button>`;
      })
      .join("");

    const items = filteredBooks()
      .map((b) => {
        const logged = isLoggedBook(b.id);
        let mark = "";
        if (!canRead(b)) mark = `<span class="mark pro">${esc(t.pro)}</span>`;
        else if (logged) mark = `<span class="mark">${esc(t.logged)} ✓</span>`;
        return `
        <li>
          <button type="button" class="catalog-row" data-open="${esc(b.id)}">
            <span>
              <h2>${esc(b.titleFlatEn)}</h2>
              ${bilingual ? `<p class="cn cn-only">${esc(cn(b.titleCn))}</p>` : ""}
              <p class="by">${esc(b.authorLine)}</p>
            </span>
            ${mark}
          </button>
        </li>`;
      })
      .join("");

    const gated = STATE.gateId ? bookById(STATE.gateId) : null;
    const gate = gated
      ? `<div class="gate">
          <p>${esc(t.gate)}</p>
          <p class="author" style="margin-top:6px">${esc(gated.titleFlatEn)}</p>
          <div class="gate-actions">
            <button type="button" class="export" data-read-pro="${esc(gated.id)}">${esc(t.readAsPro)}</button>
            <button type="button" class="linkish" data-go="profile">${esc(t.goYou)}</button>
          </div>
        </div>`
      : "";

    return `
      <header class="row-top">
        <div class="pills"><span class="pill">Library <span class="sep">|</span> ${esc(t.canon)}</span></div>
      </header>
      ${gate}
      <div class="chips">${chips}</div>
      <input class="search" type="search" value="${esc(STATE.query)}" placeholder="${esc(t.searchPh)}" data-search>
      <ul class="catalog">${items || `<li class="quiet-note">${esc(t.noBooks)}</li>`}</ul>
    `;
  }

  function favouritesHTML() {
    const t = ui();
    const bilingual = STATE.bilingual;
    const books = savedIds()
      .map((id) => BOOKS.find((b) => b.id === id))
      .filter(Boolean);
    const items = books
      .map((b) => {
        const logged = isLoggedBook(b.id);
        let mark = "";
        if (!canRead(b)) mark = `<span class="mark pro">${esc(t.pro)}</span>`;
        else if (logged) mark = `<span class="mark">${esc(t.logged)} ✓</span>`;
        return `
        <li>
          <button type="button" class="catalog-row" data-open="${esc(b.id)}">
            <span>
              <h2>${esc(b.titleFlatEn)}</h2>
              ${bilingual ? `<p class="cn cn-only">${esc(cn(b.titleCn))}</p>` : ""}
              <p class="by">${esc(b.authorLine)}</p>
            </span>
            ${mark}
          </button>
        </li>`;
      })
      .join("");

    return `
      <header class="row-top">
        <div class="pills"><span class="pill">${esc(t.favourites)} <span class="sep">|</span> ${esc(t.saved)}</span></div>
      </header>
      <ul class="catalog">${items || `<li class="quiet-note">${esc(t.noSaved)}</li>`}</ul>
    `;
  }

  function calendarHTML() {
    const t = ui();
    const y = STATE.calYear;
    const m = STATE.calMonth;
    const first = new Date(y, m, 1);
    const startPad = first.getDay();
    const daysIn = new Date(y, m + 1, 0).getDate();
    const monthName = first.toLocaleString("en-US", { month: "long" });
    const monthCn = MONTHS_CN[STATE.script][m];
    const selected = STATE.selectedDate;
    const today = todayIso();
    const dow = ["S", "M", "T", "W", "T", "F", "S"];

    let cells = "";
    for (let i = 0; i < startPad; i++) cells += `<td class="empty"></td>`;
    for (let d = 1; d <= daysIn; d++) {
      const iso = isoDate(new Date(y, m, d));
      const has = STATE.logs[iso] && Object.keys(STATE.logs[iso]).length;
      const isToday = iso === today;
      const isSel = iso === selected;
      const cls = [isToday ? "today" : "", isSel ? "selected" : ""].filter(Boolean).join(" ");
      const mark = isToday ? `<span class="dot-pollen"></span>` : has ? `<span class="dot-log"></span>` : "";
      cells += `<td class="${cls}"><button type="button" data-day="${iso}">${d}${mark}</button></td>`;
    }
    const total = startPad + daysIn;
    const remainder = (7 - (total % 7)) % 7;
    for (let i = 0; i < remainder; i++) cells += `<td class="empty"></td>`;

    let rows = "";
    const all = cells.match(/<td[\s\S]*?<\/td>/g) || [];
    for (let i = 0; i < all.length; i += 7) {
      rows += `<tr>${all.slice(i, i + 7).join("")}</tr>`;
    }

    const dayLogs = STATE.logs[selected] || {};
    const entries = Object.entries(dayLogs).filter(([, log]) => isActiveLog(log));
    const nRead = entries.filter(([, log]) => log.read).length;
    const nApplied = entries.filter(([, log]) => log.practice).length;
    const books = entries
      .map(([id, log]) => {
        const b = bookById(id);
        const status = log.practice ? t.statusPractice : log.read ? t.statusRead : t.statusNoted;
        const note =
          log.note && log.note.trim()
            ? `<blockquote class="inspect-note">${esc(quotedNote(log.note))}</blockquote>`
            : "";
        return `
        <article class="inspect-book">
          <p class="inspect-cat">${esc(b.categoryEn)}</p>
          <h2 class="inspect-title">${esc(b.titleFlatEn)}</h2>
          ${STATE.bilingual ? `<p class="cn cn-only">${esc(cn(b.titleCn))}</p>` : ""}
          <button type="button" class="inspect-open" data-open="${esc(b.id)}">${esc(t.openBook)}</button>
          <p class="inspect-status">${esc(status)}</p>
          ${note}
        </article>`;
      })
      .join("");

    return `
      <header class="row-top">
        <div class="pills"><span class="pill">Calendar <span class="sep">|</span> ${esc(monthName)}</span></div>
      </header>
      <div class="month-nav">
        <button type="button" data-cal="-1">Prev</button>
        <button type="button" data-cal="1">Next</button>
      </div>
      <h1 class="month-name">${esc(monthName)}</h1>
      ${STATE.bilingual ? `<p class="title-cn cn-only">${esc(monthCn)}</p>` : ""}
      <div class="ornament"><span class="dot"></span></div>
      <table class="cal">
        <thead><tr>${dow.map((d) => `<th>${d}</th>`).join("")}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="inspector">
        <p class="inspect-head">${esc(t.dateLog)} <span class="slash">//</span> ${esc(selected)}</p>
        <p class="inspect-counts">${nRead} ${esc(t.readUnit)} <span class="dot-sep">·</span> ${nApplied} ${esc(t.appliedUnit)}</p>
        ${books || `<p class="empty-inspect">${esc(t.emptyDay)}</p>`}
      </div>
    `;
  }

  function profileHTML() {
    const t = ui();
    const stats = weekStats();
    const ids = [];
    stats.rows.forEach((r) => {
      if (!ids.includes(r.id)) ids.push(r.id);
    });
    const list = ids.length
      ? `<ul class="week-list">${ids
          .map((id) => {
            const b = bookById(id);
            const locked = !canRead(b);
            return `<li>
          <button type="button" class="week-open" data-open="${esc(id)}">
            <span>${esc(b.titleFlatEn)}</span>
            ${locked ? `<span class="mark pro">${esc(t.pro)}</span>` : ""}
          </button>
        </li>`;
          })
          .join("")}</ul>`
      : `<p class="empty-inspect">${esc(t.weeklyEmpty)}</p>`;

    return `
      <header class="row-top">
        <div class="pills"><span class="pill">Profile <span class="sep">|</span> You</span></div>
      </header>
      <h1 class="month-name">You</h1>
      <div class="ornament"><span class="dot"></span></div>

      <div class="setting">
        <div>
          <span class="kicker">${esc(t.bilingual)}</span>
          <p>${esc(STATE.bilingual ? t.bilingualOn : t.bilingualOff)}</p>
        </div>
        <div class="seg">
          <button type="button" data-bilingual="off" aria-pressed="${!STATE.bilingual}">EN</button>
          <button type="button" data-bilingual="on" aria-pressed="${STATE.bilingual}">EN+ZH</button>
        </div>
      </div>
      <div class="setting">
        <div>
          <span class="kicker">${esc(t.script)}</span>
          <p>${STATE.script === "sc" ? "Simplified" : "Traditional"}</p>
        </div>
        <div class="seg">
          <button type="button" data-script="tc" aria-pressed="${STATE.script === "tc"}">Trad</button>
          <button type="button" data-script="sc" aria-pressed="${STATE.script === "sc"}">Simp</button>
        </div>
      </div>
      <div class="setting">
        <div>
          <span class="kicker">${esc(t.membership)}</span>
          <p>${esc(STATE.membership === "pro" ? t.proMem : t.free)}</p>
        </div>
        <div class="seg">
          <button type="button" data-mem="free" aria-pressed="${STATE.membership === "free"}">Free</button>
          <button type="button" data-mem="pro" aria-pressed="${STATE.membership === "pro"}">Pro</button>
        </div>
      </div>

      <section class="module">
        <p class="kicker">${esc(t.weekly)}</p>
        <div class="metrics">
          <div class="metric"><b>${stats.books}</b><span>${esc(t.booksRead)}</span></div>
          <div class="metric"><b>${stats.practices}</b><span>${esc(t.practices)}</span></div>
        </div>
        ${list}
        <textarea class="journal" data-weeknote placeholder="${esc(t.weeklyNotePh)}">${esc(STATE.weeklyNote)}</textarea>
        <button type="button" class="export" data-export>${esc(t.export)}</button>
      </section>
      <p class="disclaimer">${esc(t.disclaimer)}</p>
      <p class="version">Keep ${esc(VERSION)}</p>
    `;
  }

  function onAppClick(e) {
    const el = e.target.closest("[data-go], [data-open], [data-extra], [data-practice], [data-filter], [data-day], [data-cal], [data-bilingual], [data-script], [data-mem], [data-export], [data-read-pro], [data-save]");
    if (!el) return;

    if (el.hasAttribute("data-go")) {
      const view = el.getAttribute("data-go");
      go(view, view === "reader" ? STATE.bookId : undefined);
      return;
    }
    if (el.hasAttribute("data-open")) {
      go("reader", el.getAttribute("data-open"));
      return;
    }
    if (el.hasAttribute("data-save")) {
      const id = el.getAttribute("data-save");
      toggleSave(id);
      const on = isSaved(id);
      el.setAttribute("aria-pressed", on ? "true" : "false");
      el.setAttribute("aria-label", on ? ui().saved : ui().save);
      return;
    }
    if (el.hasAttribute("data-read-pro")) {
      const id = el.getAttribute("data-read-pro");
      STATE.membership = "pro";
      STATE.gateId = null;
      save();
      go("reader", id);
      return;
    }
    if (el.hasAttribute("data-extra")) {
      STATE.extraOpen = !STATE.extraOpen;
      save();
      render();
      return;
    }
    if (el.hasAttribute("data-practice")) {
      const book = bookById(STATE.bookId);
      const d = todayIso();
      const cur = logFor(d, book.id);
      const next = !cur.practice;
      patchLog(d, book.id, { practice: next, read: true });
      el.setAttribute("aria-pressed", next ? "true" : "false");
      return;
    }
    if (el.hasAttribute("data-filter")) {
      STATE.filter = el.getAttribute("data-filter");
      STATE.query = "";
      save();
      render();
      return;
    }
    if (el.hasAttribute("data-day")) {
      STATE.selectedDate = el.getAttribute("data-day");
      save();
      render();
      return;
    }
    if (el.hasAttribute("data-cal")) {
      const delta = Number(el.getAttribute("data-cal"));
      let m = STATE.calMonth + delta;
      let y = STATE.calYear;
      if (m < 0) {
        m = 11;
        y -= 1;
      }
      if (m > 11) {
        m = 0;
        y += 1;
      }
      STATE.calMonth = m;
      STATE.calYear = y;
      save();
      render();
      return;
    }
    if (el.hasAttribute("data-bilingual")) {
      STATE.bilingual = el.getAttribute("data-bilingual") === "on";
      save();
      render();
      return;
    }
    if (el.hasAttribute("data-script")) {
      STATE.script = el.getAttribute("data-script");
      save();
      render();
      return;
    }
    if (el.hasAttribute("data-mem")) {
      STATE.membership = el.getAttribute("data-mem");
      if (STATE.membership === "pro") STATE.gateId = null;
      save();
      render();
      return;
    }
    if (el.hasAttribute("data-export")) {
      exportMarkdown();
    }
  }

  function onAppInput(e) {
    const el = e.target;
    if (el.matches("[data-journal]")) {
      patchLog(todayIso(), STATE.bookId, { note: el.value, read: true });
      return;
    }
    if (el.matches("[data-weeknote]")) {
      STATE.weeklyNote = el.value;
      save();
      return;
    }
    if (el.matches("[data-search]")) {
      STATE.query = el.value;
      save();
      const start = el.selectionStart;
      render();
      const again = document.querySelector("[data-search]");
      if (again) {
        again.focus();
        again.setSelectionRange(start, start);
      }
    }
  }

  function exportMarkdown() {
    const stats = weekStats();
    const lines = [
      "# Keep — reading log",
      "",
      `Exported ${todayIso()}. Private notes from this device.`,
      "",
      "## This week",
      `- Books read: ${stats.books}`,
      `- Practices applied: ${stats.practices}`,
      STATE.weeklyNote.trim() ? `> ${STATE.weeklyNote.trim().replace(/\n/g, "\n> ")}` : "",
      ""
    ];
    const dates = Object.keys(STATE.logs).sort();
    dates.forEach((d) => {
      const day = STATE.logs[d];
      const ids = Object.keys(day);
      if (!ids.length) return;
      lines.push(`## ${d}`, "");
      ids.forEach((id) => {
        const log = day[id];
        const b = bookById(id);
        lines.push(`### ${b.titleFlatEn}`);
        lines.push(`- Read: ${log.read ? "yes" : "no"}`);
        lines.push(`- Practice: ${log.practice ? "yes" : "no"}`);
        if (log.note && log.note.trim()) {
          lines.push("", log.note.trim(), "");
        } else {
          lines.push("");
        }
      });
    });
    const blob = new Blob([lines.filter((x) => x !== undefined).join("\n")], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `keep-log-${todayIso()}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function applyHash() {
    const { view, bookId } = parseHash();
    STATE.view = view;
    if (bookId) STATE.bookId = bookId;
    if (view === "reader" && !canRead(bookById(STATE.bookId))) {
      STATE.bookId = dailyBook().id;
    }
    render();
  }

  function init() {
    paintStipple();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(paintStipple, 200);
    });
    document.getElementById("app").addEventListener("click", onAppClick);
    document.getElementById("app").addEventListener("input", onAppInput);
    window.addEventListener("hashchange", applyHash);
    if (!location.hash) setHash("reader", STATE.bookId);
    applyHash();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js?v=0.1.9").catch(() => {});
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
