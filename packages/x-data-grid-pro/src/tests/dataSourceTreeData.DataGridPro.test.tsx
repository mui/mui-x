import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor, within } from '@mui/internal-test-utils';
import { type RefObject } from '@mui/x-internals/types';
import {
  DataGridPro,
  type DataGridProProps,
  GRID_ROOT_GROUP_ID,
  type GridApi,
  type GridDataSource,
  type GridGetRowsParams,
  type GridGetRowsResponse,
  type GridGroupNode,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { spy } from 'sinon';
import { getCell, getRow } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

const dataSetOptions = {
  dataSet: 'Employee' as const,
  rowLength: 100,
  maxColumns: 3,
  treeData: { maxDepth: 2, groupingField: 'name', averageChildren: 5 },
};
const pageSizeOptions = [5, 10, 50];

const serverOptions = { minDelay: 0, maxDelay: 0, verbose: false };

// Needs layout
describe.skipIf(isJSDOM)('<DataGridPro /> - Data source tree data', () => {
  const { render } = createRenderer();
  const fetchRowsSpy = spy();

  let apiRef: RefObject<GridApi | null>;
  let mockServer: ReturnType<typeof useMockServer>;

  // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
  function Reset() {
    React.useLayoutEffect(() => {
      fetchRowsSpy.resetHistory();
    }, []);
    return null;
  }
  function TestDataSource(
    props: Partial<DataGridProProps> & {
      shouldRequestsFail?: boolean;
      onFetchRows?: typeof fetchRowsSpy;
      transformGetRowsResponse?: (
        rows: GridGetRowsResponse['rows'],
        params: GridGetRowsParams,
      ) => GridGetRowsResponse['rows'];
    },
  ) {
    apiRef = useGridApiRef();
    const {
      shouldRequestsFail = false,
      onFetchRows,
      transformGetRowsResponse: transformGetRowsResponseProp = (rows) => rows,
      ...otherProps
    } = props;
    const effectiveFetchRowsSpy = onFetchRows ?? fetchRowsSpy;
    mockServer = useMockServer(dataSetOptions, serverOptions, shouldRequestsFail);
    const { columns } = mockServer;

    const { fetchRows } = mockServer;

    const dataSource: GridDataSource = React.useMemo(() => {
      return {
        getRows: async (params: GridGetRowsParams) => {
          const urlParams = new URLSearchParams({
            paginationModel: JSON.stringify(params.paginationModel),
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            groupKeys: JSON.stringify(params.groupKeys),
          });

          const url = `https://mui.com/x/api/data-grid?${urlParams.toString()}`;
          effectiveFetchRowsSpy(url);
          const getRowsResponse = await fetchRows(url);

          return {
            rows: transformGetRowsResponseProp(getRowsResponse.rows, params),
            rowCount: getRowsResponse.rowCount,
          };
        },
        getGroupKey: (row) => row[dataSetOptions.treeData.groupingField],
        getChildrenCount: (row) => row.descendantCount,
      };
    }, [fetchRows, transformGetRowsResponseProp, effectiveFetchRowsSpy]);

    if (!mockServer.isReady) {
      return null;
    }

    return (
      <div style={{ width: 300, height: 300 }}>
        <Reset />
        <DataGridPro
          apiRef={apiRef}
          columns={columns}
          dataSource={dataSource}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 } }}
          pagination
          treeData
          pageSizeOptions={pageSizeOptions}
          disableVirtualization
          {...otherProps}
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
    const { setProps } = render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    setProps({ filterModel: { items: [{ field: 'name', value: 'John', operator: 'contains' }] } });
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });
  });

  it('should re-fetch the data on sort change', async () => {
    const { setProps } = render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    setProps({ sortModel: [{ field: 'name', sort: 'asc' }] });
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

  it('should periodically revalidate root rows when dataSourceRevalidateMs is set', async () => {
    const localFetchRowsSpy = spy();
    const { unmount } = render(
      <TestDataSource
        dataSourceCache={null}
        dataSourceRevalidateMs={1}
        onFetchRows={localFetchRowsSpy}
      />,
    );

    await waitFor(() => {
      expect(localFetchRowsSpy.callCount).to.be.greaterThan(0);
    });

    vi.useFakeTimers();
    localFetchRowsSpy.resetHistory();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(localFetchRowsSpy.callCount).to.be.greaterThan(1);

    vi.useRealTimers();
    unmount();
  });

  it('should periodically revalidate expanded nested rows when dataSourceRevalidateMs is set', async () => {
    const localFetchRowsSpy = spy();
    const { user, unmount } = render(
      <TestDataSource
        dataSourceCache={null}
        dataSourceRevalidateMs={1}
        onFetchRows={localFetchRowsSpy}
      />,
    );

    await waitFor(() => {
      expect(localFetchRowsSpy.callCount).to.equal(1);
    });

    await waitFor(() => expect(getRow(0)).not.to.be.undefined);
    const cell11 = getCell(0, 0);
    await user.click(within(cell11).getByRole('button'));

    await waitFor(() => {
      expect(localFetchRowsSpy.callCount).to.be.greaterThan(1);
    });

    vi.useFakeTimers();
    localFetchRowsSpy.resetHistory();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    const hasNestedGroupRequest = localFetchRowsSpy.getCalls().some((call) => {
      const url = new URL(call.firstArg as string);
      const groupKeys = JSON.parse(url.searchParams.get('groupKeys') || '[]');
      return groupKeys.length > 0;
    });

    expect(hasNestedGroupRequest).to.equal(true);

    vi.useRealTimers();
    unmount();
  });

  it('should keep selected nested rows selected during background nested revalidation', async () => {
    const { user, unmount } = render(
      <TestDataSource dataSourceCache={null} dataSourceRevalidateMs={1} />,
    );

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });

    await waitFor(() => expect(getRow(0)).not.to.be.undefined);
    const expandedRowId = (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode)
      .children[0];
    const cell11 = getCell(0, 0);
    await user.click(within(cell11).getByRole('button'));

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(1);
      const expandedNode = apiRef.current!.state.rows.tree[expandedRowId] as GridGroupNode;
      expect(expandedNode.children.length).to.be.greaterThan(0);
    });

    const firstChildId = (apiRef.current!.state.rows.tree[expandedRowId] as GridGroupNode)
      .children[0];
    act(() => {
      apiRef.current?.selectRow(firstChildId, true);
    });
    expect(apiRef.current!.isRowSelected(firstChildId)).to.equal(true);

    vi.useFakeTimers();
    fetchRowsSpy.resetHistory();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    const hasNestedGroupRequest = fetchRowsSpy.getCalls().some((call) => {
      const url = new URL(call.firstArg as string);
      const groupKeys = JSON.parse(url.searchParams.get('groupKeys') || '[]');
      return groupKeys.length > 0;
    });
    expect(hasNestedGroupRequest).to.equal(true);

    expect(apiRef.current!.isRowSelected(firstChildId)).to.equal(true);

    vi.useRealTimers();
    unmount();
  });

  it('should not set children loading state during background nested revalidation', async () => {
    const localFetchRowsSpy = spy();
    const { user, unmount } = render(
      <TestDataSource
        dataSourceCache={null}
        dataSourceRevalidateMs={1}
        onFetchRows={localFetchRowsSpy}
      />,
    );

    await waitFor(() => {
      expect(localFetchRowsSpy.callCount).to.equal(1);
    });

    await waitFor(() => expect(getRow(0)).not.to.be.undefined);
    const expandedRowId = (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode)
      .children[0];
    const cell11 = getCell(0, 0);
    await user.click(within(cell11).getByRole('button'));

    await waitFor(() => {
      expect(localFetchRowsSpy.callCount).to.be.greaterThan(1);
    });

    const setChildrenLoadingSpy = spy(apiRef.current!.dataSource, 'setChildrenLoading');

    vi.useFakeTimers();
    localFetchRowsSpy.resetHistory();
    setChildrenLoadingSpy.resetHistory();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    const hasNestedGroupRequest = localFetchRowsSpy.getCalls().some((call) => {
      const url = new URL(call.firstArg as string);
      const groupKeys = JSON.parse(url.searchParams.get('groupKeys') || '[]');
      return groupKeys.length > 0;
    });
    expect(hasNestedGroupRequest).to.equal(true);

    const hasLoadingTrueCall = setChildrenLoadingSpy
      .getCalls()
      .some((call) => call.args[0] === expandedRowId && call.args[1] === true);
    setChildrenLoadingSpy.restore();
    expect(hasLoadingTrueCall).to.equal(false);

    vi.useRealTimers();
    unmount();
  });

  it('should remove stale rows when re-fetching expanded nested rows', async () => {
    let hasTransformedTheNestedData = false;
    const testRowId = 'test-nested-row-id-1';
    const transformGetRowsResponse = (
      rows: GridGetRowsResponse['rows'],
      params: GridGetRowsParams,
    ) => {
      if (params.groupKeys?.length !== 1 || hasTransformedTheNestedData) {
        return rows;
      }

      hasTransformedTheNestedData = true;
      return rows.map((row, index) => {
        if (index === 1) {
          return { ...row, id: testRowId, name: `${row.name}-updated` };
        }
        return row;
      });
    };
    const { user } = render(
      <TestDataSource dataSourceCache={null} transformGetRowsResponse={transformGetRowsResponse} />,
    );

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });

    await waitFor(() => expect(getRow(0)).not.to.be.undefined);

    const expandedRowId = (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode)
      .children[0];
    const cell11 = getCell(0, 0);
    await user.click(within(cell11).getByRole('button'));

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
      expect(apiRef.current!.state.rows.tree[testRowId]).not.to.equal(undefined);
    });

    await act(async () => {
      await apiRef.current?.dataSource.fetchRows(expandedRowId);
    });

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(3);
      expect(apiRef.current!.state.rows.tree[testRowId]).to.equal(undefined);
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

  it('should keep the nested data visible after the root level re-fetch and remove any stale rows', async () => {
    // in the first call, one row ID will be updated
    // this ID will not be present in the repeated call and we will confirm that it is not in the tree anymore
    let hasTransformedTheData = false;
    const testRowId = 'test-row-id-1';
    const transformGetRowsResponse = (rows: GridGetRowsResponse['rows']) =>
      rows.map((row, index) => {
        // change the second row
        if (!hasTransformedTheData && index === 1) {
          hasTransformedTheData = true;
          return { ...row, id: testRowId, name: `${row.name}-updated` };
        }
        return row;
      });
    const { user } = render(
      <TestDataSource dataSourceCache={null} transformGetRowsResponse={transformGetRowsResponse} />,
    );

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });

    await waitFor(() => {
      expect(Object.keys(apiRef.current!.state.rows.tree).length).to.equal(10 + 1);
    });

    // the second row is part of the tree
    expect(apiRef.current!.state.rows.tree[testRowId]).not.to.equal(undefined);

    // expand the first row
    const cell11 = getCell(0, 0);
    await user.click(within(cell11).getByRole('button'));

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });

    // children are part of the tree
    const cell11ChildrenCount = Number(cell11.innerText.split('(')[1].split(')')[0]);
    expect(Object.keys(apiRef.current!.state.rows.tree).length).to.equal(
      10 + 1 + cell11ChildrenCount,
    );

    // refetch the root level
    act(() => {
      apiRef.current?.dataSource.fetchRows();
    });

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(3);
    });

    // children are still part of the tree
    expect(Object.keys(apiRef.current!.state.rows.tree).length).to.equal(
      10 + 1 + cell11ChildrenCount,
    );

    // test row is not part of the tree anymore
    expect(apiRef.current!.state.rows.tree[testRowId]).to.equal(undefined);
  });

  it('should collapse the nested data if refetching the root level with `keepChildrenExpanded` set to `false`', async () => {
    const { user } = render(<TestDataSource dataSourceCache={null} />);

    expect(fetchRowsSpy.callCount).to.equal(1);
    await waitFor(() => {
      expect(Object.keys(apiRef.current!.state.rows.tree).length).to.equal(10 + 1);
    });

    const cell11 = getCell(0, 0);
    await user.click(within(cell11).getByRole('button'));

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(1);
    });

    const cell11ChildrenCount = Number(cell11.innerText.split('(')[1].split(')')[0]);
    expect(Object.keys(apiRef.current!.state.rows.tree).length).to.equal(
      10 + 1 + cell11ChildrenCount,
    );

    fetchRowsSpy.resetHistory();

    act(() => {
      apiRef.current?.dataSource.fetchRows(undefined, { keepChildrenExpanded: false });
    });

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });

    expect(Object.keys(apiRef.current!.state.rows.tree).length).to.equal(10 + 1);
  });

  it('should fetch nested data when calling API method `dataSource.fetchRows`', async () => {
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

    await act(async () => {
      apiRef.current?.dataSource.fetchRows(firstChildId);
    });

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(1);
    });

    const cell11 = getCell(0, 0);
    const cell11ChildrenCount = Number(cell11.innerText.split('(')[1].split(')')[0]);
    expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(
      10 + 1 + cell11ChildrenCount,
    );
  });

  // https://github.com/mui/mui-x/issues/21263
  it('should not throw an error when non-sibling leaf rows share the same `groupKey` after data source change', async () => {
    const treeData: Record<string, any[]> = {
      '[]': [{ id: '1', name: 'Mark', descendantCount: 2 }],
      '["Mark"]': [
        { id: '2-1', name: 'Ryan', descendantCount: 1 },
        { id: '2-2', name: 'Jack', descendantCount: 1 },
      ],
      '["Mark","Ryan"]': [{ id: '2-1-1', name: 'John', descendantCount: 0 }],
      '["Mark","Jack"]': [{ id: '2-2-1', name: 'John', descendantCount: 0 }],
    };

    function TestComponent(props: { version?: number }) {
      apiRef = useGridApiRef();
      const { version = 0 } = props;

      const dataSource: GridDataSource = React.useMemo(
        () => ({
          getRows: async (params: GridGetRowsParams) => {
            const groupKeysString = JSON.stringify(params.groupKeys);
            const rows = treeData[groupKeysString] || [];
            return { rows, rowCount: rows.length, version };
          },
          getGroupKey: (row) => row.name,
          getChildrenCount: (row) => row.descendantCount,
        }),
        [version],
      );

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            apiRef={apiRef}
            columns={[{ field: 'name' }]}
            dataSource={dataSource}
            treeData
            defaultGroupingExpansionDepth={-1}
            disableVirtualization
          />
        </div>
      );
    }

    const { setProps } = render(<TestComponent />);

    // Wait for all nodes to be loaded, including the deeply nested leaf "Jhon" nodes
    await waitFor(() => {
      expect(apiRef.current!.state.rows.tree['2-1-1']).not.to.equal(undefined);
      expect(apiRef.current!.state.rows.tree['2-2-1']).not.to.equal(undefined);
    });

    // Trigger data source recomputation by changing the version prop.
    // This creates a new dataSource object, causing a full tree rebuild.
    setProps({ version: 1 });

    // Should NOT throw
    await waitFor(() => {
      expect(apiRef.current!.state.rows.tree['2-1-1']).not.to.equal(undefined);
      expect(apiRef.current!.state.rows.tree['2-2-1']).not.to.equal(undefined);
    });
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
          // eslint-disable-next-line vitest/no-conditional-expect
          expect(apiRef.current?.state.rows.groupsToFetch).to.include(child);
        }
      },
    );
  });
});
