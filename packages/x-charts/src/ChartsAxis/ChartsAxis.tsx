'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ChartsXAxis } from '../ChartsXAxis';
import { ChartsYAxis } from '../ChartsYAxis';
import {
  AxisDefaultized,
  AxisId,
  ChartsAxisSlotProps,
  ChartsAxisSlots,
  ChartsXAxisProps,
  ChartsYAxisProps,
} from '../models/axis';
import { useXAxes, useYAxes } from '../hooks';
import { DEFAULT_AXIS_SIZE } from '../constants';
import { DefaultizedAxisConfig } from '../context/PolarProvider/Polar.types';

// TODO: Add links to the migration docs for each prop
export interface ChartsAxisProps {
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   * @deprecated Use `xAxis[].position="top"` instead.
   */
  topAxis?: null | string | ChartsXAxisProps;
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   * @deprecated Use `yAxis[].position="right"` instead.
   */
  rightAxis?: null | string | ChartsYAxisProps;
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default xAxisIds[0] The id of the first provided axis
   * @deprecated Use `xAxis[].position="bottom"` instead.
   */
  bottomAxis?: null | string | ChartsXAxisProps;
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default yAxisIds[0] The id of the first provided axis
   * @deprecated Use `yAxis[].position="left"` instead.
   */
  leftAxis?: null | string | ChartsYAxisProps;
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

const axisIdToAxis = (
  propsValue: undefined | null | AxisId | ChartsXAxisProps | ChartsYAxisProps,
): ChartsXAxisProps | ChartsYAxisProps => {
  if (propsValue == null) {
    return { axisId: undefined };
  }
  if (typeof propsValue === 'object') {
    return propsValue;
  }
  return {
    axisId: propsValue,
  };
};

const mergeProps = (
  axisConfig: AxisDefaultized,
  slots?: Partial<ChartsAxisSlots>,
  slotProps?: Partial<ChartsAxisSlotProps>,
) => {
  return typeof axisConfig === 'object'
    ? {
        slots: { ...slots, ...axisConfig?.slots },
        slotProps: { ...slotProps, ...axisConfig?.slotProps },
      }
    : { slots, slotProps };
};

type HeightWidth = { height?: number; width?: number };

function formatAxis<AxisProps extends ChartsXAxisProps | ChartsYAxisProps>(
  axisProp: AxisProps,
  axisConfig: DefaultizedAxisConfig<AxisProps>,
  axisIds: string[],
  position: AxisProps['position'],
  slots?: Partial<ChartsAxisSlots>,
  slotProps?: Partial<ChartsAxisSlotProps>,
) {
  const dimension = position === 'top' || position === 'bottom' ? 'height' : 'width';

  return (
    axisProp.axisId
      ? [{ ...axisConfig[axisProp.axisId], ...axisProp }]
      : axisIds.map((id) => axisConfig[id]).filter((axis) => axis.position === position)
  ).map((axis, i, arr) => ({
    offset: arr
      .slice(0, i)
      .reduce(
        (acc, curr) => acc + ((curr as HeightWidth)[dimension] ?? DEFAULT_AXIS_SIZE),
        axis.offset ?? 0,
      ),
    ...axis,
    ...mergeProps(axis, slots, slotProps),
  }));
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
  const {
    topAxis: topAxisProp,
    rightAxis: rightAxisProp,
    bottomAxis: bottomAxisProp,
    leftAxis: leftAxisProp,
    slots,
    slotProps,
  } = props;
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  const top = axisIdToAxis(topAxisProp);
  const right = axisIdToAxis(rightAxisProp);
  const bottom = axisIdToAxis(bottomAxisProp);
  const left = axisIdToAxis(leftAxisProp);

  if (process.env.NODE_ENV !== 'production') {
    if (top.axisId != null && !xAxis[top.axisId]) {
      throw new Error(
        [
          `MUI X: id used for top axis "${top.axisId}" is not defined.`,
          `Available ids are: ${xAxisIds.join(', ')}.`,
        ].join('\n'),
      );
    }
    if (right.axisId != null && !yAxis[right.axisId]) {
      throw new Error(
        [
          `MUI X: id used for right axis "${right.axisId}" is not defined.`,
          `Available ids are: ${yAxisIds.join(', ')}.`,
        ].join('\n'),
      );
    }
    if (bottom.axisId != null && !xAxis[bottom.axisId]) {
      throw new Error(
        [
          `MUI X: id used for bottom axis "${bottom.axisId}" is not defined.`,
          `Available ids are: ${xAxisIds.join(', ')}.`,
        ].join('\n'),
      );
    }
    if (left.axisId != null && !yAxis[left.axisId]) {
      throw new Error(
        [
          `MUI X: id used for left axis "${left.axisId}" is not defined.`,
          `Available ids are: ${yAxisIds.join(', ')}.`,
        ].join('\n'),
      );
    }
  }

  const topAxes = formatAxis(top, xAxis, xAxisIds, 'top', slots, slotProps);
  const rightAxes = formatAxis(right, yAxis, yAxisIds, 'right', slots, slotProps);
  const bottomAxes = formatAxis(bottom, xAxis, xAxisIds, 'bottom', slots, slotProps);
  const leftAxes = formatAxis(left, yAxis, yAxisIds, 'left', slots, slotProps);

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
