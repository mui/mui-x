import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { SvgContext, DrawingContext } from '../context/DrawingProvider';
import { isBandScale } from '../internals/isBandScale';
import { AxisDefaultized } from '../models/axis';
import { getSVGPoint } from '../internals/utils';

function getAsANumber(value: number | Date) {
  return value instanceof Date ? value.getTime() : value;
}
export const useAxisEvents = (disableAxisListener: boolean) => {
  const svgRef = React.useContext(SvgContext);
  const { width, height, top, left } = React.useContext(DrawingContext);
  const { xAxis, yAxis, xAxisIds, yAxisIds } = React.useContext(CartesianContext);
  const { dispatch } = React.useContext(InteractionContext);

  const usedXAxis = xAxisIds[0];
  const usedYAxis = yAxisIds[0];

  // Use a ref to avoid rerendering on every mousemove event.
  const mousePosition = React.useRef({
    x: -1,
    y: -1,
  });

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || disableAxisListener) {
      return () => {};
    }

    const getUpdate = (axisConfig: AxisDefaultized, mouseValue: number) => {
      if (usedXAxis === null) {
        return null;
      }
      const { scale, data: axisData, reverse } = axisConfig;

      if (!isBandScale(scale)) {
        const value = scale.invert(mouseValue);

        if (axisData === undefined) {
          return { value };
        }

        const valueAsNumber = getAsANumber(value);
        const closestIndex = axisData?.findIndex((pointValue: typeof value, index) => {
          const v = getAsANumber(pointValue);
          if (v > valueAsNumber) {
            if (
              index === 0 ||
              Math.abs(valueAsNumber - v) <=
                Math.abs(valueAsNumber - getAsANumber(axisData[index - 1]))
            ) {
              return true;
            }
          }
          if (v <= valueAsNumber) {
            if (
              index === axisData.length - 1 ||
              Math.abs(getAsANumber(value) - v) <
                Math.abs(getAsANumber(value) - getAsANumber(axisData[index + 1]))
            ) {
              return true;
            }
          }
          return false;
        });

        return {
          value: closestIndex !== undefined && closestIndex >= 0 ? axisData![closestIndex] : value,
          index: closestIndex,
        };
      }

      const dataIndex =
        scale.bandwidth() === 0
          ? Math.floor((mouseValue - Math.min(...scale.range()) + scale.step() / 2) / scale.step())
          : Math.floor((mouseValue - Math.min(...scale.range())) / scale.step());

      if (dataIndex < 0 || dataIndex >= axisData!.length) {
        return null;
      }
      if (reverse) {
        const reverseIndex = axisData!.length - 1 - dataIndex;
        return {
          index: reverseIndex,
          value: axisData![reverseIndex],
        };
      }
      return {
        index: dataIndex,
        value: axisData![dataIndex],
      };
    };

    const handleMouseOut = () => {
      mousePosition.current = {
        x: -1,
        y: -1,
      };
      dispatch({ type: 'exitChart' });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const svgPoint = getSVGPoint(svgRef.current!, event);

      mousePosition.current = {
        x: svgPoint.x,
        y: svgPoint.y,
      };

      const outsideX = svgPoint.x < left || svgPoint.x > left + width;
      const outsideY = svgPoint.y < top || svgPoint.y > top + height;
      if (outsideX || outsideY) {
        dispatch({ type: 'exitChart' });
        return;
      }
      const newStateX = getUpdate(xAxis[usedXAxis], svgPoint.x);
      const newStateY = getUpdate(yAxis[usedYAxis], svgPoint.y);

      dispatch({ type: 'updateAxis', data: { x: newStateX, y: newStateY } });
    };

    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    return () => {
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    svgRef,
    dispatch,
    left,
    width,
    top,
    height,
    usedYAxis,
    yAxis,
    usedXAxis,
    xAxis,
    disableAxisListener,
  ]);
};
