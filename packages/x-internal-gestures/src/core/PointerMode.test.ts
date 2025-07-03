import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mouseGesture, touchGesture } from '../testing';
import { GestureManager } from './GestureManager';
import { TapGesture } from './gestures/TapGesture';

describe('Pointer Mode Filter', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let events: string[];
  let gestureManager: GestureManager<any, any>;

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
    // Clean up
    gestureManager.destroy();
    container.remove();
    vi.restoreAllMocks();
  });

  it('should only trigger gestures for specified pointer types', async () => {
    // Set up gesture manager with three tap gestures:
    // 1. mouseTap: only triggered by mouse events
    // 2. touchTap: only triggered by touch events
    // 3. anyTap: triggered by any pointer type
    gestureManager = new GestureManager({
      gestures: [
        new TapGesture({
          name: 'mouseTap',
          pointerMode: ['mouse'],
        }),
        new TapGesture({
          name: 'touchTap',
          pointerMode: ['touch'],
        }),
        new TapGesture({
          name: 'anyTap',
          // No pointerMode specified, accepts all pointer types
        }),
      ],
    });

    // Register gestures on the element
    const gestureTarget = gestureManager.registerElement(
      ['mouseTap', 'touchTap', 'anyTap'],
      target,
    );

    // Add event listeners for all gesture types
    gestureTarget.addEventListener('mouseTap', () => events.push('mouseTap'));
    gestureTarget.addEventListener('touchTap', () => events.push('touchTap'));
    gestureTarget.addEventListener('anyTap', () => events.push('anyTap'));

    // Test 1: Mouse gesture (move) should trigger mouseTap and anyTap gestures but not touchTap
    await mouseGesture.tap({ target });

    expect(events).toContain('mouseTap');
    expect(events).not.toContain('touchTap');
    expect(events).toContain('anyTap');

    // Reset events arrays
    events = [];

    // Test 2: Touch gesture (tap) should trigger touchTap and anyTap gestures but not mouseTap
    await touchGesture.tap({ target });

    expect(events).not.toContain('mouseTap');
    expect(events).toContain('touchTap');
    expect(events).toContain('anyTap');
  });

  it('should update pointerMode at runtime via setGestureOptions', async () => {
    // Set up gesture manager with a single tap gesture that initially accepts all pointer types
    gestureManager = new GestureManager({
      gestures: [
        new TapGesture({
          name: 'dynamicTap',
          // No pointerMode initially, accepts all pointer types
        }),
      ],
    });

    // Register the gesture on the element
    const gestureTarget = gestureManager.registerElement('dynamicTap', target);

    // Add event listeners
    gestureTarget.addEventListener('dynamicTap', () => events.push('dynamicTap'));

    // Test 1: Initially, both touch and mouse gestures should trigger events
    await touchGesture.tap({ target });

    expect(events).toContain('dynamicTap');

    // Reset events
    events = [];

    await mouseGesture.tap({ target });

    expect(events).toContain('dynamicTap');

    // Reset events
    events = [];

    // Test 2: Update to only allow touch gestures
    gestureManager.setGestureOptions('dynamicTap', target, {
      pointerMode: ['touch'],
    });

    // Touch gesture should still work
    await touchGesture.tap({ target });

    expect(events).toContain('dynamicTap');

    // Reset events
    events = [];

    // Mouse gesture should no longer work
    await mouseGesture.tap({ target });

    expect(events).toStrictEqual([]); // No events should be triggered for mouse

    // Test 3: Update to only allow mouse gestures
    gestureManager.setGestureOptions('dynamicTap', target, {
      pointerMode: ['mouse'],
    });

    // Reset events
    events = [];

    // Touch gesture should no longer work
    await touchGesture.tap({ target });

    expect(events).toStrictEqual([]); // No events should be triggered for touch

    // Mouse gesture should work again
    await mouseGesture.tap({ target });

    expect(events).toContain('dynamicTap');
  });

  it('should support multiple pointer types in pointerMode array', async () => {
    // Set up gesture manager with a tap gesture that accepts both mouse and touch
    gestureManager = new GestureManager({
      gestures: [
        new TapGesture({
          name: 'multiTap',
          pointerMode: ['mouse', 'touch'], // Accept both mouse and touch
        }),
      ],
    });

    // Register the gesture on the element
    const gestureTarget = gestureManager.registerElement('multiTap', target);

    // Add event listeners
    gestureTarget.addEventListener('multiTap', () => events.push('multiTap'));

    // Test 1: Mouse gesture should work
    await mouseGesture.tap({ target });

    expect(events).toContain('multiTap');

    // Reset events
    events = [];

    // Test 2: Touch gesture should also work
    await touchGesture.tap({ target });

    expect(events).toContain('multiTap');
  });
});
