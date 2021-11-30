import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { darken, lighten } from '@mui/material/styles';

const getBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

export default function StylingRowsGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  return (
    <Box
      sx={{
        height: 400,
        width: 1,
        '& .super-app-theme--Open': {
          bgcolor: (theme) =>
            getBackgroundColor(theme.palette.info.main, theme.palette.mode),
          '&:hover': {
            bgcolor: (theme) =>
              getHoverBackgroundColor(theme.palette.info.main, theme.palette.mode),
          },
        },
        '& .super-app-theme--Filled': {
          bgcolor: (theme) =>
            getBackgroundColor(theme.palette.success.main, theme.palette.mode),
          '&:hover': {
            bgcolor: (theme) =>
              getHoverBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode,
              ),
          },
        },
        '& .super-app-theme--PartiallyFilled': {
          bgcolor: (theme) =>
            getBackgroundColor(theme.palette.warning.main, theme.palette.mode),
          '&:hover': {
            bgcolor: (theme) =>
              getHoverBackgroundColor(
                theme.palette.warning.main,
                theme.palette.mode,
              ),
          },
        },
        '& .super-app-theme--Rejected': {
          bgcolor: (theme) =>
            getBackgroundColor(theme.palette.error.main, theme.palette.mode),
          '&:hover': {
            bgcolor: (theme) =>
              getHoverBackgroundColor(theme.palette.error.main, theme.palette.mode),
          },
        },
      }}
    >
      <DataGrid
        {...data}
        getRowClassName={(params) =>
          `super-app-theme--${params.getValue(params.id, 'status')}`
        }
      />
    </Box>
  );
}
