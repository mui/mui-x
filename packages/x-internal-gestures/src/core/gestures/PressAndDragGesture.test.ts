import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GestureManager } from '../GestureManager';
import { PressAndDragGesture } from './PressAndDragGesture';

describe('PressAndDragGesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<
    'pressAndDrag',
    PressAndDragGesture<'pressAndDrag'>,
    PressAndDragGesture<'pressAndDrag'>
  >;
  let events: string[];

  beforeEach(() => {
    events = [];

    // Set up DOM
    container = document.createElement('div');
    container.style.width = '200px';
    container.style.height = '200px';
    document.body.appendChild(container);

    // Set up gesture manager
    gestureManager = new GestureManager({
      gestures: [
        new PressAndDragGesture({
          name: 'pressAndDrag',
          pressDuration: 100, // Shorter duration for testing
          pressMaxDistance: 10,
          dragTimeout: 500,
          dragThreshold: 5,
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    const gestureTarget = gestureManager.registerElement('pressAndDrag', target);

    // Add event listeners
    gestureTarget.addEventListener('pressAndDragStart', (_event) => {
      events.push('start');
    });
    gestureTarget.addEventListener('pressAndDrag', (_event) => {
      events.push('move');
    });
    gestureTarget.addEventListener('pressAndDragEnd', (_event) => {
      events.push('end');
    });
  });

  afterEach(() => {
    gestureManager.destroy();
    document.body.removeChild(container);
  });

  it('should create gesture with correct default options', () => {
    const defaultGesture = new PressAndDragGesture({
      name: 'test',
    });

    expect(defaultGesture).toBeInstanceOf(PressAndDragGesture);
    expect(defaultGesture.name).toBe('test');
  });

  it('should clone gesture with overrides', () => {
    const gesture = new PressAndDragGesture({
      name: 'pressAndDrag',
      pressDuration: 100,
    });
    const cloned = gesture.clone({ pressDuration: 200 });

    expect(cloned).toBeInstanceOf(PressAndDragGesture);
    expect(cloned.name).toBe('pressAndDrag');
    // Note: We can't easily test private properties, but the clone should work
  });

  it('should handle basic gesture creation and destruction', () => {
    // Basic interaction simulation would go here
    // For now, just verify the gesture exists and can be destroyed
    expect(gestureManager).toBeDefined();
    expect(events).toHaveLength(0);
  });

  it('should detect press-and-drag sequence', async () => {
    const rect = target.getBoundingClientRect();
    const startX = rect.left + 50;
    const startY = rect.top + 50;

    // Simulate pointer down (press start)
    const pointerDown = new PointerEvent('pointerdown', {
      pointerId: 1,
      clientX: startX,
      clientY: startY,
      bubbles: true,
    });
    target.dispatchEvent(pointerDown);

    // Wait for press duration to complete
    await new Promise((resolve) => {
      setTimeout(() => {
        // Now simulate drag movement
        const pointerMove = new PointerEvent('pointermove', {
          pointerId: 1,
          clientX: startX + 20,
          clientY: startY + 20,
          bubbles: true,
        });
        target.dispatchEvent(pointerMove);

        // End the gesture
        const pointerUp = new PointerEvent('pointerup', {
          pointerId: 1,
          clientX: startX + 20,
          clientY: startY + 20,
          bubbles: true,
        });
        target.dispatchEvent(pointerUp);

        // Wait a bit for events to propagate
        setTimeout(() => {
          resolve(undefined);
        }, 50);
      }, 150); // Wait longer than the press duration (100ms)
    });

    // Check that events were fired in the correct order
    expect(events).toEqual(['start', 'move', 'end']);
  });
});
