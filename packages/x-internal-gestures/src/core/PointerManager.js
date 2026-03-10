"use strict";
/**
 * PointerManager - Centralized manager for pointer events in the gesture recognition system
 *
 * This singleton class abstracts the complexity of working with pointer events by:
 * 1. Capturing and tracking all active pointers (touch, mouse, pen)
 * 2. Normalizing pointer data into a consistent format
 * 3. Managing pointer capture for proper tracking across elements
 * 4. Distributing events to registered gesture recognizers
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointerManager = void 0;
/**
 * Manager for handling pointer events across the application.
 *
 * PointerManager serves as the foundational layer for gesture recognition,
 * providing a centralized system for tracking active pointers and distributing
 * pointer events to gesture recognizers.
 *
 * It normalizes browser pointer events into a consistent format and simplifies
 * multi-touch handling by managing pointer capture and tracking multiple
 * simultaneous pointers.
 */
var PointerManager = /** @class */ (function () {
    function PointerManager(options) {
        var _this = this;
        var _a, _b, _c, _d;
        /** Whether to prevent interrupt events like blur or contextmenu */
        this.preventEventInterruption = true;
        /** Map of all currently active pointers by their pointerId */
        this.pointers = new Map();
        /** Set of registered gesture handlers that receive pointer events */
        this.gestureHandlers = new Set();
        /**
         * Handle events that should interrupt all gestures.
         * This clears all active pointers and notifies handlers with a pointercancel-like event.
         *
         * @param event - The event that triggered the interruption (blur or contextmenu)
         */
        this.handleInterruptEvents = function (event) {
            if (_this.preventEventInterruption &&
                'pointerType' in event &&
                event.pointerType === 'touch') {
                event.preventDefault();
                return;
            }
            // Create a synthetic pointer cancel event
            var cancelEvent = new PointerEvent('forceCancel', {
                bubbles: false,
                cancelable: false,
            });
            var firstPointer = _this.pointers.values().next().value;
            if (_this.pointers.size > 0 && firstPointer) {
                // If there are active pointers, use the first one as a template for coordinates
                // Update the synthetic event with the pointer's coordinates
                Object.defineProperties(cancelEvent, {
                    clientX: { value: firstPointer.clientX },
                    clientY: { value: firstPointer.clientY },
                    pointerId: { value: firstPointer.pointerId },
                    pointerType: { value: firstPointer.pointerType },
                });
                // Force update of all pointers to have type 'forceCancel'
                for (var _i = 0, _a = _this.pointers.entries(); _i < _a.length; _i++) {
                    var _b = _a[_i], pointerId = _b[0], pointer = _b[1];
                    var updatedPointer = __assign(__assign({}, pointer), { type: 'forceCancel' });
                    _this.pointers.set(pointerId, updatedPointer);
                }
            }
            // Notify all handlers about the interruption
            _this.notifyHandlers(cancelEvent);
            // Clear all pointers
            _this.pointers.clear();
        };
        /**
         * Event handler for all pointer events.
         *
         * This method:
         * 1. Updates the internal pointers map based on the event type
         * 2. Manages pointer capture for tracking pointers outside the root element
         * 3. Notifies all registered handlers with the current state
         *
         * @param event - The original pointer event from the browser
         */
        this.handlePointerEvent = function (event) {
            var type = event.type, pointerId = event.pointerId;
            // Create or update pointer data
            if (type === 'pointerdown' || type === 'pointermove') {
                _this.pointers.set(pointerId, _this.createPointerData(event));
            }
            // Remove pointer data on up or cancel
            else if (type === 'pointerup' || type === 'pointercancel' || type === 'forceCancel') {
                // Update one last time before removing
                _this.pointers.set(pointerId, _this.createPointerData(event));
                // Notify handlers with current state
                _this.notifyHandlers(event);
                // Then remove the pointer
                _this.pointers.delete(pointerId);
                return;
            }
            _this.notifyHandlers(event);
        };
        this.root =
            // User provided root element
            (_b = (_a = options.root) !== null && _a !== void 0 ? _a : 
            // Fallback to document root or body, this fixes shadow DOM scenarios
            document.getRootNode({ composed: true })) !== null && _b !== void 0 ? _b : 
            // Fallback to document body, for some testing environments
            document.body;
        this.touchAction = options.touchAction || 'auto';
        this.passive = (_c = options.passive) !== null && _c !== void 0 ? _c : false;
        this.preventEventInterruption = (_d = options.preventEventInterruption) !== null && _d !== void 0 ? _d : true;
        this.setupEventListeners();
    }
    /**
     * Register a handler function to receive pointer events.
     *
     * The handler will be called whenever pointer events occur within the root element.
     * It receives the current map of all active pointers and the original event.
     *
     * @param {Function} handler - Function to receive pointer events and current pointer state
     * @returns {Function} An unregister function that removes this handler when called
     */
    PointerManager.prototype.registerGestureHandler = function (handler) {
        var _this = this;
        this.gestureHandlers.add(handler);
        // Return unregister function
        return function () {
            _this.gestureHandlers.delete(handler);
        };
    };
    /**
     * Get a copy of the current active pointers map.
     *
     * Returns a new Map containing all currently active pointers.
     * Modifying the returned map will not affect the internal pointers state.
     *
     * @returns A new Map containing all active pointers
     */
    PointerManager.prototype.getPointers = function () {
        return new Map(this.pointers);
    };
    /**
     * Set up event listeners for pointer events on the root element.
     *
     * This method attaches all necessary event listeners and configures
     * the CSS touch-action property on the root element.
     */
    PointerManager.prototype.setupEventListeners = function () {
        // Set touch-action CSS property
        if (this.touchAction !== 'auto') {
            this.root.style.touchAction = this.touchAction;
        }
        // Add event listeners
        this.root.addEventListener('pointerdown', this.handlePointerEvent, { passive: this.passive });
        this.root.addEventListener('pointermove', this.handlePointerEvent, { passive: this.passive });
        this.root.addEventListener('pointerup', this.handlePointerEvent, { passive: this.passive });
        this.root.addEventListener('pointercancel', this.handlePointerEvent, { passive: this.passive });
        // @ts-expect-error, forceCancel is not a standard event, but used for custom handling
        this.root.addEventListener('forceCancel', this.handlePointerEvent, { passive: this.passive });
        // Add blur and contextmenu event listeners to interrupt all gestures
        this.root.addEventListener('blur', this.handleInterruptEvents);
        this.root.addEventListener('contextmenu', this.handleInterruptEvents);
    };
    /**
     * Notify all registered gesture handlers about a pointer event.
     *
     * Each handler receives the current map of active pointers and the original event.
     *
     * @param event - The original pointer event that triggered this notification
     */
    PointerManager.prototype.notifyHandlers = function (event) {
        var _this = this;
        this.gestureHandlers.forEach(function (handler) { return handler(_this.pointers, event); });
    };
    /**
     * Create a normalized PointerData object from a browser PointerEvent.
     *
     * This method extracts all relevant information from the original event
     * and formats it in a consistent way for gesture recognizers to use.
     *
     * @param event - The original browser pointer event
     * @returns A new PointerData object representing this pointer
     */
    PointerManager.prototype.createPointerData = function (event) {
        return {
            pointerId: event.pointerId,
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            target: event.target,
            timeStamp: event.timeStamp,
            type: event.type,
            isPrimary: event.isPrimary,
            pressure: event.pressure,
            width: event.width,
            height: event.height,
            pointerType: event.pointerType,
            srcEvent: event,
        };
    };
    /**
     * Clean up all event listeners and reset the PointerManager state.
     *
     * This method should be called when the PointerManager is no longer needed
     * to prevent memory leaks. It removes all event listeners, clears the
     * internal state, and resets the singleton instance.
     */
    PointerManager.prototype.destroy = function () {
        this.root.removeEventListener('pointerdown', this.handlePointerEvent);
        this.root.removeEventListener('pointermove', this.handlePointerEvent);
        this.root.removeEventListener('pointerup', this.handlePointerEvent);
        this.root.removeEventListener('pointercancel', this.handlePointerEvent);
        // @ts-expect-error, forceCancel is not a standard event, but used for custom handling
        this.root.removeEventListener('forceCancel', this.handlePointerEvent);
        this.root.removeEventListener('blur', this.handleInterruptEvents);
        this.root.removeEventListener('contextmenu', this.handleInterruptEvents);
        this.pointers.clear();
        this.gestureHandlers.clear();
    };
    return PointerManager;
}());
exports.PointerManager = PointerManager;
