// Variant 2: Terminal — dark, monospace-forward, technical, for dev/architect audience.

function VariantTerminal({ density = 'regular', sections = {}, tone = 'technical' }) {
  const S = window.SCG;
  const pad = density === 'compact' ? 72 : density === 'comfy' ? 128 : 96;
  const gutter = 48;
  const bg = '#0A0C0F';
  const panel = '#11141A';
  const line = 'rgba(255,255,255,.08)';
  const ink = '#E6EAF0';
  const dim = 'rgba(230,234,240,.55)';

  const lead = {
    warm: 'Vi är seniora ingenjörer och arkitekter. Vi tycker om att bygga saker som håller. AI-native, produktions­härdat, människo­vänligt.',
    confident: 'Seniora ingenjörer och arkitekter. AI-native leveranser för företag som inte nöjer sig med demos.',
    technical: 'Seniora ingenjörer + arkitekter. AI-native leveranser. TypeScript, Go, Rust, Python. Kubernetes, event-driven, distribuerat.',
  }[tone];

  const tm = {
    page: { background: bg, color: ink, fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.55 },
    container: { maxWidth: 1320, margin: '0 auto', padding: `0 ${gutter}px` },
    mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
    h1Mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontWeight: 600, fontSize: 'clamp(40px, 5.6vw, 84px)', lineHeight: 1.05, letterSpacing: '-.02em', margin: 0 },
    h2Mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontWeight: 600, fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 1.1, letterSpacing: '-.02em', margin: 0 },
    chip: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: 11, padding: '6px 10px', borderRadius: 6,
      border: `1px solid ${line}`, color: dim, letterSpacing: '.04em',
    },
  };

  return (
    <div style={tm.page}>
      {/* Nav: terminal bar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,12,15,.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${line}` }}>
        <div style={{ ...tm.container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <window.TurtleMark size={26} stroke={ink} strokeWidth={1.4} />
            <div style={{ ...tm.mono, fontSize: 13, color: ink }}>
              scg.se<span style={{ color: S.accent }}>_</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...tm.mono, fontSize: 12 }}>
            {['./erbjudanden', './case', './team', './karriär'].map((x) => (
              <a key={x} style={{ color: dim, padding: '6px 12px', textDecoration: 'none', borderRadius: 6 }}>{x}</a>
            ))}
            <a style={{
              marginLeft: 12, ...tm.mono,
              background: S.accent, color: '#0A0C0F',
              padding: '8px 14px', borderRadius: 6, fontSize: 12,
              textDecoration: 'none', fontWeight: 600,
            }}>$ contact --now</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      {sections.hero !== false && (
        <header style={{ borderBottom: `1px solid ${line}` }}>
          <div style={{ ...tm.container, padding: `${pad + 40}px ${gutter}px ${pad}px`, display: 'grid', gridTemplateColumns: '70px 1fr', gap: 40 }}>
            {/* Left rail line numbers */}
            <div style={{ ...tm.mono, fontSize: 11, color: 'rgba(230,234,240,.25)', lineHeight: 1.7, paddingTop: 8, userSelect: 'none' }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i}>{String(i + 1).padStart(2, '0')}</div>
              ))}
            </div>
            <div>
              <div style={{ ...tm.mono, fontSize: 12, color: S.accent, marginBottom: 20 }}>
                <span style={{ color: dim }}>// </span>stockholm_code_group
                <span style={{ color: dim }}> — est. 2019</span>
              </div>
              <h1 style={tm.h1Mono}>
                <span style={{ color: dim }}>const </span>
                <span style={{ color: ink }}>scg </span>
                <span style={{ color: dim }}>= </span>
                <span style={{ color: S.accent }}>{`{`}</span><br />
                &nbsp;&nbsp;seniora_ingenjörer: <span style={{ color: '#7FD1B9' }}>true</span>,<br />
                &nbsp;&nbsp;ai_native:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#7FD1B9' }}>true</span>,<br />
                &nbsp;&nbsp;junior_trappa:&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#E98080' }}>false</span>,<br />
                <span style={{ color: S.accent }}>{`}`}</span>
              </h1>
              <p style={{ marginTop: 40, fontSize: 19, lineHeight: 1.55, color: ink, maxWidth: 680 }}>{lead}</p>
              <div style={{ marginTop: 36, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <a style={{
                  ...tm.mono, background: S.accent, color: '#0A0C0F',
                  padding: '14px 20px', borderRadius: 8, textDecoration: 'none',
                  fontWeight: 600, fontSize: 13,
                }}>$ scg init --ai-scan</a>
                <a style={{
                  ...tm.mono, color: ink, border: `1px solid ${line}`,
                  padding: '14px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 13,
                }}>$ scg cases --all</a>
                <span style={tm.chip}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: '#7FD1B9' }} />
                  Tar nya uppdrag Q3
                </span>
              </div>
            </div>
          </div>
          {/* Stats strip */}
          <div style={{ borderTop: `1px solid ${line}` }}>
            <div style={{ ...tm.container, padding: '24px 48px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {window.STATS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <div style={{ ...tm.mono, fontWeight: 600, fontSize: 32, color: ink, letterSpacing: '-.02em' }}>
                    {s.num}<span style={{ color: S.accent }}>{s.unit}</span>
                  </div>
                  <div style={{ fontSize: 12, color: dim, lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Logos */}
      {sections.logos !== false && (
        <section style={{ background: panel, borderBottom: `1px solid ${line}` }}>
          <div style={{ ...tm.container, padding: '28px 48px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ ...tm.mono, fontSize: 11, color: dim, letterSpacing: '.06em' }}>// trusted_by</div>
            <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
              {window.CLIENTS.map((c) => (
                <span key={c} style={{ ...tm.mono, fontSize: 15, color: ink }}>{c}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offerings */}
      {sections.offerings !== false && (
        <section style={{ ...tm.container, padding: `${pad}px ${gutter}px` }}>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 56, gap: 40 }}>
            <div>
              <div style={{ ...tm.mono, fontSize: 12, color: S.accent, marginBottom: 16 }}>// services.ts</div>
              <h2 style={tm.h2Mono}>Fyra paket.<br />Inga hemliga prislistor.</h2>
            </div>
            <div style={{ ...tm.mono, fontSize: 12, color: dim }}>04 items</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: line }}>
            {window.OFFERINGS.map((o, i) => (
              <article key={i} style={{
                background: bg, padding: '36px 36px 40px', position: 'relative',
                display: 'flex', flexDirection: 'column', gap: 18, minHeight: 320,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ ...tm.mono, fontSize: 12, color: S.accent }}>[{o.num}]</span>
                  <span style={{ ...tm.mono, fontSize: 11, color: dim }}>{o.kicker}</span>
                </div>
                <h3 style={{ ...tm.mono, fontSize: 24, fontWeight: 600, letterSpacing: '-.01em', margin: 0, color: ink }}>{o.title}</h3>
                <p style={{ color: ink, fontSize: 14, lineHeight: 1.6, margin: 0, flex: 1 }}>{o.body}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {o.bullets.map((b, j) => (
                    <span key={j} style={{ ...tm.mono, fontSize: 10, padding: '4px 8px', borderRadius: 4, background: panel, color: dim, border: `1px solid ${line}` }}>
                      {b}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Cases */}
      {sections.cases !== false && (
        <section style={{ background: panel, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
          <div style={{ ...tm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ ...tm.mono, fontSize: 12, color: S.accent, marginBottom: 16 }}>// cases/</div>
            <h2 style={{ ...tm.h2Mono, marginBottom: 48 }}>Uppdrag i produktion.</h2>

            <div style={{ border: `1px solid ${line}`, borderRadius: 10, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '80px 1.2fr 1fr 2fr 0.9fr 80px',
                padding: '14px 20px', background: bg,
                ...tm.mono, fontSize: 11, color: dim, letterSpacing: '.06em',
                borderBottom: `1px solid ${line}`,
              }}>
                <div>YEAR</div><div>CLIENT</div><div>SECTOR</div><div>OUTCOME</div><div>METRIC</div><div style={{ textAlign: 'right' }}>→</div>
              </div>
              {window.CASES.map((c, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '80px 1.2fr 1fr 2fr 0.9fr 80px',
                  padding: '28px 20px', alignItems: 'center',
                  borderBottom: i < window.CASES.length - 1 ? `1px solid ${line}` : 'none',
                  background: panel,
                }}>
                  <div style={{ ...tm.mono, fontSize: 12, color: dim }}>{c.year}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 20, color: ink }}>{c.client}</div>
                  <div style={{ ...tm.mono, fontSize: 12, color: dim }}>{c.sector}</div>
                  <div style={{ fontSize: 14, color: ink, lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{c.outcome}</div>
                    <div style={{ color: dim, fontSize: 13 }}>{c.body}</div>
                  </div>
                  <div>
                    <div style={{ ...tm.mono, fontSize: 22, fontWeight: 600, color: S.accent, letterSpacing: '-.02em' }}>{c.metric}</div>
                    <div style={{ ...tm.mono, fontSize: 10, color: dim }}>{c.metricLabel}</div>
                  </div>
                  <div style={{ textAlign: 'right', color: dim }}>→</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Approach */}
      {sections.approach !== false && (
        <section style={{ ...tm.container, padding: `${pad}px ${gutter}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, marginBottom: 48 }}>
            <div>
              <div style={{ ...tm.mono, fontSize: 12, color: S.accent, marginBottom: 16 }}>// how</div>
              <h2 style={tm.h2Mono}>Vårt<br />arbetssätt.</h2>
            </div>
            <p style={{ fontSize: 17, color: ink, lineHeight: 1.55, alignSelf: 'end', maxWidth: 620 }}>
              Fyra steg. Kort, tydligt, utan konsultriddare. Vi lyssnar först, analyserar, levererar och lämnar över.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: line, border: `1px solid ${line}` }}>
            {window.APPROACH.map((a, i) => (
              <div key={i} style={{ background: bg, padding: 28, minHeight: 200 }}>
                <div style={{ ...tm.mono, fontSize: 12, color: i === 0 ? S.accent : dim }}>{a.step} →</div>
                <h3 style={{ ...tm.mono, fontSize: 20, fontWeight: 600, color: ink, margin: '16px 0 12px' }}>{a.title}()</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: dim, margin: 0 }}>{a.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {sections.testimonials !== false && (
        <section style={{ background: panel, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
          <div style={{ ...tm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ ...tm.mono, fontSize: 12, color: S.accent, marginBottom: 16 }}>// reviews</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 32 }}>
              {window.TESTIMONIALS.map((t, i) => (
                <figure key={i} style={{ margin: 0, padding: 28, background: bg, border: `1px solid ${line}`, borderRadius: 10 }}>
                  <div style={{ ...tm.mono, fontSize: 11, color: S.accent, marginBottom: 16 }}>★★★★★</div>
                  <blockquote style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: ink }}>
                    "{t.quote}"
                  </blockquote>
                  <figcaption style={{ ...tm.mono, marginTop: 20, fontSize: 11, color: dim }}>
                    — {t.name} · {t.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {sections.team !== false && (
        <section style={{ ...tm.container, padding: `${pad}px ${gutter}px` }}>
          <div style={{ ...tm.mono, fontSize: 12, color: S.accent, marginBottom: 16 }}>// team[]</div>
          <h2 style={{ ...tm.h2Mono, marginBottom: 48 }}>6 seniora<br />ingenjörer.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: line, border: `1px solid ${line}` }}>
            {window.TEAM.map((p, i) => (
              <div key={i} style={{ background: bg, padding: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, flex: '0 0 64px', borderRadius: 8, background: 'repeating-linear-gradient(135deg,#1A1E25,#1A1E25 4px,#11141A 4px,#11141A 5px)', border: `1px solid ${line}` }} />
                <div>
                  <div style={{ ...tm.mono, fontSize: 15, fontWeight: 600, color: ink }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: S.accent, margin: '4px 0' }}>{p.role}</div>
                  <div style={{ ...tm.mono, fontSize: 10, color: dim }}>{p.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Careers */}
      {sections.careers !== false && (
        <section style={{ borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}`, background: bg }}>
          <div style={{ ...tm.container, padding: `${pad}px ${gutter}px` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40, flexWrap: 'wrap', gap: 24 }}>
              <div>
                <div style={{ ...tm.mono, fontSize: 12, color: S.accent, marginBottom: 16 }}>// careers</div>
                <h2 style={tm.h2Mono}>Jobba med oss.</h2>
              </div>
              <div style={{ ...tm.mono, fontSize: 12, color: dim }}>4 open roles</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: line, border: `1px solid ${line}`, borderRadius: 8, overflow: 'hidden' }}>
              {[
                { r: 'Senior Software Engineer', l: 'Stockholm / hybrid', t: 'Full-time' },
                { r: 'Staff AI Engineer', l: 'Stockholm / remote', t: 'Full-time' },
                { r: 'Principal Architect', l: 'Stockholm', t: 'Full-time' },
                { r: 'Spontanansökan', l: 'Stockholm', t: 'Always open' },
              ].map((x) => (
                <a key={x.r} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', alignItems: 'center',
                  padding: '20px 24px', background: bg, textDecoration: 'none',
                }}>
                  <div style={{ ...tm.mono, fontSize: 16, fontWeight: 600, color: ink }}>{x.r}</div>
                  <div style={{ ...tm.mono, fontSize: 12, color: dim }}>{x.l}</div>
                  <div style={{ ...tm.mono, fontSize: 12, color: dim }}>{x.t}</div>
                  <div style={{ color: S.accent, textAlign: 'right', ...tm.mono }}>→</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {sections.footer !== false && (
        <footer style={{ background: bg, padding: `${pad}px 0 32px` }}>
          <div style={{ ...tm.container }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <window.TurtleMark size={28} stroke={ink} strokeWidth={1.4} />
                  <div style={{ ...tm.mono, fontSize: 14, color: ink }}>scg.se<span style={{ color: S.accent }}>_</span></div>
                </div>
                <p style={{ fontSize: 13, color: dim, lineHeight: 1.6, margin: 0, maxWidth: 340 }}>
                  Seniora ingenjörer och arkitekter i Stockholm. Vi bygger mjukvara som vi själva vill underhålla.
                </p>
              </div>
              {[
                { h: '// services', items: ['AI-scans', 'Konsulter', 'Team', 'CTO'] },
                { h: '// company', items: ['Case', 'Team', 'Karriär', 'Kontakt'] },
                { h: '// contact', items: ['contactus@stockholmcode.se', 'Regeringsgatan 74', 'Stockholm'] },
              ].map((col, i) => (
                <div key={i}>
                  <div style={{ ...tm.mono, fontSize: 11, color: S.accent, marginBottom: 14 }}>{col.h}</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {col.items.map((it) => (
                      <li key={it} style={{ ...tm.mono, fontSize: 12, color: ink }}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 60, paddingTop: 20, borderTop: `1px solid ${line}`, ...tm.mono, fontSize: 11, color: dim, display: 'flex', justifyContent: 'space-between' }}>
              <div>© 2026 Stockholm Code Group AB</div>
              <div>// we_bring_love</div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

window.VariantTerminal = VariantTerminal;
