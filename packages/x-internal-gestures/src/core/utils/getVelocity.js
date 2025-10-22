"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVelocity = getVelocity;
/**
 * Calculate the velocity of movement between two points
 */
function getVelocity(startPointer, endPointer) {
    var timeElapsed = (endPointer.timeStamp - startPointer.timeStamp) / 1000; // in seconds
    if (timeElapsed === 0) {
        return { velocityX: 0, velocityY: 0, velocity: 0 };
    }
    var velocityX = (endPointer.clientX - startPointer.clientX) / timeElapsed;
    var velocityY = (endPointer.clientY - startPointer.clientY) / timeElapsed;
    var velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    return { velocityX: velocityX, velocityY: velocityY, velocity: velocity };
}
