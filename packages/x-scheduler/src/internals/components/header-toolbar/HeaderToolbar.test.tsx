import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
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

    const buttons = screen
      .getAllByRole('button')
      .filter((btn) => btn.className.includes('MainItem'));

    expect(buttons).toHaveLength(3);
    expect(buttons[0]).to.have.text('Week');
    expect(buttons[1]).to.have.text('Day');
    expect(buttons[2]).to.have.text('Month');

    expect(screen.getByRole('menuitem')).to.have.attribute('aria-label', 'Show more views');
  });

  it('should render the first three views + Arrow down for a custom set of views (with more than 3 views)', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week', 'day', 'month']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const buttons = screen
      .getAllByRole('button')
      .filter((btn) => btn.className.includes('MainItem'));
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Day');
    expect(screen.getByRole('menuitem')).to.have.attribute('aria-label', 'Show more views');
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

    const buttons = screen
      .getAllByRole('button')
      .filter((btn) => btn.className.includes('MainItem'));
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Day');
    expect(buttons[2]).to.have.attribute('data-pressed', 'true');

    const menuButton = screen.getByRole('menuitem');
    expect(menuButton).to.have.attribute('aria-label', 'Show more views');
  });

  it('should render the three first views for a custom set of views (with exactly 3 views)', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week', 'day']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const buttons = screen
      .getAllByRole('button')
      .filter((btn) => btn.className.includes('MainItem'));
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Day');
  });

  it('should render the two first views for a custom set of views (with exactly 2 views)', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['agenda', 'week']}>
        <HeaderToolbar />
      </EventCalendarProvider>,
    );

    const buttons = screen
      .getAllByRole('button')
      .filter((btn) => btn.className.includes('MainItem'));
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
  });
});
