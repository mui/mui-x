import * as React from 'react';
import { onTestFinished, describe, it, expect } from 'vitest';
import { createRenderer } from '@mui/internal-test-utils';
import { BarChart } from '@mui/x-charts/BarChart';

type Listener = { type: string; callback: unknown };

/**
 * Listeners currently registered on `target`, to assert a mount/unmount cycle leaves none behind.
 * Patches the descriptor rather than spying: in jsdom `window === globalThis`, where
 * `addEventListener` is an accessor property.
 */
function trackListeners(target: EventTarget) {
  const active: Listener[] = [];

  const patch = (
    name: 'addEventListener' | 'removeEventListener',
    onCall: (listener: Listener) => void,
  ) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, name);
    const originalFn = (target as any)[name] as Function;

    Object.defineProperty(target, name, {
      configurable: true,
      value: (type: string, callback: unknown, options: unknown) => {
        onCall({ type, callback });
        return originalFn.call(target, type, callback, options);
      },
    });

    return () => {
      if (descriptor) {
        Object.defineProperty(target, name, descriptor);
      } else {
        delete (target as any)[name];
      }
    };
  };

  const restores = [
    patch('addEventListener', (listener) => active.push(listener)),
    patch('removeEventListener', ({ type, callback }) => {
      const index = active.findIndex(
        (listener) => listener.type === type && listener.callback === callback,
      );
      if (index !== -1) {
        active.splice(index, 1);
      }
    }),
  ];

  return {
    restore() {
      restores.forEach((restore) => restore());
    },
    /** Types added without a matching `removeEventListener(type, callback)`. */
    leakedTypes() {
      return active.map(({ type }) => type);
    },
  };
}

describe('useChartInteractionListener', () => {
  const { render } = createRenderer();

  it('should remove every document and window listener when the chart unmounts', () => {
    const chart = (
      <BarChart
        height={300}
        width={300}
        skipAnimation
        series={[{ data: [10, 20] }]}
        xAxis={[{ data: ['A', 'B'] }]}
      />
    );

    // Warm-up: the first mount installs one-time globals (focus-visible, `selectionchange`)
    // that are intentionally never torn down.
    render(chart).unmount();

    const documentListeners = trackListeners(document);
    const windowListeners = trackListeners(window);
    onTestFinished(() => {
      documentListeners.restore();
      windowListeners.restore();
    });

    render(chart).unmount();

    expect({
      document: documentListeners.leakedTypes(),
      window: windowListeners.leakedTypes(),
    }).to.deep.equal({ document: [], window: [] });
  });
});
