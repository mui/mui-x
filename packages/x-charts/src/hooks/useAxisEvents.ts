import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { SVGContext, DrawingContext } from '../context/DrawingProvider';
import { isBandScale } from '../internals/isBandScale';
import { AxisDefaultized } from '../models/axis';

function getAsANumber(value: number | Date) {
  return value instanceof Date ? value.getTime() : value;
}
export const useAxisEvents = (disableAxisListener: boolean) => {
  const svgRef = React.useContext(SVGContext);
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
      const { scale, data: axisData } = axisConfig;

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
              // @ts-ignore
              Math.abs(value - v) < Math.abs(value - getAsANumber(axisData[index + 1]))
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
      dispatch({ type: 'updateAxis', data: { x: null, y: null } });
    };

    const handleMouseMove = (event: MouseEvent) => {
      // Get mouse coordinate in global SVG space
      const pt = svgRef.current!.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      const svgPt = pt.matrixTransform(svgRef.current!.getScreenCTM()!.inverse());

      mousePosition.current = {
        x: svgPt.x,
        y: svgPt.y,
      };

      const outsideX = svgPt.x < left || svgPt.x > left + width;
      const outsideY = svgPt.y < top || svgPt.y > top + height;
      if (outsideX || outsideY) {
        dispatch({ type: 'updateAxis', data: { x: null, y: null } });
        return;
      }
      const newStateX = getUpdate(xAxis[usedXAxis], svgPt.x);
      const newStateY = getUpdate(yAxis[usedYAxis], svgPt.y);

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
