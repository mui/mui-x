import * as React from 'react';
import PropTypes from 'prop-types';

import { CartesianContext } from '../context/CartesianContextProvider';
import { XAxis } from '../XAxis';
import { YAxis } from '../YAxis';
import { XAxisProps, YAxisProps } from '../models/axis';

export interface AxisProps {
  /**
   * Indicate which axis to display the the top of the charts.
   * Can be a string (the id of the axis) or an object `XAxisProps`
   * @default null
   */
  topAxis?: null | string | XAxisProps;
  /**
   * Indicate which axis to display the the bottom of the charts.
   * Can be a string (the id of the axis) or an object `XAxisProps`
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis?: null | string | XAxisProps;
  /**
   * Indicate which axis to display the the left of the charts.
   * Can be a string (the id of the axis) or an object `YAxisProps`
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis?: null | string | YAxisProps;
  /**
   * Indicate which axis to display the the right of the charts.
   * Can be a string (the id of the axis) or an object `YAxisProps`
   * @default null
   */
  rightAxis?: null | string | YAxisProps;
}

const getAxisId = (
  propsValue: undefined | null | string | XAxisProps | YAxisProps,
): string | null => {
  if (propsValue == null) {
    return null;
  }
  if (typeof propsValue === 'object') {
    return propsValue.axisId;
  }
  return propsValue;
};

function Axis(props: AxisProps) {
  const { topAxis, leftAxis, rightAxis, bottomAxis } = props;
  const { xAxis, xAxisIds, yAxis, yAxisIds } = React.useContext(CartesianContext);

  // TODO: use for plotting line without ticks or any thing
  // const drawingArea = React.useContext(DrawingContext);

  const leftId = getAxisId(leftAxis === undefined ? yAxisIds[0] : leftAxis);
  const bottomId = getAxisId(bottomAxis === undefined ? xAxisIds[0] : bottomAxis);
  const topId = getAxisId(topAxis);
  const rightId = getAxisId(rightAxis);

  if (topId !== null && !xAxis[topId]) {
    throw Error(`MUI: id used for top axis "${topId}" is not defined`);
  }
  if (leftId !== null && !yAxis[leftId]) {
    throw Error(`MUI: id used for left axis "${leftId}" is not defined`);
  }
  if (rightId !== null && !yAxis[rightId]) {
    throw Error(`MUI: id used for right axis "${rightId}" is not defined`);
  }
  if (bottomId !== null && !xAxis[bottomId]) {
    throw Error(`MUI: id used for bottom axis "${bottomId}" is not defined`);
  }

  return (
    <React.Fragment>
      {topId && (
        <XAxis position="top" axisId={topId} {...(typeof topAxis === 'object' ? topAxis : {})} />
      )}

      {bottomId && (
        <XAxis
          position="bottom"
          axisId={bottomId}
          {...(typeof bottomAxis === 'object' ? bottomAxis : {})}
        />
      )}

      {leftId && (
        <YAxis
          position="left"
          axisId={leftId}
          {...(typeof leftAxis === 'object' ? leftAxis : {})}
        />
      )}

      {rightId && (
        <YAxis
          position="right"
          axisId={rightId}
          {...(typeof rightAxis === 'object' ? rightAxis : {})}
        />
      )}
    </React.Fragment>
  );
}

Axis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Indicate which axis to display the the bottom of the charts.
   * Can be a string (the id of the axis) or an object `XAxisProps`
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string.isRequired,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'top']),
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  /**
   * Indicate which axis to display the the left of the charts.
   * Can be a string (the id of the axis) or an object `YAxisProps`
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string.isRequired,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      position: PropTypes.oneOf(['left', 'right']),
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  /**
   * Indicate which axis to display the the right of the charts.
   * Can be a string (the id of the axis) or an object `YAxisProps`
   * @default null
   */
  rightAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string.isRequired,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      position: PropTypes.oneOf(['left', 'right']),
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  /**
   * Indicate which axis to display the the top of the charts.
   * Can be a string (the id of the axis) or an object `XAxisProps`
   * @default null
   */
  topAxis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string.isRequired,
      classes: PropTypes.object,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      position: PropTypes.oneOf(['bottom', 'top']),
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
} as any;

export { Axis };
