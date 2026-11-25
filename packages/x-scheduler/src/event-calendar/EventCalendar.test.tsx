import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act, screen, waitFor, within } from '@mui/internal-test-utils';
import type { MuiRenderResult } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import {
  createSchedulerRenderer,
  EventBuilder,
  ResourceBuilder,
  withinMonthView,
  setSystemTimezone,
  changeTo24HoursFormat,
  changeTo12HoursFormat,
  openPreferencesMenu,
  toggleShowWeekends,
  toggleShowWeekNumber,
  toggleShowEmptyDaysInAgenda,
} from 'test/utils/scheduler';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import type { EventCalendarPreferences } from '@mui/x-scheduler/models';
import type { CalendarView } from '@mui/x-scheduler-internals/models';
import { EventCalendarStore } from '@mui/x-scheduler-internals/use-event-calendar';
import type { SchedulerUserFacingErrorDescriptor } from '@mui/x-scheduler-internals/internals';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { vi, describe, it, expect } from 'vitest';
import { ErrorContainer } from '../internals/components/error-container';
import { SharedComponentsStyledContext } from '../internals/components/SharedComponentsStyledContext';
import { EVENT_CALENDAR_DEFAULT_LOCALE_TEXT } from '../internals/constants/defaultLocaleText';

describe('EventCalendar', () => {
  const { render, renderSettled } = createSchedulerRenderer({
    clockConfig: new Date('2025-05-26'),
  });

  const event1 = EventBuilder.new()
    .title('Running')
    .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
    .build();

  const event2 = EventBuilder.new()
    .title('Weekly')
    .span('2025-05-27T16:00:00Z', '2025-05-27T17:00:00Z')
    .build();

  it('should announce the primary resource of the event', () => {
    const sport = ResourceBuilder.new().id('sport').title('Sport').build();
    const other = ResourceBuilder.new().id('other').title('Other').build();
    const running = EventBuilder.new()
      .title('Running')
      .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
      .resources([sport, other])
      .build();

    render(<EventCalendar events={[running]} resources={[sport, other]} />);

    expect(
      screen.getByRole('button', {
        name: 'Running, 7:30 AM to 8:15 AM, Monday, May 26, 2025, Resource: Sport',
      }),
    ).not.to.equal(null);
  });

  it('should keep the resource color indicator out of the accessibility tree', () => {
    const sport = ResourceBuilder.new().id('sport').title('Sport').build();
    const running = EventBuilder.new()
      .title('Running')
      .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
      .resource(sport)
      .build();

    render(<EventCalendar events={[running]} resources={[sport]} defaultView="month" />);

    const indicators = document.querySelectorAll(`.${eventCalendarClasses.eventColorIndicator}`);
    expect(indicators.length).to.be.greaterThan(0);
    indicators.forEach((indicator) => {
      expect(indicator).to.have.attribute('aria-hidden', 'true');
      expect(indicator).not.to.have.attribute('role');
      expect(indicator).not.to.have.attribute('aria-label');
    });
  });

  it('should translate the event accessible name through localeText', () => {
    render(
      <EventCalendar
        events={[event1]}
        localeText={{ eventAriaLabelTimeRange: (start, end) => `de ${start} a ${end}` }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Running, de 7:30 AM a 8:15 AM, Monday, May 26, 2025' }),
    ).not.to.equal(null);
  });

  // TODO: Move in a test file specific to the TimeGrid component.
  it('should render events in the correct column', () => {
    render(<EventCalendar events={[event1, event2]} />);

    const mondayEvent = screen.getByRole('button', { name: /Running/i });
    const tuesdayEvent = screen.getByRole('button', { name: /Weekly/i });

    expect(mondayEvent).not.to.equal(null);
    expect(tuesdayEvent).not.to.equal(null);

    expect(mondayEvent.textContent).to.equal('Running 7:30 AM');
    expect(tuesdayEvent.textContent).to.equal('Weekly4:00 PM - 5:00 PM');

    expect(mondayEvent).to.have.attribute(
      'aria-label',
      'Running, 7:30 AM to 8:15 AM, Monday, May 26, 2025',
    );
    expect(tuesdayEvent).to.have.attribute(
      'aria-label',
      'Weekly, 4:00 PM to 5:00 PM, Tuesday, May 27, 2025',
    );
    expect(mondayEvent).not.to.have.attribute('aria-labelledby');

    expect(screen.getByRole('columnheader', { name: /Monday, May 26/i })).not.to.equal(null);
    expect(screen.getByRole('columnheader', { name: /Tuesday, May 27/i })).not.to.equal(null);
  });

  it('should allow to show / hide resources using the UI', async () => {
    const sportResource = ResourceBuilder.new().title('Sport').build();
    const workResource = ResourceBuilder.new().title('Work').build();

    const event1WithResource = EventBuilder.new()
      .title('Running')
      .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
      .resource(sportResource)
      .build();

    const event2WithResource = EventBuilder.new()
      .title('Weekly')
      .span('2025-05-27T16:00:00Z', '2025-05-27T17:00:00Z')
      .resource(workResource)
      .build();

    const { user } = render(
      <EventCalendar
        events={[event1WithResource, event2WithResource]}
        resources={[sportResource, workResource]}
      />,
    );

    const getCheckbox = (resourceName: RegExp) => {
      const treeItem = screen.getByRole('treeitem', { name: resourceName });
      return treeItem.querySelector('input[type="checkbox"]') as HTMLInputElement;
    };

    await screen.findByRole('treeitem', { name: /Work/i });
    expect(getCheckbox(/Work/i).checked).to.equal(true);
    expect(getCheckbox(/Sport/i).checked).to.equal(true);

    expect(screen.queryByRole('button', { name: /Running/i })).not.to.equal(null);
    expect(screen.queryByRole('button', { name: /Weekly/i })).not.to.equal(null);

    // Hide Work resource
    await user.click(getCheckbox(/Work/i));
    await waitFor(() => {
      expect(getCheckbox(/Work/i).checked).to.equal(false);
    });
    expect(screen.queryByRole('button', { name: /Weekly/i })).to.equal(null);

    // Show Work resource again
    await user.click(getCheckbox(/Work/i));
    await waitFor(() => {
      expect(getCheckbox(/Work/i).checked).to.equal(true);
    });
    expect(screen.getByRole('button', { name: /Weekly/i })).not.to.equal(null);

    // Hide Sport resource
    await user.click(getCheckbox(/Sport/i));
    await waitFor(() => {
      expect(getCheckbox(/Sport/i).checked).to.equal(false);
    });
    expect(screen.queryByRole('button', { name: /Running/i })).to.equal(null);
  }, 10_000);

  it.skipIf(isJSDOM)(
    'should expose tree semantics and support keyboard navigation in the resource sidebar',
    async () => {
      const childResource = ResourceBuilder.new().id('running').title('Running').build();
      const parentResource = ResourceBuilder.new()
        .id('sport')
        .title('Sport')
        .children([childResource])
        .build();

      const childEvent = EventBuilder.new()
        .title('Morning Run')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .resource(childResource)
        .build();

      const { user, container } = render(
        <EventCalendar events={[childEvent]} resources={[parentResource]} />,
      );
      // Previous tests may have left their rendered DOM in `<body>`; scope
      // queries to this render's container so we only see this test's tree.
      const view = within(container);

      const tree = await view.findByRole('tree');
      expect(tree).not.to.equal(null);
      const treeItems = view.getAllByRole('treeitem');
      expect(treeItems.length).to.equal(2);

      const runningTreeItem = view.getByRole('treeitem', { name: 'Running' });
      const runningCheckbox = runningTreeItem.querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;
      expect(runningCheckbox.checked).to.equal(true);

      // ARIA tree pattern: focus the treeitem (a real user would Tab into the
      // tree and use Arrow keys to land here) and use Space to toggle selection.
      // The focus() call updates the TreeView's focus store, so wrap in act().
      act(() => {
        runningTreeItem.focus();
      });
      await user.keyboard(' ');
      await waitFor(() => {
        expect(runningCheckbox.checked).to.equal(false);
      });
      expect(view.queryByRole('button', { name: /Morning Run/i })).to.equal(null);
    },
  );

  describe('opening a date in Day view', () => {
    const getContent = () => screen.getByRole('region', { name: 'Calendar content' });
    const lunch = EventBuilder.new()
      .title('Lunch')
      .span('2025-05-26T12:00:00Z', '2025-05-26T13:00:00Z')
      .build();

    async function openDate(user: MuiRenderResult['user'], view: 'month' | 'week', day: number) {
      const content = within(getContent());
      if (view === 'month') {
        await user.click(content.getByRole('button', { name: String(day) }));
      } else {
        const header = content.getByRole('columnheader', { name: new RegExp(`May ${day}$`) });
        act(() => header.focus());
        await user.keyboard('{Enter}');
      }
    }

    it.each(['month', 'week'] as const)(
      'should focus the first event when opening a day from %s view and let Tab reach the next event',
      async (defaultView) => {
        const { user } = await renderSettled(
          <EventCalendar events={[lunch, event1]} defaultView={defaultView} />,
        );
        const content = getContent();
        await openDate(user, defaultView, 26);

        expect(content).to.have.attribute('data-view', 'day');
        expect(within(content).getByRole('button', { name: /^Running,/ })).toHaveFocus();
        await user.tab();
        expect(within(content).getByRole('button', { name: /^Lunch,/ })).toHaveFocus();
      },
    );

    it.each(['month', 'week'] as const)(
      'should focus the all-day cell when opening an empty day from %s view and Tab to the time column',
      async (defaultView) => {
        const { user } = await renderSettled(
          <EventCalendar events={[event1]} defaultView={defaultView} />,
        );
        const content = getContent();
        await openDate(user, defaultView, 25);

        expect(content).to.have.attribute('data-view', 'day');
        expect(within(content).getByRole('columnheader')).toHaveAccessibleName('Sunday, May 25');
        expect(
          within(content).getByRole('gridcell', { name: /All-day and multi-day events/ }),
        ).toHaveFocus();
        await user.tab();
        // Firefox can make the scrollable time grid an extra native Tab stop.
        if (
          document.activeElement === content.querySelector(`.${eventCalendarClasses.dayTimeGrid}`)
        ) {
          await user.tab();
        }
        expect(within(content).getByRole('gridcell', { name: '' })).toHaveFocus();
      },
    );

    it('should focus the all-day event when a controlled calendar commits the view change synchronously', async () => {
      const holiday = EventBuilder.new()
        .title('Holiday')
        .span('2025-05-26', '2025-05-27', { allDay: true })
        .build();
      function ControlledCalendar() {
        const [view, setView] = React.useState<CalendarView>('week');
        const [date, setDate] = React.useState(new Date('2025-05-28T12:00:00Z'));
        return (
          <EventCalendar
            events={[event1, holiday]}
            view={view}
            onViewChange={(nextView) => ReactDOM.flushSync(() => setView(nextView))}
            visibleDate={date}
            onVisibleDateChange={(nextDate) => setDate(nextDate)}
          />
        );
      }
      const { user } = await renderSettled(<ControlledCalendar />);
      const content = getContent();
      await user.click(within(content).getByRole('button', { name: /26$/ }));

      expect(content).to.have.attribute('data-view', 'day');
      expect(within(content).getByRole('button', { name: /^Holiday,/ })).toHaveFocus();
    });

    it('should preserve focus moved by the app while opening a date', async () => {
      const field = React.createRef<HTMLInputElement>();
      const { user } = await renderSettled(
        <React.Fragment>
          <input ref={field} aria-label="Notes" />
          <EventCalendar
            events={[event1]}
            defaultView="month"
            onViewChange={() => field.current!.focus()}
          />
        </React.Fragment>,
      );
      await openDate(user, 'month', 26);
      expect(getContent()).to.have.attribute('data-view', 'day');
      expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus();
    });

    it('should keep the next event tabbable when focus returns to an event after closing its dialog', async () => {
      const { user } = await renderSettled(
        <EventCalendar events={[event1, lunch]} defaultView="day" />,
      );
      const content = within(getContent());
      const running = content.getByRole('button', { name: /^Running,/ });
      await user.click(running);
      await screen.findByRole('dialog');
      await user.keyboard('{Escape}');
      await waitFor(() => expect(running).toHaveFocus());
      await user.tab();
      expect(content.getByRole('button', { name: /^Lunch,/ })).toHaveFocus();
    });

    it.skipIf(isJSDOM)(
      'should preserve the calendar and outer scroll positions when focusing a late event',
      async () => {
        const lateEvent = EventBuilder.new()
          .title('Late event')
          .span('2025-05-26T21:00:00Z', '2025-05-26T22:00:00Z')
          .build();
        const outer = React.createRef<HTMLDivElement>();
        let scrollAtActivation: number | undefined;
        await renderSettled(
          <div
            ref={outer}
            style={{ height: 300, overflow: 'auto' }}
            onClickCapture={(event) => {
              scrollAtActivation = event.currentTarget.scrollTop;
            }}
          >
            <div style={{ height: 220 }} />
            <EventCalendar events={[lateEvent]} defaultView="month" style={{ height: 400 }} />
          </div>,
        );
        const content = getContent();
        const dateButton = within(content).getByRole('button', { name: '26' });
        // A screen reader can activate the date button without first focusing it.
        await act(async () => dateButton.click());
        expect(within(content).getByRole('button', { name: /^Late event,/ })).toHaveFocus();
        const grid = content.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGrid}`)!;
        const hour = grid.querySelector<HTMLElement>(
          `.${eventCalendarClasses.dayTimeGridTimeAxisCell}`,
        )!;
        expect(grid.scrollTop).to.equal(7 * hour.getBoundingClientRect().height);
        expect(outer.current!.scrollTop).to.equal(scrollAtActivation);
      },
    );

    it('should leave focus on the toolbar when switching views after a canceled date change', async () => {
      const { user } = await renderSettled(
        <EventCalendar
          events={[event1]}
          defaultView="week"
          onVisibleDateChange={(_date, details) => details.cancel()}
        />,
      );
      const content = getContent();
      await openDate(user, 'week', 26);
      expect(within(content).getByRole('columnheader', { name: 'Monday, May 26' })).toHaveFocus();
      expect(content).to.have.attribute('data-view', 'week');

      const viewSwitcher = screen.getByRole('button', { name: 'Week' });
      await user.click(viewSwitcher);
      await user.click(screen.getByRole('menuitemradio', { name: 'Day' }));
      expect(content).to.have.attribute('data-view', 'day');
      expect(viewSwitcher).toHaveFocus();
    });

    it('should discard a declined controlled view change before a later switch to Day', async () => {
      const onViewChange = vi.fn();
      const { user, setProps } = await renderSettled(
        <EventCalendar events={[event1]} view="month" onViewChange={onViewChange} />,
      );
      const content = getContent();
      await openDate(user, 'month', 26);
      expect(onViewChange.mock.calls[0][0]).to.equal('day');
      expect(content).to.have.attribute('data-view', 'month');

      setProps({ view: 'day' });
      expect(content).to.have.attribute('data-view', 'day');
      expect(content.contains(document.activeElement)).to.equal(false);
    });
  });

  describe('current day', () => {
    // Browsers cannot change their timezone through process.env.TZ.
    it.skipIf(!isJSDOM).each([
      { view: 'month', viewLabel: '30', currentColumnCount: 0 },
      { view: 'week', viewLabel: 'Friday, December 30', currentColumnCount: 1 },
      { view: 'agenda', viewLabel: 'Friday, December 30', currentColumnCount: 0 },
    ] as const)(
      'should mark the current day of the display timezone in the $view view, whatever the timezone of the system',
      ({ view, viewLabel, currentColumnCount }) => {
        // Pacific/Apia skipped December 30th, 2011: on a system there, the getters of `Date` read
        // December 30th and 31st of the other timezones as the same day.
        setSystemTimezone('Pacific/Apia');
        // It's still December 30th at 21:00 in New York, but December 31st in UTC and in Apia.
        const now = new Date('2011-12-31T02:00:00Z');
        vi.setSystemTime(now);
        render(
          <EventCalendar
            events={[]}
            view={view}
            visibleDate={now}
            displayTimezone="America/New_York"
          />,
        );

        // The mini calendar of the side panel marks the current day too.
        const currentLabels = Array.from(document.querySelectorAll('[aria-current="date"]')).map(
          (element) => element.getAttribute('aria-label') ?? element.textContent,
        );
        expect(currentLabels).to.deep.equal(['Friday, December 30, 2011', viewLabel]);
        expect(
          document.querySelectorAll(`.${eventCalendarClasses.dayTimeGridColumn}[data-current]`),
        ).to.have.length(currentColumnCount);
      },
    );
  });

  describe('Preferences Menu', () => {
    it('should call onPreferencesChange and apply the change when preferences are controlled', async () => {
      const onPreferencesChange = vi.fn();
      function ControlledCalendar() {
        const [preferences, setPreferences] = React.useState<Partial<EventCalendarPreferences>>({
          showWeekends: true,
        });
        return (
          <EventCalendar
            events={[]}
            preferences={preferences}
            onPreferencesChange={(next, eventDetails) => {
              onPreferencesChange(next, eventDetails);
              setPreferences(next);
            }}
          />
        );
      }

      const { user } = render(<ControlledCalendar />);

      expect(screen.getByRole('columnheader', { name: /Sunday, May 25/i })).not.to.equal(null);

      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(onPreferencesChange.mock.calls.length).to.equal(1);
      expect(onPreferencesChange.mock.lastCall?.[0]).to.deep.equal({ showWeekends: false });
      expect(screen.queryByRole('columnheader', { name: /Sunday, May 25/i })).to.equal(null);
    });

    it('should allow to show / hide the weekends using the UI in the week view', async () => {
      const { user } = render(<EventCalendar events={[]} />);

      // Weekends should be visible by default
      expect(screen.getByRole('columnheader', { name: /Sunday, May 25/i })).not.to.equal(null);
      expect(screen.getByRole('columnheader', { name: /Saturday, May 31/i })).not.to.equal(null);

      // Wait for component to fully render before opening preferences menu
      await waitFor(() =>
        expect(screen.queryByRole('button', { name: /preferences/i })).not.to.equal(null),
      );

      // Hide the weekends
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      // Close menu with Escape key instead of body click
      await user.keyboard('{Escape}');
      // Wait for menu to close
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.queryByRole('columnheader', { name: /Sunday, May 25/i })).to.equal(null);
      expect(screen.queryByRole('columnheader', { name: /Saturday, May 31/i })).to.equal(null);

      // Show the weekends again
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.getByRole('columnheader', { name: /Sunday, May 25/i })).not.to.equal(null);
      expect(screen.getByRole('columnheader', { name: /Saturday, May 31/i })).not.to.equal(null);
    });

    it('should allow to show / hide the weekends using the UI in the month view', async () => {
      const { user } = render(<EventCalendar events={[]} defaultView="month" />);

      const monthView = withinMonthView();

      // Weekends should be visible by default
      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within month view
      expect(monthView.getByRole('columnheader', { name: /Sunday/i })).not.to.equal(null);
      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within month view
      expect(monthView.getByRole('columnheader', { name: /Saturday/i })).not.to.equal(null);

      // Hide the weekends
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within month view
      expect(monthView.queryByRole('columnheader', { name: /Sunday/i })).to.equal(null);
      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within month view
      expect(monthView.queryByRole('columnheader', { name: /Saturday/i })).to.equal(null);

      // Show the weekends again
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within month view
      expect(monthView.getByRole('columnheader', { name: /Sunday/i })).not.to.equal(null);
      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within month view
      expect(monthView.getByRole('columnheader', { name: /Saturday/i })).not.to.equal(null);
    });

    it('should allow to show / hide the weekends using the UI in the agenda view', async () => {
      const { user } = render(<EventCalendar events={[]} defaultView="agenda" />);

      // Weekends should be visible by default
      expect(screen.getByLabelText('Saturday, May 31')).not.to.equal(null);
      expect(screen.getByLabelText('Sunday, June 1')).not.to.equal(null);

      // Hide the weekends
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.queryByLabelText('Saturday, May 31')).to.equal(null);
      expect(screen.queryByLabelText('Sunday, June 1')).to.equal(null);

      // Show the weekends again
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.getByLabelText('Saturday, May 31')).not.to.equal(null);
      expect(screen.getByLabelText('Sunday, June 1')).not.to.equal(null);
    });

    it('should allow to show / hide the week number using the UI in the month view', async () => {
      const { user } = render(<EventCalendar events={[]} defaultView="month" />);

      // Week number should not be visible by default. Week-number labels are aria-hidden,
      // so query by class instead of role.
      const findWeekHeaders = () =>
        document.querySelectorAll(`.${eventCalendarClasses.monthViewWeekNumberCell}`);
      expect(findWeekHeaders()).to.have.lengthOf(0);

      // Show the week number
      await openPreferencesMenu(user);
      await toggleShowWeekNumber(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      await waitFor(() => expect(findWeekHeaders().length).to.be.above(0));

      // Hide the week number again
      await openPreferencesMenu(user);
      await toggleShowWeekNumber(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      await waitFor(() => expect(findWeekHeaders()).to.have.lengthOf(0));
    });

    it('should allow to change the time format using the UI in the week view', async () => {
      const { user } = render(<EventCalendar events={[event1]} />);

      // 12 hours format should be visible by default
      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));

      // Change to 24 hours format
      await openPreferencesMenu(user);
      await changeTo24HoursFormat(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.equal(0));

      expect(screen.getByRole('button', { name: /^Running,/ })).to.have.attribute(
        'aria-label',
        'Running, 07:30 to 08:15, Monday, May 26, 2025',
      );

      // Show 12 hours format again
      await openPreferencesMenu(user);
      await changeTo12HoursFormat(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));
    });

    it('should allow to change the time format using the UI in the month view', async () => {
      const { user } = render(<EventCalendar events={[event1]} defaultView="month" />);

      // 12 hours format should be visible by default
      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));

      // Change to 24 hours format
      await openPreferencesMenu(user);
      await changeTo24HoursFormat(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.equal(0));
      expect(screen.getByRole('button', { name: /^Running,/ })).to.have.attribute(
        'aria-label',
        'Running, 07:30 to 08:15, Monday, May 26, 2025',
      );

      // Show 12 hours format again
      await openPreferencesMenu(user);
      await changeTo12HoursFormat(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));
    });

    it('should allow to change the time format using the UI in the agenda view', async () => {
      const { user } = render(<EventCalendar events={[event1]} defaultView="agenda" />);

      // 12 hours format should be visible by default
      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));

      // Change to 24 hours format
      await openPreferencesMenu(user);
      await changeTo24HoursFormat(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.equal(0));

      // Show 12 hours format again
      await openPreferencesMenu(user);
      await changeTo12HoursFormat(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));
    });

    it('should allow to show / hide empty days using the UI in the agenda view', async () => {
      const saturdayEvent = EventBuilder.new().singleDay('2025-05-31T07:30:00Z').build();
      const sundayEvent = EventBuilder.new().singleDay('2025-06-02T07:30:00Z').build();

      const { user } = render(
        <EventCalendar events={[saturdayEvent, sundayEvent]} defaultView="agenda" />,
      );

      // Empty days should be visible by default
      expect(screen.getByLabelText('Sunday, June 1')).not.to.equal(null);

      // Hide empty days
      await openPreferencesMenu(user);
      await toggleShowEmptyDaysInAgenda(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.queryByLabelText('Sunday, June 1')).to.equal(null);

      // Show empty days again
      await openPreferencesMenu(user);
      await toggleShowEmptyDaysInAgenda(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.getByLabelText('Sunday, June 1')).not.to.equal(null);
    });
  });

  describe('dateLocale', () => {
    it('should render day headers in French when dateLocale is fr-FR', () => {
      render(<EventCalendar events={[]} dateLocale="fr-FR" />);

      // In French, Monday is "lundi" and week starts on Monday by default
      expect(screen.getByRole('columnheader', { name: /lundi 26/i })).not.to.equal(null);
      expect(screen.getByRole('columnheader', { name: /mardi 27/i })).not.to.equal(null);
    });

    it('should render month view headers in French when dateLocale is fr-FR', () => {
      render(<EventCalendar events={[]} defaultView="month" dateLocale="fr-FR" />);

      const monthView = withinMonthView();

      // In French, Monday is "lundi"
      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within month view (mini calendar also has column headers)
      expect(monthView.getByRole('columnheader', { name: /lundi/i })).not.to.equal(null);
    });

    it('should render the calendar header with a standalone month name in Polish when dateLocale is pl-PL', () => {
      render(
        <EventCalendar
          events={[]}
          defaultVisibleDate={new Date('2026-06-01T00:00:00Z')}
          dateLocale="pl-PL"
        />,
      );

      const header = document.querySelector(`.${eventCalendarClasses.headerToolbar}`);
      const headerLabel = header?.querySelector('[aria-live="polite"]');
      expect(headerLabel).not.to.equal(null);
      expect(headerLabel).to.have.text('czerwiec 2026');
    });
  });

  describe('className property', () => {
    it('should apply className to event elements in week view', () => {
      const eventWithClassName = EventBuilder.new()
        .title('Important Meeting')
        .span('2025-05-26T10:00:00Z', '2025-05-26T11:00:00Z')
        .className('custom-event-class')
        .build();

      render(<EventCalendar events={[eventWithClassName]} />);

      const eventElement = screen.getByRole('button', { name: /Important Meeting/i });
      expect(eventElement.classList.contains('custom-event-class')).to.equal(true);
    });

    it('should apply className to event elements in month view', () => {
      const eventWithClassName = EventBuilder.new()
        .title('Monthly Event')
        .span('2025-05-26T10:00:00Z', '2025-05-26T11:00:00Z')
        .className('monthly-class')
        .build();

      render(<EventCalendar events={[eventWithClassName]} defaultView="month" />);

      const eventElement = screen.getByLabelText(/Monthly Event/i);
      expect(eventElement.classList.contains('monthly-class')).to.equal(true);
    });

    it('should apply className to event elements in agenda view', () => {
      const eventWithClassName = EventBuilder.new()
        .title('Agenda Event')
        .span('2025-05-26T14:00:00Z', '2025-05-26T15:00:00Z')
        .className('agenda-class')
        .build();

      render(<EventCalendar events={[eventWithClassName]} defaultView="agenda" />);

      const eventElement = document.querySelector('.agenda-class');
      expect(eventElement).not.to.equal(null);
      expect(eventElement?.textContent).to.include('Agenda Event');
    });
  });

  describe('classes property', () => {
    it('should apply the responsiveTypographyContainer class to the responsive container', () => {
      render(
        <EventCalendar events={[]} classes={{ responsiveTypographyContainer: 'custom-class' }} />,
      );

      const element = document.querySelector('.custom-class');
      expect(element).not.to.equal(null);
      expect(
        element?.classList.contains(eventCalendarClasses.responsiveTypographyContainer),
      ).to.equal(true);
    });
  });

  describe('onEventEditingStart', () => {
    it('should be called with the occurrence when activating an event and still open the built-in dialog', async () => {
      const onEventEditingStart = vi.fn();
      const { user } = render(
        <EventCalendar events={[event1]} onEventEditingStart={onEventEditingStart} />,
      );

      const eventButton = screen.getByRole('button', { name: /Running/i });
      await user.click(eventButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
      expect(onEventEditingStart.mock.calls.length).to.equal(1);
      expect(onEventEditingStart.mock.lastCall?.[0].id).to.equal(event1.id);
      expect(onEventEditingStart.mock.lastCall?.[1].reason).to.equal('edit');
      expect(onEventEditingStart.mock.lastCall?.[1].trigger).to.equal(eventButton);
    });

    it('should keep the built-in dialog closed when the handler cancels', async () => {
      const onEventEditingStart = vi.fn((_occurrence, eventDetails) => eventDetails.cancel());
      const { user } = render(
        <EventCalendar events={[event1]} onEventEditingStart={onEventEditingStart} />,
      );

      await user.click(screen.getByRole('button', { name: /Running/i }));

      expect(onEventEditingStart.mock.calls.length).to.equal(1);
      expect(screen.queryByRole('dialog')).to.equal(null);
    });

    it('should keep the built-in dialog closed when the handler cancels a keyboard activation', async () => {
      const onEventEditingStart = vi.fn((_occurrence, eventDetails) => eventDetails.cancel());
      const { user } = render(
        <EventCalendar events={[event1]} onEventEditingStart={onEventEditingStart} />,
      );

      const eventButton = screen.getByRole('button', { name: /Running/i });
      act(() => eventButton.focus());
      expect(eventButton).to.equal(document.activeElement);
      await user.keyboard('{Enter}');

      expect(onEventEditingStart.mock.calls.length).to.equal(1);
      expect(screen.queryByRole('dialog')).to.equal(null);
    });

    it('should keep the built-in dialog closed when the handler cancels an event creation', async () => {
      const onEventEditingStart = vi.fn((_occurrence, eventDetails) => eventDetails.cancel());
      const { user } = render(
        <EventCalendar events={[]} defaultView="month" onEventEditingStart={onEventEditingStart} />,
      );

      await user.click(withinMonthView().getAllByRole('gridcell')[10]);

      expect(onEventEditingStart.mock.calls.length).to.equal(1);
      expect(onEventEditingStart.mock.lastCall?.[1].reason).to.equal('creation');
      expect(onEventEditingStart.mock.lastCall?.[1].event.type).to.equal('click');
      const draft = onEventEditingStart.mock.lastCall?.[1].occurrence;
      expect(draft.allDay).to.equal(true);
      expect(draft.start.epochMilliseconds).to.be.lessThan(draft.end.epochMilliseconds);
      expect(onEventEditingStart.mock.lastCall?.[1].trigger).to.equal(
        withinMonthView().getAllByRole('gridcell')[10],
      );
      expect(screen.queryByRole('dialog')).to.equal(null);
    });

    it('should report a `view` reason when the whole calendar is read-only', async () => {
      const onEventEditingStart = vi.fn();
      const { user } = render(
        <EventCalendar events={[event1]} readOnly onEventEditingStart={onEventEditingStart} />,
      );

      await user.click(screen.getByRole('button', { name: /Running/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
      expect(onEventEditingStart.mock.calls.length).to.equal(1);
      expect(onEventEditingStart.mock.lastCall?.[1].reason).to.equal('view');
    });

    it('should report a `view` reason when the event belongs to a read-only resource', async () => {
      const readOnlyResource = ResourceBuilder.new().areEventsReadOnly().build();
      const lockedEvent = EventBuilder.new()
        .title('Locked')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .resource(readOnlyResource)
        .build();
      const onEventEditingStart = vi.fn();
      const { user } = render(
        <EventCalendar
          events={[lockedEvent]}
          resources={[readOnlyResource]}
          onEventEditingStart={onEventEditingStart}
        />,
      );

      await user.click(screen.getByRole('button', { name: /Locked/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
      expect(onEventEditingStart.mock.lastCall?.[1].reason).to.equal('view');
    });

    it('should keep the built-in view-only dialog closed when the handler cancels a read-only activation', async () => {
      const readOnlyEvent = EventBuilder.new()
        .title('Locked')
        .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
        .readOnly()
        .build();
      const onEventEditingStart = vi.fn((_occurrence, eventDetails) => eventDetails.cancel());
      const { user } = render(
        <EventCalendar events={[readOnlyEvent]} onEventEditingStart={onEventEditingStart} />,
      );

      await user.click(screen.getByRole('button', { name: /Locked/i }));

      expect(onEventEditingStart.mock.calls.length).to.equal(1);
      expect(onEventEditingStart.mock.lastCall?.[1].reason).to.equal('view');
      expect(screen.queryByRole('dialog')).to.equal(null);
    });
  });

  describe('ErrorContainer', () => {
    function renderErrorContainer(
      initialErrors: SchedulerUserFacingErrorDescriptor[],
      localeText = EVENT_CALENDAR_DEFAULT_LOCALE_TEXT,
    ) {
      const store = new EventCalendarStore({ events: [] });
      store.set(
        'errors',
        initialErrors.map((error, index) => ({ ...error, key: String(index) })),
      );

      return {
        store,
        ...render(
          <SchedulerStoreContext.Provider value={store as any}>
            <SharedComponentsStyledContext.Provider
              value={{ classes: eventCalendarClasses, localeText }}
            >
              <ErrorContainer />
            </SharedComponentsStyledContext.Provider>
          </SchedulerStoreContext.Provider>,
        ),
      };
    }

    const notLoaded = EVENT_CALENDAR_DEFAULT_LOCALE_TEXT.eventNotLoadedError;
    const failure = EVENT_CALENDAR_DEFAULT_LOCALE_TEXT.somethingWentWrongError;

    it('should render multiple alerts when state.errors contains multiple errors', () => {
      renderErrorContainer([{ code: 'eventNotLoadedError' }, { code: 'somethingWentWrongError' }]);

      expect(document.querySelectorAll(`.${eventCalendarClasses.errorAlert}`).length).to.equal(2);
      expect(screen.getByText(notLoaded)).not.to.equal(null);
      expect(screen.getByText(failure)).not.to.equal(null);
    });

    it('should render the message of each code from the localeText', () => {
      renderErrorContainer(
        [
          { code: 'somethingWentWrongError' },
          { code: 'readOnlyEventMovedError', params: { title: 'Standup' } },
        ],
        {
          ...EVENT_CALENDAR_DEFAULT_LOCALE_TEXT,
          somethingWentWrongError: 'Algo salió mal.',
          readOnlyEventMovedError: (title) => `No se puede mover "${title}".`,
        },
      );

      expect(screen.getByText('Algo salió mal.')).not.to.equal(null);
      expect(screen.getByText('No se puede mover "Standup".')).not.to.equal(null);
    });

    it('should remove only the dismissed alert and keep the others', async () => {
      const { user } = renderErrorContainer([
        { code: 'eventNotLoadedError' },
        { code: 'somethingWentWrongError' },
      ]);

      const closeButtons = screen.getAllByRole('button', { name: /close/i });
      expect(closeButtons.length).to.equal(2);

      await user.click(closeButtons[0]);

      await waitFor(() => {
        expect(document.querySelectorAll(`.${eventCalendarClasses.errorAlert}`).length).to.equal(1);
      });
      expect(screen.queryByText(notLoaded)).to.equal(null);
      expect(screen.getByText(failure)).not.to.equal(null);
    });

    it('should re-display the same error after dismiss when pushed again with a new key', async () => {
      const { store, user } = renderErrorContainer([{ code: 'somethingWentWrongError' }]);

      await user.click(screen.getByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(screen.queryByText(failure)).to.equal(null);
      });

      await act(async () => {
        store.set('errors', [{ code: 'somethingWentWrongError', key: 'fresh' }]);
      });

      await waitFor(() => {
        expect(screen.getByText(failure)).not.to.equal(null);
      });
    });
  });

  describe('data source', () => {
    // Lazy loading is Premium-only, so `dataSource` is not part of the community props.
    it('should keep rendering the events prop when a dataSource is passed through JavaScript', () => {
      const dataSource = {
        getEvents: () => new Promise<never[]>(() => {}),
        persistEvents: async () => ({ success: true }),
      };

      expect(() => {
        render(<EventCalendar events={[event1]} {...({ dataSource } as any)} />);
      }).toErrorDev('React does not recognize the `dataSource` prop on a DOM element.');

      expect(screen.getByRole('button', { name: /Running/i })).not.to.equal(null);
      expect(document.querySelectorAll(`.${eventCalendarClasses.eventSkeleton}`).length).to.equal(
        0,
      );
    });
  });
});
