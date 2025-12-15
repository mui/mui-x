import { server } from 'vitest/browser';
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

    // Adjust for Webkit's pixel rounding
    const isWebkit = server.browser === 'webkit';
    expect(events).toStrictEqual(
      isWebkit
        ? [
            'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
            'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
            'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
            'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
            'rotate: rotation: 88° | delta: 21° | totalRotation: 88°',
            'rotateEnd: rotation: 88° | delta: 21° | totalRotation: 88°',
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
            'rotateStart: rotation: -24° | delta: -24° | totalRotation: -24°',
            'rotate: rotation: -24° | delta: -24° | totalRotation: -24°',
            'rotate: rotation: -45° | delta: -22° | totalRotation: -45°',
            'rotate: rotation: -67° | delta: -22° | totalRotation: -67°',
            'rotate: rotation: -90° | delta: -24° | totalRotation: -90°',
            'rotateEnd: rotation: -90° | delta: -24° | totalRotation: -90°',
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
            'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
            'rotateEnd: rotation: 45° | delta: 22° | totalRotation: 45°',
            'rotateStart: rotation: 67° | delta: 22° | totalRotation: 67°',
            'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
            'rotate: rotation: 90° | delta: 22° | totalRotation: 90°',
            'rotateEnd: rotation: 90° | delta: 22° | totalRotation: 90°',
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
      minPointers: 2,
      maxPointers: 3,
      preventIf: ['pinch', 'pan'],
    });
  });

  it('should not jump rotation when a new pointer is added during an active gesture', async () => {
    const gesture = touchGesture.setup();

    // Start rotation with 2 pointers
    await gesture.rotate({
      target,
      rotationAngle: 45,
      steps: 2,
      pointers: { ids: [20, 30] },
      releasePointers: false,
    });

    // Get the last totalRotation value before adding a new pointer
    const lastRotateEvent = events.filter((e) => e.startsWith('rotate:')).pop();
    const rotationMatch = lastRotateEvent?.match(/totalRotation: (-?\d+)°/);
    const lastTotalRotation = rotationMatch ? parseInt(rotationMatch[1], 10) : 0;

    events = []; // Clear events

    // Add a third pointer during the active rotate gesture
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    gesture.pointerManager.parsePointers({ ids: [40] }, target, { amount: 1, distance: 50 });
    gesture.pointerManager.pointerDown({ id: 40, x: centerX + 40, y: centerY + 40, target });

    // Continue rotating with all three pointers
    await gesture.rotate({
      target,
      rotationAngle: 30,
      steps: 1,
      pointers: { ids: [20, 30, 40] },
      releasePointers: true,
    });

    // The rotation should continue smoothly from where it was
    // Without the fix, the rotation would jump significantly
    const newRotateEvents = events.filter((e) => e.startsWith('rotate:'));
    if (newRotateEvents.length > 0) {
      const firstNewEvent = newRotateEvents[0];
      const newRotationMatch = firstNewEvent.match(/totalRotation: (-?\d+)°/);
      const newTotalRotation = newRotationMatch ? parseInt(newRotationMatch[1], 10) : 0;

      // The rotation should not have jumped by more than 45 degrees (a significant jump would be > 90)
      expect(Math.abs(newTotalRotation - lastTotalRotation)).toBeLessThan(60);
    }
  });
});
