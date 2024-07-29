import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { useDrawingArea, useXScale } from '../hooks';
import { CommonChartsReferenceLineProps, ReferenceLineRoot } from './common';
import { ChartsText } from '../ChartsText';
import {
  ChartsReferenceLineClasses,
  getReferenceLineUtilityClass,
} from './chartsReferenceLineClasses';
import { warnOnce } from '../internals/warning';

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
        style: {
          dominantBaseline: 'hanging',
          textAnchor: 'start',
        } as const,
      };

    case 'end':
      return {
        y: top + height - spacingY,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'start',
        } as const,
      };

    default:
      return {
        y: top + height / 2,
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
    spacing = 5,
    classes: inClasses,
    labelAlign,
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
        `MUI X: the value ${x} does not exist in the data of x axis with id ${axisId}.`,
        'error',
      );
    }
    return null;
  }
  const d = `M ${xPosition} ${top} l 0 ${height}`;

  const classes = getXReferenceLineClasses(inClasses);

  const spacingX = typeof spacing === 'object' ? (spacing.x ?? 0) : spacing;
  const spacingY = typeof spacing === 'object' ? (spacing.y ?? 0) : spacing;

  const textParams = {
    x: xPosition + spacingX,
    text: label,
    fontSize: 12,
    ...getTextParams({
      top,
      height,
      spacingY,
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

export { ChartsXReferenceLine };
