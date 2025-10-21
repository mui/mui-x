import {
  MoveEvent,
  PanEvent,
  PanGestureOptions,
  PinchEvent,
  PinchGestureOptions,
  PressEvent,
  TapEvent,
  TurnWheelEvent,
  type PressAndDragEvent,
  type PressAndDragGestureOptions,
  type TapAndDragEvent,
  type TapAndDragGestureOptions,
  type TurnWheelGestureOptions,
} from '@mui/x-internal-gestures/core';
import { ChartPluginSignature } from '../../models';

export type ChartInteraction =
  | 'pan'
  | 'panStart'
  | 'panEnd'
  | 'zoomPan'
  | 'zoomPanStart'
  | 'zoomPanEnd'
  | 'zoomPinch'
  | 'zoomPinchStart'
  | 'zoomPinchEnd'
  | 'zoomTurnWheel'
  | 'zoomTapAndDrag'
  | 'zoomTapAndDragStart'
  | 'zoomTapAndDragEnd'
  | 'zoomPressAndDrag'
  | 'zoomPressAndDragStart'
  | 'zoomPressAndDragEnd'
  | 'move'
  | 'moveStart'
  | 'moveEnd'
  | 'tap'
  | 'quickPress'
  | 'quickPressEnd'
  | 'brush'
  | 'brushStart'
  | 'brushCancel'
  | 'brushEnd';

export type InteractionListenerResult = { cleanup: () => void };

export type AddInteractionListener = {
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction:
      | 'pan'
      | 'panStart'
      | 'panEnd'
      | 'zoomPan'
      | 'zoomPanStart'
      | 'zoomPanEnd'
      | 'brush'
      | 'brushStart'
      | 'brushCancel'
      | 'brushEnd',
    callback: (event: PanEvent<CustomData>) => void,
    options?: boolean | AddEventListenerOptions,
  ): InteractionListenerResult;
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction: 'zoomPinch' | 'zoomPinchStart' | 'zoomPinchEnd',
    callback: (event: PinchEvent<CustomData>) => void,
    options?: boolean | AddEventListenerOptions,
  ): InteractionListenerResult;
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction: 'zoomTurnWheel',
    callback: (event: TurnWheelEvent<CustomData>) => void,
    options?: boolean | AddEventListenerOptions,
  ): InteractionListenerResult;
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction: 'move' | 'moveStart' | 'moveEnd',
    callback: (event: MoveEvent<CustomData>) => void,
    options?: boolean | AddEventListenerOptions,
  ): InteractionListenerResult;
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction: 'tap',
    callback: (event: TapEvent<CustomData>) => void,
    options?: boolean | AddEventListenerOptions,
  ): InteractionListenerResult;
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction: 'quickPress' | 'quickPressEnd',
    callback: (event: PressEvent<CustomData>) => void,
    options?: boolean | AddEventListenerOptions,
  ): InteractionListenerResult;
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction: 'zoomTapAndDrag' | 'zoomTapAndDragStart' | 'zoomTapAndDragEnd',
    callback: (event: TapAndDragEvent<CustomData>) => void,
    options?: boolean | AddEventListenerOptions,
  ): InteractionListenerResult;
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction: 'zoomPressAndDrag' | 'zoomPressAndDragStart' | 'zoomPressAndDragEnd',
    callback: (event: PressAndDragEvent<CustomData>) => void,
    options?: boolean | AddEventListenerOptions,
  ): InteractionListenerResult;
};

export type UpdateZoomInteractionListeners = {
  (interaction: 'zoomPan', options?: Omit<PanGestureOptions<'zoomPan'>, 'name'>): void;
  (interaction: 'zoomPinch', options?: Omit<PinchGestureOptions<'zoomPinch'>, 'name'>): void;
  (
    interaction: 'zoomTurnWheel',
    options?: Omit<TurnWheelGestureOptions<'zoomTurnWheel'>, 'name'>,
  ): void;
  (
    interaction: 'zoomTapAndDrag',
    options?: Omit<TapAndDragGestureOptions<'zoomTapAndDrag'>, 'name'>,
  ): void;
  (
    interaction: 'zoomPressAndDrag',
    options?: Omit<PressAndDragGestureOptions<'zoomPressAndDrag'>, 'name'>,
  ): void;
};

export interface UseChartInteractionListenerParameters {}

export interface UseChartInteractionListenerState {}

export interface UseChartInteractionListenerInstance {
  /**
   * Adds an interaction listener to the SVG element.
   *
   * @param interaction The interaction to listen to.
   * @param callback The callback to call when the interaction occurs.
   */
  addInteractionListener: AddInteractionListener;
  /**
   * Updates the zoom interaction listeners with the provided options.
   *
   * @param interaction The interaction to update.
   * @param options The options to apply to the interaction.
   */
  updateZoomInteractionListeners: UpdateZoomInteractionListeners;
}

export type UseChartInteractionListenerSignature = ChartPluginSignature<{
  params: UseChartInteractionListenerParameters;
  defaultizedParams: UseChartInteractionListenerParameters;
  state: UseChartInteractionListenerState;
  instance: UseChartInteractionListenerInstance;
}>;
