import { ThemeOptions, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { statCardData } from './data';
import StatCard from './StatCard';
import PieChartDemo from './PieChartDemo';
import BarChartDemo from './BarChartDemo';
import HeatmapDemo from './HeatmapDemo';
import DownloadDemo from './DownloadDemo';
import { getTheme } from '../theme/getTheme';

export default function MainDemo() {
  const currentTheme = useTheme();

  const customTheme = createTheme(
    currentTheme as ThemeOptions,
    getTheme(currentTheme.palette.mode),
  );

  return (
    <ThemeProvider theme={customTheme}>
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
        <Stack direction="row" height="100%" spacing={1}>
          {/* Left/Main Section */}
          <Stack
            direction="column"
            spacing={1}
            flexBasis={{ xs: '100%', md: '65%' }}
            maxHeight={{ xs: 500, md: 580 }}
            minWidth={0}
            sx={{ pr: { md: 1, xs: 0 } }}
          >
            <Stack
              display={{ xs: 'none', md: 'flex' }}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ md: 1, xs: 0.5 }}
            >
              {statCardData.map((card, index) => (
                <StatCard key={index} {...card} />
              ))}
            </Stack>
            <Box component="div" sx={{ flexGrow: 1, minHeight: 0 }}>
              <DownloadDemo />
            </Box>
          </Stack>
          {/* Right/Sidebar Section */}
          <Stack
            direction="column"
            spacing={1}
            flexBasis={{ xs: '100%', md: '35%' }}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            <Paper
              component="div"
              variant="outlined"
              sx={{ px: 1, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <PieChartDemo />
            </Paper>
            <Paper
              component="div"
              variant="outlined"
              sx={{ px: 1, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <BarChartDemo />
            </Paper>
            <Paper component="div" variant="outlined" sx={{ px: 1, py: 2 }}>
              <HeatmapDemo />
            </Paper>
          </Stack>
        </Stack>
      </Paper>
    </ThemeProvider>
  );
}
