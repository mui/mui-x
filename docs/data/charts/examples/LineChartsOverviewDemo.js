import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import SimpleLineChart from '../line-demo/SimpleLineChart';
import TinyLineChart from '../line-demo/TinyLineChart';
import DashedLineChart from '../line-demo/DashedLineChart';
import BiaxialLineChart from '../line-demo/BiaxialLineChart';
import LineChartWithReferenceLines from '../line-demo/LineChartWithReferenceLines';
import LineChartConnectNulls from '../line-demo/LineChartConnectNulls';
import LiveLineChartNoSnap from '../line-demo/LiveLineChartNoSnap';
import LineWithUncertaintyArea from '../line-demo/LineWithUncertaintyArea';
import CustomLineMarks from '../line-demo/CustomLineMarks';

export const featuresSet = [
  {
    id: 1,
    name: 'Simple Line Chart',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <SimpleLineChart />,
    linkToCode: '/line-demo/#system-SimpleLineChart.tsx',
  },
  {
    id: 2,
    name: 'Tiny Line Chart',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <TinyLineChart />,
    linkToCode: '/line-demo/#system-TinyLineChart.tsx',
  },
  {
    id: 3,
    name: 'Dashed Line Chart',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <DashedLineChart />,
    linkToCode: '/line-demo/#system-DashedLineChart.tsx',
  },
  {
    id: 4,
    name: 'Biaxial Line Chart',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <BiaxialLineChart />,
    linkToCode: '/line-demo/#system-BiaxialLineChart.tsx',
  },
  {
    id: 5,
    name: 'Line Chart With Reference Lines',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <LineChartWithReferenceLines />,
    linkToCode: '/line-demo/#system-LineChartWithReferenceLines.tsx',
  },
  {
    id: 6,
    name: 'Line Chart Connect Nulls',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <LineChartConnectNulls />,
    linkToCode: '/line-demo/#system-LineChartConnectNulls.tsx',
  },
  {
    id: 7,
    name: 'Live Line Chart No Snap',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <LiveLineChartNoSnap />,
    linkToCode: '/line-demo/#system-LiveLineChartNoSnap.tsx',
  },
  {
    id: 8,
    name: 'Line With Uncertainty Area',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <LineWithUncertaintyArea />,
    linkToCode: '/line-demo/#system-LineWithUncertaintyArea.tsx',
  },
  {
    id: 9,
    name: 'Custom Line Marks',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <CustomLineMarks />,
    linkToCode: '/line-demo/#system-CustomLineMarks.tsx',
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

export default function LineChartsOverviewDemo() {
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
