"use strict";
/**
 * PanGesture - Detects panning (dragging) movements
 *
 * This gesture tracks pointer dragging movements across elements, firing events when:
 * - The drag movement begins and passes the threshold distance (start)
 * - The drag movement continues (ongoing)
 * - The drag movement ends (end)
 *
 * The gesture can be configured to recognize movement only in specific directions.
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
exports.PanGesture = void 0;
var PointerGesture_1 = require("../PointerGesture");
var utils_1 = require("../utils");
/**
 * PanGesture class for handling panning/dragging interactions
 *
 * This gesture detects when users drag across elements with one or more pointers,
 * and dispatches directional movement events with delta and velocity information.
 */
var PanGesture = /** @class */ (function (_super) {
    __extends(PanGesture, _super);
    function PanGesture(options) {
        var _this = _super.call(this, options) || this;
        _this.state = {
            startPointers: new Map(),
            startCentroid: null,
            lastCentroid: null,
            movementThresholdReached: false,
            totalDeltaX: 0,
            totalDeltaY: 0,
            activeDeltaX: 0,
            activeDeltaY: 0,
            lastDirection: {
                vertical: null,
                horizontal: null,
                mainAxis: null,
            },
            lastDeltas: null,
        };
        /**
         * Handle pointer events for the pan gesture
         */
        _this.handlePointerEvent = function (pointers, event) {
            var _a, _b;
            var pointersArray = Array.from(pointers.values());
            // Check for our forceCancel event to handle interrupted gestures (from contextmenu, blur)
            if (event.type === 'forceCancel') {
                // Reset all active pan gestures when we get a force reset event
                _this.cancel(event.target, pointersArray, event);
                return;
            }
            // Find which element (if any) is being targeted
            var targetElement = _this.getTargetElement(event);
            if (!targetElement) {
                return;
            }
            // Check if this gesture should be prevented by active gestures
            if (_this.shouldPreventGesture(targetElement, event.pointerType)) {
                // If the gesture was active but now should be prevented, cancel it gracefully
                _this.cancel(targetElement, pointersArray, event);
                return;
            }
            // Filter pointers to only include those targeting our element or its children
            var relevantPointers = _this.getRelevantPointers(pointersArray, targetElement);
            if (!_this.isWithinPointerCount(relevantPointers, event.pointerType)) {
                // Cancel or end the gesture if it was active
                _this.cancel(targetElement, relevantPointers, event);
                return;
            }
            switch (event.type) {
                case 'pointerdown':
                    if (!_this.isActive && !_this.state.startCentroid) {
                        // Store initial pointers
                        relevantPointers.forEach(function (pointer) {
                            _this.state.startPointers.set(pointer.pointerId, pointer);
                        });
                        // Store the original target element
                        _this.originalTarget = targetElement;
                        // Calculate and store the starting centroid
                        _this.state.startCentroid = (0, utils_1.calculateCentroid)(relevantPointers);
                        _this.state.lastCentroid = __assign({}, _this.state.startCentroid);
                    }
                    else if (_this.state.startCentroid && _this.state.lastCentroid) {
                        // A new pointer was added during an active gesture
                        // Adjust the start centroid to prevent jumping
                        var oldCentroid = _this.state.lastCentroid;
                        var newCentroid = (0, utils_1.calculateCentroid)(relevantPointers);
                        // Calculate the offset that the new pointer would cause
                        var offsetX = newCentroid.x - oldCentroid.x;
                        var offsetY = newCentroid.y - oldCentroid.y;
                        // Adjust start centroid to compensate for the new pointer
                        _this.state.startCentroid = {
                            x: _this.state.startCentroid.x + offsetX,
                            y: _this.state.startCentroid.y + offsetY,
                        };
                        _this.state.lastCentroid = newCentroid;
                        // Add the new pointer to tracked pointers
                        relevantPointers.forEach(function (pointer) {
                            if (!_this.state.startPointers.has(pointer.pointerId)) {
                                _this.state.startPointers.set(pointer.pointerId, pointer);
                            }
                        });
                    }
                    break;
                case 'pointermove':
                    if (_this.state.startCentroid &&
                        _this.isWithinPointerCount(pointersArray, event.pointerType)) {
                        // Calculate current centroid
                        var currentCentroid = (0, utils_1.calculateCentroid)(relevantPointers);
                        // Calculate delta from start
                        var distanceDeltaX = currentCentroid.x - _this.state.startCentroid.x;
                        var distanceDeltaY = currentCentroid.y - _this.state.startCentroid.y;
                        // Calculate movement distance
                        var distance = Math.sqrt(distanceDeltaX * distanceDeltaX + distanceDeltaY * distanceDeltaY);
                        // Determine movement direction
                        var moveDirection = (0, utils_1.getDirection)((_a = _this.state.lastCentroid) !== null && _a !== void 0 ? _a : _this.state.startCentroid, currentCentroid);
                        // Calculate change in position since last move
                        var lastDeltaX = _this.state.lastCentroid
                            ? currentCentroid.x - _this.state.lastCentroid.x
                            : 0;
                        var lastDeltaY = _this.state.lastCentroid
                            ? currentCentroid.y - _this.state.lastCentroid.y
                            : 0;
                        // Check if movement passes the threshold and is in an allowed direction
                        if (!_this.state.movementThresholdReached &&
                            distance >= _this.threshold &&
                            (0, utils_1.isDirectionAllowed)(moveDirection, _this.direction)) {
                            _this.state.movementThresholdReached = true;
                            _this.isActive = true;
                            // Update total accumulated delta
                            _this.state.lastDeltas = { x: lastDeltaX, y: lastDeltaY };
                            _this.state.totalDeltaX += lastDeltaX;
                            _this.state.totalDeltaY += lastDeltaY;
                            _this.state.activeDeltaX += lastDeltaX;
                            _this.state.activeDeltaY += lastDeltaY;
                            // Emit start event
                            _this.emitPanEvent(targetElement, 'start', relevantPointers, event, currentCentroid);
                            _this.emitPanEvent(targetElement, 'ongoing', relevantPointers, event, currentCentroid);
                        }
                        // If we've already crossed the threshold, continue tracking
                        else if (_this.state.movementThresholdReached && _this.isActive) {
                            // Update total accumulated delta
                            _this.state.lastDeltas = { x: lastDeltaX, y: lastDeltaY };
                            _this.state.totalDeltaX += lastDeltaX;
                            _this.state.totalDeltaY += lastDeltaY;
                            _this.state.activeDeltaX += lastDeltaX;
                            _this.state.activeDeltaY += lastDeltaY;
                            // Emit ongoing event
                            _this.emitPanEvent(targetElement, 'ongoing', relevantPointers, event, currentCentroid);
                        }
                        // Update last centroid
                        _this.state.lastCentroid = currentCentroid;
                        _this.state.lastDirection = moveDirection;
                    }
                    break;
                case 'pointerup':
                case 'pointercancel':
                case 'forceCancel':
                    // If the gesture was active (threshold was reached), emit end event
                    if (_this.isActive && _this.state.movementThresholdReached) {
                        var remainingPointers = relevantPointers.filter(function (p) { return p.type !== 'pointerup' && p.type !== 'pointercancel'; });
                        // If we no longer meet the pointer count requirements, end the gesture
                        if (!_this.isWithinPointerCount(remainingPointers, event.pointerType)) {
                            // End the gesture
                            var currentCentroid = _this.state.lastCentroid || _this.state.startCentroid;
                            if (event.type === 'pointercancel') {
                                _this.emitPanEvent(targetElement, 'cancel', relevantPointers, event, currentCentroid);
                            }
                            _this.emitPanEvent(targetElement, 'end', relevantPointers, event, currentCentroid);
                            _this.resetState();
                        }
                        else if (remainingPointers.length >= 1 && _this.state.lastCentroid) {
                            // If we still have enough pointers, adjust the centroid
                            // to prevent jumping when a finger is lifted
                            var newCentroid = (0, utils_1.calculateCentroid)(remainingPointers);
                            // Calculate the offset that removing the pointer would cause
                            var offsetX = newCentroid.x - _this.state.lastCentroid.x;
                            var offsetY = newCentroid.y - _this.state.lastCentroid.y;
                            // Adjust start centroid to compensate
                            _this.state.startCentroid = {
                                x: _this.state.startCentroid.x + offsetX,
                                y: _this.state.startCentroid.y + offsetY,
                            };
                            _this.state.lastCentroid = newCentroid;
                            // Remove the pointer from tracked pointers
                            var removedPointerId = (_b = relevantPointers.find(function (p) { return p.type === 'pointerup' || p.type === 'pointercancel'; })) === null || _b === void 0 ? void 0 : _b.pointerId;
                            if (removedPointerId !== undefined) {
                                _this.state.startPointers.delete(removedPointerId);
                            }
                        }
                    }
                    else {
                        _this.resetState();
                    }
                    break;
                default:
                    break;
            }
        };
        _this.direction = options.direction || ['up', 'down', 'left', 'right'];
        _this.threshold = options.threshold || 0;
        return _this;
    }
    PanGesture.prototype.clone = function (overrides) {
        return new PanGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, threshold: this.threshold, minPointers: this.minPointers, maxPointers: this.maxPointers, direction: __spreadArray([], this.direction, true), requiredKeys: __spreadArray([], this.requiredKeys, true), pointerMode: __spreadArray([], this.pointerMode, true), preventIf: __spreadArray([], this.preventIf, true), pointerOptions: structuredClone(this.pointerOptions) }, overrides));
    };
    PanGesture.prototype.destroy = function () {
        this.resetState();
        _super.prototype.destroy.call(this);
    };
    PanGesture.prototype.updateOptions = function (options) {
        var _a;
        _super.prototype.updateOptions.call(this, options);
        this.direction = options.direction || this.direction;
        this.threshold = (_a = options.threshold) !== null && _a !== void 0 ? _a : this.threshold;
    };
    PanGesture.prototype.resetState = function () {
        this.isActive = false;
        this.state = __assign(__assign({}, this.state), { startPointers: new Map(), startCentroid: null, lastCentroid: null, lastDeltas: null, activeDeltaX: 0, activeDeltaY: 0, movementThresholdReached: false, lastDirection: {
                vertical: null,
                horizontal: null,
                mainAxis: null,
            } });
    };
    /**
     * Emit pan-specific events with additional data
     */
    PanGesture.prototype.emitPanEvent = function (element, phase, pointers, event, currentCentroid) {
        var _a, _b, _c, _d;
        if (!this.state.startCentroid) {
            return;
        }
        var deltaX = (_b = (_a = this.state.lastDeltas) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0;
        var deltaY = (_d = (_c = this.state.lastDeltas) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0;
        // Calculate velocity - time difference in seconds
        var firstPointer = this.state.startPointers.values().next().value;
        var timeElapsed = firstPointer ? (event.timeStamp - firstPointer.timeStamp) / 1000 : 0;
        var velocityX = timeElapsed > 0 ? deltaX / timeElapsed : 0;
        var velocityY = timeElapsed > 0 ? deltaY / timeElapsed : 0;
        var velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        // Get list of active gestures
        var activeGestures = this.gesturesRegistry.getActiveGestures(element);
        // Create custom event data
        var customEventData = {
            gestureName: this.name,
            initialCentroid: this.state.startCentroid,
            centroid: currentCentroid,
            target: event.target,
            srcEvent: event,
            phase: phase,
            pointers: pointers,
            timeStamp: event.timeStamp,
            deltaX: deltaX,
            deltaY: deltaY,
            direction: this.state.lastDirection,
            velocityX: velocityX,
            velocityY: velocityY,
            velocity: velocity,
            totalDeltaX: this.state.totalDeltaX,
            totalDeltaY: this.state.totalDeltaY,
            activeDeltaX: this.state.activeDeltaX,
            activeDeltaY: this.state.activeDeltaY,
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
     * Cancel the current gesture
     */
    PanGesture.prototype.cancel = function (element, pointers, event) {
        if (this.isActive) {
            var el = element !== null && element !== void 0 ? element : this.element;
            this.emitPanEvent(el, 'cancel', pointers, event, this.state.lastCentroid);
            this.emitPanEvent(el, 'end', pointers, event, this.state.lastCentroid);
        }
        this.resetState();
    };
    return PanGesture;
}(PointerGesture_1.PointerGesture));
exports.PanGesture = PanGesture;
