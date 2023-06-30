import * as React from 'react';
import { SeriesContext } from '../context/SeriesContextProvider';
import PieArc from './PieArc';
import PieArcLabel from './PieArcLabel';
import { DrawingContext } from '../context/DrawingProvider';
import { DefaultizedPieValueType, PieSeriesType } from '../models/seriesType/pie';

const RATIO = 180 / Math.PI;

function getItemLabel(
  arcLabel: PieSeriesType['arcLabel'],
  arcLabelMinAngle: number,
  item: DefaultizedPieValueType,
) {
  if (!arcLabel) {
    return null;
  }
  const angle = (item.endAngle - item.startAngle) * RATIO;
  if (angle < arcLabelMinAngle) {
    return null;
  }

  if (typeof arcLabel === 'string') {
    return item[arcLabel]?.toString();
  }

  return arcLabel(item);
}

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
        const {
          innerRadius,
          outerRadius,
          cornerRadius,
          arcLabel,
          arcLabelMinAngle = 0,
          data,
          cx,
          cy,
          highlighted,
          faded,
        } = series[seriesId];
        return (
          <g
            key={seriesId}
            transform={`translate(${cx === undefined ? center.x : left + cx}, ${
              cy === undefined ? center.y : top + cy
            })`}
          >
            <g>
              {data.map((item, index) => {
                return (
                  <PieArc
                    {...item}
                    key={item.id}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius ?? availableRadius}
                    cornerRadius={cornerRadius}
                    id={seriesId}
                    color={item.color}
                    dataIndex={index}
                    highlightScope={series[seriesId].highlightScope}
                    highlighted={highlighted}
                    faded={faded}
                  />
                );
              })}
              {data.map((item, index) => {
                return (
                  <PieArcLabel
                    {...item}
                    key={item.id}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius ?? availableRadius}
                    cornerRadius={cornerRadius}
                    id={seriesId}
                    color={item.color}
                    dataIndex={index}
                    highlightScope={series[seriesId].highlightScope}
                    formattedArcLabel={getItemLabel(arcLabel, arcLabelMinAngle, item)}
                  />
                );
              })}
            </g>
          </g>
        );
      })}
    </g>
  );
}
