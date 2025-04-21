import {
  MoveEvent,
  PanEvent,
  PinchEvent,
  PressEvent,
  TapEvent,
  TurnWheelEvent,
} from '@web-gestures/core';
import { ChartPluginSignature } from '../../models';

export type ChartInteraction =
  | 'pan'
  | 'panStart'
  | 'panEnd'
  | 'pinch'
  | 'pinchStart'
  | 'pinchEnd'
  | 'move'
  | 'moveStart'
  | 'moveEnd'
  | 'quickPress'
  | 'quickPressEnd'
  | 'turnWheel'
  | 'tap';

export type InteractionListenerResult = { cleanup: () => void };

export type AddInteractionListener = {
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction: 'pan' | 'panStart' | 'panEnd',
    callback: (event: PanEvent<CustomData>) => void,
    options?: boolean | AddEventListenerOptions,
  ): InteractionListenerResult;
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction: 'pinch' | 'pinchStart' | 'pinchEnd',
    callback: (event: PinchEvent<CustomData>) => void,
    options?: boolean | AddEventListenerOptions,
  ): InteractionListenerResult;
  <CustomData extends Record<string, unknown> = Record<string, unknown>>(
    interaction: 'turnWheel',
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
