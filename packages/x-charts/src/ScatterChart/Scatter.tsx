import * as React from 'react';
import { ScatterSeriesType } from '../models/seriesType/scatter';
import { D3Scale } from '../hooks/useScale';

export interface ScatterProps {
  data: ScatterSeriesType['data'];
  xDataToSvg?: D3Scale;
  yDataToSvg?: D3Scale;
  markerSize: number;
}

function Scatter(props: ScatterProps) {
  const { data, xDataToSvg, yDataToSvg, markerSize } = props;

  const xScale = React.useCallback((value) => xDataToSvg?.(value) ?? value, [xDataToSvg]);
  const yScale = React.useCallback((value) => yDataToSvg?.(value) ?? value, [yDataToSvg]);

  return (
    <g>
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
}

export default Scatter;
