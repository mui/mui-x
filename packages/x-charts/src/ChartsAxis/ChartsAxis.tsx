'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ChartsXAxis } from '../ChartsXAxis';
import { ChartsYAxis } from '../ChartsYAxis';
import {
  AxisId,
  ChartsAxisSlotProps,
  ChartsAxisSlots,
  ChartsXAxisProps,
  ChartsYAxisProps,
} from '../models/axis';
import { useXAxes, useYAxes } from '../hooks';
import { DEFAULT_AXIS_SIZE } from '../constants';

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

const getAxisId = (
  propsValue: undefined | null | AxisId | ChartsXAxisProps | ChartsYAxisProps,
): AxisId | null => {
  if (propsValue == null) {
    return null;
  }
  if (typeof propsValue === 'object') {
    return propsValue.axisId ?? null;
  }
  return propsValue;
};

const mergeProps = (
  axisConfig: undefined | null | AxisId | ChartsXAxisProps | ChartsYAxisProps,
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

  const topId = getAxisId(topAxisProp);
  const rightId = getAxisId(rightAxisProp);
  const bottomId = getAxisId(bottomAxisProp);
  const leftId = getAxisId(leftAxisProp);

  if (process.env.NODE_ENV !== 'production') {
    if (topId !== null && !xAxis[topId]) {
      throw new Error(
        [
          `MUI X: id used for top axis "${topId}" is not defined.`,
          `Available ids are: ${xAxisIds.join(', ')}.`,
        ].join('\n'),
      );
    }
    if (rightId !== null && !yAxis[rightId]) {
      throw new Error(
        [
          `MUI X: id used for right axis "${rightId}" is not defined.`,
          `Available ids are: ${yAxisIds.join(', ')}.`,
        ].join('\n'),
      );
    }
    if (bottomId !== null && !xAxis[bottomId]) {
      throw new Error(
        [
          `MUI X: id used for bottom axis "${bottomId}" is not defined.`,
          `Available ids are: ${xAxisIds.join(', ')}.`,
        ].join('\n'),
      );
    }
    if (leftId !== null && !yAxis[leftId]) {
      throw new Error(
        [
          `MUI X: id used for left axis "${leftId}" is not defined.`,
          `Available ids are: ${yAxisIds.join(', ')}.`,
        ].join('\n'),
      );
    }
  }

  const topAxes = topId
    ? [xAxis[topId]]
    : xAxisIds.map((id) => xAxis[id]).filter((axis) => axis.position === 'top');
  const rightAxes = rightId
    ? [yAxis[rightId]]
    : yAxisIds.map((id) => yAxis[id]).filter((axis) => axis.position === 'right');
  const bottomAxes = bottomId
    ? [xAxis[bottomId]]
    : xAxisIds.map((id) => xAxis[id]).filter((axis) => axis.position === 'bottom');
  const leftAxes = leftId
    ? [yAxis[leftId]]
    : yAxisIds.map((id) => yAxis[id]).filter((axis) => axis.position === 'left');

  const completeTopAxisProps = topAxes.map((axis) => ({
    ...axis,
    ...mergeProps(axis, slots, slotProps),
  }));
  const completeRightAxisProps = rightAxes.map((axis) => ({
    ...axis,
    ...mergeProps(axis, slots, slotProps),
  }));
  const completeBottomAxisProps = (
    bottomAxes.length === 0 && !xAxis[xAxisIds[0]].position ? [xAxis[xAxisIds[0]]] : bottomAxes
  ).map((axis) => ({ ...axis, ...mergeProps(axis, slots, slotProps) }));
  const completeLeftAxisProps = (
    leftAxes.length === 0 && !yAxis[yAxisIds[0]].position ? [yAxis[yAxisIds[0]]] : leftAxes
  ).map((axis) => ({ ...axis, ...mergeProps(axis, slots, slotProps) }));

  return (
    <React.Fragment>
      {completeTopAxisProps.map((axis, i, arr) => (
        <ChartsXAxis
          key={axis.id}
          {...axis}
          position="top"
          axisId={axis.id}
          offset={arr
            .slice(0, i)
            .reduce((acc, curr) => acc + (curr.height ?? DEFAULT_AXIS_SIZE), axis.offset ?? 0)}
        />
      ))}
      {completeRightAxisProps.map((axis, i, arr) => (
        <ChartsYAxis
          key={axis.id}
          {...axis}
          position="right"
          axisId={axis.id}
          offset={arr
            .slice(0, i)
            .reduce((acc, curr) => acc + (curr.width ?? DEFAULT_AXIS_SIZE), axis.offset ?? 0)}
        />
      ))}
      {completeBottomAxisProps.map((axis, i, arr) => (
        <ChartsXAxis
          key={axis.id}
          {...axis}
          position="bottom"
          axisId={axis.id}
          offset={arr
            .slice(0, i)
            .reduce((acc, curr) => acc + (curr.height ?? DEFAULT_AXIS_SIZE), axis.offset ?? 0)}
        />
      ))}
      {completeLeftAxisProps.map((axis, i, arr) => (
        <ChartsYAxis
          key={axis.id}
          {...axis}
          position="left"
          axisId={axis.id}
          offset={arr
            .slice(0, i)
            .reduce((acc, curr) => acc + (curr.width ?? DEFAULT_AXIS_SIZE), axis.offset ?? 0)}
        />
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
