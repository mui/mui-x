import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor } from '@mui/internal-test-utils';
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
import { isJSDOM } from 'test/utils/skipIf';
import { getCell } from 'test/utils/helperFn';
import { getKeyDefault } from '../hooks/features/dataSource/cache';
import { TestCache } from '../internals/utils';

const pageSizeOptions = [10, 20];
const serverOptions = { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false };
const dataSetOptions = { rowLength: 100, maxColumns: 1, editable: true };

// Needs layout
describe.skipIf(isJSDOM)('<DataGrid /> - Data source', () => {
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

  function TestDataSource(
    props: Partial<DataGridProps> & {
      shouldRequestsFail?: boolean;
      dataSetOptions?: Partial<typeof dataSetOptions>;
    },
  ) {
    apiRef = useGridApiRef();
    const { dataSetOptions: dataSetOptionsProp, shouldRequestsFail, ...rest } = props;
    mockServer = useMockServer(
      dataSetOptionsProp ?? dataSetOptions,
      serverOptions,
      shouldRequestsFail ?? false,
    );

    const { fetchRows, editRow } = mockServer;

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
        updateRow: async (params) => {
          editRowSpy(params);
          const syncedRow = await editRow(params.rowId, params.updatedRow);
          return syncedRow;
        },
      };
    }, [fetchRows, editRow]);

    if (!mockServer.isReady) {
      return null;
    }

    return (
      <div style={{ width: 300, height: 300 }}>
        <Reset />
        <DataGrid
          apiRef={apiRef}
          columns={mockServer.columns}
          dataSource={dataSource}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 } }}
          pagination
          pageSizeOptions={pageSizeOptions}
          disableVirtualization
          {...rest}
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
