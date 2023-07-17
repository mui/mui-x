import * as React from 'react';
import { createRenderer, fireEvent, screen, act, userEvent } from '@mui/monorepo/test/utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import {
  getActiveCell,
  getActiveColumnHeader,
  getCell,
  getColumnHeaderCell,
  getColumnValues,
  getRow,
} from 'test/utils/helperFn';
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';
import { useBasicDemoData, getBasicGridData } from '@mui/x-data-grid-generator';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const PAGE_SIZE = 10;
const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 56;
const HEIGHT = 360;

const expectAriaCoordinate = (
  element: Element | null,
  { colIndex, rowIndex }: { colIndex: number; rowIndex: number },
) => {
  expect(element).to.have.attribute('aria-colindex', colIndex.toString());
  expect(element?.closest('[role="row"]')).to.have.attribute('aria-rowindex', rowIndex.toString());
};

describe('<DataGrid /> - Keyboard', () => {
  const { render } = createRenderer({ clock: 'fake' });

  function NavigationTestCaseNoScrollX(
    props: Omit<
      DataGridProps,
      'autoHeight' | 'rows' | 'columns' | 'pageSize' | 'pageSizeOptions'
    > & {},
  ) {
    const data = useBasicDemoData(100, 3);
    const transformColSizes = (columns: GridColDef[]) =>
      columns.map((column) => ({ ...column, width: 60 }));

    return (
      <div style={{ width: 300, height: HEIGHT }}>
        <DataGrid
          autoHeight={isJSDOM}
          rows={data.rows}
          columns={transformColSizes(data.columns)}
          initialState={{ pagination: { paginationModel: { pageSize: PAGE_SIZE } } }}
          pageSizeOptions={[PAGE_SIZE]}
          rowBuffer={PAGE_SIZE}
          rowHeight={ROW_HEIGHT}
          columnHeaderHeight={HEADER_HEIGHT}
          hideFooter
          filterModel={{ items: [{ field: 'id', operator: '>', value: 10 }] }}
          experimentalFeatures={{ warnIfFocusStateIsNotSynced: true, columnGrouping: true }}
          {...props}
        />
      </div>
    );
  }

  /* eslint-disable material-ui/disallow-active-element-as-key-event-target */
  describe('cell navigation', () => {
    it('should move to cell below when pressing "ArrowDown" on a cell on the 1st page', () => {
      render(<NavigationTestCaseNoScrollX />);
      const cell = getCell(8, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('9-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('9-1'); // Already on the last row
    });

    it('should move to cell below when pressing "ArrowDown" on a cell on the 2nd page', () => {
      render(<NavigationTestCaseNoScrollX paginationModel={{ page: 1, pageSize: PAGE_SIZE }} />);
      const cell = getCell(18, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('18-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('19-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('19-1'); // Already on the last row
    });

    it('should move to the cell below when pressing "ArrowDown" on the checkbox selection cell', () => {
      render(<NavigationTestCaseNoScrollX checkboxSelection />);
      const cell = getCell(0, 0);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('0-0');
      fireEvent.keyDown(cell.querySelector('input')!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('1-0');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('2-0');
    });

    it('should move to the cell above when pressing "ArrowUp" on a cell on the 1st page', () => {
      render(<NavigationTestCaseNoScrollX />);
      const cell = getCell(1, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('1-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      expect(getActiveCell()).to.equal('0-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      expect(getActiveColumnHeader()).to.equal('1');
    });

    it('should move to the cell above when pressing "ArrowUp" on a cell on the 2nd page', () => {
      render(<NavigationTestCaseNoScrollX paginationModel={{ page: 1, pageSize: PAGE_SIZE }} />);
      const cell = getCell(11, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('11-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      expect(getActiveCell()).to.equal('10-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      expect(getActiveColumnHeader()).to.equal('1');
    });

    it('should move to the cell right when pressing "ArrowRight" on a cell', () => {
      render(<NavigationTestCaseNoScrollX />);
      const cell = getCell(1, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('1-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('1-2');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('1-2'); // Already on the last cell
    });

    it('should move to the cell right when pressing "ArrowRight" on the checkbox selection cell', () => {
      render(<NavigationTestCaseNoScrollX checkboxSelection />);
      const cell = getCell(1, 0);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('1-0');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('1-1');
    });

    it('should move to the cell left when pressing "ArrowLeft" on a cell', () => {
      render(<NavigationTestCaseNoScrollX />);
      const cell = getCell(1, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('1-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
      expect(getActiveCell()).to.equal('1-0');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
      expect(getActiveCell()).to.equal('1-0'); // Already on the 1st cell
    });

    it('should move down by the amount of rows visible on screen when pressing "PageDown"', function test() {
      if (isJSDOM) {
        // This test is not relevant if we can't choose the actual height
        this.skip();
      }

      render(<NavigationTestCaseNoScrollX />);
      const cell = getCell(1, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('1-1');
      fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
      expect(getActiveCell()).to.equal(`6-1`);
      fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
      expect(getActiveCell()).to.equal(`9-1`);
    });

    it('should move down by the amount of rows visible on screen when pressing Space key', function test() {
      if (isJSDOM) {
        // This test is not relevant if we can't choose the actual height
        this.skip();
      }

      render(<NavigationTestCaseNoScrollX />);
      const cell = getCell(1, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('1-1');
      fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
      expect(getActiveCell()).to.equal(`6-1`);
      fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
      expect(getActiveCell()).to.equal(`9-1`);
    });

    it('should move up by the amount of rows visible on screen when pressing "PageUp"', function test() {
      if (isJSDOM) {
        // This test is not relevant if we can't choose the actual height
        this.skip();
      }

      render(<NavigationTestCaseNoScrollX />);
      const cell = getCell(8, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
      expect(getActiveCell()).to.equal(`3-1`);
    });

    it('should move to the first row before moving to column header when pressing "PageUp"', function test() {
      if (isJSDOM) {
        // This test is not relevant if we can't choose the actual height
        this.skip();
      }

      render(<NavigationTestCaseNoScrollX />);
      const cell = getCell(3, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('3-1');

      fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
      expect(getActiveCell()).to.equal(`0-1`, 'should focus first row');

      fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
      expect(getActiveCell()).to.equal(null);
      expect(getActiveColumnHeader()).to.equal(`1`);
    });

    it('should move to the first row before moving to column header when pressing "PageUp" on page > 0', function test() {
      if (isJSDOM) {
        // This test is not relevant if we can't choose the actual height
        this.skip();
      }

      render(<NavigationTestCaseNoScrollX hideFooter={false} />);

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));

      const cell = getCell(13, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('13-1');

      fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
      expect(getActiveCell()).to.equal(`10-1`, 'should focus first row');

      fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
      expect(getActiveCell()).to.equal(null);
      expect(getActiveColumnHeader()).to.equal(`1`);
    });

    it('should navigate to the 1st cell of the current row when pressing "Home"', () => {
      render(<NavigationTestCaseNoScrollX />);
      const cell = getCell(8, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'Home' });
      expect(getActiveCell()).to.equal('8-0');
      fireEvent.keyDown(document.activeElement!, { key: 'Home' });
      expect(getActiveCell()).to.equal('8-0'); // Already on the 1st cell
    });

    it('should navigate to the 1st cell of the 1st row when pressing "Home" + ctrlKey of metaKey of shiftKey', () => {
      render(<NavigationTestCaseNoScrollX />);

      const cell = getCell(8, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'Home', ctrlKey: true });
      expect(getActiveCell()).to.equal('0-0');

      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'Home', metaKey: true });
      expect(getActiveCell()).to.equal('0-0');

      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'Home', shiftKey: true });
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should navigate to the last cell of the current row when pressing "End"', () => {
      render(<NavigationTestCaseNoScrollX />);
      const cell = getCell(8, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(cell, { key: 'End' });
      expect(getActiveCell()).to.equal('8-2');
      fireEvent.keyDown(getCell(8, 2), { key: 'End' });
      expect(getActiveCell()).to.equal('8-2'); // Already on the last cell
    });

    it('should navigate to the last cell of the last row when pressing "End" + ctrlKey of metaKey of shiftKey', () => {
      render(<NavigationTestCaseNoScrollX />);

      const cell = getCell(8, 1);
      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'End', ctrlKey: true });
      expect(getActiveCell()).to.equal('9-2');

      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'End', metaKey: true });
      expect(getActiveCell()).to.equal('9-2');

      userEvent.mousePress(cell);
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'End', shiftKey: true });
      expect(getActiveCell()).to.equal('9-2');
    });
  });

  describe('column header navigation', () => {
    it('should scroll horizontally when navigating between column headers with arrows', function test() {
      if (isJSDOM) {
        // Need layouting for column virtualization
        this.skip();
      }
      render(
        <div style={{ width: 60, height: 300 }}>
          <DataGrid autoHeight={isJSDOM} {...getBasicGridData(10, 10)} />
        </div>,
      );
      getColumnHeaderCell(0).focus();
      const virtualScroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
      expect(virtualScroller.scrollLeft).to.equal(0);
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(virtualScroller.scrollLeft).not.to.equal(0);
    });

    it('should scroll horizontally when navigating between column headers with arrows even if rows are empty', function test() {
      if (isJSDOM) {
        // Need layouting for column virtualization
        this.skip();
      }
      render(
        <div style={{ width: 60, height: 300 }}>
          <DataGrid autoHeight={isJSDOM} {...getBasicGridData(10, 10)} rows={[]} />
        </div>,
      );
      getColumnHeaderCell(0).focus();
      const virtualScroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
      expect(virtualScroller.scrollLeft).to.equal(0);
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(virtualScroller.scrollLeft).not.to.equal(0);
    });

    it('should move to the first row when pressing "ArrowDown" on a column header on the 1st page', () => {
      render(<NavigationTestCaseNoScrollX />);
      act(() => getColumnHeaderCell(1).focus());
      expect(getActiveColumnHeader()).to.equal('1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('0-1');
    });

    it('should move to the first row when pressing "ArrowDown" on a column header on the 2nd page', () => {
      render(<NavigationTestCaseNoScrollX paginationModel={{ page: 1, pageSize: PAGE_SIZE }} />);
      act(() => getColumnHeaderCell(1).focus());
      expect(getActiveColumnHeader()).to.equal('1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('10-1');
    });

    it('should move to the column header right when pressing "ArrowRight" on a column header', () => {
      render(<NavigationTestCaseNoScrollX />);
      act(() => getColumnHeaderCell(1).focus());
      expect(getActiveColumnHeader()).to.equal('1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(getActiveColumnHeader()).to.equal('2');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(getActiveColumnHeader()).to.equal('2');
    });

    it('should move to the column header left when pressing "ArrowLeft" on a column header', () => {
      render(<NavigationTestCaseNoScrollX />);
      act(() => getColumnHeaderCell(1).focus());
      expect(getActiveColumnHeader()).to.equal('1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
      expect(getActiveColumnHeader()).to.equal('0');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
      expect(getActiveColumnHeader()).to.equal('0');
    });

    it('should move down by the amount of rows visible on screen when pressing "PageDown"', function test() {
      if (isJSDOM) {
        // This test is not relevant if we can't choose the actual height
        this.skip();
      }

      render(<NavigationTestCaseNoScrollX />);
      getColumnHeaderCell(1).focus();
      expect(getActiveColumnHeader()).to.equal('1');
      fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
      expect(getActiveCell()).to.equal(`5-1`);
    });

    it('should move focus when the focus is on a column header button', function test() {
      if (isJSDOM) {
        // This test is not relevant if we can't choose the actual height
        this.skip();
      }

      render(<NavigationTestCaseNoScrollX />);

      // get the sort button in column header 1
      const columnMenuButton =
        getColumnHeaderCell(1).querySelector<HTMLElement>(`button[title="Sort"]`)!;

      // Simulate click on this button
      userEvent.mousePress(columnMenuButton);
      columnMenuButton.focus();

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal(`0-1`);
    });

    it('should be able to use keyboard in a columnHeader child input', () => {
      const columns = [
        {
          field: 'name',
          headerName: 'Name',
          width: 200,
          renderHeader: () => <input type="text" data-testid="custom-input" />,
        },
      ];

      const rows = [
        {
          id: 1,
          name: 'John',
        },
      ];

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid rows={rows} columns={columns} />
        </div>,
      );
      const input = screen.getByTestId('custom-input');
      userEvent.mousePress(input);
      input.focus();

      // Verify that the event is not prevented during the bubbling.
      // fireEvent.keyDown return false if it is the case
      // For more info, see the related discussion: https://github.com/mui/mui-x/pull/3624#discussion_r787767632
      expect(fireEvent.keyDown(input, { key: 'a' })).to.equal(true);
      expect(fireEvent.keyDown(input, { key: ' ' })).to.equal(true);
      expect(fireEvent.keyDown(input, { key: 'ArrowLeft' })).to.equal(true);
    });
  });

  describe('column group header navigation', () => {
    /**
     * Grouping structure
     *
     *                    | prices                                |
     *                    |         | prices234                   |
     * id | currencyPair  | price1M | price2M | price3M | price4M | price5M
     */
    const columnGroupingModel = [
      {
        groupId: 'prices',
        children: [
          { field: 'price1M' },
          {
            groupId: 'prices234',
            children: [{ field: 'price2M' }, { field: 'price3M' }, { field: 'price4M' }],
          },
        ],
      },
    ];

    function NavigationTestGroupingCaseNoScrollX(
      props: Omit<
        DataGridProps,
        'autoHeight' | 'rows' | 'columns' | 'pageSize' | 'pageSizeOptions'
      > & {},
    ) {
      const data = getBasicGridData(10, 10);
      const transformColSizes = (columns: GridColDef[]) =>
        columns.map((column) => ({ ...column, width: 60 }));

      return (
        <div style={{ width: 300, height: HEIGHT }}>
          <DataGrid
            autoHeight={isJSDOM}
            rows={data.rows}
            columns={transformColSizes(data.columns)}
            paginationModel={{ pageSize: PAGE_SIZE, page: 0 }}
            pageSizeOptions={[PAGE_SIZE]}
            rowBuffer={PAGE_SIZE}
            rowHeight={ROW_HEIGHT}
            columnHeaderHeight={HEADER_HEIGHT}
            hideFooter
            disableVirtualization
            columnGroupingModel={columnGroupingModel}
            experimentalFeatures={{ warnIfFocusStateIsNotSynced: true, columnGrouping: true }}
            {...props}
          />
        </div>
      );
    }

    it('should scroll horizontally when navigating between column group headers with arrows', function test() {
      if (isJSDOM) {
        // Need layouting for column virtualization
        this.skip();
      }
      render(
        <div style={{ width: 60, height: 300 }}>
          <DataGrid
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            autoHeight={isJSDOM}
            {...getBasicGridData(10, 10)}
          />
        </div>,
      );
      act(() => getColumnHeaderCell(0, 0).focus());
      const virtualScroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
      expect(virtualScroller.scrollLeft).to.equal(0);
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(virtualScroller.scrollLeft).not.to.equal(0);
    });

    it('should scroll horizontally when navigating between column headers with arrows even if rows are empty', function test() {
      if (isJSDOM) {
        // Need layouting for column virtualization
        this.skip();
      }
      render(
        <div style={{ width: 60, height: 300 }}>
          <DataGrid
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            autoHeight={isJSDOM}
            {...getBasicGridData(10, 10)}
            rows={[]}
          />
        </div>,
      );
      act(() => getColumnHeaderCell(0, 0).focus());
      const virtualScroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
      expect(virtualScroller.scrollLeft).to.equal(0);
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(virtualScroller.scrollLeft).not.to.equal(0);
      expect(document.activeElement!).toHaveAccessibleName('prices');
    });

    it('should move to the group header below when pressing "ArrowDown" on a column group header', () => {
      render(<NavigationTestGroupingCaseNoScrollX />);

      act(() => getColumnHeaderCell(2, 0).focus());
      expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 3 });

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expectAriaCoordinate(document.activeElement, { rowIndex: 2, colIndex: 3 });
    });

    it('should go back to the same group header when pressing "ArrowUp" and "ArrowDown"', () => {
      render(<NavigationTestGroupingCaseNoScrollX />);

      act(() => getColumnHeaderCell(3, 1).focus());
      expectAriaCoordinate(document.activeElement, { rowIndex: 2, colIndex: 4 });

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 3 });

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expectAriaCoordinate(document.activeElement, { rowIndex: 2, colIndex: 4 });
    });

    it('should go to next group header when pressing "ArrowRight"', () => {
      render(<NavigationTestGroupingCaseNoScrollX />);

      act(() => getColumnHeaderCell(0, 0).focus());
      expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 1 });

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 3 });

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 7 });
    });

    it('should go to previous group header when pressing "ArrowLeft"', () => {
      render(<NavigationTestGroupingCaseNoScrollX />);

      act(() => getColumnHeaderCell(6, 0).focus());
      expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 7 });

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
      expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 3 });

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
      expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 1 });
    });

    it('should go to group header when pressing "ArrowUp" from column header', () => {
      render(<NavigationTestGroupingCaseNoScrollX />);

      act(() => getColumnHeaderCell(4, 2).focus());
      // column with field "price3M"
      expectAriaCoordinate(document.activeElement, { rowIndex: 3, colIndex: 5 });

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      // group "prices 234"
      expectAriaCoordinate(document.activeElement, { rowIndex: 2, colIndex: 4 });
    });

    it('should go back to same header when pressing "ArrowUp" and "ArrowDown" from column header', () => {
      render(<NavigationTestGroupingCaseNoScrollX />);

      act(() => getColumnHeaderCell(4, 2).focus());
      // column with field "price3M"
      expectAriaCoordinate(document.activeElement, { rowIndex: 3, colIndex: 5 });

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      // group "prices 234"
      expectAriaCoordinate(document.activeElement, { rowIndex: 2, colIndex: 4 });

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      // column with field "price3M"
      expectAriaCoordinate(document.activeElement, { rowIndex: 3, colIndex: 5 });
    });
  });

  it('should call preventDefault when using keyboard navigation', () => {
    const handleKeyDown = spy((event) => event.defaultPrevented);

    const columns = [{ field: 'id' }, { field: 'name' }];
    const rows = [{ id: 1, name: 'John' }];

    render(
      <div style={{ width: 300, height: 300 }} onKeyDown={handleKeyDown}>
        <DataGrid rows={rows} columns={columns} />
      </div>,
    );
    const firstCell = getCell(0, 0);
    userEvent.mousePress(firstCell);
    fireEvent.keyDown(firstCell, { key: 'ArrowRight' });
    expect(handleKeyDown.returnValues).to.deep.equal([true]);
  });

  it('should sort column when pressing enter and column header is selected', () => {
    const columns = [
      {
        field: 'id',
      },
      {
        field: 'name',
      },
    ];

    const rows = [
      {
        id: 1,
        name: 'John',
      },
      {
        id: 2,
        name: 'Doe',
      },
    ];

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid rows={rows} columns={columns} />
      </div>,
    );

    act(() => getColumnHeaderCell(0).focus());
    expect(getActiveColumnHeader()).to.equal('0');
    expect(getColumnValues(1)).to.deep.equal(['John', 'Doe']);
    fireEvent.keyDown(getColumnHeaderCell(0), { key: 'Enter' });
    fireEvent.keyDown(getColumnHeaderCell(0), { key: 'Enter' });
    expect(getColumnValues(1)).to.deep.equal(['Doe', 'John']);
  });

  it('should select a row when pressing Space key + shiftKey', () => {
    render(<NavigationTestCaseNoScrollX disableRowSelectionOnClick />);
    const cell = getCell(0, 0);
    userEvent.mousePress(cell);
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(cell, { key: ' ', shiftKey: true });
    const row = getRow(0);
    expect(row).to.have.class('Mui-selected');
  });

  it('should not rerender when pressing a key inside an already focused cell', () => {
    const renderCell = spy(() => <input type="text" data-testid="custom-input" />);
    const columns = [{ field: 'name', renderCell }];
    const rows = [{ id: 1, name: 'John' }];
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid rows={rows} columns={columns} />
      </div>,
    );
    expect(renderCell.callCount).to.equal(2);
    const input = screen.getByTestId('custom-input');
    input.focus();
    fireEvent.keyDown(input, { key: 'a' });
    expect(renderCell.callCount).to.equal(4);
    fireEvent.keyDown(input, { key: 'b' });
    expect(renderCell.callCount).to.equal(4);
  });

  it('should not scroll horizontally when cell is wider than viewport', () => {
    const columns = [{ field: 'id', width: 400 }, { field: 'name' }];
    const rows = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid rows={rows} columns={columns} />
      </div>,
    );
    const virtualScroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;

    const firstCell = getCell(0, 0);
    userEvent.mousePress(firstCell);
    expect(virtualScroller.scrollLeft).to.equal(0);

    fireEvent.keyDown(firstCell, { key: 'ArrowDown' });
    expect(virtualScroller.scrollLeft).to.equal(0);
  });
});
