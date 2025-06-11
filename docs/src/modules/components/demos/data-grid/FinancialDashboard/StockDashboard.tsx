import React from 'react';
import { Box, Typography, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  DataGridPro,
  GridColDef,
  GridColumnVisibilityModel,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { LineChart, SparkLineChart } from '@mui/x-charts';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import type { StockData } from './types/stocks';
import { useStocksMockServer } from './hooks/useMockStockServer';
import { DemoThemeProvider } from '../DemoThemeProvider';
import { stockDashboardTheme } from './theme';

function StockDashboard() {
  const apiRef = useGridApiRef();
  const [stocks, setStocks] = React.useState<StockData[]>([]);
  const [selectedStockId, setSelectedStockId] = React.useState<number | null>(null);
  const selectedStock = stocks.find((stock) => stock.id === selectedStockId);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { fetchRows, isReady } = useStocksMockServer();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const getColumnVisibility = React.useCallback(() => {
    return {
      symbol: true,
      name: isSmallScreen ? false : true,
      trend: isSmallScreen ? false : true,
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
    if (!isReady) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetchRows('?page=0&pageSize=100');
        if (response.rows && response.rows.length > 0) {
          setStocks(response.rows as StockData[]);
          apiRef.current?.updateRows(response.rows as StockData[]);
          setLoading(false);
        }
      } catch (error) {
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
              onError={(e) => {
                e.currentTarget.style.display = 'none';
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
          const historicalData = history.map((h: { price: number }) => h.price);
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
        headerName: 'Price',
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams<StockData>) => (
          <Typography
            sx={{
              fontSize: '0.875rem',
              backgroundColor:
                params.row.change >= 0
                  ? 'rgba(46, 125, 50, 0.10)' // if upwards, green
                  : 'rgba(211, 47, 47, 0.10)', // if downwards, red
              color: 'primary.secondary',
              px: 1,
              py: 0.5,
              borderRadius: 3,
            }}
          >
            ${params.value.toFixed(2)}
          </Typography>
        ),
      },
      {
        field: 'change',
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
    <DemoThemeProvider theme={stockDashboardTheme}>
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
          <DataGridPro
            apiRef={apiRef}
            columns={columns}
            loading={loading}
            label="Stock Market"
            onRowClick={(params) => setSelectedStockId(params.row.id)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={setColumnVisibilityModel}
            showToolbar
          />
        </Box>

        {selectedStock && (
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
              <IconButton onClick={() => setSelectedStockId(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LineChart
                series={[
                  {
                    type: 'line',
                    curve: 'natural',
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
                    valueFormatter: (value: Date) => format(value, 'MM/dd'),
                  },
                ]}
                yAxis={[
                  {
                    min:
                      Math.min(...selectedStock.history.map((h: { price: number }) => h.price)) *
                      0.99,
                    max:
                      Math.max(...selectedStock.history.map((h: { price: number }) => h.price)) *
                      1.01,
                  },
                ]}
                height={280}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </DemoThemeProvider>
  );
}

export default StockDashboard;
