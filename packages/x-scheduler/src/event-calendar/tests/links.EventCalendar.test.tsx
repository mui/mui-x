import { act, fireEvent, screen, waitFor, within } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import {
  createSchedulerRenderer,
  EventBuilder,
  getEventNamePattern,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('EventCalendar - Event links', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26') });

  // A hash keeps the navigation inside the page, which jsdom supports.
  const HREF = '#order-1042';

  const WARNING = 'MUI X Scheduler: An event has an `href` but is editable';

  // The warning is only logged once, so every test starts without it.
  beforeEach(() => {
    clearWarningsCache();
  });

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

  const namePattern = getEventNamePattern('Order 1042');

  function getLink() {
    return screen.getByRole('link', { name: namePattern });
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
        expect(link).to.have.attribute('draggable', 'false');
        expect(screen.queryByRole('button', { name: namePattern })).to.equal(null);
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

      expect(screen.queryByRole('link', { name: namePattern })).to.equal(null);
      expect(screen.getByRole('button', { name: namePattern })).not.to.equal(null);
    });

    it('should render a link in the compact views', () => {
      render(<StandaloneCompactDayView events={[timedEvent]} />);

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

      expect(() => setProps({ readOnly: false })).toWarnDev([WARNING]);

      expect(screen.queryByRole('link', { name: namePattern })).to.equal(null);
      expect(screen.getByRole('button', { name: namePattern })).not.to.equal(null);
    });

    it('should ignore the href of an editable event and warn', () => {
      const event = EventBuilder.new()
        .title('Order 1042')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .href(HREF)
        .build();

      expect(() => {
        render(<EventCalendar events={[event]} />);
      }).toWarnDev([WARNING]);

      expect(screen.queryByRole('link', { name: namePattern })).to.equal(null);
      expect(screen.getByRole('button', { name: namePattern })).not.to.equal(null);
    });

    it('should not warn for the editable events when the href comes from eventModelStructure', () => {
      const readOnlyEvent = { ...timedEvent, href: undefined, orderId: 1042 };
      const editableEvent = EventBuilder.new()
        .title('Order 1043')
        .span('2025-05-27T07:30:00Z', '2025-05-27T08:15:00Z')
        .build();

      // The test fails on any unexpected warning.
      render(
        <EventCalendar
          events={[readOnlyEvent, { ...editableEvent, orderId: 1043 }]}
          eventModelStructure={{
            href: { getter: (model) => `#order-${model.orderId}` },
          }}
        />,
      );

      expect(getLink()).to.have.attribute('href', HREF);
      expect(screen.getByRole('button', { name: getEventNamePattern('Order 1043') })).not.to.equal(
        null,
      );
    });

    it('should not warn when a link is removed with the "more events" popover open', async () => {
      const events = Array.from({ length: 6 }, (_, index) =>
        EventBuilder.new()
          .title(`Order ${1042 + index}`)
          .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
          .readOnly()
          .href(`#order-${1042 + index}`)
          .build(),
      );
      const { user, setProps } = render(<EventCalendar events={events} defaultView="month" />);
      await user.click(screen.getByRole('button', { name: /more/i }));
      const popover = await screen.findByRole('presentation');

      // The test fails on any unexpected warning.
      setProps({ events: events.slice(1) });

      await waitFor(() => {
        expect(within(popover).getAllByRole('link').length).to.equal(events.length - 1);
      });
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

    const surfaces = [
      ['time grid', 'week', timedEvent],
      ['day grid', 'week', allDayEvent],
      ['month view', 'month', timedEvent],
      ['agenda view', 'agenda', timedEvent],
    ] as const;

    it.each(surfaces)(
      'should navigate when the link is clicked in the %s',
      async (_, view, event) => {
        const { user } = render(<EventCalendar events={[event]} defaultView={view} />);

        await user.click(getLink());

        expect(window.location.hash).to.equal(HREF);
        expect(screen.queryByRole('dialog')).to.equal(null);
      },
    );

    it.each(surfaces)(
      'should navigate when Enter is pressed on the link in the %s',
      async (_, view, event) => {
        const onEventEditingStart = vi.fn();
        const { user } = render(
          <EventCalendar
            events={[event]}
            defaultView={view}
            onEventEditingStart={onEventEditingStart}
          />,
        );

        await act(async () => {
          getLink().focus();
        });
        await user.keyboard('{Enter}');

        expect(window.location.hash).to.equal(HREF);
        expect(onEventEditingStart.mock.calls.length).to.equal(0);
        expect(screen.queryByRole('dialog')).to.equal(null);
      },
    );

    // The position of a created event is read from the layout.
    it.skipIf(isJSDOM).each([
      ['time column', timedEvent],
      ['all-day row', allDayEvent],
    ] as const)('should not create an event when a link is clicked in the %s', async (_, event) => {
      // Only the event is read-only, so clicking around it creates events.
      const onEventEditingStart = vi.fn();
      const { user } = render(
        <EventCalendar
          events={[event]}
          eventCreation={{ interaction: 'click' }}
          onEventEditingStart={onEventEditingStart}
        />,
      );

      await user.click(getLink());

      expect(onEventEditingStart.mock.calls.length).to.equal(0);
      expect(screen.queryByRole('dialog')).to.equal(null);
    });

    it('should not create an event when a link is clicked in a month cell', async () => {
      const onEventEditingStart = vi.fn();
      const { user } = render(
        <EventCalendar
          events={[timedEvent]}
          defaultView="month"
          eventCreation={{ interaction: 'click' }}
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

    it.each(surfaces)(
      'should do nothing when Space is pressed on the link in the %s',
      async (_, view, event) => {
        const onEventEditingStart = vi.fn();
        const { user } = render(
          <EventCalendar
            events={[event]}
            defaultView={view}
            onEventEditingStart={onEventEditingStart}
          />,
        );

        await act(async () => {
          getLink().focus();
        });
        await user.keyboard(' ');

        expect(onEventEditingStart.mock.calls.length).to.equal(0);
        expect(screen.queryByRole('menu')).to.equal(null);
        expect(screen.queryByRole('dialog')).to.equal(null);
        expect(window.location.hash).to.equal('');
        // `fireEvent` returns `false` when a handler prevented the default behavior, here the scroll.
        expect(fireEvent.keyDown(getLink(), { key: ' ' })).to.equal(false);
      },
    );
  });

  describe('editing', () => {
    it('should stop editing an event that becomes a link', async () => {
      const event = EventBuilder.new()
        .title('Order 1042')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .href(HREF)
        .build();
      let view!: ReturnType<typeof render>;
      expect(() => {
        view = render(<EventCalendar events={[event]} />);
      }).toWarnDev([WARNING]);
      const { user, setProps } = view;
      await user.click(screen.getByRole('button', { name: namePattern }));
      await screen.findByRole('dialog');

      setProps({ readOnly: true });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).to.equal(null);
      });
      expect(getLink()).not.to.have.attribute('data-editing');

      setProps({ readOnly: false });

      expect(screen.getByRole('button', { name: namePattern })).not.to.have.attribute(
        'data-editing',
      );
      expect(screen.queryByRole('dialog')).to.equal(null);
    });
  });

  // The browser decides which elements Tab reaches.
  describe.skipIf(isJSDOM)('keyboard', () => {
    it.each([
      ['time grid', 'week', timedEvent],
      ['day grid', 'week', allDayEvent],
      ['month view', 'month', timedEvent],
    ] as const)(
      'should reach the link with Tab from its cell in the %s',
      async (_, view, event) => {
        const { userEvent: browserUser } = await import('vitest/browser');
        render(<EventCalendar events={[event]} defaultView={view} />);
        const link = getLink();
        const cell = link.parentElement!.closest<HTMLElement>('[tabindex]')!;

        await act(async () => {
          cell.focus();
        });
        await waitFor(() => {
          expect(link).to.have.attribute('tabindex', '0');
        });
        await act(async () => {
          await browserUser.keyboard('{Tab}');
        });

        expect(document.activeElement).to.equal(link);
      },
    );

    it('should reach the link with Tab in the agenda view', async () => {
      const { userEvent: browserUser } = await import('vitest/browser');
      render(<EventCalendar events={[timedEvent]} defaultView="agenda" />);
      const link = getLink();

      for (let i = 0; i < 30 && document.activeElement !== link; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await act(async () => {
          await browserUser.keyboard('{Tab}');
        });
      }

      expect(document.activeElement).to.equal(link);
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
      const button = screen.getByRole('button', { name: namePattern });
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
