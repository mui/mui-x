import * as React from 'react';
import { spy } from 'sinon';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { SettingsMenu } from './SettingsMenu';
import { openSettingsMenu, toggleHideWeekends } from '../../../utils/test-utils';

const setSettingsSpy = spy();
const snapshot = { settings: { hideWeekends: false } };
const fakeStore = {
  getSnapshot: () => snapshot,
  subscribe: () => () => {},
};
vi.mock('../../../hooks/useEventCalendarContext', () => ({
  useEventCalendarContext: () => ({
    store: fakeStore,
    instance: { setSettings: setSettingsSpy },
  }),
}));

describe('<SettingsMenu />', () => {
  const { render } = createSchedulerRenderer();

  it('calls setSettings when clicking "Hide weekends', async () => {
    const { user } = render(<SettingsMenu />);

    await openSettingsMenu(user);
    await toggleHideWeekends(user);

    expect(setSettingsSpy.calledOnce).to.equal(true);
    expect(setSettingsSpy.firstCall.args[0]).to.include({ hideWeekends: true });
  });
});
