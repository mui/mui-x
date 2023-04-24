import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { unstable_joySlots } from '@mui/x-data-grid/joy';
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';

const materialTheme = materialExtendTheme();

export default function GridJoyUISlots() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 20,
    editable: true,
  });

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            pagination
            slots={unstable_joySlots}
            {...data}
            checkboxSelection
            disableRowSelectionOnClick
            slotProps={{
              filterPanel: {
                sx: {
                  '& .MuiDataGrid-filterForm': {
                    alignItems: 'flex-end',
                  },
                },
              },
            }}
          />
        </Box>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
