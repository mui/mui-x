import * as React from 'react';
import { Popover } from '@base-ui-components/react/popover';
import { CalendarEvent } from '../../models/events';
import { EventPopover } from '../../event-popover/EventPopover';
import { selectors } from '../../event-calendar/store';
import { useEventCalendarStore } from '../hooks/useEventCalendarStore';
import { useSelector } from '../../../base-ui-copy/utils/store';

type EventPopoverContextProps = {
  onEventClick: (event: React.MouseEvent, calendarEvent: CalendarEvent) => void;
};

type EventPopoverProviderProps = {
  containerRef: React.RefObject<HTMLElement | null>;
  children: (context: EventPopoverContextProps) => React.ReactNode;
  onEventsChange?: (value: CalendarEvent[]) => void;
};

export function EventPopoverProvider({
  containerRef,
  onEventsChange,
  children,
}: EventPopoverProviderProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const store = useEventCalendarStore();
  const resourcesByIdMap = useSelector(store, selectors.resourcesByIdMap);

  const handleEventClick = React.useCallback(
    (event: React.MouseEvent, calendarEvent: CalendarEvent) => {
      setAnchor(event.currentTarget as HTMLElement);
      setSelectedEvent(calendarEvent);
      setIsPopoverOpen(true);
    },
    [],
  );

  const handleClose = React.useCallback(() => {
    if (!isPopoverOpen) {
      return;
    }
    setIsPopoverOpen(false);
    setAnchor(null);
    setSelectedEvent(null);
  }, [isPopoverOpen]);

  const handleEventEdit = React.useCallback(
    (editedEvent: CalendarEvent) => {
      const prevEvents = store.state.events;
      const updatedEvents = prevEvents.map((ev) => (ev.id === editedEvent.id ? editedEvent : ev));

      if (onEventsChange) {
        onEventsChange(updatedEvents);
      }
    },
    [store, onEventsChange],
  );

  const handleEventDelete = React.useCallback(
    (deletedEventId: string) => {
      const prevEvents = store.state.events;
      const updatedEvents = prevEvents.filter((ev) => ev.id !== deletedEventId);

      if (onEventsChange) {
        onEventsChange(updatedEvents);
      }
    },
    [store, onEventsChange],
  );

  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={handleClose} modal>
      {children({ onEventClick: handleEventClick })}
      {anchor && selectedEvent && (
        <EventPopover
          anchor={anchor}
          calendarEvent={selectedEvent}
          calendarEventResource={resourcesByIdMap.get(selectedEvent.resource)}
          container={containerRef.current}
          onEventEdit={handleEventEdit}
          onEventDelete={handleEventDelete}
          onClose={handleClose}
        />
      )}
    </Popover.Root>
  );
}
