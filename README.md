# Keep 閱室

A phone-first PWA reading sanctuary for **relationship and intimacy books only**. Same job as Luminary (閱心), narrower canon. Quiet editorial, bilingual, solo practice — not a dating app, not a church pamphlet, not therapy.

Vanilla HTML / CSS / JS. State lives in `localStorage` under `keep.v1`. No build step.

## Run locally

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open [http://127.0.0.1:8765](http://127.0.0.1:8765). Hard-refresh after CSS/JS changes (cache-bust query is `?v=0.1.9`).

## What’s in 0.1

- **Dock (English only):** Read, Library, Favourites, Calendar, You
- **Read:** daily book; top-right heart saves to Favourites
- **Library:** 30 relationship titles (must-read spine). Books are independent ideas — no volume numbers
- **Membership:** local toggle. Free = daily read + last 7 titles by recency; the rest of the shelf is Pro
- **Editorial:** bilingual EN + 繁/简. Chrome stays English. Spine is `EN · 中文` when bilingual is on
- **Visual:** Soft Uncanny (Surrealism × Pointillism) on Luminary’s poster chassis — type and grain only, no photos or object illustrations

This snapshot matches `takashammy/random-tests` branch `cursor/relationship-reader-pwa-d131` (PR #4), with the PWA at **repo root** instead of nested `keep/`.

## Docs

| File | What it is |
| --- | --- |
| [docs/keep-0.1-handoff.md](docs/keep-0.1-handoff.md) | Compressed 0.1 product snapshot |
| [docs/product-brief.md](docs/product-brief.md) | Locked product brief |
| [docs/book-content-guidelines.md](docs/book-content-guidelines.md) | Lead then 15-year-old scene; anti-doubling; Eastern resonance; solo practices |
| [docs/relationship-books-250.md](docs/relationship-books-250.md) | Relationship-only canon (250 titles; ship 1–30 first) |
| [docs/DESIGN.md](docs/DESIGN.md) | Visual lock spec (Soft Uncanny × Luminary) |
| [docs/soft-uncanny-luminary.md](docs/soft-uncanny-luminary.md) | Locked stills and chassis notes |
| [docs/design-directions.md](docs/design-directions.md) | Parked ranking |
| [docs/clay-sanctuary-variations.md](docs/clay-sanctuary-variations.md) | Parked Clay Sanctuary rooms |
| [docs/new-mixes.md](docs/new-mixes.md) | Parked unused mixes |
| [.cursorrules](.cursorrules) | Chinese editorial: 信、达、雅, two-step; must pair with the guidelines |

## Layout

```
index.html    app.js    books.js    styles.css
manifest.json sw.js     icon.svg
```

Membership, accounts, and sync were briefed for day one; **0.1 is localStorage only**. Couple sharing, streaks, real billing, and in-product crisis resources are later.
