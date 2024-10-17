'use client';
import * as React from 'react';
import { AxisInteractionData, InteractionContext } from '../context/InteractionProvider';
import { useCartesianContext } from '../context/CartesianProvider';
import { isBandScale } from '../internals/isBandScale';
import { AxisDefaultized } from '../models/axis';
import { getSVGPoint } from '../internals/getSVGPoint';
import { useSvgRef } from './useSvgRef';
import { useDrawingArea } from './useDrawingArea';
import throttle from '../internals/throttle';

function getAsANumber(value: number | Date) {
  return value instanceof Date ? value.getTime() : value;
}

function getNewAxisState(axisConfig: AxisDefaultized, mouseValue: number) {
  const { scale, data: axisData, reverse } = axisConfig;

  if (!isBandScale(scale)) {
    const value = scale.invert(mouseValue);

    if (axisData === undefined) {
      return { value, index: -1 };
    }

    const valueAsNumber = getAsANumber(value);
    const closestIndex = axisData?.findIndex((pointValue: typeof value, index) => {
      const v = getAsANumber(pointValue);
      if (v > valueAsNumber) {
        if (
          index === 0 ||
          Math.abs(valueAsNumber - v) <= Math.abs(valueAsNumber - getAsANumber(axisData[index - 1]))
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
}

function updateAxis(
  xAxisConfig: AxisDefaultized,
  yAxisConfig: AxisDefaultized,
  svgPoint: DOMPoint,
  update: (data: AxisInteractionData) => void,
) {
  const newStateX = getNewAxisState(xAxisConfig, svgPoint.x);
  const newStateY = getNewAxisState(yAxisConfig, svgPoint.y);

  update({ x: newStateX, y: newStateY });
}

const throttledUpdateAxis = throttle(updateAxis, 166);

export const useAxisEvents = (disableAxisListener: boolean) => {
  const svgRef = useSvgRef();
  const drawingArea = useDrawingArea();
  const { xAxis, yAxis, xAxisIds, yAxisIds } = useCartesianContext();
  const { dispatch } = React.useContext(InteractionContext);

  const usedXAxis = xAxisIds[0];
  const usedYAxis = yAxisIds[0];

  // Use a ref to avoid rerendering on every mousemove event.
  const mousePosition = React.useRef<{
    isInChart: boolean;
    x: number;
    y: number;
  }>({
    isInChart: false,
    x: -1,
    y: -1,
  });

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || disableAxisListener) {
      return () => {};
    }

    const handleOut = () => {
      mousePosition.current = {
        isInChart: false,
        x: -1,
        y: -1,
      };
      throttledUpdateAxis.clear();
      dispatch({ type: 'exitChart' });
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const target = 'targetTouches' in event ? event.targetTouches[0] : event;
      const svgPoint = getSVGPoint(element, target);

      mousePosition.current.x = svgPoint.x;
      mousePosition.current.y = svgPoint.y;

      if (!drawingArea.isPointInside(svgPoint, { targetElement: event.target as SVGElement })) {
        if (mousePosition.current.isInChart) {
          dispatch({ type: 'exitChart' });
          mousePosition.current.isInChart = false;
        }
        return;
      }
      mousePosition.current.isInChart = true;

      throttledUpdateAxis(xAxis[usedXAxis], yAxis[usedYAxis], svgPoint, (data) => {
        dispatch({ type: 'updateAxis', data });
      });
    };

    const handleDown = (event: PointerEvent) => {
      const target = event.currentTarget;
      if (!target) {
        return;
      }

      if ((target as HTMLElement).hasPointerCapture(event.pointerId)) {
        (target as HTMLElement).releasePointerCapture(event.pointerId);
      }
    };

    element.addEventListener('pointerdown', handleDown);
    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerout', handleOut);
    element.addEventListener('pointercancel', handleOut);
    element.addEventListener('pointerleave', handleOut);
    return () => {
      element.removeEventListener('pointerdown', handleDown);
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerout', handleOut);
      element.removeEventListener('pointercancel', handleOut);
      element.removeEventListener('pointerleave', handleOut);
      throttledUpdateAxis.clear();
    };
  }, [svgRef, dispatch, usedYAxis, yAxis, usedXAxis, xAxis, disableAxisListener, drawingArea]);
};
