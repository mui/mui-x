import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { build } from 'vite';

// Node-only (runs a real bundler and imports its output), so the browser project
// excludes this directory — see `vitest.config.browser.mts`.
//
// This is the coverage the unit tests structurally cannot provide. #23160 was invisible
// to every in-process test: `loadRemend` resolved `remend` fine under Node and under the
// Vitest dev server, while the *bundled* output shipped to users contained a bare
// `import('remend')` that could never resolve in a browser. The upgrade was dead code
// everywhere it mattered, and nothing failed.
//
// So bundle the loader the way a consumer's bundler does, then run the bundle and check
// the markdown actually comes back repaired.
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
// Inside `node_modules` so the externals below still resolve from the output, and so the
// artifacts are git-ignored.
const outDir = path.join(packageRoot, 'node_modules', '.tmp-esm-bundle-test');

let bundleSource: string;
let loadRemend: () => Promise<(text: string) => string>;
let fallbackRepair: (text: string) => string;

describe('remend in an ESM bundle', () => {
  beforeAll(async () => {
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });

    const entry = path.join(outDir, 'entry.mjs');
    const loader = path.join(packageRoot, 'src/internals/streamingMarkdownRepair.ts');
    fs.writeFileSync(entry, `export { loadRemend, fallbackRepair } from ${JSON.stringify(loader)};\n`);

    await build({
      root: packageRoot,
      logLevel: 'silent',
      build: {
        outDir,
        emptyOutDir: false,
        minify: false,
        target: 'esnext',
        lib: { entry, formats: ['es'], fileName: 'bundle' },
        // Everything except `remend` is irrelevant here, and leaving them external keeps
        // the build to a few dozen milliseconds.
        rollupOptions: { external: [/^react/, /^@mui\//] },
      },
    });

    const emitted = fs.readdirSync(outDir).filter((file) => file.endsWith('.mjs'));
    bundleSource = emitted
      .map((file) => fs.readFileSync(path.join(outDir, file), 'utf8'))
      .join('\n');

    const mod = await import(pathToFileURL(path.join(outDir, 'bundle.mjs')).href);
    loadRemend = mod.loadRemend;
    fallbackRepair = mod.fallbackRepair;
  }, 120_000);

  afterAll(() => {
    fs.rmSync(outDir, { recursive: true, force: true });
  });

  it('repairs markdown with the real remend, not the fallback', async () => {
    const repair = await loadRemend();

    // The whole point of the dependency: complete an unterminated inline marker.
    // `fallbackRepair` only closes code fences, so it would return this unchanged.
    expect(repair('a **bold')).to.equal('a **bold**');
    expect(repair).not.to.equal(fallbackRepair);
    expect(fallbackRepair('a **bold')).to.equal('a **bold');
  });

  // Note: this assertion alone would not have caught #23160, because Node resolves a
  // bare `import('remend')` from `node_modules` even when the bundler left one behind.
  // A browser cannot, which is why the bug shipped. The runtime catch lives in the
  // Chromium run of `streamingMarkdownRepair.test.ts`; the structural check below is
  // what makes this file a regression guard.

  it('emits remend into the bundle instead of leaving a bare specifier', () => {
    // What shipped before the fix: a specifier no bundler could resolve, left verbatim
    // in the output for the browser to choke on at runtime.
    expect(bundleSource).not.to.match(/import\(\s*['"]remend['"]\s*\)/);
    expect(bundleSource).not.to.match(/from\s*['"]remend['"]/);
    // What ships now: the dynamic import points at a chunk the bundler emitted itself.
    expect(bundleSource).to.match(/import\(\s*['"]\.\/[^'"]+\.mjs['"]\s*\)/);
  });
});
