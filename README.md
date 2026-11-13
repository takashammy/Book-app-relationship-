# Keep 閱室

A phone-first PWA reading sanctuary for **relationship and intimacy books only**. Same job as Luminary (閱心), narrower canon. Quiet editorial, bilingual, solo practice — not a dating app, not a church pamphlet, not therapy.

Vanilla HTML / CSS / JS. State lives in `localStorage` under `keep.v1`. No build step.

## Run locally

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open [http://127.0.0.1:8765](http://127.0.0.1:8765). Hard-refresh after CSS/JS changes (cache-bust query is `?v=0.2.0`).

## What’s in 0.2

- **Dock (English only):** Read, Library, Favourites, Calendar, You
- **Read:** one daily title, hashed from the calendar date (same book all day, a new one the next day). The pill reads `DAILY READ` for that title; every other volume stays `ARCHIVE EDITION`
- **Library:** 10 volumes, one from each canonical category. Extra reading is points `04`–`08`
- **Membership:** local toggle. Free = today’s daily read + last 7 titles by recency; the rest of the shelf is Pro
- **Editorial:** bilingual EN + 繁/简. Chrome stays English. Follow only the live SOP in `docs/`
- **Visual:** Soft Uncanny (Surrealism × Pointillism) on Luminary’s poster chassis — type and grain only, no photos or object illustrations

## Docs

| File | What it is |
| --- | --- |
| [docs/love_relationships_intimacy_editorial_style_guide.md](docs/love_relationships_intimacy_editorial_style_guide.md) | Live SOP: 40:60 voice, 8-point architecture, metaphor engine, Eastern resonance |
| [docs/250_canonical_books_on_love_relationships_intimacy.md](docs/250_canonical_books_on_love_relationships_intimacy.md) | 250-title canon and the 10 category strings |
| [docs/_parked/pre-redo-2026-11/](docs/_parked/pre-redo-2026-11/) | Parked 0.1 writing rules — do not use |
| [docs/keep-0.1-handoff.md](docs/keep-0.1-handoff.md) | Compressed 0.1 product snapshot |
| [docs/product-brief.md](docs/product-brief.md) | Locked product brief |
| [docs/DESIGN.md](docs/DESIGN.md) | Visual lock spec (Soft Uncanny × Luminary) |
| [docs/soft-uncanny-luminary.md](docs/soft-uncanny-luminary.md) | Locked stills and chassis notes |
| [docs/design-directions.md](docs/design-directions.md) | Parked ranking |
| [docs/clay-sanctuary-variations.md](docs/clay-sanctuary-variations.md) | Parked Clay Sanctuary rooms |
| [docs/new-mixes.md](docs/new-mixes.md) | Parked unused mixes |
| [.cursorrules](.cursorrules) | Points at the live SOP only; chrome stays English |

## Layout

```
index.html    app.js    books.js    styles.css
manifest.json sw.js     icon.svg
```

Membership, accounts, and sync were briefed for day one; **0.2 is localStorage only**. Couple sharing, streaks, real billing, and in-product crisis resources are later.
