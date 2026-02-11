import { EventCalendarProps } from '../event-calendar/EventCalendar.types';
import { EventDialogProps } from '../internals/components/event-dialog/EventDialog.types';

export interface SchedulerComponentsPropsList {
  MuiEventCalendar: EventCalendarProps<any, any>;
  MuiEventDialog: EventDialogProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends SchedulerComponentsPropsList {}
}

// disable automatic export
export {};
