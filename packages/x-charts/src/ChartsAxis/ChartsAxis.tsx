import * as React from 'react';
import PropTypes from 'prop-types';

import { CartesianContext } from '../context/CartesianContextProvider';
import { ChartsXAxis } from '../ChartsXAxis';
import { ChartsYAxis } from '../ChartsYAxis';
import {
  ChartsAxisSlotComponentProps,
  ChartsAxisSlotsComponent,
  ChartsXAxisProps,
  ChartsYAxisProps,
} from '../models/axis';

export interface ChartsAxisProps {
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  topAxis?: null | string | ChartsXAxisProps;
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis?: null | string | ChartsXAxisProps;
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis?: null | string | ChartsYAxisProps;
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  rightAxis?: null | string | ChartsYAxisProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsAxisSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsAxisSlotComponentProps;
}

const getAxisId = (
  propsValue: undefined | null | string | ChartsXAxisProps | ChartsYAxisProps,
): string | null => {
  if (propsValue == null) {
    return null;
  }
  if (typeof propsValue === 'object') {
    return propsValue.axisId;
  }
  return propsValue;
};

const mergeProps = (
  axisConfig: undefined | null | string | ChartsXAxisProps | ChartsYAxisProps,
  slots?: Partial<ChartsAxisSlotsComponent>,
  slotProps?: Partial<ChartsAxisSlotComponentProps>,
) => {
  return typeof axisConfig === 'object'
    ? {
        ...axisConfig,
        slots: { ...slots, ...axisConfig?.slots },
        slotProps: { ...slotProps, ...axisConfig?.slotProps },
      }
    : { slots, slotProps };
};

function ChartsAxis(props: ChartsAxisProps) {
  const { topAxis, leftAxis, rightAxis, bottomAxis, slots, slotProps } = props;
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
  const topAxisProps = mergeProps(topAxis, slots, slotProps);
  const bottomAxisProps = mergeProps(bottomAxis, slots, slotProps);
  const leftAxisProps = mergeProps(leftAxis, slots, slotProps);
  const rightAxisProps = mergeProps(rightAxis, slots, slotProps);

  return (
    <React.Fragment>
      {topId && <ChartsXAxis {...topAxisProps} position="top" axisId={topId} />}
      {bottomId && <ChartsXAxis {...bottomAxisProps} position="bottom" axisId={bottomId} />}
      {leftId && <ChartsYAxis {...leftAxisProps} position="left" axisId={leftId} />}
      {rightId && <ChartsYAxis {...rightAxisProps} position="right" axisId={rightId} />}
    </React.Fragment>
  );
}

ChartsAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
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
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
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
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
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
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
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
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickSize: PropTypes.number,
    }),
    PropTypes.string,
  ]),
} as any;

export { ChartsAxis };
