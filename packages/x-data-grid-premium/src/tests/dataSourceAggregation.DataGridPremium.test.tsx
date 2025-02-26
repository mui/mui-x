import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useMockServer } from '@mui/x-data-grid-generator';
import { createRenderer, waitFor, screen, within } from '@mui/internal-test-utils';
import { expect } from 'chai';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
  GridDataSource,
  GridGetRowsResponse,
  useGridApiRef,
  GRID_AGGREGATION_ROOT_FOOTER_ROW_ID,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-premium';
import { spy } from 'sinon';
import { getColumnHeaderCell } from 'test/utils/helperFn';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';

describeSkipIf(isJSDOM)('<DataGridPremium /> - Data source aggregation', () => {
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

  function TestDataSourceAggregation(
    props: Partial<DataGridPremiumProps> & {
      getAggregatedValue?: GridDataSource['getAggregatedValue'];
    },
  ) {
    apiRef = useGridApiRef();
    const { getAggregatedValue: getAggregatedValueProp, ...rest } = props;
    const { fetchRows, columns, isReady } = useMockServer<GridGetRowsResponse>(
      { rowLength: 10, maxColumns: 1 },
      { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false },
    );

    const dataSource: GridDataSource = React.useMemo(() => {
      return {
        getRows: async (params) => {
          const urlParams = new URLSearchParams({
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            paginationModel: JSON.stringify(params.paginationModel),
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

  it('should show aggregation option in the column menu', async () => {
    const { user } = render(<TestDataSourceAggregation />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
    });
    await user.click(within(getColumnHeaderCell(0)).getByLabelText('Menu'));
    expect(await screen.findByLabelText('Aggregation')).not.to.equal(null);
  });

  it('should not show aggregation option in the column menu when no aggregation function is defined', async () => {
    const { user } = render(<TestDataSourceAggregation aggregationFunctions={{}} />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
    });
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
      expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
    });

    expect(fetchRowsSpy.lastCall.args[0].aggregationModel).to.deep.equal({ id: 'size' });
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
      expect(Object.keys(apiRef.current!.state.aggregation.lookup).length).to.be.greaterThan(0);
    });
    expect(apiRef.current?.state.rows.tree[GRID_AGGREGATION_ROOT_FOOTER_ROW_ID]).not.to.equal(null);
    await waitFor(() => {
      const footerRow = apiRef.current?.state.aggregation.lookup[GRID_ROOT_GROUP_ID];
      expect(footerRow?.id).to.deep.equal({ position: 'footer', value: 10 });
    });
  });

  it('should derive the aggregation values using `dataSource.getAggregatedValue`', async () => {
    const getAggregatedValue = () => 'Agg value';
    render(
      <TestDataSourceAggregation
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
});
