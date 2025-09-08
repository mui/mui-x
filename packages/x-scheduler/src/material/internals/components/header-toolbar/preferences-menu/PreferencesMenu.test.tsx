import * as React from 'react';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { screen } from '@mui/internal-test-utils';
import { PreferencesMenu } from './PreferencesMenu';
import { getPreferencesMenu, openPreferencesMenu } from '../../../utils/test-utils';

describe('<PreferencesMenu />', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const { render } = createSchedulerRenderer();

  it('should render the menu when no config is provided', async () => {
    render(
      <StandaloneView events={[]}>
        <PreferencesMenu />
      </StandaloneView>,
    );

    expect(getPreferencesMenu()).not.to.equal(null);
  });

  it('should render the menu when preferencesMenuConfig has no disabled items', async () => {
    render(
      <StandaloneView events={[]} preferencesMenuConfig={{}}>
        <PreferencesMenu />
      </StandaloneView>,
    );

    expect(getPreferencesMenu()).not.to.equal(null);
  });

  it('should not render the menu when the config equals false', async () => {
    render(
      <StandaloneView events={[]} preferencesMenuConfig={false}>
        <PreferencesMenu />
      </StandaloneView>,
    );

    expect(getPreferencesMenu()).to.equal(null);
  });

  it('should not render the menu when all the items are disabled', async () => {
    render(
      <StandaloneView
        events={[]}
        preferencesMenuConfig={{
          toggleWeekendVisibility: false,
          toggleWeekNumberVisibility: false,
        }}
      >
        <PreferencesMenu />
      </StandaloneView>,
    );

    expect(getPreferencesMenu()).to.equal(null);
  });

  it('should hide showWeekends option when toggleWeekendVisibility is false', async () => {
    const { user } = render(
      <StandaloneView
        events={[]}
        preferencesMenuConfig={{ toggleWeekendVisibility: false, toggleWeekNumberVisibility: true }}
      >
        <PreferencesMenu />
      </StandaloneView>,
    );

    await openPreferencesMenu(user);

    expect(screen.queryByRole('menuitemcheckbox', { name: /show weekends/i })).to.equal(null);
    expect(screen.queryByRole('menuitemcheckbox', { name: /show week number/i })).not.to.equal(
      null,
    );
  });

  it('should hide showWeekNumber option when toggleWeekNumberVisibility is false', async () => {
    const { user } = render(
      <StandaloneView
        events={[]}
        preferencesMenuConfig={{ toggleWeekendVisibility: true, toggleWeekNumberVisibility: false }}
      >
        <PreferencesMenu />
      </StandaloneView>,
    );

    await openPreferencesMenu(user);

    expect(screen.queryByRole('menuitemcheckbox', { name: /show weekends/i })).not.to.equal(null);
    expect(screen.queryByRole('menuitemcheckbox', { name: /show week number/i })).to.equal(null);
  });
});
