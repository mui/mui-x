'use client';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { warnOnce } from '@mui/x-internals/warning';
import { useDrawingArea, useYScale } from '../hooks';
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
  position: number;
} & Pick<CommonChartsReferenceLineProps, 'labelAlign' | 'spacing'>;

const getTextParams = ({
  left,
  width,
  spacing,
  position,
  labelAlign = 'middle',
}: GetTextPlacementParams) => {
  const defaultSpacingOtherAxis =
    labelAlign === 'middle' ? DEFAULT_SPACING_MIDDLE_OTHER_AXIS : DEFAULT_SPACING;

  const spacingX =
    (typeof spacing === 'object' ? spacing.x : defaultSpacingOtherAxis) ?? defaultSpacingOtherAxis;
  const spacingY = (typeof spacing === 'object' ? spacing.y : spacing) ?? DEFAULT_SPACING;

  switch (labelAlign) {
    case 'start':
      return {
        y: position - spacingY,
        x: left + spacingX,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'start',
        } as const,
      };

    case 'end':
      return {
        y: position - spacingY,
        x: left + width - spacingX,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'end',
        } as const,
      };

    default:
      return {
        y: position - spacingY,
        x: left + width / 2 + spacingX,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'middle',
        } as const,
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
    spacing,
    classes: inClasses,
    labelAlign = 'middle',
    lineStyle,
    labelStyle,
    axisId,
  } = props;

  const { left, width } = useDrawingArea();
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

  const textParams = {
    text: label,
    fontSize: 12,
    ...getTextParams({
      left,
      width,
      spacing,
      position: yPosition,
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
