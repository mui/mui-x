'use client';
import * as React from 'react';
import { useCartesianContext } from '../context/CartesianProvider';
import { isBandScale } from '../internals/isBandScale';
import { AxisDefaultized } from '../models/axis';
import { getSVGPoint } from '../internals/getSVGPoint';
import { useSvgRef } from './useSvgRef';
import { useDrawingArea } from './useDrawingArea';
import { useStore } from '../internals/store/useStore';

function getAsANumber(value: number | Date) {
  return value instanceof Date ? value.getTime() : value;
}
export const useAxisEvents = (disableAxisListener: boolean) => {
  const svgRef = useSvgRef();
  const drawingArea = useDrawingArea();
  const { xAxis, yAxis, xAxisIds, yAxisIds } = useCartesianContext();

  const store = useStore(disableAxisListener);

  const usedXAxis = xAxisIds[0];
  const usedYAxis = yAxisIds[0];

  // Use a ref to avoid rerendering on every mousemove event.
  const mousePosition = React.useRef({
    isInChart: false,
    x: -1,
    y: -1,
  });

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || disableAxisListener || !store) {
      return () => {};
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
    }

    const handleOut = () => {
      mousePosition.current = {
        isInChart: false,
        x: -1,
        y: -1,
      };

      store.update((prev) => ({
        ...prev,
        interaction: { item: null, axis: { x: null, y: null } },
      }));
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const target = 'targetTouches' in event ? event.targetTouches[0] : event;
      const svgPoint = getSVGPoint(element, target);

      mousePosition.current.x = svgPoint.x;
      mousePosition.current.y = svgPoint.y;

      if (!drawingArea.isPointInside(svgPoint, { targetElement: event.target as SVGElement })) {
        if (mousePosition.current.isInChart) {
          store.update((prev) => ({
            ...prev,
            interaction: { item: null, axis: { x: null, y: null } },
          }));
          mousePosition.current.isInChart = false;
        }
        return;
      }
      mousePosition.current.isInChart = true;
      const newStateX = getNewAxisState(xAxis[usedXAxis], svgPoint.x);
      const newStateY = getNewAxisState(yAxis[usedYAxis], svgPoint.y);

      store.update((prev) => ({
        ...prev,
        interaction: {
          ...prev.interaction,
          axis: {
            // A bit verbose, but prevent losing the x value if only y got modified.
            ...prev.interaction.axis,
            ...(prev.interaction.axis.x?.index !== newStateX?.index ||
            prev.interaction.axis.x?.value !== newStateX?.value
              ? { x: newStateX }
              : {}),
            ...(prev.interaction.axis.y?.index !== newStateY?.index ||
            prev.interaction.axis.y?.value !== newStateY?.value
              ? { y: newStateY }
              : {}),
          },
        },
      }));
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
    };
  }, [svgRef, store, usedYAxis, yAxis, usedXAxis, xAxis, disableAxisListener, drawingArea]);
};
