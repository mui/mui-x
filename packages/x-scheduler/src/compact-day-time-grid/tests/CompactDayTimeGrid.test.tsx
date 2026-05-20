import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { screen, within } from '@mui/internal-test-utils';
import { CompactDayTimeGrid } from '@mui/x-scheduler/compact-day-time-grid';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { EventDialogProvider } from '../../internals/components/event-dialog';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';

describe('<CompactDayTimeGrid />', () => {
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
    return document.querySelector<HTMLElement>(
      `.${eventCalendarClasses.dayTimeGridContainer}`,
    )!;
  }

  describe('density', () => {
    it('should render with data-density="compact" on the root container', () => {
      renderWithProviders(<CompactDayTimeGrid />);
      const root = getDayTimeGrid();
      expect(root).not.to.equal(null);
      expect(root.getAttribute('data-density')).to.equal('compact');
    });
  });

  describe('dayCount', () => {
    it('should render 3 day columns by default', () => {
      renderWithProviders(<CompactDayTimeGrid />);

      const root = getDayTimeGrid();
      expect(root.getAttribute('aria-colcount')).to.equal('3');

      const headerCells = within(root).getAllByRole('columnheader');
      expect(headerCells.length).to.equal(3);
    });

    it('should render 1 day column when dayCount=1', () => {
      renderWithProviders(<CompactDayTimeGrid dayCount={1} />);

      const root = getDayTimeGrid();
      expect(root.getAttribute('aria-colcount')).to.equal('1');

      const headerCells = within(root).getAllByRole('columnheader');
      expect(headerCells.length).to.equal(1);
    });

    it('should render 7 day columns when dayCount=7', () => {
      renderWithProviders(<CompactDayTimeGrid dayCount={7} />);

      const root = getDayTimeGrid();
      expect(root.getAttribute('aria-colcount')).to.equal('7');

      const headerCells = within(root).getAllByRole('columnheader');
      expect(headerCells.length).to.equal(7);
    });

    it('should start from visibleDate for dayCount=3', () => {
      renderWithProviders(<CompactDayTimeGrid dayCount={3} />);

      const root = getDayTimeGrid();
      const headerCells = within(root).getAllByRole('columnheader');
      // visibleDate is 2025-07-03 (Thursday). The 3-day range should include 3, 4, 5.
      const labels = headerCells.map((cell) => cell.getAttribute('aria-label'));
      expect(labels[0]).to.match(/3$/);
      expect(labels[1]).to.match(/4$/);
      expect(labels[2]).to.match(/5$/);
    });

    it('should align with start of week when dayCount=7', () => {
      renderWithProviders(<CompactDayTimeGrid dayCount={7} />);

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

  describe('event rendering', () => {
    it('should render event titles but hide event time elements via CSS', () => {
      const event = EventBuilder.new()
        .title('Compact Event')
        .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
        .build();

      renderWithProviders(<CompactDayTimeGrid dayCount={1} />, [event]);

      // The title is rendered.
      expect(screen.getAllByText('Compact Event').length).to.be.greaterThan(0);

      // Time elements still exist in the DOM but are hidden via CSS (density=compact).
      // Make sure the time element exists for the rendered event.
      const root = getDayTimeGrid();
      const timeElements = root.querySelectorAll(`.${eventCalendarClasses.timeGridEventTime}`);
      // There is one time element per event (start time / range).
      expect(timeElements.length).to.be.greaterThan(0);
    });
  });
});
