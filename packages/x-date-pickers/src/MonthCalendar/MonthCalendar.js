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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthCalendar = void 0;
exports.useMonthCalendarDefaultizedProps = useMonthCalendarDefaultizedProps;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var createStyled_1 = require("@mui/system/createStyled");
var styles_1 = require("@mui/material/styles");
var useControlled_1 = require("@mui/utils/useControlled");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var MonthCalendarButton_1 = require("./MonthCalendarButton");
var useUtils_1 = require("../internals/hooks/useUtils");
var monthCalendarClasses_1 = require("./monthCalendarClasses");
var date_utils_1 = require("../internals/utils/date-utils");
var valueManagers_1 = require("../internals/utils/valueManagers");
var getDefaultReferenceDate_1 = require("../internals/utils/getDefaultReferenceDate");
var useControlledValue_1 = require("../internals/hooks/useControlledValue");
var dimensions_1 = require("../internals/constants/dimensions");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useDateManager_1 = require("../managers/useDateManager");
var usePickerAdapter_1 = require("../hooks/usePickerAdapter");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
    };
    return (0, composeClasses_1.default)(slots, monthCalendarClasses_1.getMonthCalendarUtilityClass, classes);
};
function useMonthCalendarDefaultizedProps(props, name) {
    var _a;
    var themeProps = (0, styles_1.useThemeProps)({ props: props, name: name });
    var validationProps = (0, useDateManager_1.useApplyDefaultValuesToDateValidationProps)(themeProps);
    return __assign(__assign(__assign({}, themeProps), validationProps), { monthsPerRow: (_a = themeProps.monthsPerRow) !== null && _a !== void 0 ? _a : 3 });
}
var MonthCalendarRoot = (0, styles_1.styled)('div', {
    name: 'MuiMonthCalendar',
    slot: 'Root',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'monthsPerRow'; },
})({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    rowGap: 16,
    padding: '8px 0',
    width: dimensions_1.DIALOG_WIDTH,
    // avoid padding increasing width over defined
    boxSizing: 'border-box',
    variants: [
        {
            props: { monthsPerRow: 3 },
            style: { columnGap: 24 },
        },
        {
            props: { monthsPerRow: 4 },
            style: { columnGap: 0 },
        },
    ],
});
/**
 * Demos:
 *
 * - [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/)
 *
 * API:
 *
 * - [MonthCalendar API](https://mui.com/x/api/date-pickers/month-calendar/)
 */
