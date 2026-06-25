import type {
  EventDialogLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import {
  getSchedulerLocalization,
  type SchedulerLocalization,
} from '../utils/getSchedulerLocalization';

const plPLDialog: Partial<EventDialogLocaleText> = {
  // EventDialog
  colorPickerLabel: 'Kolor wydarzenia',
  dateTimeSectionLabel: 'Data i godzina',
  resourceColorSectionLabel: 'Zasób i kolor',
  allDayLabel: 'Cały dzień',
  closeButtonAriaLabel: 'Zamknij',
  closeButtonLabel: 'Zamknij',
  deleteEvent: 'Usuń wydarzenie',
  descriptionLabel: 'Opis',
  endDateLabel: 'Data zakończenia',
  endTimeLabel: 'Godzina zakończenia',
  eventTitleAriaLabel: 'Tytuł wydarzenia',
  generalTabLabel: 'Ogólne',
  labelNoResource: 'Brak zasobu',
  labelInvalidResource: 'Nieprawidłowy zasób',
  recurrenceLabel: 'Powtarzanie',
  recurrenceNoRepeat: 'Nie powtarzaj',
  recurrenceCustomRepeat: 'Niestandardowa reguła powtarzania',
  recurrenceDailyPresetLabel: 'Powtarza się codziennie',
  recurrenceDailyFrequencyLabel: 'dni',
  recurrenceEndsLabel: 'Koniec',
  recurrenceEndsAfterLabel: 'Po',
  recurrenceEndsNeverLabel: 'Nigdy',
  recurrenceEndsUntilLabel: 'Do',
  recurrenceEndsTimesLabel: 'razy',
  recurrenceEveryLabel: 'Co',
  recurrenceRepeatLabel: 'Powtarzaj',
  recurrenceTabLabel: 'Powtarzanie',
  recurrenceMainSelectCustomLabel: 'Powtarzanie',
  recurrenceWeeklyFrequencyLabel: 'tygodnie',
  recurrenceWeeklyPresetLabel: ({ weekday }) => {
    const map = {
      monday: 'w poniedziałek',
      tuesday: 'we wtorek',
      wednesday: 'w środę',
      thursday: 'w czwartek',
      friday: 'w piątek',
      saturday: 'w sobotę',
      sunday: 'w niedzielę',
    };
    return `Powtarza się co tydzień ${map[weekday]}`;
  },
  recurrenceMonthlyFrequencyLabel: 'miesiące',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Dzień ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) => `${weekDay} w ostatnim tygodniu miesiąca`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay}, ostatni tydzień`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Powtarza się co miesiąc w dniu ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${weekDay}, tydzień ${ord} miesiąca`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay}, tydzień ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'W',
  recurrenceYearlyFrequencyLabel: 'lata',
  recurrenceYearlyPresetLabel: (date) => `Powtarza się co roku w ${date}`,
  noResourceAriaLabel: 'Brak określonego zasobu',
  selectColorAriaLabel: (color) => `Wybierz ${color} jako kolor wydarzenia`,
  resourceLabel: 'Zasób',
  requiredResourceError: 'Należy wybrać zasób.',
  saveChanges: 'Zapisz',
  startDateAfterEndDateError:
    'Data/godzina rozpoczęcia musi być wcześniejsza niż data/godzina zakończenia.',
  startDateLabel: 'Data rozpoczęcia',
  startTimeLabel: 'Godzina rozpoczęcia',

  // RecurringScopeDialog
  all: 'Wszystkie wydarzenia',
  cancel: 'Anuluj',
  confirm: 'Potwierdź',
  onlyThis: 'Tylko to wydarzenie',
  radioGroupAriaLabel: 'Zakres edycji wydarzeń cyklicznych',
  thisAndFollowing: 'To i kolejne wydarzenia',
  title: 'Zastosuj tę zmianę do:',
};

const plPLCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>> = {
  // ResourcesTree
  resourcesLabel: 'Zasoby',

  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Dzień',
  month: 'Miesiąc',
  other: 'Inne',
  today: 'Dzisiaj',
  week: 'Tydzień',
  time: 'Czas',
  days: 'Dni',
  months: 'Miesiące',
  weeks: 'Tygodnie',
  years: 'Lata',

  // DateNavigator
  closeSidePanel: 'Zamknij panel boczny',
  openSidePanel: 'Otwórz panel boczny',

  // SidePanelDrawer (small screens)
  // back: 'Back',
  // openMenu: 'Open menu',

  // Preferences menu
  amPm12h: '12-godzinny (1:00PM)',
  hour24h: '24-godzinny (13:00)',
  preferencesMenu: 'Ustawienia',
  showWeekends: 'Pokaż weekendy',
  showEmptyDaysInAgenda: 'Pokaż puste dni',
  showWeekNumber: 'Pokaż numer tygodnia',
  timeFormat: 'Format czasu',
  viewSpecificOptions: (view) => `Opcje widoku ${view}`,
  startWeekOn: 'Początek tygodnia',
  weekdaySunday: 'Niedziela',
  weekdayMonday: 'Poniedziałek',
  weekdaySaturday: 'Sobota',

  // WeekView
  allDay: 'Cały dzień',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} więcej..`,
  nextTimeSpan: (timeSpan) => `Następny ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `Poprzedni ${timeSpan}`,
  resourceAriaLabel: (resourceName) => `Zasób: ${resourceName}`,
  weekAbbreviation: 'T',
  weekNumberAriaLabel: (weekNumber) => `Tydzień ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Kończy się ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Kalendarz',
  miniCalendarGoToPreviousMonth: 'Pokaż poprzedni miesiąc w kalendarzu',
  miniCalendarGoToNextMonth: 'Pokaż następny miesiąc w kalendarzu',

  // Main calendar region
  calendarContentAriaLabel: 'Zawartość kalendarza',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Tytuł zasobu',
};

const plPLTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Tytuł zasobu',
};

export const plPL: SchedulerLocalization = getSchedulerLocalization({
  dialog: plPLDialog,
  calendar: plPLCalendar,
  timeline: plPLTimeline,
});
