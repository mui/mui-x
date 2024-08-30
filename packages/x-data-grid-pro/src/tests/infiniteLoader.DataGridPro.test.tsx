import * as React from 'react';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { spy } from 'sinon';
import { getColumnValues, sleep } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Infnite loader', () => {
  const { render } = createRenderer();

  it('should call `onRowsScrollEnd` when viewport scroll reaches the bottom', async function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    const baseRows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
      { id: 3, brand: 'Under Armor' },
      { id: 4, brand: 'Jordan' },
      { id: 5, brand: 'Reebok' },
    ];
    const handleRowsScrollEnd = spy();
    function TestCase({ rows }: { rows: typeof baseRows }) {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[{ field: 'brand', width: 100 }]}
            rows={rows}
            onRowsScrollEnd={handleRowsScrollEnd}
          />
        </div>
      );
    }
    const { container, setProps } = render(<TestCase rows={baseRows} />);
    const virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller')!;
    // arbitrary number to make sure that the bottom of the grid window is reached.
    virtualScroller.scrollTop = 12345;
    virtualScroller.dispatchEvent(new Event('scroll'));
    await waitFor(() => {
      expect(handleRowsScrollEnd.callCount).to.equal(1);
    });
    setProps({
      rows: baseRows.concat(
        { id: 6, brand: 'Gucci' },
        { id: 7, brand: "Levi's" },
        { id: 8, brand: 'Ray-Ban' },
      ),
    });
    // Trigger a scroll again to notify the grid that we're not in the bottom area anymore
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(handleRowsScrollEnd.callCount).to.equal(1);
    virtualScroller.scrollTop = 12345;
    virtualScroller.dispatchEvent(new Event('scroll'));
    await waitFor(() => {
      expect(handleRowsScrollEnd.callCount).to.equal(2);
    });
  });

  it('should call `onRowsScrollEnd` when there is not enough rows to cover the viewport height', async function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }

    const allRows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
      { id: 3, brand: 'Under Armor' },
      { id: 4, brand: 'Jordan' },
      { id: 5, brand: 'Reebok' },
    ];
    const initialRows = [allRows[0]];
    const getRow = spy((id) => {
      return allRows.find((row) => row.id === id);
    });

    const scrollEndThreshold = 60;
    const rowHeight = 50;
    const columnHeaderHeight = 50;
    const gridHeight =
      4 * rowHeight +
      columnHeaderHeight +
      // border
      2;

    function TestCase() {
      const [rows, setRows] = React.useState(initialRows);
      const [loading, setLoading] = React.useState(false);
      const handleRowsScrollEnd = React.useCallback(async () => {
        setLoading(true);
        await sleep(50);
        setRows((prevRows) => {
          const lastRowId = prevRows[prevRows.length - 1].id;
          const nextRow = getRow(lastRowId + 1);
          return nextRow ? prevRows.concat(nextRow) : prevRows;
        });
        setLoading(false);
      }, []);
      return (
        <div style={{ width: 300, height: gridHeight }}>
          <DataGridPro
            columns={[{ field: 'id' }, { field: 'brand', width: 100 }]}
            rows={rows}
            loading={loading}
            onRowsScrollEnd={handleRowsScrollEnd}
            scrollEndThreshold={scrollEndThreshold}
            rowHeight={rowHeight}
            columnHeaderHeight={columnHeaderHeight}
            hideFooter
          />
        </div>
      );
    }
    render(<TestCase />);

    // data grid should have loaded 6 rows:
    //   1 initial row
    //   5 rows loaded one by one through `onRowsScrollEnd` callback

    expect(getColumnValues(0)).to.deep.equal(['0']);
    await waitFor(() => {
      expect(getRow.callCount).to.equal(1);
    });
    await waitFor(() => {
      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
    });

    await waitFor(() => {
      expect(getRow.callCount).to.equal(2);
    });
    await waitFor(() => {
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2']);
    });

    await waitFor(() => {
      expect(getRow.callCount).to.equal(3);
    });
    await waitFor(() => {
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3']);
    });

    await waitFor(() => {
      expect(getRow.callCount).to.equal(4);
    });
    await waitFor(() => {
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);
    });

    await waitFor(() => {
      expect(getRow.callCount).to.equal(5);
    });
    await waitFor(() => {
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
    });

    await sleep(200);
    // should not load more rows because the threshold is not reached
    expect(getRow.callCount).to.equal(5);
  });
});
