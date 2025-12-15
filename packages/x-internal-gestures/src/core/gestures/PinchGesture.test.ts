import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { touchGesture } from '../../testing';
import { GestureManager } from '../GestureManager';
import { PinchGesture } from './PinchGesture';

describe('Pinch Gesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<'pinch', PinchGesture<'pinch'>, PinchGesture<'pinch'>>;
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
        new PinchGesture({
          name: 'pinch',
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

    const gestureTarget = gestureManager.registerElement('pinch', target);

    // Add event listeners
    gestureTarget.addEventListener('pinchStart', (event) => {
      const detail = event.detail;
      events.push(
        `pinchStart: scale: ${detail.scale.toFixed(2)} | distance: ${Math.floor(detail.distance)} | direction: ${detail.direction}`,
      );
    });
    gestureTarget.addEventListener('pinch', (event) => {
      const detail = event.detail;
      events.push(
        `pinch: scale: ${detail.scale.toFixed(2)} | distance: ${Math.floor(detail.distance)} | direction: ${detail.direction}`,
      );
    });
    gestureTarget.addEventListener('pinchEnd', (event) => {
      const detail = event.detail;
      events.push(
        `pinchEnd: scale: ${detail.scale.toFixed(2)} | distance: ${Math.floor(detail.distance)} | direction: ${detail.direction}`,
      );
    });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should detect pinch "in" gesture', async () => {
    await touchGesture.pinch({
      target,
      distance: -20, // Negative
      steps: 2,
    });

    // An event is fired for pointer(2) * steps(2) = 4 events
    expect(events).toStrictEqual([
      'pinchStart: scale: 0.90 | distance: 45 | direction: -1',
      'pinch: scale: 0.90 | distance: 45 | direction: -1',
      'pinch: scale: 0.80 | distance: 40 | direction: -1',
      'pinch: scale: 0.70 | distance: 35 | direction: -1',
      'pinch: scale: 0.60 | distance: 30 | direction: -1',
      'pinchEnd: scale: 0.60 | distance: 30 | direction: -1',
    ]);
  });

  it('should detect pinch "out" gesture', async () => {
    await touchGesture.pinch({
      target,
      distance: 20, // Positive
      steps: 2,
    });

    // An event is fired for pointer(2) * steps(2) = 4 events
    expect(events).toStrictEqual([
      'pinchStart: scale: 1.10 | distance: 55 | direction: 1',
      'pinch: scale: 1.10 | distance: 55 | direction: 1',
      'pinch: scale: 1.20 | distance: 60 | direction: 1',
      'pinch: scale: 1.30 | distance: 65 | direction: 1',
      'pinch: scale: 1.40 | distance: 70 | direction: 1',
      'pinchEnd: scale: 1.40 | distance: 70 | direction: 1',
    ]);
  });

  // TODO: Fix after allowing single pointer control
  it.todo('should stop pinch when there are less than 2 pointers', async () => {
    const gesture = touchGesture.setup();

    // Start pinch with 2 pointers
    await gesture.pinch({
      target,
      distance: 20,
      steps: 2,
      pointers: { ids: [20, 30] },
      releasePointers: false,
    });

    expect(events).toStrictEqual([
      'pinchStart: scale: 1.10 | distance: 55 | direction: 1',
      'pinch: scale: 1.10 | distance: 55 | direction: 1',
      'pinch: scale: 1.20 | distance: 60 | direction: 1',
    ]);
  });

  it('should update options', () => {
    expect(PinchGesture).toUpdateOptions({
      preventDefault: true,
      stopPropagation: true,
      preventIf: ['rotate'],
      minPointers: 2,
      maxPointers: 3,
    });
  });

  it('should update state', { fails: true }, () => {
    expect(PinchGesture).toUpdateState({});
  });

  it('should properly clone', () => {
    expect(PinchGesture).toBeClonable({
      name: 'pinch',
      preventDefault: true,
      stopPropagation: true,
      threshold: 0,
      minPointers: 2,
      maxPointers: 3,
      preventIf: ['rotate', 'pan'],
    });
  });

  it('should not jump scale when a new pointer is added during an active gesture', async () => {
    const gesture = touchGesture.setup();

    // Start pinch with 2 pointers
    await gesture.pinch({
      target,
      distance: 20,
      steps: 2,
      pointers: { ids: [20, 30] },
      releasePointers: false,
    });

    // Get the last scale value before adding a new pointer
    const lastScaleEvent = events.filter((e) => e.startsWith('pinch:')).pop();
    const scaleMatch = lastScaleEvent?.match(/scale: ([\d.]+)/);
    const lastScale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

    events = []; // Clear events

    // Add a third pointer during the active pinch gesture
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    gesture.pointerManager.parsePointers({ ids: [40] }, target, { amount: 1, distance: 50 });
    gesture.pointerManager.pointerDown({ id: 40, x: centerX + 40, y: centerY + 40, target });

    // Continue pinching with all three pointers
    await gesture.pinch({
      target,
      distance: 10,
      steps: 1,
      pointers: { ids: [20, 30, 40] },
      releasePointers: true,
    });

    // The scale should continue smoothly from where it was
    // Without the fix, the scale would jump significantly
    const newPinchEvents = events.filter((e) => e.startsWith('pinch:'));
    if (newPinchEvents.length > 0) {
      const firstNewEvent = newPinchEvents[0];
      const newScaleMatch = firstNewEvent.match(/scale: ([\d.]+)/);
      const newScale = newScaleMatch ? parseFloat(newScaleMatch[1]) : 1;

      // The scale should not have jumped by more than 0.3 (a significant jump would be > 0.5)
      expect(Math.abs(newScale - lastScale)).toBeLessThan(0.3);
    }
  });
});
