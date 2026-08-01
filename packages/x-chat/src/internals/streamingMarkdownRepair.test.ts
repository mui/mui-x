import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fallbackRepair, loadRemend, resetRemendCache } from './streamingMarkdownRepair';

describe('streamingMarkdownRepair', () => {
  beforeEach(() => {
    resetRemendCache();
  });

  describe('fallbackRepair (dep-free, CJS-safe baseline)', () => {
    it('closes an unbalanced code fence', () => {
      expect(fallbackRepair('```ts\nconst x = 1;')).to.equal('```ts\nconst x = 1;\n```');
    });

    it('leaves balanced markdown untouched', () => {
      expect(fallbackRepair('**bold** and `code`')).to.equal('**bold** and `code`');
    });

    it('does not corrupt ordinary prose with lone markers', () => {
      // Conservative: never guesses at inline `*`/`_`, so math/prose survives.
      expect(fallbackRepair('2 * 3 = 6 and a_b')).to.equal('2 * 3 = 6 and a_b');
    });
  });

  describe('loadRemend (CJS-safe dynamic loader)', () => {
    it('uses remend (default export) when it can be imported', async () => {
      const remend = vi.fn((text: string) => `${text}**`);
      const repair = await loadRemend(() => Promise.resolve({ default: remend }));

      expect(repair('a **b')).to.equal('a **b**');
      // Math completion is disabled so the renderer never sees literal `$…$`.
      expect(remend).toHaveBeenCalledWith('a **b', { katex: false });
    });

    it('accepts a module whose namespace IS the function', async () => {
      const remend = vi.fn((text: string) => `${text}!`);
      const repair = await loadRemend(() => Promise.resolve(remend));
      expect(repair('x')).to.equal('x!');
    });

    it('falls back when the import rejects (CJS require-of-ESM / not installed)', async () => {
      const repair = await loadRemend(() =>
        Promise.reject(new Error('ERR_REQUIRE_ESM: cannot require() ES Module remend')),
      );
      expect(repair).to.equal(fallbackRepair);
      // Still functional via the baseline.
      expect(repair('```ts\nx')).to.equal('```ts\nx\n```');
    });

    it('falls back when the module does not export a function', async () => {
      const repair = await loadRemend(() => Promise.resolve({ default: { not: 'a function' } }));
      expect(repair).to.equal(fallbackRepair);
    });

    it('caches: the importer runs once across calls', async () => {
      const importer = vi.fn(() => Promise.resolve({ default: (t: string) => t }));
      await loadRemend(importer);
      await loadRemend(importer);
      expect(importer).toHaveBeenCalledTimes(1);
    });

    it('resetRemendCache lets a new importer take effect', async () => {
      await loadRemend(() => Promise.resolve({ default: (t: string) => `${t}-1` }));
      resetRemendCache();
      const repair = await loadRemend(() => Promise.resolve({ default: (t: string) => `${t}-2` }));
      expect(repair('x')).to.equal('x-2');
    });
  });

  // Regression coverage for the `remend` specifier resolving in bundled apps.
  // Importing it under a specifier a bundler can't statically resolve left the upgrade
  // as dead code in every browser bundle and — where the bundler wraps dynamic imports
  // in a preload helper — dispatched a global load-error event on each render.
  // See https://github.com/mui/mui-x/issues/23160.
  describe('remend specifier resolution', () => {
    it('resolves the real remend through the default importer', async () => {
      // No injected importer: exercises `import('#remend')` for real, so a specifier
      // that stopped resolving would fail here rather than silently degrade.
      const repair = await loadRemend();

      expect(repair).not.to.equal(fallbackRepair);
      // remend completes the unterminated inline marker; fallbackRepair never would.
      expect(repair('a **bold')).to.equal('a **bold**');
    });

    it('degrades to fallbackRepair on the CommonJS `#remend` stub', async () => {
      // What `require('#remend')` resolves to in the CJS build, where the ESM-only
      // `remend` cannot be named at all.
      const stub = await import('./remendUnavailable');
      const repair = await loadRemend(() => Promise.resolve(stub));

      expect(repair).to.equal(fallbackRepair);
    });

    // The packaging side of this — that the specifier stays statically analyzable and
    // that `#remend` maps per module format — reads the source tree off disk, so it
    // lives in `src/tests/packagingGuard/remendSpecifier.test.ts` (Node-only).
  });
});
