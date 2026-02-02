import * as React from 'react';
import { type RefObject } from '@mui/x-internals/types';
import { useMockServer } from '@mui/x-data-grid-generator';
import { createRenderer, waitFor, within } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  type DataGridPremiumProps,
  type GridApi,
  type GridDataSource,
  type GridGetRowsResponse,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { spy } from 'sinon';
import { getCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

// Tests for https://github.com/mui/mui-x/issues/20974
// Server-side sorting/filtering should work correctly with row grouping
describe.skipIf(isJSDOM)('<DataGridPremium /> - Data source row grouping', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;
  const fetchRowsSpy = spy();

  function Reset() {
    React.useLayoutEffect(() => {
      fetchRowsSpy.resetHistory();
    }, []);
    return null;
  }

  function TestDataSourceRowGrouping(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    const { fetchRows, columns, isReady } = useMockServer<GridGetRowsResponse>(
      {
        dataSet: 'Movies',
        rowLength: 100,
        maxColumns: undefined,
      },
      { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false },
    );

    const dataSource: GridDataSource = React.useMemo(() => {
      return {
        getRows: async (params) => {
          const urlParams = new URLSearchParams({
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            paginationModel: JSON.stringify(params.paginationModel),
            groupKeys: JSON.stringify(params.groupKeys),
            groupFields: JSON.stringify(params.groupFields),
          });

          fetchRowsSpy({
            groupKeys: params.groupKeys,
            sortModel: params.sortModel,
            filterModel: params.filterModel,
          });

          const getRowsResponse = await fetchRows(
            `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
          );

          return {
            rows: getRowsResponse.rows,
            rowCount: getRowsResponse.rowCount,
          };
        },
        getGroupKey: (row) => row.group,
        getChildrenCount: (row) => row.descendantCount,
      };
    }, [fetchRows]);

    if (!isReady) {
      return null;
    }

    return (
      <div style={{ width: 500, height: 400 }}>
        <Reset />
        <DataGridPremium
          apiRef={apiRef}
          dataSource={dataSource}
          columns={columns}
          disableVirtualization
          dataSourceCache={null}
          initialState={{
            rowGrouping: { model: ['company'] },
          }}
          {...props}
        />
      </div>
    );
  }

  describe('sorting with expanded groups', () => {
    it('should re-fetch children when sort model changes and groups are expanded', async () => {
      const { user, setProps } = render(<TestDataSourceRowGrouping />);

      // Wait for initial root fetch
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      // Verify initial fetch was for root level (empty groupKeys)
      expect(fetchRowsSpy.lastCall.args[0].groupKeys).to.deep.equal([]);

      // Expand a group by clicking the expand button
      const cell = getCell(0, 0);
      await user.click(within(cell).getByRole('button'));

      // Wait for children fetch
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      // Verify children fetch had non-empty groupKeys
      const childFetchCall = fetchRowsSpy.lastCall.args[0];
      expect(childFetchCall.groupKeys.length).to.be.greaterThan(0);

      const expandedGroupKey = childFetchCall.groupKeys[0];

      // Now change the sort model
      setProps({ sortModel: [{ field: 'gross', sort: 'desc' }] });

      // Wait for re-fetches - should fetch both root and expanded children
      await waitFor(() => {
        // At least 2 more calls: root + expanded children
        expect(fetchRowsSpy.callCount).to.be.greaterThanOrEqual(4);
      });

      // Verify that children were re-fetched with the new sort model
      const sortedChildFetch = fetchRowsSpy.getCalls().find(
        (call) =>
          call.args[0].groupKeys?.length > 0 &&
          call.args[0].sortModel?.[0]?.field === 'gross',
      );
      expect(sortedChildFetch).to.not.equal(undefined);
      expect(sortedChildFetch?.args[0].groupKeys).to.deep.equal([expandedGroupKey]);
      expect(sortedChildFetch?.args[0].sortModel).to.deep.equal([{ field: 'gross', sort: 'desc' }]);
    });

    it('should re-fetch children when filter model changes and groups are expanded', async () => {
      const { user, setProps } = render(<TestDataSourceRowGrouping />);

      // Wait for initial root fetch
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      // Expand a group
      const cell = getCell(0, 0);
      await user.click(within(cell).getByRole('button'));

      // Wait for children fetch
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      const childFetchCall = fetchRowsSpy.lastCall.args[0];
      const expandedGroupKey = childFetchCall.groupKeys[0];

      // Change the filter model
      setProps({
        filterModel: { items: [{ field: 'year', operator: '>', value: 2010 }] },
      });

      // Wait for re-fetches - should fetch both root and expanded children
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.be.greaterThanOrEqual(4);
      });

      // Verify that children were re-fetched with the new filter model
      const filteredChildFetch = fetchRowsSpy.getCalls().find(
        (call) =>
          call.args[0].groupKeys?.length > 0 &&
          call.args[0].filterModel?.items?.length > 0,
      );
      expect(filteredChildFetch).to.not.equal(undefined);
      expect(filteredChildFetch?.args[0].groupKeys).to.deep.equal([expandedGroupKey]);
    });

    it('should re-fetch nested children when sort model changes with multiple levels expanded', async () => {
      const { user, setProps } = render(
        <TestDataSourceRowGrouping
          initialState={{
            rowGrouping: { model: ['company', 'director'] },
          }}
        />,
      );

      // Wait for initial root fetch
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      // Expand first level group
      const cell = getCell(0, 0);
      await user.click(within(cell).getByRole('button'));

      // Wait for first level children fetch
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      // Expand second level group (first child)
      await waitFor(async () => {
        const nestedCell = getCell(1, 0);
        const expandButton = within(nestedCell).queryByRole('button');
        if (expandButton) {
          await user.click(expandButton);
        }
      });

      // Wait for second level children fetch
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.be.greaterThanOrEqual(3);
      });

      const callCountBeforeSort = fetchRowsSpy.callCount;

      // Change the sort model
      setProps({ sortModel: [{ field: 'gross', sort: 'asc' }] });

      // Wait for all re-fetches
      await waitFor(() => {
        // Should have more calls than before for root + all expanded levels
        expect(fetchRowsSpy.callCount).to.be.greaterThan(callCountBeforeSort + 1);
      });

      // Verify sort model is passed in the re-fetch calls
      const sortedCalls = fetchRowsSpy.getCalls().filter(
        (call) => call.args[0].sortModel?.[0]?.field === 'gross',
      );
      expect(sortedCalls.length).to.be.greaterThan(0);
    });
  });
});
