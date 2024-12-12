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
  discreteColorLegendClasses,
  DiscreteColorLegendClasses,
  useUtilityClasses,
} from './discreteColorLegendClasses';

export interface DiscreteColorLegendProps
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
  classes?: Partial<DiscreteColorLegendClasses>;
  className?: string;
  sx?: SxProps<Theme>;
}

const fillMark = (amount: number) =>
  Array.from({ length: amount }, (_, i) => `mark-${i}`).join(' ');

const fillEmpty = (amount: number) => Array.from({ length: amount }, (_) => `.`).join(' ');

const fillColumns = (amount: number, labelPosition: 'left' | 'right') =>
  Array.from({ length: amount }, (_, i) => {
    if (i === 0) {
      return labelPosition === 'left' ? `'max-label mark-${i}'` : `'mark-${i} max-label'`;
    }

    if (i === amount - 1) {
      return labelPosition === 'left' ? `'min-label mark-${i}'` : `'mark-${i} min-label'`;
    }

    return labelPosition === 'left' ? `'. mark-${i}'` : `'mark-${i} .'`;
  }).join(' ');

const StyledLi = styled('li', {})({});

const RootElement = styled('ul', {
  name: 'MuiDiscreteColorLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: DiscreteColorLegendProps }>(({ theme, ownerState }) => {
  const colorLength = ownerState.colors.length;

  return {
    display: 'grid',
    gap: theme.spacing(0.5),
    listStyleType: 'none',
    paddingInlineStart: 0,

    [`&.${discreteColorLegendClasses.row}`]: {
      gridTemplateRows: 'min-content min-content',
      gridTemplateColumns: `repeat(${ownerState.colors.length}, max-content)`,

      [`&.${discreteColorLegendClasses.below}, &.${discreteColorLegendClasses.left}`]: {
        gridTemplateAreas: `
          '${fillMark(colorLength)}'
          'min-label ${fillEmpty(colorLength - 2)} max-label'
        `,

        [`.${discreteColorLegendClasses.mark}:nth-of-type(2)`]: {
          justifyItems: 'end',
        },
      },

      [`&.${discreteColorLegendClasses.above}, &.${discreteColorLegendClasses.right}`]: {
        gridTemplateAreas: `
          'min-label ${fillEmpty(colorLength - 2)} max-label'
          '${fillMark(colorLength)}'
        `,

        [`.${discreteColorLegendClasses.mark}:nth-of-type(2)`]: {
          justifyItems: 'end',
        },
      },

      [`&.${discreteColorLegendClasses.extremes}`]: {
        gridTemplateAreas: `'min-label ${fillMark(colorLength)} max-label'`,
        gridTemplateRows: 'min-content',
        gridTemplateColumns: `repeat(${ownerState.colors.length + 2}, max-content)`,
      },
    },

    [`&.${discreteColorLegendClasses.column}`]: {
      gridTemplateRows: `repeat(${ownerState.colors.length}, min-content)`,
      gridTemplateColumns: 'max-content max-content',

      [`&.${discreteColorLegendClasses.below}, &.${discreteColorLegendClasses.left}`]: {
        gridTemplateAreas: fillColumns(colorLength, 'left'),

        [`.${discreteColorLegendClasses.maxLabel}, .${discreteColorLegendClasses.minLabel}`]: {
          justifySelf: 'end',
        },
      },

      [`&.${discreteColorLegendClasses.above}, &.${discreteColorLegendClasses.right}`]: {
        gridTemplateAreas: fillColumns(colorLength, 'right'),

        [`.${discreteColorLegendClasses.maxLabel}, .${discreteColorLegendClasses.minLabel}`]: {
          justifySelf: 'start',
        },
      },

      [`&.${discreteColorLegendClasses.extremes}`]: {
        gridTemplateColumns: 'max-content',
        gridTemplateRows: `repeat(${ownerState.colors.length + 2}, min-content)`,
        gridTemplateAreas: `'max-label' '${fillMark(colorLength).split(' ').join("' '")}' 'min-label'`,

        [`.${discreteColorLegendClasses.maxLabel}, .${discreteColorLegendClasses.minLabel}, .${discreteColorLegendClasses.mark}`]:
          {
            justifySelf: 'center',
          },
      },
    },

    [`.${discreteColorLegendClasses.maxLabel}`]: {
      gridArea: 'max-label',
    },
    [`.${discreteColorLegendClasses.minLabel}`]: {
      gridArea: 'min-label',
    },
  };
});

const DiscreteColorLegend = consumeThemeProps(
  'MuiDiscreteColorLegend',
  {
    defaultProps: {
      direction: 'row',
      labelPosition: 'below',
    },
    classesResolver: useUtilityClasses,
  },
  function DiscreteColorLegend(props: DiscreteColorLegendProps, ref: React.Ref<HTMLUListElement>) {
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

    const isReverse = direction === 'column';
    const startText = isReverse ? maxLabel : minLabel;
    const endText = isReverse ? minLabel : maxLabel;
    const startClass = isReverse
      ? discreteColorLegendClasses.maxLabel
      : discreteColorLegendClasses.minLabel;
    const endClass = isReverse
      ? discreteColorLegendClasses.minLabel
      : discreteColorLegendClasses.maxLabel;

    const orderedColors = isReverse ? colors.slice().reverse() : colors;

    return (
      <RootElement
        className={clsx(classes?.root, className)}
        ref={ref}
        {...other}
        ownerState={props}
      >
        <li className={startClass}>
          <ChartsLabel>{startText}</ChartsLabel>
        </li>

        {orderedColors.map((color, index) => (
          <StyledLi key={index} sx={{ gridArea: `mark-${index}` }} className={classes?.mark}>
            <ChartsLabelMark type={markType} color={color} />
          </StyledLi>
        ))}
        <li className={endClass}>
          <ChartsLabel>{endText}</ChartsLabel>
        </li>
      </RootElement>
    );
  },
);

DiscreteColorLegend.propTypes = {
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

export { DiscreteColorLegend };
