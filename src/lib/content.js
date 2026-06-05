// Loads all per-locale YAML content at build time and exposes getContent(locale).
//
// Files live in src/data/<locale>/<name>.yaml and are read eagerly via Vite's
// glob import (?raw → js-yaml). A locale that is missing a file falls back to the
// default locale's version, so a partially translated locale still renders fully.
import yaml from 'js-yaml';

const DEFAULT_LOCALE = 'sv';

const raw = import.meta.glob('/src/data/**/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** @type {Record<string, Record<string, unknown>>} */
const byLocale = {};
for (const [path, text] of Object.entries(raw)) {
  const m = path.match(/\/data\/([^/]+)\/(.+)\.yaml$/);
  if (!m) continue;
  const [, locale, name] = m;
  (byLocale[locale] ||= {})[name] = yaml.load(/** @type {string} */ (text));
}

/**
 * Merged content for a locale, falling back per-file to the default locale.
 * @param {string} [locale]
 */
export function getContent(locale = DEFAULT_LOCALE) {
  return { ...(byLocale[DEFAULT_LOCALE] || {}), ...(byLocale[locale] || {}) };
}

export { DEFAULT_LOCALE };
