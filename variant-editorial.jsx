// Variant 1: Editorial — light, calm, typographic, warm-human
// Amatic SC display + DM Sans body + JetBrains Mono chrome.

function VariantEditorial({ density = 'regular', sections = {}, tone = 'warm' }) {
  const S = window.SCG;
  const pad = density === 'compact' ? 72 : density === 'comfy' ? 136 : 104;
  const gutter = 56;

  const heroKicker = {
    warm: 'Stockholm · sedan 2007',
    confident: 'Senior software engineering · Stockholm',
    technical: 'scg.se — est. 2007',
  }[tone] || 'Stockholm · sedan 2007';

  const heroLead = {
    warm: 'Vi är ett litet gäng seniora ingenjörer och arkitekter som bygger AI-nativ mjukvara för företag som menar allvar.',
    confident: 'Ett kollektiv av seniora ingenjörer och arkitekter. Vi bygger AI-nativ mjukvara för företag som kräver resultat.',
    technical: 'Seniora ingenjörer + arkitekter. AI-native leveranser. Inga junior-trappor, inga ramar, ingen overhead.',
  }[tone] || '';

  const ed = {
    page: {
      background: S.bg, color: S.ink,
      fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
      fontSize: 16, lineHeight: 1.55,
    },
    container: { maxWidth: 1240, margin: '0 auto', padding: `0 ${gutter}px` },
    sectNum: {
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: 11, letterSpacing: '.12em', color: S.muted, textTransform: 'uppercase',
    },
    h1: {
      fontFamily: "'Amatic SC', cursive", fontWeight: 700,
      fontSize: 'clamp(72px, 10vw, 168px)', lineHeight: .92, letterSpacing: '-.005em',
      margin: 0, color: S.ink,
    },
    h2: {
      fontFamily: "'Amatic SC', cursive", fontWeight: 700,
      fontSize: 'clamp(56px, 7vw, 112px)', lineHeight: .95, margin: 0,
    },
    body: { fontSize: 18, lineHeight: 1.55, color: S.ink, maxWidth: 620 },
    small: { fontSize: 14, color: S.muted, lineHeight: 1.5 },
    mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
    rule: { border: 0, borderTop: `1px solid ${S.border}`, margin: 0 },
  };

  return (
    <div style={ed.page}>
      {/* ─── Nav ─── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(255,255,255,.86)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${S.border}`,
      }}>
        <div style={{ ...ed.container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <window.LogoLockup compact color={S.ink} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, ...ed.mono, fontSize: 12, letterSpacing: '.04em' }}>
            <a style={{ color: S.ink, textDecoration: 'none' }}>Erbjudanden</a>
            <a style={{ color: S.ink, textDecoration: 'none' }}>Case</a>
            <a style={{ color: S.ink, textDecoration: 'none' }}>Team</a>
            <a style={{ color: S.ink, textDecoration: 'none' }}>Karriär</a>
            <a style={{
              color: S.ink, background: 'transparent',
              border: `1px solid ${S.ink}`, padding: '8px 14px', borderRadius: 999,
              textDecoration: 'none',
            }}>Prata med oss →</a>
          </div>
        </div>
      </nav>

      {sections.hero !== false && (
        <header style={{ ...ed.container, padding: `${pad + 40}px ${gutter}px ${pad}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 48, marginBottom: 40 }}>
            <div style={{ ...ed.mono, fontSize: 12, letterSpacing: '.08em', color: S.muted, textTransform: 'uppercase' }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: S.accent, marginRight: 10, verticalAlign: 'middle' }} />
              {heroKicker}
            </div>
            <div style={{ ...ed.mono, fontSize: 12, color: S.muted, textAlign: 'right' }}>
              Nº 01 — Vem vi är
            </div>
          </div>
          <h1 style={ed.h1}>
            Vi bygger<br />
            mjukvara <span style={{ color: S.accent, fontStyle: 'normal' }}>med hjärta</span><br />
            och arkitektur.
          </h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 56, alignItems: 'start' }}>
            <p style={{ ...ed.body, fontSize: 22, lineHeight: 1.45 }}>
              {heroLead}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360, justifySelf: 'end' }}>
              <a style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
                background: S.ink, color: '#fff', padding: '16px 22px', borderRadius: 999,
                textDecoration: 'none', fontSize: 15, fontWeight: 500,
              }}>Boka en AI-scan <span style={{ color: S.accent }}>→</span></a>
              <a style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
                color: S.ink, padding: '16px 22px', borderRadius: 999,
                border: `1px solid ${S.border}`,
                textDecoration: 'none', fontSize: 15, fontWeight: 500,
              }}>Se våra case <span>↓</span></a>
            </div>
          </div>
          {/* Hero proof strip */}
          <div style={{
            marginTop: 80, paddingTop: 28, borderTop: `1px solid ${S.border}`,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
          }}>
            {window.STATS.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Amatic SC', cursive", fontWeight: 700, fontSize: 64, lineHeight: 1, color: S.ink }}>
                  {s.num}<span style={{ color: S.accent }}>{s.unit}</span>
                </div>
                <div style={{ ...ed.small, marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </header>
      )}

      {/* ─── Logos ─── */}
      {sections.logos !== false && (
        <section style={{ background: S.card, borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}` }}>
          <div style={{ ...ed.container, padding: '32px 56px', display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
            <div style={{ ...ed.mono, fontSize: 11, color: S.muted, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Kunder vi är stolta över
            </div>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
              {window.CLIENTS.map((c) => (
                <span key={c} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 500,
                  color: S.muted, letterSpacing: '-.01em',
                }}>{c}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Offerings ─── */}
      {sections.offerings !== false && (
        <section style={{ ...ed.container, padding: `${pad}px ${gutter}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, marginBottom: 64 }}>
            <div>
              <div style={ed.sectNum}>Nº 02 — Erbjudanden</div>
              <h2 style={{ ...ed.h2, marginTop: 16 }}>Fyra sätt<br />att jobba med oss.</h2>
            </div>
            <p style={{ ...ed.body, alignSelf: 'end' }}>
              Ingen katalog på 40 tjänster. Fyra tydliga sätt att få in senior ingenjörskraft, anpassade efter vad ni faktiskt behöver just nu.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
            {window.OFFERINGS.map((o, i) => (
              <div key={i} style={{
                padding: '40px 36px',
                borderRight: i % 2 === 0 ? `1px solid ${S.border}` : 'none',
                borderBottom: i < 2 ? `1px solid ${S.border}` : 'none',
                background: S.bg,
                display: 'flex', flexDirection: 'column', gap: 20, minHeight: 320,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ ...ed.mono, fontSize: 11, color: S.accent, letterSpacing: '.1em' }}>{o.num} — {o.kicker}</span>
                  <span style={{ color: S.muted, fontSize: 20 }}>→</span>
                </div>
                <h3 style={{
                  fontFamily: "'Amatic SC', cursive", fontWeight: 700,
                  fontSize: 44, lineHeight: .95, margin: 0,
                }}>{o.title}</h3>
                <p style={{ color: S.ink, fontSize: 15, lineHeight: 1.55, margin: 0, flex: 1 }}>{o.body}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {o.bullets.map((b, j) => (
                    <span key={j} style={{
                      ...ed.mono, fontSize: 11,
                      padding: '5px 10px', borderRadius: 999, border: `1px solid ${S.border}`,
                      color: S.muted, background: S.card,
                    }}>{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Cases ─── */}
      {sections.cases !== false && (
        <section style={{ background: S.ink, color: '#fff' }}>
          <div style={{ ...ed.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, marginBottom: 64 }}>
              <div>
                <div style={{ ...ed.sectNum, color: 'rgba(255,255,255,.6)' }}>Nº 03 — Utvalda case</div>
                <h2 style={{ ...ed.h2, marginTop: 16, color: '#fff' }}>Kod i produktion.<br />Inte slides.</h2>
              </div>
              <p style={{ ...ed.body, color: 'rgba(255,255,255,.8)', alignSelf: 'end' }}>
                Fyra uppdrag vi gärna pratar om. Fler finns — fråga oss vid en kaffe.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.12)' }}>
              {window.CASES.map((c, i) => (
                <article key={i} style={{
                  background: S.ink, padding: '40px 36px',
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 24,
                  minHeight: 260,
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ ...ed.mono, fontSize: 11, letterSpacing: '.08em', color: 'rgba(255,255,255,.5)' }}>
                      {c.year} · {c.sector}
                    </div>
                    <h3 style={{ fontFamily: "'Amatic SC', cursive", fontWeight: 700, fontSize: 54, lineHeight: .95, margin: 0 }}>
                      {c.client}
                    </h3>
                    <div style={{ fontSize: 17, color: '#fff', fontWeight: 500 }}>{c.outcome}</div>
                    <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>{c.body}</p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <div style={{
                      fontFamily: "'Amatic SC', cursive", fontWeight: 700,
                      fontSize: 72, lineHeight: 1, color: S.accent,
                    }}>{c.metric}</div>
                    <div style={{ ...ed.mono, fontSize: 11, color: 'rgba(255,255,255,.5)', letterSpacing: '.06em' }}>{c.metricLabel}</div>
                  </div>
                </article>
              ))}
            </div>
            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <a style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: '#fff', border: '1px solid rgba(255,255,255,.25)',
                padding: '14px 22px', borderRadius: 999, textDecoration: 'none', fontSize: 14,
              }}>Alla case <span style={{ color: S.accent }}>→</span></a>
            </div>
          </div>
        </section>
      )}

      {/* ─── Approach ─── */}
      {sections.approach !== false && (
        <section style={{ ...ed.container, padding: `${pad}px ${gutter}px` }}>
          <div style={{ marginBottom: 56 }}>
            <div style={ed.sectNum}>Nº 04 — Så jobbar vi</div>
            <h2 style={{ ...ed.h2, marginTop: 16 }}>Små team. Stort ansvar.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {window.APPROACH.map((a, i) => (
              <div key={i} style={{ borderTop: `2px solid ${i === 0 ? S.accent : S.ink}`, paddingTop: 24 }}>
                <div style={{ ...ed.mono, fontSize: 11, color: S.muted, letterSpacing: '.1em' }}>{a.step}</div>
                <h3 style={{ fontFamily: "'Amatic SC', cursive", fontWeight: 700, fontSize: 44, lineHeight: .95, margin: '12px 0 14px' }}>{a.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: S.ink, margin: 0 }}>{a.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Testimonials ─── */}
      {sections.testimonials !== false && (
        <section style={{ background: S.card, borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}` }}>
          <div style={{ ...ed.container, padding: `${pad}px ${gutter}px` }}>
            <div style={ed.sectNum}>Nº 05 — Vad kunder säger</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 48 }}>
              {window.TESTIMONIALS.map((t, i) => (
                <figure key={i} style={{ margin: 0, padding: 32, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 14 }}>
                  <div style={{ fontFamily: "'Amatic SC', cursive", fontSize: 64, lineHeight: .4, color: S.accent, marginBottom: 10 }}>“</div>
                  <blockquote style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: S.ink, fontWeight: 400 }}>
                    {t.quote}
                  </blockquote>
                  <figcaption style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 999, background: S.beige }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: S.ink }}>{t.name}</div>
                      <div style={{ ...ed.mono, fontSize: 11, color: S.muted }}>{t.role}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Team ─── */}
      {sections.team !== false && (
        <section style={{ ...ed.container, padding: `${pad}px ${gutter}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, marginBottom: 56 }}>
            <div>
              <div style={ed.sectNum}>Nº 06 — Teamet</div>
              <h2 style={{ ...ed.h2, marginTop: 16 }}>Människor<br />bakom koden.</h2>
            </div>
            <p style={{ ...ed.body, alignSelf: 'end' }}>
              Vi är ett litet, handplockat team. Alla har minst 13 års erfarenhet och delar en övertygelse: mjukvara byggs av människor som bryr sig.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {window.TEAM.map((p, i) => (
              <div key={i}>
                <window.Placeholder label={`porträtt · ${p.name.split(' ')[0].toLowerCase()}`} ratio="4/5" bg="#EFECE5" />
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontFamily: "'Amatic SC', cursive", fontWeight: 700, fontSize: 32, lineHeight: 1 }}>{p.name}</div>
                  <div style={{ fontSize: 14, color: S.ink, marginTop: 4 }}>{p.role}</div>
                  <div style={{ ...ed.mono, fontSize: 11, color: S.muted, marginTop: 6 }}>{p.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Careers ─── */}
      {sections.careers !== false && (
        <section style={{ background: S.accent }}>
          <div style={{ ...ed.container, padding: `${pad}px ${gutter}px`, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ ...ed.mono, fontSize: 11, color: S.ink, letterSpacing: '.1em', textTransform: 'uppercase' }}>Nº 07 — Karriär</div>
              <h2 style={{ ...ed.h2, marginTop: 16, color: S.ink }}>Jobba med oss.</h2>
              <p style={{ ...ed.body, color: S.ink, marginTop: 20, maxWidth: 560 }}>
                Vi växer försiktigt. Om du har 10+ år bakom dig, gillar att bygga riktiga saker tillsammans med snälla människor — hör av dig.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Senior Software Engineer', 'Staff AI Engineer', 'Principal Architect', 'Spontanansökan'].map((r) => (
                <a key={r} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: S.ink, color: '#fff', padding: '18px 24px', borderRadius: 12,
                  textDecoration: 'none', fontSize: 15, fontWeight: 500,
                }}>
                  {r} <span style={{ color: S.accent }}>→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Footer ─── */}
      {sections.footer !== false && (
        <footer style={{ background: S.ink, color: '#fff', padding: `${pad}px 0 40px` }}>
          <div style={{ ...ed.container }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 80 }}>
              <div>
                <window.LogoLockup color="#fff" />
                <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, lineHeight: 1.6, marginTop: 20, maxWidth: 340 }}>
                  Seniora ingenjörer och arkitekter i Stockholm. Vi bygger mjukvara som vi själva skulle vilja använda.
                </p>
              </div>
              {[
                { h: 'Erbjudanden', items: ['AI-scans', 'Konsulter', 'Team', 'CTO'] },
                { h: 'Bolaget', items: ['Case', 'Team', 'Karriär', 'Kontakt'] },
                { h: 'Hitta oss', items: ['Regeringsgatan 74\n111 39 Stockholm', 'contactus@stockholmcode.se'] },
              ].map((col, i) => (
                <div key={i}>
                  <div style={{ ...ed.mono, fontSize: 11, color: S.accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 18 }}>{col.h}</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.items.map((it) => (
                      <li key={it} style={{ fontSize: 14, color: 'rgba(255,255,255,.8)', whiteSpace: 'pre-line' }}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{
              paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.12)',
              display: 'flex', justifyContent: 'space-between', ...ed.mono, fontSize: 11, color: 'rgba(255,255,255,.5)', letterSpacing: '.06em',
            }}>
              <div>© 2026 Stockholm Code Group AB · We bring love</div>
              <div>scg.se</div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

window.VariantEditorial = VariantEditorial;
