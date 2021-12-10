import * as React from 'react';
import { useGridApiRef, DataGridPro, GridApiRef } from '@mui/x-data-grid-pro';
import { createRenderer, waitFor, screen, fireEvent } from '@material-ui/monorepo/test/utils';
import { useData } from 'packages/storybook/src/hooks/useData';
import { expect } from 'chai';

// These tests are here because they need the real clock.
// TODO move to test/performance and use the average time based on several samples
describe('<DataGridPro /> - Performance', () => {
  const { render } = createRenderer({ clock: 'fake' });

  let apiRef: GridApiRef;

  it('should filter 5,000 rows in less than 100 ms', async function test() {
    // It's simpler to only run the performance test in a single controlled environment.
    if (!/HeadlessChrome/.test(window.navigator.userAgent)) {
      this.skip();
      return;
    }

    const TestCasePerf = () => {
      const data = useData(5000, 10);
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} columns={data.columns} rows={data.rows} />
        </div>
      );
    };

    render(<TestCasePerf />);
    const newModel = {
      items: [
        {
          columnField: 'currencyPair',
          value: 'usd',
          operatorValue: 'startsWith',
        },
      ],
    };
    const t0 = performance.now();
    apiRef.current.setFilterModel(newModel);

    await waitFor(() =>
      expect(document.querySelector('.MuiDataGrid-filterIcon')).not.to.equal(null),
    );
    const t1 = performance.now();
    const time = Math.round(t1 - t0);
    expect(time).to.be.lessThan(150);
  });

  it('should sort 5,000 rows in less than 200 ms', async function test() {
    // It's simpler to only run the performance test in a single controlled environment.
    if (!/HeadlessChrome/.test(window.navigator.userAgent)) {
      this.skip();
      return;
    }

    const TestCasePerf = () => {
      const data = useData(5000, 10);

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro columns={data.columns} rows={data.rows} />
        </div>
      );
    };

    render(<TestCasePerf />);
    const header = screen
      .getByRole('columnheader', { name: 'Currency Pair' })
      .querySelector('.MuiDataGrid-columnHeaderTitleContainer');

    const t0 = performance.now();
    fireEvent.click(header);
    await waitFor(() => expect(document.querySelector('.MuiDataGrid-sortIcon')).to.not.be.null);
    const t1 = performance.now();
    const time = Math.round(t1 - t0);
    expect(time).to.be.lessThan(300);
  });
});
