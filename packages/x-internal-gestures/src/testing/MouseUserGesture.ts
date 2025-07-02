import { move } from './gestures/MoveUserGesture';
import { MoveUserGestureOptions, MoveUserGestureRoot } from './gestures/MoveUserGesture.types';
import { press } from './gestures/PressUserGesture';
import { PressUserGestureOptions, PressUserGestureRoot } from './gestures/PressUserGesture.types';
import { tap } from './gestures/TapUserGesture';
import { TapUserGestureOptions, TapUserGestureRoot } from './gestures/TapUserGesture.types';
import { turnWheel } from './gestures/TurnWheelUserGesture';
import {
  TurnWheelUserGestureOptions,
  TurnWheelUserGestureRoot,
} from './gestures/TurnWheelUserGesture.types';
import { UserGesture, UserGestureOptions } from './UserGesture';
import { createProxy } from './utils/createProxy';

/**
 * Used for providing a custom mouse gesture.
 */
export interface MouseUserGestureRootExtension {}

/**
 * Defines the mouse gestures.
 * It includes a setup method to initialize global options.
 */
export type MouseUserGestureRoot = {
  setup: (options: UserGestureOptions) => MouseUserGestureRoot;
} & TapUserGestureRoot<'mouse'> &
  PressUserGestureRoot<'mouse'> &
  MoveUserGestureRoot &
  TurnWheelUserGestureRoot &
  MouseUserGestureRootExtension;

/**
 * Class implementing mouse gestures for testing.
 * Provides methods for tap, press, move, and wheel gestures with a mouse pointer.
 */
class MouseUserGesture extends UserGesture implements MouseUserGestureRoot {
  constructor() {
    super('mouse');
  }

  async tap(options: TapUserGestureOptions<'mouse'>): Promise<void> {
    return tap(this.pointerManager, options, this.advanceTimers);
  }

  async press(options: PressUserGestureOptions<'mouse'>): Promise<void> {
    return press(this.pointerManager, options, this.advanceTimers);
  }

  async move(options: MoveUserGestureOptions): Promise<void> {
    return move(this.pointerManager, options, this.advanceTimers);
  }

  async turnWheel(options: TurnWheelUserGestureOptions): Promise<void> {
    return turnWheel(this.pointerManager, options, this.advanceTimers);
  }
}

/**
 * Provides methods for tap, press, move, and wheel gestures with a mouse pointer.
 */
export const mouseGesture = createProxy(new MouseUserGesture());
