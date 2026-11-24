import { act, fireEvent, screen, waitFor, within } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import {
  createSchedulerRenderer,
  EventBuilder,
  getEventNamePattern,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { CompactDayView } from '@mui/x-scheduler/compact-day-view';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { EventDialogProvider } from '../../internals/components/event-dialog';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';

describe('EventCalendar - Event links', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26') });

  // A hash keeps the navigation inside the page, which jsdom supports.
  const HREF = '#order-1042';

  // Clicking a link changes the hash of the page.
  afterEach(() => {
    window.location.hash = '';
  });

  const timedEvent = EventBuilder.new()
    .title('Order 1042')
    .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
    .readOnly()
    .href(HREF)
    .build();

  const allDayEvent = EventBuilder.new()
    .title('Order 1042')
    .span('2025-05-26', '2025-05-27')
    .allDay()
    .readOnly()
    .href(HREF)
    .build();

  const NAME = getEventNamePattern('Order 1042');

  function getLink() {
    return screen.getByRole('link', { name: NAME });
  }

  describe('rendering', () => {
    // The grid views use a roving `tabIndex`, the agenda lists every event as a tab stop.
    it.each([
      ['time grid', 'week', timedEvent, '-1'],
      ['day grid', 'week', allDayEvent, '-1'],
      ['month view', 'month', timedEvent, '-1'],
      ['agenda view', 'agenda', timedEvent, '0'],
    ] as const)(
      'should render a read-only event with an href as a link in the %s',
      (_, view, event, tabIndex) => {
        render(<EventCalendar events={[event]} defaultView={view} />);

        const link = getLink();
        expect(link).to.have.attribute('href', HREF);
        expect(link).to.have.attribute('data-link');
        expect(link).to.have.attribute('tabindex', tabIndex);
        expect(screen.queryByRole('button', { name: NAME })).to.equal(null);
      },
    );

    it('should render a multi-day event as a single link per row', () => {
      const event = EventBuilder.new()
        .title('Order 1042')
        .span('2025-05-26', '2025-05-28')
        .allDay()
        .readOnly()
        .href(HREF)
        .build();
      render(<EventCalendar events={[event]} defaultView="week" />);

      // The hidden copies that reserve the event's row in the other days are not links.
      expect(document.querySelectorAll(`a[href="${HREF}"]`).length).to.equal(1);
    });

    it('should read the href through eventModelStructure', () => {
      const event = { ...timedEvent, href: undefined, orderId: 1042 };
      render(
        <EventCalendar
          events={[event]}
          eventModelStructure={{
            href: { getter: (model) => `#order-${model.orderId}` },
          }}
        />,
      );

      expect(getLink()).to.have.attribute('href', HREF);
    });

    it('should not render an event with an empty href as a link', () => {
      const event = EventBuilder.new()
        .title('Order 1042')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .readOnly()
        .href('')
        .build();
      render(<EventCalendar events={[event]} />);

      expect(screen.queryByRole('link', { name: NAME })).to.equal(null);
      expect(screen.getByRole('button', { name: NAME })).not.to.equal(null);
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
      expect(links.length).to.equal(events.length);
      expect(within(popover).queryAllByRole('button', { name: /^Order/ })).to.have.length(0);
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

    it('should render the event as a button again when the scheduler stops being read-only', () => {
      const event = EventBuilder.new()
        .title('Order 1042')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .href(HREF)
        .build();
      const { setProps } = render(<EventCalendar events={[event]} readOnly />);
      expect(getLink()).to.have.attribute('href', HREF);

      clearWarningsCache();
      expect(() => setProps({ readOnly: false })).toWarnDev([
        'MUI X Scheduler: An event has an `href` but is editable',
      ]);

      expect(screen.queryByRole('link', { name: NAME })).to.equal(null);
      expect(screen.getByRole('button', { name: NAME })).not.to.equal(null);
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
      }).toWarnDev(['MUI X Scheduler: An event has an `href` but is editable']);

      expect(screen.queryByRole('link', { name: NAME })).to.equal(null);
      expect(screen.getByRole('button', { name: NAME })).not.to.equal(null);
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

    it('should not prevent the native navigation on click', () => {
      render(<EventCalendar events={[timedEvent]} />);

      // `fireEvent` returns `false` when a handler prevented the default behavior.
      expect(fireEvent.click(getLink())).to.equal(true);
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

  describe('focus', () => {
    it('should move focus to the day cell when the focused link is removed', async () => {
      const { setProps } = render(<EventCalendar events={[timedEvent]} defaultView="month" />);
      const link = getLink();
      const cell = link.closest<HTMLElement>('[role="gridcell"]')!;
      await act(async () => {
        link.focus();
      });

      setProps({ events: [] });

      await waitFor(() => {
        expect(document.activeElement).to.equal(cell);
      });
    });

    it('should move focus to the next link when the focused link is removed in the agenda view', async () => {
      const nextEvent = EventBuilder.new()
        .title('Order 1043')
        .span('2025-05-27T07:30:00Z', '2025-05-27T08:15:00Z')
        .readOnly()
        .href('#order-1043')
        .build();
      const { setProps } = render(
        <EventCalendar events={[timedEvent, nextEvent]} defaultView="agenda" />,
      );
      await act(async () => {
        getLink().focus();
      });

      setProps({ events: [nextEvent] });

      await waitFor(() => {
        expect(document.activeElement).to.equal(
          screen.getByRole('link', { name: getEventNamePattern('Order 1043') }),
        );
      });
    });

    it('should move focus to the day cell when the focused event becomes a link', async () => {
      const event = EventBuilder.new()
        .title('Order 1042')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .readOnly()
        .build();
      const { setProps } = render(<EventCalendar events={[event]} defaultView="month" />);
      const button = screen.getByRole('button', { name: NAME });
      const cell = button.closest<HTMLElement>('[role="gridcell"]')!;
      await act(async () => {
        button.focus();
      });

      setProps({ events: [{ ...event, href: HREF }] });

      await waitFor(() => {
        expect(document.activeElement).to.equal(cell);
      });
      expect(getLink()).to.have.attribute('href', HREF);
    });
  });
});
