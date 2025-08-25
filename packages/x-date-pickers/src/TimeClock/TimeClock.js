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
exports.TimeClock = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useId_1 = require("@mui/utils/useId");
var hooks_1 = require("../hooks");
var useUtils_1 = require("../internals/hooks/useUtils");
var PickersArrowSwitcher_1 = require("../internals/components/PickersArrowSwitcher");
var time_utils_1 = require("../internals/utils/time-utils");
var useViews_1 = require("../internals/hooks/useViews");
var date_helpers_hooks_1 = require("../internals/hooks/date-helpers-hooks");
var PickerViewRoot_1 = require("../internals/components/PickerViewRoot");
var timeClockClasses_1 = require("./timeClockClasses");
var Clock_1 = require("./Clock");
var ClockNumbers_1 = require("./ClockNumbers");
var useControlledValue_1 = require("../internals/hooks/useControlledValue");
var valueManagers_1 = require("../internals/utils/valueManagers");
var useClockReferenceDate_1 = require("../internals/hooks/useClockReferenceDate");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        arrowSwitcher: ['arrowSwitcher'],
    };
    return (0, composeClasses_1.default)(slots, timeClockClasses_1.getTimeClockUtilityClass, classes);
};
var TimeClockRoot = (0, styles_1.styled)(PickerViewRoot_1.PickerViewRoot, {
    name: 'MuiTimeClock',
    slot: 'Root',
})({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
});
var TimeClockArrowSwitcher = (0, styles_1.styled)(PickersArrowSwitcher_1.PickersArrowSwitcher, {
    name: 'MuiTimeClock',
    slot: 'ArrowSwitcher',
})({
    position: 'absolute',
    right: 12,
    top: 15,
});
var TIME_CLOCK_DEFAULT_VIEWS = ['hours', 'minutes'];
/**
 * Demos:
 *
 * - [TimePicker](https://mui.com/x/react-date-pickers/time-picker/)
 * - [TimeClock](https://mui.com/x/react-date-pickers/time-clock/)
 *
 * API:
 *
 * - [TimeClock API](https://mui.com/x/api/date-pickers/time-clock/)
 */
