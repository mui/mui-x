import * as React from 'react';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { PreferencesMenu } from './PreferencesMenu';
import { getPreferencesMenu } from '../../../utils/test-utils';

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
      <StandaloneView events={[]} preferencesMenuConfig={{ toggleWeekendVisibility: false }}>
        <PreferencesMenu />
      </StandaloneView>,
    );

    expect(getPreferencesMenu()).to.equal(null);
  });
});
