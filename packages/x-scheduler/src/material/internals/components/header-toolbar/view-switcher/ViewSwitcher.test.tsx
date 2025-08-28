import * as React from 'react';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { ViewSwitcher } from './ViewSwitcher';
import { CalendarViewSwitcher } from '../calendar-view-switcher';

describe('<ViewSwitcher />', () => {
  const { render } = createSchedulerRenderer();

  const standaloneDefaults = {
    events: [],
    resources: [],
  };

  it('should render the first three calendarViews + Arrow down for the default set of calendarViews', () => {
    const { container } = render(
      <StandaloneView {...standaloneDefaults}>
        <ViewSwitcher views={['week', 'day', 'month', 'agenda']} />
      </StandaloneView>,
    );

    const buttons = container.querySelectorAll('.MainItem');
    expect(buttons).toHaveLength(4);
    expect(buttons[0]).to.have.text('Week');
    expect(buttons[1]).to.have.text('Day');
    expect(buttons[2]).to.have.text('Month');
    expect(buttons[3]).to.have.attribute('aria-label', 'Show more views');
  });

  it('should render the first three calendarViews + Arrow down for a custom set of calendarViews (with more than 3 calendarViews)', () => {
    const { container } = render(
      <StandaloneView {...standaloneDefaults}>
        <ViewSwitcher views={['agenda', 'week', 'day', 'month']} />
      </StandaloneView>,
    );

    const buttons = container.querySelectorAll('.MainItem');
    expect(buttons).toHaveLength(4);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Day');
    expect(buttons[3]).to.have.attribute('aria-label', 'Show more views');
  });

  it('should render the first three calendarViews + the selected view for a custom set of calendarViews (with more than 3 calendarViews)', () => {
    const { container } = render(
      <StandaloneView {...standaloneDefaults} view="month">
        <ViewSwitcher views={['agenda', 'week', 'day', 'month']} />
      </StandaloneView>,
    );

    const buttons = container.querySelectorAll('.MainItem');
    expect(buttons).toHaveLength(4);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Month');
    expect(buttons[3]).to.have.attribute('aria-label', 'Show more views');
    expect(buttons[2]).to.have.attribute('data-pressed', 'true');
  });

  it('should render the three first calendarViews for a custom set of calendarViews (with exactly 3 calendarViews)', () => {
    const { container } = render(
      <StandaloneView {...standaloneDefaults} calendarViews={['agenda', 'week', 'day']}>
        <CalendarViewSwitcher />
      </StandaloneView>,
    );

    const buttons = container.querySelectorAll('.MainItem');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Day');
    expect(buttons[3]).to.not.exist;
  });

  it('should render the two first calendarViews for a custom set of calendarViews (with exactly 2 calendarViews)', () => {
    const { container } = render(
      <StandaloneView {...standaloneDefaults} calendarViews={['agenda', 'week']}>
        <CalendarViewSwitcher />
      </StandaloneView>,
    );

    const buttons = container.querySelectorAll('.MainItem');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.not.exist;
  });
});
