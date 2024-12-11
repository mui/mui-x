'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { AxisDefaultized } from '../models/axis';
import { useAxis } from './useAxis';
import { ColorLegendSelector } from './continuousColorLegend.types';
import { ChartsLabel, ChartsLabelGradient, ChartsLabelGradientProps } from '../ChartsLabel';
import { Direction } from './direction';
import {
  continuousColorLegendClasses,
  ContinuousColorLegendClasses,
} from './continuousColorLegendClasses';

type LabelFormatter = (params: { value: number | Date; formattedValue: string }) => string;

export interface ContinuousColorLegendProps
  extends ColorLegendSelector,
    Omit<ChartsLabelGradientProps, 'gradientId'> {
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction?: Direction;
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
   * @default auto-generated id
   */
  gradientId?: string;
  /**
   * The position of the legend.
   * @default 'below'
   */
  labelPosition?: 'below' | 'above' | 'extremes' | 'left' | 'right';
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ContinuousColorLegendClasses>;
  className?: string;
  sx?: SxProps<Theme>;
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

  [`.${continuousColorLegendClasses.gradient}`]: {
    width: '100%',
  },
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
  const {
    minLabel,
    maxLabel,
    direction,
    axisDirection,
    axisId,
    rotate,
    reverse,
    classes,
    className,
    gradientId,
    labelPosition,
    ...other
  } = props;

  const axisItem = useAxis({ axisDirection, axisId });

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

  const isReversed = direction === 'column';
  const text1 = isReversed ? maxText : minText;
  const text2 = isReversed ? minText : maxText;
  const class1 = isReversed ? classes?.maxLabel : classes?.minLabel;
  const class2 = isReversed ? classes?.minLabel : classes?.maxLabel;

  return (
    <RootElement className={clsx(classes?.root, className)} ownerState={{ direction }} {...other}>
      <li className={class1}>
        <ChartsLabel>{text1}</ChartsLabel>
      </li>
      <li className={classes?.gradient} style={{ width: '100%' }}>
        <ChartsLabelGradient
          direction={direction}
          rotate={rotate}
          reverse={reverse}
          // TODO: Change gradientId
          gradientId={gradientId ?? ''}
        />
      </li>
      <li className={class2}>
        <ChartsLabel>{text2}</ChartsLabel>
      </li>
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
   * The position of the legend.
   * @default 'below'
   */
  labelPosition: PropTypes.oneOf(['below', 'above', 'extremes']),
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
   * If `true`, the gradient will be reversed.
   */
  reverse: PropTypes.bool,
  /**
   * If provided, the gradient will be rotated by 90deg.
   *
   * Useful for linear gradients that are not in the correct orientation.
   */
  rotate: PropTypes.bool,
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
