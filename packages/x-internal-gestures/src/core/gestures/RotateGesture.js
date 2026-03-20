"use strict";
/**
 * RotateGesture - Detects rotation movements between two or more pointers
 *
 * This gesture tracks when multiple pointers rotate around a common center point, firing events when:
 * - Two or more pointers begin a rotation motion (start)
 * - The pointers continue rotating (ongoing)
 * - One or more pointers are released or lifted (end)
 *
 * This gesture is commonly used for rotation controls in drawing or image manipulation interfaces.
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
exports.RotateGesture = void 0;
var PointerGesture_1 = require("../PointerGesture");
var utils_1 = require("../utils");
/**
 * RotateGesture class for handling rotation interactions
 *
 * This gesture detects when users rotate multiple pointers around a central point,
 * and dispatches rotation-related events with angle and angular velocity information.
 */
var RotateGesture = /** @class */ (function (_super) {
    __extends(RotateGesture, _super);
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    function RotateGesture(options) {
        var _this = _super.call(this, options) || this;
        _this.state = {
            startAngle: 0,
            lastAngle: 0,
            totalRotation: 0,
            lastTime: 0,
            velocity: 0,
            lastDelta: 0,
        };
        /**
         * Handle pointer events for the rotate gesture
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
                    _this.emitRotateEvent(targetElement, 'cancel', pointersArray, event);
                    _this.resetState();
                }
                return;
            }
            // Filter pointers to only include those targeting our element or its children
            var relevantPointers = _this.getRelevantPointers(pointersArray, targetElement);
            // Check if we have enough pointers for a rotation (at least 2)
            if (!_this.isWithinPointerCount(relevantPointers, event.pointerType)) {
                if (_this.isActive) {
                    // End the gesture if it was active
                    _this.emitRotateEvent(targetElement, 'end', relevantPointers, event);
                    _this.resetState();
                }
                return;
            }
            switch (event.type) {
                case 'pointerdown':
                    if (relevantPointers.length >= 2 && !_this.isActive) {
                        // Calculate and store the starting angle
                        var initialAngle = (0, utils_1.calculateRotationAngle)(relevantPointers);
                        _this.state.startAngle = initialAngle;
                        _this.state.lastAngle = initialAngle;
                        _this.state.lastTime = event.timeStamp;
                        // Store the original target element
                        _this.originalTarget = targetElement;
                    }
                    else if (_this.isActive && relevantPointers.length >= 2) {
                        // A new pointer was added during an active gesture
                        // Adjust the start angle to prevent jumping (similar to pointer removal logic)
                        var newAngle = (0, utils_1.calculateRotationAngle)(relevantPointers);
                        // Adjust startAngle so that the total rotation is preserved
                        _this.state.startAngle = newAngle - _this.state.totalRotation;
                        _this.state.lastAngle = newAngle;
                        _this.state.lastTime = event.timeStamp;
                    }
                    break;
                case 'pointermove':
                    if (relevantPointers.length >= 2) {
                        // Calculate current rotation angle
                        var currentAngle = (0, utils_1.calculateRotationAngle)(relevantPointers);
                        // Calculate rotation delta (change in angle)
                        var delta = currentAngle - _this.state.lastAngle;
                        // Adjust for angle wrapping (event.g., from 359° to 0°)
                        if (delta > 180) {
                            delta -= 360;
                        }
                        if (delta < -180) {
                            delta += 360;
                        }
                        // Emit ongoing event if there's an actual rotation
                        // We don't want to emit events for tiny movements that might be just noise
                        if (Math.abs(delta) <= 0.1) {
                            return;
                        }
                        // Store the delta for use in emitRotateEvent
                        _this.state.lastDelta = delta;
                        // Update rotation value (cumulative)
                        _this.state.totalRotation += delta;
                        // Calculate angular velocity (degrees per second)
                        var deltaTime = (event.timeStamp - _this.state.lastTime) / 1000; // convert to seconds
                        if (deltaTime > 0) {
                            _this.state.velocity = delta / deltaTime;
                        }
                        // Update state
                        _this.state.lastAngle = currentAngle;
                        _this.state.lastTime = event.timeStamp;
                        if (!_this.isActive) {
                            _this.isActive = true;
                            // Emit start event
                            _this.emitRotateEvent(targetElement, 'start', relevantPointers, event);
                            _this.emitRotateEvent(targetElement, 'ongoing', relevantPointers, event);
                        }
                        else {
                            _this.emitRotateEvent(targetElement, 'ongoing', relevantPointers, event);
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
                                _this.emitRotateEvent(targetElement, 'cancel', relevantPointers, event);
                            }
                            _this.emitRotateEvent(targetElement, 'end', relevantPointers, event);
                            // Reset state
                            _this.resetState();
                        }
                        else if (remainingPointers.length >= 2) {
                            // If we still have enough pointers, update the start angle
                            // to prevent jumping when a finger is lifted
                            var newAngle = (0, utils_1.calculateRotationAngle)(remainingPointers);
                            _this.state.startAngle = newAngle - _this.state.totalRotation;
                            _this.state.lastAngle = newAngle;
                        }
                    }
                    break;
                default:
                    break;
            }
        };
        return _this;
    }
    RotateGesture.prototype.clone = function (overrides) {
        return new RotateGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, minPointers: this.minPointers, maxPointers: this.maxPointers, requiredKeys: __spreadArray([], this.requiredKeys, true), pointerMode: __spreadArray([], this.pointerMode, true), preventIf: __spreadArray([], this.preventIf, true), pointerOptions: structuredClone(this.pointerOptions) }, overrides));
    };
    RotateGesture.prototype.destroy = function () {
        this.resetState();
        _super.prototype.destroy.call(this);
    };
    RotateGesture.prototype.updateOptions = function (options) {
        _super.prototype.updateOptions.call(this, options);
    };
    RotateGesture.prototype.resetState = function () {
        this.isActive = false;
        this.state = __assign(__assign({}, this.state), { startAngle: 0, lastAngle: 0, lastTime: 0, velocity: 0, lastDelta: 0 });
    };
    /**
     * Emit rotate-specific events with additional data
     */
    RotateGesture.prototype.emitRotateEvent = function (element, phase, pointers, event) {
        // Calculate current centroid
        var centroid = (0, utils_1.calculateCentroid)(pointers);
        // Create custom event data
        var rotation = this.state.totalRotation;
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
            rotation: rotation,
            delta: this.state.lastDelta,
            totalRotation: this.state.totalRotation,
            velocity: this.state.velocity,
            activeGestures: activeGestures,
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
    return RotateGesture;
}(PointerGesture_1.PointerGesture));
exports.RotateGesture = RotateGesture;
