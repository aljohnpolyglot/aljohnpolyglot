import { cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const outputDirectory = resolve(projectRoot, 'dist-french');

function copyFrenchRuntimeAssets() {
    return {
        name: 'copy-french-runtime-assets',
        closeBundle() {
            const runtimeDirectories = [
                ['images', 'images'],
                ['templates', 'templates'],
                ['languages/spanish/images/spotlights', 'languages/spanish/images/spotlights'],
            ];

            runtimeDirectories.forEach(([source, destination]) => {
                const destinationPath = resolve(outputDirectory, destination);
                mkdirSync(destinationPath, { recursive: true });
                cpSync(resolve(projectRoot, source), destinationPath, { recursive: true });
            });
        },
    };
}

export default defineConfig({
    root: projectRoot,
    base: '/',
    appType: 'mpa',
    plugins: [copyFrenchRuntimeAssets()],
    build: {
        outDir: outputDirectory,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                french: resolve(projectRoot, 'languages/french/index.html'),
            },
        },
    },
    server: {
        open: '/languages/french/',
    },
});
