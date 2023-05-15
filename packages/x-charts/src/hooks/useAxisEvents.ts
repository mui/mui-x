import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { SVGContext, DrawingContext } from '../context/DrawingProvider';
import { isBandScale } from './useScale';

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

    const getUpdateY = (y: number) => {
      if (usedYAxis === null) {
        return null;
      }
      const { scale: yScale, data: yAxisData } = yAxis[usedYAxis];
      if (!isBandScale(yScale)) {
        return { value: yScale.invert(y) };
      }
      const dataIndex = Math.floor((y - yScale.range()[0]) / yScale.step());
      if (dataIndex < 0 || dataIndex >= yAxisData!.length) {
        return null;
      }
      return {
        index: dataIndex,
        value: yAxisData![dataIndex],
      };
    };

    const getUpdateX = (x: number) => {
      if (usedXAxis === null) {
        return null;
      }
      const { scale: xScale, data: xAxisData } = xAxis[usedXAxis];
      if (!isBandScale(xScale)) {
        const value = xScale.invert(x);

        const closestIndex = xAxisData?.findIndex((v: typeof value, index) => {
          if (v > value) {
            // @ts-ignore
            if (index === 0 || Math.abs(value - v) <= Math.abs(value - xAxisData[index - 1])) {
              return true;
            }
          }
          if (v <= value) {
            if (
              index === xAxisData.length - 1 ||
              // @ts-ignore
              Math.abs(value - v) < Math.abs(value - xAxisData[index + 1])
            ) {
              return true;
            }
          }
          return false;
        });

        return {
          value: closestIndex !== undefined && closestIndex >= 0 ? xAxisData![closestIndex] : value,
          index: closestIndex,
        };
      }
      const dataIndex = Math.floor((x - xScale.range()[0]) / xScale.step());
      if (dataIndex < 0 || dataIndex >= xAxisData!.length) {
        return null;
      }
      return {
        index: dataIndex,
        value: xAxisData![dataIndex],
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
      mousePosition.current = {
        x: event.offsetX,
        y: event.offsetY,
      };
      const outsideX = event.offsetX < left || event.offsetX > left + width;
      const outsideY = event.offsetY < top || event.offsetY > top + height;
      if (outsideX || outsideY) {
        dispatch({ type: 'updateAxis', data: { x: null, y: null } });
        return;
      }
      const newStateX = getUpdateX(event.offsetX);
      const newStateY = getUpdateY(event.offsetY);

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
