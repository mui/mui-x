export const DEFAULT_FIELD_PLACEHOLDERS = {
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',
  fieldDayPlaceholder: () => 'DD',
  fieldMonthPlaceholder: (params: { contentType: string }) =>
    params.contentType === 'letter' ? 'MMMM' : 'MM',
  fieldWeekDayPlaceholder: (params: { contentType: string }) =>
    params.contentType === 'letter' ? 'EEEE' : 'EE',
  calendarWeekNumberText: (weekNumber: number) => `${weekNumber}`,
  calendarWeekNumberHeaderText: '#',
};
