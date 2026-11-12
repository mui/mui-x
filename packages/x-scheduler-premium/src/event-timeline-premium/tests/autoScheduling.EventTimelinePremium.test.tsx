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
  getEventRow,
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
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });
  const { renderTimeline } = createDependencyTimelineRenderer(renderSettled);

  it('should push the successor when the predecessor is dropped past it', async () => {
    const { store } = await renderTimeline({
      events: [eventA, eventB],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
    });

    const originalPredecessorStart =
      store.state.processedEventLookup.get('event-a')!.dataTimezone.start.timestamp;
    const originalSuccessorStart =
      store.state.processedEventLookup.get('event-b')!.dataTimezone.start.timestamp;

    mockAllEventRowBounds();
    const eventElement = screen.getByText('Event A');
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getEventRow(resource1.id),
        sourceClientX: 160,
        targetClientX: 3000,
      });
    });

    // The drop landed past the successor: it now starts at the predecessor's new end.
    const movedPredecessor = store.state.processedEventLookup.get('event-a')!;
    const movedSuccessor = store.state.processedEventLookup.get('event-b')!;
    expect(movedPredecessor.dataTimezone.start.timestamp).to.be.greaterThan(
      originalPredecessorStart,
    );
    expect(movedPredecessor.dataTimezone.end.timestamp).to.be.greaterThan(originalSuccessorStart);
    expect(movedSuccessor.dataTimezone.start.timestamp).to.equal(
      movedPredecessor.dataTimezone.end.timestamp,
    );
    expect(store.state.errors).to.have.length(0);
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
    const originalSuccessorStart =
      store.state.processedEventLookup.get('event-b')!.dataTimezone.start.timestamp;

    mockAllEventRowBounds();
    const eventElement = screen.getByText('Event A');
    mockElementBounds(eventElement, { left: 100, width: 120, height: 30 });

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getEventRow(resource1.id),
        sourceClientX: 160,
        targetClientX: 3000,
      });
    });

    // Vetoed: neither event moves and the toast names the blocking event.
    expect(store.state.processedEventLookup.get('event-a')!.dataTimezone.start.timestamp).to.equal(
      originalPredecessorStart,
    );
    expect(store.state.processedEventLookup.get('event-b')!.dataTimezone.start.timestamp).to.equal(
      originalSuccessorStart,
    );
    expect(store.state.errors).to.have.length(1);
    expect(store.state.errors[0]).to.deep.include({
      code: 'readOnlyEventMovedError',
      params: { title: 'Event B' },
    });
    // The drop gesture still completes: no ghost placeholder survives the veto.
    expect(store.state.occurrencePlaceholder).to.equal(null);
  });
});
