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
  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    setShowTooltip(true);
  }, []);

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
            // We need to do this because there's a bug with the tooltip where the first render doesn't position the
            // tooltip correctly, but it does on the second render.
            tooltipItem={showTooltip ? { type: 'bar', seriesId: 'A', dataIndex: 2 } : null}
          />
        </div>
      ))}
    </div>
  );
}
