import type {
  EventDialogLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import {
  getSchedulerLocalization,
  type SchedulerLocalization,
} from '../utils/getSchedulerLocalization';

const esESDialog: Partial<EventDialogLocaleText> = {
  // EventDialog
  colorPickerLabel: 'Color del evento',
  dateTimeSectionLabel: 'Fecha y hora',
  resourceColorSectionLabel: 'Recurso y color',
  allDayLabel: 'Todo el día',
  closeButtonAriaLabel: 'Cerrar modal',
  closeButtonLabel: 'Cerrar',
  deleteEvent: 'Eliminar evento',
  descriptionLabel: 'Descripción',
  editDisabledNotice: 'La edición no está disponible actualmente para eventos recurrentes',
  endDateLabel: 'Fecha de fin',
  endTimeLabel: 'Hora de fin',
  eventTitleAriaLabel: 'Título del evento',
  generalTabLabel: 'General',
  labelNoResource: 'Sin recurso',
  labelInvalidResource: 'Recurso no válido',
  recurrenceLabel: 'Recurrencia',
  recurrenceNoRepeat: 'No repetir',
  recurrenceCustomRepeat: 'Regla de repetición personalizada',
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
  recurrenceMainSelectCustomLabel: 'Selecciona tu patrón de recurrencia',
  recurrenceWeeklyFrequencyLabel: 'semanas',
  recurrenceWeeklyPresetLabel: (weekday) => `Se repite semanalmente el ${weekday}`,
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
  noResourceAriaLabel: 'Sin recurso específico',
  resourceLabel: 'Recurso',
  saveChanges: 'Guardar cambios',
  startDateAfterEndDateError: 'La fecha/hora de inicio debe ser anterior a la fecha/hora de fin.',
  startDateLabel: 'Fecha de inicio',
  startTimeLabel: 'Hora de inicio',

  // ScopeDialog
  all: 'Todos los eventos de la serie',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  onlyThis: 'Solo este evento',
  radioGroupAriaLabel: 'Ámbito de edición de eventos recurrentes',
  thisAndFollowing: 'Este y los siguientes eventos',
  title: 'Aplicar este cambio a:',

  // General
  loading: 'Cargando...',
};

const esESCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>> = {
  // ResourcesLegend
  hideEventsLabel: (resourceName) => `Ocultar eventos de ${resourceName}`,
  resourcesLabel: 'Recursos',
  resourcesLegendSectionLabel: 'Leyenda de recursos',
  showEventsLabel: (resourceName) => `Mostrar eventos de ${resourceName}`,

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

  // Preferences menu
  amPm12h: '12 horas (1:00PM)',
  hour24h: '24 horas (13:00)',
  preferencesMenu: 'Configuración',
  showWeekends: 'Mostrar fines de semana',
  showEmptyDaysInAgenda: 'Mostrar días vacíos',
  showWeekNumber: 'Mostrar número de semana',
  timeFormat: 'Formato de hora',
  viewSpecificOptions: (view) => `Opciones de la vista ${view}`,

  // WeekView
  allDay: 'Todo el día',

  // MonthView
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} más..`,
  nextTimeSpan: (timeSpan) => `Siguiente ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `${timeSpan} anterior`,
  resourceAriaLabel: (resourceName) => `Recurso: ${resourceName}`,
  weekAbbreviation: 'S',
  weekNumberAriaLabel: (weekNumber) => `Semana ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Finaliza ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Calendario',
  miniCalendarGoToPreviousMonth: 'Mostrar el mes anterior en el calendario',
  miniCalendarGoToNextMonth: 'Mostrar el mes siguiente en el calendario',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Nombre del recurso',
};

const esESTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Nombre del recurso',
};

export const esES: SchedulerLocalization = getSchedulerLocalization({
  dialog: esESDialog,
  calendar: esESCalendar,
  timeline: esESTimeline,
});
