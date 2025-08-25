"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDateRangeViewCalendar = void 0;
var React = require("react");
var internals_1 = require("@mui/x-date-pickers/internals");
var DateRangeCalendar_1 = require("../DateRangeCalendar");
/**
 * We don't pass all the props down to `DateRangeCalendar`,
 * because otherwise some unwanted props would be passed to the HTML element.
 */
var renderDateRangeViewCalendar = function (_a) {
    var views = _a.views, view = _a.view, onViewChange = _a.onViewChange, focusedView = _a.focusedView, onFocusedViewChange = _a.onFocusedViewChange, value = _a.value, defaultValue = _a.defaultValue, referenceDate = _a.referenceDate, onChange = _a.onChange, className = _a.className, classes = _a.classes, disableFuture = _a.disableFuture, disablePast = _a.disablePast, minDate = _a.minDate, maxDate = _a.maxDate, shouldDisableDate = _a.shouldDisableDate, reduceAnimations = _a.reduceAnimations, onMonthChange = _a.onMonthChange, calendars = _a.calendars, currentMonthCalendarPosition = _a.currentMonthCalendarPosition, slots = _a.slots, slotProps = _a.slotProps, loading = _a.loading, renderLoading = _a.renderLoading, disableHighlightToday = _a.disableHighlightToday, readOnly = _a.readOnly, disabled = _a.disabled, showDaysOutsideCurrentMonth = _a.showDaysOutsideCurrentMonth, dayOfWeekFormatter = _a.dayOfWeekFormatter, disableAutoMonthSwitching = _a.disableAutoMonthSwitching, sx = _a.sx, autoFocus = _a.autoFocus, fixedWeekNumber = _a.fixedWeekNumber, disableDragEditing = _a.disableDragEditing, displayWeekNumber = _a.displayWeekNumber, timezone = _a.timezone, availableRangePositions = _a.availableRangePositions;
    return (<DateRangeCalendar_1.DateRangeCalendar view={view} views={views} onViewChange={onViewChange} focusedView={focusedView && (0, internals_1.isDatePickerView)(focusedView) ? focusedView : null} onFocusedViewChange={onFocusedViewChange} value={value} defaultValue={defaultValue} referenceDate={referenceDate} onChange={onChange} className={className} classes={classes} disableFuture={disableFuture} disablePast={disablePast} minDate={minDate} maxDate={maxDate} shouldDisableDate={shouldDisableDate} reduceAnimations={reduceAnimations} onMonthChange={onMonthChange} calendars={calendars} currentMonthCalendarPosition={currentMonthCalendarPosition} slots={slots} slotProps={slotProps} loading={loading} renderLoading={renderLoading} disableHighlightToday={disableHighlightToday} readOnly={readOnly} disabled={disabled} showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth} dayOfWeekFormatter={dayOfWeekFormatter} disableAutoMonthSwitching={disableAutoMonthSwitching} sx={sx} autoFocus={autoFocus} fixedWeekNumber={fixedWeekNumber} disableDragEditing={disableDragEditing} displayWeekNumber={displayWeekNumber} timezone={timezone} availableRangePositions={availableRangePositions}/>);
};
exports.renderDateRangeViewCalendar = renderDateRangeViewCalendar;
