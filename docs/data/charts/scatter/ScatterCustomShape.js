import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

import { data } from './randomData';

export default function ScatterCustomShape() {
  return (
    <ScatterChart
      width={600}
      height={300}
      series={[
        {
          id: '1',
          label: 'Series A',
          data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
          markerSize: 1,
          labelMarkType: StarLabelMark,
        },
        {
          id: '2',
          label: 'Series B',
          data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
          markerSize: 1,
          labelMarkType: DiamondLabelMark,
        },
      ]}
      slots={{ marker: CustomMarker }}
    />
  );
}

const star =
  'M0,-7.528L1.69,-2.326L7.16,-2.326L2.735,0.889L4.425,6.09L0,2.875L-4.425,6.09L-2.735,0.889L-7.16,-2.326L-1.69,-2.326Z';
const diamond = 'M0,-7.423L4.285,0L0,7.423L-4.285,0Z';

function CustomMarker({
  size,
  x,
  y,
  seriesId,
  isHighlighted,
  isFaded,
  dataIndex,
  color,
  ...other
}) {
  const props = {
    x: 0,
    y: 0,
    width: (isHighlighted ? 1.2 : 1) * size,
    height: (isHighlighted ? 1.2 : 1) * size,
    transform: `translate(${x}, ${y})`,
    fill: color,
    opacity: isFaded ? 0.3 : 1,
    ...other,
  };

  return (
    <g {...props}>
      <path
        d={seriesId === '1' ? star : diamond}
        scale={(isHighlighted ? 1.2 : 1) * size}
      />
    </g>
  );
}

function StarLabelMark({ color, ...props }) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path {...props} d={star} fill={color} />
    </svg>
  );
}

function DiamondLabelMark({ color, ...props }) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path {...props} d={diamond} fill={color} />
    </svg>
  );
}
