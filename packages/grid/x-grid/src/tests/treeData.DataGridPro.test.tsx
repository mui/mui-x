import { createClientRenderStrictMode } from 'test/utils';
import { getColumnHeadersTextContent } from 'test/utils/helperFn';
import * as React from 'react';
import { expect } from 'chai';
import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';

const baselineProps: DataGridProProps = {
  rows: [
    { id: 0, name: 'A' },
    { id: 1, name: 'A.A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'B.A' },
    { id: 4, name: 'B.B' },
    { id: 5, name: 'B.B.A' },
    { id: 6, name: 'C' },
  ],
  columns: [
    {
      field: 'id',
    },
    {
      field: 'name',
      width: 200,
    },
  ],
  treeData: true,
  getTreeDataPath: (row) => row.name.split('.'),
};

describe.only('<DataGridPro /> - Pagination', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  describe('grouping column', () => {
    it('should add a grouping column', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} />
        </div>,
      );

      const columnsHeader = getColumnHeadersTextContent();

      expect(columnsHeader).to.have.length(3);
      expect(columnsHeader[0]).to.equal('Grouping');
    });
  });
});
