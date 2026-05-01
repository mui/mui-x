import * as React from 'react';
import { createRenderer, waitFor, within } from '@mui/internal-test-utils';
import { type RefObject } from '@mui/x-internals/types';
import {
  DataGridPremium,
  type DataGridPremiumProps,
  type GridApi,
  type GridDataSource,
  type GridGetRowsParams,
  type GridDataSourceGroupNode,
  type GridGroupNode,
  GRID_ROOT_GROUP_ID,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { spy } from 'sinon';
import { getCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe.skipIf(isJSDOM)('<DataGridPremium /> - Data source row grouping', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;
  const rowHeight = 50;
  const columnHeaderHeight = 50;
  const gridHeight = 4 * rowHeight + columnHeaderHeight + 2;

  it('should reset the rows after row grouping model change when children are expanded', async () => {
    const getRowsSpy = spy();

    function TestComponent(props: { rowGroupingModel: DataGridPremiumProps['rowGroupingModel'] }) {
      apiRef = useGridApiRef();
      const { rowGroupingModel } = props;

      const dataSource: GridDataSource = React.useMemo(() => {
        const rootRows = [{ id: 'company-A', group: 'A', descendantCount: 1 }];
        const companyChildren = [{ id: 'A-leaf', group: 'Trader 1', descendantCount: 0 }];

        return {
          getRows: async (params: GridGetRowsParams) => {
            getRowsSpy(params);

            if (params.groupKeys!.length === 0) {
              return { rows: rootRows, rowCount: rootRows.length };
            }

            if (params.groupKeys![0] === 'A') {
              return { rows: companyChildren, rowCount: companyChildren.length };
            }

            return { rows: [], rowCount: 0 };
          },
          getGroupKey: (row) => row.group,
          getChildrenCount: (row) => row.descendantCount,
        };
      }, []);

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={[{ field: 'company' }, { field: 'trader' }]}
            dataSource={dataSource}
            dataSourceCache={null}
            disableVirtualization
            rowGroupingModel={rowGroupingModel}
          />
        </div>
      );
    }

    const { user, setProps } = render(<TestComponent rowGroupingModel={['company']} />);

    await waitFor(() => {
      const rootChildren = (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode)
        .children;
      expect(rootChildren).to.deep.equal(['company-A']);
    });

    await user.click(within(getCell(0, 0)).getByRole('button'));

    await waitFor(() => {
      expect(apiRef.current!.state.rows.tree['A-leaf']).not.to.equal(undefined);
    });

    setProps({ rowGroupingModel: ['company', 'trader'] });

    await waitFor(() => {
      expect(getRowsSpy.lastCall.args[0].groupFields).to.deep.equal(['company', 'trader']);
    });

    await waitFor(() => {
      const companyGroup = apiRef.current!.state.rows.tree['company-A'] as GridGroupNode;

      expect(apiRef.current!.state.rows.tree['A-leaf']).to.equal(undefined);
      expect(companyGroup.children).to.deep.equal([]);
      expect(companyGroup.childrenExpanded).to.equal(false);
    });
  });

  describe('Nested lazy loading', () => {
    type RowGroupingRow = {
      id: string;
      group: string;
      sector?: string;
      industry?: string;
      company?: string;
      value?: number;
      childrenCount: number;
    };

    const rowsByGroupKeys: Record<string, RowGroupingRow[]> = {
      '[]': [
        { id: 'sector-tech', group: 'Technology', sector: 'Technology', childrenCount: 2 },
        { id: 'sector-finance', group: 'Finance', sector: 'Finance', childrenCount: 1 },
      ],
      '["Technology"]': [
        {
          id: 'industry-software',
          group: 'Software',
          sector: 'Technology',
          industry: 'Software',
          childrenCount: 2,
        },
        {
          id: 'industry-hardware',
          group: 'Hardware',
          sector: 'Technology',
          industry: 'Hardware',
          childrenCount: 1,
        },
      ],
      '["Technology","Software"]': [
        {
          id: 'stock-msft',
          group: 'Microsoft',
          sector: 'Technology',
          industry: 'Software',
          company: 'Microsoft',
          value: 430,
          childrenCount: 0,
        },
        {
          id: 'stock-adbe',
          group: 'Adobe',
          sector: 'Technology',
          industry: 'Software',
          company: 'Adobe',
          value: 560,
          childrenCount: 0,
        },
      ],
    };

    function TestNestedLazyRowGrouping(props: {
      onFetchRows: (params: GridGetRowsParams) => void;
    }) {
      const { onFetchRows } = props;
      apiRef = useGridApiRef();

      const dataSource: GridDataSource = React.useMemo(
        () => ({
          getRows: async (params: GridGetRowsParams) => {
            onFetchRows(params);

            const groupKeys = params.groupKeys ?? [];
            const rows = rowsByGroupKeys[JSON.stringify(groupKeys)] ?? [];
            const start = typeof params.start === 'number' ? params.start : 0;
            const end = typeof params.end === 'number' ? params.end : rows.length - 1;

            return {
              rows: rows.slice(start, end + 1),
              rowCount: rows.length,
            };
          },
          getGroupKey: (row) => row.group,
          getChildrenCount: (row) => row.childrenCount,
        }),
        [onFetchRows],
      );

      return (
        <div style={{ width: 400, height: gridHeight }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={[
              { field: 'sector', width: 120 },
              { field: 'industry', width: 120 },
              { field: 'company', width: 120 },
              { field: 'value', width: 80 },
            ]}
            dataSource={dataSource}
            dataSourceCache={null}
            lazyLoading
            rowGroupingModel={['sector', 'industry']}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 },
            }}
            rowHeight={rowHeight}
            columnHeaderHeight={columnHeaderHeight}
          />
        </div>
      );
    }

    it('should create row grouping nodes with the grouping field for each lazy-loaded level', async () => {
      const getRowsSpy = spy();
      const { user } = render(<TestNestedLazyRowGrouping onFetchRows={getRowsSpy} />);

      await waitFor(() => {
        const rootChildren = (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode)
          .children;
        expect(rootChildren).to.deep.equal(['sector-tech', 'sector-finance']);
      });

      const techNode = apiRef.current!.getRowNode<GridDataSourceGroupNode>('sector-tech')!;
      expect(techNode.groupingField).to.equal('sector');
      expect(techNode.path).to.deep.equal(['Technology']);
      expect(
        (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode).childrenFromPath
          .sector.Technology,
      ).to.equal('sector-tech');

      await user.click(within(getCell(0, 0)).getByRole('button'));

      await waitFor(() => {
        expect(apiRef.current!.getRow('industry-software')).not.to.equal(null);
      });

      const softwareNode =
        apiRef.current!.getRowNode<GridDataSourceGroupNode>('industry-software')!;
      expect(softwareNode.groupingField).to.equal('industry');
      expect(softwareNode.path).to.deep.equal(['Technology', 'Software']);
      const updatedTechNode = apiRef.current!.getRowNode<GridGroupNode>('sector-tech')!;
      expect(updatedTechNode.childrenFromPath.industry.Software).to.equal('industry-software');

      const technologyRequest = getRowsSpy.getCalls().find((call) => {
        const params = call.firstArg as GridGetRowsParams;
        return JSON.stringify(params.groupKeys) === JSON.stringify(['Technology']);
      })?.firstArg as GridGetRowsParams | undefined;

      expect(technologyRequest?.groupFields).to.deep.equal(['sector', 'industry']);
    });

    it('should lazy load leaves under the final row grouping level', async () => {
      const getRowsSpy = spy();
      const { user } = render(<TestNestedLazyRowGrouping onFetchRows={getRowsSpy} />);

      await waitFor(() => expect(apiRef.current!.getRow('sector-tech')).not.to.equal(null));
      await user.click(within(getCell(0, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('industry-software')).not.to.equal(null));

      await user.click(within(getCell(1, 0)).getByRole('button'));

      await waitFor(() => {
        expect(apiRef.current!.getRow('stock-msft')).not.to.equal(null);
      });

      const stockNode = apiRef.current!.getRowNode('stock-msft')!;
      expect(stockNode.type).to.equal('leaf');
      expect(stockNode.parent).to.equal('industry-software');

      const softwareNode = apiRef.current!.getRowNode<GridGroupNode>('industry-software')!;
      const noGroupingField = '__no_field__';
      expect(softwareNode.childrenFromPath[noGroupingField].Microsoft).to.equal('stock-msft');

      const softwareRequest = getRowsSpy.getCalls().find((call) => {
        const params = call.firstArg as GridGetRowsParams;
        return JSON.stringify(params.groupKeys) === JSON.stringify(['Technology', 'Software']);
      })?.firstArg as GridGetRowsParams | undefined;

      expect(softwareRequest?.groupFields).to.deep.equal(['sector', 'industry']);
    });

    it('should collapse expanded row grouping parents without removing skeleton rows through row updates', async () => {
      const getRowsSpy = spy();
      const { user } = render(<TestNestedLazyRowGrouping onFetchRows={getRowsSpy} />);

      await waitFor(() => expect(apiRef.current!.getRow('sector-tech')).not.to.equal(null));
      await user.click(within(getCell(0, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('industry-software')).not.to.equal(null));
      await user.click(within(getCell(1, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('stock-msft')).not.to.equal(null));

      await user.click(within(getCell(0, 0)).getByRole('button'));

      await waitFor(() => {
        expect(apiRef.current!.getRow('industry-software')).to.equal(null);
      });

      const techNode = apiRef.current!.getRowNode<GridGroupNode>('sector-tech')!;
      expect(techNode.childrenExpanded).to.equal(false);
      expect(techNode.children).to.have.length(2);
      techNode.children.forEach((childId) => {
        expect(apiRef.current!.state.rows.tree[childId].type).to.equal('skeletonRow');
      });
    });
  });
});
