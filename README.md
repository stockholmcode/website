# SCG Website

**Live:** https://stockholmcode.github.io/website/

Stockholm Code Groups hemsida — statiska HTML-sidor med React/Babel via CDN och innehåll i `content/*.json`.

## Sidor

- `index.html` — startsida (slimmad: hero, logos, core practices, case-teasers, approach, testimonial, team, careers)
- `erbjudanden.html` — erbjudanden + 5D-ramverket (interaktivt)
- `case.html` — case (alla med expanderbar djup-vy)
- `team.html` — teamet + kultur
- `careers.html` — öppen roll + förmåner + process

## Struktur

```
.
├── SCG *.html                # sidor
├── assets/
│   ├── logo.jpg              # original-logga (vit bakgrund)
│   ├── logo-light.png        # transparent, ljusa streck (för mörk bakgrund)
│   ├── logo-dark.png         # transparent, mörka streck (för orange/ljus bakgrund)
│   └── icons/                # förmåns-ikoner (orange linje-ikoner)
├── content/*.json            # allt innehåll (case, team, offerings, testimonials, …)
├── content-loader.js         # läser content/*.json → window.SCG_CONTENT
├── shared.jsx                # design-tokens, LogoImg, globala bindings
├── variant-warm-slim.jsx     # canonical homepage-variant (slim, mörk + orange)
├── variant-warm.jsx          # längre homepage-variant (legacy/backup)
├── variant-editorial.jsx     # explorativ variant (oanvänd)
├── variant-terminal.jsx      # explorativ variant (oanvänd)
├── design-canvas.jsx         # design-canvas-komponent
└── tweaks-panel.jsx          # tweaks-paneler
```

## Köra lokalt

Statiska filer — ingen build. Servera via en lokal webbserver (CORS blockerar `file://` för JSON):

```bash
python3 -m http.server 8000
# → http://localhost:8000/SCG%20Startsida.html
```

## Redigera innehåll

All copy, case, team-medlemmar etc. ligger i `content/*.json`. Variant-filerna (`variant-*.jsx`) använder JSX via Babel-CDN — ingen kompilering krävs, ändra och ladda om.

## Designsystem

- **Typsnitt**: Amatic SC (display), DM Sans (text), JetBrains Mono (meta/kod)
- **Färger**: bg `#0A0C0F`, ink `#E6EAF0`, accent `#FF914D`
- **Layout**: 1280px container, 56px gutter, responsiv (mobilmeny < 960px)

## Att göra innan publik lansering

- **Riktiga teammedlemmar**: just nu är bara David Looberger en riktig person i `content/team.json` — övriga är platshållare. Lägg in namn, roller, bios och porträttfoton.
- **Rollannons**: texten i `careers.html` (Om rollen / krav / erbjudande / stack) är en sammanslagning — byt mot den exakta texten från Talentium-annonsen.
- **Porträttfoton**: ersätt monogram-avatarerna med riktiga foton när de finns.
