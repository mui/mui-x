import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { PointerManager } from '../PointerManager';
import { move } from './MoveUserGesture';

describe('MoveUserGesture', () => {
  let pointerManager: PointerManager;
  let target: HTMLElement;
  let pointerMove: Mock<(event: PointerEvent) => void>;

  beforeEach(() => {
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    document.body.appendChild(target);

    pointerMove = vi.fn<(event: PointerEvent) => void>();
    target.addEventListener('pointermove', pointerMove);

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
    const moveGesture = () => move(pointerManager, {});
    await expect(moveGesture).rejects.toThrow('Target element is required for move gesture');
  });

  it('should perform a basic move gesture with default options', async () => {
    const options = {
      target,
      distance: 100,
    };

    await move(pointerManager, options);

    expect(pointerMove).toHaveBeenCalledTimes(10); // Default steps
    const lastMoveEvent = pointerMove.mock.lastCall?.[0];
    expect(lastMoveEvent).toBeInstanceOf(PointerEvent);
    expect(lastMoveEvent?.clientX).toBe(150); // 50 (center) + 100 (distance)
    expect(lastMoveEvent?.clientY).toBe(50); // center Y unchanged for 0 degree angle
    expect(lastMoveEvent?.pointerId).toBe(1); // Mouse pointer always has id 1
  });

  it('should perform a move gesture with custom steps', async () => {
    const options = {
      target,
      distance: 100,
      steps: 5,
    };

    await move(pointerManager, options);

    expect(pointerMove).toHaveBeenCalledTimes(5);
  });

  it('should perform a vertical move with 90 degree angle', async () => {
    const options = {
      target,
      distance: 100,
      angle: 90,
    };

    await move(pointerManager, options);

    const lastMoveEvent = pointerMove.mock.lastCall?.[0];
    expect(lastMoveEvent?.clientX).toBeCloseTo(50); // X unchanged for 90 degree angle
    expect(lastMoveEvent?.clientY).toBeCloseTo(150); // 50 (center) + 100 (distance)
  });

  it('should perform a diagonal move with 45 degree angle', async () => {
    const options = {
      target,
      distance: 100,
      angle: 45,
    };

    await move(pointerManager, options);

    const lastMoveEvent = pointerMove.mock.lastCall?.[0];
    const expectedDelta = 100 / Math.sqrt(2); // 45 degree movement
    expect(lastMoveEvent?.clientX).toBeCloseTo(50 + expectedDelta);
    expect(lastMoveEvent?.clientY).toBeCloseTo(50 + expectedDelta);
  });

  it('should use custom pointer configuration', async () => {
    const customPointer = {
      x: 25,
      y: 25,
    };

    const options = {
      target,
      pointer: customPointer,
      distance: 50,
    };

    await move(pointerManager, options);

    const lastMoveEvent = pointerMove.mock.lastCall?.[0];
    expect(lastMoveEvent?.clientX).toBe(75); // 25 + 50
    expect(lastMoveEvent?.clientY).toBe(25); // Y unchanged for 0 degree angle
  });

  it('should not move when distance is 0', async () => {
    const options = {
      target,
      distance: 0,
    };

    await move(pointerManager, options);

    expect(pointerMove).not.toHaveBeenCalled();
  });

  it('should not move when distance is negative', async () => {
    const options = {
      target,
      distance: -50,
    };

    await move(pointerManager, options);

    expect(pointerMove).not.toHaveBeenCalled();
  });

  it('should work with advanceTimers for test environments', async () => {
    const advanceTimers = vi.fn().mockResolvedValue(undefined);
    const options = {
      target,
      distance: 100,
      duration: 1000,
      steps: 4,
    };

    await move(pointerManager, options, advanceTimers);

    expect(pointerMove).toHaveBeenCalledTimes(4);
    expect(advanceTimers).toHaveBeenCalledTimes(3); // steps - 1
    expect(advanceTimers).toHaveBeenCalledWith(250); // 1000ms / 4 steps
  });

  it('should handle different angle values correctly', async () => {
    const testCases = [
      { angle: 0, expectedX: 150, expectedY: 50 }, // Right
      { angle: 180, expectedX: -50, expectedY: 50 }, // Left
      { angle: 270, expectedX: 50, expectedY: -50 }, // Up
    ];

    for (const testCase of testCases) {
      const options = {
        target,
        distance: 100,
        angle: testCase.angle,
      };

      pointerMove.mockClear();
      // eslint-disable-next-line no-await-in-loop
      await move(new PointerManager('mouse'), options);

      const lastMoveEvent = pointerMove.mock.lastCall?.[0];
      // Webkit does not support fractional pixels
      // So it seems we lose some precision here
      expect(lastMoveEvent?.clientX, `for angle ${testCase.angle}`).toBeCloseTo(testCase.expectedX);
      expect(lastMoveEvent?.clientY, `for angle ${testCase.angle}`).toBeCloseTo(testCase.expectedY);
    }
  });
});
