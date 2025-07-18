import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import TwoLevelPieChart from '../pie-demo/TwoLevelPieChart';
import StraightAnglePieChart from '../pie-demo/StraightAnglePieChart';
import PieChartWithCustomizedLabel from '../pie-demo/PieChartWithCustomizedLabel';
import PieChartWithPaddingAngle from '../pie-demo/PieChartWithPaddingAngle';
import PieChartWithCenterLabel from '../pie-demo/PieChartWithCenterLabel';
import PieChartWithCustomLegendAndTooltip from '../pie-demo/PieChartWithCustomLegendAndTooltip';

export const featuresSet = [
  {
    id: 1,
    name: 'Two Level Pie Chart',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <TwoLevelPieChart />,
    linkToCode: '/pie-demo/#system-TwoLevelPieChart.tsx',
  },
  {
    id: 2,
    name: 'Straight Angle Pie Chart',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <StraightAnglePieChart />,
    linkToCode: '/pie-demo/#system-StraightAnglePieChart.tsx',
  },
  {
    id: 3,
    name: 'Pie Chart With Customized Label',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <PieChartWithCustomizedLabel />,
    linkToCode: '/pie-demo/#system-PieChartWithCustomizedLabel.tsx',
  },
  {
    id: 4,
    name: 'Pie Chart With Center Label',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <PieChartWithCenterLabel />,
    linkToCode: '/pie-demo/#system-PieChartWithCenterLabel.tsx',
  },
  {
    id: 5,
    name: 'Pie Chart With Padding Angle',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <PieChartWithPaddingAngle />,
    linkToCode: '/pie-demo/#system-PieChartWithPaddingAngle.tsx',
  },
  {
    id: 6,
    name: 'Pie Chart With Custom Legend And Tooltip',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <PieChartWithCustomLegendAndTooltip />,
    linkToCode: '/pie-demo/#system-PieChartWithCustomLegendAndTooltip.tsx',
  },
];

function ChartBox({ title, children, linkToCode }) {
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: 1,
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6" sx={{ mt: 1, mb: 1, ml: 2, fontWeight: 'bold' }}>
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
            width: '80%',
            height: '80%',
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
            mt: 1,
            ml: 2,
            mb: 1,
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
            sx={{ mt: '1px', ml: '1px' }}
          />
        </Link>
      ) : null}
    </Box>
  );
}

export default function PieChartsOverviewDemo() {
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
