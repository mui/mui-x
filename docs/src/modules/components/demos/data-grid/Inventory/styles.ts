import { SxProps, Theme } from '@mui/material';

export const dataGridStyles: SxProps<Theme> = {
  border: 'none',
  '& .MuiDataGrid-columnHeaders': {
    borderRadius: '16px',
    color: 'text.secondary',
  },
  '& .MuiDataGrid-columnHeader': {
    padding: '0 16px',
    borderRight: 'none',
  },
  '& .MuiDataGrid-cell': {
    padding: '0 16px',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 600,
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
};

export const detailPanelDataGridStyles: SxProps<Theme> = {
  ...dataGridStyles,
  '& .MuiDataGrid-cell': {
    padding: '0 10px',
    border: 'none',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: 'background.paper',
  },
};

export const inventoryDataGridStyles: SxProps<Theme> = {
  ...dataGridStyles,
  '& .MuiDataGrid-virtualScroller': {
    overflow: 'auto',
  },
  '& .MuiDataGrid-virtualScrollerContent': {
    minHeight: '100%',
  },
  '& .MuiDataGrid-virtualScrollerRenderZone': {
    position: 'relative',
  },
};
