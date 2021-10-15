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
import {
  DataGridPro,
  DataGridProProps,
  GridApiRef,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-pro';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rowsWithoutGap: GridRowsProp = [
  { name: 'A', value: 10 },
  { name: 'A.A', value: 4 },
  { name: 'A.B', value: 6 },
  { name: 'B', value: 20 },
  { name: 'B.A', value: 12 },
  { name: 'B.B', value: 8 },
  { name: 'B.B.A', value: 8 },
  { name: 'B.B.A.A', value: 8 },
  { name: 'C', value: 5 },
];

const rowsWithGap: GridRowsProp = [
  { name: 'A', value: 10 },
  { name: 'A.B', value: 6 },
  { name: 'A.A', value: 4 },
  { name: 'B.A', value: 3 },
  { name: 'B.B', value: 7 },
];

const baselineProps: DataGridProProps = {
  autoHeight: isJSDOM,
  rows: rowsWithoutGap,
  columns: [
    {
      field: 'name',
      width: 200,
    },
    {
      field: 'value',
      type: 'number',
    },
  ],
  treeData: true,
  getTreeDataPath: (row) => row.name.split('.'),
  getRowId: (row) => row.name,
};

describe('<DataGridPro /> - Tree Data', () => {
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
      expect(getColumnHeadersTextContent()).to.deep.equal(['name', 'value']);
      expect(getColumnValues(0)).to.deep.equal([
        'A',
        'A.A',
        'A.B',
        'B',
        'B.A',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'C',
      ]);
      setProps({ treeData: true });
      expect(getColumnHeadersTextContent()).to.deep.equal(['Group', 'name', 'value']);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      setProps({ treeData: false });
      expect(getColumnHeadersTextContent()).to.deep.equal(['name', 'value']);
      expect(getColumnValues(0)).to.deep.equal([
        'A',
        'A.A',
        'A.B',
        'B',
        'B.A',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'C',
      ]);
    });

    it('should support enabling treeData after apiRef.current.updateRows has modified the rows', async () => {
      const { setProps } = render(<Test treeData={false} />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['name', 'value']);
      expect(getColumnValues(0)).to.deep.equal([
        'A',
        'A.A',
        'A.B',
        'B',
        'B.A',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'C',
      ]);
      apiRef.current.updateRows([{ name: 'A.A', _action: 'delete' }]);
      expect(getColumnValues(0)).to.deep.equal([
        'A',
        'A.B',
        'B',
        'B.A',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'C',
      ]);
      setProps({ treeData: true });
      expect(getColumnHeadersTextContent()).to.deep.equal(['Group', 'name', 'value']);
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

  describe('prop: defaultGroupingExpansionDepth', () => {
    it('should not expand any row if defaultGroupingExpansionDepth = 0', () => {
      render(<Test defaultGroupingExpansionDepth={0} />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
    });

    it('should expand all top level rows if defaultGroupingExpansionDepth = 1', () => {
      render(<Test defaultGroupingExpansionDepth={1} />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'B.A', 'B.B', 'C']);
    });

    it('should expand all rows up to depth of 2 if defaultGroupingExpansionDepth = 2', () => {
      render(<Test defaultGroupingExpansionDepth={2} />);
      expect(getColumnValues(1)).to.deep.equal([
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

    it('should expand all rows if defaultGroupingExpansionDepth = -1', () => {
      render(<Test defaultGroupingExpansionDepth={2} />);
      expect(getColumnValues(1)).to.deep.equal([
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

    it('should not re-apply default expansion on rerender after expansion manually toggled', () => {
      const { setProps } = render(<Test defaultGroupingExpansionDepth={1} />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'B.A', 'B.B', 'C']);
      setProps({ sortModel: [{ field: 'name', sort: 'desc' }] });
      expect(getColumnValues(1)).to.deep.equal(['C', 'B', 'B.B', 'B.A', 'A', 'A.B', 'A.A']);
    });
  });

  describe('prop: groupingColDef', () => {
    it('should set the custom headerName', () => {
      render(<Test groupingColDef={{ headerName: 'Custom header name' }} />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['Custom header name', 'name', 'value']);
    });
  });

  describe('row grouping', () => {
    it('should add a grouping column', () => {
      render(<Test />);
      const columnsHeader = getColumnHeadersTextContent();
      expect(columnsHeader).to.deep.equal(['Group', 'name', 'value']);
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

    it('should add auto generated rows if some parents do not exist', () => {
      render(<Test rows={rowsWithGap} />);
      expect(getColumnValues(1)).to.deep.equal(['A', '']);
      fireEvent.click(getCell(1, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['A', '', 'B.A', 'B.B']);
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
    const filterBaselineProps = {
      autoHeight: isJSDOM,
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

    const TestFilter = (props: Omit<DataGridProProps, 'columns'>) => {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 800 }}>
          <DataGridPro
            {...filterBaselineProps}
            defaultGroupingExpansionDepth={-1}
            apiRef={apiRef}
            {...props}
          />
        </div>
      );
    };

    it('should not show a node if none of its children match the filters and it does not match the filters', () => {
      render(
        <TestFilter
          rows={[{ name: 'B' }, { name: 'B.B' }]}
          filterModel={{ items: [{ columnField: 'name', value: 'A', operatorValue: 'endsWith' }] }}
        />,
      );

      expect(getColumnValues(1)).to.deep.equal([]);
    });

    it('should show a node if some of its children match the filters even if it does not match the filters', () => {
      render(
        <TestFilter
          rows={[{ name: 'B' }, { name: 'B.A' }, { name: 'B.B' }]}
          filterModel={{ items: [{ columnField: 'name', value: 'A', operatorValue: 'endsWith' }] }}
        />,
      );

      expect(getColumnValues(1)).to.deep.equal(['B', 'B.A']);
    });

    it('should show a node if none of its children match the filters but it does match the filters', () => {
      render(
        <TestFilter
          rows={[{ name: 'A' }, { name: 'A.B' }]}
          filterModel={{ items: [{ columnField: 'name', value: 'A', operatorValue: 'endsWith' }] }}
        />,
      );

      expect(getColumnValues(1)).to.deep.equal(['A']);
    });

    it('should not filter the children if props.disableChildrenFiltering = true', () => {
      render(
        <TestFilter
          rows={[{ name: 'B' }, { name: 'B.A' }, { name: 'B.B' }]}
          filterModel={{ items: [{ columnField: 'name', value: 'A', operatorValue: 'endsWith' }] }}
          disableChildrenFiltering
        />,
      );

      expect(getColumnValues(1)).to.deep.equal(['B', 'B.A', 'B.B']);
    });
  });

  describe('sorting', () => {
    it('should respect the prop order for a given depth when no sortModel provided', () => {
      render(<Test rows={[{ name: 'D' }, { name: 'A.B' }, { name: 'A' }, { name: 'A.A' }]} />);
      expect(getColumnValues(1)).to.deep.equal(['D', 'A']);
      fireEvent.click(getCell(1, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['D', 'A', 'A.B', 'A.A']);
    });

    it('should apply the sortModel on every depth of the tree if props.disableChildrenSorting = false', () => {
      render(<Test sortModel={[{ field: 'name', sort: 'desc' }]} />);
      expect(getColumnValues(1)).to.deep.equal(['C', 'B', 'A']);
      fireEvent.click(getCell(2, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['C', 'B', 'A', 'A.B', 'A.A']);
    });

    it('should only apply the sortModel on top level rows if props.disableChildrenSorting = true', () => {
      render(<Test sortModel={[{ field: 'name', sort: 'desc' }]} disableChildrenSorting />);
      expect(getColumnValues(1)).to.deep.equal(['C', 'B', 'A']);
      fireEvent.click(getCell(2, 0).querySelector('button'));
      expect(getColumnValues(1)).to.deep.equal(['C', 'B', 'A', 'A.A', 'A.B']);
    });
  });
});
