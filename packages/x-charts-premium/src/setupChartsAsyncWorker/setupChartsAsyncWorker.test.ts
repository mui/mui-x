import { beforeEach, afterEach } from 'vitest';
import { MUI_X_CHARTS_ASYNC_CHANNEL, type ChartsAsyncWorkerMessage } from '@mui/x-charts/internals';
import { setupChartsAsyncWorker } from './setupChartsAsyncWorker';

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
    peers?.forEach((peer) => {
      if (peer !== this && !peer.closed) {
        peer.dispatchEvent(new MessageEvent('message', { data }));
      }
    });
  }

  close() {
    this.closed = true;
    FakeBroadcastChannel.registry.get(this.name)?.delete(this);
  }

  static reset() {
    FakeBroadcastChannel.registry.clear();
  }
}

function nextMessage(channel: FakeBroadcastChannel): Promise<ChartsAsyncWorkerMessage> {
  return new Promise((resolve) => {
    const handler = (event: any) => {
      channel.removeEventListener('message', handler);
      resolve(event.data as ChartsAsyncWorkerMessage);
    };
    channel.addEventListener('message', handler);
  });
}

describe('setupChartsAsyncWorker', () => {
  let originalBroadcastChannel: typeof globalThis.BroadcastChannel | undefined;

  beforeEach(() => {
    originalBroadcastChannel = globalThis.BroadcastChannel;
    (globalThis as any).BroadcastChannel = FakeBroadcastChannel;
    FakeBroadcastChannel.reset();
  });

  afterEach(() => {
    if (originalBroadcastChannel) {
      (globalThis as any).BroadcastChannel = originalBroadcastChannel;
    } else {
      delete (globalThis as any).BroadcastChannel;
    }
    FakeBroadcastChannel.reset();
  });

  it('responds to a ping with a pong carrying the same sessionId', async () => {
    setupChartsAsyncWorker();
    const peer = new FakeBroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);
    const responsePromise = nextMessage(peer);
    peer.postMessage({ kind: 'ping', sessionId: 'sess-1' } satisfies ChartsAsyncWorkerMessage);

    const response = await responsePromise;
    expect(response).to.deep.equal({ kind: 'pong', sessionId: 'sess-1' });
  });

  it('runs defaultizeSeries and posts a done response with idToTypeEntries', async () => {
    setupChartsAsyncWorker();
    const peer = new FakeBroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);
    const responsePromise = nextMessage(peer);

    peer.postMessage({
      kind: 'series-defaultize',
      sessionId: 'sess-2',
      requestId: 'test:7',
      payload: {
        series: [
          { type: 'bar', id: 'b1', data: [1, 2, 3] },
          { type: 'line', id: 'l1', data: [4, 5, 6] },
        ] as any,
        colors: ['#000', '#fff'],
        theme: 'light',
      },
    } satisfies ChartsAsyncWorkerMessage);

    const response = (await responsePromise) as Extract<
      ChartsAsyncWorkerMessage,
      { kind: 'series-defaultize:done' }
    >;
    expect(response.kind).to.equal('series-defaultize:done');
    expect(response.sessionId).to.equal('sess-2');
    expect(response.requestId).to.equal('test:7');
    const idMap = new Map(response.idToTypeEntries);
    expect(idMap.get('b1')).to.equal('bar');
    expect(idMap.get('l1')).to.equal('line');
  });

  it('honors a custom seriesConfig', async () => {
    let getDefaultsCalled = 0;
    const customConfig: any = {
      bar: {
        getSeriesWithDefaultValues: (s: any) => {
          getDefaultsCalled += 1;
          return { ...s, color: 'magenta' };
        },
      },
    };
    setupChartsAsyncWorker({ seriesConfig: customConfig });

    const peer = new FakeBroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);
    const responsePromise = nextMessage(peer);

    peer.postMessage({
      kind: 'series-defaultize',
      sessionId: 'sess-3',
      requestId: 'test:1',
      payload: {
        series: [{ type: 'bar', id: 'b1', data: [1] }] as any,
        colors: ['#000'],
        theme: 'light',
      },
    } satisfies ChartsAsyncWorkerMessage);

    const response = (await responsePromise) as Extract<
      ChartsAsyncWorkerMessage,
      { kind: 'series-defaultize:done' }
    >;
    expect(getDefaultsCalled).to.equal(1);
    const bar = (response.defaultizedSeries as any).bar;
    expect(bar.series.b1.color).to.equal('magenta');
  });

  it('posts an error response when defaultizeSeries throws', async () => {
    const customConfig: any = {
      bar: {
        getSeriesWithDefaultValues: () => {
          throw new Error('nope');
        },
      },
    };
    setupChartsAsyncWorker({ seriesConfig: customConfig });

    const peer = new FakeBroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);
    const responsePromise = nextMessage(peer);

    peer.postMessage({
      kind: 'series-defaultize',
      sessionId: 'sess-4',
      requestId: 'test:2',
      payload: {
        series: [{ type: 'bar', id: 'b1', data: [1] }] as any,
        colors: ['#000'],
        theme: 'light',
      },
    } satisfies ChartsAsyncWorkerMessage);

    const response = (await responsePromise) as Extract<
      ChartsAsyncWorkerMessage,
      { kind: 'series-defaultize:error' }
    >;
    expect(response.kind).to.equal('series-defaultize:error');
    expect(response.errorMessage).to.equal('nope');
  });
});
