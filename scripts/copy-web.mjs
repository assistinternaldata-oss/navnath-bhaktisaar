// Copies the web app into www/, which Capacitor bundles into the Android and iOS apps.
// The website itself is served from the repository root by GitHub Pages; www/ is a build output.
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
const items = ['index.html', 'manifest.webmanifest', 'css', 'fonts', 'js', 'data', 'icons'];

rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const item of items) cpSync(join(root, item), join(out, item), { recursive: true });

// stamp the build so the app can show which version it is
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
writeFileSync(join(out, 'build.json'), JSON.stringify({ version: pkg.version, built: new Date().toISOString() }));
console.log(`Copied web app to www/ (${items.join(', ')})`);
