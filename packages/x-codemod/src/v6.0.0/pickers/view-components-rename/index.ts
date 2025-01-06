import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import { renameImports } from '../../../util/renameImports';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  renameImports({
    j,
    root,
    packageNames: ['@mui/x-date-pickers', '@mui/x-date-pickers-pro'],
    imports: [
      {
        oldEndpoint: 'CalendarPicker',
        newEndpoint: 'DateCalendar',
        importsMapping: {
          CalendarPicker: 'DateCalendar',
          CalendarPickerProps: 'DateCalendarProps',
          CalendarPickerSlotsComponent: 'DateCalendarSlotsComponent',
          CalendarPickerSlotsComponentsProps: 'DateCalendarSlotsComponentsProps',
          CalendarPickerClasses: 'DateCalendarClasses',
          CalendarPickerClassKey: 'DateCalendarClassKey',
          calendarPickerClasses: 'dateCalendarClasses',
          getCalendarPickerUtilityClass: 'getDateCalendarUtilityClass',
        },
      },
      {
        oldEndpoint: 'MonthPicker',
        newEndpoint: 'MonthCalendar',
        importsMapping: {
          MonthPicker: 'MonthCalendar',
          MonthPickerProps: 'MonthCalendarProps',
          MonthPickerClasses: 'MonthCalendarClasses',
          MonthPickerClassKey: 'MonthCalendarClassKey',
          monthPickerClasses: 'monthCalendarClasses',
          getMonthPickerUtilityClass: 'getMonthCalendarUtilityClass',
        },
      },
      {
        oldEndpoint: 'YearPicker',
        newEndpoint: 'YearCalendar',
        importsMapping: {
          YearPicker: 'YearCalendar',
          YearPickerProps: 'YearCalendarProps',
          YearPickerClasses: 'YearCalendarClasses',
          YearPickerClassKey: 'YearCalendarClassKey',
          yearPickerClasses: 'yearCalendarClasses',
          getYearPickerUtilityClass: 'getYearCalendarUtilityClass',
        },
      },
      {
        oldEndpoint: 'ClockPicker',
        newEndpoint: 'TimeClock',
        importsMapping: {
          ClockPicker: 'TimeClock',
          ClockPickerProps: 'TimeClockProps',
          ClockPickerClasses: 'TimeClockClasses',
          ClockPickerClassKey: 'TimeClockClassKey',
          clockPickerClasses: 'timeClockClasses',
          getClockPickerUtilityClass: 'getTimeClockUtilityClass',
        },
      },
      {
        oldEndpoint: 'CalendarPickerSkeleton',
        newEndpoint: 'DayCalendarSkeleton',
        importsMapping: {
          CalendarPickerSkeleton: 'DayCalendarSkeleton',
          CalendarPickerSkeletonProps: 'DayCalendarSkeletonProps',
          CalendarPickerSkeletonClasses: 'DayCalendarSkeletonClasses',
          CalendarPickerSkeletonClassKey: 'DayCalendarSkeletonClassKey',
          calendarPickerSkeletonClasses: 'dayCalendarSkeletonClasses',
          getCalendarPickerSkeletonUtilityClass: 'getDayCalendarSkeletonUtilityClass',
        },
      },
    ],
  });

  return root.toSource(printOptions);
}
