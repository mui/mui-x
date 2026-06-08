import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { screen, within } from '@mui/internal-test-utils';
import { CompactDayView } from '@mui/x-scheduler/compact-day-view';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { EventDialogProvider } from '../../internals/components/event-dialog';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';

describe('<CompactDayView />', () => {
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

  it('should render 1 day column', () => {
    renderWithProviders(<CompactDayView />);

    const root = getDayTimeGrid();
    expect(root.getAttribute('aria-colcount')).to.equal('1');

    const headerCells = within(root).getAllByRole('columnheader');
    expect(headerCells.length).to.equal(1);
  });

  it('should render only the event title (touch variant) without time elements', () => {
    const event = EventBuilder.new()
      .title('Compact Event')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .build();

    renderWithProviders(<CompactDayView />, [event]);

    expect(screen.getAllByText('Compact Event').length).to.be.greaterThan(0);

    const root = getDayTimeGrid();
    const timeElements = root.querySelectorAll(`.${eventCalendarClasses.timeGridEventTime}`);
    expect(timeElements.length).to.equal(0);
  });
});
