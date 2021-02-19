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
import { getActiveCell, getCell, getRow } from 'test/utils/helperFn';
import { DataGrid } from '@material-ui/data-grid';
import { useData } from 'packages/storybook/src/hooks/useData';
import { GridColumns } from 'packages/grid/_modules_/grid/models/colDef/gridColDef';

const SPACE_KEY = { key: ' ', code: 'Space', shiftKey: false };
const SHIFT_SPACE_KEY = { ...SPACE_KEY, shiftKey: true };

describe('<DataGrid /> - Keyboard', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

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

  const KeyboardTest = () => {
    const data = useData(100, 20);
    const transformColSizes = (columns: GridColumns) =>
      columns.map((column) => ({ ...column, width: 60 }));

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid rows={data.rows} columns={transformColSizes(data.columns)} />
      </div>
    );
  };

  /* eslint-disable material-ui/disallow-active-element-as-key-event-target */
  it('cell navigation with arrows', () => {
    render(<KeyboardTest />);
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

  it('Space only should go to the bottom of the page', () => {
    render(<KeyboardTest />);
    getCell(0, 0).focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, SPACE_KEY);
    expect(getActiveCell()).to.equal('3-0');
  });

  it('Home / End navigation', async () => {
    render(<KeyboardTest />);
    getCell(1, 1).focus();
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(getActiveCell()).to.equal('1-0');
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    await waitFor(() => getCell(1, 19));
    expect(getActiveCell()).to.equal('1-19');
  });
  /* eslint-enable material-ui/disallow-active-element-as-key-event-target */
});
