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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickersCalendarHeader = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var Fade_1 = require("@mui/material/Fade");
var styles_1 = require("@mui/material/styles");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var composeClasses_1 = require("@mui/utils/composeClasses");
var IconButton_1 = require("@mui/material/IconButton");
var hooks_1 = require("../hooks");
var PickersFadeTransitionGroup_1 = require("../DateCalendar/PickersFadeTransitionGroup");
var icons_1 = require("../icons");
var PickersArrowSwitcher_1 = require("../internals/components/PickersArrowSwitcher");
var date_helpers_hooks_1 = require("../internals/hooks/date-helpers-hooks");
var pickersCalendarHeaderClasses_1 = require("./pickersCalendarHeaderClasses");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        labelContainer: ['labelContainer'],
        label: ['label'],
        switchViewButton: ['switchViewButton'],
        switchViewIcon: ['switchViewIcon'],
    };
    return (0, composeClasses_1.default)(slots, pickersCalendarHeaderClasses_1.getPickersCalendarHeaderUtilityClass, classes);
};
var PickersCalendarHeaderRoot = (0, styles_1.styled)('div', {
    name: 'MuiPickersCalendarHeader',
    slot: 'Root',
})({
    display: 'flex',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
    paddingLeft: 24,
    paddingRight: 12,
    // prevent jumping in safari
    maxHeight: 40,
    minHeight: 40,
});
var PickersCalendarHeaderLabelContainer = (0, styles_1.styled)('div', {
    name: 'MuiPickersCalendarHeader',
    slot: 'LabelContainer',
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({ display: 'flex', overflow: 'hidden', alignItems: 'center', cursor: 'pointer', marginRight: 'auto' }, theme.typography.body1), { fontWeight: theme.typography.fontWeightMedium }));
});
var PickersCalendarHeaderLabel = (0, styles_1.styled)('div', {
    name: 'MuiPickersCalendarHeader',
    slot: 'Label',
})({
    marginRight: 6,
});
var PickersCalendarHeaderSwitchViewButton = (0, styles_1.styled)(IconButton_1.default, {
    name: 'MuiPickersCalendarHeader',
    slot: 'SwitchViewButton',
})({
    marginRight: 'auto',
    variants: [
        {
            props: { view: 'year' },
            style: (_a = {},
                _a[".".concat(pickersCalendarHeaderClasses_1.pickersCalendarHeaderClasses.switchViewIcon)] = {
                    transform: 'rotate(180deg)',
                },
                _a),
        },
    ],
});
var PickersCalendarHeaderSwitchViewIcon = (0, styles_1.styled)(icons_1.ArrowDropDownIcon, {
    name: 'MuiPickersCalendarHeader',
    slot: 'SwitchViewIcon',
})(function (_a) {
    var theme = _a.theme;
    return ({
        willChange: 'transform',
        transition: theme.transitions.create('transform'),
        transform: 'rotate(0deg)',
    });
});
/**
 * Demos:
 *
 * - [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/)
 * - [DateRangeCalendar](https://mui.com/x/react-date-pickers/date-range-calendar/)
 * - [Custom slots and subcomponents](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [PickersCalendarHeader API](https://mui.com/x/api/date-pickers/pickers-calendar-header/)
 */
