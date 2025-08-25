"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeRangePickerTabs = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var icons_1 = require("@mui/x-date-pickers/icons");
var internals_1 = require("@mui/x-date-pickers/internals");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var IconButton_1 = require("@mui/material/IconButton");
var Button_1 = require("@mui/material/Button");
var dateTimeRangePickerTabsClasses_1 = require("./dateTimeRangePickerTabsClasses");
var hooks_2 = require("../hooks");
var viewToTab = function (view, rangePosition) {
    if ((0, internals_1.isDatePickerView)(view)) {
        return rangePosition === 'start' ? 'start-date' : 'end-date';
    }
    return rangePosition === 'start' ? 'start-time' : 'end-time';
};
var tabToView = function (tab) {
    if (tab === 'start-date' || tab === 'end-date') {
        return 'day';
    }
    return 'hours';
};
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        tabButton: ['tabButton'],
        navigationButton: ['navigationButton'],
        filler: ['filler'],
    };
    return (0, composeClasses_1.default)(slots, dateTimeRangePickerTabsClasses_1.getDateTimeRangePickerTabsUtilityClass, classes);
};
var DateTimeRangePickerTabsRoot = (0, styles_1.styled)('div', {
    name: 'MuiDateTimeRangePickerTabs',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: "1px solid ".concat((theme.vars || theme).palette.divider),
        minHeight: 48,
    });
});
var DateTimeRangePickerTab = (0, styles_1.styled)(Button_1.default, {
    name: 'MuiDateTimeRangePickerTabs',
    slot: 'TabButton',
})({
    textTransform: 'none',
});
var DateTimeRangePickerTabFiller = (0, styles_1.styled)('div', {
    name: 'MuiDateTimeRangePickerTabs',
    slot: 'Filler',
})({ width: 40 });
var tabOptions = ['start-date', 'start-time', 'end-date', 'end-time'];
var DateTimeRangePickerTabs = function DateTimeRangePickerTabs(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiDateTimeRangePickerTabs' });
    var _a = props.dateIcon, dateIcon = _a === void 0 ? <icons_1.DateRangeIcon /> : _a, _b = props.timeIcon, timeIcon = _b === void 0 ? <icons_1.TimeIcon /> : _b, _c = props.hidden, hidden = _c === void 0 ? typeof window === 'undefined' || window.innerHeight < 667 : _c, className = props.className, classesProp = props.classes, sx = props.sx;
    var translations = (0, hooks_1.usePickerTranslations)();
    var ownerState = (0, internals_1.usePickerPrivateContext)().ownerState;
    var _d = (0, hooks_1.usePickerContext)(), view = _d.view, setView = _d.setView;
    var classes = useUtilityClasses(classesProp);
    var _e = (0, hooks_2.usePickerRangePositionContext)(), rangePosition = _e.rangePosition, setRangePosition = _e.setRangePosition;
    var value = React.useMemo(function () { return (view == null ? null : viewToTab(view, rangePosition)); }, [view, rangePosition]);
    var isPreviousHidden = value === 'start-date';
    var isNextHidden = value === 'end-time';
    var tabLabel = React.useMemo(function () {
        switch (value) {
            case 'start-date':
                return translations.startDate;
            case 'start-time':
                return translations.startTime;
            case 'end-date':
                return translations.endDate;
            case 'end-time':
                return translations.endTime;
            default:
                return '';
        }
    }, [
        translations.endDate,
        translations.endTime,
        translations.startDate,
        translations.startTime,
        value,
    ]);
    var handleRangePositionChange = (0, useEventCallback_1.default)(function (newTab) {
        if (newTab.includes('start')) {
            setRangePosition('start');
        }
        else {
            setRangePosition('end');
        }
    });
    var changeToPreviousTab = (0, useEventCallback_1.default)(function () {
        var previousTab = value == null ? tabOptions[0] : tabOptions[tabOptions.indexOf(value) - 1];
        setView(tabToView(previousTab));
        handleRangePositionChange(previousTab);
    });
    var changeToNextTab = (0, useEventCallback_1.default)(function () {
        var nextTab = value == null ? tabOptions[0] : tabOptions[tabOptions.indexOf(value) + 1];
        setView(tabToView(nextTab));
        handleRangePositionChange(nextTab);
    });
    if (hidden) {
        return null;
    }
    var startIcon;
    if (view == null) {
        startIcon = null;
    }
    else if ((0, internals_1.isDatePickerView)(view)) {
        startIcon = dateIcon;
    }
    else {
        startIcon = timeIcon;
    }
    return (<DateTimeRangePickerTabsRoot ownerState={ownerState} className={(0, clsx_1.default)(classes.root, className)} sx={sx}>
      {!isPreviousHidden ? (<IconButton_1.default onClick={changeToPreviousTab} className={classes.navigationButton} title={translations.openPreviousView}>
          <icons_1.ArrowLeftIcon />
        </IconButton_1.default>) : (<DateTimeRangePickerTabFiller className={classes.filler}/>)}

      <DateTimeRangePickerTab startIcon={startIcon} className={classes.tabButton} size="large">
        {tabLabel}
      </DateTimeRangePickerTab>
      {!isNextHidden ? (<IconButton_1.default onClick={changeToNextTab} className={classes.navigationButton} title={translations.openNextView}>
          <icons_1.ArrowRightIcon />
        </IconButton_1.default>) : (<DateTimeRangePickerTabFiller className={classes.filler}/>)}
    </DateTimeRangePickerTabsRoot>);
};
exports.DateTimeRangePickerTabs = DateTimeRangePickerTabs;
DateTimeRangePickerTabs.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * Date tab icon.
     * @default DateRangeIcon
     */
    dateIcon: prop_types_1.default.element,
    /**
     * Toggles visibility of the tabs allowing view switching.
     * @default `window.innerHeight < 667` for `DesktopDateTimeRangePicker` and `MobileDateTimeRangePicker`
     */
    hidden: prop_types_1.default.bool,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    /**
     * Time tab icon.
     * @default TimeIcon
     */
    timeIcon: prop_types_1.default.element,
};
