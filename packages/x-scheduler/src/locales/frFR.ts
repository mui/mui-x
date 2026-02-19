import type {
  EventDialogLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import {
  getSchedulerLocalization,
  type SchedulerLocalization,
} from '../utils/getSchedulerLocalization';

const frFRDialog: Partial<EventDialogLocaleText> = {};

const frFRCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>> = {
  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Jour',
  month: 'Mois',
  other: 'Autre',
  today: "Aujourd'hui",
  week: 'Semaine',

  // WeekView
  allDay: 'Toute la journée',
};

const frFRTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Titre de la ressource',
};

export const frFR: SchedulerLocalization = getSchedulerLocalization({
  dialog: frFRDialog,
  calendar: frFRCalendar,
  timeline: frFRTimeline,
});
