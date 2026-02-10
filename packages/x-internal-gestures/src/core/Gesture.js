"use strict";
/**
 * Base Gesture module that provides common functionality for all gesture implementations
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gesture = void 0;
var eventList_1 = require("./utils/eventList");
/**
 * Base abstract class for all gestures. This class provides the fundamental structure
 * and functionality for handling gestures, including registering and unregistering
 * gesture handlers, creating emitters, and managing gesture state.
 *
 * Gesture is designed as an extensible base for implementing specific gesture recognizers.
 * Concrete gesture implementations should extend this class or one of its subclasses.
 *
 * To implement:
 * - Non-pointer gestures (like wheel events): extend this Gesture class directly
 * - Pointer-based gestures: extend the PointerGesture class instead
 *
 * @example
 * ```ts
 * import { Gesture } from './Gesture';
 *
 * class CustomGesture extends Gesture {
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
 * }
 * ```
 */
var Gesture = /** @class */ (function () {
    /**
     * Create a new gesture instance with the specified options
     *
     * @param options - Configuration options for this gesture
     */
    function Gesture(options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        /**
         * User-mutable data object for sharing state between gesture events
         * This object is included in all events emitted by this gesture
         */
        this.customData = {};
        /**
         * Handle option change events
         * @param event Custom event with new options in the detail property
         */
        this.handleOptionsChange = function (event) {
            if (event && event.detail) {
                _this.updateOptions(event.detail);
            }
        };
        /**
         * Handle state change events
         * @param event Custom event with new state values in the detail property
         */
        this.handleStateChange = function (event) {
            if (event && event.detail) {
                _this.updateState(event.detail);
            }
        };
        if (!options || !options.name) {
            throw new Error('Gesture must be initialized with a valid name.');
        }
        if (options.name in eventList_1.eventList) {
            throw new Error("Gesture can't be created with a native event name. Tried to use \"".concat(options.name, "\". Please use a custom name instead."));
        }
        this.name = options.name;
        this.preventDefault = (_a = options.preventDefault) !== null && _a !== void 0 ? _a : false;
        this.stopPropagation = (_b = options.stopPropagation) !== null && _b !== void 0 ? _b : false;
        this.preventIf = (_c = options.preventIf) !== null && _c !== void 0 ? _c : [];
        this.requiredKeys = (_d = options.requiredKeys) !== null && _d !== void 0 ? _d : [];
        this.pointerMode = (_e = options.pointerMode) !== null && _e !== void 0 ? _e : [];
        this.pointerOptions = (_f = options.pointerOptions) !== null && _f !== void 0 ? _f : {};
    }
    /**
     * Initialize the gesture by acquiring the pointer manager and gestures registry
     * Must be called before the gesture can be used
     */
    Gesture.prototype.init = function (element, pointerManager, gestureRegistry, keyboardManager) {
        this.element = element;
        this.pointerManager = pointerManager;
        this.gesturesRegistry = gestureRegistry;
        this.keyboardManager = keyboardManager;
        var changeOptionsEventName = "".concat(this.name, "ChangeOptions");
        this.element.addEventListener(changeOptionsEventName, this.handleOptionsChange);
        var changeStateEventName = "".concat(this.name, "ChangeState");
        this.element.addEventListener(changeStateEventName, this.handleStateChange);
    };
    /**
     * Update the gesture options with new values
     * @param options Object containing properties to update
     */
    Gesture.prototype.updateOptions = function (options) {
        var _a, _b, _c, _d, _e, _f;
        // Update common options
        this.preventDefault = (_a = options.preventDefault) !== null && _a !== void 0 ? _a : this.preventDefault;
        this.stopPropagation = (_b = options.stopPropagation) !== null && _b !== void 0 ? _b : this.stopPropagation;
        this.preventIf = (_c = options.preventIf) !== null && _c !== void 0 ? _c : this.preventIf;
        this.requiredKeys = (_d = options.requiredKeys) !== null && _d !== void 0 ? _d : this.requiredKeys;
        this.pointerMode = (_e = options.pointerMode) !== null && _e !== void 0 ? _e : this.pointerMode;
        this.pointerOptions = (_f = options.pointerOptions) !== null && _f !== void 0 ? _f : this.pointerOptions;
    };
    /**
     * Get the default configuration for the pointer specific options.
     * Change this function in child classes to provide different defaults.
     */
    Gesture.prototype.getBaseConfig = function () {
        return {
            requiredKeys: this.requiredKeys,
        };
    };
    /**
     * Get the effective configuration for a specific pointer mode.
     * This merges the base configuration with pointer mode-specific overrides.
     *
     * @param pointerType - The pointer type to get configuration for
     * @returns The effective configuration object
     */
    Gesture.prototype.getEffectiveConfig = function (pointerType, baseConfig) {
        if (pointerType !== 'mouse' && pointerType !== 'touch' && pointerType !== 'pen') {
            // Unknown pointer type, return base config
            return baseConfig;
        }
        // Apply pointer mode-specific overrides
        var pointerModeOverrides = this.pointerOptions[pointerType];
        if (pointerModeOverrides) {
            return __assign(__assign({}, baseConfig), pointerModeOverrides);
        }
        return baseConfig;
    };
    /**
     * Update the gesture state with new values
     * @param stateChanges Object containing state properties to update
     */
    Gesture.prototype.updateState = function (stateChanges) {
        // This is a base implementation - concrete gesture classes should override
        // to handle specific state updates based on their state structure
        Object.assign(this.state, stateChanges);
    };
    /**
     * Check if the event's target is or is contained within any of our registered elements
     *
     * @param event - The browser event to check
     * @returns The matching element or null if no match is found
     */
    Gesture.prototype.getTargetElement = function (event) {
        if (this.isActive ||
            this.element === event.target ||
            ('contains' in this.element && this.element.contains(event.target)) ||
            ('getRootNode' in this.element &&
                this.element.getRootNode() instanceof ShadowRoot &&
                event.composedPath().includes(this.element))) {
            return this.element;
        }
        return null;
    };
    Object.defineProperty(Gesture.prototype, "isActive", {
        /** Whether the gesture is currently active */
        get: function () {
            var _a;
            return (_a = this.gesturesRegistry.isGestureActive(this.element, this)) !== null && _a !== void 0 ? _a : false;
        },
        /** Whether the gesture is currently active */
        set: function (isActive) {
            if (isActive) {
                this.gesturesRegistry.registerActiveGesture(this.element, this);
            }
            else {
                this.gesturesRegistry.unregisterActiveGesture(this.element, this);
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Checks if this gesture should be prevented from activating.
     *
     * @param element - The DOM element to check against
     * @param pointerType - The type of pointer triggering the gesture
     * @returns true if the gesture should be prevented, false otherwise
     */
    Gesture.prototype.shouldPreventGesture = function (element, pointerType) {
        // Get effective configuration for this pointer type
        var effectiveConfig = this.getEffectiveConfig(pointerType, this.getBaseConfig());
        // First check if required keyboard keys are pressed
        if (!this.keyboardManager.areKeysPressed(effectiveConfig.requiredKeys)) {
            return true; // Prevent the gesture if required keys are not pressed
        }
        if (this.preventIf.length === 0) {
            return false; // No prevention rules, allow the gesture
        }
        var activeGestures = this.gesturesRegistry.getActiveGestures(element);
        // Check if any of the gestures that would prevent this one are active
        return this.preventIf.some(function (gestureName) { return activeGestures[gestureName]; });
    };
    /**
     * Checks if the given pointer type is allowed for this gesture based on the pointerMode setting.
     *
     * @param pointerType - The type of pointer to check.
     * @returns true if the pointer type is allowed, false otherwise.
     */
    Gesture.prototype.isPointerTypeAllowed = function (pointerType) {
        // If no pointer mode is specified, all pointer types are allowed
        if (!this.pointerMode || this.pointerMode.length === 0) {
            return true;
        }
        // Check if the pointer type is in the allowed types list
        return this.pointerMode.includes(pointerType);
    };
    /**
     * Clean up the gesture and unregister any listeners
     * Call this method when the gesture is no longer needed to prevent memory leaks
     */
    Gesture.prototype.destroy = function () {
        var changeOptionsEventName = "".concat(this.name, "ChangeOptions");
        this.element.removeEventListener(changeOptionsEventName, this.handleOptionsChange);
        var changeStateEventName = "".concat(this.name, "ChangeState");
        this.element.removeEventListener(changeStateEventName, this.handleStateChange);
    };
    return Gesture;
}());
exports.Gesture = Gesture;
