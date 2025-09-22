import type { KeyboardKey, PointerMode } from '@mui/x-internal-gestures/core';

export type ZoomInteractionConfig = {
  /**
   * Defines the interactions that trigger zooming.
   * - `wheel`: Zooms in or out when the mouse wheel is scrolled.
   * - `pinch`: Zooms in or out when a pinch gesture is detected.
   *
   * @default ['wheel', 'pinch']
   */
  zoom?: (ZoomInteraction | ZoomInteraction['type'])[];
  /**
   * Defines the interactions that trigger panning.
   * - `drag`: Pans the chart when dragged with the mouse.
   *
   * @default ['drag']
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
export type DefaultizedZoomInteractionConfig = {
  zoom: Entry<ZoomInteraction>;
  pan: Entry<PanInteraction>;
};

export type ZoomInteraction = WheelInteraction | PinchInteraction;
export type PanInteraction = DragInteraction;

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

export type WheelInteraction = Unpack<
  {
    type: 'wheel';
  } & NoModeProp &
    AllKeysProp
>;

export type PinchInteraction = Unpack<
  {
    type: 'pinch';
  } & NoModeProp &
    NoKeysProp
>;

export type DragInteraction = Unpack<
  {
    type: 'drag';
  } & AllModeProp &
    AllKeysProp
>;

export type AnyInteraction = {
  type: string;
  pointerMode?: InteractionMode;
  requiredKeys?: KeyboardKey[];
};
export type AnyEntry = Omit<AnyInteraction, 'pointerMode'> & {
  mouse: { requiredKeys?: KeyboardKey[] };
  touch: { requiredKeys?: KeyboardKey[] };
  pointerMode?: PointerMode[];
};
