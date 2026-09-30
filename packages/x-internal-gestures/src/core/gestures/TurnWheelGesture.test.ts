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
        `wheel: deltaX: ${Math.floor(detail.deltaX)} | deltaY: ${Math.floor(detail.deltaY)} | totalDeltaX: ${Math.floor(detail.totalDeltaX)} | totalDeltaY: ${Math.floor(detail.totalDeltaY)}`,
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

  describe('passive option', () => {
    function getWheelPassive(addEventListenerSpy: ReturnType<typeof vi.spyOn>): boolean {
      const wheelCall = addEventListenerSpy.mock.calls.find((call: any) => call[0] === 'wheel');
      expect(wheelCall).toBeDefined();
      const options = wheelCall![2];
      expect(typeof options).toBe('object');
      return (options as AddEventListenerOptions).passive!;
    }

    function setupWithOptions(options: { preventDefault?: boolean; passive?: boolean }) {
      const localTarget = document.createElement('div');
      container.appendChild(localTarget);
      const spy = vi.spyOn(localTarget, 'addEventListener');

      const manager = new GestureManager({
        gestures: [
          new TurnWheelGesture({
            name: 'turnWheel',
            ...options,
          }),
        ],
      });
      manager.registerElement('turnWheel', localTarget);

      return { manager, passive: getWheelPassive(spy) };
    }

    it('should default passive to true when preventDefault is false', () => {
      const { manager, passive } = setupWithOptions({ preventDefault: false });
      expect(passive).toBe(true);
      manager.destroy();
    });

    it('should default passive to false when preventDefault is true', () => {
      const { manager, passive } = setupWithOptions({ preventDefault: true });
      expect(passive).toBe(false);
      manager.destroy();
    });

    it('should respect explicit passive=true when preventDefault is false', () => {
      const { manager, passive } = setupWithOptions({
        preventDefault: false,
        passive: true,
      });
      expect(passive).toBe(true);
      manager.destroy();
    });

    it('should respect explicit passive=false when preventDefault is false', () => {
      const { manager, passive } = setupWithOptions({
        preventDefault: false,
        passive: false,
      });
      expect(passive).toBe(false);
      manager.destroy();
    });

    it('should force passive to false when preventDefault is true even if passive=true is passed', () => {
      const { manager, passive } = setupWithOptions({
        preventDefault: true,
        passive: true,
      });
      expect(passive).toBe(false);
      manager.destroy();
    });

    it('should preserve passive option when cloning', () => {
      const original = new TurnWheelGesture({
        name: 'turnWheel',
        preventDefault: false,
        passive: true,
      });

      const localTarget = document.createElement('div');
      container.appendChild(localTarget);
      const spy = vi.spyOn(localTarget, 'addEventListener');

      const manager = new GestureManager({ gestures: [original] });
      manager.registerElement('turnWheel', localTarget);

      expect(getWheelPassive(spy)).toBe(true);
      manager.destroy();
    });
  });
});
