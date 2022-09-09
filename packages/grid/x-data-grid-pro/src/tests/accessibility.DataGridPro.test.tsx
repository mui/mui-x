import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { expect } from 'chai';
// @ts-ignore Remove once the test utils are typed
import { createRenderer } from '@mui/monorepo/test/utils';
import { useData } from 'storybook/src/hooks/useData';
import axe from 'axe-core';

function logViolations(violations: any) {
  if (violations.length !== 0) {
    violations.forEach((violation: any) => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(violation, null, 4));
    });
  }
}

describe('<DataGridPro /> - Accessibility', () => {
  before(function beforeHook() {
    if (!/chrome/i.test(window.navigator.userAgent)) {
      // Only run accessibility tests in Chrome, since it should behave the same in all browsers
      this.skip();
    }
  });

  const { render } = createRenderer();

  it('pinned columns should pass `aria-required-parent` rule', async () => {
    const TestCase = () => {
      const data = useData(1, 3);
      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            columns={[{ field: 'id' }, { field: 'currencyPair' }, { field: 'price1M' }]}
            pinnedColumns={{ left: ['id'], right: ['currencyPair'] }}
          />
        </div>
      );
    };

    render(<TestCase />);

    axe.configure({
      rules: [{ id: 'aria-required-parent', enabled: true }],
      disableOtherRules: true,
    });

    const results = await axe.run();

    logViolations(results.violations);
    expect(results.violations.length).to.equal(0);
  });
});
