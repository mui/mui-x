import * as React from 'react';
import { useDrawingArea, useYScale } from '../hooks';
import { CommonChartsReferenceLineProps } from './common';

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
        dominantBaseline: 'auto',
        textAnchor: 'start',
      };

    case 'end':
      return {
        x: left + width,
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

function ChartsYReferenceLine(props: ChartsYReferenceLineProps) {
  const { y, color = 'red', lineWidth = 1, label = '', labelAlign = 'middle', axisId } = props;
  const { left, width } = useDrawingArea();
  const yAxisScale = useYScale(axisId) as any;

  const yPosition = yAxisScale(y);
  const d = `M ${left} ${yPosition} l ${width} 0`;

  const textParams = {
    y: yPosition,
    ...getTextParams({
      left,
      width,
      labelAlign,
    }),
  };
  return (
    <React.Fragment>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={lineWidth}
        strokeDasharray={5}
        opacity={0.5}
      />
      <text {...textParams}>{label}</text>
    </React.Fragment>
  );
}

export default ChartsYReferenceLine;
