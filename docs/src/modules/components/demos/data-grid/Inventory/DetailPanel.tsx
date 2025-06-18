import React from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { Box, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Product } from './data/products';
import { getColorValue } from './utils/colors';
import { detailPanelDataGridStyles } from './styles';

const DetailPanelContainer = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  margin: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  animation: 'fadeIn 0.5s ease-out',
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
      valueGetter: (value, row, column, apiRef) => {
        const revenuePercentage = ((row.price - row.cost) / row.price) * 100;
        return revenuePercentage.toFixed(1);
      },
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.875rem' }}>{params.value}%</Typography>
      ),
    },
  ];

  const detailRow = {
    id: row.id,
    model: row.model,
    totalSold: row.totalSold,
    incoming: row.incoming,
    colors: row.colors,
    stock: row.stock,
    status: row.status,
    price: row.price,
    cost: row.cost,
  };

  return (
    <DetailPanelContainer>
      <DataGridPro
        rows={[detailRow]}
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
