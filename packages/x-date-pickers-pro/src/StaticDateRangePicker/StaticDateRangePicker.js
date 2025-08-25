"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticDateRangePicker = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var useStaticRangePicker_1 = require("../internals/hooks/useStaticRangePicker");
var shared_1 = require("../DateRangePicker/shared");
var dateRangeViewRenderers_1 = require("../dateRangeViewRenderers");
var valueManagers_1 = require("../internals/utils/valueManagers");
var validation_1 = require("../validation");
/**
 * Demos:
 *
 * - [DateRangePicker](https://mui.com/x/react-date-pickers/date-range-picker/)
 * - [Validation](https://mui.com/x/react-date-pickers/validation/)
 *
 * API:
 *
 * - [StaticDateRangePicker API](https://mui.com/x/api/date-pickers/static-date-range-picker/)
 */
var StaticDateRangePicker = React.forwardRef(function StaticDateRangePicker(inProps, ref) {
    var _a, _b, _c;
    var defaultizedProps = (0, shared_1.useDateRangePickerDefaultizedProps)(inProps, 'MuiStaticDateRangePicker');
    var displayStaticWrapperAs = (_a = defaultizedProps.displayStaticWrapperAs) !== null && _a !== void 0 ? _a : 'mobile';
    var viewRenderers = __assign({ day: dateRangeViewRenderers_1.renderDateRangeViewCalendar }, defaultizedProps.viewRenderers);
    // Props with the default values specific to the static variant
    var props = __assign(__assign({}, defaultizedProps), { viewRenderers: viewRenderers, displayStaticWrapperAs: displayStaticWrapperAs, views: ['day'], openTo: 'day', calendars: (_b = defaultizedProps.calendars) !== null && _b !== void 0 ? _b : (displayStaticWrapperAs === 'mobile' ? 1 : 2), slotProps: __assign(__assign({}, defaultizedProps.slotProps), { toolbar: __assign({ hidden: displayStaticWrapperAs === 'desktop' }, (_c = defaultizedProps.slotProps) === null || _c === void 0 ? void 0 : _c.toolbar) }) });
    var renderPicker = (0, useStaticRangePicker_1.useStaticRangePicker)({
        ref: ref,
        props: props,
        valueManager: valueManagers_1.rangeValueManager,
        valueType: 'date',
        validator: validation_1.validateDateRange,
        steps: null,
    }).renderPicker;
    return renderPicker();
});
exports.StaticDateRangePicker = StaticDateRangePicker;
StaticDateRangePicker.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * If `true`, the main element is focused during the first mount.
     * This main element is:
     * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
     * - the `input` element if there is a field rendered.
     */
    autoFocus: prop_types_1.default.bool,
    /**
     * The number of calendars to render.
     * @default 1 if `displayStaticWrapperAs === 'mobile'`, 2 otherwise.
     */
    calendars: prop_types_1.default.oneOf([1, 2, 3]),
    className: prop_types_1.default.string,
    /**
     * Position the current month is rendered in.
     * @default 1
     */
    currentMonthCalendarPosition: prop_types_1.default.oneOf([1, 2, 3]),
    /**
     * Formats the day of week displayed in the calendar header.
     * @param {PickerValidDate} date The date of the day of week provided by the adapter.
     * @returns {string} The name to display.
     * @default (date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
     */
    dayOfWeekFormatter: prop_types_1.default.func,
    /**
     * The initial position in the edited date range.
     * Used when the component is not controlled.
     * @default 'start'
     */
    defaultRangePosition: prop_types_1.default.oneOf(['end', 'start']),
    /**
     * The default value.
     * Used when the component is not controlled.
     */
    defaultValue: prop_types_1.default.arrayOf(prop_types_1.default.object),
    /**
     * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
     * @default false
     */
    disableAutoMonthSwitching: prop_types_1.default.bool,
    /**
     * If `true`, the component is disabled.
     * When disabled, the value cannot be changed and no interaction is possible.
     * @default false
     */
    disabled: prop_types_1.default.bool,
    /**
     * If `true`, editing dates by dragging is disabled.
     * @default false
     */
    disableDragEditing: prop_types_1.default.bool,
    /**
     * If `true`, disable values after the current date for date components, time for time components and both for date time components.
     * @default false
     */
    disableFuture: prop_types_1.default.bool,
    /**
     * If `true`, today's date is rendering without highlighting with circle.
     * @default false
     */
    disableHighlightToday: prop_types_1.default.bool,
    /**
     * If `true`, disable values before the current date for date components, time for time components and both for date time components.
     * @default false
     */
    disablePast: prop_types_1.default.bool,
    /**
     * Force static wrapper inner components to be rendered in mobile or desktop mode.
     * @default "mobile"
     */
    displayStaticWrapperAs: prop_types_1.default.oneOf(['desktop', 'mobile']),
    /**
     * If `true`, the week number will be display in the calendar.
     */
    displayWeekNumber: prop_types_1.default.bool,
    /**
     * The day view will show as many weeks as needed after the end of the current month to match this value.
     * Put it to 6 to have a fixed number of weeks in Gregorian calendars
     */
    fixedWeekNumber: prop_types_1.default.number,
    /**
     * If `true`, calls `renderLoading` instead of rendering the day calendar.
     * Can be used to preload information and show it in calendar.
     * @default false
     */
    loading: prop_types_1.default.bool,
    /**
     * Locale for components texts.
     * Allows overriding texts coming from `LocalizationProvider` and `theme`.
     */
    localeText: prop_types_1.default.object,
    /**
     * Maximal selectable date.
     * @default 2099-12-31
     */
    maxDate: prop_types_1.default.object,
    /**
     * Minimal selectable date.
     * @default 1900-01-01
     */
    minDate: prop_types_1.default.object,
    /**
     * Callback fired when the value is accepted.
     * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
     * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
     * @param {TValue} value The value that was just accepted.
     * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
     */
    onAccept: prop_types_1.default.func,
    /**
     * Callback fired when the value changes.
     * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
     * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
     * @param {TValue} value The new value.
     * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
     */
    onChange: prop_types_1.default.func,
    /**
     * Callback fired when component requests to be closed.
     * Can be fired when selecting (by default on `desktop` mode) or clearing a value.
     * @deprecated Please avoid using as it will be removed in next major version.
     */
    onClose: prop_types_1.default.func,
    /**
     * Callback fired when the error associated with the current value changes.
     * When a validation error is detected, the `error` parameter contains a non-null value.
     * This can be used to render an appropriate form error.
     * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
     * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
     * @param {TError} error The reason why the current value is not valid.
     * @param {TValue} value The value associated with the error.
     */
    onError: prop_types_1.default.func,
    /**
     * Callback fired on month change.
     * @param {PickerValidDate} month The new month.
     */
    onMonthChange: prop_types_1.default.func,
    /**
     * Callback fired when the range position changes.
     * @param {RangePosition} rangePosition The new range position.
     */
    onRangePositionChange: prop_types_1.default.func,
    /**
     * The position in the currently edited date range.
     * Used when the component position is controlled.
     */
    rangePosition: prop_types_1.default.oneOf(['end', 'start']),
    /**
     * If `true`, the component is read-only.
     * When read-only, the value cannot be changed but the user can interact with the interface.
     * @default false
     */
    readOnly: prop_types_1.default.bool,
    /**
     * If `true`, disable heavy animations.
     * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
     */
    reduceAnimations: prop_types_1.default.bool,
    /**
     * The date used to generate the new value when both `value` and `defaultValue` are empty.
     * @default The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.
     */
    referenceDate: prop_types_1.default.oneOfType([prop_types_1.default.arrayOf(prop_types_1.default.object), prop_types_1.default.object]),
    /**
     * Component rendered on the "day" view when `props.loading` is true.
     * @returns {React.ReactNode} The node to render when loading.
     * @default () => "..."
     */
    renderLoading: prop_types_1.default.func,
    /**
     * Disable specific date.
     *
     * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
     *
     * @param {PickerValidDate} day The date to test.
     * @param {string} position The date to test, 'start' or 'end'.
     * @returns {boolean} Returns `true` if the date should be disabled.
     */
    shouldDisableDate: prop_types_1.default.func,
    /**
     * If `true`, days outside the current month are rendered:
     *
     * - if `fixedWeekNumber` is defined, renders days to have the weeks requested.
     *
     * - if `fixedWeekNumber` is not defined, renders day to fill the first and last week of the current month.
     *
     * - ignored if `calendars` equals more than `1` on range pickers.
     * @default false
     */
    showDaysOutsideCurrentMonth: prop_types_1.default.bool,
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
    /**
     * Choose which timezone to use for the value.
     * Example: "default", "system", "UTC", "America/New_York".
     * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
     * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
     * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
     */
    timezone: prop_types_1.default.string,
    /**
     * The selected value.
     * Used when the component is controlled.
     */
    value: prop_types_1.default.arrayOf(prop_types_1.default.object),
    /**
     * Define custom view renderers for each section.
     * If `null`, the section will only have field editing.
     * If `undefined`, internally defined view will be used.
     */
    viewRenderers: prop_types_1.default.shape({
        day: prop_types_1.default.func,
    }),
};
