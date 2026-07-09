import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import { createSchedulerRenderer, SchedulerStoreRunner } from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
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
          toggleWeekStartsOn: false,
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

  it('should show "Show empty days" ONLY in Agenda view when enabled in config', async () => {
    const { user } = render(
      <EventCalendarProvider events={[]}>
        <SchedulerStoreRunner<AnyEventCalendarStore>
          context={SchedulerStoreContext}
          onMount={(store) => store.setView('agenda', {} as any)}
        />
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    await openPreferencesMenu(user);

    expect(screen.queryByRole('menuitemcheckbox', { name: /show empty days/i })).not.to.equal(null);
  });

  it('should NOT show "Show empty days" in non-Agenda views even when enabled in config', async () => {
    const { user } = render(
      <EventCalendarProvider events={[]}>
        <SchedulerStoreRunner<AnyEventCalendarStore>
          context={SchedulerStoreContext}
          onMount={(store) => store.setView('week', {} as any)}
        />
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    await openPreferencesMenu(user);

    expect(screen.queryByRole('menuitemcheckbox', { name: /show empty days/i })).to.equal(null);
  });

  it('should NOT show "Show empty days" in Agenda view when the config disables it', async () => {
    const { user } = render(
      <EventCalendarProvider
        events={[]}
        preferencesMenuConfig={{
          toggleEmptyDaysInAgenda: false,
        }}
      >
        <SchedulerStoreRunner<AnyEventCalendarStore>
          context={SchedulerStoreContext}
          onMount={(store) => store.setView('agenda', {} as any)}
        />
        <PreferencesMenu />
      </EventCalendarProvider>,
    );

    await openPreferencesMenu(user);

    expect(screen.queryByRole('menuitemcheckbox', { name: /show empty days/i })).to.equal(null);
  });

  describe('weekStartsOn submenu', () => {
    it('should render Sunday, Monday, Saturday radios when toggleWeekStartsOn is true', async () => {
      const { user } = render(
        <EventCalendarProvider events={[]} preferencesMenuConfig={{ toggleWeekStartsOn: true }}>
          <PreferencesMenu />
        </EventCalendarProvider>,
      );

      await openPreferencesMenu(user);

      expect(screen.queryByRole('menuitemradio', { name: /sunday/i })).not.to.equal(null);
      expect(screen.queryByRole('menuitemradio', { name: /monday/i })).not.to.equal(null);
      expect(screen.queryByRole('menuitemradio', { name: /saturday/i })).not.to.equal(null);
    });

    it('should mark the current weekStartsOn value as aria-checked', async () => {
      const { user } = render(
        <EventCalendarProvider
          events={[]}
          defaultPreferences={{ weekStartsOn: 1 }}
          preferencesMenuConfig={{ toggleWeekStartsOn: true }}
        >
          <PreferencesMenu />
        </EventCalendarProvider>,
      );

      await openPreferencesMenu(user);

      expect(
        screen.getByRole('menuitemradio', { name: /monday/i }).getAttribute('aria-checked'),
      ).to.equal('true');
      expect(
        screen.getByRole('menuitemradio', { name: /sunday/i }).getAttribute('aria-checked'),
      ).to.equal('false');
      expect(
        screen.getByRole('menuitemradio', { name: /saturday/i }).getAttribute('aria-checked'),
      ).to.equal('false');
    });

    it('should update weekStartsOn preference when clicking a radio', async () => {
      const { user } = render(
        <EventCalendarProvider
          events={[]}
          defaultPreferences={{ weekStartsOn: 0 }}
          preferencesMenuConfig={{ toggleWeekStartsOn: true }}
        >
          <PreferencesMenu />
        </EventCalendarProvider>,
      );

      await openPreferencesMenu(user);

      // Sunday is currently checked
      expect(
        screen.getByRole('menuitemradio', { name: /sunday/i }).getAttribute('aria-checked'),
      ).to.equal('true');

      // Click Monday
      await user.click(screen.getByRole('menuitemradio', { name: /monday/i }));

      // Menu stays open after selecting a radio; check updated state directly.
      expect(
        screen.getByRole('menuitemradio', { name: /monday/i }).getAttribute('aria-checked'),
      ).to.equal('true');
      expect(
        screen.getByRole('menuitemradio', { name: /sunday/i }).getAttribute('aria-checked'),
      ).to.equal('false');
    });

    it('should hide weekStartsOn submenu when toggleWeekStartsOn is false', async () => {
      const { user } = render(
        <EventCalendarProvider events={[]} preferencesMenuConfig={{ toggleWeekStartsOn: false }}>
          <PreferencesMenu />
        </EventCalendarProvider>,
      );

      await openPreferencesMenu(user);

      expect(screen.queryByRole('menuitemradio', { name: /sunday/i })).to.equal(null);
      expect(screen.queryByRole('menuitemradio', { name: /monday/i })).to.equal(null);
      expect(screen.queryByRole('menuitemradio', { name: /saturday/i })).to.equal(null);
    });

    it('should not render a divider before weekStartsOn when it is the only section', async () => {
      const { user } = render(
        <EventCalendarProvider
          events={[]}
          preferencesMenuConfig={{
            toggleWeekendVisibility: false,
            toggleWeekNumberVisibility: false,
            toggleAmpm: false,
            toggleWeekStartsOn: true,
          }}
        >
          <PreferencesMenu />
        </EventCalendarProvider>,
      );

      await openPreferencesMenu(user);

      const dividers = document.querySelectorAll(`.${eventCalendarClasses.preferencesMenuDivider}`);
      expect(dividers.length).to.equal(0);
    });

    it('should render a divider before weekStartsOn when checkbox options precede it', async () => {
      const { user } = render(
        <EventCalendarProvider
          events={[]}
          preferencesMenuConfig={{
            toggleWeekendVisibility: true,
            toggleWeekNumberVisibility: false,
            toggleAmpm: false,
            toggleWeekStartsOn: true,
          }}
        >
          <PreferencesMenu />
        </EventCalendarProvider>,
      );

      await openPreferencesMenu(user);

      const dividers = document.querySelectorAll(`.${eventCalendarClasses.preferencesMenuDivider}`);
      expect(dividers.length).to.equal(1);
    });

    it('should render a divider before weekStartsOn when only the ampm section precedes it', async () => {
      const { user } = render(
        <EventCalendarProvider
          events={[]}
          preferencesMenuConfig={{
            toggleWeekendVisibility: false,
            toggleWeekNumberVisibility: false,
            toggleAmpm: true,
            toggleWeekStartsOn: true,
          }}
        >
          <PreferencesMenu />
        </EventCalendarProvider>,
      );

      await openPreferencesMenu(user);

      const dividers = document.querySelectorAll(`.${eventCalendarClasses.preferencesMenuDivider}`);
      // One divider: between ampm and weekStartsOn
      expect(dividers.length).to.equal(1);
    });
  });
});
