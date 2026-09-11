import {
  adapter,
  adapterFr,
  EventBuilder,
  ResourceBuilder,
  storeClasses,
} from 'test/utils/scheduler';
import type {
  SchedulerEvent,
  SchedulerEventId,
  SchedulerEventModelStructure,
} from '@mui/x-scheduler-internals/models';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { vi, describe, it, expect } from 'vitest';
import { schedulerEventSelectors } from '../../../../scheduler-selectors';

const TEST_RESOURCES = [ResourceBuilder.new().build()];

storeClasses.forEach((storeClass) => {
  describe(`Event - ${storeClass.name}`, () => {
    describe('prop: eventModelStructure', () => {
      interface MyEvent {
        myId: string;
        myTitle: string;
        myStart: string;
        myEnd: string;
        allDay?: boolean;
        priority?: string;
      }

      const eventModelStructure: SchedulerEventModelStructure<MyEvent> = {
        id: {
          getter: (event) => event.myId,
          setter: (event, value) => {
            event.myId = value.toString();
            return event;
          },
        },
        title: {
          getter: (event) => event.myTitle,
          setter: (event, value) => {
            event.myTitle = value;
            return event;
          },
        },
        start: {
          getter: (event) => event.myStart,
          setter: (event, value) => {
            event.myStart = value;
            return event;
          },
        },
        end: {
          getter: (event) => event.myEnd,
          setter: (event, value) => {
            event.myEnd = value;
            return event;
          },
        },
      };

      it('should use the provided event model structure to read event properties', () => {
        const events: MyEvent[] = [
          {
            myId: '1',
            myTitle: 'Event 1',
            myStart: '2025-07-01T09:00:00.000Z',
            myEnd: '2025-07-01T10:00:00.000Z',
            allDay: false,
          },
        ];

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events, eventModelStructure },
          adapter,
        );
        const event = schedulerEventSelectors.processedEvent(store.state, '1');

        expect(event).to.deep.contain({
          id: '1',
          title: 'Event 1',
          displayTimezone: {
            start: processDate(adapter.date('2025-07-01T09:00:00.000Z', 'default'), adapter),
            end: processDate(adapter.date('2025-07-01T10:00:00.000Z', 'default'), adapter),
            timezone: 'default',
            rrule: undefined,
            exDates: undefined,
          },
          allDay: false,
        });
      });

      it('should use the provided event model structure to write event properties', () => {
        const onEventsChange = vi.fn();

        const events: MyEvent[] = [
          {
            myId: '1',
            myTitle: 'Event 1',
            myStart: '2025-07-01T09:00:00.000Z',
            myEnd: '2025-07-01T10:00:00.000Z',
            allDay: false,
          },
        ];

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events, eventModelStructure, onEventsChange },
          adapter,
        );
        store.updateEvent({
          id: '1',
          title: 'Event 1 updated',
          start: adapter.date('2025-07-01T09:30:00.000Z', 'default'),
          end: adapter.date('2025-07-01T10:30:00.000Z', 'default'),
          allDay: true,
        });

        // Should call onEventsChange with the updated event using the custom model structure
        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
          {
            myId: '1',
            myTitle: 'Event 1 updated',
            myStart: '2025-07-01T09:30:00.000Z',
            myEnd: '2025-07-01T10:30:00.000Z',
            allDay: true,
          },
        ]);
      });

      it('should use the provided event model structure to create an event', () => {
        const onEventsChange = vi.fn();

        const events: MyEvent[] = [];

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events, eventModelStructure, onEventsChange },
          adapter,
        );
        const createdId = store.createEvent({
          title: 'Event 1',
          start: adapter.date('2025-07-01T09:00:00.000Z', 'default'),
          end: adapter.date('2025-07-01T10:00:00.000Z', 'default'),
          allDay: false,
        });

        // Should call onEventsChange with the created event using the custom model structure
        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
          {
            myId: createdId,
            myTitle: 'Event 1',
            myStart: '2025-07-01T09:00:00.000Z',
            myEnd: '2025-07-01T10:00:00.000Z',
            allDay: false,
          },
        ]);
      });

      it('should carry custom fields without resurrecting stale mapped keys on a duplicate', () => {
        const onEventsChange = vi.fn();
        const events: MyEvent[] = [
          {
            myId: '1',
            myTitle: 'Event 1',
            myStart: '2025-07-01T09:00:00.000Z',
            myEnd: '2025-07-01T10:00:00.000Z',
            allDay: false,
            priority: 'high',
          },
        ];

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events, eventModelStructure, onEventsChange },
          adapter,
        );

        const start = adapter.date('2025-07-01T11:00:00.000Z', 'default');
        const end = adapter.date('2025-07-01T12:00:00.000Z', 'default');
        const duplicatedId = store.duplicateEventOccurrence('1', start, end);

        const duplicated = onEventsChange.mock.lastCall?.[0].find(
          (event) => event.myId === duplicatedId,
        );
        // The mapped start comes from the setter, not the stale key carried by the custom-data merge.
        expect(duplicated.myStart).to.equal('2025-07-01T11:00:00.000Z');
        expect(duplicated.priority).to.equal('high');
      });

      describe('dates declared without a setter', () => {
        // `start` is readable but not writable, so it can never be moved: there is nowhere to
        // write it, and the built-in key would land next to `myStart`. `end` keeps its setter, so
        // a mixed structure like this still lets a resize of the end handle through.
        const readOnlyStartStructure: SchedulerEventModelStructure<MyEvent> = {
          ...eventModelStructure,
          start: { getter: (event) => event.myStart },
        };

        const UNCHANGED_EVENT: MyEvent = {
          myId: '1',
          myTitle: 'Event 1',
          myStart: '2025-07-01T09:00:00.000Z',
          myEnd: '2025-07-01T10:00:00.000Z',
          allDay: false,
        };

        const START_WARNING =
          'MUI X Scheduler: The `start` date of the event with id="1" was not updated.';
        const PASTE_WARNING = 'MUI X Scheduler: The event with id="1" was not pasted.';

        const createStore = (onEventsChange: (...args: any[]) => void) =>
          new storeClass.Value(
            {
              resources: TEST_RESOURCES,
              events: [{ ...UNCHANGED_EVENT }],
              eventModelStructure: readOnlyStartStructure,
              onEventsChange,
            },
            adapter,
          );

        it('should drop only the date without a setter and keep the rest of the update', () => {
          const onEventsChange = vi.fn();
          const store = createStore(onEventsChange);

          expect(() => {
            store.updateEvent({
              id: '1',
              title: 'Event 1 updated',
              start: adapter.date('2025-07-02T09:00:00.000Z', 'default'),
              end: adapter.date('2025-07-02T10:00:00.000Z', 'default'),
            });
          }).toWarnDev([START_WARNING]);

          expect(onEventsChange.mock.calls.length).to.equal(1);
          expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
            {
              ...UNCHANGED_EVENT,
              myTitle: 'Event 1 updated',
              // `start` is dropped (kept at its old value); `end` has a setter and applies.
              myEnd: '2025-07-02T10:00:00.000Z',
            },
          ]);
        });

        // Mirrors a resize of the end handle alone: `start` is absent from the change entirely,
        // so there is nothing to drop and nothing to warn about.
        it('should not warn when the update only touches the writable date', () => {
          const onEventsChange = vi.fn();
          const store = createStore(onEventsChange);

          expect(() => {
            store.updateEvent({
              id: '1',
              end: adapter.date('2025-07-01T11:00:00.000Z', 'default'),
            });
          }).not.toWarnDev();

          expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
            { ...UNCHANGED_EVENT, myEnd: '2025-07-01T11:00:00.000Z' },
          ]);
        });

        // The event dialog resubmits the locked dates unchanged on every save.
        it('should not warn when updateEvent resubmits the current dates', () => {
          const onEventsChange = vi.fn();
          const store = createStore(onEventsChange);

          expect(() => {
            store.updateEvent({
              id: '1',
              title: 'Event 1 updated',
              start: adapter.date('2025-07-01T09:00:00.000Z', 'default'),
              end: adapter.date('2025-07-01T10:00:00.000Z', 'default'),
            });
          }).not.toWarnDev();

          expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
            { ...UNCHANGED_EVENT, myTitle: 'Event 1 updated' },
          ]);
        });

        // The dates are compared as instants: 11:00 in Paris is the stored 09:00Z, not a move.
        it('should not warn when the resubmitted dates use another timezone', () => {
          const store = createStore(vi.fn());

          expect(() => {
            store.updateEvent({
              id: '1',
              title: 'Event 1 updated',
              start: adapter.date('2025-07-01T11:00:00.000Z', 'Europe/Paris'),
              end: adapter.date('2025-07-01T12:00:00.000Z', 'Europe/Paris'),
            });
          }).not.toWarnDev();
        });

        it('should refuse to paste a cut event onto a new date and keep it in the clipboard', () => {
          const onEventsChange = vi.fn();
          const store = createStore(onEventsChange);
          store.cutEvent('1');

          expect(() => {
            expect(
              store.pasteEvent({ start: adapter.date('2025-07-02T09:00:00.000Z', 'default') }),
            ).to.equal(null);
          }).toWarnDev([PASTE_WARNING]);

          expect(onEventsChange.mock.calls.length).to.equal(0);
          expect(store.state.copiedEvent).to.deep.equal({ id: '1', action: 'cut' });
        });

        it('should still paste a cut event when the paste moves no date', () => {
          const onEventsChange = vi.fn();
          const store = createStore(onEventsChange);
          store.cutEvent('1');

          expect(() => {
            store.pasteEvent({ allDay: true });
          }).not.toWarnDev();

          expect(onEventsChange.mock.calls.length).to.equal(1);
          expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
            { ...UNCHANGED_EVENT, allDay: true },
          ]);
        });

        // A copy writes the whole model into a new event, dates included, so it is always refused.
        it('should refuse to paste a copied event onto a new date', () => {
          const onEventsChange = vi.fn();
          const store = createStore(onEventsChange);
          store.copyEvent('1');

          expect(() => {
            expect(
              store.pasteEvent({ start: adapter.date('2025-07-02T09:00:00.000Z', 'default') }),
            ).to.equal(null);
          }).toWarnDev([PASTE_WARNING]);

          expect(onEventsChange.mock.calls.length).to.equal(0);
        });

        it('should refuse to paste a copied event even when the paste moves no date', () => {
          const onEventsChange = vi.fn();
          const store = createStore(onEventsChange);
          store.copyEvent('1');

          expect(() => {
            expect(store.pasteEvent({ allDay: true })).to.equal(null);
          }).toWarnDev([PASTE_WARNING]);

          expect(onEventsChange.mock.calls.length).to.equal(0);
        });
      });

      describe('refused creation', () => {
        it('should refuse to create an event when a date has no setter and warn', () => {
          const onEventsChange = vi.fn();
          const store = new storeClass.Value(
            {
              resources: TEST_RESOURCES,
              events: [],
              eventModelStructure: {
                ...eventModelStructure,
                start: { getter: (event) => event.myStart },
              },
              onEventsChange,
            },
            adapter,
          );

          let createdId: SchedulerEventId | undefined;
          expect(() => {
            createdId = store.createEvent({
              title: 'New event',
              start: adapter.date('2025-07-01T09:00:00.000Z', 'default'),
              end: adapter.date('2025-07-01T10:00:00.000Z', 'default'),
            });
          }).toWarnDev(['MUI X Scheduler: The event "New event" was not created.']);

          expect(createdId).to.equal(undefined);
          expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([]);
        });
      });

      it('should only re-compute event models affected by updated processing parameters', () => {
        interface MyEvent2 {
          myId: string;
          title: string;
          start: string;
          end: string;
        }

        const idGetter = vi.fn((event: MyEvent2) => event.myId);

        const eventModelStructure2: SchedulerEventModelStructure<MyEvent2> = {
          id: {
            getter: idGetter,
            setter: (event, value) => {
              event.myId = value.toString();
              return event;
            },
          },
        };

        const events: MyEvent2[] = [
          {
            myId: '1',
            title: 'Event 1',
            start: '2025-07-01T09:00:00.000Z',
            end: '2025-07-01T10:00:00.000Z',
          },
        ];

        const store = new storeClass.Value(
          {
            resources: TEST_RESOURCES,
            events,
            eventModelStructure: eventModelStructure2,
            showCurrentTimeIndicator: false,
          },
          adapter,
        );

        // Called to convert Event 1 on mount.
        expect(idGetter.mock.calls.length).to.equal(1);
        const processedEvent1 = schedulerEventSelectors.processedEvent(store.state, '1');
        const initialEventIdList = store.state.eventIdList;
        const initialEventModelLookup = store.state.eventModelLookup;
        const initialProcessedEventLookup = store.state.processedEventLookup;

        store.updateStateFromParameters(
          {
            resources: TEST_RESOURCES,
            events,
            eventModelStructure: eventModelStructure2,
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        // Not called again when updating a non-related parameter.
        expect(idGetter.mock.calls.length).to.equal(1);

        store.updateStateFromParameters(
          {
            resources: TEST_RESOURCES,
            events: [...events],
            eventModelStructure: eventModelStructure2,
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        expect(idGetter.mock.calls.length).to.equal(1);
        expect(store.state.eventIdList).to.equal(initialEventIdList);
        expect(store.state.eventModelLookup).to.equal(initialEventModelLookup);
        expect(store.state.processedEventLookup).to.equal(initialProcessedEventLookup);

        const events2: MyEvent2[] = [
          events[0],
          {
            myId: '2',
            title: 'Event 2',
            start: '2025-07-01T10:00:00.000Z',
            end: '2025-07-01T11:00:00.000Z',
          },
        ];

        store.updateStateFromParameters(
          {
            resources: TEST_RESOURCES,
            events: events2,
            eventModelStructure: eventModelStructure2,
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        // Only the new model is processed.
        expect(idGetter.mock.calls.length).to.equal(2);
        expect(schedulerEventSelectors.processedEvent(store.state, '1')).to.equal(processedEvent1);
        const processedEvent2 = schedulerEventSelectors.processedEvent(store.state, '2');

        const events3 = [events2[0], { ...events2[1], title: 'Event 2 updated' }];
        store.updateStateFromParameters(
          {
            resources: TEST_RESOURCES,
            events: events3,
            eventModelStructure: eventModelStructure2,
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        expect(idGetter.mock.calls.length).to.equal(3);
        expect(schedulerEventSelectors.processedEvent(store.state, '1')).to.equal(processedEvent1);
        expect(schedulerEventSelectors.processedEvent(store.state, '2')).not.to.equal(
          processedEvent2,
        );

        const event2BeforeTimezoneChange = schedulerEventSelectors.processedEvent(store.state, '2');
        store.updateStateFromParameters(
          {
            resources: TEST_RESOURCES,
            events: events3,
            eventModelStructure: eventModelStructure2,
            displayTimezone: 'Europe/Paris',
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        // The display timezone affects every processed event.
        expect(idGetter.mock.calls.length).to.equal(5);
        expect(schedulerEventSelectors.processedEvent(store.state, '1')).not.to.equal(
          processedEvent1,
        );
        expect(schedulerEventSelectors.processedEvent(store.state, '2')).not.to.equal(
          event2BeforeTimezoneChange,
        );

        const event2BeforeAdapterChange = schedulerEventSelectors.processedEvent(store.state, '2');
        store.updateStateFromParameters(
          {
            resources: TEST_RESOURCES,
            events: events3,
            eventModelStructure: eventModelStructure2,
            displayTimezone: 'Europe/Paris',
            showCurrentTimeIndicator: true,
          },
          adapterFr,
        );

        expect(idGetter.mock.calls.length).to.equal(7);
        expect(schedulerEventSelectors.processedEvent(store.state, '2')).not.to.equal(
          event2BeforeAdapterChange,
        );

        const updatedEventModelStructure = { ...eventModelStructure2 };
        store.updateStateFromParameters(
          {
            resources: TEST_RESOURCES,
            events: events3,
            eventModelStructure: updatedEventModelStructure,
            displayTimezone: 'Europe/Paris',
            showCurrentTimeIndicator: true,
          },
          adapterFr,
        );

        // Called again to convert Event 1 and Event 2 because props.eventModelStructure changed.
        expect(idGetter.mock.calls.length).to.equal(9);

        const processedEventsBeforeReorder = store.state.processedEventLookup;
        store.updateStateFromParameters(
          {
            resources: TEST_RESOURCES,
            events: [events3[1], events3[0]],
            eventModelStructure: updatedEventModelStructure,
            displayTimezone: 'Europe/Paris',
            showCurrentTimeIndicator: true,
          },
          adapterFr,
        );

        expect(idGetter.mock.calls.length).to.equal(9);
        expect(store.state.eventIdList).to.deep.equal(['2', '1']);
        expect(store.state.processedEventLookup.get('1')).to.equal(
          processedEventsBeforeReorder.get('1'),
        );
        expect(store.state.processedEventLookup.get('2')).to.equal(
          processedEventsBeforeReorder.get('2'),
        );
      });
    });

    // A normal (fully writable) structure throughout, so every case here isolates the `readOnly`
    // business rule from the `eventModelStructure` one covered above.
    describe('read-only event', () => {
      const READ_ONLY_EVENT = EventBuilder.new()
        .id('1')
        .title('Event 1')
        .span('2025-07-01T09:00:00.000Z', '2025-07-01T10:00:00.000Z')
        .readOnly()
        .build();

      const createStore = (onEventsChange: (...args: any[]) => void, extra?: object) =>
        new storeClass.Value(
          {
            resources: TEST_RESOURCES,
            events: [READ_ONLY_EVENT],
            onEventsChange,
            ...extra,
          },
          adapter,
        );

      // `readOnly` has always been a UI-only gate (it disables the drag/resize gestures and the
      // dialog's fields) — `updateEvent()` itself doesn't enforce it, matching every other
      // property. Only a date `eventModelStructure` can't write back is refused by the store.
      it('should still apply a direct updateEvent call on a read-only event', () => {
        const onEventsChange = vi.fn();
        const store = createStore(onEventsChange);

        store.updateEvent({
          id: '1',
          start: adapter.date('2025-07-02T09:00:00.000Z', 'default'),
          end: adapter.date('2025-07-02T10:00:00.000Z', 'default'),
        });

        const updated = onEventsChange.mock.lastCall?.[0][0];
        expect(updated.start).to.equal('2025-07-02T09:00:00.000Z');
        expect(updated.end).to.equal('2025-07-02T10:00:00.000Z');
      });

      it('should refuse to paste a cut of the event onto a new date', () => {
        const onEventsChange = vi.fn();
        const store = createStore(onEventsChange);
        store.cutEvent('1');

        expect(() => {
          expect(
            store.pasteEvent({ start: adapter.date('2025-07-02T09:00:00.000Z', 'default') }),
          ).to.equal(null);
        }).toWarnDev(['MUI X Scheduler: The event with id="1" was not pasted.']);

        expect(onEventsChange.mock.calls.length).to.equal(0);
      });

      it('should still paste a cut of the event when the paste moves no date', () => {
        const onEventsChange = vi.fn();
        const store = createStore(onEventsChange);
        store.cutEvent('1');

        expect(() => {
          store.pasteEvent({ allDay: true });
        }).not.toWarnDev();

        expect(onEventsChange.mock.lastCall?.[0][0].allDay).to.equal(true);
      });

      // A copy never touches the source event, so its own `readOnly` flag doesn't gate it — this
      // is the fix: master created the copy, and it must keep doing so.
      it('should still paste a copy of a read-only event', () => {
        const onEventsChange = vi.fn();
        const store = createStore(onEventsChange);
        store.copyEvent('1');

        expect(() => {
          store.pasteEvent({ start: adapter.date('2025-07-02T09:00:00.000Z', 'default') });
        }).not.toWarnDev();

        expect(onEventsChange.mock.calls.length).to.equal(1);
        const pasted = onEventsChange.mock.lastCall?.[0].find((event: any) => event.id !== '1');
        expect(pasted.start).to.equal('2025-07-02T09:00:00.000Z');
      });

      it('should refuse to paste a copy when the scheduler itself is read-only', () => {
        const onEventsChange = vi.fn();
        const store = createStore(onEventsChange, { readOnly: true });
        store.copyEvent('1');

        expect(() => {
          expect(store.pasteEvent({ allDay: true })).to.equal(null);
        }).toWarnDev(['MUI X Scheduler: The event with id="1" was not pasted.']);

        expect(onEventsChange.mock.calls.length).to.equal(0);
      });

      it('should refuse to paste a copy when the destination resource is read-only', () => {
        const readOnlyResource = ResourceBuilder.new().areEventsReadOnly().build();
        const onEventsChange = vi.fn();
        const store = createStore(onEventsChange, { resources: [readOnlyResource] });
        store.copyEvent('1');

        expect(() => {
          expect(store.pasteEvent({ resource: readOnlyResource.id })).to.equal(null);
        }).toWarnDev(['MUI X Scheduler: The event with id="1" was not pasted.']);

        expect(onEventsChange.mock.calls.length).to.equal(0);
      });
    });

    describe('Event id validation', () => {
      it('should throw when an event has no id', () => {
        const validEvent = EventBuilder.new().id('1').build();
        const eventWithoutId = {
          ...EventBuilder.new().build(),
          id: undefined,
        } as unknown as SchedulerEvent;

        expect(() => {
          // eslint-disable-next-line no-new
          new storeClass.Value(
            { resources: TEST_RESOURCES, events: [validEvent, eventWithoutId] },
            adapter,
          );
        }).to.throw(/All events must have a unique `id`/);
      });

      it('should keep the last event and warn in dev when two events share the same id', () => {
        const first = EventBuilder.new().id('1').title('First').build();
        const second = EventBuilder.new().id('1').title('Second').build();

        const createStore = () =>
          new storeClass.Value({ resources: TEST_RESOURCES, events: [first, second] }, adapter);

        let store!: ReturnType<typeof createStore>;
        expect(() => {
          store = createStore();
        }).toWarnDev(['MUI X Scheduler: Two or more events share the same id "1".']);

        expect(schedulerEventSelectors.idList(store.state)).to.deep.equal([second.id]);
        expect(schedulerEventSelectors.processedEvent(store.state, second.id)!.title).to.equal(
          second.title,
        );

        const initialEventIdList = store.state.eventIdList;
        const initialEventModelLookup = store.state.eventModelLookup;
        const initialProcessedEventLookup = store.state.processedEventLookup;

        store.updateStateFromParameters(
          { resources: TEST_RESOURCES, events: [first, second] },
          adapter,
        );

        expect(store.state.eventIdList).to.equal(initialEventIdList);
        expect(store.state.eventModelLookup).to.equal(initialEventModelLookup);
        expect(store.state.processedEventLookup).to.equal(initialProcessedEventLookup);
      });
    });

    describe('Method: updateEvent', () => {
      it('should replace matching id and emit onEventsChange with the updated events', () => {
        const onEventsChange = vi.fn();
        const event1 = EventBuilder.new().build();
        const event2 = EventBuilder.new().build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event1, event2], onEventsChange },
          adapter,
        );

        store.updateEvent({
          id: event2.id,
          title: 'Event 2 updated',
          description: 'Event 2 description',
          allDay: false,
          start: adapter.date('2025-07-01T11:30:00Z', 'default'),
          end: adapter.date('2025-07-01T12:30:00Z', 'default'),
        });

        expect(onEventsChange.mock.calls.length).to.equal(1);
        const updatedEvents = onEventsChange.mock.lastCall?.[0];

        expect(updatedEvents).to.have.length(2);
        expect(updatedEvents[0].title).to.equal(event1.title);
        expect(updatedEvents[1].title).to.equal('Event 2 updated');
        expect(updatedEvents[1].description).to.equal('Event 2 description');
        expect(updatedEvents[1].start).to.equal('2025-07-01T11:30:00.000Z');
        expect(updatedEvents[1].end).to.equal('2025-07-01T12:30:00.000Z');
      });

      it('should update start/end as instants, preserve unrelated properties, and keep event.timezone', () => {
        const onEventsChange = vi.fn();

        const dataTimezone = 'America/New_York';
        const displayTimezone = 'Europe/Paris';

        const event = EventBuilder.new()
          .title('Original title')
          .description('Original description')
          .span('2025-03-10T09:00:00Z', '2025-03-10T10:00:00Z')
          .withDataTimezone(dataTimezone)
          .build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange, displayTimezone },
          adapter,
        );

        // New instants (what the UI would provide as absolute values)
        const newStart = adapter.date('2025-03-10T14:00:00Z', 'default');
        const newEnd = adapter.date('2025-03-10T15:00:00Z', 'default');

        store.updateEvent({
          id: event.id,
          title: 'Updated title',
          start: newStart,
          end: newEnd,
        });

        const updated = onEventsChange.mock.lastCall?.[0][0];

        expect(updated.title).to.equal('Updated title');
        expect(updated.description).to.equal(event.description);

        // Keep the event conceptual timezone
        expect(updated.timezone).to.equal(dataTimezone);
        // Persist the new instants as strings
        expect(updated.start).to.equal(newStart.toISOString());
        expect(updated.end).to.equal(newEnd.toISOString());
      });

      it('should preserve unknown custom properties on the event model', () => {
        const onEventsChange = vi.fn();
        const event = {
          ...EventBuilder.new().title('Original title').build(),
          priority: 'high',
        } as SchedulerEvent;

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );

        store.updateEvent({ id: event.id, title: 'Updated title' });

        const updated = onEventsChange.mock.lastCall?.[0][0];
        expect(updated.title).to.equal('Updated title');
        expect(updated.priority).to.equal('high');
      });

      it.skipIf(storeClass.name !== 'EventCalendarStore')(
        'should not throw when updating an event that had rrule on input',
        () => {
          const event = EventBuilder.new().recurrent('DAILY').build();

          let store: any;
          expect(() => {
            store = new storeClass.Value(
              { resources: TEST_RESOURCES, events: [event], onEventsChange: () => {} },
              adapter,
            );
          }).toWarnDev([
            'MUI X Scheduler: Recurring events are a premium feature. The `rrule` property will be ignored.',
          ]);

          expect(() => {
            store.updateEvent({ id: event.id, title: 'updated' });
          }).not.to.throw();
        },
      );

      it('should warn in dev when the same id is in both `deleted` and `updated`', () => {
        const event = EventBuilder.new().build();
        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange: () => {} },
          adapter,
        );

        expect(() => {
          (store as any).updateEvents({
            deleted: [event.id],
            updated: [{ id: event.id, title: 'will be ignored' }],
          });
        }).toWarnDev([
          `MUI X Scheduler: id "${event.id}" appears in both \`deleted\` and \`updated\`.`,
        ]);
      });
    });

    describe('Method: deleteEvent', () => {
      it('should remove by id and call onEventsChange with the updated events', () => {
        const onEventsChange = vi.fn();
        const event1 = EventBuilder.new().build();
        const event2 = EventBuilder.new().build();
        const event3 = EventBuilder.new().build();

        const store = new storeClass.Value(
          {
            resources: TEST_RESOURCES,
            events: [event1, event2, event3],
            onEventsChange,
          },
          adapter,
        );
        store.deleteEvent(event2.id);

        expect(onEventsChange.mock.calls.length).to.equal(1);
        const updatedEvents = onEventsChange.mock.lastCall?.[0];
        expect(updatedEvents).to.deep.equal([event1, event3]);
      });
    });

    describe('Method: createEvent', () => {
      it('should append the new event and emit onEventsChange with the updated list', () => {
        const onEventsChange = vi.fn();
        const event1 = EventBuilder.new().build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event1], onEventsChange },
          adapter,
        );

        const newEvent = EventBuilder.new().toCreationProperties();

        const createdId = store.createEvent(newEvent);

        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
          event1,
          { ...newEvent, id: createdId },
        ]);
      });

      it('should not inject timezone into the created event model', () => {
        const onEventsChange = vi.fn();

        const store = new storeClass.Value(
          {
            resources: TEST_RESOURCES,
            events: [],
            displayTimezone: 'Europe/Paris',
            onEventsChange,
          },
          adapter,
        );

        const newEvent = EventBuilder.new().toCreationProperties();
        const createdId = store.createEvent(newEvent);

        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([{ ...newEvent, id: createdId }]);
      });
    });

    describe('Method: duplicateEventOccurrence', () => {
      it('should duplicate the event occurrence and emit onEventsChange with the updated list', () => {
        const onEventsChange = vi.fn();
        const event = EventBuilder.new().build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );

        const start = adapter.date('2025-07-01T09:00:00Z', 'default');
        const end = adapter.date('2025-07-01T10:00:00Z', 'default');
        const duplicatedId = store.duplicateEventOccurrence(event.id, start, end);

        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
          event,
          {
            ...event,
            id: duplicatedId,
            extractedFromId: event.id,
            start: start.toISOString(),
            end: end.toISOString(),
          },
        ]);
      });

      it.skipIf(storeClass.name === 'EventCalendarStore')(
        'should remove rrule and exDates from the original event',
        () => {
          const onEventsChange = vi.fn();
          const event = EventBuilder.new().recurrent('DAILY').exDates(['2025-07-14Z']).build();

          const store = new storeClass.Value(
            { resources: TEST_RESOURCES, events: [event], onEventsChange },
            adapter,
          );

          const start = adapter.date('2025-07-01T09:00:00Z', 'default');
          const end = adapter.date('2025-07-01T10:00:00Z', 'default');
          const duplicatedId = store.duplicateEventOccurrence(event.id, start, end);

          const originalEventWithoutRecurrence = { ...event };
          delete originalEventWithoutRecurrence.rrule;
          delete originalEventWithoutRecurrence.exDates;

          expect(onEventsChange.mock.calls.length).to.equal(1);
          expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
            event,
            {
              ...originalEventWithoutRecurrence,
              id: duplicatedId,
              extractedFromId: event.id,
              start: start.toISOString(),
              end: end.toISOString(),
            },
          ]);
        },
      );

      it('should carry unknown custom properties onto the duplicated event', () => {
        const onEventsChange = vi.fn();
        const event = {
          ...EventBuilder.new().build(),
          priority: 'high',
        } as SchedulerEvent;

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );

        const start = adapter.date('2025-07-01T09:00:00Z', 'default');
        const end = adapter.date('2025-07-01T10:00:00Z', 'default');
        const duplicatedId = store.duplicateEventOccurrence(event.id, start, end);

        const duplicated = onEventsChange.mock.lastCall?.[0].find(
          (event) => event.id === duplicatedId,
        );
        expect(duplicated.priority).to.equal('high');
      });
    });

    describe('Method: copyEvent', () => {
      it('should set the copiedEvent state with the event and action', () => {
        const event = EventBuilder.new().build();
        const store = new storeClass.Value({ resources: TEST_RESOURCES, events: [event] }, adapter);
        store.copyEvent(event.id);

        expect(store.state.copiedEvent).to.deep.equal({
          id: event.id,
          action: 'copy',
        });
      });
    });

    describe('Method: cutEvent', () => {
      it('should set the copiedEvent state with the event and action', () => {
        const event = EventBuilder.new().build();
        const store = new storeClass.Value({ resources: TEST_RESOURCES, events: [event] }, adapter);
        store.cutEvent(event.id);

        expect(store.state.copiedEvent).to.deep.equal({
          id: event.id,
          action: 'cut',
        });
      });
    });

    describe('Method: pasteEvent', () => {
      it('should do nothing if there is no copiedEvent', () => {
        const event = EventBuilder.new().build();
        const store = new storeClass.Value({ resources: TEST_RESOURCES, events: [event] }, adapter);
        const oldState = store.state;
        store.pasteEvent({ start: adapter.date('2025-07-01T09:00:00Z', 'default') });
        expect(store.state).to.deep.equal(oldState);
      });

      it('should paste a copied event and emit onEventsChange with the updated list (only changes start date)', () => {
        const onEventsChange = vi.fn();
        const event = EventBuilder.new().build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );
        store.copyEvent(event.id);

        const createdEventId = store.pasteEvent({
          start: adapter.date('2025-07-01T09:00:00Z', 'default'),
        });

        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
          event,
          {
            ...event,
            id: createdEventId,
            start: '2025-07-01T09:00:00.000Z',
            end: '2025-07-01T10:00:00.000Z',
            extractedFromId: event.id,
          },
        ]);
      });

      it('should carry unknown custom properties onto the pasted event (copy)', () => {
        const onEventsChange = vi.fn();
        const event = {
          ...EventBuilder.new().build(),
          priority: 'high',
        } as SchedulerEvent;

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );
        store.copyEvent(event.id);

        const createdEventId = store.pasteEvent({
          start: adapter.date('2025-07-01T09:00:00Z', 'default'),
        });

        const pasted = onEventsChange.mock.lastCall?.[0].find(
          (event) => event.id === createdEventId,
        );
        expect(pasted.priority).to.equal('high');
      });

      it('should paste a copied event and emit onEventsChange with the updated list (only changes resource)', () => {
        const onEventsChange = vi.fn();
        const resource1 = ResourceBuilder.new().build();
        const resource2 = ResourceBuilder.new().build();
        const event = EventBuilder.new().resource(resource1).build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );
        store.copyEvent(event.id);

        const createdEventId = store.pasteEvent({
          resource: resource2.id,
        });

        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
          event,
          {
            ...event,
            id: createdEventId,
            resource: resource2.id,
            extractedFromId: event.id,
          },
        ]);
      });

      it('should paste a copied event and emit onEventsChange with the updated list (only changes allDay)', () => {
        const onEventsChange = vi.fn();
        const event = EventBuilder.new().build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );
        store.copyEvent(event.id);

        const createdEventId = store.pasteEvent({
          allDay: true,
        });

        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
          event,
          {
            ...event,
            id: createdEventId,
            allDay: true,
            extractedFromId: event.id,
          },
        ]);
      });

      it('should paste a cut event and emit onEventsChange with the updated list (only changes start date)', () => {
        const onEventsChange = vi.fn();
        const event = EventBuilder.new().build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );
        store.cutEvent(event.id);

        const createdEventId = store.pasteEvent({
          start: adapter.date('2025-07-01T09:00:00Z', 'default'),
        });

        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
          {
            ...event,
            id: createdEventId,
            start: '2025-07-01T09:00:00.000Z',
            end: '2025-07-01T10:00:00.000Z',
          },
        ]);
      });

      it('should paste a cut event and emit onEventsChange with the updated list (only changes resource)', () => {
        const onEventsChange = vi.fn();
        const resource1 = ResourceBuilder.new().build();
        const resource2 = ResourceBuilder.new().build();
        const event = EventBuilder.new().resource(resource1).build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );
        store.cutEvent(event.id);

        const createdEventId = store.pasteEvent({
          resource: resource2.id,
        });

        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
          {
            ...event,
            id: createdEventId,
            resource: resource2.id,
          },
        ]);
      });

      it('should paste a cut event and emit onEventsChange with the updated list (only changes allDay)', () => {
        const onEventsChange = vi.fn();
        const event = EventBuilder.new().build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );
        store.cutEvent(event.id);

        const createdEventId = store.pasteEvent({
          allDay: true,
        });

        expect(onEventsChange.mock.calls.length).to.equal(1);
        expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([
          {
            ...event,
            id: createdEventId,
            allDay: true,
          },
        ]);
      });

      it('should clear the clipboard after pasting a cut event so a second paste is a no-op', () => {
        const onEventsChange = vi.fn();
        const event = EventBuilder.new().build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );
        store.cutEvent(event.id);

        store.pasteEvent({ start: adapter.date('2025-07-01T09:00:00Z', 'default') });

        expect(store.state.copiedEvent).to.equal(null);
        expect(onEventsChange.mock.calls.length).to.equal(1);

        const result = store.pasteEvent({
          start: adapter.date('2025-07-02T09:00:00Z', 'default'),
        });

        expect(result).to.equal(null);
        expect(onEventsChange.mock.calls.length).to.equal(1);
      });

      it('should keep the clipboard after pasting a copied event so it can be pasted again', () => {
        const onEventsChange = vi.fn();
        const event = EventBuilder.new().build();

        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [event], onEventsChange },
          adapter,
        );
        store.copyEvent(event.id);

        const firstPastedId = store.pasteEvent({
          start: adapter.date('2025-07-01T09:00:00Z', 'default'),
        });
        const secondPastedId = store.pasteEvent({
          start: adapter.date('2025-07-02T09:00:00Z', 'default'),
        });

        expect(store.state.copiedEvent).to.deep.equal({ id: event.id, action: 'copy' });
        expect(firstPastedId).not.to.equal(null);
        expect(secondPastedId).not.to.equal(null);
        expect(firstPastedId).not.to.equal(secondPastedId);
        expect(onEventsChange.mock.calls.length).to.equal(2);
      });
    });

    describe('dev warnings', () => {
      it('should warn in dev when events are updated without onEventsChange nor dataSource', () => {
        const event = EventBuilder.new().build();
        const store = new storeClass.Value({ resources: TEST_RESOURCES, events: [event] }, adapter);

        expect(() => {
          store.updateEvent({ id: event.id, title: 'updated' });
        }).toWarnDev([
          'MUI X Scheduler: An event update was ignored because no `onEventsChange` handler nor `dataSource` is provided.',
        ]);
      });

      it('should not warn about a missing onEventsChange when a dataSource is provided', () => {
        const event = EventBuilder.new().build();
        const dataSource = {
          getEvents: async () => [event],
          persistEvents: async () => ({ success: true }),
        };
        const store = new storeClass.Value(
          { resources: TEST_RESOURCES, events: [], dataSource },
          adapter,
        );

        expect(() => {
          store.createEvent(EventBuilder.new().toCreationProperties());
        }).not.toWarnDev();
      });
    });
  });
});
