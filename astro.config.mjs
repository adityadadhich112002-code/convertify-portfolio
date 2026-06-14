// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  base: './',
  site: 'https://www.convertify.pro',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});