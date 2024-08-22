import { createRenderer, fireEvent, screen, act } from '@mui/internal-test-utils';
import {
  getCell,
  getColumnHeaderCell,
  getColumnHeadersTextContent,
  getColumnValues,
  getRow,
} from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  DataGridPro,
  DataGridProProps,
  GRID_TREE_DATA_GROUPING_FIELD,
  GridApi,
  GridGroupNode,
  GridLogicOperator,
  GridRowsProp,
  useGridApiRef,
  GridPaginationModel,
} from '@mui/x-data-grid-pro';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rowsWithoutGap: GridRowsProp = [
  { name: 'A' },
  { name: 'A.A' },
  { name: 'A.B' },
  { name: 'B' },
  { name: 'B.A' },
  { name: 'B.B' },
  { name: 'B.B.A' },
  { name: 'B.B.A.A' },
  { name: 'C' },
];

const rowsWithGap: GridRowsProp = [
  { name: 'A' },
  { name: 'A.B' },
  { name: 'A.A' },
  { name: 'B.A' },
  { name: 'B.B' },
];

const baselineProps: DataGridProProps = {
  autoHeight: isJSDOM,
  rows: rowsWithoutGap,
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

describe('<DataGridPro /> - Tree data', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: React.MutableRefObject<GridApi>;

  function Test(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 800 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} disableVirtualization />
      </div>
    );
  }

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
        'B.B.A.A',
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
        'B.B.A.A',
        'C',
      ]);
    });

    it('should support enabling treeData after apiRef.current.updateRows has modified the rows', () => {
      const { setProps } = render(<Test treeData={false} defaultGroupingExpansionDepth={-1} />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['name']);
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
      act(() => apiRef.current.updateRows([{ name: 'A.A', _action: 'delete' }]));
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
      expect(getColumnHeadersTextContent()).to.deep.equal(['Group', 'name']);
      expect(getColumnValues(1)).to.deep.equal([
        'A',
        'A.B',
        'B',
        'B.A',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'C',
      ]);
    });

    it('should support new dataset', () => {
      const { setProps } = render(<Test />);
      setProps({
        rows: [
          { nameBis: '1' },
          { nameBis: '1.1' },
          { nameBis: '1.2' },
          { nameBis: '2' },
          { nameBis: '2.1' },
        ],
        columns: [
          {
            field: 'nameBis',
            width: 200,
          },
        ],
        getTreeDataPath: (row) => row.nameBis.split('.'),
        getRowId: (row) => row.nameBis,
      } as DataGridProProps);
      expect(getColumnHeadersTextContent()).to.deep.equal(['Group', 'nameBis']);
      expect(getColumnValues(1)).to.deep.equal(['1', '2']);
    });

    it('should keep children expansion when changing some of the rows', () => {
      render(<Test disableVirtualization rows={[{ name: 'A' }, { name: 'A.A' }]} />);
      expect(getColumnValues(1)).to.deep.equal(['A']);
      act(() => apiRef.current.setRowChildrenExpansion('A', true));
      clock.runToLast();
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A']);
      act(() => apiRef.current.updateRows([{ name: 'B' }]));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'B']);
    });
  });

  describe('prop: getTreeDataPath', () => {
    it('should allow to transform path', () => {
      render(
        <Test
          getTreeDataPath={(row) => [...row.name.split('.').reverse()]}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal([
        'A',
        'A.A',
        '',
        'B.B.A.A',
        'B.A',
        'B.B.A',
        'B',
        'A.B',
        'B.B',
        'C',
      ]);
    });

    it('should support new getTreeDataPath', () => {
      const { setProps } = render(<Test defaultGroupingExpansionDepth={-1} />);
      expect(getColumnValues(1)).to.deep.equal([
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
      setProps({
        getTreeDataPath: (row) => [...row.name.split('.').reverse()],
      } as DataGridProProps);
      expect(getColumnValues(1)).to.deep.equal([
        'A',
        'A.A',
        '',
        'B.B.A.A',
        'B.A',
        'B.B.A',
        'B',
        'A.B',
        'B.B',
        'C',
      ]);
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
      const { setProps } = render(<Test />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      act(() => apiRef.current.setRowChildrenExpansion('B', true));
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'B.A', 'B.B', 'C']);
      setProps({ sortModel: [{ field: 'name', sort: 'desc' }] });
      expect(getColumnValues(1)).to.deep.equal(['C', 'B', 'B.B', 'B.A', 'A']);
    });
  });

  describe('prop: isGroupExpandedByDefault', () => {
    it('should expand groups according to isGroupExpandedByDefault when defined', () => {
      const isGroupExpandedByDefault = spy((node: GridGroupNode) => node.id === 'A');

      render(<Test isGroupExpandedByDefault={isGroupExpandedByDefault} />);
      expect(isGroupExpandedByDefault.callCount).to.equal(8); // Should not be called on leaves
      const { childrenExpanded, children, childrenFromPath, ...node } = apiRef.current.state.rows
        .tree.A as GridGroupNode;
      const callForNodeA = isGroupExpandedByDefault
        .getCalls()
        .find((call) => call.firstArg.id === node.id)!;
      expect(callForNodeA.firstArg).to.deep.includes(node);
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
    });

    it('should have priority over defaultGroupingExpansionDepth when both defined', () => {
      const isGroupExpandedByDefault = (node: GridGroupNode) => node.id === 'A';

      render(
        <Test
          isGroupExpandedByDefault={isGroupExpandedByDefault}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
    });
  });

  describe('prop: groupingColDef', () => {
    it('should set the custom headerName', () => {
      render(<Test groupingColDef={{ headerName: 'Custom header name' }} />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['Custom header name', 'name']);
    });

    it('should render descendant count when hideDescendantCount = false', () => {
      render(
        <Test groupingColDef={{ hideDescendantCount: false }} defaultGroupingExpansionDepth={-1} />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        'A (2)',
        'A',
        'B',
        'B (4)',
        'A',
        'B (2)',
        'A (1)',
        'A',
        'C',
      ]);
    });

    it('should not render descendant count when hideDescendantCount = true', () => {
      render(
        <Test groupingColDef={{ hideDescendantCount: true }} defaultGroupingExpansionDepth={-1} />,
      );
      expect(getColumnValues(0)).to.deep.equal(['A', 'A', 'B', 'B', 'A', 'B', 'A', 'A', 'C']);
    });

    // https://github.com/mui/mui-x/issues/9344
    it('should support valueFormatter', () => {
      render(
        <Test
          groupingColDef={{ valueFormatter: (value) => `> ${value}` }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        '> A (2)',
        '> A',
        '> B',
        '> B (4)',
        '> A',
        '> B (2)',
        '> A (1)',
        '> A',
        '> C',
      ]);
    });
  });

  describe('row grouping column', () => {
    it('should add a grouping column', () => {
      render(<Test />);
      const columnsHeader = getColumnHeadersTextContent();
      expect(columnsHeader).to.deep.equal(['Group', 'name']);
    });

    it('should render a toggling icon only when a row has children', () => {
      render(
        <Test
          rows={[{ name: 'A' }, { name: 'A.C' }, { name: 'B' }, { name: 'B.A' }]}
          filterModel={{
            logicOperator: GridLogicOperator.Or,
            items: [
              { field: 'name', operator: 'endsWith', value: 'A', id: 0 },
              { field: 'name', operator: 'endsWith', value: 'B', id: 1 },
            ],
          }}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['A', 'B']);
      // No children after filtering
      expect(getCell(0, 0).querySelectorAll('button')).to.have.length(0);
      // Some children after filtering
      expect(getCell(1, 0).querySelectorAll('button')).to.have.length(1);
    });

    it('should toggle expansion when clicking on grouping column icon', () => {
      render(<Test />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      fireEvent.click(getCell(0, 0).querySelector('button')!);
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
      fireEvent.click(getCell(0, 0).querySelector('button')!);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
    });

    it('should toggle expansion when pressing Space while focusing grouping column', () => {
      render(<Test />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      fireUserEvent.mousePress(getCell(0, 0));
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
      fireEvent.keyDown(getCell(0, 0), { key: ' ' });
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
      fireEvent.keyDown(getCell(0, 0), { key: ' ' });
      expect(getColumnValues(1)).to.deep.equal(['A', 'B', 'C']);
    });

    it('should add auto generated rows if some parents do not exist', () => {
      render(<Test rows={rowsWithGap} defaultGroupingExpansionDepth={-1} />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.B', 'A.A', '', 'B.A', 'B.B']);
    });

    it('should keep the grouping column width between generations', () => {
      render(<Test groupingColDef={{ width: 200 }} />);
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '200px' });
      act(() =>
        apiRef.current.updateColumns([{ field: GRID_TREE_DATA_GROUPING_FIELD, width: 100 }]),
      );
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
      act(() =>
        apiRef.current.updateColumns([
          {
            field: 'name',
            headerName: 'New name',
          },
        ]),
      );
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '100px' });
    });
  });

  describe('pagination', () => {
    function PaginatedTest({ initialModel }: { initialModel: GridPaginationModel }) {
      const [paginationModel, setPaginationModel] = React.useState(initialModel);
      return (
        <Test
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[paginationModel.pageSize]}
        />
      );
    }

    it('should respect the pageSize for the top level rows when toggling children expansion', () => {
      render(<PaginatedTest initialModel={{ pageSize: 2, page: 0 }} />);
      expect(getColumnValues(1)).to.deep.equal(['A', 'B']);
      fireEvent.click(getCell(0, 0).querySelector('button')!);
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(1)).to.deep.equal(['C']);
    });

    it('should keep the row expansion when switching page', () => {
      render(<PaginatedTest initialModel={{ pageSize: 1, page: 0 }} />);
      expect(getColumnValues(1)).to.deep.equal(['A']);
      fireEvent.click(getCell(0, 0).querySelector('button')!);
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(1)).to.deep.equal(['B']);
      fireEvent.click(getCell(3, 0).querySelector('button')!);
      expect(getColumnValues(1)).to.deep.equal(['B', 'B.A', 'B.B']);
      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(getColumnValues(1)).to.deep.equal(['A', 'A.A', 'A.B']);
      fireEvent.click(getCell(0, 0).querySelector('button')!);
      expect(getColumnValues(1)).to.deep.equal(['A']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(1)).to.deep.equal(['B', 'B.A', 'B.B']);
    });
  });

  describe('filter', () => {
    it('should not show a node if none of its children match the filters and it does not match the filters', () => {
      render(
        <Test
          rows={[{ name: 'B' }, { name: 'B.B' }]}
          filterModel={{ items: [{ field: 'name', value: 'A', operator: 'endsWith' }] }}
          defaultGroupingExpansionDepth={-1}
        />,
      );

      expect(getColumnValues(1)).to.deep.equal([]);
    });

    it('should show a node if some of its children match the filters even if it does not match the filters', () => {
      render(
        <Test
          rows={[{ name: 'B' }, { name: 'B.A' }, { name: 'B.B' }]}
          filterModel={{ items: [{ field: 'name', value: 'A', operator: 'endsWith' }] }}
          defaultGroupingExpansionDepth={-1}
        />,
      );

      expect(getColumnValues(1)).to.deep.equal(['B', 'B.A']);
    });

    it('should show a node if none of its children match the filters but it does match the filters', () => {
      render(
        <Test
          rows={[{ name: 'A' }, { name: 'A.B' }]}
          filterModel={{ items: [{ field: 'name', value: 'A', operator: 'endsWith' }] }}
          defaultGroupingExpansionDepth={-1}
        />,
      );

      expect(getColumnValues(1)).to.deep.equal(['A']);
    });

    it('should not filter the children if props.disableChildrenFiltering = true', () => {
      render(
        <Test
          rows={[{ name: 'B' }, { name: 'B.A' }, { name: 'B.B' }]}
          filterModel={{ items: [{ field: 'name', value: 'B', operator: 'endsWith' }] }}
          disableChildrenFiltering
          defaultGroupingExpansionDepth={-1}
        />,
      );

      expect(getColumnValues(1)).to.deep.equal(['B', 'B.A', 'B.B']);
    });

    it('should allow to toggle props.disableChildrenFiltering', () => {
      const { setProps } = render(
        <Test
          rows={[{ name: 'B' }, { name: 'B.A' }, { name: 'B.B' }]}
          filterModel={{ items: [{ field: 'name', value: 'B', operator: 'endsWith' }] }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['B', 'B.B']);

      setProps({ disableChildrenFiltering: true });
      expect(getColumnValues(1)).to.deep.equal(['B', 'B.A', 'B.B']);

      setProps({ disableChildrenFiltering: false });
      expect(getColumnValues(1)).to.deep.equal(['B', 'B.B']);
    });

    it('should throw an error when using filterMode="server" and treeData', () => {
      expect(() => {
        render(<Test filterMode="server" />);
      }).toErrorDev(
        'MUI X: The `filterMode="server"` prop is not available when the `treeData` is enabled.',
      );
    });

    it('should set the filtered descendant count on matching nodes even if the children are collapsed', () => {
      render(
        <Test filterModel={{ items: [{ field: 'name', value: 'A', operator: 'endsWith' }] }} />,
      );

      // A has A.A but not A.B
      // B has B.A (match filter), B.B (has matching children), B.B.A (match filters), B.B.A.A (match filters)
      expect(getColumnValues(0)).to.deep.equal(['A (1)', 'B (4)']);
    });

    it('should apply quick filter without throwing error', () => {
      render(
        <Test
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterValues: ['A', 'B'],
              },
            },
          }}
        />,
      );

      // A has A.A but not A.B
      // B has B.A (match filter), B.B (has matching children), B.B.A (match filters), B.B.A.A (match filters)
      expect(getColumnValues(0)).to.deep.equal(['A (1)', 'B (4)']);
    });

    it('should remove generated rows when they and their children do not pass quick filter', () => {
      render(
        <Test
          rows={[
            { name: 'A.B' },
            { name: 'A.C' },
            { name: 'B.C' },
            { name: 'B.D' },
            { name: 'D.A' },
          ]}
          filterModel={{ items: [], quickFilterValues: ['D'] }}
          defaultGroupingExpansionDepth={-1}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['B (1)', 'D', 'D (1)', 'A']);
    });

    it('should keep the correct count of the children and descendants in the filter state', () => {
      render(
        <Test
          rows={[
            { name: 'A' },
            { name: 'A.A' },
            { name: 'A.B' },
            { name: 'A.B.A' },
            { name: 'A.B.B' },
            { name: 'A.C' },
            { name: 'B' },
            { name: 'B.A' },
            { name: 'B.B' },
            { name: 'B.C' },
            { name: 'C' },
          ]}
          filterModel={{ items: [], quickFilterValues: ['A'] }}
          defaultGroupingExpansionDepth={3}
        />,
      );

      const { filteredChildrenCountLookup, filteredDescendantCountLookup } =
        apiRef.current.state.filter;

      expect(filteredChildrenCountLookup.A).to.equal(3);
      expect(filteredDescendantCountLookup.A).to.equal(5);

      expect(filteredChildrenCountLookup.B).to.equal(1);
      expect(filteredDescendantCountLookup.B).to.equal(1);

      expect(filteredChildrenCountLookup.C).to.equal(undefined);
      expect(filteredDescendantCountLookup.C).to.equal(undefined);

      act(() => {
        apiRef.current.updateRows([{ name: 'A.D' }]);
      });

      expect(apiRef.current.state.filter.filteredChildrenCountLookup.A).to.equal(4);
      expect(apiRef.current.state.filter.filteredDescendantCountLookup.A).to.equal(6);
    });
  });

  describe('sorting', () => {
    it('should respect the prop order for a given depth when no sortModel provided', () => {
      render(
        <Test
          rows={[{ name: 'D' }, { name: 'A.B' }, { name: 'A' }, { name: 'A.A' }]}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal(['D', 'A', 'A.B', 'A.A']);
    });

    it('should apply the sortModel on every depth of the tree if props.disableChildrenSorting = false', () => {
      render(
        <Test sortModel={[{ field: 'name', sort: 'desc' }]} defaultGroupingExpansionDepth={-1} />,
      );
      expect(getColumnValues(1)).to.deep.equal([
        'C',
        'B',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'B.A',
        'A',
        'A.B',
        'A.A',
      ]);
    });

    it('should only apply the sortModel on top level rows if props.disableChildrenSorting = true', () => {
      render(
        <Test
          sortModel={[{ field: 'name', sort: 'desc' }]}
          disableChildrenSorting
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal([
        'C',
        'B',
        'B.A',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'A',
        'A.A',
        'A.B',
      ]);
    });

    it('should allow to toggle props.disableChildrenSorting', () => {
      const { setProps } = render(
        <Test sortModel={[{ field: 'name', sort: 'desc' }]} defaultGroupingExpansionDepth={-1} />,
      );
      expect(getColumnValues(1)).to.deep.equal([
        'C',
        'B',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'B.A',
        'A',
        'A.B',
        'A.A',
      ]);

      setProps({ disableChildrenSorting: true });
      expect(getColumnValues(1)).to.deep.equal([
        'C',
        'B',
        'B.A',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'A',
        'A.A',
        'A.B',
      ]);

      setProps({ disableChildrenSorting: false });
      expect(getColumnValues(1)).to.deep.equal([
        'C',
        'B',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'B.A',
        'A',
        'A.B',
        'A.A',
      ]);
    });

    it('should update the order server side', () => {
      const { setProps } = render(<Test sortingMode="server" defaultGroupingExpansionDepth={-1} />);
      expect(getColumnValues(1)).to.deep.equal([
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
      setProps({
        rows: [
          { name: 'C' },
          { name: 'B' },
          { name: 'B.B' },
          { name: 'B.B.A' },
          { name: 'B.B.A.A' },
          { name: 'B.A' },
          { name: 'A' },
          { name: 'A.B' },
          { name: 'A.A' },
        ],
      });
      expect(getColumnValues(1)).to.deep.equal([
        'C',
        'B',
        'B.B',
        'B.B.A',
        'B.B.A.A',
        'B.A',
        'A',
        'A.B',
        'A.A',
      ]);
    });
  });

  describe('accessibility', () => {
    it('should add necessary treegrid aria attributes to the rows', () => {
      render(<Test defaultGroupingExpansionDepth={-1} />);

      expect(getRow(0).getAttribute('aria-level')).to.equal('1'); // A
      expect(getRow(1).getAttribute('aria-level')).to.equal('2'); // A.A
      expect(getRow(1).getAttribute('aria-posinset')).to.equal('1');
      expect(getRow(1).getAttribute('aria-setsize')).to.equal('2');
      expect(getRow(2).getAttribute('aria-level')).to.equal('2'); // A.B
      expect(getRow(4).getAttribute('aria-posinset')).to.equal('1'); // B.A
    });

    it('should adjust treegrid aria attributes after filtering', () => {
      render(
        <Test
          defaultGroupingExpansionDepth={-1}
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterValues: ['B'],
              },
            },
          }}
        />,
      );

      expect(getRow(0).getAttribute('aria-level')).to.equal('1'); // A
      expect(getRow(1).getAttribute('aria-level')).to.equal('2'); // A.B
      expect(getRow(1).getAttribute('aria-posinset')).to.equal('1');
      expect(getRow(1).getAttribute('aria-setsize')).to.equal('1'); // A.A is filtered out, set size is now 1
      expect(getRow(2).getAttribute('aria-level')).to.equal('1'); // B
      expect(getRow(3).getAttribute('aria-posinset')).to.equal('1'); // B.A
      expect(getRow(3).getAttribute('aria-setsize')).to.equal('2'); // B.A & B.B
    });

    it('should not add the set specific aria attributes to pinned rows', () => {
      render(
        <Test
          defaultGroupingExpansionDepth={-1}
          pinnedRows={{
            top: [
              {
                name: 'Pin',
              },
            ],
          }}
        />,
      );

      expect(getRow(0).getAttribute('aria-rowindex')).to.equal('2'); // header row is 1
      expect(getRow(0).getAttribute('aria-level')).to.equal(null);
      expect(getRow(0).getAttribute('aria-posinset')).to.equal(null);
      expect(getRow(0).getAttribute('aria-setsize')).to.equal(null);
      expect(getRow(1).getAttribute('aria-rowindex')).to.equal('3');
      expect(getRow(1).getAttribute('aria-level')).to.equal('1'); // A
      expect(getRow(1).getAttribute('aria-posinset')).to.equal('1');
      expect(getRow(1).getAttribute('aria-setsize')).to.equal('3'); // A, B, C
    });
  });

  describe('regressions', () => {
    // See https://github.com/mui/mui-x/issues/9402
    it('should not fail with checkboxSelection', () => {
      const initialRows = rowsWithoutGap;
      const { setProps } = render(<Test checkboxSelection rows={initialRows} />);

      const newRows = [...initialRows];
      newRows.splice(7, 1);
      setProps({
        rows: newRows,
      });
    });
  });
});
