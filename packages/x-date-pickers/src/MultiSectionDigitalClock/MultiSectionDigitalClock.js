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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiSectionDigitalClock = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var styles_1 = require("@mui/material/styles");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var composeClasses_1 = require("@mui/utils/composeClasses");
var hooks_1 = require("../hooks");
var useUtils_1 = require("../internals/hooks/useUtils");
var time_utils_1 = require("../internals/utils/time-utils");
var useViews_1 = require("../internals/hooks/useViews");
var date_helpers_hooks_1 = require("../internals/hooks/date-helpers-hooks");
var PickerViewRoot_1 = require("../internals/components/PickerViewRoot");
var multiSectionDigitalClockClasses_1 = require("./multiSectionDigitalClockClasses");
var MultiSectionDigitalClockSection_1 = require("./MultiSectionDigitalClockSection");
var MultiSectionDigitalClock_utils_1 = require("./MultiSectionDigitalClock.utils");
var useControlledValue_1 = require("../internals/hooks/useControlledValue");
var valueManagers_1 = require("../internals/utils/valueManagers");
var useClockReferenceDate_1 = require("../internals/hooks/useClockReferenceDate");
var date_utils_1 = require("../internals/utils/date-utils");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
    };
    return (0, composeClasses_1.default)(slots, multiSectionDigitalClockClasses_1.getMultiSectionDigitalClockUtilityClass, classes);
};
var MultiSectionDigitalClockRoot = (0, styles_1.styled)(PickerViewRoot_1.PickerViewRoot, {
    name: 'MuiMultiSectionDigitalClock',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        flexDirection: 'row',
        width: '100%',
        borderBottom: "1px solid ".concat((theme.vars || theme).palette.divider),
    });
});
/**
 * Demos:
 *
 * - [TimePicker](https://mui.com/x/react-date-pickers/time-picker/)
 * - [DigitalClock](https://mui.com/x/react-date-pickers/digital-clock/)
 *
 * API:
 *
 * - [MultiSectionDigitalClock API](https://mui.com/x/api/date-pickers/multi-section-digital-clock/)
 */
