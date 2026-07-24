import type * as React from 'react';

/**
 * Native event activating an item or an axis: a pointer click, or a key press
 * (<kbd>Enter</kbd>/<kbd>Space</kbd>) when the `keyboardActivation` experimental feature is on.
 */
export type ChartsActivationEvent = MouseEvent | KeyboardEvent;

/**
 * React event activating an item or an axis. See {@link ChartsActivationEvent}.
 */
export type ChartsReactActivationEvent<Element = SVGElement> =
  React.MouseEvent<Element, MouseEvent> | KeyboardEvent;
