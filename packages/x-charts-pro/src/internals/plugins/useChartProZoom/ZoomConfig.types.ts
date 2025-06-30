export type ZoomConfig = {
  /**
   * Defines the interactions that trigger zooming.
   * - `onWheel`: Zooms in or out when the mouse wheel is scrolled.
   * - `onPinch`: Zooms in or out when a pinch gesture is detected.
   * - `onTapAndDrag`: Zooms in or out when a tap and drag gesture is performed.
   *
   * @default ['onWheel', 'onPinch' , {type: 'onTapAndDrag', mode: 'touch'}]
   */
  zoom?: (ZoomInteraction | ZoomInteraction['type'])[];
  /**
   * Defines the interactions that trigger panning.
   * - `onDrag`: Pans the chart when dragged with the mouse.
   * - `onDoubleDrag`: Pans the chart when a double pointer drag gesture is performed.
   * - `onPressAndDrag`: Pans the chart when a press and drag gesture is performed.
   *
   * @default ['onDrag']
   */
  pan?: (PanInteraction | PanInteraction['type'])[];
};

type Entry<T extends { type: string; mode?: InteractionMode }> = {
  [K in T['type']]?: T;
};
export type DefaultizedZoomConfig = {
  zoom: Entry<ZoomInteraction>;
  pan: Entry<PanInteraction>;
};

export type ZoomInteraction = OnWheelInteraction | OnPinchInteraction | OnTapAndDragInteraction;
export type PanInteraction =
  | OnDragInteraction
  | OnDoubleDragInteraction
  | OnPressAndDragInteraction;
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
};
export type OnTapAndDragInteraction = {
  type: 'onTapAndDrag';
  mode?: InteractionMode;
};
export type OnDragInteraction = {
  type: 'onDrag';
  mode?: InteractionMode;
  /**
   * The keys that must be pressed to trigger the interaction.
   */
  keys?: AllKeys[];
};
export type OnDoubleDragInteraction = {
  type: 'onDoubleDrag';
  mode?: 'all';
};
export type OnPressAndDragInteraction = {
  type: 'onPressAndDrag';
  mode?: InteractionMode;
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
