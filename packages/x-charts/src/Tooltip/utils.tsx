import * as React from 'react';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from '../context/InteractionProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { isBandScale } from '../hooks/useScale';
import { SVGContext, DrawingContext } from '../context/DrawingProvider';
import type { TooltipProps } from './Tooltip';
import { ChartSeriesType } from '../models/seriesType/config';

export function generateVirtualElement(mousePosition: { x: number; y: number } | null) {
  if (mousePosition === null) {
    return {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => '',
      }),
    };
  }
  const { x, y } = mousePosition;
  return {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      x,
      y,
      top: y,
      right: x,
      bottom: y,
      left: x,
      toJSON: () =>
        JSON.stringify({ width: 0, height: 0, x, y, top: y, right: x, bottom: y, left: x }),
    }),
  };
}

export const useAxisEvents = (trigger: TooltipProps['trigger']) => {
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
    if (element === null || trigger !== 'axis') {
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
            if (index === 0 || Math.abs(value - v) < Math.abs(value - xAxisData[index - 1])) {
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
  }, [svgRef, trigger, dispatch, left, width, top, height, usedYAxis, yAxis, usedXAxis, xAxis]);
};

export function useMouseTracker() {
  const svgRef = React.useContext(SVGContext);

  // Use a ref to avoid rerendering on every mousemove event.
  const [mousePosition, setMousePosition] = React.useState<null | { x: number; y: number }>(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleMouseOut = () => {
      setMousePosition(null);
    };

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    return () => {
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [svgRef]);

  return mousePosition;
}

export function getTootipHasData(
  trigger: TooltipProps['trigger'],
  displayedData: null | AxisInteractionData | ItemInteractionData<ChartSeriesType>,
): boolean {
  if (trigger === 'item') {
    return displayedData !== null;
  }

  const hasAxisXData = (displayedData as AxisInteractionData).x !== null;
  const hasAxisYData = (displayedData as AxisInteractionData).y !== null;

  return hasAxisXData || hasAxisYData;
}
