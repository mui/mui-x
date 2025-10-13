import { spy } from 'sinon';
import { adapter } from 'test/utils/scheduler';
import { SchedulerEventModelStructure } from '@mui/x-scheduler-headless/models';
import { buildEvent, storeClasses, getIds } from './utils';
import { selectors } from '../SchedulerStore.selectors';

storeClasses.forEach((storeClass) => {
  describe(`Event - ${storeClass.name}`, () => {
    describe('prop: eventModelStructure', () => {
      it('should use the provided event model structure to read event properties', () => {
        interface MyEvent {
          myId: string;
          myTitle: string;
          myStart: string;
          myEnd: string;
        }

        const events: MyEvent[] = [
          {
            myId: '1',
            myTitle: 'Event 1',
            myStart: '2025-07-01T09:00:00Z',
            myEnd: '2025-07-01T10:00:00Z',
          },
        ];

        const eventModelStructure: SchedulerEventModelStructure<MyEvent> = {
          id: {
            getter: (event) => event.myId,
          },
          title: {
            getter: (event) => event.myTitle,
          },
          start: {
            getter: (event) => adapter.date(event.myStart),
          },
          end: {
            getter: (event) => adapter.date(event.myEnd),
          },
        };

        const store = new storeClass.Value({ events, eventModelStructure }, adapter);
        const event = selectors.event(store.state, '1');

        expect(event).to.deep.contain({
          id: '1',
          title: 'Event 1',
          start: adapter.date('2025-07-01T09:00:00Z'),
          end: adapter.date('2025-07-01T10:00:00Z'),
        });
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
