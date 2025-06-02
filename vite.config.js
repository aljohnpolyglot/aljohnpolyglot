// D:\website\vite.config.js
import { defineConfig } from 'vite';
import fs from 'fs'; // REQUIRED to read certificate files
import path from 'path'; // REQUIRED to resolve paths correctly

export default defineConfig({
    root: '.',
    server: {
        port: 5500,
        // Explicitly use your generated key and cert
        https: {
          key: fs.readFileSync(path.resolve(__dirname, './localhost-key.pem')),
          cert: fs.readFileSync(path.resolve(__dirname, './localhost-cert.pem'))
        },
        open: '/polyglot_connect/index.html'
    },
    resolve: {
        // ... your aliases if any ...
    }
});