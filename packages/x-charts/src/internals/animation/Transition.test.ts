import { afterAll, beforeAll, expect } from 'vitest';
import { Transition } from './Transition';

describe('Transition', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  const duration = 200;
  const easingFn = (t: number) => t;

  it('starts automatically on creation', () => {
    let ticks = 0;
    const transition = new Transition(duration, easingFn, () => {
      ticks += 1;
    });

    expect(ticks).to.eq(0);
    vi.advanceTimersToNextFrame();
    expect(ticks).to.eq(1);
    transition.stop();
  });

  it('stops when `stop()` is called', () => {
    let ticks = 0;
    const transition = new Transition(duration, easingFn, () => {
      ticks += 1;
    });

    expect(ticks).to.eq(0);
    transition.stop();
    vi.advanceTimersToNextFrame();
    expect(ticks).to.eq(0);
  });

  it('resumes after stopping', () => {
    let ticks = 0;
    const transition = new Transition(duration, easingFn, () => {
      ticks += 1;
    });

    expect(ticks).to.eq(0);
    transition.stop();
    transition.resume();
    expect(ticks).to.eq(0);
    vi.advanceTimersToNextFrame();
    expect(ticks).to.eq(1);

    transition.stop();
  });

  it('finishes when `finish()` is called', () => {
    let ticks = 0;
    const transition = new Transition(duration, easingFn, () => {
      ticks += 1;
    });

    vi.advanceTimersToNextFrame();
    expect(ticks).to.eq(1);
    transition.finish();
    vi.advanceTimersToNextFrame();
    vi.advanceTimersToNextFrame();
    expect(ticks).to.eq(2);
  });
});
