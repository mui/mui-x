import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { PointerManager } from '../PointerManager';
import { rotate } from './RotateUserGesture';

describe('RotateUserGesture', () => {
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
    const rotateGesture = () => rotate(pointerManager, {});
    await expect(rotateGesture).rejects.toThrow('Target element is required for rotate gesture');
  });

  it('should throw an error if less than 2 pointers are available', async () => {
    const options = {
      target,
      pointers: { amount: 1, distance: 0 },
    };

    const rotateGesture = () => rotate(pointerManager, options);
    await expect(rotateGesture).rejects.toThrow('Rotate gesture requires at least 2 pointers');
  });

  it('should perform a basic rotation with default options', async () => {
    const options = {
      target,
    };

    await rotate(pointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(2);
    expect(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps
    expect(pointerUp).toHaveBeenCalledTimes(2);

    // Check initial positions
    const firstDownCall = pointerDown.mock.calls[0][0];
    const secondDownCall = pointerDown.mock.calls[1][0];
    expect(firstDownCall.clientX).toBeGreaterThan(0);
    expect(secondDownCall.clientX).toBeGreaterThan(0);

    // Check final positions after rotation
    const lastMoveFirstPointer = pointerMove.mock.calls
      .filter((call) => call[0].pointerId === firstDownCall.pointerId)
      .at(-1)![0];
    const lastMoveSecondPointer = pointerMove.mock.calls
      .filter((call) => call[0].pointerId === secondDownCall.pointerId)
      .at(-1)![0];

    // For a rotation, both pointers should have moved in an arc
    // Check that the distance between pointers is roughly maintained
    const initialDistance = Math.sqrt(
      (firstDownCall.clientX - secondDownCall.clientX) ** 2 +
        (firstDownCall.clientY - secondDownCall.clientY) ** 2,
    );

    const finalDistance = Math.sqrt(
      (lastMoveFirstPointer.clientX - lastMoveSecondPointer.clientX) ** 2 +
        (lastMoveFirstPointer.clientY - lastMoveSecondPointer.clientY) ** 2,
    );

    // Distance should be roughly maintained during rotation
    expect(finalDistance).toBeCloseTo(initialDistance, 1);
  });

  it('should respect custom rotation angle', async () => {
    const options = {
      target,
      rotationAngle: 180,
    };

    await rotate(pointerManager, options);

    expect(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps

    // With 180 degree rotation, pointers should have moved to opposite sides
    const firstDownCall = pointerDown.mock.calls[0][0];
    const lastMoveFirstPointer = pointerMove.mock.calls
      .filter((call) => call[0].pointerId === firstDownCall.pointerId)
      .at(-1)![0];

    // For a full 180 rotation, position change should be significant
    const displacement = Math.sqrt(
      (lastMoveFirstPointer.clientX - firstDownCall.clientX) ** 2 +
        (lastMoveFirstPointer.clientY - firstDownCall.clientY) ** 2,
    );

    expect(displacement).toBeGreaterThan(0);
  });

  it('should perform rotation with custom pointers configuration', async () => {
    const options = {
      target,
      pointers: { amount: 3, distance: 80 },
      rotationAngle: 45,
    };

    await rotate(pointerManager, options);

    expect(pointerDown).toHaveBeenCalledTimes(3);
    expect(pointerUp).toHaveBeenCalledTimes(3);

    // With 3 pointers, they should be arranged in a triangle
    const uniquePositions = new Set(
      pointerDown.mock.calls.map(
        (call) => `${Math.round(call[0].clientX)},${Math.round(call[0].clientY)}`,
      ),
    );
    expect(uniquePositions.size).toBe(3);
  });

  it('should use custom rotation center', async () => {
    const center = {
      x: 75,
      y: 75,
    };

    const options = {
      target,
      rotationCenter: center,
    };

    await rotate(pointerManager, options);

    // With a custom center, all pointers should rotate around that point
    // Calculate the distance from each final position to the center
    const finalPositions = pointerUp.mock.calls.map((call) => ({
      x: call[0].clientX,
      y: call[0].clientY,
    }));

    finalPositions.forEach((position) => {
      const distanceToCenter = Math.sqrt(
        (position.x - center.x) ** 2 + (position.y - center.y) ** 2,
      );

      // The distance should be greater than 0 (not the center itself)
      expect(distanceToCenter).toBeGreaterThan(0);
    });
  });

  it('should respect custom steps and duration', async () => {
    const options = {
      target,
      steps: 5,
      duration: 1000,
    };

    const advanceTimers = vi.fn().mockResolvedValue(undefined);
    await rotate(pointerManager, options, advanceTimers);

    expect(pointerMove).toHaveBeenCalledTimes(10); // 2 pointers * 5 steps
    expect(advanceTimers).toHaveBeenCalledTimes(4); // steps - 1
    expect(advanceTimers).toHaveBeenCalledWith(200); // 1000ms / 5 steps
  });

  it('should support selective pointer release', async () => {
    // Now do another rotation but only release one pointer
    const idP1 = 501; // First touch pointer ID
    const idP2 = 502; // Second touch pointer ID
    await rotate(pointerManager, {
      target,
      pointers: { ids: [idP1, idP2] },
      releasePointers: [idP1],
    });

    // Only one pointer should be released
    expect(pointerUp).toHaveBeenCalledTimes(1);
    expect(pointerUp.mock.calls[0][0].pointerId).toBe(idP1);

    const idP3 = 503; // Third touch pointer ID
    await rotate(pointerManager, {
      target,
      pointers: { ids: [idP2, idP3] },
    });
    expect(pointerUp).toHaveBeenCalledTimes(3);

    expect(pointerUp.mock.calls[0][0].pointerId).toBe(idP1);
    expect(pointerUp.mock.calls[1][0].pointerId).toBe(idP2);
    expect(pointerUp.mock.calls[2][0].pointerId).toBe(idP3);
  });

  it('should support no pointer release', async () => {
    await rotate(pointerManager, {
      target,
      releasePointers: false,
    });

    // No pointers should be released
    expect(pointerUp).not.toHaveBeenCalled();
  });

  it('should work with advanceTimers for test environments', async () => {
    const advanceTimers = vi.fn().mockResolvedValue(undefined);
    const options = {
      target,
      duration: 500,
      steps: 5,
    };

    await rotate(pointerManager, options, advanceTimers);

    expect(pointerDown).toHaveBeenCalledTimes(2);
    expect(pointerMove).toHaveBeenCalledTimes(10); // 2 pointers * 5 steps
    expect(pointerUp).toHaveBeenCalledTimes(2);
    expect(advanceTimers).toHaveBeenCalledTimes(4); // steps - 1
    expect(advanceTimers).toHaveBeenCalledWith(100); // 500ms / 5 steps
  });
});
