'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { warnOnce } from '@mui/x-internals/warning';
import { useTheme } from '@mui/material/styles';
import { useDrawingArea, useYScale } from '../hooks';
import { CommonChartsReferenceLineProps, ReferenceLineRoot } from './common';
import { ChartsText } from '../ChartsText';
import {
  ChartsReferenceLineClasses,
  getReferenceLineUtilityClass,
} from './chartsReferenceLineClasses';
import { filterAttributeSafeProperties } from '../internals/filterAttributeSafeProperties';

export type ChartsYReferenceLineProps<
  TValue extends string | number | Date = string | number | Date,
> = CommonChartsReferenceLineProps & {
  /**
   * The y value associated with the reference line.
   * If defined the reference line will be horizontal.
   */
  y: TValue;
};

type GetTextPlacementParams = {
  left: number;
  width: number;
  spacingX: number;
} & Pick<CommonChartsReferenceLineProps, 'labelAlign'>;

const getTextParams = ({
  left,
  width,
  spacingX,
  labelAlign = 'middle',
}: GetTextPlacementParams) => {
  switch (labelAlign) {
    case 'start':
      return {
        x: left + spacingX,
        dominantBaseline: 'auto',
        textAnchor: 'start',
      };

    case 'end':
      return {
        x: left + width - spacingX,
        dominantBaseline: 'auto',
        textAnchor: 'end',
      };

    default:
      return {
        x: left + width / 2,
        dominantBaseline: 'auto',
        textAnchor: 'middle',
      };
  }
};

export function getYReferenceLineClasses(classes?: Partial<ChartsReferenceLineClasses>) {
  return composeClasses(
    {
      root: ['root', 'horizontal'],
      line: ['line'],
      label: ['label'],
    },
    getReferenceLineUtilityClass,
    classes,
  );
}

function ChartsYReferenceLine(props: ChartsYReferenceLineProps) {
  const {
    y,
    label = '',
    spacing = 5,
    classes: inClasses,
    labelAlign,
    lineStyle,
    labelStyle,
    axisId,
  } = props;

  const { left, width } = useDrawingArea();
  const theme = useTheme();
  const yAxisScale = useYScale(axisId);

  const yPosition = yAxisScale(y as any);

  if (yPosition === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(
        `MUI X Charts: the value ${y} does not exist in the data of y axis with id ${axisId}.`,
        'error',
      );
    }
    return null;
  }

  const d = `M ${left} ${yPosition} l ${width} 0`;

  const classes = getYReferenceLineClasses(inClasses);

  const spacingX = typeof spacing === 'object' ? (spacing.x ?? 0) : spacing;
  const spacingY = typeof spacing === 'object' ? (spacing.y ?? 0) : spacing;

  const { x, ...other } = getTextParams({
    left,
    width,
    spacingX,
    labelAlign,
  });

  const { safe: safeLabel, unsafe: unsafeLabel } = filterAttributeSafeProperties({
    fontSize: 12,
    fill: (theme.vars || theme).palette.text.primary,
    stroke: 'none',
    pointerEvents: 'none',
    ...theme.typography.body1,
    ...labelStyle,
    ...other,
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
        x={x}
        y={yPosition - spacingY}
        text={label}
        className={classes.label}
        {...safeLabel}
        style={unsafeLabel}
      />
    </ReferenceLineRoot>
  );
}

ChartsYReferenceLine.propTypes = {
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
   * The y value associated with the reference line.
   * If defined the reference line will be horizontal.
   */
  y: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
    .isRequired,
} as any;

export { ChartsYReferenceLine };
