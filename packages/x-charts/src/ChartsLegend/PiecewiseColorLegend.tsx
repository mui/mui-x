'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, type SxProps, type Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { type PrependKeys } from '@mui/x-internals/types';
import { ChartsLabel } from '../ChartsLabel/ChartsLabel';
import { ChartsLabelMark, type ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';
import { type Direction } from './direction';
import { consumeThemeProps } from '../internals/consumeThemeProps';
import {
  piecewiseColorLegendClasses,
  type PiecewiseColorLegendClasses,
  useUtilityClasses,
} from './piecewiseColorLegendClasses';
import { type ColorLegendSelector } from './colorLegend.types';
import { type PiecewiseLabelFormatterParams } from './piecewiseColorLegend.types';
import { type ComputedAxis } from '../models/axis';
import { useAxis } from './useAxis';
import { type PiecewiseColorLegendItemContext } from './legendContext.types';
import { piecewiseColorDefaultLabelFormatter } from './piecewiseColorDefaultLabelFormatter';

export interface PiecewiseColorLegendProps
  extends ColorLegendSelector, PrependKeys<Pick<ChartsLabelMarkProps, 'type'>, 'mark'> {
  /**
   * The direction of the legend layout.
   * @default 'horizontal'
   */
  direction?: Direction;
  /**
   * Format the legend labels.
   * @param {PiecewiseLabelFormatterParams} params The bound of the piece to format.
   * @returns {string|null} The displayed label, `''` to skip the label but show the color mark, or `null` to skip it entirely.
   */
  labelFormatter?: (params: PiecewiseLabelFormatterParams) => string | null;
  /**
   * Where to position the labels relative to the color marks.
   * @default 'extremes'
   */
  labelPosition?: 'start' | 'end' | 'extremes' | 'inline-start' | 'inline-end';
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
  tabIndex?: number;
}

const RootElement = styled('ul', {
  name: 'MuiPiecewiseColorLegend',
  slot: 'Root',
})<{ ownerState: PiecewiseColorLegendProps }>(({ theme, ownerState }) => {
  const classes = piecewiseColorLegendClasses;
  return {
    ...theme.typography.caption,
    color: (theme.vars || theme).palette.text.primary,
    lineHeight: '100%',
    display: 'flex',
    flexDirection: ownerState.direction === 'vertical' ? 'column' : 'row',
    flexShrink: 0,
    gap: theme.spacing(0.5),
    listStyleType: 'none',
    paddingInlineStart: 0,
    marginBlock: theme.spacing(1),
    marginInline: theme.spacing(1),
    width: 'fit-content',
    gridArea: 'legend',
    [`button.${classes.item}`]: {
      // Reset button styles
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: ownerState.onItemClick ? 'pointer' : 'unset',
      fontFamily: 'inherit',
      fontWeight: 'inherit',
      fontSize: 'inherit',
      letterSpacing: 'inherit',
      color: 'inherit',
    },
    [`.${classes.item}`]: {
      display: 'flex',
      gap: theme.spacing(0.5),
    },
    [`li :not(.${classes.minLabel}, .${classes.maxLabel}) .${classes?.mark}`]: {
      alignSelf: 'center',
    },
    [`&.${classes.start}`]: {
      alignItems: 'end',
    },
    [`&.${classes.end}`]: {
      alignItems: 'start',
    },
    [`&.${classes.horizontal}`]: {
      alignItems: 'center',
      [`.${classes.item}`]: {
        flexDirection: 'column',
      },
      [`&.${classes.inlineStart}, &.${classes.inlineEnd}`]: {
        gap: theme.spacing(1.5),
        flexWrap: 'wrap',
        [`.${classes.item}`]: {
          flexDirection: 'row',
        },
      },
      [`&.${classes.start}`]: {
        alignItems: 'end',
      },
      [`&.${classes.end}`]: {
        alignItems: 'start',
      },
      [`.${classes.minLabel}`]: {
        alignItems: 'end',
      },
      [`&.${classes.extremes}`]: {
        [`.${classes.minLabel}, .${classes.maxLabel}`]: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
        },
      },
    },
    [`&.${classes.vertical}`]: {
      [`.${classes.item}`]: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      [`&.${classes.start}, &.${classes.inlineStart}`]: {
        alignItems: 'end',
      },
      [`&.${classes.end}, &.${classes.inlineEnd}`]: {
        alignItems: 'start',
      },
      [`&.${classes.extremes}`]: {
        alignItems: 'center',
        [`.${classes.minLabel}, .${classes.maxLabel}`]: {
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
      direction: 'horizontal',
      labelPosition: 'extremes',
      labelFormatter: piecewiseColorDefaultLabelFormatter,
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

    const isVertical = direction === 'vertical';
    const isReverse = isVertical;
    const axisItem = useAxis({ axisDirection, axisId });

    const colorMap = axisItem?.colorMap;
    if (!colorMap || !colorMap.type || colorMap.type !== 'piecewise') {
      return null;
    }
    const valueFormatter = (v: number | Date) =>
      (axisItem as ComputedAxis).valueFormatter?.(v, {
        location: 'legend',
      }) ?? v.toLocaleString();

    const formattedLabels = colorMap.thresholds.map(valueFormatter);

    const startClass = isReverse ? classes?.maxLabel : classes?.minLabel;
    const endClass = isReverse ? classes?.minLabel : classes?.maxLabel;

    const colors = colorMap.colors.map((color, colorIndex) => ({
      color,
      colorIndex,
    }));
    const orderedColors = isReverse ? colors.reverse() : colors;

    const isStart = labelPosition === 'start';
    const isEnd = labelPosition === 'end';
    const isExtremes = labelPosition === 'extremes';
    const isInlineStart = labelPosition === 'inline-start';
    const isInlineEnd = labelPosition === 'inline-end';

    return (
      <RootElement
        className={clsx(classes?.root, className)}
        ref={ref}
        {...other}
        ownerState={props}
      >
        {orderedColors.map(({ color, colorIndex }, index) => {
          const isFirst = index === 0;
          const isLast = index === colorMap.colors.length - 1;
          const isFirstColor = colorIndex === 0;
          const isLastColor = colorIndex === colorMap.colors.length - 1;

          const data = {
            index: colorIndex,
            length: formattedLabels.length,
            ...(isFirstColor
              ? { min: null, formattedMin: null }
              : {
                  min: colorMap.thresholds[colorIndex - 1],
                  formattedMin: formattedLabels[colorIndex - 1],
                }),
            ...(isLastColor
              ? { max: null, formattedMax: null }
              : {
                  max: colorMap.thresholds[colorIndex],
                  formattedMax: formattedLabels[colorIndex],
                }),
          };

          const label = labelFormatter?.(data);

          if (label === null || label === undefined) {
            return null;
          }

          const isTextBefore = isStart || (isExtremes && isFirst) || isInlineStart;
          const isTextAfter = isEnd || (isExtremes && isLast) || isInlineEnd;

          const clickObject = {
            type: 'piecewiseColor',
            color,
            label,
            minValue: data.min,
            maxValue: data.max,
          } as const;

          const Element = onItemClick ? 'button' : 'div';

          return (
            <li key={colorIndex}>
              <Element
                role={onItemClick ? 'button' : undefined}
                type={onItemClick ? 'button' : undefined}
                onClick={
                  // @ts-ignore onClick is only attached to a button
                  onItemClick ? (event) => onItemClick(event, clickObject, index) : undefined
                }
                className={clsx(classes?.item, {
                  [`${startClass}`]: index === 0,
                  [`${endClass}`]: index === orderedColors.length - 1,
                })}
              >
                {isTextBefore && <ChartsLabel className={classes?.label}>{label}</ChartsLabel>}
                <ChartsLabelMark className={classes?.mark} type={markType} color={color} />
                {isTextAfter && <ChartsLabel className={classes?.label}>{label}</ChartsLabel>}
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
   * Format the legend labels.
   * @param {PiecewiseLabelFormatterParams} params The bound of the piece to format.
   * @returns {string|null} The displayed label, `''` to skip the label but show the color mark, or `null` to skip it entirely.
   */
  labelFormatter: PropTypes.func,
  /**
   * Where to position the labels relative to the gradient.
   * @default 'extremes'
   */
  labelPosition: PropTypes.oneOf(['start', 'end', 'extremes', 'inline-start', 'inline-end']),
  /**
   * The type of the mark.
   * @default 'square'
   */
  markType: PropTypes.oneOf(['square', 'circle', 'line']),
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The click event.
   * @param {PiecewiseColorLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick: PropTypes.func,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { PiecewiseColorLegend };
