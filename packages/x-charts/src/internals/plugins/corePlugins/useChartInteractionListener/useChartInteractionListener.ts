'use client';
import * as React from 'react';
import {
  GestureManager,
  MoveGesture,
  PanGesture,
  PinchGesture,
  PressGesture,
  TapGesture,
  TurnWheelGesture,
} from '@mui/x-internal-gestures/core';
import { ChartPlugin } from '../../models';
import {
  UseChartInteractionListenerSignature,
  AddInteractionListener,
} from './useChartInteractionListener.types';

const preventDefault = (event: Event) => event.preventDefault();

export const useChartInteractionListener: ChartPlugin<UseChartInteractionListenerSignature> = ({
  svgRef,
}) => {
  React.useEffect(() => {
    const svg = svgRef.current;

    if (!svg) {
      return undefined;
    }

    const gestureManager = new GestureManager({
      gestures: [
        // We separate the zoom gestures from the gestures that are not zoom related
        // This allows us to configure the zoom gestures based on the zoom configuration.
        new PanGesture({
          name: 'pan',
          threshold: 0,
          maxPointers: 1,
        }),
        new PanGesture({
          name: 'zoomPan',
          threshold: 0,
          maxPointers: 1,
        }),
        new MoveGesture({
          name: 'move',
          preventIf: ['pan', 'zoomPinch', 'zoomPan'], // Prevent move gesture when pan is active
        }),
        new PinchGesture({
          name: 'zoomPinch',
          threshold: 5,
          preventIf: ['pan', 'zoomPan'],
        }),
        new TurnWheelGesture({
          name: 'zoomTurnWheel',
          sensitivity: 0.01,
          initialDelta: 1,
        }),
        new TapGesture({
          name: 'tap',
          maxDistance: 10,
          preventIf: ['pan', 'zoomPan', 'zoomPinch'],
        }),
        new PressGesture({
          name: 'quickPress',
          duration: 50,
          maxDistance: 10,
        }),
      ],
    });

    gestureManager.registerElement(
      ['pan', 'move', 'zoomPinch', 'zoomPan', 'zoomTurnWheel', 'tap', 'quickPress'],
      svg,
    );

    return () => {
      // Cleanup gesture manager
      gestureManager.destroy();
    };
  }, [svgRef]);

  const addInteractionListener: AddInteractionListener = React.useCallback(
    (interaction, callback, options) => {
      // Forcefully cast the svgRef to any, it is annoying to fix the types.
      const svg = svgRef.current as any;

      svg?.addEventListener(interaction, callback, options);

      return {
        cleanup: () => svg?.removeEventListener(interaction, callback),
      };
    },
    [svgRef],
  );

  React.useEffect(() => {
    const svg = svgRef.current;

    // Disable gesture on safari
    // https://use-gesture.netlify.app/docs/gestures/#about-the-pinch-gesture
    svg?.addEventListener('gesturestart', preventDefault);
    svg?.addEventListener('gesturechange', preventDefault);
    svg?.addEventListener('gestureend', preventDefault);

    return () => {
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

useChartInteractionListener.getInitialState = () => {
  return {};
};
