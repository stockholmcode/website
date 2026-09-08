# Architecture

How the site fits together, end to end. For the *why* behind these choices, see
[decisions.md](decisions.md).

## The shape of it

The site is static. Astro renders every route to plain HTML at build time, the output
goes to `dist/`, and GitHub Pages serves it. There is no server and no database. The
small amount of interactivity that needs JavaScript (the typed-word animation, the case
and team filters, the expandable cards) ships as isolated browser scripts, not as a
client-side framework rendering the whole page.

Three layers, kept deliberately separate:

1. **Content** lives in YAML under `src/data/<locale>/`. This is what a non-developer
   edits.
2. **Components** under `src/components/` turn content into markup. This is the layout
   and styling.
3. **Pages** under `src/pages/` are thin wiring: pick a locale, load the content, hand
   it to a component. This is the routing.

A copy change touches layer 1 only. A design change touches layer 2. Layers rarely move
together, which is the point.

## Content pipeline

`src/lib/content.js` is the loader. At build time it uses Vite's glob import to read
every `src/data/**/*.yaml` file as raw text, parses each with `js-yaml`, and files the
result under its locale and name. A file at `src/data/sv/team.yaml` becomes
`content.team` when you load the `sv` locale.

`getContent(locale)` returns the merged content for one locale: it starts from the
default locale (`sv`) and overlays whatever exists for the requested locale. The merge is
**per file**, not per key. If `src/data/en/team.yaml` exists, it replaces the Swedish
`team` wholesale; if it does not exist, the Swedish version shows through. The practical
consequence: an English file you create must be complete, because it overrides rather
than patches. The upside: a locale can be translated one file at a time and the site
never renders a half-empty page.

Naming convention for the files:

- Domain lists are named for their content: `cases.yaml`, `team.yaml`, `offerings.yaml`.
- Per-page chrome (a page's own headings, intros, CTAs and labels) is named
  `<route>_page.yaml`, for example `case_page.yaml`. This keeps the structured data a
  page renders separate from the prose wrapped around it.
- Hyphens in a filename survive into the key, so `team-culture.yaml` is
  `content['team-culture']`.

## Routing and i18n

Astro's built-in i18n is configured in `astro.config.mjs`: Swedish is the default locale
and is not prefixed, so it lives at `/`; English is prefixed and lives at `/en/`. The
`base` is `/website` because the site is a GitHub project page, not a user page.

Routes are real files. Each Swedish route has a file in `src/pages/`, and each English
route has the matching file in `src/pages/en/`. A page file does three things and
nothing else:

```astro
---
const locale = 'en';
const content = getContent(locale);
---
<Base locale={locale} site={content.site} title={content.case_page.title}>
  <CasePage locale={locale} content={content} />
</Base>
```

The body lives in the component (`CasePage`), which is shared between both locales. The
page is just the seam where a locale meets that component. Even the browser title comes
from the content (`<route>_page.yaml`), so the shim carries nothing translatable and the
two locale files differ only by `locale`. `Base.astro` composes the title as
`<label> · <brand>`; the homepage passes no label and renders the brand alone.

URL slugs stay Swedish in both languages. The English cases page is `/en/case`, not
`/en/cases`. Link targets in the YAML (`to: /case`) are written once as locale-neutral
paths, and `Base.astro` runs them through Astro's `getRelativeLocaleUrl`, which adds the
locale prefix and the base. So a single `to: /case` resolves to `/website/case` in
Swedish and `/website/en/case` in English. This is why those `to:` values, and the
filter keys that drive the client-side scripts, must stay identical across locales: they
are structural, not translatable.

### Adding a page

1. Add `src/data/sv/<route>_page.yaml` (and any domain data it needs).
2. Add `src/pages/<route>.astro` and a `src/components/<Route>Page.astro` to render it.
3. Add `src/pages/en/<route>.astro`, identical to the Swedish shim but for `locale = 'en'`.
4. Translate by adding `src/data/en/<route>_page.yaml`.

### Adding a locale

1. Add the locale to `astro.config.mjs`.
2. Create `src/data/<locale>/` and translate files into it as you go (fallback covers
   the rest).
3. Add a `src/pages/<locale>/` directory mirroring the route files.

The duplicated page files are a deliberate trade. The reasoning, and the point at which
it stops being worth it, is in [decisions.md](decisions.md#i18n-duplicated-page-files-over-a-dynamic-route).

## Design tokens

`src/lib/theme.js` exports the palette and font stacks as a single object. Components
import it and feed the values into scoped styles, usually through Astro's `define:vars`
so a token becomes a CSS custom property. There are no hard-coded hex values scattered
through component styles; if a colour needs to change, it changes in one file.

## Assets

Images are static files under `public/assets/`, copied to `dist/` verbatim at build
time — Astro does not process or optimise them. Components never `import` an image;
they build a URL string from `import.meta.env.BASE_URL` (normalised to end in `/`)
and reference it as `` `${assetBase}assets/…` ``. This is why the `base` path has to
be prepended by hand rather than relying on a bundler.

The folders, and who owns what:

- `public/assets/logo-*.png` — the brand marks, referenced directly by components.
- `public/assets/icons/` — the careers-page perk icons. `careers.yaml` stores just
  the filename (`icon: sun.png`); `CareersPage.astro` prepends the folder.
- `public/assets/team/` — team headshots. `team.yaml` stores an optional
  `photo: <file>` per person; `TeamPage.astro` renders it into the portrait frame
  and falls back to the hatched placeholder when it is absent.
- `public/assets/testimonials/` — portraits for the homepage testimonial author.
  `testimonials.yaml` stores an optional `avatar: <file>` per entry;
  `HomeSections.jsx` renders it into the round frame and falls back to a plain grey
  circle when it is absent.

Each `assets/<kind>/` folder has a `README.md` describing the naming convention and
the expected format for that kind. The team list is Swedish-only; `testimonials.yaml`
exists in both locales, so an `avatar:` has to be added to both files (the `en` file
overrides rather than patches). The pattern for a new asset kind: add
`public/assets/<kind>/` with a `README.md`, store the filename (not a path) in the
YAML, and have the component prepend `` `${assetBase}assets/<kind>/` ``.

## Build and deploy

`.github/workflows/deploy.yml` runs on every push and pull request. The build job runs
`npm ci && npm run build` and uploads `dist/` as a Pages artifact, which doubles as a CI
check: a build that does not compile cannot merge or ship. The deploy job runs only on a
push to `main` (not on pull requests) and publishes the artifact to GitHub Pages.

`main` is the production deploy source. (During the Astro migration `feature/translation`
also deployed, so the work could go live without disturbing `main`; that branch was
dropped once the migration landed.) CI builds on Node 20; local development wants Node 20
or newer for the same reason.
