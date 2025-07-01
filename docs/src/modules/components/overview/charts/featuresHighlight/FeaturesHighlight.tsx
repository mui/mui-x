import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import ColorPaletteSequence from './ColorPaletteSequence';
import BarChartToggle from './BarChartToggle/BarChartToggle';
import ZoomAndPan from './ZoomAndPan/ZoomAndPan';
import EveryDataType from './EveryDataType';
import Legends from './Legends';

export default function FeaturesHighlight() {
  return (
    <Box sx={{ mx: 'auto', maxWidth: 1200 }}>
      <Divider sx={{ my: 4 }} />
      <Typography
        sx={(theme) => ({
          textAlign: 'center',
          fontWeight: 600,
          color: (theme.vars || theme).palette.primary.main,
        })}
      >
        Using MUI X Charts
      </Typography>
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 600 }}>
        Visualize your data with effortless elegance
      </Typography>
      <Typography sx={{ textAlign: 'center' }}>
        High-performance and SVG-rendered customizable React charts with d3.js based data
        manipulation.
      </Typography>
      <Paper
        component="div"
        variant="outlined"
        sx={(theme) => ({
          my: 8,
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
            {}
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
                <EveryDataType />
              </Stack>
              <Stack spacing={1} p={2} flexBasis={{ xs: '50%', sm: '35%' }}>
                <ColorPaletteSequence />
              </Stack>
            </Stack>

            {/* second column */}
            <Stack flexBasis={{ xs: '100%', sm: '50%' }}>
              <Box
                p={1}
                flexBasis="30%"
                sx={(theme) => ({
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                <Typography variant="subtitle2">Data labeling</Typography>
                <Typography variant="body2" color="text.secondary">
                  Deliver insights effectively through clear labels, interactive tooltips, and
                  informative legends.
                </Typography>
                <Legends />
              </Box>
              <Box p={1} flexBasis={{ xs: '65%', sm: '50%', md: '65%' }}>
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
                Build complex charts by composing individual building blocks.
              </Typography>
              <HighlightedCode
                language="jsx"
                copyButtonHidden
                code={`<ChartDataProvider {...data}>
  <CustomLegend />
  <ChartSurface>
    <BarPlot />
    <ChartsXAxis />
  </ChartSurface>
</ChartDataProvider>`}
              />
            </Stack>
            <Box flexBasis="70%" p={1}>
              <BarChartToggle />
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
