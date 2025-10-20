import * as React from 'react';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { screen } from '@mui/internal-test-utils';
import { PreferencesMenu } from './PreferencesMenu';
import { getPreferencesMenu, openPreferencesMenu } from '../../../utils/test-utils';

describe('<PreferencesMenu />', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const { render } = createSchedulerRenderer();

  it('should render the menu when no config is provided', async () => {
    render(
      <EventCalendarProvider events={[]}>
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    expect(getPreferencesMenu()).not.to.equal(null);
  });

  it('should render the menu when preferencesMenuConfig has no disabled items', async () => {
    render(
      <EventCalendarProvider events={[]} preferencesMenuConfig={{}}>
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    expect(getPreferencesMenu()).not.to.equal(null);
  });

  it('should not render the menu when the config equals false', async () => {
    render(
      <EventCalendarProvider events={[]} preferencesMenuConfig={false}>
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    expect(getPreferencesMenu()).to.equal(null);
  });

  it('should not render the menu when all the items are disabled', async () => {
    render(
      <EventCalendarProvider
        events={[]}
        preferencesMenuConfig={{
          toggleWeekendVisibility: false,
          toggleWeekNumberVisibility: false,
          toggleAmpm: false,
        }}
      >
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    expect(getPreferencesMenu()).to.equal(null);
  });

  it('should hide showWeekends option when toggleWeekendVisibility is false', async () => {
    const { user } = render(
      <EventCalendarProvider
        events={[]}
        preferencesMenuConfig={{
          toggleWeekendVisibility: false,
          toggleWeekNumberVisibility: true,
          toggleAmpm: true,
        }}
      >
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    await openPreferencesMenu(user);

    expect(screen.queryByRole('menuitemcheckbox', { name: /show weekends/i })).to.equal(null);
    expect(screen.queryByRole('menuitemcheckbox', { name: /show week number/i })).not.to.equal(
      null,
    );
  });

  it('should hide showWeekNumber option when toggleWeekNumberVisibility is false', async () => {
    const { user } = render(
      <EventCalendarProvider
        events={[]}
        preferencesMenuConfig={{
          toggleWeekendVisibility: true,
          toggleWeekNumberVisibility: false,
          toggleAmpm: true,
        }}
      >
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    await openPreferencesMenu(user);

    expect(screen.queryByRole('menuitemcheckbox', { name: /show weekends/i })).not.to.equal(null);
    expect(screen.queryByRole('menuitemcheckbox', { name: /show week number/i })).to.equal(null);
  });

  it('should hide ampm option when toggleAmpm is false', async () => {
    const { user } = render(
      <EventCalendarProvider
        events={[]}
        preferencesMenuConfig={{
          toggleWeekendVisibility: true,
          toggleWeekNumberVisibility: true,
          toggleAmpm: false,
        }}
      >
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    await openPreferencesMenu(user);

    expect(screen.queryByRole('menuitemcheckbox', { name: /show weekends/i })).not.to.equal(null);
    expect(screen.queryByRole('menuitemcheckbox', { name: /show week number/i })).not.to.equal(
      null,
    );
    expect(screen.queryByRole('menuitem', { name: /time format/i })).to.equal(null);
  });
});
