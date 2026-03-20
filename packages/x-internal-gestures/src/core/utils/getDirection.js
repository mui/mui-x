"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirection = getDirection;
var MAIN_THRESHOLD = 0.00001;
var ANGLE_THRESHOLD = 0.00001;
var SECONDARY_THRESHOLD = 0.15;
/**
 * Get the direction of movement based on the current and previous positions
 */
function getDirection(previous, current) {
    var deltaX = current.x - previous.x;
    var deltaY = current.y - previous.y;
    var direction = {
        vertical: null,
        horizontal: null,
        mainAxis: null,
    };
    var isDiagonal = isDiagonalMovement(current, previous);
    var mainMovement = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
    // eslint-disable-next-line no-nested-ternary
    var horizontalThreshold = isDiagonal
        ? MAIN_THRESHOLD
        : mainMovement === 'horizontal'
            ? MAIN_THRESHOLD
            : SECONDARY_THRESHOLD;
    // eslint-disable-next-line no-nested-ternary
    var verticalThreshold = isDiagonal
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
function isDiagonalMovement(previous, current) {
    var deltaX = current.x - previous.x;
    var deltaY = current.y - previous.y;
    // Calculate the angle of movement
    var angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    // Check if the angle is within the diagonal range
    return ((angle >= -45 + ANGLE_THRESHOLD && angle <= -22.5 + ANGLE_THRESHOLD) ||
        (angle >= 22.5 + ANGLE_THRESHOLD && angle <= 45 + ANGLE_THRESHOLD) ||
        (angle >= 135 + ANGLE_THRESHOLD && angle <= 157.5 + ANGLE_THRESHOLD) ||
        (angle >= -157.5 + ANGLE_THRESHOLD && angle <= -135 + ANGLE_THRESHOLD));
}
