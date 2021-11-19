import * as React from 'react';
import { createRenderer, fireEvent, screen, createEvent } from '@material-ui/monorepo/test/utils';
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
import { DataGrid, DataGridProps, GridColumns } from '@mui/x-data-grid';
import { useData } from 'storybook/src/hooks/useData';
import { getData } from 'storybook/src/data/data-service';

const SPACE_KEY = { key: ' ' };
const SHIFT_SPACE_KEY = { ...SPACE_KEY, shiftKey: true };
const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const PAGE_SIZE = 10;
const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 56;
const HEIGHT = 360;

describe('<DataGrid /> - Keyboard', () => {
  const { render } = createRenderer();

  const NavigationTestCaseNoScrollX = (
    props: Omit<
      DataGridProps,
      'autoHeight' | 'rows' | 'columns' | 'pageSize' | 'rowsPerPageOptions'
    > & {},
  ) => {
    const data = useData(100, 3);
    const transformColSizes = (columns: GridColumns) =>
      columns.map((column) => ({ ...column, width: 60 }));

    return (
      <div style={{ width: 300, height: HEIGHT }}>
        <DataGrid
          autoHeight={isJSDOM}
          rows={data.rows}
          columns={transformColSizes(data.columns)}
          pageSize={PAGE_SIZE}
          rowsPerPageOptions={[PAGE_SIZE]}
          rowBuffer={PAGE_SIZE}
          rowHeight={ROW_HEIGHT}
          headerHeight={HEADER_HEIGHT}
          hideFooter
          filterModel={{ items: [{ columnField: 'id', operatorValue: '>', value: 10 }] }}
          {...props}
        />
      </div>
    );
  };

  /* eslint-disable material-ui/disallow-active-element-as-key-event-target */
  describe('cell navigation', () => {
    it('should move to cell below when pressing "ArrowDown" on a cell on the 1st page', () => {
      render(<NavigationTestCaseNoScrollX />);
      getCell(8, 1).focus();
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('9-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('9-1'); // Already on the last row
    });

    it('should move to cell below when pressing "ArrowDown" on a cell on the 2nd page', () => {
      render(<NavigationTestCaseNoScrollX page={1} />);
      getCell(18, 1).focus();
      expect(getActiveCell()).to.equal('18-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('19-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('19-1'); // Already on the last row
    });

    it('should move to the cell below when pressing "ArrowRight" on the checkbox selection cell', () => {
      render(<NavigationTestCaseNoScrollX checkboxSelection />);
      getCell(1, 0).querySelector('input')!.focus();
      expect(getActiveCell()).to.equal('1-0');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('2-0');
    });

    it('should move to the cell above when pressing "ArrowUp" on a cell on the 1st page', () => {
      render(<NavigationTestCaseNoScrollX />);
      getCell(1, 1).focus();
      expect(getActiveCell()).to.equal('1-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      expect(getActiveCell()).to.equal('0-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      expect(getActiveColumnHeader()).to.equal('1');
    });

    it('should move to the cell above when pressing "ArrowUp" on a cell on the 2nd page', () => {
      render(<NavigationTestCaseNoScrollX page={1} />);
      getCell(11, 1).focus();
      expect(getActiveCell()).to.equal('11-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      expect(getActiveCell()).to.equal('10-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
      expect(getActiveColumnHeader()).to.equal('1');
    });

    it('should move to the cell right when pressing "ArrowRight" on a cell', () => {
      render(<NavigationTestCaseNoScrollX />);
      getCell(1, 1).focus();
      expect(getActiveCell()).to.equal('1-1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('1-2');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('1-2'); // Already on the last cell
    });

    it('should move to the cell right when pressing "ArrowRight" on the checkbox selection cell', () => {
      render(<NavigationTestCaseNoScrollX checkboxSelection />);
      getCell(1, 0).querySelector('input')!.focus();
      expect(getActiveCell()).to.equal('1-0');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('1-1');
    });

    it('should move to the cell left when pressing "ArrowLeft" on a cell', () => {
      render(<NavigationTestCaseNoScrollX />);
      getCell(1, 1).focus();
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
      getCell(1, 1).focus();
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
      getCell(1, 1).focus();
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
      getCell(8, 1).focus();
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
      expect(getActiveCell()).to.equal(`3-1`);
      fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
      expect(getActiveColumnHeader()).to.equal(`1`);
    });

    it('should navigate to the 1st cell of the current row when pressing "Home"', () => {
      render(<NavigationTestCaseNoScrollX />);
      getCell(8, 1).focus();
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'Home' });
      expect(getActiveCell()).to.equal('8-0');
      fireEvent.keyDown(document.activeElement!, { key: 'Home' });
      expect(getActiveCell()).to.equal('8-0'); // Already on the 1st cell
    });

    it('should navigate to the 1st cell of the 1st row when pressing "Home" + ctrlKey of metaKey of shiftKey', () => {
      render(<NavigationTestCaseNoScrollX />);

      getCell(8, 1).focus();
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'Home', ctrlKey: true });
      expect(getActiveCell()).to.equal('0-0');

      getCell(8, 1).focus();
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'Home', metaKey: true });
      expect(getActiveCell()).to.equal('0-0');

      getCell(8, 1).focus();
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'Home', shiftKey: true });
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should navigate to the last cell of the current row when pressing "End"', () => {
      render(<NavigationTestCaseNoScrollX />);
      getCell(8, 1).focus();
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'End' });
      expect(getActiveCell()).to.equal('8-2');
      fireEvent.keyDown(document.activeElement!, { key: 'End' });
      expect(getActiveCell()).to.equal('8-2'); // Already on the last cell
    });

    it('should navigate to the last cell of the last row when pressing "End" + ctrlKey of metaKey of shiftKey', () => {
      render(<NavigationTestCaseNoScrollX />);

      getCell(8, 1).focus();
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'End', ctrlKey: true });
      expect(getActiveCell()).to.equal('9-2');

      getCell(8, 1).focus();
      expect(getActiveCell()).to.equal('8-1');
      fireEvent.keyDown(document.activeElement!, { key: 'End', metaKey: true });
      expect(getActiveCell()).to.equal('9-2');

      getCell(8, 1).focus();
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
          <DataGrid autoHeight={isJSDOM} {...getData(10, 10)} />
        </div>,
      );
      getColumnHeaderCell(0).focus();
      const virtualScroller = document.querySelector(
        '.MuiDataGrid-virtualScroller',
      )! as HTMLElement;
      expect(virtualScroller.scrollLeft).to.equal(0);
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(virtualScroller.scrollLeft).not.to.equal(0);
    });

    it('should move to the first row when pressing "ArrowDown" on a column header on the 1st page', () => {
      render(<NavigationTestCaseNoScrollX />);
      getColumnHeaderCell(1).focus();
      expect(getActiveColumnHeader()).to.equal('1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('0-1');
    });

    it('should move to the first row when pressing "ArrowDown" on a column header on the 2nd page', () => {
      render(<NavigationTestCaseNoScrollX page={1} />);
      getColumnHeaderCell(1).focus();
      expect(getActiveColumnHeader()).to.equal('1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('10-1');
    });

    it('should move to the column header right when pressing "ArrowRight" on a column header', () => {
      render(<NavigationTestCaseNoScrollX />);
      getColumnHeaderCell(1).focus();
      expect(getActiveColumnHeader()).to.equal('1');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(getActiveColumnHeader()).to.equal('2');
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      expect(getActiveColumnHeader()).to.equal('2');
    });

    it('should move to the column header left when pressing "ArrowLeft" on a column header', () => {
      render(<NavigationTestCaseNoScrollX />);
      getColumnHeaderCell(1).focus();
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
  });
  /* eslint-enable material-ui/disallow-active-element-as-key-event-target */

  it('should be able to type in an child input', () => {
    const handleInputKeyDown = spy((event) => event.defaultPrevented);

    const columns = [
      {
        field: 'name',
        headerName: 'Name',
        width: 200,
        renderCell: () => (
          <input type="text" data-testid="custom-input" onKeyDown={handleInputKeyDown} />
        ),
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
    input.focus();
    const keydownEvent = createEvent.keyDown(input, {
      key: 'a',
    });
    fireEvent(input, keydownEvent);
    expect(handleInputKeyDown.returnValues).to.deep.equal([false]);
  });

  it('should ignore key shortcuts if activeElement is not a cell', () => {
    const columns = [
      {
        field: 'id',
      },
      {
        field: 'name',
        renderCell: () => <input type="text" data-testid="custom-input" />,
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
    input.focus();
    expect(getActiveCell()).to.equal('0-1');
    input.focus(); // The focus moves back to the cell
    fireEvent.keyDown(input, { key: 'ArrowLeft' });
    expect(getActiveCell()).to.equal('0-1');
  });

  it('should call preventDefault when using keyboard navigation', () => {
    const handleKeyDown = spy((event) => event.defaultPrevented);

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
    ];

    render(
      <div style={{ width: 300, height: 300 }} onKeyDown={handleKeyDown}>
        <DataGrid rows={rows} columns={columns} />
      </div>,
    );
    const firstCell = getCell(0, 0);
    firstCell.focus();
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

    getColumnHeaderCell(0).focus();
    expect(getActiveColumnHeader()).to.equal('0');
    expect(getColumnValues(1)).to.deep.equal(['John', 'Doe']);
    fireEvent.keyDown(getColumnHeaderCell(0), { key: 'Enter' });
    fireEvent.keyDown(getColumnHeaderCell(0), { key: 'Enter' });
    expect(getColumnValues(1)).to.deep.equal(['Doe', 'John']);
  });

  /* eslint-disable material-ui/disallow-active-element-as-key-event-target */
  it('should select a row when pressing Space key + shiftKey', () => {
    render(<NavigationTestCaseNoScrollX />);
    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, SHIFT_SPACE_KEY);
    const row = getRow(0);
    const isSelected = row.classList.contains('Mui-selected');
    expect(isSelected).to.equal(true);
  });
  /* eslint-enable material-ui/disallow-active-element-as-key-event-target */
});
