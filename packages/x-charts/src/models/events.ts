import type * as React from 'react';

/**
 * Native event triggering a click callback: a pointer click, or a keyboard activation
 * (<kbd>Enter</kbd>/<kbd>Space</kbd>) when the `keyboardActivation` experimental feature is on.
 */
export type ChartsClickEvent = MouseEvent | KeyboardEvent;

/**
 * React event triggering a click callback. See {@link ChartsClickEvent}.
 */
export type ChartsReactClickEvent<Element = SVGElement> =
  React.MouseEvent<Element, MouseEvent> | KeyboardEvent;