exports.MonthCalendar = React.forwardRef(function MonthCalendar(inProps, ref) {
    var props = useMonthCalendarDefaultizedProps(inProps, 'MuiMonthCalendar');
    var autoFocus = props.autoFocus, className = props.className, classesProp = props.classes, valueProp = props.value, defaultValue = props.defaultValue, referenceDateProp = props.referenceDate, disabled = props.disabled, disableFuture = props.disableFuture, disablePast = props.disablePast, maxDate = props.maxDate, minDate = props.minDate, onChange = props.onChange, shouldDisableMonth = props.shouldDisableMonth, readOnly = props.readOnly, disableHighlightToday = props.disableHighlightToday, onMonthFocus = props.onMonthFocus, hasFocus = props.hasFocus, onFocusedViewChange = props.onFocusedViewChange, monthsPerRow = props.monthsPerRow, timezoneProp = props.timezone, gridLabelId = props.gridLabelId, slots = props.slots, slotProps = props.slotProps, other = __rest(props, ["autoFocus", "className", "classes", "value", "defaultValue", "referenceDate", "disabled", "disableFuture", "disablePast", "maxDate", "minDate", "onChange", "shouldDisableMonth", "readOnly", "disableHighlightToday", "onMonthFocus", "hasFocus", "onFocusedViewChange", "monthsPerRow", "timezone", "gridLabelId", "slots", "slotProps"]);
    var _a = (0, useControlledValue_1.useControlledValue)({
        name: 'MonthCalendar',
        timezone: timezoneProp,
        value: valueProp,
        defaultValue: defaultValue,
        referenceDate: referenceDateProp,
        onChange: onChange,
        valueManager: valueManagers_1.singleItemValueManager,
    }), value = _a.value, handleValueChange = _a.handleValueChange, timezone = _a.timezone;
    var now = (0, useUtils_1.useNow)(timezone);
    var isRtl = (0, RtlProvider_1.useRtl)();
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var ownerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var referenceDate = React.useMemo(function () {
        return valueManagers_1.singleItemValueManager.getInitialReferenceValue({
            value: value,
            adapter: adapter,
            props: props,
            timezone: timezone,
            referenceDate: referenceDateProp,
            granularity: getDefaultReferenceDate_1.SECTION_TYPE_GRANULARITY.month,
        });
    }, []);
    var classes = useUtilityClasses(classesProp);
    var todayMonth = React.useMemo(function () { return adapter.getMonth(now); }, [adapter, now]);
    var selectedMonth = React.useMemo(function () {
        if (value != null) {
            return adapter.getMonth(value);
        }
        return null;
    }, [value, adapter]);
    var _b = React.useState(function () { return selectedMonth || adapter.getMonth(referenceDate); }), focusedMonth = _b[0], setFocusedMonth = _b[1];
    var _c = (0, useControlled_1.default)({
        name: 'MonthCalendar',
        state: 'hasFocus',
        controlled: hasFocus,
        default: autoFocus !== null && autoFocus !== void 0 ? autoFocus : false,
    }), internalHasFocus = _c[0], setInternalHasFocus = _c[1];
    var changeHasFocus = (0, useEventCallback_1.default)(function (newHasFocus) {
        setInternalHasFocus(newHasFocus);
        if (onFocusedViewChange) {
            onFocusedViewChange(newHasFocus);
        }
    });
    var isMonthDisabled = React.useCallback(function (dateToValidate) {
        var firstEnabledMonth = adapter.startOfMonth(disablePast && adapter.isAfter(now, minDate) ? now : minDate);
        var lastEnabledMonth = adapter.startOfMonth(disableFuture && adapter.isBefore(now, maxDate) ? now : maxDate);
        var monthToValidate = adapter.startOfMonth(dateToValidate);
        if (adapter.isBefore(monthToValidate, firstEnabledMonth)) {
            return true;
        }
        if (adapter.isAfter(monthToValidate, lastEnabledMonth)) {
            return true;
        }
        if (!shouldDisableMonth) {
            return false;
        }
        return shouldDisableMonth(monthToValidate);
    }, [disableFuture, disablePast, maxDate, minDate, now, shouldDisableMonth, adapter]);
    var handleMonthSelection = (0, useEventCallback_1.default)(function (event, month) {
        if (readOnly) {
            return;
        }
        var newDate = adapter.setMonth(value !== null && value !== void 0 ? value : referenceDate, month);
        handleValueChange(newDate);
    });
    var focusMonth = (0, useEventCallback_1.default)(function (month) {
        if (!isMonthDisabled(adapter.setMonth(value !== null && value !== void 0 ? value : referenceDate, month))) {
            setFocusedMonth(month);
            changeHasFocus(true);
            if (onMonthFocus) {
                onMonthFocus(month);
            }
        }
    });
    React.useEffect(function () {
        setFocusedMonth(function (prevFocusedMonth) {
            return selectedMonth !== null && prevFocusedMonth !== selectedMonth
                ? selectedMonth
                : prevFocusedMonth;
        });
    }, [selectedMonth]);
    var handleKeyDown = (0, useEventCallback_1.default)(function (event, month) {
        var monthsInYear = 12;
        var monthsInRow = 3;
        switch (event.key) {
            case 'ArrowUp':
                focusMonth((monthsInYear + month - monthsInRow) % monthsInYear);
                event.preventDefault();
                break;
            case 'ArrowDown':
                focusMonth((monthsInYear + month + monthsInRow) % monthsInYear);
                event.preventDefault();
                break;
            case 'ArrowLeft':
                focusMonth((monthsInYear + month + (isRtl ? 1 : -1)) % monthsInYear);
                event.preventDefault();
                break;
            case 'ArrowRight':
                focusMonth((monthsInYear + month + (isRtl ? -1 : 1)) % monthsInYear);
                event.preventDefault();
                break;
            default:
                break;
        }
    });
    var handleMonthFocus = (0, useEventCallback_1.default)(function (event, month) {
        focusMonth(month);
    });
    var handleMonthBlur = (0, useEventCallback_1.default)(function (event, month) {
        if (focusedMonth === month) {
            changeHasFocus(false);
        }
    });
    return (<MonthCalendarRoot ref={ref} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} role="radiogroup" aria-labelledby={gridLabelId} monthsPerRow={monthsPerRow} {...other}>
      {(0, date_utils_1.getMonthsInYear)(adapter, value !== null && value !== void 0 ? value : referenceDate).map(function (month) {
            var monthNumber = adapter.getMonth(month);
            var monthText = adapter.format(month, 'monthShort');
            var monthLabel = adapter.format(month, 'month');
            var isSelected = monthNumber === selectedMonth;
            var isDisabled = disabled || isMonthDisabled(month);
            return (<MonthCalendarButton_1.MonthCalendarButton key={monthText} selected={isSelected} value={monthNumber} onClick={handleMonthSelection} onKeyDown={handleKeyDown} autoFocus={internalHasFocus && monthNumber === focusedMonth} disabled={isDisabled} tabIndex={monthNumber === focusedMonth && !isDisabled ? 0 : -1} onFocus={handleMonthFocus} onBlur={handleMonthBlur} aria-current={todayMonth === monthNumber ? 'date' : undefined} aria-label={monthLabel} slots={slots} slotProps={slotProps} classes={classesProp}>
            {monthText}
          </MonthCalendarButton_1.MonthCalendarButton>);
        })}
    </MonthCalendarRoot>);
});
exports.MonthCalendar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
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
     * If `true`, today's date is rendering without highlighting with circle.
     * @default false
     */
    disableHighlightToday: prop_types_1.default.bool,
    /**
     * If `true`, disable values before the current date for date components, time for time components and both for date time components.
     * @default false
     */
    disablePast: prop_types_1.default.bool,
    gridLabelId: prop_types_1.default.string,
    hasFocus: prop_types_1.default.bool,
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
     * Months rendered per row.
     * @default 3
     */
    monthsPerRow: prop_types_1.default.oneOf([3, 4]),
    /**
     * Callback fired when the value changes.
     * @param {PickerValidDate} value The new value.
     */
    onChange: prop_types_1.default.func,
    onFocusedViewChange: prop_types_1.default.func,
    onMonthFocus: prop_types_1.default.func,
    /**
     * If `true`, the component is read-only.
     * When read-only, the value cannot be changed but the user can interact with the interface.
     * @default false
     */
    readOnly: prop_types_1.default.bool,
    /**
     * The date used to generate the new value when both `value` and `defaultValue` are empty.
     * @default The closest valid month using the validation props, except callbacks such as `shouldDisableMonth`.
     */
    referenceDate: prop_types_1.default.object,
    /**
     * Disable specific month.
     * @param {PickerValidDate} month The month to test.
     * @returns {boolean} If `true`, the month will be disabled.
     */
    shouldDisableMonth: prop_types_1.default.func,
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
};
