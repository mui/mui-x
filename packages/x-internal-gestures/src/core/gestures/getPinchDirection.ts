const DIRECTION_THRESHOLD = 0.00001;

export const getPinchDirection = (velocity: number) => {
  if (velocity > DIRECTION_THRESHOLD) {
    return 1; // Zooming in
  }
  if (velocity < -DIRECTION_THRESHOLD) {
    return -1; // Zooming out
  }
  return 0; // No significant movement
};
