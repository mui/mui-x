import { spy } from 'sinon';
import { adapter } from 'test/utils/scheduler';
import { SchedulerEventModelStructure, SchedulerValidDate } from '@mui/x-scheduler-headless/models';
import { buildEvent, storeClasses, getIds } from './utils';
import { schedulerEventSelectors } from '../../../scheduler-selectors';

storeClasses.forEach((storeClass) => {
  describe(`Event - ${storeClass.name}`, () => {
    describe('prop: eventModelStructure', () => {
      interface MyEvent {
        myId: string;
        myTitle: string;
        myStart: string;
        myEnd: string;
        allDay?: boolean;
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
          getter: (event) => adapter.date(event.myStart),
          setter: (event, value) => {
            event.myStart = value.toISO()!;
            return event;
          },
        },
        end: {
          getter: (event) => adapter.date(event.myEnd),
          setter: (event, value) => {
            event.myEnd = value.toISO()!;
            return event;
          },
        },
      };

      it('should use the provided event model structure to read event properties', () => {
        const events: MyEvent[] = [
          {
            myId: '1',
            myTitle: 'Event 1',
            myStart: '2025-07-01T09:00:00.000+00:00',
            myEnd: '2025-07-01T10:00:00.000+00:00',
            allDay: false,
          },
        ];

        const store = new storeClass.Value({ events, eventModelStructure }, adapter);
        const event = schedulerEventSelectors.processedEvent(store.state, '1');

        expect(event).to.deep.contain({
          id: '1',
          title: 'Event 1',
          start: adapter.date('2025-07-01T09:00:00.000+00:00'),
          end: adapter.date('2025-07-01T10:00:00.000+00:00'),
          allDay: false,
        });
      });

      it('should use the provided event model structure to write event properties', () => {
        const onEventsChange = spy();

        const events: MyEvent[] = [
          {
            myId: '1',
            myTitle: 'Event 1',
            myStart: '2025-07-01T09:00:00.000+00:00',
            myEnd: '2025-07-01T10:00:00.000+00:00',
            allDay: false,
          },
        ];

        const store = new storeClass.Value(
          { events, eventModelStructure, onEventsChange },
          adapter,
        );
        store.updateEvent({
          id: '1',
          title: 'Event 1 updated',
          start: adapter.date('2025-07-01T09:30:00.000+00:00'),
          end: adapter.date('2025-07-01T10:30:00.000+00:00'),
          allDay: true,
        });

        // Should call onEventsChange with the updated event using the custom model structure
        expect(onEventsChange.calledOnce).to.equal(true);
        expect(onEventsChange.lastCall.firstArg).to.deep.equal([
          {
            myId: '1',
            myTitle: 'Event 1 updated',
            myStart: '2025-07-01T09:30:00.000+00:00',
            myEnd: '2025-07-01T10:30:00.000+00:00',
            allDay: true,
          },
        ]);
      });

      it('should use the provided event model structure to create an event', () => {
        const onEventsChange = spy();

        const events: MyEvent[] = [];

        const store = new storeClass.Value(
          { events, eventModelStructure, onEventsChange },
          adapter,
        );
        store.createEvent({
          id: '1',
          title: 'Event 1',
          start: adapter.date('2025-07-01T09:00:00.000+00:00'),
          end: adapter.date('2025-07-01T10:00:00.000+00:00'),
          allDay: false,
        });

        // Should call onEventsChange with the created event using the custom model structure
        expect(onEventsChange.calledOnce).to.equal(true);
        expect(onEventsChange.lastCall.firstArg).to.deep.equal([
          {
            myId: '1',
            myTitle: 'Event 1',
            myStart: '2025-07-01T09:00:00.000+00:00',
            myEnd: '2025-07-01T10:00:00.000+00:00',
            allDay: false,
          },
        ]);
      });

      it('should only re-compute the processed events when updating events or eventModelStructure parameters', () => {
        interface MyEvent2 {
          myId: string;
          title: string;
          start: SchedulerValidDate;
          end: SchedulerValidDate;
        }

        const idGetter = spy((event: MyEvent2) => event.myId);

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
            start: adapter.date('2025-07-01T09:00:00.000+00:00'),
            end: adapter.date('2025-07-01T10:00:00.000+00:00'),
          },
        ];

        const store = new storeClass.Value(
          { events, eventModelStructure: eventModelStructure2, showCurrentTimeIndicator: false },
          adapter,
        );

        // Called to convert Event 1 on mount.
        expect(idGetter.callCount).to.equal(1);

        store.updateStateFromParameters(
          {
            events,
            eventModelStructure: eventModelStructure2,
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        // Not called again when updating a non-related parameter.
        expect(idGetter.callCount).to.equal(1);

        const events2: MyEvent2[] = [
          {
            myId: '1',
            title: 'Event 1',
            start: adapter.date('2025-07-01T09:00:00.000+00:00'),
            end: adapter.date('2025-07-01T10:00:00.000+00:00'),
          },
          {
            myId: '2',
            title: 'Event 2',
            start: adapter.date('2025-07-01T10:00:00.000+00:00'),
            end: adapter.date('2025-07-01T11:00:00.000+00:00'),
          },
        ];

        store.updateStateFromParameters(
          {
            events: events2,
            eventModelStructure: eventModelStructure2,
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        // Called again to convert Event 1 and Event 2 because props.events changed.
        expect(idGetter.callCount).to.equal(3);

        store.updateStateFromParameters(
          {
            events: events2,
            eventModelStructure: { ...eventModelStructure2 },
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        // Called again to convert Event 1 and Event 2 because props.eventModelStructure changed.
        expect(idGetter.callCount).to.equal(5);
      });
    });

    describe('Method: updateEvent', () => {
      it('should replace matching id and emit onEventsChange with the updated events', () => {
        const onEventsChange = spy();
        const events = [
          buildEvent(
            '1',
            'Event 1',
            adapter.date('2025-07-01T09:00:00Z'),
            adapter.date('2025-07-01T10:00:00Z'),
          ),
          buildEvent(
            '2',
            'Event 2',
            adapter.date('2025-07-01T11:00:00Z'),
            adapter.date('2025-07-01T12:00:00Z'),
          ),
        ];

        const store = new storeClass.Value({ events, onEventsChange }, adapter);

        const updatedEvent = buildEvent(
          '2',
          'Event 2 updated',
          adapter.date('2025-07-01T11:30:00Z'),
          adapter.date('2025-07-01T12:30:00Z'),
          {
            description: 'Event 2 description',
            allDay: false,
          },
        );

        store.updateEvent(updatedEvent);

        expect(onEventsChange.calledOnce).to.equal(true);
        const updatedEvents = onEventsChange.lastCall.firstArg;

        expect(updatedEvents).to.have.length(2);
        expect(updatedEvents[0].title).to.equal('Event 1');
        expect(updatedEvents[1].title).to.equal('Event 2 updated');
        expect(updatedEvents[1].description).to.equal('Event 2 description');
        expect(updatedEvents[1].start).toEqualDateTime(adapter.date('2025-07-01T11:30:00Z'));
        expect(updatedEvents[1].end).toEqualDateTime(adapter.date('2025-07-01T12:30:00Z'));
      });
    });

    describe('Method: deleteEvent', () => {
      it('should remove by id and call onEventsChange with the updated events', () => {
        const onEventsChange = spy();
        const events = [
          buildEvent(
            '1',
            'Event 1',
            adapter.date('2025-07-01T09:00:00Z'),
            adapter.date('2025-07-01T10:00:00Z'),
          ),
          buildEvent(
            '2',
            'Event 2',
            adapter.date('2025-07-01T11:00:00Z'),
            adapter.date('2025-07-01T12:00:00Z'),
          ),
          buildEvent(
            '3',
            'Event 3',
            adapter.date('2025-07-01T13:00:00Z'),
            adapter.date('2025-07-01T14:00:00Z'),
          ),
        ];

        const store = new storeClass.Value({ events, onEventsChange }, adapter);
        store.deleteEvent('2');

        expect(onEventsChange.calledOnce).to.equal(true);
        const updatedEvents = onEventsChange.lastCall.firstArg;
        expect(updatedEvents.map((event) => event.id)).to.deep.equal(['1', '3']);
      });
    });

    describe('Method: createEvent', () => {
      it('should append the new event and emit onEventsChange with the updated list', () => {
        const onEventsChange = spy();
        const existing = [
          buildEvent(
            '1',
            'Event 1',
            adapter.date('2025-07-01T09:00:00Z'),
            adapter.date('2025-07-01T10:00:00Z'),
          ),
        ];

        const store = new storeClass.Value({ events: existing, onEventsChange }, adapter);

        const newEvent = buildEvent(
          '2',
          'New Event',
          adapter.date('2025-07-01T11:00:00Z'),
          adapter.date('2025-07-01T12:00:00Z'),
          { description: 'New event description', allDay: true },
        );

        const created = store.createEvent(newEvent);

        expect(created.id).to.equal('2');
        expect(created.title).to.equal('New Event');
        expect(onEventsChange.calledOnce).to.equal(true);
        const updated = onEventsChange.lastCall.firstArg;
        expect(getIds(updated)).to.deep.equal(['1', '2']);

        const appended = updated[1];
        expect(appended.title).to.equal('New Event');
        expect(appended.description).to.equal('New event description');
        expect(appended.allDay).to.equal(true);
        expect(appended.start).toEqualDateTime(adapter.date('2025-07-01T11:00:00Z'));
        expect(appended.end).toEqualDateTime(adapter.date('2025-07-01T12:00:00Z'));
      });

      it('should throw when an event with the same id already exists and not call onEventsChange', () => {
        const onEventsChange = spy();
        const events = [
          buildEvent(
            'Event 1',
            'Existing',
            adapter.date('2025-07-01T09:00:00Z'),
            adapter.date('2025-07-01T10:00:00Z'),
          ),
        ];

        const store = new storeClass.Value({ events, onEventsChange }, adapter);

        const duplicate = buildEvent(
          'Event 1',
          'Should fail',
          adapter.date('2025-07-01T11:00:00Z'),
          adapter.date('2025-07-01T12:00:00Z'),
        );

        expect(() => store.createEvent(duplicate)).to.throw(
          `${store.instanceName}: an event with id="Event 1" already exists. Use updateEvent(...) instead.`,
        );
        expect(onEventsChange.called).to.equal(false);
      });
    });
  });
});