exports.TimeClock = React.forwardRef(function TimeClock(inProps, ref) {
    var adapter = (0, hooks_1.usePickerAdapter)();
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiTimeClock',
    });
    var _a = props.ampm, ampm = _a === void 0 ? adapter.is12HourCycleInCurrentLocale() : _a, _b = props.ampmInClock, ampmInClock = _b === void 0 ? false : _b, autoFocus = props.autoFocus, slots = props.slots, slotProps = props.slotProps, valueProp = props.value, defaultValue = props.defaultValue, referenceDateProp = props.referenceDate, _c = props.disableIgnoringDatePartForTimeValidation, disableIgnoringDatePartForTimeValidation = _c === void 0 ? false : _c, maxTime = props.maxTime, minTime = props.minTime, disableFuture = props.disableFuture, disablePast = props.disablePast, _d = props.minutesStep, minutesStep = _d === void 0 ? 1 : _d, shouldDisableTime = props.shouldDisableTime, showViewSwitcher = props.showViewSwitcher, onChange = props.onChange, inView = props.view, _e = props.views, views = _e === void 0 ? TIME_CLOCK_DEFAULT_VIEWS : _e, openTo = props.openTo, onViewChange = props.onViewChange, focusedView = props.focusedView, onFocusedViewChange = props.onFocusedViewChange, className = props.className, classesProp = props.classes, disabled = props.disabled, readOnly = props.readOnly, timezoneProp = props.timezone, other = __rest(props, ["ampm", "ampmInClock", "autoFocus", "slots", "slotProps", "value", "defaultValue", "referenceDate", "disableIgnoringDatePartForTimeValidation", "maxTime", "minTime", "disableFuture", "disablePast", "minutesStep", "shouldDisableTime", "showViewSwitcher", "onChange", "view", "views", "openTo", "onViewChange", "focusedView", "onFocusedViewChange", "className", "classes", "disabled", "readOnly", "timezone"]);
    var _f = (0, useControlledValue_1.useControlledValue)({
        name: 'TimeClock',
        timezone: timezoneProp,
        value: valueProp,
        defaultValue: defaultValue,
        referenceDate: referenceDateProp,
        onChange: onChange,
        valueManager: valueManagers_1.singleItemValueManager,
    }), value = _f.value, handleValueChange = _f.handleValueChange, timezone = _f.timezone;
    var valueOrReferenceDate = (0, useClockReferenceDate_1.useClockReferenceDate)({
        value: value,
        referenceDate: referenceDateProp,
        adapter: adapter,
        props: props,
        timezone: timezone,
    });
    var translations = (0, hooks_1.usePickerTranslations)();
    var now = (0, useUtils_1.useNow)(timezone);
    var selectedId = (0, useId_1.default)();
    var ownerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var _g = (0, useViews_1.useViews)({
        view: inView,
        views: views,
        openTo: openTo,
        onViewChange: onViewChange,
        onChange: handleValueChange,
        focusedView: focusedView,
        onFocusedViewChange: onFocusedViewChange,
    }), view = _g.view, setView = _g.setView, previousView = _g.previousView, nextView = _g.nextView, setValueAndGoToNextView = _g.setValueAndGoToNextView;
    var _h = (0, date_helpers_hooks_1.useMeridiemMode)(valueOrReferenceDate, ampm, setValueAndGoToNextView), meridiemMode = _h.meridiemMode, handleMeridiemChange = _h.handleMeridiemChange;
    var isTimeDisabled = React.useCallback(function (rawValue, viewType) {
        var isAfter = (0, time_utils_1.createIsAfterIgnoreDatePart)(disableIgnoringDatePartForTimeValidation, adapter);
        var shouldCheckPastEnd = viewType === 'hours' || (viewType === 'minutes' && views.includes('seconds'));
        var containsValidTime = function (_a) {
            var start = _a.start, end = _a.end;
            if (minTime && isAfter(minTime, end)) {
                return false;
            }
            if (maxTime && isAfter(start, maxTime)) {
                return false;
            }
            if (disableFuture && isAfter(start, now)) {
                return false;
            }
            if (disablePast && isAfter(now, shouldCheckPastEnd ? end : start)) {
                return false;
            }
            return true;
        };
        var isValidValue = function (timeValue, step) {
            if (step === void 0) { step = 1; }
            if (timeValue % step !== 0) {
                return false;
            }
            if (shouldDisableTime) {
                switch (viewType) {
                    case 'hours':
                        return !shouldDisableTime(adapter.setHours(valueOrReferenceDate, timeValue), 'hours');
                    case 'minutes':
                        return !shouldDisableTime(adapter.setMinutes(valueOrReferenceDate, timeValue), 'minutes');
                    case 'seconds':
                        return !shouldDisableTime(adapter.setSeconds(valueOrReferenceDate, timeValue), 'seconds');
                    default:
                        return false;
                }
            }
            return true;
        };
        switch (viewType) {
            case 'hours': {
                var valueWithMeridiem = (0, time_utils_1.convertValueToMeridiem)(rawValue, meridiemMode, ampm);
                var dateWithNewHours = adapter.setHours(valueOrReferenceDate, valueWithMeridiem);
                if (adapter.getHours(dateWithNewHours) !== valueWithMeridiem) {
                    return true;
                }
                var start = adapter.setSeconds(adapter.setMinutes(dateWithNewHours, 0), 0);
                var end = adapter.setSeconds(adapter.setMinutes(dateWithNewHours, 59), 59);
                return !containsValidTime({ start: start, end: end }) || !isValidValue(valueWithMeridiem);
            }
            case 'minutes': {
                var dateWithNewMinutes = adapter.setMinutes(valueOrReferenceDate, rawValue);
                var start = adapter.setSeconds(dateWithNewMinutes, 0);
                var end = adapter.setSeconds(dateWithNewMinutes, 59);
                return !containsValidTime({ start: start, end: end }) || !isValidValue(rawValue, minutesStep);
            }
            case 'seconds': {
                var dateWithNewSeconds = adapter.setSeconds(valueOrReferenceDate, rawValue);
                var start = dateWithNewSeconds;
                var end = dateWithNewSeconds;
                return !containsValidTime({ start: start, end: end }) || !isValidValue(rawValue);
            }
            default:
                throw new Error('not supported');
        }
    }, [
        ampm,
        valueOrReferenceDate,
        disableIgnoringDatePartForTimeValidation,
        maxTime,
        meridiemMode,
        minTime,
        minutesStep,
        shouldDisableTime,
        adapter,
        disableFuture,
        disablePast,
        now,
        views,
    ]);
    var viewProps = React.useMemo(function () {
        switch (view) {
            case 'hours': {
                var handleHoursChange = function (hourValue, isFinish) {
                    var valueWithMeridiem = (0, time_utils_1.convertValueToMeridiem)(hourValue, meridiemMode, ampm);
                    setValueAndGoToNextView(adapter.setHours(valueOrReferenceDate, valueWithMeridiem), isFinish, 'hours');
                };
                var viewValue = adapter.getHours(valueOrReferenceDate);
                var viewRange = void 0;
                if (ampm) {
                    if (viewValue > 12) {
                        viewRange = [12, 23];
                    }
                    else {
                        viewRange = [0, 11];
                    }
                }
                else {
                    viewRange = [0, 23];
                }
                return {
                    onChange: handleHoursChange,
                    viewValue: viewValue,
                    children: (0, ClockNumbers_1.getHourNumbers)({
                        value: value,
                        adapter: adapter,
                        ampm: ampm,
                        onChange: handleHoursChange,
                        getClockNumberText: translations.hoursClockNumberText,
                        isDisabled: function (hourValue) { return disabled || isTimeDisabled(hourValue, 'hours'); },
                        selectedId: selectedId,
                    }),
                    viewRange: viewRange,
                };
            }
            case 'minutes': {
                var minutesValue = adapter.getMinutes(valueOrReferenceDate);
                var handleMinutesChange = function (minuteValue, isFinish) {
                    setValueAndGoToNextView(adapter.setMinutes(valueOrReferenceDate, minuteValue), isFinish, 'minutes');
                };
                return {
                    viewValue: minutesValue,
                    onChange: handleMinutesChange,
                    children: (0, ClockNumbers_1.getMinutesNumbers)({
                        adapter: adapter,
                        value: minutesValue,
                        onChange: handleMinutesChange,
                        getClockNumberText: translations.minutesClockNumberText,
                        isDisabled: function (minuteValue) { return disabled || isTimeDisabled(minuteValue, 'minutes'); },
                        selectedId: selectedId,
                    }),
                    viewRange: [0, 59],
                };
            }
            case 'seconds': {
                var secondsValue = adapter.getSeconds(valueOrReferenceDate);
                var handleSecondsChange = function (secondValue, isFinish) {
                    setValueAndGoToNextView(adapter.setSeconds(valueOrReferenceDate, secondValue), isFinish, 'seconds');
                };
                return {
                    viewValue: secondsValue,
                    onChange: handleSecondsChange,
                    children: (0, ClockNumbers_1.getMinutesNumbers)({
                        adapter: adapter,
                        value: secondsValue,
                        onChange: handleSecondsChange,
                        getClockNumberText: translations.secondsClockNumberText,
                        isDisabled: function (secondValue) { return disabled || isTimeDisabled(secondValue, 'seconds'); },
                        selectedId: selectedId,
                    }),
                    viewRange: [0, 59],
                };
            }
            default:
                throw new Error('You must provide the type for ClockView');
        }
    }, [
        view,
        adapter,
        value,
        ampm,
        translations.hoursClockNumberText,
        translations.minutesClockNumberText,
        translations.secondsClockNumberText,
        meridiemMode,
        setValueAndGoToNextView,
        valueOrReferenceDate,
        isTimeDisabled,
        selectedId,
        disabled,
    ]);
    var classes = useUtilityClasses(classesProp);
    return (<TimeClockRoot ref={ref} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} {...other}>
      <Clock_1.Clock autoFocus={autoFocus !== null && autoFocus !== void 0 ? autoFocus : !!focusedView} ampmInClock={ampmInClock && views.includes('hours')} value={value} type={view} ampm={ampm} minutesStep={minutesStep} isTimeDisabled={isTimeDisabled} meridiemMode={meridiemMode} handleMeridiemChange={handleMeridiemChange} selectedId={selectedId} disabled={disabled} readOnly={readOnly} {...viewProps}/>
      {showViewSwitcher && (<TimeClockArrowSwitcher className={classes.arrowSwitcher} slots={slots} slotProps={slotProps} onGoToPrevious={function () { return setView(previousView); }} isPreviousDisabled={!previousView} previousLabel={translations.openPreviousView} onGoToNext={function () { return setView(nextView); }} isNextDisabled={!nextView} nextLabel={translations.openNextView} ownerState={ownerState}/>)}
    </TimeClockRoot>);
});
exports.TimeClock.propTypes = {
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
     * @default false
     */
    ampmInClock: prop_types_1.default.bool,
    /**
     * If `true`, the main element is focused during the first mount.
     * This main element is:
     * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
     * - the `input` element if there is a field rendered.
     */
    autoFocus: prop_types_1.default.bool,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * The default selected value.
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
     * Controlled focused view.
     */
    focusedView: prop_types_1.default.oneOf(['hours', 'minutes', 'seconds']),
    /**
     * Maximal selectable time.
     * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
     */
    maxTime: prop_types_1.default.object,
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
     * Callback fired when the value changes.
     * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
     * @template TView The view type. Will be one of date or time views.
     * @param {TValue} value The new value.
     * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
     * @param {TView | undefined} selectedView Indicates the view in which the selection has been made.
     */
    onChange: prop_types_1.default.func,
    /**
     * Callback fired on focused view change.
     * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
     * @param {TView} view The new view to focus or not.
     * @param {boolean} hasFocus `true` if the view should be focused.
     */
    onFocusedViewChange: prop_types_1.default.func,
    /**
     * Callback fired on view change.
     * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
     * @param {TView} view The new view.
     */
    onViewChange: prop_types_1.default.func,
    /**
     * The default visible view.
     * Used when the component view is not controlled.
     * Must be a valid option from `views` list.
     */
    openTo: prop_types_1.default.oneOf(['hours', 'minutes', 'seconds']),
    /**
     * If `true`, the component is read-only.
     * When read-only, the value cannot be changed but the user can interact with the interface.
     * @default false
     */
    readOnly: prop_types_1.default.bool,
    /**
     * The date used to generate the new value when both `value` and `defaultValue` are empty.
     * @default The closest valid time using the validation props, except callbacks such as `shouldDisableTime`.
     */
    referenceDate: prop_types_1.default.object,
    /**
     * Disable specific time.
     * @param {PickerValidDate} value The value to check.
     * @param {TimeView} view The clock type of the timeValue.
     * @returns {boolean} If `true` the time will be disabled.
     */
    shouldDisableTime: prop_types_1.default.func,
    showViewSwitcher: prop_types_1.default.bool,
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
    value: prop_types_1.default.object,
    /**
     * The visible view.
     * Used when the component view is controlled.
     * Must be a valid option from `views` list.
     */
    view: prop_types_1.default.oneOf(['hours', 'minutes', 'seconds']),
    /**
     * Available views.
     * @default ['hours', 'minutes']
     */
    views: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['hours', 'minutes', 'seconds']).isRequired),
};
