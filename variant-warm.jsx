// Variant 3: Warm brief in DARK theme, magazine layout, #0A0C0F bg, orange accent.
// Keeps the Amatic display + JetBrains mono chrome. Was beige; now inverted.

// Interactive 5-dimension framework panel, active card gets orange rail +
// detail strip below shows signals, wins, and a quote for the selected dim.
function WarmFrameworkPanel({ wm, ink, inkDim, bg, accent, panel, line }) {
  const [active, setActive] = React.useState(0);
  const [score, setScore] = React.useState('red'); // red | yellow | green
  const d = window.DIMENSIONS[active];
  const scoreMeta = {
    red: { color: '#E85C5C', label: 'RÖD', text: 'Grundproblem, blockerar nästa steg. Måste adresseras först.' },
    yellow: { color: '#E8B84C', label: 'GUL', text: 'Funkar, men lämnar värde på bordet. AI kan hjälpa, men inte förstärka.' },
    green: { color: '#4CE87E', label: 'GRÖN', text: 'Solid grund. AI kan compound:a här över tid, expandera scope.' }
  };
  return (
    <div style={{ marginTop: 80, padding: '48px 40px', borderRadius: 18, border: `1px solid ${line}`, background: panel }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'start', marginBottom: 40 }}>
        <div>
          <div style={{ ...wm.mono, fontSize: 11, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Ramverket · Interaktivt</div>
          <h3 style={{ ...wm.display, fontSize: 56, lineHeight: .95, margin: 0, color: ink }}>
            5 dimensioner.<br /><span style={{ color: accent }}>Samma karta.</span>
          </h3>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: inkDim, margin: 0 }}>
          Klicka på en dimension för att se signaler, åtgärder och vad ett scorecard faktiskt innebär. Samma språk hela vägen, från första halvdagen till löpande leverans.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {window.DIMENSIONS.map((dim, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              style={{
                textAlign: 'left', cursor: 'pointer', background: 'transparent',
                border: 'none', padding: 0, font: 'inherit', color: 'inherit',
                borderTop: `3px solid ${isActive ? accent : line}`,
                paddingTop: 18,
                transition: 'border-color .2s ease',
                opacity: isActive ? 1 : 0.6
              }}>
              
              <div style={{ ...wm.mono, fontSize: 11, color: accent, marginBottom: 8, letterSpacing: '.06em' }}>{dim.num}</div>
              <h4 style={{ ...wm.display, fontSize: 28, lineHeight: .95, margin: '0 0 10px', color: ink }}>{dim.title}</h4>
              <p style={{ fontSize: 13, lineHeight: 1.5, margin: '0 0 8px', color: ink, fontWeight: 500 }}>{dim.q}</p>
              <p style={{ fontSize: 12, lineHeight: 1.5, margin: 0, color: inkDim }}>{dim.body}</p>
            </button>);

        })}
      </div>

      {/* Detail strip */}
      <div style={{ marginTop: 28, background: bg, border: `1px solid ${line}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 0, minHeight: 220 }}>
          {/* Quote */}
          <div style={{ padding: '28px 32px', borderRight: `1px solid ${line}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 18 }}>
            <div style={{ ...wm.mono, fontSize: 10, color: accent, letterSpacing: '.1em' }}>DIMENSION {d.num} · VARFÖR DET SPELAR ROLL</div>
            <p style={{ ...wm.display, fontSize: 28, lineHeight: 1.1, margin: 0, color: ink, textWrap: 'balance' }}>
              "{d.quote}"
            </p>
            <div style={{ ...wm.mono, fontSize: 11, color: inkDim, letterSpacing: '.04em' }}>, {d.title}</div>
          </div>
          {/* Signals */}
          <div style={{ padding: '28px 24px', borderRight: `1px solid ${line}` }}>
            <div style={{ ...wm.mono, fontSize: 10, color: '#E85C5C', letterSpacing: '.1em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#E85C5C' }} />
              RÖDA FLAGGOR
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {d.signals.map((s, i) =>
              <li key={i} style={{ fontSize: 13, lineHeight: 1.45, color: ink, display: 'flex', gap: 10 }}>
                  <span style={{ color: '#E85C5C', fontWeight: 600 }}>×</span>
                  <span>{s}</span>
                </li>
              )}
            </ul>
          </div>
          {/* Wins */}
          <div style={{ padding: '28px 24px' }}>
            <div style={{ ...wm.mono, fontSize: 10, color: '#4CE87E', letterSpacing: '.1em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#4CE87E' }} />
              VAD VI GÖR ÅT DET
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {d.wins.map((s, i) =>
              <li key={i} style={{ fontSize: 13, lineHeight: 1.45, color: ink, display: 'flex', gap: 10 }}>
                  <span style={{ color: '#4CE87E', fontWeight: 600 }}>→</span>
                  <span>{s}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Score-explorer strip */}
        <div style={{ borderTop: `1px solid ${line}`, padding: '20px 32px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center', background: panel }}>
          <div style={{ ...wm.mono, fontSize: 10, color: inkDim, letterSpacing: '.1em' }}>DENNA DIMENSION SCORAR:</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['red', 'yellow', 'green'].map((k) =>
            <button
              key={k}
              onClick={() => setScore(k)}
              style={{
                cursor: 'pointer', padding: '8px 14px', borderRadius: 999,
                border: `1px solid ${score === k ? scoreMeta[k].color : line}`,
                background: score === k ? scoreMeta[k].color : 'transparent',
                color: score === k ? '#0a0c0f' : ink,
                ...wm.mono, fontSize: 10, letterSpacing: '.08em', fontWeight: 600
              }}>
              
                ● {scoreMeta[k].label}
              </button>
            )}
          </div>
          <div style={{ fontSize: 12, color: inkDim, lineHeight: 1.45, maxWidth: 420, textAlign: 'right' }}>
            {scoreMeta[score].text}
          </div>
        </div>
      </div>
    </div>);

}

