'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ChartsXAxis } from '../ChartsXAxis';
import { ChartsYAxis } from '../ChartsYAxis';
import {
  ChartsAxisSlotProps,
  ChartsAxisSlots,
  ChartsXAxisProps,
  ChartsYAxisProps,
} from '../models/axis';
import { useXAxes, useYAxes } from '../hooks';
import { DefaultizedAxisConfig } from '../context/PolarProvider/Polar.types';

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

function formatAxis<AxisProps extends ChartsXAxisProps | ChartsYAxisProps>(
  axisConfig: DefaultizedAxisConfig<AxisProps>,
  axisIds: string[],
  position: AxisProps['position'],
  slots?: Partial<ChartsAxisSlots>,
  slotProps?: Partial<ChartsAxisSlotProps>,
) {
  return axisIds
    .filter((id) => axisConfig[id].position === position)
    .map((id) => {
      return {
        ...axisConfig[id],
        slots: { ...slots, ...axisConfig?.slots },
        slotProps: { ...slotProps, ...axisConfig?.slotProps },
      };
    });
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
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  const topAxes = formatAxis(xAxis, xAxisIds, 'top', slots, slotProps);
  const rightAxes = formatAxis(yAxis, yAxisIds, 'right', slots, slotProps);
  const bottomAxes = formatAxis(xAxis, xAxisIds, 'bottom', slots, slotProps);
  const leftAxes = formatAxis(yAxis, yAxisIds, 'left', slots, slotProps);

  return (
    <React.Fragment>
      {topAxes.map((axis) => (
        <ChartsXAxis key={axis.id} {...axis} position="top" axisId={axis.id} />
      ))}
      {rightAxes.map((axis) => (
        <ChartsYAxis key={axis.id} {...axis} position="right" axisId={axis.id} />
      ))}
      {bottomAxes.map((axis) => (
        <ChartsXAxis key={axis.id} {...axis} position="bottom" axisId={axis.id} />
      ))}
      {leftAxes.map((axis) => (
        <ChartsYAxis key={axis.id} {...axis} position="left" axisId={axis.id} />
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
