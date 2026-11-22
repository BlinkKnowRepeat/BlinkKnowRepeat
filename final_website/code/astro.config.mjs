import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  session: false,
  devToolbar: { enabled: false },
  adapter: cloudflare({ imageService: 'passthrough' }),
  trailingSlash: 'ignore',
  vite: { plugins: [tailwind()], build: { assetsInlineLimit: 0 } },
});
