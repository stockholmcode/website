// Slim variant — startsidan som port, inte sammanfattning.
// Tar bort: 5D-ramverk (→ Erbjudanden), case expand, full approach, stor team-grid.
// Behåller: hero, logos, core practices, en AI-track teaser, 3 case-teasers,
// kondenserad approach-rad, 1 hero-testimonial, 3 team-teasers, careers, footer.

function VariantWarmSlim({ density = 'regular', tone = 'confident', sections = {} }) {
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
    if (phase === 'hold') timer = setTimeout(() => setPhase('deleting'), 2200);
    else if (phase === 'deleting') {
      if (typed.length > 0) timer = setTimeout(() => setTyped(typed.slice(0, -1)), 40);
      else { setWordIdx((wordIdx + 1) % WORDS.length); setPhase('typing'); }
    } else if (phase === 'typing') {
      const target = WORDS[wordIdx];
      if (typed.length < target.length) timer = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 70);
      else setPhase('hold');
    }
    return () => clearTimeout(timer);
  }, [phase, typed, wordIdx]);

  // ── Dark palette ────────────────────────────────────────────
  const bg = S.darkBg || '#0A0C0F';
  const panel = '#11141A';
  const panelHi = '#171B22';
  const ink = S.darkInk || '#E6EAF0';
  const inkDim = 'rgba(230,234,240,.58)';
  const inkFaint = 'rgba(230,234,240,.35)';
  const line = 'rgba(255,255,255,.09)';
  const accent = S.accent;

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
          <a href="SCG Startsida.html" style={{ ...wm.display, fontSize: 28, lineHeight: 1, color: ink, whiteSpace: 'nowrap', textDecoration: 'none' }}>
            Stockholm Code Group
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 15 }}>
            {[
              { label: 'Erbjudanden', href: 'SCG Erbjudanden.html' },
              { label: 'Case', href: 'SCG Case.html' },
              { label: 'Team', href: 'SCG Team.html' },
              { label: 'Karriär', href: 'SCG Careers.html' }
            ].map((x) =>
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

      {/* Hero — bantad: foundation-strip blir kompaktare */}
      {sections.hero !== false &&
        <header style={{ background: bg, borderBottom: `1px solid ${line}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...wm.container, padding: `${pad + 20}px ${gutter}px ${pad - 16}px` }}>
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

            <p style={{ marginTop: 48, maxWidth: 720, fontSize: 18, lineHeight: 1.55, color: inkDim }}>
              Ett handplockat team av seniora ingenjörer och arkitekter. I Stockholm, sedan 2007.
              Vi bygger plattformar, moderniserar arkitektur och tar komplexa leveranser i mål —
              med AI som accelerator där det skapar värde.
            </p>

            <div style={{ display: 'flex', marginTop: 40, alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <a href="mailto:contactus@stockholmcode.se" style={{
                background: ink, color: bg, padding: '18px 26px', borderRadius: 999,
                textDecoration: 'none', fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 12
              }}>Börja ett samtal →</a>
              <a href="SCG Erbjudanden.html" style={{
                background: 'transparent', color: ink, padding: '17px 24px', borderRadius: 999,
                textDecoration: 'none', fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 10,
                border: `1px solid ${line}`
              }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: accent }} />
                Se erbjudanden
              </a>
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

      {/* Logos — infinite marquee */}
      {sections.logos !== false &&
        <section style={{ background: bg, borderBottom: `1px solid ${line}`, overflow: 'hidden' }}>
          <style>{`
            @keyframes scgMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            .scg-marquee { display: flex; width: max-content; animation: scgMarquee 40s linear infinite; }
            .scg-marquee:hover { animation-play-state: paused; }
            .scg-marquee-fade { position: relative; }
            .scg-marquee-fade::before, .scg-marquee-fade::after {
              content: ''; position: absolute; top: 0; bottom: 0; width: 140px; pointer-events: none; z-index: 1;
            }
            .scg-marquee-fade::before { left: 0;  background: linear-gradient(to right, ${bg}, transparent); }
            .scg-marquee-fade::after  { right: 0; background: linear-gradient(to left,  ${bg}, transparent); }
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

      {/* Erbjudanden — bara core practices + AI-track teaser-rad */}
      {sections.offerings !== false &&
        <section id="erbjudanden" style={{ background: bg }}>
          <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 56, alignItems: 'end' }}>
              <div>
                <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>№ 02 — Vad vi gör</div>
                <h2 style={{ ...wm.display, fontSize: 'clamp(64px, 8vw, 128px)', lineHeight: .92, margin: 0, color: ink }}>
                  Senior kompetens.<br />
                  <span style={{ color: accent }}>Skarpa leveranser.</span>
                </h2>
              </div>
              <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 520, margin: 0, color: inkDim }}>
                Vi bygger system, team och ledarskap — arkitektur, teknisk due diligence, fractional CTO.
                AI-readiness är en specialism, inte allt vi gör.
              </p>
            </div>

            {/* Core practice — 3 kort */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 56 }}>
              {[
                {
                  num: 'A',
                  title: 'Stora initiativ',
                  body: 'Dedikerade team inbäddade hos kunden med fullt ansvar för leveransen — från arkitektur till produktion.',
                  tags: ['Dedikerat team', 'Outcome', 'Egen lead']
                },
                {
                  num: 'B',
                  title: 'Timkonsulting',
                  body: 'Seniora konsulter som förstärker befintliga team. Enskilda profiler där ni behöver tyngd, i er stack.',
                  tags: ['Förstärkning', 'Senior nivå', 'Er stack']
                },
                {
                  num: 'C',
                  title: 'Rådgivning',
                  body: 'Teknisk rådgivning inom arkitektur, kodkvalitet och strategisk planering — ofta som del av M&A due diligence.',
                  tags: ['Arkitektur', 'Kodkvalitet', 'M&A DD']
                }
              ].map((c, i) =>
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

            {/* AI-track teaser — bara 4 ord på en rad, fullt ramverk lever på Erbjudanden */}
            <div style={{
              padding: '28px 32px', borderRadius: 18, border: `1px solid ${line}`, background: panel,
              display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center'
            }}>
              <div>
                <div style={{ ...wm.mono, fontSize: 11, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Specialism · AI-readiness track
                </div>
                <div style={{ ...wm.display, fontSize: 36, lineHeight: 1, color: ink, marginBottom: 14 }}>
                  Klarhet → Diagnos → Exekvering → Löpande
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: inkDim, margin: 0, maxWidth: 720 }}>
                  Fyra fokuserade steg när AI behöver struktur — inte bara verktyg. Varje steg står på egna ben; börja där ni är.
                </p>
              </div>
              <a href="SCG Erbjudanden.html" style={{
                ...wm.mono, fontSize: 13, padding: '14px 22px', borderRadius: 999,
                border: `1px solid ${accent}`, color: accent, textDecoration: 'none',
                whiteSpace: 'nowrap', letterSpacing: '.04em'
              }}>Se ramverket →</a>
            </div>

            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <a href="SCG Erbjudanden.html" style={{
                ...wm.mono, fontSize: 13, padding: '14px 28px', borderRadius: 999,
                border: `1px solid ${line}`, color: ink, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 10, letterSpacing: '.04em'
              }}>Alla erbjudanden i detalj →</a>
            </div>
          </div>
        </section>
      }

      {/* Cases — 3 teasers, ingen expand. Klick → Case-sidan. */}
      {sections.cases !== false &&
        <section id="case" style={{ background: panel, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
          <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 56, alignItems: 'end' }}>
              <div>
                <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>№ 03 — Utvalda case</div>
                <h2 style={{ ...wm.display, fontSize: 'clamp(64px, 8vw, 128px)', lineHeight: .92, margin: 0, color: ink }}>
                  Historier vi<br />gärna berättar.
                </h2>
              </div>
              <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 460, margin: 0, color: inkDim }}>
                Tre korta. Hela djupet — med arkitektur, stack och intervjuer — finns på Case-sidan.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {window.CASES.slice(0, 3).map((c, i) =>
                <a key={i} href="SCG Case.html" style={{
                  display: 'grid', gridTemplateColumns: '100px 1.2fr 2fr 1fr 60px', gap: 40,
                  padding: '36px 0', alignItems: 'center',
                  borderTop: `1px solid ${line}`, textDecoration: 'none', color: 'inherit',
                  transition: 'background .2s ease'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,145,77,.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ ...wm.display, fontSize: 64, color: accent, lineHeight: .9 }}>0{i + 1}</div>
                  <div>
                    <div style={{ ...wm.display, fontSize: 48, lineHeight: .95, color: ink }}>{c.client}</div>
                    <div style={{ ...wm.mono, fontSize: 11, color: inkDim, letterSpacing: '.06em', marginTop: 8 }}>{c.sector} · {c.year}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 500, color: ink, marginBottom: 6 }}>{c.outcome}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.55, color: inkDim, margin: 0, maxWidth: 480 }}>{c.body}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ ...wm.display, fontSize: 72, lineHeight: .9, color: ink }}>{c.metric}</div>
                    <div style={{ ...wm.mono, fontSize: 11, color: inkDim, letterSpacing: '.06em', marginTop: 6 }}>{c.metricLabel}</div>
                  </div>
                  <div style={{ textAlign: 'right', ...wm.mono, fontSize: 22, color: accent }}>→</div>
                </a>
              )}
              <div style={{ borderTop: `1px solid ${line}`, paddingTop: 32, marginTop: 8, textAlign: 'center' }}>
                <a href="SCG Case.html" style={{
                  ...wm.mono, fontSize: 13, padding: '14px 28px', borderRadius: 999,
                  border: `1px solid ${accent}`, color: accent, textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 10, letterSpacing: '.04em'
                }}>Alla case →</a>
              </div>
            </div>
          </div>
        </section>
      }

      {/* Approach — kondenserad till en rad med stora siffror */}
      {sections.approach !== false &&
        <section style={{ background: bg }}>
          <div style={{ ...wm.container, padding: `${pad - 24}px ${gutter}px` }}>
            <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>№ 04 — Så jobbar vi</div>
            <h2 style={{ ...wm.display, fontSize: 'clamp(56px, 7vw, 96px)', lineHeight: .95, margin: '0 0 56px', color: ink, textAlign: 'center' }}>
              Lyssna · Analysera · <span style={{ color: accent }}>Leverera</span> · Lämna över
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
              {window.APPROACH.map((a, i) =>
                <div key={i} style={{ borderTop: `2px solid ${i === 0 ? accent : line}`, paddingTop: 16 }}>
                  <div style={{ ...wm.mono, fontSize: 11, color: accent, letterSpacing: '.1em', marginBottom: 6 }}>{a.step}</div>
                  <div style={{ ...wm.display, fontSize: 28, lineHeight: 1, color: ink, marginBottom: 8 }}>{a.title}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: inkDim, margin: 0 }}>{a.body}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      }

      {/* Testimonials — ett stort citat, inga småcitat */}
      {sections.testimonials !== false &&
        <section style={{ background: panel, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
          <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>№ 05 — Från kunder</div>
            <figure style={{ margin: 0, marginTop: 24 }}>
              <div style={{ ...wm.display, fontSize: 240, lineHeight: .3, color: accent, marginBottom: 20 }}>“</div>
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
          </div>
        </section>
      }

      {/* Team — 3 teasers + CTA till Team-sidan */}
      {sections.team !== false &&
        <section style={{ background: bg }}>
          <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 48, alignItems: 'end' }}>
              <div>
                <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>№ 06 — Teamet</div>
                <h2 style={{ ...wm.display, fontSize: 'clamp(64px, 8vw, 120px)', lineHeight: .92, margin: 0, color: ink }}>Snälla proffs.</h2>
              </div>
              <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 440, margin: 0, color: inkDim }}>
                ~20 seniora ingenjörer och arkitekter. Alla med 13+ år bakom sig. Tre av dem nedan — hela teamet på Team-sidan.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {window.TEAM.slice(0, 3).map((p, i) =>
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
              <a href="SCG Team.html" style={{
                ...wm.mono, fontSize: 13, padding: '14px 28px', borderRadius: 999,
                border: `1px solid ${accent}`, color: accent, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 10, letterSpacing: '.04em'
              }}>Hela teamet &amp; bios →</a>
            </div>
          </div>
        </section>
      }

      {/* Careers — slut-CTA */}
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
              Vi växer långsamt och medvetet. Om du har 10+ år bakom dig och vill jobba med människor som bryr sig — hör av dig.
            </p>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {['Senior Software Engineer', 'Senior Architect'].map((r) =>
                <a key={r} href="SCG Careers.html" style={{
                  background: bg, color: ink, padding: '14px 22px', borderRadius: 999,
                  textDecoration: 'none', fontSize: 14, fontWeight: 500
                }}>{r} →</a>
              )}
              <a href="SCG Careers.html" style={{
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
                  { label: 'Startsida', href: 'SCG Startsida.html' },
                  { label: 'Erbjudanden', href: 'SCG Erbjudanden.html' },
                  { label: 'Case', href: 'SCG Case.html' },
                  { label: 'Team', href: 'SCG Team.html' },
                  { label: 'Karriär', href: 'SCG Careers.html' }] },
                { h: 'Utvalda case', items: [
                  { label: 'Warner Bros. Discovery', href: 'SCG Case.html' },
                  { label: 'SL', href: 'SCG Case.html' },
                  { label: 'Blocket', href: 'SCG Case.html' }] },
                { h: 'Hitta oss', items: [
                  { label: 'contactus@stockholmcode.se', href: 'mailto:contactus@stockholmcode.se' },
                  { label: 'Regeringsgatan 74\n111 39 Stockholm', href: null }] }
              ].map((col, i) =>
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
                          </a> : it.label}
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
    </div>
  );
}

window.VariantWarmSlim = VariantWarmSlim;
