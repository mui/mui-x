import * as React from 'react';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  mockElementBounds,
  SchedulerStoreRunner,
} from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { createAdapterDate } from '../../internals/utils/plain-date-utils/adapter';

describe('<CalendarGrid.TimeColumn />', () => {
  const { render } = createSchedulerRenderer();

  const day = adapter.now('default');
  const start = adapter.startOfDay(day);
  const end = adapter.endOfDay(day);

  function TimeColumnWrapper({
    children,
    ...providerProps
  }: { children: React.ReactNode } & Partial<React.ComponentProps<typeof EventCalendarProvider>>) {
    return (
      <EventCalendarProvider events={[]} {...providerProps}>
        <CalendarGrid.Root>{children}</CalendarGrid.Root>
      </EventCalendarProvider>
    );
  }

  describeConformance(<CalendarGrid.TimeColumn start={start} end={end} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render: (node) => render(<TimeColumnWrapper>{node}</TimeColumnWrapper>),
  }));

  describe('pointer interactions', () => {
    it('should start a creation on the previous half hour of the wall clock of the display timezone', () => {
      let store: AnyEventCalendarStore | null = null;
      // Asia/Kathmandu is 5:45 ahead of UTC, so its half hours aren't the half hours of UTC.
      const timezone = 'Asia/Kathmandu';
      const columnStart = createAdapterDate(adapter, Date.UTC(2025, 6, 2, 18, 15), timezone);
      const columnEnd = createAdapterDate(adapter, Date.UTC(2025, 6, 3, 18, 15) - 1, timezone);

      render(
        <TimeColumnWrapper displayTimezone={timezone}>
          <CalendarGrid.TimeColumn start={columnStart} end={columnEnd} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </TimeColumnWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      // 1px per minute of the day.
      mockElementBounds(cell, { top: 0, height: 24 * 60 });
      fireEvent.click(cell, { clientY: 10 * 60 + 47 });

      expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
      expect(new Date(store!.state.occurrencePlaceholder!.start).toISOString()).to.equal(
        '2025-07-03T04:45:00.000Z', // 10:30 in Kathmandu
      );
    });
  });

  describe('keyboard interactions', () => {
    it('should create a timed event placeholder on Enter keypress', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <TimeColumnWrapper>
          <CalendarGrid.TimeColumn start={start} end={end} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </TimeColumnWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).not.to.equal(null);
      expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
      expect(store!.state.occurrencePlaceholder?.surfaceType).to.equal('time-grid');
    });

    it('should not create event on Enter when eventCreation is false', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <TimeColumnWrapper eventCreation={false}>
          <CalendarGrid.TimeColumn start={start} end={end} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </TimeColumnWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });
  });
});
