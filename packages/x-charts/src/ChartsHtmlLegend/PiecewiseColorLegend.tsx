'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { PrependKeys } from '@mui/x-internals/types';
import { ChartsLabel, ChartsLabelMark, ChartsLabelMarkProps } from '../ChartsLabel';
import { Direction } from './direction';
import { consumeThemeProps } from '../internals/consumeThemeProps';
import {
  piecewiseColorLegendClasses,
  PiecewiseColorLegendClasses,
  useUtilityClasses,
} from './piecewiseColorLegendClasses';

export interface PiecewiseColorLegendProps
  extends PrependKeys<Pick<ChartsLabelMarkProps, 'type'>, 'mark'> {
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   * @default 'row'
   */
  direction?: Direction;
  /**
   * The label to display at the minimum side of the gradient.
   */
  minLabel: string;
  /**
   * The label to display at the maximum side of the gradient.
   */
  maxLabel: string;
  /**
   * The colors to display in the gradient.
   * The colors can be any valid CSS color string.
   * One mark is displayed for each color, in the order they are provided.
   */
  colors: string[];
  /**
   * Where to position the labels relative to the gradient.
   * The positions `'below'` and `'left'`, as well as `'above'` and `'right'` are equivalent.
   * @default 'below'
   */
  labelPosition?: 'below' | 'above' | 'extremes' | 'left' | 'right';
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PiecewiseColorLegendClasses>;
  className?: string;
  sx?: SxProps<Theme>;
}

const RootElement = styled('ul', {
  name: 'MuiPiecewiseColorLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: PiecewiseColorLegendProps }>(({ theme, ownerState }) => {
  return {
    display: 'flex',
    flexDirection: ownerState.direction ?? 'row',
    gap: theme.spacing(0.5),
    listStyleType: 'none',
    paddingInlineStart: 0,
    width: 'max-content',

    [`&.${piecewiseColorLegendClasses.row}`]: {
      alignItems: 'center',

      [`.${piecewiseColorLegendClasses.item}`]: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(0.5),
      },

      [`&.${piecewiseColorLegendClasses.below}, &.${piecewiseColorLegendClasses.left}`]: {
        alignItems: 'start',
      },

      [`&.${piecewiseColorLegendClasses.above}, &.${piecewiseColorLegendClasses.right}`]: {
        alignItems: 'end',
      },

      [`.${piecewiseColorLegendClasses.minLabel}`]: {
        alignItems: 'end',
      },

      [`&.${piecewiseColorLegendClasses.extremes}`]: {
        [`.${piecewiseColorLegendClasses.minLabel}, .${piecewiseColorLegendClasses.maxLabel}`]: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
        },
      },
    },

    [`&.${piecewiseColorLegendClasses.column}`]: {
      [`.${piecewiseColorLegendClasses.item}`]: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(0.5),
      },

      [`&.${piecewiseColorLegendClasses.below}, &.${piecewiseColorLegendClasses.left}`]: {
        alignItems: 'end',
      },

      [`&.${piecewiseColorLegendClasses.above}, &.${piecewiseColorLegendClasses.right}`]: {
        alignItems: 'start',
      },

      [`.${piecewiseColorLegendClasses.minLabel}`]: {},

      [`&.${piecewiseColorLegendClasses.extremes}`]: {
        alignItems: 'center',

        [`.${piecewiseColorLegendClasses.minLabel}, .${piecewiseColorLegendClasses.maxLabel}`]: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
  };
});

const PiecewiseColorLegend = consumeThemeProps(
  'MuiPiecewiseColorLegend',
  {
    defaultProps: {
      direction: 'row',
      labelPosition: 'below',
    },
    classesResolver: useUtilityClasses,
  },
  function PiecewiseColorLegend(
    props: PiecewiseColorLegendProps,
    ref: React.Ref<HTMLUListElement>,
  ) {
    const {
      minLabel,
      maxLabel,
      direction,
      classes,
      className,
      markType,
      labelPosition,
      colors,
      ...other
    } = props;

    const isColumn = direction === 'column';
    const isReverse = isColumn;
    const startText = isReverse ? maxLabel : minLabel;
    const endText = isReverse ? minLabel : maxLabel;
    const startClass = isReverse ? classes?.maxLabel : classes?.minLabel;
    const endClass = isReverse ? classes?.minLabel : classes?.maxLabel;

    const orderedColors = isReverse ? colors.slice().reverse() : colors;

    const isAbove = labelPosition === 'above' || labelPosition === 'right';
    const isBelow = labelPosition === 'below' || labelPosition === 'left';
    const isExtremes = labelPosition === 'extremes';

    const isStartAbove = (isColumn ? isBelow : isAbove) || isExtremes;
    const isStartBelow = isColumn ? isAbove : isBelow;
    const isEndBelow = (isColumn ? isAbove : isBelow) || isExtremes;
    const isEndAbove = isColumn ? isBelow : isAbove;

    return (
      <RootElement
        className={clsx(classes?.root, className)}
        ref={ref}
        {...other}
        ownerState={props}
      >
        {orderedColors.map((color, index) => (
          <li
            key={index}
            className={clsx(classes?.item, {
              [`${startClass}`]: index === 0,
              [`${endClass}`]: index === orderedColors.length - 1,
            })}
          >
            {index === 0 && isStartAbove && <ChartsLabel>{startText}</ChartsLabel>}
            {index === orderedColors.length - 1 && isEndAbove && (
              <ChartsLabel>{endText}</ChartsLabel>
            )}
            <ChartsLabelMark type={markType} color={color} />
            {index === 0 && isStartBelow && <ChartsLabel>{startText}</ChartsLabel>}
            {index === orderedColors.length - 1 && isEndBelow && (
              <ChartsLabel>{endText}</ChartsLabel>
            )}
          </li>
        ))}
      </RootElement>
    );
  },
);

PiecewiseColorLegend.propTypes = {
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

export { PiecewiseColorLegend };
