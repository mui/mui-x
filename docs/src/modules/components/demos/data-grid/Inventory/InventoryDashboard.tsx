import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRenderCellParams,
  GridEventListener,
  useGridApiRef,
  GridAggregationFunction,
  GRID_AGGREGATION_FUNCTIONS,
  GRID_AGGREGATION_ROOT_FOOTER_ROW_ID,
  GridDetailPanelToggleCell,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  isGroupingColumn,
  GridRowParams,
} from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { styled, ThemeProvider } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { DemoContainer } from '../DemoContainer';
import { inventoryTheme } from './theme';
import { Product, products } from './data/products';
import { ProductDetailPanel } from './DetailPanel';
import { InventoryToolbar } from './InventoryToolbar';
import { dataGridStyles } from './styles';
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

const productStatusMap = {
  in_stock: 'In Stock',
  out_of_stock: 'Out of Stock',
  restocking: 'Restocking',
} as const;

const columns: GridColDef<Product>[] = [
  {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    renderCell: (params) => {
      if (params.id === GRID_AGGREGATION_ROOT_FOOTER_ROW_ID) {
        return null;
      }
      return <GridDetailPanelToggleCell {...params} />;
    },
  },
  {
    field: 'product',
    groupable: false,
    aggregable: false,
    headerName: 'Product',
    flex: 1,
    minWidth: 250,
    renderCell: (params: GridRenderCellParams<Product, string>) => {
      if (
        params.id === GRID_AGGREGATION_ROOT_FOOTER_ROW_ID ||
        (params.rowNode.type === 'group' && !isGroupingColumn(params.field))
      ) {
        return null;
      }

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ProductImage src={params.row.image} alt={params.value} />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: '500' }}>{params.value}</Typography>
        </Box>
      );
    },
  },
  { field: 'sku', groupable: false, aggregable: false, headerName: 'SKU', width: 120, flex: 1 },
  {
    field: 'status',
    type: 'singleSelect',
    // editable: true, // TODO: Change styling of menu here to match the field
    valueOptions: Object.keys(productStatusMap),
    getOptionLabel: (value) => productStatusMap[value as keyof typeof productStatusMap],
    headerName: 'Status',
    minWidth: 150,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product, string>) => {
      if (params.aggregation) {
        return params.value;
      }
      if (
        params.id === GRID_AGGREGATION_ROOT_FOOTER_ROW_ID ||
        (params.rowNode.type === 'group' && !isGroupingColumn(params.field))
      ) {
        return null;
      }

      const iconMap = {
        in_stock: <CheckCircleOutlineIcon />,
        out_of_stock: <CancelOutlinedIcon />,
        restocking: <HourglassEmptyIcon />,
      };
      return (
        <StatusChip
          icon={iconMap[params.value as keyof typeof iconMap]}
          label={productStatusMap[params.value as keyof typeof productStatusMap]}
          className={params.value}
          clickable={false}
          onClick={() => {}} // TODO: Fix. Adding as placeholder. These shouldnt be clickable but for some reason it's giving me a runtime error for now, even if setting clickable to false.
        />
      );
    },
  },
  {
    field: 'stock',
    // editable: true,
    groupable: false,
    aggregable: false,
    headerName: 'Stock',
    width: 100,
    flex: 1,
  },
  {
    field: 'price',
    groupable: false,
    aggregable: false,
    // editable: true,
    headerName: 'Price',
    width: 150,
    type: 'number',
    flex: 1,
    valueFormatter: (value: number) => (value != null ? `$${value}` : 'Profit:'),
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
        <Typography variant="body2">Sales:</Typography>
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

const profitAggregation: GridAggregationFunction<
  { sales: number; cost: number; price: number },
  number | null
> = {
  getCellValue: ({ row }) => {
    return { sales: row.sales, cost: row.cost, price: row.price };
  },
  apply: ({ values }) => {
    const totalProfit = values.reduce((acc, value) => {
      if (typeof value !== 'undefined') {
        return acc + value.sales * (value.price - value.cost);
      }
      return acc;
    }, 0);
    return totalProfit ?? null;
  },
};

const aggregationFunctions = { ...GRID_AGGREGATION_FUNCTIONS, profit: profitAggregation };

const getDetailPanelContent = (params: GridRowParams<Product>) => (
  <ProductDetailPanel row={params.row} />
);
const getDetailPanelHeight = () => 115;

function InventoryDashboard() {
  const apiRef = useGridApiRef();

  const onRowClick = React.useCallback<GridEventListener<'rowClick'>>(
    (params) => {
      apiRef.current?.toggleDetailPanel(params.id);
    },
    [apiRef],
  );

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
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <DataGridPremium<Product>
                apiRef={apiRef}
                rows={products}
                columns={columns}
                // editMode="row" TODO: Uncomment when we fix the container size. Right now it's way too cramped
                aggregationFunctions={aggregationFunctions}
                aggregationRowsScope="all"
                initialState={{
                  aggregation: {
                    model: {
                      sales: 'sum',
                      cost: 'profit',
                    },
                  },
                }}
                disableRowSelectionOnClick
                getDetailPanelContent={getDetailPanelContent}
                getDetailPanelHeight={getDetailPanelHeight}
                rowHeight={80}
                onRowClick={onRowClick}
                slots={{
                  detailPanelExpandIcon: CustomExpandIcon,
                  detailPanelCollapseIcon: CustomCollapseIcon,
                  toolbar: InventoryToolbar,
                }}
                showToolbar
                sx={dataGridStyles}
              />
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </DemoContainer>
  );
}

export default InventoryDashboard;
