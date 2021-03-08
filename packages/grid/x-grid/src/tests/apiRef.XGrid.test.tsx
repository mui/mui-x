import {
  GridApiRef,
  GridComponentProps,
  GridRowData,
  useGridApiRef,
  XGrid,
} from '@material-ui/x-grid';
import { expect } from 'chai';
import * as React from 'react';
import { useFakeTimers } from 'sinon';
import { getCell, getColumnValues } from 'test/utils/helperFn';
import { createClientRenderStrictMode } from 'test/utils';

describe('<XGrid /> - apiRef', () => {
  let clock;

  afterEach(() => {
    clock.restore();
  });

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });
  let baselineProps;

  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();
  beforeEach(() => {
    clock = useFakeTimers();

    baselineProps = {
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
      columns: [{ field: 'brand', headerName: 'Brand' }],
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

  it('should allow to reset rows with setRows and render after 100ms', () => {
    render(<TestCase />);
    const newRows = [
      {
        id: 3,
        brand: 'Asics',
      },
    ];
    apiRef.current.setRows(newRows);

    clock.tick(50);
    expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    clock.tick(50);
    expect(getColumnValues()).to.deep.equal(['Asics']);
  });

  it('should allow to update row data', () => {
    render(<TestCase />);
    apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Pata' }]);
    apiRef.current.updateRows([{ id: 2, brand: 'Pum' }]);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Pata', 'Fila', 'Pum']);
  });

  it('update row data can also add rows', () => {
    render(<TestCase />);
    apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Pata' }]);
    apiRef.current.updateRows([{ id: 2, brand: 'Pum' }]);
    apiRef.current.updateRows([{ id: 3, brand: 'Jordan' }]);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
  });

  it('update row data can also add rows in bulk', () => {
    render(<TestCase />);
    apiRef.current.updateRows([
      { id: 1, brand: 'Fila' },
      { id: 0, brand: 'Pata' },
      { id: 2, brand: 'Pum' },
      { id: 3, brand: 'Jordan' },
    ]);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
  });

  it('update row data can also delete rows', () => {
    render(<TestCase />);
    apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Apple' }]);
    apiRef.current.updateRows([{ id: 2, _action: 'delete' }]);
    apiRef.current.updateRows([{ id: 5, brand: 'Atari' }]);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Apple', 'Atari']);
  });

  it('update row data can also delete rows in bulk', () => {
    render(<TestCase />);
    apiRef.current.updateRows([
      { id: 1, _action: 'delete' },
      { id: 0, brand: 'Apple' },
      { id: 2, _action: 'delete' },
      { id: 5, brand: 'Atari' },
    ]);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Apple', 'Atari']);
  });

  it('update row data should process getRowId', () => {
    const TestCaseGetRowId = () => {
      apiRef = useGridApiRef();
      const getRowId = React.useCallback((row: GridRowData) => row.idField, []);
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            apiRef={apiRef}
            columns={baselineProps.columns}
            rows={baselineProps.rows.map((row) => ({ idField: row.id, brand: row.brand }))}
            getRowId={getRowId}
          />
        </div>
      );
    };

    render(<TestCaseGetRowId />);
    expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    apiRef.current.updateRows([
      { idField: 1, _action: 'delete' },
      { idField: 0, brand: 'Apple' },
      { idField: 2, _action: 'delete' },
      { idField: 5, brand: 'Atari' },
    ]);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Apple', 'Atari']);
  });

  it('getDataAsCsv should return the correct string representation of the grid data', () => {
    const TestCaseCSVExport = () => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            apiRef={apiRef}
            columns={[{ field: 'brand', headerName: 'Brand' }]}
            rows={[
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
            ]}
          />
        </div>
      );
    };

    render(<TestCaseCSVExport />);
    expect(apiRef.current.getDataAsCsv()).to.equal('Brand\r\nNike\r\nAdidas\r\nPuma');
    apiRef.current.updateRows([
      {
        id: 1,
        brand: 'Adidas,Reebok',
      },
    ]);
    expect(apiRef.current.getDataAsCsv()).to.equal('Brand\r\nNike\r\n"Adidas,Reebok"\r\nPuma');
  });

  it('getDataAsCsv should return the correct string representation of the grid data if cell contains comma', () => {
    const TestCaseCSVExport = () => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            apiRef={apiRef}
            columns={[{ field: 'brand', headerName: 'Brand' }]}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
              {
                id: 1,
                brand: 'Adidas,Puma',
              },
            ]}
          />
        </div>
      );
    };

    render(<TestCaseCSVExport />);
    expect(apiRef.current.getDataAsCsv()).to.equal('Brand\r\nNike\r\n"Adidas,Puma"');
  });

  it('getDataAsCsv should return the correct string representation of the grid data if cell contains comma and double quotes', () => {
    const TestCaseCSVExport = () => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            apiRef={apiRef}
            columns={[{ field: 'brand', headerName: 'Brand' }]}
            rows={[
              {
                id: 0,
                brand: 'Nike,"Adidas",Puma',
              },
            ]}
          />
        </div>
      );
    };

    render(<TestCaseCSVExport />);
    expect(apiRef.current.getDataAsCsv()).to.equal('Brand\r\n"Nike,""Adidas"",Puma"');
  });

  it('should allow to switch between cell mode', () => {
    baselineProps.columns = baselineProps.columns.map((col) => ({ ...col, editable: true }));

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

  it('isCellEditable should add the class MuiDataGrid-cellEditable to editable cells but not prevent a cell from switching mode', () => {
    baselineProps.columns = baselineProps.columns.map((col) => ({ ...col, editable: true }));

    render(<TestCase isCellEditable={(params) => params.value === 'Adidas'} />);
    const cellNike = getCell(0, 0);
    expect(cellNike!.classList.contains('MuiDataGrid-cellEditable')).to.equal(false);
    const cellAdidas = getCell(1, 0);
    expect(cellAdidas!.classList.contains('MuiDataGrid-cellEditable')).to.equal(true);

    apiRef!.current.setCellMode(0, 'brand', 'edit');
    expect(cellNike.classList.contains('MuiDataGrid-cellEditing')).to.equal(true);
  });
});
