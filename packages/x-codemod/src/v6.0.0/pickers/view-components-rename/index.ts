import { ASTPath, ImportDeclaration } from 'jscodeshift';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const SUB_PACKAGES = {
  CalendarPicker: 'DateCalendar',
  CalendarPickerSkeleton: 'DayCalendarSkeleton',
  MonthPicker: 'MonthCalendar',
  YearPicker: 'YearCalendar',
  ClockPicker: 'TimeClock',
};

const VARIABLES = {
  // Date Calendar
  CalendarPicker: 'DateCalendar',
  CalendarPickerProps: 'DateCalendarProps',
  CalendarPickerSlotsComponent: 'DateCalendarSlotsComponent',
  CalendarPickerSlotsComponentsProps: 'DateCalendarSlotsComponentsProps',
  CalendarPickerClasses: 'DateCalendarClasses',
  CalendarPickerClassKey: 'DateCalendarClassKey',
  calendarPickerClasses: 'dateCalendarClasses',
  getCalendarPickerUtilityClass: 'getDateCalendarUtilityClass',

  // Month Calendar
  MonthPicker: 'MonthCalendar',
  MonthPickerProps: 'MonthCalendarProps',
  MonthPickerClasses: 'MonthCalendarClasses',
  MonthPickerClassKey: 'MonthCalendarClassKey',
  monthPickerClasses: 'monthCalendarClasses',
  getMonthPickerUtilityClass: 'getMonthCalendarUtilityClass',

  YearPicker: 'YearCalendar',
  YearPickerProps: 'YearCalendarProps',
  YearPickerClasses: 'YearCalendarClasses',
  YearPickerClassKey: 'YearCalendarClassKey',
  yearPickerClasses: 'yearCalendarClasses',
  getYearPickerUtilityClass: 'getYearCalendarUtilityClass',

  ClockPicker: 'TimeClock',
  ClockPickerProps: 'TimeClockProps',
  ClockPickerClasses: 'TimeClockClasses',
  ClockPickerClassKey: 'TimeClockClassKey',
  clockPickerClasses: 'timeClockClasses',
  getClockPickerUtilityClass: 'getTimeClockUtilityClass',

  CalendarPickerSkeleton: 'DayCalendarSkeleton',
  CalendarPickerSkeletonProps: 'DayCalendarSkeletonProps',
  CalendarPickerSkeletonClasses: 'DayCalendarSkeletonClasses',
  CalendarPickerSkeletonClassKey: 'DayCalendarSkeletonClassKey',
  calendarPickerSkeletonClasses: 'dayCalendarSkeletonClasses',
  getCalendarPickerSkeletonUtilityClass: 'getDayCalendarSkeletonUtilityClass',
};

const PACKAGE_REGEXP = /@mui\/x-date-pickers(-pro|)(\/(.*)|)/;

const matchImport = (path: ASTPath<ImportDeclaration>) =>
  (path.node.source.value?.toString() ?? '').match(PACKAGE_REGEXP);
export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const matchingImports = root.find(j.ImportDeclaration).filter((path) => !!matchImport(path));

  // Rename the import specifiers
  // - import { MonthPicker } from '@mui/x-date-pickers/MonthPicker'
  // + import { MonthCalendar } from '@mui/x-date-pickers/MonthPicker'
  matchingImports
    .find(j.ImportSpecifier)
    .filter((path) => VARIABLES.hasOwnProperty(path.node.imported.name))
    .replaceWith((path) => j.importSpecifier(j.identifier(VARIABLES[path.node.imported.name])));

  // Rename the nested import declarations
  // - import {} from '@mui/x-date-pickers/MonthPicker'
  // + import {} from '@mui/x-date-pickers/MonthCalendar'
  matchingImports
    .filter((path) => SUB_PACKAGES.hasOwnProperty(matchImport(path)?.[3] ?? ''))
    .replaceWith((path) => {
      const subPackage = matchImport(path)![3];
      const importPath = path.node.source.value?.toString() ?? '';

      return j.importDeclaration(
        path.node.specifiers, // copy over the existing import specifiers
        j.stringLiteral(importPath.replace(subPackage, SUB_PACKAGES[subPackage])), // Replace the source with our new source
      );
    });

  // Rename the import usage
  // - <CalendarPicker />
  // + <DateCalendar />
  root
    .find(j.Identifier)
    .filter((path) => VARIABLES.hasOwnProperty(path.node.name))
    .replaceWith((path) => j.identifier(VARIABLES[path.node.name]));

  return root.toSource(printOptions);
}
