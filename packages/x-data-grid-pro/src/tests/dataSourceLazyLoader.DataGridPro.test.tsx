import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { act, createRenderer, waitFor } from '@mui/internal-test-utils';
import { getRow } from 'test/utils/helperFn';
import { expect } from 'chai';
import { RefObject } from '@mui/x-internals/types';
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
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';

// Needs layout
describeSkipIf(isJSDOM)('<DataGridPro /> - Data source lazy loader', () => {
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
    props: Partial<DataGridProProps> & { mockServerRowCount?: number },
  ) {
    const { mockServerRowCount, ...rest } = props;
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
          fetchRowsSpy(url);
          const getRowsResponse = await fetchRows(url);

          const response = transformGetRowsResponse(getRowsResponse);
          return {
            rows: response.rows,
            rowCount: response.rowCount,
          };
        },
      };
    }, [fetchRows]);

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
          {...rest}
        />
      </div>
    );
  }

  // eslint-disable-next-line mocha/no-top-level-hooks
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
      expect(beforeSortSearchParams.get('end')).to.not.equal('9');

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

    it('should call make a new data source request when there is not enough rows to cover the viewport height', async () => {
      render(
        <TestDataSourceLazyLoader
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 2 }, rowCount: undefined },
          }}
        />,
      );

      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(3); // grid is 4 rows high and the threshold is 60px, so 3 pages are loaded
      });
      const lastSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
      expect(lastSearchParams.get('end')).to.equal('5'); // 6th row
    });

    it('should call stop making data source requests if the new rows were not added on the last call', async () => {
      render(
        <TestDataSourceLazyLoader
          mockServerRowCount={2}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 2 }, rowCount: undefined },
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
      expect(beforeSortingSearchParams.get('end')).to.not.equal('9');

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
      expect(beforeFilteringSearchParams.get('end')).to.not.equal('9');

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
});
