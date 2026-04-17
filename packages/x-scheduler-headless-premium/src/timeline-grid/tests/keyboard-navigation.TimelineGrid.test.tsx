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

describe('TimelineGrid keyboard navigation', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  function GridWithRows() {
    return (
      <EventTimelinePremiumProvider
        events={[]}
        resources={resources}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      >
        <TimelineGrid.Root>
          <TimelineGrid.SubGrid trackItems>
            {(resourceId) => (
              <TimelineGrid.EventRow
                key={resourceId}
                resourceId={resourceId}
                data-testid={`row-${resourceId}`}
              >
                {() => null}
              </TimelineGrid.EventRow>
            )}
          </TimelineGrid.SubGrid>
        </TimelineGrid.Root>
      </EventTimelinePremiumProvider>
    );
  }

  describe('vertical navigation (ArrowUp / ArrowDown)', () => {
    it('should move focus to the next row on ArrowDown', async () => {
      const { user } = render(<GridWithRows />);

      const rows = screen.getAllByRole('row');
      act(() => {
        rows[0].focus();
      });
      await user.keyboard('{ArrowDown}');

      expect(rows[1]).toHaveFocus();
    });

    it('should move focus to the previous row on ArrowUp', async () => {
      const { user } = render(<GridWithRows />);

      const rows = screen.getAllByRole('row');
      act(() => {
        rows[1].focus();
      });
      await user.keyboard('{ArrowUp}');

      expect(rows[0]).toHaveFocus();
    });

    it('should not move past the first row on ArrowUp', async () => {
      const { user } = render(<GridWithRows />);

      const rows = screen.getAllByRole('row');
      act(() => {
        rows[0].focus();
      });
      await user.keyboard('{ArrowUp}');

      expect(rows[0]).toHaveFocus();
    });

    it('should not move past the last row on ArrowDown', async () => {
      const { user } = render(<GridWithRows />);

      const rows = screen.getAllByRole('row');
      const lastRow = rows[rows.length - 1];
      act(() => {
        lastRow.focus();
      });
      await user.keyboard('{ArrowDown}');

      expect(lastRow).toHaveFocus();
    });
  });

  describe('horizontal navigation (ArrowLeft / ArrowRight)', () => {
    function GridWithTitleAndEvents() {
      return (
        <EventTimelinePremiumProvider
          events={[]}
          resources={resources}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        >
          <TimelineGrid.Root>
            <TimelineGrid.SubGrid trackItems>
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
            <TimelineGrid.SubGrid trackItems>
              {(resourceId) => (
                <TimelineGrid.EventRow
                  key={resourceId}
                  resourceId={resourceId}
                  data-testid={`events-${resourceId}`}
                >
                  {() => null}
                </TimelineGrid.EventRow>
              )}
            </TimelineGrid.SubGrid>
          </TimelineGrid.Root>
        </EventTimelinePremiumProvider>
      );
    }

    it('should move focus from title to events on ArrowRight', async () => {
      const { user } = render(<GridWithTitleAndEvents />);

      const titleRows = screen
        .getAllByRole('row')
        .filter((r) => r.getAttribute('data-testid')?.startsWith('title-'));
      const eventsRows = screen
        .getAllByRole('row')
        .filter((r) => r.getAttribute('data-testid')?.startsWith('events-'));

      act(() => {
        titleRows[0].focus();
      });
      await user.keyboard('{ArrowRight}');

      expect(eventsRows[0]).toHaveFocus();
    });

    it('should move focus from events to title on ArrowLeft', async () => {
      const { user } = render(<GridWithTitleAndEvents />);

      const titleRows = screen
        .getAllByRole('row')
        .filter((r) => r.getAttribute('data-testid')?.startsWith('title-'));
      const eventsRows = screen
        .getAllByRole('row')
        .filter((r) => r.getAttribute('data-testid')?.startsWith('events-'));

      act(() => {
        eventsRows[0].focus();
      });
      await user.keyboard('{ArrowLeft}');

      expect(titleRows[0]).toHaveFocus();
    });

    it('should preserve row index when switching columns', async () => {
      const { user } = render(<GridWithTitleAndEvents />);

      const titleRows = screen
        .getAllByRole('row')
        .filter((r) => r.getAttribute('data-testid')?.startsWith('title-'));
      const eventsRows = screen
        .getAllByRole('row')
        .filter((r) => r.getAttribute('data-testid')?.startsWith('events-'));

      // Focus title row 1, go right to events row 1
      act(() => {
        titleRows[1].focus();
      });
      await user.keyboard('{ArrowRight}');
      expect(eventsRows[1]).toHaveFocus();

      // Go back left to title row 1
      await user.keyboard('{ArrowLeft}');
      expect(titleRows[1]).toHaveFocus();
    });
  });

  describe('event creation', () => {
    it('should create a timeline event placeholder on Enter keypress', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <EventTimelinePremiumProvider
          events={[]}
          resources={resources}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        >
          <TimelineGrid.Root>
            <TimelineGrid.SubGrid trackItems>
              {(resourceId) => (
                <TimelineGrid.EventRow
                  key={resourceId}
                  resourceId={resourceId}
                  data-testid={`row-${resourceId}`}
                >
                  {() => null}
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
        </EventTimelinePremiumProvider>,
      );

      const row0 = screen.getByTestId(`row-${resource1.id}`);
      act(() => {
        row0.focus();
      });
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).not.to.equal(null);
      expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
      expect(store!.state.occurrencePlaceholder?.surfaceType).to.equal('timeline');
    });
  });

  describe('event tabIndex follows row focus', () => {
    function GridWithEvents() {
      const start = processDate(DEFAULT_TESTING_VISIBLE_DATE, adapter);
      const end = processDate(adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, 1), adapter);

      return (
        <EventTimelinePremiumProvider
          events={[]}
          resources={[resource1, resource2]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        >
          <TimelineGrid.Root>
            <TimelineGrid.SubGrid trackItems>
              <TimelineGrid.EventRow resourceId={resource1.id} data-testid={`row-${resource1.id}`}>
                {() => (
                  <TimelineGrid.Event
                    eventId="event-1"
                    occurrenceKey="occ-1"
                    start={start}
                    end={end}
                    renderDragPreview={() => null}
                    data-testid="event-1"
                  />
                )}
              </TimelineGrid.EventRow>
              <TimelineGrid.EventRow resourceId={resource2.id} data-testid={`row-${resource2.id}`}>
                {() => (
                  <TimelineGrid.Event
                    eventId="event-2"
                    occurrenceKey="occ-2"
                    start={start}
                    end={end}
                    renderDragPreview={() => null}
                    data-testid="event-2"
                  />
                )}
              </TimelineGrid.EventRow>
            </TimelineGrid.SubGrid>
          </TimelineGrid.Root>
        </EventTimelinePremiumProvider>
      );
    }

    it('should make events tabbable only when their parent row is focused', async () => {
      const { user } = render(<GridWithEvents />);

      const event1 = screen.getByTestId('event-1');
      const event2 = screen.getByTestId('event-2');

      // Before any row is focused, all events are not tabbable
      expect(event1).to.have.attribute('tabindex', '-1');
      expect(event2).to.have.attribute('tabindex', '-1');

      // Focus row 0 → event-1 becomes tabbable
      act(() => {
        screen.getByTestId(`row-${resource1.id}`).focus();
      });
      expect(event1).to.have.attribute('tabindex', '0');
      expect(event2).to.have.attribute('tabindex', '-1');

      // Navigate to row 1 → event-2 becomes tabbable, event-1 not
      await user.keyboard('{ArrowDown}');
      expect(event1).to.have.attribute('tabindex', '-1');
      expect(event2).to.have.attribute('tabindex', '0');
    });
  });
});
