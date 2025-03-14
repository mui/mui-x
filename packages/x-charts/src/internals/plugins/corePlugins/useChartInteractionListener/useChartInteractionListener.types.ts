import { GestureKey, Handler } from '@use-gesture/react';
import { ChartPluginSignature } from '../../models';

export type ChartInteraction =
  | 'drag'
  | 'dragStart'
  | 'dragEnd'
  | 'pinch'
  | 'pinchStart'
  | 'pinchEnd'
  | 'wheel'
  | 'wheelStart'
  | 'wheelEnd'
  | 'move'
  | 'moveStart'
  | 'moveEnd'
  | 'hover';

export type InteractionListenerResult = { cleanup: () => void };

export type AddInteractionListener = {
  (
    interaction: 'drag' | 'dragStart' | 'dragEnd',
    callback: Handler<'drag', PointerEvent>,
  ): InteractionListenerResult;
  (
    interaction: 'pinch' | 'pinchStart' | 'pinchEnd',
    callback: Handler<'pinch', PointerEvent>,
  ): InteractionListenerResult;
  (
    interaction: 'wheel' | 'wheelStart' | 'wheelEnd',
    callback: Handler<'wheel', WheelEvent>,
  ): InteractionListenerResult;
  (
    interaction: 'move' | 'moveStart' | 'moveEnd',
    callback: Handler<'move', PointerEvent>,
  ): InteractionListenerResult;
  (interaction: 'hover', callback: Handler<'hover', PointerEvent>): InteractionListenerResult;
};

type InteractionMap<T extends ChartInteraction> = T extends 'wheel' | 'wheelStart' | 'wheelEnd'
  ? WheelEvent
  : PointerEvent;

export type AddMultipleInteractionListeners = {
  <
    T extends ChartInteraction[],
    K = T,
    I extends ChartInteraction[] = T,
    D extends GestureKey = K extends (infer J)[] ? (J extends GestureKey ? J : never) : never,
    E extends ChartInteraction = I extends (infer J)[] ? J : never,
  >(
    interactions: T,
    callback: Handler<D, InteractionMap<E>>,
  ): InteractionListenerResult;
};

export interface UseChartInteractionListenerParameters {}

export type UseChartInteractionListenerDefaultizedParameters =
  UseChartInteractionListenerParameters & {};

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
   * Adds multiple interaction listeners to the SVG element.
   *
   * @param interactions The interactions to listen to.
   * @param callback The callback to call when the interaction occurs.
   */
  addMultipleInteractionListeners: AddMultipleInteractionListeners;
}

export type UseChartInteractionListenerSignature = ChartPluginSignature<{
  params: UseChartInteractionListenerParameters;
  defaultizedParams: UseChartInteractionListenerDefaultizedParameters;
  state: UseChartInteractionListenerState;
  instance: UseChartInteractionListenerInstance;
}>;
