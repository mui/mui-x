"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var KeyboardManager_1 = require("./KeyboardManager");
(0, vitest_1.describe)('KeyboardManager', function () {
    var keyboardManager;
    var addEventListenerSpy;
    var removeEventListenerSpy;
    (0, vitest_1.beforeEach)(function () {
        // Spy on window event listener methods
        addEventListenerSpy = vitest_1.vi.spyOn(window, 'addEventListener');
        removeEventListenerSpy = vitest_1.vi.spyOn(window, 'removeEventListener');
        // Get a fresh instance of KeyboardManager
        keyboardManager = new KeyboardManager_1.KeyboardManager();
    });
    (0, vitest_1.afterEach)(function () {
        keyboardManager.destroy();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('should add event listeners on initialization', function () {
        (0, vitest_1.expect)(addEventListenerSpy).toHaveBeenCalledWith('keydown', vitest_1.expect.any(Function));
        (0, vitest_1.expect)(addEventListenerSpy).toHaveBeenCalledWith('keyup', vitest_1.expect.any(Function));
        (0, vitest_1.expect)(addEventListenerSpy).toHaveBeenCalledWith('blur', vitest_1.expect.any(Function));
    });
    (0, vitest_1.it)('should remove event listeners on destroy', function () {
        keyboardManager.destroy();
        (0, vitest_1.expect)(removeEventListenerSpy).toHaveBeenCalledWith('keydown', vitest_1.expect.any(Function));
        (0, vitest_1.expect)(removeEventListenerSpy).toHaveBeenCalledWith('keyup', vitest_1.expect.any(Function));
        (0, vitest_1.expect)(removeEventListenerSpy).toHaveBeenCalledWith('blur', vitest_1.expect.any(Function));
    });
    (0, vitest_1.it)('should track pressed keys', function () {
        // Simulate key press events
        var keydownEvent = new KeyboardEvent('keydown', { key: 'Shift' });
        window.dispatchEvent(keydownEvent);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Shift'])).toBe(true);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Alt'])).toBe(false);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Shift', 'Alt'])).toBe(false);
        // Simulate another key press
        var keydownEvent2 = new KeyboardEvent('keydown', { key: 'Alt' });
        window.dispatchEvent(keydownEvent2);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Shift'])).toBe(true);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Alt'])).toBe(true);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Shift', 'Alt'])).toBe(true);
    });
    (0, vitest_1.it)('should track key releases', function () {
        // Press keys
        var keydownEvent1 = new KeyboardEvent('keydown', { key: 'Shift' });
        var keydownEvent2 = new KeyboardEvent('keydown', { key: 'Alt' });
        window.dispatchEvent(keydownEvent1);
        window.dispatchEvent(keydownEvent2);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Shift', 'Alt'])).toBe(true);
        // Release a key
        var keyupEvent = new KeyboardEvent('keyup', { key: 'Shift' });
        window.dispatchEvent(keyupEvent);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Shift'])).toBe(false);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Alt'])).toBe(true);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Shift', 'Alt'])).toBe(false);
    });
    (0, vitest_1.it)('should clear all keys on window blur', function () {
        // Press keys
        var keydownEvent1 = new KeyboardEvent('keydown', { key: 'Shift' });
        var keydownEvent2 = new KeyboardEvent('keydown', { key: 'Alt' });
        window.dispatchEvent(keydownEvent1);
        window.dispatchEvent(keydownEvent2);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Shift', 'Alt'])).toBe(true);
        // Trigger window blur
        var blurEvent = new Event('blur');
        window.dispatchEvent(blurEvent);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Shift'])).toBe(false);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed(['Alt'])).toBe(false);
    });
    (0, vitest_1.it)('should handle undefined or empty key arrays', function () {
        (0, vitest_1.expect)(keyboardManager.areKeysPressed()).toBe(true);
        (0, vitest_1.expect)(keyboardManager.areKeysPressed([])).toBe(true);
    });
});
