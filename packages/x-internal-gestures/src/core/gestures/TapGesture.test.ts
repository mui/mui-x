import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mouseGesture, touchGesture } from '../../testing';
import { GestureManager } from '../GestureManager';
import { TapGesture } from './TapGesture';

describe('Tap Gesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<'tap', TapGesture<'tap'>, TapGesture<'tap'>>;
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
        new TapGesture({
          name: 'tap',
          maxDistance: 10,
          taps: 1,
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    const gestureTarget = gestureManager.registerElement('tap', target);

    // Add event listeners
    gestureTarget.addEventListener('tap', (event) => {
      const detail = event.detail;
      events.push(
        `tap: x: ${Math.floor(detail.x)} | y: ${Math.floor(detail.y)} | tapCount: ${detail.tapCount}`,
      );
    });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should detect a single tap with mouse', async () => {
    await mouseGesture.tap({
      target,
    });

    expect(events).toStrictEqual([`tap: x: 50 | y: 50 | tapCount: 1`]);
  });

  it('should detect a single tap with touch', async () => {
    await touchGesture.tap({
      target,
    });

    expect(events).toStrictEqual([`tap: x: 50 | y: 50 | tapCount: 1`]);
  });

  it('should detect double-tap when configured', async () => {
    gestureManager.setGestureOptions('tap', target, {
      taps: 2,
    });

    // Perform double tap
    await touchGesture.tap({ target, taps: 2 });

    // Verify events
    expect(events.length).toBe(1);
    expect(events[0]).toContain('tapCount: 2');
  });

  // TODO: Wait for individual pointer events to be supported
  it.todo('should reject tap if moved beyond maxDistance', async () => {});

  it('should update options', () => {
    expect(TapGesture).toUpdateOptions({
      preventDefault: true,
      stopPropagation: true,
      preventIf: ['press'],
      maxDistance: 15,
      taps: 2,
    });
  });

  it('should update state', { fails: true }, () => {
    // @ts-expect-error - Using empty state object intentionally
    expect(TapGesture).toUpdateState({});
  });

  it('should properly clone', () => {
    expect(TapGesture).toBeClonable({
      name: 'tap',
      preventDefault: true,
      stopPropagation: true,
      threshold: 0,
      minPointers: 1,
      maxPointers: 1,
      preventIf: ['press'],
      maxDistance: 15,
      taps: 2,
    });
  });
});
