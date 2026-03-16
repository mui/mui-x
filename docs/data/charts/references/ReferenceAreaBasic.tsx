import * as React from 'react';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';
import type { ScaleLinear, ScalePoint } from '@mui/x-charts-vendor/d3-scale';

type UseReferenceAreaParams = {
  /**
   * @default 'start'
   */
  x1?: string | number | 'start' | 'end';
  /**
   * @default 'end'
   */
  x2?: string | number | 'start' | 'end';
  /**
   * @default 'start'
   */
  y1?: number | 'start' | 'end';
  /**
   * @default 'end'
   */
  y2?: number | 'start' | 'end';
};

type UseReferenceAreaResult = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ReferenceAreaProps = UseReferenceAreaParams & React.SVGProps<SVGRectElement>;
type ReferenceLabelProps = UseReferenceAreaParams & React.SVGProps<SVGTextElement>;

function resolveValue(
  value: string | number | 'start' | 'end',
  scale: ScaleLinear<any, any> | ScalePoint<any>,
  drawingMin: number,
  drawingMax: number,
): number {
  if (value === 'start') {
    return drawingMin;
  }
  if (value === 'end') {
    return drawingMax;
  }
  return (scale(value as any) as number) ?? drawingMin;
}

function useReferenceArea(params: UseReferenceAreaParams): UseReferenceAreaResult {
  const { x1: x1Props, x2: x2Props, y1: y1Props, y2: y2Props } = params;

  const xScale = useXScale() as ScaleLinear<any, any> | ScalePoint<any>;
  const yScale = useYScale() as ScaleLinear<any, any>;
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
function ReferenceArea(props: ReferenceAreaProps) {
  const { x1, x2, y1, y2, ...other } = props;

  const rectCoordinates = useReferenceArea({x1, x2, y1, y2});
  
  return (
    <rect
      {...rectCoordinates}
      {...other}
    />
  );
}

function ReferenceAreaLabel(props: ReferenceLabelProps) {
  const { x1, x2, y1, y2, children,...other } = props;

  const rectCoordinates = useReferenceArea({x1, x2, y1, y2});
  

  return (
    <text
  
    x={rectCoordinates.x+5}
    y={rectCoordinates.y+5}
    
      {...other}
    >{children}</text>
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

      <ReferenceAreaLabel y1={6} y2={8} stroke="none" fill="green" dominantBaseline="hanging"  >Test</ReferenceAreaLabel>
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
