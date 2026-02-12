import * as React from 'react';
import { createRenderer, act } from '@mui/internal-test-utils';
import { getColumnValues } from 'test/utils/helperFn';
import { getBasicGridData } from '@mui/x-data-grid-generator';
import type { ColumnDef } from '../../..';
import { TestDataGrid, type TestGridApi } from '../../../test/TestDataGrid';

describe('<DataGrid /> - Rows', () => {
  const { render } = createRenderer();

  const rows = [
    { clientId: 'c1', first: 'Mike', age: 11 },
    { clientId: 'c2', first: 'Jack', age: 11 },
    { clientId: 'c3', first: 'Mike', age: 20 },
  ];

  type Row = (typeof rows)[number];

  const columns: ColumnDef<Row>[] = [
    { id: 'clientId', field: 'clientId' },
    { id: 'first', field: 'first' },
    { id: 'age', field: 'age' },
  ];

  describe('prop: getRowId', () => {
    it('should allow to select a field as id', () => {
      const getRowId = (row: Row) => `${row.clientId}`;
      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={rows} columns={columns} getRowId={getRowId} />
        </div>,
      );
      expect(getColumnValues(0)).to.deep.equal(['c1', 'c2', 'c3']);
    });
  });

  describe('prop: rows', () => {
    it('should support new dataset', () => {
      const { rows: testRows, columns: testColumns } = getBasicGridData(5, 2);

      type GeneratedRow = (typeof testRows)[number];

      // Convert GridColDef to ColumnDef format for headless DataGrid
      const headlessColumns: ColumnDef<GeneratedRow>[] = testColumns.map((col) => ({
        id: col.field,
        field: col.field as keyof GeneratedRow,
        header: col.headerName,
      }));

      function Test(props: { rows: GeneratedRow[] }) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <TestDataGrid rows={props.rows} columns={headlessColumns} />
          </div>
        );
      }

      const { setProps } = render(<Test rows={testRows.slice(0, 2)} />);
      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
      setProps({ rows: testRows });
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);
    });
  });

  describe('apiRef: updateRows', () => {
    type TestRow = { id: number; brand: string };
    const testRows: TestRow[] = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ];
    const testColumns: ColumnDef<TestRow>[] = [{ id: 'brand', field: 'brand' }];

    it('should allow to update one row at the time', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );
      await act(async () => apiRef.current?.api.rows.updateRows([{ id: 1, brand: 'Fila' }]));
      await act(async () => apiRef.current?.api.rows.updateRows([{ id: 0, brand: 'Pata' }]));
      await act(async () => apiRef.current?.api.rows.updateRows([{ id: 2, brand: 'Pum' }]));
      expect(getColumnValues(0)).to.deep.equal(['Pata', 'Fila', 'Pum']);
    });

    it('should allow adding rows', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );
      await act(async () => apiRef.current?.api.rows.updateRows([{ id: 1, brand: 'Fila' }]));
      await act(async () => apiRef.current?.api.rows.updateRows([{ id: 0, brand: 'Pata' }]));
      await act(async () => apiRef.current?.api.rows.updateRows([{ id: 2, brand: 'Pum' }]));
      await act(async () => apiRef.current?.api.rows.updateRows([{ id: 3, brand: 'Jordan' }]));
      expect(getColumnValues(0)).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
    });

    it('should allow to delete rows', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );
      await act(async () =>
        apiRef.current?.api.rows.updateRows([{ id: 1, _action: 'delete' } as any]),
      );
      await act(async () => apiRef.current?.api.rows.updateRows([{ id: 0, brand: 'Apple' }]));
      await act(async () =>
        apiRef.current?.api.rows.updateRows([{ id: 2, _action: 'delete' } as any]),
      );
      await act(async () => apiRef.current?.api.rows.updateRows([{ id: 5, brand: 'Atari' }]));
      expect(getColumnValues(0)).to.deep.equal(['Apple', 'Atari']);
    });
  });
});
