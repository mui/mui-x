import * as React from 'react';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';

const positions = ['top', 'bottom', 'left', 'right'] as const;

const barChartProps: BarChartProps = {
  series: [
    {
      data: [3, 4, 1, 6, 5],
      label: 'A',
      id: 'A',
      highlightScope: { highlight: 'item', fade: 'global' },
    },
    {
      data: [4, 3, 1, 5, 8],
      label: 'B',
      id: 'B',
      highlightScope: { highlight: 'item', fade: 'global' },
    },
  ],
  height: 300,
  width: 400,
};

export default function TooltipPosition() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 8,
      }}
    >
      {positions.map((position) => (
        <div key={position}>
          <p>{position}</p>
          <BarChart
            {...barChartProps}
            slotProps={{ tooltip: { trigger: 'item', position } }}
            tooltipItem={{ type: 'bar', seriesId: 'A', dataIndex: 2 }}
            onTooltipItemChange={() => {}}
          />
        </div>
      ))}
    </div>
  );
}
