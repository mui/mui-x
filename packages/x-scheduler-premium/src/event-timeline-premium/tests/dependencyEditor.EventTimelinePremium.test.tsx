import { fireEvent, screen, within } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
} from 'test/utils/scheduler';
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  buildDependency,
  createDependencyTimelineRenderer,
  resource1,
  resource2,
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
const eventC = EventBuilder.new()
  .id('event-c')
  .title('Event C')
  .singleDay('2025-07-03T13:00:00Z')
  .resource(resource1)
  .build();

function getHitArea(dependencyId: string) {
  return document.querySelector(`[data-dependency-hit="${dependencyId}"]`)!;
}

function getVisualArrows(dependencyId: string) {
  return Array.from(document.querySelectorAll(`[data-dependency-id="${dependencyId}"]`));
}

function openDialog(dependencyId: string) {
  fireEvent.click(getHitArea(dependencyId));
  fireEvent.doubleClick(getHitArea(dependencyId));
  return screen.getByRole('dialog');
}

function chooseType(dialog: HTMLElement, label: string) {
  fireEvent.mouseDown(within(dialog).getByRole('combobox', { name: 'Type' }));
  fireEvent.click(screen.getByRole('option', { name: label }));
}

describe('<EventTimelinePremium /> dependency editor', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });
  const { renderTimeline } = createDependencyTimelineRenderer(renderSettled);

  afterEach(() => {
    // Disarm the click swallow a deselecting press can leave behind.
    fireEvent.click(document.body);
  });

  describe('hover', () => {
    it('should highlight the hovered arrow only', async () => {
      await renderTimeline({
        events: [eventA, eventB, eventC],
        dependencies: [
          buildDependency('dep-1', 'event-a', 'event-b'),
          buildDependency('dep-2', 'event-b', 'event-c'),
        ],
      });

      fireEvent.pointerEnter(getHitArea('dep-1'));

      expect(getVisualArrows('dep-1')[0].hasAttribute('data-hovered')).to.equal(true);
      expect(getVisualArrows('dep-2')[0].hasAttribute('data-hovered')).to.equal(false);

      fireEvent.pointerLeave(getHitArea('dep-1'));

      expect(getVisualArrows('dep-1')[0].hasAttribute('data-hovered')).to.equal(false);
    });

    it('should highlight every appearance of a dependency whose event is on several resources', async () => {
      const multiResourceEvent = EventBuilder.new()
        .id('event-m')
        .title('Event M')
        .singleDay('2025-07-03T13:00:00Z')
        .resources([resource1, resource2])
        .build();
      await renderTimeline({
        events: [eventA, multiResourceEvent],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-m')],
      });

      const arrows = getVisualArrows('dep-1');
      expect(arrows).to.have.length(2);

      fireEvent.pointerEnter(getHitArea('dep-1'));

      expect(arrows.every((arrow) => arrow.hasAttribute('data-hovered'))).to.equal(true);
    });
  });

  describe('dialog', () => {
    it('should open on double click with the two event titles', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      const dialog = openDialog('dep-1');

      expect(within(dialog).getByText('Edit dependency')).not.to.equal(null);
      expect(within(dialog).getByText('Event A → Event B')).not.to.equal(null);
    });

    it('should change the type of the dependency on save', async () => {
      const handleDependenciesChange = vi.fn();
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      const dialog = openDialog('dep-1');
      chooseType(dialog, 'Start to start');
      fireEvent.click(within(dialog).getByRole('button', { name: /save/i }));

      expect(handleDependenciesChange.mock.calls.length).to.equal(1);
      expect(handleDependenciesChange.mock.lastCall![0][0].type).to.equal('StartToStart');
      expect(screen.queryByRole('dialog')).to.equal(null);
    });

    it('should keep the dialog open and not emit when the new type duplicates another dependency', async () => {
      const handleDependenciesChange = vi.fn();
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [
          buildDependency('dep-1', 'event-a', 'event-b'),
          buildDependency('dep-2', 'event-a', 'event-b', 'StartToStart'),
        ],
        onDependenciesChange: handleDependenciesChange,
      });

      const dialog = openDialog('dep-1');
      chooseType(dialog, 'Start to start');
      fireEvent.click(within(dialog).getByRole('button', { name: /save/i }));

      expect(handleDependenciesChange.mock.calls.length).to.equal(0);
      expect(screen.getByRole('dialog')).not.to.equal(null);
    });

    it('should delete the dependency from the dialog', async () => {
      const handleDependenciesChange = vi.fn();
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      const dialog = openDialog('dep-1');
      fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));

      expect(handleDependenciesChange.mock.lastCall![0]).to.deep.equal([]);
      expect(screen.queryByRole('dialog')).to.equal(null);
    });

    it('should keep the arrow selected while interacting with the dialog', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      const dialog = openDialog('dep-1');
      fireEvent.pointerDown(within(dialog).getByRole('combobox', { name: 'Type' }));

      expect(getVisualArrows('dep-1')[0].hasAttribute('data-selected')).to.equal(true);
    });
  });

  describe('context menu', () => {
    it('should open the dialog from Edit dependency', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.contextMenu(getHitArea('dep-1'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Edit dependency' }));

      expect(within(screen.getByRole('dialog')).getByText('Edit dependency')).not.to.equal(null);
    });

    it('should delete the dependency from Delete', async () => {
      const handleDependenciesChange = vi.fn();
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      fireEvent.contextMenu(getHitArea('dep-1'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

      expect(handleDependenciesChange.mock.lastCall![0]).to.deep.equal([]);
    });

    it('should not delete the dependency on a Delete key press inside the menu', async () => {
      const handleDependenciesChange = vi.fn();
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      fireEvent.contextMenu(getHitArea('dep-1'));
      fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Edit dependency' }), {
        key: 'Delete',
      });

      expect(handleDependenciesChange.mock.calls.length).to.equal(0);
    });

    it('should keep the arrow selected when pressing a menu item', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.contextMenu(getHitArea('dep-1'));
      fireEvent.pointerDown(screen.getByRole('menuitem', { name: 'Edit dependency' }));

      expect(getVisualArrows('dep-1')[0].hasAttribute('data-selected')).to.equal(true);
    });
  });

  describe('read-only', () => {
    it('should offer Show details and no Delete, and show the details without inputs', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        readOnly: true,
      });

      fireEvent.contextMenu(getHitArea('dep-1'));

      expect(screen.queryByRole('menuitem', { name: 'Delete' })).to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Show details' }));

      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('Dependency details')).not.to.equal(null);
      expect(within(dialog).getByText('Type: Finish to start')).not.to.equal(null);
      expect(within(dialog).queryByRole('combobox')).to.equal(null);
      expect(within(dialog).queryByRole('button', { name: 'Delete' })).to.equal(null);
    });
  });
});
