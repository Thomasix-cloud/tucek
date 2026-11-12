// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// TODO: nahradit finální doménou (používá se pro canonical URL, sitemapu a Open Graph)
const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://www.autoservis-tucek.cz';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: {
    layout: 'constrained',
    responsiveStyles: false,
  },
  env: {
    schema: {
      BOOKING_PROVIDER: envField.enum({ context: 'server', access: 'secret', values: ['resend'], default: 'resend' }),
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      BOOKING_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      BOOKING_FROM_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      BOOKING_SEND_CONFIRMATION: envField.boolean({ context: 'server', access: 'secret', default: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel({ imageService: false }),
  integrations: [
    sitemap({
      filter: (page) => !['/dekujeme', '/objednavka-chyba', '/404'].some((p) => page.includes(p)),
    }),
  ],
});
