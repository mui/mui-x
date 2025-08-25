"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventName = createEventName;
/**
 * Creates the event name for a specific gesture and phase
 */
function createEventName(gesture, phase) {
    return "".concat(gesture).concat(phase === 'ongoing' ? '' : phase.charAt(0).toUpperCase() + phase.slice(1));
}
