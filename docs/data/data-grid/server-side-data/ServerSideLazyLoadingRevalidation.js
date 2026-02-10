import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import Typography from '@mui/material/Typography';

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'PG', name: 'Procter & Gamble Co.' },
  { symbol: 'MA', name: 'Mastercard Incorporated' },
  { symbol: 'UNH', name: 'UnitedHealth Group' },
  { symbol: 'DIS', name: 'The Walt Disney Company' },
  { symbol: 'NFLX', name: 'Netflix, Inc.' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
  { symbol: 'CRM', name: 'Salesforce, Inc.' },
  { symbol: 'INTC', name: 'Intel Corporation' },
  { symbol: 'CSCO', name: 'Cisco Systems, Inc.' },
  { symbol: 'PFE', name: 'Pfizer Inc.' },
  { symbol: 'KO', name: 'The Coca-Cola Company' },
  { symbol: 'PEP', name: 'PepsiCo, Inc.' },
  { symbol: 'NKE', name: 'Nike, Inc.' },
  { symbol: 'BA', name: 'The Boeing Company' },
  { symbol: 'GS', name: 'The Goldman Sachs Group' },
  { symbol: 'CAT', name: 'Caterpillar Inc.' },
  { symbol: 'GE', name: 'General Electric Company' },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation' },
  { symbol: 'CVX', name: 'Chevron Corporation' },
];

const ROW_COUNT = 30;

// Generate base prices for each stock (deterministic)
const basePrices = {};
STOCKS.forEach((stock, i) => {
  basePrices[stock.symbol] = 50 + ((i * 137 + 43) % 400);
});

// A simple fake server that returns stock rows with fluctuating prices.
// Each call returns slightly different prices to simulate real-time market data.
function fakeStockServer(params) {
  const start = typeof params.start === 'number' ? params.start : 0;
  const end = typeof params.end === 'number' ? params.end : start + 14;

  const rows = [];
  for (let i = start; i <= end && i < ROW_COUNT; i += 1) {
    const stock = STOCKS[i % STOCKS.length];
    const base = basePrices[stock.symbol];
    // Random fluctuation ±2% on each call
    const fluctuation = 1 + (Math.random() - 0.5) * 0.04;
    const price = Math.round(base * fluctuation * 100) / 100;
    const change = Math.round((price - base) * 100) / 100;
    const changePercent = Math.round((change / base) * 10000) / 100;
    const volume = Math.floor(1_000_000 + Math.random() * 50_000_000);

    rows.push({
      id: i,
      symbol: stock.symbol,
      name: stock.name,
      price,
      change,
      changePercent,
      volume,
    });
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve({ rows, rowCount: ROW_COUNT }), 50);
  });
}

const columns = [
  { field: 'symbol', headerName: 'Symbol', width: 100 },
  { field: 'name', headerName: 'Company', flex: 1, minWidth: 180 },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 110,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          color: params.row.change >= 0 ? 'success.main' : 'error.main',
          fontWeight: 'bold',
        }}
      >
        ${params.value?.toFixed(2)}
      </Typography>
    ),
  },
  {
    field: 'change',
    headerName: 'Change',
    type: 'number',
    width: 100,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{ color: params.value >= 0 ? 'success.main' : 'error.main' }}
      >
        {params.value >= 0 ? '+' : ''}
        {params.value?.toFixed(2)}
      </Typography>
    ),
  },
  {
    field: 'changePercent',
    headerName: '% Change',
    type: 'number',
    width: 110,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{ color: params.value >= 0 ? 'success.main' : 'error.main' }}
      >
        {params.value >= 0 ? '+' : ''}
        {params.value?.toFixed(2)}%
      </Typography>
    ),
  },
  {
    field: 'volume',
    headerName: 'Volume',
    type: 'number',
    width: 130,
    valueFormatter: (value) => value?.toLocaleString(),
  },
];

function ServerSideLazyLoadingRevalidation() {
  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const response = await fakeStockServer(params);
        return {
          rows: response.rows,
          rowCount: response.rowCount,
        };
      },
    }),
    [],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        dataSource={dataSource}
        dataSourceCache={null}
        lazyLoading
        lazyLoadingRevalidateMs={1000}
        paginationModel={{ page: 0, pageSize: 10 }}
      />
    </div>
  );
}

export default ServerSideLazyLoadingRevalidation;
