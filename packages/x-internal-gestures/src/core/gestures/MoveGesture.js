"use strict";
/**
 * MoveGesture - Detects when a pointer enters, moves within, and leaves an element
 *
 * This gesture tracks pointer movements over an element, firing events when:
 * - A pointer enters the element (start)
 * - A pointer moves within the element (ongoing)
 * - A pointer leaves the element (end)
 *
 * Unlike other gestures which often require specific actions to trigger,
 * the move gesture fires automatically when pointers interact with the target element.
 *
 * This gesture only works with mouse pointers, not touch or pen.
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
exports.MoveGesture = void 0;
var PointerGesture_1 = require("../PointerGesture");
var utils_1 = require("../utils");
/**
 * MoveGesture class for handling pointer movement over elements
 *
 * This gesture detects when pointers enter, move within, or leave target elements,
 * and dispatches corresponding custom events.
 *
 * This gesture only works with hovering mouse pointers, not touch.
 */
var MoveGesture = /** @class */ (function (_super) {
    __extends(MoveGesture, _super);
    function MoveGesture(options) {
        var _this = _super.call(this, options) || this;
        _this.state = {
            lastPosition: null,
        };
        /**
         * Handle pointer enter events for a specific element
         * @param event The original pointer event
         */
        _this.handleElementEnter = function (event) {
            if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
                return;
            }
            // Get pointers from the PointerManager
            var pointers = _this.pointerManager.getPointers() || new Map();
            var pointersArray = Array.from(pointers.values());
            // Only activate if we're within pointer count constraints
            if (_this.isWithinPointerCount(pointersArray, event.pointerType)) {
                _this.isActive = true;
                var currentPosition = { x: event.clientX, y: event.clientY };
                _this.state.lastPosition = currentPosition;
                // Emit start event
                _this.emitMoveEvent(_this.element, 'start', pointersArray, event);
                _this.emitMoveEvent(_this.element, 'ongoing', pointersArray, event);
            }
        };
        /**
         * Handle pointer leave events for a specific element
         * @param event The original pointer event
         */
        _this.handleElementLeave = function (event) {
            if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
                return;
            }
            if (!_this.isActive) {
                return;
            }
            // Get pointers from the PointerManager
            var pointers = _this.pointerManager.getPointers() || new Map();
            var pointersArray = Array.from(pointers.values());
            // Emit end event and reset state
            _this.emitMoveEvent(_this.element, 'end', pointersArray, event);
            _this.resetState();
        };
        /**
         * Handle pointer events for the move gesture (only handles move events now)
         * @param pointers Map of active pointers
         * @param event The original pointer event
         */
        _this.handlePointerEvent = function (pointers, event) {
            if (event.type !== 'pointermove' ||
                (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) {
                return;
            }
            if (_this.preventDefault) {
                event.preventDefault();
            }
            if (_this.stopPropagation) {
                event.stopPropagation();
            }
            var pointersArray = Array.from(pointers.values());
            // Find which element (if any) is being targeted
            var targetElement = _this.getTargetElement(event);
            if (!targetElement) {
                return;
            }
            if (!_this.isWithinPointerCount(pointersArray, event.pointerType)) {
                return;
            }
            if (_this.shouldPreventGesture(targetElement, event.pointerType)) {
                if (!_this.isActive) {
                    return;
                }
                _this.resetState();
                _this.emitMoveEvent(targetElement, 'end', pointersArray, event);
                return;
            }
            // Update position
            var currentPosition = { x: event.clientX, y: event.clientY };
            _this.state.lastPosition = currentPosition;
            if (!_this.isActive) {
                _this.isActive = true;
                _this.emitMoveEvent(targetElement, 'start', pointersArray, event);
            }
            // Emit ongoing event
            _this.emitMoveEvent(targetElement, 'ongoing', pointersArray, event);
        };
        _this.threshold = options.threshold || 0;
        return _this;
    }
    MoveGesture.prototype.clone = function (overrides) {
        return new MoveGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, threshold: this.threshold, minPointers: this.minPointers, maxPointers: this.maxPointers, requiredKeys: __spreadArray([], this.requiredKeys, true), pointerMode: __spreadArray([], this.pointerMode, true), preventIf: __spreadArray([], this.preventIf, true), pointerOptions: structuredClone(this.pointerOptions) }, overrides));
    };
    MoveGesture.prototype.init = function (element, pointerManager, gestureRegistry, keyboardManager) {
        _super.prototype.init.call(this, element, pointerManager, gestureRegistry, keyboardManager);
        // Add event listeners for entering and leaving elements
        // These are different from pointer events handled by PointerManager
        // @ts-expect-error, PointerEvent is correct.
        this.element.addEventListener('pointerenter', this.handleElementEnter);
        // @ts-expect-error, PointerEvent is correct.
        this.element.addEventListener('pointerleave', this.handleElementLeave);
    };
    MoveGesture.prototype.destroy = function () {
        // Remove event listeners using the same function references
        // @ts-expect-error, PointerEvent is correct.
        this.element.removeEventListener('pointerenter', this.handleElementEnter);
        // @ts-expect-error, PointerEvent is correct.
        this.element.removeEventListener('pointerleave', this.handleElementLeave);
        this.resetState();
        _super.prototype.destroy.call(this);
    };
    MoveGesture.prototype.updateOptions = function (options) {
        // Call parent method to handle common options
        _super.prototype.updateOptions.call(this, options);
    };
    MoveGesture.prototype.resetState = function () {
        this.isActive = false;
        this.state = {
            lastPosition: null,
        };
    };
    /**
     * Emit move-specific events
     * @param element The DOM element the event is related to
     * @param phase The current phase of the gesture (start, ongoing, end)
     * @param pointers Array of active pointers
     * @param event The original pointer event
     */
    MoveGesture.prototype.emitMoveEvent = function (element, phase, pointers, event) {
        var currentPosition = this.state.lastPosition || (0, utils_1.calculateCentroid)(pointers);
        // Get list of active gestures
        var activeGestures = this.gesturesRegistry.getActiveGestures(element);
        // Create custom event data
        var customEventData = {
            gestureName: this.name,
            centroid: currentPosition,
            target: event.target,
            srcEvent: event,
            phase: phase,
            pointers: pointers,
            timeStamp: event.timeStamp,
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
    };
    return MoveGesture;
}(PointerGesture_1.PointerGesture));
exports.MoveGesture = MoveGesture;
