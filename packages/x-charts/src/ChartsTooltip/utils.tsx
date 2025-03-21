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
    // Drag event is triggered by mobile touch or mouse drag.
    const positionOnDragHandler = instance.addInteractionListener('pointerMove', (state) => {
      setMousePosition({
        x: state.event.clientX,
        y: state.event.clientY,
        height: state.event.height,
        pointerType: state.event.pointerType as MousePosition['pointerType'],
      });
    });

    return () => {
      positionOnDragHandler.cleanup();
    };
  }, [instance]);

  return mousePosition;
}

type PointerType = Pick<MousePosition, 'height' | 'pointerType'>;

export function usePointerType(): null | PointerType {
  const { instance } = useChartContext();

  const [pointerType, setPointerType] = React.useState<null | PointerType>(null);

  React.useEffect(() => {
    const removePointerHandler = instance.addInteractionListener('dragEnd', (state) => {
      // TODO: We can check and only close when it is not a tap with `!state.tap`
      // This would allow users to click/tap on the chart to display the tooltip.

      // Only close the tooltip on mobile, which doesn't trigger a hover event.
      if (!state.hovering) {
        setPointerType(null);
      }
    });

    // Move is mouse, Drag is both mouse and touch.
    const setPointerHandler = instance.addMultipleInteractionListeners(
      ['move', 'drag'],
      (state) => {
        // @ts-expect-error tap doesn't exist on move.
        if (!state.first && !state.tap) {
          setPointerType({
            height: state.event.height,
            pointerType: state.event.pointerType as PointerType['pointerType'],
          });
        }
      },
    );

    return () => {
      removePointerHandler.cleanup();
      setPointerHandler.cleanup();
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
