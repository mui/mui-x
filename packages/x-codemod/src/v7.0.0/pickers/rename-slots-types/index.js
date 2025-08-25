"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var PACKAGE_REGEXP = /@mui\/x-date-pickers(-pro|)(\/(.*)|)/;
var rename = {
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
var matchImport = function (path) { var _a, _b; return ((_b = (_a = path.node.source.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '').match(PACKAGE_REGEXP); };
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    var matchingImports = root.find(j.ImportDeclaration).filter(function (path) { return !!matchImport(path); });
    // Rename the import specifiers
    // - import { DayCalendarSlotsComponent } from '@mui/x-date-pickers'
    // + import { DayCalendarSlots } from '@mui/x-date-pickers'
    matchingImports
        .find(j.ImportSpecifier)
        .filter(function (path) { return Object.keys(rename).includes(path.node.imported.name); })
        .replaceWith(function (path) {
        return j.importSpecifier(j.identifier(rename[path.node.imported.name]), path.value.local);
    });
    // Rename the import usage
    // - DayCalendarSlotsComponent
    // + DayCalendarSlots
    root
        .find(j.Identifier)
        .filter(function (path) { return Object.keys(rename).includes(path.node.name); })
        .replaceWith(function (path) { return j.identifier(rename[path.node.name]); });
    return root.toSource(printOptions);
}
