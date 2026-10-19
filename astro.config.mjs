// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://xiuanyan-academy.github.io',
  base: '/xiuanyan-academy/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});