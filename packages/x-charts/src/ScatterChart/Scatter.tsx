import * as React from 'react';
import PropTypes from 'prop-types';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';
import { D3Scale, getValueToPositionMapper } from '../hooks/useScale';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';

export interface ScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  markerSize: number;
  color: string;
}

function Scatter(props: ScatterProps) {
  const { series, xScale, yScale, color, markerSize } = props;

  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);
  const getInteractionItemProps = useInteractionItemProps();

  return (
    <g>
      {series.data.map(({ x, y, id }, dataIndex) => (
        <circle
          key={id}
          cx={0}
          cy={0}
          r={markerSize}
          transform={`translate(${getXPosition(x)}, ${getYPosition(y)})`}
          fill={color}
          {...getInteractionItemProps({ type: 'scatter', seriesId: series.id, dataIndex })}
        />
      ))}
    </g>
  );
}

Scatter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  markerSize: PropTypes.number.isRequired,
  series: PropTypes.shape({
    color: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        x: PropTypes.any.isRequired,
        y: PropTypes.any.isRequired,
      }),
    ).isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    markerSize: PropTypes.number,
    type: PropTypes.oneOf(['scatter']).isRequired,
    valueFormatter: PropTypes.func.isRequired,
    xAxisKey: PropTypes.string,
    yAxisKey: PropTypes.string,
  }).isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
} as any;

export { Scatter };
