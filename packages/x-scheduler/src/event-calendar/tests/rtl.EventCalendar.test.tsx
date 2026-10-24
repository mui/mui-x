import { screen, within } from '@mui/internal-test-utils';
import { popoverClasses } from '@mui/material/Popover';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  mockElementBounds,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect, onTestFinished } from 'vitest';

describe('<EventCalendar /> - RTL', () => {
  const { renderSettled } = createSchedulerRenderer();

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
          <EventCalendar
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

  describe.each(['ltr', 'rtl'] as const)('%s', (direction) => {
    const isRtl = direction === 'rtl';

    async function renderCalendar() {
      const event = EventBuilder.new()
        .title('Meeting')
        .span('2025-07-03T09:00:00Z', '2025-07-03T10:00:00Z')
        .build();

      return renderSettled(
        <ThemeProvider theme={createTheme({ direction })}>
          {/* Keeps the toolbar away from the viewport edges, where popovers get shifted. */}
          <div dir={direction} style={{ height: 600, padding: '0 100px' }}>
            <EventCalendar events={[event]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />
          </div>
        </ThemeProvider>,
      );
    }

    it('should point the navigation chevrons to the inline start and end', async () => {
      await renderCalendar();

      const startIcon = isRtl ? 'ChevronRightIcon' : 'ChevronLeftIcon';
      const endIcon = isRtl ? 'ChevronLeftIcon' : 'ChevronRightIcon';
      const previousWeek = screen.getByRole('button', { name: 'Previous week' });
      const nextWeek = screen.getByRole('button', { name: 'Next week' });
      const previousMonth = screen.getByRole('button', { name: 'Show previous month in calendar' });
      const nextMonth = screen.getByRole('button', { name: 'Show next month in calendar' });

      expect(within(previousWeek).queryByTestId(startIcon)).not.to.equal(null);
      expect(within(nextWeek).queryByTestId(endIcon)).not.to.equal(null);
      expect(within(previousMonth).queryByTestId(startIcon)).not.to.equal(null);
      expect(within(nextMonth).queryByTestId(endIcon)).not.to.equal(null);
    });

    it('should open the event dialog on the inline-start side of the event', async () => {
      const { user } = await renderCalendar();

      const event = screen.getByRole('button', { name: /^Meeting,/ });
      mockElementBounds(event, { top: 100, left: 600, width: 100, height: 50 });
      await user.click(event);
      const dialog = await screen.findByRole('dialog');

      const left = parseFloat(dialog.style.left);
      const gapFromEvent = isRtl ? left - 700 : 600 - (left + dialog.offsetWidth);
      expect(gapFromEvent).to.be.closeTo(16, 1);
    });

    // Reads the laid out positions, so this only runs in the browser.
    describe.skipIf(isJSDOM)('layout', () => {
      it('should render the event dialog at the position computed for it', async () => {
        // The dialog is portaled to <body>, so the direction is set there too.
        document.body.dir = direction;
        onTestFinished(() => document.body.removeAttribute('dir'));
        const { user } = await renderCalendar();

        await user.click(screen.getByRole('button', { name: /^Meeting,/ }));
        const dialog = await screen.findByRole('dialog');
        const dialogRect = dialog.getBoundingClientRect();

        expect(dialogRect.left).to.be.closeTo(parseFloat(dialog.style.left), 1);
        expect(dialogRect.top).to.be.closeTo(parseFloat(dialog.style.top), 1);
      });

      it('should mirror the close side panel icon', async () => {
        await renderCalendar();

        const button = screen.getByRole('button', { name: 'Close side panel' });
        const icon = within(button).getByTestId('MenuOpenIcon');

        expect(getComputedStyle(icon).transform).to.equal(
          isRtl ? 'matrix(-1, 0, 0, 1, 0, 0)' : 'none',
        );
      });

      it('should align the preferences menu with the inline end of its button', async () => {
        const { user } = await renderCalendar();

        const button = screen.getByRole('button', { name: 'Preferences' });
        await user.click(button);
        const menu = await screen.findByRole('menu', { name: 'Preferences' });
        const getInlineEnd = (rect: DOMRect) => (isRtl ? rect.left : rect.right);

        const paper = menu.closest<HTMLElement>(`.${popoverClasses.paper}`)!;

        expect(getInlineEnd(paper.getBoundingClientRect())).to.be.closeTo(
          getInlineEnd(button.getBoundingClientRect()),
          1,
        );
      });
    });
  });
});
