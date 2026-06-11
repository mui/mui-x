'use client';
import * as React from 'react';
import { type ChartPlugin } from '@mui/x-charts/internals';
import {
  PanGesture,
  PinchGesture,
  PressAndDragGesture,
  TapAndDragGesture,
  TapGesture,
  TurnWheelGesture,
} from '@mui/x-internal-gestures/core';
import { type UseChartProZoomSignature } from '../useChartProZoom.types';

/**
 * Registers the gestures required by the zoom feature.
 * They are registered here instead of in the core interaction listener plugin
 * so their implementations are only bundled with the zoom plugin.
 */
export const useRegisterZoomGestures = ({
  instance,
}: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'instance'>) => {
  React.useEffect(() => {
    instance.registerGestures([
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
        passive: false,
      }),
      new TurnWheelGesture({
        name: 'panTurnWheel',
        sensitivity: 0.5,
        passive: false,
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
    ]);
  }, [instance]);
};
