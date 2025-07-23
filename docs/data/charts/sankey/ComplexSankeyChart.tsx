import * as React from 'react';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

export default function ComplexSankeyChart() {
  const data = {
    nodes: [
      { id: 'Energy', label: 'Energy', color: '#e57373' },
      { id: 'Oil', label: 'Oil', color: '#f06292' },
      { id: 'Gas', label: 'Natural Gas', color: '#ba68c8' },
      { id: 'Coal', label: 'Coal', color: '#9575cd' },
      { id: 'Electricity', label: 'Electricity', color: '#7986cb' },
      { id: 'Residential', label: 'Residential', color: '#64b5f6' },
      { id: 'Transport', label: 'Transport', color: '#4fc3f7' },
      { id: 'Industry', label: 'Industry', color: '#4dd0e1' },
      { id: 'Commercial', label: 'Commercial', color: '#4db6ac' },
    ],
    links: [
      { source: 'Energy', target: 'Oil', value: 15, color: '#ffcdd2' },
      { source: 'Energy', target: 'Gas', value: 20, color: '#f8bbd0' },
      { source: 'Energy', target: 'Coal', value: 25, color: '#e1bee7' },
      { source: 'Energy', target: 'Electricity', value: 40, color: '#d1c4e9' },
      { source: 'Oil', target: 'Transport', value: 12, color: '#c5cae9' },
      { source: 'Oil', target: 'Industry', value: 3, color: '#bbdefb' },
      { source: 'Gas', target: 'Electricity', value: 10, color: '#b3e5fc' },
      { source: 'Gas', target: 'Residential', value: 5, color: '#b2ebf2' },
      { source: 'Gas', target: 'Commercial', value: 3, color: '#b2dfdb' },
      { source: 'Gas', target: 'Industry', value: 2, color: '#c8e6c9' },
      { source: 'Coal', target: 'Electricity', value: 25, color: '#dcedc8' },
      { source: 'Electricity', target: 'Residential', value: 15, color: '#f0f4c3' },
      { source: 'Electricity', target: 'Transport', value: 5, color: '#fff9c4' },
      { source: 'Electricity', target: 'Industry', value: 15, color: '#ffecb3' },
      { source: 'Electricity', target: 'Commercial', value: 5, color: '#ffe0b2' },
    ],
  } as const;

  return (
    <SankeyChart
      width={900}
      height={500}
      margin={{ top: 20, right: 160, bottom: 20, left: 40 }}
      series={{
        data,
        nodeWidth: 20,
        nodeGap: 15,
        linkOpacity: 0.6,
      }}
    />
  );
}
