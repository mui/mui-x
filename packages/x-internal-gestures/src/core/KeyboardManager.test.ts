import { describe, expect, it, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import { KeyboardManager } from './KeyboardManager';

describe('KeyboardManager', () => {
  let keyboardManager: KeyboardManager;
  let addEventListenerSpy: MockInstance;
  let removeEventListenerSpy: MockInstance;

  beforeEach(() => {
    // Spy on window event listener methods
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    // Get a fresh instance of KeyboardManager
    keyboardManager = new KeyboardManager();
  });

  afterEach(() => {
    keyboardManager.destroy();
    vi.restoreAllMocks();
  });

  it('should add event listeners on initialization', () => {
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));
  });

  it('should remove event listeners on destroy', () => {
    keyboardManager.destroy();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));
  });

  it('should track pressed keys', () => {
    // Simulate key press events
    const keydownEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    window.dispatchEvent(keydownEvent);

    expect(keyboardManager.areKeysPressed(['Shift'])).toBe(true);
    expect(keyboardManager.areKeysPressed(['Alt'])).toBe(false);
    expect(keyboardManager.areKeysPressed(['Shift', 'Alt'])).toBe(false);

    // Simulate another key press
    const keydownEvent2 = new KeyboardEvent('keydown', { key: 'Alt' });
    window.dispatchEvent(keydownEvent2);

    expect(keyboardManager.areKeysPressed(['Shift'])).toBe(true);
    expect(keyboardManager.areKeysPressed(['Alt'])).toBe(true);
    expect(keyboardManager.areKeysPressed(['Shift', 'Alt'])).toBe(true);
  });

  it('should track key releases', () => {
    // Press keys
    const keydownEvent1 = new KeyboardEvent('keydown', { key: 'Shift' });
    const keydownEvent2 = new KeyboardEvent('keydown', { key: 'Alt' });
    window.dispatchEvent(keydownEvent1);
    window.dispatchEvent(keydownEvent2);

    expect(keyboardManager.areKeysPressed(['Shift', 'Alt'])).toBe(true);

    // Release a key
    const keyupEvent = new KeyboardEvent('keyup', { key: 'Shift' });
    window.dispatchEvent(keyupEvent);

    expect(keyboardManager.areKeysPressed(['Shift'])).toBe(false);
    expect(keyboardManager.areKeysPressed(['Alt'])).toBe(true);
    expect(keyboardManager.areKeysPressed(['Shift', 'Alt'])).toBe(false);
  });

  it('should clear all keys on window blur', () => {
    // Press keys
    const keydownEvent1 = new KeyboardEvent('keydown', { key: 'Shift' });
    const keydownEvent2 = new KeyboardEvent('keydown', { key: 'Alt' });
    window.dispatchEvent(keydownEvent1);
    window.dispatchEvent(keydownEvent2);

    expect(keyboardManager.areKeysPressed(['Shift', 'Alt'])).toBe(true);

    // Trigger window blur
    const blurEvent = new Event('blur');
    window.dispatchEvent(blurEvent);

    expect(keyboardManager.areKeysPressed(['Shift'])).toBe(false);
    expect(keyboardManager.areKeysPressed(['Alt'])).toBe(false);
  });

  it('should handle undefined or empty key arrays', () => {
    expect(keyboardManager.areKeysPressed()).toBe(true);
    expect(keyboardManager.areKeysPressed([])).toBe(true);
  });
});
