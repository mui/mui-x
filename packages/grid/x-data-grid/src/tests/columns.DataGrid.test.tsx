import * as React from 'react';
import { expect } from 'chai';
import { createRenderer } from '@mui/monorepo/test/utils';
import { DataGrid, DataGridProps, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { getCell, getColumnHeaderCell, getColumnHeadersTextContent } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [{ id: 1, idBis: 1 }];

const columns: GridColDef[] = [{ field: 'id' }, { field: 'idBis' }];

describe('<DataGrid /> - Columns', () => {
  const { render } = createRenderer();

  function TestDataGrid(
    props: Omit<DataGridProps, 'columns' | 'rows'> &
      Partial<Pick<DataGridProps, 'rows' | 'columns'>>,
  ) {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid columns={columns} rows={rows} {...props} autoHeight={isJSDOM} />
      </div>
    );
  }

  describe('prop: initialState.columns.orderedFields / initialState.columns.dimensions', () => {
    it('should allow to initialize the columns order and dimensions', () => {
      render(
        <TestDataGrid
          initialState={{
            columns: { orderedFields: ['idBis', 'id'], dimensions: { idBis: { width: 150 } } },
          }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis', 'id']);
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '150px' });
    });

    it('should not add a column when present in the initial state but not in the props', () => {
      render(<TestDataGrid initialState={{ columns: { orderedFields: ['idTres'] } }} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });

    it('should move the columns not present in the initial state after the one present in it', () => {
      render(<TestDataGrid initialState={{ columns: { orderedFields: ['idBis'] } }} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis', 'id']);
    });

    it('should allow to remove the sizing properties by setting them to `undefined`', () => {
      render(
        <TestDataGrid
          columns={[{ field: 'id', flex: 1 }]}
          initialState={{ columns: { dimensions: { id: { flex: undefined } } } }}
        />,
      );

      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
    });
  });

  it('should allow to change the column type', () => {
    const { setProps } = render(
      <TestDataGrid columns={[{ field: 'id', type: 'string' }, { field: 'idBis' }]} />,
    );
    expect(getColumnHeaderCell(0)).not.to.have.class('MuiDataGrid-columnHeader--numeric');

    setProps({ columns: [{ field: 'id', type: 'number' }, { field: 'idBis' }] });
    expect(getColumnHeaderCell(0)).to.have.class('MuiDataGrid-columnHeader--numeric');
  });

  it('should not override column properties when changing column type', () => {
    const { setProps } = render(
      <TestDataGrid
        columns={[
          {
            field: 'id',
            type: 'string',
            width: 200,
            valueFormatter: (params) => {
              return `formatted: ${params.value}`;
            },
          },
          { field: 'idBis' },
        ]}
      />,
    );
    expect(getColumnHeaderCell(0)).not.to.have.class('MuiDataGrid-columnHeader--numeric');
    expect(getCell(0, 0).textContent).to.equal('formatted: 1');

    setProps({
      columns: [
        {
          field: 'id',
          type: 'number',
          width: 200,
          valueFormatter: (params) => {
            return `formatted: ${params.value}`;
          },
        },
        { field: 'idBis' },
      ],
    } as Partial<DataGridProps>);
    expect(getColumnHeaderCell(0)).to.have.class('MuiDataGrid-columnHeader--numeric');
    // should not override valueFormatter with the default numeric one
    expect(getCell(0, 0).textContent).to.equal('formatted: 1');
  });
});
