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
});
