import { screen } from '@mui/internal-test-utils';
import { diffIn } from '@mui/x-scheduler-headless/use-adapter';
import { Timeline } from '@mui/x-scheduler/timeline';
import { CalendarEvent, CalendarResource, TimelineView } from '@mui/x-scheduler-headless/models';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
} from 'test/utils/scheduler';

const baseResources: CalendarResource[] = [
  { id: 'resource-1', title: 'Engineering', eventColor: 'blue' },
  { id: 'resource-2', title: 'Design', eventColor: 'jade' },
];

const baseEvents: CalendarEvent[] = [
  EventBuilder.new()
    .title('Spec Review')
    .singleDay('2025-07-03T09:00:00Z')
    .resource('resource-1')
    .build(),
  EventBuilder.new()
    .title('UX Sync')
    .span('2025-07-03T11:00:00Z', '2025-07-06T12:00:00Z')
    .resource('resource-2')
    .build(),
  EventBuilder.new()
    .title('Architecture Session')
    .span('2025-07-04T13:00:00Z', '2025-08-04T14:30:00Z')
    .resource('resource-1')
    .build(),
];

describe('<Timeline />', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  function renderTimeline(options?: {
    resources?: CalendarResource[];
    events?: CalendarEvent[];
    view?: TimelineView;
    views?: TimelineView[];
  }) {
    return render(
      <Timeline
        resources={options?.resources ?? baseResources}
        events={options?.events ?? baseEvents}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view={options?.view ?? 'days'}
        views={options?.views ?? ['time', 'days', 'weeks', 'months', 'years']}
      />,
    );
  }

  describe('resources', () => {
    it('renders all resource titles', () => {
      renderTimeline();

      baseResources.forEach((resourceItem) => {
        expect(screen.getByText(resourceItem.title)).not.to.equal(null);
      });
      const resourceTitleCells = document.querySelectorAll('.TimelineTitleCell');
      expect(resourceTitleCells.length).to.equal(baseResources.length);
    });

    it('does render resources with no events', () => {
      const extendedResources: CalendarResource[] = [
        ...baseResources,
        { id: 'resource-3', title: 'QA', eventColor: 'red' },
      ];
      renderTimeline({ resources: extendedResources });

      expect(screen.queryByText('QA')).to.not.equal(null);
    });
  });

  describe('events', () => {
    it('should render all visible events', () => {
      renderTimeline();
      baseEvents.forEach((eventItem) => {
        expect(screen.getByText(eventItem.title)).not.to.equal(null);
      });
    });

    it('does not render events out of range', () => {
      const extendedEvents: CalendarEvent[] = [
        ...baseEvents,
        EventBuilder.new()
          .title('Out of range')
          .span('2050-07-04T13:00:00Z', '2050-08-04T14:30:00Z')
          .build(),
      ];

      renderTimeline({ events: extendedEvents });
      baseEvents.forEach((eventItem) => {
        expect(screen.getByText(eventItem.title)).not.to.equal(null);
      });

      expect(screen.queryByText('Out of range')).to.equal(null);
    });

    it('should keep events visible after rerender', () => {
      const { rerender: localRerender } = renderTimeline();
      localRerender(
        <Timeline
          resources={baseResources}
          events={baseEvents}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="days"
          views={['days', 'weeks']}
        />,
      );
      baseEvents.forEach((eventItem) => {
        expect(screen.getByText(eventItem.title)).not.to.equal(null);
      });
    });

    it('should render events correctly in the time view', () => {
      const totalWidth = 4608; // 72 hours * 64px
      const hourBoundaries = { start: 9 * 64, end: 10 * 64 }; // 9:00 - 10:00
      renderTimeline({ view: 'time' });

      const event = screen.getByText('Spec Review');
      expect(event).not.to.equal(null);
      const xPositioning = event.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.greaterThanOrEqual(hourBoundaries.start);
      expect(eventPosition).to.be.lessThanOrEqual(hourBoundaries.end);
    });

    it('should render events correctly in the days view', () => {
      const totalWidth = 2520; // 21 days * 120px
      const dayBoundaries = { start: 1 * 120, end: 2 * 120 }; // 4th - 5th
      renderTimeline({ view: 'days' });

      const event = screen.getByText('Architecture Session');
      expect(event).not.to.equal(null);
      const xPositioning = event.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.greaterThanOrEqual(dayBoundaries.start);
      expect(eventPosition).to.be.lessThanOrEqual(dayBoundaries.end);
    });

    it('should render events correctly in the weeks view', () => {
      const totalWidth = 3584; // 64px * 7 days * 8 weeks
      const startOfWeek = adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE);
      const weekDayNumber = diffIn(adapter, baseEvents[0].start, startOfWeek, 'days');
      const dayBoundaries = { start: weekDayNumber * 64, end: (weekDayNumber + 1) * 64 };

      renderTimeline({ view: 'weeks' });

      const event = screen.getByText('Spec Review');
      expect(event).not.to.equal(null);
      const xPositioning = event.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.greaterThanOrEqual(dayBoundaries.start);
      expect(eventPosition).to.be.lessThanOrEqual(dayBoundaries.end);
    });

    it('should render events correctly in the month view', () => {
      const extendedEvents: CalendarEvent[] = [
        ...baseEvents,
        EventBuilder.new()
          .title('Next month')
          .span('2025-08-04T13:00:00Z', '2025-09-04T14:30:00Z')
          .resource('resource-1')
          .build(),
      ];

      renderTimeline({ events: extendedEvents, view: 'months' });

      const totalWidth = 2160; // 12 months * 180px
      const event1 = screen.getByText('Spec Review');
      expect(event1).not.to.equal(null);
      const xPositioning = event1.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.lessThanOrEqual(180); // first month

      const event2 = screen.getByText('Next month');
      expect(event2).not.to.equal(null);
      const xPositioning2 = event2.style.getPropertyValue('--x-position');

      const eventPosition2 = (totalWidth * parseFloat(xPositioning2)) / 100;

      expect(eventPosition2).to.be.greaterThanOrEqual(180); // second month
      expect(eventPosition2).to.be.lessThanOrEqual(360); // second month
    });
    it('should render events correctly in the month view', () => {
      const extendedEvents: CalendarEvent[] = [
        EventBuilder.new()
          .title('This year')
          .span('2025-08-03T13:00:00Z', '2025-09-04T14:30:00Z')
          .resource('resource-1')
          .build(),
        EventBuilder.new()
          .title('Next year')
          .span('2026-08-03T13:00:00Z', '2026-09-04T14:30:00Z')
          .resource('resource-1')
          .build(),
      ];

      renderTimeline({ events: extendedEvents, view: 'years' });

      const totalWidth = 800;
      const event1 = screen.getByText('This year');
      expect(event1).not.to.equal(null);
      const xPositioning = event1.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.lessThanOrEqual(200); // 2025

      const event2 = screen.getByText('Next year');
      expect(event2).not.to.equal(null);
      const xPositioning2 = event2.style.getPropertyValue('--x-position');

      const eventPosition2 = (totalWidth * parseFloat(xPositioning2)) / 100;

      expect(eventPosition2).to.be.greaterThanOrEqual(200); // 2026
      expect(eventPosition2).to.be.lessThanOrEqual(400); // 2026
    });
  });

  describe('views', () => {
    it('should render the correct header and updates CSS variable when switching views', async () => {
      renderTimeline({
        view: 'time',
        views: ['days', 'time'],
      });

      let rootElement = screen.getByRole('grid');
      expect(rootElement.querySelector('.TimeHeader')).not.to.equal(null);

      expect(rootElement.style.getPropertyValue('--unit-width')).to.contain('time-cell-width');

      const daysSwitchControl = screen.getByRole('button', { name: /days/i });
      expect(daysSwitchControl).not.to.equal(null);

      renderTimeline({
        view: 'days',
        views: ['days', 'time'],
      });

      rootElement = screen.getAllByRole('grid').at(-1) as HTMLElement;
      expect(rootElement.querySelector('.DaysHeader')).not.to.equal(null);
      expect(rootElement.style.getPropertyValue('--unit-width')).to.contain('days-cell-width');
    });
  });
});
