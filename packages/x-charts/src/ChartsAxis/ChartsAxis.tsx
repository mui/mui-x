'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ChartsXAxis } from '../ChartsXAxis';
import { ChartsYAxis } from '../ChartsYAxis';
import { ChartsAxisSlotProps, ChartsAxisSlots } from '../models/axis';
import { useXAxes, useYAxes } from '../hooks';

export interface ChartsAxisProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsAxisSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsAxisSlotProps;
}

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsAxis API](https://mui.com/x/api/charts/charts-axis/)
 */
function ChartsAxis(props: ChartsAxisProps) {
  const { slots, slotProps } = props;
  const { xAxisIds } = useXAxes();
  const { yAxisIds } = useYAxes();

  return (
    <React.Fragment>
      {xAxisIds.map((axisId) => (
        <ChartsXAxis key={axisId} slots={slots} slotProps={slotProps} axisId={axisId} />
      ))}
      {yAxisIds.map((axisId) => (
        <ChartsYAxis key={axisId} slots={slots} slotProps={slotProps} axisId={axisId} />
      ))}
    </React.Fragment>
  );
}

ChartsAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  rightAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  topAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
} as any;

export { ChartsAxis };
