import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import SimpleBarChart from '../bar-demo/SimpleBarChart';
import StackedBarChart from '../bar-demo/StackedBarChart';
import MixedBarChart from '../bar-demo/MixedBarChart';
import PositiveAndNegativeBarChart from '../bar-demo/PositiveAndNegativeBarChart';
import BarChartStackedBySign from '../bar-demo/BarChartStackedBySign';
import BiaxialBarChart from '../bar-demo/BiaxialBarChart';
import PopulationPyramidBarChart from '../bar-demo/PopulationPyramidBarChart';

export const featuresSet = [
  {
    id: 1,
    name: 'Simple Bar Chart',
    // plan: 'Pro',
    // detailPage: '/master-detail/',
    demo: <SimpleBarChart />,
    linkToCode: '/bar-demo/#system-SimpleBarChart.tsx',
  },
  {
    id: 2,
    name: 'Stacked Bar Chart',
    // description: 'Edit data inside cells by double-clicking or pressing Enter.',
    // plan: 'Community',
    // detailPage: '/editing/',
    demo: <StackedBarChart />,
    linkToCode: '/bar-demo/#system-StackedBarChart.tsx',
  },
  {
    id: 3,
    name: 'Mixed Bar Chart',
    // description: 'Group columns in a multi-level hierarchy.',
    // plan: 'Community',
    // detailPage: '/column-groups/',
    demo: <MixedBarChart />,
    linkToCode: '/bar-demo/#system-MixedBarChart.tsx',
  },
  {
    id: 4,
    name: 'Positive and Negative Bar Chart',
    // description: 'Paginate rows and only fetch what you need.',
    // plan: 'Pro',
    // detailPage: '/row-updates/#lazy-loading',
    demo: <PositiveAndNegativeBarChart />,
    linkToCode: '/bar-demo/#system-PositiveAndNegativeBarChart.tsx',
  },
  {
    id: 5,
    name: 'Bar Chart Stacked by Sign',
    // description:
    //   'Save and restore internal state and configurations like active filters and sorting.',
    // plan: 'Community',
    // detailPage: '/state/#save-and-restore-the-state',
    demo: <BarChartStackedBySign />,
    linkToCode: '/bar-demo/#system-BarChartStackedBySign.tsx',
  },
  {
    id: 6,
    name: 'Biaxial Bar Chart',
    // description: 'Group rows with repeating column values.',
    // plan: 'Premium',
    // detailPage: '/row-grouping/',
    demo: <BiaxialBarChart />,
    linkToCode: '/bar-demo/#system-BiaxialBarChart.tsx',
  },
  {
    id: 7,
    name: 'Population Pyramid Bar Chart',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <PopulationPyramidBarChart />,
    linkToCode: '/bar-demo/#system-PopulationPyramidBarChart.tsx',
  },
];

function ChartBox({ title, children, linkToCode }) {
  return (
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
      overflow: 'hidden',
    }}
  >
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
      {title}
    </Typography>
    <Box
      sx={{
        flexGrow: 1,
        minHeight: 300,
        width: '100%',
        '& > div': {
          width: '100% !important',
          height: '100% !important',
        },
        '& svg': {
          width: '100%',
          height: '100%',
        },
      }}
    >
      {children}
    </Box>
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
        <KeyboardArrowRightRounded fontSize="small" sx={{ mt: '1px', ml: '2px' }} />
      </Link>
    ) : null}
  </Box>
);
}

export default function BarChartsOverviewDemo() {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={4}>
        {featuresSet.map((feature) => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={feature.id}>
            <ChartBox title={feature.name} linkToCode={feature.linkToCode}>
              {feature.demo}
            </ChartBox>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
