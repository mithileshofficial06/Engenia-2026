# ENGENIA 2026

Website for ENGENIA 2026 — the annual inter-department cultural fest of
Loyola-ICAM College of Engineering and Technology (LICET).

Built with **Next.js 16 (App Router)** and **Tailwind CSS v4**, themed off the
2026 logo. The artwork paints every letter a different colour, so the site runs
on that same spread — ember and gold at the warm end, azure and jade through
the middle, crimson between them, all on near-black with ivory cream instead of
pure white for text. Sampled values live in the `@theme` block of
`src/app/globals.css`:

| Token | Hex | From |
| --- | --- | --- |
| `ember-500` | `#f47115` | the opening E |
| `gold-500` | `#eb9512` | the a, and the 2026 |
| `crimson-500` | `#d3133e` | the e |
| `azure-500` | `#077faf` | the g |
| `jade-500` | `#05bbae` | the second n |
| `cream-200` | `#ffefd3` | the ivory brushwork |

Two gradients are built from those: `bg-arc` / `text-fest` run the full hue arc
left to right the way the logo does, for display type and hairlines; `bg-fest`
uses just the warm end for buttons and solid fills, where the full arc would
drop contrast through the blues.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where the content lives

All copy and data is placeholder content carried over from ENGENIA 2025.
Nothing is hard-coded into components — edit these two files and the whole
site updates:

| File | Holds |
| --- | --- |
| `src/data/site.js` | Festival name/dates/venue, nav links, about copy, stats, pillars, departments + points, gallery highlights, sponsors, announcements, contact |
| `src/data/events.js` | All 32 events: division, format, date, points table, guidelines, winners |

### Things to change first for 2026

- `festival.dates` and `festival.startsAt` in `src/data/site.js` — `startsAt`
  drives the hero countdown.
- `departments[].points` — currently the final 2025 standings.
- `events` — replace with the 2026 line-up. `status` accepts any label
  (`UPCOMING`, `LIVE`, `COMPLETED`); `winners` may be an empty array.
- `announcements` — newest first.

## The wordmark

The hero animates the word in a letter at a time: **E** drops from the top,
**n** rises from the bottom, alternating across to **a**. Scroll past the hero
and the whole wordmark flies up into the navbar corner — that corner is
deliberately empty until then. Both slots render the same component with a
shared framer-motion `layoutId`, so the flight is one continuous element
rather than a crossfade.

That needs one image per letter, which `scripts/prepare-logo.mjs` cuts out of
the source art:

```bash
npm run prepare-logo
```

It reads `Engenia Update Logo.jpeg` from the project root and writes:

| Output | What it is |
| --- | --- |
| `public/logo.<v>.png` | full wordmark, black background knocked out |
| `public/og.<v>.png` | flat copy on black, for social previews |
| `public/favicon.<v>.png` | square crop of the opening E |
| `public/wordmark/L1..L7.<v>.png` | one strip per letter |
| `src/data/wordmark.json` | the paths above, plus geometry so the strips reassemble pixel-exactly |

`<v>` is a short content hash of the source art, and stale hashes are swept up
on each run. **Nothing may hard-code these paths** — import them from
`src/lib/assets.js`, which reads the manifest. Stable filenames caused real
trouble: swapping the logo left every URL unchanged, so the browser and Next's
image optimiser both went on serving the previous artwork from cache well
after the files on disk had changed. Hashed names make that impossible.
(A `?v=` query would have been simpler, but Next 16 rejects query strings on
local images unless each exact string is whitelisted in `images.localPatterns`,
which a rotating hash cannot satisfy.)

The background is removed by luminance, since the artwork is bright paint on
pure black. The threshold sits well above zero because JPEG ringing lifts the
black around bright edges.

One thing to know about the strips: the lettering is connected brush script,
so unlike a blocky typeface there is no column anywhere that cleanly separates
two letters — every cut passes through live paint. The cut positions were
found by segmenting columns on **dominant hue**, since the artwork paints each
letter a different colour. The consequence is that while the letters are in
flight their strokes visibly separate, knitting together as they land.

If you replace the logo art, the cut positions (`CUTS`) and the band bounds
(`BAND`) near the top of that script are measured from the current artwork and
will need re-measuring.

## Images

Everything under `public/gallery/` and `public/sponsors/` is last year's
imagery, kept as placeholders — drop in replacements at the same paths (or
point `src/data/site.js` elsewhere).

## Routes

| Route | Page |
| --- | --- |
| `/` | Hero + countdown, About, Departments, Highlights carousel, Sponsors |
| `/events` | Searchable, filterable event grid with a details modal |
| `/leaderboard` | Podium + full department standings |
| `/gallery` | Masonry grid with keyboard-navigable lightbox |
| `/announcements` | Timeline of updates |
