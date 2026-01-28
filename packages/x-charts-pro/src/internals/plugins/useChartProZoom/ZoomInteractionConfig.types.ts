import type { KeyboardKey, PointerMode } from '@mui/x-internal-gestures/core';

export type ZoomInteractionConfig = {
  /**
   * Defines the interactions that trigger zooming.
   * - `wheel`: Zooms in or out when the mouse wheel is scrolled.
   * - `pinch`: Zooms in or out when a pinch gesture is detected.
   * - `tapAndDrag`: Zooms in or out by tapping twice and then dragging vertically. Dragging up zooms in, dragging down zooms out.
   * - `brush`: Zooms into a selected area by clicking and dragging to create a selection area. (Conflicts with `drag` pan interaction)
   * - `doubleTapReset`: Resets the zoom level to the original state when double-tapping.
   *
   * @default ['wheel', 'pinch']
   */
  zoom?: readonly (ZoomInteraction | ZoomInteraction['type'])[];
  /**
   * Defines the interactions that trigger panning.
   * - `drag`: Pans the chart when dragged with the mouse.
   * - `pressAndDrag`: Pans the chart by pressing and holding, then dragging. Useful for avoiding conflicts with selection gestures.
   * - `wheel`: Pans the chart when the mouse wheel is scrolled (horizontal by default).
   *
   * @default ['drag', 'wheel']
   */
  pan?: readonly (PanInteraction | PanInteraction['type'])[];
};

type Entry<T extends AnyInteraction> = {
  [K in T['type']]?: Omit<T, 'pointerMode'> & {
    mouse: { requiredKeys?: KeyboardKey[] };
    touch: { requiredKeys?: KeyboardKey[] };
    pointerMode?: PointerMode[];
    allowedDirection?: 'x' | 'y' | 'xy';
  };
};
export type DefaultizedZoomInteractionConfig = {
  zoom: Entry<ZoomInteraction>;
  pan: Entry<PanInteraction>;
};

export type ZoomInteraction =
  | WheelInteraction
  | PinchInteraction
  | TapAndDragInteraction
  | DoubleTapResetInteraction
  | BrushInteraction;
export type PanInteraction = DragInteraction | PressAndDragInteraction | WheelPanInteraction;

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

export type TapAndDragInteraction = Unpack<
  {
    type: 'tapAndDrag';
  } & AllModeProp &
    AllKeysProp
>;

export type PressAndDragInteraction = Unpack<
  {
    type: 'pressAndDrag';
  } & AllModeProp &
    AllKeysProp
>;

export type WheelPanInteraction = Unpack<
  {
    type: 'wheel';
    /**
     * Defines which axes are affected by pan on wheel.
     * - `'x'`: Only pan horizontally
     * - `'y'`: Only pan vertically
     * - `'xy'`: Pan both axes
     * @default 'x'
     */
    allowedDirection?: 'x' | 'y' | 'xy';
  } & NoModeProp &
    AllKeysProp
>;

export type DoubleTapResetInteraction = Unpack<
  {
    type: 'doubleTapReset';
  } & AllModeProp &
    AllKeysProp
>;

export type BrushInteraction = Unpack<
  {
    type: 'brush';
  } & NoModeProp &
    NoKeysProp
>;

export type AnyInteraction = {
  type: string;
  pointerMode?: InteractionMode;
  requiredKeys?: KeyboardKey[];
  allowedDirection?: 'x' | 'y' | 'xy';
};
export type AnyEntry = Omit<AnyInteraction, 'pointerMode'> & {
  mouse: { requiredKeys?: KeyboardKey[] };
  touch: { requiredKeys?: KeyboardKey[] };
  pointerMode?: PointerMode[];
  allowedDirection?: 'x' | 'y' | 'xy';
};
