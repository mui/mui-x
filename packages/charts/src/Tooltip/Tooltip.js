import React, { useContext } from 'react';
import ChartContext from '../ChartContext';

const isInRange = (num, target, range) => {
  const result = num >= Math.max(0, target - range) && num <= target + range;
  return result;
};
const Tooltip = (props) => {
  const {
    dimensions: { boundedWidth, boundedHeight },
    mousePosition,
    xTicks,
  } = useContext(ChartContext);
  const {
    fill = 'none',
    stroke = 'rgba(200, 200, 200, 0.8)',
    strokeWidth = 1,
    strokeDasharray = '0',
  } = props;
  // If the mouse is close to a vertical line, return true
  const isHighlighted = (offset) =>
    isInRange(mousePosition.x, offset, (xTicks[1].offset - xTicks[0].offset) / 2);

  return (
    <g>
      <rect width={boundedWidth} height={boundedHeight} fill={fill} />
      <g transform={`translate(0, ${boundedHeight})`}>
        {xTicks.map(
          ({ offset }, index) =>
            isHighlighted(offset) && (
              <g key={index} transform={`translate(${offset}, 0)`}>
                <line
                  y2={-boundedHeight}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  shapeRendering="crispEdges"
                />
              </g>
            ),
        )}
      </g>
    </g>
  );
};

export default Tooltip;
