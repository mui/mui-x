import * as React from 'react';
import { createRenderer, waitFor, within } from '@mui/internal-test-utils';
import { type RefObject } from '@mui/x-internals/types';
import {
  DataGridPremium,
  type DataGridPremiumProps,
  type GridApi,
  type GridDataSource,
  type GridGetRowsParams,
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
