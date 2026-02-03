import { screen, waitFor } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  EventBuilder,
  withinMonthView,
} from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  changeTo24HoursFormat,
  changeTo12HoursFormat,
  openPreferencesMenu,
  toggleShowWeekends,
  toggleShowWeekNumber,
  toggleShowEmptyDaysInAgenda,
} from '../internals/utils/test-utils';

describe('EventCalendar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26') });

  const event1 = EventBuilder.new()
    .title('Running')
    .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
    .build();

  const event2 = EventBuilder.new()
    .title('Weekly')
    .span('2025-05-27T16:00:00Z', '2025-05-27T17:00:00Z')
    .build();

  // TODO: Move in a test file specific to the TimeGrid component.
  it('should render events in the correct column', () => {
    render(<EventCalendar events={[event1, event2]} />);

    const mondayEvent = screen.getByRole('button', { name: /Running/i });
    const tuesdayEvent = screen.getByRole('button', { name: /Weekly/i });

    expect(mondayEvent).not.to.equal(null);
    expect(tuesdayEvent).not.to.equal(null);

    expect(mondayEvent.textContent).to.equal('Running 7:30 AM');
    expect(tuesdayEvent.textContent).to.equal('Weekly4:00 PM - 5:00 PM');

    expect(mondayEvent.getAttribute('aria-labelledby')).to.include('header-cell-1');
    expect(tuesdayEvent.getAttribute('aria-labelledby')).to.include('header-cell-2');

    expect(screen.getByRole('columnheader', { name: /Monday 26/i })).not.to.equal(null);
    expect(screen.getByRole('columnheader', { name: /Tuesday 27/i })).not.to.equal(null);
  });

  it('should allow to show / hide resources using the UI', async () => {
    const event1WithResource = EventBuilder.new()
      .title('Running')
      .span('2025-05-26T07:30:00Z', '2025-05-26T08:15:00Z')
      .resource('1')
      .build();

    const event2WithResource = EventBuilder.new()
      .title('Weekly')
      .span('2025-05-27T16:00:00Z', '2025-05-27T17:00:00Z')
      .resource('2')
      .build();

    const { user } = render(
      <EventCalendar
        events={[event1WithResource, event2WithResource]}
        resources={[
          { id: '1', title: 'Sport' },
          { id: '2', title: 'Work' },
        ]}
      />,
    );

    // Resources are visible by default, so the checkboxes say "Hide events for ..."
    // Use findByRole to wait for the component to fully render
    const workResourceToggleButton = await screen.findByRole('checkbox', {
      name: /Hide events for Work/i,
    });
    const sportResourceToggleButton = await screen.findByRole('checkbox', {
      name: /Hide events for Sport/i,
    });

    expect(screen.queryByRole('button', { name: /Running/i })).not.to.equal(null);
    expect(screen.queryByRole('button', { name: /Weekly/i })).not.to.equal(null);

    // Hide Work resource
    await user.click(workResourceToggleButton);
    // Checkbox label changes to "Show events for ..." when hidden
    await waitFor(() => {
      expect(screen.queryByRole('checkbox', { name: /Show events for Work/i })).not.to.equal(null);
    });
    expect(screen.queryByRole('button', { name: /Weekly/i })).to.equal(null);

    // Show Work resource again (checkbox text should now be "Show events for Work")
    const workResourceToggleButton2 = screen.getByRole('checkbox', {
      name: /Show events for Work/i,
    });
    await user.click(workResourceToggleButton2);
    await waitFor(() => {
      expect(screen.queryByRole('checkbox', { name: /Hide events for Work/i })).not.to.equal(null);
    });
    expect(screen.getByRole('button', { name: /Weekly/i })).not.to.equal(null);

    // Hide Sport resource
    await user.click(sportResourceToggleButton);
    await waitFor(() => {
      expect(screen.queryByRole('checkbox', { name: /Show events for Sport/i })).not.to.equal(null);
    });
    expect(screen.queryByRole('button', { name: /Running/i })).to.equal(null);
  });

  describe('Preferences Menu', () => {
    it('should allow to show / hide the weekends using the UI in the week view', async () => {
      const { user } = render(<EventCalendar events={[]} />);

      // Weekends should be visible by default
      expect(screen.getByRole('columnheader', { name: /Sunday 25/i })).not.to.equal(null);
      expect(screen.getByRole('columnheader', { name: /Saturday 31/i })).not.to.equal(null);

      // Wait for component to fully render before opening preferences menu
      await waitFor(() =>
        expect(screen.queryByRole('button', { name: /settings/i })).not.to.equal(null),
      );

      // Hide the weekends
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      // Close menu with Escape key instead of body click
      await user.keyboard('{Escape}');
      // Wait for menu to close
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.queryByRole('columnheader', { name: /Sunday 25/i })).to.equal(null);
      expect(screen.queryByRole('columnheader', { name: /Saturday 31/i })).to.equal(null);

      // Show the weekends again
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.getByRole('columnheader', { name: /Sunday 25/i })).not.to.equal(null);
      expect(screen.getByRole('columnheader', { name: /Saturday 31/i })).not.to.equal(null);
    });

    it('should allow to show / hide the weekends using the UI in the month view', async () => {
      const { user } = render(<EventCalendar events={[]} defaultView="month" />);

      const monthView = withinMonthView();

      // Weekends should be visible by default
      expect(monthView.getByRole('columnheader', { name: /Sunday/i })).not.to.equal(null);
      expect(monthView.getByRole('columnheader', { name: /Saturday/i })).not.to.equal(null);

      // Hide the weekends
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(monthView.queryByRole('columnheader', { name: /Sunday/i })).to.equal(null);
      expect(monthView.queryByRole('columnheader', { name: /Saturday/i })).to.equal(null);

      // Show the weekends again
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(monthView.getByRole('columnheader', { name: /Sunday/i })).not.to.equal(null);
      expect(monthView.getByRole('columnheader', { name: /Saturday/i })).not.to.equal(null);
    });

    it('should allow to show / hide the weekends using the UI in the agenda view', async () => {
      const { user } = render(<EventCalendar events={[]} defaultView="agenda" />);

      // Weekends should be visible by default
      expect(screen.getByLabelText(/Saturday 31/i)).not.to.equal(null);
      expect(screen.getByLabelText(/Sunday 1/i)).not.to.equal(null);

      // Hide the weekends
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.queryByLabelText(/Saturday 31/i)).to.equal(null);
      expect(screen.queryByLabelText(/Sunday 1/i)).to.equal(null);

      // Show the weekends again
      await openPreferencesMenu(user);
      await toggleShowWeekends(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.getByLabelText(/Saturday 31/i)).not.to.equal(null);
      expect(screen.getByLabelText(/Sunday 1/i)).not.to.equal(null);
    });

    it('should allow to show / hide the week number using the UI in the month view', async () => {
      const { user } = render(<EventCalendar events={[]} defaultView="month" />);

      // Week number should not be visible by default
      const findWeekHeaders = () => screen.queryAllByRole('rowheader', { name: /week/i });
      expect(await findWeekHeaders()).to.have.lengthOf(0);

      // Show the week number
      await openPreferencesMenu(user);
      await toggleShowWeekNumber(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(await findWeekHeaders()).to.have.lengthOf.above(0);

      // Hide the week number again
      await openPreferencesMenu(user);
      await toggleShowWeekNumber(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(await findWeekHeaders()).to.have.lengthOf(0);
    });

    it('should allow to change the time format using the UI in the week view', async () => {
      const { user } = render(<EventCalendar events={[]} />);

      // 12 hours format should be visible by default
      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));

      // Change to 24 hours format
      await openPreferencesMenu(user);
      await changeTo24HoursFormat(user);
      await user.click(document.body);

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.equal(0));

      // Show 12 hours format again
      await openPreferencesMenu(user);
      await changeTo12HoursFormat(user);
      await user.click(document.body);

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));
    });

    it('should allow to change the time format using the UI in the month view', async () => {
      const { user } = render(<EventCalendar events={[event1]} defaultView="month" />);

      // 12 hours format should be visible by default
      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));

      // Change to 24 hours format
      await openPreferencesMenu(user);
      await changeTo24HoursFormat(user);
      await user.click(document.body);

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.equal(0));

      // Show 12 hours format again
      await openPreferencesMenu(user);
      await changeTo12HoursFormat(user);
      await user.click(document.body);

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));
    });

    it('should allow to change the time format using the UI in the agenda view', async () => {
      const { user } = render(<EventCalendar events={[event1]} defaultView="agenda" />);

      // 12 hours format should be visible by default
      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));

      // Change to 24 hours format
      await openPreferencesMenu(user);
      await changeTo24HoursFormat(user);
      await user.click(document.body);

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.equal(0));

      // Show 12 hours format again
      await openPreferencesMenu(user);
      await changeTo12HoursFormat(user);
      await user.click(document.body);

      await waitFor(() => expect(screen.queryAllByText(/AM|PM/).length).to.be.above(0));
    });

    it('should allow to show / hide empty days using the UI in the agenda view', async () => {
      const saturdayEvent = EventBuilder.new().singleDay('2025-05-31T07:30:00Z').build();
      const sundayEvent = EventBuilder.new().singleDay('2025-06-02T07:30:00Z').build();

      const { user } = render(
        <EventCalendar events={[saturdayEvent, sundayEvent]} defaultView="agenda" />,
      );

      // Empty days should be visible by default
      expect(screen.getByLabelText(/Sunday 1/i)).not.to.equal(null);

      // Hide empty days
      await openPreferencesMenu(user);
      await toggleShowEmptyDaysInAgenda(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.queryByLabelText(/Sunday 1/i)).to.equal(null);

      // Show empty days again
      await openPreferencesMenu(user);
      await toggleShowEmptyDaysInAgenda(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(screen.getByLabelText(/Sunday 1/i)).not.to.equal(null);
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
});
