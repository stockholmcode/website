// Shared SCG design tokens, primitives, and content-from-JSON wiring.
//
// Content lives in /content/*.json (loaded by content-loader.js).
// This file pulls those into the legacy window.OFFERINGS / window.CASES /
// window.STATS / etc. globals that all variant components already use —
// so refactoring data sources doesn't ripple into every component.
//
// IMPORTANT: this script must run AFTER content-loader.js has resolved
// window.SCG_CONTENT_READY. App.jsx / Homepage scripts await it before
// rendering React.

const SCG = {
  accent: '#FF914D',
  ink: '#0F172A',
  bg: '#FFFFFF',
  card: '#F8FAFC',
  border: '#E2E8F0',
  muted: '#64748B',
  darkBg: '#0A0C0F',
  darkInk: '#E2E8F0',
  beige: '#C5C2BA',
  beigeSoft: '#D8D6CF',
  beigeDeep: '#8A8880',
};

// ── Bind content from JSON into the legacy window.* globals ──
// Run synchronously if SCG_CONTENT is already populated; otherwise wait for it.
function bindContent(c) {
  if (!c) return;
  window.SITE = c.site;
  window.OFFERINGS = c.offerings;
  window.DIMENSIONS = c.dimensions;
  window.CASES = c.cases;
  window.STATS = c.stats;
  window.CLIENTS = c.clients;
  window.TEAM = c.team;
  window.TEAM_CULTURE = c.team_culture;
  window.TESTIMONIALS = c.testimonials;
  window.APPROACH = c.approach;
  window.CAREERS = c.careers;
}

if (window.SCG_CONTENT) {
  bindContent(window.SCG_CONTENT);
} else {
  window.addEventListener('scg:content-ready', (e) => bindContent(e.detail));
}

// ── Logo / placeholder primitives ────────────────────────────
function LogoImg({ height = 72, style = {}, dark = false }) {
  return (
    <img
      src="assets/logo.jpg"
      alt="Stockholm Code Group"
      style={{
        height, width: 'auto', display: 'block',
        filter: dark ? 'invert(1)' : 'none',
        mixBlendMode: dark ? 'screen' : 'multiply',
        ...style,
      }}
    />
  );
}

function TurtleMark({ size = 36, stroke = 'currentColor', strokeWidth = 1.6 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none"
         stroke={stroke} strokeWidth={strokeWidth}
         strokeLinecap="round" strokeLinejoin="round"
         style={{ display: 'block' }}>
      <path d="M24 10c-1.2-1.6-3-2.2-4.4-1.4-1.6.9-1.9 3-.7 4.5.9 1.1 3.2 2.8 5.1 3.9 1.9-1.1 4.2-2.8 5.1-3.9 1.2-1.5.9-3.6-.7-4.5C26.9 7.8 25.2 8.4 24 10z" />
      <ellipse cx="28.5" cy="26" rx="9.5" ry="7" />
      <circle cx="32.2" cy="24.5" r=".7" fill={stroke} stroke="none" />
      <ellipse cx="19" cy="28.5" rx="10" ry="7.5" />
      <circle cx="15" cy="27" r=".7" fill={stroke} stroke="none" />
      <circle cx="16.5" cy="27.5" r=".7" fill={stroke} stroke="none" />
      <path d="M7 36.5c3 1 8 1.5 13 1.5s10-.5 13.5-1.5 5-1.5 6.5-1.5" />
      <path d="M7 36.5v-2M40 35v-1.5" />
    </svg>
  );
}

function LogoLockup({ color = '#0F172A', compact = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color }}>
      <TurtleMark size={compact ? 28 : 34} stroke={color} />
      <div style={{ lineHeight: 1, fontFamily: "'Amatic SC', cursive", fontWeight: 700, fontSize: compact ? 20 : 24, letterSpacing: '.01em' }}>
        Stockholm Code Group
      </div>
    </div>
  );
}

function Placeholder({ label = 'image', ratio = '16/9', bg = '#F1EFEA', ink = '#64748B', borderColor }) {
  return (
    <div style={{
      aspectRatio: ratio,
      width: '100%',
      background: `repeating-linear-gradient(135deg, ${bg}, ${bg} 8px, rgba(0,0,0,.025) 8px, rgba(0,0,0,.025) 9px)`,
      border: `1px solid ${borderColor || 'rgba(0,0,0,.06)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: ink,
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: 11,
      letterSpacing: '.04em',
    }}>
      {`// ${label}`}
    </div>
  );
}

Object.assign(window, {
  SCG, TurtleMark, LogoLockup, LogoImg, Placeholder,
});
