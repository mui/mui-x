'use client';
import * as React from 'react';
import { Handler, useGesture } from '@use-gesture/react';
import { ChartPlugin } from '../../models';
import {
  UseChartInteractionSignature,
  AddInteractionListener,
  ChartInteraction,
} from './useChartInteraction.types';

type ListenerRef = Map<ChartInteraction, Set<Handler<any>>>;

export const useChartInteraction: ChartPlugin<UseChartInteractionSignature> = ({ svgRef }) => {
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
    },
  );

  const addInteractionListener: AddInteractionListener = React.useCallback(
    (interaction, callback) => {
      const listeners = listenersRef.current.get(interaction);

      if (!listeners) {
        const newSet = new Set<Handler<any>>();
        newSet.add(callback);
        listenersRef.current.set(interaction, newSet);
      } else {
        listenersRef.current.set(interaction, listeners.add(callback));
      }

      return () => {
        if (listeners) {
          listeners.delete(callback);
        }
      };
    },
    [],
  );

  React.useEffect(() => {
    const ref = listenersRef.current;

    return () => {
      ref.clear();
    };
  }, [svgRef]);

  return {
    instance: {
      addInteractionListener,
    },
  };
};

useChartInteraction.params = {};

useChartInteraction.getDefaultizedParams = ({ params }) => ({
  ...params,
});

useChartInteraction.getInitialState = () => {
  return {};
};
