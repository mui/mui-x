import { screen, within, fireEvent, waitFor } from '@mui/internal-test-utils';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { adapter, createSchedulerRenderer } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';
import { HeaderToolbar } from './HeaderToolbar';

describe('<ViewSwitcher />', () => {
  const { render } = createSchedulerRenderer();

  const standaloneDefaults = {
    events: [],
    resources: [],
  };

  // Rendering the HeaderToolbar instead of the ViewSwitcher directly - ViewSwitcher takes views as a prop from toolbar
  it('should render a button with the current view and all views in the menu', async () => {
    render(
      <EventCalendarProvider {...standaloneDefaults}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    // ViewSwitcher renders a button showing the current view
    const viewSwitcherButton = screen.getByRole('button', { name: 'Week' });
    expect(viewSwitcherButton).to.have.text('Week');

    // Open the menu
    fireEvent.click(viewSwitcherButton);

    // Menu should contain all default views
    const menu = screen.getByRole('menu');
    const menuItems = within(menu).getAllByRole('menuitemradio');

    expect(menuItems).toHaveLength(4);
    expect(menuItems[0]).to.have.text('Day');
    expect(menuItems[1]).to.have.text('Week');
    expect(menuItems[2]).to.have.text('Month');
    expect(menuItems[3]).to.have.text('Agenda');

    // Only the current view is checked
    expect(menuItems.map((item) => item.getAttribute('aria-checked'))).to.deep.equal([
      'false',
      'true',
      'false',
      'false',
    ]);
  });

  it('should expose aria-expanded reflecting the menu open state', async () => {
    render(
      <EventCalendarProvider {...standaloneDefaults}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const viewSwitcherButton = screen.getByRole('button', { name: 'Week' });
    expect(viewSwitcherButton).to.have.attribute('aria-expanded', 'false');

    fireEvent.click(viewSwitcherButton);

    expect(viewSwitcherButton).to.have.attribute('aria-expanded', 'true');
  });

  it('should give the menu a fixed accessible name instead of the current view', async () => {
    render(
      <EventCalendarProvider {...standaloneDefaults}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Week' }));

    // The checked item already announces the current view, so the menu must not repeat it.
    expect(screen.getByRole('menu')).toHaveAccessibleName('Views');
  });

  it('should take the menu accessible name from the localeText', async () => {
    render(<EventCalendar events={[]} localeText={{ viewSwitcherAriaLabel: 'Calendar views' }} />);

    fireEvent.click(screen.getByRole('button', { name: 'Week' }));

    expect(screen.getByRole('menu')).toHaveAccessibleName('Calendar views');
  });

  it('should render all views in the menu for a custom set of views (with more than 3 views)', async () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week', 'day', 'month']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const viewSwitcherButton = screen.getByRole('button', { name: 'Week' });
    expect(viewSwitcherButton).to.have.text('Week');

    // Open the menu
    fireEvent.click(viewSwitcherButton);

    const menu = screen.getByRole('menu');
    const menuItems = within(menu).getAllByRole('menuitemradio');

    expect(menuItems).toHaveLength(4);
    expect(menuItems[0]).to.have.text('Agenda');
    expect(menuItems[1]).to.have.text('Week');
    expect(menuItems[2]).to.have.text('Day');
    expect(menuItems[3]).to.have.text('Month');
  });

  it('should show the selected view in the button and mark it as checked in the menu', async () => {
    render(
      <EventCalendarProvider
        {...standaloneDefaults}
        view="day"
        views={['agenda', 'week', 'day', 'month']}
      >
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const viewSwitcherButton = screen.getByRole('button', { name: 'Day' });
    expect(viewSwitcherButton).to.have.text('Day');

    // Open the menu
    fireEvent.click(viewSwitcherButton);

    const menu = screen.getByRole('menu');
    const menuItems = within(menu).getAllByRole('menuitemradio');

    // The 'day' view (3rd item) should be checked
    expect(menuItems[2]).to.have.attribute('aria-checked', 'true');
  });

  it('should render all views in the menu for a custom set of views (with exactly 3 views)', async () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week', 'day']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const viewSwitcherButton = screen.getByRole('button', { name: 'Week' });
    fireEvent.click(viewSwitcherButton);

    const menu = screen.getByRole('menu');
    const menuItems = within(menu).getAllByRole('menuitemradio');

    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).to.have.text('Agenda');
    expect(menuItems[1]).to.have.text('Week');
    expect(menuItems[2]).to.have.text('Day');
  });

  it('should render all views in the menu for a custom set of views (with exactly 2 views)', async () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const viewSwitcherButton = screen.getByRole('button', { name: 'Week' });
    fireEvent.click(viewSwitcherButton);

    const menu = screen.getByRole('menu');
    const menuItems = within(menu).getAllByRole('menuitemradio');

    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).to.have.text('Agenda');
    expect(menuItems[1]).to.have.text('Week');
  });
});

