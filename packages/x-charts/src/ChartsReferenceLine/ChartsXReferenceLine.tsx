'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { warnOnce } from '@mui/x-internals/warning';
import { useDrawingArea, useXScale } from '../hooks';
import { CommonChartsReferenceLineProps, ReferenceLineRoot } from './common';
import { ChartsText } from '../ChartsText';
import {
  ChartsReferenceLineClasses,
  getReferenceLineUtilityClass,
} from './chartsReferenceLineClasses';
import { filterAttributeSafeProperties } from '../internals/filterAttributeSafeProperties';
import { useTheme } from '@mui/material/styles';

export type ChartsXReferenceLineProps<
  TValue extends string | number | Date = string | number | Date,
> = CommonChartsReferenceLineProps & {
  /**
   * The x value associated with the reference line.
   * If defined the reference line will be vertical.
   */
  x: TValue;
};

type GetTextPlacementParams = {
  top: number;
  height: number;
  spacingY: number;
} & Pick<CommonChartsReferenceLineProps, 'labelAlign'>;

const getTextParams = ({
  top,
  height,
  spacingY,
  labelAlign = 'middle',
}: GetTextPlacementParams) => {
  switch (labelAlign) {
    case 'start':
      return {
        y: top + spacingY,
        dominantBaseline: 'hanging',
        textAnchor: 'start',
      };

    case 'end':
      return {
        y: top + height - spacingY,
        dominantBaseline: 'auto',
        textAnchor: 'start',
      };

    default:
      return {
        y: top + height / 2,
        dominantBaseline: 'central',
        textAnchor: 'start',
      };
  }
};

export function getXReferenceLineClasses(classes?: Partial<ChartsReferenceLineClasses>) {
  return composeClasses(
    {
      root: ['root', 'vertical'],
      line: ['line'],
      label: ['label'],
    },
    getReferenceLineUtilityClass,
    classes,
  );
}

function ChartsXReferenceLine(props: ChartsXReferenceLineProps) {
  const {
    x,
    label = '',
    spacing = 5,
    classes: inClasses,
    labelAlign,
    lineStyle,
    labelStyle,
    axisId,
  } = props;

  const { top, height } = useDrawingArea();
  const theme = useTheme();
  const xAxisScale = useXScale(axisId);

  const xPosition = xAxisScale(x as any);

  if (xPosition === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(
        `MUI X Charts: the value ${x} does not exist in the data of x axis with id ${axisId}.`,
        'error',
      );
    }
    return null;
  }
  const d = `M ${xPosition} ${top} l 0 ${height}`;

  const classes = getXReferenceLineClasses(inClasses);

  const spacingX = typeof spacing === 'object' ? (spacing.x ?? 0) : spacing;
  const spacingY = typeof spacing === 'object' ? (spacing.y ?? 0) : spacing;

  const { y, ...other } = getTextParams({
    top,
    height,
    spacingY,
    labelAlign,
  });

  const { safe: safeLabel, unsafe: unsafeLabel } = filterAttributeSafeProperties({
    fontSize: 12,
    fill: (theme.vars || theme).palette.text.primary,
    stroke: 'none',
    pointerEvents: 'none',
    ...theme.typography.body1,
    ...other,
    ...labelStyle,
  });

  const { safe: safeLine, unsafe: unsafeLine } = filterAttributeSafeProperties({
    fill: 'none',
    stroke: (theme.vars || theme).palette.text.primary,
    shapeRendering: 'crispEdges',
    strokeWidth: 1,
    pointerEvents: 'none',
    ...lineStyle,
  });

  return (
    <ReferenceLineRoot className={classes.root}>
      <path d={d} className={classes.line} {...safeLine} style={unsafeLine} />
      <ChartsText
        x={xPosition + spacingX}
        y={y}
        text={label}
        className={classes.label}
        {...safeLabel}
        style={unsafeLabel}
      />
    </ReferenceLineRoot>
  );
}

ChartsXReferenceLine.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the axis used for the reference value.
   * @default The `id` of the first defined axis.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The label to display along the reference line.
   */
  label: PropTypes.string,
  /**
   * The alignment if the label is in the chart drawing area.
   * @default 'middle'
   */
  labelAlign: PropTypes.oneOf(['end', 'middle', 'start']),
  /**
   * The style applied to the label.
   */
  labelStyle: PropTypes.object,
  /**
   * The style applied to the line.
   */
  lineStyle: PropTypes.object,
  /**
   * Additional space around the label in px.
   * Can be a number or an object `{ x, y }` to distinguish space with the reference line and space with axes.
   * @default 5
   */
  spacing: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ]),
  /**
   * The x value associated with the reference line.
   * If defined the reference line will be vertical.
   */
  x: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
    .isRequired,
} as any;

export { ChartsXReferenceLine };
