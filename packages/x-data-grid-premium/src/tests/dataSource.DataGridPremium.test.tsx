import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useMockServer } from '@mui/x-data-grid-generator';
import { createRenderer, waitFor, screen, within } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
  GridDataSource,
  GridGetRowsResponse,
  useGridApiRef,
  GRID_AGGREGATION_ROOT_FOOTER_ROW_ID,
  GRID_ROOT_GROUP_ID,
  GridGetRowsParams,
} from '@mui/x-data-grid-premium';
import { spy } from 'sinon';
import { getColumnHeaderCell, getRow } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

class TestCache {
  private cache: Map<string, GridGetRowsResponse>;

  constructor() {
    this.cache = new Map();
  }

  set(key: GridGetRowsParams, value: GridGetRowsResponse) {
    this.cache.set(JSON.stringify(key), value);
  }

  get(key: GridGetRowsParams) {
    return this.cache.get(JSON.stringify(key));
  }

  size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
  }
}

describe.skipIf(isJSDOM)('<DataGridPremium /> - Data source', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;
  const fetchRowsSpy = spy();

  // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
  function Reset() {
    React.useLayoutEffect(() => {
      fetchRowsSpy.resetHistory();
    }, []);
    return null;
  }

  function TestDataSource(
    props: Partial<DataGridPremiumProps> & {
      getAggregatedValue?: GridDataSource['getAggregatedValue'];
    },
  ) {
    apiRef = useGridApiRef();
    const { getAggregatedValue: getAggregatedValueProp, ...rest } = props;
    const { fetchRows, columns, isReady } = useMockServer<GridGetRowsResponse>(
      { rowLength: 200, maxColumns: 1 },
      { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false },
    );

    const dataSource: GridDataSource = React.useMemo(() => {
      return {
        getRows: async (params) => {
          const urlParams = new URLSearchParams({
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            aggregationModel: JSON.stringify(params.aggregationModel),
          });

          fetchRowsSpy(params);

          const getRowsResponse = await fetchRows(
            `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
          );

          return {
            rows: getRowsResponse.rows,
            rowCount: getRowsResponse.rowCount,
            aggregateRow: getRowsResponse.aggregateRow,
          };
        },
        getAggregatedValue:
          getAggregatedValueProp ??
          ((row, field) => {
            return row[`${field}Aggregate`];
          }),
      };
    }, [fetchRows, getAggregatedValueProp]);

    if (!isReady) {
      return null;
    }

    return (
      <div style={{ width: 300, height: 300 }}>
        <Reset />
        <DataGridPremium
          apiRef={apiRef}
          dataSource={dataSource}
          columns={columns}
          disableVirtualization
          aggregationFunctions={{
            sum: { columnTypes: ['number'] },
            avg: { columnTypes: ['number'] },
            min: { columnTypes: ['number', 'date', 'dateTime'] },
            max: { columnTypes: ['number', 'date', 'dateTime'] },
            size: {},
          }}
          {...rest}
        />
      </div>
    );
  }

  // TODO @MBilalShafi: Flaky test, fix it
  it.skip('should show aggregation option in the column menu', async () => {
    const dataSource = {
      getRows: async () => {
        fetchRowsSpy();
        return {
          rows: [{ id: 123 }],
          rowCount: 1,
          aggregateRow: {},
        };
      },
      getAggregatedValue: () => 'Agg value',
    };
    const { user } = render(<TestDataSource dataSource={dataSource} columns={[{ field: 'id' }]} />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
    });
    await user.click(within(getColumnHeaderCell(0)).getByLabelText('id column menu'));
    // wait for the column menu to be open first
    await screen.findByRole('menu', { name: 'id column menu' });
    await screen.findByLabelText('Aggregation');
  });

  it('should not show aggregation option in the column menu when no aggregation function is defined', async () => {
    const { user } = render(<TestDataSource aggregationFunctions={{}} />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
    });
    await user.click(within(getColumnHeaderCell(0)).getByLabelText('id column menu'));
    expect(screen.queryByLabelText('Aggregation')).to.equal(null);
  });

  it('should provide the `aggregationModel` in the `getRows` params', async () => {
    render(
      <TestDataSource
        initialState={{
          aggregation: { model: { id: 'size' } },
        }}
      />,
    );
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
    });

    expect(fetchRowsSpy.lastCall.args[0].aggregationModel).to.deep.equal({ id: 'size' });
  });

  it('should show the aggregation footer row when aggregation is enabled', async () => {
    render(
      <TestDataSource
        initialState={{
          aggregation: { model: { id: 'size' } },
        }}
      />,
    );
    await waitFor(() => {
      expect(Object.keys(apiRef.current!.state.aggregation.lookup).length).to.be.greaterThan(0);
    });
    expect(apiRef.current?.state.rows.tree[GRID_AGGREGATION_ROOT_FOOTER_ROW_ID]).not.to.equal(null);
    await waitFor(() => {
      const footerRow = apiRef.current?.state.aggregation.lookup[GRID_ROOT_GROUP_ID];
      expect(footerRow?.id).to.deep.equal({ position: 'footer', value: 200 });
    });
  });

  it('should derive the aggregation values using `dataSource.getAggregatedValue`', async () => {
    const getAggregatedValue = () => 'Agg value';
    render(
      <TestDataSource
        initialState={{
          aggregation: { model: { id: 'size' } },
        }}
        getAggregatedValue={getAggregatedValue}
      />,
    );
    await waitFor(() => {
      expect(Object.keys(apiRef.current!.state.aggregation.lookup).length).to.be.greaterThan(0);
    });
    expect(apiRef.current?.state.aggregation.lookup[GRID_ROOT_GROUP_ID].id.value).to.equal(
      'Agg value',
    );
  });

  describe('Cache', () => {
    it('should cache the data in one chunk when pagination is disabled', async () => {
      const testCache = new TestCache();
      render(<TestDataSource dataSourceCache={testCache} />);
      await waitFor(() => {
        expect(fetchRowsSpy.callCount).to.equal(1);
      });
      // wait until the rows are rendered
      await waitFor(() => expect(getRow(199)).not.to.be.undefined);
      expect(testCache.size()).to.equal(1); // 1 chunk of 200 rows
    });
  });
});
