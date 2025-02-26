import * as React from 'react';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { DataGridPremium, DataGridPremiumProps, GridColDef } from '@mui/x-data-grid-premium';
import { getRowValues } from 'test/utils/helperFn';
import useTimeout from '@mui/utils/useTimeout';

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
  {
    field: 'year',
    headerName: 'Year',
    valueGetter: (value, row) => (row.date ? new Date(row.date).getFullYear() : null),
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
        <DataGridPremium
          rows={ROWS}
          columns={COLUMNS}
          showToolbar
          cellSelection
          {...props}
          experimentalFeatures={{ pivoting: true }}
        />
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

    const columnsBtn = screen.getByRole('button', { name: /Pivot/i });
    user.click(columnsBtn);

    await waitFor(() => {
      const pivotSwitch = screen.getByLabelText('Pivot');
      user.click(pivotSwitch);
    });

    await waitFor(() => {
      const pivotSwitch = screen.getByLabelText('Pivot');
      expect(pivotSwitch).to.have.property('checked', true);
    });

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

    const columnsBtn = screen.getByRole('button', { name: /Pivot/i });
    user.click(columnsBtn);

    await waitFor(() => {
      const pivotSwitch = screen.getByLabelText('Pivot');
      user.click(pivotSwitch);
    });

    await waitFor(() => {
      const pivotSwitch = screen.getByLabelText('Pivot');
      expect(pivotSwitch).to.have.property('checked', true);
    });

    expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '$192.77', '12,200']);
    expect(getRowValues(1)).to.deep.equal(['GOOGL (2)', '$126.06', '6,800']);
    expect(getRowValues(2)).to.deep.equal(['MSFT (2)', '$346.56', '8,600']);
    expect(getRowValues(3)).to.deep.equal(['AMZN (2)', '$145.78', '6,000']);
    expect(getRowValues(4)).to.deep.equal(['US_TREASURY_2Y (1)', '$98.75', '1,000']);
    expect(getRowValues(5)).to.deep.equal(['US_TREASURY_10Y (1)', '$95.60', '750']);
  });

  it('should pivot the data with a pivot column and 2 pivot values', async () => {
    const { user } = render(
      <Test
        initialState={{
          pivoting: {
            model: {
              rows: [{ field: 'ticker' }],
              columns: [{ field: 'year' }],
              values: [
                { field: 'price', aggFunc: 'avg' },
                { field: 'volume', aggFunc: 'sum' },
              ],
            },
          },
        }}
      />,
    );

    const columnsBtn = screen.getByRole('button', { name: /Pivot/i });
    user.click(columnsBtn);

    await waitFor(() => {
      const pivotSwitch = screen.getByLabelText('Pivot');
      user.click(pivotSwitch);
    });

    await waitFor(() => {
      const pivotSwitch = screen.getByLabelText('Pivot');
      expect(pivotSwitch).to.have.property('checked', true);
    });

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
              columns: [{ field: 'year' }],
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
    function Component() {
      const [loading, setLoading] = React.useState(true);
      const [rows, setRows] = React.useState<any[]>([]);
      const fetchTimeout = useTimeout();

      React.useEffect(() => {
        fetchTimeout.start(500, () => {
          setRows(ROWS);
          setLoading(false);
        });
      }, [fetchTimeout]);

      return (
        <Test
          loading={loading}
          rows={rows}
          initialState={{
            pivoting: {
              enabled: true,
              model: {
                rows: [{ field: 'ticker' }],
                columns: [{ field: 'year' }],
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

    render(<Component />);

    await waitFor(() => {
      expect(getRowValues(0)).to.deep.equal(['AAPL (2)', '$192.45', '5,500', '$193.10', '6,700']);
    });

    expect(getRowValues(1)).to.deep.equal(['GOOGL (2)', '$126.06', '6,800', '', '']);
    expect(getRowValues(2)).to.deep.equal(['MSFT (2)', '$346.56', '8,600', '', '']);
    expect(getRowValues(3)).to.deep.equal(['AMZN (2)', '$145.78', '6,000', '', '']);
    expect(getRowValues(4)).to.deep.equal(['US_TREASURY_2Y (1)', '$98.75', '1,000', '', '']);
    expect(getRowValues(5)).to.deep.equal(['US_TREASURY_10Y (1)', '$95.60', '750', '', '']);
  });
});
