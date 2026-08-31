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
  mockAllEventRowBounds,
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

    const rows = mockAllEventRowBounds();
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

  it('should clamp the successor when it is dropped before the predecessor', async () => {
    const { store } = await renderTimeline({
      events: [eventA, eventB],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
    });

    const predecessor = store.state.processedEventLookup.get('event-a')!;
    const successorDuration =
      store.state.processedEventLookup.get('event-b')!.dataTimezone.end.timestamp -
      store.state.processedEventLookup.get('event-b')!.dataTimezone.start.timestamp;

    const rows = mockAllEventRowBounds();
    const eventElement = screen.getByText('Event B');
    mockElementBounds(eventElement, { left: 640, width: 64, height: 30 });

    // Dropped well before the predecessor's end: the clamp snaps it forward on drop.
    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: rows[0],
        sourceClientX: 660,
        targetClientX: 400,
      });
    });

    const clampedSuccessor = store.state.processedEventLookup.get('event-b')!;
    expect(clampedSuccessor.dataTimezone.start.timestamp).to.equal(
      predecessor.dataTimezone.end.timestamp,
    );
    expect(
      clampedSuccessor.dataTimezone.end.timestamp - clampedSuccessor.dataTimezone.start.timestamp,
    ).to.equal(successorDuration);
    // The predecessor itself never moves.
    expect(store.state.processedEventLookup.get('event-a')!.dataTimezone.start.timestamp).to.equal(
      predecessor.dataTimezone.start.timestamp,
    );
  });

  it('should reject the drop when the cascade would move a read-only event', async () => {
    const readOnlySuccessor = EventBuilder.new()
      .id('event-b')
      .title('Event B')
      .singleDay('2025-07-03T10:00:00Z')
      .resource(resource1)
      .readOnly()
      .build();
    const { store } = await renderTimeline({
      events: [eventA, readOnlySuccessor],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
    });

    const originalPredecessorStart =
      store.state.processedEventLookup.get('event-a')!.dataTimezone.start.timestamp;

    const rows = mockAllEventRowBounds();
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

    // The whole drop is vetoed: nothing moves, and the rejection shows as a toast.
    expect(store.state.processedEventLookup.get('event-a')!.dataTimezone.start.timestamp).to.equal(
      originalPredecessorStart,
    );
    expect(store.state.errors).to.have.length(1);
    expect(store.state.errors[0].error.message).to.include('read-only');
    // The drop gesture still completes: no ghost placeholder survives the veto.
    expect(store.state.occurrencePlaceholder).to.equal(null);
  });
});
