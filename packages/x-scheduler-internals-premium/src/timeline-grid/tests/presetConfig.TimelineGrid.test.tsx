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
              {({ occurrences, placeholder }) => (
                <React.Fragment>
                  {occurrences.map((occurrence) => (
                    <TimelineGrid.Event
                      key={occurrence.key}
                      eventId={occurrence.id}
                      occurrenceKey={occurrence.key}
                      start={occurrence.displayTimezone.start}
                      end={occurrence.displayTimezone.end}
                      renderDragPreview={() => null}
                      data-testid={`event-${occurrence.id}`}
                    />
                  ))}
                  {placeholder != null && (
                    <TimelineGrid.EventPlaceholder
                      start={placeholder.displayTimezone.start}
                      end={placeholder.displayTimezone.end}
                      data-testid="placeholder"
                    />
                  )}
                </React.Fragment>
              )}
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

    it('should not reserve a lane for a hidden occurrence overlapping a visible one', () => {
      // The two events overlap in real time (18→22 and 21→22), but the second one is
      // fully inside the hidden hours: only one lane must be reserved.
      const visible = EventBuilder.new()
        .id('visible')
        .resource(resource)
        .span(at(18), at(22))
        .build();
      const hidden = EventBuilder.new().id('hidden').resource(resource).span(at(21), at(22)).build();
      render(<Grid events={[visible, hidden]} presetConfig={PRESET_CONFIG} />);

      const row = screen.getByTestId('events-row');
      expect(row.style.getPropertyValue('--lane-count')).to.equal('1');
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

    it('should position the placeholder relative to the trimmed axis', () => {
      let store: AnyEventCalendarStore | null = null;
      render(
        <Grid
          events={[]}
          presetConfig={PRESET_CONFIG}
          onStoreMount={(s) => {
            store = s;
          }}
        />,
      );

      act(() => {
        store!.set('occurrencePlaceholder', {
          type: 'creation',
          surfaceType: 'timeline',
          start: adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, 10),
          end: adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, 12),
          resourceId: resource.id,
          lockSurfaceType: true,
        });
      });

      const placeholder = screen.getByTestId('placeholder');
      // 10:00 sits 120 axis minutes into the 2880-minute axis, not 600 of 5760
      // (the full-day mapping).
      expect(parseFloat(placeholder.style.getPropertyValue('--x-position'))).to.be.closeTo(
        (120 / AXIS_MINUTES) * 100,
        0.001,
      );
      expect(parseFloat(placeholder.style.getPropertyValue('--width'))).to.be.closeTo(
        (120 / AXIS_MINUTES) * 100,
        0.001,
      );
    });

    it('should not render the placeholder while its range is fully inside the hidden hours', () => {
      let store: AnyEventCalendarStore | null = null;
      render(
        <Grid
          events={[]}
          presetConfig={PRESET_CONFIG}
          onStoreMount={(s) => {
            store = s;
          }}
        />,
      );

      const setPlaceholder = (startHour: number, endHour: number) => {
        act(() => {
          store!.set('occurrencePlaceholder', {
            type: 'creation',
            surfaceType: 'timeline',
            start: adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, startHour),
            end: adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, endHour),
            resourceId: resource.id,
            lockSurfaceType: true,
          });
        });
      };

      setPlaceholder(21, 23);
      expect(screen.queryByTestId('placeholder')).to.equal(null);

      setPlaceholder(10, 12);
      expect(screen.getByTestId('placeholder')).not.to.equal(null);
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

  describe('header', () => {
    const { render } = createSchedulerRenderer({
      clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
    });

    it('should emit only the visible hour cells and span the day cells over them', () => {
      const { container } = render(
        <EventTimelinePremiumProvider
          events={[]}
          resources={[resource]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          presetConfig={PRESET_CONFIG}
        >
          <TimelineGrid.Root>
            <TimelineGrid.Header data-testid="header" />
          </TimelineGrid.Root>
        </EventTimelinePremiumProvider>,
      );

      const hourCells = container.querySelectorAll<HTMLElement>('[data-unit="hour"]');
      expect(hourCells.length).to.equal(4 * 12);
      expect(hourCells[0].textContent).to.equal('8:00 AM');
      expect(hourCells[11].textContent).to.equal('7:00 PM');

      const dayCells = container.querySelectorAll<HTMLElement>('[data-unit="day"]');
      expect(dayCells.length).to.equal(4);
      for (const dayCell of dayCells) {
        expect(dayCell.style.getPropertyValue('--span')).to.equal('12');
      }
    });
  });

  describe('current time indicator', () => {
    describe('when the current time is inside the visible hours', () => {
      const { render } = createSchedulerRenderer({
        clockConfig: new Date('2025-07-03T10:00:00Z'),
      });

      it('should render the indicator at the trimmed-axis position', () => {
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

        const indicator = screen.getByTestId('indicator');
        // 10:00 sits 120 axis minutes into the 2880-minute axis, not 600 of 5760
        // (the full-day mapping).
        expect(parseFloat(indicator.style.getPropertyValue('--x-position'))).to.be.closeTo(
          120 / AXIS_MINUTES,
          0.0001,
        );
      });
    });

    describe('when the current time is before the visible hours', () => {
      const { render } = createSchedulerRenderer({
        clockConfig: new Date('2025-07-03T06:00:00Z'),
      });

      it('should not render the indicator', () => {
        // Without the lower bound the indicator would sit pinned at x = 0 all morning.
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

    describe('when the current time is exactly at the exclusive end of the window', () => {
      const { render } = createSchedulerRenderer({
        clockConfig: new Date('2025-07-03T20:00:30Z'),
      });

      it('should not render the indicator', () => {
        // At 20:00 the indicator would render pinned to the day seam, i.e. on the
        // left edge of the next day.
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
