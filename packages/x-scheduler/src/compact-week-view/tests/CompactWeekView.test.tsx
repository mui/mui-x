import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
} from 'test/utils/scheduler';
import { within } from '@mui/internal-test-utils';
import { CompactWeekView } from '@mui/x-scheduler/compact-week-view';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { EventDialogProvider } from '../../internals/components/event-dialog';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';

describe('<CompactWeekView />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  function renderWithProviders(
    ui: React.ReactElement,
    events: any[] = [],
  ): ReturnType<typeof render> {
    return render(
      <EventCalendarProvider
        events={events}
        resources={[]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      >
        <EventDialogProvider>{ui}</EventDialogProvider>
      </EventCalendarProvider>,
    );
  }

  function getDayTimeGrid() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGridContainer}`)!;
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
});
