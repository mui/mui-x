import { pan } from './gestures/PanUserGesture';
import { PanUserGestureOptions, PanUserGestureRoot } from './gestures/PanUserGesture.types';
import { pinch } from './gestures/PinchUserGesture';
import { PinchUserGestureOptions, PinchUserGestureRoot } from './gestures/PinchUserGesture.types';
import { press } from './gestures/PressUserGesture';
import { PressUserGestureOptions, PressUserGestureRoot } from './gestures/PressUserGesture.types';
import { rotate } from './gestures/RotateUserGesture';
import {
  RotateUserGestureOptions,
  RotateUserGestureRoot,
} from './gestures/RotateUserGesture.types';
import { tap } from './gestures/TapUserGesture';
import { TapUserGestureOptions, TapUserGestureRoot } from './gestures/TapUserGesture.types';
import { UserGesture, UserGestureOptions } from './UserGesture';
import { createProxy } from './utils/createProxy';

/**
 * Used for providing a custom touch gesture.
 */
 
export interface TouchUserGestureRootExtension {}

/**
 * Defines the touch gestures.
 * It includes a setup method to initialize global options.
 */
export type TouchUserGestureRoot = {
  setup: (options: UserGestureOptions) => TouchUserGestureRoot;
} & TapUserGestureRoot<'touch'> &
  PressUserGestureRoot<'touch'> &
  PinchUserGestureRoot &
  PanUserGestureRoot &
  RotateUserGestureRoot &
  TouchUserGestureRootExtension;

class TouchUserGesture extends UserGesture implements TouchUserGestureRoot {
  constructor() {
    super('touch');
  }

  async tap(options: TapUserGestureOptions<'touch'>): Promise<void> {
    return tap(this.pointerManager, options, this.advanceTimers);
  }

  async press(options: PressUserGestureOptions<'touch'>): Promise<void> {
    return press(this.pointerManager, options, this.advanceTimers);
  }

  async pinch(options: PinchUserGestureOptions): Promise<void> {
    return pinch(this.pointerManager, options, this.advanceTimers);
  }

  async pan(options: PanUserGestureOptions): Promise<void> {
    return pan(this.pointerManager, options, this.advanceTimers);
  }

  async rotate(options: RotateUserGestureOptions): Promise<void> {
    return rotate(this.pointerManager, options, this.advanceTimers);
  }
}

/**
 * Provides methods for tap, press, pinch, pan, and rotate gestures with touch pointers.
 */
export const touchGesture = createProxy(new TouchUserGesture());
