import { spy } from 'sinon';
import { act, fireEvent, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
  simulateDragAndDrop,
} from 'test/utils/scheduler';
import {
  buildDependency,
  createDependencyTimelineRenderer,
  getArrowPaths,
  getEventElement,
  resource1,
  resource2,
  TestTimeline,
} from './dependencyTestUtils';

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

function getTerminal(title: string) {
  // The terminals render in an overlay outside the event elements, tied to their
  // event by the occurrence key.
  const occurrenceKey = getEventElement(title).getAttribute('data-occurrence-key');
  return document.querySelector<HTMLElement>(`[data-dependency-handle="${occurrenceKey}"]`);
}

function simulateTerminalDrag(sourceTitle: string, targetTitle: string) {
  act(() => {
    simulateDragAndDrop({
      source: getTerminal(sourceTitle)!,
      target: getEventElement(targetTitle),
    });
  });
}

describe('<EventTimelinePremium /> dependency terminals', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });
  const { renderTimeline } = createDependencyTimelineRenderer(render);

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
  });

  describe.skipIf(isJSDOM)('terminal placement', () => {
    const adjacentEvent = EventBuilder.new()
      .id('event-adj')
      .title('Adjacent event')
      .singleDay('2025-07-03T10:00:00Z')
      .resource(resource1)
      .build();

    it('should stay inside its event instead of covering the adjacent event edge', async () => {
      renderTimeline({ events: [eventA, adjacentEvent], dependencies: [] });

      fireEvent.pointerOver(getEventElement('Event A'));
      await waitFor(() => {
        expect(getTerminal('Event A')!.hasAttribute('data-visible')).to.equal(true);
      });

      const adjacentRect = getEventElement('Adjacent event').getBoundingClientRect();
      const centerY = adjacentRect.top + adjacentRect.height / 2;

      // Just inside the back-to-back neighbor: its own surface, so a start-resize
      // grab or a click stays a grab on the neighbor — not a dependency drag.
      const onNeighbor = document.elementFromPoint(adjacentRect.left + 2, centerY)!;
      expect(onNeighbor.closest('[data-dependency-handle]')).to.equal(null);

      // Just inside the hovered event's tail: the terminal is reachable there.
      const onTail = document.elementFromPoint(adjacentRect.left - 3, centerY)!;
      expect(onTail.closest('[data-dependency-handle]')).not.to.equal(null);
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

      simulateTerminalDrag('Event A', 'Event B');

      expect(handleDependenciesChange.callCount).to.equal(1);
      const dependencies = handleDependenciesChange.firstCall.firstArg;
      expect(dependencies).to.have.length(1);
      expect(dependencies[0].source).to.equal('event-a');
      expect(dependencies[0].target).to.equal('event-b');
      expect(dependencies[0].type).to.equal('FinishToStart');
    });

    it('should not highlight a recurring event during a terminal drag', async () => {
      renderTimeline({ events: [eventA, eventB, recurringEvent], dependencies: [] });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      const validTarget = getEventElement('Event B');
      const recurringTarget = getEventElement('Recurring event');

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

      simulateTerminalDrag('Event A', 'Recurring event');

      expect(handleDependenciesChange.callCount).to.equal(0);
      expect(store.state.errors).to.have.length(1);
      expect(store.state.errors[0].error.message).to.contain('recurring');
    });

    it('should replace an identical rejection toast instead of stacking it', () => {
      const { store } = renderTimeline({ events: [eventA, recurringEvent], dependencies: [] });

      simulateTerminalDrag('Event A', 'Recurring event');
      simulateTerminalDrag('Event A', 'Recurring event');

      expect(store.state.errors).to.have.length(1);
      expect(store.state.errors[0].error.message).to.contain('recurring');
    });

    it('should auto-dismiss a rejection toast', () => {
      vi.useFakeTimers();
      try {
        const { store } = renderTimeline({ events: [eventA, recurringEvent], dependencies: [] });

        simulateTerminalDrag('Event A', 'Recurring event');
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
      renderTimeline({ events: [eventA, eventB], dependencies: [] });

      const source = getTerminal('Event A')!.closest('[draggable="true"]')!;
      const target = getEventElement('Event B');

      fireEvent.dragStart(source, { dataTransfer: new DataTransfer() });
      fireEvent.dragEnter(target, { dataTransfer: new DataTransfer() });
      fireEvent.dragOver(target, { dataTransfer: new DataTransfer() });

      // Pragmatic-dnd processes drag events asynchronously.
      await waitFor(() => {
        expect(target.hasAttribute('data-dependency-drop-target')).to.equal(true);
      });
      expect(getEventElement('Event A').hasAttribute('data-dependency-drag-source')).to.equal(true);

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

      // The next cursor move renders the line, away from any drop target.
      fireEvent.dragOver(document.body, {
        dataTransfer: new DataTransfer(),
        clientX: 140,
        clientY: 60,
      });

      await waitFor(() => {
        expect(document.querySelector('[data-dependency-drag-line]')).not.to.equal(null);
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

      simulateTerminalDrag('Event A', 'Event B');

      expect(handleDependenciesChange.callCount).to.equal(0);
      expect(store.state.selectedDependencyId).to.equal('dep-1');
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
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      fireEvent.keyDown(document.body, { key: 'Delete' });

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
      expect(store.state.selectedDependencyId).to.equal('dep-1');

      fireEvent.keyDown(document.body, { key: 'Escape' });

      expect(store.state.selectedDependencyId).to.equal(null);
    });

    it('should deselect when clicking away from the arrow', () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      expect(store.state.selectedDependencyId).to.equal('dep-1');

      fireEvent.pointerDown(document.body);

      expect(store.state.selectedDependencyId).to.equal(null);
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

      expect(store.state.selectedDependencyId).to.equal('dep-1');
    });

    it('should clear the visual selection when the selected dependency is removed externally', async () => {
      const { store } = renderTimeline({
        events: [eventA, eventB],
        dependencies: [
          buildDependency('dep-1', 'event-a', 'event-b'),
          buildDependency('dep-2', 'event-b', 'event-a'),
        ],
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);
      expect(store.state.selectedDependencyId).to.equal('dep-1');

      // An external consumer removes the selected dependency: the selection selector
      // resolves to null without any reconciliation.
      act(() => {
        store.deleteDependency('dep-1');
      });

      await waitFor(() => {
        expect(document.querySelector('[data-selected]')).to.equal(null);
      });
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

      simulateTerminalDrag('Event A', 'Read-only event');

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

  describe('several timelines on one page', () => {
    const eventC = EventBuilder.new()
      .id('event-c')
      .title('Event C')
      .singleDay('2025-07-03T09:00:00Z')
      .resource(resource1)
      .build();

    function renderTwoTimelines(handleDependenciesChangeB: () => void) {
      let storeA!: any;
      let storeB!: any;
      render(
        <div className="test-timeline-host" style={{ width: 1200, height: 1200 }}>
          <style>{'.test-timeline-host, .test-timeline-host * { box-sizing: border-box; }'}</style>
          <TestTimeline
            events={[eventA, eventB]}
            resources={[resource1, resource2]}
            dependencies={[]}
            onStoreReady={(mountedStore) => {
              storeA = mountedStore;
            }}
          />
          <TestTimeline
            events={[eventC]}
            resources={[resource1, resource2]}
            dependencies={[]}
            onDependenciesChange={handleDependenciesChangeB}
            onStoreReady={(mountedStore) => {
              storeB = mountedStore;
            }}
          />
        </div>,
      );
      return { storeA, storeB };
    }

    it('should not react to a creation gesture started in another timeline', async () => {
      const handleDependenciesChangeB = spy();
      const { storeA, storeB } = renderTwoTimelines(handleDependenciesChangeB);

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
      const { storeA, storeB } = renderTwoTimelines(handleDependenciesChangeB);

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
