import * as React from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { Product } from './data/products';
import { getColorValue } from './utils/colors';
import { detailPanelDataGridStyles } from './styles';

const DetailPanelContainer = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(6),
  animation: 'fadeIn 0.7s ease-out',
  backgroundColor: theme.palette.background.paper,
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
}));

const ColorCircle = styled('div')<{ color: string }>(({ color, theme }) => ({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: color,
  border: `1px solid ${theme.palette.grey[300]}`,
}));

interface ProductDetailPanelProps {
  row: Product;
}

export function ProductDetailPanel({ row }: ProductDetailPanelProps) {
  const detailColumns: GridColDef[] = [
    { field: 'model', headerName: 'Model', flex: 1 },
    {
      field: 'totalSold',
      headerName: 'Total Sold',
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.875rem' }}>
          {params.row.totalSold?.toLocaleString() || 0} units
        </Typography>
      ),
    },
    {
      field: 'incoming',
      headerName: 'Incoming Stock',
      flex: 1,
      // editable: true,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.875rem' }}>
          {params.row.incoming?.toLocaleString() || 0} units
        </Typography>
      ),
    },
    {
      field: 'colors',
      headerName: 'Colors Available',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {params.row.colors?.map((color: string) => {
            const colorValue = getColorValue(color);
            return (
              <Tooltip key={color} title={color} arrow>
                <ColorCircle color={colorValue} />
              </Tooltip>
            );
          })}
        </Box>
      ),
    },
    {
      field: 'stock',
      headerName: 'Current Stock',
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.875rem' }}>{params.row.stock || 0} units</Typography>
      ),
    },
    {
      field: 'revenuePercentage',
      headerName: 'Revenue',
      flex: 1,
      valueGetter: (value, rowData) => {
        const revenuePercentage = ((rowData.price - rowData.cost) / rowData.price) * 100;
        return revenuePercentage.toFixed(1);
      },
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.875rem' }}>{params.value}%</Typography>
      ),
    },
  ];

  const rows = React.useMemo(() => [row], [row]);

  return (
    <DetailPanelContainer>
      <DataGridPro
        rows={rows}
        // editMode="row" TODO: Uncomment when we fix the container size. Right now it's way too cramped
        columns={detailColumns}
        hideFooter
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableRowSelectionOnClick
        sx={detailPanelDataGridStyles}
      />
    </DetailPanelContainer>
  );
}
