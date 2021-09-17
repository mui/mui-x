import { createClientRenderStrictMode, fireEvent, screen } from 'test/utils';
import { getCell, getColumnHeadersTextContent, getColumnValues } from 'test/utils/helperFn';
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

  const Test = () => (
    <div style={{ width: 300, height: 300 }}>
      <DataGridPro {...baselineProps} />
    </div>
  );

  describe('grouping column', () => {
    it('should add a grouping column', () => {
      render(<Test />);

      const columnsHeader = getColumnHeadersTextContent();
      expect(columnsHeader).to.have.length(3);
      expect(columnsHeader[0]).to.equal('Group');
    });

    it('should toggle expansion when clicking on grouping column icon', () => {
      render(<Test />);

      expect(getColumnValues(1)).to.deep.equal(['0', '2', '6']);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['0', '1', '2', '6']);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['0', '2', '6']);
    });

    it('should toggle expansion when pressing Space while focusing grouping column', () => {
      render(<Test />);

      expect(getColumnValues(1)).to.deep.equal(['0', '2', '6']);
      getCell(0, 0).focus();
      expect(getColumnValues(1)).to.deep.equal(['0', '2', '6']);
      fireEvent.keyDown(getCell(0, 0), { key: ' ' });
      expect(getColumnValues(1)).to.deep.equal(['0', '1', '2', '6']);
      fireEvent.keyDown(getCell(0, 0), { key: ' ' });
      expect(getColumnValues(1)).to.deep.equal(['0', '2', '6']);
    });
  });
});
