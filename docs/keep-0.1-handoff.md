# Keep 閱室 — compressed handoff (0.1)

Saved 7 Nov 2026, 02:04 HKT. Martin Sham. Source of truth for a new chat.

## What it is

Keep (閱室) is a phone-first PWA reading sanctuary for **relationship and intimacy books only**. Same job as Luminary (閱心), narrower canon. Must never feel like a dating app or a church pamphlet. Quiet “not therapy” disclaimer in the footer.

Repo: [takashammy/random-tests](https://github.com/takashammy/random-tests). App lives in `keep/`. Vanilla HTML/CSS/JS + `manifest.json` + `sw.js`. State in `localStorage` key `keep.v1`.

## Snapshot

- **Version 0.1** — git tag `v0.1` on branch `cursor/relationship-reader-pwa-d131`
- Commit: `ca78c95` (“Mark Keep as version 0.1”)
- In-app: manifest `0.1`, cache-bust `?v=0.1`, SW cache `keep-shell-v0.1`, You tab “Keep 0.1”
- Prototype PR (open): https://github.com/takashammy/random-tests/pull/4
- Design lock PR (open, GitHub token cannot merge): https://github.com/takashammy/random-tests/pull/3
- Main was not updated. Martin said the app is fine at this snapshot.

## Visual lock

**Soft Uncanny** (Surrealism × Pointillism) on Luminary’s 4-column poster chassis. Type and grain only — no photos, faces, cups, doors, keys, moons, or object illustrations.

- Cream body ink `#f3e6d8` on stipple grain; center veil slightly darkened for contrast (do not switch to black text)
- 20px outer gutters, **42px** left spine, 1fr content, 20px outer gutter
- Fixed 1px frame; `.column { overflow: hidden }`, inner `.content` scrolls
- Newsreader + Noto Serif for titles/quotes/Chinese; Inter for uppercase badges
- Section titles 27px; pull-quote 2× original; summary body +10%; spine type +20%
- Surgical edits only — never rebuild the whole app

Locked stills: [soft-uncanny-luminary.md](./soft-uncanny-luminary.md). Parked mixes stay parked.

## Product lock

- **Dock (English only, always):** Read, Library, Favourites, Calendar, You
- Read: top-right heart saves; Favourites lists saved books
- Bilingual EN + 繁/简 for editorial. When bilingual is on, spine is `EN · 中文` (Chinese immediately to the right of English), never replacing English
- Books are independent ideas — no `01`/`02`, no “next volume”
- Free: daily read + reread last **7 books by recency**; older titles and full catalog need Pro (local toggle, not billing)
- Weekly Review: unique titles this week. Books read = every logged title; practices applied = subset with a practice. Titles are clickable through the same free/Pro gate
- Practices: solo, low-barrier. Journal is private. Markdown export exists
- Phone-first. Cursor **internal** preview, not the cloud-agent desktop
- First-run “quiet room” banner was removed — Read opens on the book

Membership/accounts/sync were briefed as day-one; **0.1 is localStorage only**.

## Five launch books

1. *The Courage to Be Disliked* — free daily
2. *The Art of Loving* — Pro
3. *Attached* — Pro
4. *Hold Me Tight* — Pro
5. *The Seven Principles for Making Marriage Work* — Pro

Editorial shape: thesis, 3 highlights, extras, Eastern resonance (classical or contemporary), one solo practice. Quote/key point then layman explanation; Chinese translates the explanation. Rules: repo `.cursorrules` (信、达、雅) and [book-content-guidelines.md](./book-content-guidelines.md).

Canon (250, relationship-only, top 25 first): [relationship-books-250.md](./relationship-books-250.md). Only *Courage* carried from Luminary.

## How to work

- Branch from `cursor/relationship-reader-pwa-d131` / tag `v0.1`, not a rewrite
- Change only the files that need changing
- Keep English dock labels even in 繁/简
- Preview: `http://127.0.0.1:8765` (Cursor in-IDE browser). Hard-refresh after CSS/JS cache-bust
- Prototype worker: [Soft Uncanny prototype](bc-29f35110-8313-5cd5-9e6a-e633724fd131)
- Design worker: [Design style directions](bc-090c49c9-3d8b-5558-87e2-4e245858e8f8)

## Open vs later

**Open**

- Martin still needs to merge PR #3 (design lock) and PR #4 (app) if they should land on main
- Brief asked for accounts/sync from day one — not in 0.1
- Library is 5 books / a few chips, not the 250-title catalog

**Later / out of 0.1**

- Couple sharing, streaks, in-product crisis resources
- Real billing
- Numbered series framing (never)

## Store map

- Preferences: `/cursor/stores/self/preferences.md`
- Brief: [product-brief.md](./product-brief.md) (the “no prototype until asked” line is historical)
- This file is the 0.1 compress. Prefer it over chat history.
