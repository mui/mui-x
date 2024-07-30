import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { DataGrid, DataGridProps, GridRowsProp, GridColDef, gridClasses } from '@mui/x-data-grid';
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

  it('should not persist valueFormatter on column type change', () => {
    const { setProps } = render(
      <TestDataGrid
        columns={[{ field: 'price', type: 'number', valueFormatter: (value) => `$${value}` }]}
        rows={[{ id: 0, price: 1 }]}
      />,
    );
    expect(getCell(0, 0).textContent).to.equal('$1');

    setProps({ columns: [{ field: 'price' }] });
    expect(getCell(0, 0).textContent).to.equal('1');
  });

  it('should not override column properties when changing column type', () => {
    const { setProps } = render(
      <TestDataGrid
        columns={[
          {
            field: 'id',
            type: 'string',
            width: 200,
            valueFormatter: (value) => {
              return `formatted: ${value}`;
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
          valueFormatter: (value) => {
            return `formatted: ${value}`;
          },
        },
        { field: 'idBis' },
      ],
    } as Partial<DataGridProps>);
    expect(getColumnHeaderCell(0)).to.have.class('MuiDataGrid-columnHeader--numeric');
    // should not override valueFormatter with the default numeric one
    expect(getCell(0, 0).textContent).to.equal('formatted: 1');
  });

  // https://github.com/mui/mui-x/issues/13719
  it('should not crash when updating columns immediately after scrolling', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }

    const data = [
      { id: 1, value: 'A' },
      { id: 2, value: 'B' },
      { id: 3, value: 'C' },
      { id: 4, value: 'D' },
      { id: 5, value: 'E' },
      { id: 6, value: 'E' },
      { id: 7, value: 'F' },
      { id: 8, value: 'G' },
      { id: 9, value: 'H' },
    ];

    function DynamicVirtualizationRange() {
      const [cols, setCols] = React.useState<GridColDef[]>([{ field: 'id' }, { field: 'value' }]);

      return (
        <div style={{ width: '100%' }}>
          <button onClick={() => setCols([{ field: 'id' }])}>Update columns</button>
          <div style={{ height: 400 }}>
            <DataGrid rows={data} columns={cols} />
          </div>
        </div>
      );
    }

    render(<DynamicVirtualizationRange />);

    const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
    virtualScroller.scrollTop = 1_000;
    virtualScroller.dispatchEvent(new Event('scroll'));

    fireEvent.click(screen.getByText('Update columns'));
  });
});
