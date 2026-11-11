import { act, screen, waitFor } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  moveDrag,
  startDrag,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { describe, it, expect } from 'vitest';

// Needs real layout: the scroller has to overflow and the engine reads its bounds.
describe.skipIf(isJSDOM)('<DayTimeGrid /> - drag auto-scroll', () => {
  const { renderSettled } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03') });

  /**
   * Renders a week with a draggable event and starts dragging it from its center.
   * Resolves once the initial scroll to the start time has landed, so the returned
   * `initialScrollTop` can't be mistaken for an auto-scroll.
   */
  async function renderAndStartDrag() {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T08:00:00Z', 60)
      .draggable(true)
      .build();
    await renderSettled(
      <EventCalendar
        events={[event]}
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="week"
        style={{ height: 400 }}
      />,
    );
    const scroller = document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGrid}`)!;
    const initialScrollTop = scroller.scrollTop;
    const sourceRect = screen
      .getByRole('button', { name: /Morning Meeting/i })
      .getBoundingClientRect();
    const clientX = sourceRect.left + sourceRect.width / 2;

    startDrag(screen.getByRole('button', { name: /Morning Meeting/i }), {
      clientX,
      clientY: sourceRect.top + sourceRect.height / 2,
      mockHitTest: false,
    });

    return { scroller, initialScrollTop, clientX };
  }

  it('should scroll the time grid while an event is dragged to its bottom edge', async () => {
    const { scroller, initialScrollTop, clientX } = await renderAndStartDrag();

    moveDrag(scroller, {
      clientX,
      clientY: scroller.getBoundingClientRect().bottom - 4,
      mockHitTest: false,
    });

    await waitFor(() => {
      expect(scroller.scrollTop).to.be.greaterThan(initialScrollTop);
    });
  });

  it('should not scroll the time grid while an event is held in its middle', async () => {
    const { scroller, initialScrollTop, clientX } = await renderAndStartDrag();
    const scrollerRect = scroller.getBoundingClientRect();

    moveDrag(scroller, {
      clientX,
      clientY: scrollerRect.top + scrollerRect.height / 2,
      mockHitTest: false,
    });
    for (let frame = 0; frame < 10; frame += 1) {
      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
      });
    }

    expect(scroller.scrollTop).to.equal(initialScrollTop);
  });
});
