import { renderHook } from '@mui/internal-test-utils';
import { useBlockScrollWhileArmed } from './useBlockScrollWhileArmed';

const IGNORE_SELECTOR = '.resize-handle';

describe('useBlockScrollWhileArmed', () => {
  let content: HTMLDivElement;
  let handle: HTMLDivElement;

  beforeEach(() => {
    content = document.createElement('div');
    handle = document.createElement('div');
    handle.className = 'resize-handle';
    document.body.appendChild(content);
    document.body.appendChild(handle);
  });

  afterEach(() => {
    document.body.removeChild(content);
    document.body.removeChild(handle);
  });

  function renderUseBlock(props: Parameters<typeof useBlockScrollWhileArmed>[0]) {
    return renderHook((hookProps) => useBlockScrollWhileArmed(hookProps), { initialProps: props });
  }

  function dispatchCancelable(type: string, target: EventTarget) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
  }

  ['wheel', 'touchmove'].forEach((type) => {
    it(`cancels ${type} scrolling while active`, () => {
      renderUseBlock({ active: true, ignoreSelector: IGNORE_SELECTOR });
      const event = dispatchCancelable(type, content);
      // Non-passive listener actually cancels the scroll.
      expect(event.defaultPrevented).to.equal(true);
    });
  });

  it('lets a gesture on the ignoreSelector through, so the armed event still resizes', () => {
    renderUseBlock({ active: true, ignoreSelector: IGNORE_SELECTOR });
    const event = dispatchCancelable('touchmove', handle);
    expect(event.defaultPrevented).to.equal(false);
  });

  it('does not block scrolling when inactive', () => {
    renderUseBlock({ active: false, ignoreSelector: IGNORE_SELECTOR });
    const event = dispatchCancelable('wheel', content);
    expect(event.defaultPrevented).to.equal(false);
  });

  it('stops blocking once active becomes false', () => {
    const { rerender } = renderUseBlock({ active: true, ignoreSelector: IGNORE_SELECTOR });
    rerender({ active: false, ignoreSelector: IGNORE_SELECTOR });

    const event = dispatchCancelable('wheel', content);
    expect(event.defaultPrevented).to.equal(false);
  });
});
