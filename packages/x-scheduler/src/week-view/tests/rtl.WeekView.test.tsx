import { screen, within } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

describe('<StandaloneWeekView /> - RTL', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it('should mirror the arrow keys of the Base UI components', async () => {
    const resource = ResourceBuilder.new().title('Resource').build();
    const event = EventBuilder.new()
      .title('Meeting')
      .resource(resource)
      .span('2025-07-03T09:00:00Z', '2025-07-03T10:00:00Z')
      .build();

    const { user } = await renderSettled(
      <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
        <div dir="rtl" style={{ width: 1200, height: 600 }}>
          <StandaloneWeekView
            events={[event]}
            resources={[resource]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          />
        </div>
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /^Meeting,/ }));
    const dialog = await screen.findByRole('dialog');
    // The color picker is a Base UI ToggleGroup, which reads the direction from the root.
    const colorGroup = within(dialog).getByRole('group', { name: 'Event color' });
    const colors = within(colorGroup).getAllByRole('button');

    await user.click(colors[0]);
    await user.keyboard('{ArrowLeft}');

    // In LTR, ArrowLeft from the first color loops to the last one.
    expect(colors[1]).toHaveFocus();
  });

  // Reads the laid out styles, so this only runs in the browser.
  describe.skipIf(isJSDOM).each(['ltr', 'rtl'] as const)('%s', (direction) => {
    it('should lay out overlapping events from the inline start', async () => {
      const first = EventBuilder.new()
        .title('First')
        .span('2025-07-03T09:00:00Z', '2025-07-03T11:00:00Z')
        .build();
      const second = EventBuilder.new()
        .title('Second')
        .span('2025-07-03T10:00:00Z', '2025-07-03T12:00:00Z')
        .build();

      await renderSettled(
        <ThemeProvider theme={createTheme({ direction })}>
          <div dir={direction} style={{ width: 1000, height: 800 }}>
            <StandaloneWeekView
              events={[first, second]}
              visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            />
          </div>
        </ThemeProvider>,
      );

      const getEventRect = (title: string) =>
        screen
          .getByText(title)
          .closest(`.${eventCalendarClasses.timeGridEvent}`)!
          .getBoundingClientRect();

      const firstRect = getEventRect('First');
      const secondRect = getEventRect('Second');
      // How far the second event sits after the first one, in the inline direction.
      const spacing =
        direction === 'rtl' ? firstRect.left - secondRect.right : secondRect.left - firstRect.right;
      expect(spacing).to.be.greaterThan(-1);
    });
  });
});
