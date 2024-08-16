import { ASTPath, ImportDeclaration } from 'jscodeshift';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const PACKAGE_REGEXP = /@mui\/x-date-pickers(-pro|)(\/(.*)|)/;

const rename = {
  DateCalendarSlotsComponent: 'DateCalendarSlots',
  DateCalendarSlotsComponentsProps: 'DateCalendarSlotProps',
  DatePickerSlotsComponents: 'DatePickerSlots',
  DatePickerSlotsComponentsProps: 'DatePickerSlotProps',
  DateTimePickerSlotsComponents: 'DateTimePickerSlots',
  DateTimePickerSlotsComponentsProps: 'DateTimePickerSlotProps',
  DesktopDatePickerSlotsComponent: 'DesktopDatePickerSlots',
  DesktopDatePickerSlotsComponentsProps: 'DesktopDatePickerSlotProps',
  DesktopDateTimePickerSlotsComponent: 'DesktopDateTimePickerSlots',
  DesktopDateTimePickerSlotsComponentsProps: 'DesktopDateTimePickerSlotProps',
  DesktopTimePickerSlotsComponent: 'DesktopTimePickerSlots',
  DesktopTimePickerSlotsComponentsProps: 'DesktopTimePickerSlotProps',
  DigitalClockSlotsComponent: 'DigitalClockSlots',
  DigitalClockSlotsComponentsProps: 'DigitalClockSlotProps',
  ExportedPickersLayoutSlotsComponent: 'ExportedPickersLayoutSlots',
  ExportedPickersLayoutSlotsComponentsProps: 'ExportedPickersLayoutSlotProps',
  MobileDatePickerSlotsComponent: 'MobileDatePickerSlots',
  MobileDatePickerSlotsComponentsProps: 'MobileDatePickerSlotProps',
  MobileDateTimePickerSlotsComponent: 'MobileDateTimePickerSlots',
  MobileDateTimePickerSlotsComponentsProps: 'MobileDateTimePickerSlotProps',
  MobileTimePickerSlotsComponent: 'MobileTimePickerSlots',
  MobileTimePickerSlotsComponentsProps: 'MobileTimePickerSlotProps',
  MultiSectionDigitalClockSlotsComponent: 'MultiSectionDigitalClockSlots',
  MultiSectionDigitalClockSlotsComponentsProps: 'MultiSectionDigitalClockSlotProps',
  PickersCalendarHeaderSlotsComponent: 'PickersCalendarHeaderSlots',
  PickersCalendarHeaderSlotsComponentsProps: 'PickersCalendarHeaderSlotProps',
  PickersLayoutSlotsComponent: 'PickersLayoutSlots',
  PickersLayoutSlotsComponentsProps: 'PickersLayoutSlotProps',
  StaticDatePickerSlotsComponent: 'StaticDatePickerSlots',
  StaticDatePickerSlotsComponentsProps: 'StaticDatePickerSlotProps',
  StaticDateTimePickerSlotsComponent: 'StaticDateTimePickerSlots',
  StaticDateTimePickerSlotsComponentsProps: 'StaticDateTimePickerSlotProps',
  StaticTimePickerSlotsComponent: 'StaticTimePickerSlots',
  StaticTimePickerSlotsComponentsProps: 'StaticTimePickerSlotProps',
  TimeClockSlotsComponent: 'TimeClockSlots',
  TimeClockSlotsComponentsProps: 'TimeClockSlotProps',
  TimePickerSlotsComponents: 'TimePickerSlots',
  TimePickerSlotsComponentsProps: 'TimePickerSlotProps',
  DateRangeCalendarSlotsComponent: 'DateRangeCalendarSlots',
  DateRangeCalendarSlotsComponentsProps: 'DateRangeCalendarSlotProps',
  DateRangePickerSlotsComponents: 'DateRangePickerSlots',
  DateRangePickerSlotsComponentsProps: 'DateRangePickerSlotProps',
  DesktopDateRangePickerSlotsComponent: 'DesktopDateRangePickerSlots',
  DesktopDateRangePickerSlotsComponentsProps: 'DesktopDateRangePickerSlotProps',
  MobileDateRangePickerSlotsComponent: 'MobileDateRangePickerSlots',
  MobileDateRangePickerSlotsComponentsProps: 'MobileDateRangePickerSlotProps',
  StaticDateRangePickerSlotsComponent: 'StaticDateRangePickerSlots',
  StaticDateRangePickerSlotsComponentsProps: 'StaticDateRangePickerSlotProps',

  // Next elements are internal types
  DayCalendarSlotsComponent: 'DayCalendarSlots',
  DayCalendarSlotsComponentsProps: 'DayCalendarSlotProps',
  SingleInputTimeRangeFieldSlotsComponent: 'SingleInputTimeRangeFieldSlots',
  SingleInputTimeRangeFieldSlotsComponentsProps: 'SingleInputTimeRangeFieldSlotProps',
  SingleInputDateRangeFieldSlotsComponentsProps: 'SingleInputDateRangeFieldSlotProps',
  SingleInputDateRangeFieldSlotsComponent: 'SingleInputDateRangeFieldSlots',
  SingleInputDateTimeRangeFieldSlotsComponent: 'SingleInputDateTimeRangeFieldSlots',
  SingleInputDateTimeRangeFieldSlotsComponentsProps: 'SingleInputDateTimeRangeFieldSlotProps',
  UseMobileRangePickerSlotsComponent: 'UseMobileRangePickerSlots',
  UseMobileRangePickerSlotsComponentsProps: 'UseMobileRangePickerSlotProps',
  BaseDateRangePickerSlotsComponent: 'BaseDateRangePickerSlots',
  BaseDateRangePickerSlotsComponentsProps: 'BaseDateRangePickerSlotProps',
  PickersArrowSwitcherSlotsComponent: 'PickersArrowSwitcherSlots',
  PickersArrowSwitcherSlotsComponentsProps: 'PickersArrowSwitcherSlotProps',
  PickersArrowSwitcherComponentsPropsOverrides: 'PickersArrowSwitcherSlotPropsOverrides',
  UseStaticRangePickerSlotsComponent: 'UseStaticRangePickerSlots',
  UseStaticRangePickerSlotsComponentsProps: 'UseStaticRangePickerSlotProps',
  PickersModalDialogSlotsComponent: 'PickersModalDialogSlots',
  PickersModalDialogSlotsComponentsProps: 'PickersModalDialogSlotProps',
  RangePickerFieldSlotsComponent: 'RangePickerFieldSlots',
  RangePickerFieldSlotsComponentsProps: 'RangePickerFieldSlotProps',
  FieldSlotsComponents: 'FieldSlots',
  FieldSlotsComponentsProps: 'FieldSlotProps',
  PickersPopperSlotsComponent: 'PickersPopperSlots',
  PickersPopperSlotsComponentsProps: 'PickersPopperSlotProps',
  UseDesktopRangePickerSlotsComponent: 'UseDesktopRangePickerSlots',
  UseDesktopRangePickerSlotsComponentsProps: 'UseDesktopRangePickerSlotProps',
  MultiInputFieldSlotRootProps: 'MultiInputFieldSlotRootProps',
  MultiInputFieldSlotTextFieldProps: 'MultiInputFieldSlotTextFieldProps',
  UseDesktopPickerSlotsComponent: 'UseDesktopPickerSlots',
  UseDesktopPickerSlotsComponentsProps: 'UseDesktopPickerSlotProps',
  ExportedUseDesktopPickerSlotsComponentsProps: 'ExportedUseDesktopPickerSlotProps',
  BaseDatePickerSlotsComponent: 'BaseDatePickerSlots',
  BaseDatePickerSlotsComponentsProps: 'BaseDatePickerSlotProps',
  UseStaticPickerSlotsComponent: 'UseStaticPickerSlots',
  UseStaticPickerSlotsComponentsProps: 'UseStaticPickerSlotProps',
  BaseDateTimePickerSlotsComponent: 'BaseDateTimePickerSlots',
  BaseDateTimePickerSlotsComponentsProps: 'BaseDateTimePickerSlotProps',
  BaseTimePickerSlotsComponent: 'BaseTimePickerSlots',
  BaseTimePickerSlotsComponentsProps: 'BaseTimePickerSlotProps',
  UseMobilePickerSlotsComponent: 'UseMobilePickerSlots',
  UseMobilePickerSlotsComponentsProps: 'UseMobilePickerSlotProps',
  ExportedUseMobilePickerSlotsComponentsProps: 'ExportedUseMobilePickerSlotProps',
  DateTimeFieldSlotsComponent: 'DateTimeFieldSlots',
  DateTimeFieldSlotsComponentsProps: 'DateTimeFieldSlotProps',
  TimeFieldSlotsComponent: 'TimeFieldSlots',
  TimeFieldSlotsComponentsProps: 'TimeFieldSlotProps',
  DateFieldSlotsComponent: 'DateFieldSlots',
  DateFieldSlotsComponentsProps: 'DateFieldSlotProps',
  MultiInputDateRangeFieldSlotsComponent: 'MultiInputDateRangeFieldSlots',
  MultiInputDateRangeFieldSlotsComponentsProps: 'MultiInputDateRangeFieldSlotProps',
  MultiInputDateTimeRangeFieldSlotsComponent: 'MultiInputDateTimeRangeFieldSlots',
  MultiInputDateTimeRangeFieldSlotsComponentsProps: 'MultiInputDateTimeRangeFieldSlotProps',
  MultiInputTimeRangeFieldSlotsComponent: 'MultiInputTimeRangeFieldSlots',
  MultiInputTimeRangeFieldSlotsComponentsProps: 'MultiInputTimeRangeFieldSlotProps',
};

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
  // - import { DayCalendarSlotsComponent } from '@mui/x-date-pickers'
  // + import { DayCalendarSlots } from '@mui/x-date-pickers'
  matchingImports
    .find(j.ImportSpecifier)
    .filter((path) => Object.keys(rename).includes(path.node.imported.name))
    .replaceWith((path) =>
      j.importSpecifier(j.identifier(rename[path.node.imported.name]), path.value.local),
    );

  // Rename the import usage
  // - DayCalendarSlotsComponent
  // + DayCalendarSlots
  root
    .find(j.Identifier)
    .filter((path) => Object.keys(rename).includes(path.node.name))
    .replaceWith((path) => j.identifier(rename[path.node.name]));

  return root.toSource(printOptions);
}
