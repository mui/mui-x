import Button from '@material-ui/core/Button';
import {
  GRID_CELL_KEYDOWN,
  GridApiRef,
  GridCellParams,
  GridComponentProps,
  useGridApiRef,
  XGrid,
} from '@material-ui/x-grid';
import { expect } from 'chai';
import * as React from 'react';
import { getActiveCell, getCell } from 'test/utils/helperFn';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
} from 'test/utils';

describe('<XGrid /> - Edit Rows', () => {
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
    expect(cellNike).to.not.have.class('MuiDataGrid-cellEditable');
    const cellAdidas = getCell(1, 0);
    expect(cellAdidas).to.have.class('MuiDataGrid-cellEditable');

    apiRef!.current.setCellMode(0, 'brand', 'edit');
    expect(cellNike).to.have.class('MuiDataGrid-cellEditing');
  });

  it('should allow to switch between cell mode', () => {
    render(<TestCase />);
    apiRef!.current.setCellMode(1, 'brand', 'edit');
    const cell = getCell(1, 0);

    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.have.class('MuiDataGrid-cellEditing');
    expect(cell.querySelector('input')!.value).to.equal('Adidas');

    apiRef!.current.setCellMode(1, 'brand', 'view');
    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.not.have.class('MuiDataGrid-cellEditing');
    expect(cell.querySelector('input')).to.equal(null);
  });

  it('should allow to switch between cell mode using double click', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);

    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.have.class('MuiDataGrid-cellEditing');
    expect(cell.querySelector('input')!.value).to.equal('Adidas');
  });

  it('should allow to stop double click using stopPropagation', () => {
    render(<TestCase onCellDoubleClick={(params, event) => event.stopPropagation()} />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);

    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.not.have.class('MuiDataGrid-cellEditing');
    expect(cell.querySelector('input')).to.equal(null);
  });

  it('should allow to switch between cell mode using enter key', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.keyDown(cell, { key: 'Enter' });

    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.have.class('MuiDataGrid-cellEditing');
    expect(cell.querySelector('input')!.value).to.equal('Adidas');
  });

  it('should allow to delete a cell directly if editable using delete key', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();

    expect(cell.textContent).to.equal('Adidas');
    fireEvent.keyDown(cell, { key: 'Delete' });
    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.not.have.class('MuiDataGrid-cellEditing');
    expect(cell.textContent).to.equal('');
  });

  // Due to an issue with the keyDown event in test library, this test uses the apiRef to publish an event
  // https://github.com/testing-library/dom-testing-library/issues/405
  it('should allow to edit a cell value by typing an alpha char', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    expect(cell.textContent).to.equal('Adidas');
    const params = apiRef.current.getCellParams(1, 'brand');
    apiRef.current.publishEvent(GRID_CELL_KEYDOWN, params, {
      key: 'a',
      code: 1,
      target: cell,
      isPropagationStopped: () => false,
    });
    // fireEvent.keyDown(cell, { key: 'a', code: 1, target: cell });

    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.have.class('MuiDataGrid-cellEditing');
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
    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.not.have.class('MuiDataGrid-cellEditing');
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
    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.not.have.class('MuiDataGrid-cellEditing');
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
    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.not.have.class('MuiDataGrid-cellEditing');
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
    expect(cell).to.have.class('MuiDataGrid-cellEditable');
    expect(cell).to.not.have.class('MuiDataGrid-cellEditing');
    expect(cell.textContent).to.equal('1970');
    expect(getActiveCell()).to.equal('1-0');
  });

  it('should focus on cells input on click when multiple cells are in edit mode', () => {
    function TestComponent() {
      apiRef = useGridApiRef();
      const [buttonLabel, setButtonLabel] = React.useState('Edit');

      const [selectedCellParams, setSelectedCellParams] = React.useState<GridCellParams | null>(
        null,
      );

      const handleButtonClick = React.useCallback(() => {
        console.log('handleButtonClick');
        if (!selectedCellParams) {
          return;
        }
        const { id, field, cellMode } = selectedCellParams;
        if (cellMode === 'edit') {
          const editedCellProps = apiRef.current.getEditCellPropsParams(id, field);
          apiRef.current.commitCellChange(editedCellProps);
          apiRef.current.setCellMode(id, field, 'view');
          setButtonLabel('Edit');
        } else {
          console.log('Changing cell mode to ', id, field);
          apiRef.current.setCellMode(id, field, 'edit');
          setButtonLabel('Save');
        }
        // Or you can use the editRowModel prop, but I find it easier
      }, [selectedCellParams]);

      const handleCellClick = React.useCallback((params: GridCellParams) => {
        console.log('handleCellClick');
        setSelectedCellParams(params);

        const { cellMode } = params;
        if (cellMode === 'edit') {
          setButtonLabel('Save');
        } else {
          console.log('setButtonLabel Edit', params.value);
          setButtonLabel('Edit');
        }
      }, []);

      const handleDoubleCellClick = React.useCallback(
        (params: GridCellParams, event: React.SyntheticEvent) => {
          event.stopPropagation();
        },
        [],
      );

      // Prevent from rolling back on escape
      const handleCellKeyDown = React.useCallback((params, event: React.KeyboardEvent) => {
        if (
          params.cellMode === 'edit' &&
          (event.key === 'Escape' || event.key === 'Delete' || event.key === 'Enter')
        ) {
          event.stopPropagation();
        }
      }, []);

      // Prevent from committing on blur
      const handleCellBlur = React.useCallback((params, event?: React.SyntheticEvent) => {
        if (params.cellMode === 'edit') {
          event?.stopPropagation();
        }
      }, []);

      return (
        <div style={{ height: 450, width: '100%' }}>
          <Button className="edit-button" onClick={handleButtonClick} color="primary">
            {buttonLabel}
          </Button>
          <div style={{ height: 400, width: '100%' }}>
            <XGrid
              {...baselineProps}
              apiRef={apiRef}
              onCellClick={handleCellClick}
              onCellDoubleClick={handleDoubleCellClick}
              onCellBlur={handleCellBlur}
              onCellKeyDown={handleCellKeyDown}
            />
          </div>
        </div>
      );
    }

    render(<TestComponent />);
    fireEvent.click(getCell(0, 0));

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    fireEvent.click(getCell(1, 0));
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    const inputs = document.querySelectorAll('input');
    expect(inputs.length).to.equal(2);
    const nikeInput = getCell(0, 0).querySelector('input');
    fireEvent.click(nikeInput);

    expect(getActiveCell()).to.equal('0-0');

    expect(document.activeElement).to.have.text('Nike');
    expect(document.activeElement).to.have.class('MuiInputBase-input');
  });
});
