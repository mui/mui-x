'use client';
import * as React from 'react';
import { styled } from '@mui/system';

const Spacer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotTurnSpacer',
})({
  flexShrink: 0,
  pointerEvents: 'none',
  width: '100%',
});

// Leaves a small breathing-room gap between the top of the viewport and the
// pinned user message, so it doesn't sit flush against the panel chrome.
const TOP_MARGIN_PX = 8;

/**
 * Dynamic spacer rendered at the bottom of the chat message list.
 *
 * The height is sized so that, when the scroller is auto-scrolled to the
 * bottom, the *top* of the most-recent user message lands `TOP_MARGIN_PX`
 * below the top of the visible area. This gives every new turn (user
 * message + the assistant response that follows) ~one viewport-worth of
 * vertical space — matching the "scrolls into the stage on submit" UX in
 * ChatGPT / Claude.
 *
 * Formula:
 *   spacerHeight = max(0, scrollerHeight − (contentHeight − lastUser.offsetTop) − TOP_MARGIN_PX)
 *
 * `contentHeight` excludes the spacer itself (we subtract the spacer's own
 * height), so the computation converges in a single pass and we don't loop
 * with ResizeObserver.
 */
function CopilotTurnSpacer() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const spacer = ref.current;
    if (!spacer) {
      return undefined;
    }
    const content = spacer.parentElement;
    const scroller = content?.parentElement;
    if (!content || !scroller) {
      return undefined;
    }

    let raf = 0;
    const schedule = () => {
      if (raf) {
        return;
      }
      raf = requestAnimationFrame(() => {
        raf = 0;
        const userMessages = content.querySelectorAll<HTMLElement>('[data-author-role="user"]');
        const lastUser = userMessages[userMessages.length - 1];
        if (!lastUser) {
          if (spacer.style.height !== '0px') {
            spacer.style.height = '0px';
          }
          return;
        }
        const currentSpacerHeight = spacer.offsetHeight;
        const contentHeight = content.offsetHeight - currentSpacerHeight;
        const lastUserTop = lastUser.offsetTop;
        const distance = contentHeight - lastUserTop;
        const next = Math.max(0, scroller.clientHeight - distance - TOP_MARGIN_PX);
        const prev = parseFloat(spacer.style.height || '0');
        if (Math.abs(prev - next) > 0.5) {
          spacer.style.height = `${next}px`;
        }
      });
    };

    schedule();

    const ro = new ResizeObserver(schedule);
    ro.observe(scroller);
    ro.observe(content);

    const mo = new MutationObserver(schedule);
    mo.observe(content, { childList: true, subtree: true, characterData: true });

    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return <Spacer ref={ref} aria-hidden />;
}

export { CopilotTurnSpacer };
