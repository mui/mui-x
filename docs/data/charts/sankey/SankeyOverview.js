import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  SankeyLinkPlot,
  SankeyNodePlot,
  SankeyTooltip,
  SankeyDataProvider,
} from '@mui/x-charts-pro/SankeyChart';
import { ChartsWrapper } from '@mui/x-charts-pro/ChartsWrapper';
import { ChartsSurface } from '@mui/x-charts-pro/ChartsSurface';
import { CustomNodeLabelPlot } from './CustomNodeLabelPlot';

const data = {
  nodes: [
    // Sub-segment
    { id: 'Server Products', color: '#595b63' },
    { id: 'Enterprise Services', color: '#595b63' },
    { id: 'M365 Commercial', color: '#595b63' },
    { id: 'M365 Consumer', color: '#595b63' },
    { id: 'LinkedIn', color: '#595b63' },
    { id: 'Dynamics', color: '#595b63' },
    { id: 'Gaming', color: '#595b63' },
    { id: 'Windows & Devices', color: '#595b63' },
    { id: 'Search & News Ads', color: '#595b63' },
    // Main revenue segments
    { id: 'Intelligent Cloud', label: 'Cloud', color: '#595b63' },
    { id: 'Productivity', color: '#595b63' },
    { id: 'Personal Computing', label: 'Personal Computing', color: '#595b63' },
    { id: 'Revenue', label: 'Total Revenue', color: '#595b63' },
    // Gross Profit and breakdown
    { id: 'Gross Profit', label: 'Gross Profit', color: '#44CE8D' },
    { id: 'Operating Profit', label: 'Operating Profit', color: '#44CE8D' },
    { id: 'Net Profit', label: 'Net Profit', color: '#44CE8D' },
    { id: 'Tax', label: 'Income Tax', color: '#F35865' },
    { id: 'Other Loss', label: 'Other Loss', color: '#F35865' },
    { id: 'Operating Expenses', label: 'Operating Expenses', color: '#F35865' },
    { id: 'R&D', label: 'R&D', color: '#F35865' },
    { id: 'S&M', label: 'Sales & Marketing', color: '#F35865' },
    { id: 'G&A', label: 'General & Administration', color: '#F35865' },
    // Cost of Revenue and breakdown
    { id: 'Cost of Revenue', label: 'Cost of Revenue', color: '#F35865' },
    { id: 'Product Costs', label: 'Product Costs', color: '#F35865' },
    { id: 'Service Costs', label: 'Service Costs', color: '#F35865' },
  ],
  links: [
    // Revenue-in links
    { source: 'Server Products', target: 'Intelligent Cloud', value: 98.4 },
    { source: 'Enterprise Services', target: 'Intelligent Cloud', value: 7.7 },
    { source: 'M365 Commercial', target: 'Productivity', value: 87.7 },
    { source: 'M365 Consumer', target: 'Productivity', value: 7.4 },
    { source: 'LinkedIn', target: 'Productivity', value: 17.8 },
    { source: 'Dynamics', target: 'Productivity', value: 7.8 },
    { source: 'Gaming', target: 'Personal Computing', value: 23.4 },
    { source: 'Windows & Devices', target: 'Personal Computing', value: 17.3 },
    { source: 'Search & News Ads', target: 'Personal Computing', value: 13.8 },
    { source: 'Intelligent Cloud', target: 'Revenue', value: 106.2 },
    { source: 'Productivity', target: 'Revenue', value: 120.8 },
    { source: 'Personal Computing', target: 'Revenue', value: 54.6 },
    // Revenue-out links
    { source: 'Revenue', target: 'Cost of Revenue', value: 87.8 },
    { source: 'Revenue', target: 'Gross Profit', value: 193.8 },
    { source: 'Gross Profit', target: 'Operating Profit', value: 128.5 },
    { source: 'Gross Profit', target: 'Operating Expenses', value: 65.3 },
    { source: 'Cost of Revenue', target: 'Product Costs', value: 13.5 },
    { source: 'Cost of Revenue', target: 'Service Costs', value: 74.3 },
    { source: 'Operating Profit', target: 'Tax', value: 21.7 },
    { source: 'Operating Profit', target: 'Other Loss', value: 4.9 },
    { source: 'Operating Profit', target: 'Net Profit', value: 101.8 },
    { source: 'Operating Expenses', target: 'R&D', value: 32.4 },
    { source: 'Operating Expenses', target: 'S&M', value: 25.6 },
    { source: 'Operating Expenses', target: 'G&A', value: 7.2 },
  ],
};

const valueFormatter = (value, context) => {
  if (context.type === 'link') {
    return `${value}B`;
  }
  // The value of a node is the sum of its incoming links
  return `${value}B total`;
};

export default function SankeyOverview() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        align="center"
        sx={{ fontWeight: 'bold' }}
      >
        Microsoft FY 2025 Income Statement
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        Flow from Revenue to Net Income (in Billions USD)
      </Typography>
      <Box sx={{ width: '100%', height: 600 }}>
        <SankeyDataProvider
          series={[
            {
              type: 'sankey',
              data,
              valueFormatter,
              nodeOptions: {
                sort: 'fixed',
                padding: 20,
                width: 9,
                showLabels: isDesktop,
              },
              linkOptions: {
                color: 'target',
                opacity: 0.6,
                curveCorrection: 0,
                showValues: !isDesktop,
              },
            },
          ]}
          margin={{ top: 20 }}
        >
          <ChartsWrapper>
            <ChartsSurface>
              <SankeyNodePlot />
              <SankeyLinkPlot />
              <CustomNodeLabelPlot />
              <CustomNodeLabelPlot />
            </ChartsSurface>
            {<SankeyTooltip trigger="item" />}
          </ChartsWrapper>
        </SankeyDataProvider>
      </Box>
    </Box>
  );
}
