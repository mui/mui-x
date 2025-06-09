import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mouseGesture } from '../../testing';
import { GestureManager } from '../GestureManager';
import { TurnWheelGesture } from './TurnWheelGesture';

describe('TurnWheel Gesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<
    'turnWheel',
    TurnWheelGesture<'turnWheel'>,
    TurnWheelGesture<'turnWheel'>
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
        new TurnWheelGesture({
          name: 'turnWheel',
          sensitivity: 1,
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    const gestureTarget = gestureManager.registerElement('turnWheel', target);

    // Add event listeners
    gestureTarget.addEventListener('turnWheel', (event) => {
      const detail = event.detail;
      events.push(
        `wheel: deltaX: ${Math.round(detail.deltaX)} | deltaY: ${Math.round(detail.deltaY)} | totalDeltaX: ${Math.round(detail.totalDeltaX)} | totalDeltaY: ${Math.round(detail.totalDeltaY)}`,
      );
    });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should detect vertical wheel events', async () => {
    await mouseGesture.turnWheel({
      target,
      deltaY: 100,
      turns: 1,
    });

    expect(events).toStrictEqual([
      `wheel: deltaX: 0 | deltaY: 100 | totalDeltaX: 0 | totalDeltaY: 100`,
    ]);
  });

  it('should detect horizontal wheel events', async () => {
    await mouseGesture.turnWheel({
      target,
      deltaX: 100,
      deltaY: 0,
    });

    expect(events).toStrictEqual([
      `wheel: deltaX: 100 | deltaY: 0 | totalDeltaX: 100 | totalDeltaY: 0`,
    ]);
  });

  it('should accumulate total delta across multiple wheel events', async () => {
    // Trigger multiple wheel events
    await mouseGesture.turnWheel({
      target,
      deltaY: 50,
    });

    await mouseGesture.turnWheel({
      target,
      deltaY: 50,
    });

    expect(events).toStrictEqual([
      `wheel: deltaX: 0 | deltaY: 50 | totalDeltaX: 0 | totalDeltaY: 50`,
      `wheel: deltaX: 0 | deltaY: 50 | totalDeltaX: 0 | totalDeltaY: 100`,
    ]);
  });

  it('should apply sensitivity to wheel deltas', async () => {
    gestureManager.setGestureOptions('turnWheel', target, {
      sensitivity: 2, // Double the sensitivity
    });

    // Trigger a wheel event
    await mouseGesture.turnWheel({
      target,
      deltaY: 50,
    });

    expect(events).toStrictEqual([
      `wheel: deltaX: 0 | deltaY: 100 | totalDeltaX: 0 | totalDeltaY: 100`, // 50 * 2 = 100
    ]);
  });

  it('should respect min and max limits for total deltas', async () => {
    gestureManager.setGestureOptions('turnWheel', target, {
      min: -100,
      max: 100,
    });

    // Trigger wheel events
    await mouseGesture.turnWheel({
      target,
      deltaY: 50,
    });

    await mouseGesture.turnWheel({
      target,
      deltaY: 1000, // This should hit the max limit
    });

    expect(events).toStrictEqual([
      `wheel: deltaX: 0 | deltaY: 50 | totalDeltaX: 0 | totalDeltaY: 50`,
      `wheel: deltaX: 0 | deltaY: 1000 | totalDeltaX: 0 | totalDeltaY: 100`, // Should not exceed max
    ]);
  });

  it('should update options', () => {
    expect(TurnWheelGesture).toUpdateOptions({
      preventDefault: true,
      stopPropagation: true,
      preventIf: [],
      sensitivity: 2,
      max: 1000,
      min: -1000,
      initialDelta: 50,
      invert: true,
    });
  });

  it('should update state', () => {
    expect(TurnWheelGesture).toUpdateState({
      totalDeltaX: 10,
    });
  });

  it('should properly clone', () => {
    expect(TurnWheelGesture).toBeClonable({
      max: 1000,
      min: -1000,
    });
  });
});
