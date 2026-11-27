import * as React from 'react';
import { act, fireEvent, screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import type { GridRowType } from '@mui/x-scheduler-internals/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  createSchedulerRenderer,
  describeConformance,
  endOfDay,
  SchedulerStoreRunner,
  setSystemTimezone,
  startOfDay,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import { toPlainDate } from '../../internals/utils/plain-date-utils/timeZone';

describe('<CalendarGrid.DayCell />', () => {
  const { render } = createSchedulerRenderer();

  const day = new Date();

  function DayCellWrapper({
    children,
    rowTypes,
    rowsPerType,
    ...providerProps
  }: {
    children: React.ReactNode;
    rowTypes?: GridRowType[];
    rowsPerType?: Partial<Record<GridRowType, number>>;
  } & Partial<React.ComponentProps<typeof EventCalendarProvider>>) {
    return (
      <EventCalendarProvider events={[]} {...providerProps}>
        <CalendarGrid.Root rowTypes={rowTypes} rowsPerType={rowsPerType}>
          <CalendarGrid.DayRow
            start={startOfDay(day).getTime()}
            end={endOfDay(day).getTime()}
            days={[toPlainDate(day.getTime(), 'default')]}
          >
            {children}
          </CalendarGrid.DayRow>
        </CalendarGrid.Root>
      </EventCalendarProvider>
    );
  }

  describeConformance(
    <CalendarGrid.DayCell value={toPlainDate(day.getTime(), 'default')} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render: (node) => render(<DayCellWrapper>{node}</DayCellWrapper>),
    }),
  );

  describe('keyboard interactions', () => {
    it('should create an all-day event placeholder on C', async () => {
      let store: AnyEventCalendarStore | null = null;
      const onEventEditingStart = vi.fn();

      const { user } = render(
        <DayCellWrapper onEventEditingStart={onEventEditingStart}>
          <CalendarGrid.DayCell value={toPlainDate(day.getTime(), 'default')} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      // Focus without clicking, so the key press is the only creation trigger.
      act(() => {
        cell.focus();
      });
      await user.keyboard('c');

      expect(store!.state.occurrencePlaceholder).not.to.equal(null);
      expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
      expect(store!.state.occurrencePlaceholder?.surfaceType).to.equal('day-grid');

      // The initiating keydown is stashed with the placeholder and reaches `onEventEditingStart`.
      act(() => {
        store!.startEditing(store!.state.occurrencePlaceholder as any);
      });
      expect(onEventEditingStart.mock.lastCall?.[1].reason).to.equal('creation');
      expect(onEventEditingStart.mock.lastCall?.[1].event.type).to.equal('keydown');
    });

    async function createInSantiago(value: Date) {
      let store: AnyEventCalendarStore | null = null;
      const cellDate = toPlainDate(value.getTime(), 'America/Santiago');
      const { user } = render(
        <EventCalendarProvider events={[]} displayTimezone="America/Santiago">
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={value.getTime()} end={value.getTime()} days={[cellDate]}>
              <CalendarGrid.DayCell value={cellDate} />
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </EventCalendarProvider>,
      );

      act(() => {
        screen.getByRole('gridcell').focus();
      });
      await user.keyboard('c');

      const placeholder = store!.state.occurrencePlaceholder!;
      return {
        start: new Date(placeholder.start).toISOString(),
        end: new Date(placeholder.end).toISOString(),
      };
    }

    // Santiago leaves summer time at the end of April 4th, 2026, when 24:00 becomes 23:00.
    it.skipIf(!isJSDOM)(
      'should create the placeholder on the whole day, whatever the timezone of the system',
      async () => {
        setSystemTimezone('Australia/Lord_Howe');
        const value = new Date(Date.UTC(2026, 3, 5, 16));

        expect(await createInSantiago(value)).to.deep.equal({
          start: '2026-04-05T04:00:00.000Z',
          end: '2026-04-06T04:00:00.000Z',
        });
      },
    );

    it('should end the placeholder at the start of the day after a day a DST transition lengthens', async () => {
      const value = new Date(Date.UTC(2026, 3, 4, 16));

      expect(await createInSantiago(value)).to.deep.equal({
        start: '2026-04-04T03:00:00.000Z',
        end: '2026-04-05T04:00:00.000Z', // 00:00 -04, after the repeated hour
      });
    });

    it.each([
      { name: 'Enter', keys: '{Enter}' },
      { name: 'Ctrl+C', keys: '{Control>}c{/Control}' },
      { name: 'Meta+C', keys: '{Meta>}c{/Meta}' },
      { name: 'Alt+C', keys: '{Alt>}c{/Alt}' },
    ])('should not create an event on $name', async ({ keys }) => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <DayCellWrapper>
          <CalendarGrid.DayCell value={toPlainDate(day.getTime(), 'default')} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
      );

      act(() => {
        screen.getByRole('gridcell').focus();
      });
      await user.keyboard(keys);

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });

    it.each([
      {
        result: 'create an event',
        name: 'the key in the position of C on a Cyrillic layout',
        key: 'с',
        expected: true,
      },
      {
        result: 'not create an event',
        name: 'a Latin letter in the position of C',
        key: 'j',
        expected: false,
      },
    ])('should $result on $name', ({ key, expected }) => {
      let store: AnyEventCalendarStore | null = null;

      render(
        <DayCellWrapper>
          <CalendarGrid.DayCell value={toPlainDate(day.getTime(), 'default')} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      act(() => {
        cell.focus();
      });
      fireEvent.keyDown(cell, { key, code: 'KeyC' });

      expect(store!.state.occurrencePlaceholder != null).to.equal(expected);
    });

    it('should not create an event on C when pressed on a child element', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <DayCellWrapper>
          <CalendarGrid.DayCell value={toPlainDate(day.getTime(), 'default')}>
            <button type="button">child</button>
          </CalendarGrid.DayCell>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
      );

      const button = screen.getByRole('button', { name: 'child' });
      await user.click(button);
      await user.keyboard('c');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });

    it('should not create an event on C when eventCreation is false', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <DayCellWrapper eventCreation={false}>
          <CalendarGrid.DayCell value={toPlainDate(day.getTime(), 'default')} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('c');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });
  });
});
