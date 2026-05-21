// content-loader.js
// Single source of truth for site content. Loads JSON from /content/*.json
// once on page load, exposes window.SCG_CONTENT, and fires a 'scg:content-ready'
// event when done. Pages can either await window.SCG_CONTENT_READY (a Promise)
// or listen for the event.
//
// Usage in HTML:
//   <script src="content-loader.js"></script>
//   ...later...
//   await window.SCG_CONTENT_READY;
//   const data = window.SCG_CONTENT;
//
// To edit copy: open content/<file>.json, change values, reload.
// (Run via a local server — file:// blocks fetch.)

(function () {
  const FILES = [
    'site',
    'stats',
    'clients',
    'offerings',
    'dimensions',
    'cases',
    'team',
    'team-culture',
    'testimonials',
    'approach',
    'careers',
  ];

  async function loadOne(name) {
    const res = await fetch(`content/${name}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`content/${name}.json: ${res.status}`);
    return res.json();
  }

  window.SCG_CONTENT_READY = (async () => {
    const entries = await Promise.all(
      FILES.map(async (n) => [n.replace('-', '_'), await loadOne(n)])
    );
    const data = Object.fromEntries(entries);
    window.SCG_CONTENT = data;
    window.dispatchEvent(new CustomEvent('scg:content-ready', { detail: data }));
    return data;
  })().catch((err) => {
    console.error('[SCG content] failed to load:', err);
    document.body && (document.body.innerHTML =
      `<div style="font-family:monospace;padding:40px;color:#E85C5C;background:#0A0C0F;min-height:100vh">
        <h1>Kunde inte ladda innehåll</h1>
        <p>${err.message}</p>
        <p style="color:#888;margin-top:24px">
          Tips: Filen måste serveras från en lokal webbserver, inte öppnas direkt med file://.<br/>
          I projektmappen, kör t.ex.:<br/>
          <code style="display:inline-block;margin-top:8px;padding:8px 12px;background:#11141A;border-radius:6px">python3 -m http.server 8000</code>
        </p>
      </div>`);
    throw err;
  });
})();
