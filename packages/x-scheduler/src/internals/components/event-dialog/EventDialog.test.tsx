import * as React from 'react';
import { spy } from 'sinon';
import {
  createSchedulerRenderer,
  EventBuilder,
  ResourceBuilder,
  SchedulerStoreRunner,
  AnyEventCalendarStore,
  StateWatcher,
  adapter,
} from 'test/utils/scheduler';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { SchedulerResource } from '@mui/x-scheduler-internals/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventDialogContent, EventDialogProvider, EventDialogTrigger } from './EventDialog';
import { EventCalendarProvider } from '../EventCalendarProvider';

const personalResource = ResourceBuilder.new().title('Personal').eventColor('teal').build();

const DEFAULT_EVENT: SchedulerEvent = EventBuilder.new()
  .title('Running')
  .description('Morning run')
  .singleDay('2025-05-26T07:30:00Z', 45)
  .resource(personalResource)
  .build();

const resources: SchedulerResource[] = [personalResource];

describe('<EventDialogContent /> — community (no recurring-events plugin)', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const defaultProps = {
    anchor,
    container: document.body,
    anchorRef: { current: anchor },
    occurrence: EventBuilder.new()
      .id(DEFAULT_EVENT.id)
      .title(DEFAULT_EVENT.title)
      .span(DEFAULT_EVENT.start, DEFAULT_EVENT.end)
      .resource(personalResource)
      .toOccurrence(),
    onClose: () => {},
  };

  const { render } = createSchedulerRenderer();

  it('should not render the recurrence tab when no slot is provided', () => {
    render(
      <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
        <EventDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );

    expect(screen.queryByRole('tab', { name: /recurrence/i })).to.equal(null);
    expect(screen.queryByRole('tab', { name: /general/i })).to.equal(null);
  });

  it('should not render the recurrence label on a readonly event with rrule', () => {
    const readonlyRecurringEvent: SchedulerEvent = EventBuilder.new()
      .title('Weekly standup')
      .singleDay('2025-05-26T07:30:00Z', 45)
      .resource(personalResource)
      .recurrent('DAILY')
      .readOnly()
      .build();

    expect(() => {
      render(
        <EventCalendarProvider events={[readonlyRecurringEvent]} resources={resources}>
          <EventDialogContent
            open
            {...defaultProps}
            occurrence={EventBuilder.new()
              .id(readonlyRecurringEvent.id)
              .title(readonlyRecurringEvent.title)
              .span(readonlyRecurringEvent.start, readonlyRecurringEvent.end)
              .resource(personalResource)
              .toOccurrence()}
          />
        </EventCalendarProvider>,
      );
    }).toWarnDev([
      'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
    ]);

    expect(screen.queryByText(/repeats/i)).to.equal(null);
  });

  it('should warn and strip the rrule when createEvent is called with one', () => {
    expect(() => {
      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => {
              store.createEvent({
                title: 'New recurring',
                start: '2025-05-26T07:30:00Z',
                end: '2025-05-26T08:30:00Z',
                rrule: 'FREQ=DAILY',
              });
            }}
          />
        </EventCalendarProvider>,
      );
    }).toWarnDev([
      'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
    ]);
  });

  it('should warn and strip the rrule when updateEvent is called with one', () => {
    expect(() => {
      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => {
              store.updateEvent({ id: DEFAULT_EVENT.id, rrule: 'FREQ=DAILY' });
            }}
          />
        </EventCalendarProvider>,
      );
    }).toWarnDev([
      'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
    ]);
  });

  it('should warn when updateRecurringEvent is called without a plugin', () => {
    expect(() => {
      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => {
              store.updateRecurringEvent({
                occurrenceStart: new Date('2025-05-26T07:30:00Z'),
                changes: { id: DEFAULT_EVENT.id, start: new Date(), end: new Date() },
              });
            }}
          />
        </EventCalendarProvider>,
      );
    }).toWarnDev(['MUI X Scheduler: Recurring event updates are a premium feature.']);
  });

  describe('Outside-click dismissal', () => {
    it('should close the dialog when clicking outside the dialog paper', async () => {
      const onClose = spy();
      const { user } = render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <EventDialogContent open {...defaultProps} onClose={onClose} />
        </EventCalendarProvider>,
      );

      // MUI ClickAwayListener uses setTimeout(0) to activate after mount; using
      // user.click (async) yields the event loop so that macrotask can fire first.
      await user.click(document.body);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not close the dialog when clicking inside the dialog paper', () => {
      const onClose = spy();
      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <EventDialogContent open {...defaultProps} onClose={onClose} />
        </EventCalendarProvider>,
      );

      // Click on the dialog paper element itself (has role="dialog" on the MUI Paper)
      fireEvent.click(screen.getByRole('dialog'));
      expect(onClose.callCount).to.equal(0);
    });

    it('should not close the dialog when clicking an element with data-event-dialog-trigger', () => {
      const onClose = spy();
      render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <EventDialogContent open {...defaultProps} onClose={onClose} />
          <button type="button" data-event-dialog-trigger="true">
            Event B
          </button>
        </EventCalendarProvider>,
      );

      fireEvent.click(screen.getByText('Event B'));
      expect(onClose.callCount).to.equal(0);
    });

    it('should clear occurrencePlaceholder set by a cell click that also dismissed the dialog', async () => {
      const start = adapter.date('2025-05-26T09:00:00Z', 'default');
      const end = adapter.date('2025-05-26T09:30:00Z', 'default');
      let storeRef: AnyEventCalendarStore | undefined;

      const { user } = render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext}
            onMount={(store) => {
              storeRef = store;
            }}
          />
          <EventDialogProvider>
            <EventDialogTrigger occurrence={defaultProps.occurrence}>
              <button type="button">Open Event</button>
            </EventDialogTrigger>
            {/* Simulates an empty-cell click: sets a creation placeholder then bubbles to document */}
            <button
              type="button"
              onClick={() => {
                storeRef!.setOccurrencePlaceholder({
                  type: 'creation',
                  surfaceType: 'time-grid',
                  start,
                  end,
                  lockSurfaceType: false,
                  resourceId: null,
                });
              }}
            >
              Empty cell
            </button>
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      // Find the button before the dialog opens (MUI Dialog marks background elements as
      // aria-hidden while open, so we must grab the reference first).
      const emptyCellBtn = screen.getByRole('button', { name: /empty cell/i });

      await user.click(screen.getByRole('button', { name: /open event/i }));

      // ClickAwayListener uses 'onClick': clicking an empty cell fires the button's onClick
      // (sets the placeholder), then bubbles to the document where ClickAwayListener clears it.
      fireEvent.click(emptyCellBtn);

      expect(storeRef!.state.occurrencePlaceholder).to.equal(null);
    });
  });

  describe('openEventId store sync', () => {
    it('should set openEventId on the store when the dialog opens via EventDialogProvider', async () => {
      const openEventIdChanges: (string | null)[] = [];
      const { user } = render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <StateWatcher
            Context={SchedulerStoreContext}
            selector={(s) => s.openEventId}
            onValueChange={(v) => openEventIdChanges.push(v)}
          />
          <EventDialogProvider>
            <EventDialogTrigger occurrence={defaultProps.occurrence}>
              <button type="button">Open Event</button>
            </EventDialogTrigger>
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      await user.click(screen.getByRole('button', { name: /open event/i }));
      expect(openEventIdChanges.at(-1)).to.equal(DEFAULT_EVENT.id);
    });

    it('should clear openEventId on the store when the dialog closes via outside click', async () => {
      const openEventIdChanges: (string | null)[] = [];
      const { user } = render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <StateWatcher
            Context={SchedulerStoreContext}
            selector={(s) => s.openEventId}
            onValueChange={(v) => openEventIdChanges.push(v)}
          />
          <EventDialogProvider>
            <EventDialogTrigger occurrence={defaultProps.occurrence}>
              <button type="button">Open Event</button>
            </EventDialogTrigger>
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      // Open the dialog
      await user.click(screen.getByRole('button', { name: /open event/i }));
      expect(openEventIdChanges.at(-1)).to.equal(DEFAULT_EVENT.id);

      // Mousedown outside closes the dialog (ClickAwayListener uses 'onMouseDown').
      fireEvent.mouseDown(document.body);
      expect(openEventIdChanges.at(-1)).to.equal(null);
    });
  });

  describe('Event-to-event switching', () => {
    const SECOND_EVENT: SchedulerEvent = EventBuilder.new()
      .title('Second Event')
      .singleDay('2025-05-26T10:00:00Z', 60)
      .build();

    it('should switch the dialog to the clicked event without requiring two clicks', async () => {
      const editedEventIdChanges: (string | null)[] = [];

      const firstOccurrence = EventBuilder.new()
        .id(DEFAULT_EVENT.id)
        .span(DEFAULT_EVENT.start, DEFAULT_EVENT.end)
        .toOccurrence();

      const secondOccurrence = EventBuilder.new()
        .id(SECOND_EVENT.id)
        .span(SECOND_EVENT.start, SECOND_EVENT.end)
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider events={[DEFAULT_EVENT, SECOND_EVENT]} resources={resources}>
          <StateWatcher
            Context={SchedulerStoreContext}
            selector={(s) => s.editedEventId}
            onValueChange={(v) => editedEventIdChanges.push(v)}
          />
          <EventDialogProvider>
            <EventDialogTrigger occurrence={firstOccurrence}>
              <button type="button">Event A</button>
            </EventDialogTrigger>
            <EventDialogTrigger occurrence={secondOccurrence}>
              <button type="button">Event B</button>
            </EventDialogTrigger>
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      // Capture both button references before the dialog opens — after open, the
      // MUI Dialog Modal sets aria-hidden on the rest of the DOM, hiding them from
      // standard accessibility queries.
      const eventAButton = screen.getByRole('button', { name: 'Event A' });
      const eventBButton = screen.getByRole('button', { name: 'Event B' });

      // Click Event A to open its dialog
      await user.click(eventAButton);
      expect(editedEventIdChanges.at(-1)).to.equal(DEFAULT_EVENT.id);

      // Click Event B — should switch the dialog to Event B in a single click
      fireEvent.click(eventBButton);
      expect(editedEventIdChanges.at(-1)).to.equal(SECOND_EVENT.id);
    });
  });

  describe('Event dialog toggle', () => {
    it('should close the dialog when clicking the same event trigger again', async () => {
      const editedEventIdChanges: (string | null)[] = [];

      const occurrence = EventBuilder.new()
        .id(DEFAULT_EVENT.id)
        .span(DEFAULT_EVENT.start, DEFAULT_EVENT.end)
        .toOccurrence();

      const { user } = render(
        <EventCalendarProvider events={[DEFAULT_EVENT]} resources={resources}>
          <StateWatcher
            Context={SchedulerStoreContext}
            selector={(s) => s.editedEventId}
            onValueChange={(v) => editedEventIdChanges.push(v)}
          />
          <EventDialogProvider>
            <EventDialogTrigger occurrence={occurrence}>
              <button type="button">Toggle Event</button>
            </EventDialogTrigger>
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      // Capture button ref before dialog opens (MUI Dialog sets aria-hidden on rest of DOM)
      const triggerButton = screen.getByRole('button', { name: 'Toggle Event' });

      // Open the dialog
      await user.click(triggerButton);
      expect(editedEventIdChanges.at(-1)).to.equal(DEFAULT_EVENT.id);

      // Click the same trigger — should close (toggle off)
      fireEvent.click(triggerButton);
      expect(editedEventIdChanges.at(-1)).to.equal(null);
    });
  });
});
