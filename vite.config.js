import { defineConfig } from 'vite';

// Single-page vanilla build. base:'/' works for Netlify/Vercel/custom domains.
// For a GitHub Pages *project* site (user.github.io/NULLRADIX) set base:'/NULLRADIX/'.
export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    cssMinify: true,
    modulePreload: { polyfill: false },
  },
});
