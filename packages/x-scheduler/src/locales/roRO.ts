import type {
  EventDialogLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import {
  getSchedulerLocalization,
  type SchedulerLocalization,
} from '../utils/getSchedulerLocalization';

const roRODialog: Partial<EventDialogLocaleText> = {
  // EventDialog
  colorPickerLabel: 'Culoarea evenimentului',
  dateTimeSectionLabel: 'Dată și oră',
  resourceColorSectionLabel: 'Resursă și culoare',
  allDayLabel: 'Toată ziua',
  closeButtonAriaLabel: 'Închide',
  closeButtonLabel: 'Închide',
  deleteEvent: 'Șterge evenimentul',
  descriptionLabel: 'Descriere',
  endDateLabel: 'Data de sfârșit',
  endTimeLabel: 'Ora de sfârșit',
  eventTitleAriaLabel: 'Titlul evenimentului',
  generalTabLabel: 'General',
  labelNoResource: 'Fără resursă',
  labelInvalidResource: 'Resursă invalidă',
  recurrenceLabel: 'Recurență',
  recurrenceNoRepeat: 'Nu se repetă',
  recurrenceCustomRepeat: 'Regulă de repetare personalizată',
  recurrenceDailyPresetLabel: 'Se repetă zilnic',
  recurrenceDailyFrequencyLabel: 'zile',
  recurrenceEndsLabel: 'Se termină',
  recurrenceEndsAfterLabel: 'După',
  recurrenceEndsNeverLabel: 'Niciodată',
  recurrenceEndsUntilLabel: 'Până la',
  recurrenceEndsTimesLabel: 'ori',
  recurrenceEveryLabel: 'La fiecare',
  recurrenceRepeatLabel: 'Repetă',
  recurrenceTabLabel: 'Recurență',
  recurrenceMainSelectCustomLabel: 'Recurență',
  recurrenceWeeklyFrequencyLabel: 'săptămâni',
  recurrenceWeeklyPresetLabel: (weekday) => `Se repetă săptămânal în ${weekday}`,
  recurrenceMonthlyFrequencyLabel: 'luni',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Ziua ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) => `${weekDay} din ultima săptămână a lunii`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay} ultima săptămână`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Se repetă lunar în ziua ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${weekDay} săptămâna ${ord} a lunii`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay} săptămâna ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'În',
  recurrenceYearlyFrequencyLabel: 'ani',
  recurrenceYearlyPresetLabel: (date) => `Se repetă anual pe ${date}`,
  noResourceAriaLabel: 'Fără resursă',
  resourceLabel: 'Resursă',
  saveChanges: 'Salvează',
  startDateAfterEndDateError: 'Data/ora de început trebuie să fie înainte de data/ora de sfârșit.',
  startDateLabel: 'Data de început',
  startTimeLabel: 'Ora de început',

  // ScopeDialog
  all: 'Toate evenimentele',
  cancel: 'Anulează',
  confirm: 'Confirmă',
  onlyThis: 'Doar acest eveniment',
  radioGroupAriaLabel: 'Aria de aplicare a modificării evenimentelor recurente',
  thisAndFollowing: 'Acest eveniment și următoarele',
  title: 'Aplică această modificare la:',
};

const roROCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>> = {
  // ResourcesLegend
  hideEventsLabel: (resourceName) => `Ascunde evenimentele pentru ${resourceName}`,
  resourcesLabel: 'Resurse',
  resourcesLegendSectionLabel: 'Legendă resurse',
  showEventsLabel: (resourceName) => `Afișează evenimentele pentru ${resourceName}`,

  // ViewSwitcher
  agenda: 'Agendă',
  day: 'Zi',
  month: 'Lună',
  other: 'Altele',
  today: 'Astăzi',
  week: 'Săptămână',
  time: 'Timp',
  days: 'Zile',
  months: 'Luni',
  weeks: 'Săptămâni',
  years: 'Ani',

  // DateNavigator
  closeSidePanel: 'Închide panoul lateral',
  openSidePanel: 'Deschide panoul lateral',

  // Preferences menu
  amPm12h: '12 ore (1:00PM)',
  hour24h: '24 de ore (13:00)',
  preferencesMenu: 'Setări',
  showWeekends: 'Afișează weekendurile',
  showEmptyDaysInAgenda: 'Afișează zilele goale',
  showWeekNumber: 'Afișează numărul săptămânii',
  timeFormat: 'Formatul orei',
  viewSpecificOptions: (view) => `Opțiuni pentru vizualizarea ${view}`,

  // WeekView
  allDay: 'Toată ziua',

  // MonthView
  hiddenEvents: (hiddenEventsCount) => `Încă ${hiddenEventsCount}..`,
  nextTimeSpan: (timeSpan) => `${timeSpan} următoare`,
  previousTimeSpan: (timeSpan) => `${timeSpan} anterioară`,
  resourceAriaLabel: (resourceName) => `Resursă: ${resourceName}`,
  weekAbbreviation: 'S',
  weekNumberAriaLabel: (weekNumber) => `Săptămâna ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Se termină pe ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Calendar',
  miniCalendarGoToPreviousMonth: 'Afișează luna anterioară în calendar',
  miniCalendarGoToNextMonth: 'Afișează luna următoare în calendar',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Titlul resursei',
};

const roROTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Titlul resursei',
};

export const roRO: SchedulerLocalization = getSchedulerLocalization({
  dialog: roRODialog,
  calendar: roROCalendar,
  timeline: roROTimeline,
});
