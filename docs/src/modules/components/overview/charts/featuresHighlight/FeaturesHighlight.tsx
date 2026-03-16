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
        Elegant, effortless data visualization
      </Typography>
      <Typography sx={{ textAlign: 'center' }}>
        Highly customizable, SVG-rendered React charts with D3-based data manipulation.
      </Typography>
      <Paper
        component="div"
        variant="outlined"
        sx={(theme) => ({
          my: 8,
          height: { xl: 640 },
          overflow: 'hidden',
          background: theme.palette.gradients.linearSubtle,
        })}
      >
        {/* Outer container */}
        <Stack direction={{ xs: 'column', xl: 'row' }} alignItems="center" height="100%">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            flexBasis={{ xs: '100%', xl: '66.6%' }}
            sx={(theme) => ({
              height: '100%',
              borderRight: { xs: 'none', xl: `1px solid ${theme.palette.divider}` },
              borderBottom: { xl: 'none', xs: `1px solid ${theme.palette.divider}` },
            })}
          >
            {/* first column */}
            <Stack
              flexBasis={{ xs: '100%', md: '50%' }}
              minWidth={0}
              sx={(theme) => ({
                borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
                borderBottom: { md: 'none', xs: `1px solid ${theme.palette.divider}` },
              })}
            >
              <Stack
                spacing={1}
                p={2}
                flexBasis={{ xs: '50%', md: '70%' }}
                sx={(theme) => ({
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                <EveryDataType />
              </Stack>
              <Stack spacing={1} p={2} flexBasis={{ xs: '50%', md: '30%' }} justifyContent="center">
                <ColorPaletteSequence />
              </Stack>
            </Stack>

            {/* second column */}
            <Stack flexBasis={{ xs: '100%', md: '50%' }} minWidth={0}>
              <Box
                p={2}
                flexBasis="30%"
                sx={(theme) => ({
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                <Typography variant="subtitle2">Data labeling</Typography>
                <Typography variant="body2" color="text.secondary">
                  Deliver insights with precision using clear labels, interactive tooltips, and
                  informative legends.
                </Typography>
                <Legends />
              </Box>
              <Box p={2} flexBasis={{ xs: '65%', md: '50%', xl: '65%' }}>
                <ZoomAndPan />
              </Box>
            </Stack>
          </Stack>

          {/* third column */}
          <Stack
            flexBasis={{ xs: '100%', md: '33.3%' }}
            height="100%"
            width="100%"
            direction={{ xs: 'column', md: 'row', xl: 'column' }}
          >
            <Stack
              spacing={1}
              p={2}
              flexBasis={{ xs: '50%', xl: '35%' }}
              sx={(theme) => ({
                borderBottom: {
                  xs: `1px solid ${theme.palette.divider}`,
                  md: 'none',
                  xl: `1px solid ${theme.palette.divider}`,
                },
                borderRight: { xl: 'none', xs: 'none', md: `1px solid ${theme.palette.divider}` },
              })}
            >
              <Typography variant="subtitle2">Composition</Typography>
              <Typography variant="body2" color="text.secondary">
                Build complex charts by composing individual building blocks.
              </Typography>
              <HighlightedCode
                language="jsx"
                copyButtonHidden
                code={`<ChartsDataProvider>
  <CustomLegend />
  <ChartSurface>
    <BarPlot />
    <ChartsXAxis />
  </ChartSurface>
</ChartsDataProvider>`}
              />
            </Stack>
            <Box flexBasis={{ xs: '50%', xl: '65%' }} p={2}>
              <BarChartToggle />
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
