import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  screen,
} from 'test/utils';
import { getCell, getColumnHeadersTextContent, getColumnValues } from 'test/utils/helperFn';
import * as React from 'react';
import { expect } from 'chai';
import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';

const baselineProps: DataGridProProps = {
  rows: [
    { name: 'A' },
    { name: 'A.A' },
    { name: 'B' },
    { name: 'B.A' },
    { name: 'B.B' },
    { name: 'B.B.A' },
    { name: 'C' },
  ],
  columns: [
    {
      field: 'name',
      width: 200,
    },
  ],
  treeData: true,
  getTreeDataPath: (row) => row.name.split('.'),
  getRowId: (row) => row.name,
};

describe.only('<DataGridPro /> - Pagination', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const Test = (props: Partial<DataGridProProps>) => (
    <div style={{ width: 300, height: 300 }}>
      <DataGridPro {...baselineProps} {...props} />
    </div>
  );

  describe('grouping column', () => {
    it('should add a grouping column', () => {
      render(<Test />);

      const columnsHeader = getColumnHeadersTextContent();
      expect(columnsHeader).to.have.length(baselineProps.columns.length + 1);
      expect(columnsHeader[0]).to.equal('Group');
    });

    it('should toggle expansion when clicking on grouping column icon', () => {
      render(<Test />);

      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'B', 'C']);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
    });

    it('should toggle expansion when pressing Space while focusing grouping column', () => {
      render(<Test />);

      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      getCell(0, 0).focus();
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      fireEvent.keyDown(getCell(0, 0), { key: ' ' });
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'B', 'C']);
      fireEvent.keyDown(getCell(0, 0), { key: ' ' });
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
    });
  });

  describe('pagination', () => {
    it('should respect the pageSize when toggling children expansion', () => {
      render(<Test pagination pageSize={2} rowsPerPageOptions={[2]} />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B']);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(1)).to.deep.equal(['B', 'C']);
    });
  });
});
