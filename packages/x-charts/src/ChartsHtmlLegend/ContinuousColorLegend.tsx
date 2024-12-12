'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { AppendKeys } from '@mui/x-internals/types';
import { AxisDefaultized } from '../models/axis';
import { useAxis } from './useAxis';
import { ColorLegendSelector } from './continuousColorLegend.types';
import { ChartsLabel, ChartsLabelGradient, ChartsLabelGradientProps } from '../ChartsLabel';
import { Direction } from './direction';
import { consumeThemeProps } from '../internals/consumeThemeProps';
import {
  continuousColorLegendClasses,
  ContinuousColorLegendClasses,
  useUtilityClasses,
} from './continuousColorLegendClasses';

type LabelFormatter = (params: { value: number | Date; formattedValue: string }) => string;

export interface ContinuousColorLegendProps
  extends ColorLegendSelector,
    AppendKeys<Pick<ChartsLabelGradientProps, 'reverse' | 'rotate'>, 'gradient'> {
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   * @default 'row'
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
   * The `gradientId` will be used as `fill="url(#gradientId)"`.
   * @default auto-generated id
   */
  gradientId?: string;
  /**
   * Where to position the labels relative to the gradient.
   * The positions `'below'` and `'left'`, as well as `'above'` and `'right'` are equivalent.
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

const templateAreas = {
  row: {
    below: `
      'gradient  gradient gradient'
      'min-label     .    max-label'
    `,
    above: `
      'min-label     .    max-label'
      'gradient  gradient gradient'
    `,
    extremes: `
      'min-label gradient max-label'
    `,
  },
  column: {
    left: `
      'max-label gradient'
      '.         gradient'
      'min-label gradient'
    `,
    right: `
      'gradient max-label'
      'gradient         .'
      'gradient min-label'
    `,
    extremes: `
      'max-label'
      'gradient'
      'min-label'
    `,
  },
};

const RootElement = styled('ul', {
  name: 'MuiContinuousColorLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: Pick<ContinuousColorLegendProps, 'direction'> }>(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(0.5),
  listStyleType: 'none',
  paddingInlineStart: 0,

  [`&.${continuousColorLegendClasses.row}`]: {
    [`.${continuousColorLegendClasses.gradient}`]: {
      width: '100%',
    },

    gridTemplateRows: 'min-content min-content',
    gridTemplateColumns: 'min-content auto min-content',
    [`&.${continuousColorLegendClasses.below}, &.${continuousColorLegendClasses.left}`]: {
      gridTemplateAreas: templateAreas.row.below,
    },
    [`&.${continuousColorLegendClasses.above}, &.${continuousColorLegendClasses.right}`]: {
      gridTemplateAreas: templateAreas.row.above,
    },
    [`&.${continuousColorLegendClasses.extremes}`]: {
      gridTemplateAreas: templateAreas.row.extremes,
      gridTemplateRows: 'min-content',
    },
  },

  [`&.${continuousColorLegendClasses.column}`]: {
    [`.${continuousColorLegendClasses.gradient}`]: {
      height: '100%',
    },

    gridTemplateRows: 'min-content auto min-content',
    gridTemplateColumns: 'min-content min-content',
    [`&.${continuousColorLegendClasses.below}, &.${continuousColorLegendClasses.left}`]: {
      gridTemplateAreas: templateAreas.column.left,

      [`.${continuousColorLegendClasses.maxLabel}, .${continuousColorLegendClasses.minLabel}`]: {
        justifySelf: 'end',
      },
    },
    [`&.${continuousColorLegendClasses.above}, &.${continuousColorLegendClasses.right}`]: {
      gridTemplateAreas: templateAreas.column.right,

      [`.${continuousColorLegendClasses.maxLabel}, .${continuousColorLegendClasses.minLabel}`]: {
        justifySelf: 'start',
      },
    },
    [`&.${continuousColorLegendClasses.extremes}`]: {
      gridTemplateAreas: templateAreas.column.extremes,
      gridTemplateColumns: 'min-content',

      [`.${continuousColorLegendClasses.maxLabel}, .${continuousColorLegendClasses.minLabel}`]: {
        justifySelf: 'center',
      },
    },
  },

  [`.${continuousColorLegendClasses.gradient}`]: {
    gridArea: 'gradient',
  },

  [`.${continuousColorLegendClasses.maxLabel}`]: {
    gridArea: 'max-label',
  },

  [`.${continuousColorLegendClasses.minLabel}`]: {
    gridArea: 'min-label',
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

const ContinuousColorLegend = consumeThemeProps(
  'MuiContinuousColorLegend',
  {
    defaultProps: {
      direction: 'row',
      labelPosition: 'below',
    },
    classesResolver: useUtilityClasses,
  },
  function ContinuousColorLegend(
    props: ContinuousColorLegendProps,
    ref: React.Ref<HTMLUListElement>,
  ) {
    const {
      minLabel,
      maxLabel,
      direction,
      axisDirection,
      axisId,
      rotateGradient,
      reverseGradient,
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

    return (
      <RootElement
        className={clsx(classes?.root, className)}
        ref={ref}
        {...other}
        ownerState={{ direction }}
      >
        <li className={classes?.minLabel}>
          <ChartsLabel>{minText}</ChartsLabel>
        </li>
        <li className={classes?.gradient}>
          <ChartsLabelGradient
            direction={direction}
            rotate={rotateGradient}
            reverse={reverseGradient}
            // TODO: Change gradientId
            gradientId={gradientId ?? ''}
          />
        </li>
        <li className={classes?.maxLabel}>
          <ChartsLabel>{maxText}</ChartsLabel>
        </li>
      </RootElement>
    );
  },
);

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
