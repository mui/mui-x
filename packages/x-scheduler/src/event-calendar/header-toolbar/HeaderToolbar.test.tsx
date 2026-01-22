import { screen, within, fireEvent } from '@mui/internal-test-utils';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { createSchedulerRenderer } from 'test/utils/scheduler';
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
    const viewSwitcherButton = screen.getByRole('button', { name: 'Switch View' });
    expect(viewSwitcherButton).to.have.text('Week');

    // Open the menu
    fireEvent.click(viewSwitcherButton);

    // Menu should contain all default views
    const menu = screen.getByRole('listbox');
    const menuItems = within(menu).getAllByRole('menuitem');

    expect(menuItems).toHaveLength(4);
    expect(menuItems[0]).to.have.text('Week');
    expect(menuItems[1]).to.have.text('Day');
    expect(menuItems[2]).to.have.text('Month');
    expect(menuItems[3]).to.have.text('Agenda');

    // The current view should be selected
    expect(menuItems[0]).to.have.attribute('aria-selected', 'true');
  });

  it('should render all views in the menu for a custom set of views (with more than 3 views)', async () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week', 'day', 'month']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const viewSwitcherButton = screen.getByRole('button', { name: 'Switch View' });
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

    const viewSwitcherButton = screen.getByRole('button', { name: 'Switch View' });
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

    const viewSwitcherButton = screen.getByRole('button', { name: 'Switch View' });
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

    const viewSwitcherButton = screen.getByRole('button', { name: 'Switch View' });
    fireEvent.click(viewSwitcherButton);

    const menu = screen.getByRole('listbox');
    const menuItems = within(menu).getAllByRole('menuitem');

    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).to.have.text('Agenda');
    expect(menuItems[1]).to.have.text('Week');
  });
});
