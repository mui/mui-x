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
exports.YearCalendar = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var createStyled_1 = require("@mui/system/createStyled");
var styles_1 = require("@mui/material/styles");
var useForkRef_1 = require("@mui/utils/useForkRef");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useControlled_1 = require("@mui/utils/useControlled");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var YearCalendarButton_1 = require("./YearCalendarButton");
var useUtils_1 = require("../internals/hooks/useUtils");
var yearCalendarClasses_1 = require("./yearCalendarClasses");
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
    return (0, composeClasses_1.default)(slots, yearCalendarClasses_1.getYearCalendarUtilityClass, classes);
};
function useYearCalendarDefaultizedProps(props, name) {
    var _a, _b;
    var themeProps = (0, styles_1.useThemeProps)({ props: props, name: name });
    var validationProps = (0, useDateManager_1.useApplyDefaultValuesToDateValidationProps)(themeProps);
    return __assign(__assign(__assign({}, themeProps), validationProps), { yearsPerRow: (_a = themeProps.yearsPerRow) !== null && _a !== void 0 ? _a : 3, yearsOrder: (_b = themeProps.yearsOrder) !== null && _b !== void 0 ? _b : 'asc' });
}
var YearCalendarRoot = (0, styles_1.styled)('div', {
    name: 'MuiYearCalendar',
    slot: 'Root',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'yearsPerRow'; },
})({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    rowGap: 12,
    padding: '6px 0',
    overflowY: 'auto',
    height: '100%',
    width: dimensions_1.DIALOG_WIDTH,
    maxHeight: dimensions_1.MAX_CALENDAR_HEIGHT,
    // avoid padding increasing width over defined
    boxSizing: 'border-box',
    position: 'relative',
    variants: [
        {
            props: { yearsPerRow: 3 },
            style: { columnGap: 24 },
        },
        {
            props: { yearsPerRow: 4 },
            style: { columnGap: 0, padding: '0 2px' },
        },
    ],
});
var YearCalendarButtonFiller = (0, styles_1.styled)('div', {
    name: 'MuiYearCalendar',
    slot: 'ButtonFiller',
})({
    height: 36,
    width: 72,
});
/**
 * Demos:
 *
 * - [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/)
 *
 * API:
 *
 * - [YearCalendar API](https://mui.com/x/api/date-pickers/year-calendar/)
 */
