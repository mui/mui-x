import * as React from 'react';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { ViewSwitcher } from './ViewSwitcher';

describe('<ViewSwitcher />', () => {
  const { render } = createSchedulerRenderer();

  const standaloneDefaults = {
    events: [],
    resources: [],
  };

  it('should render the first three views + Arrow down for the default set of views', () => {
    const { container } = render(
      <StandaloneView {...standaloneDefaults}>
        <ViewSwitcher />
      </StandaloneView>,
    );

    const buttons = container.querySelectorAll('.MainItem');
    expect(buttons).toHaveLength(4);
    expect(buttons[0]).to.have.text('Week');
    expect(buttons[1]).to.have.text('Day');
    expect(buttons[2]).to.have.text('Month');
    expect(buttons[3]).to.have.attribute('aria-label', 'Show more views');
  });

  it('should render the first three views + Arrow down for a custom set of views (with more than 3 views)', () => {
    const { container } = render(
      <StandaloneView {...standaloneDefaults} views={['agenda', 'week', 'day', 'month']}>
        <ViewSwitcher />
      </StandaloneView>,
    );

    const buttons = container.querySelectorAll('.MainItem');
    expect(buttons).toHaveLength(4);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Day');
    expect(buttons[3]).to.have.attribute('aria-label', 'Show more views');
  });

  it('should render the first three views + the selected view for a custom set of views (with more than 3 views)', () => {
    const { container } = render(
      <StandaloneView {...standaloneDefaults} view="day" views={['agenda', 'week', 'day', 'month']}>
        <ViewSwitcher />
      </StandaloneView>,
    );

    const buttons = container.querySelectorAll('.MainItem');
    expect(buttons).toHaveLength(4);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Day');
    expect(buttons[3]).to.have.attribute('aria-label', 'Show more views');
    expect(buttons[2]).to.have.attribute('data-pressed', 'true');
  });

  it('should render the three first views for a custom set of views (with exactly 3 views)', () => {
    const { container } = render(
      <StandaloneView {...standaloneDefaults} views={['agenda', 'week', 'day']}>
        <ViewSwitcher />
      </StandaloneView>,
    );

    const buttons = container.querySelectorAll('.MainItem');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Day');
  });

  it('should render the two first views for a custom set of views (with exactly 2 views)', () => {
    const { container } = render(
      <StandaloneView {...standaloneDefaults} views={['agenda', 'week']}>
        <ViewSwitcher />
      </StandaloneView>,
    );

    const buttons = container.querySelectorAll('.MainItem');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
  });
});
