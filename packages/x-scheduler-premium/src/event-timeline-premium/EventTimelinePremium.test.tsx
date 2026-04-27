import { screen } from '@mui/internal-test-utils';
import {
  EventTimelinePremium,
  eventTimelinePremiumClasses,
} from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import {
  SchedulerEvent,
  SchedulerResource,
  TemporalSupportedObject,
} from '@mui/x-scheduler-headless/models';
import { EventTimelinePremiumPreset } from '@mui/x-scheduler-headless-premium/models';
import { EventTimelineLocaleText } from '@mui/x-scheduler/models';

const engineering = ResourceBuilder.new().build();
const design = ResourceBuilder.new().build();

const baseResources: SchedulerResource[] = [engineering, design];

const event1 = EventBuilder.new().singleDay('2025-07-03T09:00:00Z').resource(engineering).build();
const event2 = EventBuilder.new()
  .span('2025-07-03T11:00:00Z', '2025-07-06T12:00:00Z')
  .resource(design)
  .build();
const event3 = EventBuilder.new()
  .span('2025-07-04T13:00:00Z', '2025-08-04T14:30:00Z')
  .resource(engineering)
  .build();

const baseEvents = [event1, event2, event3];

describe('<EventTimelinePremium />', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  function renderTimeline(options?: {
    resources?: SchedulerResource[];
    events?: SchedulerEvent[];
    preset?: EventTimelinePremiumPreset;
    presets?: EventTimelinePremiumPreset[];
    visibleDate?: TemporalSupportedObject;
    showCurrentTimeIndicator?: boolean;
    resourceColumnLabel?: string;
    localeText?: Partial<EventTimelineLocaleText>;
  }) {
    return render(
      <EventTimelinePremium
        resources={options?.resources ?? baseResources}
        events={options?.events ?? baseEvents}
        visibleDate={options?.visibleDate ?? DEFAULT_TESTING_VISIBLE_DATE}
        preset={options?.preset ?? 'dayAndMonth'}
        presets={
          options?.presets ?? ['dayAndHour', 'dayAndMonth', 'dayAndWeek', 'monthAndYear', 'year']
        }
        showCurrentTimeIndicator={options?.showCurrentTimeIndicator}
        resourceColumnLabel={options?.resourceColumnLabel}
        localeText={options?.localeText}
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
        document.querySelector(`[id$="-EventTimelinePremiumTitleCell-${resource.id}"]`),
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
          preset="dayAndMonth"
          presets={['dayAndMonth', 'dayAndWeek']}
        />,
      );
      baseEvents.forEach((eventItem) => {
        expect(screen.getByText(eventItem.title)).not.to.equal(null);
      });
    });

    it('should display recurrence icon only for recurring events', () => {
      const recurringEvent = EventBuilder.new()
        .title('Recurring timeline event')
        .singleDay('2025-07-03T09:00:00Z')
        .resource(engineering)
        .recurrent('DAILY')
        .build();
      const singleEvent = EventBuilder.new()
        .title('Single timeline event')
        .singleDay('2025-07-03T11:00:00Z')
        .resource(engineering)
        .build();

      renderTimeline({ events: [recurringEvent, singleEvent], preset: 'dayAndMonth' });

      const recurringEventElements = screen.getAllByLabelText(recurringEvent.title);
      expect(recurringEventElements.length).to.be.greaterThan(0);
      recurringEventElements.forEach((element) => {
        expect(
          element.querySelector(`.${eventTimelinePremiumClasses.eventRecurringIcon}`),
        ).not.to.equal(null);
      });

      const singleEventElement = screen.getByLabelText(singleEvent.title);
      expect(
        singleEventElement.querySelector(`.${eventTimelinePremiumClasses.eventRecurringIcon}`),
      ).to.equal(null);
    });

    it('should render events correctly in the dayAndHour preset', () => {
      const totalWidth = 6144; // 96 hours * 64px
      const hourBoundaries = { start: 9 * 64, end: 10 * 64 }; // 9:00 - 10:00
      renderTimeline({ preset: 'dayAndHour' });

      const eventElement = screen.getByLabelText(event1.title);
      expect(eventElement).not.to.equal(null);
      const xPositioning = eventElement.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.greaterThanOrEqual(hourBoundaries.start);
      expect(eventPosition).to.be.lessThanOrEqual(hourBoundaries.end);
    });

    it('should render events correctly in the day preset', () => {
      const totalWidth = 6720; // 56 days * 120px
      const dayBoundaries = { start: 1 * 120, end: 2 * 120 }; // 4th - 5th
      renderTimeline({ preset: 'dayAndMonth' });

      const eventElement = screen.getByLabelText(event3.title);
      expect(eventElement).not.to.equal(null);
      const xPositioning = eventElement.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.greaterThanOrEqual(dayBoundaries.start);
      expect(eventPosition).to.be.lessThanOrEqual(dayBoundaries.end);
    });

    it('should render events correctly in the dayAndWeek preset', () => {
      const totalWidth = 64 * 7 * 16; // 64px * 7 days * 16 weeks
      const startOfWeek = adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE);
      const weekDayNumber = adapter.differenceInDays(
        adapter.date(baseEvents[0].start, 'default'),
        startOfWeek,
      );
      const dayBoundaries = { start: weekDayNumber * 64, end: (weekDayNumber + 1) * 64 };

      renderTimeline({ preset: 'dayAndWeek' });

      const eventElement = screen.getByLabelText(event1.title);
      expect(eventElement).not.to.equal(null);
      const xPositioning = eventElement.style.getPropertyValue('--x-position');

      const eventPosition = (totalWidth * parseFloat(xPositioning)) / 100;

      expect(eventPosition).to.be.greaterThanOrEqual(dayBoundaries.start);
      expect(eventPosition).to.be.lessThanOrEqual(dayBoundaries.end);
    });

    it('should render events correctly in the monthAndYear preset', () => {
      const nextMonthEvent = EventBuilder.new()
        .title('Next month')
        .span('2025-08-04T13:00:00Z', '2025-09-04T14:30:00Z')
        .resource(engineering)
        .build();
      const extendedEvents: SchedulerEvent[] = [...baseEvents, nextMonthEvent];

      renderTimeline({ events: extendedEvents, preset: 'monthAndYear' });

      const totalWidth = 180 * 36; // 36 months
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

    it('should render events correctly in the year preset', () => {
      const thisYearEvent = EventBuilder.new()
        .span('2025-08-03T13:00:00Z', '2025-09-04T14:30:00Z')
        .resource(engineering)
        .build();
      const nextYearEvent = EventBuilder.new()
        .span('2026-08-03T13:00:00Z', '2026-09-04T14:30:00Z')
        .resource(engineering)
        .build();

      renderTimeline({ events: [thisYearEvent, nextYearEvent], preset: 'year' });

      const totalWidth = 30 * 200;
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

  describe('current time indicator', () => {
    it('should render the indicator when today is in view', () => {
      renderTimeline();

      const indicators = document.querySelectorAll(
        `.${eventTimelinePremiumClasses.currentTimeIndicator}`,
      );
      expect(indicators.length).to.be.greaterThan(0);
    });

    it('should not render the indicator when today is not in view', () => {
      const visibleDate = adapter.date('2030-01-01T00:00:00Z', 'default');
      renderTimeline({ visibleDate });

      const indicators = document.querySelectorAll(
        `.${eventTimelinePremiumClasses.currentTimeIndicator}`,
      );
      expect(indicators.length).to.equal(0);
    });

    it('should not render the indicator when showCurrentTimeIndicator is false', () => {
      renderTimeline({ showCurrentTimeIndicator: false });

      const indicators = document.querySelectorAll(
        `.${eventTimelinePremiumClasses.currentTimeIndicator}`,
      );
      expect(indicators.length).to.equal(0);
    });
  });

  describe('resourceColumnLabel', () => {
    it('should display "Resource title" by default', () => {
      renderTimeline();

      expect(screen.getByText('Resource title')).not.to.equal(null);
    });

    it('should display resourceColumnLabel value when provided', () => {
      renderTimeline({ resourceColumnLabel: 'Team' });

      expect(screen.getByText('Team')).not.to.equal(null);
      expect(screen.queryByText('Resource title')).to.equal(null);
    });

    it('should take priority over localeText.timelineResourceTitleHeader', () => {
      renderTimeline({
        resourceColumnLabel: 'My Label',
        localeText: { timelineResourceTitleHeader: 'Locale Label' },
      });

      expect(screen.getByText('My Label')).not.to.equal(null);
      expect(screen.queryByText('Locale Label')).to.equal(null);
    });

    it('should fall back to localeText.timelineResourceTitleHeader when not set', () => {
      renderTimeline({
        localeText: { timelineResourceTitleHeader: 'Custom Locale' },
      });

      expect(screen.getByText('Custom Locale')).not.to.equal(null);
    });
  });

  describe('presets', () => {
    it('should set --unit-width to the preset tickWidth and render one row per header level', async () => {
      renderTimeline({
        preset: 'dayAndHour',
        presets: ['dayAndMonth', 'dayAndHour'],
      });

      let rootElement = screen.getByRole('grid');
      // dayAndHour: tickWidth = 64px, 2 header rows (day + hour).
      expect(rootElement.style.getPropertyValue('--unit-width')).to.equal('64px');
      expect(
        rootElement.querySelectorAll(`.${eventTimelinePremiumClasses.headerLevelRow}`).length,
      ).to.equal(2);

      renderTimeline({
        preset: 'dayAndMonth',
        presets: ['dayAndMonth', 'dayAndHour'],
      });

      rootElement = screen.getAllByRole('grid').at(-1) as HTMLElement;
      // day: tickWidth = 120px, 2 header rows (month + day).
      expect(rootElement.style.getPropertyValue('--unit-width')).to.equal('120px');
      expect(
        rootElement.querySelectorAll(`.${eventTimelinePremiumClasses.headerLevelRow}`).length,
      ).to.equal(2);
    });
  });
});
