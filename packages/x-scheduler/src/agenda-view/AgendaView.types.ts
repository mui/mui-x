import { EventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';

export interface AgendaViewProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface StandaloneAgendaViewProps extends AgendaViewProps, EventCalendarParameters {}
