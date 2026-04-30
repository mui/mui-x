import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor, within } from '@mui/internal-test-utils';
import { getCell, getRow } from 'test/utils/helperFn';
import { type RefObject } from '@mui/x-internals/types';
import {
  DataGridPro,
  type DataGridProProps,
  type GridApi,
  type GridDataSource,
  type GridGetRowsParams,
  type GridGetRowsResponse,
  type GridGroupNode,
  type GridRowSelectionModel,
  useGridApiRef,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-pro';
import { spy } from 'sinon';
import { isJSDOM } from 'test/utils/skipIf';
import { TestCache } from '@mui/x-data-grid/internals';

// Needs layout
describe.skipIf(isJSDOM)('<DataGridPro /> - Data source lazy loader', () => {
  const { render } = createRenderer();
  const defaultTransformGetRowsResponse = (response: GridGetRowsResponse) => response;
  const fetchRowsSpy = spy();

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
      fetchRowsSpy.resetHistory();
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
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
  });

  it('should re-fetch the data once if multiple models have changed', async () => {
    const { setProps } = render(<TestDataSourceLazyLoader />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });

    setProps({
      sortModel: [{ field: 'id', sort: 'asc' }],
      filterModel: { items: [{ field: 'id', value: 'abc', operator: 'doesNotContain' }] },
    });

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
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
      fetchRowsSpy.resetHistory();

      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 10 }));

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
    });

    it('should reset the scroll position when sorting is applied', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      const initialSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
      expect(initialSearchParams.get('end')).to.equal('9');

      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 10 }));

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      const beforeSortSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
      expect(beforeSortSearchParams.get('end')).not.to.equal('9');

      await act(async () => apiRef.current?.sortColumn(mockServer.columns[0].field, 'asc'));

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(3);
      });

      const afterSortSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
      expect(afterSortSearchParams.get('end')).to.equal('9');
    });

    it('should reset the scroll position when filter is applied', async () => {
      render(<TestDataSourceLazyLoader />);
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 10 }));

      // wait until the rows are rendered
      await waitFor(() => expect(fetchRowsSpy.callCount).to.equal(2));

      const beforeFilteringSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
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
        expect(fetchRowsSpy.callCount).to.equal(3);
      });

      const afterFilteringSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
      // first row is the start of the first page
      expect(afterFilteringSearchParams.get('start')).to.equal('0');
    });

    it('should not refetch already fetched rows on scroll-back when cache entry is still valid', async () => {
      render(<TestDataSourceLazyLoader mockServerRowCount={20} disableVirtualization={false} />);
      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      vi.useFakeTimers();
      fetchRowsSpy.resetHistory();

      await act(async () => {
        apiRef.current?.publishEvent('renderedRowsIntervalChange', {
          firstRowIndex: 1,
          lastRowIndex: 5,
          firstColumnIndex: 0,
          lastColumnIndex: 0,
        });
        await vi.advanceTimersByTimeAsync(700);
      });

      expect(fetchRowsSpy.callCount).to.equal(0);
      vi.useRealTimers();
    });

    it('should not refetch during polling when cache entry is still valid', async () => {
      const localFetchRowsSpy = spy();
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
      localFetchRowsSpy.resetHistory();

      await act(async () => {
        apiRef.current?.publishEvent('renderedRowsIntervalChange', {
          firstRowIndex: 0,
          lastRowIndex: 3,
          firstColumnIndex: 0,
          lastColumnIndex: 0,
        });
        await vi.advanceTimersByTimeAsync(50);
      });

      expect(localFetchRowsSpy.callCount).to.equal(0);
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
        const lastUrl = fetchRowsSpy.lastCall?.args[0];
        if (!lastUrl) {
          return;
        }
        const params = new URL(lastUrl).searchParams;
        expect(Number(params.get('start'))).to.be.greaterThan(0);
      });

      fetchRowsSpy.resetHistory();

      // Call fetchRows without explicit params
      act(() => {
        apiRef.current?.dataSource.fetchRows();
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      // The request should use viewport-based start, not the default page 0
      const searchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
      const start = Number(searchParams.get('start'));
      expect(start).to.be.greaterThan(0);
    });

    it('should periodically revalidate the current range when dataSourceRevalidateMs is set', async () => {
      const localFetchRowsSpy = spy();
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

      localFetchRowsSpy.resetHistory();

      await waitFor(() => {
        expect(localFetchRowsSpy.callCount).to.be.greaterThan(1);
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
      ],
      '["A"]': [
        { id: 'A-0', name: 'A-0', childrenCount: 0 },
        { id: 'A-1', name: 'A-1', childrenCount: 0 },
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

    it('should periodically revalidate root rows when dataSourceRevalidateMs is set', async () => {
      const localFetchRowsSpy = spy();
      render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      localFetchRowsSpy.resetHistory();

      await waitFor(() => {
        expect(localFetchRowsSpy.callCount).to.be.greaterThan(1);
      });
      const rootRequest = localFetchRowsSpy.getCalls().find((call) => {
        const params = call.firstArg as GridGetRowsParams;
        return params.groupKeys?.length === 0;
      })?.firstArg as GridGetRowsParams | undefined;
      expect(rootRequest).not.to.equal(undefined);
      expect(rootRequest?.start).to.equal(0);
      expect(rootRequest?.end).to.equal(9);
    });

    it('should periodically revalidate expanded nested rows without setting children loading', async () => {
      const localFetchRowsSpy = spy();
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

      const setChildrenLoadingSpy = spy(apiRef.current!.dataSource, 'setChildrenLoading');
      localFetchRowsSpy.resetHistory();
      setChildrenLoadingSpy.resetHistory();

      await waitFor(() => {
        const hasNestedRequest = localFetchRowsSpy.getCalls().some((call) => {
          const params = call.firstArg as GridGetRowsParams;
          return (params.groupKeys?.length ?? 0) > 0;
        });
        expect(hasNestedRequest).to.equal(true);
      });

      const hasLoadingTrueCall = setChildrenLoadingSpy
        .getCalls()
        .some((call) => call.args[0] === 'A' && call.args[1] === true);
      setChildrenLoadingSpy.restore();
      expect(hasLoadingTrueCall).to.equal(false);
    });

    it('should not call getRows during polling when the cache entry is still valid', async () => {
      const localFetchRowsSpy = spy();
      render(
        <TestNestedDataSourceLazyLoader
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      vi.useFakeTimers();
      localFetchRowsSpy.resetHistory();

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

      expect(localFetchRowsSpy.callCount).to.equal(0);

      vi.useRealTimers();
    });

    it('should update same-id rows without losing nested selection', async () => {
      const localFetchRowsSpy = spy();
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

      localFetchRowsSpy.resetHistory();

      await waitFor(() => {
        expect(apiRef.current!.getRow<TreeRow>('A-0')!.value).to.be.greaterThan(initialValue);
      });
      expect(apiRef.current!.isRowSelected('A-0')).to.equal(true);
    });

    it('should collapse expanded nested rows without deleting skeleton rows through row updates', async () => {
      const localFetchRowsSpy = spy();
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
      const localFetchRowsSpy = spy();
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

      localFetchRowsSpy.resetHistory();

      await waitFor(() => {
        expect(apiRef.current!.getRow('A-0-updated')).not.to.equal(null);
      });
      expect(apiRef.current!.getRow('A-0')).to.equal(null);

      const parentNode = apiRef.current!.getRowNode<GridGroupNode>('A')!;
      expect(parentNode.children).to.include('A-0-updated');
    });

    it('should not periodically revalidate when dataSourceRevalidateMs is zero', async () => {
      const localFetchRowsSpy = spy();
      render(
        <TestNestedDataSourceLazyLoader
          dataSourceCache={null}
          dataSourceRevalidateMs={0}
          onFetchRows={localFetchRowsSpy}
        />,
      );

      await waitFor(() => expect(getRow(0)).not.to.be.undefined);

      vi.useFakeTimers();
      localFetchRowsSpy.resetHistory();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(20);
      });

      expect(localFetchRowsSpy.callCount).to.equal(0);

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
      fetchRowsSpy.resetHistory();

      // make one small and one big scroll that makes sure that the bottom of the grid window is reached
      await act(async () => {
        apiRef.current?.scrollToIndexes({ rowIndex: 1 });
      });
      await act(async () => {
        apiRef.current?.scrollToIndexes({ rowIndex: 9 });
      });

      // Only one additional fetch should have been made
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
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
        expect(fetchRowsSpy.callCount).to.equal(3); // grid is 4 rows high and the threshold is 60px, so 3 pages are loaded
      });
      const lastSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
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
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      const lastSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
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

      const beforeSortingSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
      // last row is not the first page anymore
      expect(beforeSortingSearchParams.get('end')).not.to.equal('9');

      await act(async () => apiRef.current?.sortColumn(mockServer.columns[0].field, 'asc'));

      const afterSortingSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
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

      const beforeFilteringSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
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

      const afterFilteringSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
      // last row is the end of the first page
      expect(afterFilteringSearchParams.get('end')).to.equal('9');
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
      fetchRowsSpy.resetHistory();

      // reduce the rowCount to be more than the number of rows
      await act(async () => {
        apiRef.current?.setRowCount(80);
      });
      expect(fetchRowsSpy.callCount).to.equal(0);

      // reduce the rowCount once more, but now to be less than the number of rows
      await act(async () => {
        apiRef.current?.setRowCount(20);
      });
      await waitFor(() => expect(fetchRowsSpy.callCount).to.equal(1));
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
      const cacheGetSpy = spy(testCache, 'get');
      render(<TestDataSourceLazyLoader dataSourceCache={testCache} />);

      await waitFor(() => {
        expect(cacheGetSpy.called).to.equal(true);
      });

      cacheGetSpy.resetHistory();
      fetchRowsSpy.resetHistory();

      act(() => {
        apiRef.current?.dataSource.fetchRows(GRID_ROOT_GROUP_ID, {
          start: 0,
          end: 29,
        });
      });

      await waitFor(() => {
        expect(cacheGetSpy.callCount).to.equal(3);
      });
      expect(fetchRowsSpy.callCount).to.equal(1);

      act(() => {
        apiRef.current?.dataSource.fetchRows(GRID_ROOT_GROUP_ID, {
          start: 20,
          end: 29,
        });
      });

      await waitFor(() => {
        expect(cacheGetSpy.callCount).to.equal(4);
      });
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
  });
});
