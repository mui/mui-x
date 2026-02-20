import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { alpha } from '@mui/material/styles';

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

function FlashOnChange({ children, changeId, align = 'left', fontWeight, sx }) {
  const [flash, setFlash] = React.useState(false);

  React.useEffect(() => {
    if (changeId === 0) {
      return undefined;
    }

    setFlash(true);
    const timeout = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(timeout);
  }, [changeId]);

  return (
    <Typography
      variant="body2"
      display="flex"
      alignItems="center"
      justifyContent={align === 'right' ? 'flex-end' : 'flex-start'}
      height="100%"
      paddingRight="10px"
      paddingLeft="10px"
      width="100%"
      fontWeight={fontWeight}
      sx={[
        (theme) => ({
          position: 'relative',
          width: 'calc(100% + 20px)',
          left: '-10px',
          transition: 'background-color 500ms ease',
          backgroundColor: flash
            ? alpha(theme.palette.warning.main, 0.22)
            : 'transparent',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Typography>
  );
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
      <FlashOnChange
        changeId={params.value ?? 0}
        align="right"
        fontWeight="bold"
        sx={{
          color: params.row.change >= 0 ? 'success.main' : 'error.main',
        }}
      >
        ${params.value?.toFixed(2)}
      </FlashOnChange>
    ),
  },
  {
    field: 'change',
    headerName: 'Change',
    type: 'number',
    width: 100,
    renderCell: (params) => {
      const value = params.value ?? 0;
      return (
        <FlashOnChange
          changeId={value}
          align="right"
          sx={{ color: value >= 0 ? 'success.main' : 'error.main' }}
        >
          {value >= 0 ? '+' : ''}
          {value.toFixed(2)}
        </FlashOnChange>
      );
    },
  },
  {
    field: 'changePercent',
    headerName: '% Change',
    type: 'number',
    width: 110,
    renderCell: (params) => {
      const value = params.value ?? 0;
      return (
        <FlashOnChange
          changeId={value}
          align="right"
          sx={{ color: value >= 0 ? 'success.main' : 'error.main' }}
        >
          {value >= 0 ? '+' : ''}
          {value.toFixed(2)}%
        </FlashOnChange>
      );
    },
  },
  {
    field: 'volume',
    headerName: 'Volume',
    type: 'number',
    width: 130,
    renderCell: (params) => (
      <FlashOnChange changeId={params.value ?? 0} align="right">
        {params.value?.toLocaleString()}
      </FlashOnChange>
    ),
  },
];

function ServerSideLazyLoadingRevalidation() {
  const apiRef = useGridApiRef();
  const [useCache, setUseCache] = React.useState(false);

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
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <FormControlLabel
          control={
            <Switch
              checked={useCache}
              onChange={(event) => setUseCache(event.target.checked)}
              size="small"
            />
          }
          label="Use cache"
        />
        {useCache && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => apiRef.current?.dataSource.cache.clear()}
          >
            Clear cache
          </Button>
        )}
      </Stack>
      <div style={{ width: '100%', height: 360 }}>
        <DataGridPro
          key={useCache ? 'cached' : 'uncached'}
          apiRef={apiRef}
          columns={columns}
          dataSource={dataSource}
          dataSourceCache={useCache ? undefined : null}
          lazyLoading
          dataSourceRevalidateMs={3_000}
          paginationModel={{ page: 0, pageSize: 10 }}
          disableColumnSorting
          disableColumnFilter
        />
      </div>
    </Stack>
  );
}

export default ServerSideLazyLoadingRevalidation;
