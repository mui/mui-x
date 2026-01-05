import { screen, within } from '@mui/internal-test-utils';
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
  it('should render the first three views + Arrow down for the default set of views', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    // MUI ToggleButtonGroup uses role="group" and ToggleButtons inside
    const toggleGroup = screen.getByRole('group');
    const toggleButtons = within(toggleGroup).getAllByRole('button');

    expect(toggleButtons).toHaveLength(3);
    expect(toggleButtons[0]).to.have.text('Week');
    expect(toggleButtons[1]).to.have.text('Day');
    expect(toggleButtons[2]).to.have.text('Month');

    expect(screen.getByRole('button', { name: 'Show more views' })).not.to.equal(null);
  });

  it('should render the first three views + Arrow down for a custom set of views (with more than 3 views)', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week', 'day', 'month']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const toggleGroup = screen.getByRole('group');
    const toggleButtons = within(toggleGroup).getAllByRole('button');
    expect(toggleButtons).toHaveLength(3);
    expect(toggleButtons[0]).to.have.text('Agenda');
    expect(toggleButtons[1]).to.have.text('Week');
    expect(toggleButtons[2]).to.have.text('Day');
    expect(screen.getByRole('button', { name: 'Show more views' })).not.to.equal(null);
  });

  it('should render the first three views + the selected view for a custom set of views (with more than 3 views)', () => {
    render(
      <EventCalendarProvider
        {...standaloneDefaults}
        view="day"
        views={['agenda', 'week', 'day', 'month']}
      >
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const toggleGroup = screen.getByRole('group');
    const toggleButtons = within(toggleGroup).getAllByRole('button');
    expect(toggleButtons).toHaveLength(3);
    expect(toggleButtons[0]).to.have.text('Agenda');
    expect(toggleButtons[1]).to.have.text('Week');
    expect(toggleButtons[2]).to.have.text('Day');
    // MUI ToggleButton uses aria-pressed instead of data-pressed
    expect(toggleButtons[2]).to.have.attribute('aria-pressed', 'true');

    expect(screen.getByRole('button', { name: 'Show more views' })).not.to.equal(null);
  });

  it('should render the three first views for a custom set of views (with exactly 3 views)', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week', 'day']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const toggleGroup = screen.getByRole('group');
    const toggleButtons = within(toggleGroup).getAllByRole('button');
    expect(toggleButtons).toHaveLength(3);
    expect(toggleButtons[0]).to.have.text('Agenda');
    expect(toggleButtons[1]).to.have.text('Week');
    expect(toggleButtons[2]).to.have.text('Day');
  });

  it('should render the two first views for a custom set of views (with exactly 2 views)', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const toggleGroup = screen.getByRole('group');
    const toggleButtons = within(toggleGroup).getAllByRole('button');
    expect(toggleButtons).toHaveLength(2);
    expect(toggleButtons[0]).to.have.text('Agenda');
    expect(toggleButtons[1]).to.have.text('Week');
  });
});
