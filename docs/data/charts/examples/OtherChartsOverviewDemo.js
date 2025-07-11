import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import ColorCustomization from '../sparkline/ColorCustomization';
import ArcDesign from '../gauge/ArcDesign';
import CompositionExample from '../gauge/CompositionExample';
import MultiSeriesRadar from '../radar/MultiSeriesRadar';
import CompositionExample2 from '../radar/CompositionExample';

export const featuresSet = [
  {
    id: 1,
    name: 'Color Customization',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <ColorCustomization />,
    linkToCode: '/sparkline/#system-ColorCustomization.tsx',
  },
  {
    id: 2,
    name: 'Arc Design',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <ArcDesign />,
    linkToCode: '/gauge/#system-ArcDesign.tsx',
  },
  {
    id: 3,
    name: 'Customized gauge with pointer',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <CompositionExample />,
    linkToCode: '/gauge/#system-CompositionExample.tsx',
  },
  {
    id: 4,
    name: 'Multi-series radar',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <MultiSeriesRadar />,
    linkToCode: '/radar/#system-MultiSeriesRadar.tsx',
  },
  {
    id: 5,
    name: 'Radar with composition',
    // description: 'Export rows in various file formats such as CSV, PDF or Excel.',
    // plan: 'Premium',
    // detailPage: '/export/#excel-export',
    demo: <CompositionExample2 />,
    linkToCode: '/radar/#system-CompositionExample.tsx',
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

export default function OtherChartsOverviewDemo() {
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
