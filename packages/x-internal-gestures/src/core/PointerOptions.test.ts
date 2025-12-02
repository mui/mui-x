import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mouseGesture, touchGesture } from '../testing';
import { GestureManager } from './GestureManager';
import { TapGesture } from './gestures/TapGesture';
import { PanGesture } from './gestures/PanGesture';

describe('Gesture PointerOptions', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureTapManager: GestureManager<'universalTap', TapGesture<'universalTap'>>;
  let gesturePanManager: GestureManager<'universalPan', PanGesture<'universalPan'>>;
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
    gestureTapManager?.destroy();
    gesturePanManager?.destroy();
    document.body.removeChild(container);
  });

  it('should respect pointer mode-specific required keys configuration', async () => {
    // Create gesture with different key requirements for different pointer modes
    gestureTapManager = new GestureManager({
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

    const gestureTarget = gestureTapManager.registerElement(['universalTap'], target);
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

  it('should respect pointer mode-specific minPointers configuration', async () => {
    // Create gesture with different minPointers requirements for different pointer modes
    gesturePanManager = new GestureManager({
      gestures: [
        new PanGesture({
          name: 'universalPan',
          minPointers: 1, // Default requires 1 pointer
          pointerOptions: {
            touch: { minPointers: 2 }, // Touch requires 2 pointers
          },
        }),
      ],
    });

    const gestureTarget = gesturePanManager.registerElement(['universalPan'], target);
    gestureTarget.addEventListener('universalPanStart', (event) =>
      events.push(`${event.detail.srcEvent.pointerType}:universalPanStart`),
    );

    // Test touch with 1 pointer - should NOT trigger
    await touchGesture.pan({ target, distance: 10 });
    expect(events).toEqual([]);

    // Test touch with 2 pointers - should trigger
    await touchGesture.pan({
      target,
      distance: 10,
      steps: 2,
      pointers: { amount: 2 },
    });
    expect(events).toEqual(['touch:universalPanStart']);
  });

  it('should respect pointer mode-specific maxPointers configuration', async () => {
    // Create gesture with different maxPointers limits for different pointer modes
    gesturePanManager = new GestureManager({
      gestures: [
        new PanGesture({
          name: 'universalPan',
          maxPointers: 3, // Default allows up to 3 pointers
          pointerOptions: {
            touch: { maxPointers: 2 }, // Touch allows up to 2 pointers
          },
        }),
      ],
    });

    const gestureTarget = gesturePanManager.registerElement(['universalPan'], target);
    gestureTarget.addEventListener('universalPanStart', (event) =>
      events.push(`${event.detail.srcEvent.pointerType}:universalPanStart`),
    );

    // Test touch with 3 pointers - should NOT trigger (exceeds limit)
    await touchGesture.pan({
      target,
      distance: 10,
      pointers: { amount: 3 },
    });
    expect(events).toEqual([]);

    // Test touch with 2 pointers - should trigger (within limit)
    await touchGesture.pan({
      target,
      distance: 10,
      pointers: { amount: 2 },
    });
    expect(events).toEqual(['touch:universalPanStart']);

    // Test touch with 1 pointer - should trigger
    await touchGesture.pan({ target, distance: 10 });
    expect(events).toEqual(['touch:universalPanStart', 'touch:universalPanStart']);

    // Test mouse with 1 pointer - should trigger (within limit)
    await mouseGesture.pan({ target, distance: 10 });
    expect(events).toEqual([
      'touch:universalPanStart',
      'touch:universalPanStart',
      'mouse:universalPanStart',
    ]);
  });
});
