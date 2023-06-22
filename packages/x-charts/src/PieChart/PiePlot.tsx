import * as React from 'react';
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

  const center = {
    x: left + width / 2,
    y: top + height / 2,
  };
  const { series, seriesOrder } = seriesData;
  return (
    <g>
      {seriesOrder.map((seriesId) => {
        const { innerRadius, outerRadius, cornerRadius, data } = series[seriesId];
        return (
          <g key={seriesId} transform={`translate(${center.x}, ${center.y})`}>
            {data.map(
              (
                {
                  id,
                  color,

                  ...other
                },
                index,
              ) => {
                return (
                  <PieElement
                    innerRadius={innerRadius}
                    outerRadius={outerRadius ?? availableRadius}
                    cornerRadius={cornerRadius}
                    id={seriesId}
                    color={color}
                    dataIndex={index}
                    highlightScope={series[seriesId].highlightScope}
                    {...other}
                  />
                );
              },
            )}
          </g>
        );
      })}
    </g>
  );
}
