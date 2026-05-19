import { vi } from 'vitest';
import { runAsyncPipeline, type AsyncPipelineResult } from './asyncResource';

describe('runAsyncPipeline', () => {
  it('reports pending then success', async () => {
    const onSettled = vi.fn();
    const ref = { current: 1 };
    runAsyncPipeline<number>(() => 42, onSettled, ref, 1);

    // First call is the pending tick.
    expect(onSettled.mock.calls[0][0]).to.deep.equal({ status: 'pending' });

    // Flush microtasks.
    await new Promise((r) => {
      setTimeout(r, 10);
    });

    const lastCall = onSettled.mock.calls[onSettled.mock.calls.length - 1][0];
    expect(lastCall).to.deep.equal({ status: 'success', data: 42 });
  });

  it('reports error when process throws', async () => {
    const onSettled = vi.fn();
    const ref = { current: 1 };
    runAsyncPipeline<number>(
      () => {
        throw new Error('boom');
      },
      onSettled,
      ref,
      1,
    );

    await new Promise((r) => {
      setTimeout(r, 10);
    });

    const errored = onSettled.mock.calls
      .map((c) => c[0] as AsyncPipelineResult<number>)
      .find((c) => c.status === 'error');
    expect(errored?.error?.message).to.equal('boom');
  });

  it('drops stale resolves when requestId no longer matches', async () => {
    const onSettled = vi.fn();
    const ref = { current: 1 };
    runAsyncPipeline<string>(() => 'stale', onSettled, ref, 1);

    // Simulate a newer request bumping the ref before the microtask runs.
    ref.current = 2;

    await new Promise((r) => {
      setTimeout(r, 10);
    });

    const successCalls = onSettled.mock.calls
      .map((c) => c[0] as AsyncPipelineResult<string>)
      .filter((c) => c.status === 'success');
    expect(successCalls.length).to.equal(0);
  });
});
