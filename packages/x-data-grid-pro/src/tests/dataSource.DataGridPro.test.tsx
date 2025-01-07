import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor, screen, within } from '@mui/internal-test-utils';
import { expect } from 'chai';
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
import { SinonSpy, spy } from 'sinon';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import { getKey } from '../hooks/features/dataSource/cache';

const cache = new Map<string, GridGetRowsResponse>();

const testCache: GridDataSourceCache = {
  set: (key, value) => cache.set(getKey(key), value),
  get: (key) => cache.get(getKey(key)),
  clear: () => cache.clear(),
};

// Needs layout
describeSkipIf(isJSDOM)('<DataGridPro /> - Data source', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;
  let fetchRowsSpy: SinonSpy;
  let mockServer: ReturnType<typeof useMockServer>;

  function TestDataSource(props: Partial<DataGridProProps> & { shouldRequestsFail?: boolean }) {
    apiRef = useGridApiRef();
    const { shouldRequestsFail = false, ...rest } = props;
    mockServer = useMockServer(
      { rowLength: 100, maxColumns: 1 },
      { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false },
      shouldRequestsFail,
    );
    fetchRowsSpy = spy(mockServer, 'fetchRows');
    const { fetchRows } = mockServer;

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

    const baselineProps = {
      unstable_dataSource: dataSource,
      columns: mockServer.columns,
      initialState: { pagination: { paginationModel: { page: 0, pageSize: 10 } } },
      disableVirtualization: true,
    };

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro apiRef={apiRef} {...baselineProps} {...rest} />
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

  describe('Cache', () => {
    it('should cache the data using the default cache', async () => {
      render(<TestDataSource />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      const dataRow1 = await screen.findByText(
        (_, el) => el?.getAttribute('data-rowindex') === '0',
      );

      const cell1 = within(dataRow1).getByRole('gridcell');
      const cell1Content = cell1.innerText;

      act(() => {
        apiRef.current.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      const dataRow2 = await screen.findByText(
        (_, el) => el?.getAttribute('data-rowindex') === '0' && el !== dataRow1,
      );
      const cell2 = within(dataRow2).getByRole('gridcell');
      const cell2Content = cell2.innerText;
      expect(cell2Content).not.to.equal(cell1Content);

      act(() => {
        apiRef.current.setPage(0);
      });

      expect(fetchRowsSpy.callCount).to.equal(2);

      const dataRow3 = await screen.findByText(
        (_, el) => el?.getAttribute('data-rowindex') === '0' && el !== dataRow1 && el !== dataRow2,
      );
      const cell3 = within(dataRow3).getByRole('gridcell');
      const cell3Content = cell3.innerText;
      expect(cell3Content).to.equal(cell1Content);
    });

    it('should cache the data using the custom cache', async () => {
      render(<TestDataSource unstable_dataSourceCache={testCache} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(cache.size).to.equal(1);
    });

    it('should use the cached data when the same query is made again', async () => {
      render(<TestDataSource unstable_dataSourceCache={testCache} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      expect(cache.size).to.equal(1);

      const dataRow1 = await screen.findByText(
        (_, el) => el?.getAttribute('data-rowindex') === '0',
      );

      const cell1 = within(dataRow1).getByRole('gridcell');

      const cell1Content = cell1.innerText;

      act(() => {
        apiRef.current.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });
      expect(cache.size).to.equal(2);

      const dataRow2 = await screen.findByText(
        (_, el) => el?.getAttribute('data-rowindex') === '0' && el !== dataRow1,
      );

      const cell2 = within(dataRow2).getByRole('gridcell');

      const cell2Content = cell2.innerText;
      expect(cell2Content).not.to.equal(cell1Content);

      act(() => {
        apiRef.current.setPage(0);
      });

      const dataRow3 = await screen.findByText(
        (_, el) => el?.getAttribute('data-rowindex') === '0' && el !== dataRow1 && el !== dataRow2,
      );

      const cell3 = within(dataRow3).getByRole('gridcell');

      const cell3Content = cell3.innerText;
      expect(cell3Content).to.equal(cell1Content);

      expect(fetchRowsSpy.callCount).to.equal(2);
      expect(cache.size).to.equal(2);
    });

    it('should allow to disable the default cache', async () => {
      // only
      render(<TestDataSource unstable_dataSourceCache={null} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });

      const dataRow1 = await screen.findByText(
        (_, el) => el?.getAttribute('data-rowindex') === '0',
      );

      const cell1 = within(dataRow1).getByRole('gridcell');

      const cell1Content = cell1.innerText;

      act(() => {
        apiRef.current.setPage(1);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(2);
      });

      const dataRow2 = await screen.findByText(
        (_, el) => el?.getAttribute('data-rowindex') === '0' && el !== dataRow1,
      );

      const cell2 = within(dataRow2).getByRole('gridcell');

      const cell2Content = cell2.innerText;
      expect(cell2Content).not.to.equal(cell1Content);

      act(() => {
        apiRef.current.setPage(0);
      });

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(3);
      });
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