describe('week number badge', () => {
  const { render } = createSchedulerRenderer();

  const standaloneDefaults = {
    events: [],
    resources: [],
  };

  it('does not render the week number badge by default in week view', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const badge = document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`);
    expect(badge).to.equal(null);
  });

  it('renders the week number badge in week view when showWeekNumber is enabled', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} preferences={{ showWeekNumber: true }}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const badge = document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`);
    expect(badge).not.to.equal(null);
  });

  it('renders the week number badge in day view when showWeekNumber is enabled', () => {
    render(
      <EventCalendarProvider
        {...standaloneDefaults}
        view="day"
        preferences={{ showWeekNumber: true }}
      >
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const badge = document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`);
    expect(badge).not.to.equal(null);
  });

  it('does not render the week number badge in month view even when showWeekNumber is enabled', () => {
    render(
      <EventCalendarProvider
        {...standaloneDefaults}
        view="month"
        preferences={{ showWeekNumber: true }}
      >
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const badge = document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`);
    expect(badge).to.equal(null);
  });

  it('does not render the week number badge in agenda view even when showWeekNumber is enabled', () => {
    render(
      <EventCalendarProvider
        {...standaloneDefaults}
        view="agenda"
        preferences={{ showWeekNumber: true }}
      >
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const badge = document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`);
    expect(badge).to.equal(null);
  });

  it('shows "Week 1" for Jan 5 2025 when weekStartsOn=1', () => {
    const visibleDate = adapter.date('2025-01-05T00:00:00Z', 'default');

    render(
      <EventCalendar
        events={[]}
        visibleDate={visibleDate}
        view="week"
        preferences={{ showWeekNumber: true, weekStartsOn: 1 }}
      />,
    );

    const badge = document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`);
    expect(badge).not.to.equal(null);
    expect(badge).to.have.text('Week 1');
  });

  it('shows "Week 2" for Jan 5 2025 when weekStartsOn=7 (regression)', () => {
    const visibleDate = adapter.date('2025-01-05T00:00:00Z', 'default');

    render(
      <EventCalendar
        events={[]}
        visibleDate={visibleDate}
        view="week"
        preferences={{ showWeekNumber: true, weekStartsOn: 7 }}
      />,
    );

    const badge = document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`);
    expect(badge).not.to.equal(null);
    expect(badge).to.have.text('Week 2');
  });

  it.each([
    // January 1st is in the first week in English (United States), and the first week holds
    // January 4th in French.
    { dateLocale: 'en-US', expected: 'Week 1' },
    { dateLocale: 'fr-FR', expected: 'Week 53' },
  ])(
    'numbers the week of Friday, January 1st, 2027 with the rules of $dateLocale',
    ({ dateLocale, expected }) => {
      render(
        <EventCalendar
          events={[]}
          visibleDate={adapter.date('2027-01-01T12:00:00Z', 'default')}
          view="week"
          dateLocale={dateLocale}
          preferences={{ showWeekNumber: true }}
        />,
      );

      expect(
        document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`),
      ).to.have.text(expected);
    },
  );

  it('keeps the first week of the locale when the weeks start on another day', () => {
    // January 1st stays in the first week of English (United States) with weeks starting on Monday.
    render(
      <EventCalendar
        events={[]}
        visibleDate={adapter.date('2027-01-01T12:00:00Z', 'default')}
        view="week"
        dateLocale="en-US"
        preferences={{ showWeekNumber: true, weekStartsOn: 1 }}
      />,
    );

    expect(document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`)).to.have.text(
      'Week 1',
    );
  });

  it('writes the week number in the digits of the locale', () => {
    render(
      <EventCalendar
        events={[]}
        visibleDate={adapter.date('2025-07-16T12:00:00Z', 'default')}
        view="week"
        dateLocale="ar-EG"
        preferences={{ showWeekNumber: true }}
      />,
    );

    expect(document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`)).to.have.text(
      'Week ٢٩',
    );
  });

  it('formats the month of the visible date in the display timezone', () => {
    // July 31st at 23:00 in UTC is August 1st in Tokyo.
    render(
      <EventCalendar
        events={[]}
        visibleDate={adapter.date('2025-07-31T23:00:00Z', 'default')}
        displayTimezone="Asia/Tokyo"
        view="week"
      />,
    );

    expect(document.querySelector(`.${eventCalendarClasses.headerToolbarLabel}`)).to.have.text(
      'August 2025',
    );
  });
});

