"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestureManager = void 0;
var ActiveGesturesRegistry_1 = require("./ActiveGesturesRegistry");
var KeyboardManager_1 = require("./KeyboardManager");
var PointerManager_1 = require("./PointerManager");
/**
 * The primary class responsible for setting up and managing gestures across multiple elements.
 *
 * GestureManager maintains a collection of gesture templates that can be instantiated for
 * specific DOM elements. It handles lifecycle management, event dispatching, and cleanup.
 *
 * @example
 * ```typescript
 * // Basic setup with default gestures
 * const manager = new GestureManager({
 *   root: document.body,
 *   touchAction: 'none',
 *   gestures: [
 *     new PanGesture({ name: 'pan' }),
 *   ],
 * });
 *
 * // Register pan gestures on an element
 * const element = manager.registerElement('pan', document.querySelector('.draggable'));
 *
 * // Add event listeners with proper typing
 * element.addEventListener('panStart', (event) => {
 *   console.log('Pan started');
 * });
 *
 * element.addEventListener('pan', (event) => {
 *   console.log(`Pan delta: ${event.deltaX}, ${event.deltaY}`);
 * });
 *
 * // Custom gesture types
 * interface MyGestureEvents {
 *   custom: { x: number, y: number }
 * }
 * const customManager = new GestureManager<MyGestureEvents>({
 *   root: document.body
 *   gestures: [
 *     new CustomGesture({ name: 'custom' }),
 *   ],
 * });
 * ```
 */
