import { vi, describe, it, expect, afterEach } from 'vitest';
import asyncWorker from './asyncWorker';

describe('asyncWorker', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should yield after an idle timeout and still finish the work', () => {
    const callbacks: IdleRequestCallback[] = [];
    const requestIdleCallback = vi.fn<typeof window.requestIdleCallback>((callback) => {
      callbacks.push(callback);
      return callbacks.length;
    });
    vi.stubGlobal('requestIdleCallback', requestIdleCallback);
    let now = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => now);

    const tasks = { current: 5 };
    const work = vi.fn(() => {
      tasks.current -= 1;
      now += 4;
    });
    const done = vi.fn();
    asyncWorker({ work, tasks, done });

    const timedOut = { didTimeout: true, timeRemaining: () => 0 } as IdleDeadline;
    callbacks.shift()!(timedOut);
    // The work budget after a timeout fits 3 tasks of 4 ms, then the worker yields.
    expect(work.mock.calls.length).to.equal(3);
    expect(done.mock.calls.length).to.equal(0);
    expect(requestIdleCallback.mock.calls[1][1]).to.deep.equal({ timeout: 100 });

    callbacks.shift()!(timedOut);
    expect(work.mock.calls.length).to.equal(5);
    expect(done.mock.calls.length).to.equal(1);
  });
});
