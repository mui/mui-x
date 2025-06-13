import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import SimpleScatterChart from '../scatter-demo/SimpleScatterChart';
import MultipleYAxesScatterChart from '../scatter-demo/MultipleYAxesScatterChart';

export const featuresSet = [
  {
    id: 1,
    name: 'Simple Scatter Chart',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <SimpleScatterChart />,
    linkToCode: '/scatter-demo/#system-SimpleScatterChart.tsx',
  },
  {
    id: 2,
    name: 'Multiple Y Axes Scatter Chart',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <MultipleYAxesScatterChart />,
    linkToCode: '/scatter-demo/#system-MultipleYAxesScatterChart.tsx',
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

export default function ScatterChartsOverviewDemo() {
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
