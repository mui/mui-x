import * as React from 'react';
import { screen, act } from '@mui/internal-test-utils';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
  SchedulerStoreRunner,
} from 'test/utils/scheduler';

describe('TimelineGrid - presetConfig (startTime / endTime)', () => {
  const resource = ResourceBuilder.new().id('r1').build();
  const at = (hours: number) => adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, hours).toISOString();

  // dayAndHour: 4 days × 12 visible hours (8:00 → 20:00) = 2880 axis minutes.
  const PRESET_CONFIG = { dayAndHour: { startTime: 8, endTime: 20 } };
  const AXIS_MINUTES = 4 * 12 * 60;

  function Grid({
    events,
    presetConfig,
    onStoreMount,
  }: {
    events: ReturnType<typeof EventBuilder.prototype.build>[];
    presetConfig?: typeof PRESET_CONFIG;
    onStoreMount?: (store: AnyEventCalendarStore) => void;
  }) {
    return (
      <EventTimelinePremiumProvider
        events={events}
        resources={[resource]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        presetConfig={presetConfig}
      >
        <TimelineGrid.Root>
          <TimelineGrid.BodyRow index={0}>
            <TimelineGrid.EventRow resourceId={resource.id} data-testid="events-row">
              {({ occurrences }) =>
                occurrences.map((occurrence) => (
                  <TimelineGrid.Event
                    key={occurrence.key}
                    eventId={occurrence.id}
                    occurrenceKey={occurrence.key}
                    start={occurrence.displayTimezone.start}
                    end={occurrence.displayTimezone.end}
                    renderDragPreview={() => null}
                    data-testid={`event-${occurrence.id}`}
                  />
                ))
              }
            </TimelineGrid.EventRow>
          </TimelineGrid.BodyRow>
        </TimelineGrid.Root>
        {onStoreMount && (
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={onStoreMount}
          />
        )}
      </EventTimelinePremiumProvider>
    );
  }

  describe('event rendering', () => {
    const { render } = createSchedulerRenderer({
      clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
    });

    it('should position the events relative to the trimmed axis', () => {
      const event = EventBuilder.new()
        .id('visible')
        .resource(resource)
        .span(at(10), at(12))
        .build();
      render(<Grid events={[event]} presetConfig={PRESET_CONFIG} />);

      const element = screen.getByTestId('event-visible');
      expect(parseFloat(element.style.getPropertyValue('--x-position'))).to.be.closeTo(
        (120 / AXIS_MINUTES) * 100,
        0.001,
      );
      expect(parseFloat(element.style.getPropertyValue('--width'))).to.be.closeTo(
        (120 / AXIS_MINUTES) * 100,
        0.001,
      );
    });

    it('should clamp an event ending in the hidden hours to the day edge and flag it', () => {
      const event = EventBuilder.new()
        .id('clamped')
        .resource(resource)
        .span(at(18), at(22))
        .build();
      render(<Grid events={[event]} presetConfig={PRESET_CONFIG} />);

      const element = screen.getByTestId('event-clamped');
      expect(parseFloat(element.style.getPropertyValue('--x-position'))).to.be.closeTo(
        (600 / AXIS_MINUTES) * 100,
        0.001,
      );
      expect(parseFloat(element.style.getPropertyValue('--width'))).to.be.closeTo(
        (120 / AXIS_MINUTES) * 100,
        0.001,
      );
      expect(element).to.have.attribute('data-ending-after-edge');
    });

    it('should not render the occurrences fully inside the hidden hours', () => {
      const hidden = EventBuilder.new()
        .id('hidden')
        .resource(resource)
        .span(at(21), at(23))
        .build();
      const visible = EventBuilder.new()
        .id('visible')
        .resource(resource)
        .span(at(10), at(12))
        .build();
      render(<Grid events={[hidden, visible]} presetConfig={PRESET_CONFIG} />);

      expect(screen.getByTestId('event-visible')).not.to.equal(null);
      expect(screen.queryByTestId('event-hidden')).to.equal(null);
    });

    it('should render all the occurrences when no presetConfig is provided', () => {
      const nightly = EventBuilder.new()
        .id('nightly')
        .resource(resource)
        .span(at(21), at(23))
        .build();
      render(<Grid events={[nightly]} />);

      expect(screen.getByTestId('event-nightly')).not.to.equal(null);
    });

    it('should start the keyboard event creation at the first visible hour', async () => {
      let store: AnyEventCalendarStore | null = null;
      const { user } = render(
        <Grid
          events={[]}
          presetConfig={PRESET_CONFIG}
          onStoreMount={(s) => {
            store = s;
          }}
        />,
      );

      const row = screen.getByTestId('events-row');
      act(() => {
        row.focus();
      });
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
      expect(store!.state.occurrencePlaceholder?.start).toEqualDateTime(
        adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, 8),
      );
    });
  });

  describe('current time indicator', () => {
    describe('when the current time is inside the visible hours', () => {
      const { render } = createSchedulerRenderer({
        clockConfig: new Date('2025-07-03T10:00:00Z'),
      });

      it('should render the indicator', () => {
        render(
          <EventTimelinePremiumProvider
            events={[]}
            resources={[resource]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            presetConfig={PRESET_CONFIG}
          >
            <TimelineGrid.Root>
              <TimelineGrid.CurrentTimeIndicator data-testid="indicator" />
            </TimelineGrid.Root>
          </EventTimelinePremiumProvider>,
        );

        expect(screen.getByTestId('indicator')).not.to.equal(null);
      });
    });

    describe('when the current time is inside the hidden hours', () => {
      const { render } = createSchedulerRenderer({
        clockConfig: new Date('2025-07-03T22:00:00Z'),
      });

      it('should not render the indicator', () => {
        render(
          <EventTimelinePremiumProvider
            events={[]}
            resources={[resource]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            presetConfig={PRESET_CONFIG}
          >
            <TimelineGrid.Root>
              <TimelineGrid.CurrentTimeIndicator data-testid="indicator" />
            </TimelineGrid.Root>
          </EventTimelinePremiumProvider>,
        );

        expect(screen.queryByTestId('indicator')).to.equal(null);
      });
    });
  });
});
