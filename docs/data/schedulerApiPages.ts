import type { MuiPage } from '@mui/internal-core-docs/MuiPage';

const schedulerApiPages: MuiPage[] = [
  {
    pathname: '/x/api/scheduler/event-calendar',
    title: 'EventCalendar',
  },
  {
    pathname: '/x/api/scheduler/event-calendar-premium',
    title: 'EventCalendarPremium',
    plan: 'premium',
  },
  {
    pathname: '/x/api/scheduler/event-timeline-premium',
    title: 'EventTimelinePremium',
    plan: 'premium',
  },
  {
    pathname: '/x/api/scheduler/standalone-agenda-view',
    title: 'StandaloneAgendaView',
  },
  {
    pathname: '/x/api/scheduler/standalone-day-view',
    title: 'StandaloneDayView',
  },
  {
    pathname: '/x/api/scheduler/standalone-event',
    title: 'StandaloneEvent',
  },
  {
    pathname: '/x/api/scheduler/standalone-month-view',
    title: 'StandaloneMonthView',
  },
  {
    pathname: '/x/api/scheduler/standalone-week-view',
    title: 'StandaloneWeekView',
  },
];
export default schedulerApiPages;
