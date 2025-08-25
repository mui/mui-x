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
exports.DigitalClock = exports.DigitalClockItem = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var styles_1 = require("@mui/material/styles");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var composeClasses_1 = require("@mui/utils/composeClasses");
var MenuItem_1 = require("@mui/material/MenuItem");
var MenuList_1 = require("@mui/material/MenuList");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var hooks_1 = require("../hooks");
var useUtils_1 = require("../internals/hooks/useUtils");
var time_utils_1 = require("../internals/utils/time-utils");
var PickerViewRoot_1 = require("../internals/components/PickerViewRoot");
var digitalClockClasses_1 = require("./digitalClockClasses");
var useViews_1 = require("../internals/hooks/useViews");
var dimensions_1 = require("../internals/constants/dimensions");
var useControlledValue_1 = require("../internals/hooks/useControlledValue");
var valueManagers_1 = require("../internals/utils/valueManagers");
var useClockReferenceDate_1 = require("../internals/hooks/useClockReferenceDate");
var utils_1 = require("../internals/utils/utils");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        list: ['list'],
        item: ['item'],
    };
    return (0, composeClasses_1.default)(slots, digitalClockClasses_1.getDigitalClockUtilityClass, classes);
};
var DigitalClockRoot = (0, styles_1.styled)(PickerViewRoot_1.PickerViewRoot, {
    name: 'MuiDigitalClock',
    slot: 'Root',
})({
    overflowY: 'auto',
    width: '100%',
    scrollbarWidth: 'thin',
    '@media (prefers-reduced-motion: no-preference)': {
        scrollBehavior: 'auto',
    },
    maxHeight: dimensions_1.DIGITAL_CLOCK_VIEW_HEIGHT,
    variants: [
        {
            props: { hasDigitalClockAlreadyBeenRendered: true },
            style: {
                '@media (prefers-reduced-motion: no-preference)': {
                    scrollBehavior: 'smooth',
                },
            },
        },
    ],
});
var DigitalClockList = (0, styles_1.styled)(MenuList_1.default, {
    name: 'MuiDigitalClock',
    slot: 'List',
})({
    padding: 0,
});
exports.DigitalClockItem = (0, styles_1.styled)(MenuItem_1.default, {
    name: 'MuiDigitalClock',
    slot: 'Item',
    shouldForwardProp: function (prop) { return prop !== 'itemValue' && prop !== 'formattedValue'; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        padding: '8px 16px',
        margin: '2px 4px',
        '&:first-of-type': {
            marginTop: 4,
        },
        '&:hover': {
            backgroundColor: theme.vars
                ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.hoverOpacity, ")")
                : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        },
        '&.Mui-selected': {
            backgroundColor: (theme.vars || theme).palette.primary.main,
            color: (theme.vars || theme).palette.primary.contrastText,
            '&:focus-visible, &:hover': {
                backgroundColor: (theme.vars || theme).palette.primary.dark,
            },
        },
        '&.Mui-focusVisible': {
            backgroundColor: theme.vars
                ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.focusOpacity, ")")
                : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.focusOpacity),
        },
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
 * - [DigitalClock API](https://mui.com/x/api/date-pickers/digital-clock/)
 */
exports.DigitalClock = React.forwardRef(function DigitalClock(inProps, ref) {
    var _a;
    var adapter = (0, hooks_1.usePickerAdapter)();
    var containerRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(ref, containerRef);
    var listRef = React.useRef(null);
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiDigitalClock',
    });
    var _b = props.ampm, ampm = _b === void 0 ? adapter.is12HourCycleInCurrentLocale() : _b, _c = props.timeStep, timeStep = _c === void 0 ? 30 : _c, autoFocus = props.autoFocus, slots = props.slots, slotProps = props.slotProps, valueProp = props.value, defaultValue = props.defaultValue, referenceDateProp = props.referenceDate, _d = props.disableIgnoringDatePartForTimeValidation, disableIgnoringDatePartForTimeValidation = _d === void 0 ? false : _d, maxTime = props.maxTime, minTime = props.minTime, disableFuture = props.disableFuture, disablePast = props.disablePast, _e = props.minutesStep, minutesStep = _e === void 0 ? 1 : _e, shouldDisableTime = props.shouldDisableTime, onChange = props.onChange, inView = props.view, openTo = props.openTo, onViewChange = props.onViewChange, focusedView = props.focusedView, onFocusedViewChange = props.onFocusedViewChange, className = props.className, classesProp = props.classes, disabled = props.disabled, readOnly = props.readOnly, _f = props.views, views = _f === void 0 ? ['hours'] : _f, _g = props.skipDisabled, skipDisabled = _g === void 0 ? false : _g, timezoneProp = props.timezone, other = __rest(props, ["ampm", "timeStep", "autoFocus", "slots", "slotProps", "value", "defaultValue", "referenceDate", "disableIgnoringDatePartForTimeValidation", "maxTime", "minTime", "disableFuture", "disablePast", "minutesStep", "shouldDisableTime", "onChange", "view", "openTo", "onViewChange", "focusedView", "onFocusedViewChange", "className", "classes", "disabled", "readOnly", "views", "skipDisabled", "timezone"]);
    var _h = (0, useControlledValue_1.useControlledValue)({
        name: 'DigitalClock',
        timezone: timezoneProp,
        value: valueProp,
        defaultValue: defaultValue,
        referenceDate: referenceDateProp,
        onChange: onChange,
        valueManager: valueManagers_1.singleItemValueManager,
    }), value = _h.value, handleRawValueChange = _h.handleValueChange, timezone = _h.timezone;
    var translations = (0, hooks_1.usePickerTranslations)();
    var now = (0, useUtils_1.useNow)(timezone);
    var pickerOwnerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var ownerState = __assign(__assign({}, pickerOwnerState), { hasDigitalClockAlreadyBeenRendered: !!containerRef.current });
    var classes = useUtilityClasses(classesProp);
    var ClockItem = (_a = slots === null || slots === void 0 ? void 0 : slots.digitalClockItem) !== null && _a !== void 0 ? _a : exports.DigitalClockItem;
    var clockItemProps = (0, useSlotProps_1.default)({
        elementType: ClockItem,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.digitalClockItem,
        ownerState: ownerState,
        className: classes.item,
    });
    var valueOrReferenceDate = (0, useClockReferenceDate_1.useClockReferenceDate)({
        value: value,
        referenceDate: referenceDateProp,
        adapter: adapter,
        props: props,
        timezone: timezone,
    });
    var handleValueChange = (0, useEventCallback_1.default)(function (newValue) {
        return handleRawValueChange(newValue, 'finish', 'hours');
    });
    var setValueAndGoToNextView = (0, useViews_1.useViews)({
        view: inView,
        views: views,
        openTo: openTo,
        onViewChange: onViewChange,
        onChange: handleValueChange,
        focusedView: focusedView,
        onFocusedViewChange: onFocusedViewChange,
    }).setValueAndGoToNextView;
    var handleItemSelect = (0, useEventCallback_1.default)(function (newValue) {
        setValueAndGoToNextView(newValue, 'finish');
    });
    (0, useEnhancedEffect_1.default)(function () {
        if (containerRef.current === null) {
            return;
        }
        var activeItem = containerRef.current.querySelector('[role="listbox"] [role="option"][tabindex="0"], [role="listbox"] [role="option"][aria-selected="true"]');
        if (!activeItem) {
            return;
        }
        var offsetTop = activeItem.offsetTop;
        if (autoFocus || !!focusedView) {
            activeItem.focus();
        }
        // Subtracting the 4px of extra margin intended for the first visible section item
        containerRef.current.scrollTop = offsetTop - 4;
    });
    var isTimeDisabled = React.useCallback(function (valueToCheck) {
        var isAfter = (0, time_utils_1.createIsAfterIgnoreDatePart)(disableIgnoringDatePartForTimeValidation, adapter);
        var containsValidTime = function () {
            if (minTime && isAfter(minTime, valueToCheck)) {
                return false;
            }
            if (maxTime && isAfter(valueToCheck, maxTime)) {
                return false;
            }
            if (disableFuture && isAfter(valueToCheck, now)) {
                return false;
            }
            if (disablePast && isAfter(now, valueToCheck)) {
                return false;
            }
            return true;
        };
        var isValidValue = function () {
            if (adapter.getMinutes(valueToCheck) % minutesStep !== 0) {
                return false;
            }
            if (shouldDisableTime) {
                return !shouldDisableTime(valueToCheck, 'hours');
            }
            return true;
        };
        return !containsValidTime() || !isValidValue();
    }, [
        disableIgnoringDatePartForTimeValidation,
        adapter,
        minTime,
        maxTime,
        disableFuture,
        now,
        disablePast,
        minutesStep,
        shouldDisableTime,
    ]);
    var timeOptions = React.useMemo(function () {
        var result = [];
        var startOfDay = adapter.startOfDay(valueOrReferenceDate);
        var nextTimeStepOption = startOfDay;
        while (adapter.isSameDay(valueOrReferenceDate, nextTimeStepOption)) {
            result.push(nextTimeStepOption);
            nextTimeStepOption = adapter.addMinutes(nextTimeStepOption, timeStep);
        }
        return result;
    }, [valueOrReferenceDate, timeStep, adapter]);
    var focusedOptionIndex = timeOptions.findIndex(function (option) {
        return adapter.isEqual(option, valueOrReferenceDate);
    });
    var handleKeyDown = function (event) {
        switch (event.key) {
            case 'PageUp': {
                var newIndex = (0, utils_1.getFocusedListItemIndex)(listRef.current) - 5;
                var children = listRef.current.children;
                var newFocusedIndex = Math.max(0, newIndex);
                var childToFocus = children[newFocusedIndex];
                if (childToFocus) {
                    childToFocus.focus();
                }
                event.preventDefault();
                break;
            }
            case 'PageDown': {
                var newIndex = (0, utils_1.getFocusedListItemIndex)(listRef.current) + 5;
                var children = listRef.current.children;
                var newFocusedIndex = Math.min(children.length - 1, newIndex);
                var childToFocus = children[newFocusedIndex];
                if (childToFocus) {
                    childToFocus.focus();
                }
                event.preventDefault();
                break;
            }
            default:
        }
    };
    return (<DigitalClockRoot ref={handleRef} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} {...other}>
      <DigitalClockList ref={listRef} role="listbox" aria-label={translations.timePickerToolbarTitle} className={classes.list} onKeyDown={handleKeyDown}>
        {timeOptions.map(function (option, index) {
            var optionDisabled = isTimeDisabled(option);
            if (skipDisabled && optionDisabled) {
                return null;
            }
            var isSelected = adapter.isEqual(option, value);
            var formattedValue = adapter.format(option, ampm ? 'fullTime12h' : 'fullTime24h');
            var isFocused = focusedOptionIndex === index || (focusedOptionIndex === -1 && index === 0);
            var tabIndex = isFocused ? 0 : -1;
            return (<ClockItem key={"".concat(option.valueOf(), "-").concat(formattedValue)} onClick={function () { return !readOnly && handleItemSelect(option); }} selected={isSelected} disabled={disabled || optionDisabled} disableRipple={readOnly} role="option" 
            // aria-readonly is not supported here and does not have any effect
            aria-disabled={readOnly} aria-selected={isSelected} tabIndex={tabIndex} itemValue={option} formattedValue={formattedValue} {...clockItemProps}>
              {formattedValue}
            </ClockItem>);
        })}
      </DigitalClockList>
    </DigitalClockRoot>);
});
exports.DigitalClock.propTypes = {
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
    focusedView: prop_types_1.default.oneOf(['hours']),
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
    openTo: prop_types_1.default.oneOf(['hours']),
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
     * The time steps between two time options.
     * For example, if `timeStep = 45`, then the available time options will be `[00:00, 00:45, 01:30, 02:15, 03:00, etc.]`.
     * @default 30
     */
    timeStep: prop_types_1.default.number,
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
    view: prop_types_1.default.oneOf(['hours']),
    /**
     * Available views.
     * @default ['hours']
     */
    views: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['hours'])),
};
