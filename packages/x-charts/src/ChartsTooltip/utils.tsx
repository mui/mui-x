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
      }
    });
    const removeOnDrag = instance.addInteractionListener('drag', (state) => {
      setMousePosition({
        x: state.event.clientX,
        y: state.event.clientY,
        height: state.event.height,
        pointerType: state.event.pointerType as MousePosition['pointerType'],
      });
    });

    return () => {
      removeOnHover();
      removeOnDrag();
    };
  }, [instance]);

  return mousePosition;
}

type PointerType = Pick<MousePosition, 'height' | 'pointerType'>;

export function usePointerType(): null | PointerType {
  const { instance } = useChartContext();

  const [pointerType, setPointerType] = React.useState<null | PointerType>(null);

  React.useEffect(() => {
    const removeOnDragEnd = instance.addInteractionListener('dragEnd', () => {
      // TODO: We can check and only close when it is not a tap with `!state.tap`
      // This would allow users to click/tap on the chart to display the tooltip.
      setPointerType(null);
    });

    const [removeOnMoveStart, removeOnDragStart] = ['moveStart', 'dragStart'].map((interaction) => {
      return instance.addInteractionListener(interaction as 'dragStart', (state) => {
        setPointerType({
          height: state.event.height,
          pointerType: state.event.pointerType as PointerType['pointerType'],
        });
      });
    });

    return () => {
      removeOnMoveStart();
      removeOnDragEnd();
      removeOnDragStart();
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
