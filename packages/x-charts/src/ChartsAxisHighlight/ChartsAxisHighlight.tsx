import * as React from 'react';
import PropTypes from 'prop-types';
import { InteractionContext } from '../context/InteractionProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { getValueToPositionMapper } from '../hooks/useScale';
import { isBandScale } from '../internals/isBandScale';

export type ChartsAxisHighlightProps = {
  x?: 'none' | 'line' | 'band';
  y?: 'none' | 'line';
};

function ChartsAxisHighlight(props: ChartsAxisHighlightProps) {
  const { x: xAxisHighlight, y: yAxisHighlight } = props;
  const { xAxisIds, xAxis, yAxisIds, yAxis } = React.useContext(CartesianContext);

  const USED_X_AXIS_ID = xAxisIds[0];
  const USED_Y_AXIS_ID = yAxisIds[0];

  const xScale = xAxis[USED_X_AXIS_ID].scale;
  const yScale = yAxis[USED_Y_AXIS_ID].scale;

  const { axis } = React.useContext(InteractionContext);

  const getXPosition = getValueToPositionMapper(xScale);
  return (
    <React.Fragment>
      {xAxisHighlight === 'band' && axis.x !== null && isBandScale(xScale) && (
        <path
          d={`M ${xScale(axis.x.value)! - (xScale.step() - xScale.bandwidth()) / 2} ${
            yScale.range()[0]
          } l ${xScale.step()} 0 l 0 ${
            yScale.range()[1] - yScale.range()[0]
          } l ${-xScale.step()} 0 Z`}
          fill="gray"
          fillOpacity={0.1}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {xAxisHighlight === 'line' && axis.x !== null && (
        <path
          d={`M ${getXPosition(axis.x.value)} ${yScale(yScale.domain()[0])} L ${getXPosition(
            axis.x.value,
          )} ${yScale(yScale.domain().at(-1))}`}
          stroke="black"
          strokeDasharray="5 2"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {yAxisHighlight === 'line' && axis.y !== null && (
        <path
          d={`M ${xScale.range()[0]} ${yScale(axis.y.value)} L ${xScale.range()[1]} ${yScale(
            axis.y.value,
          )}`}
          stroke="black"
          strokeDasharray="5 2"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </React.Fragment>
  );
}

ChartsAxisHighlight.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  x: PropTypes.oneOf(['band', 'line', 'none']),
  y: PropTypes.oneOf(['line', 'none']),
} as any;

export { ChartsAxisHighlight };
