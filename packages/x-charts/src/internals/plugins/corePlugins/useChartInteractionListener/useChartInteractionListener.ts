'use client';
import * as React from 'react';
import { Handler, useGesture } from '@use-gesture/react';
import { ChartPlugin } from '../../models';
import {
  UseChartInteractionListenerSignature,
  AddInteractionListener,
  ChartInteraction,
} from './useChartInteractionListener.types';

type ListenerRef = Map<ChartInteraction, Set<Handler<any>>>;

const preventDefault = (event: Event) => event.preventDefault();

// TODO: use import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react'
export const useChartInteractionListener: ChartPlugin<UseChartInteractionListenerSignature> = ({
  svgRef,
}) => {
  const listenersRef = React.useRef<ListenerRef>(new Map());

  const retriggerEvent = React.useCallback((interaction: ChartInteraction, state: any) => {
    const listeners = listenersRef.current.get(interaction);
    if (listeners) {
      listeners.forEach((callback) => callback(state));
    }
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
        },
      },
      pinch: {
        scaleBounds: {
          min: 0.1,
          max: 2,
        },
        rubberband: true,
      },
    },
  );

  const addInteractionListener: AddInteractionListener = React.useCallback(
    (interaction, callback) => {
      let listeners = listenersRef.current.get(interaction);

      if (!listeners) {
        listeners = new Set<Handler<any>>();
        listeners.add(callback);
        listenersRef.current.set(interaction, listeners);
      } else {
        listeners.add(callback);
      }

      return () => {
        listeners.delete(callback);
      };
    },
    [],
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
