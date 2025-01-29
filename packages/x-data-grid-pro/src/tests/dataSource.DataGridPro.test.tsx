import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor } from '@mui/internal-test-utils';
import { RefObject } from '@mui/x-internals/types';
import { expect } from 'chai';
import {
  DataGridPro,
  DataGridProProps,
  GridApi,
  GridDataSource,
  GridGetRowsParams,
  GridGetRowsResponse,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { spy } from 'sinon';
import { getKey } from '../hooks/features/dataSource/cache';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

class TestCache {
  private cache: Map<string, GridGetRowsResponse>;

  constructor() {
    this.cache = new Map();
  }

  set(key: GridGetRowsParams, value: GridGetRowsResponse) {
    this.cache.set(getKey(key), value);
  }

  get(key: GridGetRowsParams) {
    return this.cache.get(getKey(key));
  }

  size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
  }
}

const pageSizeOptions = [10];
const serverOptions = { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false };

describe('<DataGridPro /> - Data source', () => {
  const { render } = createRenderer();
  const fetchRowsSpy = spy();

  let apiRef: RefObject<GridApi>;
  let mockServer: ReturnType<typeof useMockServer>;

  function TestDataSource(props: Partial<DataGridProProps> & { shouldRequestsFail?: boolean }) {
    apiRef = useGridApiRef();
    mockServer = useMockServer(
      { rowLength: 100, maxColumns: 1 },
      serverOptions,
      props.shouldRequestsFail ?? false,
    );

    const { fetchRows } = mockServer;

    const dataSource: GridDataSource = React.useMemo(() => {
      fetchRowsSpy.resetHistory();
      return {
        getRows: async (params: GridGetRowsParams) => {
          const urlParams = new URLSearchParams({
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            paginationModel: JSON.stringify(params.paginationModel),
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

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
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

  beforeEach(function beforeTest() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
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
      apiRef.current.setPage(1);
    });
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(1);
    });
  });

  it('should re-fetch the data once if multiple models have changed', async () => {
    const { setProps } = render(<TestDataSource />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });

    setProps({
      paginationModel: { page: 1, pageSize: 10 },
      sortModel: [{ field: 'name', sort: 'asc' }],
      filterModel: { items: [{ field: 'name', value: 'John', operator: 'contains' }] },
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
        apiRef.current.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      expect(pageChangeSpy.callCount).to.equal(1);

      act(() => {
        apiRef.current.setPage(0);
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
        apiRef.current.setPage(1);
      });
      await waitFor(() => {
        expect(testCache.size()).to.equal(2);
      });
      expect(pageChangeSpy.callCount).to.equal(1);

      act(() => {
        apiRef.current.setPage(0);
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
        apiRef.current.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      expect(pageChangeSpy.callCount).to.equal(1);

      act(() => {
        apiRef.current.setPage(0);
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
