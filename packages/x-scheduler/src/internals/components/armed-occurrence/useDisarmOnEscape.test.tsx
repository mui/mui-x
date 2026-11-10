import { renderHook } from '@mui/internal-test-utils';
import { vi, describe, it, expect } from 'vitest';
import { useDisarmOnEscape } from './useDisarmOnEscape';

describe('useDisarmOnEscape', () => {
  function renderUseDisarm(props: Parameters<typeof useDisarmOnEscape>[0]) {
    return renderHook((hookProps) => useDisarmOnEscape(hookProps), { initialProps: props });
  }

  function pressKey(key: string, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
    document.dispatchEvent(event);
    return event;
  }

  it('should disarm when Escape is pressed', () => {
    const onDisarm = vi.fn();
    renderUseDisarm({ onDisarm });

    pressKey('Escape');

    expect(onDisarm.mock.calls.length).to.equal(1);
  });

  it('should ignore keys other than Escape', () => {
    const onDisarm = vi.fn();
    renderUseDisarm({ onDisarm });

    pressKey('Enter');

    expect(onDisarm.mock.calls.length).to.equal(0);
  });

  it('should skip an Escape already consumed by an inner handler (e.g. an open dialog closing)', () => {
    const onDisarm = vi.fn();
    renderUseDisarm({ onDisarm });

    // A handler higher up the tree already called preventDefault on this Escape.
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    event.preventDefault();
    document.dispatchEvent(event);

    expect(onDisarm.mock.calls.length).to.equal(0);
  });
});
