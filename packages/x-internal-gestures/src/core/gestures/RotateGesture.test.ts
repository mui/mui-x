import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { touchGesture } from '../../testing';
import { GestureManager } from '../GestureManager';
import { RotateGesture } from './RotateGesture';

describe('Rotate Gesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<'rotate', RotateGesture<'rotate'>, RotateGesture<'rotate'>>;
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
        new RotateGesture({
          name: 'rotate',
          minPointers: 2,
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    const gestureTarget = gestureManager.registerElement('rotate', target);

    // Add event listeners
    gestureTarget.addEventListener('rotateStart', (event) => {
      const detail = event.detail;
      events.push(
        `rotateStart: rotation: ${Math.floor(detail.rotation)}° | delta: ${Math.floor(detail.delta)}° | totalRotation: ${Math.floor(detail.totalRotation)}°`,
      );
    });
    gestureTarget.addEventListener('rotate', (event) => {
      const detail = event.detail;
      events.push(
        `rotate: rotation: ${Math.floor(detail.rotation)}° | delta: ${Math.floor(detail.delta)}° | totalRotation: ${Math.floor(detail.totalRotation)}°`,
      );
    });
    gestureTarget.addEventListener('rotateEnd', (event) => {
      const detail = event.detail;
      events.push(
        `rotateEnd: rotation: ${Math.floor(detail.rotation)}° | delta: ${Math.floor(detail.delta)}° | totalRotation: ${Math.floor(detail.totalRotation)}°`,
      );
    });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should detect clockwise rotation', async () => {
    await touchGesture.rotate({
      target,
      rotationAngle: 90, // 90 degrees clockwise
      steps: 2,
    });

    expect(events).toStrictEqual([
      'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
      'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
      'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
      'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
      'rotate: rotation: 90° | delta: 22° | totalRotation: 90°',
      'rotateEnd: rotation: 90° | delta: 22° | totalRotation: 90°',
    ]);
  });

  it('should detect counter-clockwise rotation', async () => {
    await touchGesture.rotate({
      target,
      rotationAngle: -90, // 90 degrees counter-clockwise
      steps: 2,
    });

    expect(events).toStrictEqual([
      'rotateStart: rotation: -23° | delta: -23° | totalRotation: -23°',
      'rotate: rotation: -23° | delta: -23° | totalRotation: -23°',
      'rotate: rotation: -45° | delta: -23° | totalRotation: -45°',
      'rotate: rotation: -68° | delta: -23° | totalRotation: -68°',
      'rotate: rotation: -90° | delta: -23° | totalRotation: -90°',
      'rotateEnd: rotation: -90° | delta: -23° | totalRotation: -90°',
    ]);
  });

  it('should track total rotation across multiple gestures', async () => {
    // First rotation
    await touchGesture.rotate({
      target,
      rotationAngle: 45,
      steps: 1,
    });

    // Second rotation
    await touchGesture.rotate({
      target,
      rotationAngle: 45,
      steps: 1,
    });

    expect(events).toStrictEqual([
      'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
      'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
      'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
      'rotateEnd: rotation: 45° | delta: 22° | totalRotation: 45°',
      'rotateStart: rotation: 67° | delta: 22° | totalRotation: 67°',
      'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
      'rotate: rotation: 90° | delta: 22° | totalRotation: 90°',
      'rotateEnd: rotation: 90° | delta: 22° | totalRotation: 90°',
    ]);
  });

  it('should not jump when a new pointer is added during an active gesture', async () => {
    // Start rotation with 2 pointers
    const gesture = touchGesture.setup();
    await gesture.rotate({
      target,
      rotationAngle: 90,
      steps: 2,
      pointers: {
        amount: 2,
        ids: [1120, 1121],
      },
      releasePointers: false,
    });

    expect(events).toStrictEqual([
      'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
      'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
      'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
      'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
      'rotate: rotation: 90° | delta: 22° | totalRotation: 90°',
    ]);

    // Clear events
    events = [];

    // Add a new pointer in the middle of the rotation
    await gesture.rotate({
      target,
      rotationAngle: 90, // Continue rotating +90 degrees
      steps: 2,
      pointers: [
        { id: 1120 },
        { id: 1121 },
        // Gotta position it in a place that makes sense
        // Default pointers are generally in the same axis
        { id: 1122, x: 50, y: 50 },
      ],
    });

    expect(events).toStrictEqual([
      'rotate: rotation: 112° | delta: 22° | totalRotation: 112°',
      'rotate: rotation: 135° | delta: 22° | totalRotation: 135°',
      'rotate: rotation: 157° | delta: 22° | totalRotation: 157°',
      'rotate: rotation: 180° | delta: 22° | totalRotation: 180°',
      'rotateEnd: rotation: 180° | delta: 22° | totalRotation: 180°',
    ]);
  });

  it('should not jump when a pointer is removed during an active gesture', async () => {
    // Start rotation with 3 pointers
    const gesture = touchGesture.setup();
    await gesture.rotate({
      target,
      rotationAngle: 90,
      steps: 2,
      pointers: [
        { id: 2120, x: 75, y: 25 },
        { id: 2121, x: 50, y: 50 },
        { id: 2122, x: 25, y: 10 },
      ],
      releasePointers: [2120],
    });

    expect(events).toStrictEqual([
      'rotateStart: rotation: 27° | delta: 27° | totalRotation: 27°',
      'rotate: rotation: 27° | delta: 27° | totalRotation: 27°',
      'rotate: rotation: 45° | delta: 17° | totalRotation: 45°',
      'rotate: rotation: 72° | delta: 27° | totalRotation: 72°',
      'rotate: rotation: 89° | delta: 17° | totalRotation: 89°',
    ]);

    // Clear events
    events = [];

    // Continue rotation with remaining 2 pointers
    await gesture.rotate({
      target,
      rotationAngle: 90,
      steps: 2,
      pointers: {
        amount: 2,
        ids: [2121, 2122],
      },
    });

    expect(events).toStrictEqual([
      'rotate: rotation: 112° | delta: 22° | totalRotation: 112°',
      'rotate: rotation: 134° | delta: 22° | totalRotation: 134°',
      'rotate: rotation: 157° | delta: 22° | totalRotation: 157°',
      'rotate: rotation: 179° | delta: 22° | totalRotation: 179°',
      'rotateEnd: rotation: 179° | delta: 22° | totalRotation: 179°',
    ]);
  });

  it('should update options', () => {
    expect(RotateGesture).toUpdateOptions({
      preventDefault: true,
      stopPropagation: true,
      preventIf: ['pinch'],
      minPointers: 2,
      maxPointers: 3,
    });
  });

  it('should update state', { fails: true }, () => {
    expect(RotateGesture).toUpdateState({});
  });

  it('should properly clone', () => {
    expect(RotateGesture).toBeClonable({
      name: 'rotate',
      preventDefault: true,
      stopPropagation: true,
      minPointers: 2,
      maxPointers: 3,
      preventIf: ['pinch', 'pan'],
    });
  });
});
