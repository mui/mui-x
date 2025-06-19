import * as React from 'react';
import { Popover } from '@base-ui-components/react/popover';
import { useSelector } from '@mui/x-scheduler/base-ui-copy/utils/store';
import { CalendarEvent } from '../../models/events';
import { EventPopover } from '../../event-popover/EventPopover';
import { selectors } from '../../event-calendar/store';
import { useEventCalendarStore } from '../hooks/useEventCalendarStore';

type EventPopoverContextProps = {
  onEventClick: (event: React.MouseEvent, calendarEvent: CalendarEvent) => void;
};

type EventPopoverProviderProps = {
  containerRef: React.RefObject<HTMLElement | null>;
  children: (context: EventPopoverContextProps) => React.ReactNode;
  onEventEdit: (event: CalendarEvent) => void;
};

export function EventPopoverProvider({
  containerRef,
  onEventEdit,
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
    setIsPopoverOpen(false);
    setAnchor(null);
    setSelectedEvent(null);
  }, []);

  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={handleClose} modal>
      {children({ onEventClick: handleEventClick })}
      {anchor && selectedEvent && (
        <EventPopover
          anchor={anchor}
          calendarEvent={selectedEvent}
          calendarEventResource={resourcesByIdMap.get(selectedEvent.resource)}
          container={containerRef.current}
          onEventEdit={onEventEdit}
          onClose={handleClose}
        />
      )}
    </Popover.Root>
  );
}