var GestureManager = /** @class */ (function () {
    /**
     * Create a new GestureManager instance to coordinate gesture recognition
     *
     * @param options - Configuration options for the gesture manager
     */
    function GestureManager(options) {
        var _this = this;
        /** Repository of gesture templates that can be cloned for specific elements */
        this.gestureTemplates = new Map();
        /** Maps DOM elements to their active gesture instances */
        this.elementGestureMap = new Map();
        this.activeGesturesRegistry = new ActiveGesturesRegistry_1.ActiveGesturesRegistry();
        this.keyboardManager = new KeyboardManager_1.KeyboardManager();
        // Initialize the PointerManager
        this.pointerManager = new PointerManager_1.PointerManager({
            root: options.root,
            touchAction: options.touchAction,
            passive: options.passive,
        });
        // Add initial gestures as templates if provided
        if (options.gestures && options.gestures.length > 0) {
            options.gestures.forEach(function (gesture) {
                _this.addGestureTemplate(gesture);
            });
        }
    }
    /**
     * Add a gesture template to the manager's template registry.
     * Templates serve as prototypes that can be cloned for individual elements.
     *
     * @param gesture - The gesture instance to use as a template
     */
    GestureManager.prototype.addGestureTemplate = function (gesture) {
        if (this.gestureTemplates.has(gesture.name)) {
            console.warn("Gesture template with name \"".concat(gesture.name, "\" already exists. It will be overwritten."));
        }
        this.gestureTemplates.set(gesture.name, gesture);
    };
    /**
     * Updates the options for a specific gesture on a given element and emits a change event.
     *
     * @param gestureName - Name of the gesture whose options should be updated
     * @param element - The DOM element where the gesture is attached
     * @param options - New options to apply to the gesture
     * @returns True if the options were successfully updated, false if the gesture wasn't found
     *
     * @example
     * ```typescript
     * // Update pan gesture sensitivity on the fly
     * manager.setGestureOptions('pan', element, { threshold: 5 });
     * ```
     */
    GestureManager.prototype.setGestureOptions = function (gestureName, element, options) {
        var elementGestures = this.elementGestureMap.get(element);
        if (!elementGestures || !elementGestures.has(gestureName)) {
            console.error("Gesture \"".concat(gestureName, "\" not found on the provided element."));
            return;
        }
        var event = new CustomEvent("".concat(gestureName, "ChangeOptions"), {
            detail: options,
            bubbles: false,
            cancelable: false,
            composed: false,
        });
        element.dispatchEvent(event);
    };
    /**
     * Updates the state for a specific gesture on a given element and emits a change event.
     *
     * @param gestureName - Name of the gesture whose state should be updated
     * @param element - The DOM element where the gesture is attached
     * @param state - New state to apply to the gesture
     * @returns True if the state was successfully updated, false if the gesture wasn't found
     *
     * @example
     * ```typescript
     * // Update total delta for a turnWheel gesture
     * manager.setGestureState('turnWheel', element, { totalDeltaX: 10 });
     * ```
     */
    GestureManager.prototype.setGestureState = function (gestureName, element, state) {
        var elementGestures = this.elementGestureMap.get(element);
        if (!elementGestures || !elementGestures.has(gestureName)) {
            console.error("Gesture \"".concat(gestureName, "\" not found on the provided element."));
            return;
        }
        var event = new CustomEvent("".concat(gestureName, "ChangeState"), {
            detail: state,
            bubbles: false,
            cancelable: false,
            composed: false,
        });
        element.dispatchEvent(event);
    };
    /**
     * Register an element to recognize one or more gestures.
     *
     * This method clones the specified gesture template(s) and creates
     * gesture recognizer instance(s) specifically for the provided element.
     * The element is returned with enhanced TypeScript typing for gesture events.
     *
     * @param gestureNames - Name(s) of the gesture(s) to register (must match template names)
     * @param element - The DOM element to attach the gesture(s) to
     * @param options - Optional map of gesture-specific options to override when registering
     * @returns The same element with properly typed event listeners
     *
     * @example
     * ```typescript
     * // Register multiple gestures
     * const element = manager.registerElement(['pan', 'pinch'], myDiv);
     *
     * // Register a single gesture
     * const draggable = manager.registerElement('pan', dragHandle);
     *
     * // Register with customized options for each gesture
     * const customElement = manager.registerElement(
     *   ['pan', 'pinch', 'rotate'],
     *   myElement,
     *   {
     *     pan: { threshold: 20, direction: ['left', 'right'] },
     *     pinch: { threshold: 0.1 }
     *   }
     * );
     * ```
     */
    GestureManager.prototype.registerElement = function (gestureNames, element, options) {
        var _this = this;
        // Handle array of gesture names
        if (!Array.isArray(gestureNames)) {
            gestureNames = [gestureNames];
        }
        gestureNames.forEach(function (name) {
            var gestureOptions = options === null || options === void 0 ? void 0 : options[name];
            _this.registerSingleGesture(name, element, gestureOptions);
        });
        return element;
    };
    /**
     * Internal method to register a single gesture on an element.
     *
     * @param gestureName - Name of the gesture to register
     * @param element - DOM element to attach the gesture to
     * @param options - Optional options to override the gesture template configuration
     * @returns True if the registration was successful, false otherwise
     */
    GestureManager.prototype.registerSingleGesture = function (gestureName, element, options) {
        // Find the gesture template
        var gestureTemplate = this.gestureTemplates.get(gestureName);
        if (!gestureTemplate) {
            console.error("Gesture template \"".concat(gestureName, "\" not found."));
            return false;
        }
        // Create element's gesture map if it doesn't exist
        if (!this.elementGestureMap.has(element)) {
            this.elementGestureMap.set(element, new Map());
        }
        // Check if this element already has this gesture registered
        var elementGestures = this.elementGestureMap.get(element);
        if (elementGestures.has(gestureName)) {
            console.warn("Element already has gesture \"".concat(gestureName, "\" registered. It will be replaced."));
            // Unregister the existing gesture first
            this.unregisterElement(gestureName, element);
        }
        // Clone the gesture template and create a new instance with optional overrides
        // This allows each element to have its own state, event listeners, and configuration
        var gestureInstance = gestureTemplate.clone(options);
        gestureInstance.init(element, this.pointerManager, this.activeGesturesRegistry, this.keyboardManager);
        // Store the gesture in the element's gesture map
        elementGestures.set(gestureName, gestureInstance);
        return true;
    };
    /**
     * Unregister a specific gesture from an element.
     * This removes the gesture recognizer and stops event emission for that gesture.
     *
     * @param gestureName - Name of the gesture to unregister
     * @param element - The DOM element to remove the gesture from
     * @returns True if the gesture was found and removed, false otherwise
     */
    GestureManager.prototype.unregisterElement = function (gestureName, element) {
        var elementGestures = this.elementGestureMap.get(element);
        if (!elementGestures || !elementGestures.has(gestureName)) {
            return false;
        }
        // Destroy the gesture instance
        var gesture = elementGestures.get(gestureName);
        gesture.destroy();
        // Remove from the map
        elementGestures.delete(gestureName);
        this.activeGesturesRegistry.unregisterElement(element);
        // Remove the element from the map if it no longer has any gestures
        if (elementGestures.size === 0) {
            this.elementGestureMap.delete(element);
        }
        return true;
    };
    /**
     * Unregister all gestures from an element.
     * Completely removes the element from the gesture system.
     *
     * @param element - The DOM element to remove all gestures from
     */
    GestureManager.prototype.unregisterAllGestures = function (element) {
        var elementGestures = this.elementGestureMap.get(element);
        if (elementGestures) {
            // Unregister all gestures for this element
            for (var _i = 0, elementGestures_1 = elementGestures; _i < elementGestures_1.length; _i++) {
                var _a = elementGestures_1[_i], gesture = _a[1];
                gesture.destroy();
                this.activeGesturesRegistry.unregisterElement(element);
            }
            // Clear the map
            this.elementGestureMap.delete(element);
        }
    };
    /**
     * Clean up all gestures and event listeners.
     * Call this method when the GestureManager is no longer needed to prevent memory leaks.
     */
    GestureManager.prototype.destroy = function () {
        // Unregister all element gestures
        for (var _i = 0, _a = this.elementGestureMap; _i < _a.length; _i++) {
            var element = _a[_i][0];
            this.unregisterAllGestures(element);
        }
        // Clear all templates
        this.gestureTemplates.clear();
        this.elementGestureMap.clear();
        this.activeGesturesRegistry.destroy();
        this.keyboardManager.destroy();
        this.pointerManager.destroy();
    };
    return GestureManager;
}());
exports.GestureManager = GestureManager;
