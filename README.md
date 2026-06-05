# SCG Website

**Live:** https://stockholmcode.github.io/website/

Stockholm Code Group's website. Built with [Astro](https://astro.build/), output as
static HTML, hosted on GitHub Pages. Content lives in YAML and is available in Swedish
(the source language, served at `/`) and English (served at `/en/`).

For the reasoning behind how this is put together, see [`docs/`](docs/): a tour of the
[architecture](docs/architecture.md) and a log of the [decisions, heuristics and
assumptions](docs/decisions.md) we are working from.

## Quick start

You need Node 20 or newer (Astro 5 will not run on older versions).

```bash
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build into dist/
npm run preview  # serve the built dist/ locally
```

The dev server prints a local URL. The site is configured for the `/website/` base path,
so links and assets resolve the same locally as they do on GitHub Pages.

## Layout

```
src/
├── pages/                 # one file per route; thin routing shims
│   ├── index.astro        #   Swedish routes at /
│   ├── erbjudanden.astro
│   ├── case.astro
│   ├── team.astro
│   ├── careers.astro
│   └── en/                #   English routes at /en/
│       └── …              #   mirror of the five routes above
├── layouts/Base.astro     # shared page chrome: nav, footer, language toggle
├── components/            # the actual page bodies (one .astro per page)
│   ├── islands/           #   the few React pieces that need to run in the browser
│   └── HomeSections.jsx
├── data/
│   ├── sv/*.yaml          # Swedish content (the source of truth)
│   └── en/*.yaml          # English content (per-file fallback to sv)
└── lib/
    ├── content.js         # build-time YAML loader, merges locale + fallback
    └── theme.js           # design tokens (colours, fonts)

public/assets/             # static files copied verbatim (logo, etc.)
.github/workflows/         # build + Pages deploy
```

## Editing content

All copy lives in `src/data/<locale>/*.yaml`. To change a headline, a case study, a
team member or an offering, edit the relevant YAML file and rebuild. You do not touch
the `.astro` components for a copy change.

Swedish is the source language. English files mirror the Swedish ones; any English file
that is missing falls back to its Swedish counterpart, so a half-translated site still
renders in full. The mechanics of the loader and the rules for adding a page or a locale
are written up in [`docs/architecture.md`](docs/architecture.md).

For non-developers maintaining the copy (no coding background assumed), the day-to-day
workflow, the YAML pitfalls to avoid, and how publishing works are in
[`MAINTAINING.md`](MAINTAINING.md).

## Design tokens

Defined once in `src/lib/theme.js` and pulled into components from there.

- Fonts: Amatic SC (display), DM Sans (body), JetBrains Mono (meta and code)
- Colours: background `#0A0C0F`, ink `#E6EAF0`, accent `#FF914D`
- Layout: 1280px container, 56px gutter

## Deploy

A push to a deploy branch triggers the GitHub Actions workflow in
`.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub
Pages. Every push and pull request also runs the build as a check, so a broken build is
caught before it can ship. See [`docs/architecture.md`](docs/architecture.md#build-and-deploy)
for the branch setup during the ongoing migration.