exports.YearCalendar = React.forwardRef(function YearCalendar(inProps, ref) {
    var props = useYearCalendarDefaultizedProps(inProps, 'MuiYearCalendar');
    var autoFocus = props.autoFocus, className = props.className, classesProp = props.classes, valueProp = props.value, defaultValue = props.defaultValue, referenceDateProp = props.referenceDate, disabled = props.disabled, disableFuture = props.disableFuture, disablePast = props.disablePast, maxDate = props.maxDate, minDate = props.minDate, onChange = props.onChange, readOnly = props.readOnly, shouldDisableYear = props.shouldDisableYear, disableHighlightToday = props.disableHighlightToday, onYearFocus = props.onYearFocus, hasFocus = props.hasFocus, onFocusedViewChange = props.onFocusedViewChange, yearsOrder = props.yearsOrder, yearsPerRow = props.yearsPerRow, timezoneProp = props.timezone, gridLabelId = props.gridLabelId, slots = props.slots, slotProps = props.slotProps, other = __rest(props, ["autoFocus", "className", "classes", "value", "defaultValue", "referenceDate", "disabled", "disableFuture", "disablePast", "maxDate", "minDate", "onChange", "readOnly", "shouldDisableYear", "disableHighlightToday", "onYearFocus", "hasFocus", "onFocusedViewChange", "yearsOrder", "yearsPerRow", "timezone", "gridLabelId", "slots", "slotProps"]);
    var _a = (0, useControlledValue_1.useControlledValue)({
        name: 'YearCalendar',
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
            granularity: getDefaultReferenceDate_1.SECTION_TYPE_GRANULARITY.year,
        });
    }, []);
    var classes = useUtilityClasses(classesProp);
    var todayYear = React.useMemo(function () { return adapter.getYear(now); }, [adapter, now]);
    var selectedYear = React.useMemo(function () {
        if (value != null) {
            return adapter.getYear(value);
        }
        return null;
    }, [value, adapter]);
    var _b = React.useState(function () { return selectedYear || adapter.getYear(referenceDate); }), focusedYear = _b[0], setFocusedYear = _b[1];
    var _c = (0, useControlled_1.default)({
        name: 'YearCalendar',
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
    var isYearDisabled = React.useCallback(function (dateToValidate) {
        if (disablePast && adapter.isBeforeYear(dateToValidate, now)) {
            return true;
        }
        if (disableFuture && adapter.isAfterYear(dateToValidate, now)) {
            return true;
        }
        if (minDate && adapter.isBeforeYear(dateToValidate, minDate)) {
            return true;
        }
        if (maxDate && adapter.isAfterYear(dateToValidate, maxDate)) {
            return true;
        }
        if (!shouldDisableYear) {
            return false;
        }
        var yearToValidate = adapter.startOfYear(dateToValidate);
        return shouldDisableYear(yearToValidate);
    }, [disableFuture, disablePast, maxDate, minDate, now, shouldDisableYear, adapter]);
    var handleYearSelection = (0, useEventCallback_1.default)(function (event, year) {
        if (readOnly) {
            return;
        }
        var newDate = adapter.setYear(value !== null && value !== void 0 ? value : referenceDate, year);
        handleValueChange(newDate);
    });
    var focusYear = (0, useEventCallback_1.default)(function (year) {
        if (!isYearDisabled(adapter.setYear(value !== null && value !== void 0 ? value : referenceDate, year))) {
            setFocusedYear(year);
            changeHasFocus(true);
            onYearFocus === null || onYearFocus === void 0 ? void 0 : onYearFocus(year);
        }
    });
    React.useEffect(function () {
        setFocusedYear(function (prevFocusedYear) {
            return selectedYear !== null && prevFocusedYear !== selectedYear ? selectedYear : prevFocusedYear;
        });
    }, [selectedYear]);
    var verticalDirection = yearsOrder !== 'desc' ? yearsPerRow * 1 : yearsPerRow * -1;
    var horizontalDirection = (isRtl && yearsOrder === 'asc') || (!isRtl && yearsOrder === 'desc') ? -1 : 1;
    var handleKeyDown = (0, useEventCallback_1.default)(function (event, year) {
        switch (event.key) {
            case 'ArrowUp':
                focusYear(year - verticalDirection);
                event.preventDefault();
                break;
            case 'ArrowDown':
                focusYear(year + verticalDirection);
                event.preventDefault();
                break;
            case 'ArrowLeft':
                focusYear(year - horizontalDirection);
                event.preventDefault();
                break;
            case 'ArrowRight':
                focusYear(year + horizontalDirection);
                event.preventDefault();
                break;
            default:
                break;
        }
    });
    var handleYearFocus = (0, useEventCallback_1.default)(function (event, year) {
        focusYear(year);
    });
    var handleYearBlur = (0, useEventCallback_1.default)(function (event, year) {
        if (focusedYear === year) {
            changeHasFocus(false);
        }
    });
    var scrollerRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(ref, scrollerRef);
    React.useEffect(function () {
        if (autoFocus || scrollerRef.current === null) {
            return;
        }
        var tabbableButton = scrollerRef.current.querySelector('[tabindex="0"]');
        if (!tabbableButton) {
            return;
        }
        // Taken from useScroll in x-data-grid, but vertically centered
        var offsetHeight = tabbableButton.offsetHeight;
        var offsetTop = tabbableButton.offsetTop;
        var clientHeight = scrollerRef.current.clientHeight;
        var scrollTop = scrollerRef.current.scrollTop;
        var elementBottom = offsetTop + offsetHeight;
        if (offsetHeight > clientHeight || offsetTop < scrollTop) {
            // Button already visible
            return;
        }
        scrollerRef.current.scrollTop = elementBottom - clientHeight / 2 - offsetHeight / 2;
    }, [autoFocus]);
    var yearRange = adapter.getYearRange([minDate, maxDate]);
    if (yearsOrder === 'desc') {
        yearRange.reverse();
    }
    var fillerAmount = yearsPerRow - (yearRange.length % yearsPerRow);
    if (fillerAmount === yearsPerRow) {
        fillerAmount = 0;
    }
    return (<YearCalendarRoot ref={handleRef} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} role="radiogroup" aria-labelledby={gridLabelId} yearsPerRow={yearsPerRow} {...other}>
      {yearRange.map(function (year) {
            var yearNumber = adapter.getYear(year);
            var isSelected = yearNumber === selectedYear;
            var isDisabled = disabled || isYearDisabled(year);
            return (<YearCalendarButton_1.YearCalendarButton key={adapter.format(year, 'year')} selected={isSelected} value={yearNumber} onClick={handleYearSelection} onKeyDown={handleKeyDown} autoFocus={internalHasFocus && yearNumber === focusedYear} disabled={isDisabled} tabIndex={yearNumber === focusedYear && !isDisabled ? 0 : -1} onFocus={handleYearFocus} onBlur={handleYearBlur} aria-current={todayYear === yearNumber ? 'date' : undefined} slots={slots} slotProps={slotProps} classes={classesProp}>
            {adapter.format(year, 'year')}
          </YearCalendarButton_1.YearCalendarButton>);
        })}
      {Array.from({ length: fillerAmount }, function (_, index) { return (<YearCalendarButtonFiller key={index}/>); })}
    </YearCalendarRoot>);
});
exports.YearCalendar.propTypes = {
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
     * Callback fired when the value changes.
     * @param {PickerValidDate} value The new value.
     */
    onChange: prop_types_1.default.func,
    onFocusedViewChange: prop_types_1.default.func,
    onYearFocus: prop_types_1.default.func,
    /**
     * If `true`, the component is read-only.
     * When read-only, the value cannot be changed but the user can interact with the interface.
     * @default false
     */
    readOnly: prop_types_1.default.bool,
    /**
     * The date used to generate the new value when both `value` and `defaultValue` are empty.
     * @default The closest valid year using the validation props, except callbacks such as `shouldDisableYear`.
     */
    referenceDate: prop_types_1.default.object,
    /**
     * Disable specific year.
     * @param {PickerValidDate} year The year to test.
     * @returns {boolean} If `true`, the year will be disabled.
     */
    shouldDisableYear: prop_types_1.default.func,
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
     * Years are displayed in ascending (chronological) order by default.
     * If `desc`, years are displayed in descending order.
     * @default 'asc'
     */
    yearsOrder: prop_types_1.default.oneOf(['asc', 'desc']),
    /**
     * Years rendered per row.
     * @default 3
     */
    yearsPerRow: prop_types_1.default.oneOf([3, 4]),
};
