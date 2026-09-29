import type { SchedulerWeekday } from '../models/translations';
import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const weekdayNames: Record<SchedulerWeekday, string> = {
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

const ruRUDialog: SchedulerDialogTranslations = {
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
  eventActionsToolbarAriaLabel: 'Действия с событием',
  deleteEvent: 'Удалить событие',
  editEvent: 'Редактировать событие',
  showEventDetails: 'Показать подробности',
  eventContextMenuAriaLabel: 'Действия с событием',
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
  recurrenceTimezoneLabel: (timezone) => `Часовой пояс: ${timezone}`,
  recurrenceLabelTimezoneSuffix: (timezone) => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'Повторение',
  recurrenceWeeklyFrequencyLabel: 'нед.',
  recurrenceWeeklyPresetLabel: ({ weekday }) =>
    `Повторяется еженедельно ${recurringWeekdayNames[weekday]}`,
  recurrenceMonthlyFrequencyLabel: 'мес.',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `${dayNumber}-е число месяца`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekday }) =>
    `${weekdayNames[weekday]} последней недели месяца`,
  recurrenceMonthlyLastWeekLabel: ({ weekdayName }) => `${weekdayName}, последняя неделя`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Повторяется ежемесячно ${dayNumber}-го числа`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekday }) =>
    `${weekdayNames[weekday]} ${weekOrdinalNames[ord]} недели месяца`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekdayName }) => `${weekdayName}, ${ord}-я неделя`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'В',
  recurrenceYearlyFrequencyLabel: 'г.',
  recurrenceYearlyPresetLabel: (date) => `Повторяется ежегодно ${date}`,
  noResourceAriaLabel: 'Нет конкретного ресурса',
  selectColorAriaLabel: (color) => `Выберите ${color} в качестве цвета события`,
  resourceLabel: 'Ресурс',
  invalidDateError: 'Введите действительную дату.',
  invalidTimeError: 'Введите действительное время.',
  requiredResourceError: 'Требуется ресурс.',
  saveChanges: 'Сохранить',
  startDateAfterEndDateError: 'Дата окончания не может быть раньше даты начала.',
  startDateLabel: 'Дата начала',
  startTimeAfterEndTimeError: 'Время окончания должно быть позже времени начала.',
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

const ruRUEvent: SchedulerEventTranslations = {
  // Event accessible name
  // eventAriaLabelTimeRange: (start, end) => `${start} to ${end}`,
  // eventAriaLabelDateRange: (start, end) => `From ${start} to ${end}`,
  // eventAriaLabelAllDay: 'All day',
  // eventAriaLabelRecurring: 'Recurring',
  resourceAriaLabel: (resourceName) => `Ресурс: ${resourceName}`,
  // eventAriaLabel: ({
  //   title,
  //   when,
  //   date,
  //   resource,
  //   recurring
  // }) => [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const ruRUCalendar: SchedulerCalendarTranslations = {
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
  startWeekOn: 'Первый день недели',
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

const ruRUTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Название ресурса',
};

export const ruRU: SchedulerLocalization = getSchedulerLocalization({
  dialog: ruRUDialog,
  event: ruRUEvent,
  calendar: ruRUCalendar,
  timeline: ruRUTimeline,
});
