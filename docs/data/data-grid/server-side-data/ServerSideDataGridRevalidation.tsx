import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridDataSource,
  GridGetRowsParams,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

interface StockRow {
  id: number;
  symbol: string;
  company: string;
  price: number;
  volume: number;
}

const STOCKS = [
  { symbol: 'AAPL', company: 'Apple' },
  { symbol: 'MSFT', company: 'Microsoft' },
  { symbol: 'GOOGL', company: 'Alphabet' },
  { symbol: 'AMZN', company: 'Amazon' },
  { symbol: 'NVDA', company: 'NVIDIA' },
  { symbol: 'META', company: 'Meta' },
  { symbol: 'TSLA', company: 'Tesla' },
  { symbol: 'JPM', company: 'JPMorgan' },
  { symbol: 'V', company: 'Visa' },
  { symbol: 'NFLX', company: 'Netflix' },
];

const ROW_COUNT = 40;

const basePrices: Record<string, number> = {};
STOCKS.forEach((stock, index) => {
  basePrices[stock.symbol] = 60 + ((index * 113 + 17) % 300);
});

function FlashOnChange({
  children,
  changeId,
  align = 'left',
  fontWeight,
}: {
  children: React.ReactNode;
  changeId: number;
  align?: 'left' | 'right';
  fontWeight?: React.CSSProperties['fontWeight'];
}) {
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
      fontWeight={fontWeight === 'bold' ? 'bold' : undefined}
      sx={(theme) => ({
        position: 'relative',
        width: 'calc(100% + 20px)',
        left: '-10px',
        transition: 'background-color 500ms ease',
        backgroundColor: flash
          ? alpha(theme.palette.warning.main, 0.22)
          : 'transparent',
      })}
    >
      {children}
    </Typography>
  );
}

const columns: GridColDef<StockRow>[] = [
  { field: 'symbol', headerName: 'Symbol', width: 100 },
  { field: 'company', headerName: 'Company', flex: 1, minWidth: 160 },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 120,
    renderCell: (params: GridRenderCellParams<StockRow, number>) => (
      <FlashOnChange changeId={params.value ?? 0} align="right" fontWeight="bold">
        ${params.value?.toFixed(2)}
      </FlashOnChange>
    ),
  },
  {
    field: 'volume',
    headerName: 'Volume',
    type: 'number',
    width: 130,
    renderCell: (params: GridRenderCellParams<StockRow, number>) => (
      <FlashOnChange changeId={params.value ?? 0} align="right">
        {params.value?.toLocaleString()}
      </FlashOnChange>
    ),
  },
];

function fakeStockServer(params: GridGetRowsParams) {
  const page = params.paginationModel?.page ?? 0;
  const pageSize = params.paginationModel?.pageSize ?? 5;
  const start = page * pageSize;
  const end = Math.min(start + pageSize, ROW_COUNT);

  const rows: StockRow[] = [];
  for (let index = start; index < end; index += 1) {
    const stock = STOCKS[index % STOCKS.length];
    const basePrice = basePrices[stock.symbol];
    const priceFluctuation = 1 + (Math.random() - 0.5) * 0.03;

    rows.push({
      id: index,
      symbol: stock.symbol,
      company: stock.company,
      price: Math.round(basePrice * priceFluctuation * 100) / 100,
      volume: Math.floor(500_000 + Math.random() * 20_000_000),
    });
  }

  return new Promise<{ rows: StockRow[]; rowCount: number }>((resolve) => {
    setTimeout(() => {
      resolve({
        rows,
        rowCount: ROW_COUNT,
      });
    }, 120);
  });
}

export default function ServerSideDataGridRevalidation() {
  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params: GridGetRowsParams) => {
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
    <div style={{ width: '100%', height: 360 }}>
      <DataGrid
        columns={columns}
        dataSource={dataSource}
        dataSourceCache={null}
        dataSourceRevalidateMs={2_000}
        pagination
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 }, rowCount: 0 },
        }}
        pageSizeOptions={[5, 10]}
        disableColumnSorting
        disableColumnFilter
      />
    </div>
  );
}
