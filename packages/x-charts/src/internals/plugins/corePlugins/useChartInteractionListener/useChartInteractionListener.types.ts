import { EventTypes, FullGestureState, GestureKey } from '@use-gesture/react';
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
  | 'hover'
  | 'pointerDown'
  | 'pointerEnter'
  | 'pointerOver'
  | 'pointerMove'
  | 'pointerLeave'
  | 'pointerOut'
  | 'pointerUp';

export type ChartInteractionHandler<
  Memo extends any,
  Key extends GestureKey,
  EventType = EventTypes[Key],
> = (
  state: Omit<FullGestureState<Key>, 'event' | 'memo'> & {
    event: EventType;
    memo: Memo;
    interactionType: ChartInteraction;
  },
) => any | void;

export type InteractionListenerResult = { cleanup: () => void };

export type AddInteractionListener = {
  <Memo extends any>(
    interaction: 'drag' | 'dragStart' | 'dragEnd',
    callback: ChartInteractionHandler<Memo, 'drag', PointerEvent>,
  ): InteractionListenerResult;
  <Memo extends any>(
    interaction: 'pinch' | 'pinchStart' | 'pinchEnd',
    callback: ChartInteractionHandler<Memo, 'pinch', PointerEvent>,
  ): InteractionListenerResult;
  <Memo extends any>(
    interaction: 'wheel' | 'wheelStart' | 'wheelEnd',
    callback: ChartInteractionHandler<Memo, 'wheel', WheelEvent>,
  ): InteractionListenerResult;
  <Memo extends any>(
    interaction: 'move' | 'moveStart' | 'moveEnd',
    callback: ChartInteractionHandler<Memo, 'move', PointerEvent>,
  ): InteractionListenerResult;
  <Memo extends any>(
    interaction: 'hover',
    callback: ChartInteractionHandler<Memo, 'hover', PointerEvent>,
  ): InteractionListenerResult;
  <Memo extends any>(
    interaction:
      | 'pointerMove'
      | 'pointerDown'
      | 'pointerEnter'
      | 'pointerOver'
      | 'pointerLeave'
      | 'pointerOut'
      | 'pointerUp',
    callback: ChartInteractionHandler<Memo, 'move', PointerEvent>,
  ): InteractionListenerResult;
};

type InteractionMap<T extends ChartInteraction> = T extends 'wheel' | 'wheelStart' | 'wheelEnd'
  ? WheelEvent
  : PointerEvent;

export type AddMultipleInteractionListeners = {
  <
    Memo extends any = {},
    T extends ChartInteraction[] = any,
    K = T,
    I extends ChartInteraction[] = T,
    D extends GestureKey = K extends (infer J)[] ? (J extends GestureKey ? J : never) : never,
    E extends ChartInteraction = I extends (infer J)[] ? J : never,
  >(
    interactions: T,
    callback: ChartInteractionHandler<Memo, D, InteractionMap<E>>,
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
