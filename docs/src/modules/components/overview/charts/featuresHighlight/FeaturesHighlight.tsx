import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ColorPaletteSequence from './ColorPaletteSequence';
import BarChartToggle from './BarChartToggle/BarChartToggle';
import ZoomAndPan from './ZoomAndPan/ZoomAndPan';

export default function FeaturesHighlight() {
  return (
    <Paper
      component="div"
      variant="outlined"
      sx={(theme) => ({
        my: 8,
        mx: 'auto',
        maxWidth: 1200,
        height: { md: 640 },
        overflow: 'hidden',
        p: 1,
        background: theme.palette.gradients.linearSubtle,
      })}
    >
      {/* Outer container */}
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" sx={{ height: '100%' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          flexBasis={{ xs: '100%', md: '66.6%' }}
          sx={(theme) => ({
            height: '100%',
            borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
            borderBottom: { md: 'none', xs: `1px solid ${theme.palette.divider}` },
          })}
        >
          {/* eslint-disable material-ui/no-hardcoded-labels */}
          {/* first column */}
          <Stack
            flexBasis={{ xs: '100%', sm: '50%' }}
            sx={(theme) => ({
              borderRight: { xs: 'none', sm: `1px solid ${theme.palette.divider}` },
              borderBottom: { sm: 'none', xs: `1px solid ${theme.palette.divider}` },
            })}
          >
            <Stack
              spacing={1}
              p={1}
              flexBasis={{ xs: '50%', sm: '65%' }}
              sx={(theme) => ({
                borderBottom: `1px solid ${theme.palette.divider}`,
              })}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: '100px',
                  background: 'lightgrey',
                  borderRadius: 1,
                }}
              >
                {'slider with a few different chart types: bar, pie, radar, etc.'}
              </Box>
              <Typography variant="subtitle2">A chart for every data type</Typography>
              <Typography variant="body2" color="text.secondary">
                A wide variety of chart types to choose from, including bar, line, pie, scatter, and
                more, to best visualize your data.
              </Typography>
            </Stack>
            <Stack spacing={1} p={2} flexBasis={{ xs: '50%', sm: '35%' }}>
              <ColorPaletteSequence />
            </Stack>
          </Stack>

          {/* second column */}
          <Stack flexBasis={{ xs: '100%', sm: '50%' }}>
            <Stack
              spacing={1}
              p={1}
              flexBasis="50%"
              sx={(theme) => ({
                borderBottom: `1px solid ${theme.palette.divider}`,
              })}
            >
              <Typography variant="subtitle2">Data labeling</Typography>
              <Typography variant="body2" color="text.secondary">
                Clearly and effectively communicate data points with labels, interactive tooltips,
                and informative legends.
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: '100px',
                  background: 'lightgrey',
                  borderRadius: 1,
                }}
              >
                {'data labeling demo or image'}
              </Box>
            </Stack>
            <Box flexBasis="50%" p={1}>
              <ZoomAndPan />
            </Box>
          </Stack>
        </Stack>
        {/* third column */}

        <Stack
          flexBasis={{ xs: '100%', md: '33.3%' }}
          sx={{ height: '100%' }}
          direction={{ xs: 'column', sm: 'row', md: 'column' }}
        >
          <Stack
            spacing={1}
            p={1}
            flexBasis={{ xs: '35%', sm: '50%', md: '35%' }}
            sx={(theme) => ({
              borderBottom: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
              borderRight: { md: 'none', xs: `1px solid ${theme.palette.divider}` },
            })}
          >
            <Typography variant="subtitle2">Composition</Typography>
            <Typography variant="body2" color="text.secondary">
              Build complex charts by combining and configuring individual building blocks.
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                minHeight: '100px',
                background: 'black',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="white">
                Small code snippet
              </Typography>
            </Box>
          </Stack>
          <Box p={1} flexBasis={{ xs: '65%', sm: '50%', md: '65%' }}>
            <BarChartToggle />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
