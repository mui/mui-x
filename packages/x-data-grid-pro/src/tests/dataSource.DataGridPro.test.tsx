import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { RefObject } from '@mui/x-internals/types';
import {
  DataGridPro,
  DataGridProProps,
  GridApi,
  GridDataSource,
  GridDataSourceCache,
  GridGetRowsParams,
  GridGetRowsResponse,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { SinonStub, spy, stub } from 'sinon';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import { getKeyDefault } from '../hooks/features/dataSource/cache';
import useLazyRef from '@mui/utils/useLazyRef';

const cache = new Map<string, GridGetRowsResponse>();

const testCache: GridDataSourceCache = {
  set: (key, value) => cache.set(getKeyDefault(key), value),
  get: (key) => cache.get(getKeyDefault(key)),
  clear: () => cache.clear(),
};

const pageSizeOptions = [10, 20];
const serverOptions = { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false };

// Needs layout
describeSkipIf(isJSDOM)('<DataGridPro /> - Data source', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;
  let fetchRowsSpy: SinonStub;
  let mockServer: ReturnType<typeof useMockServer>;

  function TestDataSource(props: Partial<DataGridProProps> & { shouldRequestsFail?: boolean }) {
    apiRef = useGridApiRef();
    mockServer = useMockServer(
      { rowLength: 100, maxColumns: 1 },
      serverOptions,
      props.shouldRequestsFail ?? false,
    );

    // Reuse the same stub between rerenders to properly count the calls
    fetchRowsSpy = useLazyRef(() => stub()).current;

    const originalFetchRows = mockServer.fetchRows;
    const fetchRows = React.useMemo<typeof originalFetchRows>(() => {
      fetchRowsSpy.resetHistory();
      fetchRowsSpy.callsFake(originalFetchRows);
      return (...args) => fetchRowsSpy(...args);
    }, [originalFetchRows]);

    const dataSource: GridDataSource = React.useMemo(
      () => ({
        getRows: async (params: GridGetRowsParams) => {
          const urlParams = new URLSearchParams({
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            start: `${params.start}`,
            end: `${params.end}`,
          });

          const getRowsResponse = await fetchRows(
            `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
          );

          return {
            rows: getRowsResponse.rows,
            rowCount: getRowsResponse.rowCount,
          };
        },
      }),
      [fetchRows],
    );

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

  // eslint-disable-next-line mocha/no-top-level-hooks
  beforeEach(() => {
    cache.clear();
  });

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
      render(<TestDataSource unstable_dataSourceCache={testCache} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(cache.size).to.equal(1);
    });

    it('should cache the data in the chunks defined by the minimum page size', async () => {
      render(
        <TestDataSource
          unstable_dataSourceCache={testCache}
          paginationModel={{ page: 0, pageSize: 20 }}
        />,
      );
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(cache.size).to.equal(2); // 2 chunks of 10 rows
    });

    it('should use the cached data when the same query is made again', async () => {
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
      expect(cache.size).to.equal(1);
      expect(pageChangeSpy.callCount).to.equal(0);

      act(() => {
        apiRef.current?.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      expect(cache.size).to.equal(2);
      expect(pageChangeSpy.callCount).to.equal(1);

      act(() => {
        apiRef.current?.setPage(0);
      });

      expect(fetchRowsSpy.callCount).to.equal(2);
      expect(cache.size).to.equal(2);
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
