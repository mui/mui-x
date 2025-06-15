import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { PointerManager } from '../PointerManager';
import { tap } from './TapUserGesture';

describe('TapUserGesture', () => {
  let pointerManager: PointerManager;
  let touchPointerManager: PointerManager;
  let target: HTMLElement;
  let pointerDown: Mock<(event: PointerEvent) => void>;
  let pointerUp: Mock<(event: PointerEvent) => void>;

  beforeEach(() => {
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    document.body.appendChild(target);

    pointerDown = vi.fn<(event: PointerEvent) => void>();
    pointerUp = vi.fn<(event: PointerEvent) => void>();

    target.addEventListener('pointerdown', pointerDown);
    target.addEventListener('pointerup', pointerUp);

    pointerManager = new PointerManager('mouse');
    touchPointerManager = new PointerManager('touch');
  });

  afterEach(() => {
    // Clean up the target element after each test
    if (target && target.parentNode) {
      target.parentNode.removeChild(target);
    }
  });

  it('should throw an error if no target is provided', async () => {
    // @ts-expect-error, testing a missing target
    const tapGesture = () => tap(pointerManager, {});
    await expect(tapGesture).rejects.toThrow('Target element is required for tap gesture');
  });

  it('should perform a basic mouse tap gesture with default options', async () => {
    const options = {
      target,
    };

    await tap(pointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(1);
    expect(pointerUp).toHaveBeenCalledTimes(1);

    const downEvent = pointerDown.mock.calls[0][0];
    const upEvent = pointerUp.mock.calls[0][0];

    expect(downEvent).toBeInstanceOf(PointerEvent);
    expect(upEvent).toBeInstanceOf(PointerEvent);
    expect(downEvent.clientX).toBe(50); // Center X
    expect(downEvent.clientY).toBe(50); // Center Y
    expect(downEvent.pointerId).toBe(1); // Mouse pointer always has id 1
    expect(upEvent.pointerId).toBe(1);
  });

  it('should perform a basic touch tap gesture with default options', async () => {
    const options = {
      target,
    };

    await tap(touchPointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(1);
    expect(pointerUp).toHaveBeenCalledTimes(1);

    const downEvent = pointerDown.mock.calls[0][0];
    const upEvent = pointerUp.mock.calls[0][0];

    expect(downEvent).toBeInstanceOf(PointerEvent);
    expect(upEvent).toBeInstanceOf(PointerEvent);
    expect(downEvent.clientX).toBe(50); // Center X
    expect(downEvent.clientY).toBe(50); // Center Y
    expect(downEvent.pointerId).not.toBe(1); // Touch pointers have different IDs
  });

  it('should perform multiple taps with custom tap count', async () => {
    const options = {
      target,
      taps: 3,
    };

    await tap(pointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(3);
    expect(pointerUp).toHaveBeenCalledTimes(3);
  });

  it('should use custom pointer configuration for mouse', async () => {
    const customPointer = {
      x: 25,
      y: 30,
    };

    const options = {
      target,
      pointer: customPointer,
    };

    await tap(pointerManager, options);

    const downEvent = pointerDown.mock.calls[0][0];
    expect(downEvent.clientX).toBe(25);
    expect(downEvent.clientY).toBe(30);
  });

  it('should use custom pointers configuration for touch', async () => {
    const options = {
      target,
      pointers: { amount: 3, distance: 20 },
    };

    await tap(touchPointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(3);
    expect(pointerUp).toHaveBeenCalledTimes(3);

    // Check that the pointers are distributed properly
    const downEvents = pointerDown.mock.calls.map((call) => call[0]);

    // With 3 pointers at distance 20, they should form a triangle
    // Check they're not all at the same position
    const uniquePositions = new Set(
      downEvents.map((event) => `${Math.round(event.clientX)},${Math.round(event.clientY)}`),
    );
    expect(uniquePositions.size).toBeGreaterThan(1);
  });

  it('should respect custom delay between taps', async () => {
    const options = {
      target,
      taps: 2,
      delay: 100,
    };

    const advanceTimers = vi.fn().mockResolvedValue(undefined);
    await tap(pointerManager, options, advanceTimers);

    // Should have 3 calls to advanceTimers:
    // 1. Short delay between down and up in first tap
    // 2. Custom delay between first and second tap
    // 3. Short delay between down and up in second tap
    expect(advanceTimers).toHaveBeenCalledTimes(3);
    expect(advanceTimers).toHaveBeenNthCalledWith(2, 100);
  });

  it('should work with advanceTimers for test environments', async () => {
    const advanceTimers = vi.fn().mockResolvedValue(undefined);
    const options = {
      target,
      taps: 1,
    };

    await tap(pointerManager, options, advanceTimers);

    expect(pointerDown).toHaveBeenCalledTimes(1);
    expect(pointerUp).toHaveBeenCalledTimes(1);
    expect(advanceTimers).toHaveBeenCalledTimes(1); // Just the down-up interval
    expect(advanceTimers).toHaveBeenCalledWith(10); // Default short delay
  });
});
