import * as React from 'react';
import { arc as d3Arc } from 'd3-shape';
import { SeriesContext } from '../context/SeriesContextProvider';
import { PieElement } from './PieElement';
import { DrawingContext } from '../context/DrawingProvider';

export function PiePlot() {
  const seriesData = React.useContext(SeriesContext).pie;
  const { left, top, width, height } = React.useContext(DrawingContext);

  if (seriesData === undefined) {
    return null;
  }
  const availableRadius = Math.min(width, height) / 2;

  const innerRadius = 0;
  const radiusAdd = 0;
  const radius = availableRadius;
  const cornerRadius = 5;

  const center = {
    x: left + width / 2,
    y: top + height / 2,
  };
  const { series, seriesOrder } = seriesData;
  return (
    <g>
      {seriesOrder.map((seriesId) => (
        <g key={seriesId} transform={`translate(${center.x}, ${center.y})`}>
          {series[seriesId].data.map(({ id, color, ...other }, index) => {
            return (
              <PieElement
                d={
                  d3Arc().cornerRadius(cornerRadius)({
                    ...other,
                    innerRadius: innerRadius + radiusAdd,
                    outerRadius: radius + radiusAdd,
                  })!
                }
                id={seriesId}
                color={color}
                dataIndex={index}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
}
