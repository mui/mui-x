import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

function HTMLDiamond({ color, ...props }) {
  return (
    <div
      {...props}
      style={{ transform: 'scale(0.6, 0.75) rotate(45deg)', background: color }}
    />
  );
}

function SVGStar({ color, ...props }) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path
        {...props}
        d="M0,-7.528L1.69,-2.326L7.16,-2.326L2.735,0.889L4.425,6.09L0,2.875L-4.425,6.09L-2.735,0.889L-7.16,-2.326L-1.69,-2.326Z"
        fill={color}
      />
    </svg>
  );
}

export default function PieChartWithCustomLegendAndTooltip() {
  return (
    <PieChart
      series={[
        {
          data: [
            { value: 10, label: 'Circle', labelMarkType: 'circle' },
            {
              value: 15,
              label: 'Diamond',
              labelMarkType: HTMLDiamond,
            },
            { value: 20, label: 'Star', labelMarkType: SVGStar },
          ],
        },
      ]}
      width={200}
      height={200}
    />
  );
}
