import * as React from 'react';
import {
  DataGridPro,
  GridColDef,
  GridDataSource,
  GridGetRowsParams,
  GridRenderCellParams,
} from '@mui/x-data-grid-pro';
import Typography from '@mui/material/Typography';

const COMPANIES = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
];

const ROW_COUNT = 120;
const BACKEND_REPLACEMENT_MS = 10_000;

interface ReplacedStockRow {
  id: string;
  symbol: string;
  name: string;
  price: number;
  batch: number;
}

const getDatasetVersion = () => Math.floor(Date.now() / BACKEND_REPLACEMENT_MS);

function getPrice(index: number, version: number) {
  const seed = ((index + 1) * 97 + version * 53) % 500;
  return Math.round((80 + seed) * 100) / 100;
}

function fakeReplacingServer(params: GridGetRowsParams) {
  const start = typeof params.start === 'number' ? params.start : 0;
  const end = typeof params.end === 'number' ? params.end : start + 14;
  const version = getDatasetVersion();

  const rows: ReplacedStockRow[] = [];
  for (let i = start; i <= end && i < ROW_COUNT; i += 1) {
    const company = COMPANIES[i % COMPANIES.length];
    rows.push({
      id: `${version}-${i}`,
      symbol: company.symbol,
      name: company.name,
      price: getPrice(i, version),
      batch: version,
    });
  }

  return new Promise<{ rows: ReplacedStockRow[]; rowCount: number }>((resolve) => {
    setTimeout(() => resolve({ rows, rowCount: ROW_COUNT }), 50);
  });
}

const columns: GridColDef[] = [
  { field: 'symbol', headerName: 'Symbol', width: 100 },
  { field: 'name', headerName: 'Company', flex: 1, minWidth: 180 },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Typography
        variant="body2"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        height="100%"
        sx={{ fontWeight: 'bold' }}
      >
        ${params.value?.toFixed(2)}
      </Typography>
    ),
  },
  {
    field: 'batch',
    headerName: 'Data batch',
    width: 140,
    valueFormatter: (value: number) => `#${value}`,
  },
];

function ServerSideLazyLoadingFullyReplaced() {
  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params: GridGetRowsParams) => {
        const response = await fakeReplacingServer(params);
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
        lazyLoadingRevalidateMs={2000}
        paginationModel={{ page: 0, pageSize: 10 }}
      />
    </div>
  );
}

export default ServerSideLazyLoadingFullyReplaced;
