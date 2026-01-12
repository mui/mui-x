import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useMockServer } from '@mui/x-data-grid-generator';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
  GridDataSource,
  GridGetRowsResponse,
  useGridApiRef,
  GridPivotModel,
  GRID_AGGREGATION_ROOT_FOOTER_ROW_ID,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-premium';
import { vi } from 'vitest';
import { getColumnHeadersTextContent, getRowValues } from 'test/utils/helperFn';
import { PivotingColDefCallback } from '../hooks/features/pivoting/gridPivotingInterfaces';

describe('<DataGridPremium /> - Data source pivoting', () => {
  const { render } = createRenderer();

  const aggregationFunctions = {
    sum: { columnTypes: ['number'] },
    avg: { columnTypes: ['number'] },
    min: { columnTypes: ['number', 'date', 'dateTime'] },
    max: { columnTypes: ['number', 'date', 'dateTime'] },
    size: {},
  };

  let apiRef: RefObject<GridApi | null>;
  const fetchRowsSpy = vi.fn();

  // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
  function Reset() {
    React.useLayoutEffect(() => {
      fetchRowsSpy.mockClear();
    }, []);
    return null;
  }

  function TestDataSourcePivoting(
    props: Partial<DataGridPremiumProps> & {
      mockResponse?: GridGetRowsResponse;
      pivotingColDef?: PivotingColDefCallback;
    },
  ) {
    apiRef = useGridApiRef();
    const { mockResponse, pivotingColDef, ...rest } = props;
    const { fetchRows, columns, isReady } = useMockServer<GridGetRowsResponse>(
      { rowLength: 10, maxColumns: 1 },
      { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false },
    );

    const pivotingColDefCallback = React.useMemo<PivotingColDefCallback>(
      () =>
        pivotingColDef ??
        ((field, columnGroupPath) => ({
          field: columnGroupPath.concat(field).join('>->'),
        })),
      [pivotingColDef],
    );

    const dataSource: GridDataSource = React.useMemo(() => {
      return {
        getRows: async (params) => {
          const urlParams = new URLSearchParams({
            filterModel: JSON.stringify(params.filterModel),
            sortModel: JSON.stringify(params.sortModel),
            paginationModel: JSON.stringify(params.paginationModel),
            aggregationModel: JSON.stringify(params.aggregationModel),
            pivotModel: JSON.stringify(params.pivotModel),
          });

          fetchRowsSpy(params);
          if (mockResponse) {
            return mockResponse;
          }

          const getRowsResponse = await fetchRows(
            `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
          );

          return {
            rows: getRowsResponse.rows,
            rowCount: getRowsResponse.rowCount,
            aggregateRow: getRowsResponse.aggregateRow,
            pivotColumns: getRowsResponse.pivotColumns,
          };
        },
        getGroupKey: (row) => row.group,
        getChildrenCount: (row) => row.descendantCount,
        getAggregatedValue: (row, field) => row[field],
      };
    }, [mockResponse, fetchRows]);

    if (!isReady) {
      return null;
    }

    return (
      <div style={{ width: 600, height: 600 }}>
        <Reset />
        <DataGridPremium
          apiRef={apiRef}
          dataSource={dataSource}
          columns={columns}
          disableVirtualization
          aggregationFunctions={aggregationFunctions}
          pivotingColDef={pivotingColDefCallback}
          {...rest}
        />
      </div>
    );
  }

  it('should provide the `pivotModel` in the `getRows` params', async () => {
    const pivotModel: GridPivotModel = {
      rows: [{ field: 'traderName' }],
      columns: [{ field: 'status' }],
      values: [{ field: 'quantity', aggFunc: 'sum' }],
    };

    render(
      <TestDataSourcePivoting
        initialState={{
          pivoting: {
            enabled: true,
            model: pivotModel,
          },
        }}
      />,
    );
    await waitFor(() => {
      expect(fetchRowsSpy).toHaveBeenCalled();
    });

    expect(fetchRowsSpy.mock.lastCall[0].pivotModel).to.deep.equal(pivotModel);
  });

  it('should not pass hidden rows, columns and values in the `pivotModel` in the `getRows` params', async () => {
    const pivotModel: GridPivotModel = {
      rows: [{ field: 'traderName', hidden: true }],
      columns: [{ field: 'status', hidden: true }],
      values: [{ field: 'quantity', aggFunc: 'sum', hidden: true }],
    };

    render(
      <TestDataSourcePivoting
        initialState={{
          pivoting: {
            enabled: true,
            model: pivotModel,
          },
        }}
      />,
    );
    await waitFor(() => {
      expect(fetchRowsSpy).toHaveBeenCalled();
    });

    expect(fetchRowsSpy.mock.lastCall[0].pivotModel).to.deep.equal({
      rows: [],
      columns: [],
      values: [],
    });
  });

  it('should display pivot data based on the `pivotModel`', async () => {
    const pivotModel: GridPivotModel = {
      rows: [{ field: 'traderName' }],
      columns: [{ field: 'status' }],
      values: [{ field: 'quantity', aggFunc: 'sum' }],
    };

    const mockPivotColumns = [
      {
        key: 'pending',
        group: 'pending',
      },
      {
        key: 'completed',
        group: 'completed',
      },
    ];

    const mockRows = [
      {
        id: 1,
        group: 'John',
        descendantCount: 1,
        'pending>->quantity': 100,
        'completed>->quantity': 200,
      },
      {
        id: 2,
        group: 'Jane',
        descendantCount: 1,
        'pending>->quantity': 200,
        'completed>->quantity': 300,
      },
    ];

    const mockResponse = {
      rows: mockRows,
      rowCount: 2,
      aggregateRow: { 'pending>->quantity': 300, 'completed>->quantity': 500 },
      pivotColumns: mockPivotColumns,
    };

    render(
      <TestDataSourcePivoting
        columns={[
          { field: 'id', headerName: 'ID' },
          { field: 'traderName', headerName: 'Trader' },
          { field: 'status', headerName: 'Status' },
          { field: 'quantity', headerName: 'Quantity', type: 'number' },
        ]}
        mockResponse={mockResponse}
        initialState={{
          pivoting: {
            enabled: true,
            model: pivotModel,
          },
        }}
      />,
    );

    await waitFor(() => {
      expect(fetchRowsSpy).toHaveBeenCalled();
    });

    expect(fetchRowsSpy.mock.lastCall[0].pivotModel).to.deep.equal(pivotModel);
    await waitFor(() => {
      expect(getColumnHeadersTextContent()).to.deep.equal([
        '',
        'pending',
        'completed',
        'Trader',
        'Quantitysum',
        'Quantitysum',
      ]);
    });

    expect(getRowValues(0)).to.deep.equal(['John (1)', '100', '200']);
    expect(getRowValues(1)).to.deep.equal(['Jane (1)', '200', '300']);
  });

  it('should handle server-side pivoting without pivot columns', async () => {
    const pivotModel: GridPivotModel = {
      rows: [{ field: 'traderName' }],
      columns: [],
      values: [{ field: 'quantity', aggFunc: 'sum' }],
    };

    const mockRows = [{ id: 1, group: 'John', descendantCount: 1, quantity: 100 }];

    const mockResponse = {
      rows: mockRows,
      rowCount: 1,
      aggregateRow: { quantity: 100 },
      pivotColumns: [],
    };

    render(
      <TestDataSourcePivoting
        columns={[
          { field: 'id', headerName: 'ID' },
          { field: 'traderName', headerName: 'Trader' },
          { field: 'quantity', headerName: 'Quantity', type: 'number' },
        ]}
        mockResponse={mockResponse}
        initialState={{
          pivoting: {
            enabled: true,
            model: pivotModel,
          },
        }}
      />,
    );

    await waitFor(() => {
      expect(fetchRowsSpy).toHaveBeenCalled();
    });

    // Verify that pivot model is passed to getRows
    expect(fetchRowsSpy.mock.lastCall[0].pivotModel).to.deep.equal(pivotModel);

    // Verify displayed data
    await waitFor(() => {
      expect(getColumnHeadersTextContent()).to.deep.equal(['Trader', 'Quantitysum']);
    });

    expect(getRowValues(0)).to.deep.equal(['John (1)', '100']);
  });

  it('should handle server-side pivoting with multiple pivot values', async () => {
    const pivotModel: GridPivotModel = {
      rows: [{ field: 'traderName' }],
      columns: [],
      values: [
        { field: 'quantity', aggFunc: 'sum' },
        { field: 'price', aggFunc: 'avg' },
      ],
    };

    const mockRows = [
      { id: 1, group: 'John', descendantCount: 1, quantity: 100, price: 50 },
      { id: 2, group: 'Jane', descendantCount: 1, quantity: 200, price: 75 },
    ];

    const mockResponse = {
      rows: mockRows,
      rowCount: 2,
      aggregateRow: { quantity: 300, price: 62.5 },
      pivotColumns: [],
    };

    render(
      <TestDataSourcePivoting
        columns={[
          { field: 'id', headerName: 'ID' },
          { field: 'traderName', headerName: 'Trader' },
          { field: 'quantity', headerName: 'Quantity', type: 'number' },
          { field: 'price', headerName: 'Price', type: 'number' },
        ]}
        mockResponse={mockResponse}
        initialState={{
          pivoting: {
            enabled: true,
            model: pivotModel,
          },
        }}
      />,
    );

    await waitFor(() => {
      expect(fetchRowsSpy).toHaveBeenCalled();
    });

    // Verify that pivot model is passed to getRows
    expect(fetchRowsSpy.mock.lastCall[0].pivotModel).to.deep.equal(pivotModel);

    // Verify displayed data
    await waitFor(() => {
      expect(getColumnHeadersTextContent()).to.deep.equal(['Trader', 'Quantitysum', 'Priceavg']);
    });

    expect(getRowValues(0)).to.deep.equal(['John (1)', '100', '50']);
    expect(getRowValues(1)).to.deep.equal(['Jane (1)', '200', '75']);
  });

  it('should create multi-level column groups for more complex pivot columns response', async () => {
    const pivotModel: GridPivotModel = {
      rows: [{ field: 'traderName' }],
      columns: [{ field: 'status' }, { field: 'region' }],
      values: [{ field: 'quantity', aggFunc: 'sum' }],
    };

    // Mock complex pivot columns structure
    const mockPivotColumns = [
      {
        key: 'filled',
        group: 'filled',
        children: [
          {
            key: 'north',
            group: 'north',
          },
          {
            key: 'south',
            group: 'south',
          },
        ],
      },
      {
        key: 'unfilled',
        group: 'unfilled',
        children: [
          {
            key: 'east',
            group: 'east',
          },
          {
            key: 'west',
            group: 'west',
          },
        ],
      },
    ];

    const mockRows = [
      {
        id: 1,
        group: 'John',
        descendantCount: 1,
        'filled>->north>->quantity': 100,
        'filled>->south>->quantity': 150,
        'unfilled>->east>->quantity': 200,
        'unfilled>->west>->quantity': 250,
      },
      {
        id: 2,
        group: 'Jane',
        descendantCount: 1,
        'filled>->north>->quantity': 300,
        'filled>->south>->quantity': 350,
        'unfilled>->east>->quantity': 400,
        'unfilled>->west>->quantity': 450,
      },
    ];

    const mockResponse = {
      rows: mockRows,
      rowCount: 2,
      aggregateRow: {
        'filled>->north>->quantity': 400,
        'filled>->south>->quantity': 500,
        'unfilled>->east>->quantity': 600,
        'unfilled>->west>->quantity': 700,
      },
      pivotColumns: mockPivotColumns,
    };

    render(
      <TestDataSourcePivoting
        columns={[
          { field: 'id', headerName: 'ID' },
          { field: 'traderName', headerName: 'Trader' },
          { field: 'status', headerName: 'Status' },
          { field: 'region', headerName: 'Region' },
          { field: 'quantity', headerName: 'Quantity', type: 'number' },
        ]}
        mockResponse={mockResponse}
        initialState={{
          pivoting: {
            enabled: true,
            model: pivotModel,
          },
        }}
      />,
    );

    await waitFor(() => {
      expect(fetchRowsSpy).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(getColumnHeadersTextContent()).to.deep.equal([
        '',
        'filled',
        'unfilled',
        '',
        'north',
        'south',
        'east',
        'west',
        'Trader',
        'Quantitysum',
        'Quantitysum',
        'Quantitysum',
        'Quantitysum',
      ]);
    });

    expect(getRowValues(0)).to.deep.equal(['John (1)', '100', '150', '200', '250']);
    expect(getRowValues(1)).to.deep.equal(['Jane (1)', '300', '350', '400', '450']);
  });

  it('should display aggregation footer row', async () => {
    const pivotModel: GridPivotModel = {
      rows: [{ field: 'traderName' }],
      columns: [],
      values: [{ field: 'quantity', aggFunc: 'sum' }],
    };

    const mockRows = [{ id: 1, group: 'John', descendantCount: 1, quantity: 100 }];

    const mockResponse = {
      rows: mockRows,
      rowCount: 1,
      aggregateRow: { quantity: 100 },
      pivotColumns: [],
    };

    render(
      <TestDataSourcePivoting
        columns={[
          { field: 'id', headerName: 'ID' },
          { field: 'traderName', headerName: 'Trader' },
          { field: 'quantity', headerName: 'Quantity', type: 'number' },
        ]}
        mockResponse={mockResponse}
        initialState={{
          pivoting: {
            enabled: true,
            model: pivotModel,
          },
        }}
      />,
    );

    await waitFor(() => {
      expect(fetchRowsSpy).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(getColumnHeadersTextContent()).to.deep.equal(['Trader', 'Quantitysum']);
    });

    expect(apiRef.current?.state.rows.tree[GRID_AGGREGATION_ROOT_FOOTER_ROW_ID]).not.to.equal(null);
    await waitFor(() => {
      const footerRow = apiRef.current?.state.aggregation.lookup[GRID_ROOT_GROUP_ID];
      expect(footerRow?.quantity).to.deep.equal({ position: 'footer', value: 100 });
    });
  });

  it('should handle server-side pivoting with custom pivotingColDef header name', async () => {
    const pivotModel: GridPivotModel = {
      rows: [{ field: 'traderName' }],
      columns: [{ field: 'status' }],
      values: [{ field: 'quantity', aggFunc: 'sum' }],
    };

    const mockPivotColumns = [
      {
        key: 'filled',
        group: 'filled',
        children: [],
      },
    ];

    const mockRows = [{ id: 1, group: 'John', descendantCount: 1, custom_field_name: 100 }];

    const mockResponse = {
      rows: mockRows,
      rowCount: 1,
      aggregateRow: { custom_field_name: 100 },
      pivotColumns: mockPivotColumns,
    };

    render(
      <TestDataSourcePivoting
        columns={[
          { field: 'id', headerName: 'ID' },
          { field: 'traderName', headerName: 'Trader' },
          { field: 'status', headerName: 'Status' },
          { field: 'quantity', headerName: 'Quantity', type: 'number' },
        ]}
        mockResponse={mockResponse}
        pivotingColDef={() => ({
          field: 'custom_field_name',
          headerName: 'Custom Quantity',
        })}
        initialState={{
          pivoting: {
            enabled: true,
            model: pivotModel,
          },
        }}
      />,
    );

    await waitFor(() => {
      expect(fetchRowsSpy).toHaveBeenCalled();
    });

    // Custom header is being used and the value is picked from the custom field name
    await waitFor(() => {
      expect(getColumnHeadersTextContent()).to.deep.equal([
        '',
        'filled',
        'Trader',
        'Custom Quantitysum',
      ]);
    });

    expect(getRowValues(0)).to.deep.equal(['John (1)', '100']);
  });

  describe('sorting', () => {
    it('should not sort the column groups returned as string', async () => {
      const pivotModel: GridPivotModel = {
        rows: [{ field: 'traderName' }],
        columns: [{ field: 'letter', sort: 'desc' }],
        values: [{ field: 'quantity', aggFunc: 'sum' }],
      };

      const mockPivotColumns = [
        {
          key: 'A',
          group: 'A',
          children: [],
        },
        {
          key: 'Z',
          group: 'Z',
          children: [],
        },
        {
          key: 'C',
          group: 'C',
          children: [],
        },
      ];

      const mockRows = [
        {
          id: 1,
          group: 'John',
          descendantCount: 1,
          'A>->quantity': 100,
          'Z>->quantity': 200,
          'C>->quantity': 300,
        },
      ];

      const mockResponse = {
        rows: mockRows,
        rowCount: 1,
        aggregateRow: { 'A>->quantity': 100, 'Z>->quantity': 200, 'C>->quantity': 300 },
        pivotColumns: mockPivotColumns,
      };

      render(
        <TestDataSourcePivoting
          columns={[
            { field: 'id', headerName: 'ID' },
            { field: 'traderName', headerName: 'Trader' },
            { field: 'letter', headerName: 'Letter' },
            { field: 'quantity', headerName: 'Quantity', type: 'number' },
          ]}
          mockResponse={mockResponse}
          initialState={{
            pivoting: {
              enabled: true,
              model: pivotModel,
            },
          }}
        />,
      );

      await waitFor(() => {
        expect(fetchRowsSpy).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(getColumnHeadersTextContent()).to.deep.equal([
          '',
          'A',
          'Z',
          'C',
          'Trader',
          'Quantitysum',
          'Quantitysum',
          'Quantitysum',
        ]);
      });

      expect(getRowValues(0)).to.deep.equal(['John (1)', '100', '200', '300']); // A, Z, C
    });

    it('should sort the column groups returned as object based on the pivot columns sort order', async () => {
      const pivotModel: GridPivotModel = {
        rows: [{ field: 'traderName' }],
        columns: [{ field: 'letter', sort: 'desc' }],
        values: [{ field: 'quantity', aggFunc: 'sum' }],
      };

      const mockPivotColumns = [
        {
          key: 'A',
          group: { letter: 'A' },
          children: [],
        },
        {
          key: 'Z',
          group: { letter: 'Z' },
          children: [],
        },
        {
          key: 'C',
          group: { letter: 'C' },
          children: [],
        },
      ];

      const mockRows = [
        {
          id: 1,
          group: 'John',
          descendantCount: 1,
          'A>->quantity': 100,
          'Z>->quantity': 200,
          'C>->quantity': 300,
        },
      ];

      const mockResponse = {
        rows: mockRows,
        rowCount: 1,
        aggregateRow: { 'A>->quantity': 100, 'Z>->quantity': 200, 'C>->quantity': 300 },
        pivotColumns: mockPivotColumns,
      };

      render(
        <TestDataSourcePivoting
          columns={[
            { field: 'id', headerName: 'ID' },
            { field: 'traderName', headerName: 'Trader' },
            { field: 'letter', headerName: 'Letter' },
            { field: 'quantity', headerName: 'Quantity', type: 'number' },
          ]}
          mockResponse={mockResponse}
          initialState={{
            pivoting: {
              enabled: true,
              model: pivotModel,
            },
          }}
        />,
      );

      await waitFor(() => {
        expect(fetchRowsSpy).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(getColumnHeadersTextContent()).to.deep.equal([
          '',
          'Z',
          'C',
          'A',
          'Trader',
          'Quantitysum',
          'Quantitysum',
          'Quantitysum',
        ]);
      });

      expect(getRowValues(0)).to.deep.equal(['John (1)', '200', '300', '100']); // Z, C, A
    });
  });
});
