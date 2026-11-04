import { describe, it, expect } from 'vitest';
import { isJSDOM } from '../platform';
import { createSelectorMemoized } from '../store';

// TODO v10: remove with the legacy exports. Published `@mui/x-*` 9.0.0 to 9.14.0 import them.
// https://github.com/mui/mui-x/issues/23905
describe('legacy exports', () => {
  it.each([
    { entryPoint: 'domUtils', names: ['getTarget'] },
    { entryPoint: 'fastArrayCompare', names: ['fastArrayCompare'] },
    { entryPoint: 'fastObjectShallowCompare', names: ['fastObjectShallowCompare'] },
    { entryPoint: 'platform', names: ['iOSMediaQuery', 'isFirefox', 'isJSDOM'] },
    { entryPoint: 'reactMajor', names: ['default'] },
    {
      entryPoint: 'store',
      names: [
        'Store',
        'createSelector',
        'createSelectorMemoized',
        'createSelectorMemoizedWithOptions',
        'useStore',
        'useStoreEffect',
      ],
    },
    { entryPoint: 'useFirstRender', names: ['useFirstRender'] },
  ])(
    '@mui/x-internals/$entryPoint keeps the exports that 9.x packages import',
    async ({ entryPoint, names }) => {
      const namespace = await import(`@mui/x-internals/${entryPoint}`);
      expect(Object.keys(namespace)).toEqual(expect.arrayContaining(names));
    },
  );

  // The x-virtualizer of data grid 9.0.0 to 9.6.0 reads it for its default virtualization state.
  it('detects jsdom in platform.isJSDOM', () => {
    expect(isJSDOM).to.equal(true);
  });

  // `@mui/x-charts` 9.4.0 passes 7 input selectors to a combiner with 6 parameters.
  it('accepts a memoized combiner with fewer parameters than input selectors', () => {
    const selectValue = (state: { value: number }) => state.value;
    const selector = createSelectorMemoized(
      selectValue,
      selectValue,
      selectValue,
      selectValue,
      selectValue,
      selectValue,
      selectValue,
      (v1: number, v2: number, v3: number, v4: number, v5: number, v6: number) =>
        v1 + v2 + v3 + v4 + v5 + v6,
    );

    expect(selector({ value: 1 })).to.equal(6);
  });
});
