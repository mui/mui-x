import { spy } from 'sinon';
import { renderHook } from '@mui/internal-test-utils';
import { useDisarmOnOutsidePointer } from './useDisarmOnOutsidePointer';

const IGNORE_SELECTOR = '.resize-handle';

describe('useDisarmOnOutsidePointer', () => {
  let container: HTMLDivElement;
  let inside: HTMLButtonElement;
  let handle: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    inside = document.createElement('button');
    handle = document.createElement('div');
    handle.className = 'resize-handle';
    container.appendChild(inside);
    container.appendChild(handle);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function renderUseDisarm(props: Parameters<typeof useDisarmOnOutsidePointer>[0]) {
    return renderHook((hookProps) => useDisarmOnOutsidePointer(hookProps), {
      initialProps: props,
    });
  }

  it('swallows an outside click and calls onDisarm while active', () => {
    const onDisarm = spy();
    renderUseDisarm({
      ref: { current: container },
      active: true,
      onDisarm,
      ignoreSelector: IGNORE_SELECTOR,
    });

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    inside.dispatchEvent(event);

    expect(onDisarm.callCount).to.equal(1);
    // Swallowed: reaches neither a create handler nor an event's open trigger.
    expect(event.defaultPrevented).to.equal(true);
  });

  it('ignores a click on an element matching ignoreSelector (the resize handle)', () => {
    const onDisarm = spy();
    renderUseDisarm({
      ref: { current: container },
      active: true,
      onDisarm,
      ignoreSelector: IGNORE_SELECTOR,
    });

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    handle.dispatchEvent(event);

    expect(onDisarm.callCount).to.equal(0);
    expect(event.defaultPrevented).to.equal(false);
  });

  it('removes the listener when active becomes false', () => {
    const onDisarm = spy();
    const { rerender } = renderUseDisarm({
      ref: { current: container },
      active: true,
      onDisarm,
      ignoreSelector: IGNORE_SELECTOR,
    });

    rerender({
      ref: { current: container },
      active: false,
      onDisarm,
      ignoreSelector: IGNORE_SELECTOR,
    });

    inside.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(onDisarm.callCount).to.equal(0);
  });
});
