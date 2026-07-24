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

  it('should render the event title and the (CSS-hidden on touch) time element', () => {
    const event = EventBuilder.new()
      .title('Compact Event')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .build();

    renderWithProviders(<CompactDayView />, [event]);

    expect(screen.getAllByText('Compact Event').length).to.be.greaterThan(0);

    // The unified time-grid event always renders the time element; the touch variant hides it via CSS
    // (`@media (pointer: coarse)`) rather than removing it. Assert the element (and its class, which the
    // CSS targets) is present — the visual hiding itself is a CSS concern, not unit-testable here.
    const timeElements = getDayTimeGrid().querySelectorAll(
      `.${eventCalendarClasses.timeGridEventTime}`,
    );
    expect(timeElements.length).to.be.greaterThan(0);
  });

  it('should render the resize handlers for a resizable event', () => {
    const event = EventBuilder.new()
      .title('Resizable Event')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .resizable(true)
      .build();

    renderWithProviders(<CompactDayView />, [event]);

    // Both handles are rendered (device-agnostic); the touch variant reveals them once the event is
    // armed and the desktop variant on hover — that reveal is CSS, but their presence guards against a
    // regression that stops rendering them entirely.
    const handlers = getDayTimeGrid().querySelectorAll(
      `.${eventCalendarClasses.timeGridEventResizeHandler}`,
    );
    expect(handlers.length).to.equal(2);
  });
});
