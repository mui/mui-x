"use strict";
/**
 * TapGesture - Detects tap (quick touch without movement) gestures
 *
 * This gesture tracks simple tap interactions on elements, firing a single event when:
 * - A complete tap is detected (pointerup after brief touch without excessive movement)
 * - The tap is canceled (event.g., moved too far or held too long)
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
exports.TapGesture = void 0;
var PointerGesture_1 = require("../PointerGesture");
var utils_1 = require("../utils");
/**
 * TapGesture class for handling tap interactions
 *
 * This gesture detects when users tap on elements without significant movement,
 * and can recognize single taps, double taps, or other multi-tap sequences.
 */
var TapGesture = /** @class */ (function (_super) {
    __extends(TapGesture, _super);
    function TapGesture(options) {
        var _a, _b;
        var _this = _super.call(this, options) || this;
        _this.state = {
            startCentroid: null,
            currentTapCount: 0,
            lastTapTime: 0,
            lastPosition: null,
        };
        /**
         * Handle pointer events for the tap gesture
         */
        _this.handlePointerEvent = function (pointers, event) {
            var pointersArray = Array.from(pointers.values());
            // Find which element (if any) is being targeted
            var targetElement = _this.getTargetElement(event);
            if (!targetElement) {
                return;
            }
            // Filter pointers to only include those targeting our element or its children
            var relevantPointers = _this.getRelevantPointers(pointersArray, targetElement);
            if (_this.shouldPreventGesture(targetElement, event.pointerType) ||
                !_this.isWithinPointerCount(relevantPointers, event.pointerType)) {
                if (_this.isActive) {
                    // Cancel the gesture if it was active
                    _this.cancelTap(targetElement, relevantPointers, event);
                }
                return;
            }
            switch (event.type) {
                case 'pointerdown':
                    if (!_this.isActive) {
                        // Calculate and store the starting centroid
                        _this.state.startCentroid = (0, utils_1.calculateCentroid)(relevantPointers);
                        _this.state.lastPosition = __assign({}, _this.state.startCentroid);
                        _this.isActive = true;
                        // Store the original target element
                        _this.originalTarget = targetElement;
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
                        // If moved too far, cancel the tap gesture
                        if (distance > _this.maxDistance) {
                            _this.cancelTap(targetElement, relevantPointers, event);
                        }
                    }
                    break;
                case 'pointerup':
                    if (_this.isActive) {
                        // For valid tap: increment tap count
                        _this.state.currentTapCount += 1;
                        // Make sure we have a valid position before firing the tap event
                        var position = _this.state.lastPosition || _this.state.startCentroid;
                        if (!position) {
                            _this.cancelTap(targetElement, relevantPointers, event);
                            return;
                        }
                        // Check if we've reached the desired number of taps
                        if (_this.state.currentTapCount >= _this.taps) {
                            // The complete tap sequence has been detected - fire the tap event
                            _this.fireTapEvent(targetElement, relevantPointers, event, position);
                            // Reset state after successful tap
                            _this.resetState();
                        }
                        else {
                            // Store the time of this tap for multi-tap detection
                            _this.state.lastTapTime = event.timeStamp;
                            // Reset active state but keep the tap count for multi-tap detection
                            _this.isActive = false;
                            // For multi-tap detection: keep track of the last tap position
                            // but clear the start centroid to prepare for next tap
                            _this.state.startCentroid = null;
                            // Start a timeout to reset the tap count if the next tap doesn't come soon enough
                            setTimeout(function () {
                                if (_this.state &&
                                    _this.state.currentTapCount > 0 &&
                                    _this.state.currentTapCount < _this.taps) {
                                    _this.state.currentTapCount = 0;
                                }
                            }, 300); // 300ms is a typical double-tap detection window
                        }
                    }
                    break;
                case 'pointercancel':
                case 'forceCancel':
                    // Cancel the gesture
                    _this.cancelTap(targetElement, relevantPointers, event);
                    break;
                default:
                    break;
            }
        };
        _this.maxDistance = (_a = options.maxDistance) !== null && _a !== void 0 ? _a : 10;
        _this.taps = (_b = options.taps) !== null && _b !== void 0 ? _b : 1;
        return _this;
    }
    TapGesture.prototype.clone = function (overrides) {
        return new TapGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, minPointers: this.minPointers, maxPointers: this.maxPointers, maxDistance: this.maxDistance, taps: this.taps, requiredKeys: __spreadArray([], this.requiredKeys, true), pointerMode: __spreadArray([], this.pointerMode, true), preventIf: __spreadArray([], this.preventIf, true), pointerOptions: structuredClone(this.pointerOptions) }, overrides));
    };
    TapGesture.prototype.destroy = function () {
        this.resetState();
        _super.prototype.destroy.call(this);
    };
    TapGesture.prototype.updateOptions = function (options) {
        var _a, _b;
        _super.prototype.updateOptions.call(this, options);
        this.maxDistance = (_a = options.maxDistance) !== null && _a !== void 0 ? _a : this.maxDistance;
        this.taps = (_b = options.taps) !== null && _b !== void 0 ? _b : this.taps;
    };
    TapGesture.prototype.resetState = function () {
        this.isActive = false;
        this.state = {
            startCentroid: null,
            currentTapCount: 0,
            lastTapTime: 0,
            lastPosition: null,
        };
    };
    /**
     * Fire the main tap event when a valid tap is detected
     */
    TapGesture.prototype.fireTapEvent = function (element, pointers, event, position) {
        // Get list of active gestures
        var activeGestures = this.gesturesRegistry.getActiveGestures(element);
        // Create custom event data for the tap event
        var customEventData = {
            gestureName: this.name,
            centroid: position,
            target: event.target,
            srcEvent: event,
            phase: 'end', // The tap is complete, so we use 'end' state for the event data
            pointers: pointers,
            timeStamp: event.timeStamp,
            x: position.x,
            y: position.y,
            tapCount: this.state.currentTapCount,
            activeGestures: activeGestures,
            customData: this.customData,
        };
        // Dispatch a single 'tap' event (not 'tapStart', 'tapEnd', etc.)
        var domEvent = new CustomEvent(this.name, {
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
     * Cancel the current tap gesture
     */
    TapGesture.prototype.cancelTap = function (element, pointers, event) {
        if (this.state.startCentroid || this.state.lastPosition) {
            var position = this.state.lastPosition || this.state.startCentroid;
            // Get list of active gestures
            var activeGestures = this.gesturesRegistry.getActiveGestures(element);
            // Create custom event data for the cancel event
            var customEventData = {
                gestureName: this.name,
                centroid: position,
                target: event.target,
                srcEvent: event,
                phase: 'cancel',
                pointers: pointers,
                timeStamp: event.timeStamp,
                x: position.x,
                y: position.y,
                tapCount: this.state.currentTapCount,
                activeGestures: activeGestures,
                customData: this.customData,
            };
            // Dispatch a 'tapCancel' event
            var eventName = (0, utils_1.createEventName)(this.name, 'cancel');
            var domEvent = new CustomEvent(eventName, {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: customEventData,
            });
            element.dispatchEvent(domEvent);
        }
        this.resetState();
    };
    return TapGesture;
}(PointerGesture_1.PointerGesture));
exports.TapGesture = TapGesture;
