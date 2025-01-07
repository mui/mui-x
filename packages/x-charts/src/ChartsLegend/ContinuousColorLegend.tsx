'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { AppendKeys } from '@mui/x-internals/types';
import { AxisDefaultized } from '../models/axis';
import { useAxis } from './useAxis';
import { ColorLegendSelector } from './colorLegend.types';
import { ChartsLabel, ChartsLabelGradient, ChartsLabelGradientProps } from '../ChartsLabel';
import { Direction } from './direction';
import { consumeThemeProps } from '../internals/consumeThemeProps';
import {
  continuousColorLegendClasses,
  ContinuousColorLegendClasses,
  useUtilityClasses,
} from './continuousColorLegendClasses';
import { useChartGradientObjectBound } from '../internals/components/ChartsAxesGradients';

type LabelFormatter = (params: { value: number | Date; formattedValue: string }) => string;

export interface ContinuousColorLegendProps
  extends ColorLegendSelector,
    AppendKeys<Pick<ChartsLabelGradientProps, 'reverse' | 'rotate'>, 'gradient'>,
    Pick<ChartsLabelGradientProps, 'thickness'> {
  /**
   * The direction of the legend layout.
   * @default 'horizontal'
   */
  direction?: Direction;
  /**
   * The label to display at the minimum side of the gradient.
   * Can either be a string, or a function.
   * @default formattedValue
   */
  minLabel?: string | LabelFormatter;
  /**
   * The label to display at the maximum side of the gradient.
   * Can either be a string, or a function.
   * If not defined, the formatted maximal value is display.
   * @default formattedValue
   */
  maxLabel?: string | LabelFormatter;
  /**
   * The id for the gradient to use.
   * If not provided, it will use the generated gradient from the axis configuration.
   * The `gradientId` will be used as `fill="url(#gradientId)"`.
   * @default auto-generated id
   */
  gradientId?: string;
  /**
   * Where to position the labels relative to the gradient.
   * @default 'end'
   */
  labelPosition?: 'start' | 'end' | 'extremes';
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ContinuousColorLegendClasses>;
  className?: string;
  sx?: SxProps<Theme>;
}

const templateAreas = {
  row: {
    start: `
    'min-label . max-label'
    'gradient gradient gradient'
  `,
    end: `
      'gradient gradient gradient'
      'min-label . max-label'
    `,
    extremes: `
      'min-label gradient max-label'
    `,
  },
  column: {
    start: `
      'max-label gradient'
      '. gradient'
      'min-label gradient'
    `,
    end: `
      'gradient max-label'
      'gradient .'
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
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.primary,
  lineHeight: undefined,
  display: 'grid',
  flexShrink: 0,
  gap: theme.spacing(0.5),
  listStyleType: 'none',
  paddingInlineStart: 0,
  marginBlock: theme.spacing(1),
  marginInline: theme.spacing(1),
  [`&.${continuousColorLegendClasses.horizontal}`]: {
    gridTemplateRows: 'min-content min-content',
    gridTemplateColumns: 'min-content auto min-content',
    [`&.${continuousColorLegendClasses.start}`]: {
      gridTemplateAreas: templateAreas.row.start,
    },
    [`&.${continuousColorLegendClasses.end}`]: {
      gridTemplateAreas: templateAreas.row.end,
    },
    [`&.${continuousColorLegendClasses.extremes}`]: {
      gridTemplateAreas: templateAreas.row.extremes,
      gridTemplateRows: 'min-content',
    },
  },
  [`&.${continuousColorLegendClasses.vertical}`]: {
    gridTemplateRows: 'min-content auto min-content',
    gridTemplateColumns: 'min-content min-content',
    height: '100%',
    [`&.${continuousColorLegendClasses.start}`]: {
      gridTemplateAreas: templateAreas.column.start,
      [`.${continuousColorLegendClasses.maxLabel}, .${continuousColorLegendClasses.minLabel}`]: {
        justifySelf: 'end',
      },
    },
    [`&.${continuousColorLegendClasses.end}`]: {
      gridTemplateAreas: templateAreas.column.end,
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
      direction: 'horizontal',
      labelPosition: 'end',
      axisDirection: 'z',
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
      thickness,
      ...other
    } = props;

    const generateGradientId = useChartGradientObjectBound();
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
          <ChartsLabel className={classes?.label}>{minText}</ChartsLabel>
        </li>
        <li className={classes?.gradient}>
          <ChartsLabelGradient
            direction={direction}
            rotate={rotateGradient}
            reverse={reverseGradient}
            thickness={thickness}
            gradientId={gradientId ?? generateGradientId(axisItem.id, axisDirection!)}
          />
        </li>
        <li className={classes?.maxLabel}>
          <ChartsLabel className={classes?.label}>{maxText}</ChartsLabel>
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
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * The direction of the legend layout.
   * @default 'horizontal'
   */
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * The id for the gradient to use.
   * If not provided, it will use the generated gradient from the axis configuration.
   * The `gradientId` will be used as `fill="url(#gradientId)"`.
   * @default auto-generated id
   */
  gradientId: PropTypes.string,
  /**
   * Where to position the labels relative to the gradient.
   * @default 'end'
   */
  labelPosition: PropTypes.oneOf(['start', 'end', 'extremes']),
  /**
   * The label to display at the maximum side of the gradient.
   * Can either be a string, or a function.
   * If not defined, the formatted maximal value is display.
   * @default formattedValue
   */
  maxLabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * The label to display at the minimum side of the gradient.
   * Can either be a string, or a function.
   * @default formattedValue
   */
  minLabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * If `true`, the gradient will be reversed.
   */
  reverseGradient: PropTypes.bool,
  /**
   * If provided, the gradient will be rotated by 90deg.
   * Useful for linear gradients that are not in the correct orientation.
   */
  rotateGradient: PropTypes.bool,
  /**
   * The thickness of the gradient
   * @default 12
   */
  thickness: PropTypes.number,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ContinuousColorLegend };
