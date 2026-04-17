import * as React from 'react';
import { screen, act } from '@mui/internal-test-utils';
import { TimelineGrid } from '@mui/x-scheduler-headless-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/event-timeline-premium-provider';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  ResourceBuilder,
  SchedulerStoreRunner,
  AnyEventCalendarStore,
} from 'test/utils/scheduler';

const resource1 = ResourceBuilder.new().build();
const resource2 = ResourceBuilder.new().build();
const resource3 = ResourceBuilder.new().build();

const resources = [resource1, resource2, resource3];

const start = processDate(DEFAULT_TESTING_VISIBLE_DATE, adapter);
const end = processDate(adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, 1), adapter);

describe('TimelineGrid keyboard navigation', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  let store: AnyEventCalendarStore | null = null;

  function Grid() {
    return (
      <EventTimelinePremiumProvider
        events={[]}
        resources={resources}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      >
        <TimelineGrid.Root>
          <TimelineGrid.SubGrid>
            {(resourceId) => (
              <TimelineGrid.Row
                key={resourceId}
                columnType="title"
                data-testid={`title-${resourceId}`}
              >
                <TimelineGrid.Cell>{resourceId}</TimelineGrid.Cell>
              </TimelineGrid.Row>
            )}
          </TimelineGrid.SubGrid>
          <TimelineGrid.SubGrid>
            {(resourceId) => (
              <TimelineGrid.EventRow
                key={resourceId}
                resourceId={resourceId}
                data-testid={`events-${resourceId}`}
              >
                {() => (
                  <TimelineGrid.Event
                    eventId={`event-${resourceId}`}
                    occurrenceKey={`occ-${resourceId}`}
                    start={start}
                    end={end}
                    renderDragPreview={() => null}
                    data-testid={`event-${resourceId}`}
                  />
                )}
              </TimelineGrid.EventRow>
            )}
          </TimelineGrid.SubGrid>
        </TimelineGrid.Root>
        <SchedulerStoreRunner<AnyEventCalendarStore>
          context={SchedulerStoreContext as any}
          onMount={(s) => {
            store = s;
          }}
        />
      </EventTimelinePremiumProvider>
    );
  }

  function getTitleRows() {
    return screen
      .getAllByRole('row')
      .filter((r) => r.getAttribute('data-testid')?.startsWith('title-'));
  }

  function getEventsRows() {
    return screen
      .getAllByRole('row')
      .filter((r) => r.getAttribute('data-testid')?.startsWith('events-'));
  }

  describe('vertical navigation (ArrowUp / ArrowDown)', () => {
    it('should move focus to the next row on ArrowDown', async () => {
      const { user } = render(<Grid />);

      const rows = getEventsRows();
      act(() => { rows[0].focus(); });
      await user.keyboard('{ArrowDown}');

      expect(rows[1]).toHaveFocus();
    });

    it('should move focus to the previous row on ArrowUp', async () => {
      const { user } = render(<Grid />);

      const rows = getEventsRows();
      act(() => { rows[1].focus(); });
      await user.keyboard('{ArrowUp}');

      expect(rows[0]).toHaveFocus();
    });

    it('should not move past the first row on ArrowUp', async () => {
      const { user } = render(<Grid />);

      const rows = getEventsRows();
      act(() => { rows[0].focus(); });
      await user.keyboard('{ArrowUp}');

      expect(rows[0]).toHaveFocus();
    });

    it('should not move past the last row on ArrowDown', async () => {
      const { user } = render(<Grid />);

      const rows = getEventsRows();
      const lastRow = rows[rows.length - 1];
      act(() => { lastRow.focus(); });
      await user.keyboard('{ArrowDown}');

      expect(lastRow).toHaveFocus();
    });
  });

  describe('horizontal navigation (ArrowLeft / ArrowRight)', () => {
    it('should move focus from title to events on ArrowRight', async () => {
      const { user } = render(<Grid />);

      act(() => { getTitleRows()[0].focus(); });
      await user.keyboard('{ArrowRight}');

      expect(getEventsRows()[0]).toHaveFocus();
    });

    it('should move focus from events to title on ArrowLeft', async () => {
      const { user } = render(<Grid />);

      act(() => { getEventsRows()[0].focus(); });
      await user.keyboard('{ArrowLeft}');

      expect(getTitleRows()[0]).toHaveFocus();
    });

    it('should preserve row index when switching columns', async () => {
      const { user } = render(<Grid />);

      act(() => { getTitleRows()[1].focus(); });
      await user.keyboard('{ArrowRight}');
      expect(getEventsRows()[1]).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(getTitleRows()[1]).toHaveFocus();
    });
  });

  describe('event creation', () => {
    it('should create a timeline event placeholder on Enter keypress', async () => {
      const { user } = render(<Grid />);

      const rows = getEventsRows();
      act(() => { rows[0].focus(); });
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).not.to.equal(null);
      expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
      expect(store!.state.occurrencePlaceholder?.surfaceType).to.equal('timeline');
    });
  });

  describe('event tabIndex follows row focus', () => {
    it('should make events tabbable only when their parent row is focused', async () => {
      const { user } = render(<Grid />);

      const eventsRows = getEventsRows();
      const events = eventsRows.map((row) =>
        row.querySelector('[data-testid^="event-"]')!,
      );

      // Before any row is focused, all events are not tabbable
      expect(events[0]).to.have.attribute('tabindex', '-1');
      expect(events[1]).to.have.attribute('tabindex', '-1');

      // Focus row 0 → its event becomes tabbable
      act(() => { eventsRows[0].focus(); });
      expect(events[0]).to.have.attribute('tabindex', '0');
      expect(events[1]).to.have.attribute('tabindex', '-1');

      // Navigate to row 1 → row 1's event becomes tabbable, row 0's not
      await user.keyboard('{ArrowDown}');
      expect(events[0]).to.have.attribute('tabindex', '-1');
      expect(events[1]).to.have.attribute('tabindex', '0');
    });
  });
});
