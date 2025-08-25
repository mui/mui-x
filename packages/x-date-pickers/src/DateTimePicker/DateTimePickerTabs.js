"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimePickerTabs = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var Tab_1 = require("@mui/material/Tab");
var Tabs_1 = require("@mui/material/Tabs");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var icons_1 = require("../icons");
var usePickerTranslations_1 = require("../hooks/usePickerTranslations");
var dateTimePickerTabsClasses_1 = require("./dateTimePickerTabsClasses");
var date_utils_1 = require("../internals/utils/date-utils");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var hooks_1 = require("../hooks");
var viewToTab = function (view) {
    if ((0, date_utils_1.isDatePickerView)(view)) {
        return 'date';
    }
    return 'time';
};
var tabToView = function (tab) {
    if (tab === 'date') {
        return 'day';
    }
    return 'hours';
};
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
    };
    return (0, composeClasses_1.default)(slots, dateTimePickerTabsClasses_1.getDateTimePickerTabsUtilityClass, classes);
};
var DateTimePickerTabsRoot = (0, styles_1.styled)(Tabs_1.default, {
    name: 'MuiDateTimePickerTabs',
    slot: 'Root',
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return ({
        boxShadow: "0 -1px 0 0 inset ".concat((theme.vars || theme).palette.divider),
        '&:last-child': (_b = {
                boxShadow: "0 1px 0 0 inset ".concat((theme.vars || theme).palette.divider)
            },
            _b["& .".concat(Tabs_1.tabsClasses.indicator)] = {
                bottom: 'auto',
                top: 0,
            },
            _b),
    });
});
/**
 * Demos:
 *
 * - [DateTimePicker](https://mui.com/x/react-date-pickers/date-time-picker/)
 * - [Custom slots and subcomponents](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [DateTimePickerTabs API](https://mui.com/x/api/date-pickers/date-time-picker-tabs/)
 */
var DateTimePickerTabs = function DateTimePickerTabs(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiDateTimePickerTabs' });
    var _a = props.dateIcon, dateIcon = _a === void 0 ? <icons_1.DateRangeIcon /> : _a, _b = props.timeIcon, timeIcon = _b === void 0 ? <icons_1.TimeIcon /> : _b, _c = props.hidden, hidden = _c === void 0 ? typeof window === 'undefined' || window.innerHeight < 667 : _c, className = props.className, classesProp = props.classes, sx = props.sx;
    var translations = (0, usePickerTranslations_1.usePickerTranslations)();
    var ownerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var _d = (0, hooks_1.usePickerContext)(), view = _d.view, setView = _d.setView;
    var classes = useUtilityClasses(classesProp);
    var handleChange = function (event, value) {
        setView(tabToView(value));
    };
    if (hidden) {
        return null;
    }
    return (<DateTimePickerTabsRoot ownerState={ownerState} variant="fullWidth" value={viewToTab(view)} onChange={handleChange} className={(0, clsx_1.default)(className, classes.root)} sx={sx}>
      <Tab_1.default value="date" aria-label={translations.dateTableLabel} icon={<React.Fragment>{dateIcon}</React.Fragment>}/>
      <Tab_1.default value="time" aria-label={translations.timeTableLabel} icon={<React.Fragment>{timeIcon}</React.Fragment>}/>
    </DateTimePickerTabsRoot>);
};
exports.DateTimePickerTabs = DateTimePickerTabs;
DateTimePickerTabs.propTypes = {
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
     * @default DateRange
     */
    dateIcon: prop_types_1.default.node,
    /**
     * Toggles visibility of the tabs allowing view switching.
     * @default `window.innerHeight < 667` for `DesktopDateTimePicker` and `MobileDateTimePicker`, `displayStaticWrapperAs === 'desktop'` for `StaticDateTimePicker`
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
     * @default Time
     */
    timeIcon: prop_types_1.default.node,
};
