const ANGLE_APPROX = 5; // Angle (in deg) for which we approximate the rectangle as perfectly horizontal/vertical

let warnedOnce = false;

/**
 * Return the minimal translation along the x-axis to avoid overflow of a rectangle of a given width, height, and rotation.
 * This assumes that all rectangles have the same height and angle between -90 and 90.
 * Otherwise it would be problematic because you need the height/width of the next rectangle to do the correct computation.
 * @param width the side along the x-axis.
 * @param height the side along the y-axis.
 * @param angle the rotation in degrees.
 */
export function getMinXTranslation(width: number, height: number, angle: number = 0) {
  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnce && angle > 90 && angle < -90) {
      warnedOnce = true;
      console.warn(
        [
          `MUI X: It seems you applied an angle larger than 90° or smaller than -90° to an axis text.`,
          `This could cause some text overlapping.`,
          `If you encounter a use case where it's needed, please open an issue.`,
        ].join('\n'),
      );
    }
  }
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
