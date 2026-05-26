import * as React from 'react';
import { act, createRenderer, waitFor, within } from '@mui/internal-test-utils';
import { type RefObject } from '@mui/x-internals/types';
import {
  DataGridPremium,
  type DataGridPremiumProps,
  type GridApi,
  type GridDataSource,
  type GridGetRowsParams,
  type GridGetRowsResponse,
  type GridGroupNode,
  GRID_ROOT_GROUP_ID,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { spy } from 'sinon';
import { getCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DataGridPremium /> - Data source row grouping (loading state)', () => {
  const { render } = createRenderer();

  it('should toggle loading state on row grouping model change', async () => {
    let resolveSecond: (response: GridGetRowsResponse) => void = () => {};
    const responses: GridGetRowsResponse[] = [{ rows: [{ id: 'A', group: 'A' }], rowCount: 1 }];
    let callIndex = 0;
    const getRows = spy(() => {
      const index = callIndex;
      callIndex += 1;
      if (index === 0) {
        return Promise.resolve(responses[0]);
      }
      return new Promise<GridGetRowsResponse>((resolve) => {
        resolveSecond = resolve;
      });
    });
    const dataSource: GridDataSource = {
      getRows: getRows as unknown as GridDataSource['getRows'],
      getGroupKey: (row) => row.group,
      getChildrenCount: () => 0,
    };
    let apiRef: RefObject<GridApi | null> = { current: null };
    function Test(props: Partial<DataGridPremiumProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={[{ field: 'group' }]}
            dataSource={dataSource}
            dataSourceCache={null}
            disableVirtualization
            rowGroupingModel={['group']}
            {...props}
          />
        </div>
      );
    }

    const { setProps } = render(<Test />);

    await waitFor(() => {
      expect(getRows.callCount).to.equal(1);
    });
    await waitFor(() => {
      expect(apiRef.current?.state.rows.loading).to.equal(false);
    });

    setProps({ rowGroupingModel: ['group', 'category'] });

    await waitFor(() => {
      expect(getRows.callCount).to.equal(2);
    });
    expect(apiRef.current?.state.rows.loading).to.equal(true);

    await act(async () => {
      resolveSecond({ rows: [{ id: 'A', group: 'A' }], rowCount: 1 });
    });

    await waitFor(() => {
      expect(apiRef.current?.state.rows.loading).to.equal(false);
    });
  });
});

describe.skipIf(isJSDOM)('<DataGridPremium /> - Data source row grouping', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

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
});
