'use client';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { warnOnce } from '@mui/x-internals/warning';
import { useDrawingArea, useXScale } from '../hooks';
import {
  type CommonChartsReferenceLineProps,
  DEFAULT_SPACING,
  DEFAULT_SPACING_MIDDLE_OTHER_AXIS,
  ReferenceLineRoot,
} from './common';
import { ChartsText } from '../ChartsText';
import {
  type ChartsReferenceLineClasses,
  getReferenceLineUtilityClass,
} from './chartsReferenceLineClasses';

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
  position: number;
} & Pick<CommonChartsReferenceLineProps, 'labelAlign' | 'spacing'>;

const getTextParams = ({
  top,
  height,
  spacing,
  position,
  labelAlign = 'middle',
}: GetTextPlacementParams) => {
  const defaultSpacingOtherAxis =
    labelAlign === 'middle' ? DEFAULT_SPACING_MIDDLE_OTHER_AXIS : DEFAULT_SPACING;

  const spacingX = (typeof spacing === 'object' ? spacing.x : spacing) ?? DEFAULT_SPACING;
  const spacingY =
    (typeof spacing === 'object' ? spacing.y : defaultSpacingOtherAxis) ?? defaultSpacingOtherAxis;

  switch (labelAlign) {
    case 'start':
      return {
        x: position + spacingX,
        y: top + spacingY,
        style: {
          dominantBaseline: 'hanging',
          textAnchor: 'start',
        } as const,
      };

    case 'end':
      return {
        x: position + spacingX,
        y: top + height - spacingY,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'start',
        } as const,
      };

    default:
      return {
        x: position + spacingX,
        y: top + height / 2 + spacingY,
        style: {
          dominantBaseline: 'central',
          textAnchor: 'start',
        } as const,
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
    spacing,
    classes: inClasses,
    labelAlign = 'middle',
    lineStyle,
    labelStyle,
    axisId,
  } = props;

  const { top, height } = useDrawingArea();
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

  const textParams = {
    text: label,
    fontSize: 12,
    ...getTextParams({
      top,
      height,
      spacing,
      position: xPosition,
      labelAlign,
    }),
    className: classes.label,
  };

  return (
    <ReferenceLineRoot className={classes.root}>
      <path d={d} className={classes.line} style={lineStyle} />
      <ChartsText {...textParams} style={{ ...textParams.style, ...labelStyle }} />
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
