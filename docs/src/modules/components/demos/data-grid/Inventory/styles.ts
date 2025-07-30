import { SxProps, Theme } from '@mui/material/styles';

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
