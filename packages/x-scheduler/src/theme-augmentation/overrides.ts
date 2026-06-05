import { EventCalendarClassKey } from '../event-calendar/eventCalendarClasses';
import { EventDialogClassKey } from '../internals/components/event-dialog/eventDialogClasses';

// The skeleton and error container expose `styleOverrides` per styled slot
// (`Root`/`Alert`/`Message`), which MUI resolves to these lower-cased keys.
// prettier-ignore
export interface SchedulerComponentNameToClassKey {
  MuiEventCalendar: EventCalendarClassKey;
  MuiEventDialog: EventDialogClassKey;
  MuiEventSkeleton: 'root';
  MuiEventErrorContainer: 'root' | 'alert' | 'message';
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends SchedulerComponentNameToClassKey {}
}

// disable automatic export
export {};
