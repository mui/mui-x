"use strict";
/**
 * TapAndDragGesture - Detects tap followed by drag gestures using composition
 *
 * This gesture uses internal TapGesture and PanGesture instances to:
 * 1. First, detect a tap (quick touch without movement)
 * 2. Then, track drag movements on the next pointer down
 *
 * The gesture fires events when:
 * - A tap is completed (tap phase)
 * - Drag movement begins and passes threshold (dragStart)
 * - Drag movement continues (drag)
 * - Drag movement ends (dragEnd)
 * - The gesture is canceled at any point
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
exports.TapAndDragGesture = void 0;
var PointerGesture_1 = require("../PointerGesture");
var utils_1 = require("../utils");
var PanGesture_1 = require("./PanGesture");
var TapGesture_1 = require("./TapGesture");
/**
 * TapAndDragGesture class for handling tap followed by drag interactions
 *
 * This gesture composes tap and drag logic patterns from TapGesture and PanGesture
 * into a single coordinated gesture that handles tap-then-drag interactions.
 */
var TapAndDragGesture = /** @class */ (function (_super) {
    __extends(TapAndDragGesture, _super);
    function TapAndDragGesture(options) {
        var _a, _b, _c;
        var _this = _super.call(this, options) || this;
        _this.state = {
            phase: 'waitingForTap',
            dragTimeoutId: null,
        };
        _this.tapHandler = function () {
            if (_this.state.phase !== 'waitingForTap') {
                return;
            }
            _this.state.phase = 'tapDetected';
            _this.setTouchAction();
            // Start timeout to wait for drag start
            _this.state.dragTimeoutId = setTimeout(function () {
                // Timeout expired, reset gesture
                _this.resetState();
            }, _this.dragTimeout);
        };
        _this.dragStartHandler = function (event) {
            if (_this.state.phase !== 'tapDetected') {
                return;
            }
            // Clear the drag timeout as drag has started
            if (_this.state.dragTimeoutId !== null) {
                clearTimeout(_this.state.dragTimeoutId);
                _this.state.dragTimeoutId = null;
            }
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
        _this.tapMaxDistance = (_a = options.tapMaxDistance) !== null && _a !== void 0 ? _a : 10;
        _this.dragTimeout = (_b = options.dragTimeout) !== null && _b !== void 0 ? _b : 1000;
        _this.dragThreshold = (_c = options.dragThreshold) !== null && _c !== void 0 ? _c : 0;
        _this.dragDirection = options.dragDirection || ['up', 'down', 'left', 'right'];
        _this.tapGesture = new TapGesture_1.TapGesture({
            name: "".concat(_this.name, "-tap"),
            maxDistance: _this.tapMaxDistance,
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
    TapAndDragGesture.prototype.clone = function (overrides) {
        return new TapAndDragGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, minPointers: this.minPointers, maxPointers: this.maxPointers, tapMaxDistance: this.tapMaxDistance, dragTimeout: this.dragTimeout, dragThreshold: this.dragThreshold, dragDirection: __spreadArray([], this.dragDirection, true), requiredKeys: __spreadArray([], this.requiredKeys, true), pointerMode: __spreadArray([], this.pointerMode, true), preventIf: __spreadArray([], this.preventIf, true), pointerOptions: structuredClone(this.pointerOptions) }, overrides));
    };
    TapAndDragGesture.prototype.init = function (element, pointerManager, gestureRegistry, keyboardManager) {
        _super.prototype.init.call(this, element, pointerManager, gestureRegistry, keyboardManager);
        this.tapGesture.init(element, pointerManager, gestureRegistry, keyboardManager);
        this.panGesture.init(element, pointerManager, gestureRegistry, keyboardManager);
        this.element.addEventListener(this.tapGesture.name, this.tapHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.addEventListener("".concat(this.panGesture.name, "Start"), this.dragStartHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.addEventListener(this.panGesture.name, this.dragMoveHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.addEventListener("".concat(this.panGesture.name, "End"), this.dragEndHandler);
        // @ts-expect-error, PointerEvent is correct.
        this.element.addEventListener("".concat(this.panGesture.name, "Cancel"), this.dragEndHandler);
    };
    TapAndDragGesture.prototype.destroy = function () {
        this.resetState();
        this.tapGesture.destroy();
        this.panGesture.destroy();
        this.element.removeEventListener(this.tapGesture.name, this.tapHandler);
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
    TapAndDragGesture.prototype.updateOptions = function (options) {
        var _a, _b, _c;
        _super.prototype.updateOptions.call(this, options);
        this.tapMaxDistance = (_a = options.tapMaxDistance) !== null && _a !== void 0 ? _a : this.tapMaxDistance;
        this.dragTimeout = (_b = options.dragTimeout) !== null && _b !== void 0 ? _b : this.dragTimeout;
        this.dragThreshold = (_c = options.dragThreshold) !== null && _c !== void 0 ? _c : this.dragThreshold;
        this.dragDirection = options.dragDirection || this.dragDirection;
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
        this.element.dispatchEvent(new CustomEvent("".concat(this.tapGesture.name, "ChangeOptions"), {
            detail: {
                maxDistance: this.tapMaxDistance,
                maxPointers: this.maxPointers,
                pointerMode: this.pointerMode,
                requiredKeys: this.requiredKeys,
                preventIf: this.preventIf,
                pointerOptions: structuredClone(this.pointerOptions),
            },
        }));
    };
    TapAndDragGesture.prototype.resetState = function () {
        if (this.state.dragTimeoutId !== null) {
            clearTimeout(this.state.dragTimeoutId);
        }
        this.restoreTouchAction();
        this.isActive = false;
        this.state = {
            phase: 'waitingForTap',
            dragTimeoutId: null,
        };
    };
    /**
     * This can be empty because the TapAndDragGesture relies on TapGesture and PanGesture to handle pointer events
     * The internal gestures will manage their own state and events, while this class coordinates between them
     */
    TapAndDragGesture.prototype.handlePointerEvent = function () { };
    TapAndDragGesture.prototype.setTouchAction = function () {
        this.element.addEventListener('touchstart', utils_1.preventDefault, { passive: false });
    };
    TapAndDragGesture.prototype.restoreTouchAction = function () {
        this.element.removeEventListener('touchstart', utils_1.preventDefault);
    };
    return TapAndDragGesture;
}(PointerGesture_1.PointerGesture));
exports.TapAndDragGesture = TapAndDragGesture;
