import { act, fireEvent, screen, within } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { createSchedulerRenderer, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { CompactDayView } from '@mui/x-scheduler/compact-day-view';
import { vi, describe, it, expect } from 'vitest';
import { EventDialogProvider } from '../../internals/components/event-dialog';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';

describe('EventCalendar - Event links', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26') });

  // A hash keeps the navigation inside the page, which jsdom supports.
  const HREF = '#order-1042';

  const timedEvent = EventBuilder.new()
    .title('Order 1042')
    .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
    .readOnly()
    .href(HREF)
    .build();

  const allDayEvent = EventBuilder.new()
    .title('Order 1042')
    .span('2025-05-26T00:00:00Z', '2025-05-27T00:00:00Z')
    .allDay()
    .readOnly()
    .href(HREF)
    .build();

  function getLink() {
    return screen.getByRole('link', { name: /^Order 1042,/ });
  }

  describe('rendering', () => {
    it.each([
      ['time grid', 'week', timedEvent],
      ['day grid', 'week', allDayEvent],
      ['month view', 'month', timedEvent],
      ['agenda view', 'agenda', timedEvent],
    ] as const)('should render a read-only event with an href as a link in the %s', (_, view, event) => {
      render(<EventCalendar events={[event]} defaultView={view} />);

      const link = getLink();
      expect(link).to.have.attribute('href', HREF);
      expect(link).to.have.attribute('data-link');
      expect(link).to.have.attribute('tabindex');
      expect(screen.queryByRole('button', { name: /^Order 1042,/ })).to.equal(null);
    });

    it('should render a link in the compact views', () => {
      render(
        <EventCalendarProvider events={[timedEvent]} resources={[]}>
          <EventDialogProvider>
            <CompactDayView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      expect(getLink()).to.have.attribute('href', HREF);
    });

    it('should render a link in the "more events" popover', async () => {
      const events = Array.from({ length: 6 }, (_, index) =>
        EventBuilder.new()
          .title(`Order ${1042 + index}`)
          .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
          .readOnly()
          .href(`#order-${1042 + index}`)
          .build(),
      );
      const { user } = render(<EventCalendar events={events} defaultView="month" />);

      await user.click(screen.getByRole('button', { name: /more/i }));
      const popover = await screen.findByRole('presentation');

      const links = within(popover).getAllByRole('link');
      expect(links.length).to.be.greaterThan(0);
      links.forEach((link) => {
        expect(link).to.have.attribute('tabindex', '0');
        expect(link.getAttribute('href')).to.match(/^#order-/);
      });
    });

    it('should render the event as a link when the scheduler is read-only', () => {
      const event = EventBuilder.new()
        .title('Order 1042')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .href(HREF)
        .build();
      render(<EventCalendar events={[event]} readOnly />);

      expect(getLink()).to.have.attribute('href', HREF);
    });

    it('should render the event as a link when its resource is read-only', () => {
      const resource = ResourceBuilder.new().areEventsReadOnly().build();
      const event = EventBuilder.new()
        .title('Order 1042')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .resource(resource)
        .href(HREF)
        .build();
      render(<EventCalendar events={[event]} resources={[resource]} />);

      expect(getLink()).to.have.attribute('href', HREF);
    });

    it('should ignore the href of an editable event and warn', () => {
      const event = EventBuilder.new()
        .title('Order 1042')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .href(HREF)
        .build();

      clearWarningsCache();
      expect(() => {
        render(<EventCalendar events={[event]} />);
      }).toWarnDev(['MUI X Scheduler: An editable event has an `href`']);

      expect(screen.queryByRole('link', { name: /^Order 1042,/ })).to.equal(null);
      expect(screen.getByRole('button', { name: /^Order 1042,/ })).not.to.equal(null);
    });
  });

  describe('interactions', () => {
    it('should not start editing when the link is clicked', async () => {
      // A read-only scheduler doesn't create events, so only the event itself handles the click.
      const onEventEditingStart = vi.fn();
      const { user } = render(
        <EventCalendar events={[timedEvent]} readOnly onEventEditingStart={onEventEditingStart} />,
      );

      await user.click(getLink());

      expect(onEventEditingStart.mock.calls.length).to.equal(0);
      expect(screen.queryByRole('dialog')).to.equal(null);
    });

    it('should not create an event when a link is clicked in a time column', async () => {
      // Only the event is read-only, so clicking the time column creates events.
      const onEventEditingStart = vi.fn();
      const { user } = render(
        <EventCalendar events={[timedEvent]} onEventEditingStart={onEventEditingStart} />,
      );

      await user.click(getLink());

      expect(onEventEditingStart.mock.calls.length).to.equal(0);
    });

    it('should not create an event when a link is clicked in a month cell', async () => {
      const onEventEditingStart = vi.fn();
      const { user } = render(
        <EventCalendar
          events={[timedEvent]}
          defaultView="month"
          onEventEditingStart={onEventEditingStart}
        />,
      );

      await user.click(getLink());

      expect(onEventEditingStart.mock.calls.length).to.equal(0);
    });

    it('should keep the native context menu on right-click', () => {
      render(<EventCalendar events={[timedEvent]} />);

      // `fireEvent` returns `false` when a handler prevented the default behavior.
      expect(fireEvent.contextMenu(getLink())).to.equal(true);
      expect(screen.queryByRole('menu')).to.equal(null);
    });

    it('should do nothing when Space is pressed on the link', async () => {
      const onEventEditingStart = vi.fn();
      const { user } = render(
        <EventCalendar events={[timedEvent]} onEventEditingStart={onEventEditingStart} />,
      );

      await act(async () => {
        getLink().focus();
      });
      await user.keyboard(' ');

      expect(onEventEditingStart.mock.calls.length).to.equal(0);
      expect(screen.queryByRole('menu')).to.equal(null);
      expect(screen.queryByRole('dialog')).to.equal(null);
    });
  });
});
