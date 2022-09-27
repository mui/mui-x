import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { darken, lighten } from '@mui/material/styles';

const getBgColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBgColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBgColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBgColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

export default function StylingRowsGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        sx={{
          '& .super-app-theme--Open': {
            bgcolor: (theme) =>
              getBgColor(theme.palette.info.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) =>
                getHoverBgColor(theme.palette.info.main, theme.palette.mode),
            },
            '&.Mui-selected': {
              bgcolor: (theme) =>
                getSelectedBgColor(theme.palette.info.main, theme.palette.mode),
              '&:hover': {
                bgcolor: (theme) =>
                  getSelectedHoverBgColor(
                    theme.palette.info.main,
                    theme.palette.mode,
                  ),
              },
            },
          },
          '& .super-app-theme--Filled': {
            bgcolor: (theme) =>
              getBgColor(theme.palette.success.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) =>
                getHoverBgColor(theme.palette.success.main, theme.palette.mode),
            },
            '&.Mui-selected': {
              bgcolor: (theme) =>
                getSelectedBgColor(theme.palette.success.main, theme.palette.mode),
              '&:hover': {
                bgcolor: (theme) =>
                  getSelectedHoverBgColor(
                    theme.palette.success.main,
                    theme.palette.mode,
                  ),
              },
            },
          },
          '& .super-app-theme--PartiallyFilled': {
            bgcolor: (theme) =>
              getBgColor(theme.palette.warning.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) =>
                getHoverBgColor(theme.palette.warning.main, theme.palette.mode),
            },
            '&.Mui-selected': {
              bgcolor: (theme) =>
                getSelectedBgColor(theme.palette.warning.main, theme.palette.mode),
              '&:hover': {
                bgcolor: (theme) =>
                  getSelectedHoverBgColor(
                    theme.palette.warning.main,
                    theme.palette.mode,
                  ),
              },
            },
          },
          '& .super-app-theme--Rejected': {
            bgcolor: (theme) =>
              getBgColor(theme.palette.error.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) =>
                getHoverBgColor(theme.palette.error.main, theme.palette.mode),
            },
            '&.Mui-selected': {
              bgcolor: (theme) =>
                getSelectedBgColor(theme.palette.error.main, theme.palette.mode),
              '&:hover': {
                bgcolor: (theme) =>
                  getSelectedHoverBgColor(
                    theme.palette.error.main,
                    theme.palette.mode,
                  ),
              },
            },
          },
        }}
        getRowClassName={(params) => `super-app-theme--${params.row.status}`}
      />
    </Box>
  );
}
