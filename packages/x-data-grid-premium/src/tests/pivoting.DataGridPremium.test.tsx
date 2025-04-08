import * as React from 'react';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridColDef,
  GridPivotModel,
  type GridApi,
} from '@mui/x-data-grid-premium';
import {
  getColumnHeadersTextContent,
  getColumnValues,
  getRowValues,
  sleep,
} from 'test/utils/helperFn';

const ROWS = [
  {
    id: 1,
    date: '2024-03-15',
    ticker: 'AAPL',
    price: 192.45,
    volume: 5500,
    type: 'stock',
  },
  {
    id: 2,
    date: '2024-03-16',
    ticker: 'GOOGL',
    price: 125.67,
    volume: 3200,
    type: 'stock',
  },
  {
    id: 3,
    date: '2024-03-17',
    ticker: 'MSFT',
    price: 345.22,
    volume: 4100,
    type: 'stock',
  },
  {
    id: 4,
    date: '2023-03-18',
    ticker: 'AAPL',
    price: 193.1,
    volume: 6700,
    type: 'stock',
  },
  {
    id: 5,
    date: '2024-03-19',
    ticker: 'AMZN',
    price: 145.33,
    volume: 2900,
    type: 'stock',
  },
  {
    id: 6,
    date: '2024-03-20',
    ticker: 'GOOGL',
    price: 126.45,
    volume: 3600,
    type: 'stock',
  },
  {
    id: 7,
    date: '2024-03-21',
    ticker: 'US_TREASURY_2Y',
    price: 98.75,
    volume: 1000,
    type: 'bond',
  },
  {
    id: 8,
    date: '2024-03-22',
    ticker: 'MSFT',
    price: 347.89,
    volume: 4500,
    type: 'stock',
  },
  {
    id: 9,
    date: '2024-03-23',
    ticker: 'US_TREASURY_10Y',
    price: 95.6,
    volume: 750,
    type: 'bond',
  },
  {
    id: 10,
    date: '2024-03-24',
    ticker: 'AMZN',
    price: 146.22,
    volume: 3100,
    type: 'stock',
  },
];

const COLUMNS: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'date',
    type: 'date',
    headerName: 'Date',
    valueGetter: (value) => new Date(value),
  },
  { field: 'ticker', headerName: 'Ticker' },
  {
    field: 'price',
    type: 'number',
    headerName: 'Price',
    valueFormatter: (value: number) => (value ? `$${value.toFixed(2)}` : null),
  },
  { field: 'volume', type: 'number', headerName: 'Volume' },
  {
    field: 'type',
    type: 'singleSelect',
    valueOptions: ['stock', 'bond'],
    headerName: 'Type',
  },
];

