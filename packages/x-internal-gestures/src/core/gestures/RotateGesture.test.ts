import { server } from '@vitest/browser/context';
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
          threshold: 0,
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

    // Adjust for Webkit's pixel rounding
    const isWebkit = server.browser === 'webkit';
    expect(events).toStrictEqual(
      isWebkit
        ? [
            'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
            'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
            'rotate: rotation: 45° | delta: 23° | totalRotation: 45°',
            'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
            'rotate: rotation: 89° | delta: 22° | totalRotation: 89°',
            'rotateEnd: rotation: 89° | delta: 22° | totalRotation: 89°',
          ]
        : [
            'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
            'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
            'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
            'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
            'rotate: rotation: 90° | delta: 22° | totalRotation: 90°',
            'rotateEnd: rotation: 90° | delta: 22° | totalRotation: 90°',
          ],
    );
  });

  it('should detect counter-clockwise rotation', async () => {
    await touchGesture.rotate({
      target,
      rotationAngle: -90, // 90 degrees counter-clockwise
      steps: 2,
    });

    // Adjust for Webkit's pixel rounding
    const isWebkit = server.browser === 'webkit';
    expect(events).toStrictEqual(
      isWebkit
        ? [
            'rotateStart: rotation: -23° | delta: -23° | totalRotation: -23°',
            'rotate: rotation: -23° | delta: -23° | totalRotation: -23°',
            'rotate: rotation: -45° | delta: -22° | totalRotation: -45°',
            'rotate: rotation: -67° | delta: -22° | totalRotation: -67°',
            'rotate: rotation: -90° | delta: -23° | totalRotation: -90°',
            'rotateEnd: rotation: -90° | delta: -23° | totalRotation: -90°',
          ]
        : [
            'rotateStart: rotation: -23° | delta: -23° | totalRotation: -23°',
            'rotate: rotation: -23° | delta: -23° | totalRotation: -23°',
            'rotate: rotation: -45° | delta: -23° | totalRotation: -45°',
            'rotate: rotation: -68° | delta: -23° | totalRotation: -68°',
            'rotate: rotation: -90° | delta: -23° | totalRotation: -90°',
            'rotateEnd: rotation: -90° | delta: -23° | totalRotation: -90°',
          ],
    );
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

    // Adjust for Webkit's pixel rounding
    const isWebkit = server.browser === 'webkit';
    expect(events).toStrictEqual(
      isWebkit
        ? [
            'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
            'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
            'rotate: rotation: 45° | delta: 23° | totalRotation: 45°',
            'rotateEnd: rotation: 45° | delta: 23° | totalRotation: 45°',
            'rotateStart: rotation: 67° | delta: 22° | totalRotation: 67°',
            'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
            'rotate: rotation: 90° | delta: 23° | totalRotation: 90°',
            'rotateEnd: rotation: 90° | delta: 23° | totalRotation: 90°',
          ]
        : [
            'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
            'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
            'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
            'rotateEnd: rotation: 45° | delta: 22° | totalRotation: 45°',
            'rotateStart: rotation: 67° | delta: 22° | totalRotation: 67°',
            'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
            'rotate: rotation: 90° | delta: 22° | totalRotation: 90°',
            'rotateEnd: rotation: 90° | delta: 22° | totalRotation: 90°',
          ],
    );
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
      threshold: 0,
      minPointers: 2,
      maxPointers: 3,
      preventIf: ['pinch', 'pan'],
    });
  });
});
