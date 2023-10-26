import * as React from 'react';
import { useDrawingArea, useYScale } from '../hooks';
import {
  CommonChartsReferenceLineProps,
  ReferenceLineRoot,
  getReferenceLineClasses,
} from './common';
import { ChartsText } from '../internals/components/ChartsText';

export type ChartsYReferenceLineProps<
  TValue extends string | number | Date = string | number | Date,
> = CommonChartsReferenceLineProps & {
  /**
   * The y value associated to the reference line.
   * If defined the reference line will be horizontal.
   */
  y: TValue;
};

type GetTextPlacementParams = {
  left: number;
  width: number;
} & Pick<CommonChartsReferenceLineProps, 'labelAlign'>;

const getTextParams = ({ left, width, labelAlign = 'middle' }: GetTextPlacementParams) => {
  switch (labelAlign) {
    case 'start':
      return {
        x: left,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'start',
        } as const,
      };

    case 'end':
      return {
        x: left + width,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'end',
        } as const,
      };

    default:
      return {
        x: left + width / 2,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'middle',
        } as const,
      };
  }
};

function ChartsYReferenceLine(props: ChartsYReferenceLineProps) {
  const {
    y,
    label = '',
    spacing = 5,
    classes: classesProps,
    labelAlign,
    lineStyle,
    labelStyle,
    axisId,
  } = props;

  const { left, width } = useDrawingArea();
  const yAxisScale = useYScale(axisId) as any;

  const yPosition = yAxisScale(y);
  const d = `M ${left} ${yPosition} l ${width} 0`;

  const classes = getReferenceLineClasses(classesProps);

  const textParams = {
    y: yPosition - spacing,
    text: label,
    fontSize: 12,
    ...getTextParams({
      left,
      width,
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

export default ChartsYReferenceLine;
