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
import { ColorLegendSelector } from './colorLegend.types';
import { PiecewiseLabelFormatterParams } from './piecewiseColorLegend.types';
import { AxisDefaultized } from '../models/axis';
import { useAxis } from './useAxis';
import { PiecewiseColorLegendItemContext } from './legendContext.types';

export interface PiecewiseColorLegendProps
  extends ColorLegendSelector,
    PrependKeys<Pick<ChartsLabelMarkProps, 'type'>, 'mark'> {
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   * @default 'row'
   */
  direction?: Direction;
  /**
   * Format the legend labels.
   * @param {PiecewiseLabelFormatterParams} params The bound of the piece to format.
   * @returns {string|null} The displayed label, `''` to skip the label but show the color mark, or `null` to skip it entirely.
   */
  labelFormatter?: (params: PiecewiseLabelFormatterParams) => string | null;
  /**
   * Where to position the labels relative to the gradient.
   * The positions `'below'` and `'left'`, as well as `'above'` and `'right'` are equivalent.
   * @default 'below'
   */
  labelPosition?: 'below' | 'above' | 'extremes' | 'left' | 'right';
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The click event.
   * @param {PiecewiseColorLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    legendItem: PiecewiseColorLegendItemContext,
    index: number,
  ) => void;
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

    button: {
      // Reset button styles
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: ownerState.onItemClick ? 'pointer' : 'unset',
    },

    [`.${piecewiseColorLegendClasses.item}`]: {
      display: 'flex',
      gap: theme.spacing(0.5),
    },

    [`&.${piecewiseColorLegendClasses.row}`]: {
      alignItems: 'center',

      [`.${piecewiseColorLegendClasses.item}`]: {
        flexDirection: 'column',
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
        flexDirection: 'row',
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

function defaultLabelFormatter(params: PiecewiseLabelFormatterParams) {
  if (params.min === null) {
    return `<${params.formattedMax}`;
  }
  if (params.max === null) {
    return `>${params.formattedMin}`;
  }
  return `${params.formattedMin}-${params.formattedMax}`;
}

const PiecewiseColorLegend = consumeThemeProps(
  'MuiPiecewiseColorLegend',
  {
    defaultProps: {
      direction: 'row',
      labelPosition: 'below',
      labelFormatter: defaultLabelFormatter,
    },
    classesResolver: useUtilityClasses,
  },
  function PiecewiseColorLegend(
    props: PiecewiseColorLegendProps,
    ref: React.Ref<HTMLUListElement>,
  ) {
    const {
      direction,
      classes,
      className,
      markType,
      labelPosition,
      axisDirection,
      axisId,
      labelFormatter,
      onItemClick,
      ...other
    } = props;

    const isColumn = direction === 'column';
    const isReverse = isColumn;
    const axisItem = useAxis({ axisDirection, axisId });

    const colorMap = axisItem?.colorMap;
    if (!colorMap || !colorMap.type || colorMap.type !== 'piecewise') {
      return null;
    }
    const valueFormatter = (v: number | Date) =>
      (axisItem as AxisDefaultized).valueFormatter?.(v, { location: 'legend' }) ??
      v.toLocaleString();

    const formattedLabels = colorMap.thresholds.map(valueFormatter);

    const startClass = isReverse ? classes?.maxLabel : classes?.minLabel;
    const endClass = isReverse ? classes?.minLabel : classes?.maxLabel;

    const orderedColors = isReverse ? colorMap.colors.slice().reverse() : colorMap.colors;

    const isAbove = labelPosition === 'above' || labelPosition === 'right';
    const isBelow = labelPosition === 'below' || labelPosition === 'left';
    const isExtremes = labelPosition === 'extremes';

    return (
      <RootElement
        className={clsx(classes?.root, className)}
        ref={ref}
        {...other}
        ownerState={props}
      >
        {orderedColors.map((color, index) => {
          const isFirst = index === 0;
          const isLast = index === colorMap.colors.length - 1;

          const data = {
            index,
            length: formattedLabels.length,
            ...(isFirst
              ? { min: null, formattedMin: null }
              : { min: colorMap.thresholds[index - 1], formattedMin: formattedLabels[index - 1] }),
            ...(isLast
              ? { max: null, formattedMax: null }
              : { max: colorMap.thresholds[index], formattedMax: formattedLabels[index] }),
          };

          const label = labelFormatter?.(data);

          if (label === null || label === undefined) {
            return null;
          }

          const isTextBefore = (isColumn ? isBelow : isAbove) || (isExtremes && isFirst);
          const isTextAfter = (isColumn ? isAbove : isBelow) || (isExtremes && isLast);

          const clickObject = {
            type: 'piecewiseColor',
            color,
            label,
            minValue: data.min,
            maxValue: data.max,
          } as const;

          const Element = onItemClick ? 'button' : 'div';

          return (
            <li key={index}>
              <Element
                role={onItemClick ? 'button' : undefined}
                type={onItemClick ? 'button' : undefined}
                onClick={
                  // @ts-expect-error onClick is only attached to a button
                  onItemClick ? (event) => onItemClick(event, clickObject, index) : undefined
                }
                className={clsx(classes?.item, {
                  [`${startClass}`]: index === 0,
                  [`${endClass}`]: index === orderedColors.length - 1,
                })}
              >
                {isTextBefore && <ChartsLabel>{label}</ChartsLabel>}
                <ChartsLabelMark type={markType} color={color} />
                {isTextAfter && <ChartsLabel>{label}</ChartsLabel>}
              </Element>
            </li>
          );
        })}
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
