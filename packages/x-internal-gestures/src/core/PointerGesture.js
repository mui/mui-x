"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointerGesture = void 0;
var Gesture_1 = require("./Gesture");
/**
 * Base class for all pointer-based gestures.
 *
 * This class extends the base Gesture class with specialized functionality for
 * handling pointer events via the PointerManager. It provides common logic for
 * determining when a gesture should activate, tracking pointer movements, and
 * managing pointer thresholds.
 *
 * All pointer-based gesture implementations should extend this class rather than
 * the base Gesture class.
 *
 * @example
 * ```ts
 * import { PointerGesture } from './PointerGesture';
 *
 * class CustomGesture extends PointerGesture {
 *   constructor(options) {
 *     super(options);
 *   }
 *
 *   clone(overrides) {
 *     return new CustomGesture({
 *       name: this.name,
 *       // ... other options
 *       ...overrides,
 *     });
 *   }
 *
 *   handlePointerEvent = (pointers, event) => {
 *     // Handle pointer events here
 *   }
 * }
 * ```
 */
var PointerGesture = /** @class */ (function (_super) {
    __extends(PointerGesture, _super);
    function PointerGesture(options) {
        var _a, _b;
        var _this = _super.call(this, options) || this;
        /** Function to unregister from the PointerManager when destroying this gesture */
        _this.unregisterHandler = null;
        /** The original target element when the gesture began, used to prevent limbo state if target is removed */
        _this.originalTarget = null;
        _this.minPointers = (_a = options.minPointers) !== null && _a !== void 0 ? _a : 1;
        _this.maxPointers = (_b = options.maxPointers) !== null && _b !== void 0 ? _b : Infinity;
        return _this;
    }
    PointerGesture.prototype.init = function (element, pointerManager, gestureRegistry, keyboardManager) {
        _super.prototype.init.call(this, element, pointerManager, gestureRegistry, keyboardManager);
        this.unregisterHandler = this.pointerManager.registerGestureHandler(this.handlePointerEvent);
    };
    PointerGesture.prototype.updateOptions = function (options) {
        var _a, _b;
        _super.prototype.updateOptions.call(this, options);
        this.minPointers = (_a = options.minPointers) !== null && _a !== void 0 ? _a : this.minPointers;
        this.maxPointers = (_b = options.maxPointers) !== null && _b !== void 0 ? _b : this.maxPointers;
    };
    PointerGesture.prototype.getBaseConfig = function () {
        return {
            requiredKeys: this.requiredKeys,
            minPointers: this.minPointers,
            maxPointers: this.maxPointers,
        };
    };
    PointerGesture.prototype.isWithinPointerCount = function (pointers, pointerMode) {
        var config = this.getEffectiveConfig(pointerMode, this.getBaseConfig());
        return pointers.length >= config.minPointers && pointers.length <= config.maxPointers;
    };
    /**
     * Calculate the target element for the gesture based on the active pointers.
     *
     * It takes into account the original target element.
     *
     * @param pointers - Map of active pointers by pointer ID
     * @param calculatedTarget - The target element calculated from getTargetElement
     * @returns A list of relevant pointers for this gesture
     */
    PointerGesture.prototype.getRelevantPointers = function (pointers, calculatedTarget) {
        var _this = this;
        return pointers.filter(function (pointer) {
            return (_this.isPointerTypeAllowed(pointer.pointerType) &&
                (calculatedTarget === pointer.target ||
                    pointer.target === _this.originalTarget ||
                    calculatedTarget === _this.originalTarget ||
                    ('contains' in calculatedTarget &&
                        calculatedTarget.contains(pointer.target)))) ||
                ('getRootNode' in calculatedTarget &&
                    calculatedTarget.getRootNode() instanceof ShadowRoot &&
                    pointer.srcEvent.composedPath().includes(calculatedTarget));
        });
    };
    PointerGesture.prototype.destroy = function () {
        if (this.unregisterHandler) {
            this.unregisterHandler();
            this.unregisterHandler = null;
        }
        _super.prototype.destroy.call(this);
    };
    return PointerGesture;
}(Gesture_1.Gesture));
exports.PointerGesture = PointerGesture;
