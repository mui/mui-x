import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
} from 'test/utils';
import { getCell, getColumnHeadersTextContent, getColumnValues } from 'test/utils/helperFn';
import * as React from 'react';
import { expect } from 'chai';
import { DataGridPro, DataGridProProps, GridApiRef, useGridApiRef } from '@mui/x-data-grid-pro';

const baselineProps: DataGridProProps = {
  rows: [
    { name: 'A' },
    { name: 'A.A' },
    { name: 'A.B' },
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

describe.only('<DataGridPro /> - Tree Data', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

  const Test = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 800 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  };

  describe('prop: treeData', () => {
    it('should support tree data toggling', () => {
      const { setProps } = render(<Test treeData={false} />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['name']);
      expect(getColumnValues(0)).to.deep.equal([
        'A',
        'A.A',
        'A.B',
        'B',
        'B.A',
        'B.B',
        'B.B.A',
        'C',
      ]);
      setProps({ treeData: true });
      expect(getColumnHeadersTextContent()).to.deep.equal(['Group', 'name']);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      setProps({ treeData: false });
      expect(getColumnHeadersTextContent()).to.deep.equal(['name']);
      expect(getColumnValues(0)).to.deep.equal([
        'A',
        'A.A',
        'A.B',
        'B',
        'B.A',
        'B.B',
        'B.B.A',
        'C',
      ]);
    });

    it('should support enabling treeData after apiRef.current.updateRows has modified the rows', async () => {
      const { setProps } = render(<Test treeData={false} />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['name']);
      expect(getColumnValues(0)).to.deep.equal([
        'A',
        'A.A',
        'A.B',
        'B',
        'B.A',
        'B.B',
        'B.B.A',
        'C',
      ]);
      apiRef.current.updateRows([{ name: 'A.A', _action: 'delete' }]);
      expect(getColumnValues(0)).to.deep.equal(['A', 'A.B', 'B', 'B.A', 'B.B', 'B.B.A', 'C']);
      setProps({ treeData: true });
      expect(getColumnHeadersTextContent()).to.deep.equal(['Group', 'name']);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.B', 'B', 'C']);
    });
  });

  describe('prop: getTreeDataPath', () => {
    it('should allow to transform path', () => {
      render(<Test getTreeDataPath={(row) => [...row.name.split('.').reverse()]} />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'B.A', 'B', 'C']);
    });

    it('should support new getTreeDataPath', () => {
      const { setProps } = render(<Test />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
      setProps({ getTreeDataPath: (row) => [...row.name.split('.').reverse()] });
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'B.A', 'B', 'C']);
    });
  });

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
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
    });

    it('should toggle expansion when pressing Space while focusing grouping column', () => {
      render(<Test />);

      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      getCell(0, 0).focus();
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      fireEvent.keyDown(getCell(0, 0), { key: ' ' });
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
      fireEvent.keyDown(getCell(0, 0), { key: ' ' });
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
    });
  });

  describe('pagination', () => {
    it('should respect the pageSize for the top level rows when toggling children expansion', () => {
      render(<Test pagination pageSize={2} rowsPerPageOptions={[2]} />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B']);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(1)).to.deep.equal(['C']);
    });
  });

  describe('filter', () => {
    it('should filter every depth of the tree if props.disableChildrenFiltering = false', () => {
      const { setProps } = render(<Test />);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
      setProps({
        filterModel: { items: [{ columnField: 'name', value: 'A', operatorValue: 'endsWith' }] },
      });
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A']);
    });

    it('should only filter to top level rows if props.disableChildrenFiltering = true', () => {
      const { setProps } = render(<Test disableChildrenFiltering />);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
      setProps({
        filterModel: { items: [{ columnField: 'name', value: 'A', operatorValue: 'endsWith' }] },
      });
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B']);
    });

    it('should not show children when its parent does not match the filters', () => {
      const { setProps } = render(<Test />);
      fireEvent.click(getCell(0, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
      setProps({
        filterModel: { items: [{ columnField: 'name', value: 'A.B', operatorValue: 'equals' }] },
      });
      expect(getColumnValues(1)).to.deep.equal([]);
    });
  });

  describe('sorting', () => {
    it('should respect the prop order for a given depth when no sortModel provided', () => {
      render(<Test rows={[{ name: 'D' }, { name: 'A.B' }, { name: 'A' }, { name: 'A.A' }]} />);
      expect(getColumnValues(1)).to.deep.equal(['D', 'A']);
      fireEvent.click(getCell(1, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['D', 'A', 'A.B', 'A.A']);
    });

    it('should apply the sortModel on every depth of the tree', () => {
      render(<Test sortModel={[{ field: 'name', sort: 'desc' }]} />);
      expect(getColumnValues(1)).to.deep.equal(['C', 'B', 'A']);
      fireEvent.click(getCell(2, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['C', 'B', 'A', 'A.B', 'A.A']);
    });
  });
});
