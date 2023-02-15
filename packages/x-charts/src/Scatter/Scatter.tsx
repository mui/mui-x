import * as React from 'react';
import { ScatterSeriesType } from '../models/seriesType/scatter';

export interface ScatterProps {
  data: ScatterSeriesType['data'];
  xDataToSvg?: (value: any) => number;
  yDataToSvg?: (value: any) => number;
  markerSize: number;
}

type ScatterComponent = (props: ScatterProps & React.RefAttributes<SVGSVGElement>) => JSX.Element;

const Scatter = React.forwardRef(function Grid(props: ScatterProps, ref: React.Ref<SVGSVGElement>) {
  const { data, xDataToSvg, yDataToSvg, markerSize } = props;

  const xScale = React.useCallback((value) => xDataToSvg?.(value) ?? value, [xDataToSvg]);
  const yScale = React.useCallback((value) => yDataToSvg?.(value) ?? value, [yDataToSvg]);

  return (
    <g ref={ref}>
      {data.map(({ x, y, id }) => (
        <circle
          key={id}
          cx={0}
          cy={0}
          r={markerSize}
          transform={`translate(${xScale(x)}, ${yScale(y)})`}
          fill="red"
        />
      ))}
    </g>
  );
}) as ScatterComponent;

export default Scatter;
