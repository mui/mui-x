import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mouseGesture } from '../testing';
import { GestureManager } from './GestureManager';
import { TapGesture } from './gestures/TapGesture';

describe('Gesture Keyboard Filter', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<
    'tap' | 'shiftTap',
    TapGesture<'tap'> | TapGesture<'shiftTap'>
  >;
  let events: string[];

  beforeEach(() => {
    events = [];

    // Set up DOM
    container = document.createElement('div');
    container.style.width = '200px';
    container.style.height = '200px';
    document.body.appendChild(container);

    // Set up gesture manager with two tap gestures:
    // 1. Regular tap with no key requirements
    // 2. Shift tap that requires the Shift key to be pressed
    gestureManager = new GestureManager({
      gestures: [
        new TapGesture({
          name: 'tap',
        }),
        new TapGesture({
          name: 'shiftTap',
          keys: ['Shift'], // This gesture requires Shift key to be pressed
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    // Register both gestures on the same target
    const gestureTarget = gestureManager.registerElement(['tap', 'shiftTap'], target);

    // Add event listeners for both gestures
    gestureTarget.addEventListener('tap', () => events.push('tap'));

    gestureTarget.addEventListener('shiftTap', () => events.push('shiftTap'));
  });

  afterEach(() => {
    gestureManager.destroy();
    container.remove();
    events = [];
  });

  it('should trigger regular tap gesture without any keys pressed', async () => {
    // Perform a tap with no keys pressed
    await mouseGesture.tap({ target });

    // Should trigger only the regular tap
    expect(events).toEqual(['tap']);
    expect(events).not.toContain('shiftTap');
  });

  it('should trigger both regular tap and shift-tap gestures when Shift key is pressed', async () => {
    // Simulate Shift key press
    const keydownEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    window.dispatchEvent(keydownEvent);

    // Perform a tap with Shift key pressed
    await mouseGesture.tap({ target });

    // Should trigger both gestures
    expect(events).toStrictEqual(['tap', 'shiftTap']);
  });

  it('should not trigger shift-tap gesture after Shift key is released', async () => {
    // Simulate Shift key press then release
    const keydownEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    window.dispatchEvent(keydownEvent);
    const keyupEvent = new KeyboardEvent('keyup', { key: 'Shift' });
    window.dispatchEvent(keyupEvent);

    // Perform a tap with no keys pressed
    await mouseGesture.tap({ target });

    // Should trigger only the regular tap
    expect(events).toEqual(['tap']);
    expect(events).not.toContain('shiftTap');
  });
});
