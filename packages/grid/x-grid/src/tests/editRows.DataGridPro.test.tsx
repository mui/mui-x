import {
  GridEvents,
  GridApiRef,
  GridComponentProps,
  useGridApiRef,
  DataGridPro,
  GridEditSingleSelectCell,
} from '@mui/x-data-grid-pro';
import Portal from '@mui/core/Portal';
import { expect } from 'chai';
import * as React from 'react';
import { getActiveCell, getCell, getRow, getColumnHeaderCell } from 'test/utils/helperFn';
import { stub, spy, useFakeTimers } from 'sinon';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
} from 'test/utils';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Edit Rows', () => {
  let clock;
  let baselineProps;

  beforeEach(() => {
    clock = useFakeTimers();

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

  afterEach(() => {
    clock.restore();
  });

  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

  const TestCase = (props: Partial<GridComponentProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
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
      cellNike.focus();
      fireEvent.keyDown(cellNike, { key: 'Enter' });
      expect(cellNike).not.to.have.class('MuiDataGrid-cell--editing');
      cellAdidas.focus();
      fireEvent.keyDown(cellAdidas, { key: 'Enter' });
      expect(cellAdidas).to.have.class('MuiDataGrid-cell--editing');
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
    cell.focus();
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
    cell.focus();
    fireEvent.doubleClick(cell);

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')).to.equal(null);
  });

  it('should be able to prevent the exit transition', () => {
    render(
      <TestCase
        onCellFocusOut={(params, event) => {
          (event as any).defaultMuiPrevented = true;
        }}
      />,
    );
    const cell = getCell(1, 1);
    cell.focus();
    fireEvent.doubleClick(cell);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');

    const otherCell = getCell(2, 1);
    fireEvent.click(otherCell);
    fireEvent.focus(otherCell);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
  });

  it('should allow to switch between cell mode using enter key', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.keyDown(cell, { key: 'Enter' });

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')!.value).to.equal('Adidas');
  });

  it('should allow to delete a cell directly if editable using delete key', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();

    expect(cell).to.have.text('Adidas');
    fireEvent.keyDown(cell, { key: 'Delete' });
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('');
  });

  it('should not allow to delete a cell directly if it is not editable', () => {
    render(<TestCase isCellEditable={() => false} />);
    const cell = getCell(1, 0);
    cell.focus();

    expect(cell).to.have.text('Adidas');
    fireEvent.keyDown(cell, { key: 'Delete' });
    expect(cell).not.to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.text('Adidas');
  });

  // Due to an issue with the keyDown event in test library, this test uses the apiRef to publish an event
  // https://github.com/testing-library/dom-testing-library/issues/405
  it('should allow to edit a cell value by typing an alpha char', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    expect(cell).to.have.text('Adidas');
    const params = apiRef.current.getCellParams(1, 'brand');
    apiRef.current.publishEvent(GridEvents.cellKeyDown, params, {
      key: 'a',
      code: 1,
      target: cell,
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
    cell.focus();
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

  it('should allow to save changes using Enter', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');
    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('n');
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
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('n');
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
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1970');
    expect(getActiveCell()).to.equal('1-0');
  });

  it('should allow to save changes by clicking outside', () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    cell.focus();
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    expect(cell.querySelector('input')!.value).to.equal('1970');

    const otherCell = getCell(2, 1);
    fireEvent.mouseUp(otherCell);
    fireEvent.click(otherCell);
    fireEvent.focus(otherCell);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1970');
    expect(getActiveCell()).to.equal('2-1');
  });

  it('should save changes when a column header is dragged', () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    cell.focus();
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    expect(cell.querySelector('input')!.value).to.equal('1970');

    const columnHeader = getColumnHeaderCell(0);
    fireEvent.dragStart(columnHeader.firstChild);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1970');
  });

  it('should save changes when a column header is focused', () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    cell.focus();
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    expect(cell.querySelector('input')!.value).to.equal('1970');

    fireEvent.focus(getColumnHeaderCell(1));
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1970');
  });

  it('should work correctly when the cell editing was initiated programmatically', () => {
    render(<TestCase />);
    apiRef.current.setCellMode(1, 'year', 'edit');
    const cell = getCell(1, 1);
    cell.focus();
    expect(getActiveCell()).to.equal('1-1');
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    expect(cell.querySelector('input')!.value).to.equal('1970');

    const otherCell = getCell(2, 1);
    fireEvent.mouseUp(otherCell);
    fireEvent.click(otherCell);
    fireEvent.focus(otherCell);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1970');
    expect(getActiveCell()).to.equal('2-1');
  });

  // TODO add one test for each column type because what really sets the focus is the autoFocus prop
  it('should move the focus to the new field', () => {
    render(<TestCase />);
    // Turn first cell into edit mode
    apiRef.current.setCellMode(0, 'brand', 'edit');

    // Turn second cell into edit mode
    getCell(1, 0).focus();
    apiRef.current.setCellMode(1, 'brand', 'edit');
    expect(document.querySelectorAll('input').length).to.equal(2);

    // Try to focus the first cell's input
    const input0 = getCell(0, 0).querySelector('input');
    input0!.focus();
    fireEvent.click(input0);
    expect(document.activeElement).to.have.property('value', 'Nike');
  });

  it('should apply the valueParser before saving the value', () => {
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
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '62' } });
    expect(cell.querySelector('input')!.value).to.equal('1962');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
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
    fireEvent.mouseUp(screen.getByRole('button', { name: /Click me/i }));
    fireEvent.click(screen.getByRole('button', { name: /Click me/i }));
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
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

  it('should support getRowId', () => {
    render(
      <TestCase
        getRowId={(row) => row.code}
        rows={baselineProps.rows.map((row) => ({ code: row.id, brand: row.brand }))}
      />,
    );
    expect(screen.queryAllByRole('row')).to.have.length(4);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');
    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('n');
    expect(screen.queryAllByRole('row')).to.have.length(4);
  });

  it('should call onEditCellPropsChange when the value in the edit cell is changed', () => {
    const onEditCellPropsChange = spy();
    render(<TestCase onEditCellPropsChange={onEditCellPropsChange} />);
    const cell = getCell(1, 1);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: '1970' } });
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
    // @ts-expect-error need to migrate helpers to TypeScript
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  describe('column type: singleSelect', () => {
    it('should change cell value correctly when the valueOptions is array of strings', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'brand',
                type: 'singleSelect',
                valueOptions: ['Nike', 'Adidas'],
                editable: true,
              },
            ]}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
            ]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('Adidas');
    });

    it('should change cell value correctly when the valueOptions is array of objects', () => {
      const countries = [
        {
          value: 'fr',
          label: 'France',
        },
        {
          value: 'it',
          label: 'Italy',
        },
      ];

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'country',
                type: 'singleSelect',
                valueOptions: countries,
                valueFormatter: (params) => {
                  const result = countries.find((country) => country.value === params.value);
                  return result!.label;
                },
                editable: true,
              },
            ]}
            rows={[
              {
                id: 0,
                country: 'fr',
              },
            ]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('Italy');
    });

    it('should change cell value correctly when the valueOptions is a function returning an array of strings', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'brand',
                type: 'singleSelect',
                valueOptions: () => ['Nike', 'Adidas'],
                editable: true,
              },
            ]}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
            ]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('Adidas');
    });

    it('should change cell value correctly when the valueOptions is a function returning an array of objects', () => {
      const countries = [
        {
          value: 'fr',
          label: 'France',
        },
        {
          value: 'it',
          label: 'Italy',
        },
      ];

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'country',
                type: 'singleSelect',
                valueOptions: () => countries,
                valueFormatter: (params) => {
                  const result = countries.find((country) => country.value === params.value);
                  return result!.label;
                },
                editable: true,
              },
            ]}
            rows={[
              {
                id: 0,
                country: 'fr',
              },
            ]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('Italy');
    });

    it('should apply valueFormatter to select options when valueOptions is of primitive types', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'role',
                type: 'singleSelect',
                valueOptions: [0, 1],
                valueFormatter: ({ value }) => ['User', 'Admin'][value as number],
                editable: true,
                width: 200,
              },
            ]}
            rows={[
              {
                id: 0,
                role: 0,
              },
            ]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      const firstOption = screen.queryAllByRole('option')[0];
      const secondOption = screen.queryAllByRole('option')[1];

      expect(firstOption).to.have.text('User');
      expect(secondOption).to.have.text('Admin');
    });

    it('should set the focus correctly', () => {
      render(
        <TestCase
          columns={[
            {
              field: 'brand',
              type: 'singleSelect',
              valueOptions: ['Nike', 'Adidas'],
              editable: true,
              renderEditCell: (params: any) => (
                <GridEditSingleSelectCell {...params} open={false} /> // Force to appear closed
              ),
            },
          ]}
          rows={[
            {
              id: 0,
              brand: 'Nike',
            },
          ]}
        />,
      );
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getByRole('button', { name: 'Nike' })).toHaveFocus();
    });
  });

  it('should keep the right type', () => {
    // TODO create a separate group for the "number" column type tests
    const Test = (props: Partial<GridComponentProps>) => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            {...baselineProps}
            apiRef={apiRef}
            columns={[{ field: 'year', type: 'number', editable: true }]}
            {...props}
          />
        </div>
      );
    };
    render(<Test />);
    expect(screen.queryAllByRole('row')).to.have.length(4);
    const cell = getCell(0, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1941');
    fireEvent.change(input, { target: { value: '1942' } });

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(cell).to.have.text('1,942');
    expect(apiRef.current.getRow(baselineProps.rows[0].id)!.year).to.equal(1942);
  });

  describe('column type: date', () => {
    it('should call onEditCellPropsChange with the value entered as a Date', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5) }]}
          columns={[{ field: 'date', type: 'date', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '2022-05-07' } });
      expect(onEditCellPropsChange.args[0][0].props.value.toISOString()).to.equal(
        new Date(2022, 4, 7).toISOString(),
      );
    });

    it('should call onEditCellPropsChange with null when entered an empty value', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5) }]}
          columns={[{ field: 'date', type: 'date', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '' } });
      expect(onEditCellPropsChange.args[0][0].props.value).to.equal(null);
    });

    it('should set the focus correctly', () => {
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5) }]}
          columns={[{ field: 'date', type: 'date', editable: true }]}
        />,
      );
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getByRole('cell').querySelector('input')).toHaveFocus();
    });
  });

  describe('column type: dateTime', () => {
    it('should call onEditCellPropsChange with the value entered as a Date', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5, 14, 30) }]}
          columns={[{ field: 'date', type: 'dateTime', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '2022-05-07T15:30:00' } });
      expect(onEditCellPropsChange.args[0][0].props.value.toISOString()).to.equal(
        new Date(2022, 4, 7, 15, 30).toISOString(),
      );
    });

    it('should call onEditCellPropsChange with null when entered an empty value', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5, 14, 30) }]}
          columns={[{ field: 'date', type: 'dateTime', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '' } });
      expect(onEditCellPropsChange.args[0][0].props.value).to.equal(null);
    });

    it('should set the focus correctly', () => {
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5, 14, 30) }]}
          columns={[{ field: 'date', type: 'dateTime', editable: true }]}
        />,
      );
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getByRole('cell').querySelector('input')).toHaveFocus();
    });
  });

  it('should call onCellEditCommit with the correct params', () => {
    const onCellEditCommit = spy();
    render(<TestCase onCellEditCommit={onCellEditCommit} />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'n' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onCellEditCommit.callCount).to.equal(1);
    expect(onCellEditCommit.lastCall.args[0]).to.deep.equal({ id: 1, field: 'brand', value: 'n' });
  });

  describe('column type: boolean', () => {
    it('should call onEditCellPropsChange with the correct params', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, isAdmin: false }]}
          columns={[{ field: 'isAdmin', type: 'boolean', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.click(input);
      expect(onEditCellPropsChange.args[0][0]).to.deep.equal({
        id: 0,
        field: 'isAdmin',
        props: { value: true },
      });
    });

    it('should set the focus correctly', () => {
      render(
        <TestCase
          rows={[{ id: 0, isAdmin: false }]}
          columns={[{ field: 'isAdmin', type: 'boolean', editable: true }]}
        />,
      );
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getByRole('checkbox')).toHaveFocus();
    });
  });

  describe('validation', () => {
    it('should not allow to save an invalid value with Enter', () => {
      render(<TestCase />);
      const cell = getCell(1, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input).not.to.have.attribute('aria-invalid');
      fireEvent.change(input, { target: { value: 'n' } });
      apiRef.current.setEditRowsModel({ 1: { brand: { error: true, value: 'n' } } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(input).to.have.attribute('aria-invalid', 'true');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
    });

    it('should not allow to save an invalid value with commitCellChange', () => {
      render(<TestCase />);
      const cell = getCell(1, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input).not.to.have.attribute('aria-invalid');
      fireEvent.change(input, { target: { value: 'n' } });
      apiRef.current.setEditRowsModel({ 1: { brand: { error: true, value: 'n' } } });
      apiRef.current.commitCellChange({ id: 1, field: 'brand' });
      apiRef.current.setCellMode(1, 'brand', 'view');
      expect(cell).to.have.text('Adidas');
    });

    it('should not call onCellEditCommit for invalid values', () => {
      const onCellEditCommit = spy();
      render(<TestCase onCellEditCommit={onCellEditCommit} />);
      const cell = getCell(1, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input).not.to.have.attribute('aria-invalid');
      fireEvent.change(input, { target: { value: 'n' } });
      apiRef.current.setEditRowsModel({ 1: { brand: { error: true, value: 'n' } } });
      apiRef.current.commitCellChange({ id: 1, field: 'brand' });
      apiRef.current.setCellMode(1, 'brand', 'view');
      expect(onCellEditCommit.callCount).to.equal(0);
    });
  });

  describe('control Editing', () => {
    it('should update the state when neither the model nor the onChange are set', () => {
      render(<TestCase />);
      const cell = getCell(1, 1);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('1961');
      fireEvent.change(input, { target: { value: '1970' } });
      expect(input.value).to.equal('1970');
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(cell).to.have.text('1970');
    });

    it('should not update the state when the editRowsModel prop is set', () => {
      render(<TestCase editRowsModel={{ 1: { year: { value: 1961 } } }} />);
      const cell = getCell(1, 1);
      const input = cell.querySelector('input')!;
      input.focus();
      expect(input.value).to.equal('1961');
      fireEvent.change(input, { target: { value: '1970' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(cell.querySelector('input')).not.to.equal(null);
    });

    it('should update the state when the model is not set, but the onChange is set', () => {
      const onEditRowsModelChange = spy();
      render(<TestCase onEditRowsModelChange={onEditRowsModelChange} />);
      const cell = getCell(1, 1);
      cell.focus();
      fireEvent.doubleClick(cell);
      expect(onEditRowsModelChange.callCount).to.equal(1);
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({
        1: { year: { value: 1961 } },
      });
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: 1970 } });
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({
        1: { year: { value: '1970' } },
      });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(cell).to.have.text('1970');
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({});
      expect(onEditRowsModelChange.callCount).to.equal(3);
      expect(cell.querySelector('input')).to.equal(null);
    });

    it('should control the state when the model and the onChange are set', () => {
      const onEditRowsModelChange = spy();
      const { setProps } = render(
        <TestCase
          editRowsModel={{ 1: { year: { value: 1961 } } }}
          onEditRowsModelChange={onEditRowsModelChange}
        />,
      );
      const cell = getCell(1, 1);
      const input = cell.querySelector('input')!;
      input.focus();
      fireEvent.change(input, { target: { value: 1970 } });
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({
        1: { year: { value: '1970' } },
      });
      setProps({ editRowsModel: { 1: { year: { value: 1971 } } } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({});
      setProps({ editRowsModel: {} });
      expect(cell).to.have.text('1971');
    });
  });

  describe('row editing', () => {
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
      cell.focus();
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
      expect(input!.value).to.equal('n');
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(cell).to.have.text('Adidas');
    });

    it('should allow to commit changes with Enter', () => {
      render(<TestCase editMode="row" />);
      const cell = getCell(1, 0);
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input');
      fireEvent.change(input, { target: { value: 'ADIDAS' } });
      expect(input!.value).to.equal('ADIDAS');
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(cell).to.have.text('ADIDAS');
    });

    it('should move the focus to the right cell after committing changes with Enter', () => {
      render(<TestCase editMode="row" />);
      const cell = getCell(1, 0);
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input');
      fireEvent.change(input, { target: { value: 'ADIDAS' } });
      expect(input!.value).to.equal('ADIDAS');
      fireEvent.keyDown(input, { key: 'Enter' });
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(getCell(2, 0)).toHaveFocus();
    });

    it('should allow to commit changes clicking outside the row', () => {
      render(<TestCase editMode="row" />);
      const cell = getCell(1, 0);
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input');
      fireEvent.change(input, { target: { value: 'ADIDAS' } });
      expect(input!.value).to.equal('ADIDAS');
      fireEvent.mouseUp(getCell(2, 0));
      fireEvent.click(getCell(2, 0));
      clock.tick(0);
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell).to.have.text('ADIDAS');
    });

    it('should move the focus to the input of the clicked cell', () => {
      render(<TestCase editMode="row" />);
      const cell = getCell(1, 0);
      fireEvent.doubleClick(cell);
      // @ts-expect-error need to migrate helpers to TypeScript
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
      firstCell.focus();
      fireEvent.doubleClick(firstCell);
      const input = firstCell.querySelector('input')!;
      fireEvent.change(input, { target: { value: 'Peter Smith' } });
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
  });

  it('should call valueSetter before committing the value', () => {
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
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Peter Smith' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(apiRef.current.getRowModels().get(0)).to.deep.equal({
      id: 0,
      firstName: 'Peter',
      lastName: 'Smith',
    });
  });
});
