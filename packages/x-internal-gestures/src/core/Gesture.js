"use strict";
/**
 * Base Gesture module that provides common functionality for all gesture implementations
 */
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
        var _a, _b, _c, _d, _e;
        /**
         * User-mutable data object for sharing state between gesture events
         * This object is included in all events emitted by this gesture
         */
        this.customData = {};
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
        this.element.addEventListener(changeOptionsEventName, this.handleOptionsChange.bind(this));
        var changeStateEventName = "".concat(this.name, "ChangeState");
        this.element.addEventListener(changeStateEventName, this.handleStateChange.bind(this));
    };
    /**
     * Handle option change events
     * @param event Custom event with new options in the detail property
     */
    Gesture.prototype.handleOptionsChange = function (event) {
        if (event && event.detail) {
            this.updateOptions(event.detail);
        }
    };
    /**
     * Update the gesture options with new values
     * @param options Object containing properties to update
     */
    Gesture.prototype.updateOptions = function (options) {
        var _a, _b, _c, _d, _e;
        // Update common options
        this.preventDefault = (_a = options.preventDefault) !== null && _a !== void 0 ? _a : this.preventDefault;
        this.stopPropagation = (_b = options.stopPropagation) !== null && _b !== void 0 ? _b : this.stopPropagation;
        this.preventIf = (_c = options.preventIf) !== null && _c !== void 0 ? _c : this.preventIf;
        this.requiredKeys = (_d = options.requiredKeys) !== null && _d !== void 0 ? _d : this.requiredKeys;
        this.pointerMode = (_e = options.pointerMode) !== null && _e !== void 0 ? _e : this.pointerMode;
    };
    /**
     * Handle state change events
     * @param event Custom event with new state values in the detail property
     */
    Gesture.prototype.handleStateChange = function (event) {
        if (event && event.detail) {
            this.updateState(event.detail);
        }
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
     * @returns true if the gesture should be prevented, false otherwise
     */
    Gesture.prototype.shouldPreventGesture = function (element) {
        // First check if required keyboard keys are pressed
        if (!this.keyboardManager.areKeysPressed(this.requiredKeys)) {
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
        this.element.removeEventListener(changeOptionsEventName, this.handleOptionsChange.bind(this));
        var changeStateEventName = "".concat(this.name, "ChangeState");
        this.element.removeEventListener(changeStateEventName, this.handleStateChange.bind(this));
    };
    return Gesture;
}());
exports.Gesture = Gesture;
