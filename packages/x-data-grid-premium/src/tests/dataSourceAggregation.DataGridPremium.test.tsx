import * as React from 'react';
import { type RefObject } from '@mui/x-internals/types';
import { useMockServer } from '@mui/x-data-grid-generator';
import { createRenderer, waitFor, screen, within } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  type DataGridPremiumProps,
  type GridApi,
  type GridDataSource,
  type GridGroupNode,
  type GridGetRowsResponse,
  useGridApiRef,
  GRID_AGGREGATION_ROOT_FOOTER_ROW_ID,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-premium';
import { spy } from 'sinon';
import { getColumnHeaderCell, getCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe.skipIf(isJSDOM)('<DataGridPremium /> - Data source aggregation', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;
  const fetchRowsSpy = spy();
  const editRowSpy = spy();

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
      dataSetOptions?: Record<string, any>;
    },
  ) {
    apiRef = useGridApiRef();
    const { getAggregatedValue: getAggregatedValueProp, dataSetOptions, ...other } = props;
    const {
      fetchRows,
      columns: mockColumns,
      isReady,
      editRow,
    } = useMockServer<GridGetRowsResponse>(
      { rowLength: 10, maxColumns: 1, ...dataSetOptions },
      { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false },
    );

    const columns = React.useMemo(() => {
      return mockColumns.map((column) => ({
        ...column,
        editable: true,
      }));
    }, [mockColumns]);

    const dataSource: GridDataSource = React.useMemo(() => {
      return {
        getRows: async (params) => {
          const urlParams = new URLSearchParams({
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            paginationModel: JSON.stringify(params.paginationModel),
            groupKeys: JSON.stringify(params.groupKeys),
            groupFields: JSON.stringify(params.groupFields),
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
        getGroupKey: (row) => row.group,
        getChildrenCount: (row) => row.descendantCount,
        getAggregatedValue: getAggregatedValueProp ?? ((row, field) => row[field]),
        updateRow: async (params) => {
          editRowSpy(params);
          const syncedRow = await editRow(params.rowId, params.updatedRow);
          return syncedRow;
        },
      };
    }, [fetchRows, editRow, getAggregatedValueProp]);

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
          {...other}
        />
      </div>
    );
  }

  // TODO @MBilalShafi: Flaky test, fix it
  it.todo('should show aggregation option in the column menu', async () => {
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
    const { user } = render(
      <TestDataSourceAggregation dataSource={dataSource} columns={[{ field: 'id' }]} />,
    );
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
    });
    await user.click(within(getColumnHeaderCell(0)).getByLabelText('id column menu'));
    // wait for the column menu to be open first
    await screen.findByRole('menu', { name: 'id column menu' });
    await screen.findByLabelText('Aggregation');
  });

  it('should not show aggregation option in the column menu when no aggregation function is defined', async () => {
    const { user } = render(<TestDataSourceAggregation aggregationFunctions={{}} />);
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
    });
    await user.click(within(getColumnHeaderCell(0)).getByLabelText('id column menu'));
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

  it('should periodically revalidate grouped rows when dataSourceRevalidateMs is set', async () => {
    render(
      <TestDataSourceAggregation
        dataSourceCache={null}
        dataSourceRevalidateMs={1}
        initialState={{
          rowGrouping: { model: ['company'] },
        }}
        dataSetOptions={{
          dataSet: 'Movies',
          rowLength: 100,
          maxColumns: undefined,
        }}
      />,
    );
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
    });

    fetchRowsSpy.resetHistory();

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(1);
    });
  });

  it('should not set children loading state during background grouped revalidation', async () => {
    const { user } = render(
      <TestDataSourceAggregation
        dataSourceCache={null}
        dataSourceRevalidateMs={1}
        initialState={{
          rowGrouping: { model: ['company'] },
        }}
        dataSetOptions={{
          dataSet: 'Movies',
          rowLength: 100,
          maxColumns: undefined,
        }}
      />,
    );

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(1);
    });
    await waitFor(() => {
      expect(Object.keys(apiRef.current!.state.rows.tree).length).to.be.greaterThan(1);
    });

    const expandedRowId = (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode)
      .children[0];
    const cell11 = getCell(0, 0);
    await user.click(within(cell11).getByRole('button'));

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.be.greaterThan(1);
    });

    const setChildrenLoadingSpy = spy(apiRef.current!.dataSource, 'setChildrenLoading');

    fetchRowsSpy.resetHistory();
    setChildrenLoadingSpy.resetHistory();

    await waitFor(() => {
      const hasNestedGroupRequest = fetchRowsSpy.getCalls().some((call) => {
        const groupKeys = call.args[0].groupKeys || [];
        return groupKeys.length > 0;
      });
      expect(hasNestedGroupRequest).to.equal(true);
    });

    const hasLoadingTrueCall = setChildrenLoadingSpy
      .getCalls()
      .some((call) => call.args[0] === expandedRowId && call.args[1] === true);
    setChildrenLoadingSpy.restore();
    expect(hasLoadingTrueCall).to.equal(false);
  });

  it('should re-fetch all parents when the leaf row is updated', async () => {
    const { user } = render(
      <TestDataSourceAggregation
        dataSourceCache={null}
        initialState={{
          rowGrouping: { model: ['company'] },
          aggregation: { model: { gross: 'sum' } },
        }}
        dataSetOptions={{
          dataSet: 'Movies',
          rowLength: 100,
          editable: true,
          maxColumns: undefined,
        }}
      />,
    );

    expect(fetchRowsSpy.callCount).to.equal(1);
    await waitFor(() => {
      expect(Object.keys(apiRef.current!.state.rows.tree).length).to.be.greaterThan(1);
    });

    const cell11 = getCell(0, 0);
    await user.click(within(cell11).getByRole('button'));

    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(2);
    });

    const cell = getCell(1, apiRef.current!.state.columns.orderedFields.indexOf('gross'));
    await user.click(cell);
    expect(cell).toHaveFocus();

    await user.keyboard('{Enter}{Delete}1{Enter}');

    expect(editRowSpy.callCount).to.equal(1);
    // Two additional calls should be made
    await waitFor(() => {
      expect(fetchRowsSpy.callCount).to.equal(4);
    });
  });
});
