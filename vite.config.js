// D:\website\vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'polyglot_connect', // Vite's root for dev server and build input
  build: {
    // Output relative to 'root'. So if root='polyglot_connect',
    // this goes to D:\website\polyglot_connect\dist
    // We want it in D:\website\dist for consistency with GH Actions later.
    // So, make it relative to project root, means it goes into 'polyglot_connect/dist'
    // Let's change outDir to be relative to the project root (D:\website) for deployment clarity.
    // Vite's `build.outDir` is relative to `root` if `root` is set, UNLESS it starts with `/` or `X:\`.
    // To make it D:\website\dist\polyglot_connect_build (or similar)
    outDir: '../dist_polyglot_app', // This will output to D:\website\dist_polyglot_app
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // 'main' is the key, 'index.html' is the path relative to 'root'
        main: 'index.html' 
      }
    }
  },
  // This base is for when polyglot_connect is deployed to its sub-URL
  base: '/aljohnpolyglot/polyglot_connect/', 
  server: {
    // open is relative to 'root'
    open: '/index.html' 
  }
});