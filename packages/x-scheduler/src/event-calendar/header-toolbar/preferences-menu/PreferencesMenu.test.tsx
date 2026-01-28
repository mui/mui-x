import { createSchedulerRenderer, SchedulerStoreRunner } from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { EventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { EventCalendarProvider } from '../../../internals/components/EventCalendarProvider';
import { PreferencesMenu } from './PreferencesMenu';
import { getPreferencesMenu, openPreferencesMenu } from '../../../internals/utils/test-utils';

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

    // MUI MenuItem uses role="menuitem" (not menuitemcheckbox)
    expect(screen.queryByRole('menuitem', { name: /show weekends/i })).to.equal(null);
    expect(screen.queryByRole('menuitem', { name: /show week number/i })).not.to.equal(null);
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

    // MUI MenuItem uses role="menuitem" (not menuitemcheckbox)
    expect(screen.queryByRole('menuitem', { name: /show weekends/i })).not.to.equal(null);
    expect(screen.queryByRole('menuitem', { name: /show week number/i })).to.equal(null);
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

    // MUI MenuItem uses role="menuitem" (not menuitemcheckbox)
    expect(screen.queryByRole('menuitem', { name: /show weekends/i })).not.to.equal(null);
    expect(screen.queryByRole('menuitem', { name: /show week number/i })).not.to.equal(null);
    expect(screen.queryByRole('menuitem', { name: /time format/i })).to.equal(null);
  });

  it('should show "Show empty days" ONLY in Agenda view when enabled in config', async () => {
    const { user } = render(
      <EventCalendarProvider events={[]}>
        <SchedulerStoreRunner
          context={EventCalendarStoreContext}
          onMount={(store) => store.setView('agenda', {} as any)}
        />
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    await openPreferencesMenu(user);

    // MUI MenuItem uses role="menuitem" (not menuitemcheckbox)
    expect(screen.queryByRole('menuitem', { name: /show empty days/i })).not.to.equal(null);
  });

  it('should NOT show "Show empty days" in non-Agenda views even when enabled in config', async () => {
    const { user } = render(
      <EventCalendarProvider events={[]}>
        <SchedulerStoreRunner
          context={EventCalendarStoreContext}
          onMount={(store) => store.setView('week', {} as any)}
        />
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    await openPreferencesMenu(user);

    // MUI MenuItem uses role="menuitem" (not menuitemcheckbox)
    expect(screen.queryByRole('menuitem', { name: /show empty days/i })).to.equal(null);
  });

  it('should NOT show "Show empty days" in Agenda view when the config disables it', async () => {
    const { user } = render(
      <EventCalendarProvider
        events={[]}
        preferencesMenuConfig={{
          toggleEmptyDaysInAgenda: false,
        }}
      >
        <SchedulerStoreRunner
          context={EventCalendarStoreContext}
          onMount={(store) => store.setView('agenda', {} as any)}
        />
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    await openPreferencesMenu(user);

    // MUI MenuItem uses role="menuitem" (not menuitemcheckbox)
    expect(screen.queryByRole('menuitem', { name: /show empty days/i })).to.equal(null);
  });
});
