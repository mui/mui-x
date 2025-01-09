'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { AppendKeys } from '@mui/x-internals/types';
import { AxisDefaultized } from '../models/axis';
import { useAxis } from './useAxis';
import { ColorLegendSelector } from './colorLegend.types';
import { ChartsLabel } from '../ChartsLabel/ChartsLabel';
import { ChartsLabelGradient, ChartsLabelGradientProps } from '../ChartsLabel/ChartsLabelGradient';
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
    AppendKeys<Pick<ChartsLabelGradientProps, 'rotate'>, 'gradient'>,
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
   * If `true`, the gradient and labels will be reversed.
   * @default false
   */
  reverse?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ContinuousColorLegendClasses>;
  className?: string;
  sx?: SxProps<Theme>;
}

const templateAreas = (reverse?: boolean) => {
  const startLabel = reverse ? 'max-label' : 'min-label';
  const endLabel = reverse ? 'min-label' : 'max-label';

  return {
    row: {
      start: `
    '${startLabel} . ${endLabel}'
    'gradient gradient gradient'
  `,
      end: `
      'gradient gradient gradient'
      '${startLabel} . ${endLabel}'
    `,
      extremes: `
      '${startLabel} gradient ${endLabel}'
    `,
    },
    column: {
      start: `
      '${endLabel} gradient'
      '. gradient'
      '${startLabel} gradient'
    `,
      end: `
      'gradient ${endLabel}'
      'gradient .'
      'gradient ${startLabel}'
    `,
      extremes: `
      '${endLabel}'
      'gradient'
      '${startLabel}'
    `,
    },
  };
};

const RootElement = styled('ul', {
  name: 'MuiContinuousColorLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ContinuousColorLegendProps }>(({ theme, ownerState }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.primary,
  lineHeight: '100%',
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
      gridTemplateAreas: templateAreas(ownerState.reverse).row.start,
    },
    [`&.${continuousColorLegendClasses.end}`]: {
      gridTemplateAreas: templateAreas(ownerState.reverse).row.end,
    },
    [`&.${continuousColorLegendClasses.extremes}`]: {
      gridTemplateAreas: templateAreas(ownerState.reverse).row.extremes,
      gridTemplateRows: 'min-content',
      alignItems: 'center',
    },
  },
  [`&.${continuousColorLegendClasses.vertical}`]: {
    gridTemplateRows: 'min-content auto min-content',
    gridTemplateColumns: 'min-content min-content',
    [`&.${continuousColorLegendClasses.start}`]: {
      gridTemplateAreas: templateAreas(ownerState.reverse).column.start,
      [`.${continuousColorLegendClasses.maxLabel}, .${continuousColorLegendClasses.minLabel}`]: {
        justifySelf: 'end',
      },
    },
    [`&.${continuousColorLegendClasses.end}`]: {
      gridTemplateAreas: templateAreas(ownerState.reverse).column.end,
      [`.${continuousColorLegendClasses.maxLabel}, .${continuousColorLegendClasses.minLabel}`]: {
        justifySelf: 'start',
      },
    },
    [`&.${continuousColorLegendClasses.extremes}`]: {
      gridTemplateAreas: templateAreas(ownerState.reverse).column.extremes,
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
      reverse,
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

    const minComponent = (
      <li className={classes?.minLabel}>
        <ChartsLabel className={classes?.label}>{minText}</ChartsLabel>
      </li>
    );

    const maxComponent = (
      <li className={classes?.maxLabel}>
        <ChartsLabel className={classes?.label}>{maxText}</ChartsLabel>
      </li>
    );

    return (
      <RootElement
        className={clsx(classes?.root, className)}
        ref={ref}
        {...other}
        ownerState={props}
      >
        {reverse ? maxComponent : minComponent}
        <li className={classes?.gradient}>
          <ChartsLabelGradient
            direction={direction}
            rotate={rotateGradient}
            reverse={reverse}
            thickness={thickness}
            gradientId={gradientId ?? generateGradientId(axisItem.id, axisDirection!)}
          />
        </li>
        {reverse ? minComponent : maxComponent}
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
   * If `true`, the gradient and labels will be reversed.
   * @default false
   */
  reverse: PropTypes.bool,
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