var PickersCalendarHeader = React.forwardRef(function PickersCalendarHeader(inProps, ref) {
    var _a, _b;
    var translations = (0, hooks_1.usePickerTranslations)();
    var adapter = (0, hooks_1.usePickerAdapter)();
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPickersCalendarHeader' });
    var slots = props.slots, slotProps = props.slotProps, month = props.currentMonth, disabled = props.disabled, disableFuture = props.disableFuture, disablePast = props.disablePast, maxDate = props.maxDate, minDate = props.minDate, onMonthChange = props.onMonthChange, onViewChange = props.onViewChange, view = props.view, reduceAnimations = props.reduceAnimations, views = props.views, labelId = props.labelId, className = props.className, classesProp = props.classes, timezone = props.timezone, _c = props.format, format = _c === void 0 ? "".concat(adapter.formats.month, " ").concat(adapter.formats.year) : _c, other = __rest(props, ["slots", "slotProps", "currentMonth", "disabled", "disableFuture", "disablePast", "maxDate", "minDate", "onMonthChange", "onViewChange", "view", "reduceAnimations", "views", "labelId", "className", "classes", "timezone", "format"]);
    var ownerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var classes = useUtilityClasses(classesProp);
    var SwitchViewButton = (_a = slots === null || slots === void 0 ? void 0 : slots.switchViewButton) !== null && _a !== void 0 ? _a : PickersCalendarHeaderSwitchViewButton;
    var switchViewButtonProps = (0, useSlotProps_1.default)({
        elementType: SwitchViewButton,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.switchViewButton,
        additionalProps: {
            size: 'small',
            'aria-label': translations.calendarViewSwitchingButtonAriaLabel(view),
        },
        ownerState: __assign(__assign({}, ownerState), { view: view }),
        className: classes.switchViewButton,
    });
    var SwitchViewIcon = (_b = slots === null || slots === void 0 ? void 0 : slots.switchViewIcon) !== null && _b !== void 0 ? _b : PickersCalendarHeaderSwitchViewIcon;
    // The spread is here to avoid this bug mui/material-ui#34056
    var _d = (0, useSlotProps_1.default)({
        elementType: SwitchViewIcon,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.switchViewIcon,
        ownerState: ownerState,
        className: classes.switchViewIcon,
    }), switchViewIconOwnerState = _d.ownerState, switchViewIconProps = __rest(_d, ["ownerState"]);
    var selectNextMonth = function () { return onMonthChange(adapter.addMonths(month, 1)); };
    var selectPreviousMonth = function () { return onMonthChange(adapter.addMonths(month, -1)); };
    var isNextMonthDisabled = (0, date_helpers_hooks_1.useNextMonthDisabled)(month, {
        disableFuture: disableFuture,
        maxDate: maxDate,
        timezone: timezone,
    });
    var isPreviousMonthDisabled = (0, date_helpers_hooks_1.usePreviousMonthDisabled)(month, {
        disablePast: disablePast,
        minDate: minDate,
        timezone: timezone,
    });
    var handleToggleView = function () {
        if (views.length === 1 || !onViewChange || disabled) {
            return;
        }
        if (views.length === 2) {
            onViewChange(views.find(function (el) { return el !== view; }) || views[0]);
        }
        else {
            // switching only between first 2
            var nextIndexToOpen = views.indexOf(view) !== 0 ? 0 : 1;
            onViewChange(views[nextIndexToOpen]);
        }
    };
    // No need to display more information
    if (views.length === 1 && views[0] === 'year') {
        return null;
    }
    var label = adapter.formatByString(month, format);
    return (<PickersCalendarHeaderRoot {...other} ownerState={ownerState} className={(0, clsx_1.default)(classes.root, className)} ref={ref}>
      <PickersCalendarHeaderLabelContainer role="presentation" onClick={handleToggleView} ownerState={ownerState} 
    // putting this on the label item element below breaks when using transition
    aria-live="polite" className={classes.labelContainer}>
        <PickersFadeTransitionGroup_1.PickersFadeTransitionGroup reduceAnimations={reduceAnimations} transKey={label}>
          <PickersCalendarHeaderLabel id={labelId} data-testid="calendar-month-and-year-text" ownerState={ownerState} className={classes.label}>
            {label}
          </PickersCalendarHeaderLabel>
        </PickersFadeTransitionGroup_1.PickersFadeTransitionGroup>
        {views.length > 1 && !disabled && (<SwitchViewButton {...switchViewButtonProps}>
            <SwitchViewIcon {...switchViewIconProps}/>
          </SwitchViewButton>)}
      </PickersCalendarHeaderLabelContainer>
      <Fade_1.default in={view === 'day'} appear={!reduceAnimations} enter={!reduceAnimations}>
        <PickersArrowSwitcher_1.PickersArrowSwitcher slots={slots} slotProps={slotProps} onGoToPrevious={selectPreviousMonth} isPreviousDisabled={isPreviousMonthDisabled} previousLabel={translations.previousMonth} onGoToNext={selectNextMonth} isNextDisabled={isNextMonthDisabled} nextLabel={translations.nextMonth}/>
      </Fade_1.default>
    </PickersCalendarHeaderRoot>);
});
exports.PickersCalendarHeader = PickersCalendarHeader;
PickersCalendarHeader.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
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
