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
  const { xAxisIds, xAxis } = useXAxes();
  const { yAxisIds, yAxis } = useYAxes();

  return (
    <React.Fragment>
      {xAxisIds.map((axisId) => {
        if (!xAxis[axisId].position || xAxis[axisId].position === 'none') {
          return null;
        }

        return <ChartsXAxis key={axisId} slots={slots} slotProps={slotProps} axisId={axisId} />;
      })}
      {yAxisIds.map((axisId) => {
        if (!yAxis[axisId].position || yAxis[axisId].position === 'none') {
          return null;
        }

        return <ChartsYAxis key={axisId} slots={slots} slotProps={slotProps} axisId={axisId} />;
      })}
    </React.Fragment>
  );
}

ChartsAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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
} as any;

export { ChartsAxis };
