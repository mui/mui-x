import type * as React from 'react';

/**
 * Event activating an item or an axis: a pointer click, or a key press
 * (<kbd>Enter</kbd>/<kbd>Space</kbd>) when the `keyboardActivation` experimental feature is on.
 *
 * Pass the element the callback is attached to when the pointer event is a React synthetic event,
 * and leave it out when it is a native one.
 */
export type ChartsActivationEvent<Element = never> =
  ([Element] extends [never] ? MouseEvent : React.MouseEvent<Element, MouseEvent>) | KeyboardEvent;
