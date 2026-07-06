import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
} from 'test/utils/scheduler';
import { within } from '@mui/internal-test-utils';
import { Unstable_CompactThreeDayView as CompactThreeDayView } from '@mui/x-scheduler/compact-three-day-view';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { EventDialogProvider } from '../../internals/components/event-dialog';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';

describe('<CompactThreeDayView />', () => {
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

  it('should render 3 day columns', () => {
    renderWithProviders(<CompactThreeDayView />);

    const root = getDayTimeGrid();
    expect(root.getAttribute('aria-colcount')).to.equal('3');

    const headerCells = within(root).getAllByRole('columnheader');
    expect(headerCells.length).to.equal(3);
  });

  it('should start from visibleDate', () => {
    renderWithProviders(<CompactThreeDayView />);

    const root = getDayTimeGrid();
    const headerCells = within(root).getAllByRole('columnheader');
    const labels = headerCells.map((cell) => cell.getAttribute('aria-label'));

    // The 3-day range starts at visibleDate and shows 3 consecutive days. Derive the expected
    // day-of-month from the adapter (rather than matching a bare digit) so the assertion does
    // not also accept dates such as "13"/"23" when matching "3".
    labels.forEach((label, index) => {
      const expectedDay = adapter.getDate(adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, index));
      expect(label).to.match(new RegExp(`\\b${expectedDay}$`));
    });
  });
});
