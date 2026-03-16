import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useXScale, useYScale } from '@mui/x-charts/hooks';

function useReferencePoint(params) {
  const xScale = useXScale();
  const yScale = useYScale();

  return {
    cx: xScale(params.x),
    cy: yScale(params.y),
  };
}

function ReferencePoint(props) {
  const { x, y, ...other } = props;

  const coordinates = useReferencePoint({ x, y });

  return <circle {...coordinates} {...other} />;
}

export default function ReferencePointBasic() {
  return (
    <LineChart {...chartsConfig}>
      <ReferencePoint x="Apr" y={7} r={6} fill="red" />
      <ReferencePoint
        x="Jun"
        y={6}
        r={8}
        fill="none"
        stroke="green"
        strokeWidth={2}
      />
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
