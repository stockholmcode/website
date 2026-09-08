// Base-path helpers, derived from Astro's configured `base` (see astro.config.mjs).
//
// `import.meta.env.BASE_URL` is "/website" in production (a GitHub project page)
// and "/" in dev. It carries no trailing slash in the former case, so
// concatenating it raw with "assets/..." would yield "/websiteassets/..." and
// 404. These two forms cover every call site:
//
//   assetBase — exactly one trailing slash, for building "assetBase + 'assets/…'".
//   base      — no trailing slash, for prefix-matching against a URL pathname.
const BASE_URL = import.meta.env.BASE_URL;

export const base = BASE_URL.replace(/\/$/, '');
export const assetBase = base + '/';
