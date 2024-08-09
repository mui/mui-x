import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { darken, lighten, styled } from '@mui/material/styles';

const getBackgroundColor = (color, theme, coefficient) => ({
  backgroundColor: darken(color, coefficient),
  ...theme.applyStyles('light', {
    backgroundColor: lighten(color, coefficient),
  }),
});

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .super-app-theme--Open': {
    backgroundColor: getBackgroundColor(theme.palette.info.main, theme, 0.7),
    '&:hover': {
      backgroundColor: getBackgroundColor(theme.palette.info.main, theme, 0.6),
    },
    '&.Mui-selected': {
      backgroundColor: getBackgroundColor(theme.palette.info.main, theme, 0.5),
      '&:hover': {
        backgroundColor: getBackgroundColor(theme.palette.info.main, theme, 0.4),
      },
    },
  },
  '& .super-app-theme--Filled': {
    backgroundColor: getBackgroundColor(theme.palette.success.main, theme, 0.7),
    '&:hover': {
      backgroundColor: getBackgroundColor(theme.palette.success.main, theme, 0.6),
    },
    '&.Mui-selected': {
      backgroundColor: getBackgroundColor(theme.palette.success.main, theme, 0.5),
      '&:hover': {
        backgroundColor: getBackgroundColor(theme.palette.success.main, theme, 0.4),
      },
    },
  },
  '& .super-app-theme--PartiallyFilled': {
    backgroundColor: getBackgroundColor(theme.palette.warning.main, theme, 0.7),
    '&:hover': {
      backgroundColor: getBackgroundColor(theme.palette.warning.main, theme, 0.6),
    },
    '&.Mui-selected': {
      backgroundColor: getBackgroundColor(theme.palette.warning.main, theme, 0.5),
      '&:hover': {
        backgroundColor: getBackgroundColor(theme.palette.warning.main, theme, 0.4),
      },
    },
  },
  '& .super-app-theme--Rejected': {
    backgroundColor: getBackgroundColor(theme.palette.error.main, theme, 0.7),
    '&:hover': {
      backgroundColor: getBackgroundColor(theme.palette.error.main, theme, 0.6),
    },
    '&.Mui-selected': {
      backgroundColor: getBackgroundColor(theme.palette.error.main, theme, 0.5),
      '&:hover': {
        backgroundColor: getBackgroundColor(theme.palette.error.main, theme, 0.4),
      },
    },
  },
}));

export default function StylingRowsGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <StyledDataGrid
        {...data}
        getRowClassName={(params) => `super-app-theme--${params.row.status}`}
      />
    </Box>
  );
}
