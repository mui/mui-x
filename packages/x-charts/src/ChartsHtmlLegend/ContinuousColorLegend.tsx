'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { AxisDefaultized } from '../models/axis';
import { useAxis } from './useAxis';
import { ChartsLegendPlacement } from './legend.types';
import { ColorLegendSelector } from './continuousColorLegend.types';
import { ChartsLabel, ChartsLabelGradient } from '../ChartsLabel';

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
   *
   * The `gradientId` will be used as `fill="url(#gradientId)"`.
   *
   * @default auto-generated id
   */
  gradientId?: string;
}

const RootElement = styled('ul', {
  name: 'MuiChartsLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: Pick<ContinuousColorLegendProps, 'direction'> }>(({ ownerState, theme }) => ({
  display: 'flex',
  flexDirection: ownerState.direction ?? 'row',
  alignItems: ownerState.direction === 'row' ? 'center' : undefined,
  gap: theme.spacing(2),
  listStyleType: 'none',
  paddingInlineStart: 0,
  flexWrap: 'wrap',
}));

const getText = (
  label: string | LabelFormatter | undefined,
  value: number | Date,
  formattedValue: string,
) => {
  if (typeof label === 'string') {
    return label;
  }
  return label?.({ value, formattedValue }) ?? formattedValue;
};

function ContinuousColorLegend(props: ContinuousColorLegendProps) {
  const { minLabel, maxLabel, direction, axisDirection, axisId } = props;

  const axisItem = useAxis({ axisDirection, axisId });

  const isReversed = direction === 'column';

  const colorMap = axisItem?.colorMap;
  if (!colorMap || !colorMap.type || colorMap.type !== 'continuous') {
    return null;
  }

  const minValue = colorMap.min ?? 0;
  const maxValue = colorMap.max ?? 100;

  // Get texts to display

  const valueFormatter = (axisItem as AxisDefaultized)?.valueFormatter;
  const formattedMin = valueFormatter
    ? valueFormatter(minValue, { location: 'legend' })
    : minValue.toLocaleString();

  const formattedMax = valueFormatter
    ? valueFormatter(maxValue, { location: 'legend' })
    : maxValue.toLocaleString();

  const minText = getText(minLabel, minValue, formattedMin);
  const maxText = getText(maxLabel, maxValue, formattedMax);

  const text1 = isReversed ? maxText : minText;
  const text2 = isReversed ? minText : maxText;

  return (
    <RootElement ownerState={{ direction }}>
      <ChartsLabel>{text1}</ChartsLabel>
      {/* TODO: Change gradientid */}
      <ChartsLabelGradient direction={direction} gradientId={props.gradientId ?? ''} />
      <ChartsLabel>{text2}</ChartsLabel>
    </RootElement>
  );
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
