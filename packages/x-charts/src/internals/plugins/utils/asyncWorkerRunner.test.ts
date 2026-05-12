import { beforeEach, afterEach } from 'vitest';
import {
  getChartsAsyncRunner,
  MUI_X_CHARTS_ASYNC_CHANNEL,
  type ChartsAsyncWorkerMessage,
  resetChartsAsyncRunnerForTests,
} from './asyncWorkerRunner';

// Minimal in-process BroadcastChannel polyfill for tests. All instances of the
// same name share a registry so messages from one peer reach the others.
class FakeBroadcastChannel extends EventTarget {
  static registry = new Map<string, Set<FakeBroadcastChannel>>();

  closed = false;

  constructor(public name: string) {
    super();
    let peers = FakeBroadcastChannel.registry.get(name);
    if (!peers) {
      peers = new Set();
      FakeBroadcastChannel.registry.set(name, peers);
    }
    peers.add(this);
  }

  postMessage(data: unknown) {
    if (this.closed) {
      return;
    }
    const peers = FakeBroadcastChannel.registry.get(this.name);
    if (!peers) {
      return;
    }
    peers.forEach((peer) => {
      if (peer !== this && !peer.closed) {
        peer.dispatchEvent(new MessageEvent('message', { data }));
      }
    });
  }

  close() {
    this.closed = true;
    const peers = FakeBroadcastChannel.registry.get(this.name);
    peers?.delete(this);
  }

  static reset() {
    FakeBroadcastChannel.registry.clear();
  }
}

describe('getChartsAsyncRunner', () => {
  let originalBroadcastChannel: typeof globalThis.BroadcastChannel | undefined;

  beforeEach(() => {
    originalBroadcastChannel = globalThis.BroadcastChannel;
    (globalThis as any).BroadcastChannel = FakeBroadcastChannel;
    FakeBroadcastChannel.reset();
    resetChartsAsyncRunnerForTests();
  });

  afterEach(() => {
    if (originalBroadcastChannel) {
      (globalThis as any).BroadcastChannel = originalBroadcastChannel;
    } else {
      delete (globalThis as any).BroadcastChannel;
    }
    FakeBroadcastChannel.reset();
    resetChartsAsyncRunnerForTests();
  });

  it('resolves to a runner when a peer pongs', async () => {
    // Stand up a peer that pongs in response to any ping.
    const peer = new FakeBroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);
    peer.addEventListener('message', (event: any) => {
      const msg = event.data as ChartsAsyncWorkerMessage;
      if (msg.kind === 'ping') {
        peer.postMessage({
          kind: 'pong',
          sessionId: msg.sessionId,
        } satisfies ChartsAsyncWorkerMessage);
      }
    });

    const runner = await getChartsAsyncRunner();
    expect(runner).to.not.equal(null);
  });

  it('resolves to null when no peer pongs within the probe window', async () => {
    // No peer attached → ping times out.
    const runner = await getChartsAsyncRunner();
    expect(runner).to.equal(null);
  });

  it('rebuilds idToType from entries on series-defaultize:done', async () => {
    const peer = new FakeBroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);
    peer.addEventListener('message', (event: any) => {
      const msg = event.data as ChartsAsyncWorkerMessage;
      if (msg.kind === 'ping') {
        peer.postMessage({
          kind: 'pong',
          sessionId: msg.sessionId,
        } satisfies ChartsAsyncWorkerMessage);
        return;
      }
      if (msg.kind === 'series-defaultize') {
        peer.postMessage({
          kind: 'series-defaultize:done',
          sessionId: msg.sessionId,
          requestId: msg.requestId,
          defaultizedSeries: { bar: { series: {}, seriesOrder: [] } } as any,
          idToTypeEntries: [['s1', 'bar']],
        } satisfies ChartsAsyncWorkerMessage);
      }
    });

    const runner = await getChartsAsyncRunner();
    const result = await runner!.runSeriesDefaultize(
      { series: [], colors: [], theme: 'light' } as any,
      1,
    );
    expect(result.idToType.get('s1')).to.equal('bar');
  });

  it('ignores responses from other sessions', async () => {
    const peer = new FakeBroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);
    peer.addEventListener('message', (event: any) => {
      const msg = event.data as ChartsAsyncWorkerMessage;
      if (msg.kind === 'ping') {
        peer.postMessage({
          kind: 'pong',
          sessionId: msg.sessionId,
        } satisfies ChartsAsyncWorkerMessage);
        return;
      }
      if (msg.kind === 'series-defaultize') {
        // First send a stranger-session response — should be ignored.
        peer.postMessage({
          kind: 'series-defaultize:done',
          sessionId: 'someone-else',
          requestId: msg.requestId,
          defaultizedSeries: { bar: { series: {}, seriesOrder: ['stranger'] } } as any,
          idToTypeEntries: [['stranger', 'bar']],
        } satisfies ChartsAsyncWorkerMessage);
        // Then the legit one.
        peer.postMessage({
          kind: 'series-defaultize:done',
          sessionId: msg.sessionId,
          requestId: msg.requestId,
          defaultizedSeries: { bar: { series: {}, seriesOrder: ['legit'] } } as any,
          idToTypeEntries: [['legit', 'bar']],
        } satisfies ChartsAsyncWorkerMessage);
      }
    });

    const runner = await getChartsAsyncRunner();
    const result = await runner!.runSeriesDefaultize(
      { series: [], colors: [], theme: 'light' } as any,
      42,
    );
    expect(result.idToType.has('stranger')).to.equal(false);
    expect(result.idToType.has('legit')).to.equal(true);
  });

  it('rejects when the worker reports an error', async () => {
    const peer = new FakeBroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);
    peer.addEventListener('message', (event: any) => {
      const msg = event.data as ChartsAsyncWorkerMessage;
      if (msg.kind === 'ping') {
        peer.postMessage({
          kind: 'pong',
          sessionId: msg.sessionId,
        } satisfies ChartsAsyncWorkerMessage);
        return;
      }
      if (msg.kind === 'series-defaultize') {
        peer.postMessage({
          kind: 'series-defaultize:error',
          sessionId: msg.sessionId,
          requestId: msg.requestId,
          errorMessage: 'boom',
        } satisfies ChartsAsyncWorkerMessage);
      }
    });

    const runner = await getChartsAsyncRunner();
    let caught: Error | null = null;
    try {
      await runner!.runSeriesDefaultize({ series: [], colors: [], theme: 'light' } as any, 99);
    } catch (err) {
      caught = err as Error;
    }
    expect(caught?.message).to.equal('boom');
  });
});

describe('getChartsAsyncRunner without BroadcastChannel', () => {
  let originalBroadcastChannel: typeof globalThis.BroadcastChannel | undefined;

  beforeEach(() => {
    originalBroadcastChannel = globalThis.BroadcastChannel;
    delete (globalThis as any).BroadcastChannel;
    resetChartsAsyncRunnerForTests();
  });

  afterEach(() => {
    if (originalBroadcastChannel) {
      (globalThis as any).BroadcastChannel = originalBroadcastChannel;
    }
    resetChartsAsyncRunnerForTests();
  });

  it('resolves to null synchronously', async () => {
    expect(await getChartsAsyncRunner()).to.equal(null);
  });
});
