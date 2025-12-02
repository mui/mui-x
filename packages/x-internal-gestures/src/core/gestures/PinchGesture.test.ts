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
});
