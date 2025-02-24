import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { RefObject } from '@mui/x-internals/types';
import {
  DataGrid,
  DataGridProps,
  GridApi,
  GridDataSource,
  GridGetRowsParams,
  GridGetRowsResponse,
  useGridApiRef,
} from '@mui/x-data-grid';
import { spy } from 'sinon';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import { getKeyDefault } from '../hooks/features/dataSource/cache';

class TestCache {
  private cache: Map<string, GridGetRowsResponse>;

  constructor() {
    this.cache = new Map();
  }

  set(key: GridGetRowsParams, value: GridGetRowsResponse) {
    this.cache.set(getKeyDefault(key), value);
  }

  get(key: GridGetRowsParams) {
    return this.cache.get(getKeyDefault(key));
  }

  size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
  }
}

const pageSizeOptions = [10, 20];
const serverOptions = { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false };

// Needs layout
describeSkipIf(isJSDOM)('<DataGrid /> - Data source', () => {
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

  function TestDataSource(props: Partial<DataGridProps> & { shouldRequestsFail?: boolean }) {
    apiRef = useGridApiRef();
    mockServer = useMockServer(
      { rowLength: 100, maxColumns: 1 },
      serverOptions,
      props.shouldRequestsFail ?? false,
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
          fetchRowsSpy(url);
          const getRowsResponse = await fetchRows(url);

          return {
            rows: getRowsResponse.rows,
            rowCount: getRowsResponse.rowCount,
          };
        },
      };
    }, [fetchRows]);

    if (!mockServer.isReady) {
      return null;
    }

    return (
      <div style={{ width: 300, height: 300 }}>
        <Reset />
        <DataGrid
          apiRef={apiRef}
          columns={mockServer.columns}
          unstable_dataSource={dataSource}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 } }}
          pagination
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
      render(<TestDataSource unstable_dataSourceCache={testCache} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(testCache.size()).to.equal(1);
    });

    it('should cache the data in the chunks defined by the minimum page size', async () => {
      const testCache = new TestCache();
      render(
        <TestDataSource
          unstable_dataSourceCache={testCache}
          paginationModel={{ page: 0, pageSize: 20 }}
        />,
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
        <TestDataSource
          unstable_dataSourceCache={testCache}
          onPaginationModelChange={pageChangeSpy}
        />,
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
      render(
        <TestDataSource unstable_dataSourceCache={null} onPaginationModelChange={pageChangeSpy} />,
      );
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
  });

  describe('Error handling', () => {
    it('should call `unstable_onDataSourceError` when the data source returns an error', async () => {
      const onDataSourceError = spy();
      render(<TestDataSource unstable_onDataSourceError={onDataSourceError} shouldRequestsFail />);
      await waitFor(() => {
        expect(onDataSourceError.callCount).to.equal(1);
      });
    });
  });
});
