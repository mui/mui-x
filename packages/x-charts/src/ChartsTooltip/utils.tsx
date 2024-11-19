import * as React from 'react';
import { AxisInteractionData, ItemInteractionData } from '../internals/plugins/models';
import { ChartSeriesType } from '../models/seriesType/config';
import { useSvgRef } from '../hooks';

type MousePosition = {
  x: number;
  y: number;
  pointerType: 'mouse' | 'touch' | 'pen';
  height: number;
};

export type UseMouseTrackerReturnValue = null | MousePosition;

/**
 * @deprecated We recommend using vanilla JS to let popper track mouse position.
 */
export function useMouseTracker(): UseMouseTrackerReturnValue {
  const svgRef = useSvgRef();

  // Use a ref to avoid rerendering on every mousemove event.
  const [mousePosition, setMousePosition] = React.useState<MousePosition | null>(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const controller = new AbortController();

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

    element.addEventListener('pointerdown', handleMove, { signal: controller.signal });
    element.addEventListener('pointermove', handleMove, { signal: controller.signal });
    element.addEventListener('pointerup', handleOut, { signal: controller.signal });

    return () => {
      // Calling `.abort()` removes ALL event listeners
      // For more info, see https://kettanaito.com/blog/dont-sleep-on-abort-controller
      controller.abort();
    };
  }, [svgRef]);

  return mousePosition;
}

type PointerType = Pick<MousePosition, 'height' | 'pointerType'>;

export function usePointerType(): null | PointerType {
  const svgRef = useSvgRef();

  // Use a ref to avoid rerendering on every mousemove event.
  const [pointerType, setPointerType] = React.useState<null | PointerType>(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleOut = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        setPointerType(null);
      }
    };

    const handleEnter = (event: PointerEvent) => {
      setPointerType({
        height: event.height,
        pointerType: event.pointerType as PointerType['pointerType'],
      });
    };

    element.addEventListener('pointerenter', handleEnter);
    element.addEventListener('pointerup', handleOut);

    return () => {
      element.removeEventListener('pointerenter', handleEnter);
      element.removeEventListener('pointerup', handleOut);
    };
  }, [svgRef]);

  return pointerType;
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
