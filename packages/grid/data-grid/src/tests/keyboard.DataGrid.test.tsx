import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  createEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
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
import { DataGrid } from '@mui/x-data-grid';
import { useData } from 'packages/storybook/src/hooks/useData';
import { GridColumns } from 'packages/grid/_modules_/grid/models/colDef/gridColDef';

const SPACE_KEY = { key: ' ' };
const SHIFT_SPACE_KEY = { ...SPACE_KEY, shiftKey: true };
const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Keyboard', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

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

  const KeyboardTest = (props: {
    nbRows?: number;
    checkboxSelection?: boolean;
    disableVirtualization?: boolean;
    filterModel?: any;
    width?: number;
  }) => {
    const data = useData(props.nbRows || 100, 20);
    const transformColSizes = (columns: GridColumns) =>
      columns.map((column) => ({ ...column, width: 60 }));

    return (
      <div style={{ width: props.width || 300, height: 360 }}>
        <DataGrid
          autoHeight={isJSDOM}
          rows={data.rows}
          columns={transformColSizes(data.columns)}
          checkboxSelection={props.checkboxSelection}
          disableVirtualization={props.disableVirtualization}
          filterModel={props.filterModel}
        />
      </div>
    );
  };

  /* eslint-disable material-ui/disallow-active-element-as-key-event-target */
  it('should support cell navigation with arrows', () => {
    render(<KeyboardTest nbRows={10} />);
    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(getActiveCell()).to.equal('0-1');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    expect(getActiveCell()).to.equal('1-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(getActiveColumnHeader()).to.equal('1');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(getActiveColumnHeader()).to.equal('2');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(getActiveCell()).to.equal('0-1');
  });

  it('should not crash when pressing ArrowDown after reaching last visible row', () => {
    render(
      <KeyboardTest
        nbRows={10}
        filterModel={{ items: [{ columnField: 'id', operatorValue: '<', value: '2' }] }}
      />,
    );
    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(getActiveCell()).to.equal('1-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(getActiveCell()).to.equal('1-0');
  });

  it('should support cell navigation with arrows and checkboxSelection', () => {
    render(<KeyboardTest nbRows={10} checkboxSelection />);
    getCell(0, 0).querySelector('input')!.focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(getActiveCell()).to.equal('0-1');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(getActiveCell()).to.equal('1-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(getActiveCell()).to.equal('0-0');
  });

  it('should support cell navigation with arrows when rows are filtered', () => {
    render(
      <KeyboardTest
        nbRows={10}
        filterModel={{ items: [{ columnField: 'id', value: 1, operatorValue: '!=' }] }}
      />,
    );
    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(getActiveCell()).to.equal('1-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(getActiveCell()).to.equal('0-0');
  });

  it('should navigate between column headers with arrows', () => {
    render(<KeyboardTest nbRows={10} />);
    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(getActiveColumnHeader()).to.equal('1');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(getActiveColumnHeader()).to.equal('2');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    expect(getActiveColumnHeader()).to.equal('1');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(getActiveCell()).to.equal('0-0');
  });

  it('should navigate between column headers with arrows when rows are filtered', () => {
    render(
      <KeyboardTest
        nbRows={10}
        filterModel={{ items: [{ columnField: 'id', value: 1, operatorValue: '>' }] }}
      />,
    );
    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(getActiveColumnHeader()).to.equal('1');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(getActiveColumnHeader()).to.equal('2');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    expect(getActiveColumnHeader()).to.equal('1');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(getActiveCell()).to.equal('0-0');
  });

  it('should scroll horizontally when navigating between column headers with arrows', function test() {
    if (isJSDOM) {
      // Need layouting for column virtualization
      this.skip();
    }
    render(<KeyboardTest width={60} nbRows={10} />);
    getColumnHeaderCell(0).focus();
    const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')! as HTMLElement;
    expect(virtualScroller.scrollLeft).to.equal(0);
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(virtualScroller.scrollLeft).not.to.equal(0);
  });

  it('Shift + Space should select a row', () => {
    render(<KeyboardTest />);
    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, SHIFT_SPACE_KEY);
    const row = getRow(0);
    const isSelected = row.classList.contains('Mui-selected');
    expect(isSelected).to.equal(true);
  });

  it('Space only should go to the bottom of the page', function test() {
    render(<KeyboardTest disableVirtualization />);
    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { key: ' ' });
    expect(getActiveCell()).to.equal('99-0');
  });

  it('Space only should go to the bottom of the page even with small number of rows', () => {
    render(<KeyboardTest nbRows={4} />);
    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, SPACE_KEY);
    expect(getActiveCell()).to.equal('3-0');
  });

  it('Home / End navigation', async function test() {
    render(<KeyboardTest disableVirtualization />);
    getCell(1, 1).focus();
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(getActiveCell()).to.equal('1-0');
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    await waitFor(() => getCell(1, 19));
    expect(getActiveCell()).to.equal('1-19');
  });

  it('Page Down / Page Up navigation', () => {
    const baselineProps = {
      rows: [
        {
          id: 0,
          brand: 'Nike',
        },
        {
          id: 1,
          brand: 'Adidas',
        },
        {
          id: 2,
          brand: 'Puma',
        },
      ],
      columns: [{ field: 'brand' }],
    };

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid autoHeight={isJSDOM} rows={baselineProps.rows} columns={baselineProps.columns} />
      </div>,
    );

    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
    expect(getActiveCell()).to.equal('2-0');
    fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
    expect(getActiveColumnHeader()).to.equal('1');
    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
    expect(getActiveCell()).to.equal('2-0');
  });
  /* eslint-enable material-ui/disallow-active-element-as-key-event-target */

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
    expect(getActiveColumnHeader()).to.equal('1');
    expect(getColumnValues(1)).to.deep.equal(['John', 'Doe']);
    fireEvent.keyDown(getColumnHeaderCell(0), { key: 'Enter' });
    fireEvent.keyDown(getColumnHeaderCell(0), { key: 'Enter' });
    expect(getColumnValues(1)).to.deep.equal(['Doe', 'John']);
  });
});
