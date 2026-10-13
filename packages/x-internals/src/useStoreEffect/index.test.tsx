import { describe, it, expect, vi } from 'vitest';
import { createRenderer, act } from '@mui/internal-test-utils';
import { Store } from '@base-ui/utils/store';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useStoreEffect } from './index';

describe('useStoreEffect resubscription', () => {
  const { render } = createRenderer({ strict: true });

  it('catches up when reconnecting', async () => {
    const store = new Store({ value: 0, unrelated: 0 });
    const onChange = vi.fn();

    function Repro() {
      useStoreEffect(store, (state) => state.value, onChange);

      useIsoLayoutEffect(() => {
        store.set('value', store.state.value + 1);
      }, []);

      return null;
    }

    await render(<Repro />);
    expect(store.state.value).toBe(2);
    expect(onChange.mock.calls).toEqual([
      [0, 1],
      [1, 2],
    ]);

    // force state update after mount
    await act(async () => {
      store.set('unrelated', 1);
    });

    expect(onChange.mock.calls).toEqual([
      [0, 1],
      [1, 2],
    ]);
  });
});
