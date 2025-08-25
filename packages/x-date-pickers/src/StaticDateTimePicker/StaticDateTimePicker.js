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
exports.StaticDateTimePicker = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var shared_1 = require("../DateTimePicker/shared");
var timeViewRenderers_1 = require("../timeViewRenderers");
var dateViewRenderers_1 = require("../dateViewRenderers");
var valueManagers_1 = require("../internals/utils/valueManagers");
var useStaticPicker_1 = require("../internals/hooks/useStaticPicker");
var validation_1 = require("../validation");
var utils_1 = require("../internals/utils/utils");
var MultiSectionDigitalClock_1 = require("../MultiSectionDigitalClock");
var dimensions_1 = require("../internals/constants/dimensions");
var DigitalClock_1 = require("../DigitalClock");
var date_utils_1 = require("../internals/utils/date-utils");
var time_utils_1 = require("../internals/utils/time-utils");
var STEPS = [{ views: date_utils_1.DATE_VIEWS }, { views: time_utils_1.EXPORTED_TIME_VIEWS }];
/**
 * Demos:
 *
 * - [DateTimePicker](https://mui.com/x/react-date-pickers/date-time-picker/)
 * - [Validation](https://mui.com/x/react-date-pickers/validation/)
 *
 * API:
 *
 * - [StaticDateTimePicker API](https://mui.com/x/api/date-pickers/static-date-time-picker/)
 */
