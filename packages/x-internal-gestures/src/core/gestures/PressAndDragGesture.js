"use strict";
/**
 * PressAndDragGesture - Detects press followed by drag gestures using composition
 *
 * This gesture uses internal PressGesture and PanGesture instances to:
 * 1. First, detect a press (hold for specified duration without movement)
 * 2. Then, track drag movements from the press position
 *
 * The gesture fires events when:
 * - A press is completed (press phase)
 * - Drag movement begins and passes threshold (dragStart)
 * - Drag movement continues (drag)
 * - Drag movement ends (dragEnd)
 * - The gesture is canceled at any point
 *
 * This is ideal for panning operations where you want to hold first, then drag.
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
exports.PressAndDragGesture = void 0;
var PointerGesture_1 = require("../PointerGesture");
var utils_1 = require("../utils");
var PanGesture_1 = require("./PanGesture");
var PressGesture_1 = require("./PressGesture");
/**
 * PressAndDragGesture class for handling press followed by drag interactions
 *
 * This gesture composes press and drag logic patterns from PressGesture and PanGesture
 * into a single coordinated gesture that handles press-then-drag interactions.
 */
var PressAndDragGesture = /** @class */ (function (_super) {
    __extends(PressAndDragGesture, _super);
    function PressAndDragGesture(options) {
        var _a, _b, _c, _d;
        var _this = _super.call(this, options) || this;
        _this.state = {
            phase: 'waitingForPress',
            dragTimeoutId: null,
        };
        _this.pressHandler = function () {
            if (_this.state.phase !== 'waitingForPress') {
                return;
            }
            _this.state.phase = 'pressDetected';
            _this.setTouchAction();
            // Start timeout to wait for drag start
            _this.state.dragTimeoutId = setTimeout(function () {
                // Timeout expired, reset gesture
                _this.resetState();
            }, _this.dragTimeout);
        };
        _this.dragStartHandler = function (event) {
            if (_this.state.phase !== 'pressDetected') {
                return;
            }
            // Clear the drag timeout as drag has started
            if (_this.state.dragTimeoutId !== null) {
                clearTimeout(_this.state.dragTimeoutId);
                _this.state.dragTimeoutId = null;
            }
            // Restore touch action since we're now dragging
            _this.restoreTouchAction();
            _this.state.phase = 'dragging';
            _this.isActive = true;
            // Fire start event
            _this.element.dispatchEvent(new CustomEvent((0, utils_1.createEventName)(_this.name, event.detail.phase), event));
        };
        _this.dragMoveHandler = function (event) {
            if (_this.state.phase !== 'dragging') {
                return;
            }
            // Fire move event
            _this.element.dispatchEvent(new CustomEvent((0, utils_1.createEventName)(_this.name, event.detail.phase), event));
        };
        _this.dragEndHandler = function (event) {
            if (_this.state.phase !== 'dragging') {
                return;
            }
            _this.resetState();
            // Fire end event
            _this.element.dispatchEvent(new CustomEvent((0, utils_1.createEventName)(_this.name, event.detail.phase), event));
        };
        _this.pressDuration = (_a = options.pressDuration) !== null && _a !== void 0 ? _a : 500;
        _this.pressMaxDistance = (_b = options.pressMaxDistance) !== null && _b !== void 0 ? _b : 10;
        _this.dragTimeout = (_c = options.dragTimeout) !== null && _c !== void 0 ? _c : 1000;
        _this.dragThreshold = (_d = options.dragThreshold) !== null && _d !== void 0 ? _d : 0;
        _this.dragDirection = options.dragDirection || ['up', 'down', 'left', 'right'];
        _this.pressGesture = new PressGesture_1.PressGesture({
            name: "".concat(_this.name, "-press"),
            duration: _this.pressDuration,
            maxDistance: _this.pressMaxDistance,
            maxPointers: _this.maxPointers,
            pointerMode: _this.pointerMode,
            requiredKeys: _this.requiredKeys,
            preventIf: _this.preventIf,
            pointerOptions: structuredClone(_this.pointerOptions),
        });
        _this.panGesture = new PanGesture_1.PanGesture({
            name: "".concat(_this.name, "-pan"),
            minPointers: _this.minPointers,
            maxPointers: _this.maxPointers,
            threshold: _this.dragThreshold,
            direction: _this.dragDirection,
            pointerMode: _this.pointerMode,
            requiredKeys: _this.requiredKeys,
            preventIf: _this.preventIf,
            pointerOptions: structuredClone(_this.pointerOptions),
        });
        return _this;
    }
    PressAndDragGesture.prototype.clone = function (overrides) {
        return new PressAndDragGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, minPointers: this.minPointers, maxPointers: this.maxPointers, pressDuration: this.pressDuration, pressMaxDistance: this.pressMaxDistance, dragTimeout: this.dragTimeout, dragThreshold: this.dragThreshold, dragDirection: __spreadArray([], this.dragDirection, true), requiredKeys: __spreadArray([], this.requiredKeys, true), pointerMode: __spreadArray([], this.pointerMode, true), preventIf: __spreadArray([], this.preventIf, true), pointerOptions: structuredClone(this.pointerOptions) }, overrides));
    };
    PressAndDragGesture.prototype.init = function (element, pointerManager, gestureRegistry, keyboardManager) {
        _super.prototype.init.call(this, element, pointerManager, gestureRegistry, keyboardManager);
        this.pressGesture.init(element, pointerManager, gestureRegistry, keyboardManager);
        this.panGesture.init(element, pointerManager, gestureRegistry, keyboardManager);
        // Listen to press gesture events
        this.element.addEventListener(this.pressGesture.name, this.pressHandler);
        // Listen to pan gesture events for dragging
        // @ts-expect-error, PointerEvent is correct.
        this.element.addEventListener("".concat(this.panGesture.name, "Start"), this.dragStartHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.addEventListener(this.panGesture.name, this.dragMoveHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.addEventListener("".concat(this.panGesture.name, "End"), this.dragEndHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.addEventListener("".concat(this.panGesture.name, "Cancel"), this.dragEndHandler);
    };
    PressAndDragGesture.prototype.destroy = function () {
        this.resetState();
        this.pressGesture.destroy();
        this.panGesture.destroy();
        this.element.removeEventListener(this.pressGesture.name, this.pressHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.removeEventListener("".concat(this.panGesture.name, "Start"), this.dragStartHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.removeEventListener(this.panGesture.name, this.dragMoveHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.removeEventListener("".concat(this.panGesture.name, "End"), this.dragEndHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.removeEventListener("".concat(this.panGesture.name, "Cancel"), this.dragEndHandler);
        _super.prototype.destroy.call(this);
    };
    PressAndDragGesture.prototype.updateOptions = function (options) {
        var _a, _b, _c, _d;
        _super.prototype.updateOptions.call(this, options);
        this.pressDuration = (_a = options.pressDuration) !== null && _a !== void 0 ? _a : this.pressDuration;
        this.pressMaxDistance = (_b = options.pressMaxDistance) !== null && _b !== void 0 ? _b : this.pressMaxDistance;
        this.dragTimeout = (_c = options.dragTimeout) !== null && _c !== void 0 ? _c : this.dragTimeout;
        this.dragThreshold = (_d = options.dragThreshold) !== null && _d !== void 0 ? _d : this.dragThreshold;
        this.dragDirection = options.dragDirection || this.dragDirection;
        // Update internal gesture options
        this.element.dispatchEvent(new CustomEvent("".concat(this.panGesture.name, "ChangeOptions"), {
            detail: {
                minPointers: this.minPointers,
                maxPointers: this.maxPointers,
                threshold: this.dragThreshold,
                direction: this.dragDirection,
                pointerMode: this.pointerMode,
                requiredKeys: this.requiredKeys,
                preventIf: this.preventIf,
                pointerOptions: structuredClone(this.pointerOptions),
            },
        }));
        this.element.dispatchEvent(new CustomEvent("".concat(this.pressGesture.name, "ChangeOptions"), {
            detail: {
                duration: this.pressDuration,
                maxDistance: this.pressMaxDistance,
                maxPointers: this.maxPointers,
                pointerMode: this.pointerMode,
                requiredKeys: this.requiredKeys,
                preventIf: this.preventIf,
                pointerOptions: structuredClone(this.pointerOptions),
            },
        }));
    };
    PressAndDragGesture.prototype.resetState = function () {
        if (this.state.dragTimeoutId !== null) {
            clearTimeout(this.state.dragTimeoutId);
        }
        this.restoreTouchAction();
        this.isActive = false;
        this.state = {
            phase: 'waitingForPress',
            dragTimeoutId: null,
        };
    };
    /**
     * This can be empty because the PressAndDragGesture relies on PressGesture and PanGesture to handle pointer events
     * The internal gestures will manage their own state and events, while this class coordinates between them
     */
    PressAndDragGesture.prototype.handlePointerEvent = function () { };
    PressAndDragGesture.prototype.setTouchAction = function () {
        this.element.addEventListener('touchstart', utils_1.preventDefault, { passive: false });
        this.element.addEventListener('touchmove', utils_1.preventDefault, { passive: false });
        this.element.addEventListener('touchend', utils_1.preventDefault, { passive: false });
    };
    PressAndDragGesture.prototype.restoreTouchAction = function () {
        this.element.removeEventListener('touchstart', utils_1.preventDefault);
        this.element.removeEventListener('touchmove', utils_1.preventDefault);
        this.element.removeEventListener('touchend', utils_1.preventDefault);
    };
    return PressAndDragGesture;
}(PointerGesture_1.PointerGesture));
exports.PressAndDragGesture = PressAndDragGesture;
