import * as React from 'react';
import { act, screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import type { GridRowType, TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  SchedulerStoreRunner,
  setSystemTimezone,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import {
  buildTemporalPlainDate,
  createAdapterDate,
} from '../../internals/utils/plain-date-utils/adapter';

describe('<CalendarGrid.DayCell />', () => {
  const { render } = createSchedulerRenderer();

  const day = adapter.now('default');

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
            start={adapter.getTime(adapter.startOfDay(day))}
            end={adapter.getTime(adapter.endOfDay(day))}
          >
            {children}
          </CalendarGrid.DayRow>
        </CalendarGrid.Root>
      </EventCalendarProvider>
    );
  }

  describeConformance(
    <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day, 'default')} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render: (node) => render(<DayCellWrapper>{node}</DayCellWrapper>),
    }),
  );

  describe('keyboard interactions', () => {
    it('should create an all-day event placeholder on Enter keypress', async () => {
      let store: AnyEventCalendarStore | null = null;
      const onEventEditingStart = vi.fn();

      const { user } = render(
        <DayCellWrapper onEventEditingStart={onEventEditingStart}>
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day, 'default')} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      // Focus without clicking, so the Enter keypress is the only creation trigger.
      act(() => {
        cell.focus();
      });
      await user.keyboard('{Enter}');

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

    async function createInSantiago(value: TemporalSupportedObject) {
      let store: AnyEventCalendarStore | null = null;
      const { user } = render(
        <EventCalendarProvider events={[]} displayTimezone="America/Santiago">
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={adapter.getTime(value)} end={adapter.getTime(value)}>
              <CalendarGrid.DayCell
                value={buildTemporalPlainDate(adapter, value, 'America/Santiago')}
              />
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
      await user.keyboard('{Enter}');

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
        const value = createAdapterDate(Date.UTC(2026, 3, 5, 16));

        expect(await createInSantiago(value)).to.deep.equal({
          start: '2026-04-05T04:00:00.000Z',
          end: '2026-04-06T03:59:59.999Z',
        });
      },
    );

    it('should end the placeholder on the second occurrence of the last hour of a day a DST transition repeats', async () => {
      const value = createAdapterDate(Date.UTC(2026, 3, 4, 16));

      expect(await createInSantiago(value)).to.deep.equal({
        start: '2026-04-04T03:00:00.000Z',
        end: '2026-04-05T03:59:59.999Z', // 23:59:59.999 -04
      });
    });

    it('should not create event on Enter when pressed on a child element', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <DayCellWrapper>
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day, 'default')}>
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
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });

    it('should not create event on Enter when eventCreation is false', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <DayCellWrapper eventCreation={false}>
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day, 'default')} />
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
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });
  });

  describe('arrow key navigation', () => {
    it('should move focus to the next cell on ArrowRight', async () => {
      const day2 = adapter.addDays(day, 1);
      const { user } = render(
        <DayCellWrapper rowTypes={['day-grid']} rowsPerType={{}}>
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day, 'default')} />
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day2, 'default')} />
        </DayCellWrapper>,
      );

      const cells = screen.getAllByRole('gridcell');
      await user.click(cells[0]);
      await user.keyboard('{ArrowRight}');

      expect(cells[1]).toHaveFocus();
    });

    it('should move focus to the previous cell on ArrowLeft', async () => {
      const day2 = adapter.addDays(day, 1);
      const { user } = render(
        <DayCellWrapper rowTypes={['day-grid']} rowsPerType={{}}>
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day, 'default')} />
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day2, 'default')} />
        </DayCellWrapper>,
      );

      const cells = screen.getAllByRole('gridcell');
      await user.click(cells[1]);
      await user.keyboard('{ArrowLeft}');

      expect(cells[0]).toHaveFocus();
    });

    it('should not move focus on ArrowRight at the last column', async () => {
      const { user } = render(
        <DayCellWrapper rowTypes={['day-grid']} rowsPerType={{}}>
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day, 'default')} />
        </DayCellWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('{ArrowRight}');

      expect(cell).toHaveFocus();
    });

    it('should not move focus on ArrowLeft at the first column', async () => {
      const { user } = render(
        <DayCellWrapper rowTypes={['day-grid']} rowsPerType={{}}>
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day, 'default')} />
        </DayCellWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('{ArrowLeft}');

      expect(cell).toHaveFocus();
    });

    it('should keep all cells tabbable so Tab flows through the grid', async () => {
      const day2 = adapter.addDays(day, 1);
      const { user } = render(
        <DayCellWrapper rowTypes={['day-grid']} rowsPerType={{}}>
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day, 'default')} />
          <CalendarGrid.DayCell value={buildTemporalPlainDate(adapter, day2, 'default')} />
        </DayCellWrapper>,
      );

      const cells = screen.getAllByRole('gridcell');

      // All cells are always tabbable
      await user.click(cells[0]);
      expect(cells[0]).to.have.attribute('tabindex', '0');
      expect(cells[1]).to.have.attribute('tabindex', '0');

      // After navigating, all cells remain tabbable
      await user.keyboard('{ArrowRight}');
      expect(cells[0]).to.have.attribute('tabindex', '0');
      expect(cells[1]).to.have.attribute('tabindex', '0');
    });
  });
});
