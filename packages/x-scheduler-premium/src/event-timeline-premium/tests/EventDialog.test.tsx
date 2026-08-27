import * as React from 'react';
import {
  adapter,
  createSchedulerRenderer,
  EventBuilder,
  ResourceBuilder,
  StoreSpy,
} from 'test/utils/scheduler';
import { screen, within } from '@mui/internal-test-utils';
import type {
  SchedulerEventCreationConfig,
  SchedulerResource,
} from '@mui/x-scheduler-internals/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { EventTimelinePremiumStore } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import {
  EventDialogContent,
  EventEditingOptionalRenderersContext,
  EventEditingStyledContext,
  SharedComponentsStyledContext,
  EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
} from '@mui/x-scheduler/internals';
import { eventTimelinePremiumClasses } from '@mui/x-scheduler-premium/event-timeline-premium';
import { describe, it, expect, type Mock } from 'vitest';
import { PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS } from '../../internals/eventDialogOptionalRenderers';

const editingStyledContextValue = {
  schedulerId: 'test',
  classes: eventTimelinePremiumClasses,
  localeText: EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
};
const sharedComponentsStyledContextValue = { classes: eventTimelinePremiumClasses };

/**
 * Wraps EventDialogContent with the premium renderers the production code supplies at
 * runtime, and with the styled contexts `EventTimelinePremium` normally provides — this suite
 * skips the full component (and the fragile pixel-position click-to-create simulation it would
 * need) in favor of directly seeding a `type: 'creation'` placeholder on a hand-built store,
 * the same technique the Event Calendar's own creation tests already use.
 */
function TestEventDialogContent(props: React.ComponentProps<typeof EventDialogContent>) {
  return (
    <EventEditingStyledContext.Provider value={editingStyledContextValue}>
      <SharedComponentsStyledContext.Provider value={sharedComponentsStyledContextValue}>
        <EventEditingOptionalRenderersContext.Provider
          value={PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS}
        >
          <EventDialogContent {...props} />
        </EventEditingOptionalRenderersContext.Provider>
      </SharedComponentsStyledContext.Provider>
    </EventEditingStyledContext.Provider>
  );
}

const engineering: SchedulerResource = ResourceBuilder.new().title('Engineering').build();
const design: SchedulerResource = ResourceBuilder.new().title('Design').build();
const resources: SchedulerResource[] = [engineering, design];

describe('<EventDialogContent /> — Event Timeline Premium creation', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const { render } = createSchedulerRenderer();

  /**
   * Seeds a `type: 'creation'` placeholder anchored to `rowResource`'s row — mirroring what
   * clicking inside that row produces via `usePlaceholderInRow`, whose `resource` field is
   * `rawPlaceholder.resourceId ?? originalEvent?.resource`: the row's (string) id for a fresh
   * creation with no original event.
   */
  function renderCreationDialog(options: {
    rowResource: SchedulerResource;
    eventCreation?: Partial<SchedulerEventCreationConfig> | boolean;
    onCreateEventSpyReady: (spy: Mock) => void;
  }) {
    const { rowResource, eventCreation, onCreateEventSpyReady } = options;

    const start = adapter.date('2025-07-03T09:00:00Z', 'default');
    const end = adapter.date('2025-07-03T09:30:00Z', 'default');

    const store = new EventTimelinePremiumStore(
      { events: [], resources, eventCreation, onEventsChange: () => {} },
      adapter,
    );
    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: 'timeline',
      start,
      end,
      lockSurfaceType: true,
      resourceId: rowResource.id,
    });

    const creationOccurrence = EventBuilder.new(adapter)
      .id('placeholder-id')
      .span(start.toISOString(), end.toISOString())
      .title('')
      .resource(rowResource)
      .toOccurrence();

    const utils = render(
      <SchedulerStoreContext.Provider value={store as any}>
        <StoreSpy
          Context={SchedulerStoreContext}
          method="createEvent"
          onSpyReady={onCreateEventSpyReady}
        />
        <TestEventDialogContent
          open
          anchor={anchor}
          container={document.body}
          occurrence={creationOccurrence}
          onClose={() => {}}
        />
      </SchedulerStoreContext.Provider>,
    );

    // EventDialogContent renders a desktop Dialog and a mobile Drawer variant at the same
    // time (CSS media queries pick the visible one) — jsdom has no viewport, so both expose
    // `role="dialog"`. Every other test in this suite scopes to the last one; do the same.
    const dialogs = screen.getAllByRole('dialog');
    const currentDialog = within(dialogs[dialogs.length - 1]);

    return { ...utils, currentDialog };
  }

  it("should seed the picker as multi-select with the row's resource when `canHaveMultipleResources` is true, and let a second resource be added", async () => {
    let createEventSpy: Mock | undefined;
    const { user, currentDialog } = renderCreationDialog({
      rowResource: engineering,
      eventCreation: { canHaveMultipleResources: true },
      onCreateEventSpyReady: (sp) => {
        createEventSpy = sp;
      },
    });

    await user.type(currentDialog.getByLabelText(/event title/i), 'New event');

    const combobox = currentDialog.getByRole('combobox', { name: /resource/i });
    expect(combobox.textContent).to.match(/engineering/i);

    await user.click(combobox);
    await user.click(await screen.findByRole('option', { name: /design/i }));
    await user.keyboard('{Escape}');
    await user.click(currentDialog.getByRole('button', { name: /save/i }));

    expect(createEventSpy?.mock.calls.length).to.equal(1);
    expect(createEventSpy?.mock.calls[0][0].resource).to.deep.equal([engineering.id, design.id]);
  });

  it("should seed the picker as single-select with the row's resource when `canHaveMultipleResources` is false, and picking another resource replaces it", async () => {
    let createEventSpy: Mock | undefined;
    const { user, currentDialog } = renderCreationDialog({
      rowResource: engineering,
      eventCreation: { canHaveMultipleResources: false },
      onCreateEventSpyReady: (sp) => {
        createEventSpy = sp;
      },
    });

    await user.type(currentDialog.getByLabelText(/event title/i), 'New event');

    const combobox = currentDialog.getByRole('combobox', { name: /resource/i });
    expect(combobox.textContent).to.match(/engineering/i);

    await user.click(combobox);
    await user.click(await screen.findByRole('option', { name: /design/i }));
    await user.click(currentDialog.getByRole('button', { name: /save/i }));

    expect(createEventSpy?.mock.calls.length).to.equal(1);
    expect(createEventSpy?.mock.calls[0][0].resource).to.equal(design.id);
  });
});
