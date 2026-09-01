import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor, within } from '@mui/internal-test-utils';
import { actSleep, getCell, getRow } from 'test/utils/helperFn';
import type { RefObject } from '@mui/x-internals/types';
import { DataGridPro, useGridApiRef, GRID_ROOT_GROUP_ID } from '@mui/x-data-grid-pro';
import type {
  DataGridProProps,
  GridApi,
  GridDataSource,
  GridGetRowsParams,
  GridFilterItem,
  GridGetRowsResponse,
  GridDataSourceGroupNode,
  GridGroupNode,
  GridRowSelectionModel,
} from '@mui/x-data-grid-pro';
import { isJSDOM } from 'test/utils/skipIf';
import { TestCache } from '@mui/x-data-grid/internals';
import { describe, it, expect, vi, onTestFinished, beforeEach } from 'vitest';

// Needs layout
describe.skipIf(isJSDOM)('<DataGridPro /> - Data source lazy loader', () => {
  const { render } = createRenderer();
  const defaultTransformGetRowsResponse = (response: GridGetRowsResponse) => response;
  const fetchRowsSpy = vi.fn();

  let transformGetRowsResponse: (response: GridGetRowsResponse) => GridGetRowsResponse;
  let apiRef: RefObject<GridApi | null>;
  let mockServer: ReturnType<typeof useMockServer>;

  const scrollEndThreshold = 60;
  const rowHeight = 50;
  const columnHeaderHeight = 50;
  const gridHeight =
    4 * rowHeight +
    columnHeaderHeight +
    // border
    2;

  // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
  function Reset() {
    React.useLayoutEffect(() => {
      fetchRowsSpy.mockClear();
    }, []);
    return null;
  }

  function TestDataSourceLazyLoader(
    props: Partial<DataGridProProps> & {
      mockServerRowCount?: number;
      onFetchRows?: typeof fetchRowsSpy;
    },
  ) {
    const { mockServerRowCount, onFetchRows, ...other } = props;
    const effectiveFetchRowsSpy = onFetchRows ?? fetchRowsSpy;
    apiRef = useGridApiRef();
    mockServer = useMockServer(
      { rowLength: mockServerRowCount ?? 100, maxColumns: 1 },
      { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false },
    );

    const { fetchRows } = mockServer;

    const dataSource: GridDataSource = React.useMemo(() => {
      return {
        getRows: async (params: GridGetRowsParams) => {
          const urlParams = new URLSearchParams({
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            start: `${params.start}`,
            end: `${params.end}`,
          });

          const url = `https://mui.com/x/api/data-grid?${urlParams.toString()}`;
          effectiveFetchRowsSpy(url);
          const getRowsResponse = await fetchRows(url);

          const response = transformGetRowsResponse(getRowsResponse);
          return {
            rows: response.rows,
            rowCount: response.rowCount,
            pageInfo: response.pageInfo, // allow tests to exercise `hasNextPage`
          };
        },
      };
    }, [fetchRows, effectiveFetchRowsSpy]);

    if (!mockServer.isReady) {
      return null;
    }

    return (
      <div style={{ width: 300, height: gridHeight }}>
        <Reset />
        <DataGridPro
          apiRef={apiRef}
          columns={mockServer.columns}
          dataSource={dataSource}
          lazyLoading
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 } }}
          disableVirtualization
          scrollEndThreshold={scrollEndThreshold}
          rowHeight={rowHeight}
          columnHeaderHeight={columnHeaderHeight}
          {...other}
        />
      </div>
    );
  }

  beforeEach(() => {
    transformGetRowsResponse = defaultTransformGetRowsResponse;
  });

  it('should load the first page initially', async () => {
    render(<TestDataSourceLazyLoader />);
    await waitFor(() => {
      expect(fetchRowsSpy.mock.calls.length).to.equal(1);
    });
  });

  it('should re-fetch the data once if multiple models have changed', async () => {
    const { setProps } = render(<TestDataSourceLazyLoader />);
    await waitFor(() => {
      expect(fetchRowsSpy.mock.calls.length).to.equal(1);
    });

    setProps({
      sortModel: [{ field: 'id', sort: 'asc' }],
      filterModel: { items: [{ field: 'id', value: 'abc', operator: 'doesNotContain' }] },
    });

    await waitFor(() => {
      expect(fetchRowsSpy.mock.calls.length).to.equal(2);
    });
  });

  describe('incomplete filter items', () => {
    const upsertFilterItem = async (item: GridFilterItem) => {
      await act(async () => {
        apiRef.current!.upsertFilterItem(item);
      });
    };

    // See https://github.com/mui/mui-x/issues/23243
    it('should not send a filter item without a value to the data source', async () => {
      render(<TestDataSourceLazyLoader dataSourceCache={null} />);
      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(1);
      });

      await upsertFilterItem({ id: 1, field: 'id', operator: 'contains', value: '1' });
      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(2);
      });

      await upsertFilterItem({ id: 1, field: 'id', operator: 'contains' });

      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(3);
      });
      const url = new URL(fetchRowsSpy.mock.lastCall?.[0]);
      expect(JSON.parse(url.searchParams.get('filterModel')!).items).to.deep.equal([]);
    });

    it('should not re-fetch when the change only adds an incomplete item', async () => {
      render(<TestDataSourceLazyLoader dataSourceCache={null} />);
      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(1);
      });

      await upsertFilterItem({ id: 1, field: 'id', operator: 'contains' });
      await actSleep(50);

      expect(fetchRowsSpy.mock.calls.length).to.equal(1);
    });
  });

  it('should keep the selection state on scroll', async () => {
    let rowSelectionModel: GridRowSelectionModel = {
      type: 'include',
      ids: new Set(),
    };

    function TestCase() {
      const handleSelectionChange: DataGridProProps['onRowSelectionModelChange'] = (newModel) => {
        rowSelectionModel = newModel;
      };

      return (
        <TestDataSourceLazyLoader
          onRowSelectionModelChange={handleSelectionChange}
          disableVirtualization={false}
        />
      );
    }

    render(<TestCase />);
    // wait until the rows are rendered
    await waitFor(() => expect(getRow(0)).not.to.be.undefined);

    expect(Array.from(rowSelectionModel.ids).length).to.equal(0);
    await act(async () => apiRef.current?.selectRow(getCell(1, 0).textContent!));
    expect(Array.from(rowSelectionModel.ids).length).to.equal(1);

    // arbitrary number to make sure that the bottom of the grid window is reached.
    await act(async () => apiRef.current?.scroll({ top: 12345 }));

    // wait until the row is not in the render context anymore
    await waitFor(() => expect(() => getRow(1)).to.throw());

    // selection is kept
    expect(Array.from(rowSelectionModel.ids).length).to.equal(1);
  });

  describe('Viewport loading', () => {
    it('should render skeleton rows if rowCount is bigger than the number of rows', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // The 11th row should be a skeleton
      expect(getRow(10).dataset.id).to.equal('auto-generated-skeleton-row-root-10');
    });

    it('should make a new data source request once the skeleton rows are in the render context', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // reset the spy call count
      fetchRowsSpy.mockClear();

      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 10 }));

      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(1);
      });
    });

    it('should reset the scroll position when sorting is applied', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      const initialSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      expect(initialSearchParams.get('end')).to.equal('9');

      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 10 }));

      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(2);
      });

      const beforeSortSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      expect(beforeSortSearchParams.get('end')).not.to.equal('9');

      await act(async () => apiRef.current?.sortColumn(mockServer.columns[0].field, 'asc'));

      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(3);
      });

      const afterSortSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      expect(afterSortSearchParams.get('end')).to.equal('9');
    });

    it('should reset the scroll position when filter is applied', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 10 }));

      // wait until the rows are rendered
      await waitFor(() => expect(fetchRowsSpy.mock.calls.length).to.equal(2));

      const beforeFilteringSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      // first row is not the first page anymore
      expect(beforeFilteringSearchParams.get('start')).to.equal('10');

      await act(async () => {
        apiRef.current?.setFilterModel({
          items: [
            {
              field: mockServer.columns[0].field,
              value: '0',
              operator: 'contains',
            },
          ],
        });
      });

      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(3);
      });

      const afterFilteringSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      // first row is the start of the first page
      expect(afterFilteringSearchParams.get('start')).to.equal('0');
    });

    it('should not refetch already fetched rows on scroll-back when cache entry is still valid', async () => {
      render(<TestDataSourceLazyLoader mockServerRowCount={20} disableVirtualization={false} />);
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      vi.useFakeTimers();
      fetchRowsSpy.mockClear();

      await act(async () => {
        apiRef.current?.publishEvent('renderedRowsIntervalChange', {
          firstRowIndex: 1,
          lastRowIndex: 5,
          firstColumnIndex: 0,
          lastColumnIndex: 0,
        });
        await vi.advanceTimersByTimeAsync(700);
      });

      expect(fetchRowsSpy.mock.calls.length).to.equal(0);
      vi.useRealTimers();
    });

    it('should not refetch during polling when cache entry is still valid', async () => {
      const localFetchRowsSpy = vi.fn();
      render(
        <TestDataSourceLazyLoader
          mockServerRowCount={20}
          disableVirtualization={false}
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      vi.useFakeTimers();
      localFetchRowsSpy.mockClear();

      await act(async () => {
        apiRef.current?.publishEvent('renderedRowsIntervalChange', {
          firstRowIndex: 0,
          lastRowIndex: 3,
          firstColumnIndex: 0,
          lastColumnIndex: 0,
        });
        await vi.advanceTimersByTimeAsync(50);
      });

      expect(localFetchRowsSpy.mock.calls.length).to.equal(0);
      vi.useRealTimers();
    });

    it('should use the current viewport range when fetchRows is called via the API without params', async () => {
      render(<TestDataSourceLazyLoader dataSourceCache={null} disableVirtualization={false} />);
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // Scroll far enough so the viewport start is past the first page boundary
      // (adjustRowParams aligns to pageSize=10, so firstRowIndex must be >= 10)
      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 30 }));

      // Wait for the scroll-triggered fetches to complete
      await waitFor(() => {
        const lastUrl = fetchRowsSpy.mock.lastCall?.[0];
        if (!lastUrl) {
          return;
        }
        const params = new URL(lastUrl).searchParams;
        expect(Number(params.get('start'))).to.be.greaterThan(0);
      });

      fetchRowsSpy.mockClear();

      // Call fetchRows without explicit params
      act(() => {
        apiRef.current?.dataSource.fetchRows();
      });

      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(1);
      });

      // The request should use viewport-based start, not the default page 0
      const searchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      const start = Number(searchParams.get('start'));
      expect(start).to.be.greaterThan(0);
    });

    it('should periodically revalidate the current range when dataSourceRevalidateMs is set', async () => {
      const localFetchRowsSpy = vi.fn();
      render(
        <TestDataSourceLazyLoader
          mockServerRowCount={20}
          disableVirtualization={false}
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);
      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 10 }));
      await waitFor(() => expect(getRow(19)).not.to.be.undefined);

      localFetchRowsSpy.mockClear();

      await waitFor(() => {
        expect(localFetchRowsSpy.mock.calls.length).to.be.greaterThan(1);
      });
    });

    it('should remove rows dropped by the server on revalidation', async () => {
      let dropRows = false;
      transformGetRowsResponse = (response: GridGetRowsResponse) => {
        if (!dropRows) {
          return response;
        }
        return {
          rows: response.rows.slice(0, Math.max(response.rows.length - 1, 0)),
          rowCount: (response.rowCount ?? 0) - 1,
        };
      };
      render(
        <TestDataSourceLazyLoader
          mockServerRowCount={12}
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={vi.fn()}
        />,
      );
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);
      dropRows = true;

      await waitFor(() => {
        expect(
          apiRef.current!.getRowNode<GridGroupNode>(GRID_ROOT_GROUP_ID)!.children.length,
        ).to.equal(11);
      });
    });
  });

  describe('Nested viewport loading', () => {
    type TreeRow = {
      id: string;
      name: string;
      value: number;
      childrenCount: number;
    };

    const treeRows: Record<string, Omit<TreeRow, 'value'>[]> = {
      '[]': [
        { id: 'A', name: 'A', childrenCount: 2 },
        { id: 'B', name: 'B', childrenCount: 0 },
        { id: 'C', name: 'C', childrenCount: 0 },
        { id: 'D', name: 'D', childrenCount: 0 },
        { id: 'E', name: 'E', childrenCount: 0 },
        { id: 'F', name: 'F', childrenCount: 0 },
        { id: 'G', name: 'G', childrenCount: 0 },
        { id: 'H', name: 'H', childrenCount: 0 },
        { id: 'I', name: 'I', childrenCount: 0 },
        { id: 'J', name: 'J', childrenCount: 0 },
        { id: 'K', name: 'K', childrenCount: 2 },
        { id: 'L', name: 'L', childrenCount: 0 },
      ],
      '["A"]': [
        { id: 'A-0', name: 'A-0', childrenCount: 0 },
        { id: 'A-1', name: 'A-1', childrenCount: 0 },
      ],
      '["K"]': [
        { id: 'K-0', name: 'K-0', childrenCount: 0 },
        { id: 'K-1', name: 'K-1', childrenCount: 0 },
      ],
    };

    function TestNestedDataSourceLazyLoader(
      props: Partial<DataGridProProps> & {
        onFetchRows: (params: GridGetRowsParams) => void;
        transformRows?: (
          rows: TreeRow[],
          params: GridGetRowsParams,
          requestCount: number,
        ) => TreeRow[];
      },
    ) {
      const { onFetchRows, transformRows = (rows) => rows, ...other } = props;
      const requestCountRef = React.useRef(0);
      apiRef = useGridApiRef();

      const dataSource: GridDataSource = React.useMemo(
        () => ({
          getRows: async (params: GridGetRowsParams) => {
            requestCountRef.current += 1;
            onFetchRows(params);

            const groupKeys = params.groupKeys ?? [];
            const allRows = (treeRows[JSON.stringify(groupKeys)] ?? []).map((row) => ({
              ...row,
              value: requestCountRef.current,
            }));
            const start = typeof params.start === 'number' ? params.start : 0;
            const end = typeof params.end === 'number' ? params.end : allRows.length - 1;
            const rows = transformRows(allRows, params, requestCountRef.current);

            return {
              rows: rows.slice(start, end + 1),
              rowCount: rows.length,
            };
          },
          getGroupKey: (row) => row.name,
          getChildrenCount: (row) => row.childrenCount,
        }),
        [onFetchRows, transformRows],
      );

      return (
        <div style={{ width: 300, height: gridHeight }}>
          <DataGridPro
            apiRef={apiRef}
            columns={[
              { field: 'name', width: 160 },
              { field: 'value', width: 120 },
            ]}
            dataSource={dataSource}
            lazyLoading
            treeData
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 },
            }}
            rowHeight={rowHeight}
            columnHeaderHeight={columnHeaderHeight}
            disableVirtualization={false}
            {...other}
          />
        </div>
      );
    }

    it('should keep loaded root rows at their real index after a scroll jump', async () => {
      const ROOT_ROW_COUNT = 100;
      const rootRows = Array.from({ length: ROOT_ROW_COUNT }, (_, index) => ({
        id: `row-${index}`,
        name: `Row ${index}`,
        childrenCount: 0,
      }));

      function TestGapCase() {
        apiRef = useGridApiRef();
        const dataSource: GridDataSource = React.useMemo(
          () => ({
            getRows: async (params: GridGetRowsParams) => {
              if ((params.groupKeys ?? []).length > 0) {
                return { rows: [], rowCount: 0 };
              }
              const start = typeof params.start === 'number' ? params.start : 0;
              const end = typeof params.end === 'number' ? params.end : rootRows.length - 1;
              return { rows: rootRows.slice(start, end + 1), rowCount: rootRows.length };
            },
            getGroupKey: (row) => row.name,
            getChildrenCount: (row) => row.childrenCount,
          }),
          [],
        );

        return (
          <div style={{ width: 300, height: gridHeight }}>
            <DataGridPro
              apiRef={apiRef}
              columns={[{ field: 'name', width: 200 }]}
              dataSource={dataSource}
              dataSourceCache={null}
              lazyLoading
              treeData
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 },
              }}
              rowHeight={rowHeight}
              columnHeaderHeight={columnHeaderHeight}
              disableVirtualization={false}
            />
          </div>
        );
      }

      render(<TestGapCase />);

      // The first page of root rows loads at the top.
      await waitFor(() => expect(apiRef.current!.getRow('row-0')).not.to.equal(null));

      const getRootChildren = () =>
        (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode).children;

      // Jump straight to the middle, skipping the rows in between so they stay skeletons.
      await act(async () => {
        apiRef.current?.scroll({ top: 50 * rowHeight });
      });

      // The row scrolled into view gets fetched.
      await waitFor(() => expect(apiRef.current!.getRow('row-50')).not.to.equal(null));

      const rootChildren = getRootChildren();
      // The loaded row must stay at index 50, with the unfetched range above it still skeletons.
      expect(rootChildren.length).to.equal(ROOT_ROW_COUNT);
      expect(rootChildren.indexOf('row-50')).to.equal(50);
      expect(rootChildren[50]).to.equal('row-50');
    });

    it('should not re-apply stale expansion from before a sort to a later manual expansion', async () => {
      // Three levels: G1 → G1a → G1a-leaf, plus leaf siblings to fill the viewport.
      const deepTreeRows: Record<string, { id: string; name: string; childrenCount: number }[]> = {
        '[]': [
          { id: 'G1', name: 'G1', childrenCount: 1 },
          { id: 'S1', name: 'S1', childrenCount: 0 },
          { id: 'S2', name: 'S2', childrenCount: 0 },
        ],
        '["G1"]': [{ id: 'G1a', name: 'G1a', childrenCount: 1 }],
        '["G1","G1a"]': [{ id: 'G1a-leaf', name: 'G1a-leaf', childrenCount: 0 }],
      };

      function TestDeepNestedLazy() {
        apiRef = useGridApiRef();
        const dataSource: GridDataSource = React.useMemo(
          () => ({
            getRows: async (params: GridGetRowsParams) => {
              const rows = deepTreeRows[JSON.stringify(params.groupKeys ?? [])] ?? [];
              const start = typeof params.start === 'number' ? params.start : 0;
              const end = typeof params.end === 'number' ? params.end : rows.length - 1;
              return { rows: rows.slice(start, end + 1), rowCount: rows.length };
            },
            getGroupKey: (row) => row.name,
            getChildrenCount: (row) => row.childrenCount,
          }),
          [],
        );

        return (
          <div style={{ width: 300, height: gridHeight }}>
            <DataGridPro
              apiRef={apiRef}
              columns={[{ field: 'name', width: 200 }]}
              dataSource={dataSource}
              dataSourceCache={null}
              lazyLoading
              treeData
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 },
              }}
              rowHeight={rowHeight}
              columnHeaderHeight={columnHeaderHeight}
              disableVirtualization={false}
            />
          </div>
        );
      }

      render(<TestDeepNestedLazy />);
      await waitFor(() => expect(apiRef.current!.getRow('G1')).not.to.equal(null));

      // Expand the full chain so G1a is expanded before the sort snapshot is taken.
      await act(async () => apiRef.current?.setRowChildrenExpansion('G1', true));
      await waitFor(() => expect(apiRef.current!.getRow('G1a')).not.to.equal(null));
      await act(async () => apiRef.current?.setRowChildrenExpansion('G1a', true));
      await waitFor(() => expect(apiRef.current!.getRow('G1a-leaf')).not.to.equal(null));

      // Sort: the tree is reset and the prior expansion is restored from the snapshot.
      await act(async () => apiRef.current?.sortColumn('name', 'asc'));
      await waitFor(() => expect(apiRef.current!.getRow('G1a-leaf')).not.to.equal(null));

      // Manually collapse, then re-expand G1.
      await act(async () => apiRef.current?.setRowChildrenExpansion('G1', false));
      await waitFor(() => expect(apiRef.current!.getRow('G1a')).to.equal(null));
      await act(async () => apiRef.current?.setRowChildrenExpansion('G1', true));
      await waitFor(() => expect(apiRef.current!.getRow('G1a')).not.to.equal(null));

      // The manual re-expansion must use the configured defaults (collapsed), not the
      // pre-sort snapshot that had `G1a` expanded.
      expect(apiRef.current!.getRowNode<GridGroupNode>('G1a')!.childrenExpanded).to.equal(false);
      expect(apiRef.current!.getRow('G1a-leaf')).to.equal(null);
    });

    it('should periodically revalidate root rows when dataSourceRevalidateMs is set', async () => {
      const localFetchRowsSpy = vi.fn();
      render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      localFetchRowsSpy.mockClear();

      await waitFor(() => {
        expect(localFetchRowsSpy.mock.calls.length).to.be.greaterThan(1);
      });
      const rootRequest = localFetchRowsSpy.mock.calls.find((call) => {
        const params = call[0] as GridGetRowsParams;
        return params.groupKeys?.length === 0;
      })?.[0] as GridGetRowsParams | undefined;
      expect(rootRequest).not.to.equal(undefined);
      expect(rootRequest?.start).to.equal(0);
      expect(rootRequest?.end).to.equal(9);
    });

    it('should lazy load children for default-expanded tree data groups', async () => {
      const localFetchRowsSpy = vi.fn();
      render(
        <TestNestedDataSourceLazyLoader
          defaultGroupingExpansionDepth={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => {
        expect(apiRef.current!.getRow('A-0')).not.to.equal(null);
      });

      const parentNode = apiRef.current!.getRowNode<GridGroupNode>('A')!;
      expect(parentNode.childrenExpanded).to.equal(true);

      const nestedRequest = localFetchRowsSpy.mock.calls.find((call) => {
        const params = call[0] as GridGetRowsParams;
        return JSON.stringify(params.groupKeys) === JSON.stringify(['A']);
      })?.[0] as GridGetRowsParams | undefined;
      expect(nestedRequest).not.to.equal(undefined);
    });

    it('should apply default expansion to tree data groups loaded while scrolling', async () => {
      const localFetchRowsSpy = vi.fn();
      render(
        <TestNestedDataSourceLazyLoader
          defaultGroupingExpansionDepth={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(apiRef.current!.getRow('A')).not.to.equal(null));
      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 10 }));

      await waitFor(() => {
        expect(apiRef.current!.getRow('K-0')).not.to.equal(null);
      });

      const scrolledParentNode = apiRef.current!.getRowNode<GridGroupNode>('K')!;
      expect(scrolledParentNode.childrenExpanded).to.equal(true);

      const scrolledNestedRequest = localFetchRowsSpy.mock.calls.find((call) => {
        const params = call[0] as GridGetRowsParams;
        return JSON.stringify(params.groupKeys) === JSON.stringify(['K']);
      })?.[0] as GridGetRowsParams | undefined;
      expect(scrolledNestedRequest).not.to.equal(undefined);
    });

    it('should use isGroupExpandedByDefault for lazy-loaded tree data groups', async () => {
      const localFetchRowsSpy = vi.fn();
      const isGroupExpandedByDefault = vi.fn((node: GridGroupNode) => node.id === 'K');
      render(
        <TestNestedDataSourceLazyLoader
          defaultGroupingExpansionDepth={-1}
          isGroupExpandedByDefault={isGroupExpandedByDefault}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(apiRef.current!.getRow('A')).not.to.equal(null));

      const firstParentNode = apiRef.current!.getRowNode<GridGroupNode>('A')!;
      expect(firstParentNode.childrenExpanded).to.equal(false);
      expect(apiRef.current!.getRow('A-0')).to.equal(null);

      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 10 }));

      await waitFor(() => {
        expect(apiRef.current!.getRow('K-0')).not.to.equal(null);
      });

      const scrolledParentNode = apiRef.current!.getRowNode<GridGroupNode>('K')!;
      expect(scrolledParentNode.childrenExpanded).to.equal(true);
      expect(isGroupExpandedByDefault.mock.calls.length).to.be.greaterThan(0);
    });

    [
      {
        label: 'sorting',
        updateModel: () => apiRef.current!.setSortModel([{ field: 'name', sort: 'desc' }]),
        isMatchingRequest: (params: GridGetRowsParams) =>
          params.sortModel[0]?.field === 'name' && params.sortModel[0]?.sort === 'desc',
      },
      {
        label: 'filtering',
        updateModel: () =>
          apiRef.current!.setFilterModel({
            items: [{ field: 'name', operator: 'contains', value: 'A' }],
          }),
        isMatchingRequest: (params: GridGetRowsParams) =>
          params.filterModel.items[0]?.field === 'name' &&
          params.filterModel.items[0]?.value === 'A',
      },
    ].forEach(({ label, updateModel, isMatchingRequest }) => {
      it(`should preserve expanded tree data groups and fetch children after ${label}`, async () => {
        const localFetchRowsSpy = vi.fn();
        const { user } = render(
          <TestNestedDataSourceLazyLoader dataSourceCache={null} onFetchRows={localFetchRowsSpy} />,
        );

        await waitFor(() => expect(getRow(0)).not.to.be.undefined);
        await user.click(within(getCell(0, 0)).getByRole('button'));
        await waitFor(() => expect(apiRef.current!.getRow('A-0')).not.to.equal(null));

        const initialChildValue = apiRef.current!.getRow<TreeRow>('A-0')!.value;
        localFetchRowsSpy.mockClear();

        act(() => updateModel());

        await waitFor(() => {
          const nestedRequest = localFetchRowsSpy.mock.calls.find((call) => {
            const params = call[0] as GridGetRowsParams;
            return (
              JSON.stringify(params.groupKeys) === JSON.stringify(['A']) &&
              isMatchingRequest(params)
            );
          });

          expect(nestedRequest).not.to.equal(undefined);
        });

        await waitFor(() => {
          const childRow = apiRef.current!.getRow<TreeRow>('A-0');
          expect(childRow).not.to.equal(null);
          expect(childRow!.value).to.be.greaterThan(initialChildValue);
        });

        const parentNode = apiRef.current!.getRowNode<GridGroupNode>('A')!;
        expect(parentNode.childrenExpanded).to.equal(true);
      });
    });

    it('should periodically revalidate expanded nested rows without setting children loading', async () => {
      const localFetchRowsSpy = vi.fn();
      const { user } = render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);
      await user.click(within(getCell(0, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('A-0')).not.to.equal(null));

      const setChildrenLoadingSpy = vi.spyOn(apiRef.current!.dataSource, 'setChildrenLoading');
      localFetchRowsSpy.mockClear();
      setChildrenLoadingSpy.mockClear();

      await waitFor(() => {
        const hasNestedRequest = localFetchRowsSpy.mock.calls.some((call) => {
          const params = call[0] as GridGetRowsParams;
          return (params.groupKeys?.length ?? 0) > 0;
        });
        expect(hasNestedRequest).to.equal(true);
      });

      const hasLoadingTrueCall = setChildrenLoadingSpy.mock.calls.some(
        (call) => call[0] === 'A' && call[1] === true,
      );
      setChildrenLoadingSpy.mockRestore();
      expect(hasLoadingTrueCall).to.equal(false);
    });

    it('should not call getRows during polling when the cache entry is still valid', async () => {
      const localFetchRowsSpy = vi.fn();
      render(
        <TestNestedDataSourceLazyLoader
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      vi.useFakeTimers();
      localFetchRowsSpy.mockClear();

      act(() => {
        apiRef.current?.publishEvent('renderedRowsIntervalChange', {
          firstRowIndex: 0,
          lastRowIndex: 3,
          firstColumnIndex: 0,
          lastColumnIndex: 1,
        });
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(20);
      });

      expect(localFetchRowsSpy.mock.calls.length).to.equal(0);

      vi.useRealTimers();
    });

    it('should update same-id rows without losing nested selection', async () => {
      const localFetchRowsSpy = vi.fn();
      const { user } = render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);
      await user.click(within(getCell(0, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('A-0')).not.to.equal(null));

      act(() => {
        apiRef.current?.selectRow('A-0', true);
      });
      const initialValue = apiRef.current!.getRow<TreeRow>('A-0')!.value;

      localFetchRowsSpy.mockClear();

      await waitFor(() => {
        expect(apiRef.current!.getRow<TreeRow>('A-0')!.value).to.be.greaterThan(initialValue);
      });
      expect(apiRef.current!.isRowSelected('A-0')).to.equal(true);
    });

    it('should collapse expanded nested rows without deleting skeleton rows through row updates', async () => {
      const localFetchRowsSpy = vi.fn();
      const { user } = render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);
      await user.click(within(getCell(0, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('A-0')).not.to.equal(null));

      await user.click(within(getCell(0, 0)).getByRole('button'));

      await waitFor(() => {
        expect(apiRef.current!.getRow('A-0')).to.equal(null);
      });
    });

    it('should replace different-id rows under the correct parent', async () => {
      const localFetchRowsSpy = vi.fn();
      const transformRows = (rows: TreeRow[], params: GridGetRowsParams, requestCount: number) => {
        if ((params.groupKeys?.length ?? 0) === 1 && requestCount > 2) {
          return rows.map((row, index) =>
            index === 0 ? { ...row, id: 'A-0-updated', name: 'A-0-updated' } : row,
          );
        }
        return rows;
      };
      const { user } = render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
          transformRows={transformRows}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);
      await user.click(within(getCell(0, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('A-0')).not.to.equal(null));

      localFetchRowsSpy.mockClear();

      await waitFor(() => {
        expect(apiRef.current!.getRow('A-0-updated')).not.to.equal(null);
      });
      expect(apiRef.current!.getRow('A-0')).to.equal(null);

      const parentNode = apiRef.current!.getRowNode<GridGroupNode>('A')!;
      expect(parentNode.children).to.include('A-0-updated');
    });

    it('should remove the last root row dropped by the server on revalidation', async () => {
      const transformRows = (rows: TreeRow[], params: GridGetRowsParams, requestCount: number) => {
        if ((params.groupKeys?.length ?? 0) === 0 && requestCount > 2) {
          return rows.filter((row) => row.id !== 'L');
        }
        return rows;
      };
      render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={vi.fn()}
          transformRows={transformRows}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      await waitFor(() => {
        expect(
          apiRef.current!.getRowNode<GridGroupNode>(GRID_ROOT_GROUP_ID)!.children.length,
        ).to.equal(11);
      });
      expect(apiRef.current!.getRow('L')).to.equal(null);
    });

    it('should remove a middle root row dropped by the server on revalidation', async () => {
      const transformRows = (rows: TreeRow[], params: GridGetRowsParams, requestCount: number) => {
        if ((params.groupKeys?.length ?? 0) === 0 && requestCount > 2) {
          return rows.filter((row) => row.id !== 'C');
        }
        return rows;
      };
      render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={vi.fn()}
          transformRows={transformRows}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      await waitFor(() => {
        expect(apiRef.current!.getRow('C')).to.equal(null);
      });
      await waitFor(() => {
        expect(
          apiRef.current!.getRowNode<GridGroupNode>(GRID_ROOT_GROUP_ID)!.children.length,
        ).to.equal(11);
      });

      // The tail skeleton left by the shrink must resolve to the row that moved up into it.
      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 10 }));
      await waitFor(() => {
        expect(apiRef.current!.getRow('L')).not.to.equal(null);
      });
      const rootChildren = apiRef.current!.getRowNode<GridGroupNode>(GRID_ROOT_GROUP_ID)!.children;
      expect(rootChildren.length).to.equal(11);
      expect(
        rootChildren.filter((id) => apiRef.current!.getRowNode(id)?.type === 'skeletonRow').length,
      ).to.equal(0);
    });

    it('should remove the last child of an expanded group dropped by the server on revalidation', async () => {
      let dropChild = false;
      const transformRows = (rows: TreeRow[], params: GridGetRowsParams) => {
        if ((params.groupKeys?.length ?? 0) === 1 && dropChild) {
          return rows.filter((row) => row.id !== 'A-1');
        }
        return rows;
      };
      const { user } = render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={vi.fn()}
          transformRows={transformRows}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);
      await user.click(within(getCell(0, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('A-1')).not.to.equal(null));

      dropChild = true;

      await waitFor(() => {
        expect(apiRef.current!.getRow('A-1')).to.equal(null);
      });
      const parentNode = apiRef.current!.getRowNode<GridGroupNode>('A')!;
      expect(parentNode.children.length).to.equal(1);
    });

    it('should remove every child when the server empties an expanded group', async () => {
      let emptyGroup = false;
      const transformRows = (rows: TreeRow[], params: GridGetRowsParams) =>
        (params.groupKeys?.length ?? 0) === 1 && emptyGroup ? [] : rows;
      const { user } = render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={vi.fn()}
          transformRows={transformRows}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);
      await user.click(within(getCell(0, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('A-0')).not.to.equal(null));

      emptyGroup = true;

      await waitFor(() => {
        expect(apiRef.current!.getRowNode<GridGroupNode>('A')!.children.length).to.equal(0);
      });
      expect(apiRef.current!.getRow('A-0')).to.equal(null);
      expect(apiRef.current!.getRow('A-1')).to.equal(null);
      expect(
        apiRef.current!.getRowNode<GridDataSourceGroupNode>('A')!.serverChildrenCount,
      ).to.equal(0);
    });

    it('should not leave orphaned descendants when a changed id replaces an expanded group', async () => {
      let returnUpdatedGroup = false;
      const orphanTreeRows: Record<string, { id: string; name: string; childrenCount: number }[]> =
        {
          '[]': [{ id: 'P', name: 'P', childrenCount: 1 }],
          '["P"]': [{ id: 'G', name: 'G', childrenCount: 2 }],
          '["P","G"]': [
            { id: 'G-0', name: 'G-0', childrenCount: 0 },
            { id: 'G-1', name: 'G-1', childrenCount: 0 },
          ],
        };

      function TestOrphanCase() {
        apiRef = useGridApiRef();
        const dataSource: GridDataSource = React.useMemo(
          () => ({
            getRows: async (params: GridGetRowsParams) => {
              const groupKeys = params.groupKeys ?? [];
              let rows = orphanTreeRows[JSON.stringify(groupKeys)] ?? [];
              if (returnUpdatedGroup && groupKeys.length === 1) {
                rows = rows.map((row) =>
                  row.id === 'G' ? { ...row, id: 'G-updated', name: 'G-updated' } : row,
                );
              }
              const start = typeof params.start === 'number' ? params.start : 0;
              const end = typeof params.end === 'number' ? params.end : rows.length - 1;
              return { rows: rows.slice(start, end + 1), rowCount: rows.length };
            },
            getGroupKey: (row) => row.name,
            getChildrenCount: (row) => row.childrenCount,
          }),
          [],
        );

        return (
          <div style={{ width: 300, height: gridHeight }}>
            <DataGridPro
              apiRef={apiRef}
              columns={[{ field: 'name', width: 200 }]}
              dataSource={dataSource}
              dataSourceCache={null}
              dataSourceRevalidateMs={0}
              lazyLoading
              treeData
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 },
              }}
              rowHeight={rowHeight}
              columnHeaderHeight={columnHeaderHeight}
              disableVirtualization={false}
            />
          </div>
        );
      }

      render(<TestOrphanCase />);
      await waitFor(() => expect(apiRef.current!.getRow('P')).not.to.equal(null));

      // Expand P → G, then G → G-0, G-1 (the descendants that must be cleaned up later).
      await act(async () => apiRef.current?.setRowChildrenExpansion('P', true));
      await waitFor(() => expect(apiRef.current!.getRow('G')).not.to.equal(null));
      await act(async () => apiRef.current?.setRowChildrenExpansion('G', true));
      await waitFor(() => expect(apiRef.current!.getRow('G-0')).not.to.equal(null));

      // Re-fetch P's children with a changed id for the expanded group G.
      returnUpdatedGroup = true;
      await act(async () => apiRef.current?.dataSource.fetchRows('P', { start: 0, end: 0 }));
      await waitFor(() => expect(apiRef.current!.getRow('G-updated')).not.to.equal(null));

      // G's previously-loaded children must not linger as orphans in the tree/dataRowIds.
      expect(apiRef.current!.getRow('G-0')).to.equal(null);
      expect(apiRef.current!.getRow('G-1')).to.equal(null);
      expect(apiRef.current!.state.rows.dataRowIds).not.to.include('G-0');
      expect(apiRef.current!.state.rows.dataRowIds).not.to.include('G-1');
    });

    it('should not periodically revalidate when dataSourceRevalidateMs is zero', async () => {
      const localFetchRowsSpy = vi.fn();
      render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={0}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      vi.useFakeTimers();
      localFetchRowsSpy.mockClear();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(20);
      });

      expect(localFetchRowsSpy.mock.calls.length).to.equal(0);

      vi.useRealTimers();
    });
  });

  describe('Infinite loading', () => {
    beforeEach(() => {
      // override rowCount
      transformGetRowsResponse = (response) => ({ ...response, rowCount: -1 });
    });

    it('should not render skeleton rows if rowCount is unknown', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // The 11th row should not exist
      expect(() => getRow(10)).to.throw();
    });

    it('should make a new data source request in infinite loading mode once the bottom row is reached', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // reset the spy call count
      fetchRowsSpy.mockClear();

      // make one small and one big scroll that makes sure that the bottom of the grid window is reached
      await act(async () => {
        apiRef.current?.scrollToIndexes({ rowIndex: 1 });
      });
      await act(async () => {
        apiRef.current?.scrollToIndexes({ rowIndex: 9 });
      });

      // Only one additional fetch should have been made
      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(1);
      });
    });

    it('should keep the row provided in a replace update when more rows are loaded', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      const firstRowId = apiRef.current!.getAllRowIds()[0];
      const original = apiRef.current!.getRow(firstRowId);
      const replacement = { ...original };
      await act(async () => apiRef.current?.updateRows([{ _action: 'replace', row: replacement }]));

      // The object provided in the envelope is stored verbatim.
      expect(apiRef.current?.getRow(firstRowId)).to.equal(replacement);

      // reset the spy call count
      fetchRowsSpy.mockClear();

      // make one small and one big scroll that makes sure that the bottom of the grid window is reached
      await act(async () => {
        apiRef.current?.scrollToIndexes({ rowIndex: 1 });
      });
      await act(async () => {
        apiRef.current?.scrollToIndexes({ rowIndex: 9 });
      });

      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(1);
      });
      await waitFor(() => expect(getRow(10)).not.to.be.undefined);

      // Loading the next rows through infinite scroll does not touch the replaced row.
      expect(apiRef.current?.getRow(firstRowId)).to.equal(replacement);
    });

    it('should make a new data source request when there is not enough rows to cover the viewport height', async () => {
      render(
        <TestDataSourceLazyLoader
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 2 } },
          }}
        />,
      );

      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(3); // grid is 4 rows high and the threshold is 60px, so 3 pages are loaded
      });
      const lastSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      expect(lastSearchParams.get('end')).to.equal('5'); // 6th row
    });

    it('should stop making data source requests if the new rows were not added on the last call', async () => {
      render(
        <TestDataSourceLazyLoader
          mockServerRowCount={2}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 2 } },
          }}
        />,
      );
      await waitFor(() => {
        expect(fetchRowsSpy.mock.calls.length).to.equal(2);
      });
      const lastSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      // 3rd and 4th row were requested but not added
      expect(lastSearchParams.get('start')).to.equal('2');
      expect(lastSearchParams.get('end')).to.equal('3');
    });

    it('should reset the scroll position when sorting is applied', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 9 }));

      // wait until the rows are rendered
      await waitFor(() => expect(getRow(10)).not.to.be.undefined);

      const beforeSortingSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      // last row is not the first page anymore
      expect(beforeSortingSearchParams.get('end')).not.to.equal('9');

      await act(async () => apiRef.current?.sortColumn(mockServer.columns[0].field, 'asc'));

      const afterSortingSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      // last row is the end of the first page
      expect(afterSortingSearchParams.get('end')).to.equal('9');
    });

    it('should reset the scroll position when filter is applied', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 9 }));

      // wait until the rows are rendered
      await waitFor(() => expect(getRow(10)).not.to.be.undefined);

      const beforeFilteringSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      // last row is not the first page anymore
      expect(beforeFilteringSearchParams.get('end')).not.to.equal('9');

      await act(async () => {
        apiRef.current?.setFilterModel({
          items: [
            {
              field: mockServer.columns[0].field,
              value: '0',
              operator: 'contains',
            },
          ],
        });
      });

      const afterFilteringSearchParams = new URL(fetchRowsSpy.mock.lastCall?.[0]).searchParams;
      // last row is the end of the first page
      expect(afterFilteringSearchParams.get('end')).to.equal('9');
    });

    it('should not fetch more rows when the data source reports hasNextPage: false', async () => {
      // The first page is the final page: fewer rows than the page size, unknown row
      // count, and no next page available.
      transformGetRowsResponse = (response) => ({
        ...response,
        rowCount: -1,
        pageInfo: { hasNextPage: false },
      });

      // 2 rows with a page size of 2 do not fill the 4-row viewport, so the scroll-end
      // trigger is immediately within the threshold. Without honoring `hasNextPage`, the
      // grid makes a second (wasted) request to try to fill the viewport (see "should stop
      // making data source requests if the new rows were not added on the last call").
      // `hasNextPage: false` must prevent that second request.
      render(
        <TestDataSourceLazyLoader
          mockServerRowCount={2}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 2 } } }}
        />,
      );

      // wait until the first page is rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // give the scroll-end intersection observer time to (incorrectly) fire a second fetch
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 200);
        });
      });

      // only the initial page was fetched; the wasted second request was suppressed
      expect(fetchRowsSpy.mock.calls.length).to.equal(1);
    });

    it('should resume fetching after a query change once hasNextPage is true again', async () => {
      let isFirstResponse = true;
      transformGetRowsResponse = (response) => ({
        ...response,
        rowCount: -1,
        // the initial response reports no next page, subsequent ones report more pages
        pageInfo: { hasNextPage: !isFirstResponse },
      });

      render(<TestDataSourceLazyLoader mockServerRowCount={100} />);

      // wait until the initial response (hasNextPage: false) is fully processed
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // subsequent responses now report that more pages are available
      isFirstResponse = false;
      fetchRowsSpy.mockClear();

      // a new query (sorting) re-queries the first page
      await act(async () => {
        apiRef.current?.sortColumn(mockServer.columns[0].field, 'asc');
      });
      await waitFor(() => expect(fetchRowsSpy.mock.calls.length).to.be.at.least(1));

      // scrolling to the bottom fetches the next page again
      fetchRowsSpy.mockClear();
      await act(async () => {
        apiRef.current?.scrollToIndexes({ rowIndex: 9 });
      });
      await waitFor(() => expect(fetchRowsSpy.mock.calls.length).to.be.at.least(1));
    });

    it('should handle an empty result set with hasNextPage: false without extra fetches', async () => {
      transformGetRowsResponse = (response) => ({
        ...response,
        rows: [],
        rowCount: -1,
        pageInfo: { hasNextPage: false },
      });

      render(<TestDataSourceLazyLoader mockServerRowCount={0} />);

      // Only the initial request is made. An empty result set produces no rows and no
      // skeleton rows, so there is no last row to attach the scroll-end trigger to and
      // therefore no further request — and no crash.
      await waitFor(() => expect(fetchRowsSpy.mock.calls.length).to.equal(1));
      expect(() => getRow(0)).to.throw();
    });

    it('should not fetch more rows when paginationMeta reports hasNextPage: false', async () => {
      // Row count stays unknown (infinite loading) and the response carries no pageInfo,
      // but the controlled `paginationMeta` prop signals there is no next page.
      transformGetRowsResponse = (response) => ({ ...response, rowCount: -1 });

      // 2 rows with a page size of 2 do not fill the 4-row viewport, so without honoring
      // `paginationMeta.hasNextPage` the grid would make a second (wasted) request.
      render(
        <TestDataSourceLazyLoader
          mockServerRowCount={2}
          paginationMeta={{ hasNextPage: false }}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 2 } } }}
        />,
      );

      // wait until the first page is rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // give the scroll-end intersection observer time to (incorrectly) fire a second fetch
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 200);
        });
      });

      // only the initial page was fetched; the wasted second request was suppressed
      expect(fetchRowsSpy.mock.calls.length).to.equal(1);
    });

    it('should let a controlled paginationMeta.hasNextPage: true override a false response', async () => {
      // The data source response says there are no more pages, but the controlled
      // `paginationMeta` prop says there are — the controlled prop wins.
      transformGetRowsResponse = (response) => ({
        ...response,
        rowCount: -1,
        pageInfo: { hasNextPage: false },
      });

      render(
        <TestDataSourceLazyLoader
          mockServerRowCount={100}
          paginationMeta={{ hasNextPage: true }}
        />,
      );

      // wait until the first page is rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);
      fetchRowsSpy.mockClear();

      // scrolling to the bottom still fetches the next page despite the false response
      await act(async () => {
        apiRef.current?.scrollToIndexes({ rowIndex: 9 });
      });
      await waitFor(() => expect(fetchRowsSpy.mock.calls.length).to.be.at.least(1));
    });

    it('should honor initialState pagination meta hasNextPage: false', async () => {
      // The responses carry no pageInfo; the "no next page" signal comes solely from
      // initialState and must persist (a missing pageInfo keeps the previous value).
      transformGetRowsResponse = (response) => ({ ...response, rowCount: -1 });

      // 2 rows with a page size of 2 would normally trigger a wasted auto-fill request.
      render(
        <TestDataSourceLazyLoader
          mockServerRowCount={2}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 2 },
              meta: { hasNextPage: false },
            },
          }}
        />,
      );

      // wait until the first page is rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // give the scroll-end intersection observer time to (incorrectly) fire a second fetch
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 200);
        });
      });

      // only the initial page was fetched; initialState suppressed the wasted request
      expect(fetchRowsSpy.mock.calls.length).to.equal(1);
    });

    it('should re-evaluate hasNextPage when the dataSource reference changes', async () => {
      // A new `dataSource` reference is a full restart: the rows and the cache are cleared
      // and the first page is refetched. The previous source reporting no next page says
      // nothing about the new one, which here never sends `pageInfo` at all.
      const createStaticDataSource = (
        onFetch: (params: GridGetRowsParams) => void,
        pageInfo?: { hasNextPage: boolean },
      ): GridDataSource => ({
        getRows: async (params) => {
          onFetch(params);
          const start = Number(params.start ?? 0);
          const end = Number(params.end ?? 9);
          return {
            rows: Array.from({ length: end - start + 1 }, (__, index) => ({ id: start + index })),
            rowCount: -1,
            ...(pageInfo === undefined ? {} : { pageInfo }),
          };
        },
      });

      const exhaustedFetchSpy = vi.fn();
      const silentFetchSpy = vi.fn();
      const exhaustedDataSource = createStaticDataSource(exhaustedFetchSpy, {
        hasNextPage: false,
      });
      const silentDataSource = createStaticDataSource(silentFetchSpy);

      const { setProps } = render(<TestDataSourceLazyLoader dataSource={exhaustedDataSource} />);
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      setProps({ dataSource: silentDataSource });
      await waitFor(() => expect(silentFetchSpy.mock.calls.length).to.be.at.least(1));
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);
      silentFetchSpy.mockClear();

      // scrolling to the bottom must fetch again: the stale `false` from the previous
      // data source must not survive the restart
      await act(async () => {
        apiRef.current?.scrollToIndexes({ rowIndex: 9 });
      });
      await waitFor(() => expect(silentFetchSpy.mock.calls.length).to.be.at.least(1));
    });

    it('should honor a pagination meta update made through the API', async () => {
      // The response reports no next page, then `setPaginationMeta` says otherwise. An
      // explicit update of the pagination meta overrides the response.
      transformGetRowsResponse = (response) => ({
        ...response,
        rowCount: -1,
        pageInfo: { hasNextPage: false },
      });

      render(<TestDataSourceLazyLoader mockServerRowCount={100} />);
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      await act(async () => {
        apiRef.current?.setPaginationMeta({ hasNextPage: true });
      });
      fetchRowsSpy.mockClear();

      await act(async () => {
        apiRef.current?.scrollToIndexes({ rowIndex: 9 });
      });
      await waitFor(() => expect(fetchRowsSpy.mock.calls.length).to.be.at.least(1));
    });
  });

  describe('Row count updates', () => {
    it('should add skeleton rows once the rowCount becomes known', async () => {
      // override rowCount
      transformGetRowsResponse = (response) => ({ ...response, rowCount: undefined });
      const { setProps } = render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // The 11th row should not exist
      expect(() => getRow(10)).to.throw();

      // make the rowCount known
      setProps({ rowCount: 100 });

      // The 11th row should be a skeleton
      await waitFor(() =>
        expect(getRow(10).dataset.id).to.equal('auto-generated-skeleton-row-root-10'),
      );
    });

    it('should reset the grid if the rowCount becomes unknown', async () => {
      // override rowCount
      transformGetRowsResponse = (response) => ({ ...response, rowCount: undefined });
      const { setProps } = render(<TestDataSourceLazyLoader rowCount={100} />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // The 11th row should not exist
      expect(getRow(10).dataset.id).to.equal('auto-generated-skeleton-row-root-10');

      // make the rowCount unknown
      setProps({ rowCount: -1 });

      // The 11th row should not exist
      expect(() => getRow(10)).to.throw();
    });

    it('should reset the grid if the rowCount becomes smaller than the actual row count', async () => {
      // override rowCount
      transformGetRowsResponse = (response) => ({ ...response, rowCount: undefined });
      render(
        <TestDataSourceLazyLoader rowCount={100} paginationModel={{ page: 0, pageSize: 30 }} />,
      );
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // reset the spy call count
      fetchRowsSpy.mockClear();

      // reduce the rowCount to be more than the number of rows
      await act(async () => {
        apiRef.current?.setRowCount(80);
      });
      expect(fetchRowsSpy.mock.calls.length).to.equal(0);

      // reduce the rowCount once more, but now to be less than the number of rows
      await act(async () => {
        apiRef.current?.setRowCount(20);
      });
      await waitFor(() => expect(fetchRowsSpy.mock.calls.length).to.equal(1));
    });

    it('should allow setting the row count via API', async () => {
      // override rowCount
      transformGetRowsResponse = (response) => ({ ...response, rowCount: undefined });
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      // The 11th row should not exist
      expect(() => getRow(10)).to.throw();

      // set the rowCount via API
      await act(async () => apiRef.current?.setRowCount(100));

      // wait until the rows are added
      await waitFor(() => expect(getRow(10)).not.to.be.undefined);
      // The 11th row should be a skeleton
      expect(getRow(10).dataset.id).to.equal('auto-generated-skeleton-row-root-10');
    });
  });

  describe('Cache', () => {
    it('should combine cache chunks when possible to reduce the number of requests', async () => {
      const testCache = new TestCache();
      const cacheGetSpy = vi.spyOn(testCache, 'get');
      onTestFinished(() => cacheGetSpy.mockRestore());
      render(<TestDataSourceLazyLoader dataSourceCache={testCache} />);

      await waitFor(() => {
        expect(cacheGetSpy.mock.calls.length).to.be.greaterThan(0);
      });

      cacheGetSpy.mockClear();
      fetchRowsSpy.mockClear();

      act(() => {
        apiRef.current?.dataSource.fetchRows(GRID_ROOT_GROUP_ID, {
          start: 0,
          end: 29,
        });
      });

      await waitFor(() => {
        expect(cacheGetSpy.mock.calls.length).to.equal(3);
      });
      expect(fetchRowsSpy.mock.calls.length).to.equal(1);

      act(() => {
        apiRef.current?.dataSource.fetchRows(GRID_ROOT_GROUP_ID, {
          start: 20,
          end: 29,
        });
      });

      await waitFor(() => {
        expect(cacheGetSpy.mock.calls.length).to.equal(4);
      });
      expect(fetchRowsSpy.mock.calls.length).to.equal(1);
    });
  });
});
