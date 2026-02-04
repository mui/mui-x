'use client';
import * as React from 'react';
import {
  GestureManager,
  MoveGesture,
  PanGesture,
  PinchGesture,
  PressAndDragGesture,
  PressGesture,
  TapAndDragGesture,
  TapGesture,
  TurnWheelGesture,
} from '@mui/x-internal-gestures/core';
import { type ChartPlugin } from '../../models';
import {
  type UseChartInteractionListenerSignature,
  type AddInteractionListener,
  type UpdateZoomInteractionListeners,
} from './useChartInteractionListener.types';

const preventDefault = (event: Event) => event.preventDefault();

type GestureManagerTyped = GestureManager<
  string,
  | PanGesture<'pan'>
  | MoveGesture<'move'>
  | PanGesture<'zoomPan'>
  | PinchGesture<'zoomPinch'>
  | TurnWheelGesture<'zoomTurnWheel'>
  | TurnWheelGesture<'panTurnWheel'>
  | TapGesture<'tap'>
  | PressGesture<'quickPress'>
  | TapAndDragGesture<'zoomTapAndDrag'>
  | PressAndDragGesture<'zoomPressAndDrag'>
  | TapGesture<'zoomDoubleTapReset'>
  | PanGesture<'brush'>
>;

export const useChartInteractionListener: ChartPlugin<UseChartInteractionListenerSignature> = ({
  svgRef,
}) => {
  const gestureManagerRef = React.useRef<GestureManagerTyped | null>(null);

  React.useEffect(() => {
    const svg = svgRef.current;

    if (!gestureManagerRef.current) {
      gestureManagerRef.current = new GestureManager({
        gestures: [
          // We separate the zoom gestures from the gestures that are not zoom related
          // This allows us to configure the zoom gestures based on the zoom configuration.
          new PanGesture({
            name: 'pan',
            threshold: 0,
            maxPointers: 1,
          }),
          new MoveGesture({
            name: 'move',
            preventIf: ['pan', 'zoomPinch', 'zoomPan'],
          }),
          new TapGesture({
            name: 'tap',
            preventIf: ['pan', 'zoomPinch', 'zoomPan'],
          }),
          new PressGesture({
            name: 'quickPress',
            duration: 50,
          }),
          new PanGesture({
            name: 'brush',
            threshold: 0,
            maxPointers: 1,
          }),
          // Zoom gestures
          new PanGesture({
            name: 'zoomPan',
            threshold: 0,
            preventIf: ['zoomTapAndDrag', 'zoomPressAndDrag'],
          }),
          new PinchGesture({
            name: 'zoomPinch',
            threshold: 5,
          }),
          new TurnWheelGesture({
            name: 'zoomTurnWheel',
            sensitivity: 0.01,
            initialDelta: 1,
          }),
          new TurnWheelGesture({
            name: 'panTurnWheel',
            sensitivity: 0.5,
          }),
          new TapAndDragGesture({
            name: 'zoomTapAndDrag',
            dragThreshold: 10,
          }),
          new PressAndDragGesture({
            name: 'zoomPressAndDrag',
            dragThreshold: 10,
            preventIf: ['zoomPinch'],
          }),
          new TapGesture({
            name: 'zoomDoubleTapReset',
            taps: 2,
          }),
        ],
      });
    }

    // Assign gesture manager after initialization
    const gestureManager = gestureManagerRef.current;

    if (!svg || !gestureManager) {
      return undefined;
    }

    gestureManager.registerElement(
      [
        'pan',
        'move',
        'zoomPinch',
        'zoomPan',
        'zoomTurnWheel',
        'panTurnWheel',
        'tap',
        'quickPress',
        'zoomTapAndDrag',
        'zoomPressAndDrag',
        'zoomDoubleTapReset',
        'brush',
      ],
      svg,
    );

    return () => {
      // Cleanup gesture manager
      gestureManager.unregisterAllGestures(svg);
    };
  }, [svgRef, gestureManagerRef]);

  const addInteractionListener: AddInteractionListener = React.useCallback(
    (interaction, callback, options) => {
      // Forcefully cast the svgRef to any, it is annoying to fix the types.
      const svg = svgRef.current as any;

      svg?.addEventListener(interaction, callback, options);

      return {
        cleanup: () => svg?.removeEventListener(interaction, callback, options),
      };
    },
    [svgRef],
  );

  const updateZoomInteractionListeners: UpdateZoomInteractionListeners = React.useCallback(
    (interaction, options) => {
      const svg = svgRef.current;
      const gestureManager = gestureManagerRef.current;
      if (!gestureManager || !svg) {
        return;
      }

      gestureManager.setGestureOptions(interaction, svg, options ?? {});
    },
    [svgRef, gestureManagerRef],
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
      updateZoomInteractionListeners,
    },
  };
};

useChartInteractionListener.params = {};

useChartInteractionListener.getInitialState = () => {
  return {};
};
