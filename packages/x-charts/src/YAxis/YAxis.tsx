import * as React from 'react';
import { DEFAULT_Y_AXIS_KEY } from '../const';
import { CoordinateContext } from '../context/CoordinateContext';
import useTicks from '../hooks/useTicks';

export interface YAxisProps {
  /**
   * Position of the axis
   */
  position?: 'left' | 'right';
  /**
   * Id of the axis to render
   */
  axisId?: string;
  /**
   * If true, the axia line is disabled.
   * @default false
   */
  disableLine?: boolean;
  /**
   * If true, the ticks are disabled.
   * @default false
   */
  disableTicks?: boolean;
  /**
   * The fill color of the axis text.
   * @default 'currentColor'
   */
  fill?: string;
  /**
   * The font size of the axis text.
   * @default 12
   */
  fontSize?: number;
  /**
   * The label of the axis.
   */
  label?: string;
  /**
   * The font size of the axis label.
   * @default 14
   */
  labelFontSize?: number;
  /**
   * The stroke color of the axis line.
   * @default 'currentColor'
   */
  stroke?: string;
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize?: number;
}

type YAxisComponent = (props: YAxisProps & React.RefAttributes<SVGSVGElement>) => JSX.Element;

const YAxis = React.forwardRef(function Grid(props: YAxisProps, ref: React.Ref<SVGSVGElement>) {
  const {
    position = 'left',
    axisId = DEFAULT_Y_AXIS_KEY,
    disableLine = false,
    disableTicks = false,
    fill = 'currentColor',
    fontSize = 10,
    label,
    labelFontSize = 14,
    stroke = 'currentColor',
    tickSize: tickSizeProp = 6,
  } = props;

  const {
    yAxis: {
      [axisId]: { scale: yScale },
    },
    drawingArea: { left, top, width, height },
  } = React.useContext(CoordinateContext) as any;

  const [min, max] = yScale.domain();
  const tickSize = disableTicks ? 4 : tickSizeProp;

  const yTicks = useTicks({ scale: yScale });

  const positionSigne = position === 'right' ? 1 : -1;
  return (
    <g transform={`translate(${position === 'right' ? left + width : left}, 0)`} ref={ref}>
      {!disableLine && (
        <line y1={yScale(min)} y2={yScale(max)} stroke={stroke} shapeRendering="crispEdges" />
      )}
      {yTicks.map(({ value, offset }, index) => (
        <g key={index} transform={`translate(0, ${offset})`}>
          {!disableTicks && (
            <line x2={positionSigne * tickSize} stroke={stroke} shapeRendering="crispEdges" />
          )}
          <text
            fill={fill}
            transform={`translate(${positionSigne * (fontSize + tickSize + 2)}, 0)`}
            textAnchor="middle"
            fontSize={fontSize}
          >
            {value}
          </text>
        </g>
      ))}
      {label && (
        <text
          fill={fill}
          style={{}}
          transform={`translate(${positionSigne * (fontSize + tickSize + 20)}, ${
            top + height / 2
          }) rotate(${positionSigne * 90})`}
          fontSize={labelFontSize}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}) as YAxisComponent;

export default YAxis;
