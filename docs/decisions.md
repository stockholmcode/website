# Decisions, heuristics and assumptions

A log of the choices behind this site and the reasoning we are holding ourselves to.
When a decision changes, edit the entry and say why. The goal is that a future
maintainer (or a future us) can see not just what was chosen but what trade we accepted.

The format is loose on purpose: each entry is a decision, the reasoning, and where it
stops holding.

---

## Astro for a static, content-driven marketing site

The previous site was two architectures bolted together: a homepage that rendered React
through an in-browser Babel CDN from JSON, and four inner pages of hand-written Swedish
HTML. Adding a second language across both surfaces would have meant doing the work
twice in two different ways.

Astro gives us static HTML for SEO and load speed, keeps the existing React for the few
pieces that genuinely need to run in the browser, and has i18n routing built in. Content
moved into YAML so the people maintaining the site edit data, not markup.

**Holds until** the site needs real server behaviour (auth, dynamic data, forms with a
backend). At that point Astro can still host it, but the "static output, no server"
assumption is what would break first.

## YAML for content, not JSON or a CMS

Content is YAML under `src/data/`. YAML over JSON because the people editing it are
reading and writing prose: comments, multi-line strings and the absence of bracket noise
matter more than machine-friendliness. No CMS because the editing audience is small (the
CEO, and AI assistance) and a CMS would add a service, a schema migration story and an
auth surface to a site that is otherwise a pile of static files.

**Holds until** non-technical editors who will not touch a Git repo need to edit content,
or the content outgrows what a person can keep consistent by hand.

## Swedish is the source language, English falls back to it

Swedish lives at `/` and is the source of truth. English lives at `/en/` and is a
translation target. The content loader falls back per file, so an untranslated English
file shows the Swedish version rather than a gap.

This makes Swedish the canonical content and English a derivative that can drift behind
without breaking the site. It also means structural values (route slugs, filter keys)
are authored once in the Swedish shape and must match exactly in English, because they
are not really language, they are wiring.

**Holds until** English (or another language) needs to diverge structurally from Swedish,
for example different pages per market.

## i18n: duplicated page files over a dynamic route

Each route exists as a Swedish file in `src/pages/` and an English file in
`src/pages/en/`. The two are near-identical: same component, same content loader, differ
only by `locale` and the page title. Five routes times two locales is ten small files.

The more DRY alternative is a single dynamic route (`[...path].astro` with
`getStaticPaths`) that emits every locale from one file. We chose not to. The duplicated
files are routing wiring, not duplicated logic or markup; the page bodies and all content
are already shared. The dynamic version trades ten obvious files for one file plus a
route registry and a layer of indirection, and "open the file for this URL" stops being
true.

> For a CEO or an AI editing the site later, the boring ten-file version is arguably
> easier to reason about than a clever catch-all.

The real cost of duplication is not the file count, it is drift: someone updates one side
and forgets the other. That already bit us once, the English page files shipped with
hard-coded Swedish titles. So we kept the duplicated part as thin as it goes: the page
title, the one drift-prone value that was left, moved into the translated
`<route>_page.yaml`, and the shim is now just `locale` plus a component reference, with
nothing translatable in it to drift.

**Holds until** roughly three or more locales, or fifteen-plus pages. Past that, the
typing saved and the drift avoided by a single dynamic route outweigh the indirection,
and this entry should flip.

## Design tokens in one file

Colours and fonts live in `src/lib/theme.js` and nowhere else. Components import them
rather than hard-coding hex values. When a component needed two one-off colours (the
red/green dimension markers on the offerings page) the fix was to add them to the token
object, not to inline them.

**Holds until** the design system grows enough to want a real token pipeline (themes,
dark/light, design-tool sync). A single JS object is the right size for one brand, one
theme.

The tokens are emitted once, in `Base.astro`, via a single `define:vars` on its global
style block (Astro puts them on `<html>`, they cascade everywhere). Components used to
each re-thread the same 6–9 tokens through their own `define:vars`; that was pure
boilerplate and is gone. The same block now also holds the shared style primitives
(`u-container`, `u-eyebrow`, `u-chip`, `u-hero*`, `u-logoart`, `u-cta*`, `u-portrait`,
`u-member-*`, `u-quote-*`) that the page components were each redefining under different
class names — the "duplicated meaning drifts" case, and it had already drifted: two pages
carried an 8px-off mobile CTA padding, and the inner-page hero's mobile breakpoints were
copy-pasted four times. Sharing the hero forced one small unification — its desktop
bottom padding, which was `96px` on two pages and `120px` on the other two, is now `96px`
everywhere (a page-level override would also win at mobile and undo the shared shrink).
What stays component-local is the genuinely per-page stuff: one-off grids, a narrower
hero lead, and the display headings whose `clamp()` sizes vary by design.

## Hosting on GitHub Pages via Actions

GitHub Actions builds the site and publishes to Pages. Build runs on every push and PR as
a check; deploy runs only on the deploy branch. No external hosting, no separate CI
service, the repo is the whole system. The maintenance loop is: edit YAML, push, CI
builds and publishes within a minute or so.

**Holds until** the site needs something Pages cannot do (server-side rendering, redirects
with logic, preview deploys per PR). Astro's other adapters cover that move when it comes.

---

## Working heuristics

Smaller rules of thumb we keep coming back to. Not load-bearing decisions, just the
posture.

- **A copy change should never require touching a component.** If it does, that copy
  wants to move into YAML.
- **Keep the duplicated part of any pattern as thin as it can be.** Duplication is
  tolerable; duplicated *meaning* drifts. Push the meaningful bits into a single source.
- **Boring and obvious beats clever and compact** for a site that a non-specialist will
  maintain. Optimise for the reader who opens this in a year, not the writer today.
- **Structural values are not translatable.** Route slugs, filter keys and anything a
  script matches on stay identical across locales. Only human-readable strings get
  translated.
- **The em-dash house style in the site copy is intentional** and shared across both
  languages. It is a property of the brand voice, kept consistent sv and en, not an
  accident of translation. (This is the site's content. These docs follow the opposite
  rule.)

## Open assumptions

Things we are taking as true without having fully settled them. Worth revisiting.

- **One set of route slugs, shared across locales.** The slugs are English words
  (`/offering`, `/case`, `/team`, `/careers`) and the English routes reuse them verbatim
  (`/en/case`, not a translated or re-pluralised `/en/cases`). Fine for now. If per-market
  slugs are ever wanted for SEO or polish, that is a routing change to make before a wider
  launch, not after.
- **The audience editing content is technical enough to use Git and YAML.** True today
  (CEO plus AI). If that changes, the "no CMS" decision above is the first to reconsider.
- **One brand, one theme.** The token setup assumes a single visual identity. A second
  brand or a theme switch would outgrow the single `theme.js` object.
