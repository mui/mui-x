import * as React from 'react';
import { useDrawingArea, useXScale, useYScale } from '../hooks';
import { CommonChartsReferenceLineProps } from './common';

export type ChartsXReferenceLineProps<TValue extends string | number | Date = string | number | Date> =
  CommonChartsReferenceLineProps & {
    /**
     * The x value associated to the reference line.
     * If defined the reference line will be vertical.
     */
    x: TValue;
  };

type GetTextPlacementParams = {
  top: number;
  height: number;
} & Pick<CommonChartsReferenceLineProps, 'labelAlign'>;

const getTextParams = ({ top, height, labelAlign = 'middle' }: GetTextPlacementParams) => {
  switch (labelAlign) {
    case 'start':
      return {
        y: top,
        dominantBaseline: 'hanging',
        textAnchor: 'start',
      };

    case 'end':
      return {
        y: top + height,
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

const ChartsXReferenceLine = (props: ChartsXReferenceLineProps) => {
  const { x, color = 'red', lineWidth = 1, label = '', labelAlign = 'middle', axisId } = props;
  let { top, height } = useDrawingArea();
  const xAxisScale = useXScale(axisId) as any;

  const xPosition = xAxisScale(x);
  const d = `M ${xPosition} ${top} l 0 ${height}`;

  const textParams = {
    x: xPosition,
    ...getTextParams({
      top,
      height,
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
};

export default ChartsXReferenceLine;
