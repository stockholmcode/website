// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Project Pages live at https://stockholmcode.github.io/website/
// so `site` + `base` must reflect that path for links/assets to resolve.
export default defineConfig({
  site: 'https://stockholmcode.github.io',
  base: '/website',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv', 'en'],
    routing: { prefixDefaultLocale: false }, // sv at /, en at /en/
  },
  integrations: [react()],
});
