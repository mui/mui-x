import * as React from 'react';
import {
  DataGridPro,
  GridColDef,
  GridDataSource,
  GridGetRowsParams,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { alpha } from '@mui/material/styles';

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

function FlashOnChange({
  children,
  changeId,
  align = 'left',
  fontWeight,
}: {
  children: React.ReactNode;
  changeId: number;
  align?: 'left' | 'right';
  fontWeight?: 'regular' | 'bold';
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

const columns: GridColDef<ReplacedStockRow>[] = [
  { field: 'symbol', headerName: 'Symbol', width: 100 },
  { field: 'name', headerName: 'Company', flex: 1, minWidth: 150 },

  {
    field: 'batch',
    headerName: 'Data batch',
    width: 140,
    renderCell: (params: GridRenderCellParams<ReplacedStockRow, number>) => (
      <FlashOnChange changeId={params.value ?? 0}>#{params.value}</FlashOnChange>
    ),
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 140,
    renderCell: (params: GridRenderCellParams<ReplacedStockRow, number>) => (
      <FlashOnChange changeId={params.value ?? 0} align="right" fontWeight="bold">
        ${params.value?.toFixed(2)}
      </FlashOnChange>
    ),
  },
];

function ServerSideLazyLoadingFullyReplaced() {
  const apiRef = useGridApiRef();
  const [useCache, setUseCache] = React.useState(false);

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
          dataSourceRevalidateMs={2_000}
          paginationModel={{ page: 0, pageSize: 10 }}
          disableColumnSorting
          disableColumnFilter
        />
      </div>
    </Stack>
  );
}

export default ServerSideLazyLoadingFullyReplaced;
