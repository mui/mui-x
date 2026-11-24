import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';

// Older WebKit browsers (Safari <= 17) have no `color-mix()` support.
// Force the fallback path: stub the feature detection, then re-import the grid
// so its module-level `supportsColorMix` constant is computed with the stub in
// place (the setup files already evaluated the grid modules before this file).
// The test environment is isolated per file, so the stub cannot leak.
const originalSupports =
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
    ? (CSS.supports.bind(CSS) as (...args: string[]) => boolean)
    : undefined;
if (originalSupports) {
  CSS.supports = ((...args: string[]) =>
    args.join(' ').includes('color-mix')
      ? false
      : originalSupports(...args)) as typeof CSS.supports;
}
vi.resetModules();
const { DataGridPro } = await import('@mui/x-data-grid-pro');
const { useBasicDemoData } = await import('@mui/x-data-grid-generator');

describe('<DataGridPro /> - Column pinning without `color-mix()` support', () => {
  const { render } = createRenderer();

  function TestCase() {
    const data = useBasicDemoData(1, 3);
    return (
      <div style={{ width: 302, height: 300 }}>
        <DataGridPro {...data} initialState={{ pinnedColumns: { left: ['id'] } }} />
      </div>
    );
  }

  // https://github.com/mui/mui-x/issues/18273
  it.skipIf(!isJSDOM)('should keep pinned cells opaque on hover and selection', () => {
    render(<TestCase />);

    const css = Array.from(document.querySelectorAll('style'))
      .map((style) => style.textContent ?? '')
      .join('\n');

    // Rules that style pinned cells in a hovered or selected row
    const pinnedStateRules = (css.match(/[^{}]+\{[^{}]*\}/g) ?? []).filter((rule) => {
      const selector = rule.slice(0, rule.indexOf('{'));
      return selector.includes('cell--pinned') && /:hover|Mui-selected/.test(selector);
    });
    const backgroundRules = pinnedStateRules.filter((rule) => rule.includes('background-color'));

    expect(backgroundRules.length).to.be.above(2);
    backgroundRules.forEach((rule) => {
      // A translucent fallback would let the scrolled cells behind the pinned
      // cells bleed through
      expect(rule).to.include('background-color:var(--DataGrid-t-cell-background-pinned)');
      expect(rule).to.not.include('color-mix');
    });
  });
});
