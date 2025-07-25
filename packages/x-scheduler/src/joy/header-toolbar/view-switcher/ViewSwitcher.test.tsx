import * as React from 'react';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { StandaloneView } from '@mui/x-scheduler/joy/standalone-view';
import { ViewSwitcher } from './ViewSwitcher';

describe('<ViewSwitcher />', () => {
  const { render } = createSchedulerRenderer();

  const standaloneDefaults = {
    events: [],
    resources: [],
  };

  it('should render the two first views + Others for the default set of views', () => {
    render(
      <StandaloneView {...standaloneDefaults}>
        <ViewSwitcher />
      </StandaloneView>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).to.have.text('Week');
    expect(buttons[1]).to.have.text('Day');
    expect(buttons[2]).to.have.text('Other ');
  });

  it('should render the two first views + Others for a custom set of views (with more than 3 views)', () => {
    render(
      <StandaloneView {...standaloneDefaults} views={['agenda', 'week', 'day', 'month']}>
        <ViewSwitcher />
      </StandaloneView>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Other ');
  });

  it('should render the two first views + the selected view for a custom set of views (with more than 3 views)', () => {
    render(
      <StandaloneView
        {...standaloneDefaults}
        views={['agenda', 'week', 'day', 'month']}
        view="month"
      >
        <ViewSwitcher />
      </StandaloneView>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Month ');
  });

  it('should render the three first views for a custom set of views (with exactly 3 views)', () => {
    render(
      <StandaloneView {...standaloneDefaults} views={['agenda', 'week', 'day']}>
        <ViewSwitcher />
      </StandaloneView>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
    expect(buttons[2]).to.have.text('Day');
  });

  it('should render the two first views for a custom set of views (with exactly 2 views)', () => {
    render(
      <StandaloneView {...standaloneDefaults} views={['agenda', 'week']}>
        <ViewSwitcher />
      </StandaloneView>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).to.have.text('Agenda');
    expect(buttons[1]).to.have.text('Week');
  });
});