describe('side panel toggle', () => {
  const { render } = createSchedulerRenderer();

  // Rendering the full EventCalendar (rather than HeaderToolbar standalone) so the toggle
  // button and the side panel it controls share the same generated `schedulerId`.
  it('should expose aria-expanded and aria-controls reflecting the side panel state', async () => {
    render(<EventCalendar events={[]} resources={[]} />);

    // isSidePanelOpen defaults to true
    const toggleButton = screen.getByRole('button', { name: 'Close side panel' });
    expect(toggleButton).to.have.attribute('aria-expanded', 'true');

    const panelId = toggleButton.getAttribute('aria-controls');
    if (!panelId) {
      throw new Error('Expected the toggle button to have an aria-controls attribute');
    }

    const panel = document.getElementById(panelId);
    expect(panel).not.to.equal(null);
    expect(panel).not.to.have.attribute('aria-hidden');

    fireEvent.click(toggleButton);

    // The label/aria-expanded/aria-controls follow `isSidePanelOpen` directly, so they
    // update synchronously with the click.
    expect(screen.getByRole('button', { name: 'Open side panel' })).to.equal(toggleButton);
    expect(toggleButton).to.have.attribute('aria-expanded', 'false');
    expect(toggleButton).to.have.attribute('aria-controls', panelId);

    // aria-hidden must not land until the exit transition actually finishes: asserting
    // this synchronously, right after the click and before the `waitFor` below, is what
    // pins the delay — it fails against an eager `aria-hidden={!isSidePanelOpen}`.
    expect(panel).not.to.have.attribute('aria-hidden');

    // The exit runs on a real timer (see the comment above `isSidePanelHidden` in
    // EventCalendarRoot), so it needs a `waitFor`.
    await waitFor(() => expect(panel).to.have.attribute('aria-hidden', 'true'));

    // Re-opening clears aria-hidden immediately and synchronously: the JSX gates on
    // `isSidePanelOpen` directly, so this doesn't wait on any Collapse callback.
    fireEvent.click(toggleButton);

    expect(screen.getByRole('button', { name: 'Close side panel' })).to.equal(toggleButton);
    expect(toggleButton).to.have.attribute('aria-expanded', 'true');
    expect(panel).not.to.have.attribute('aria-hidden');

    // Double-toggle: closing again before the reopen's enter transition finishes cancels
    // that transition, so onEntered never fires — the flag must already have been cleared
    // by onEnter, otherwise this close reuses the stale "hidden" flag from the previous
    // cycle and applies aria-hidden immediately, over still-visible content.
    fireEvent.click(toggleButton);

    expect(screen.getByRole('button', { name: 'Open side panel' })).to.equal(toggleButton);
    expect(panel).not.to.have.attribute('aria-hidden');
  });

  it('should render the panel as the complementary landmark, with no nested landmark inside', () => {
    render(<EventCalendar events={[]} resources={[]} />);

    // Getting it by role (rather than by id, like the test above) pins the point of the
    // refactor: the Collapse itself is the `aside`, not a wrapper around a nested one.
    const panel = screen.getByRole('complementary');
    expect(panel.tagName).to.equal('ASIDE');
    expect(panel.querySelector('aside')).to.equal(null);
  });

  it('should already be aria-hidden on mount when the panel starts closed, and clear it on open', () => {
    render(
      <EventCalendar events={[]} resources={[]} defaultPreferences={{ isSidePanelOpen: false }} />,
    );

    // No transition runs on mount, so this must come from the initial state, not a
    // Collapse callback.
    const toggleButton = screen.getByRole('button', { name: 'Open side panel' });
    const panelId = toggleButton.getAttribute('aria-controls');
    if (!panelId) {
      throw new Error('Expected the toggle button to have an aria-controls attribute');
    }

    const panel = document.getElementById(panelId);
    expect(panel).to.have.attribute('aria-hidden', 'true');

    fireEvent.click(toggleButton);

    // Same `isSidePanelOpen` gate as the reopen path above: clears synchronously.
    expect(panel).not.to.have.attribute('aria-hidden');
  });
});
