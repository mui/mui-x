import { spy } from 'sinon';
import { EventCalendarStore } from '../EventCalendarStore';
import { getAdapter } from './../../utils/adapter/getAdapter';
import { buildEvent } from './utils';

const adapter = getAdapter();

describe('Event - EventCalendarStore', () => {
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

      const store = EventCalendarStore.create({ events, onEventsChange }, adapter);

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

      const store = EventCalendarStore.create({ events, onEventsChange }, adapter);
      store.deleteEvent('2');

      expect(onEventsChange.calledOnce).to.equal(true);
      const updatedEvents = onEventsChange.lastCall.firstArg;
      expect(updatedEvents.map((event) => event.id)).to.deep.equal(['1', '3']);
    });
  });
});
