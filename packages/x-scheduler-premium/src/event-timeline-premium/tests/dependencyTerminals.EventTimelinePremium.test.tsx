import { spy } from 'sinon';
import { act, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  mockElementBounds,
  ResourceBuilder,
  simulateDragAndDrop,
} from 'test/utils/scheduler';
import {
  buildDependency,
  createDependencyTimelineRenderer,
  getArrowPaths,
  getEventElement,
  getRecurringEventElement,
  resource1,
  resource2,
  TestTimeline,
} from './dependencyTestUtils';
import { eventTimelinePremiumClasses } from '../eventTimelinePremiumClasses';

const eventA = EventBuilder.new()
  .id('event-a')
  .title('Event A')
  .singleDay('2025-07-03T09:00:00Z')
  .resource(resource1)
  .build();
const eventB = EventBuilder.new()
  .id('event-b')
  .title('Event B')
  .singleDay('2025-07-03T11:00:00Z')
  .resource(resource1)
  .build();
const recurringEvent = EventBuilder.new()
  .id('event-r')
  .title('Recurring event')
  .singleDay('2025-07-03T13:00:00Z')
  .recurrent('DAILY')
  .resource(resource1)
  .build();

function getTerminal(title: string, resourceId?: string) {
  // The terminals render in an overlay outside the event elements, tied to their
  // event by the occurrence key — qualified by the resource for events appearing on
  // several rows. The key is appearance-invariant, so any rendered appearance serves
  // to read it.
  const occurrenceKey = screen
    .getAllByText(title)[0]
    .closest('[data-occurrence-key]')!
    .getAttribute('data-occurrence-key');
  const resourceSelector = resourceId === undefined ? '' : `[data-resource-id="${resourceId}"]`;
  return document.querySelector<HTMLElement>(
    `[data-dependency-terminal="${occurrenceKey}"]${resourceSelector}`,
  );
}

function getAppearanceElement(title: string, resourceId: string) {
  // An event assigned to several resources renders one appearance per row: pick the
  // one inside the requested resource's row.
  return screen
    .getAllByText(title)
    .map((element) => element.closest('[data-occurrence-key]')!)
    .find(
      (element) =>
        element.closest('[data-resource-id]')?.getAttribute('data-resource-id') === resourceId,
    )!;
}

function simulateTerminalDrag(sourceTitle: string, targetElement: Element) {
  act(() => {
    simulateDragAndDrop({
      source: getTerminal(sourceTitle)!,
      target: targetElement,
    });
  });
}

