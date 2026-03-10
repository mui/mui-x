"use strict";
/**
 * TurnWheelGesture - Detects wheel events on an element
 *
 * This gesture tracks mouse wheel or touchpad scroll events on elements, firing events when:
 * - The user scrolls/wheels on the element (ongoing)
 *
 * Unlike other gestures which may have start/ongoing/end states,
 * wheel gestures are always considered "ongoing" since they are discrete events.
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
exports.TurnWheelGesture = void 0;
var Gesture_1 = require("../Gesture");
var utils_1 = require("../utils");
/**
 * TurnWheelGesture class for handling wheel/scroll interactions
 *
 * This gesture detects when users scroll or use the mouse wheel on elements,
 * and dispatches corresponding scroll events with delta information.
 * Unlike most gestures, it extends directly from Gesture rather than PointerGesture.
 */
var TurnWheelGesture = /** @class */ (function (_super) {
    __extends(TurnWheelGesture, _super);
    function TurnWheelGesture(options) {
        var _a, _b, _c, _d, _e;
        var _this = _super.call(this, options) || this;
        _this.state = {
            totalDeltaX: 0,
            totalDeltaY: 0,
            totalDeltaZ: 0,
        };
        /**
         * Handle wheel events for a specific element
         * @param element The element that received the wheel event
         * @param event The original wheel event
         */
        _this.handleWheelEvent = function (event) {
            // Check if this gesture should be prevented by active gestures
            if (_this.shouldPreventGesture(_this.element, 'mouse')) {
                return;
            }
            // Get pointers from the PointerManager to use for centroid calculation
            var pointers = _this.pointerManager.getPointers() || new Map();
            var pointersArray = Array.from(pointers.values());
            // Update total deltas with scaled values
            _this.state.totalDeltaX += event.deltaX * _this.sensitivity * (_this.invert ? -1 : 1);
            _this.state.totalDeltaY += event.deltaY * _this.sensitivity * (_this.invert ? -1 : 1);
            _this.state.totalDeltaZ += event.deltaZ * _this.sensitivity * (_this.invert ? -1 : 1);
            // Apply proper min/max clamping for each axis
            // Ensure values stay between min and max bounds
            ['totalDeltaX', 'totalDeltaY', 'totalDeltaZ'].forEach(function (axis) {
                // First clamp at the minimum bound
                if (_this.state[axis] < _this.min) {
                    _this.state[axis] = _this.min;
                }
                // Then clamp at the maximum bound
                if (_this.state[axis] > _this.max) {
                    _this.state[axis] = _this.max;
                }
            });
            // Emit the wheel event
            _this.emitWheelEvent(pointersArray, event);
        };
        _this.sensitivity = (_a = options.sensitivity) !== null && _a !== void 0 ? _a : 1;
        _this.max = (_b = options.max) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER;
        _this.min = (_c = options.min) !== null && _c !== void 0 ? _c : Number.MIN_SAFE_INTEGER;
        _this.initialDelta = (_d = options.initialDelta) !== null && _d !== void 0 ? _d : 0;
        _this.invert = (_e = options.invert) !== null && _e !== void 0 ? _e : false;
        _this.state.totalDeltaX = _this.initialDelta;
        _this.state.totalDeltaY = _this.initialDelta;
        _this.state.totalDeltaZ = _this.initialDelta;
        return _this;
    }
    TurnWheelGesture.prototype.clone = function (overrides) {
        return new TurnWheelGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, sensitivity: this.sensitivity, max: this.max, min: this.min, initialDelta: this.initialDelta, invert: this.invert, requiredKeys: __spreadArray([], this.requiredKeys, true), preventIf: __spreadArray([], this.preventIf, true) }, overrides));
    };
    TurnWheelGesture.prototype.init = function (element, pointerManager, gestureRegistry, keyboardManager) {
        _super.prototype.init.call(this, element, pointerManager, gestureRegistry, keyboardManager);
        // Add event listener directly to the element
        // @ts-expect-error, WheelEvent is correct.
        this.element.addEventListener('wheel', this.handleWheelEvent);
    };
    TurnWheelGesture.prototype.destroy = function () {
        // Remove the element-specific event listener
        // @ts-expect-error, WheelEvent is correct.
        this.element.removeEventListener('wheel', this.handleWheelEvent);
        this.resetState();
        _super.prototype.destroy.call(this);
    };
    TurnWheelGesture.prototype.resetState = function () {
        this.isActive = false;
        this.state = {
            totalDeltaX: 0,
            totalDeltaY: 0,
            totalDeltaZ: 0,
        };
    };
    TurnWheelGesture.prototype.updateOptions = function (options) {
        var _a, _b, _c, _d, _e;
        _super.prototype.updateOptions.call(this, options);
        this.sensitivity = (_a = options.sensitivity) !== null && _a !== void 0 ? _a : this.sensitivity;
        this.max = (_b = options.max) !== null && _b !== void 0 ? _b : this.max;
        this.min = (_c = options.min) !== null && _c !== void 0 ? _c : this.min;
        this.initialDelta = (_d = options.initialDelta) !== null && _d !== void 0 ? _d : this.initialDelta;
        this.invert = (_e = options.invert) !== null && _e !== void 0 ? _e : this.invert;
    };
    /**
     * Emit wheel-specific events
     * @param pointers The current pointers on the element
     * @param event The original wheel event
     */
    TurnWheelGesture.prototype.emitWheelEvent = function (pointers, event) {
        // Calculate centroid - either from existing pointers or from the wheel event position
        var centroid = pointers.length > 0 ? (0, utils_1.calculateCentroid)(pointers) : { x: event.clientX, y: event.clientY };
        // Get list of active gestures
        var activeGestures = this.gesturesRegistry.getActiveGestures(this.element);
        // Create custom event data
        var customEventData = {
            gestureName: this.name,
            centroid: centroid,
            target: event.target,
            srcEvent: event,
            phase: 'ongoing', // Wheel events are always in "ongoing" state
            pointers: pointers,
            timeStamp: event.timeStamp,
            deltaX: event.deltaX * this.sensitivity * (this.invert ? -1 : 1),
            deltaY: event.deltaY * this.sensitivity * (this.invert ? -1 : 1),
            deltaZ: event.deltaZ * this.sensitivity * (this.invert ? -1 : 1),
            deltaMode: event.deltaMode,
            totalDeltaX: this.state.totalDeltaX,
            totalDeltaY: this.state.totalDeltaY,
            totalDeltaZ: this.state.totalDeltaZ,
            activeGestures: activeGestures,
            customData: this.customData,
        };
        // Apply default event behavior if configured
        if (this.preventDefault) {
            event.preventDefault();
        }
        if (this.stopPropagation) {
            event.stopPropagation();
        }
        // Event names to trigger
        var eventName = (0, utils_1.createEventName)(this.name, 'ongoing');
        // Dispatch custom events on the element
        var domEvent = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: customEventData,
        });
        this.element.dispatchEvent(domEvent);
    };
    return TurnWheelGesture;
}(Gesture_1.Gesture));
exports.TurnWheelGesture = TurnWheelGesture;
