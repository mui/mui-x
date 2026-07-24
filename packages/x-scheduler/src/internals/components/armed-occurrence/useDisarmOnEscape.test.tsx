import { spy } from 'sinon';
import { renderHook } from '@mui/internal-test-utils';
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

  it('disarms when Escape is pressed while active', () => {
    const onDisarm = spy();
    renderUseDisarm({ active: true, onDisarm });

    pressKey('Escape');

    expect(onDisarm.callCount).to.equal(1);
  });

  it('ignores keys other than Escape', () => {
    const onDisarm = spy();
    renderUseDisarm({ active: true, onDisarm });

    pressKey('Enter');

    expect(onDisarm.callCount).to.equal(0);
  });

  it('does nothing while inactive', () => {
    const onDisarm = spy();
    renderUseDisarm({ active: false, onDisarm });

    pressKey('Escape');

    expect(onDisarm.callCount).to.equal(0);
  });

  it('skips an Escape already consumed by an inner handler (e.g. an open dialog closing)', () => {
    const onDisarm = spy();
    renderUseDisarm({ active: true, onDisarm });

    // A handler higher up the tree already called preventDefault on this Escape.
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    event.preventDefault();
    document.dispatchEvent(event);

    expect(onDisarm.callCount).to.equal(0);
  });

  it('removes the listener when active becomes false', () => {
    const onDisarm = spy();
    const { rerender } = renderUseDisarm({ active: true, onDisarm });

    rerender({ active: false, onDisarm });
    pressKey('Escape');

    expect(onDisarm.callCount).to.equal(0);
  });
});