var StaticDateTimePicker = React.forwardRef(function StaticDateTimePicker(inProps, ref) {
    var _a, _b, _c;
    var _d, _e, _f, _g, _h, _j;
    var defaultizedProps = (0, shared_1.useDateTimePickerDefaultizedProps)(inProps, 'MuiStaticDateTimePicker');
    var displayStaticWrapperAs = (_d = defaultizedProps.displayStaticWrapperAs) !== null && _d !== void 0 ? _d : 'mobile';
    var ampmInClock = (_e = defaultizedProps.ampmInClock) !== null && _e !== void 0 ? _e : displayStaticWrapperAs === 'desktop';
    var renderTimeView = defaultizedProps.shouldRenderTimeInASingleColumn
        ? timeViewRenderers_1.renderDigitalClockTimeView
        : timeViewRenderers_1.renderMultiSectionDigitalClockTimeView;
    var viewRenderers = __assign({ day: dateViewRenderers_1.renderDateViewCalendar, month: dateViewRenderers_1.renderDateViewCalendar, year: dateViewRenderers_1.renderDateViewCalendar, hours: renderTimeView, minutes: renderTimeView, seconds: renderTimeView, meridiem: renderTimeView }, defaultizedProps.viewRenderers);
    // Need to avoid adding the `meridiem` view when unexpected renderer is specified
    var shouldHoursRendererContainMeridiemView = ((_f = viewRenderers.hours) === null || _f === void 0 ? void 0 : _f.name) === timeViewRenderers_1.renderMultiSectionDigitalClockTimeView.name;
    var views = !shouldHoursRendererContainMeridiemView
        ? defaultizedProps.views.filter(function (view) { return view !== 'meridiem'; })
        : defaultizedProps.views;
    // Props with the default values specific to the static variant
    var props = __assign(__assign({}, defaultizedProps), { viewRenderers: viewRenderers, displayStaticWrapperAs: displayStaticWrapperAs, views: views, ampmInClock: ampmInClock, yearsPerRow: (_g = defaultizedProps.yearsPerRow) !== null && _g !== void 0 ? _g : (displayStaticWrapperAs === 'mobile' ? 3 : 4), slotProps: __assign(__assign({}, defaultizedProps.slotProps), { tabs: __assign({ hidden: displayStaticWrapperAs === 'desktop' }, (_h = defaultizedProps.slotProps) === null || _h === void 0 ? void 0 : _h.tabs), toolbar: __assign({ hidden: displayStaticWrapperAs === 'desktop', ampmInClock: ampmInClock }, (_j = defaultizedProps.slotProps) === null || _j === void 0 ? void 0 : _j.toolbar) }), sx: (0, utils_1.mergeSx)([
            (_a = {},
                _a["& .".concat(MultiSectionDigitalClock_1.multiSectionDigitalClockClasses.root)] = {
                    width: dimensions_1.DIALOG_WIDTH,
                },
                _a["& .".concat(MultiSectionDigitalClock_1.multiSectionDigitalClockSectionClasses.root)] = (_b = {
                        flex: 1,
                        // account for the border on `MultiSectionDigitalClock`
                        maxHeight: dimensions_1.VIEW_HEIGHT - 1
                    },
                    _b[".".concat(MultiSectionDigitalClock_1.multiSectionDigitalClockSectionClasses.item)] = {
                        width: 'auto',
                    },
                    _b),
                _a["& .".concat(DigitalClock_1.digitalClockClasses.root)] = (_c = {
                        width: dimensions_1.DIALOG_WIDTH,
                        maxHeight: dimensions_1.VIEW_HEIGHT,
                        flex: 1
                    },
                    _c[".".concat(DigitalClock_1.digitalClockClasses.item)] = {
                        justifyContent: 'center',
                    },
                    _c),
                _a),
        ], defaultizedProps === null || defaultizedProps === void 0 ? void 0 : defaultizedProps.sx) });
    var renderPicker = (0, useStaticPicker_1.useStaticPicker)({
        ref: ref,
        props: props,
        valueManager: valueManagers_1.singleItemValueManager,
        valueType: 'date-time',
        validator: validation_1.validateDateTime,
        steps: STEPS,
    }).renderPicker;
    return renderPicker();
});
exports.StaticDateTimePicker = StaticDateTimePicker;
StaticDateTimePicker.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * 12h/24h view for hour selection clock.
     * @default adapter.is12HourCycleInCurrentLocale()
     */
    ampm: prop_types_1.default.bool,
    /**
     * Display ampm controls under the clock (instead of in the toolbar).
     * @default true on desktop, false on mobile
     */
    ampmInClock: prop_types_1.default.bool,
    /**
     * If `true`, the main element is focused during the first mount.
     * This main element is:
     * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
     * - the `input` element if there is a field rendered.
     */
    autoFocus: prop_types_1.default.bool,
    className: prop_types_1.default.string,
    /**
     * Formats the day of week displayed in the calendar header.
     * @param {PickerValidDate} date The date of the day of week provided by the adapter.
     * @returns {string} The name to display.
     * @default (date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
     */
    dayOfWeekFormatter: prop_types_1.default.func,
    /**
     * The default value.
     * Used when the component is not controlled.
     */
    defaultValue: prop_types_1.default.object,
    /**
     * If `true`, the component is disabled.
     * When disabled, the value cannot be changed and no interaction is possible.
     * @default false
     */
    disabled: prop_types_1.default.bool,
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
     * Do not ignore date part when validating min/max time.
     * @default false
     */
    disableIgnoringDatePartForTimeValidation: prop_types_1.default.bool,
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
     * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
     */
    maxDateTime: prop_types_1.default.object,
    /**
     * Maximal selectable time.
     * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
     */
    maxTime: prop_types_1.default.object,
    /**
     * Minimal selectable date.
     * @default 1900-01-01
     */
    minDate: prop_types_1.default.object,
    /**
     * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
     */
    minDateTime: prop_types_1.default.object,
    /**
     * Minimal selectable time.
     * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
     */
    minTime: prop_types_1.default.object,
    /**
     * Step over minutes.
     * @default 1
     */
    minutesStep: prop_types_1.default.number,
    /**
     * Months rendered per row.
     * @default 3
     */
    monthsPerRow: prop_types_1.default.oneOf([3, 4]),
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
     * Callback fired on view change.
     * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
     * @param {TView} view The new view.
     */
    onViewChange: prop_types_1.default.func,
    /**
     * Callback fired on year change.
     * @param {PickerValidDate} year The new year.
     */
    onYearChange: prop_types_1.default.func,
    /**
     * The default visible view.
     * Used when the component view is not controlled.
     * Must be a valid option from `views` list.
     */
    openTo: prop_types_1.default.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year']),
    /**
     * Force rendering in particular orientation.
     */
    orientation: prop_types_1.default.oneOf(['landscape', 'portrait']),
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
    referenceDate: prop_types_1.default.object,
    /**
     * Component displaying when passed `loading` true.
     * @returns {React.ReactNode} The node to render when loading.
     * @default () => <span>...</span>
     */
    renderLoading: prop_types_1.default.func,
    /**
     * Disable specific date.
     *
     * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
     *
     * @param {PickerValidDate} day The date to test.
     * @returns {boolean} If `true` the date will be disabled.
     */
    shouldDisableDate: prop_types_1.default.func,
    /**
     * Disable specific month.
     * @param {PickerValidDate} month The month to test.
     * @returns {boolean} If `true`, the month will be disabled.
     */
    shouldDisableMonth: prop_types_1.default.func,
    /**
     * Disable specific time.
     * @param {PickerValidDate} value The value to check.
     * @param {TimeView} view The clock type of the timeValue.
     * @returns {boolean} If `true` the time will be disabled.
     */
    shouldDisableTime: prop_types_1.default.func,
    /**
     * Disable specific year.
     * @param {PickerValidDate} year The year to test.
     * @returns {boolean} If `true`, the year will be disabled.
     */
    shouldDisableYear: prop_types_1.default.func,
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
     * If `true`, disabled digital clock items will not be rendered.
     * @default false
     */
    skipDisabled: prop_types_1.default.bool,
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
     * Amount of time options below or at which the single column time renderer is used.
     * @default 24
     */
    thresholdToRenderTimeInASingleColumn: prop_types_1.default.number,
    /**
     * The time steps between two time unit options.
     * For example, if `timeSteps.minutes = 8`, then the available minute options will be `[0, 8, 16, 24, 32, 40, 48, 56]`.
     * When single column time renderer is used, only `timeSteps.minutes` will be used.
     * @default{ hours: 1, minutes: 5, seconds: 5 }
     */
    timeSteps: prop_types_1.default.shape({
        hours: prop_types_1.default.number,
        minutes: prop_types_1.default.number,
        seconds: prop_types_1.default.number,
    }),
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
    value: prop_types_1.default.object,
    /**
     * The visible view.
     * Used when the component view is controlled.
     * Must be a valid option from `views` list.
     */
    view: prop_types_1.default.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year']),
    /**
     * Define custom view renderers for each section.
     * If `null`, the section will only have field editing.
     * If `undefined`, internally defined view will be used.
     */
    viewRenderers: prop_types_1.default.shape({
        day: prop_types_1.default.func,
        hours: prop_types_1.default.func,
        meridiem: prop_types_1.default.func,
        minutes: prop_types_1.default.func,
        month: prop_types_1.default.func,
        seconds: prop_types_1.default.func,
        year: prop_types_1.default.func,
    }),
    /**
     * Available views.
     */
    views: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']).isRequired),
    /**
     * Years are displayed in ascending (chronological) order by default.
     * If `desc`, years are displayed in descending order.
     * @default 'asc'
     */
    yearsOrder: prop_types_1.default.oneOf(['asc', 'desc']),
    /**
     * Years rendered per row.
     * @default `4` when `displayStaticWrapperAs === 'desktop'`, `3` otherwise.
     */
    yearsPerRow: prop_types_1.default.oneOf([3, 4]),
};
