import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { SVGContext, DrawingContext } from '../context/DrawingProvider';
import { isBandScale } from '../internals/isBandScale';

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

      const dataIndex =
        xScale.bandwidth() === 0
          ? Math.floor((x - xScale.range()[0] + xScale.step() / 2) / xScale.step())
          : Math.floor((x - xScale.range()[0]) / xScale.step());
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
      const newStateX = getUpdateX(svgPt.x);
      const newStateY = getUpdateY(svgPt.y);

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
