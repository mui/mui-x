import { GridApiRef, GridComponentProps, useGridApiRef, XGrid } from '@material-ui/x-grid';
import { expect } from 'chai';
import * as React from 'react';
import { getActiveCell, getCell } from 'test/utils/helperFn';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  act,
} from 'test/utils';

describe('<XGrid /> - apiRef', () => {
  let baselineProps;

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();
  beforeEach(() => {
    baselineProps = {
      rows: [
        {
          id: 0,
          brand: 'Nike',
          year: 1941,
        },
        {
          id: 1,
          brand: 'Adidas',
          year: 1961,
        },
        {
          id: 2,
          brand: 'Puma',
          year: 1921,
        },
      ],
      columns: [
        { field: 'brand', editable: true },
        { field: 'year', editable: true },
      ],
    };
  });

  let apiRef: GridApiRef;

  const TestCase = (props: Partial<GridComponentProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid
          apiRef={apiRef}
          columns={baselineProps.columns}
          rows={baselineProps.rows}
          {...props}
        />
      </div>
    );
  };

  it('isCellEditable should add the class MuiDataGrid-cellEditable to editable cells but not prevent a cell from switching mode', () => {
    render(<TestCase isCellEditable={(params) => params.value === 'Adidas'} />);
    const cellNike = getCell(0, 0);
    expect(cellNike!.classList.contains('MuiDataGrid-cellEditable')).to.equal(false);
    const cellAdidas = getCell(1, 0);
    expect(cellAdidas!.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);

    apiRef!.current.setCellMode(0, 'brand', 'edit');
    expect(cellNike.classList.contains('MuiDataGrid-cellEditing')).to.equal(true);
  });

  it('should allow to switch between cell mode', () => {
    render(<TestCase />);
    apiRef!.current.setCellMode(1, 'brand', 'edit');
    const cell = getCell(1, 0);

    expect(cell.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);
    expect(cell.classList.contains('MuiDataGrid-cellEditing')).to.equal(true);
    expect(cell.querySelector('input')!.value).to.equal('Adidas');

    apiRef!.current.setCellMode(1, 'brand', 'view');
    expect(cell.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);
    expect(cell.classList.contains('MuiDataGrid-cellEditing')).to.equal(false);
    expect(cell.querySelector('input')).to.equal(null);
  });

  it('should allow to switch between cell mode using double click', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);

    expect(cell.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);
    expect(cell.classList.contains('MuiDataGrid-cellEditing')).to.equal(true);
    expect(cell.querySelector('input')!.value).to.equal('Adidas');
  });

  it('should allow to switch between cell mode using enter key', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.keyDown(cell, { key: 'Enter' });

    expect(cell.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);
    expect(cell.classList.contains('MuiDataGrid-cellEditing')).to.equal(true);
    expect(cell.querySelector('input')!.value).to.equal('Adidas');
  });

  it('should allow to delete a cell directly if editable using delete key', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();

    expect(cell.textContent).to.equal('Adidas');
    fireEvent.keyDown(cell, { key: 'Delete' });
    expect(cell.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);
    expect(cell.classList.contains('MuiDataGrid-cellEditing')).to.equal(false);
    expect(cell.textContent).to.equal('');
  });

  // Due to an issue with the keyDown event in test library, this test is not working
  // https://github.com/testing-library/dom-testing-library/issues/405
  // eslint-disable-next-line mocha/no-skipped-tests
  xit('should allow to edit a cell value by typing an alpha char', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    expect(cell.textContent).to.equal('Adidas');
    act(() => {
      fireEvent.keyDown(cell, { key: 'a', code: 1, target: cell });
    });
    expect(cell.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);
    expect(cell.classList.contains('MuiDataGrid-cellEditing')).to.equal(true);
    expect(cell.textContent).to.equal('a');

    expect(cell.querySelector('input')!.value).to.equal('a');
  });

  it('should allow to rollback from edit changes using Escape', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');

    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(cell.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);
    expect(cell.classList.contains('MuiDataGrid-cellEditing')).to.equal(false);
    expect(cell.textContent).to.equal('Adidas');
  });

  it('should allow to save an edit changes using Enter', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');
    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(cell.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);
    expect(cell.classList.contains('MuiDataGrid-cellEditing')).to.equal(false);
    expect(cell.textContent).to.equal('n');
    expect(getActiveCell()).to.equal('2-0');
  });

  it('should allow to save an edit changes using Tab', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');

    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Tab' });
    expect(cell.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);
    expect(cell.classList.contains('MuiDataGrid-cellEditing')).to.equal(false);
    expect(cell.textContent).to.equal('n');
    expect(getActiveCell()).to.equal('1-1');
  });

  it('should allow to save an edit changes using shift+Tab', () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    expect(cell.querySelector('input')!.value).to.equal('1970');

    fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });
    expect(cell.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);
    expect(cell.classList.contains('MuiDataGrid-cellEditing')).to.equal(false);
    expect(cell.textContent).to.equal('1970');
    expect(getActiveCell()).to.equal('1-0');
  });
});
