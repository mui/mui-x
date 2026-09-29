import { screen, waitFor } from '@mui/internal-test-utils';
import {
  cancelDrag,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  moveDrag,
  startDrag,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { afterEach, describe, it, expect } from 'vitest';

// Needs real layout: the scroller has to overflow and the engine reads its bounds.
describe.skipIf(isJSDOM)('<DayTimeGrid /> - drag auto-scroll', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03') });
  afterEach(cancelDrag);

  it('should scroll the time grid while an event is dragged to its bottom edge', async () => {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T08:00:00Z', 60)
      .draggable(true)
      .build();
    render(
      <EventCalendar
        events={[event]}
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="week"
        style={{ height: 400 }}
      />,
    );
    const scroller = document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGrid}`)!;
    const initialScrollTop = scroller.scrollTop;
    const source = screen.getByRole('button', { name: /Morning Meeting/i });
    const sourceRect = source.getBoundingClientRect();
    const clientX = sourceRect.left + sourceRect.width / 2;

    startDrag(source, {
      clientX,
      clientY: sourceRect.top + sourceRect.height / 2,
      mockHitTest: false,
    });
    moveDrag(scroller, {
      clientX,
      clientY: scroller.getBoundingClientRect().bottom - 4,
      mockHitTest: false,
    });

    await waitFor(() => {
      expect(scroller.scrollTop).to.be.greaterThan(initialScrollTop);
    });
  });
});
