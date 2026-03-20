"use strict";
/**
 * ActiveGesturesRegistry - Centralized registry for tracking which gestures are active on elements
 *
 * This singleton class keeps track of all gesture instances that are currently in their active state,
 * allowing both the system and applications to query which gestures are active on specific elements.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveGesturesRegistry = void 0;
/**
 * Registry that maintains a record of all currently active gestures across elements
 */
var ActiveGesturesRegistry = /** @class */ (function () {
    function ActiveGesturesRegistry() {
        /** Map of elements to their active gestures */
        this.activeGestures = new Map();
    }
    /**
     * Register a gesture as active on an element
     *
     * @param element - The DOM element on which the gesture is active
     * @param gesture - The gesture instance that is active
     */
    ActiveGesturesRegistry.prototype.registerActiveGesture = function (element, gesture) {
        if (!this.activeGestures.has(element)) {
            this.activeGestures.set(element, new Set());
        }
        var elementGestures = this.activeGestures.get(element);
        var entry = {
            gesture: gesture,
            element: element,
        };
        elementGestures.add(entry);
    };
    /**
     * Remove a gesture from the active registry
     *
     * @param element - The DOM element on which the gesture was active
     * @param gesture - The gesture instance to deactivate
     */
    ActiveGesturesRegistry.prototype.unregisterActiveGesture = function (element, gesture) {
        var elementGestures = this.activeGestures.get(element);
        if (!elementGestures) {
            return;
        }
        // Find and remove the specific gesture entry
        elementGestures.forEach(function (entry) {
            if (entry.gesture === gesture) {
                elementGestures.delete(entry);
            }
        });
        // Remove the element from the map if it no longer has any active gestures
        if (elementGestures.size === 0) {
            this.activeGestures.delete(element);
        }
    };
    /**
     * Get all active gestures for a specific element
     *
     * @param element - The DOM element to query
     * @returns Array of active gesture names
     */
    ActiveGesturesRegistry.prototype.getActiveGestures = function (element) {
        var elementGestures = this.activeGestures.get(element);
        if (!elementGestures) {
            return {};
        }
        return Array.from(elementGestures).reduce(function (acc, entry) {
            acc[entry.gesture.name] = true;
            return acc;
        }, {});
    };
    /**
     * Check if a specific gesture is active on an element
     *
     * @param element - The DOM element to check
     * @param gesture - The gesture instance to check
     * @returns True if the gesture is active on the element, false otherwise
     */
    ActiveGesturesRegistry.prototype.isGestureActive = function (element, gesture) {
        var elementGestures = this.activeGestures.get(element);
        if (!elementGestures) {
            return false;
        }
        return Array.from(elementGestures).some(function (entry) { return entry.gesture === gesture; });
    };
    /**
     * Clear all active gestures from the registry
     */
    ActiveGesturesRegistry.prototype.destroy = function () {
        this.activeGestures.clear();
    };
    /**
     * Clear all active gestures for a specific element
     *
     * @param element - The DOM element to clear
     */
    ActiveGesturesRegistry.prototype.unregisterElement = function (element) {
        this.activeGestures.delete(element);
    };
    return ActiveGesturesRegistry;
}());
exports.ActiveGesturesRegistry = ActiveGesturesRegistry;
