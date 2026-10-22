import { act } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  getMonthViewCell,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

// The tip of the chevron sits on the left edge (`0px 50%`) or on the right edge (`100% 50%`).
const LEFT_TIP = '0px 50%';
const RIGHT_TIP = '100% 50%';

describe('<StandaloneMonthView /> - RTL', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  // Reads the computed styles, so this only runs in the browser.
  describe.skipIf(isJSDOM).each([
    ['ltr', { endTip: RIGHT_TIP, startTip: LEFT_TIP }],
    ['rtl', { endTip: LEFT_TIP, startTip: RIGHT_TIP }],
  ] as const)('%s', (direction, { endTip, startTip }) => {
    async function renderMonth(events: SchedulerEvent[]) {
      await renderSettled(
        <ThemeProvider theme={createTheme({ direction })}>
          <div dir={direction} style={{ width: 1000, height: 800 }}>
            <StandaloneMonthView events={events} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />
          </div>
        </ThemeProvider>,
      );
    }

    const getInlineStart = (rect: DOMRect) => (direction === 'rtl' ? rect.right : rect.left);

    it('should point the chevrons of a multi-week event to the inline end and start', async () => {
      // Crosses the boundary between the first two weeks of the month.
      await renderMonth([
        EventBuilder.new()
          .title('Trip')
          .span('2025-07-04T09:00:00Z', '2025-07-08T17:00:00Z')
          .build(),
      ]);

      const continuesAfter = document.querySelector<HTMLElement>(
        `.${eventCalendarClasses.dayGridEvent}[data-ending-after-edge]`,
      );
      const continuesBefore = document.querySelector<HTMLElement>(
        `.${eventCalendarClasses.dayGridEvent}[data-starting-before-edge]`,
      );
      expect(continuesAfter).not.to.equal(null);
      expect(continuesBefore).not.to.equal(null);

      const afterClip = getComputedStyle(continuesAfter!).clipPath;
      const beforeClip = getComputedStyle(continuesBefore!).clipPath;
      expect(afterClip).to.contain(endTip);
      expect(afterClip).not.to.contain(startTip);
      expect(beforeClip).to.contain(startTip);
      expect(beforeClip).not.to.contain(endTip);
    });

    it('should place the start resize handler on the inline start of the event', async () => {
      await renderMonth([
        EventBuilder.new()
          .title('Workshop')
          .span('2025-07-01T09:00:00Z', '2025-07-02T17:00:00Z')
          .build(),
      ]);

      const event = document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayGridEvent}`)!;
      const startHandler = event.querySelector<HTMLElement>(
        `.${eventCalendarClasses.dayGridEventResizeHandler}[data-start]`,
      );
      expect(startHandler).not.to.equal(null);
      expect(getInlineStart(startHandler!.getBoundingClientRect())).to.be.closeTo(
        getInlineStart(event.getBoundingClientRect()),
        1,
      );
    });
  });

  describe('keyboard navigation', () => {
    it('should move the focus to the next day on ArrowLeft', async () => {
      const { user } = await renderSettled(
        <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
          <div dir="rtl">
            <StandaloneMonthView events={[]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />
          </div>
        </ThemeProvider>,
      );

      act(() => {
        getMonthViewCell(9).focus();
      });
      await user.keyboard('{ArrowLeft}');

      expect(getMonthViewCell(10)).toHaveFocus();
    });
  });
});
