import * as React from 'react';
import { GridApi, DataGridProProps, useGridApiRef, DataGridPro } from '@mui/x-data-grid-pro';
import Portal from '@mui/base/Portal';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, screen, waitFor } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { getActiveCell, getCell, getColumnHeaderCell } from 'test/utils/helperFn';
import { stub, spy } from 'sinon';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

function fireClickEvent(cell: HTMLElement) {
  fireEvent.mouseUp(cell);
  fireEvent.click(cell);
}

const nativeSetTimeout = setTimeout;

describe('<DataGridPro /> - Cell Editing', () => {
  let baselineProps: Pick<DataGridProProps, 'autoHeight' | 'rows' | 'columns' | 'throttleRowsMs'>;

  beforeEach(() => {
    baselineProps = {
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

  let apiRef: React.MutableRefObject<GridApi>;

  const TestCase = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          {...baselineProps}
          apiRef={apiRef}
          experimentalFeatures={{ warnIfFocusStateIsNotSynced: true }}
          {...props}
        />
      </div>
    );
  };

  describe('isCellEditable', () => {
    it('should add the class MuiDataGrid-cell--editable to editable cells but not prevent a cell from switching mode', () => {
      render(<TestCase isCellEditable={(params) => params.value === 'Adidas'} />);
      const cellNike = getCell(0, 0);
      expect(cellNike).not.to.have.class('MuiDataGrid-cell--editable');
      const cellAdidas = getCell(1, 0);
      expect(cellAdidas).to.have.class('MuiDataGrid-cell--editable');

      apiRef.current.setCellMode(0, 'brand', 'edit');
      expect(cellNike).to.have.class('MuiDataGrid-cell--editing');
    });

    it('should not allow to edit a cell with double-click', () => {
      render(<TestCase isCellEditable={(params) => params.value === 'Adidas'} />);
      const cellNike = getCell(0, 0);
      const cellAdidas = getCell(1, 0);
      fireEvent.doubleClick(cellNike);
      expect(cellNike).not.to.have.class('MuiDataGrid-cell--editing');
      fireEvent.doubleClick(cellAdidas);
      expect(cellAdidas).to.have.class('MuiDataGrid-cell--editing');
    });

    it('should not allow to edit a cell with Enter', () => {
      render(<TestCase isCellEditable={(params) => params.value === 'Adidas'} />);
      const cellNike = getCell(0, 0);
      const cellAdidas = getCell(1, 0);
      fireClickEvent(cellNike);
      fireEvent.keyDown(cellNike, { key: 'Enter' });
      expect(cellNike).not.to.have.class('MuiDataGrid-cell--editing');
      fireClickEvent(cellAdidas);
      fireEvent.keyDown(cellAdidas, { key: 'Enter' });
      expect(cellAdidas).to.have.class('MuiDataGrid-cell--editing');
    });
  });

  describe('validation', () => {
    it('should not allow to save an invalid value with Enter', async () => {
      render(<TestCase />);
      const cell = getCell(1, 0);
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input).not.to.have.attribute('aria-invalid');
      fireEvent.change(input, { target: { value: 'n' } });
      clock.runToLast();
      apiRef.current.setEditRowsModel({ 1: { brand: { error: true, value: 'n' } } });
      fireEvent.keyDown(input, { key: 'Enter' });
      await waitFor(() => {
        expect(input).to.have.attribute('aria-invalid', 'true');
        expect(cell).to.have.class('MuiDataGrid-cell--editing');
      });
    });

    it('should not allow to save an invalid value with commitCellChange', () => {
      render(<TestCase />);
      const cell = getCell(1, 0);
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input).not.to.have.attribute('aria-invalid');
      fireEvent.change(input, { target: { value: 'n' } });
      clock.runToLast();
      apiRef.current.setEditRowsModel({ 1: { brand: { error: true, value: 'n' } } });
      apiRef.current.commitCellChange({ id: 1, field: 'brand' });
      apiRef.current.setCellMode(1, 'brand', 'view');
      expect(cell).to.have.text('Adidas');
    });

    it('should not call onCellEditCommit for invalid values', () => {
      const onCellEditCommit = spy();
      render(<TestCase onCellEditCommit={onCellEditCommit} />);
      const cell = getCell(1, 0);
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input).not.to.have.attribute('aria-invalid');
      fireEvent.change(input, { target: { value: 'n' } });
      clock.runToLast();
      apiRef.current.setEditRowsModel({ 1: { brand: { error: true, value: 'n' } } });
      apiRef.current.commitCellChange({ id: 1, field: 'brand' });
      apiRef.current.setCellMode(1, 'brand', 'view');
      expect(onCellEditCommit.callCount).to.equal(0);
    });
  });

  describe('control Editing', () => {
    it('should update the state when neither the model nor the onChange are set', async () => {
      render(<TestCase />);
      const cell = getCell(1, 1);
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('1961');
      fireEvent.change(input, { target: { value: '1970' } });
      clock.tick(500);
      expect(input.value).to.equal('1970');
      fireEvent.keyDown(input, { key: 'Enter' });
      await waitFor(() => {
        expect(cell).to.have.text('1970');
      });
    });

    it('should not update the state when the editRowsModel prop is set', async () => {
      render(<TestCase editRowsModel={{ 1: { year: { value: 1961 } } }} />);
      const cell = getCell(1, 1);
      const input = cell.querySelector('input')!;
      fireClickEvent(input);
      expect(input.value).to.equal('1961');
      fireEvent.change(input, { target: { value: '1970' } });
      clock.tick(500);
      fireEvent.keyDown(input, { key: 'Enter' });
      await waitFor(() => {
        expect(cell.querySelector('input')).not.to.equal(null);
      });
    });

    it('should update the state when the model is not set, but the onChange is set', async () => {
      const onEditRowsModelChange = spy();
      render(<TestCase onEditRowsModelChange={onEditRowsModelChange} />);
      const cell = getCell(1, 1);
      fireEvent.doubleClick(cell);
      expect(onEditRowsModelChange.callCount).to.equal(1);
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({
        1: { year: { value: 1961 } },
      });
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: 1970 } });
      clock.tick(500);
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({
        1: { year: { value: '1970' } },
      });
      fireEvent.keyDown(input, { key: 'Enter' });
      await waitFor(() => {
        expect(cell).to.have.text('1970');
      });
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({});
      expect(onEditRowsModelChange.callCount).to.equal(3);
      expect(cell.querySelector('input')).to.equal(null);
    });

    it('should control the state when the model and the onChange are set', async () => {
      const onEditRowsModelChange = spy();
      const { setProps } = render(
        <TestCase
          editRowsModel={{ 1: { year: { value: 1961 } } }}
          onEditRowsModelChange={onEditRowsModelChange}
        />,
      );
      const cell = getCell(1, 1);
      const input = cell.querySelector('input')!;
      fireClickEvent(input);
      fireEvent.change(input, { target: { value: 1970 } });
      clock.tick(500);
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({
        1: { year: { value: '1970' } },
      });
      setProps({ editRowsModel: { 1: { year: { value: 1971 } } } });
      fireEvent.keyDown(input, { key: 'Enter' });
      await waitFor(() => {
        expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({});
      });
      setProps({ editRowsModel: {} });
      expect(cell).to.have.text('1971');
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    });
  });

  it('should allow to switch between cell mode', () => {
    render(<TestCase />);
    apiRef.current.setCellMode(1, 'brand', 'edit');
    const cell = getCell(1, 0);

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')!.value).to.equal('Adidas');

    apiRef.current.setCellMode(1, 'brand', 'view');
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')).to.equal(null);
  });

  it('should allow to switch between cell mode using double click', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')!.value).to.equal('Adidas');
  });

  it('should allow to stop double click using stopPropagation', () => {
    render(
      <TestCase
        onCellDoubleClick={(params, event) => (event as React.SyntheticEvent).stopPropagation()}
      />,
    );
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')).to.equal(null);
  });

  it('should be able to prevent the exit transition', async () => {
    render(
      <TestCase
        onCellFocusOut={(params, event) => {
          (event as any).defaultMuiPrevented = true;
        }}
      />,
    );
    const cell = getCell(1, 1);
    fireEvent.doubleClick(cell);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');

    const otherCell = getCell(2, 1);
    fireClickEvent(otherCell);
    await waitFor(() => {
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
    });
  });

  it('should allow to switch between cell mode using enter key', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    fireClickEvent(cell);
    fireEvent.keyDown(cell, { key: 'Enter' });

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')!.value).to.equal('Adidas');
  });

  it('should allow to delete a cell directly if editable using delete key', async () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    fireClickEvent(cell);

    expect(cell).to.have.text('Adidas');
    fireEvent.keyDown(cell, { key: 'Delete' });
    await waitFor(() => {
      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('');
    });
  });

  it('should not allow to delete a cell directly if it is not editable', async () => {
    render(<TestCase isCellEditable={() => false} />);
    const cell = getCell(1, 0);
    fireClickEvent(cell);

    expect(cell).to.have.text('Adidas');
    fireEvent.keyDown(cell, { key: 'Delete' });
    await waitFor(() => {
      expect(cell).not.to.have.class('MuiDataGrid-cell--editable');
      expect(cell).to.have.text('Adidas');
    });
  });

  // Due to an issue with the keyDown event in test library, this test uses the apiRef to publish an event
  // https://github.com/testing-library/dom-testing-library/issues/405
  it('should allow to edit a cell value by typing an alpha char', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    fireClickEvent(cell);
    expect(cell).to.have.text('Adidas');
    const params = apiRef.current.getCellParams(1, 'brand');
    apiRef.current.publishEvent('cellKeyDown', params, {
      key: 'a',
      code: 1,
      target: cell,
      currentTarget: cell,
      isPropagationStopped: () => false,
    } as any);
    // fireEvent.keyDown(cell, { key: 'a', code: 1, target: cell });

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    // we can't check input as we did not fire the real keyDown event
    // expect(cell.querySelector('input')!.value).to.equal('a');
  });

  it('should allow to rollback from edit changes using Escape', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');

    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('Adidas');
  });

  it('should allow to save changes using Enter', async () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');
    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');
    clock.tick(500);

    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('n');
      expect(getActiveCell()).to.equal('2-0');
    });
  });

  it('should allow to save an edit changes using Tab', async () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');

    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');
    clock.tick(500);

    fireEvent.keyDown(input, { key: 'Tab' });
    await waitFor(() => {
      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('n');
      expect(getActiveCell()).to.equal('1-1');
    });
  });

  it('should allow to save an edit changes using shift+Tab', async () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    clock.tick(500);
    expect(cell.querySelector('input')!.value).to.equal('1970');

    fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });
    await waitFor(() => {
      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('1970');
      expect(getActiveCell()).to.equal('1-0');
    });
  });

  it('should allow to save changes by clicking outside', async () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    fireClickEvent(cell);
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    clock.tick(500);
    expect(cell.querySelector('input')!.value).to.equal('1970');

    const otherCell = getCell(2, 1);
    fireClickEvent(otherCell);
    await waitFor(() => {
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('1970');
      expect(getActiveCell()).to.equal('2-1');
    });
  });

  it('should save changes when a column header is dragged', async () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    fireClickEvent(cell);
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    clock.tick(500);
    expect(cell.querySelector('input')!.value).to.equal('1970');

    const columnHeader = getColumnHeaderCell(0);
    fireEvent.dragStart(columnHeader.firstChild);
    await waitFor(() => {
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('1970');
    });
  });

  it('should save changes when a column header is focused', async () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    fireClickEvent(cell);
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    clock.tick(500);
    expect(cell.querySelector('input')!.value).to.equal('1970');

    fireEvent.focus(getColumnHeaderCell(1));
    await waitFor(() => {
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('1970');
    });
  });

  it('should work correctly when the cell editing was initiated programmatically', async () => {
    render(<TestCase />);
    apiRef.current.setCellMode(1, 'year', 'edit');
    const cell = getCell(1, 1);
    fireClickEvent(cell);
    expect(getActiveCell()).to.equal('1-1');
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    clock.tick(500);
    expect(cell.querySelector('input')!.value).to.equal('1970');

    const otherCell = getCell(2, 1);
    fireClickEvent(otherCell);

    await waitFor(() => {
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('1970');
      expect(getActiveCell()).to.equal('2-1');
    });
  });

  it('should move the focus to the new field', async () => {
    render(<TestCase />);
    // Turn first cell into edit mode
    apiRef.current.setCellMode(0, 'brand', 'edit');

    // Turn second cell into edit mode
    fireClickEvent(getCell(1, 0));
    apiRef.current.setCellMode(1, 'brand', 'edit');
    expect(document.querySelectorAll('input').length).to.equal(2);

    // Try to focus the first cell's input
    const input0 = getCell(0, 0).querySelector('input');
    fireClickEvent(input0!);
    await waitFor(() => {
      expect(document.activeElement).to.have.property('value', 'Nike');
    });
  });

  it('should apply the valueParser before saving the value', async () => {
    const valueParser = stub().withArgs('62').returns(1962);
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          {...baselineProps}
          columns={[
            { field: 'brand', editable: true },
            { field: 'year', editable: true, valueParser },
          ]}
        />
      </div>,
    );
    const cell = getCell(1, 1);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '62' } });
    clock.tick(500);
    expect(cell.querySelector('input')!.value).to.equal('1962');

    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    });
    expect(cell).to.have.text('1962');
    expect(valueParser.callCount).to.equal(1);
    expect(valueParser.args[0][0]).to.equal('62');
    expect(valueParser.args[0][1]).to.deep.include({
      id: 1,
      field: 'year',
      value: 1961,
      row: {
        id: 1,
        brand: 'Adidas',
        year: 1961,
      },
    });
  });

  it('should stay in the edit mode when clicking in an element inside a portal', () => {
    render(
      <TestCase
        columns={[
          {
            field: 'brand',
            editable: true,
            renderEditCell: () => (
              <Portal>
                <button>Click me</button>
              </Portal>
            ),
          },
        ]}
      />,
    );
    const cell = getCell(0, 0);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    fireEvent.doubleClick(cell);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    fireClickEvent(screen.getByRole('button', { name: /Click me/i }));
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
  });

  it('should not call .preventDefault on key events inside a cell in edit mode', () => {
    render(
      <TestCase
        columns={[
          {
            field: 'brand',
            editable: true,
            renderEditCell: () => <input type="text" data-testid="custom-input" />,
          },
        ]}
      />,
    );

    const cell = getCell(0, 0);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    fireEvent.doubleClick(cell);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');

    const input = screen.getByTestId('custom-input');
    fireEvent.click(input);
    input.focus();

    expect(fireEvent.keyDown(input, { key: 'a' })).to.equal(true);
    expect(fireEvent.keyDown(input, { key: ' ' })).to.equal(true);
    expect(fireEvent.keyDown(input, { key: 'ArrowLeft' })).to.equal(true);
  });

  it('should stay in the edit mode when the element inside the cell triggers click but no mouseup', () => {
    render(
      <TestCase
        columns={[
          {
            field: 'brand',
            editable: true,
            renderEditCell: () => <input type="checkbox" />,
          },
        ]}
      />,
    );
    const cell = getCell(0, 0);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    fireEvent.doubleClick(cell);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
  });

  it('should support getRowId', async () => {
    render(
      <TestCase
        getRowId={(row) => row.code}
        rows={baselineProps.rows.map((row) => ({ code: row.id, brand: row.brand }))}
      />,
    );
    expect(screen.queryAllByRole('row')).to.have.length(4);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');
    fireEvent.change(input, { target: { value: 'n' } });
    clock.tick(500);
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('n');
      expect(screen.queryAllByRole('row')).to.have.length(4);
    });
  });

  it('should call onEditCellPropsChange when the value in the edit cell is changed', () => {
    const onEditCellPropsChange = spy();
    render(<TestCase onEditCellPropsChange={onEditCellPropsChange} />);
    const cell = getCell(1, 1);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: '1970' } });
    clock.tick(500);
    expect(onEditCellPropsChange.args[0][0]).to.deep.equal({
      id: 1,
      field: 'year',
      props: { value: '1970' },
    });
  });

  it('should set the focus correctly', () => {
    render(<TestCase />);
    const cell = getCell(0, 0);
    fireEvent.doubleClick(cell);
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('should call onCellEditCommit with the correct params', async () => {
    const onCellEditCommit = spy();
    render(<TestCase onCellEditCommit={onCellEditCommit} />);
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'n' } });
    clock.tick(500);
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(onCellEditCommit.callCount).to.equal(1);
      expect(onCellEditCommit.lastCall.args[0]).to.deep.equal({
        id: 1,
        field: 'brand',
        value: 'n',
      });
    });
  });

  it('should call valueSetter before committing the value', async () => {
    render(
      <TestCase
        columns={[
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
        rows={[{ id: 0, firstName: 'John', lastName: 'Doe' }]}
      />,
    );
    const cell = getCell(0, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Peter Smith' } });
    clock.tick(500);
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(apiRef.current.getRowModels().get(0)).to.deep.equal({
        id: 0,
        firstName: 'Peter',
        lastName: 'Smith',
      });
    });
  });

  it('should call preProcessEditCellProps with the correct params', async () => {
    const preProcessEditCellProps = spy(({ props }) => props);
    render(
      <TestCase
        columns={[
          {
            field: 'brand',
            editable: true,
            preProcessEditCellProps,
          },
        ]}
      />,
    );
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'n' } });
    clock.tick(500);
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(preProcessEditCellProps.lastCall.args[0]).to.deep.equal({
        id: baselineProps.rows[1].id,
        row: baselineProps.rows[1],
        props: { value: 'n' },
      });
    });
  });

  it('should not save the cell when an object with error is returned', async () => {
    render(
      <TestCase
        columns={[
          {
            field: 'brand',
            editable: true,
            preProcessEditCellProps: ({ props }) => ({ ...props, error: true }),
          },
        ]}
      />,
    );
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input).not.to.have.attribute('aria-invalid');
    fireEvent.change(input, { target: { value: 'n' } });
    clock.tick(500);
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(input).to.have.attribute('aria-invalid', 'true');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
    });
  });

  it('should not save the cell when a promise with error is returned', async () => {
    render(
      <TestCase
        columns={[
          {
            field: 'brand',
            editable: true,
            preProcessEditCellProps: ({ props }) => Promise.resolve({ ...props, error: true }),
          },
        ]}
      />,
    );
    const cell = getCell(1, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input).not.to.have.attribute('aria-invalid');
    fireEvent.change(input, { target: { value: 'n' } });
    clock.tick(500);
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(input).to.have.attribute('aria-invalid', 'true');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
    });
  });

  // Confirms the bug in https://github.com/mui/mui-x/issues/3304
  // TODO v6: remove
  it('should call preProcessEditCellProps twice and with the wrong value in the 2nd time if preventCommitWhileValidating=false', async () => {
    const preProcessEditCellProps = spy(({ props }) => Promise.resolve(props));
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          columns={[
            {
              field: 'brand',
              editable: true,
              preProcessEditCellProps,
            },
          ]}
          rows={[{ id: 0, brand: 'Nike' }]}
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

    expect(preProcessEditCellProps.callCount).to.equal(2);
    expect(preProcessEditCellProps.args[0][0].props).to.deep.equal({ value: 'Adidas' });
    expect(preProcessEditCellProps.args[1][0].props).to.deep.equal({ value: 'Nike' });
  });

  it('should call preProcessEditCellProps once if it resolves with an error and preventCommitWhileValidating=true', async () => {
    const preProcessEditCellProps = spy(({ props }) => Promise.resolve({ ...props, error: true }));
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          columns={[
            {
              field: 'brand',
              editable: true,
              preProcessEditCellProps,
            },
          ]}
          rows={[{ id: 0, brand: 'Nike' }]}
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
      value: 'Adidas',
      isValidating: true,
    });
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
  });

  it('should call preProcessEditCellProps with the value parsed if preventCommitWhileValidating=true', async () => {
    const preProcessEditCellProps = spy(({ props }) => Promise.resolve({ ...props }));
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
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

    await new Promise((resolve) => nativeSetTimeout(resolve)); // Wait for promise

    expect(preProcessEditCellProps.callCount).to.equal(1);
    expect(preProcessEditCellProps.lastCall.args[0].props).to.deep.equal({
      value: 'ADIDAS',
      isValidating: true,
    });
  });

  it('should not go back to edit mode when clicking outside a cell while debouncing', async () => {
    render(<TestCase />);
    const cell = getCell(0, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Adidas' } });
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    fireClickEvent(getCell(1, 0));
    await new Promise((resolve) => nativeSetTimeout(resolve)); // Wait for promise
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    clock.runToLast();
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
  });

  it('should skip debounce when commiting', async () => {
    const onCellEditCommit = spy();
    render(<TestCase onCellEditCommit={onCellEditCommit} />);
    const cell = getCell(0, 0);
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Adidas' } });
    fireClickEvent(getCell(1, 0));
    await new Promise((resolve) => nativeSetTimeout(resolve)); // Wait for promise
    // We don't need to wait for debounce when commiting
    expect(onCellEditCommit.lastCall.args[0].value).to.equal('Adidas');
  });
});
