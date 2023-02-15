import * as React from 'react';
import { DEFAULT_X_AXIS_KEY } from '../const';
import { CoordinateContext } from '../context/CoordinateContext';

export interface XAxisProps {
  /**
   * Position of the axis
   */
  position?: 'top' | 'bottom';
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

type XAxisComponent = (props: XAxisProps & React.RefAttributes<SVGSVGElement>) => JSX.Element;

const XAxis = React.forwardRef(function Grid(props: XAxisProps, ref: React.Ref<SVGSVGElement>) {
  const {
    position = 'bottom',
    axisId = DEFAULT_X_AXIS_KEY,
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
    xAxis: {
      [axisId]: { scale: xScale },
    },
    drawingArea: { left, top, width, height },
  } = React.useContext(CoordinateContext) as any;

  const [min, max] = xScale.domain();
  const tickSize = disableTicks ? 4 : tickSizeProp;

  return (
    <g transform={`translate(0, ${position === 'bottom' ? top + height : top})`} ref={ref}>
      {!disableLine && (
        <line x1={xScale(min)} x2={xScale(max)} stroke={stroke} shapeRendering="crispEdges" />
      )}
      {/* {xTicks.map(({ value, offset }, index) => (
        <g key={index} transform={`translate(${offset}, 0)`}>
          {!disableTicks && <line y2={tickSize} stroke={stroke} shapeRendering="crispEdges" />}
          <text
            fill={fill}
            transform={`translate(0, ${fontSize + tickSize + 2})`}
            textAnchor="middle"
            fontSize={fontSize}
          >
            {value}
          </text>
        </g>
      ))} */}
      {label && (
        <text
          fill={fill}
          transform={`translate(${left + width / 2}, ${
            position === 'bottom' ? fontSize + tickSize + 20 : fontSize - tickSize - 20
          })`}
          fontSize={labelFontSize}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}) as XAxisComponent;

export default XAxis;
