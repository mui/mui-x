"use strict";
/**
 * PressGesture - Detects press and hold interactions
 *
 * This gesture tracks when users press and hold on an element for a specified duration, firing events when:
 * - The press begins and passes the holding threshold time (start, ongoing)
 * - The press ends (end)
 * - The press is canceled by movement beyond threshold (cancel)
 *
 * This gesture is commonly used for contextual menus, revealing additional options, or alternate actions.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PressGesture = void 0;
var PointerGesture_1 = require("../PointerGesture");
var utils_1 = require("../utils");
/**
 * PressGesture class for handling press/hold interactions
 *
 * This gesture detects when users press and hold on an element for a specified duration,
 * and dispatches press-related events when the user holds long enough.
 *
 * The `start` and `ongoing` events are dispatched at the same time once the press threshold is reached.
 * If the press is canceled (event.g., by moving too far), a `cancel` event is dispatched before the `end` event.
 */
var PressGesture = /** @class */ (function (_super) {
    __extends(PressGesture, _super);
    function PressGesture(options) {
        var _a, _b;
        var _this = _super.call(this, options) || this;
        _this.state = {
            startCentroid: null,
            lastPosition: null,
            timerId: null,
            startTime: 0,
            pressThresholdReached: false,
        };
        /**
         * Handle pointer events for the press gesture
         */
        _this.handlePointerEvent = function (pointers, event) {
            var pointersArray = Array.from(pointers.values());
            // Check for our forceCancel event to handle interrupted gestures (from contextmenu, blur)
            if (event.type === 'forceCancel') {
                // Reset all active press gestures when we get a force reset event
                _this.cancelPress(event.target, pointersArray, event);
                return;
            }
            // Find which element (if any) is being targeted
            var targetElement = _this.getTargetElement(event);
            if (!targetElement) {
                return;
            }
            // Check if this gesture should be prevented by active gestures
            if (_this.shouldPreventGesture(targetElement, event.pointerType)) {
                if (_this.isActive) {
                    // If the gesture was active but now should be prevented, cancel it gracefully
                    _this.cancelPress(targetElement, pointersArray, event);
                }
                return;
            }
            // Filter pointers to only include those targeting our element or its children
            var relevantPointers = _this.getRelevantPointers(pointersArray, targetElement);
            if (!_this.isWithinPointerCount(relevantPointers, event.pointerType)) {
                if (_this.isActive) {
                    // Cancel or end the gesture if it was active
                    _this.cancelPress(targetElement, relevantPointers, event);
                }
                return;
            }
            switch (event.type) {
                case 'pointerdown':
                    if (!_this.isActive && !_this.state.startCentroid) {
                        // Calculate and store the starting centroid
                        _this.state.startCentroid = (0, utils_1.calculateCentroid)(relevantPointers);
                        _this.state.lastPosition = __assign({}, _this.state.startCentroid);
                        _this.state.startTime = event.timeStamp;
                        _this.isActive = true;
                        // Store the original target element
                        _this.originalTarget = targetElement;
                        // Start the timer for press recognition
                        _this.clearPressTimer(); // Clear any existing timer first
                        _this.state.timerId = setTimeout(function () {
                            if (_this.isActive && _this.state.startCentroid) {
                                _this.state.pressThresholdReached = true;
                                var lastPosition = _this.state.lastPosition;
                                // Emit press start event
                                _this.emitPressEvent(targetElement, 'start', relevantPointers, event, lastPosition);
                                _this.emitPressEvent(targetElement, 'ongoing', relevantPointers, event, lastPosition);
                            }
                        }, _this.duration);
                    }
                    break;
                case 'pointermove':
                    if (_this.isActive && _this.state.startCentroid) {
                        // Calculate current position
                        var currentPosition = (0, utils_1.calculateCentroid)(relevantPointers);
                        _this.state.lastPosition = currentPosition;
                        // Calculate distance from start position
                        var deltaX = currentPosition.x - _this.state.startCentroid.x;
                        var deltaY = currentPosition.y - _this.state.startCentroid.y;
                        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                        // If moved too far, cancel the press gesture
                        if (distance > _this.maxDistance) {
                            _this.cancelPress(targetElement, relevantPointers, event);
                        }
                    }
                    break;
                case 'pointerup':
                    if (_this.isActive) {
                        if (_this.state.pressThresholdReached) {
                            // Complete the press gesture if we've held long enough
                            var position = _this.state.lastPosition || _this.state.startCentroid;
                            _this.emitPressEvent(targetElement, 'end', relevantPointers, event, position);
                        }
                        // Reset state
                        _this.resetState();
                    }
                    break;
                case 'pointercancel':
                case 'forceCancel':
                    // Cancel the gesture
                    _this.cancelPress(targetElement, relevantPointers, event);
                    break;
                default:
                    break;
            }
        };
        _this.duration = (_a = options.duration) !== null && _a !== void 0 ? _a : 500;
        _this.maxDistance = (_b = options.maxDistance) !== null && _b !== void 0 ? _b : 10;
        return _this;
    }
    PressGesture.prototype.clone = function (overrides) {
        return new PressGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, minPointers: this.minPointers, maxPointers: this.maxPointers, duration: this.duration, maxDistance: this.maxDistance, requiredKeys: __spreadArray([], this.requiredKeys, true), pointerMode: __spreadArray([], this.pointerMode, true), preventIf: __spreadArray([], this.preventIf, true), pointerOptions: structuredClone(this.pointerOptions) }, overrides));
    };
    PressGesture.prototype.destroy = function () {
        this.clearPressTimer();
        this.resetState();
        _super.prototype.destroy.call(this);
    };
    PressGesture.prototype.updateOptions = function (options) {
        var _a, _b;
        _super.prototype.updateOptions.call(this, options);
        this.duration = (_a = options.duration) !== null && _a !== void 0 ? _a : this.duration;
        this.maxDistance = (_b = options.maxDistance) !== null && _b !== void 0 ? _b : this.maxDistance;
    };
    PressGesture.prototype.resetState = function () {
        this.clearPressTimer();
        this.isActive = false;
        this.state = __assign(__assign({}, this.state), { startCentroid: null, lastPosition: null, timerId: null, startTime: 0, pressThresholdReached: false });
    };
    /**
     * Clear the press timer if it's active
     */
    PressGesture.prototype.clearPressTimer = function () {
        if (this.state.timerId !== null) {
            clearTimeout(this.state.timerId);
            this.state.timerId = null;
        }
    };
    /**
     * Emit press-specific events with additional data
     */
    PressGesture.prototype.emitPressEvent = function (element, phase, pointers, event, position) {
        // Get list of active gestures
        var activeGestures = this.gesturesRegistry.getActiveGestures(element);
        // Calculate current duration of the press
        var currentDuration = event.timeStamp - this.state.startTime;
        // Create custom event data
        var customEventData = {
            gestureName: this.name,
            centroid: position,
            target: event.target,
            srcEvent: event,
            phase: phase,
            pointers: pointers,
            timeStamp: event.timeStamp,
            x: position.x,
            y: position.y,
            duration: currentDuration,
            activeGestures: activeGestures,
            customData: this.customData,
        };
        // Event names to trigger
        var eventName = (0, utils_1.createEventName)(this.name, phase);
        // Dispatch custom events on the element
        var domEvent = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: customEventData,
        });
        element.dispatchEvent(domEvent);
        // Apply preventDefault/stopPropagation if configured
        if (this.preventDefault) {
            event.preventDefault();
        }
        if (this.stopPropagation) {
            event.stopPropagation();
        }
    };
    /**
     * Cancel the current press gesture
     */
    PressGesture.prototype.cancelPress = function (element, pointers, event) {
        if (this.isActive && this.state.pressThresholdReached) {
            var position = this.state.lastPosition || this.state.startCentroid;
            this.emitPressEvent(element !== null && element !== void 0 ? element : this.element, 'cancel', pointers, event, position);
            this.emitPressEvent(element !== null && element !== void 0 ? element : this.element, 'end', pointers, event, position);
        }
        this.resetState();
    };
    return PressGesture;
}(PointerGesture_1.PointerGesture));
exports.PressGesture = PressGesture;
