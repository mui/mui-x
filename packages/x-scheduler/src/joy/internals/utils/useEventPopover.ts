import * as React from 'react';
import { CalendarEvent } from '../../models/events';

export function useEventPopover() {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);

  const handleEventClick = React.useCallback(
    (event: React.MouseEvent, calendarEvent: CalendarEvent) => {
      setAnchor(event.currentTarget as HTMLElement);
      setSelectedEvent(calendarEvent);
      setIsPopoverOpen(true);
    },
    [],
  );

  const handlePopoverClose = React.useCallback(() => {
    setIsPopoverOpen(false);
    setSelectedEvent(null);
    setAnchor(null);
  }, []);

  return {
    isPopoverOpen,
    anchor,
    selectedEvent,
    handleEventClick,
    handlePopoverClose,
    setIsPopoverOpen,
    setAnchor,
    setSelectedEvent,
  };
}
