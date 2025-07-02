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
  [K in T['type']]?: Required<T>;
};
export type DefaultizedZoomConfig = {
  zoom: Entry<ZoomInteraction>;
  pan: Entry<PanInteraction>;
};

export type ZoomInteraction = OnWheelInteraction | OnPinchInteraction;
export type PanInteraction = OnDragInteraction;

export type ZoomInteractionName = ZoomInteraction['type'];
export type PanInteractionName = PanInteraction['type'];
export type InteractionMode = 'touch' | 'mouse' | 'all';

export type OnWheelInteraction = {
  type: 'onWheel';
  mode?: 'all';
  /**
   * The keys that must be pressed to trigger the interaction.
   */
  keys?: AllKeys[];
};
export type OnPinchInteraction = {
  type: 'onPinch';
  mode?: 'all';
  keys?: never[];
};

export type OnDragInteraction = {
  type: 'onDrag';
  mode?: InteractionMode;
  /**
   * The keys that must be pressed to trigger the interaction.
   */
  keys?: AllKeys[];
};

type AllLetters =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';
type AllMeta = 'Shift' | 'Control' | 'Alt' | 'Meta' | 'ControlOrMeta';
type AllKeys = AllLetters | AllMeta;

export type AnyInteraction = {
  type: string;
  mode?: InteractionMode;
  keys?: AllKeys[];
};
