import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SimpleBarChart from '../bar-demo/SimpleBarChart';
import StackedBarChart from '../bar-demo/StackedBarChart';
import MixedBarChart from '../bar-demo/MixedBarChart';
import PositiveAndNegativeBarChart from '../bar-demo/PositiveAndNegativeBarChart';
import BarChartStackedBySign from '../bar-demo/BarChartStackedBySign';
import BiaxialBarChart from '../bar-demo/BiaxialBarChart';
import PopulationPyramidBarChart from '../bar-demo/PopulationPyramidBarChart';  
import Link from '@mui/material/Link';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';



const ChartBox = ({ title, children, linkToCode }) => (
  <Box
    sx={{
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: 1,
      borderColor: 'divider',
    }}
  >
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
      {title}
    </Typography>
    {children}
    {linkToCode ? (
              <Link
                href={`/x/react-charts${linkToCode}`}
                target="_blank"
                color="primary"
                variant="body2"
                sx={{
                  mt: 1.5,
                  fontWeight: 'bold',
                  fontFamily: 'IBM Plex Sans',
                  display: 'inline-flex',
                  alignItems: 'center',
                  '& > svg': { transition: '0.2s' },
                  '&:hover > svg': { transform: 'translateX(2px)' },
                }}
              >
                View the demo source
                <KeyboardArrowRightRounded
                  fontSize="small"
                  sx={{ mt: '1px', ml: '2px' }}
                />
              </Link>
            ) : null}
  </Box>
);

export default function ChartsOverviewDemo() {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <ChartBox title="Simple Bar Chart" linkToCode="/bar-demo/SimpleBarChart.js">
            <SimpleBarChart />
          </ChartBox>
        </Grid>
        <Grid item xs={6}>
          <ChartBox title="Stacked Bar Chart" linkToCode="/bar-demo/StackedBarChart.js">
            <StackedBarChart />
          </ChartBox>
        </Grid>
        <Grid item xs={6}>
          <ChartBox title="Mixed Bar Chart" linkToCode="/bar-demo/MixedBarChart.js">
            <MixedBarChart />
          </ChartBox>
        </Grid>
        <Grid item xs={6}>
          <ChartBox title="Positive and Negative Bar Chart" linkToCode="/bar-demo/PositiveAndNegativeBarChart.js">
            <PositiveAndNegativeBarChart />
          </ChartBox>
        </Grid>
        <Grid item xs={6}>
          <ChartBox title="Bar Chart Stacked by Sign" linkToCode="/bar-demo/BarChartStackedBySign.js">
            <BarChartStackedBySign />
          </ChartBox>
        </Grid>
        <Grid item xs={6}>
          <ChartBox title="Biaxial Bar Chart" linkToCode="/bar-demo/#BiaxialBarChart">
            <BiaxialBarChart />
          </ChartBox>
        </Grid>
        <Grid item xs={6}>
          <ChartBox title="Population Pyramid Bar Chart" linkToCode="/bar-demo/PopulationPyramidBarChart.js">
            <PopulationPyramidBarChart />
          </ChartBox>
        </Grid>
      </Grid>
    </Box>
  );
}
