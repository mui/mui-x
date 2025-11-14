/**
 * The direction of movement for gestures
 * This type defines the detected directions based on the vertical and horizontal components
 * The values can be 'up', 'down', 'left', 'right' or null if not applicable.
 *
 * The null values indicate that the gesture is not moving in that direction.
 */
export type Direction = {
  vertical: 'up' | 'down' | null;
  horizontal: 'left' | 'right' | null;
  mainAxis: 'horizontal' | 'vertical' | 'diagonal' | null;
};
