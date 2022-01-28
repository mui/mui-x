import * as React from 'react';
import { GridApiRef, DataGridProProps, useGridApiRef, DataGridPro } from '@mui/x-data-grid-pro';
import { createRenderer, fireEvent, waitFor } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { getCell, getRow } from 'test/utils/helperFn';
import { spy } from 'sinon';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

function fireClickEvent(cell: HTMLElement) {
  fireEvent.mouseUp(cell);
  fireEvent.click(cell);
}

const nativeSetTimeout = setTimeout;

describe('<DataGridPro /> - Row Editing', () => {
  let baselineProps: Pick<
    DataGridProProps,
    'autoHeight' | 'rows' | 'columns' | 'throttleRowsMs' | 'editMode'
  >;

  beforeEach(() => {
    baselineProps = {
      editMode: 'row',
      autoHeight: isJSDOM,
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
      throttleRowsMs: 0,
    };
  });

  const { clock, render } = createRenderer({ clock: 'fake' });

  let apiRef: GridApiRef;

  const TestCase = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  };

  it('should allow to start editing with double-click', () => {
    render(<TestCase editMode="row" />);
    expect(getRow(1)).not.to.have.class('MuiDataGrid-row--editing');
    fireEvent.doubleClick(getCell(1, 0));
    expect(getRow(1)).to.have.class('MuiDataGrid-row--editing');
  });

  it('should allow to start editing with Enter', () => {
    render(<TestCase editMode="row" />);
    expect(getRow(1)).not.to.have.class('MuiDataGrid-row--editing');
    const cell = getCell(1, 0);
    fireClickEvent(cell);

    fireEvent.keyDown(cell, { key: 'Enter' });
    expect(getRow(1)).to.have.class('MuiDataGrid-row--editing');
  });

  it('should apply the correct CSS classes to the row and cells', () => {
    render(
      <TestCase
        editMode="row"
        editRowsModel={{ 1: { brand: { value: 'Adidas' }, year: { value: 1961 } } }}
      />,
    );
    expect(getRow(1)).to.have.class('MuiDataGrid-row--editing');
    expect(getRow(1)).to.have.class('MuiDataGrid-row--editable');
    expect(getCell(1, 0)).to.have.class('MuiDataGrid-cell--editing');
    expect(getCell(1, 0)).to.have.class('MuiDataGrid-cell--editable');
    expect(getCell(1, 1)).to.have.class('MuiDataGrid-cell--editing');
    expect(getCell(1, 1)).to.have.class('MuiDataGrid-cell--editable');
  });

  it('should allow to rollback changes with Escape', () => {
    render(<TestCase editMode="row" />);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input');
    fireEvent.change(input, { target: { value: 'n' } });
    clock.tick(500);
    expect(input!.value).to.equal('n');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(cell).to.have.text('Adidas');
  });

  it('should allow to commit changes with Enter', async () => {
    render(<TestCase editMode="row" />);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input');
    fireEvent.change(input, { target: { value: 'ADIDAS' } });
    clock.tick(500);
    expect(input!.value).to.equal('ADIDAS');
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(cell).to.have.text('ADIDAS');
    });
  });

  it('should move the focus to the right cell after committing changes with Enter', async () => {
    render(<TestCase editMode="row" />);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input');
    fireEvent.change(input, { target: { value: 'ADIDAS' } });
    expect(input!.value).to.equal('ADIDAS');
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(getCell(2, 0)).toHaveFocus();
    });
  });

  it('should allow to commit changes clicking outside the row', async () => {
    render(<TestCase editMode="row" />);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input');
    fireEvent.change(input, { target: { value: 'ADIDAS' } });
    clock.tick(500);
    expect(input!.value).to.equal('ADIDAS');
    fireClickEvent(getCell(2, 0));
    clock.tick(0);
    await waitFor(() => {
      // Wait for promise
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('ADIDAS');
    });
  });

  it('should move the focus to the input of the clicked cell', () => {
    render(<TestCase editMode="row" />);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    expect(getCell(1, 0).querySelector('input')).toHaveFocus();
  });

  it('should call the valueSetter on each column', () => {
    const valueSetter = spy(({ row }) => row);
    render(
      <TestCase
        editMode="row"
        rows={[{ id: 0, firstName: 'John', lastName: 'Doe' }]}
        columns={[
          {
            field: 'id',
            editable: true,
            valueSetter,
          },
          {
            field: 'fullName',
            editable: true,
            valueGetter: ({ row }) => `${row.firstName} ${row.lastName}`,
            valueSetter: ({ value, row }) => {
              const [firstName, lastName] = (value as string).split(' ');
              return { ...row, firstName, lastName };
            },
          },
        ]}
      />,
    );
    const firstCell = getCell(0, 1);
    fireEvent.doubleClick(firstCell);
    const input = firstCell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Peter Smith' } });
    clock.tick(500);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(valueSetter.callCount).to.equal(1);
    expect(valueSetter.lastCall.args[0]).to.deep.equal({
      row: { id: 0, firstName: 'John', lastName: 'Doe' },
      value: 0,
    });
    expect(apiRef.current.getRowModels().get(0)).to.deep.equal({
      id: 0,
      firstName: 'Peter',
      lastName: 'Smith',
    });
  });

  it('should mark fields as invalid when an object with error is returned', async () => {
    const preProcessEditCellProps = ({ props }) => ({ ...props, error: true });
    render(
      <TestCase
        editMode="row"
        columns={[
          { field: 'brand', editable: true, preProcessEditCellProps },
          { field: 'year', editable: true, preProcessEditCellProps },
        ]}
      />,
    );
    const firstCell = getCell(1, 0);
    const secondCell = getCell(1, 1);
    fireEvent.doubleClick(firstCell);
    const secondInput = secondCell.querySelector('input');
    const firstInput = firstCell.querySelector('input');
    fireEvent.change(firstInput, { target: { value: 'ADIDAS' } });
    clock.tick(500);
    await waitFor(() => {
      expect(firstInput).to.have.attribute('aria-invalid', 'true');
      expect(secondInput).to.have.attribute('aria-invalid', 'true');
    });
  });

  it('should mark fields as invalid when a promise with error is returned', async () => {
    const preProcessEditCellProps = ({ props }) => Promise.resolve({ ...props, error: true });
    render(
      <TestCase
        editMode="row"
        columns={[
          { field: 'brand', editable: true, preProcessEditCellProps },
          { field: 'year', editable: true, preProcessEditCellProps },
        ]}
      />,
    );
    const firstCell = getCell(1, 0);
    const secondCell = getCell(1, 1);
    fireEvent.doubleClick(firstCell);
    const firstInput = firstCell.querySelector('input');
    const secondInput = secondCell.querySelector('input');
    fireEvent.change(firstInput, { target: { value: 'ADIDAS' } });
    clock.tick(500);
    await waitFor(() => {
      expect(firstInput).to.have.attribute('aria-invalid', 'true');
      expect(secondInput).to.have.attribute('aria-invalid', 'true');
    });
  });

  it('should exit the row edit mode and save the row when preProcessEditCellProps does not return an error', async () => {
    render(
      <TestCase
        editMode="row"
        columns={[
          {
            field: 'brand',
            editable: true,
            preProcessEditCellProps: ({ props }) => props,
          },
        ]}
        rows={[{ id: 0, brand: 'Nike' }]}
      />,
    );
    const cell = getCell(0, 0);
    fireEvent.mouseUp(cell);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Adidas' } });
    clock.runToLast();
    await new Promise((resolve) => nativeSetTimeout(resolve));
    expect(apiRef.current.getEditRowsModel()[0].brand.value).to.equal('Adidas');
    fireEvent.keyDown(input, { key: 'Enter' });
    await new Promise((resolve) => nativeSetTimeout(resolve));
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('Adidas');
  });

  // Confirms the bug in https://github.com/mui-org/material-ui-x/issues/3304
  // TODO v6: remove
  it('should call preProcessEditCellProps twice and with the wrong value in the 2nd time if preventCommitWhileValidating=false', async () => {
    const brandPreProcessEditCellProps = spy(({ props }) => Promise.resolve(props));
    const yearPreProcessEditCellProps = spy(({ props }) => Promise.resolve(props));
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          editMode="row"
          columns={[
            {
              field: 'brand',
              editable: true,
              preProcessEditCellProps: brandPreProcessEditCellProps,
            },
            {
              field: 'year',
              editable: true,
              preProcessEditCellProps: yearPreProcessEditCellProps,
            },
          ]}
          rows={[{ id: 0, brand: 'Nike', year: 2022 }]}
        />
      </div>,
    );
    const cell = getCell(0, 0);
    fireEvent.doubleClick(cell);

    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Adidas' } });
    clock.tick(500);
    fireEvent.keyDown(input, { key: 'Enter' });

    await new Promise((resolve) => nativeSetTimeout(resolve)); // Wait for promise

    expect(brandPreProcessEditCellProps.callCount).to.equal(2);
    expect(brandPreProcessEditCellProps.args[0][0].props).to.deep.equal({ value: 'Adidas' });
    expect(brandPreProcessEditCellProps.args[1][0].props).to.deep.equal({ value: 'Nike' });

    expect(yearPreProcessEditCellProps.callCount).to.equal(2);
    expect(yearPreProcessEditCellProps.args[0][0].props).to.deep.equal({ value: 2022 });
    expect(yearPreProcessEditCellProps.args[1][0].props).to.deep.equal({ value: 2022 });
  });

  it('should call preProcessEditCellProps once if it resolves with an error and preventCommitWhileValidating=true', async () => {
    const brandPreProcessEditCellProps = spy(({ props }) =>
      Promise.resolve({ ...props, error: true }),
    );
    const yearPreProcessEditCellProps = spy(({ props }) => Promise.resolve(props));
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          editMode="row"
          columns={[
            {
              field: 'brand',
              editable: true,
              preProcessEditCellProps: brandPreProcessEditCellProps,
            },
            {
              field: 'year',
              editable: true,
              preProcessEditCellProps: yearPreProcessEditCellProps,
            },
          ]}
          rows={[{ id: 0, brand: 'Nike', year: 2022 }]}
          experimentalFeatures={{ preventCommitWhileValidating: true }}
        />
      </div>,
    );
    const cell = getCell(0, 0);
    fireEvent.doubleClick(cell);

    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Adidas' } });
    clock.tick(500);
    fireEvent.keyDown(input, { key: 'Enter' });

    await new Promise((resolve) => nativeSetTimeout(resolve)); // Wait for promise

    expect(brandPreProcessEditCellProps.callCount).to.equal(1);
    expect(brandPreProcessEditCellProps.lastCall.args[0].props).to.deep.equal({
      value: 'Adidas',
      isValidating: true,
    });
    expect(yearPreProcessEditCellProps.callCount).to.equal(1);
    expect(yearPreProcessEditCellProps.lastCall.args[0].props).to.deep.equal({
      value: 2022,
      isValidating: true,
    });
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
  });

  it('should call preProcessEditCellProps with the value parsed if preventCommitWhileValidating=true', async () => {
    const preProcessEditCellProps = spy(({ props }) => Promise.resolve({ ...props }));
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          editMode="row"
          columns={[
            {
              field: 'brand',
              editable: true,
              valueParser: (value) => (value as string).toUpperCase(),
              preProcessEditCellProps,
            },
          ]}
          rows={[{ id: 0, brand: 'Nike', year: 2022 }]}
          experimentalFeatures={{ preventCommitWhileValidating: true }}
        />
      </div>,
    );
    const cell = getCell(0, 0);
    fireEvent.doubleClick(cell);

    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Adidas' } });
    clock.tick(500);
    fireEvent.keyDown(input, { key: 'Enter' });

    await new Promise((resolve) => nativeSetTimeout(resolve)); // Wait for promise

    expect(preProcessEditCellProps.callCount).to.equal(1);
    expect(preProcessEditCellProps.lastCall.args[0].props).to.deep.equal({
      value: 'ADIDAS',
      isValidating: true,
    });
  });
});
