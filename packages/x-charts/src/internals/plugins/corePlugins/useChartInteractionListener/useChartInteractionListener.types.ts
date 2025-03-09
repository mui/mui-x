import { Handler } from '@use-gesture/react';
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

export type RemoveInteractionListener = () => void;

export type AddInteractionListener = {
  (
    interaction: 'drag' | 'dragStart' | 'dragEnd',
    callback: Handler<'drag', PointerEvent>,
  ): RemoveInteractionListener;
  (
    interaction: 'pinch' | 'pinchStart' | 'pinchEnd',
    callback: Handler<'pinch', PointerEvent>,
  ): RemoveInteractionListener;
  (
    interaction: 'wheel' | 'wheelStart' | 'wheelEnd',
    callback: Handler<'wheel', WheelEvent>,
  ): RemoveInteractionListener;
  (
    interaction: 'move' | 'moveStart' | 'moveEnd',
    callback: Handler<'move', PointerEvent>,
  ): RemoveInteractionListener;
  (interaction: 'hover', callback: Handler<'hover', PointerEvent>): RemoveInteractionListener;
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
}

export type UseChartInteractionListenerSignature = ChartPluginSignature<{
  params: UseChartInteractionListenerParameters;
  defaultizedParams: UseChartInteractionListenerDefaultizedParameters;
  state: UseChartInteractionListenerState;
  instance: UseChartInteractionListenerInstance;
}>;
