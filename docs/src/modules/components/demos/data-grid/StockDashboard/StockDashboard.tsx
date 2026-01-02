import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
  DataGridPremium,
  GridApiPremium,
  GridColDef,
  GridColumnVisibilityModel,
  GridRenderCellParams,
  gridRowSelectionIdsSelector,
  useGridApiRef,
  useGridSelector,
} from '@mui/x-data-grid-premium';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import type { StockData } from './types/stocks';
import { useMockStockServer } from './hooks/useMockStockServer';
import { DemoContainer } from '../DemoContainer';
import { stockDashboardTheme } from './theme';

function StockDetailsPanel({ apiRef }: { apiRef: React.RefObject<GridApiPremium> }) {
  const selectedRow = useGridSelector(apiRef, gridRowSelectionIdsSelector);
  const selectedStock = selectedRow.size > 0 ? Array.from(selectedRow.values())[0] : null;

  if (!selectedStock) {
    return null;
  }

  const handleClose = () => {
    apiRef.current?.setRowSelectionModel({ type: 'include', ids: new Set() });
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        zIndex: 1,
        height: '50%',
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
        pl: 1.5,
        pr: 1,
        py: 1,
        bottom: 0,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        borderRadius: 1,
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
          {selectedStock.symbol} - Price History
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LineChartPro
          series={[
            {
              type: 'line',
              curve: 'natural',
              showMark: false,
              data: selectedStock.history.map((h: { price: number }) => h.price),
              color:
                selectedStock.history[selectedStock.history.length - 1].price >
                selectedStock.history[0].price
                  ? '#2e7d32'
                  : '#d32f2f',
            },
          ]}
          xAxis={[
            {
              data: selectedStock.history.map((h: { date: string }) => new Date(h.date)),
              scaleType: 'time',
              domainLimit: 'strict',
              valueFormatter: (value: Date, context) =>
                context.location === 'tooltip'
                  ? format(value, 'yyyy/MM/dd hh:mm:ss')
                  : format(value, 'hh:mm:ss'),
              zoom: { slider: { enabled: true, preview: true } },
            },
          ]}
          height={280}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          skipAnimation
        />
      </Box>
    </Box>
  );
}

function StockDashboard() {
  const apiRef = useGridApiRef();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { fetchRows, isReady } = useMockStockServer();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const getColumnVisibility = React.useCallback(() => {
    return {
      symbol: true,
      name: !isSmallScreen,
      trend: !isSmallScreen,
      price: true,
      change: true,
      changePercent: true,
      volume: true,
    };
  }, [isSmallScreen]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(getColumnVisibility());

  React.useEffect(() => {
    setColumnVisibilityModel(getColumnVisibility());
  }, [isSmallScreen, getColumnVisibility]);

  React.useEffect(() => {
    if (!isReady) {
      return undefined;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetchRows('?page=0&pageSize=100');
        if (response.rows && response.rows.length > 0) {
          apiRef.current?.updateRows(response.rows as StockData[]);
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to update stock data');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady, fetchRows, apiRef]);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'symbol',
        headerName: 'Symbol',
        flex: 0,
        width: 120,
        renderCell: (params: GridRenderCellParams<StockData>) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={params.row.logoUrl}
              alt={`${params.row.name} logo`}
              sx={{
                width: 24,
                height: 24,
                objectFit: 'contain',
                borderRadius: 1,
              }}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'name',
        headerName: 'Company',
        flex: 1,
        maxWidth: 350,
        hideable: true,
      },
      {
        field: 'trend',
        headerName: 'Trend',
        flex: 1,
        maxWidth: 200,
        renderCell: (params: GridRenderCellParams<StockData>) => {
          const history = params.row.history;
          const historicalData: number[] = [];
          for (let i = 0; i < history.length; i += 10) {
            historicalData.push(history[i].price);
          }
          const firstPrice = historicalData[0];
          const lastPrice = historicalData[historicalData.length - 1];
          const isTrendUp = lastPrice > firstPrice;
          const color = isTrendUp ? '#2e7d32' : '#d32f2f';
          return (
            <Box sx={{ width: '100%', height: 40 }}>
              <SparkLineChart
                data={historicalData}
                curve="natural"
                showTooltip
                showHighlight
                height={40}
                color={color}
              />
            </Box>
          );
        },
      },
      {
        field: 'price',
        type: 'number',
        headerName: 'Price',
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams<StockData>) => (
          <Typography
            sx={{
              fontSize: '0.875rem',
              backgroundColor:
                params.row.change >= 0 ? 'rgba(46, 125, 50, 0.10)' : 'rgba(211, 47, 47, 0.10)',
              color: 'primary.secondary',
              px: 1,
              py: 0.5,
              borderRadius: 3,
            }}
          >
            ${params.value?.toFixed(2)}
          </Typography>
        ),
      },
      {
        field: 'change',
        type: 'number',
        headerName: 'Change',
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams<StockData>) => (
          <Typography
            sx={{
              color: params.value >= 0 ? 'success.main' : 'error.main',
              fontSize: '0.875rem',
            }}
          >
            {params.value >= 0 ? '+' : ''}
            {params.value.toFixed(2)}
          </Typography>
        ),
      },
      {
        field: 'changePercent',
        type: 'number',
        headerName: '% Change',
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams<StockData>) => (
          <Typography
            sx={{
              color: params.value >= 0 ? 'success.main' : 'error.main',
              fontSize: '0.875rem',
            }}
          >
            {params.value >= 0 ? '+' : ''}
            {params.value.toFixed(2)}%
          </Typography>
        ),
      },
      {
        field: 'volume',
        type: 'number',
        headerName: 'Volume',
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams<StockData>) => (
          <Typography sx={{ fontSize: '0.875rem' }}>{params.value.toLocaleString()}</Typography>
        ),
      },
    ],
    [],
  );

  return (
    <DemoContainer
      theme={stockDashboardTheme}
      href="https://github.com/mui/mui-x/tree/master/docs/src/modules/components/demos/data-grid/StockDashboard"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '100%',
          width: '100%',
        }}
      >
        {error && (
          <Alert severity="warning" sx={{ mx: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ flex: 1, minHeight: 300 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={columns}
            loading={loading}
            label="Stock Market"
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={setColumnVisibilityModel}
            disableMultipleRowSelection
            showToolbar
          />
        </Box>

        <StockDetailsPanel apiRef={apiRef as React.RefObject<GridApiPremium>} />
      </Box>
    </DemoContainer>
  );
}

export default StockDashboard;
