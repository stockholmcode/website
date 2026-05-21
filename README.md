# SCG Website

Stockholm Code Groups hemsida — statiska HTML-sidor med React/Babel via CDN och innehåll i `content/*.json`.

## Sidor

- `SCG Startsida.html` — startsida (slimmad: hero, logos, core practices, case-teasers, approach, testimonial, team, careers)
- `SCG Erbjudanden.html` — erbjudanden + 5D-ramverket (interaktivt)
- `SCG Case.html` — case (alla med expanderbar djup-vy)
- `SCG Team.html` — teamet + kultur
- `SCG Careers.html` — öppna roller

## Struktur

```
.
├── SCG *.html                # sidor
├── assets/logo.jpg           # logotyp
├── content/*.json            # allt innehåll (case, team, offerings, testimonials, …)
├── content-loader.js         # läser content/*.json → window.SCG_CONTENT
├── shared.jsx                # design-tokens, LogoImg, globala bindings
├── variant-warm-slim.jsx     # canonical homepage-variant (slim, mörk + orange)
├── variant-warm.jsx          # längre homepage-variant (legacy/backup)
├── variant-editorial.jsx     # explorativ variant
├── variant-terminal.jsx      # explorativ variant
├── design-canvas.jsx         # design-canvas-komponent
└── tweaks-panel.jsx          # tweaks-paneler
```

## Köra lokalt

Det är statiska filer — ingen build. Öppna i webbläsare via en lokal server (CORS blockerar `file://` för JSON):

```bash
# valfritt; vilken statisk server som helst fungerar
python3 -m http.server 8000
# → http://localhost:8000/SCG%20Startsida.html
```

## Redigera innehåll

All copy, case, team-medlemmar etc. ligger i `content/*.json`. Variant-filerna (`variant-*.jsx`) använder JSX via Babel-CDN — ingen kompilering krävs, ändra och ladda om.

## Designsystem

- **Typsnitt**: Amatic SC (display), DM Sans (text), JetBrains Mono (meta/kod)
- **Färger**: bg `#0A0C0F`, ink `#E6EAF0`, accent `#FF914D`
- **Layout**: 1280px container, 56px gutter
