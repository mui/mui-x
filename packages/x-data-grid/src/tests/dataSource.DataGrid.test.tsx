import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor } from '@mui/internal-test-utils';
import type { RefObject } from '@mui/x-internals/types';
import { DataGrid, gridFilterModelSelector, useGridApiRef } from '@mui/x-data-grid';
import type {
  DataGridProps,
  GridApi,
  GridDataSource,
  GridFilterItem,
  GridGetRowsParams,
  GridLogicOperator,
  GridGetRowsResponse,
} from '@mui/x-data-grid';
import { spy } from 'sinon';
import { getCell, sleep } from 'test/utils/helperFn';
import { getKeyDefault } from '../hooks/features/dataSource/cache';
import { TestCache } from '../internals/utils';

const pageSizeOptions = [10, 20];
const serverOptions = { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false };
const dataSetOptions = { rowLength: 100, maxColumns: 1, editable: true };

const SUPPORTS_ACTIVITY = 'Activity' in React;

describe('<DataGrid /> - Data source', () => {
  const { render } = createRenderer();
  const fetchRowsSpy = spy();
  const editRowSpy = spy();
  let apiRef: RefObject<GridApi | null>;
  let mockServer: ReturnType<typeof useMockServer>;

  // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
  function Reset() {
    React.useLayoutEffect(() => {
      fetchRowsSpy.resetHistory();
    }, []);
    return null;
  }

  function ActivityFallback({ children }: React.ActivityProps) {
    return children;
  }

  const Activity = SUPPORTS_ACTIVITY ? React.Activity : ActivityFallback;

  function TestDataSource(
    props: Partial<DataGridProps> & {
      shouldRequestsFail?: boolean;
      dataSetOptions?: Partial<typeof dataSetOptions>;
      onFetchRows?: typeof fetchRowsSpy;
      dataSourceKey?: number;
      activityMode?: 'visible' | 'hidden';
      stallResponsePromise?: Promise<void>;
    },
  ) {
    apiRef = useGridApiRef();
    const {
      dataSetOptions: dataSetOptionsProp,
      shouldRequestsFail,
      dataSourceKey = 1,
      onFetchRows,
      activityMode = 'visible',
      stallResponsePromise,
      ...other
    } = props;
    const effectiveFetchRowsSpy = onFetchRows ?? fetchRowsSpy;
    mockServer = useMockServer(
      dataSetOptionsProp ?? dataSetOptions,
      serverOptions,
      shouldRequestsFail ?? false,
    );

    const { fetchRows, editRow } = mockServer;

    // Read through a ref so that stalling a response does not change the `dataSource` identity
    const stallResponsePromiseRef = React.useRef(stallResponsePromise);
    stallResponsePromiseRef.current = stallResponsePromise;

    const dataSource: GridDataSource = React.useMemo(() => {
      // Recreate the data source when this key changes
      void dataSourceKey;

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

          await stallResponsePromiseRef.current;

          return {
            rows: getRowsResponse.rows,
            rowCount: getRowsResponse.rowCount,
          };
        },
        updateRow: async (params) => {
          editRowSpy(params);
          const syncedRow = await editRow(params.rowId, params.updatedRow);
          return syncedRow;
        },
      };
    }, [dataSourceKey, effectiveFetchRowsSpy, fetchRows, editRow]);

    if (!mockServer.isReady) {
      return null;
    }

    return (
      <div style={{ width: 300, height: 300 }}>
        <Reset />
        <Activity mode={activityMode}>
          <DataGrid
            apiRef={apiRef}
            columns={mockServer.columns}
            dataSource={dataSource}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 },
            }}
            pagination
            pageSizeOptions={pageSizeOptions}
            disableVirtualization
            {...other}
          />
        </Activity>
      </div>
    );
  }

  it('should fetch the data on initial render', async () => {
    render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
  });

  it('should re-fetch the data on data source change', async () => {
    const { setProps } = render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    setProps({ dataSourceKey: 2 });
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });
  });

  it('should re-fetch the data on filter change', async () => {
    const { setProps } = render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    setProps({
      filterModel: { items: [{ field: 'id', value: 'abc', operator: 'doesNotContain' }] },
    });
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });
  });

  describe('incomplete filter items', () => {
    const getSentFilterItems = () => {
      const url = new URL(fetchRowsSpy.lastCall.args[0]);
      return JSON.parse(url.searchParams.get('filterModel')!).items;
    };

    const renderAndWaitForInitialFetch = async () => {
      render(<TestDataSource columns={[{ field: 'id' }]} dataSourceCache={null} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
    };

    const upsertFilterItem = async (item: GridFilterItem) => {
      await act(async () => {
        apiRef.current!.upsertFilterItem(item);
      });
    };

    // See https://github.com/mui/mui-x/issues/23243
    it('should not send a filter item without a value to the data source', async () => {
      await renderAndWaitForInitialFetch();

      await upsertFilterItem({ id: 1, field: 'id', operator: 'contains', value: '1' });
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      await upsertFilterItem({ id: 1, field: 'id', operator: 'contains' });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(3);
      });
      expect(getSentFilterItems()).to.deep.equal([]);
    });

    it('should not send a filter item whose array value is empty', async () => {
      await renderAndWaitForInitialFetch();

      await upsertFilterItem({ id: 1, field: 'id', operator: 'isAnyOf', value: ['1'] });
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      await upsertFilterItem({ id: 1, field: 'id', operator: 'isAnyOf', value: [] });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(3);
      });
      expect(getSentFilterItems()).to.deep.equal([]);
    });

    // Operators like `isEmpty` are complete without a value.
    // See https://github.com/mui/mui-x/issues/5402
    it('should send a valueless filter item whose operator requires no value', async () => {
      await renderAndWaitForInitialFetch();

      await upsertFilterItem({ id: 1, field: 'id', operator: 'isEmpty' });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      expect(getSentFilterItems()).to.deep.equal([{ id: 1, field: 'id', operator: 'isEmpty' }]);
    });

    // Adding a filter row asks the data source for what the previous call already returned.
    it('should not re-fetch when the change only adds an incomplete item', async () => {
      await renderAndWaitForInitialFetch();

      await upsertFilterItem({ id: 1, field: 'id', operator: 'contains' });
      await sleep(50);

      expect(fetchRowsSpy.callCount).to.equal(1);
    });

    it('should re-fetch when an incomplete item becomes complete', async () => {
      await renderAndWaitForInitialFetch();

      await upsertFilterItem({ id: 1, field: 'id', operator: 'contains' });
      await sleep(50);
      expect(fetchRowsSpy.callCount).to.equal(1);

      await upsertFilterItem({ id: 1, field: 'id', operator: 'contains', value: '1' });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      expect(getSentFilterItems()).to.deep.equal([
        { id: 1, field: 'id', operator: 'contains', value: '1' },
      ]);
    });
  });

  describe('inapplicable filter model changes', () => {
    const renderAndWaitForInitialFetch = async () => {
      render(<TestDataSource columns={[{ field: 'id' }]} dataSourceCache={null} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
    };

    // A logic operator needs two operands to change anything.
    it('should not re-fetch when the logic operator changes without two complete items', async () => {
      await renderAndWaitForInitialFetch();

      await act(async () => {
        apiRef.current!.upsertFilterItem({ id: 1, field: 'id', operator: 'contains', value: '1' });
      });
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      await act(async () => {
        apiRef.current!.setFilterLogicOperator('or' as GridLogicOperator);
      });
      await sleep(50);

      expect(fetchRowsSpy.callCount).to.equal(2);
    });

    it('should not re-fetch when the quick filter values only contain falsy entries', async () => {
      await renderAndWaitForInitialFetch();

      await act(async () => {
        apiRef.current!.setQuickFilterValues(['']);
      });
      await sleep(50);

      expect(fetchRowsSpy.callCount).to.equal(1);
    });

    it('should not re-fetch when the quick filter logic operator changes below two values', async () => {
      await renderAndWaitForInitialFetch();

      await act(async () => {
        apiRef.current!.setQuickFilterValues(['abc']);
      });
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      await act(async () => {
        apiRef.current!.setFilterModel({
          ...gridFilterModelSelector(apiRef),
          quickFilterLogicOperator: 'or' as GridLogicOperator,
        });
      });
      await sleep(50);

      expect(fetchRowsSpy.callCount).to.equal(2);
    });

    it('should re-fetch when a quick filter value is added', async () => {
      await renderAndWaitForInitialFetch();

      await act(async () => {
        apiRef.current!.setQuickFilterValues(['abc']);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      const url = new URL(fetchRowsSpy.lastCall.args[0]);
      expect(JSON.parse(url.searchParams.get('filterModel')!).quickFilterValues).to.deep.equal([
        'abc',
      ]);
    });
  });

  it('should re-fetch the data on sort change', async () => {
    const { setProps } = render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    setProps({ sortModel: [{ field: 'id', sort: 'asc' }] });
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

  it('should re-fetch the data once if multiple models have changed', async () => {
    const { setProps } = render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });

    setProps({
      paginationModel: { page: 1, pageSize: 10 },
      sortModel: [{ field: 'id', sort: 'asc' }],
      filterModel: { items: [{ field: 'id', value: 'abc', operator: 'doesNotContain' }] },
    });

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });
  });

  if (SUPPORTS_ACTIVITY) {
    describe('Activity', () => {
      async function toggleActivity(
        setProps: (props: { activityMode: 'visible' | 'hidden' }) => void,
      ) {
        await act(async () => {
          setProps({ activityMode: 'hidden' });
        });
        await act(async () => {
          setProps({ activityMode: 'visible' });
        });
      }

      it('should not re-fetch the data when the Activity becomes visible', async () => {
        const { setProps } = render(<TestDataSource />);
        await waitFor(() => {
          expect(fetchRowsSpy.callCount).to.equal(1);
        });
        await toggleActivity(setProps);
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      it('should keep a request in flight when the Activity is hidden', async () => {
        const { promise, resolve } = Promise.withResolvers<void>();
        const { setProps } = render(<TestDataSource stallResponsePromise={promise} />);
        await waitFor(() => {
          expect(fetchRowsSpy.callCount).to.equal(1);
        });
        await toggleActivity(setProps);
        await act(async () => {
          resolve();
        });
        await waitFor(() => {
          expect(apiRef.current?.getRowsCount()).to.be.above(0);
        });
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      it('should apply a response that settles while the Activity is hidden', async () => {
        const { promise, resolve } = Promise.withResolvers<void>();
        const { setProps } = render(<TestDataSource stallResponsePromise={promise} />);
        await waitFor(() => {
          expect(fetchRowsSpy.callCount).to.equal(1);
        });
        await act(async () => {
          setProps({ activityMode: 'hidden' });
        });
        await act(async () => {
          resolve();
        });
        await waitFor(() => {
          expect(apiRef.current?.getRowsCount()).to.be.above(0);
        });
        await act(async () => {
          setProps({ activityMode: 'visible' });
        });
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      it('should re-fetch the data when the Activity becomes visible after a failed request', async () => {
        const onDataSourceError = spy();
        const { setProps } = render(
          <TestDataSource shouldRequestsFail onDataSourceError={onDataSourceError} />,
        );
        await waitFor(() => {
          expect(onDataSourceError.callCount).to.equal(1);
        });
        const callCountBeforeToggle = fetchRowsSpy.callCount;
        await toggleActivity(setProps);
        await waitFor(() => {
          expect(fetchRowsSpy.callCount).to.be.above(callCountBeforeToggle);
        });
      });

      it('should apply a filter change response that settles while the Activity is hidden', async () => {
        const { promise, resolve } = Promise.withResolvers<void>();
        const { setProps } = render(<TestDataSource />);
        await waitFor(() => {
          expect(fetchRowsSpy.callCount).to.equal(1);
        });
        setProps({
          stallResponsePromise: promise,
          filterModel: { items: [{ field: 'id', value: 'abc', operator: 'doesNotContain' }] },
        });
        await waitFor(() => {
          expect(fetchRowsSpy.callCount).to.equal(2);
        });
        await act(async () => {
          setProps({ activityMode: 'hidden' });
        });
        await act(async () => {
          resolve();
        });
        await waitFor(() => {
          expect(apiRef.current?.getRowsCount()).to.be.above(0);
        });
        await act(async () => {
          setProps({ activityMode: 'visible' });
        });
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
    });
  }

  describe('Cache', () => {
    it('should cache the data using the default cache', async () => {
      const pageChangeSpy = spy();
      render(<TestDataSource onPaginationModelChange={pageChangeSpy} />);

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(pageChangeSpy.callCount).to.equal(0);

      act(() => {
        apiRef.current?.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      expect(pageChangeSpy.callCount).to.equal(1);

      act(() => {
        apiRef.current?.setPage(0);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      expect(pageChangeSpy.callCount).to.equal(2);
    });

    it('should cache the data using the custom cache', async () => {
      const testCache = new TestCache();
      render(<TestDataSource dataSourceCache={testCache} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(testCache.size()).to.equal(1);
    });

    it('should cache the data in the chunks defined by the minimum page size', async () => {
      const testCache = new TestCache();
      render(
        <TestDataSource dataSourceCache={testCache} paginationModel={{ page: 0, pageSize: 20 }} />,
      );
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(testCache.size()).to.equal(2); // 2 chunks of 10 rows
    });

    it('should use the cached data when the same query is made again', async () => {
      const testCache = new TestCache();
      const pageChangeSpy = spy();
      render(
        <TestDataSource dataSourceCache={testCache} onPaginationModelChange={pageChangeSpy} />,
      );
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(testCache.size()).to.equal(1);
      expect(pageChangeSpy.callCount).to.equal(0);

      act(() => {
        apiRef.current?.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      await waitFor(() => {
        expect(testCache.size()).to.equal(2);
      });
      expect(pageChangeSpy.callCount).to.equal(1);

      act(() => {
        apiRef.current?.setPage(0);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      expect(testCache.size()).to.equal(2);
      expect(pageChangeSpy.callCount).to.equal(2);
    });

    it('should allow to disable the default cache', async () => {
      const pageChangeSpy = spy();
      render(<TestDataSource dataSourceCache={null} onPaginationModelChange={pageChangeSpy} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(pageChangeSpy.callCount).to.equal(0);

      act(() => {
        apiRef.current?.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      expect(pageChangeSpy.callCount).to.equal(1);

      act(() => {
        apiRef.current?.setPage(0);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(3);
      });
      expect(pageChangeSpy.callCount).to.equal(2);
    });

    it('should not apply a stale in-flight response after a cache-hit navigation', async () => {
      // Regression coverage: when a cache-miss fetch is in flight and the user navigates
      // to a page already in the cache, the resolved in-flight response must not overwrite
      // the cached data we just applied.
      const responses: Record<number, GridGetRowsResponse> = {
        0: {
          rows: [{ id: 'page-0-row' }],
          rowCount: 2,
        },
        1: {
          rows: [{ id: 'page-1-stale-row' }],
          rowCount: 2,
        },
      };
      const { promise: page1Promise, resolve: resolvePage1 } =
        Promise.withResolvers<GridGetRowsResponse>();
      const localApiRef = React.createRef<GridApi | null>() as RefObject<GridApi | null>;
      let callIndex = 0;
      const getRows = spy((params: GridGetRowsParams) => {
        const index = callIndex;
        callIndex += 1;
        if (index === 0) {
          return Promise.resolve(responses[0]);
        }
        if (params.start === 1) {
          return page1Promise;
        }
        // Subsequent fetches should be served from the cache; if not, signal it.
        return Promise.resolve({ rows: [{ id: 'unexpected' }], rowCount: 0 });
      });
      const dataSource: GridDataSource = {
        getRows: getRows as unknown as GridDataSource['getRows'],
      };
      function Test(props: Partial<DataGridProps>) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              apiRef={localApiRef}
              columns={[{ field: 'id' }]}
              dataSource={dataSource}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 1 }, rowCount: 0 },
              }}
              pagination
              pageSizeOptions={[1]}
              disableVirtualization
              {...props}
            />
          </div>
        );
      }

      render(<Test />);

      await waitFor(() => {
        expect(localApiRef.current?.getRow('page-0-row')).not.to.equal(null);
      });

      // Trigger a cache-miss fetch for page 1 (response is deferred).
      act(() => {
        localApiRef.current?.setPage(1);
      });
      await waitFor(() => {
        expect(getRows.callCount).to.equal(2);
      });

      // Navigate back to page 0 which is now served by the cache.
      act(() => {
        localApiRef.current?.setPage(0);
      });
      await waitFor(() => {
        expect(localApiRef.current?.getRow('page-0-row')).not.to.equal(null);
      });

      // Resolve the page 1 fetch after the cache-hit. The stale response must not overwrite
      // the displayed page 0 data.
      resolvePage1(responses[1]);
      await page1Promise;

      expect(localApiRef.current?.getRow('page-0-row')).not.to.equal(null);
      expect(localApiRef.current?.getRow('page-1-stale-row')).to.equal(null);
    });

    it('should bypass cache when "skipCache" is true', async () => {
      const testCache = new TestCache();
      render(<TestDataSource dataSourceCache={testCache} />);

      // Wait for initial fetch
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(testCache.size()).to.equal(1);

      // Fetch same data again with skipCache = true
      act(() => {
        apiRef.current?.dataSource.fetchRows(undefined, { skipCache: true });
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      // Cache should still be updated with new data
      expect(testCache.size()).to.equal(1);

      // Fetch same data again without skipCache (should use cache)
      act(() => {
        apiRef.current?.dataSource.fetchRows();
      });

      // Should not trigger another fetch since data is cached
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
    });
  });

  describe('Revalidation', () => {
    it('should periodically revalidate the current query when dataSourceRevalidateMs is set', async () => {
      const localFetchRowsSpy = spy();
      render(
        <TestDataSource
          dataSourceCache={null}
          dataSourceRevalidateMs={1}
          onFetchRows={localFetchRowsSpy}
        />,
      );
      await waitFor(() => {
        expect(localFetchRowsSpy.callCount).to.be.greaterThan(0);
      });

      localFetchRowsSpy.resetHistory();

      await waitFor(() => {
        expect(localFetchRowsSpy.callCount).to.be.greaterThan(1);
      });
    });
  });

  describe('No rows overlay flicker', () => {
    it('should not render the "no rows" overlay between paginated re-fetches when the cache hits', async () => {
      const NoRowsOverlay = spy(() => null);
      render(<TestDataSource slots={{ noRowsOverlay: NoRowsOverlay }} />);

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      NoRowsOverlay.resetHistory();

      act(() => {
        apiRef.current?.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      act(() => {
        apiRef.current?.setPage(0);
      });

      await waitFor(() => {
        expect(apiRef.current?.getRowsCount()).to.be.greaterThan(0);
      });

      expect(NoRowsOverlay.callCount).to.equal(0);
    });

    it('should not render the "no rows" overlay between paginated re-fetches when the cache misses', async () => {
      const NoRowsOverlay = spy(() => null);
      render(<TestDataSource dataSourceCache={null} slots={{ noRowsOverlay: NoRowsOverlay }} />);

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      NoRowsOverlay.resetHistory();

      act(() => {
        apiRef.current?.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      await waitFor(() => {
        expect(apiRef.current?.getRowsCount()).to.be.greaterThan(0);
      });

      expect(NoRowsOverlay.callCount).to.equal(0);
    });

    it('should still render the "no rows" overlay when the response contains zero rows', async () => {
      const NoRowsOverlay = spy(() => null);
      render(
        <TestDataSource
          dataSourceCache={null}
          dataSetOptions={{ ...dataSetOptions, rowLength: 0 }}
          slots={{ noRowsOverlay: NoRowsOverlay }}
        />,
      );

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      await waitFor(() => {
        expect(NoRowsOverlay.callCount).to.be.greaterThan(0);
      });
    });
  });

  describe('dataSourceKeepPreviousData', () => {
    it('should keep the previous rows visible while new rows are being fetched', async () => {
      const { promise, resolve } = Promise.withResolvers<GridGetRowsResponse>();
      const initialResponse: GridGetRowsResponse = {
        rows: [{ id: 1, value: 'first' }],
        rowCount: 2,
      };
      const deferredResponse: GridGetRowsResponse = {
        rows: [{ id: 2, value: 'second' }],
        rowCount: 2,
      };
      let resolvedFirst = false;
      const getRows = spy(() => {
        if (!resolvedFirst) {
          resolvedFirst = true;
          return Promise.resolve(initialResponse);
        }
        return promise;
      });
      const dataSource: GridDataSource = { getRows };
      let localApiRef: RefObject<GridApi | null> = { current: null };
      function Test(props: Partial<DataGridProps>) {
        localApiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              apiRef={localApiRef}
              columns={[{ field: 'value' }]}
              dataSource={dataSource}
              dataSourceCache={null}
              dataSourceKeepPreviousData
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 1 }, rowCount: 0 },
              }}
              pagination
              pageSizeOptions={[1]}
              disableVirtualization
              {...props}
            />
          </div>
        );
      }

      const { setProps } = render(<Test />);

      await waitFor(() => {
        expect(localApiRef.current?.getRowsCount()).to.equal(1);
      });

      act(() => {
        setProps({ paginationModel: { page: 1, pageSize: 1 } });
      });

      await waitFor(() => {
        expect(getRows.callCount).to.equal(2);
      });
      // The previous row stays visible and the loading overlay is shown on top of it.
      expect(localApiRef.current?.getRowsCount()).to.equal(1);
      expect(localApiRef.current?.state.rows.loading).to.equal(true);

      await act(async () => {
        resolve(deferredResponse);
      });

      await waitFor(() => {
        expect(localApiRef.current?.getRow(2)).not.to.equal(null);
      });
    });

    it('should keep the previous rows visible when the `dataSource` reference changes', async () => {
      // The `dataSource`-identity effect refetches from scratch whenever the `dataSource`
      // reference changes (e.g. a non-memoized inline object). With `keepPreviousData` the
      // previous rows must stay visible during that refetch instead of being cleared.
      const { promise, resolve } = Promise.withResolvers<GridGetRowsResponse>();
      const firstDataSource: GridDataSource = {
        getRows: () => Promise.resolve({ rows: [{ id: 1, value: 'first' }], rowCount: 2 }),
      };
      const secondDataSource: GridDataSource = {
        getRows: spy(() => promise),
      };
      let localApiRef: RefObject<GridApi | null> = { current: null };
      function Test(props: Partial<DataGridProps>) {
        localApiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              apiRef={localApiRef}
              columns={[{ field: 'value' }]}
              dataSource={firstDataSource}
              dataSourceCache={null}
              dataSourceKeepPreviousData
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 1 }, rowCount: 0 },
              }}
              pagination
              pageSizeOptions={[1]}
              disableVirtualization
              {...props}
            />
          </div>
        );
      }

      const { setProps } = render(<Test />);

      await waitFor(() => {
        expect(localApiRef.current?.getRowsCount()).to.equal(1);
      });

      // Swap to a different `dataSource` reference whose response is deferred.
      act(() => {
        setProps({ dataSource: secondDataSource });
      });

      await waitFor(() => {
        expect((secondDataSource.getRows as ReturnType<typeof spy>).callCount).to.equal(1);
      });
      // Previous row remains visible while the new dataSource is fetched.
      expect(localApiRef.current?.getRowsCount()).to.equal(1);
      expect(localApiRef.current?.getRow(1)).to.deep.equal({ id: 1, value: 'first' });

      await act(async () => {
        resolve({ rows: [{ id: 2, value: 'second' }], rowCount: 2 });
      });

      await waitFor(() => {
        expect(localApiRef.current?.getRow(2)).not.to.equal(null);
      });
    });

    it('should clear the rows during the fetch when disabled (default)', async () => {
      const { promise, resolve } = Promise.withResolvers<GridGetRowsResponse>();
      const initialResponse: GridGetRowsResponse = {
        rows: [{ id: 1, value: 'first' }],
        rowCount: 2,
      };
      const deferredResponse: GridGetRowsResponse = {
        rows: [{ id: 2, value: 'second' }],
        rowCount: 2,
      };
      let resolvedFirst = false;
      const getRows = spy(() => {
        if (!resolvedFirst) {
          resolvedFirst = true;
          return Promise.resolve(initialResponse);
        }
        return promise;
      });
      const dataSource: GridDataSource = { getRows };
      let localApiRef: RefObject<GridApi | null> = { current: null };
      function Test(props: Partial<DataGridProps>) {
        localApiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              apiRef={localApiRef}
              columns={[{ field: 'value' }]}
              dataSource={dataSource}
              dataSourceCache={null}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 1 }, rowCount: 0 },
              }}
              pagination
              pageSizeOptions={[1]}
              disableVirtualization
              {...props}
            />
          </div>
        );
      }

      const { setProps } = render(<Test />);

      await waitFor(() => {
        expect(localApiRef.current?.getRowsCount()).to.equal(1);
      });

      act(() => {
        setProps({ paginationModel: { page: 1, pageSize: 1 } });
      });

      await waitFor(() => {
        expect(getRows.callCount).to.equal(2);
      });
      // Without the prop, the previous rows are cleared while the new page is fetched.
      expect(localApiRef.current?.getRowsCount()).to.equal(0);

      await act(async () => {
        resolve(deferredResponse);
      });

      await waitFor(() => {
        expect(localApiRef.current?.getRow(2)).not.to.equal(null);
      });
    });

    it('should not render the "no rows" overlay while keeping previous rows during fetch', async () => {
      const NoRowsOverlay = spy(() => null);
      render(
        <TestDataSource
          dataSourceCache={null}
          dataSourceKeepPreviousData
          slots={{ noRowsOverlay: NoRowsOverlay }}
        />,
      );

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      NoRowsOverlay.resetHistory();

      act(() => {
        apiRef.current?.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      await waitFor(() => {
        expect(apiRef.current?.getRowsCount()).to.be.greaterThan(0);
      });

      expect(NoRowsOverlay.callCount).to.equal(0);
    });

    it('should reset the rows when the refetch errors', async () => {
      // Even with `dataSourceKeepPreviousData`, a failed refetch resets the rows: the
      // previous rows no longer match the query the controls now reflect. Mirrors TanStack
      // Query, which clears the `keepPreviousData` placeholder once the query errors.
      const initialResponse: GridGetRowsResponse = {
        rows: [{ id: 1, value: 'first' }],
        rowCount: 2,
      };
      let firstCall = true;
      const getRows = spy(() => {
        if (firstCall) {
          firstCall = false;
          return Promise.resolve(initialResponse);
        }
        return Promise.reject(new Error('Network error'));
      });
      const dataSource: GridDataSource = { getRows };
      const onDataSourceError = spy();
      let localApiRef: RefObject<GridApi | null> = { current: null };
      function Test(props: Partial<DataGridProps>) {
        localApiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              apiRef={localApiRef}
              columns={[{ field: 'value' }]}
              dataSource={dataSource}
              dataSourceCache={null}
              dataSourceKeepPreviousData
              onDataSourceError={onDataSourceError}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 1 }, rowCount: 0 },
              }}
              pagination
              pageSizeOptions={[1]}
              disableVirtualization
              {...props}
            />
          </div>
        );
      }

      const { setProps } = render(<Test />);

      await waitFor(() => {
        expect(localApiRef.current?.getRowsCount()).to.equal(1);
      });

      act(() => {
        setProps({ paginationModel: { page: 1, pageSize: 1 } });
      });

      await waitFor(() => {
        expect(onDataSourceError.callCount).to.equal(1);
      });
      // The previous rows are reset once the request fails.
      expect(localApiRef.current?.getRowsCount()).to.equal(0);
      expect(localApiRef.current?.getRow(1)).to.equal(null);
      expect(localApiRef.current?.state.rows.loading).to.equal(false);
    });
  });

  describe('Error handling', () => {
    it('should call `onDataSourceError` when the data source returns an error', async () => {
      const onDataSourceError = spy();
      render(<TestDataSource onDataSourceError={onDataSourceError} shouldRequestsFail />);
      await waitFor(() => {
        expect(onDataSourceError.callCount).to.equal(1);
      });
    });

    it('should not call `onDataSourceError` after unmount', async () => {
      const onDataSourceError = spy();
      const { promise, reject } = Promise.withResolvers<GridGetRowsResponse>();
      const getRows = spy(() => promise);
      const dataSource: GridDataSource = {
        getRows,
      };
      const { unmount } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            columns={[{ field: 'id' }]}
            dataSource={dataSource}
            onDataSourceError={onDataSourceError}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 },
            }}
            pagination
            pageSizeOptions={pageSizeOptions}
            disableVirtualization
          />
        </div>,
      );
      await waitFor(() => {
        expect(getRows.called).to.equal(true);
      });
      unmount();
      reject();
      await promise.catch(() => 'rejected');
      expect(onDataSourceError.notCalled).to.equal(true);
    });
  });

  describe('Editing', () => {
    it('should call `editRow()` and clear the cache when a row is updated', async () => {
      const clearSpy = spy();
      const cache = new Map<string, GridGetRowsResponse>();
      const dataSourceCache = {
        get: (key: GridGetRowsParams) => cache.get(getKeyDefault(key)),
        set: (key: GridGetRowsParams, value: GridGetRowsResponse) =>
          cache.set(getKeyDefault(key), value),
        clear: () => {
          cache.clear();
          clearSpy();
        },
      };
      const { user } = render(
        <TestDataSource
          dataSourceCache={dataSourceCache}
          dataSetOptions={{ ...dataSetOptions, maxColumns: 3 }}
        />,
      );

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      await waitFor(() => {
        expect(Object.keys(apiRef.current!.state.rows.tree).length).to.equal(10 + 1);
      });
      const cell = getCell(0, 2);
      await user.click(cell);
      expect(cell).toHaveFocus();

      clearSpy.resetHistory();

      expect(cache.size).to.equal(1);

      // edit the cell
      await user.keyboard('{Enter} updated{Enter}');

      expect(editRowSpy.callCount).to.equal(1);
      expect(editRowSpy.lastCall.args[0].updatedRow.commodity).to.contain('updated');

      await waitFor(() => {
        expect(clearSpy.callCount).to.equal(1);
      });
    });

    // Context: https://github.com/mui/mui-x/pull/17684
    it('should call `editRow()` when a computed column is updated', async () => {
      const { user } = render(
        <TestDataSource
          dataSetOptions={{ ...dataSetOptions, maxColumns: 3 }}
          columns={[
            {
              field: 'commodity',
            },
            {
              field: 'computed',
              editable: true,
              valueGetter: (value, row) => `${row.commodity}-computed`,
              valueSetter: (value, row) => {
                const [commodity] = value!.toString().split('-');
                return { ...row, commodity: `${commodity}-edited` };
              },
            },
          ]}
          dataSourceCache={null}
        />,
      );

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      await waitFor(() => {
        expect(Object.keys(apiRef.current!.state.rows.tree).length).to.equal(10 + 1);
      });
      const cell = getCell(1, 1);
      await user.click(cell);
      expect(cell).toHaveFocus();

      editRowSpy.resetHistory();

      // edit the cell
      await user.keyboard('{Enter}{Enter}');

      expect(editRowSpy.callCount).to.equal(1);
      expect(editRowSpy.lastCall.args[0].updatedRow.commodity).to.contain('-edited');
    });
  });
});
