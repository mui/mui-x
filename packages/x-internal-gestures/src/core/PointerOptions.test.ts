import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mouseGesture, touchGesture } from '../testing';
import { GestureManager } from './GestureManager';
import { TapGesture } from './gestures/TapGesture';

describe('Gesture PointerOptions', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<'universalTap', TapGesture<'universalTap'>>;
  let events: string[];

  beforeEach(() => {
    events = [];

    // Set up DOM
    container = document.createElement('div');
    container.style.width = '200px';
    container.style.height = '200px';
    document.body.appendChild(container);

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);
  });

  afterEach(() => {
    gestureManager?.destroy();
    document.body.removeChild(container);
  });

  it('should respect pointer mode-specific required keys configuration', async () => {
    // Create gesture with different key requirements for different pointer modes
    gestureManager = new GestureManager({
      gestures: [
        new TapGesture({
          name: 'universalTap',
          requiredKeys: [], // No keys required by default
          pointerOptions: {
            mouse: { requiredKeys: ['Control'] }, // Mouse requires Control
            touch: { requiredKeys: [] }, // Touch has no key requirement
          },
        }),
      ],
    });

    const gestureTarget = gestureManager.registerElement(['universalTap'], target);
    gestureTarget.addEventListener('universalTap', (event) =>
      events.push(`${event.detail.srcEvent.pointerType}:universalTap`),
    );

    await touchGesture.tap({ target });
    expect(events).toEqual(['touch:universalTap']);

    // Test mouse without required key - should NOT trigger
    await mouseGesture.tap({ target });
    expect(events).toEqual(['touch:universalTap']);

    // Test mouse with Control key - should trigger
    const keydownControl = new KeyboardEvent('keydown', { key: 'Control' });
    window.dispatchEvent(keydownControl);
    await mouseGesture.tap({ target });
    const keyupControl = new KeyboardEvent('keyup', { key: 'Control' });
    window.dispatchEvent(keyupControl);
    expect(events).toEqual(['touch:universalTap', 'mouse:universalTap']);
  });
});
