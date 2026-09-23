import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const esESDialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: 'Color del evento',
  // colorSectionLabel: 'Color',
  dateTimeSectionLabel: 'Fecha y hora',
  resourceColorSectionLabel: 'Recurso y color',
  allDayLabel: 'Todo el día',
  closeButtonAriaLabel: 'Cerrar',
  closeButtonLabel: 'Cerrar',
  // editEventButtonAriaLabel: 'Edit event',
  // deleteEventButtonAriaLabel: 'Delete event',
  // eventActionsToolbarAriaLabel: 'Event actions',
  deleteEvent: 'Eliminar evento',
  // editEvent: 'Edit event',
  // showEventDetails: 'Show details',
  // eventContextMenuAriaLabel: 'Event actions',
  descriptionLabel: 'Descripción',
  endDateLabel: 'Fecha de fin',
  endTimeLabel: 'Hora de fin',
  eventTitleAriaLabel: 'Título del evento',
  generalTabLabel: 'General',
  labelNoResource: 'Sin recurso',
  labelInvalidResource: 'Recurso no válido',
  recurrenceLabel: 'Recurrencia',
  recurrenceNoRepeat: 'No repetir',
  recurrenceCustomRepeat: 'Recurrencia personalizada',
  recurrenceDailyPresetLabel: 'Se repite diariamente',
  recurrenceDailyFrequencyLabel: 'días',
  recurrenceEndsLabel: 'Finaliza',
  recurrenceEndsAfterLabel: 'Después de',
  recurrenceEndsNeverLabel: 'Nunca',
  recurrenceEndsUntilLabel: 'Hasta',
  recurrenceEndsTimesLabel: 'veces',
  recurrenceEveryLabel: 'Cada',
  recurrenceRepeatLabel: 'Repetir',
  recurrenceTabLabel: 'Recurrencia',
  // recurrenceTimezoneLabel: timezone => `Timezone: ${timezone}`,
  // recurrenceLabelTimezoneSuffix: timezone => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'Recurrencia',
  recurrenceWeeklyFrequencyLabel: 'semanas',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) => `Se repite semanalmente el ${weekdayName}`,
  recurrenceMonthlyFrequencyLabel: 'meses',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Día ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) => `${weekDay} de la última semana del mes`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay} última semana`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Se repite mensualmente el día ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${weekDay} semana ${ord} del mes`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay} semana ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'El',
  recurrenceYearlyFrequencyLabel: 'años',
  recurrenceYearlyPresetLabel: (date) => `Se repite anualmente el ${date}`,
  noResourceAriaLabel: 'Sin recurso',
  // selectColorAriaLabel: color => `Select ${color} as event color`,
  resourceLabel: 'Recurso',
  // invalidDateError: 'Enter a valid date.',
  // invalidTimeError: 'Enter a valid time.',
  requiredResourceError: 'Debes seleccionar un recurso.',
  saveChanges: 'Guardar',
  startDateAfterEndDateError: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
  startDateLabel: 'Fecha de inicio',
  startTimeAfterEndTimeError: 'La hora de fin debe ser posterior a la hora de inicio.',
  startTimeLabel: 'Hora de inicio',

  // RecurringScopeDialog
  all: 'Todos los eventos',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  onlyThis: 'Solo este evento',
  radioGroupAriaLabel: 'Alcance de edición de eventos recurrentes',
  thisAndFollowing: 'Este y los eventos siguientes',
  title: 'Aplicar este cambio a:',
};

const esESCalendar: SchedulerCalendarTranslations = {
  // ResourcesTree
  resourcesLabel: 'Recursos',

  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Día',
  month: 'Mes',
  other: 'Otro',
  today: 'Hoy',
  week: 'Semana',
  time: 'Hora',
  days: 'Días',
  months: 'Meses',
  weeks: 'Semanas',
  years: 'Años',

  // DateNavigator
  closeSidePanel: 'Cerrar panel lateral',
  openSidePanel: 'Abrir panel lateral',

  // SidePanelDrawer (small screens)
  // openMenu: 'Open menu',

  // Preferences menu
  amPm12h: '12 horas (1:00PM)',
  hour24h: '24 horas (13:00)',
  preferencesMenu: 'Configuración',
  showWeekends: 'Mostrar fines de semana',
  showEmptyDaysInAgenda: 'Mostrar días vacíos',
  showWeekNumber: 'Mostrar número de semana',
  timeFormat: 'Formato de hora',
  viewSpecificOptions: (view) => `Opciones de la vista ${view}`,
  // startWeekOn: 'Start week on',
  // weekdaySunday: 'Sunday',
  // weekdayMonday: 'Monday',
  // weekdaySaturday: 'Saturday',

  // WeekView
  allDay: 'Todo el día',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} más..`,
  nextTimeSpan: (timeSpan) => `Siguiente ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `${timeSpan} anterior`,
  weekAbbreviation: 'S',
  weekNumberAriaLabel: (weekNumber) => `Semana ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Finaliza ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Calendario',
  miniCalendarGoToPreviousMonth: 'Mostrar el mes anterior en el calendario',
  miniCalendarGoToNextMonth: 'Mostrar el mes siguiente en el calendario',

  // Main calendar region
  // calendarContentAriaLabel: 'Calendar content',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Nombre del recurso',
};

const esESEvent: SchedulerEventTranslations = {
  // Event accessible name
  eventAriaLabelTimeRange: (start, end) => `de ${start} a ${end}`,
  eventAriaLabelDateRange: (start, end) => `Del ${start} al ${end}`,
  eventAriaLabelAllDay: 'Todo el día',
  eventAriaLabelRecurring: 'Recurrente',
  resourceAriaLabel: (resourceName) => `Recurso: ${resourceName}`,
  // eventAriaLabel: ({
  //   title,
  //   when,
  //   date,
  //   resource,
  //   recurring
  // }) => [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const esESTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Nombre del recurso',
};

export const esES: SchedulerLocalization = getSchedulerLocalization({
  dialog: esESDialog,
  event: esESEvent,
  calendar: esESCalendar,
  timeline: esESTimeline,
});