describe('<EventTimelinePremium /> dependency terminals', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });
  const { renderTimeline } = createDependencyTimelineRenderer(render);

  afterEach(() => {
    // A failed assertion mid-gesture must not leak pragmatic's global drag state or
    // an armed click swallow into the next test.
    fireEvent.drop(document.body, { dataTransfer: new DataTransfer() });
    fireEvent.dragEnd(document.body, { dataTransfer: new DataTransfer() });
    fireEvent.click(document.body);
  });

  describe('terminal rendering', () => {
    it('should render a terminal on the end edge when the dependencies feature is enabled', () => {
      renderTimeline({ events: [eventA, eventB], dependencies: [] });

      expect(getTerminal('Event A')).not.to.equal(null);
      expect(getTerminal('Event B')).not.to.equal(null);
    });

    it('should not render terminals when the dependencies feature is not enabled', () => {
      renderTimeline({ events: [eventA, eventB] });

      expect(getTerminal('Event A')).to.equal(null);
    });

    it('should not render a terminal on recurring events', () => {
      renderTimeline({ events: [eventA, recurringEvent], dependencies: [] });

      expect(getTerminal('Event A')).not.to.equal(null);
      expect(getTerminal('Recurring event')).to.equal(null);
    });

    it('should not render a terminal on an event ending after the collection end', () => {
      // ~20 days: overflows the dayAndHour preset range, so the end edge (the
      // gesture's anchor) is outside the collection — same rule as the end resize
      // handle.
      const overflowingEvent = EventBuilder.new()
        .id('event-overflow')
        .title('Overflowing event')
        .singleDay('2025-07-03T09:00:00Z', 20 * 24 * 60)
        .resource(resource1)
        .build();
      renderTimeline({ events: [eventA, overflowingEvent], dependencies: [] });

      expect(getTerminal('Event A')).not.to.equal(null);
      expect(getTerminal('Overflowing event')).to.equal(null);
    });

    it('should reveal the terminal while its event is hovered', () => {
      renderTimeline({ events: [eventA, eventB], dependencies: [] });

      expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(false);

      fireEvent.pointerOver(getEventElement('Event A'));
      expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(true);
      expect(getTerminal('Event B')!.hasAttribute('data-visible')).to.equal(false);

      fireEvent.pointerOver(getEventElement('Event B'));
      expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(false);
      expect(getTerminal('Event B')!.hasAttribute('data-visible')).to.equal(true);
    });

    it('should keep the terminal revealed for a grace period when the pointer exits through a gap', () => {
      vi.useFakeTimers();
      try {
        renderTimeline({ events: [eventA, eventB], dependencies: [] });

        fireEvent.pointerOver(getEventElement('Event A'));
        expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(true);

        // A diagonal exit through the event's corner lands on the empty cell before
        // reaching the halo: the reveal survives the crossing instead of vanishing
        // under the pointer.
        const cell = document.querySelector<HTMLElement>(
          `.${eventTimelinePremiumClasses.eventsCell}`,
        )!;
        fireEvent.pointerOver(cell);
        expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(true);

        // Reaching the terminal within the grace period cancels the hide for good.
        fireEvent.pointerOver(getTerminal('Event A')!);
        act(() => {
          vi.advanceTimersByTime(1000);
        });
        expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(true);

        // Without a rescue, the pending hide lands after the grace period.
        fireEvent.pointerOver(cell);
        expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(true);
        act(() => {
          vi.advanceTimersByTime(1000);
        });
        expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should keep the terminal revealed when the pointer crosses an arrow hit-area', () => {
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.pointerOver(getEventElement('Event A'));
      expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(true);

      // The invisible hit band of an arrow rides over the events it crosses: pointing
      // at it must not hide the terminal, or the pointer could never reach a terminal
      // that a band covers.
      fireEvent.pointerOver(document.querySelector('[data-dependency-hit="dep-1"]')!);
      expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(true);
    });

    // jsdom only: in browser mode the virtualizer does not mount an event that far
    // right without scrolling, and the clamp is a pure style computation anyway.
    it.skipIf(!isJSDOM)(
      'should keep the terminal inside the events area for an event ending at the collection end',
      () => {
        // Ends one minute before the dayAndHour collection end: the outside circle
        // would overflow the events area (96 ticks × 64px) and be clipped by the
        // viewport, so it slides back over the event's tail.
        const edgeEvent = EventBuilder.new()
          .id('event-edge')
          .title('Edge event')
          .singleDay('2025-07-06T23:00:00Z', 59)
          .resource(resource1)
          .build();
        renderTimeline({ events: [eventA, edgeEvent], dependencies: [] });

        expect(getTerminal('Edge event')!.style.left).to.equal('6134px');
      },
    );
  });

  describe.skipIf(isJSDOM)('terminal placement', () => {
    const adjacentEvent = EventBuilder.new()
      .id('event-adj')
      .title('Adjacent event')
      .singleDay('2025-07-03T10:00:00Z')
      .resource(resource1)
      .build();

    it('should sit outside the end edge, leaving the end resize strip free', async () => {
      renderTimeline({ events: [eventA, adjacentEvent], dependencies: [] });

      fireEvent.pointerOver(getEventElement('Event A'));
      await waitFor(() => {
        expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(true);
      });

      const adjacentRect = getEventElement('Adjacent event').getBoundingClientRect();
      const centerY = adjacentRect.top + adjacentRect.height / 2;

      // Just inside the hovered event's tail: its own surface, so the end resize
      // strip stays a resize grab — not a dependency drag.
      const onTail = document.elementFromPoint(adjacentRect.left - 3, centerY)!;
      expect(onTail.closest('[data-dependency-terminal]')).to.equal(null);

      // Just outside the end edge: the terminal. Accepted trade-off: while revealed
      // it covers the first pixels of the back-to-back neighbor, whose start-resize
      // grab must aim above or below the circle.
      const outside = document.elementFromPoint(adjacentRect.left + 2, centerY)!;
      expect(outside.closest('[data-dependency-terminal]')).not.to.equal(null);

      // The invisible halo amplifies the target beyond the visible 10px circle, both
      // outward and vertically.
      const beyondCircle = document.elementFromPoint(adjacentRect.left + 14, centerY)!;
      expect(beyondCircle.closest('[data-dependency-terminal]')).not.to.equal(null);
      const aboveCircle = document.elementFromPoint(adjacentRect.left + 4, centerY - 10)!;
      expect(aboveCircle.closest('[data-dependency-terminal]')).not.to.equal(null);
    });

    it('should keep the revealed terminal reachable under a crossing arrow', async () => {
      // The straight A → C arrow rides over the middle event; the middle event's
      // revealed terminal must still win the pointer over the arrow's hit band.
      const middleEvent = EventBuilder.new()
        .id('event-m')
        .title('Middle event')
        .singleDay('2025-07-03T10:30:00Z')
        .resource(resource1)
        .build();
      const eventC = EventBuilder.new()
        .id('event-c')
        .title('Event C')
        .singleDay('2025-07-03T13:00:00Z')
        .resource(resource1)
        .build();
      renderTimeline({
        events: [eventA, middleEvent, eventC],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-c')],
      });

      fireEvent.pointerOver(getEventElement('Middle event'));
      await waitFor(() => {
        expect(getTerminal('Middle event')!.hasAttribute('data-visible')).to.equal(true);
      });

      const middleRect = getEventElement('Middle event').getBoundingClientRect();
      const centerY = middleRect.top + middleRect.height / 2;
      const atTerminal = document.elementFromPoint(middleRect.right + 4, centerY)!;
      expect(atTerminal.closest('[data-dependency-terminal]')).not.to.equal(null);
    });

    it('should leave the pointer to an event the arrow crosses', async () => {
      // The straight A → C arrow rides over the middle event, but its hit band is cut
      // around the box: grabbing the middle event at its natural center must start
      // its own drag, not select the arrow.
      const middleEvent = EventBuilder.new()
        .id('event-m')
        .title('Middle event')
        .singleDay('2025-07-03T10:30:00Z')
        .resource(resource1)
        .build();
      const eventC = EventBuilder.new()
        .id('event-c')
        .title('Event C')
        .singleDay('2025-07-03T13:00:00Z')
        .resource(resource1)
        .build();
      renderTimeline({
        events: [eventA, middleEvent, eventC],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-c')],
      });

      const middleElement = getEventElement('Middle event');
      const middleRect = middleElement.getBoundingClientRect();
      const centerX = middleRect.left + middleRect.width / 2;
      const centerY = middleRect.top + middleRect.height / 2;
      const atCenter = document.elementFromPoint(centerX, centerY)!;
      expect(atCenter.closest('[data-dependency-hit]')).to.equal(null);
      expect(atCenter.closest('[data-occurrence-key]')).to.equal(middleElement);
    });
  });

  describe('create gesture', () => {
    it('should create a FinishToStart dependency when dropping a terminal on another event', () => {
      const handleDependenciesChange = spy();
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [],
        onDependenciesChange: handleDependenciesChange,
      });

      simulateTerminalDrag('Event A', getEventElement('Event B'));

      expect(handleDependenciesChange.callCount).to.equal(1);
      const dependencies = handleDependenciesChange.firstCall.firstArg;
      expect(dependencies).to.have.length(1);
      expect(dependencies[0].source).to.equal('event-a');
      expect(dependencies[0].target).to.equal('event-b');
      expect(dependencies[0].type).to.equal('FinishToStart');
      // The harness closes the controlled loop, so the created arrow actually renders.
      expect(getArrowPaths()).to.have.length(1);
    });

    it('should ignore dropping a terminal on its own event', async () => {
      const handleDependenciesChange = spy();
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [],
        onDependenciesChange: handleDependenciesChange,
      });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      const ownEvent = getEventElement('Event A');
      const validTarget = getEventElement('Event B');

      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnter(validTarget, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(validTarget, { dataTransfer: new DataTransfer() });

      // Hovering the valid target proves the drag reached the highlight stage before
      // asserting that the source event never gets it.
      await waitFor(() => {
        expect(validTarget.hasAttribute('data-dependency-drop-target')).to.equal(true);
      });

      fireEvent.dragEnter(ownEvent, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(ownEvent, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(validTarget.hasAttribute('data-dependency-drop-target')).to.equal(false);
      });
      expect(ownEvent.hasAttribute('data-dependency-drop-target')).to.equal(false);

      fireEvent.drop(ownEvent, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });

      expect(handleDependenciesChange.callCount).to.equal(0);
      expect(store.state.errors).to.have.length(0);
    });

    it('should dissolve the gesture when dropping on empty space', async () => {
      const handleDependenciesChange = spy();
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [],
        onDependenciesChange: handleDependenciesChange,
      });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(document.body, {
        dataTransfer: new DataTransfer(),
        clientX: 120,
        clientY: 40,
      });
      await waitFor(() => {
        expect(store.state.dependencyCreation).not.to.equal(null);
      });

      fireEvent.drop(document.body, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(store.state.dependencyCreation).to.equal(null);
      });
      expect(handleDependenciesChange.callCount).to.equal(0);
      expect(store.state.errors).to.have.length(0);
    });

    it('should discard the gesture on a cancel without creating anything', async () => {
      const handleDependenciesChange = spy();
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [],
        onDependenciesChange: handleDependenciesChange,
      });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      const target = getEventElement('Event B');
      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnter(target, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(target, { dataTransfer: new DataTransfer() });
      await waitFor(() => {
        expect(target.hasAttribute('data-dependency-drop-target')).to.equal(true);
      });

      // Canceling (e.g. with Escape) ends the drag without a drop: pragmatic routes
      // it through `onDrop` with no drop targets.
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(store.state.dependencyCreation).to.equal(null);
      });
      expect(handleDependenciesChange.callCount).to.equal(0);
      expect(target.hasAttribute('data-dependency-drop-target')).to.equal(false);
    });

    it('should not highlight a recurring event during a terminal drag', async () => {
      renderTimeline({ events: [eventA, eventB, recurringEvent], dependencies: [] });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      const validTarget = getEventElement('Event B');
      const recurringTarget = getRecurringEventElement('Recurring event');

      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnter(validTarget, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(validTarget, { dataTransfer: new DataTransfer() });

      // Hovering the valid target proves the drag reached the highlight stage before
      // asserting that the recurring one never gets it.
      await waitFor(() => {
        expect(validTarget.hasAttribute('data-dependency-drop-target')).to.equal(true);
      });

      fireEvent.dragEnter(recurringTarget, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(recurringTarget, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(validTarget.hasAttribute('data-dependency-drop-target')).to.equal(false);
      });
      expect(recurringTarget.hasAttribute('data-dependency-drop-target')).to.equal(false);

      // End the gesture: a drag left in flight leaks into the next test's timeline.
      fireEvent.drop(document.body, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });
    });

    it('should surface an error when dropping a terminal on a recurring event', () => {
      const handleDependenciesChange = spy();
      const { store } = renderTimeline({
        events: [eventA, recurringEvent],
        dependencies: [],
        onDependenciesChange: handleDependenciesChange,
      });

      simulateTerminalDrag('Event A', getRecurringEventElement('Recurring event'));

      expect(handleDependenciesChange.callCount).to.equal(0);
      expect(store.state.errors).to.have.length(1);
      expect(store.state.errors[0].error.message).to.contain('recurring');
    });

    it('should replace an identical rejection toast instead of stacking it', () => {
      const { store } = renderTimeline({ events: [eventA, recurringEvent], dependencies: [] });

      simulateTerminalDrag('Event A', getRecurringEventElement('Recurring event'));
      simulateTerminalDrag('Event A', getRecurringEventElement('Recurring event'));

      expect(store.state.errors).to.have.length(1);
      expect(store.state.errors[0].error.message).to.contain('recurring');
    });

    it('should auto-dismiss a rejection toast', () => {
      vi.useFakeTimers();
      try {
        const { store } = renderTimeline({ events: [eventA, recurringEvent], dependencies: [] });

        simulateTerminalDrag('Event A', getRecurringEventElement('Recurring event'));
        expect(store.state.errors).to.have.length(1);

        act(() => {
          vi.advanceTimersByTime(5000);
        });
        expect(store.state.errors).to.have.length(0);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should highlight the hovered target event during a terminal drag', async () => {
      const { store } = renderTimeline({ events: [eventA, eventB], dependencies: [] });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      const target = getEventElement('Event B');

      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnter(target, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(target, { dataTransfer: new DataTransfer() });

      // Pragmatic-dnd processes drag events asynchronously.
      await waitFor(() => {
        expect(target.hasAttribute('data-dependency-drop-target')).to.equal(true);
      });
      // The source feedback is the terminal staying revealed for the whole gesture.
      expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(true);
      expect(store.state.dependencyCreation?.sourceSide).to.equal('end');

      // End the gesture: a drag left in flight leaks into the next test's timeline.
      fireEvent.drop(target, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });
    });

    it('should render the provisional line during a terminal drag', async () => {
      renderTimeline({ events: [eventA, eventB], dependencies: [] });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      const target = getEventElement('Event B');

      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnter(target, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(target, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(document.querySelector('[data-dependency-drag-line]')).not.to.equal(null);
      });

      // Snapped on the hovered target: solid straight line into an arrowhead.
      const snappedLine = document.querySelector('[data-dependency-drag-line]')!;
      expect(snappedLine.getAttribute('d')).to.match(/^M [\d.-]+ [\d.-]+ L [\d.-]+ [\d.-]+$/);
      expect(snappedLine.getAttribute('stroke-dasharray')).to.equal(null);
      expect(snappedLine.getAttribute('marker-end')).to.contain('dependency-arrowhead-creation');

      fireEvent.drop(target, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(document.querySelector('[data-dependency-drag-line]')).to.equal(null);
      });
    });

    it('should render the provisional line when dragging over empty space with no visible arrows', async () => {
      const { store } = renderTimeline({ events: [eventA, eventB], dependencies: [] });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;

      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(document.body, {
        dataTransfer: new DataTransfer(),
        clientX: 120,
        clientY: 40,
      });

      // Pragmatic publishes the drag start asynchronously; the svg must mount on it
      // even though there is no line to draw yet — its rect is what the line needs.
      await waitFor(() => {
        expect(store.state.dependencyCreation).not.to.equal(null);
      });
      expect(document.querySelector('[data-dependency-arrows]')).not.to.equal(null);

      // The next cursor move draws the line, away from any drop target: the
      // cursor-following monitor writes the path attribute directly on the DOM.
      fireEvent.dragOver(document.body, {
        dataTransfer: new DataTransfer(),
        clientX: 140,
        clientY: 60,
      });

      await waitFor(() => {
        expect(document.querySelector('[data-dependency-drag-line]')).not.to.equal(null);
      });
      await waitFor(() => {
        expect(document.querySelector('[data-dependency-drag-line]')!.getAttribute('d')).to.match(
          /^M /,
        );
      });

      // The free end tracks the cursor 1:1: a further move shifts the line's tail by
      // exactly the cursor delta, pinning the client → viewBox mapping.
      const parseLineEnd = (d: string) => {
        const match = d.match(/L ([\d.-]+) ([\d.-]+)$/)!;
        return { x: Number(match[1]), y: Number(match[2]) };
      };
      const firstEnd = parseLineEnd(
        document.querySelector('[data-dependency-drag-line]')!.getAttribute('d')!,
      );
      fireEvent.dragOver(document.body, {
        dataTransfer: new DataTransfer(),
        clientX: 170,
        clientY: 85,
      });
      await waitFor(() => {
        const nextEnd = parseLineEnd(
          document.querySelector('[data-dependency-drag-line]')!.getAttribute('d')!,
        );
        expect(nextEnd.x - firstEnd.x).to.equal(30);
        expect(nextEnd.y - firstEnd.y).to.equal(25);
      });

      fireEvent.drop(document.body, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });
    });

    it('should surface an error and select the existing arrow when the drop duplicates a dependency', () => {
      const handleDependenciesChange = spy();
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      simulateTerminalDrag('Event A', getEventElement('Event B'));

      expect(handleDependenciesChange.callCount).to.equal(0);
      expect(store.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-1' });
      expect(store.state.errors).to.have.length(1);
      expect(
        document.querySelector('[data-dependency-id="dep-1"]')!.hasAttribute('data-selected'),
      ).to.equal(true);
    });
  });

  describe('selection and deletion', () => {
    it('should select an arrow on click and delete it with the arrowhead button', () => {
      const handleDependenciesChange = spy();
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);

      const selectedPath = document.querySelector('[data-dependency-id="dep-1"]')!;
      expect(selectedPath.hasAttribute('data-selected')).to.equal(true);

      fireEvent.click(document.querySelector('[data-dependency-delete-button]')!);

      expect(handleDependenciesChange.callCount).to.equal(1);
      expect(handleDependenciesChange.firstCall.firstArg).to.deep.equal([]);
      expect(getArrowPaths()).to.have.length(0);
    });

    it('should delete the selected arrow with the Delete key', () => {
      const handleDependenciesChange = spy();
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      fireEvent.keyDown(document.body, { key: 'Delete' });

      expect(handleDependenciesChange.callCount).to.equal(1);
      expect(handleDependenciesChange.firstCall.firstArg).to.deep.equal([]);
      expect(store.state.selection).to.equal(null);
    });

    it('should survive the pointerdown of a real click on the delete button', () => {
      const handleDependenciesChange = spy();
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      const deleteButton = document.querySelector('[data-dependency-delete-button]')!;

      // A real click emits pointerdown first: the click-away guard must ignore it, or
      // the selection clears and the button unmounts before its own click can land.
      fireEvent.pointerDown(deleteButton);
      expect(document.querySelector('[data-dependency-delete-button]')).not.to.equal(null);

      fireEvent.click(deleteButton);
      expect(handleDependenciesChange.callCount).to.equal(1);
      expect(handleDependenciesChange.firstCall.firstArg).to.deep.equal([]);
    });

    it('should delete the selected arrow with the Backspace key', () => {
      const handleDependenciesChange = spy();
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      fireEvent.keyDown(document.body, { key: 'Backspace' });

      expect(handleDependenciesChange.callCount).to.equal(1);
    });

    it('should deselect with the Escape key', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      expect(store.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-1' });

      fireEvent.keyDown(document.body, { key: 'Escape' });

      expect(store.state.selection).to.equal(null);
    });

    it('should keep the selection when Escape cancels an in-flight creation drag', async () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      expect(store.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-1' });

      const source = getTerminal('Event B')!.closest('[draggable="true"]')!;
      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(document.body, {
        dataTransfer: new DataTransfer(),
        clientX: 120,
        clientY: 40,
      });
      await waitFor(() => {
        expect(store.state.dependencyCreation).not.to.equal(null);
      });

      // Escape cancels the drag (pragmatic handles it); the same keystroke must not
      // also drop the selection.
      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(store.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-1' });

      fireEvent.drop(document.body, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });
      await waitFor(() => {
        expect(store.state.dependencyCreation).to.equal(null);
      });

      // With no gesture in flight, Escape deselects again.
      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(store.state.selection).to.equal(null);
    });

    it('should deselect when clicking away from the arrow', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      expect(store.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-1' });

      fireEvent.pointerDown(document.body);
      // A press always produces a click: complete the gesture so the deselection's
      // one-shot click swallow does not stay armed into the next test.
      fireEvent.click(document.body);

      expect(store.state.selection).to.equal(null);
    });

    function setupSelectedArrow() {
      const handleDependenciesChange = spy();
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });
      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      return handleDependenciesChange;
    }

    function pressBackspaceIn(element: HTMLElement) {
      document.body.appendChild(element);
      act(() => element.focus());
      fireEvent.keyDown(element, { key: 'Backspace' });
      element.remove();
    }

    it('should not deselect the arrow on an auxiliary button press', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      fireEvent.pointerDown(document.body, { button: 2 });

      expect(store.state.selection).not.to.equal(null);
    });

    it('should not deselect the arrow when pressing inside a dialog', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);

      const dialog = document.createElement('div');
      dialog.setAttribute('role', 'dialog');
      const button = document.createElement('button');
      dialog.appendChild(button);
      document.body.appendChild(dialog);
      fireEvent.pointerDown(button);
      fireEvent.click(button);
      dialog.remove();

      expect(store.state.selection).not.to.equal(null);
    });

    it('should not swallow a keyboard-activated click after a deselecting press without a click', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);

      // A press whose click never arrives (drag, canceled pointer) leaves the
      // swallow armed; a keystroke disarms it so a keyboard-activated click passes.
      fireEvent.pointerDown(document.body);
      expect(store.state.selection).to.equal(null);
      fireEvent.keyDown(document.body, { key: 'Tab' });

      const cell = document.querySelector<HTMLElement>(
        `.${eventTimelinePremiumClasses.eventsCell}`,
      )!;
      mockElementBounds(cell, { left: 0, top: 0, width: 6144, height: 60 });
      fireEvent.click(cell, { clientX: 100, clientY: 10 });
      expect(store.state.occurrencePlaceholder).not.to.equal(null);
    });

    it('should not create an event with the click that deselects the arrow', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      expect(store.state.selection).not.to.equal(null);

      // A real click-away emits pointerdown (deselecting) then click: the click must
      // be swallowed, like the event dialog's backdrop swallows its closing click.
      const cell = document.querySelector<HTMLElement>(
        `.${eventTimelinePremiumClasses.eventsCell}`,
      )!;
      mockElementBounds(cell, { left: 0, top: 0, width: 6144, height: 60 });
      fireEvent.pointerDown(cell, { clientX: 100, clientY: 10 });
      fireEvent.click(cell, { clientX: 100, clientY: 10 });

      expect(store.state.selection).to.equal(null);
      expect(store.state.occurrencePlaceholder).to.equal(null);

      // The next press acts normally again.
      fireEvent.pointerDown(cell, { clientX: 100, clientY: 10 });
      fireEvent.click(cell, { clientX: 100, clientY: 10 });
      expect(store.state.occurrencePlaceholder).not.to.equal(null);
    });

    it('should not deselect the arrow when pressing inside a shadow-rooted dialog', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });
      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);

      // At the document level the press is retargeted to the shadow host, which does
      // not match the dialog guard: the guard must look at the composed path, like
      // its keyboard sibling.
      const host = document.createElement('div');
      const dialog = document.createElement('div');
      dialog.setAttribute('role', 'dialog');
      const button = document.createElement('button');
      dialog.appendChild(button);
      host.attachShadow({ mode: 'open' }).appendChild(dialog);
      document.body.appendChild(host);
      fireEvent.pointerDown(button, { composed: true });
      host.remove();

      expect(store.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-1' });
    });

    it('should disarm the pending click swallow when the timeline unmounts', () => {
      const { store, unmount } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);

      // A press inside the timeline arms the one-shot swallow; unmounting before the
      // click arrives (a view switch triggered by the press) must disarm it, or it
      // eats the next unrelated click on the page.
      const cell = document.querySelector<HTMLElement>(
        `.${eventTimelinePremiumClasses.eventsCell}`,
      )!;
      fireEvent.pointerDown(cell);
      expect(store.state.selection).to.equal(null);
      act(() => {
        unmount();
      });

      const appButton = document.createElement('button');
      document.body.appendChild(appButton);
      const handleClick = spy();
      appButton.addEventListener('click', handleClick);
      fireEvent.click(appButton);
      appButton.remove();

      expect(handleClick.callCount).to.equal(1);
    });

    it('should not swallow the click of a press outside the timeline', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      expect(store.state.selection).not.to.equal(null);

      // A press on the host app outside the scheduler deselects, but its click
      // belongs to the app: a button elsewhere on the page must not need two clicks.
      const appButton = document.createElement('button');
      document.body.appendChild(appButton);
      const handleClick = spy();
      appButton.addEventListener('click', handleClick);
      fireEvent.pointerDown(appButton);
      fireEvent.click(appButton);
      appButton.remove();

      expect(store.state.selection).to.equal(null);
      expect(handleClick.callCount).to.equal(1);
    });

    it('should not delete the arrow when typing Backspace in an editable element', () => {
      const handleDependenciesChange = setupSelectedArrow();

      pressBackspaceIn(document.createElement('input'));

      expect(handleDependenciesChange.callCount).to.equal(0);
    });

    it('should not delete the arrow when typing Backspace in a select', () => {
      const handleDependenciesChange = setupSelectedArrow();

      pressBackspaceIn(document.createElement('select'));

      expect(handleDependenciesChange.callCount).to.equal(0);
    });

    it('should not delete the arrow when typing Backspace in a non-native combobox', () => {
      const handleDependenciesChange = setupSelectedArrow();

      // A MUI non-native Select: focus lands on a div with the combobox role, not on
      // a hidden input.
      const combobox = document.createElement('div');
      combobox.setAttribute('role', 'combobox');
      combobox.tabIndex = 0;
      pressBackspaceIn(combobox);

      expect(handleDependenciesChange.callCount).to.equal(0);
    });

    it('should not delete the arrow when typing Backspace in a contenteditable element', () => {
      const handleDependenciesChange = setupSelectedArrow();

      const editable = document.createElement('div');
      editable.setAttribute('contenteditable', 'true');
      editable.tabIndex = 0;
      pressBackspaceIn(editable);

      expect(handleDependenciesChange.callCount).to.equal(0);
    });

    it('should not delete the arrow when typing Backspace in an input inside a shadow root', () => {
      const handleDependenciesChange = setupSelectedArrow();

      // At the document level the event is retargeted to the host, which is not
      // editable itself: the guard must look at the composed path.
      const host = document.createElement('div');
      const shadowInput = document.createElement('input');
      host.attachShadow({ mode: 'open' }).appendChild(shadowInput);
      document.body.appendChild(host);
      act(() => shadowInput.focus());
      shadowInput.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, composed: true }),
      );
      host.remove();

      expect(handleDependenciesChange.callCount).to.equal(0);
    });

    it('should not deselect the arrow with Escape pressed inside a dialog', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });
      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);

      // Escape aimed at a dialog closes the dialog; the selection underneath must
      // survive so one keystroke does not do both.
      const dialog = document.createElement('div');
      dialog.setAttribute('role', 'dialog');
      dialog.tabIndex = 0;
      document.body.appendChild(dialog);
      act(() => dialog.focus());
      fireEvent.keyDown(dialog, { key: 'Escape' });
      dialog.remove();

      expect(store.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-1' });
    });

    it('should clear the selection when the selected dependency is removed externally, and only then', async () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [
          buildDependency('dep-1', 'event-a', 'event-b'),
          buildDependency('dep-2', 'event-b', 'event-a'),
        ],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      expect(store.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-1' });

      // Removing an unrelated dependency leaves the selection alone.
      act(() => {
        store.deleteDependency('dep-2');
      });
      await waitFor(() => {
        expect(getArrowPaths()).to.have.length(1);
      });
      expect(store.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-1' });
      expect(document.querySelector('[data-dependency-delete-button]')).not.to.equal(null);

      // Removing the selected one clears the raw selection — not just its rendering —
      // so a consumer re-adding the same id cannot resurrect it selected.
      act(() => {
        store.deleteDependency('dep-1');
      });
      await waitFor(() => {
        expect(document.querySelector('[data-selected]')).to.equal(null);
      });
      expect(document.querySelector('[data-dependency-delete-button]')).to.equal(null);
      expect(store.state.selection).to.equal(null);
    });

    it('should discard the creation gesture when the timeline unmounts mid-drag', async () => {
      const { store, unmount } = renderTimeline({ events: [eventA, eventB], dependencies: [] });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(document.body, {
        dataTransfer: new DataTransfer(),
        clientX: 120,
        clientY: 40,
      });
      await waitFor(() => {
        expect(store.state.dependencyCreation).not.to.equal(null);
      });

      act(() => {
        unmount();
      });

      expect(store.state.dependencyCreation).to.equal(null);

      // Unmounting does not deliver a native dragend: end the gesture so pragmatic's
      // global drag state does not leak into the next test.
      fireEvent.dragEnd(document.body, { dataTransfer: new DataTransfer() });
    });
  });

  describe('read-only', () => {
    const readOnlyEvent = EventBuilder.new()
      .id('event-ro')
      .title('Read-only event')
      .singleDay('2025-07-03T13:00:00Z')
      .readOnly()
      .resource(resource1)
      .build();

    it('should not render any terminal when the component is read-only', () => {
      renderTimeline({ events: [eventA, eventB], dependencies: [], readOnly: true });

      expect(getTerminal('Event A')).to.equal(null);
      expect(getTerminal('Event B')).to.equal(null);
    });

    it('should not render a terminal on a read-only event', () => {
      renderTimeline({ events: [eventA, readOnlyEvent], dependencies: [] });

      expect(getTerminal('Event A')).not.to.equal(null);
      expect(getTerminal('Read-only event')).to.equal(null);
    });

    it('should not render terminals on the events of a resource with read-only events', () => {
      const readOnlyResource = ResourceBuilder.new()
        .id('r1')
        .title('Resource 1')
        .areEventsReadOnly()
        .build();
      renderTimeline({ events: [eventA, eventB], resources: [readOnlyResource], dependencies: [] });

      expect(getTerminal('Event A')).to.equal(null);
      expect(getTerminal('Event B')).to.equal(null);
    });

    it('should reject the drop on a read-only event and surface an error', () => {
      const handleDependenciesChange = spy();
      const { store } = renderTimeline({
        events: [eventA, readOnlyEvent],
        dependencies: [],
        onDependenciesChange: handleDependenciesChange,
      });

      simulateTerminalDrag('Event A', getEventElement('Read-only event'));

      expect(handleDependenciesChange.callCount).to.equal(0);
      expect(store.state.errors).to.have.length(1);
      expect(store.state.errors[0].error.message).to.contain('read-only');
    });

    it('should reject addDependency when the component is read-only', () => {
      const handleDependenciesChange = spy();
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [],
        readOnly: true,
        onDependenciesChange: handleDependenciesChange,
      });

      let result;
      act(() => {
        result = store.addDependency({
          source: 'event-a',
          target: 'event-b',
          type: 'FinishToStart',
        });
      });

      expect(result).to.deep.equal({
        status: 'rejected',
        reason: 'readOnlyEvent',
        eventId: 'event-a',
      });
      expect(handleDependenciesChange.callCount).to.equal(0);
    });

    it('should ignore deleteDependency when an event of the dependency is read-only', () => {
      const handleDependenciesChange = spy();
      const { store } = renderTimeline({
        events: [eventA, readOnlyEvent],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-ro')],
        onDependenciesChange: handleDependenciesChange,
      });

      act(() => {
        store.deleteDependency('dep-1');
      });

      expect(handleDependenciesChange.callCount).to.equal(0);
      expect(getArrowPaths()).to.have.length(1);
    });

    it('should keep the arrowhead and the selection on a selected read-only dependency', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        readOnly: true,
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);

      // No delete button replaces the arrowhead, so the arrow keeps its tip...
      expect(
        document.querySelector('[data-dependency-id="dep-1"]')!.getAttribute('marker-end'),
      ).to.contain('dependency-arrowhead');
      // ...and a refused deletion keeps the selection instead of silently clearing it.
      fireEvent.keyDown(document.body, { key: 'Delete' });
      expect(store.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-1' });
    });

    it('should select a read-only dependency without offering the delete button', () => {
      const handleDependenciesChange = spy();
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        readOnly: true,
        onDependenciesChange: handleDependenciesChange,
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);

      expect(
        document.querySelector('[data-dependency-id="dep-1"]')!.hasAttribute('data-selected'),
      ).to.equal(true);
      expect(document.querySelector('[data-dependency-delete-button]')).to.equal(null);

      fireEvent.keyDown(document.body, { key: 'Delete' });

      expect(handleDependenciesChange.callCount).to.equal(0);
      expect(getArrowPaths()).to.have.length(1);
    });
  });

  describe('multi-resource events', () => {
    // Both appearances share the occurrence key (it derives from the event id): only
    // the resource distinguishes them.
    const sharedEvent = EventBuilder.new()
      .id('event-shared')
      .title('Shared event')
      .singleDay('2025-07-03T09:00:00Z')
      .resources([resource1, resource2])
      .build();

    it('should render one terminal per row appearance', () => {
      renderTimeline({ events: [sharedEvent], dependencies: [] });

      expect(getTerminal('Shared event', 'r1')).not.to.equal(null);
      expect(getTerminal('Shared event', 'r2')).not.to.equal(null);
    });

    it('should reveal only the terminal of the hovered row appearance', () => {
      renderTimeline({ events: [sharedEvent], dependencies: [] });

      fireEvent.pointerOver(getAppearanceElement('Shared event', 'r1'));

      expect(getTerminal('Shared event', 'r1')!.hasAttribute('data-visible')).to.equal(true);
      expect(getTerminal('Shared event', 'r2')!.hasAttribute('data-visible')).to.equal(false);
    });

    it('should keep only the dragged appearance terminal revealed during the gesture', async () => {
      const { store } = renderTimeline({ events: [sharedEvent, eventB], dependencies: [] });

      const source = getTerminal('Shared event', 'r2')!.closest('[draggable="true"]')!;
      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(document.body, {
        dataTransfer: new DataTransfer(),
        clientX: 120,
        clientY: 40,
      });

      await waitFor(() => {
        expect(store.state.dependencyCreation).not.to.equal(null);
      });
      expect(getTerminal('Shared event', 'r2')!.hasAttribute('data-visible')).to.equal(true);
      expect(getTerminal('Shared event', 'r1')!.hasAttribute('data-visible')).to.equal(false);

      fireEvent.drop(document.body, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });
    });

    it('should render a single delete button for a selected dependency with several appearances', () => {
      renderTimeline({
        events: [eventA, sharedEvent],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-shared')],
      });

      // One arrow per pair of row appearances: the multi-resource target draws two.
      const hits = document.querySelectorAll('[data-dependency-hit="dep-1"]');
      expect(hits.length).to.equal(2);

      fireEvent.click(hits[0]);

      expect(document.querySelectorAll('[data-dependency-delete-button]').length).to.equal(1);
    });

    it('should highlight only the hovered row appearance of a multi-resource drop target', async () => {
      renderTimeline({ events: [eventA, sharedEvent], dependencies: [] });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      const r1Appearance = getAppearanceElement('Shared event', 'r1');
      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnter(r1Appearance, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(r1Appearance, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(r1Appearance.hasAttribute('data-dependency-drop-target')).to.equal(true);
      });
      expect(
        getAppearanceElement('Shared event', 'r2').hasAttribute('data-dependency-drop-target'),
      ).to.equal(false);

      fireEvent.drop(r1Appearance, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });
    });
  });

  describe('several timelines on one page', () => {
    const eventC = EventBuilder.new()
      .id('event-c')
      .title('Event C')
      .singleDay('2025-07-03T09:00:00Z')
      .resource(resource1)
      .build();
    const eventD = EventBuilder.new()
      .id('event-d')
      .title('Event D')
      .singleDay('2025-07-03T11:00:00Z')
      .resource(resource1)
      .build();

    function renderTwoTimelines({
      dependenciesA = [],
      dependenciesB = [],
      onDependenciesChangeB,
    }: {
      dependenciesA?: ReturnType<typeof buildDependency>[];
      dependenciesB?: ReturnType<typeof buildDependency>[];
      onDependenciesChangeB?: () => void;
    } = {}) {
      let storeA!: any;
      let storeB!: any;
      render(
        <div className="test-timeline-host" style={{ width: 1200, height: 1200 }}>
          <style>{'.test-timeline-host, .test-timeline-host * { box-sizing: border-box; }'}</style>
          <TestTimeline
            events={[eventA, eventB]}
            resources={[resource1, resource2]}
            dependencies={dependenciesA}
            onStoreReady={(mountedStore) => {
              storeA = mountedStore;
            }}
          />
          <TestTimeline
            events={[eventC, eventD]}
            resources={[resource1, resource2]}
            dependencies={dependenciesB}
            onDependenciesChange={onDependenciesChangeB}
            onStoreReady={(mountedStore) => {
              storeB = mountedStore;
            }}
          />
        </div>,
      );
      return { storeA, storeB };
    }

    it('should move the selection when clicking an arrow of another timeline', () => {
      const { storeA, storeB } = renderTwoTimelines({
        dependenciesA: [buildDependency('dep-a1', 'event-a', 'event-b')],
        dependenciesB: [buildDependency('dep-b1', 'event-c', 'event-d')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-a1"]')!);
      expect(storeA.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-a1' });

      // A real click on the other timeline's arrow presses first: timeline A must
      // treat it as a click-away, or one Delete would delete a link in each timeline.
      const otherHit = document.querySelector('[data-dependency-hit="dep-b1"]')!;
      fireEvent.pointerDown(otherHit);
      fireEvent.click(otherHit);

      expect(storeB.state.selection).to.deep.equal({ type: 'dependency', id: 'dep-b1' });
      expect(storeA.state.selection).to.equal(null);
    });

    it('should not react to a creation gesture started in another timeline', async () => {
      const handleDependenciesChangeB = spy();
      const { storeA, storeB } = renderTwoTimelines({
        onDependenciesChangeB: handleDependenciesChangeB,
      });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      const target = getEventElement('Event B');
      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnter(target, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(target, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(storeA.state.dependencyCreation).not.to.equal(null);
      });
      expect(storeB.state.dependencyCreation).to.equal(null);

      fireEvent.drop(target, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(storeA.state.dependencyCreation).to.equal(null);
      });
      expect(handleDependenciesChangeB.callCount).to.equal(0);
      expect(storeB.state.errors).to.have.length(0);
    });

    it('should not accept a terminal dropped from another timeline', async () => {
      const handleDependenciesChangeB = spy();
      const { storeA, storeB } = renderTwoTimelines({
        onDependenciesChangeB: handleDependenciesChangeB,
      });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      const sameTimelineTarget = getEventElement('Event B');
      const otherTimelineTarget = getEventElement('Event C');

      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnter(sameTimelineTarget, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(sameTimelineTarget, { dataTransfer: new DataTransfer() });

      // Hovering the same-timeline target proves the drag reached the highlight stage
      // before asserting that the other timeline's event never gets it.
      await waitFor(() => {
        expect(sameTimelineTarget.hasAttribute('data-dependency-drop-target')).to.equal(true);
      });

      fireEvent.dragEnter(otherTimelineTarget, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(otherTimelineTarget, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(sameTimelineTarget.hasAttribute('data-dependency-drop-target')).to.equal(false);
      });
      expect(otherTimelineTarget.hasAttribute('data-dependency-drop-target')).to.equal(false);

      fireEvent.drop(otherTimelineTarget, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnd(source, { dataTransfer: new DataTransfer() });

      await waitFor(() => {
        expect(storeA.state.dependencyCreation).to.equal(null);
      });
      expect(handleDependenciesChangeB.callCount).to.equal(0);
      expect(storeA.state.errors).to.have.length(0);
      expect(storeB.state.errors).to.have.length(0);
    });
  });
});
