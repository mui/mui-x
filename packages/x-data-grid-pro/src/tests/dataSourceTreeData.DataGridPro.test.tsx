import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor, within } from '@mui/internal-test-utils';
import { RefObject } from '@mui/x-internals/types';
import { expect } from 'chai';
import {
  DataGridPro,
  DataGridProProps,
  GRID_ROOT_GROUP_ID,
  GridApi,
  GridDataSource,
  GridGetRowsParams,
  GridGroupNode,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { spy } from 'sinon';
import { getCell } from 'test/utils/helperFn';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';

const dataSetOptions = {
  dataSet: 'Employee' as const,
  rowLength: 100,
  maxColumns: 3,
  treeData: { maxDepth: 2, groupingField: 'name', averageChildren: 5 },
};
const pageSizeOptions = [5, 10, 50];

const serverOptions = { minDelay: 0, maxDelay: 0, verbose: false };

// Needs layout
describeSkipIf(isJSDOM)('<DataGridPro /> - Data source tree data', () => {
  const { render } = createRenderer();
  const fetchRowsSpy = spy();

  let apiRef: RefObject<GridApi>;
  let mockServer: ReturnType<typeof useMockServer>;

  // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
  function Reset() {
    React.useLayoutEffect(() => {
      fetchRowsSpy.resetHistory();
    }, []);
    return null;
  }

  function TestDataSource(props: Partial<DataGridProProps> & { shouldRequestsFail?: boolean }) {
    apiRef = useGridApiRef();
    mockServer = useMockServer(dataSetOptions, serverOptions, props.shouldRequestsFail ?? false);
    const { fetchRows, columns } = mockServer;

    const dataSource: GridDataSource = React.useMemo(
      () => ({
        getRows: async (params: GridGetRowsParams) => {
          const urlParams = new URLSearchParams({
            paginationModel: JSON.stringify(params.paginationModel),
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            groupKeys: JSON.stringify(params.groupKeys),
          });

          const url = `https://mui.com/x/api/data-grid?${urlParams.toString()}`;
          fetchRowsSpy(url);
          const getRowsResponse = await fetchRows(url);

          return {
            rows: getRowsResponse.rows,
            rowCount: getRowsResponse.rowCount,
          };
        },
        getGroupKey: (row) => row[dataSetOptions.treeData.groupingField],
        getChildrenCount: (row) => row.descendantCount,
      }),
      [fetchRows],
    );

    if (!mockServer.isReady) {
      return null;
    }

    return (
      <div style={{ width: 300, height: 300 }}>
        <Reset />
        <DataGridPro
          apiRef={apiRef}
          columns={columns}
          unstable_dataSource={dataSource}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 } }}
          pagination
          treeData
          pageSizeOptions={pageSizeOptions}
          disableVirtualization
          {...props}
        />
      </div>
    );
  }

  it('should fetch the data on initial render', async () => {
    render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
  });

  it('should re-fetch the data on filter change', async () => {
    render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    act(() => {
      apiRef.current.setFilterModel({
        items: [{ field: 'name', value: 'John', operator: 'contains' }],
      });
    });
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(1);
    });
  });

  it('should re-fetch the data on sort change', async () => {
    render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    act(() => {
      apiRef.current.setSortModel([{ field: 'name', sort: 'asc' }]);
    });
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(1);
    });
  });

  it('should re-fetch the data on pagination change', async () => {
    render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    act(() => {
      apiRef.current.setPaginationModel({ page: 1, pageSize: 10 });
    });
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(1);
    });
  });

  it('should fetch nested data when clicking on a dropdown', async () => {
    const { user } = render(<TestDataSource />);

    expect(fetchRowsSpy.callCount).to.equal(1);
    await waitFor(() => {
      expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(10 + 1);
    });

    const cell11 = getCell(0, 0);
    await user.click(within(cell11).getByRole('button'));

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });

    const cell11ChildrenCount = Number(cell11.innerText.split('(')[1].split(')')[0]);
    expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(
      10 + 1 + cell11ChildrenCount,
    );
  });

  it('should fetch nested data when calling API method `unstable_dataSource.fetchRows`', async () => {
    render(<TestDataSource />);
    expect(fetchRowsSpy.callCount).to.equal(1);

    await waitFor(() => {
      expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(10 + 1);
    });

    const firstChildId = (apiRef.current.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode)
      .children[0];
    apiRef.current.unstable_dataSource.fetchRows(firstChildId);

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });

    const cell11 = getCell(0, 0);
    const cell11ChildrenCount = Number(cell11.innerText.split('(')[1].split(')')[0]);
    expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(
      10 + 1 + cell11ChildrenCount,
    );
  });

  it('should lazily fetch nested data when using `defaultGroupingExpansionDepth`', async () => {
    render(<TestDataSource defaultGroupingExpansionDepth={1} />);

    expect(fetchRowsSpy.callCount).to.equal(1);
    await waitFor(() => {
      expect(apiRef.current.state.rows.groupsToFetch?.length).to.be.greaterThan(0);
    });

    // All the group nodes belonging to the grid root group should be there for fetching
    (apiRef.current.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode).children.forEach(
      (child) => {
        const node = apiRef.current.state.rows.tree[child];
        if (node.type === 'group') {
          expect(apiRef.current.state.rows.groupsToFetch).to.include(child);
        }
      },
    );
  });
});
