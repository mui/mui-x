/**
 * Gesture Events Library
 *
 * A centralized pointer event-based gesture recognition library
 */

// Export core classes
export { Gesture } from './Gesture';
export { GestureManager } from './GestureManager';
export { KeyboardManager, type KeyboardKey } from './KeyboardManager';
export { PointerGesture } from './PointerGesture';
export { PointerManager } from './PointerManager';

// Export gesture implementations
export { MoveGesture } from './gestures/MoveGesture';
export { PanGesture } from './gestures/PanGesture';
export { PinchGesture } from './gestures/PinchGesture';
export { PressAndDragGesture } from './gestures/PressAndDragGesture';
export { PressGesture } from './gestures/PressGesture';
export { RotateGesture } from './gestures/RotateGesture';
export { TapAndDragGesture } from './gestures/TapAndDragGesture';
export { TapGesture } from './gestures/TapGesture';
export { TurnWheelGesture } from './gestures/TurnWheelGesture';

// Export types
export type {
  GestureEventData,
  GestureOptions,
  GesturePhase,
  GestureState,
  PointerMode,
  BaseGestureOptions,
} from './Gesture';
export type { PointerGestureEventData, PointerGestureOptions } from './PointerGesture';

export type { PointerData, PointerManagerOptions } from './PointerManager';

export type { GestureManagerOptions } from './GestureManager';

export type { MoveEvent, MoveGestureEventData, MoveGestureOptions } from './gestures/MoveGesture';
export type { PanEvent, PanGestureEventData, PanGestureOptions } from './gestures/PanGesture';
export type {
  PinchEvent,
  PinchGestureEventData,
  PinchGestureOptions,
} from './gestures/PinchGesture';
export type {
  PressAndDragEvent,
  PressAndDragGestureEventData,
  PressAndDragGestureOptions,
} from './gestures/PressAndDragGesture';
export type {
  PressEvent,
  PressGestureEventData,
  PressGestureOptions,
} from './gestures/PressGesture';
export type {
  RotateEvent,
  RotateGestureEventData,
  RotateGestureOptions,
} from './gestures/RotateGesture';
export type {
  TapAndDragEvent,
  TapAndDragGestureEventData,
  TapAndDragGestureOptions,
} from './gestures/TapAndDragGesture';
export type { TapEvent, TapGestureEventData, TapGestureOptions } from './gestures/TapGesture';
export type {
  TurnWheelEvent,
  TurnWheelGestureEventData,
  TurnWheelGestureOptions,
} from './gestures/TurnWheelGesture';

export type { GestureElement } from './types/GestureElement';
export type { Direction } from './types/Direction';
