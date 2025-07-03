import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mouseGesture } from '../testing';
import { GestureManager } from './GestureManager';
import { TapGesture } from './gestures/TapGesture';

describe('Gesture Keyboard Filter Dynamic Updates', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<'dynamicTap', TapGesture<'dynamicTap'>>;
  let events: string[];

  beforeEach(() => {
    events = [];

    // Set up DOM
    container = document.createElement('div');
    container.style.width = '200px';
    container.style.height = '200px';
    document.body.appendChild(container);

    // Set up gesture manager with a tap gesture that has no initial key requirements
    gestureManager = new GestureManager({
      gestures: [
        new TapGesture({
          name: 'dynamicTap',
          // No keys requirement initially
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    // Register the gesture on the target
    const gestureTarget = gestureManager.registerElement('dynamicTap', target);

    // Add event listener
    gestureTarget.addEventListener('dynamicTap', () => {
      events.push('dynamicTap');
    });
  });

  afterEach(() => {
    gestureManager.destroy();
    container.remove();
    events = [];
  });

  it('should initially trigger the gesture without any keys pressed', async () => {
    // Perform a tap with no keys pressed
    await mouseGesture.tap({ target });

    // Should trigger the gesture
    expect(events).toEqual(['dynamicTap']);
  });

  it('should respect dynamically updated key requirements', async () => {
    // Update the gesture to require Shift key
    gestureManager.setGestureOptions('dynamicTap', target, {
      keys: ['Shift'],
    });

    // Perform a tap with no keys pressed
    await mouseGesture.tap({ target });

    // Should not trigger the gesture
    expect(events).toEqual([]);

    // Press Shift key
    const keydownEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    window.dispatchEvent(keydownEvent);

    // Perform a tap with Shift key pressed
    await mouseGesture.tap({ target });

    // Should trigger the gesture
    expect(events).toEqual(['dynamicTap']);

    // Release Shift key
    const keyupEvent = new KeyboardEvent('keyup', { key: 'Shift' });
    window.dispatchEvent(keyupEvent);
  });

  it('should support removing key requirements dynamically', async () => {
    // First add a key requirement
    gestureManager.setGestureOptions('dynamicTap', target, {
      keys: ['Control'],
    });

    // Perform a tap with no keys pressed
    await mouseGesture.tap({ target });

    // Should not trigger the gesture
    expect(events).toEqual([]);

    // Now remove the key requirement
    gestureManager.setGestureOptions('dynamicTap', target, {
      keys: [], // Empty array removes the requirement
    });

    // Perform a tap with no keys pressed
    await mouseGesture.tap({ target });

    // Should trigger the gesture
    expect(events).toEqual(['dynamicTap']);
  });

  it('should support changing key requirements dynamically', async () => {
    // First require Control key
    gestureManager.setGestureOptions('dynamicTap', target, {
      keys: ['Control'],
    });

    // Press Control key
    const keydownCtrl = new KeyboardEvent('keydown', { key: 'Control' });
    window.dispatchEvent(keydownCtrl);

    // Perform a tap with Control key pressed
    await mouseGesture.tap({ target });

    // Should trigger the gesture
    expect(events).toEqual(['dynamicTap']);
    events = []; // Clear events

    // Change to require Shift key instead
    gestureManager.setGestureOptions('dynamicTap', target, {
      keys: ['Shift'],
    });

    // Perform a tap with Control key still pressed (but now Shift is required)
    await mouseGesture.tap({ target });

    // Should not trigger the gesture
    expect(events).toEqual([]);

    // Press Shift key
    const keydownShift = new KeyboardEvent('keydown', { key: 'Shift' });
    window.dispatchEvent(keydownShift);

    // Perform a tap with both Control and Shift keys pressed
    await mouseGesture.tap({ target });

    // Should trigger the gesture
    expect(events).toEqual(['dynamicTap']);

    // Release keys
    const keyupCtrl = new KeyboardEvent('keyup', { key: 'Control' });
    const keyupShift = new KeyboardEvent('keyup', { key: 'Shift' });
    window.dispatchEvent(keyupCtrl);
    window.dispatchEvent(keyupShift);
  });
});
