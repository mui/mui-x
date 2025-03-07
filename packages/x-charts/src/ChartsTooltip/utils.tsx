'use client';
import * as React from 'react';
import { useChartContext } from '../context/ChartProvider';

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
  const { instance } = useChartContext();

  // Use a ref to avoid rerendering on every mousemove event.
  const [mousePosition, setMousePosition] = React.useState<MousePosition | null>(null);

  React.useEffect(() => {
    const removeOnHover = instance.addInteractionListener('hover', (state) => {
      if (state.hovering) {
        setMousePosition({
          x: state.event.clientX,
          y: state.event.clientY,
          height: state.event.height,
          pointerType: state.event.pointerType as MousePosition['pointerType'],
        });
      } else if (state.event.pointerType !== 'mouse') {
        setMousePosition(null);
      }
    });

    return () => {
      removeOnHover();
    };
  }, [instance]);

  return mousePosition;
}

type PointerType = Pick<MousePosition, 'height' | 'pointerType'>;

export function usePointerType(): null | PointerType {
  const { instance } = useChartContext();

  // Use a ref to avoid rerendering on every mousemove event.
  const [pointerType, setPointerType] = React.useState<null | PointerType>(null);

  React.useEffect(() => {
    const removeOnMoveEnd = instance.addInteractionListener('moveEnd', (state) => {
      if (state.event.pointerType !== 'mouse') {
        setPointerType(null);
      }
    });

    const removeOnMoveStart = instance.addInteractionListener('moveStart', (state) => {
      setPointerType({
        height: state.event.height,
        pointerType: state.event.pointerType as PointerType['pointerType'],
      });
    });

    return () => {
      removeOnMoveEnd();
      removeOnMoveStart();
    };
  }, [instance]);

  return pointerType;
}

export type TriggerOptions = 'item' | 'axis' | 'none';

export function utcFormatter(v: string | number | Date): string {
  if (v instanceof Date) {
    return v.toUTCString();
  }
  return v.toLocaleString();
}
