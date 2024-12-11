'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { AxisDefaultized, ContinuousScaleName } from '../models/axis';
import { useAxis } from './useAxis';
import { ChartsLegendPlacement } from './legend.types';
import { ColorLegendSelector } from './continuousColorLegend.types';

type LabelFormatter = (params: { value: number | Date; formattedValue: string }) => string;

export interface ContinuousColorLegendProps extends ChartsLegendPlacement, ColorLegendSelector {
  /**
   * The label to display at the minimum side of the gradient.
   * Can either be a string, or a function.
   * @default ({ formattedValue }) => formattedValue
   */
  minLabel?: string | LabelFormatter;
  /**
   * The label to display at the maximum side of the gradient.
   * Can either be a string, or a function.
   * If not defined, the formatted maximal value is display.
   * @default ({ formattedValue }) => formattedValue
   */
  maxLabel?: string | LabelFormatter;
  /**
   * A unique identifier for the gradient.
   * @default auto-generated id
   */
  id?: string;
  /**
   * The scale used to display gradient colors.
   * @default 'linear'
   */
  scaleType?: ContinuousScaleName;
}

const defaultLabelFormatter: LabelFormatter = ({ formattedValue }) => formattedValue;

function ContinuousColorLegend(props: ContinuousColorLegendProps) {
  const {
    minLabel = defaultLabelFormatter,
    maxLabel = defaultLabelFormatter,
    direction,
    axisDirection,
    axisId,
  } = props;

  const axisItem = useAxis({ axisDirection, axisId });

  const isReversed = direction === 'column';

  const colorMap = axisItem?.colorMap;
  if (!colorMap || !colorMap.type || colorMap.type !== 'continuous') {
    return null;
  }

  // Define the coordinate to color mapping

  const minValue = colorMap.min ?? 0;
  const maxValue = colorMap.max ?? 100;

  // Get texts to display

  const formattedMin =
    (axisItem as AxisDefaultized).valueFormatter?.(minValue, { location: 'legend' }) ??
    minValue.toLocaleString();

  const formattedMax =
    (axisItem as AxisDefaultized).valueFormatter?.(maxValue, { location: 'legend' }) ??
    maxValue.toLocaleString();

  const minText =
    typeof minLabel === 'string'
      ? minLabel
      : minLabel({ value: minValue ?? 0, formattedValue: formattedMin });

  const maxText =
    typeof maxLabel === 'string'
      ? maxLabel
      : maxLabel({ value: maxValue ?? 0, formattedValue: formattedMax });

  const text1 = isReversed ? maxText : minText;
  const text2 = isReversed ? minText : maxText;

  return <div />;
}

ContinuousColorLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The alignment of the texts with the gradient bar.
   * @default 'middle'
   */
  align: PropTypes.oneOf(['end', 'middle', 'start']),
  /**
   * The axis direction containing the color configuration to represent.
   * @default 'z'
   */
  axisDirection: PropTypes.oneOf(['x', 'y', 'z']),
  /**
   * The id of the axis item with the color configuration to represent.
   * @default The first axis item.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']),
  /**
   * A unique identifier for the gradient.
   * @default auto-generated id
   */
  id: PropTypes.string,
  /**
   * The style applied to labels.
   * @default theme.typography.subtitle1
   */
  labelStyle: PropTypes.object,
  /**
   * The length of the gradient bar.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the length of the svg.
   * @default '50%'
   */
  length: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The label to display at the maximum side of the gradient.
   * Can either be a string, or a function.
   * If not defined, the formatted maximal value is display.
   * @default ({ formattedValue }) => formattedValue
   */
  maxLabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * The label to display at the minimum side of the gradient.
   * Can either be a string, or a function.
   * @default ({ formattedValue }) => formattedValue
   */
  minLabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * The position of the legend.
   */
  position: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired,
  }),
  /**
   * The scale used to display gradient colors.
   * @default 'linear'
   */
  scaleType: PropTypes.oneOf(['linear', 'log', 'pow', 'sqrt', 'time', 'utc']),
  /**
   * The space between the gradient bar and the labels.
   * @default 4
   */
  spacing: PropTypes.number,
  /**
   * The thickness of the gradient bar.
   * @default 5
   */
  thickness: PropTypes.number,
} as any;

export { ContinuousColorLegend };
