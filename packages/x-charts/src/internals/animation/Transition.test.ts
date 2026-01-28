import { expect } from 'vitest';
import { Transition } from './Transition';

// Wait for the next animation frame
const waitNextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

describe('Transition', () => {
  const duration = 200;
  const easingFn = (t: number) => t;

  it('starts automatically on creation', async () => {
    let ticks = 0;
    const transition = new Transition(duration, easingFn, () => {
      ticks += 1;
    });

    expect(ticks).to.eq(0);
    await waitNextFrame();
    expect(ticks).to.eq(1);
    transition.stop();
  });

  it('stops when `stop()` is called', async () => {
    let ticks = 0;
    const transition = new Transition(duration, easingFn, async () => {
      ticks += 1;
    });

    expect(ticks).to.eq(0);
    transition.stop();
    await waitNextFrame();
    expect(ticks).to.eq(0);
  });

  it('resumes after stopping', async () => {
    let ticks = 0;
    const transition = new Transition(duration, easingFn, () => {
      ticks += 1;
    });

    expect(ticks).to.eq(0);
    transition.stop();
    transition.resume();
    expect(ticks).to.eq(0);
    await waitNextFrame();
    expect(ticks).to.eq(1);

    transition.stop();
  });

  it('finishes when `finish()` is called', async () => {
    let ticks = 0;
    const transition = new Transition(duration, easingFn, () => {
      ticks += 1;
    });

    await waitNextFrame();
    expect(ticks).to.eq(1);
    transition.finish();
    await waitNextFrame();
    await waitNextFrame();
    expect(ticks).to.eq(2);
  });
});
