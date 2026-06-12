import { createSchedulerRenderer, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { within } from '@mui/internal-test-utils';
import { CompactThreeDayView } from '@mui/x-scheduler/compact-three-day-view';
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
    // visibleDate is 2025-07-03 (Thursday). The 3-day range should include 3, 4, 5.
    const labels = headerCells.map((cell) => cell.getAttribute('aria-label'));
    expect(labels[0]).to.match(/3$/);
    expect(labels[1]).to.match(/4$/);
    expect(labels[2]).to.match(/5$/);
  });
});
