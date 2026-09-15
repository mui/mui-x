import type {
  EventEditingLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type { SchedulerLocalization } from '../utils/getSchedulerLocalization';

const weekdayNames = {
  sunday: 'воскресенье',
  monday: 'понедельник',
  tuesday: 'вторник',
  wednesday: 'среда',
  thursday: 'четверг',
  friday: 'пятница',
  saturday: 'суббота',
};

const recurringWeekdayNames = {
  sunday: 'по воскресеньям',
  monday: 'по понедельникам',
  tuesday: 'по вторникам',
  wednesday: 'по средам',
  thursday: 'по четвергам',
  friday: 'по пятницам',
  saturday: 'по субботам',
};

const weekOrdinalNames: Record<number, string> = {
  1: 'первой',
  2: 'второй',
  3: 'третьей',
  4: 'четвёртой',
};

const ruRUDialog: Partial<EventEditingLocaleText> = {
  // EventDialog
  colorPickerLabel: 'Цвет события',
  colorSectionLabel: 'Цвет',
  dateTimeSectionLabel: 'Дата и время',
  resourceColorSectionLabel: 'Ресурс и цвет',
  allDayLabel: 'Весь день',
  closeButtonAriaLabel: 'Закрыть',
  closeButtonLabel: 'Закрыть',
  editEventButtonAriaLabel: 'Редактировать событие',
  deleteEventButtonAriaLabel: 'Удалить событие',
  eventActionsToolbarAriaLabel: 'Действия события',
  deleteEvent: 'Удалить событие',
  editEvent: 'Редактировать событие',
  showEventDetails: 'Показать подробности',
  eventContextMenuAriaLabel: 'Действия события',
  descriptionLabel: 'Описание',
  endDateLabel: 'Дата окончания',
  endTimeLabel: 'Время окончания',
  eventTitleAriaLabel: 'Название события',
  generalTabLabel: 'Общие',
  labelNoResource: 'Нет ресурса',
  labelInvalidResource: 'Недопустимый ресурс',
  recurrenceLabel: 'Повторение',
  recurrenceNoRepeat: 'Не повторять',
  recurrenceCustomRepeat: 'Пользовательское правило повторения',
  recurrenceDailyPresetLabel: 'Повторяется ежедневно',
  recurrenceDailyFrequencyLabel: 'дн.',
  recurrenceEndsLabel: 'Заканчивается',
  recurrenceEndsAfterLabel: 'После',
  recurrenceEndsNeverLabel: 'Никогда',
  recurrenceEndsUntilLabel: 'До',
  recurrenceEndsTimesLabel: 'повт.',
  recurrenceEveryLabel: 'Каждые',
  recurrenceRepeatLabel: 'Повторение',
  recurrenceTabLabel: 'Повторение',
  recurrenceMainSelectCustomLabel: 'Повторение',
  recurrenceWeeklyFrequencyLabel: 'нед.',
  recurrenceWeeklyPresetLabel: ({ weekday }) =>
    `Повторяется еженедельно ${recurringWeekdayNames[weekday]}`,
  recurrenceMonthlyFrequencyLabel: 'мес.',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `${dayNumber}-е число месяца`,
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) =>
    `${weekdayNames[weekDay as keyof typeof weekdayNames] ?? weekDay} последней недели месяца`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay} последней недели`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Повторяется ежемесячно ${dayNumber}-го числа`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) =>
    `${weekdayNames[weekDay as keyof typeof weekdayNames] ?? weekDay} ${weekOrdinalNames[ord]} недели месяца`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay}, ${ord}-я неделя`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'В',
  recurrenceYearlyFrequencyLabel: 'г.',
  recurrenceYearlyPresetLabel: (date) => `Повторяется ежегодно ${date}`,
  noResourceAriaLabel: 'Нет конкретного ресурса',
  selectColorAriaLabel: (color) => `Выберите ${color} в качестве цвета события`,
  resourceLabel: 'Ресурс',
  invalidDateError: 'Введите действительную дату',
  invalidTimeError: 'Введите действительное время',
  requiredResourceError: 'Требуется ресурс',
  saveChanges: 'Сохранить',
  startDateAfterEndDateError: 'Дата окончания не может быть раньше даты начала',
  startDateLabel: 'Дата начала',
  startTimeAfterEndTimeError: 'Время окончания должно быть позже времени начала',
  startTimeLabel: 'Время начала',

  // RecurringScopeDialog
  all: 'Все события',
  cancel: 'Отмена',
  confirm: 'Подтвердить',
  onlyThis: 'Только это событие',
  radioGroupAriaLabel: 'Редактирование повторяющихся событий',
  thisAndFollowing: 'Это и последующие события',
  title: 'К каким событиям применить изменение:',
};

const ruRUCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventEditingLocaleText>> = {
  // ResourcesTree
  resourcesLabel: 'Ресурсы',

  // ViewSwitcher
  agenda: 'Расписание',
  day: 'День',
  month: 'Месяц',
  other: 'Другое',
  today: 'Сегодня',
  week: 'Неделя',
  time: 'Время',
  days: 'Дни',
  months: 'Месяцы',
  weeks: 'Недели',
  years: 'Годы',

  // DateNavigator
  closeSidePanel: 'Закрыть боковую панель',
  openSidePanel: 'Открыть боковую панель',

  // SidePanelDrawer (small screens)
  openMenu: 'Открыть меню',

  // Preferences menu
  amPm12h: '12-часовой формат (1:00PM)',
  hour24h: '24-часовой формат (13:00)',
  preferencesMenu: 'Настройки',
  showWeekends: 'Показывать выходные',
  showEmptyDaysInAgenda: 'Показывать пустые дни',
  showWeekNumber: 'Показывать номер недели',
  timeFormat: 'Формат времени',
  viewSpecificOptions: (view) => {
    const viewNames = {
      agenda: 'Расписание',
      day: 'День',
      week: 'Неделя',
      month: 'Месяц',
    };
    return `Настройки режима «${viewNames[view]}»`;
  },
  startWeekOn: 'Неделя начинается с',
  weekdaySunday: 'Воскресенье',
  weekdayMonday: 'Понедельник',
  weekdaySaturday: 'Суббота',

  // WeekView
  allDay: 'Весь день',
  hiddenEvents: (hiddenEventsCount) => `Ещё ${hiddenEventsCount}…`,
  nextTimeSpan: (timeSpan) => {
    const labels = {
      agenda: 'Следующий период',
      day: 'Следующий день',
      week: 'Следующая неделя',
      month: 'Следующий месяц',
    };
    return labels[timeSpan];
  },
  previousTimeSpan: (timeSpan) => {
    const labels = {
      agenda: 'Предыдущий период',
      day: 'Предыдущий день',
      week: 'Предыдущая неделя',
      month: 'Предыдущий месяц',
    };
    return labels[timeSpan];
  },
  resourceAriaLabel: (resourceName) => `Ресурс: ${resourceName}`,
  weekAbbreviation: 'Нед.',
  weekNumberAriaLabel: (weekNumber) => `Неделя ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Заканчивается ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Календарь',
  miniCalendarGoToPreviousMonth: 'Показать предыдущий месяц в календаре',
  miniCalendarGoToNextMonth: 'Показать следующий месяц в календаре',

  // Main calendar region
  calendarContentAriaLabel: 'Содержимое календаря',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Название ресурса',
};

const ruRUTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventEditingLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Название ресурса',
};

export const ruRU: SchedulerLocalization = getSchedulerLocalization({
  dialog: ruRUDialog,
  calendar: ruRUCalendar,
  timeline: ruRUTimeline,
});
