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
// Under `node_modules` so the scratch artifacts are git-ignored. The generated entry is
// kept out of `outDir` so that reading the build output back never picks it up.
const workDir = path.join(packageRoot, 'node_modules', '.tmp-esm-bundle-test');
const outDir = path.join(workDir, 'out');

/** The subset of Rollup's chunk record this test asserts on. */
interface EmittedChunk {
  type: string;
  fileName: string;
  isEntry: boolean;
  /** Static imports, as resolved by the bundler: emitted file names, or bare if external. */
  imports: string[];
  /** Dynamic imports, same resolution rules. */
  dynamicImports: string[];
}

let chunks: EmittedChunk[];
let loadRemend: () => Promise<(text: string) => string>;
let fallbackRepair: (text: string) => string;

describe('remend in an ESM bundle', () => {
  beforeAll(async () => {
    fs.rmSync(workDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });

    const entry = path.join(workDir, 'entry.mjs');
    const loader = path.join(packageRoot, 'src/internals/streamingMarkdownRepair.ts');
    fs.writeFileSync(
      entry,
      `export { loadRemend, fallbackRepair } from ${JSON.stringify(loader)};\n`,
    );

    const result = await build({
      root: packageRoot,
      logLevel: 'silent',
      build: {
        outDir,
        emptyOutDir: false,
        minify: false,
        target: 'esnext',
        lib: { entry, formats: ['es'], fileName: 'bundle' },
        // Bundle everything. Leaving anything external means the emitted module has to
        // resolve bare specifiers from a temp directory at import time, which is exactly
        // the fragility being tested for — and it does not survive CI's install layout.
        // Nothing here is slow: the hook (and with it React) tree-shakes away, since the
        // entry only re-exports the loader.
        rollupOptions: { external: [] },
      },
    });

    // Assert on the bundler's own parsed import records rather than on the emitted text.
    // Scanning the output with a regex is unsound: it bundles third-party source, and a
    // plain string literal in there (React 18's warning templates, for one) reads exactly
    // like an import specifier.
    const output = (Array.isArray(result) ? result[0] : result) as unknown as {
      output: EmittedChunk[];
    };
    chunks = output.output.filter((item) => item.type === 'chunk');

    const mod = await import(pathToFileURL(path.join(outDir, 'bundle.mjs')).href);
    loadRemend = mod.loadRemend;
    fallbackRepair = mod.fallbackRepair;
  }, 120_000);

  afterAll(() => {
    fs.rmSync(workDir, { recursive: true, force: true });
  });

  it('repairs markdown with the real remend, not the fallback', async () => {
    const repair = await loadRemend();

    // The whole point of the dependency: complete an unterminated inline marker.
    // `fallbackRepair` only closes code fences, so it would return this unchanged.
    expect(repair('a **bold')).to.equal('a **bold**');
    expect(repair).not.to.equal(fallbackRepair);
    expect(fallbackRepair('a **bold')).to.equal('a **bold');
  });

  // Note: the assertion above would not on its own have caught #23160, because Node
  // resolves a bare `import('remend')` from `node_modules` even when the bundler left one
  // behind. A browser cannot, which is why the bug shipped. The runtime catch lives in
  // the Chromium run of `streamingMarkdownRepair.test.ts`; the checks below are what make
  // this file a regression guard.

  it('emits remend as a chunk instead of leaving a bare specifier', () => {
    const emittedNames = chunks.map((chunk) => chunk.fileName);
    const entryChunk = chunks.find((chunk) => chunk.isEntry);
    const dynamicImports = entryChunk?.dynamicImports ?? [];

    // Before the fix the specifier was unanalyzable, so the bundler recorded no dynamic
    // import at all and emitted nothing for it — the browser was left to resolve `remend`
    // on its own, which it cannot do.
    expect(dynamicImports).not.to.deep.equal([]);
    // Every dynamic import resolves to something the bundler emitted itself.
    dynamicImports.forEach((id) => expect(emittedNames).to.contain(id));
    // remend lands in its own chunk alongside the entry.
    expect(chunks.length).to.be.greaterThan(1);
  });

  it('emits a self-contained bundle', () => {
    // Guards the test itself: if anything were left external, importing the output above
    // would prove nothing, because Node could paper over it from a nearby `node_modules`.
    const emittedNames = chunks.map((chunk) => chunk.fileName);
    const external = chunks
      .flatMap((chunk) => [...chunk.imports, ...chunk.dynamicImports])
      .filter((id) => !emittedNames.includes(id));

    expect(external).to.deep.equal([]);
  });
});
