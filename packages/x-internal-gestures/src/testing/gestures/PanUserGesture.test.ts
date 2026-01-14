import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { PointerManager } from '../PointerManager';
import { pan } from './PanUserGesture';

describe('PanUserGesture', () => {
  let pointerManager: PointerManager;
  let target: HTMLElement;
  let down: Mock<(event: PointerEvent) => void>;
  let move: Mock<(event: PointerEvent) => void>;
  let up: Mock<(event: PointerEvent) => void>;

  beforeEach(() => {
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    document.body.appendChild(target);

    down = vi.fn<(event: PointerEvent) => void>();
    move = vi.fn<(event: PointerEvent) => void>();
    up = vi.fn<(event: PointerEvent) => void>();
    target.addEventListener('pointerdown', down);
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);

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
    const panGesture = () => pan(pointerManager, { distance: 50 });
    await expect(panGesture).rejects.toThrow('Target element is required for pan gesture');
  });

  it('should perform a pan gesture', async () => {
    const options = {
      target,
      distance: 50,
      duration: 500,
      steps: 10,
      angle: 0,
    };

    await pan(pointerManager, options);

    expect(down).toHaveBeenCalledTimes(1);
    expect(move).toHaveBeenCalledTimes(10);
    expect(up).toHaveBeenCalledTimes(1);
    expect(down.mock.lastCall?.[0].x).toBeCloseTo(50);
    expect(down.mock.lastCall?.[0].y).toBeCloseTo(50);
    expect(move.mock.lastCall?.[0].x).toBeCloseTo(100);
    expect(move.mock.lastCall?.[0].y).toBeCloseTo(50);
    expect(up.mock.lastCall?.[0].x).toBeCloseTo(100);
    expect(up.mock.lastCall?.[0].y).toBeCloseTo(50);
  });

  it('should perform a pan gesture with multiple pointers', async () => {
    const options = {
      target,
      pointers: { amount: 2, distance: 50 },
      distance: 50,
      duration: 500,
      steps: 10,
      angle: 0,
    };

    await pan(pointerManager, options);

    expect(down).toHaveBeenCalledTimes(2);
    expect(move).toHaveBeenCalledTimes(20);
    expect(up).toHaveBeenCalledTimes(2);
    expect(down.mock.calls[0][0].x).toBeCloseTo(75);
    expect(down.mock.calls[0][0].y).toBeCloseTo(50);
    expect(down.mock.calls[1][0].x).toBeCloseTo(25);
    expect(down.mock.calls[1][0].y).toBeCloseTo(50);
    const count = move.mock.calls.length;
    expect(move.mock.calls[count - 2][0].x).toBeCloseTo(125);
    expect(move.mock.calls[count - 2][0].y).toBeCloseTo(50);
    expect(move.mock.calls[count - 1][0].x).toBeCloseTo(75);
    expect(move.mock.calls[count - 1][0].y).toBeCloseTo(50);
    expect(up.mock.calls[0][0].x).toBeCloseTo(125);
    expect(up.mock.calls[0][0].y).toBeCloseTo(50);
    expect(up.mock.calls[1][0].x).toBeCloseTo(75);
    expect(up.mock.calls[1][0].y).toBeCloseTo(50);
  });

  it('should perform a pan gesture with a custom angle', async () => {
    const options = {
      target,
      distance: 50,
      duration: 500,
      steps: 10,
      angle: 45,
    };

    await pan(pointerManager, options);

    expect(down).toHaveBeenCalledTimes(1);
    expect(move).toHaveBeenCalledTimes(10);
    expect(up).toHaveBeenCalledTimes(1);
    expect(down.mock.lastCall?.[0].x).toBeCloseTo(50);
    expect(down.mock.lastCall?.[0].y).toBeCloseTo(50);
    // 50 * cos(45) = ~35.36
    expect(move.mock.lastCall?.[0].x).toBeCloseTo(85.36);
    expect(move.mock.lastCall?.[0].y).toBeCloseTo(85.36);
    expect(up.mock.lastCall?.[0].x).toBeCloseTo(85.36);
    expect(up.mock.lastCall?.[0].y).toBeCloseTo(85.36);
  });

  it('should perform a pan gesture using a custom starting point', async () => {
    const options = {
      target,
      pointers: [{ id: 2, x: 200, y: 200 }],
      distance: 50,
      duration: 500,
      steps: 10,
      angle: 0,
    };

    await pan(pointerManager, options);

    expect(down).toHaveBeenCalledTimes(1);
    expect(move).toHaveBeenCalledTimes(10);
    expect(up).toHaveBeenCalledTimes(1);
    expect(down.mock.lastCall?.[0].x).toBeCloseTo(200);
    expect(down.mock.lastCall?.[0].y).toBeCloseTo(200);
    expect(move.mock.lastCall?.[0].x).toBeCloseTo(250);
    expect(move.mock.lastCall?.[0].y).toBeCloseTo(200);
    expect(up.mock.lastCall?.[0].x).toBeCloseTo(250);
    expect(up.mock.lastCall?.[0].y).toBeCloseTo(200);
  });

  it('should not release pointers if releasePointers is false', async () => {
    const options = {
      target,
      distance: 50,
      duration: 500,
      steps: 10,
      angle: 0,
      releasePointers: false,
    };

    await pan(pointerManager, options);

    expect(down).toHaveBeenCalledTimes(1);
    expect(move).toHaveBeenCalledTimes(10);
    expect(up).toHaveBeenCalledTimes(0);
  });

  it('should not fire a down event if the pointer is already down', async () => {
    const options = {
      target,
      pointers: {
        ids: [20],
      },
      distance: 50,
      duration: 500,
      steps: 10,
      angle: 0,
    };

    await pan(pointerManager, { ...options, releasePointers: false });
    await pan(pointerManager, options);

    expect(down).toHaveBeenCalledTimes(1);
    expect(move).toHaveBeenCalledTimes(20);
    expect(up).toHaveBeenCalledTimes(1);
  });

  it('should only release specific pointers when releasePointers is an array of IDs', async () => {
    const options = {
      target,
      pointers: [
        { id: 10, x: 50, y: 50 },
        { id: 20, x: 150, y: 50 },
        { id: 30, x: 250, y: 50 },
      ],
      distance: 50,
      duration: 500,
      steps: 10,
      angle: 0,
      releasePointers: [10, 30], // Only release pointers with IDs 10 and 30
    };

    await pan(pointerManager, options);

    expect(down).toHaveBeenCalledTimes(3); // 3 pointers down
    expect(move).toHaveBeenCalledTimes(30); // 3 pointers * 10 steps
    expect(up).toHaveBeenCalledTimes(2); // Only 2 pointers released (IDs 10 and 30)

    // Verify that pointer ID 20 is still down by performing another pan without a down event
    await pan(pointerManager, {
      target,
      pointers: [{ id: 20, x: 200, y: 50 }], // Continue from the final position of pointer 20
      distance: 30,
      duration: 300,
      steps: 5,
      angle: 0,
    });

    expect(down).toHaveBeenCalledTimes(3); // No new down events
    expect(move).toHaveBeenCalledTimes(35); // 30 previous + 5 new moves
    expect(up).toHaveBeenCalledTimes(3); // The remaining pointer is now released
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
      distance: 50,
      duration: 500,
      steps: 10,
      angle: 0,
    };

    await pan(pointerManager, options, advanceTimers);

    expect(advanceTimers).toHaveBeenCalledTimes(9);
    expect(advanceTimers).toHaveBeenCalledWith(50);
  });
});
