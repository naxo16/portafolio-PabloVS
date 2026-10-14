// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.ASTRO_SITE || 'https://renkaidev-web.pages.dev', // Cambia esto por tu dominio personalizado en Cloudflare o asigna ASTRO_SITE en tu entorno
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});