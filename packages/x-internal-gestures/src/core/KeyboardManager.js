"use strict";
/**
 * KeyboardManager - Manager for keyboard events in the gesture recognition system
 *
 * This class tracks keyboard state:
 * 1. Capturing and tracking all pressed keys
 * 2. Providing methods to check if specific keys are pressed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardManager = void 0;
/**
 * Class responsible for tracking keyboard state
 */
var KeyboardManager = /** @class */ (function () {
    /**
     * Create a new KeyboardManager instance
     */
    function KeyboardManager() {
        var _this = this;
        this.pressedKeys = new Set();
        /**
         * Handle keydown events
         */
        this.handleKeyDown = function (event) {
            _this.pressedKeys.add(event.key);
        };
        /**
         * Handle keyup events
         */
        this.handleKeyUp = function (event) {
            _this.pressedKeys.delete(event.key);
        };
        /**
         * Clear all pressed keys
         */
        this.clearKeys = function () {
            _this.pressedKeys.clear();
        };
        this.initialize();
    }
    /**
     * Initialize the keyboard event listeners
     */
    KeyboardManager.prototype.initialize = function () {
        if (typeof window === 'undefined') {
            return;
        }
        // Add keyboard event listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        // Reset keys when window loses focus
        window.addEventListener('blur', this.clearKeys);
    };
    /**
     * Check if a set of keys are all currently pressed
     * @param keys The keys to check
     * @returns True if all specified keys are pressed, false otherwise
     */
    KeyboardManager.prototype.areKeysPressed = function (keys) {
        var _this = this;
        if (!keys || keys.length === 0) {
            return true; // No keys required means the condition is satisfied
        }
        return keys.every(function (key) {
            if (key === 'ControlOrMeta') {
                // May be "deprecated" on types, but it is still the best option for cross-platform detection
                // https://stackoverflow.com/a/71785253/24269134
                return navigator.platform.includes('Mac')
                    ? _this.pressedKeys.has('Meta')
                    : _this.pressedKeys.has('Control');
            }
            return _this.pressedKeys.has(key);
        });
    };
    /**
     * Cleanup method to remove event listeners
     */
    KeyboardManager.prototype.destroy = function () {
        if (typeof window !== 'undefined') {
            window.removeEventListener('keydown', this.handleKeyDown);
            window.removeEventListener('keyup', this.handleKeyUp);
            window.removeEventListener('blur', this.clearKeys);
        }
        this.clearKeys();
    };
    return KeyboardManager;
}());
exports.KeyboardManager = KeyboardManager;
