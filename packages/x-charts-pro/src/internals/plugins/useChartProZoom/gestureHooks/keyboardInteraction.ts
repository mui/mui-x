/**
 * Key bindings of the `keyboard` zoom and pan interactions.
 *
 * Unmodified arrow keys already move the focus between chart items, so panning uses `Shift` with
 * the arrow keys. Zoom uses the `+`/`-`/`0` bindings shared by map widgets.
 */

/** Portion of the visible range added or removed by a zoom key press. Matches the toolbar buttons. */
export const KEYBOARD_ZOOM_STEP = 0.1;

/** Portion of the drawing area the view moves by on a pan key press. */
export const KEYBOARD_PAN_STEP = 0.1;

export type ZoomKeyAction = 'in' | 'out' | 'reset';

/**
 * The zoom action bound to a key press, or `null` when the key is not bound.
 * `Shift` is allowed because `+` needs it on most layouts.
 */
export function getZoomKeyAction(event: KeyboardEvent): ZoomKeyAction | null {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    // Left to the browser, which zooms the page on `ControlOrMeta` + `+`.
    return null;
  }

  switch (event.key) {
    case '+':
    case '=':
      return 'in';
    case '-':
    case '_':
      return 'out';
    case '0':
      return 'reset';
    default:
      return null;
  }
}

/**
 * The direction the view moves in on a key press, or `null` when the key is not bound.
 * `x: 1` moves the view to the right, and `y: 1` moves it up.
 */
export function getPanKeyDirection(event: KeyboardEvent): { x: number; y: number } | null {
  if (!event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
    return null;
  }

  switch (event.key) {
    case 'ArrowRight':
      return { x: 1, y: 0 };
    case 'ArrowLeft':
      return { x: -1, y: 0 };
    case 'ArrowUp':
      return { x: 0, y: 1 };
    case 'ArrowDown':
      return { x: 0, y: -1 };
    default:
      return null;
  }
}