// Single case row with expand/collapse. Header stays the same compact layout
// you see in the case list; clicking expands an inline detail panel with
// rich sections (summary, background, what we did, results, stack, quote).
function WarmCaseRow({ c, i, wm, ink, inkDim, accent, line, panelHi }) {
  const [open, setOpen] = React.useState(false);
  const x = c.expanded;
  const hasExpansion = !!(x && (x.summary || (x.sections && x.sections.length)));

  return (
    <article style={{ borderTop: `1px solid ${line}` }}>
      <div
        onClick={() => hasExpansion && setOpen(!open)}
        style={{
          display: 'grid', gridTemplateColumns: '140px 1.2fr 2fr 1fr 60px', gap: 40,
          padding: '40px 0', alignItems: 'center',
          cursor: hasExpansion ? 'pointer' : 'default',
        }}>
        <div style={{ ...wm.display, fontSize: 72, color: accent, lineHeight: .9 }}>0{i + 1}</div>
        <div>
          <div style={{ ...wm.display, fontSize: 56, lineHeight: .95, color: ink }}>{c.client}</div>
          <div style={{ ...wm.mono, fontSize: 11, color: inkDim, letterSpacing: '.06em', marginTop: 8 }}>{c.sector} · {c.year}</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 500, color: ink, marginBottom: 8 }}>{c.outcome}</div>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: inkDim, margin: 0, maxWidth: 520 }}>{c.body}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...wm.display, fontSize: 88, lineHeight: .9, color: ink }}>{c.metric}</div>
          <div style={{ ...wm.mono, fontSize: 11, color: inkDim, letterSpacing: '.06em', marginTop: 6 }}>{c.metricLabel}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {hasExpansion ? (
            <div
              aria-label={open ? 'Stäng case' : 'Läs hela caset'}
              style={{
                width: 44, height: 44, borderRadius: 999,
                border: `1px solid ${open ? accent : line}`,
                background: open ? accent : 'transparent',
                color: open ? '#0A0C0F' : ink,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...wm.mono, fontSize: 18, lineHeight: 1, fontWeight: 600,
                transition: 'transform .25s ease, background .2s, color .2s, border-color .2s',
                transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
              }}>+</div>
          ) : null}
        </div>
      </div>

      {hasExpansion && open && (
        <div style={{
          paddingBottom: 48,
          display: 'grid', gridTemplateColumns: '140px 1fr 320px', gap: 40,
          alignItems: 'start',
        }}>
          {/* Left rail: role + period meta */}
          <div style={{ paddingTop: 4 }}>
            {c.role && (
              <div style={{ ...wm.mono, fontSize: 10, color: accent, letterSpacing: '.1em', marginBottom: 6 }}>ROLL</div>
            )}
            {c.role && (
              <div style={{ fontSize: 13, color: ink, lineHeight: 1.45, marginBottom: 18 }}>{c.role}</div>
            )}
            {c.period && (
              <div style={{ ...wm.mono, fontSize: 10, color: accent, letterSpacing: '.1em', marginBottom: 6 }}>PERIOD</div>
            )}
            {c.period && (
              <div style={{ ...wm.mono, fontSize: 12, color: inkDim, lineHeight: 1.45 }}>{c.period}</div>
            )}
          </div>

          {/* Main column: summary + section blocks + closing tagline */}
          <div>
            {x.summary && (
              <p style={{
                ...wm.display, fontSize: 28, lineHeight: 1.15, margin: '0 0 36px',
                color: ink, textWrap: 'balance',
                paddingLeft: 18, borderLeft: `2px solid ${accent}`,
              }}>{x.summary}</p>
            )}

            {(x.sections || []).map((s, j) => (
              <div key={j} style={{ marginBottom: 28 }}>
                <div style={{
                  ...wm.mono, fontSize: 10, color: accent, letterSpacing: '.12em',
                  textTransform: 'uppercase', marginBottom: 10,
                }}>{s.h}</div>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: ink, margin: 0, maxWidth: 640 }}>{s.body}</p>
              </div>
            ))}

            {x.tagline && (
              <p style={{
                marginTop: 36, paddingTop: 24, borderTop: `1px solid ${line}`,
                fontSize: 14, lineHeight: 1.65, color: inkDim, fontStyle: 'italic', margin: '36px 0 0',
                maxWidth: 640,
              }}>{x.tagline}</p>
            )}
          </div>

          {/* Right column: stack list + (optional) testimonial */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {x.stackList && x.stackList.length > 0 && (
              <div style={{ padding: '20px 22px', border: `1px solid ${line}`, borderRadius: 12 }}>
                <div style={{ ...wm.mono, fontSize: 10, color: accent, letterSpacing: '.1em', marginBottom: 12 }}>VAL & VERKTYG</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {x.stackList.map((s, j) => (
                    <li key={j} style={{ fontSize: 13, color: ink, lineHeight: 1.45, display: 'flex', gap: 10 }}>
                      <span style={{ color: accent, flex: '0 0 auto' }}>→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {c.testimonial && (
              <figure style={{
                margin: 0, padding: '22px 24px', borderLeft: `3px solid ${accent}`,
                borderRadius: '0 12px 12px 0', background: panelHi,
              }}>
                <blockquote style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: ink, fontStyle: 'italic' }}>
                  "{c.testimonial.quote}"
                </blockquote>
                <figcaption style={{ ...wm.mono, fontSize: 11, color: inkDim, marginTop: 14, letterSpacing: '.04em' }}>
                , {c.testimonial.name}, {c.testimonial.role}
                </figcaption>
              </figure>
            )}
          </aside>
        </div>
      )}
    </article>
  );
}

