import { spy } from 'sinon';
import { act, fireEvent, waitFor } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  simulateDragAndDrop,
} from 'test/utils/scheduler';
import {
  buildDependency,
  createDependencyTimelineRenderer,
  getArrowPaths,
  getEventElement,
  resource1,
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
  return getEventElement(title).querySelector<HTMLElement>('[data-dependency-handle]');
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

    it('should not delete the arrow when typing Backspace in an editable element', () => {
      const handleDependenciesChange = spy();
      renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      fireEvent.click(document.querySelector('[data-dependency-hit="dep-1"]')!);

      const input = document.createElement('input');
      document.body.appendChild(input);
      act(() => input.focus());
      fireEvent.keyDown(input, { key: 'Backspace' });
      input.remove();

      expect(handleDependenciesChange.callCount).to.equal(0);
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
});
