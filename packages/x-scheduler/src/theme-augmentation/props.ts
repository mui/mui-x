import { EventCalendarProps } from '../event-calendar/EventCalendar.types';
import { EventDraggableDialogProps } from '../internals/components/event-draggable-dialog/EventDraggableDialog.types';

export interface SchedulerComponentsPropsList {
  MuiEventCalendar: EventCalendarProps<any, any>;
  MuiEventDraggableDialog: EventDraggableDialogProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends SchedulerComponentsPropsList {}
}

// disable automatic export
export {};
