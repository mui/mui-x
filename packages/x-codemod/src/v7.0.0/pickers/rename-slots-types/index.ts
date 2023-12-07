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
  // - import { dayPickerClasses } from '@mui/x-date-pickers'
  // + import { dayCalendarClasses } from '@mui/x-date-pickers'
  matchingImports
    .find(j.ImportSpecifier)
    .filter((path) => Object.keys(rename).includes(path.node.imported.name))
    .replaceWith((path) =>
      j.importSpecifier(j.identifier(rename[path.node.imported.name]), path.value.local),
    );

  // Rename the import usage
  // - dayPickerClasses.root
  // + dayCalendarClasses.root
  root
    .find(j.Identifier)
    .filter((path) => Object.keys(rename).includes(path.node.name))
    .replaceWith((path) => j.identifier(rename[path.node.name]));

  return root.toSource(printOptions);
}
