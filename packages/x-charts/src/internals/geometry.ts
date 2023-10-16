const ANGLE_APPROX = 5; // Angle (in deg) for which we approximate the rectangle as perfectly horizontal/vertical

/**
 * Return the minimal translation along x-axis to avoid overflow of a rectangle of a given width, height, rotation.
 * This assume that all rectangles have the same heightand angle are in -90, 90.
 * Otherwise it woul dbe problematic because you need the height/width of the next rectangle to do the correct computation
 * @param width the side along the x axis.
 * @param height the side along the y axis.
 * @param angle the rotation in degree.
 */
export function getMinXTranslation(width: number, height: number, angle: number = 0) {
  const standardAngle = Math.min(
    Math.abs(angle) % 180,
    Math.abs((Math.abs(angle) % 180) - 180) % 180,
  ); // Map from R to [0, 90]

  if (standardAngle < ANGLE_APPROX) {
    // It's nearly horizontal
    return width;
  }
  if (standardAngle > 90 - ANGLE_APPROX) {
    // It's nearly vertical
    return height;
  }

  const radAngle = (standardAngle * Math.PI) / 180;
  const angleSwich = Math.atan2(height, width);

  if (radAngle < angleSwich) {
    return width / Math.cos(radAngle);
  }
  return height / Math.sin(radAngle);
}
