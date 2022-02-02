import * as React from 'react';
import { expect } from 'chai';
import { createRenderer } from '@mui/monorepo/test/utils';
import { DataGrid, DataGridProps, GridRowsProp, GridColumns } from '@mui/x-data-grid';
import {
  getColumnHeaderCell,
  getColumnHeadersTextContent,
} from '../../../../../test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [{ id: 1, idBis: 1 }];

const columns: GridColumns = [{ field: 'id' }, { field: 'idBis' }];

describe('<DataGridPro /> - Columns', () => {
  const { render } = createRenderer();

  const TestDataGrid = (
    props: Omit<DataGridProps, 'columns' | 'rows'> &
      Partial<Pick<DataGridProps, 'rows' | 'columns'>>,
  ) => (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid columns={columns} rows={rows} {...props} autoHeight={isJSDOM} />
    </div>
  );

  describe.only('prop: initialState.columns.columns', () => {
    it('should allow to initialize the columns order and dimensions', () => {
      render(
        <TestDataGrid
          initialState={{ columns: { columns: [{ field: 'idBis', width: 150 }, { field: 'id' }] } }}
        />,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis', 'id']);
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '150px' });
    });

    it('should not add a column when present in the initial state but not in the props', () => {
      render(<TestDataGrid initialState={{ columns: { columns: [{ field: 'idTres' }] } }} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'idBis']);
    });

    it('should move the columns not present in the initial state after the one present in it', () => {
      render(<TestDataGrid initialState={{ columns: { columns: [{ field: 'idBis' }] } }} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['idBis', 'id']);
    });

    it('should allow to remove the sizing properties by setting them to `undefined`', () => {
      render(
        <TestDataGrid
          columns={[{ field: 'id', flex: 1 }]}
          initialState={{ columns: { columns: [{ field: 'id', flex: undefined }] } }}
        />,
      );

      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
    });
  });
});
