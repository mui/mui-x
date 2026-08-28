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
    const menu = screen.getByRole('listbox');
    const menuItems = within(menu).getAllByRole('menuitem');

    expect(menuItems).toHaveLength(4);
    expect(menuItems[0]).to.have.text('Day');
    expect(menuItems[1]).to.have.text('Week');
    expect(menuItems[2]).to.have.text('Month');
    expect(menuItems[3]).to.have.text('Agenda');

    // The current view should be selected
    expect(menuItems[1]).to.have.attribute('aria-selected', 'true');
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

    const menu = screen.getByRole('listbox');
    const menuItems = within(menu).getAllByRole('menuitem');

    expect(menuItems).toHaveLength(4);
    expect(menuItems[0]).to.have.text('Agenda');
    expect(menuItems[1]).to.have.text('Week');
    expect(menuItems[2]).to.have.text('Day');
    expect(menuItems[3]).to.have.text('Month');
  });

  it('should show the selected view in the button and mark it as selected in the menu', async () => {
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

    const menu = screen.getByRole('listbox');
    const menuItems = within(menu).getAllByRole('menuitem');

    // The 'day' view (3rd item) should be selected
    expect(menuItems[2]).to.have.attribute('aria-selected', 'true');
  });

  it('should render all views in the menu for a custom set of views (with exactly 3 views)', async () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week', 'day']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const viewSwitcherButton = screen.getByRole('button', { name: 'Week' });
    fireEvent.click(viewSwitcherButton);

    const menu = screen.getByRole('listbox');
    const menuItems = within(menu).getAllByRole('menuitem');

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

    const menu = screen.getByRole('listbox');
    const menuItems = within(menu).getAllByRole('menuitem');

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

  it('shows "Week 2" for Jan 5 2025 when weekStartsOn=0 (regression)', () => {
    const visibleDate = adapter.date('2025-01-05T00:00:00Z', 'default');

    render(
      <EventCalendar
        events={[]}
        visibleDate={visibleDate}
        view="week"
        preferences={{ showWeekNumber: true, weekStartsOn: 0 }}
      />,
    );

    const badge = document.querySelector(`.${eventCalendarClasses.headerToolbarWeekNumber}`);
    expect(badge).not.to.equal(null);
    expect(badge).to.have.text('Week 2');
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
    expect(panel!.hasAttribute('aria-hidden')).to.equal(false);

    fireEvent.click(toggleButton);

    // The label/aria-expanded/aria-controls follow `isSidePanelOpen` directly, so they
    // update synchronously with the click.
    expect(screen.getByRole('button', { name: 'Open side panel' })).to.equal(toggleButton);
    expect(toggleButton).to.have.attribute('aria-expanded', 'false');
    expect(toggleButton).to.have.attribute('aria-controls', panelId);

    // `aria-hidden` only lands once the Collapse's exit transition has actually finished
    // (see the `onExited` comment in EventCalendarRoot), so it needs a `waitFor`.
    await waitFor(() => expect(panel).to.have.attribute('aria-hidden', 'true'));

    // Re-opening should clear aria-hidden again, immediately (via `onEnter`, before the
    // expand transition even starts) rather than needing to wait for it to finish.
    fireEvent.click(toggleButton);

    expect(screen.getByRole('button', { name: 'Close side panel' })).to.equal(toggleButton);
    expect(toggleButton).to.have.attribute('aria-expanded', 'true');
    expect(panel!.hasAttribute('aria-hidden')).to.equal(false);
  });

  it('should render the panel as the complementary landmark, with no nested landmark inside', () => {
    render(<EventCalendar events={[]} resources={[]} />);

    // Getting it by role (rather than by id, like the test above) pins the point of the
    // refactor: the Collapse itself is the `aside`, not a wrapper around a nested one.
    const panel = screen.getByRole('complementary');
    expect(panel.tagName).to.equal('ASIDE');
    expect(panel.querySelector('aside')).to.equal(null);
  });
});
