import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { getColumnValues } from 'test/utils/helperFn';
import { TestDataGrid } from './TestDataGrid';

describe('<DataGrid /> - Rows', () => {
  const { render } = createRenderer();

  const rows = [
    { clientId: 'c1', first: 'Mike', age: 11 },
    { clientId: 'c2', first: 'Jack', age: 11 },
    { clientId: 'c3', first: 'Mike', age: 20 },
  ];

  type Row = (typeof rows)[number];

  const columns = [
    { id: 'clientId', field: 'clientId' as keyof Row },
    { id: 'first', field: 'first' as keyof Row },
    { id: 'age', field: 'age' as keyof Row },
  ];

  describe('prop: getRowId', () => {
    it('should allow to select a field as id', () => {
      const getRowId: React.ComponentProps<
        typeof TestDataGrid<(typeof rows)[number]>
      >['getRowId'] = (row) => `${row.clientId}`;
      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={rows} columns={columns} getRowId={getRowId} />
        </div>,
      );
      expect(getColumnValues(0)).to.deep.equal(['c1', 'c2', 'c3']);
    });
  });
});
