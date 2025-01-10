import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { createRenderer, waitFor, within } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { RefObject } from '@mui/x-internals/types';
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
import { SinonStub, stub } from 'sinon';
import { getCell } from 'test/utils/helperFn';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import useLazyRef from '@mui/utils/useLazyRef';

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

  let apiRef: RefObject<GridApi | null>;
  let fetchRowsSpy: SinonStub;
  let mockServer: ReturnType<typeof useMockServer>;

  function TestDataSource(props: Partial<DataGridProProps> & { shouldRequestsFail?: boolean }) {
    apiRef = useGridApiRef();
    mockServer = useMockServer(dataSetOptions, serverOptions, props.shouldRequestsFail ?? false);
    const { columns } = mockServer;

    // Reuse the same stub between rerenders to properly count the calls
    fetchRowsSpy = useLazyRef(() => stub()).current;

    const originalFetchRows = mockServer.fetchRows;
    const fetchRows = React.useMemo<typeof originalFetchRows>(() => {
      fetchRowsSpy.callsFake(originalFetchRows);
      return (...args) => fetchRowsSpy(...args);
    }, [originalFetchRows]);

    const dataSource: GridDataSource = React.useMemo(
      () => ({
        getRows: async (params: GridGetRowsParams) => {
          const urlParams = new URLSearchParams({
            paginationModel: JSON.stringify(params.paginationModel),
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            groupKeys: JSON.stringify(params.groupKeys),
          });

          const getRowsResponse = await fetchRows(
            `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
          );

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

    return (
      <div style={{ width: 300, height: 300 }}>
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

  // eslint-disable-next-line mocha/no-top-level-hooks
  beforeEach(() => {
    fetchRowsSpy?.reset();
  });

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
    apiRef.current.setFilterModel({
      items: [{ field: 'name', value: 'John', operator: 'contains' }],
    });
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });
  });

  it('should re-fetch the data on sort change', async () => {
    render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    apiRef.current.sortColumn('name', 'asc');
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });
  });

  it('should re-fetch the data on pagination change', async () => {
    const { setProps } = render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    setProps({ paginationModel: { page: 1, pageSize: 10 } });
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });
  });

  it('should fetch nested data when clicking on a dropdown', async () => {
    const { user } = render(<TestDataSource />);

    if (!apiRef.current?.state) {
      throw new Error('apiRef.current.state is not defined');
    }

    expect(fetchRowsSpy.callCount).to.equal(1);
    await waitFor(() => {
      expect(Object.keys(apiRef.current!.state.rows.tree).length).to.equal(10 + 1);
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

    if (!apiRef.current?.state) {
      throw new Error('apiRef.current.state is not defined');
    }

    expect(fetchRowsSpy.callCount).to.equal(1);

    await waitFor(() => {
      expect(Object.keys(apiRef.current!.state.rows.tree).length).to.equal(10 + 1);
    });

    const firstChildId = (apiRef.current.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode)
      .children[0];
    apiRef.current?.unstable_dataSource.fetchRows(firstChildId);

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

    if (!apiRef.current?.state) {
      throw new Error('apiRef.current.state is not defined');
    }

    expect(fetchRowsSpy.callCount).to.equal(1);
    await waitFor(() => {
      expect(apiRef.current!.state.rows.groupsToFetch?.length).to.be.greaterThan(0);
    });

    // All the group nodes belonging to the grid root group should be there for fetching
    (apiRef.current.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode).children.forEach(
      (child) => {
        const node = apiRef.current?.state.rows.tree[child];
        if (node?.type === 'group') {
          expect(apiRef.current?.state.rows.groupsToFetch).to.include(child);
        }
      },
    );
  });
});
