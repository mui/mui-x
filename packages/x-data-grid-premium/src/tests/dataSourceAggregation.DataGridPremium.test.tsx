import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import { createRenderer, waitFor, screen, within } from '@mui/internal-test-utils';
import { expect } from 'chai';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
  GridDataSource,
  GridGetRowsParams,
  useGridApiRef,
  GRID_AGGREGATION_ROOT_FOOTER_ROW_ID,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-premium';
import { SinonSpy, spy } from 'sinon';
import { getColumnHeaderCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPremium /> - Data source aggregation', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;
  let getRowsSpy: SinonSpy;
  let mockServer: ReturnType<typeof useMockServer>;

  function TestDataSourceAggregation(
    props: Partial<DataGridPremiumProps> & {
      getAggregatedValue?: GridDataSource['getAggregatedValue'];
    },
  ) {
    apiRef = useGridApiRef();
    const { getAggregatedValue: getAggregatedValueProp, ...rest } = props;
    mockServer = useMockServer(
      { rowLength: 10, maxColumns: 1 },
      { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false },
    );

    const { fetchRows } = mockServer;

    const dataSource: GridDataSource = React.useMemo(
      () => ({
        getRows: async (params: GridGetRowsParams) => {
          const urlParams = new URLSearchParams({
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            paginationModel: JSON.stringify(params.paginationModel),
            aggregationModel: JSON.stringify(params.aggregationModel),
          });

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
      }),
      [fetchRows, getAggregatedValueProp],
    );

    getRowsSpy?.restore();
    getRowsSpy = spy(dataSource, 'getRows');

    const baselineProps = {
      unstable_dataSource: dataSource,
      columns: mockServer.columns,
      disableVirtualization: true,
      aggregationFunctions: {
        sum: { columnTypes: ['number'] },
        avg: { columnTypes: ['number'] },
        min: { columnTypes: ['number', 'date', 'dateTime'] },
        max: { columnTypes: ['number', 'date', 'dateTime'] },
        size: {},
      },
    };

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium apiRef={apiRef} {...baselineProps} {...rest} />
      </div>
    );
  }

  beforeEach(function beforeTest() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
  });

  it('should show aggregation option in the column menu', async () => {
    const { user } = render(<TestDataSourceAggregation />);
    await user.click(within(getColumnHeaderCell(0)).getByLabelText('Menu'));
    expect(screen.queryByLabelText('Aggregation')).not.to.equal(null);
  });

  it('should not show aggregation option in the column menu when no aggregation function is defined', async () => {
    const { user } = render(<TestDataSourceAggregation aggregationFunctions={{}} />);
    await user.click(within(getColumnHeaderCell(0)).getByLabelText('Menu'));
    expect(screen.queryByLabelText('Aggregation')).to.equal(null);
  });

  it('should provide the `aggregationModel` in the `getRows` params', async () => {
    render(
      <TestDataSourceAggregation
        initialState={{
          aggregation: { model: { id: 'size' } },
        }}
      />,
    );
    await waitFor(() => {
      expect(getRowsSpy.callCount).to.be.greaterThan(0);
    });
    expect(getRowsSpy.args[0][0].aggregationModel).to.deep.equal({ id: 'size' });
  });

  it('should show the aggregation footer row when aggregation is enabled', async () => {
    render(
      <TestDataSourceAggregation
        initialState={{
          aggregation: { model: { id: 'size' } },
        }}
      />,
    );
    await waitFor(() => {
      expect(Object.keys(apiRef.current.state.aggregation.lookup).length).to.be.greaterThan(0);
    });
    expect(apiRef.current.state.rows.tree[GRID_AGGREGATION_ROOT_FOOTER_ROW_ID]).not.to.equal(null);
    const footerRow = apiRef.current.state.aggregation.lookup[GRID_ROOT_GROUP_ID];
    expect(footerRow.id).to.deep.equal({ position: 'footer', value: 10 });
  });

  it('should derive the aggregation values using `dataSource.getAggregatedValue`', async () => {
    render(
      <TestDataSourceAggregation
        initialState={{
          aggregation: { model: { id: 'size' } },
        }}
        getAggregatedValue={() => 'Agg value'}
      />,
    );
    await waitFor(() => {
      expect(Object.keys(apiRef.current.state.aggregation.lookup).length).to.be.greaterThan(0);
    });
    expect(apiRef.current.state.aggregation.lookup[GRID_ROOT_GROUP_ID].id.value).to.equal(
      'Agg value',
    );
  });
});
