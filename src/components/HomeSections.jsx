import { SCG, FONTS } from '../lib/theme.js';

// Static homepage sections (logos → careers). Rendered to HTML by Astro at build
// time with NO client JS. Hover effects that were JS handlers are now CSS (see Base.astro).
// Content arrives as props instead of the old window.* globals.
export default function HomeSections({
  hp, clients = [], cases = [], approach = [], testimonials = [], team = [],
  linkBase = '/', assetBase = '/',
}) {
  const { bg, panel, panelHi, ink, inkDim, inkFaint, line, accent } = SCG;
  const gutter = 56;
  const pad = 72; // density: compact
  const wm = {
    container: { maxWidth: 1280, margin: '0 auto', padding: `0 ${gutter}px` },
    mono: { fontFamily: FONTS.mono },
    display: { fontFamily: FONTS.display, fontWeight: 700 },
  };
  const route = (to) => linkBase + String(to).replace(/^\//, '');
  const cta = (c) => (c?.href ? c.href : route(c?.to ?? '/'));

  const off = hp.offerings, cs = hp.cases, ap = hp.approach, tm = hp.team, ca = hp.careers;

  return (
    <>
      {/* Logos — infinite marquee (pure CSS) */}
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
            {[...clients, ...clients].map((c, i) => (
              <span key={i} style={{
                ...wm.display, fontSize: 40, color: ink, lineHeight: 1, opacity: .9,
                padding: '0 40px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 40,
              }}>
                {c}
                <span style={{ color: accent, fontSize: 28, opacity: .6 }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings — core practices + AI-track teaser */}
      <section id="erbjudanden" style={{ background: bg }}>
        <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 56, alignItems: 'end' }}>
            <div>
              <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>{off.eyebrow}</div>
              <h2 style={{ ...wm.display, fontSize: 'clamp(64px, 8vw, 128px)', lineHeight: .92, margin: 0, color: ink }}>
                {off.headline1}<br />
                <span style={{ color: accent }}>{off.headline2}</span>
              </h2>
            </div>
            <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 520, margin: 0, color: inkDim }}>{off.lead}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 56 }}>
            {off.corePractice.map((c, i) => (
              <article key={i} style={{
                background: panel, color: ink, padding: 28, borderRadius: 18,
                display: 'flex', flexDirection: 'column', gap: 14, border: `1px solid ${line}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ ...wm.display, fontSize: 44, lineHeight: .9, color: accent }}>{c.num}</div>
                  <div style={{ ...wm.mono, fontSize: 10, color: inkDim, letterSpacing: '.08em' }}>{off.corePracticeLabel}</div>
                </div>
                <h3 style={{ ...wm.display, fontSize: 30, lineHeight: 1, margin: 0 }}>{c.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, flex: 1, color: inkDim }}>{c.body}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {c.tags.map((t, j) => (
                    <span key={j} style={{ ...wm.mono, fontSize: 10, padding: '4px 8px', borderRadius: 999, border: `1px solid ${line}`, color: inkDim }}>{t}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div style={{ padding: '28px 32px', borderRadius: 18, border: `1px solid ${line}`, background: panel, display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
            <div>
              <div style={{ ...wm.mono, fontSize: 11, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>{off.aiTrack.eyebrow}</div>
              <div style={{ ...wm.display, fontSize: 36, lineHeight: 1, color: ink, marginBottom: 14 }}>{off.aiTrack.headline}</div>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: inkDim, margin: 0, maxWidth: 720 }}>{off.aiTrack.body}</p>
            </div>
            <a href={cta(off.aiTrack.cta)} style={{ ...wm.mono, fontSize: 13, padding: '14px 22px', borderRadius: 999, border: `1px solid ${accent}`, color: accent, textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '.04em' }}>{off.aiTrack.cta.label}</a>
          </div>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <a href={cta(off.allCta)} style={{ ...wm.mono, fontSize: 13, padding: '14px 28px', borderRadius: 999, border: `1px solid ${line}`, color: ink, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, letterSpacing: '.04em' }}>{off.allCta.label}</a>
          </div>
        </div>
      </section>

      {/* Cases — 3 teasers */}
      <section id="case" style={{ background: panel, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 56, alignItems: 'end' }}>
            <div>
              <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>{cs.eyebrow}</div>
              <h2 style={{ ...wm.display, fontSize: 'clamp(64px, 8vw, 128px)', lineHeight: .92, margin: 0, color: ink }}>
                {cs.headline1}<br />{cs.headline2}
              </h2>
            </div>
            <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 460, margin: 0, color: inkDim }}>{cs.lead}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {cases.slice(0, 3).map((c, i) => (
              <a key={i} href={route(cs.cta.to)} className="scg-case-row" style={{
                display: 'grid', gridTemplateColumns: '100px 1.2fr 2fr 1fr 60px', gap: 40,
                padding: '36px 0', alignItems: 'center', borderTop: `1px solid ${line}`,
                textDecoration: 'none', color: 'inherit',
              }}>
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
            ))}
            <div style={{ borderTop: `1px solid ${line}`, paddingTop: 32, marginTop: 8, textAlign: 'center' }}>
              <a href={route(cs.cta.to)} style={{ ...wm.mono, fontSize: 13, padding: '14px 28px', borderRadius: 999, border: `1px solid ${accent}`, color: accent, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, letterSpacing: '.04em' }}>{cs.cta.label}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Approach — condensed row */}
      <section style={{ background: bg }}>
        <div style={{ ...wm.container, padding: `${pad - 24}px ${gutter}px` }}>
          <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>{ap.eyebrow}</div>
          <h2 style={{ ...wm.display, fontSize: 'clamp(56px, 7vw, 96px)', lineHeight: .95, margin: '0 0 56px', color: ink, textAlign: 'center' }}>
            {ap.headlinePre}<span style={{ color: accent }}>{ap.headlineAccent}</span>{ap.headlinePost}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {approach.map((a, i) => (
              <div key={i} style={{ borderTop: `2px solid ${i === 0 ? accent : line}`, paddingTop: 16 }}>
                <div style={{ ...wm.mono, fontSize: 11, color: accent, letterSpacing: '.1em', marginBottom: 6 }}>{a.step}</div>
                <div style={{ ...wm.display, fontSize: 28, lineHeight: 1, color: ink, marginBottom: 8 }}>{a.title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: inkDim, margin: 0 }}>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — one hero quote */}
      <section style={{ background: panel, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
          <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>{hp.testimonials.eyebrow}</div>
          <figure style={{ margin: 0, marginTop: 24 }}>
            <div style={{ ...wm.display, fontSize: 240, lineHeight: .3, color: accent, marginBottom: 20 }}>“</div>
            <blockquote style={{ ...wm.display, fontSize: 'clamp(44px, 5.5vw, 88px)', lineHeight: 1, margin: 0, color: ink, maxWidth: 1100 }}>
              {testimonials[0].quote}
            </blockquote>
            <figcaption style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: panelHi, border: `1px solid ${line}` }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: ink }}>{testimonials[0].name}</div>
                <div style={{ ...wm.mono, fontSize: 12, color: inkDim }}>{testimonials[0].role}</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Team — 3 teasers */}
      <section style={{ background: bg }}>
        <div style={{ ...wm.container, padding: `${pad}px ${gutter}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 48, alignItems: 'end' }}>
            <div>
              <div style={{ ...wm.mono, fontSize: 12, color: accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>{tm.eyebrow}</div>
              <h2 style={{ ...wm.display, fontSize: 'clamp(64px, 8vw, 120px)', lineHeight: .92, margin: 0, color: ink }}>{tm.headline}</h2>
            </div>
            <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 440, margin: 0, color: inkDim }}>{tm.lead}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {team.slice(0, 3).map((p, i) => (
              <div key={i}>
                <div style={{
                  aspectRatio: '4/5', width: '100%', borderRadius: 12,
                  background: `repeating-linear-gradient(135deg, ${panel}, ${panel} 8px, ${panelHi} 8px, ${panelHi} 9px)`,
                  border: `1px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  ...wm.mono, fontSize: 11, color: inkFaint, letterSpacing: '.04em',
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
            ))}
          </div>
          <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${line}`, textAlign: 'center' }}>
            <a href={route(tm.cta.to)} style={{ ...wm.mono, fontSize: 13, padding: '14px 28px', borderRadius: 999, border: `1px solid ${accent}`, color: accent, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, letterSpacing: '.04em' }}>{tm.cta.label}</a>
          </div>
        </div>
      </section>

      {/* Careers — closing CTA */}
      <section style={{ background: accent }}>
        <div style={{ ...wm.container, padding: `${pad}px ${gutter}px`, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex' }}>
            <img src={`${assetBase}assets/logo-dark.png`} alt="Stockholm Code Group" style={{ height: 120, width: 'auto', display: 'block' }} />
          </div>
          <h2 style={{ ...wm.display, fontSize: 'clamp(72px, 10vw, 160px)', lineHeight: .92, margin: '24px 0 20px', color: bg }}>{ca.headline}</h2>
          <p style={{ fontSize: 20, lineHeight: 1.5, margin: '0 auto 40px', maxWidth: 640, color: bg }}>{ca.body}</p>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {ca.roles.map((r) => (
              <a key={r} href={route(ca.cta.to)} style={{ background: bg, color: ink, padding: '14px 22px', borderRadius: 999, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{r} →</a>
            ))}
            <a href={route(ca.cta.to)} style={{ background: 'transparent', color: bg, padding: '14px 22px', borderRadius: 999, textDecoration: 'none', fontSize: 14, fontWeight: 600, border: `1px solid ${bg}` }}>{ca.cta.label}</a>
          </div>
        </div>
      </section>
    </>
  );
}
