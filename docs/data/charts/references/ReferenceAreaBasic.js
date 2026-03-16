import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';

function resolveValue(value, scale, drawingMin, drawingMax) {
  if (value === 'start') {
    return drawingMin;
  }
  if (value === 'end') {
    return drawingMax;
  }
  return scale(value) ?? drawingMin;
}

function useReferenceArea(params) {
  const { x1: x1Props, x2: x2Props, y1: y1Props, y2: y2Props } = params;

  const xScale = useXScale();
  const yScale = useYScale();
  const { left, top, width, height } = useDrawingArea();

  const x1 = resolveValue(x1Props ?? 'start', xScale, left, left + width);
  const x2 = resolveValue(x2Props ?? 'end', xScale, left, left + width);

  const y1 = resolveValue(y1Props ?? 'start', yScale, top, top + height);
  const y2 = resolveValue(y2Props ?? 'end', yScale, top, top + height);

  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  };
}
function ReferenceArea(props) {
  const { x1, x2, y1, y2, ...other } = props;

  const rectCoordinates = useReferenceArea({ x1, x2, y1, y2 });

  return <rect {...rectCoordinates} {...other} />;
}

function ReferenceAreaLabel(props) {
  const { x1, x2, y1, y2, children, ...other } = props;

  const rectCoordinates = useReferenceArea({ x1, x2, y1, y2 });

  return (
    <text x={rectCoordinates.x + 5} y={rectCoordinates.y + 5} {...other}>
      {children}
    </text>
  );
}
export default function ReferenceAreaBasic() {
  return (
    <LineChart {...chartsConfig}>
      <ReferenceArea y1={6} y2={8} stroke="red" strokeWidth={2} fill="none" />
      <ReferenceArea
        x1="Mar"
        x2="May"
        y1="start"
        y2="end"
        fill="blue"
        fillOpacity={0.5}
      />
      <ReferenceAreaLabel
        y1={6}
        y2={8}
        stroke="none"
        fill="green"
        dominantBaseline="hanging"
      >
        Test
      </ReferenceAreaLabel>
    </LineChart>
  );
}

const chartsConfig = {
  height: 300,
  xAxis: [
    { scaleType: 'point', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  ],
  series: [{ data: [2, 5, 3, 7, 1, 6, 4] }],
};
