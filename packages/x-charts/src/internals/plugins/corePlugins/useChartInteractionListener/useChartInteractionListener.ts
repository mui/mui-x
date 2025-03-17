'use client';
import * as React from 'react';
import {
  createUseGesture,
  dragAction,
  pinchAction,
  wheelAction,
  moveAction,
  hoverAction,
} from '@use-gesture/react';
import { ChartPlugin } from '../../models';
import {
  UseChartInteractionListenerSignature,
  AddInteractionListener,
  AddMultipleInteractionListeners,
  ChartInteraction,
  ChartInteractionHandler,
} from './useChartInteractionListener.types';

type ListenerRef = Map<ChartInteraction, Set<ChartInteractionHandler<any, any>>>;

const preventDefault = (event: Event) => event.preventDefault();

// Create our own useGesture hook with the actions we need
// Better for tree shaking
const useGesture = createUseGesture([
  dragAction,
  pinchAction,
  wheelAction,
  moveAction,
  hoverAction,
]);

export const useChartInteractionListener: ChartPlugin<UseChartInteractionListenerSignature> = ({
  svgRef,
}) => {
  const listenersRef = React.useRef<ListenerRef>(new Map());

  const retriggerEvent = React.useCallback((interaction: ChartInteraction, state: any) => {
    const listeners = listenersRef.current.get(interaction);
    const memo = !state.memo ? new Map<Function, any>() : state.memo;

    if (listeners) {
      listeners.forEach((callback) => {
        const result = callback({ ...state, memo: memo.get(callback) });
        if (result) {
          memo.set(callback, result);
        }
      });
    }

    return memo;
  }, []);

  useGesture(
    {
      onDrag: (state) => retriggerEvent('drag', state),
      onDragStart: (state) => retriggerEvent('dragStart', state),
      onDragEnd: (state) => retriggerEvent('dragEnd', state),
      onPinch: (state) => retriggerEvent('pinch', state),
      onPinchStart: (state) => retriggerEvent('pinchStart', state),
      onPinchEnd: (state) => retriggerEvent('pinchEnd', state),
      onWheel: (state) => retriggerEvent('wheel', state),
      onWheelStart: (state) => retriggerEvent('wheelStart', state),
      onWheelEnd: (state) => retriggerEvent('wheelEnd', state),
      onMove: (state) => retriggerEvent('move', state),
      onMoveStart: (state) => retriggerEvent('moveStart', state),
      onMoveEnd: (state) => retriggerEvent('moveEnd', state),
      onHover: (state) => retriggerEvent('hover', state),
    },
    {
      target: svgRef,
      eventOptions: {
        passive: false,
      },
      drag: {
        pointer: {
          // We can allow customizing the number of pointers
          buttons: 1,
          keys: false,
        },
        preventScroll: true,
      },
      pinch: {},
    },
  );

  const addInteractionListener: AddInteractionListener = React.useCallback(
    (interaction, callback) => {
      let listeners = listenersRef.current.get(interaction);

      if (!listeners) {
        listeners = new Set<ChartInteractionHandler<any, any>>();
        listeners.add(callback);
        listenersRef.current.set(interaction, listeners);
      } else {
        listeners.add(callback);
      }

      return {
        cleanup: () => listeners.delete(callback),
      };
    },
    [],
  );

  const addMultipleInteractionListeners: AddMultipleInteractionListeners = React.useCallback(
    (interactions, callback) => {
      const cleanups = interactions.map((interaction) =>
        // @ts-expect-error Overriding the type because the type of the callback is not inferred
        addInteractionListener(interaction, callback),
      );
      return {
        cleanup: () => cleanups.forEach((cleanup) => cleanup.cleanup()),
      };
    },
    [addInteractionListener],
  );

  React.useEffect(() => {
    const ref = listenersRef.current;
    const svg = svgRef.current;

    // Disable gesture on safari
    svg?.addEventListener('gesturestart', preventDefault);
    svg?.addEventListener('gesturechange', preventDefault);
    svg?.addEventListener('gestureend', preventDefault);

    return () => {
      ref.clear();
      svg?.removeEventListener('gesturestart', preventDefault);
      svg?.removeEventListener('gesturechange', preventDefault);
      svg?.removeEventListener('gestureend', preventDefault);
    };
  }, [svgRef]);

  return {
    instance: {
      addInteractionListener,
      addMultipleInteractionListeners,
    },
  };
};

useChartInteractionListener.params = {};

useChartInteractionListener.getDefaultizedParams = ({ params }) => ({
  ...params,
});

useChartInteractionListener.getInitialState = () => {
  return {};
};