function VariantWarm({ density = 'regular', sections = {}, tone = 'warm' }) {
  const S = window.SCG;
  const pad = density === 'compact' ? 72 : density === 'comfy' ? 136 : 104;
  const gutter = 56;

  // Cycling hero word
  const WORDS = ['software.', 'customers.', 'teams.', 'code.', 'product.', 'Stockholm.'];
  const [wordIdx, setWordIdx] = React.useState(0);
  const [typed, setTyped] = React.useState(WORDS[0]);
  const [phase, setPhase] = React.useState('hold');
  React.useEffect(() => {
    let timer;
    if (phase === 'hold') timer = setTimeout(() => setPhase('deleting'), 2200);else
    if (phase === 'deleting') {
      if (typed.length > 0) timer = setTimeout(() => setTyped(typed.slice(0, -1)), 40);else
      {setWordIdx((wordIdx + 1) % WORDS.length);setPhase('typing');}
    } else if (phase === 'typing') {
      const target = WORDS[wordIdx];
      if (typed.length < target.length) timer = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 70);else
      setPhase('hold');
    }
    return () => clearTimeout(timer);
  }, [phase, typed, wordIdx]);

  // ── Dark palette ────────────────────────────────────────────
  const bg = S.darkBg || '#0A0C0F'; // page canvas
  const panel = '#11141A'; // elevated sections
  const panelHi = '#171B22'; // card on panel
  const ink = S.darkInk || '#E6EAF0'; // primary text
  const inkDim = 'rgba(230,234,240,.58)'; // secondary
  const inkFaint = 'rgba(230,234,240,.35)';
  const line = 'rgba(255,255,255,.09)';
  const accent = S.accent;

  const lead = {
    warm: 'Ett handplockat team av seniora ingenjörer och arkitekter. I Stockholm, sedan 2007, med hjärta.',
    confident: 'Seniora ingenjörer som levererar mjukvara i världsklass. Stockholm, sedan 2007.',
    technical: 'Seniora ingenjörer och arkitekter. Produktleveranser sedan 2007. Stockholm.'
  }[tone];

  const wm = {
    page: { background: bg, color: ink, fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.55 },
    container: { maxWidth: 1280, margin: '0 auto', padding: `0 ${gutter}px` },
    mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
    display: { fontFamily: "'Amatic SC', cursive", fontWeight: 700 }
  };

  return (
    <div style={wm.page}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,12,15,.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${line}` }}>
        <div style={{ ...wm.container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
          <a href="index.html" style={{ ...wm.display, fontSize: 28, lineHeight: 1, color: ink, whiteSpace: 'nowrap', textDecoration: 'none' }}>
            Stockholm Code Group
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 15 }}>
            {[
            { label: 'Erbjudanden', href: 'erbjudanden.html' },
            { label: 'Case', href: 'case.html' },
            { label: 'Team', href: 'team.html' },
            { label: 'Karriär', href: 'careers.html' }].
            map((x) =>
            <a key={x.label} href={x.href} style={{ color: ink, textDecoration: 'none' }}>{x.label}</a>
            )}
            <a href="mailto:contactus@stockholmcode.se" style={{
              background: accent, color: bg, padding: '10px 18px', borderRadius: 999,
              textDecoration: 'none', fontSize: 14, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>Säg hej ♥</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      {sections.hero !== false &&
      <header style={{ background: bg, borderBottom: `1px solid ${line}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...wm.container, padding: `${pad + 20}px ${gutter}px ${pad - 16}px`, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...wm.mono, fontSize: 12, color: inkDim, letterSpacing: '.06em', marginBottom: 48 }}>
              <div>STOCKHOLM CODE GROUP · SEDAN 2007</div>
            </div>

            <h1 style={{ ...wm.display, fontSize: 'clamp(96px, 15vw, 240px)', lineHeight: .85, margin: 0, letterSpacing: '-.005em', color: ink }}>
              We bring<br />
              <span style={{ color: accent }}>love</span> to<br />
              <span style={{ display: 'inline-block', minHeight: '.85em' }}>
                {typed}<span style={{
                display: 'inline-block', width: '.08em', height: '.75em',
                background: ink, marginLeft: '.04em', verticalAlign: '-0.05em',
                animation: 'scgCaret 1s steps(1) infinite'
              }} />
              </span>
            </h1>
            <style>{`@keyframes scgCaret{50%{opacity:0}}`}</style>

            <div style={{ display: 'flex', marginTop: 64, justifyContent: 'flex-start', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <a style={{
              background: ink, color: bg, padding: '18px 26px', borderRadius: 999,
              textDecoration: 'none', fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 12
            }}>Börja ett samtal →</a>
              <a style={{
              background: 'transparent', color: ink, padding: '17px 24px', borderRadius: 999,
              textDecoration: 'none', fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 10,
              border: `1px solid ${line}`
            }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: accent }} />
                Eller boka en AI-scan
              </a>
              <div style={{ ...wm.mono, fontSize: 12, color: inkDim }}>
                Halvdag · fast pris · kvittas
              </div>
            </div>

            {/* Foundation strip, what we are, before what we're good at now */}
            <div style={{ marginTop: 72, paddingTop: 32, borderTop: `1px solid ${line}`, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'start' }}>
              <div>
                <div style={{ ...wm.mono, fontSize: 11, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Grunden</div>
                <p style={{ ...wm.display, fontSize: 36, lineHeight: 1.05, margin: 0, color: ink, textWrap: 'balance' }}>
                  Seniora arkitekter & ingenjörer.<br />
                  <span style={{ color: inkDim }}>AI är accelerator, inte identitet.</span>
                </p>
              </div>
              <div>
                <p style={{ fontSize: 16, lineHeight: 1.55, color: inkDim, margin: '0 0 24px', maxWidth: 620 }}>
                  Cirka 20 seniora utvecklare och arkitekter. Vi har byggt plattformar, moderniserat arkitektur och tagit komplexa leveranser i mål långt innan AI blev ett samtalsämne. Det är därför AI faktiskt compound:ar hos oss, vi applicerar den på ett hantverk vi redan behärskar.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[
                'Arkitektur & plattform',
                'Leveransteam',
                'Fractional CTO',
                'Teknisk due diligence',
                'Data & infrastruktur',
                'AI-enablement'].
                map((t, i) =>
                <span key={i} style={{
                  ...wm.mono, fontSize: 11, padding: '8px 12px', borderRadius: 999,
                  border: `1px solid ${line}`, color: ink, letterSpacing: '.04em'
                }}>{t}</span>
                )}
                </div>
              </div>
            </div>
          </div>
          {/* Stats ribbon */}
          <div style={{ background: panel, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}`, overflow: 'hidden' }}>
            <div style={{ ...wm.container, padding: '22px 56px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
              {window.STATS.map((s, i) =>
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 14, borderLeft: i === 0 ? 'none' : `1px solid ${line}`, paddingLeft: i === 0 ? 0 : 24 }}>
                  <div style={{ ...wm.display, fontSize: 56, lineHeight: 1, color: accent }}>
                    {s.num}<span style={{ color: accent }}>{s.unit}</span>
                  </div>
                  <div style={{ fontSize: 12, color: inkDim, maxWidth: 120, lineHeight: 1.4 }}>{s.label}</div>
                </div>
            )}
            </div>
          </div>
        </header>
      }

      {/* Logos, infinite marquee */}
      {sections.logos !== false &&
      <section style={{ background: bg, borderBottom: `1px solid ${line}`, overflow: 'hidden' }}>
          <style>{`
            @keyframes scgMarquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
            .scg-marquee { display: flex; width: max-content; animation: scgMarquee 40s linear infinite; }
            .scg-marquee:hover { animation-play-state: paused; }
            .scg-marquee-fade { position: relative; }
            .scg-marquee-fade::before,
            .scg-marquee-fade::after {
              content: ''; position: absolute; top: 0; bottom: 0; width: 140px; pointer-events: none; z-index: 1;
            }
            .scg-marquee-fade::before { left: 0;  background: linear-gradient(to right, ${bg}, transparent); }
            .scg-marquee-fade::after  { right: 0; background: linear-gradient(to left, ${bg}, transparent); }
          `}</style>
          <div className="scg-marquee-fade" style={{ padding: '40px 0' }}>
            <div className="scg-marquee">
              {[...window.CLIENTS, ...window.CLIENTS].map((c, i) =>
            <span key={i} style={{
              ...wm.display, fontSize: 40, color: ink, lineHeight: 1, opacity: .9,
              padding: '0 40px', whiteSpace: 'nowrap',
              display: 'inline-flex', alignItems: 'center', gap: 40
            }}>
                  {c}
                  <span style={{ color: accent, fontSize: 28, opacity: .6 }}>✦</span>
                </span>
            )}
            </div>
          </div>
        </section>
      }

      {/* Offerings, commitment ladder + 5D framework */}
      {sections.offerings !== false &&
      <section id="erbjudanden" style={{ background: bg }}>
          <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 56, alignItems: 'end' }}>
              <div>
                <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>№ 02, Så jobbar vi</div>
                <h2 style={{ ...wm.display, fontSize: 'clamp(64px, 8vw, 128px)', lineHeight: .92, margin: 0, color: ink }}>
                  Senior kompetens.<br />
                  <span style={{ color: accent }}>Skarpa leveranser.</span>
                </h2>
              </div>
              <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 520, margin: 0, color: inkDim }}>
                Vi bygger system, team och ledarskap, oavsett om det handlar om arkitektur, teknisk due diligence eller fractional CTO. AI-readiness är en av vägarna in, inte allt vi gör.
              </p>
            </div>

            {/* Core practice, what we do, broader than AI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 72 }}>
              {[
            {
              num: 'A',
              title: 'Stora initiativ',
              body: 'Dedikerade team inbäddade hos kunden med fullt ansvar för mjukvaru­utvecklingen, från arkitektur till leverans. Outcome-baserat, egen lead, seniora ingenjörer hela vägen.',
              tags: ['Dedikerat team', 'Outcome', 'Arkitektur → leverans']
            },
            {
              num: 'B',
              title: 'Timkonsulting',
              body: 'Vi förstärker befintliga kundteam med seniora konsulter, anpassat efter erat behov och tech-stack. Enskilda profiler där ni behöver tyngd.',
              tags: ['Förstärkning', 'Senior nivå', 'Er stack']
            },
            {
              num: 'C',
              title: 'Rådgivning',
              body: 'Teknisk rådgivning inom arkitektur, kodkvalitet och strategisk planering, ibland som del av M&A due diligence. Vi har suttit på andra sidan bordet.',
              tags: ['Arkitektur', 'Kodkvalitet', 'M&A DD']
            }].
            map((c, i) =>
            <article key={i} style={{
              background: panel, color: ink, padding: 28, borderRadius: 18,
              display: 'flex', flexDirection: 'column', gap: 14,
              border: `1px solid ${line}`
            }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ ...wm.display, fontSize: 44, lineHeight: .9, color: accent }}>{c.num}</div>
                    <div style={{ ...wm.mono, fontSize: 10, color: inkDim, letterSpacing: '.08em' }}>CORE PRACTICE</div>
                  </div>
                  <h3 style={{ ...wm.display, fontSize: 30, lineHeight: 1, margin: 0 }}>{c.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, flex: 1, color: inkDim }}>{c.body}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {c.tags.map((t, j) =>
                <span key={j} style={{
                  ...wm.mono, fontSize: 10, padding: '4px 8px', borderRadius: 999,
                  border: `1px solid ${line}`, color: inkDim
                }}>{t}</span>
                )}
                  </div>
                </article>
            )}
            </div>

            {/* Divider: introducing the AI-readiness track as one specialism */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 48, alignItems: 'end', marginBottom: 32, paddingTop: 40, borderTop: `1px solid ${line}` }}>
              <div>
                <div style={{ ...wm.mono, fontSize: 11, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Specialism</div>
                <h3 style={{ ...wm.display, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: .95, margin: 0, color: ink }}>
                  AI-readiness<br /><span style={{ color: accent }}>track</span>
                </h3>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: inkDim, margin: 0, maxWidth: 620 }}>
                När AI behöver struktur, inte bara verktyg, plockar vi in fyra fokuserade steg ovanpå grunden ovan. Samma seniora ingenjörer, ett annat objektiv. Varje steg står på egna ben; börja där ni är.
              </p>
            </div>

            {/* Commitment ladder timeline */}
            <div style={{ ...wm.mono, fontSize: 11, color: inkDim, letterSpacing: '.12em', textTransform: 'uppercase',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 12 }}>
              {['Klarhet', 'Diagnos', 'Exekvering', 'Löpande'].map((s, i) =>
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: accent, opacity: 1 - i * 0.15 }} />
                  Steg {i + 1} · {s}
                </div>
            )}
            </div>
            <div style={{ height: 2, background: `linear-gradient(to right, ${accent}, ${accent}40)`, marginBottom: 24 }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
              {window.OFFERINGS.map((o, i) => {
              const isAccent = i === 3;
              const bgCard = isAccent ? accent : panel;
              const inkCard = isAccent ? bg : ink;
              const dimCard = isAccent ? 'rgba(10,12,15,.72)' : inkDim;
              return (
                <article key={i} style={{
                  background: bgCard, color: inkCard, padding: 28, borderRadius: 18,
                  display: 'flex', flexDirection: 'column', gap: 14, minHeight: 440,
                  border: isAccent ? 'none' : `1px solid ${line}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ ...wm.display, fontSize: 64, lineHeight: .9, color: isAccent ? bg : accent }}>{o.num}</div>
                      <div style={{ ...wm.mono, fontSize: 10, color: dimCard, letterSpacing: '.06em' }}>{o.when}</div>
                    </div>
                    <div style={{ ...wm.mono, fontSize: 11, color: isAccent ? bg : accent, letterSpacing: '.06em', textTransform: 'uppercase', opacity: isAccent ? .85 : 1 }}>
                      {o.kicker}
                    </div>
                    <h3 style={{ ...wm.display, fontSize: 36, lineHeight: .95, margin: 0 }}>{o.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, flex: 1, color: dimCard }}>{o.body}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {o.bullets.map((b, j) =>
                    <span key={j} style={{
                      ...wm.mono, fontSize: 10, padding: '4px 8px', borderRadius: 999,
                      border: `1px solid ${isAccent ? 'rgba(10,12,15,.25)' : line}`,
                      color: dimCard
                    }}>{b}</span>
                    )}
                    </div>
                    <a style={{ ...wm.mono, fontSize: 12, color: isAccent ? bg : accent, textDecoration: 'none', letterSpacing: '.04em', fontWeight: 600 }}>Läs mer →</a>
                  </article>);

            })}
            </div>

            {/* 5-dimension framework, interactive */}
            <WarmFrameworkPanel wm={wm} ink={ink} inkDim={inkDim} bg={bg} accent={accent} panel={panel} line={line} />

            {/* See all offerings */}
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${line}`, textAlign: 'center' }}>
              <a href="erbjudanden.html" style={{
              ...wm.mono, fontSize: 13, padding: '14px 28px', borderRadius: 999,
              border: `1px solid ${accent}`, color: accent, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 10, letterSpacing: '.04em'
            }}>Alla erbjudanden &amp; ramverk i detalj →</a>
            </div>
          </div>
        </section>
      }

      {/* Cases */}
      {sections.cases !== false &&
      <section id="case" style={{ background: panel, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
          <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>№ 03, Utvalda case</div>
            <h2 style={{ ...wm.display, fontSize: 'clamp(64px, 8vw, 128px)', lineHeight: .92, margin: 0, marginBottom: 56, color: ink }}>
              Historier vi<br />gärna berättar.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {window.CASES.map((c, i) =>
                <WarmCaseRow key={i} c={c} i={i} wm={wm} ink={ink} inkDim={inkDim} accent={accent} line={line} panelHi={panelHi} />
              )}
              <div style={{ borderTop: `1px solid ${line}`, paddingTop: 32, textAlign: 'center' }}>
                <a href="case.html" style={{
                ...wm.mono, fontSize: 13, padding: '14px 28px', borderRadius: 999,
                border: `1px solid ${accent}`, color: accent, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 10, letterSpacing: '.04em'
              }}>Alla case →</a>
              </div>
            </div>
          </div>
        </section>
      }

      {/* Approach */}
      {sections.approach !== false &&
      <section style={{ background: bg }}>
          <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>№ 04, Så jobbar vi</div>
            <h2 style={{ ...wm.display, fontSize: 'clamp(64px, 8vw, 120px)', lineHeight: .92, margin: 0, marginBottom: 64, color: ink }}>
              Lyssna. Analysera.<br />
              <span style={{ color: accent }}>Leverera.</span> Lämna över.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
              {window.APPROACH.map((a, i) =>
            <div key={i} style={{ borderTop: `2px solid ${i === 0 ? accent : line}`, paddingTop: 20 }}>
                  <div style={{ ...wm.display, fontSize: 88, lineHeight: .9, color: accent }}>{a.step}</div>
                  <h3 style={{ ...wm.display, fontSize: 40, lineHeight: .95, margin: '12px 0 12px', color: ink }}>{a.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: inkDim, margin: 0 }}>{a.body}</p>
                </div>
            )}
            </div>
          </div>
        </section>
      }

      {/* Testimonials */}
      {sections.testimonials !== false &&
      <section style={{ background: panel, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
          <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>№ 05, Från kunder</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginTop: 48 }}>
              <figure style={{ margin: 0, gridColumn: '1 / span 2' }}>
                <div style={{ ...wm.display, fontSize: 240, lineHeight: .3, color: accent, marginBottom: 20 }}>

“</div>
                <blockquote style={{ ...wm.display, fontSize: 'clamp(44px, 5.5vw, 88px)', lineHeight: 1, margin: 0, color: ink, maxWidth: 1100 }}>
                  {window.TESTIMONIALS[0].quote}
                </blockquote>
                <figcaption style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 999, background: panelHi, border: `1px solid ${line}` }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: ink }}>{window.TESTIMONIALS[0].name}</div>
                    <div style={{ ...wm.mono, fontSize: 12, color: inkDim }}>{window.TESTIMONIALS[0].role}</div>
                  </div>
                </figcaption>
              </figure>
              {window.TESTIMONIALS.slice(1).map((t, i) => <figure key={i} style={{ margin: 0, paddingTop: 40, borderTop: `1px solid ${line}` }}>
                  <blockquote style={{ margin: 0, fontSize: 20, lineHeight: 1.4, color: ink }}>"{t.quote}"</blockquote>
                  <figcaption style={{ ...wm.mono, fontSize: 12, color: inkDim, marginTop: 20 }}>, {t.name}, {t.role}</figcaption>
                </figure>)}
            </div>
          </div>
        </section>
      }

      {/* Team */}
      {sections.team !== false &&
      <section style={{ background: bg }}>
          <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 48, alignItems: 'end' }}>
              <div>
                <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>№ 06, Teamet</div>
                <h2 style={{ ...wm.display, fontSize: 'clamp(64px, 8vw, 120px)', lineHeight: .92, margin: 0, color: ink }}>Snälla proffs.</h2>
              </div>
              <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 440, margin: 0, color: inkDim }}>
                Handplockade seniora ingenjörer och arkitekter. Alla har 13+ år bakom sig, och alla tycker att man kan vara skicklig utan att vara jobbig.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {window.TEAM.map((p, i) =>
            <div key={i}>
                  <div style={{
                aspectRatio: '4/5', width: '100%', borderRadius: 12,
                background: `repeating-linear-gradient(135deg, ${panel}, ${panel} 8px, ${panelHi} 8px, ${panelHi} 9px)`,
                border: `1px solid ${line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...wm.mono, fontSize: 11, color: inkFaint, letterSpacing: '.04em'
              }}>{`// porträtt · ${p.name.split(' ')[0].toLowerCase()}`}</div>
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <div style={{ ...wm.display, fontSize: 34, lineHeight: 1, color: ink }}>{p.name}</div>
                      <div style={{ fontSize: 14, color: ink, marginTop: 4 }}>{p.role}</div>
                    </div>
                    <div style={{ ...wm.mono, fontSize: 11, color: inkDim }}>0{i + 1}</div>
                  </div>
                  <div style={{ ...wm.mono, fontSize: 11, color: inkDim, marginTop: 6 }}>{p.tag}</div>
                </div>
            )}
            </div>
            <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${line}`, textAlign: 'center' }}>
              <a href="team.html" style={{
              ...wm.mono, fontSize: 13, padding: '14px 28px', borderRadius: 999,
              border: `1px solid ${accent}`, color: accent, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 10, letterSpacing: '.04em'
            }}>Hela teamet &amp; bios →</a>
            </div>
          </div>
        </section>
      }

      {/* Careers */}
      {sections.careers !== false &&
      <section style={{ background: accent }}>
          <div style={{ ...wm.container, padding: `${pad}px ${gutter}px`, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex' }}>
              <window.LogoImg height={120} />
            </div>
            <h2 style={{ ...wm.display, fontSize: 'clamp(72px, 10vw, 160px)', lineHeight: .92, margin: '24px 0 20px', color: bg }}>
              Jobba med oss?
            </h2>
            <p style={{ fontSize: 20, lineHeight: 1.5, margin: '0 auto 40px', maxWidth: 640, color: bg }}>
              Vi växer långsamt och medvetet. Om du har 10+ år bakom dig och vill jobba med människor som bryr sig, hör av dig.
            </p>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {['Senior Software Engineer', 'Senior Architect'].map((r) =>
            <a key={r} href="careers.html" style={{
              background: bg, color: ink, padding: '14px 22px', borderRadius: 999,
              textDecoration: 'none', fontSize: 14, fontWeight: 500
            }}>{r} →</a>
            )}
              <a href="careers.html" style={{
                background: 'transparent', color: bg, padding: '14px 22px', borderRadius: 999,
                textDecoration: 'none', fontSize: 14, fontWeight: 600,
                border: `1px solid ${bg}`
              }}>Alla roller &amp; kultur →</a>
            </div>
          </div>
        </section>
      }

      {/* Footer */}
      {sections.footer !== false &&
      <footer style={{ background: bg, color: ink, padding: `${pad}px 0 40px`, borderTop: `1px solid ${line}` }}>
          <div style={{ ...wm.container }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 80 }}>
              <div>
                <window.LogoImg height={80} dark style={{ marginBottom: 12 }} />
                <div style={{ ...wm.display, fontSize: 22, color: ink }}>Stockholm Code Group</div>
                <p style={{ fontSize: 14, color: inkDim, lineHeight: 1.6, marginTop: 16, maxWidth: 340 }}>
                  Seniora ingenjörer i Stockholm. We bring love to software, sedan 2007.
                </p>
              </div>
              {[
            { h: 'Sidor', items: [
              { label: 'Startsida', href: 'index.html' },
              { label: 'Erbjudanden', href: 'erbjudanden.html' },
              { label: 'Case', href: 'case.html' },
              { label: 'Team', href: 'team.html' },
              { label: 'Karriär', href: 'careers.html' }]
            },
            { h: 'Utvalda case', items: [
              { label: 'Warner Bros. Discovery', href: 'case.html' },
              { label: 'SL', href: 'case.html' },
              { label: 'Blocket', href: 'case.html' }]
            },
            { h: 'Hitta oss', items: [
              { label: 'contactus@stockholmcode.se', href: 'mailto:contactus@stockholmcode.se' },
              { label: 'Regeringsgatan 74\n111 39 Stockholm', href: null }]
            }].
            map((col, i) =>
            <div key={i}>
                  <div style={{ ...wm.mono, fontSize: 11, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>{col.h}</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.items.map((it) =>
                <li key={it.label} style={{ fontSize: 14, color: ink, whiteSpace: 'pre-line' }}>
                  {it.href ?
                  <a href={it.href} style={{ color: ink, textDecoration: 'none', borderBottom: `1px solid transparent` }}
                  onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = accent}
                  onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>
                      {it.label}
                    </a> :
                  it.label}
                </li>
                )}
                  </ul>
                </div>
            )}
            </div>
            <div style={{ paddingTop: 24, borderTop: `1px solid ${line}`, ...wm.mono, fontSize: 11, color: inkDim, display: 'flex', justifyContent: 'space-between', letterSpacing: '.06em' }}>
              <div>© 2026 Stockholm Code Group AB</div>
              <div>WE BRING LOVE</div>
            </div>
          </div>
        </footer>
      }
    </div>);

}

window.VariantWarm = VariantWarm;