exports.MultiSectionDigitalClock = React.forwardRef(function MultiSectionDigitalClock(inProps, ref) {
    var adapter = (0, hooks_1.usePickerAdapter)();
    var isRtl = (0, RtlProvider_1.useRtl)();
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiMultiSectionDigitalClock',
    });
    var _a = props.ampm, ampm = _a === void 0 ? adapter.is12HourCycleInCurrentLocale() : _a, inTimeSteps = props.timeSteps, autoFocus = props.autoFocus, slots = props.slots, slotProps = props.slotProps, valueProp = props.value, defaultValue = props.defaultValue, referenceDateProp = props.referenceDate, _b = props.disableIgnoringDatePartForTimeValidation, disableIgnoringDatePartForTimeValidation = _b === void 0 ? false : _b, maxTime = props.maxTime, minTime = props.minTime, disableFuture = props.disableFuture, disablePast = props.disablePast, _c = props.minutesStep, minutesStep = _c === void 0 ? 1 : _c, shouldDisableTime = props.shouldDisableTime, onChange = props.onChange, inView = props.view, _d = props.views, inViews = _d === void 0 ? ['hours', 'minutes'] : _d, openTo = props.openTo, onViewChange = props.onViewChange, inFocusedView = props.focusedView, onFocusedViewChange = props.onFocusedViewChange, className = props.className, classesProp = props.classes, disabled = props.disabled, readOnly = props.readOnly, _e = props.skipDisabled, skipDisabled = _e === void 0 ? false : _e, timezoneProp = props.timezone, other = __rest(props, ["ampm", "timeSteps", "autoFocus", "slots", "slotProps", "value", "defaultValue", "referenceDate", "disableIgnoringDatePartForTimeValidation", "maxTime", "minTime", "disableFuture", "disablePast", "minutesStep", "shouldDisableTime", "onChange", "view", "views", "openTo", "onViewChange", "focusedView", "onFocusedViewChange", "className", "classes", "disabled", "readOnly", "skipDisabled", "timezone"]);
    var _f = (0, useControlledValue_1.useControlledValue)({
        name: 'MultiSectionDigitalClock',
        timezone: timezoneProp,
        value: valueProp,
        defaultValue: defaultValue,
        referenceDate: referenceDateProp,
        onChange: onChange,
        valueManager: valueManagers_1.singleItemValueManager,
    }), value = _f.value, handleRawValueChange = _f.handleValueChange, timezone = _f.timezone;
    var translations = (0, hooks_1.usePickerTranslations)();
    var now = (0, useUtils_1.useNow)(timezone);
    var timeSteps = React.useMemo(function () { return (__assign({ hours: 1, minutes: 5, seconds: 5 }, inTimeSteps)); }, [inTimeSteps]);
    var valueOrReferenceDate = (0, useClockReferenceDate_1.useClockReferenceDate)({
        value: value,
        referenceDate: referenceDateProp,
        adapter: adapter,
        props: props,
        timezone: timezone,
    });
    var handleValueChange = (0, useEventCallback_1.default)(function (newValue, selectionState, selectedView) { return handleRawValueChange(newValue, selectionState, selectedView); });
    var views = React.useMemo(function () {
        if (!ampm || !inViews.includes('hours')) {
            return inViews;
        }
        return inViews.includes('meridiem') ? inViews : __spreadArray(__spreadArray([], inViews, true), ['meridiem'], false);
    }, [ampm, inViews]);
    var _g = (0, useViews_1.useViews)({
        view: inView,
        views: views,
        openTo: openTo,
        onViewChange: onViewChange,
        onChange: handleValueChange,
        focusedView: inFocusedView,
        onFocusedViewChange: onFocusedViewChange,
    }), view = _g.view, setValueAndGoToNextView = _g.setValueAndGoToNextView, focusedView = _g.focusedView;
    var handleMeridiemValueChange = (0, useEventCallback_1.default)(function (newValue) {
        setValueAndGoToNextView(newValue, 'finish', 'meridiem');
    });
    var _h = (0, date_helpers_hooks_1.useMeridiemMode)(valueOrReferenceDate, ampm, handleMeridiemValueChange, 'finish'), meridiemMode = _h.meridiemMode, handleMeridiemChange = _h.handleMeridiemChange;
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
    var buildViewProps = React.useCallback(function (viewToBuild) {
        switch (viewToBuild) {
            case 'hours': {
                return {
                    onChange: function (hours) {
                        var valueWithMeridiem = (0, time_utils_1.convertValueToMeridiem)(hours, meridiemMode, ampm);
                        setValueAndGoToNextView(adapter.setHours(valueOrReferenceDate, valueWithMeridiem), 'finish', 'hours');
                    },
                    items: (0, MultiSectionDigitalClock_utils_1.getHourSectionOptions)({
                        now: now,
                        value: value,
                        ampm: ampm,
                        adapter: adapter,
                        isDisabled: function (hours) { return isTimeDisabled(hours, 'hours'); },
                        timeStep: timeSteps.hours,
                        resolveAriaLabel: translations.hoursClockNumberText,
                        valueOrReferenceDate: valueOrReferenceDate,
                    }),
                };
            }
            case 'minutes': {
                return {
                    onChange: function (minutes) {
                        setValueAndGoToNextView(adapter.setMinutes(valueOrReferenceDate, minutes), 'finish', 'minutes');
                    },
                    items: (0, MultiSectionDigitalClock_utils_1.getTimeSectionOptions)({
                        value: adapter.getMinutes(valueOrReferenceDate),
                        adapter: adapter,
                        isDisabled: function (minutes) { return isTimeDisabled(minutes, 'minutes'); },
                        resolveLabel: function (minutes) {
                            return adapter.format(adapter.setMinutes(now, minutes), 'minutes');
                        },
                        timeStep: timeSteps.minutes,
                        hasValue: !!value,
                        resolveAriaLabel: translations.minutesClockNumberText,
                    }),
                };
            }
            case 'seconds': {
                return {
                    onChange: function (seconds) {
                        setValueAndGoToNextView(adapter.setSeconds(valueOrReferenceDate, seconds), 'finish', 'seconds');
                    },
                    items: (0, MultiSectionDigitalClock_utils_1.getTimeSectionOptions)({
                        value: adapter.getSeconds(valueOrReferenceDate),
                        adapter: adapter,
                        isDisabled: function (seconds) { return isTimeDisabled(seconds, 'seconds'); },
                        resolveLabel: function (seconds) {
                            return adapter.format(adapter.setSeconds(now, seconds), 'seconds');
                        },
                        timeStep: timeSteps.seconds,
                        hasValue: !!value,
                        resolveAriaLabel: translations.secondsClockNumberText,
                    }),
                };
            }
            case 'meridiem': {
                var amLabel = (0, date_utils_1.formatMeridiem)(adapter, 'am');
                var pmLabel = (0, date_utils_1.formatMeridiem)(adapter, 'pm');
                return {
                    onChange: handleMeridiemChange,
                    items: [
                        {
                            value: 'am',
                            label: amLabel,
                            isSelected: function () { return !!value && meridiemMode === 'am'; },
                            isFocused: function () { return !!valueOrReferenceDate && meridiemMode === 'am'; },
                            ariaLabel: amLabel,
                        },
                        {
                            value: 'pm',
                            label: pmLabel,
                            isSelected: function () { return !!value && meridiemMode === 'pm'; },
                            isFocused: function () { return !!valueOrReferenceDate && meridiemMode === 'pm'; },
                            ariaLabel: pmLabel,
                        },
                    ],
                };
            }
            default:
                throw new Error("Unknown view: ".concat(viewToBuild, " found."));
        }
    }, [
        now,
        value,
        ampm,
        adapter,
        timeSteps.hours,
        timeSteps.minutes,
        timeSteps.seconds,
        translations.hoursClockNumberText,
        translations.minutesClockNumberText,
        translations.secondsClockNumberText,
        meridiemMode,
        setValueAndGoToNextView,
        valueOrReferenceDate,
        isTimeDisabled,
        handleMeridiemChange,
    ]);
    var viewsToRender = React.useMemo(function () {
        if (!isRtl) {
            return views;
        }
        var digitViews = views.filter(function (v) { return v !== 'meridiem'; });
        digitViews.reverse();
        if (views.includes('meridiem')) {
            digitViews.push('meridiem');
        }
        return digitViews;
    }, [isRtl, views]);
    var viewTimeOptions = React.useMemo(function () {
        return views.reduce(function (result, currentView) {
            var _a;
            return __assign(__assign({}, result), (_a = {}, _a[currentView] = buildViewProps(currentView), _a));
        }, {});
    }, [views, buildViewProps]);
    var ownerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var classes = useUtilityClasses(classesProp);
    return (<MultiSectionDigitalClockRoot ref={ref} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} role="group" {...other}>
      {viewsToRender.map(function (timeView) { return (<MultiSectionDigitalClockSection_1.MultiSectionDigitalClockSection key={timeView} items={viewTimeOptions[timeView].items} onChange={viewTimeOptions[timeView].onChange} active={view === timeView} autoFocus={autoFocus || focusedView === timeView} disabled={disabled} readOnly={readOnly} slots={slots} slotProps={slotProps} skipDisabled={skipDisabled} aria-label={translations.selectViewText(timeView)}/>); })}
    </MultiSectionDigitalClockRoot>);
});
exports.MultiSectionDigitalClock.propTypes = {
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
    focusedView: prop_types_1.default.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
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
    openTo: prop_types_1.default.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
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
     * Overrideable component slots.
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
     * The time steps between two time unit options.
     * For example, if `timeSteps.minutes = 8`, then the available minute options will be `[0, 8, 16, 24, 32, 40, 48, 56]`.
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
    view: prop_types_1.default.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
    /**
     * Available views.
     * @default ['hours', 'minutes']
     */
    views: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['hours', 'meridiem', 'minutes', 'seconds']).isRequired),
};
