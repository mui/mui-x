import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { BarChart } from '@mui/x-charts/BarChart';

// Attached by the internal PointerManager / KeyboardManager that GestureManager owns.
const DOCUMENT_EVENTS = [
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointercancel',
  'forceCancel',
  'blur',
  'contextmenu',
];
const WINDOW_EVENTS = ['keydown', 'keyup', 'blur'];

type ListenerCall = { type: string; callback: unknown };

/**
 * Records `addEventListener` / `removeEventListener` traffic on a target.
 *
 * Not `sinon.spy`: in jsdom `window === globalThis`, where `addEventListener` is an accessor
 * property that sinon refuses to wrap. Patching the descriptor directly works both for that
 * accessor and for the inherited method on `document`.
 */
function trackListeners(target: EventTarget, types: string[]) {
  const added: ListenerCall[] = [];
  const removed: ListenerCall[] = [];

  const patch = (name: 'addEventListener' | 'removeEventListener', log: ListenerCall[]) => {
    const original = Object.getOwnPropertyDescriptor(target, name);
    const originalFn = (target as any)[name] as Function;

    Object.defineProperty(target, name, {
      configurable: true,
      writable: true,
      value: function trackedListener(
        this: EventTarget,
        type: string,
        callback: unknown,
        options: unknown,
      ) {
        if (types.includes(type)) {
          log.push({ type, callback });
        }
        return originalFn.call(this, type, callback, options);
      },
    });

    return () => {
      if (original) {
        Object.defineProperty(target, name, original);
      } else {
        delete (target as any)[name];
      }
    };
  };

  const restoreAdd = patch('addEventListener', added);
  const restoreRemove = patch('removeEventListener', removed);

  return {
    restore() {
      restoreAdd();
      restoreRemove();
    },
    /** Event types added but never removed with a matching (type, callback) pair. */
    leakedTypes() {
      return added
        .filter((a) => !removed.some((r) => r.type === a.type && r.callback === a.callback))
        .map(({ type }) => type);
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

    // The first mount also performs one-time global setup unrelated to charts (MUI's
    // focus-visible handlers, React's `selectionchange`), which is intentionally never torn
    // down. Warm that up first so the measured cycle only sees chart-owned listeners.
    render(chart).unmount();

    const documentListeners = trackListeners(document, DOCUMENT_EVENTS);
    const windowListeners = trackListeners(window, WINDOW_EVENTS);

    try {
      render(chart).unmount();

      expect({
        document: documentListeners.leakedTypes(),
        window: windowListeners.leakedTypes(),
      }).to.deep.equal({ document: [], window: [] });
    } finally {
      documentListeners.restore();
      windowListeners.restore();
    }
  });
});
