"use strict";
'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickersRangeCalendarHeader = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var PickersCalendarHeader_1 = require("@mui/x-date-pickers/PickersCalendarHeader");
var internals_1 = require("@mui/x-date-pickers/internals");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var PickersRangeCalendarHeaderContentMultipleCalendars = (0, styles_1.styled)(internals_1.PickersArrowSwitcher)({
    padding: '12px 16px 4px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});
var PickersRangeCalendarHeader = React.forwardRef(function PickersRangeCalendarHeader(props, ref) {
    var adapter = (0, hooks_1.usePickerAdapter)();
    var translations = (0, hooks_1.usePickerTranslations)();
    var calendars = props.calendars, month = props.month, monthIndex = props.monthIndex, labelId = props.labelId, other = __rest(props, ["calendars", "month", "monthIndex", "labelId"]);
    var format = other.format, slots = other.slots, slotProps = other.slotProps, currentMonth = other.currentMonth, onMonthChange = other.onMonthChange, disableFuture = other.disableFuture, disablePast = other.disablePast, minDate = other.minDate, maxDate = other.maxDate, timezone = other.timezone, 
    // omit props that are not used in the PickersArrowSwitcher
    reduceAnimations = other.reduceAnimations, views = other.views, view = other.view, otherRangeProps = __rest(other, ["format", "slots", "slotProps", "currentMonth", "onMonthChange", "disableFuture", "disablePast", "minDate", "maxDate", "timezone", "reduceAnimations", "views", "view"]);
    var isNextMonthDisabled = (0, internals_1.useNextMonthDisabled)(currentMonth, {
        disableFuture: disableFuture,
        maxDate: maxDate,
        timezone: timezone,
    });
    var isPreviousMonthDisabled = (0, internals_1.usePreviousMonthDisabled)(currentMonth, {
        disablePast: disablePast,
        minDate: minDate,
        timezone: timezone,
    });
    if (calendars === 1) {
        return <PickersCalendarHeader_1.PickersCalendarHeader {...other} labelId={labelId} ref={ref}/>;
    }
    var selectNextMonth = function () { return onMonthChange(adapter.addMonths(currentMonth, 1)); };
    var selectPreviousMonth = function () { return onMonthChange(adapter.addMonths(currentMonth, -1)); };
    return (<PickersRangeCalendarHeaderContentMultipleCalendars {...otherRangeProps} ref={ref} onGoToPrevious={selectPreviousMonth} onGoToNext={selectNextMonth} isPreviousHidden={monthIndex !== 0} isPreviousDisabled={isPreviousMonthDisabled} previousLabel={translations.previousMonth} isNextHidden={monthIndex !== calendars - 1} isNextDisabled={isNextMonthDisabled} nextLabel={translations.nextMonth} slots={slots} slotProps={slotProps} labelId={labelId}>
      {adapter.formatByString(month, format !== null && format !== void 0 ? format : "".concat(adapter.formats.month, " ").concat(adapter.formats.year))}
    </PickersRangeCalendarHeaderContentMultipleCalendars>);
});
exports.PickersRangeCalendarHeader = PickersRangeCalendarHeader;
PickersRangeCalendarHeader.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The number of calendars rendered.
     */
    calendars: prop_types_1.default.oneOf([1, 2, 3]).isRequired,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    currentMonth: prop_types_1.default.object.isRequired,
    disabled: prop_types_1.default.bool,
    disableFuture: prop_types_1.default.bool,
    disablePast: prop_types_1.default.bool,
    /**
     * Format used to display the date.
     * @default `${adapter.formats.month} ${adapter.formats.year}`
     */
    format: prop_types_1.default.string,
    /**
     * Id of the calendar text element.
     * It is used to establish an `aria-labelledby` relationship with the calendar `grid` element.
     */
    labelId: prop_types_1.default.string,
    maxDate: prop_types_1.default.object.isRequired,
    minDate: prop_types_1.default.object.isRequired,
    /**
     * Month used for this header.
     */
    month: prop_types_1.default.object.isRequired,
    /**
     * Index of the month used for this header.
     */
    monthIndex: prop_types_1.default.number.isRequired,
    onMonthChange: prop_types_1.default.func.isRequired,
    onViewChange: prop_types_1.default.func,
    reduceAnimations: prop_types_1.default.bool.isRequired,
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    timezone: prop_types_1.default.string.isRequired,
    view: prop_types_1.default.oneOf(['day', 'month', 'year']).isRequired,
    views: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['day', 'month', 'year']).isRequired).isRequired,
};
