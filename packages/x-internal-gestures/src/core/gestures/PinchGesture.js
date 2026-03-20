"use strict";
/**
 * PinchGesture - Detects pinch (zoom) movements with two or more pointers
 *
 * This gesture tracks when multiple pointers move toward or away from each other, firing events when:
 * - Two or more pointers begin moving (start)
 * - The pointers continue changing distance (ongoing)
 * - One or more pointers are released or lifted (end)
 *
 * This gesture is commonly used to implement zoom functionality in touch interfaces.
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
exports.PinchGesture = void 0;
var PointerGesture_1 = require("../PointerGesture");
var utils_1 = require("../utils");
/**
 * PinchGesture class for handling pinch/zoom interactions
 *
 * This gesture detects when users move multiple pointers toward or away from each other,
 * and dispatches scale-related events with distance and velocity information.
 */
var PinchGesture = /** @class */ (function (_super) {
    __extends(PinchGesture, _super);
    function PinchGesture(options) {
        var _a, _b;
        var _this = _super.call(this, __assign(__assign({}, options), { minPointers: (_a = options.minPointers) !== null && _a !== void 0 ? _a : 2 })) || this;
        _this.state = {
            startDistance: 0,
            lastDistance: 0,
            lastScale: 1,
            lastTime: 0,
            velocity: 0,
            totalScale: 1,
            deltaScale: 0,
        };
        /**
         * Handle pointer events for the pinch gesture
         */
        _this.handlePointerEvent = function (pointers, event) {
            var pointersArray = Array.from(pointers.values());
            // Find which element (if any) is being targeted
            var targetElement = _this.getTargetElement(event);
            if (!targetElement) {
                return;
            }
            // Check if this gesture should be prevented by active gestures
            if (_this.shouldPreventGesture(targetElement, event.pointerType)) {
                if (_this.isActive) {
                    // If the gesture was active but now should be prevented, end it gracefully
                    _this.emitPinchEvent(targetElement, 'cancel', pointersArray, event);
                    _this.resetState();
                }
                return;
            }
            // Filter pointers to only include those targeting our element or its children
            var relevantPointers = _this.getRelevantPointers(pointersArray, targetElement);
            switch (event.type) {
                case 'pointerdown':
                    if (relevantPointers.length >= 2 && !_this.isActive) {
                        // Calculate and store the starting distance between pointers
                        var initialDistance = (0, utils_1.calculateAverageDistance)(relevantPointers);
                        _this.state.startDistance = initialDistance;
                        _this.state.lastDistance = initialDistance;
                        _this.state.lastTime = event.timeStamp;
                        // Store the original target element
                        _this.originalTarget = targetElement;
                    }
                    else if (_this.isActive && relevantPointers.length >= 2) {
                        // A new pointer was added during an active gesture
                        // Adjust the start distance to prevent jumping (similar to pointer removal logic)
                        var newDistance = (0, utils_1.calculateAverageDistance)(relevantPointers);
                        // Adjust startDistance so that the current scale is preserved
                        _this.state.startDistance = newDistance / _this.state.lastScale;
                        _this.state.lastDistance = newDistance;
                        _this.state.lastTime = event.timeStamp;
                    }
                    break;
                case 'pointermove':
                    if (_this.state.startDistance &&
                        _this.isWithinPointerCount(relevantPointers, event.pointerType)) {
                        // Calculate current distance between pointers
                        var currentDistance = (0, utils_1.calculateAverageDistance)(relevantPointers);
                        // Calculate absolute distance change
                        var distanceChange = Math.abs(currentDistance - _this.state.lastDistance);
                        // Only proceed if the distance between pointers has changed enough
                        if (distanceChange !== 0 && distanceChange >= _this.threshold) {
                            // Calculate scale relative to starting distance
                            var scale = _this.state.startDistance ? currentDistance / _this.state.startDistance : 1;
                            // Calculate the relative scale change since last event
                            var scaleChange = scale / _this.state.lastScale;
                            // Apply this change to the total accumulated scale
                            _this.state.totalScale *= scaleChange;
                            // Calculate velocity (change in scale over time)
                            var deltaTime = (event.timeStamp - _this.state.lastTime) / 1000; // convert to seconds
                            if (_this.state.lastDistance) {
                                var deltaDistance = currentDistance - _this.state.lastDistance;
                                var result = deltaDistance / deltaTime;
                                _this.state.velocity = Number.isNaN(result) ? 0 : result;
                            }
                            // Update state
                            _this.state.lastDistance = currentDistance;
                            _this.state.deltaScale = scale - _this.state.lastScale;
                            _this.state.lastScale = scale;
                            _this.state.lastTime = event.timeStamp;
                            if (!_this.isActive) {
                                // Mark gesture as active
                                _this.isActive = true;
                                // Emit start event
                                _this.emitPinchEvent(targetElement, 'start', relevantPointers, event);
                                _this.emitPinchEvent(targetElement, 'ongoing', relevantPointers, event);
                            }
                            else {
                                // Emit ongoing event
                                _this.emitPinchEvent(targetElement, 'ongoing', relevantPointers, event);
                            }
                        }
                    }
                    break;
                case 'pointerup':
                case 'pointercancel':
                case 'forceCancel':
                    if (_this.isActive) {
                        var remainingPointers = relevantPointers.filter(function (p) { return p.type !== 'pointerup' && p.type !== 'pointercancel'; });
                        // If we no longer meet the pointer count requirements, end the gesture
                        if (!_this.isWithinPointerCount(remainingPointers, event.pointerType)) {
                            if (event.type === 'pointercancel') {
                                _this.emitPinchEvent(targetElement, 'cancel', relevantPointers, event);
                            }
                            _this.emitPinchEvent(targetElement, 'end', relevantPointers, event);
                            // Reset state
                            _this.resetState();
                        }
                        else if (remainingPointers.length >= 2) {
                            // If we still have enough pointers, update the start distance
                            // to prevent jumping when a finger is lifted
                            var newDistance = (0, utils_1.calculateAverageDistance)(remainingPointers);
                            _this.state.startDistance = newDistance / _this.state.lastScale;
                            _this.state.lastDistance = newDistance;
                            _this.state.lastTime = event.timeStamp;
                        }
                    }
                    break;
                default:
                    break;
            }
        };
        _this.threshold = (_b = options.threshold) !== null && _b !== void 0 ? _b : 0;
        return _this;
    }
    PinchGesture.prototype.clone = function (overrides) {
        return new PinchGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, threshold: this.threshold, minPointers: this.minPointers, maxPointers: this.maxPointers, requiredKeys: __spreadArray([], this.requiredKeys, true), pointerMode: __spreadArray([], this.pointerMode, true), preventIf: __spreadArray([], this.preventIf, true), pointerOptions: structuredClone(this.pointerOptions) }, overrides));
    };
    PinchGesture.prototype.destroy = function () {
        this.resetState();
        _super.prototype.destroy.call(this);
    };
    PinchGesture.prototype.updateOptions = function (options) {
        _super.prototype.updateOptions.call(this, options);
    };
    PinchGesture.prototype.resetState = function () {
        this.isActive = false;
        this.state = __assign(__assign({}, this.state), { startDistance: 0, lastDistance: 0, lastScale: 1, lastTime: 0, velocity: 0, deltaScale: 0 });
    };
    /**
     * Emit pinch-specific events with additional data
     */
    PinchGesture.prototype.emitPinchEvent = function (element, phase, pointers, event) {
        // Calculate current centroid
        var centroid = (0, utils_1.calculateCentroid)(pointers);
        // Create custom event data
        var distance = this.state.lastDistance;
        var scale = this.state.lastScale;
        // Get list of active gestures
        var activeGestures = this.gesturesRegistry.getActiveGestures(element);
        var customEventData = {
            gestureName: this.name,
            centroid: centroid,
            target: event.target,
            srcEvent: event,
            phase: phase,
            pointers: pointers,
            timeStamp: event.timeStamp,
            scale: scale,
            deltaScale: this.state.deltaScale,
            totalScale: this.state.totalScale,
            distance: distance,
            velocity: this.state.velocity,
            activeGestures: activeGestures,
            direction: (0, utils_1.getPinchDirection)(this.state.velocity),
            customData: this.customData,
        };
        // Handle default event behavior
        if (this.preventDefault) {
            event.preventDefault();
        }
        if (this.stopPropagation) {
            event.stopPropagation();
        }
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
    };
    return PinchGesture;
}(PointerGesture_1.PointerGesture));
exports.PinchGesture = PinchGesture;