describe('<DataGridPremium /> - Pivoting', () => {
  const { render } = createRenderer();

  function Test(props: Partial<DataGridPremiumProps>) {
    return (
      <div style={{ height: 600, width: '100%' }}>
        <DataGridPremium rows={ROWS} columns={COLUMNS} showToolbar cellSelection {...props} />
      </div>
    );
  }

  it('should pivot the data without pivot columns', async () => {
    const { user } = render(
      <Test
        initialState={{
          pivoting: {
            model: {
              rows: [{ field: 'ticker' }],
              columns: [],
              values: [{ field: 'volume', aggFunc: 'sum' }],
            },
          },
        }}
      />,
    );

    const pivotButton = screen.getByRole('button', { name: 'Pivot' });
    await user.click(pivotButton);

    await waitFor(() => {
      screen.getByRole('checkbox', { name: 'Pivot' });
    });

    const pivotSwitch = screen.getByRole('checkbox', { name: 'Pivot' }) as HTMLInputElement;
    if (!pivotSwitch.checked) {
      await user.click(pivotSwitch);
      await waitFor(() => {
        expect(pivotSwitch).to.have.property('checked', true);
      });
    }

    expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '12,200']);
    expect(getRowValues(1)).to.deep.equal(['GOOGL (2)', '6,800']);
    expect(getRowValues(2)).to.deep.equal(['MSFT (2)', '8,600']);
    expect(getRowValues(3)).to.deep.equal(['AMZN (2)', '6,000']);
    expect(getRowValues(4)).to.deep.equal(['US_TREASURY_2Y (1)', '1,000']);
    expect(getRowValues(5)).to.deep.equal(['US_TREASURY_10Y (1)', '750']);
  });

  it('should pivot the data with 2 pivot values', async () => {
    const { user } = render(
      <Test
        initialState={{
          pivoting: {
            model: {
              rows: [{ field: 'ticker' }],
              columns: [],
              values: [
                { field: 'volume', aggFunc: 'sum' },
                { field: 'price', aggFunc: 'avg' },
              ],
            },
          },
        }}
      />,
    );

    const pivotButton = screen.getByRole('button', { name: 'Pivot' });
    await user.click(pivotButton);

    await waitFor(() => {
      screen.getByRole('checkbox', { name: 'Pivot' });
    });

    const pivotSwitch = screen.getByRole('checkbox', { name: 'Pivot' }) as HTMLInputElement;
    if (!pivotSwitch.checked) {
      await user.click(pivotSwitch);
      await waitFor(() => {
        expect(pivotSwitch).to.have.property('checked', true);
      });
    }

    expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '12,200', '$192.77']);
    expect(getRowValues(1)).to.deep.equal(['GOOGL (2)', '6,800', '$126.06']);
    expect(getRowValues(2)).to.deep.equal(['MSFT (2)', '8,600', '$346.56']);
    expect(getRowValues(3)).to.deep.equal(['AMZN (2)', '6,000', '$145.78']);
    expect(getRowValues(4)).to.deep.equal(['US_TREASURY_2Y (1)', '1,000', '$98.75']);
    expect(getRowValues(5)).to.deep.equal(['US_TREASURY_10Y (1)', '750', '$95.60']);
  });

  it('should pivot the data with a pivot column and 2 pivot values', async () => {
    const { user } = render(
      <Test
        initialState={{
          pivoting: {
            model: {
              rows: [{ field: 'ticker' }],
              columns: [{ field: 'date-year' }],
              values: [
                { field: 'price', aggFunc: 'avg' },
                { field: 'volume', aggFunc: 'sum' },
              ],
            },
          },
        }}
      />,
    );

    const pivotButton = screen.getByRole('button', { name: 'Pivot' });
    await user.click(pivotButton);

    await waitFor(() => {
      screen.getByRole('checkbox', { name: 'Pivot' });
    });

    const pivotSwitch = screen.getByRole('checkbox', { name: 'Pivot' }) as HTMLInputElement;
    if (!pivotSwitch.checked) {
      await user.click(pivotSwitch);
      await waitFor(() => {
        expect(pivotSwitch).to.have.property('checked', true);
      });
    }

    expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '$192.45', '5,500', '$193.10', '6,700']);
    expect(getRowValues(1)).to.deep.equal(['GOOGL (2)', '$126.06', '6,800', '', '']);
    expect(getRowValues(2)).to.deep.equal(['MSFT (2)', '$346.56', '8,600', '', '']);
    expect(getRowValues(3)).to.deep.equal(['AMZN (2)', '$145.78', '6,000', '', '']);
    expect(getRowValues(4)).to.deep.equal(['US_TREASURY_2Y (1)', '$98.75', '1,000', '', '']);
    expect(getRowValues(5)).to.deep.equal(['US_TREASURY_10Y (1)', '$95.60', '750', '', '']);
  });

  it('should render in pivot mode when mounted with pivoting enabled', async () => {
    render(
      <Test
        initialState={{
          pivoting: {
            enabled: true,
            model: {
              rows: [{ field: 'ticker' }],
              columns: [{ field: 'date-year' }],
              values: [
                { field: 'price', aggFunc: 'avg' },
                { field: 'volume', aggFunc: 'sum' },
              ],
            },
          },
        }}
      />,
    );

    expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '$192.45', '5,500', '$193.10', '6,700']);
    expect(getRowValues(1)).to.deep.equal(['GOOGL (2)', '$126.06', '6,800', '', '']);
    expect(getRowValues(2)).to.deep.equal(['MSFT (2)', '$346.56', '8,600', '', '']);
    expect(getRowValues(3)).to.deep.equal(['AMZN (2)', '$145.78', '6,000', '', '']);
    expect(getRowValues(4)).to.deep.equal(['US_TREASURY_2Y (1)', '$98.75', '1,000', '', '']);
    expect(getRowValues(5)).to.deep.equal(['US_TREASURY_10Y (1)', '$95.60', '750', '', '']);
  });

  it('should render in pivot mode when mounted with pivoting enabled and async data loading', async () => {
    function Component({ loading, rows }: { loading: boolean; rows: any[] }) {
      return (
        <Test
          loading={loading}
          rows={rows}
          initialState={{
            pivoting: {
              enabled: true,
              model: {
                rows: [{ field: 'ticker' }],
                columns: [{ field: 'date-year' }],
                values: [
                  { field: 'price', aggFunc: 'avg' },
                  { field: 'volume', aggFunc: 'sum' },
                ],
              },
            },
          }}
        />
      );
    }

    const { setProps } = render(<Component loading rows={[]} />);

    await sleep(500);
    setProps({ loading: false, rows: ROWS });

    await waitFor(() => {
      expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '$192.45', '5,500', '$193.10', '6,700']);
    });

    expect(getRowValues(1)).to.deep.equal(['GOOGL (2)', '$126.06', '6,800', '', '']);
    expect(getRowValues(2)).to.deep.equal(['MSFT (2)', '$346.56', '8,600', '', '']);
    expect(getRowValues(3)).to.deep.equal(['AMZN (2)', '$145.78', '6,000', '', '']);
    expect(getRowValues(4)).to.deep.equal(['US_TREASURY_2Y (1)', '$98.75', '1,000', '', '']);
    expect(getRowValues(5)).to.deep.equal(['US_TREASURY_10Y (1)', '$95.60', '750', '', '']);
  });

  it('should render column groups with empty columns when there are no pivot values', async () => {
    render(
      <Test
        initialState={{
          pivoting: {
            enabled: true,
            model: {
              rows: [],
              columns: [{ field: 'date-year' }, { field: 'type' }],
              values: [], // No pivot values
            },
          },
        }}
      />,
    );

    // Check that column groups are rendered
    const yearHeaders = document.querySelectorAll<HTMLElement>(
      '[aria-rowindex="1"] [role="columnheader"]',
    );
    const typeHeaders = document.querySelectorAll<HTMLElement>(
      '[aria-rowindex="2"] [role="columnheader"]',
    );

    expect(Array.from(yearHeaders).map((header) => header.textContent)).to.deep.equal([
      '2024',
      '2023',
    ]);
    expect(Array.from(typeHeaders).map((header) => header.textContent)).to.deep.equal([
      'stock',
      'bond',
      'stock',
    ]);
  });

  it('should render "empty pivot overlay" when pivot mode is enabled but no rows are defined', async () => {
    render(
      <Test
        initialState={{
          pivoting: {
            enabled: true,
            model: {
              rows: [],
              columns: [],
              values: [],
            },
          },
        }}
      />,
    );
    expect(
      screen.getByText('Add fields to rows, columns, and values to create a pivot table'),
    ).not.to.equal(null);
  });

  it('should not render "empty pivot overlay" when pivot mode is enabled and there are rows', async () => {
    render(
      <Test
        initialState={{
          pivoting: {
            enabled: true,
            model: {
              rows: [{ field: 'ticker' }],
              columns: [],
              values: [],
            },
          },
        }}
      />,
    );
    expect(
      screen.queryByText('Add fields to rows, columns, and values to create a pivot table'),
    ).to.equal(null);
  });

  it('should not throw when a field is moved from pivot values to pivot rows', async () => {
    function Component({ pivotModel }: { pivotModel: GridPivotModel }) {
      return (
        <Test
          initialState={{
            pivoting: {
              panelOpen: true,
              enabled: true,
            },
          }}
          pivotModel={pivotModel}
        />
      );
    }
    const { setProps } = render(
      <Component
        pivotModel={{
          rows: [],
          columns: [],
          values: [{ field: 'date-year', aggFunc: 'size' }],
        }}
      />,
    );

    expect(getColumnHeadersTextContent()).to.deep.equal(['Date (Year)size']);
    expect(getColumnValues(0)).to.have.length(0);

    setProps({
      pivotModel: {
        rows: [{ field: 'date-year' }],
        columns: [],
        values: [],
      },
    });

    expect(getColumnHeadersTextContent()).to.deep.equal(['Date (Year)']);
    expect(getColumnValues(0)).to.deep.equal(['2024 (9)', '2023 (1)']);
  });

  it('should allow to filter rows in pivot mode using original columns', async () => {
    const { user } = render(
      <Test
        initialState={{
          pivoting: {
            enabled: true,
            model: {
              rows: [{ field: 'ticker' }],
              columns: [{ field: 'date-year' }],
              values: [
                { field: 'price', aggFunc: 'avg' },
                { field: 'volume', aggFunc: 'sum' },
              ],
            },
          },
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Filters' }));

    const columnSelector = screen.getByRole('combobox', { name: 'Columns' });
    await user.click(columnSelector);

    const options = screen.getAllByRole('option').map((option) => option.textContent);
    expect(options).to.deep.equal([
      'ID',
      'Date',
      'Date (Year)',
      'Date (Quarter)',
      'Ticker',
      'Type',
      'Price',
      'Volume',
    ]);
  });

  it('should support derived columns as pivot values', async () => {
    const derivedColumn: GridColDef = {
      field: 'total',
      type: 'number',
      valueGetter: (value, row) => {
        return row.price * row.volume;
      },
    };

    render(
      <Test
        columns={COLUMNS.concat(derivedColumn)}
        rows={ROWS.slice(0, 4)}
        initialState={{
          pivoting: {
            enabled: true,
            model: {
              rows: [{ field: 'ticker' }],
              columns: [{ field: 'date-year' }],
              values: [{ field: 'total', aggFunc: 'sum' }],
            },
          },
        }}
      />,
    );

    expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '1,058,475', '1,293,770']);
    expect(getRowValues(1)).to.deep.equal(['GOOGL (1)', '402,144', '']);
    expect(getRowValues(2)).to.deep.equal(['MSFT (1)', '1,415,402', '']);
  });

  it('should update available fields when new column is added', async () => {
    const { setProps } = render(
      <Test
        initialState={{
          pivoting: {
            enabled: true,
            model: {
              rows: [{ field: 'ticker' }],
              columns: [{ field: 'date-year' }],
              values: [{ field: 'volume', aggFunc: 'sum' }],
            },
            panelOpen: true,
          },
        }}
      />,
    );

    const getAvailableFields = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          '.MuiDataGrid-pivotPanelAvailableFields .MuiDataGrid-pivotPanelField',
        ),
      ).map((field) => field.textContent);

    setProps({
      columns: COLUMNS.concat({
        field: 'total',
        type: 'number',
        headerName: 'Total',
        valueGetter: (value, row) => {
          return row.price * row.volume;
        },
      }),
    });

    await waitFor(() => {
      expect(getAvailableFields()).to.deep.equal([
        'ID',
        'Date',
        'Date (Quarter)',
        'Price',
        'Type',
        'Total',
      ]);
    });
  });

  it('should update available fields when a column is removed', async () => {
    const { setProps } = render(
      <Test
        initialState={{
          pivoting: {
            enabled: true,
            model: {
              rows: [{ field: 'ticker' }],
              columns: [{ field: 'date-year' }],
              values: [{ field: 'volume', aggFunc: 'sum' }],
            },
            panelOpen: true,
          },
        }}
      />,
    );

    const getAvailableFields = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          '.MuiDataGrid-pivotPanelAvailableFields .MuiDataGrid-pivotPanelField',
        ),
      ).map((field) => field.textContent);

    setProps({
      columns: COLUMNS.filter((col) => col.field !== 'date'),
    });

    await waitFor(() => {
      expect(getAvailableFields()).to.deep.equal(['ID', 'Price', 'Type']);
    });
  });

  it('should recalculate pivot values when a row is updated while in pivot mode', async () => {
    const apiRef = { current: null } as React.RefObject<GridApi | null>;

    const { setProps } = render(
      <Test
        apiRef={apiRef}
        initialState={{
          pivoting: {
            enabled: true,
            model: {
              rows: [{ field: 'ticker' }],
              columns: [],
              values: [{ field: 'volume', aggFunc: 'sum' }],
            },
          },
        }}
      />,
    );

    expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '12,200']);

    act(() => {
      apiRef.current?.updateRows([{ ...ROWS[0], volume: 6000 }]);
    });

    await waitFor(() => {
      expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '12,700']);
    });

    setProps({ pivotActive: false });

    // The row should keep the updated volume after disabling pivot mode
    await waitFor(() => {
      expect(getRowValues(0)).to.deep.equal([
        '1',
        '15/03/2024',
        'AAPL',
        '$192.45',
        '6,000',
        'stock',
      ]);
    });

    setProps({ pivotActive: true });

    await waitFor(() => {
      expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '12,700']);
    });

    act(() => {
      // Remove the first row
      apiRef.current?.setRows(ROWS.slice(1));
    });

    await waitFor(() => {
      expect(getRowValues(2)).to.deep.equal(['AAPL (1)', '6,700']);
    });
    expect(getRowValues(0)).to.deep.equal(['GOOGL (2)', '6,800']);

    setProps({ pivotActive: false });

    await waitFor(() => {
      expect(getRowValues(0)).to.deep.equal([
        '2',
        '16/03/2024',
        'GOOGL',
        '$125.67',
        '3,200',
        'stock',
      ]);
    });
  });
});
