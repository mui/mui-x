import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { PointerManager } from '../PointerManager';
import { turnWheel } from './TurnWheelUserGesture';

describe('TurnWheelUserGesture', () => {
  let pointerManager: PointerManager;
  let target: HTMLElement;
  let wheel: Mock<(event: WheelEvent) => void>;

  beforeEach(() => {
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    document.body.appendChild(target);

    wheel = vi.fn<(event: WheelEvent) => void>();
    target.addEventListener('wheel', wheel);

    pointerManager = new PointerManager('mouse');
  });

  afterEach(() => {
    // Clean up the target element after each test
    if (target && target.parentNode) {
      target.parentNode.removeChild(target);
    }
  });

  it('should throw an error if no target is provided', async () => {
    // @ts-expect-error, testing a missing target
    const turnWheelGesture = () => turnWheel(pointerManager, {});
    await expect(turnWheelGesture).rejects.toThrow(
      'Target element is required for turnWheel gesture',
    );
  });

  it('should perform a basic wheel gesture with default options', async () => {
    const options = {
      target,
    };

    await turnWheel(pointerManager, options);

    expect(wheel).toHaveBeenCalledTimes(1);
    const wheelEvent = wheel.mock.lastCall?.[0];
    expect(wheelEvent).toBeInstanceOf(WheelEvent);
    expect(wheelEvent?.deltaX).toBe(0);
    expect(wheelEvent?.deltaY).toBe(100);
    expect(wheelEvent?.deltaZ).toBe(0);
    expect(wheelEvent?.deltaMode).toBe(0);
    expect(wheelEvent?.clientX).toBe(50);
    expect(wheelEvent?.clientY).toBe(50);
  });

  it('should perform a wheel gesture with custom delta values', async () => {
    const options = {
      target,
      deltaX: 50,
      deltaY: -100,
      deltaZ: 25,
      deltaMode: 1,
    };

    await turnWheel(pointerManager, options);

    expect(wheel).toHaveBeenCalledTimes(1);
    const wheelEvent = wheel.mock.lastCall?.[0];
    expect(wheelEvent?.deltaX).toBe(50);
    expect(wheelEvent?.deltaY).toBe(-100);
    expect(wheelEvent?.deltaZ).toBe(25);
    expect(wheelEvent?.deltaMode).toBe(1);
  });

  it('should perform multiple wheel turns with default delay', async () => {
    const options = {
      target,
      turns: 3,
    };

    const startTime = Date.now();
    await turnWheel(pointerManager, options);
    const endTime = Date.now();

    expect(wheel).toHaveBeenCalledTimes(3);
    // Should take approximately 100ms (2 delays of 50ms each between 3 turns)
    expect(endTime - startTime).toBeGreaterThanOrEqual(95);
    expect(endTime - startTime).toBeLessThan(200);
  });

  it('should perform multiple wheel turns with custom delay', async () => {
    const options = {
      target,
      turns: 2,
      delay: 100,
    };

    const startTime = Date.now();
    await turnWheel(pointerManager, options);
    const endTime = Date.now();

    expect(wheel).toHaveBeenCalledTimes(2);
    // Should take approximately 100ms (1 delay of 100ms between 2 turns)
    expect(endTime - startTime).toBeGreaterThanOrEqual(95);
    expect(endTime - startTime).toBeLessThan(200);
  });

  it('should use custom pointer position', async () => {
    const options = {
      target,
      pointer: { x: 75, y: 25 },
    };

    await turnWheel(pointerManager, options);

    expect(wheel).toHaveBeenCalledTimes(1);
    const wheelEvent = wheel.mock.lastCall?.[0];
    expect(wheelEvent?.clientX).toBe(75);
    expect(wheelEvent?.clientY).toBe(25);
  });

  it('should use advanceTimers function if provided', async () => {
    const advanceTimers = vi.fn<(ms: number) => Promise<void>>(
      (ms: number) =>
        new Promise((resolve) => {
          setTimeout(resolve, ms);
        }),
    );
    const options = {
      target,
      turns: 3,
      delay: 75,
    };

    await turnWheel(pointerManager, options, advanceTimers);

    expect(wheel).toHaveBeenCalledTimes(3);
    expect(advanceTimers).toHaveBeenCalledTimes(2); // n-1 delays for n turns
    expect(advanceTimers).toHaveBeenCalledWith(75);
  });

  it('should handle single turn without delay', async () => {
    const advanceTimers = vi.fn<(ms: number) => Promise<void>>();
    const options = {
      target,
      turns: 1,
    };

    await turnWheel(pointerManager, options, advanceTimers);

    expect(wheel).toHaveBeenCalledTimes(1);
    expect(advanceTimers).not.toHaveBeenCalled();
  });
});
