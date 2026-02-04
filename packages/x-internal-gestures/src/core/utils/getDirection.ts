import type { Direction } from '../types/Direction';

const MAIN_THRESHOLD = 0.00001;
const ANGLE_THRESHOLD = 0.00001;
const SECONDARY_THRESHOLD = 0.15;

/**
 * Get the direction of movement based on the current and previous positions
 */
export function getDirection(
  previous: { x: number; y: number },
  current: { x: number; y: number },
): Direction {
  const deltaX = current.x - previous.x;
  const deltaY = current.y - previous.y;

  const direction: Direction = {
    vertical: null,
    horizontal: null,
    mainAxis: null,
  };

  const isDiagonal = isDiagonalMovement(current, previous);
  const mainMovement = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';

  // eslint-disable-next-line no-nested-ternary
  const horizontalThreshold = isDiagonal
    ? MAIN_THRESHOLD
    : mainMovement === 'horizontal'
      ? MAIN_THRESHOLD
      : SECONDARY_THRESHOLD;
  // eslint-disable-next-line no-nested-ternary
  const verticalThreshold = isDiagonal
    ? MAIN_THRESHOLD
    : mainMovement === 'horizontal'
      ? SECONDARY_THRESHOLD
      : MAIN_THRESHOLD;

  // Set horizontal direction if there's a significant movement horizontally
  if (Math.abs(deltaX) > horizontalThreshold) {
    // Small threshold to avoid noise
    direction.horizontal = deltaX > 0 ? 'right' : 'left';
  }

  // Set vertical direction if there's a significant movement vertically
  if (Math.abs(deltaY) > verticalThreshold) {
    // Small threshold to avoid noise
    direction.vertical = deltaY > 0 ? 'down' : 'up';
  }

  direction.mainAxis = isDiagonal ? 'diagonal' : mainMovement;

  return direction;
}

function isDiagonalMovement(
  previous: { x: number; y: number },
  current: { x: number; y: number },
): boolean {
  const deltaX = current.x - previous.x;
  const deltaY = current.y - previous.y;

  // Calculate the angle of movement
  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  // Check if the angle is within the diagonal range
  return (
    (angle >= -45 + ANGLE_THRESHOLD && angle <= -22.5 + ANGLE_THRESHOLD) ||
    (angle >= 22.5 + ANGLE_THRESHOLD && angle <= 45 + ANGLE_THRESHOLD) ||
    (angle >= 135 + ANGLE_THRESHOLD && angle <= 157.5 + ANGLE_THRESHOLD) ||
    (angle >= -157.5 + ANGLE_THRESHOLD && angle <= -135 + ANGLE_THRESHOLD)
  );
}
