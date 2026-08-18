import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
} from 'test/utils/scheduler';
import { within } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { CompactWeekView } from '@mui/x-scheduler/compact-week-view';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { EventDialogProvider } from '../../internals/components/event-dialog';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';

describe('<CompactWeekView />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  function renderWithProviders(
    ui: React.ReactElement,
    events: any[] = [],
    providerProps: Partial<React.ComponentProps<typeof EventCalendarProvider>> = {},
  ): ReturnType<typeof render> {
    return render(
      <EventCalendarProvider
        events={events}
        resources={[]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        {...providerProps}
      >
        <EventDialogProvider>{ui}</EventDialogProvider>
      </EventCalendarProvider>,
    );
  }

  function getDayTimeGrid() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGridContainer}`)!;
  }

  function getTimeAxisCells() {
    return document.querySelectorAll(`.${eventCalendarClasses.dayTimeGridTimeAxisCell}`);
  }

  it('should render 7 day columns', () => {
    renderWithProviders(<CompactWeekView />);

    const root = getDayTimeGrid();
    expect(root.getAttribute('aria-colcount')).to.equal('7');

    const headerCells = within(root).getAllByRole('columnheader');
    expect(headerCells.length).to.equal(7);
  });

  it('should align with start of week', () => {
    renderWithProviders(<CompactWeekView />);

    const root = getDayTimeGrid();
    const headerCells = within(root).getAllByRole('columnheader');
    // visibleDate is 2025-07-03 (Thursday). startOfWeek (Sunday-start) → June 29.
    const expectedFirstDay = adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE);
    const expectedFirstDayOfMonth = adapter.format(expectedFirstDay, 'dayOfMonth');
    expect(headerCells[0].getAttribute('aria-label')).to.match(
      new RegExp(`${expectedFirstDayOfMonth}$`),
    );
  });

  describe('viewConfig (startTime / endTime)', () => {
    it('should render the 24 hour rows by default', () => {
      renderWithProviders(<CompactWeekView />);

      expect(getTimeAxisCells()).to.have.length(24);
    });

    it('should render only the hour rows configured under the `week` key', () => {
      renderWithProviders(<CompactWeekView />, [], {
        viewConfig: { week: { startTime: 8, endTime: 20 } },
      });

      expect(getTimeAxisCells()).to.have.length(12);
    });

    it('should ignore the `day` key', () => {
      renderWithProviders(<CompactWeekView />, [], {
        viewConfig: { day: { startTime: 8, endTime: 20 } },
      });

      expect(getTimeAxisCells()).to.have.length(24);
    });

    it('should name `viewConfig.week` when it receives an invalid range', () => {
      // Same key, and therefore the same warning, as the regular week view: naming the
      // surface instead of the key would warn twice for one mistake when the layout
      // crosses the compact breakpoint.
      clearWarningsCache();
      expect(() => {
        renderWithProviders(<CompactWeekView />, [], {
          viewConfig: { week: { startTime: 20, endTime: 8 } },
        });
      }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid hour range']);
    });
  });
});
