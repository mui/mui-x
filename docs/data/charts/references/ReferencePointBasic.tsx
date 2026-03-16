import * as React from 'react';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { useXScale, useYScale } from '@mui/x-charts/hooks';
import type { ScaleLinear, ScalePoint } from '@mui/x-charts-vendor/d3-scale';

type UseReferencePointParams = {
  x: string | number;
  y: number;
};

type UseReferencePointResult = {
  cx: number;
  cy: number;
};

type ReferencePointProps = UseReferencePointParams &
  Omit<React.SVGProps<SVGCircleElement>, 'cx' | 'cy'>;

function useReferencePoint(
  params: UseReferencePointParams,
): UseReferencePointResult {
  const xScale = useXScale() as ScaleLinear<any, any> | ScalePoint<any>;
  const yScale = useYScale() as ScaleLinear<any, any>;

  return {
    cx: xScale(params.x as any) as number,
    cy: yScale(params.y as any) as number,
  };
}

function ReferencePoint(props: ReferencePointProps) {
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

const chartsConfig: LineChartProps = {
  height: 300,
  xAxis: [
    { scaleType: 'point', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  ],
  series: [{ data: [2, 5, 3, 7, 1, 6, 4] }],
};
