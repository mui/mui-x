import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AdvancedFeaturesToggle from './AdvancedFeaturesToggle';

export default function FeaturesHighlight() {
  const [selectedAdvancedFeature, setSelectedAdvancedFeature] = React.useState<
    'stacking' | 'highlighting'
  >('stacking');
  return (
    <React.Fragment>
      <Divider />
      <Paper
        component="div"
        variant="outlined"
        sx={{
          mb: 8,
          height: { md: 640 },
          overflow: 'hidden',
        }}
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
                  A wide variety of chart types to choose from, including bar, line, pie, scatter,
                  and more, to best visualize your data.
                </Typography>
              </Stack>
              <Stack spacing={1} p={1} flexBasis={{ xs: '50%', sm: '35%' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: '100px',
                    background: 'lightgrey',
                    borderRadius: 1,
                  }}
                >
                  {'Color palette sequence'}
                </Box>
                <Typography variant="subtitle2">Customization and styling</Typography>
                <Typography variant="body2" color="text.secondary">
                  Fine-grained control over appearance to match your brand and style.
                </Typography>
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
              <Stack spacing={1} flexBasis="50%" p={1}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: '50px',
                    background: 'lightgrey',
                    borderRadius: 1,
                  }}
                >
                  {'zoom and pan demo'}
                </Box>
                <Typography variant="subtitle2">Zoom and pan</Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore data with greater detail by zooming in and panning across the chart.
                </Typography>
              </Stack>
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
            <Stack spacing={1} p={1} flexBasis={{ xs: '65%', sm: '50%', md: '65%' }}>
              <Typography variant="subtitle2">Advanced data visualization</Typography>
              <Typography variant="body2" color="text.secondary">
                Compare and analyze data across categories by layering data series.
              </Typography>
              <AdvancedFeaturesToggle
                selected={selectedAdvancedFeature}
                onToggleChange={setSelectedAdvancedFeature}
              />
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: '100px',
                  background: 'lightgrey',
                  borderRadius: 1,
                }}
              >
                {'Small code snippet'}
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </React.Fragment>
  );
}
