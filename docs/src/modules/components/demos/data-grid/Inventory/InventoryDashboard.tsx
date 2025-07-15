import React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRenderCellParams,
  GridEventListener,
  useGridApiRef,
  GRID_AGGREGATION_ROOT_FOOTER_ROW_ID,
} from '@mui/x-data-grid-premium';
import { Box, Typography, Rating, Chip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { DemoContainer } from '../DemoContainer';
import { inventoryTheme } from './theme';
import { Product, products } from './data/products';
import { ProductDetailPanel } from './DetailPanel';
import { InventoryToolbar } from './InventoryToolbar';
import { inventoryDataGridStyles } from './styles';
import { CustomExpandIcon, CustomCollapseIcon } from './icons';

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: '6px',
  height: '30px',
  fontWeight: 500,
  '& .MuiChip-label': {
    padding: '0 8px 0 10px',
    fontSize: '0.875rem',
  },
  '& .MuiChip-icon': {
    fontSize: '0.875rem',
  },
  '&.in_stock': {
    color: theme.palette.success.dark,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    '& .MuiChip-icon': {
      color: theme.palette.success.main,
    },
  },
  '&.out_of_stock': {
    color: theme.palette.error.dark,
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    '& .MuiChip-icon': {
      color: theme.palette.error.main,
    },
  },
  '&.restocking': {
    color: theme.palette.warning.dark,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    '& .MuiChip-icon': {
      color: theme.palette.warning.main,
    },
  },
}));

const ProductImage = styled('img')({
  width: 60,
  height: 60,
  objectFit: 'cover',
  borderRadius: 4,
});

const columns: GridColDef<Product>[] = [
  {
    field: 'product',
    groupable: false,
    aggregable: false,
    headerName: 'Product',
    flex: 1,
    minWidth: 250,
    renderCell: (params: GridRenderCellParams<Product, string>) =>
      params.id === GRID_AGGREGATION_ROOT_FOOTER_ROW_ID ? null : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ProductImage src={params.row.image} alt={params.value} />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: '500' }}>{params.value}</Typography>
        </Box>
      ),
  },
  { field: 'sku', groupable: false, aggregable: false, headerName: 'SKU', width: 120, flex: 1 },
  {
    field: 'status',
    groupable: false,
    aggregable: false,
    headerName: 'Status',
    width: 120,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product, string>) => {
      if (params.id === GRID_AGGREGATION_ROOT_FOOTER_ROW_ID) return null;
      const statusMap = {
        in_stock: 'In Stock',
        out_of_stock: 'Out of Stock',
        restocking: 'Restocking',
      };
      const iconMap = {
        in_stock: <CheckCircleOutlineIcon />,
        out_of_stock: <CancelOutlinedIcon />,
        restocking: <HourglassEmptyIcon />,
      };
      return (
        <StatusChip
          icon={iconMap[params.value as keyof typeof iconMap]}
          label={statusMap[params.value as keyof typeof statusMap]}
          className={params.value}
          clickable={false}
          onClick={() => {}} // TODO: Fix. Adding as placeholder. These shouldnt be clickable but for some reason it's giving me a runtime error for now, even if setting clickable to false.
        />
      );
    },
  },
  { field: 'stock', groupable: false, aggregable: false, headerName: 'Stock', width: 100, flex: 1 },
  {
    field: 'price',
    groupable: false,
    aggregable: false,
    headerName: 'Price',
    width: 150,
    type: 'number',
    flex: 1,
    valueFormatter: (value: number) => (value != null ? `$${value}` : ''),
  },
  {
    field: 'cost',
    groupable: false,
    aggregable: false,
    headerName: 'Cost',
    width: 120,
    type: 'number',
    flex: 1,
    valueFormatter: (value: number) => (value != null ? `$${value}` : ''),
  },
  {
    field: 'rating',
    headerName: 'Rating',
    aggregable: false,
    width: 150,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product, number>) =>
      params.id === GRID_AGGREGATION_ROOT_FOOTER_ROW_ID ? (
        <Typography>Sales:</Typography>
      ) : (
        <Rating value={params.value} precision={0.1} readOnly size="small" />
      ),
  },
  {
    field: 'sales',
    type: 'number',
    headerName: 'Sales',
    width: 100,
    flex: 1,
    availableAggregationFunctions: ['sum'],
  },
];

function InventoryDashboard() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const apiRef = useGridApiRef();

  const onRowClick = React.useCallback<GridEventListener<'rowClick'>>(
    (params) => {
      apiRef.current?.toggleDetailPanel(params.id);
    },
    [apiRef],
  );

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <DemoContainer theme={inventoryTheme}>
      <ThemeProvider theme={inventoryTheme}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
            width: '100%',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <InventoryToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <DataGridPremium<Product>
                apiRef={apiRef}
                rows={filteredProducts}
                columns={columns}
                initialState={{
                  aggregation: {
                    model: {
                      sales: 'sum',
                    },
                  },
                  pagination: {
                    paginationModel: { pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                getDetailPanelContent={({ row }) => <ProductDetailPanel row={row} />}
                getDetailPanelHeight={() => 115}
                rowHeight={80}
                onRowClick={onRowClick}
                slots={{
                  detailPanelExpandIcon: CustomExpandIcon,
                  detailPanelCollapseIcon: CustomCollapseIcon,
                }}
                sx={inventoryDataGridStyles}
              />
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </DemoContainer>
  );
}

export default InventoryDashboard;
