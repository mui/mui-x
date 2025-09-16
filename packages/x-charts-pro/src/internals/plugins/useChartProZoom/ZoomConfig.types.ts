import type { KeyboardKey, PointerMode } from '@mui/x-internal-gestures/core';

export type ZoomConfig = {
  /**
   * Defines the interactions that trigger zooming.
   * - `onWheel`: Zooms in or out when the mouse wheel is scrolled.
   * - `onPinch`: Zooms in or out when a pinch gesture is detected.
   *
   * @default ['onWheel', 'onPinch']
   */
  zoom?: (ZoomInteraction | ZoomInteraction['type'])[];
  /**
   * Defines the interactions that trigger panning.
   * - `onDrag`: Pans the chart when dragged with the mouse.
   *
   * @default ['onDrag']
   */
  pan?: (PanInteraction | PanInteraction['type'])[];
};

type Entry<T extends AnyInteraction> = {
  [K in T['type']]?: Omit<T, 'pointerMode'> & {
    mouse: { requiredKeys?: KeyboardKey[] };
    touch: { requiredKeys?: KeyboardKey[] };
    pointerMode?: PointerMode[];
  };
};
export type DefaultizedZoomConfig = {
  zoom: Entry<ZoomInteraction>;
  pan: Entry<PanInteraction>;
};

export type ZoomInteraction = OnWheelInteraction | OnPinchInteraction;
export type PanInteraction = OnDragInteraction;

export type ZoomInteractionName = ZoomInteraction['type'];
export type PanInteractionName = PanInteraction['type'];
export type InteractionMode = Exclude<PointerMode, 'pen'>;

type AllKeysProp = {
  /**
   * The keys that must be pressed to trigger the interaction.
   */
  requiredKeys?: KeyboardKey[];
};

type AllModeProp = {
  /**
   * Defines which type of pointer can trigger the interaction.
   * - `mouse`: Only mouse interactions will trigger the interaction.
   * - `touch`: Only touch interactions will trigger the interaction.
   * - undefined: All interactions will trigger the interaction.
   */
  pointerMode?: InteractionMode;
};

type NoKeysProp = {
  /**
   * This interaction does not support key combinations.
   */
  requiredKeys?: any[];
};

type NoModeProp = {
  /**
   * This gesture only works on a specific pointer mode. Mode has no effect.
   */
  pointerMode?: any;
};

type Unpack<T> = {
  [K in keyof T]: T[K] extends object ? Unpack<T[K]> : T[K];
};

export type OnWheelInteraction = Unpack<
  {
    type: 'onWheel';
  } & NoModeProp &
    AllKeysProp
>;

export type OnPinchInteraction = Unpack<
  {
    type: 'onPinch';
  } & NoModeProp &
    NoKeysProp
>;

export type OnDragInteraction = Unpack<
  {
    type: 'onDrag';
  } & AllModeProp &
    AllKeysProp
>;

export type AnyInteraction = {
  type: string;
  pointerMode?: InteractionMode;
  requiredKeys?: KeyboardKey[];
};
