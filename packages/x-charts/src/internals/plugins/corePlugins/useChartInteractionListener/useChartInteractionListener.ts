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

  const forwardEvent = React.useCallback((interaction: ChartInteraction, state: any) => {
    const listeners = listenersRef.current.get(interaction);
    const memo = !state.memo ? new Map<Function, any>() : state.memo;
    state.interactionType = interaction;

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
      onDrag: (state) => forwardEvent('drag', state),
      onDragStart: (state) => forwardEvent('dragStart', state),
      onDragEnd: (state) => forwardEvent('dragEnd', state),
      onPinch: (state) => forwardEvent('pinch', state),
      onPinchStart: (state) => forwardEvent('pinchStart', state),
      onPinchEnd: (state) => forwardEvent('pinchEnd', state),
      onWheel: (state) => forwardEvent('wheel', state),
      onWheelStart: (state) => forwardEvent('wheelStart', state),
      onWheelEnd: (state) => forwardEvent('wheelEnd', state),
      onMove: (state) => forwardEvent('move', state),
      onMoveStart: (state) => forwardEvent('moveStart', state),
      onMoveEnd: (state) => forwardEvent('moveEnd', state),
      onHover: (state) => forwardEvent('hover', state),
      onPointerDown: (state) => forwardEvent('pointerDown', state),
      onPointerEnter: (state) => forwardEvent('pointerEnter', state),
      onPointerOver: (state) => forwardEvent('pointerOver', state),
      onPointerMove: (state) => forwardEvent('pointerMove', state),
      onPointerLeave: (state) => forwardEvent('pointerLeave', state),
      onPointerOut: (state) => forwardEvent('pointerOut', state),
      onPointerUp: (state) => forwardEvent('pointerUp', state),
    },
    {
      target: svgRef,
      drag: {
        pointer: {
          // We can allow customizing the number of pointers
          buttons: 1,
          // Disable using `setPointerCapture` when testing, as it doesn't work properly.
          capture: process.env.NODE_ENV !== 'test',
        },
      },
      pinch: {},
      wheel: {
        eventOptions: {
          passive: false,
        },
        preventDefault: true,
      },
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
    // https://use-gesture.netlify.app/docs/gestures/#about-the-pinch-gesture
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
