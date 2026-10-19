// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://xuzhiyuanyaya-ai.github.io',
  base: '/xiuanyan-academy/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});