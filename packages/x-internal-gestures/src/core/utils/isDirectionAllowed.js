"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDirectionAllowed = isDirectionAllowed;
/**
 * Check if a direction matches one of the allowed directions
 */
function isDirectionAllowed(direction, allowedDirections) {
    if (!direction.vertical && !direction.horizontal) {
        return false;
    }
    if (allowedDirections.length === 0) {
        return true;
    }
    // Check if the vertical direction is allowed (if it exists)
    var verticalAllowed = direction.vertical === null || allowedDirections.includes(direction.vertical);
    // Check if the horizontal direction is allowed (if it exists)
    var horizontalAllowed = direction.horizontal === null || allowedDirections.includes(direction.horizontal);
    // Both directions must be allowed
    return verticalAllowed && horizontalAllowed;
}
