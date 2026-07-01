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

  describe('global mode', () => {
    let outside: HTMLButtonElement;

    beforeEach(() => {
      outside = document.createElement('button');
      document.body.appendChild(outside);
    });

    afterEach(() => {
      document.body.removeChild(outside);
    });

    it('disarms on a tap anywhere outside the surface, even out of its subtree', () => {
      const onDisarm = spy();
      renderUseDisarm({
        ref: { current: container },
        active: true,
        onDisarm,
        ignoreSelector: IGNORE_SELECTOR,
        global: true,
      });

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      outside.dispatchEvent(event);

      expect(onDisarm.callCount).to.equal(1);
      expect(event.defaultPrevented).to.equal(true);
    });

    it('never disarms on a click inside the surface itself', () => {
      const onDisarm = spy();
      renderUseDisarm({
        ref: { current: container },
        active: true,
        onDisarm,
        ignoreSelector: IGNORE_SELECTOR,
        global: true,
      });

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      inside.dispatchEvent(event);

      expect(onDisarm.callCount).to.equal(0);
      expect(event.defaultPrevented).to.equal(false);
    });

    it('still ignores clicks on the resize handle so a resize gesture keeps the surface armed', () => {
      const onDisarm = spy();
      renderUseDisarm({
        ref: { current: container },
        active: true,
        onDisarm,
        ignoreSelector: IGNORE_SELECTOR,
        global: true,
      });

      // A handle outside the surface subtree (the armed event lives in the grid, not the toolbar).
      const detachedHandle = document.createElement('div');
      detachedHandle.className = 'resize-handle';
      document.body.appendChild(detachedHandle);

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      detachedHandle.dispatchEvent(event);

      expect(onDisarm.callCount).to.equal(0);
      expect(event.defaultPrevented).to.equal(false);

      document.body.removeChild(detachedHandle);
    });
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
