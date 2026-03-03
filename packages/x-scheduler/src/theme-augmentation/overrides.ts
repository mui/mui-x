import { EventCalendarClassKey } from '../event-calendar/eventCalendarClasses';
import { EventDialogClassKey } from '../internals/components/event-dialog/eventDialogClasses';

// prettier-ignore
export interface SchedulerComponentNameToClassKey {
  MuiEventCalendar: EventCalendarClassKey;
  MuiEventDialog: EventDialogClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends SchedulerComponentNameToClassKey {}
}

// disable automatic export
export {};
