import { screen } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
} from 'test/utils/scheduler';
import {
  SchedulerEvent,
  SchedulerResource,
  TemporalSupportedObject,
} from '@mui/x-scheduler-headless/models';
import { EventTimelinePremiumView } from '@mui/x-scheduler-headless-premium/models';

const baseResources: SchedulerResource[] = [
  { id: 'resource-1', title: 'Engineering', eventColor: 'blue' },
  { id: 'resource-2', title: 'Design', eventColor: 'teal' },
];

const event1 = EventBuilder.new().singleDay('2025-07-03T09:00:00Z').resource('resource-1').build();
const event2 = EventBuilder.new()
  .span('2025-07-03T11:00:00Z', '2025-07-06T12:00:00Z')
  .resource('resource-2')
  .build();
const event3 = EventBuilder.new()
  .span('2025-07-04T13:00:00Z', '2025-08-04T14:30:00Z')
  .resource('resource-1')
  .build();

const baseEvents = [event1, event2, event3];

describe('<EventTimelinePremium />', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  function renderTimeline(options?: {
    resources?: SchedulerResource[];
    events?: SchedulerEvent[];
    view?: EventTimelinePremiumView;
    views?: EventTimelinePremiumView[];
  }) {
    return render(
      <EventTimelinePremium
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
      // Check that we have one title cell per resource by counting the cells with IDs
      const resourceTitleCells = baseResources.map((resource) =>
        document.getElementById(`EventTimelinePremiumTitleCell-${resource.id}`),
      );
      expect(resourceTitleCells.filter(Boolean).length).to.equal(baseResources.length);
    });

    it('does render resources with no events', () => {
      const extendedResources: SchedulerResource[] = [
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
      const outOfRangeEvent = EventBuilder.new()
        .title('Out of range')
        .span('2050-07-04T13:00:00Z', '2050-08-04T14:30:00Z')
        .build();

      renderTimeline({ events: [...baseEvents, outOfRangeEvent] });
      baseEvents.forEach((eventItem) => {
        expect(screen.getByText(eventItem.title)).not.to.equal(null);
      });

      expect(screen.queryByText(outOfRangeEvent.title)).to.equal(null);
    });

    it('should keep events visible after rerender', () => {
      const { rerender: localRerender } = renderTimeline();
      localRerender(
        <EventTimelinePremium
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

      const eventElement = screen.getByLabelText(event1.title);
      expect(eventElement).not.to.equal(null);
      const xPositioning = eventElement.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.greaterThanOrEqual(hourBoundaries.start);
      expect(eventPosition).to.be.lessThanOrEqual(hourBoundaries.end);
    });

    it('should render events correctly in the days view', () => {
      const totalWidth = 2520; // 21 days * 120px
      const dayBoundaries = { start: 1 * 120, end: 2 * 120 }; // 4th - 5th
      renderTimeline({ view: 'days' });

      const eventElement = screen.getByLabelText(event3.title);
      expect(eventElement).not.to.equal(null);
      const xPositioning = eventElement.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.greaterThanOrEqual(dayBoundaries.start);
      expect(eventPosition).to.be.lessThanOrEqual(dayBoundaries.end);
    });

    it('should render events correctly in the weeks view', () => {
      const totalWidth = 64 * 7 * 12; // 64px * 7 days * 12 weeks
      const startOfWeek = adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE);
      const weekDayNumber = adapter.differenceInDays(
        baseEvents[0].start as TemporalSupportedObject,
        startOfWeek,
      );
      const dayBoundaries = { start: weekDayNumber * 64, end: (weekDayNumber + 1) * 64 };

      renderTimeline({ view: 'weeks' });

      const eventElement = screen.getByLabelText(event1.title);
      expect(eventElement).not.to.equal(null);
      const xPositioning = eventElement.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.greaterThanOrEqual(dayBoundaries.start);
      expect(eventPosition).to.be.lessThanOrEqual(dayBoundaries.end);
    });

    it('should render events correctly in the month view', () => {
      const nextMonthEvent = EventBuilder.new()
        .title('Next month')
        .span('2025-08-04T13:00:00Z', '2025-09-04T14:30:00Z')
        .resource('resource-1')
        .build();
      const extendedEvents: SchedulerEvent[] = [...baseEvents, nextMonthEvent];

      renderTimeline({ events: extendedEvents, view: 'months' });

      const totalWidth = 180 * 24; // 24 months
      const event1Element = screen.getByLabelText(event1.title);
      expect(event1Element).not.to.equal(null);
      const xPositioning = event1Element.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.lessThanOrEqual(180); // first month

      const nextMonthEventElement = screen.getByLabelText('Next month');
      expect(nextMonthEventElement).not.to.equal(null);
      const xPositioning2 = nextMonthEventElement.style.getPropertyValue('--x-position');

      const eventPosition2 = (totalWidth * parseFloat(xPositioning2)) / 100;

      expect(eventPosition2).to.be.greaterThanOrEqual(180); // second month
      expect(eventPosition2).to.be.lessThanOrEqual(360); // second month
    });

    it('should render events correctly in the year view', () => {
      const thisYearEvent = EventBuilder.new()
        .span('2025-08-03T13:00:00Z', '2025-09-04T14:30:00Z')
        .resource('resource-1')
        .build();
      const nextYearEvent = EventBuilder.new()
        .span('2026-08-03T13:00:00Z', '2026-09-04T14:30:00Z')
        .resource('resource-1')
        .build();

      renderTimeline({ events: [thisYearEvent, nextYearEvent], view: 'years' });

      const totalWidth = 12 * 200;
      const thisYearEventElement = screen.getByLabelText(thisYearEvent.title);
      expect(thisYearEventElement).not.to.equal(null);
      const xPositioning = thisYearEventElement.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.lessThanOrEqual(200); // 2025

      const nextYearEventElement = screen.getByLabelText(nextYearEvent.title);
      expect(nextYearEventElement).not.to.equal(null);
      const xPositioning2 = nextYearEventElement.style.getPropertyValue('--x-position');

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
      // The time header has 24 time cells (one for each hour)
      expect(rootElement.querySelectorAll('time').length).to.be.greaterThan(0);

      expect(rootElement.style.getPropertyValue('--unit-width')).to.contain('time-cell-width');

      const viewSelect = screen.getByRole('combobox');
      expect(viewSelect).not.to.equal(null);

      renderTimeline({
        view: 'days',
        views: ['days', 'time'],
      });

      rootElement = screen.getAllByRole('grid').at(-1) as HTMLElement;
      // Days header also has time elements for each day
      expect(rootElement.querySelectorAll('time').length).to.be.greaterThan(0);
      expect(rootElement.style.getPropertyValue('--unit-width')).to.contain('days-cell-width');
    });
  });
});
