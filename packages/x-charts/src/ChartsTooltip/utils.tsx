import * as React from 'react';
import { AxisInteractionData, ItemInteractionData } from '../context/InteractionProvider';
import { ChartSeriesType } from '../models/seriesType/config';
import { useSvgRef } from '../hooks';

type MousePosition = {
  x: number;
  y: number;
  pointerType: 'mouse' | 'touch' | 'pen';
  height: number;
};

export function generateVirtualElement(mousePosition: MousePosition | null) {
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
  const boundingBox = {
    width: 0,
    height: 0,
    x,
    y,
    top: y,
    right: x,
    bottom: y,
    left: x,
  };
  return {
    getBoundingClientRect: () => ({
      ...boundingBox,
      toJSON: () => JSON.stringify(boundingBox),
    }),
  };
}

export function useMouseTracker() {
  const svgRef = useSvgRef();

  // Use a ref to avoid rerendering on every mousemove event.
  const [mousePosition, setMousePosition] = React.useState<MousePosition | null>(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleOut = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        setMousePosition(null);
      }
    };

    const handleMove = (event: PointerEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
        height: event.height,
        pointerType: event.pointerType as MousePosition['pointerType'],
      });
    };

    element.addEventListener('pointerdown', handleMove);
    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerup', handleOut);

    return () => {
      element.removeEventListener('pointerdown', handleMove);
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerup', handleOut);
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
