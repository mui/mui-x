import * as React from 'react';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const data = {
  nodes: [
    // Sub-segment nodes - Server Products and Cloud
    {
      id: 'Server Products and Cloud',
      label: 'Server Products & Cloud',
      color: '#696969',
    },
    {
      id: 'Enterprise Services',
      label: 'Enterprise Services',
      color: '#696969',
    },
    // Sub-segment nodes - Productivity
    {
      id: 'Microsoft 365 Commercial',
      label: 'M365 Commercial',
      color: '#696969',
    },
    { id: 'Microsoft 365 Consumer', label: 'M365 Consumer', color: '#696969' },
    { id: 'LinkedIn', label: 'LinkedIn', color: '#696969' },
    { id: 'Dynamics', label: 'Dynamics', color: '#696969' },
    // Sub-segment nodes - Personal Computing
    { id: 'Gaming', label: 'Gaming', color: '#696969' },
    { id: 'Windows and Devices', label: 'Windows & Devices', color: '#696969' },
    {
      id: 'Search and News Advertising',
      label: 'Search & News Ads',
      color: '#696969',
    },
    { id: 'Other', label: 'Other', color: '#696969' },
    // Main revenue segments
    { id: 'Intelligent Cloud', label: 'Intelligent Cloud', color: '#696969' },
    { id: 'Productivity', label: 'Productivity & Business', color: '#696969' },
    { id: 'Personal Computing', label: 'Personal Computing', color: '#696969' },
    // Revenue node
    { id: 'Revenue', label: 'Total Revenue', color: '#696969' },
    // Gross Profit
    { id: 'Gross Profit', label: 'Gross Profit', color: '#00A34C' },
    // Operating Profit
    { id: 'Operating Profit', label: 'Operating Profit', color: '#00A34C' },
    // Final breakdown

    { id: 'Net Profit', label: 'Net Profit', color: '#00A34C' },
    { id: 'Tax', label: 'Income Tax', color: '#D1003F' },
    { id: 'Other Loss', label: 'Other Loss', color: '#D1003F' },
    // Operating Expenses and breakdown
    { id: 'Operating Expenses', label: 'Operating Expenses', color: '#D1003F' },
    { id: 'R&D', label: 'R&D', color: '#D1003F' },
    { id: 'S&M', label: 'Sales & Marketing', color: '#D1003F' },
    { id: 'G&A', label: 'G&A', color: '#D1003F' },
    // Cost of Revenue and breakdown
    { id: 'Cost of Revenue', label: 'Cost of Revenue', color: '#D1003F' },
    { id: 'Product Costs', label: 'Product Costs', color: '#D1003F' },
    { id: 'Service Costs', label: 'Service Costs', color: '#D1003F' },
  ],
  links: [
    // Intelligent Cloud sub-segments
    {
      source: 'Server Products and Cloud',
      target: 'Intelligent Cloud',
      value: 98.435,
    },
    { source: 'Enterprise Services', target: 'Intelligent Cloud', value: 7.76 },
    // Productivity sub-segments
    {
      source: 'Microsoft 365 Commercial',
      target: 'Productivity',
      value: 87.767,
    },
    { source: 'Microsoft 365 Consumer', target: 'Productivity', value: 7.404 },
    { source: 'LinkedIn', target: 'Productivity', value: 17.812 },
    { source: 'Dynamics', target: 'Productivity', value: 7.827 },
    // Personal Computing sub-segments
    { source: 'Gaming', target: 'Personal Computing', value: 23.455 },
    {
      source: 'Windows and Devices',
      target: 'Personal Computing',
      value: 17.314,
    },
    {
      source: 'Search and News Advertising',
      target: 'Personal Computing',
      value: 13.878,
    },
    { source: 'Other', target: 'Personal Computing', value: 0.072 },
    // Revenue Segments to Total Revenue
    { source: 'Intelligent Cloud', target: 'Revenue', value: 106.265 },
    { source: 'Productivity', target: 'Revenue', value: 120.81 },
    { source: 'Personal Computing', target: 'Revenue', value: 54.649 },
    // Revenue to Gross Profit and Cost of Revenue
    { source: 'Revenue', target: 'Cost of Revenue', value: 87.831 },
    { source: 'Revenue', target: 'Gross Profit', value: 193.893 },
    // Gross Profit to Operating Profit and Operating Expenses
    { source: 'Gross Profit', target: 'Operating Profit', value: 128.528 },
    { source: 'Gross Profit', target: 'Operating Expenses', value: 65.365 },
    // Cost of Revenue breakdown
    { source: 'Cost of Revenue', target: 'Product Costs', value: 13.501 },
    { source: 'Cost of Revenue', target: 'Service Costs', value: 74.33 },
    // Operating Profit to Net Profit, Tax, and Other Loss
    { source: 'Operating Profit', target: 'Tax', value: 21.795 },
    { source: 'Operating Profit', target: 'Other Loss', value: 4.901 },
    { source: 'Operating Profit', target: 'Net Profit', value: 101.832 },
    // Operating Expenses breakdown
    { source: 'Operating Expenses', target: 'R&D', value: 32.488 },
    { source: 'Operating Expenses', target: 'S&M', value: 25.654 },
    { source: 'Operating Expenses', target: 'G&A', value: 7.223 },
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
  return (
    <Box
      sx={{
        p: 4,
        width: '100%',
      }}
    >
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
      <Box sx={{ width: '100%', height: 500 }}>
        <SankeyChart
          series={{
            data,
            valueFormatter,
            nodeOptions: {
              sort: 'fixed',
            },
            linkOptions: {
              color: 'target',
              opacity: 0.6,
              curveCorrection: 0,
            },
          }}
          margin={{ top: 20 }}
        />
      </Box>
    </Box>
  );
}
