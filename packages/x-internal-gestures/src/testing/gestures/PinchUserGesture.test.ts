import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { PointerManager } from '../PointerManager';
import { pinch } from './PinchUserGesture';

describe('PinchUserGesture', () => {
  let pointerManager: PointerManager;
  let target: HTMLElement;
  let pointerDown: Mock<(event: PointerEvent) => void>;
  let pointerMove: Mock<(event: PointerEvent) => void>;
  let pointerUp: Mock<(event: PointerEvent) => void>;

  beforeEach(() => {
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    document.body.appendChild(target);

    pointerDown = vi.fn<(event: PointerEvent) => void>();
    pointerMove = vi.fn<(event: PointerEvent) => void>();
    pointerUp = vi.fn<(event: PointerEvent) => void>();

    target.addEventListener('pointerdown', pointerDown);
    target.addEventListener('pointermove', pointerMove);
    target.addEventListener('pointerup', pointerUp);

    pointerManager = new PointerManager('touch');
  });

  afterEach(() => {
    // Clean up the target element after each test
    if (target && target.parentNode) {
      target.parentNode.removeChild(target);
    }
  });

  it('should throw an error if no target is provided', async () => {
    // @ts-expect-error, testing a missing target
    const pinchGesture = () => pinch(pointerManager, {});
    await expect(pinchGesture).rejects.toThrow('Target element is required for pinch gesture');
  });

  it('should throw an error if less than 2 pointers are available', async () => {
    const options = {
      target,
      distance: 100,
      pointers: { amount: 1, distance: 0 },
    };

    const pinchGesture = () => pinch(pointerManager, options);
    await expect(pinchGesture).rejects.toThrow('Pinch gesture requires at least 2 pointers');
  });

  it('should not perform any movement when distance is 0', async () => {
    const options = {
      target,
      distance: 0,
      pointers: { amount: 2, distance: 50 },
    };

    await pinch(pointerManager, options);

    expect(pointerDown).not.toHaveBeenCalled();
    expect(pointerMove).not.toHaveBeenCalled();
    expect(pointerUp).not.toHaveBeenCalled();
  });

  it('should perform a basic pinch out gesture with default options', async () => {
    const options = {
      target,
      distance: 100,
    };

    await pinch(pointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(2);
    expect(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps
    expect(pointerUp).toHaveBeenCalledTimes(2);

    // Check initial positions (centered around target)
    const firstDownCall = pointerDown.mock.calls[0][0];
    const secondDownCall = pointerDown.mock.calls[1][0];
    expect(firstDownCall.clientX).toBeGreaterThan(0);
    expect(secondDownCall.clientX).toBeGreaterThan(0);

    // Check final positions after pinch
    const lastMoveFirstPointer = pointerMove.mock.calls
      .filter((call) => call[0].pointerId === firstDownCall.pointerId)
      .at(-1)!;
    const lastMoveSecondPointer = pointerMove.mock.calls
      .filter((call) => call[0].pointerId === secondDownCall.pointerId)
      .at(-1)!;

    // For a pinch out, pointers should have moved away from each other
    const initialDistance = Math.sqrt(
      (firstDownCall.clientX - secondDownCall.clientX) ** 2 +
        (firstDownCall.clientY - secondDownCall.clientY) ** 2,
    );

    const finalDistance = Math.sqrt(
      (lastMoveFirstPointer[0].clientX - lastMoveSecondPointer[0].clientX) ** 2 +
        (lastMoveFirstPointer[0].clientY - lastMoveSecondPointer[0].clientY) ** 2,
    );

    // Final distance should be greater than initial for pinch out
    expect(finalDistance).toBeGreaterThan(initialDistance);
    // The difference should be approximately the distance specified
    expect(finalDistance - initialDistance).toBeCloseTo(100);
  });

  it('should perform a pinch in gesture with negative distance', async () => {
    const options = {
      target,
      distance: -50,
    };

    await pinch(pointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(2);
    expect(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps
    expect(pointerUp).toHaveBeenCalledTimes(2);

    // Check initial positions
    const firstDownCall = pointerDown.mock.calls[0][0];
    const secondDownCall = pointerDown.mock.calls[1][0];

    // Check final positions after pinch
    const lastMoveFirstPointer = pointerMove.mock.calls
      .filter((call) => call[0].pointerId === firstDownCall.pointerId)
      .at(-1)!;
    const lastMoveSecondPointer = pointerMove.mock.calls
      .filter((call) => call[0].pointerId === secondDownCall.pointerId)
      .at(-1)!;

    // For a pinch in, pointers should have moved toward each other
    const initialDistance = Math.sqrt(
      (firstDownCall.clientX - secondDownCall.clientX) ** 2 +
        (firstDownCall.clientY - secondDownCall.clientY) ** 2,
    );

    const finalDistance = Math.sqrt(
      (lastMoveFirstPointer[0].clientX - lastMoveSecondPointer[0].clientX) ** 2 +
        (lastMoveFirstPointer[0].clientY - lastMoveSecondPointer[0].clientY) ** 2,
    );

    // Final distance should be less than initial for pinch in
    expect(finalDistance).toBeLessThan(initialDistance);
    // The difference should be approximately the absolute distance specified
    expect(initialDistance - finalDistance).toBeCloseTo(50);
  });

  it('should work with custom steps option', async () => {
    const options = {
      target,
      distance: 100,
      steps: 5,
    };

    await pinch(pointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(2);
    expect(pointerMove).toHaveBeenCalledTimes(10); // 2 pointers * 5 steps
    expect(pointerUp).toHaveBeenCalledTimes(2);
  });

  it('should perform a diagonal pinch with angle parameter', async () => {
    const options = {
      target,
      distance: 100,
      angle: 45,
    };

    await pinch(pointerManager, options);

    // Get the movement for first pointer
    const firstDownCall = pointerDown.mock.calls[0][0];
    const firstPointerMoves = pointerMove.mock.calls.filter(
      (call) => call[0].pointerId === firstDownCall.pointerId,
    );

    const firstPointerStart = firstDownCall;
    const firstPointerEnd = firstPointerMoves[firstPointerMoves.length - 1][0];

    // Calculate the angle of movement
    const deltaX = firstPointerEnd.clientX - firstPointerStart.clientX;
    const deltaY = firstPointerEnd.clientY - firstPointerStart.clientY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Should be close to 45 degrees (or the equivalent angle in the coordinate system)
    expect(Math.abs(angle) % 180).toBeCloseTo(45, 0); // Allow some small precision error
  });

  it('should not release pointers if releasePointers is false', async () => {
    const options = {
      target,
      distance: 100,
      releasePointers: false,
    };

    await pinch(pointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(2);
    expect(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps
    expect(pointerUp).not.toHaveBeenCalled(); // No pointers should be released
  });

  it('should release only specific pointers when releasePointers is an array', async () => {
    const options = {
      target,
      distance: 100,
      pointers: [
        { id: 501, x: 30, y: 50 },
        { id: 502, x: 70, y: 50 },
      ],
      releasePointers: [501], // Only release the first pointer
    };

    await pinch(pointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(2);
    expect(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps
    expect(pointerUp).toHaveBeenCalledTimes(1); // Only one pointer should be released

    // Ensure the released pointer has the expected ID
    expect(pointerUp.mock.calls[0][0].pointerId).toBe(501);
  });

  it('should work with advanceTimers for test environments', async () => {
    const advanceTimers = vi.fn().mockResolvedValue(undefined);
    const options = {
      target,
      distance: 100,
      duration: 1000,
      steps: 4,
    };

    await pinch(pointerManager, options, advanceTimers);

    expect(pointerDown).toHaveBeenCalledTimes(2);
    expect(pointerMove).toHaveBeenCalledTimes(8); // 2 pointers * 4 steps
    expect(pointerUp).toHaveBeenCalledTimes(2);
    expect(advanceTimers).toHaveBeenCalledTimes(3); // Called (steps - 1) times
    expect(advanceTimers).toHaveBeenCalledWith(250); // 1000ms / 4 steps
  });
});
