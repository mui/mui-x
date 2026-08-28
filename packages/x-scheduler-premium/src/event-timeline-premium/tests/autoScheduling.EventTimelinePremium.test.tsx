import { describe, expect, it } from 'vitest';
import { act, screen } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  mockElementBounds,
  simulateDragAndDrop,
} from 'test/utils/scheduler';
import {
  buildDependency,
  createDependencyTimelineRenderer,
  resource1,
} from './dependencyTestUtils';

const eventA = EventBuilder.new()
  .id('event-a')
  .title('Event A')
  .singleDay('2025-07-03T09:00:00Z')
  .resource(resource1)
  .draggable(true)
  .build();
const eventB = EventBuilder.new()
  .id('event-b')
  .title('Event B')
  .singleDay('2025-07-03T10:00:00Z')
  .resource(resource1)
  .draggable(true)
  .build();

describe('<EventTimelinePremium /> auto-scheduling', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });
  const { renderTimeline } = createDependencyTimelineRenderer(render);

  it('should push the successor when the predecessor is dropped past it', async () => {
    const { store } = await renderTimeline({
      events: [eventA, eventB],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
    });

    const originalSuccessorStart =
      store.state.processedEventLookup.get('event-b')!.dataTimezone.start.timestamp;

    const rows = document.querySelectorAll<HTMLElement>(
      '.MuiEventTimeline-eventsCell[data-drop-target-for-element]',
    );
    for (const row of rows) {
      mockElementBounds(row, { left: 0, width: 6720, height: 40 });
    }
    const eventElement = screen.getByText('Event A');
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: rows[0],
        sourceClientX: 160,
        targetClientX: 3000,
      });
    });

    // The cascade ran on the drop: the successor starts at the predecessor's new end.
    const movedPredecessor = store.state.processedEventLookup.get('event-a')!;
    const movedSuccessor = store.state.processedEventLookup.get('event-b')!;
    expect(movedSuccessor.dataTimezone.start.timestamp).to.be.greaterThan(originalSuccessorStart);
    expect(movedSuccessor.dataTimezone.start.timestamp).to.equal(
      movedPredecessor.dataTimezone.end.timestamp,
    );
  });
});
