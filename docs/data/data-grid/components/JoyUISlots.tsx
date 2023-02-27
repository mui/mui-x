import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import joySlots from '@mui/x-data-grid/joy';
import type {} from '@mui/material/themeCssVarsAugmentation';
import {
  extendTheme as extendJoyTheme,
  shouldSkipGeneratingVar as joyShouldSkipGeneratingVar,
} from '@mui/joy/styles';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme,
  shouldSkipGeneratingVar as muiShouldSkipGeneratingVar,
} from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { blue, grey } from '@mui/material/colors';

const { unstable_sxConfig: muiSxConfig, ...muiTheme } = extendMuiTheme();

const { unstable_sxConfig: joySxConfig, ...joyTheme } = extendJoyTheme({
  cssVarPrefix: 'mui',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          ...blue,
          solidColor: 'var(--mui-palette-primary-contrastText)',
          solidBg: 'var(--mui-palette-primary-main)',
          solidHoverBg: 'var(--mui-palette-primary-dark)',
          plainColor: 'var(--mui-palette-primary-main)',
          plainHoverBg:
            'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          plainActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
          outlinedBorder: 'rgba(var(--mui-palette-primary-mainChannel) / 0.5)',
          outlinedColor: 'var(--mui-palette-primary-main)',
          outlinedHoverBg:
            'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          outlinedHoverBorder: 'var(--mui-palette-primary-main)',
          outlinedActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
        },
        neutral: {
          ...grey,
        },
        divider: 'var(--mui-palette-divider)',
        text: {
          tertiary: 'rgba(0 0 0 / 0.56)',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          ...blue,
          solidColor: 'var(--mui-palette-primary-contrastText)',
          solidBg: 'var(--mui-palette-primary-main)',
          solidHoverBg: 'var(--mui-palette-primary-dark)',
          plainColor: 'var(--mui-palette-primary-main)',
          plainHoverBg:
            'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          plainActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
          outlinedBorder: 'rgba(var(--mui-palette-primary-mainChannel) / 0.5)',
          outlinedColor: 'var(--mui-palette-primary-main)',
          outlinedHoverBg:
            'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          outlinedHoverBorder: 'var(--mui-palette-primary-main)',
          outlinedActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
        },
        neutral: {
          ...grey,
        },
        divider: 'var(--mui-palette-divider)',
        text: {
          tertiary: 'rgba(255 255 255 / 0.5)',
        },
      },
    },
  },
  fontFamily: {
    display: '"Roboto","Helvetica","Arial",sans-serif',
    body: '"Roboto","Helvetica","Arial",sans-serif',
  },
  shadow: {
    xs: `var(--mui-shadowRing), ${muiTheme.shadows[1]}`,
    sm: `var(--mui-shadowRing), ${muiTheme.shadows[2]}`,
    md: `var(--mui-shadowRing), ${muiTheme.shadows[4]}`,
    lg: `var(--mui-shadowRing), ${muiTheme.shadows[8]}`,
    xl: `var(--mui-shadowRing), ${muiTheme.shadows[12]}`,
  },
});

const mergedTheme = deepmerge(joyTheme, muiTheme) as unknown as ReturnType<
  typeof extendMuiTheme
>;

mergedTheme.unstable_sxConfig = {
  ...muiSxConfig,
  ...joySxConfig,
};

export default function JoyUISlots() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
    editable: true,
  });

  return (
    <CssVarsProvider
      theme={mergedTheme}
      shouldSkipGeneratingVar={(keys) =>
        muiShouldSkipGeneratingVar(keys) || joyShouldSkipGeneratingVar(keys)
      }
    >
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGridPro
          pagination
          slots={joySlots}
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
    </CssVarsProvider>
  );
}
