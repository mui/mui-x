import * as React from 'react';
import { AxisInteractionData, ItemInteractionData } from '../context/InteractionProvider';
import { ChartSeriesType } from '../models/seriesType/config';
import { useSvgRef } from '../hooks';

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

export function useMouseTrackerRef() {
  const svgRef = useSvgRef();

  const mousePosition = React.useRef<null | { x: number; y: number }>(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleOut = () => {
      mousePosition.current = null;
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const target = 'targetTouches' in event ? event.targetTouches[0] : event;
      mousePosition.current = {
        x: target.clientX,
        y: target.clientY,
      };
    };

    element.addEventListener('mouseout', handleOut);
    element.addEventListener('mousemove', handleMove);
    element.addEventListener('touchend', handleOut);
    element.addEventListener('touchmove', handleMove);
    return () => {
      element.removeEventListener('mouseout', handleOut);
      element.removeEventListener('mousemove', handleMove);
      element.addEventListener('touchend', handleOut);
      element.addEventListener('touchmove', handleMove);
    };
  }, [svgRef]);

  return mousePosition.current;
}

export function useMouseTracker() {
  const svgRef = useSvgRef();

  // Use a ref to avoid rerendering on every mousemove event.
  const [mousePosition, setMousePosition] = React.useState<null | { x: number; y: number }>(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleOut = () => {
      setMousePosition(null);
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const target = 'targetTouches' in event ? event.targetTouches[0] : event;
      setMousePosition({
        x: target.clientX,
        y: target.clientY,
      });
    };

    element.addEventListener('mouseout', handleOut);
    element.addEventListener('mousemove', handleMove);
    element.addEventListener('touchend', handleOut);
    element.addEventListener('touchmove', handleMove);
    return () => {
      element.removeEventListener('mouseout', handleOut);
      element.removeEventListener('mousemove', handleMove);
      element.addEventListener('touchend', handleOut);
      element.addEventListener('touchmove', handleMove);
    };
  }, [svgRef]);

  return mousePosition;
}

export type TriggerOptions = 'item' | 'axis' | 'none';

export function getTooltipHasData(
  trigger: TriggerOptions,
  displayedData: null | AxisInteractionData | ItemInteractionData<ChartSeriesType>,
): boolean {
  if (trigger === 'item') {
    return displayedData !== null;
  }

  const hasAxisXData = (displayedData as AxisInteractionData).x !== null;
  const hasAxisYData = (displayedData as AxisInteractionData).y !== null;

  return hasAxisXData || hasAxisYData;
}

export function utcFormatter(v: string | number | Date): string {
  if (v instanceof Date) {
    return v.toUTCString();
  }
  return v.toLocaleString();
}
