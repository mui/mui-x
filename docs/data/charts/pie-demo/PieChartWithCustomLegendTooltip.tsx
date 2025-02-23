import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { ChartsLabelMarkProps } from '@mui/x-charts/ChartsLabel';

export default function PieChartWithCustomLegendTooltip() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 'cross', value: 10, label: 'Cross' },
            { id: 'diamond', value: 15, label: 'Diamond' },
            { id: 'star', value: 20, label: 'Star' },
          ],
        },
      ]}
      width={200}
      height={200}
      slots={{ labelMark: CustomMark }}
    />
  );
}

const cross =
  'M-5.35,-1.783L-1.783,-1.783L-1.783,-5.35L1.783,-5.35L1.783,-1.783L5.35,-1.783L5.35,1.783L1.783,1.783L1.783,5.35L-1.783,5.35L-1.783,1.783L-5.35,1.783Z';
const diamond = 'M0,-7.423L4.285,0L0,7.423L-4.285,0Z';
const star =
  'M0,-7.528L1.69,-2.326L7.16,-2.326L2.735,0.889L4.425,6.09L0,2.875L-4.425,6.09L-2.735,0.889L-7.16,-2.326L-1.69,-2.326Z';

const symbols = [cross, diamond, star];

function CustomMark({ dataIndex, color, className }: ChartsLabelMarkProps) {
  const data = symbols[dataIndex ?? 0];

  return (
    <svg className={className} width={14} height={14} viewBox="-8 -8 16 16">
      <path d={data ?? symbols[0]} fill={color} />
    </svg>
  );
}
