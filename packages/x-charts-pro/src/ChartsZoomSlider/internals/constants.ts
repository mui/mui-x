export const ZOOM_SLIDER_TRACK_SIZE = 8;
export const ZOOM_SLIDER_ACTIVE_TRACK_SIZE = 10;
export const ZOOM_SLIDER_THUMB_HEIGHT = 20;
export const ZOOM_SLIDER_THUMB_WIDTH = 10;
/**
 * Minimum touch target size for interactive elements (thumbs, track).
 * This is larger than the visible elements to make them easier to interact with on touch devices.
 */
export const ZOOM_SLIDER_TOUCH_TARGET = 44;

export const ZOOM_SLIDER_SIZE = Math.max(
  ZOOM_SLIDER_TRACK_SIZE,
  ZOOM_SLIDER_ACTIVE_TRACK_SIZE,
  ZOOM_SLIDER_THUMB_HEIGHT,
  ZOOM_SLIDER_THUMB_WIDTH,
);

/**
 * Portion of the axis extent, in percent, a zoom slider handle or track moves by on an arrow key press.
 */
export const ZOOM_SLIDER_KEYBOARD_STEP = 1;
/**
 * Portion of the axis extent, in percent, a zoom slider handle or track moves by on a page key press.
 */
export const ZOOM_SLIDER_KEYBOARD_LARGE_STEP = 10;
