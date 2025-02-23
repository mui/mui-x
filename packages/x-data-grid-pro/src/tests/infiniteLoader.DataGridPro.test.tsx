import * as React from 'react';
import { act, createRenderer, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { spy, restore } from 'sinon';
import { getColumnValues } from 'test/utils/helperFn';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';

describe('<DataGridPro /> - Infnite loader', () => {
  afterEach(() => {
    restore();
  });

  const { render } = createRenderer();

  // Needs layout
  testSkipIf(isJSDOM)(
    'should call `onRowsScrollEnd` when viewport scroll reaches the bottom',
    async () => {
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

      await act(async () => {
        // arbitrary number to make sure that the bottom of the grid window is reached.
        virtualScroller.scrollTop = 12345;
        virtualScroller.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(handleRowsScrollEnd.callCount).to.equal(1);
      });

      await act(async () => {
        setProps({
          rows: baseRows.concat(
            { id: 6, brand: 'Gucci' },
            { id: 7, brand: "Levi's" },
            { id: 8, brand: 'Ray-Ban' },
          ),
        });

        // Trigger a scroll again to notify the grid that we're not in the bottom area anymore
        virtualScroller.dispatchEvent(new Event('scroll'));
      });

      expect(handleRowsScrollEnd.callCount).to.equal(1);

      await act(async () => {
        virtualScroller.scrollTop = 12345;
        virtualScroller.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(handleRowsScrollEnd.callCount).to.equal(2);
      });
    },
  );

  // Needs layout
  testSkipIf(isJSDOM)(
    'should call `onRowsScrollEnd` when there is not enough rows to cover the viewport height',
    async () => {
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

      // Data Grid should have loaded 6 rows:
      //   1 initial row
      //   5 rows loaded one by one through `onRowsScrollEnd` callback

      const multiplier = 2; // `setRows` is called twice for each `handleRowsScrollEnd` call
      await waitFor(() => {
        expect(getRow.callCount).to.equal(5 * multiplier);
      });

      const getRowCalls = getRow.getCalls();
      for (let callIndex = 0; callIndex < getRowCalls.length; callIndex += multiplier) {
        const call = getRowCalls[callIndex];
        expect(call.returnValue?.id).to.equal(callIndex / multiplier + 1);
      }

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
      });
    },
  );

  // Needs layout
  testSkipIf(isJSDOM)(
    'should not observe intersections with the rows pinned to the bottom',
    async () => {
      const baseRows = [
        { id: 0, brand: 'Nike' },
        { id: 1, brand: 'Adidas' },
        { id: 2, brand: 'Puma' },
        { id: 3, brand: 'Under Armor' },
        { id: 4, brand: 'Jordan' },
        { id: 5, brand: 'Reebok' },
      ];
      const basePinnedRows = {
        bottom: [{ id: 6, brand: 'Unbranded' }],
      };

      const handleRowsScrollEnd = spy();
      const observe = spy(window.IntersectionObserver.prototype, 'observe');

      function TestCase({
        rows,
        pinnedRows,
      }: {
        rows: typeof baseRows;
        pinnedRows: typeof basePinnedRows;
      }) {
        return (
          <div style={{ width: 300, height: 100 }}>
            <DataGridPro
              columns={[{ field: 'brand', width: 100 }]}
              rows={rows}
              onRowsScrollEnd={handleRowsScrollEnd}
              pinnedRows={pinnedRows}
            />
          </div>
        );
      }
      const { container } = render(<TestCase rows={baseRows} pinnedRows={basePinnedRows} />);
      const virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller')!;
      // on the initial render, last row is not visible and the `observe` method is not called
      expect(observe.callCount).to.equal(0);
      // arbitrary number to make sure that the bottom of the grid window is reached.
      virtualScroller.scrollTop = 12345;
      await act(() => virtualScroller.dispatchEvent(new Event('scroll')));
      // observer was attached
      await waitFor(() => {
        expect(observe.callCount).to.equal(1);
      });
    },
  );
});
