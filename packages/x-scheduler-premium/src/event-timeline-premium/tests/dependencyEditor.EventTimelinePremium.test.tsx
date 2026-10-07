import { fireEvent, screen, waitFor, within } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { describe, it, expect, vi, afterEach } from 'vitest';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import type { EventTimelinePremiumStore } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
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
// Overlaps `eventA`: a Finish to start dependency from `eventA` breaks it.
const overlappingEvent = EventBuilder.new()
  .id('event-o')
  .title('Event O')
  .singleDay('2025-07-03T09:30:00Z')
  .resource(resource2)
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

function getHeadHitArea(dependencyId: string) {
  return document.querySelector(`[data-dependency-hit-head="${dependencyId}"]`)!;
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

function getLagInput(dialog: HTMLElement) {
  return within(dialog).getByRole('textbox', { name: 'Lag' });
}

function getLagUnit(dialog: HTMLElement) {
  return within(dialog).getByRole('combobox', { name: 'Lag unit' });
}

function chooseLagUnit(dialog: HTMLElement, label: string) {
  fireEvent.mouseDown(getLagUnit(dialog));
  fireEvent.click(screen.getByRole('option', { name: label }));
}

function getStartTimestamp(store: EventTimelinePremiumStore<any, any>, eventId: string): number {
  return store.state.processedEventLookup.get(eventId)!.dataTimezone.start.timestamp;
}

// The submit validates asynchronously: wait until the dialog closes or Save is enabled again.
async function save(dialog: HTMLElement) {
  fireEvent.click(within(dialog).getByRole('button', { name: /save/i }));
  await waitFor(() => {
    const button = within(dialog).getByRole<HTMLButtonElement>('button', { name: /save/i });
    expect(!dialog.isConnected || !button.disabled).to.equal(true);
  });
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

    it('should highlight and select the arrow from its arrowhead', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.pointerEnter(getHeadHitArea('dep-1'));

      expect(getVisualArrows('dep-1')[0].hasAttribute('data-hovered')).to.equal(true);

      fireEvent.click(getHeadHitArea('dep-1'));

      expect(getVisualArrows('dep-1')[0].hasAttribute('data-selected')).to.equal(true);
    });

    it('should paint the hovered arrow above the others', async () => {
      await renderTimeline({
        events: [eventA, eventB, eventC],
        dependencies: [
          buildDependency('dep-1', 'event-a', 'event-b'),
          buildDependency('dep-2', 'event-b', 'event-c'),
        ],
      });

      const getPaintOrder = () =>
        Array.from(document.querySelectorAll('[data-dependency-arrows] [data-dependency-id]')).map(
          (arrow) => arrow.getAttribute('data-dependency-id'),
        );
      expect(getPaintOrder()).to.deep.equal(['dep-1', 'dep-2']);

      fireEvent.pointerEnter(getHitArea('dep-1'));

      expect(getPaintOrder()).to.deep.equal(['dep-2', 'dep-1']);
    });

    it('should not keep the hover of an arrow removed under the pointer', async () => {
      const dependency = buildDependency('dep-1', 'event-a', 'event-b');
      const { setProps } = await renderTimeline({
        events: [eventA, eventB],
        dependencies: [dependency],
      });

      fireEvent.pointerEnter(getHitArea('dep-1'));
      // Unmounted under the pointer: no pointerleave reaches the arrow.
      await setProps({ dependencies: [] });
      await setProps({ dependencies: [dependency] });

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
    it('should open on double click with the source and target event titles', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      const dialog = openDialog('dep-1');

      expect(within(dialog).getByText('Edit dependency')).not.to.equal(null);
      expect(
        within(dialog)
          .getAllByRole('term')
          .map((term) => [term.textContent, term.nextElementSibling?.textContent]),
      ).to.deep.equal([
        ['From', 'Event A'],
        ['To', 'Event B'],
      ]);
    });

    it('should show the source and target in the colors of their events', async () => {
      await renderTimeline({
        events: [
          EventBuilder.new()
            .id('event-a')
            .title('Event A')
            .singleDay('2025-07-03T09:00:00Z')
            .resource(resource1)
            .color('pink')
            .build(),
          eventB,
        ],
        resources: [ResourceBuilder.new().id('r1').title('Resource 1').eventColor('lime').build()],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      const dialog = openDialog('dep-1');

      expect(within(dialog).getByTitle('Event A')).to.have.attribute('data-palette', 'pink');
      expect(within(dialog).getByTitle('Event B')).to.have.attribute('data-palette', 'lime');
    });

    it('should use the colors of the row of the opened arrow for a multi-resource event', async () => {
      const multiResourceEvent = EventBuilder.new()
        .id('event-m')
        .title('Event M')
        .singleDay('2025-07-03T13:00:00Z')
        .resources([resource1, resource2])
        .build();
      await renderTimeline({
        events: [eventA, multiResourceEvent],
        resources: [
          ResourceBuilder.new().id('r1').title('Resource 1').eventColor('blue').build(),
          ResourceBuilder.new().id('r2').title('Resource 2').eventColor('orange').build(),
        ],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-m')],
      });

      // One arrow per row of `event-m`, in row order.
      const hitAreas = document.querySelectorAll('[data-dependency-hit="dep-1"]');
      expect(hitAreas).to.have.length(2);
      fireEvent.doubleClick(hitAreas[1]);

      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByTitle('Event A')).to.have.attribute('data-palette', 'blue');
      expect(within(dialog).getByTitle('Event M')).to.have.attribute('data-palette', 'orange');
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
      await save(dialog);

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
      await save(dialog);

      expect(handleDependenciesChange.mock.calls.length).to.equal(0);
      const typeSelect = within(screen.getByRole('dialog')).getByRole('combobox', { name: 'Type' });
      expect(typeSelect).toHaveAccessibleDescription(
        'A dependency of this type already exists between these two events.',
      );
      expect(document.activeElement).to.equal(typeSelect);
    });

    it('should move the target when the new type is broken by its dates', async () => {
      const { store } = await renderTimeline({
        events: [eventA, overlappingEvent],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-o', 'StartToStart')],
      });
      const sourceEnd = store.state.processedEventLookup.get('event-a')!.dataTimezone.end.timestamp;

      const dialog = openDialog('dep-1');
      chooseType(dialog, 'Finish to start');
      await save(dialog);

      expect(getStartTimestamp(store, 'event-o')).to.equal(sourceEnd);
      expect(screen.queryByRole('dialog')).to.equal(null);
    });

    // Changing `dep-1` to Finish to start would push `event-o` into the read-only `event-d`.
    function renderReadOnlyCascade(onDependenciesChange?: (value: SchedulerDependency[]) => void) {
      const readOnlyEvent = EventBuilder.new()
        .id('event-d')
        .title('Event D')
        .readOnly()
        .singleDay('2025-07-03T10:30:00Z')
        .resource(resource2)
        .build();
      return renderTimeline({
        events: [eventA, overlappingEvent, readOnlyEvent],
        dependencies: [
          buildDependency('dep-1', 'event-a', 'event-o', 'StartToStart'),
          buildDependency('dep-2', 'event-o', 'event-d'),
        ],
        onDependenciesChange,
      });
    }

    it('should show the rejection on the type when the new type would move a read-only event', async () => {
      const handleDependenciesChange = vi.fn();
      const { store } = await renderReadOnlyCascade(handleDependenciesChange);
      const targetStart = getStartTimestamp(store, 'event-o');

      const dialog = openDialog('dep-1');
      chooseType(dialog, 'Finish to start');
      await save(dialog);

      const typeSelect = within(dialog).getByRole('combobox', { name: 'Type' });
      expect(typeSelect).toHaveAccessibleDescription(
        'This change would move a read-only event, so it was not applied.',
      );
      expect(handleDependenciesChange.mock.calls.length).to.equal(0);
      expect(getStartTimestamp(store, 'event-o')).to.equal(targetStart);

      // Only editing the field that caused it clears the error, like in the event form.
      fireEvent.change(getLagInput(dialog), { target: { value: '1' } });
      expect(typeSelect).toHaveAccessibleDescription(
        'This change would move a read-only event, so it was not applied.',
      );
      chooseType(dialog, 'Finish to finish');
      expect(typeSelect).not.to.have.attribute('aria-describedby');
    });

    it('should show the rejection on the lag when the new lag would move a read-only event', async () => {
      await renderReadOnlyCascade();

      // A 1-hour Start to start lag pushes `event-o` to 10:00, and `dep-2` then into `event-d`.
      const dialog = openDialog('dep-1');
      fireEvent.change(getLagInput(dialog), { target: { value: '1' } });
      chooseLagUnit(dialog, 'hours');
      await save(dialog);

      expect(getLagInput(dialog)).toHaveAccessibleDescription(
        'This change would move a read-only event, so it was not applied.',
      );
      expect(document.activeElement).to.equal(getLagInput(dialog));

      fireEvent.change(getLagInput(dialog), { target: { value: '0' } });
      expect(getLagInput(dialog)).not.to.have.attribute('aria-describedby');
    });

    it('should clear the lag error when the lag unit changes', async () => {
      await renderReadOnlyCascade();

      const dialog = openDialog('dep-1');
      fireEvent.change(getLagInput(dialog), { target: { value: '1' } });
      chooseLagUnit(dialog, 'hours');
      await save(dialog);
      expect(getLagInput(dialog)).to.have.attribute('aria-describedby');

      chooseLagUnit(dialog, 'minutes');

      expect(getLagInput(dialog)).not.to.have.attribute('aria-describedby');
    });

    it('should emit nothing when closed, and show the original values when reopened', async () => {
      const handleDependenciesChange = vi.fn();
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      const dialog = openDialog('dep-1');
      chooseType(dialog, 'Start to start');
      fireEvent.change(getLagInput(dialog), { target: { value: '2' } });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));

      expect(screen.queryByRole('dialog')).to.equal(null);
      expect(handleDependenciesChange.mock.calls.length).to.equal(0);

      const reopened = openDialog('dep-1');
      expect(within(reopened).getByRole('combobox', { name: 'Type' })).to.have.text(
        'Finish to start',
      );
      expect(getLagInput(reopened)).to.have.property('value', '');
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

    it('should keep the arrow selected while choosing a type', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      const dialog = openDialog('dep-1');
      fireEvent.mouseDown(within(dialog).getByRole('combobox', { name: 'Type' }));
      fireEvent.pointerDown(screen.getByRole('option', { name: 'Start to start' }));

      expect(getVisualArrows('dep-1')[0].hasAttribute('data-selected')).to.equal(true);
    });

    it('should keep the arrow selected when dismissing the type options', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      const dialog = openDialog('dep-1');
      fireEvent.mouseDown(within(dialog).getByRole('combobox', { name: 'Type' }));
      const optionsBackdrop = screen
        .getByRole('listbox')
        .closest('[role="presentation"]')!
        .querySelector('.MuiBackdrop-root')!;
      fireEvent.pointerDown(optionsBackdrop);

      expect(getVisualArrows('dep-1')[0].hasAttribute('data-selected')).to.equal(true);
    });
  });

  describe('lag', () => {
    it('should save the lag with its unit', async () => {
      const handleDependenciesChange = vi.fn();
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      const dialog = openDialog('dep-1');
      expect(getLagInput(dialog)).to.have.property('value', '');
      expect(getLagInput(dialog)).to.have.attribute('placeholder', '0');
      expect(getLagInput(dialog)).to.have.attribute('inputmode', 'numeric');
      fireEvent.change(getLagInput(dialog), { target: { value: '30' } });
      chooseLagUnit(dialog, 'minutes');
      await save(dialog);

      expect(handleDependenciesChange.mock.lastCall![0][0]).to.deep.include({
        lag: 30,
        lagUnit: 'minute',
      });
      expect(screen.queryByRole('dialog')).to.equal(null);
    });

    it('should remove the lag and its unit when the lag is cleared', async () => {
      const handleDependenciesChange = vi.fn();
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [
          { ...buildDependency('dep-1', 'event-a', 'event-b'), lag: 1, lagUnit: 'hour' },
        ],
        onDependenciesChange: handleDependenciesChange,
      });

      const dialog = openDialog('dep-1');
      expect(getLagInput(dialog)).to.have.property('value', '1');
      fireEvent.change(getLagInput(dialog), { target: { value: '' } });
      await save(dialog);

      const [emitted] = handleDependenciesChange.mock.lastCall![0];
      expect('lag' in emitted).to.equal(false);
      expect('lagUnit' in emitted).to.equal(false);
    });

    it('should keep an untouched lag as written in the props', async () => {
      const handleDependenciesChange = vi.fn();
      await renderTimeline({
        events: [eventA, eventB],
        // No unit: days by default.
        dependencies: [{ ...buildDependency('dep-1', 'event-a', 'event-b'), lag: 2 }],
        onDependenciesChange: handleDependenciesChange,
      });

      const dialog = openDialog('dep-1');
      chooseType(dialog, 'Start to start');
      await save(dialog);

      expect(handleDependenciesChange.mock.lastCall![0][0]).to.deep.equal({
        ...buildDependency('dep-1', 'event-a', 'event-b'),
        lag: 2,
        type: 'StartToStart',
      });
    });

    it('should keep a lag changed in the props while the dialog is open when only the type is saved', async () => {
      const handleDependenciesChange = vi.fn();
      const dependency = { ...buildDependency('dep-1', 'event-a', 'event-b'), lag: 2 };
      const { setProps } = await renderTimeline({
        events: [eventA, eventB],
        dependencies: [dependency],
        onDependenciesChange: handleDependenciesChange,
      });

      const dialog = openDialog('dep-1');
      await setProps({ dependencies: [{ ...dependency, lag: 5 }] });
      chooseType(dialog, 'Start to start');
      await save(dialog);

      expect(handleDependenciesChange.mock.lastCall![0][0]).to.deep.equal({
        ...dependency,
        lag: 5,
        type: 'StartToStart',
      });
    });

    it('should show a lag the timeline ignores as unset', async () => {
      await expect(() =>
        renderTimeline({
          events: [eventA, eventB],
          dependencies: [
            { ...buildDependency('dep-1', 'event-a', 'event-b'), lag: -2, lagUnit: 'hour' },
          ],
        }),
      ).toWarnDev(['MUI X Scheduler: The dependency "dep-1" has a negative lag (-2).']);

      expect(getLagInput(openDialog('dep-1'))).to.have.property('value', '');
    });

    it('should show the lag error and focus the field when saving a lag that is not a whole number', async () => {
      const handleDependenciesChange = vi.fn();
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        onDependenciesChange: handleDependenciesChange,
      });

      const dialog = openDialog('dep-1');
      fireEvent.change(getLagInput(dialog), { target: { value: '1.5' } });
      // Validated on save, like the event form: Save stays enabled.
      expect(getLagInput(dialog)).not.to.have.attribute('aria-describedby');
      await save(dialog);

      expect(screen.getByRole('dialog')).to.equal(dialog);
      expect(getLagInput(dialog)).toHaveAccessibleDescription('Enter a whole number, 0 or more.');
      expect(getLagInput(dialog)).to.have.attribute('aria-invalid', 'true');
      expect(document.activeElement).to.equal(getLagInput(dialog));
      expect(handleDependenciesChange.mock.calls.length).to.equal(0);

      // Writing the field clears its error.
      fireEvent.change(getLagInput(dialog), { target: { value: '2' } });
      expect(getLagInput(dialog)).not.to.have.attribute('aria-describedby');
    });

    it('should say how an all-day successor rounds the lag', async () => {
      const allDayEvent = EventBuilder.new()
        .id('event-d')
        .title('Event D')
        .fullDay('2025-07-05')
        .resource(resource1)
        .build();
      await renderTimeline({
        events: [eventA, allDayEvent],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-d')],
      });

      const dialog = openDialog('dep-1');
      fireEvent.change(getLagInput(dialog), { target: { value: '36' } });
      chooseLagUnit(dialog, 'hours');

      expect(getLagInput(dialog)).toHaveAccessibleDescription(
        'An all-day event can only wait whole days: 1 day.',
      );
      // The unit changes the rounding too, so it announces the same help.
      expect(getLagUnit(dialog)).toHaveAccessibleDescription(
        'An all-day event can only wait whole days: 1 day.',
      );

      fireEvent.change(getLagInput(dialog), { target: { value: '3' } });

      expect(getLagInput(dialog)).toHaveAccessibleDescription(
        'An all-day event can only wait whole days, so this lag adds no wait.',
      );
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

    it('should open the menu on a right click on the delete button', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
      });

      fireEvent.click(getHitArea('dep-1'));
      fireEvent.contextMenu(document.querySelector('[data-dependency-delete-button]')!);

      expect(screen.getByRole('menuitem', { name: 'Edit dependency' })).not.to.equal(null);
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

    it('should close the menu after deleting the last dependency, and open it again on a new one', async () => {
      const dependency = buildDependency('dep-1', 'event-a', 'event-b');
      const { setProps } = await renderTimeline({
        events: [eventA, eventB],
        dependencies: [dependency],
      });

      fireEvent.contextMenu(getHitArea('dep-1'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });

      await setProps({ dependencies: [buildDependency('dep-2', 'event-a', 'event-b')] });
      fireEvent.contextMenu(getHitArea('dep-2'));

      expect(screen.getByRole('menuitem', { name: 'Edit dependency' })).not.to.equal(null);
    });

    it('should not open the dialog from a menu left open on a dependency removed via props', async () => {
      const dependency = buildDependency('dep-1', 'event-a', 'event-b');
      const { setProps } = await renderTimeline({
        events: [eventA, eventB],
        dependencies: [dependency],
      });

      fireEvent.contextMenu(getHitArea('dep-1'));
      await setProps({ dependencies: [] });
      fireEvent.click(screen.getByRole('menuitem', { name: 'Edit dependency' }));

      expect(screen.queryByRole('dialog')).to.equal(null);

      await setProps({ dependencies: [dependency] });

      expect(screen.queryByRole('dialog')).to.equal(null);
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
      expect(
        within(dialog)
          .getAllByRole('term')
          .map((term) => [term.textContent, term.nextElementSibling?.textContent]),
      ).to.deep.equal([
        ['From', 'Event A'],
        ['To', 'Event B'],
        ['Type', 'Finish to start'],
        ['Lag', 'None'],
      ]);
      expect(within(dialog).queryByRole('combobox')).to.equal(null);
      expect(within(dialog).queryByRole('button', { name: 'Delete' })).to.equal(null);
    });

    it('should open the details dialog on double click', async () => {
      await renderTimeline({
        events: [eventA, eventB],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        readOnly: true,
      });

      const dialog = openDialog('dep-1');

      expect(within(dialog).getByText('Dependency details')).not.to.equal(null);
      expect(within(dialog).queryByRole('textbox', { name: 'Lag' })).to.equal(null);
      expect(within(dialog).queryByRole('button', { name: /save/i })).to.equal(null);
      // The header close button and the footer one.
      expect(within(dialog).getAllByRole('button', { name: 'Close' })).to.have.length(2);
    });
  });
});
