"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeRangePickerTabs = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var Tab_1 = require("@mui/material/Tab");
var Tabs_1 = require("@mui/material/Tabs");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var icons_1 = require("@mui/x-date-pickers/icons");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var timeRangePickerTabsClasses_1 = require("./timeRangePickerTabsClasses");
var hooks_2 = require("../hooks");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        tab: ['tab'],
    };
    return (0, composeClasses_1.default)(slots, timeRangePickerTabsClasses_1.getTimeRangePickerTabsUtilityClass, classes);
};
var TimeRangePickerTabsRoot = (0, styles_1.styled)(Tabs_1.default, {
    name: 'MuiTimeRangePickerTabs',
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
var TimeRangePickerTab = (0, styles_1.styled)(Tab_1.default, {
    name: 'MuiTimeRangePickerTabs',
    slot: 'Tab',
})(function (_a) {
    var theme = _a.theme;
    return ({
        minHeight: '48px',
        gap: theme.spacing(1),
    });
});
/**
 * Demos:
 *
 * - [TimeRangePicker](https://mui.com/x/react-date-pickers/time-range-picker/)
 * - [Custom slots and subcomponents](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [TimeRangePickerTabs API](https://mui.com/x/api/date-pickers/time-range-picker-tabs/)
 */
var TimeRangePickerTabs = function TimeRangePickerTabs(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiTimeRangePickerTabs' });
    var _a = props.timeIcon, timeIcon = _a === void 0 ? <icons_1.TimeIcon /> : _a, _b = props.hidden, hidden = _b === void 0 ? typeof window === 'undefined' || window.innerHeight < 667 : _b, className = props.className, sx = props.sx, classesProp = props.classes;
    var translations = (0, hooks_1.usePickerTranslations)();
    var _c = (0, hooks_1.usePickerContext)(), view = _c.view, setView = _c.setView;
    var _d = (0, hooks_2.usePickerRangePositionContext)(), rangePosition = _d.rangePosition, setRangePosition = _d.setRangePosition;
    var classes = useUtilityClasses(classesProp);
    var handleChange = function (event, value) {
        if (rangePosition !== value) {
            setRangePosition(value);
        }
        if (view !== 'hours') {
            setView('hours');
        }
    };
    if (hidden) {
        return null;
    }
    return (<TimeRangePickerTabsRoot variant="fullWidth" value={rangePosition} onChange={handleChange} className={(0, clsx_1.default)(className, classes.root)} sx={sx}>
      <TimeRangePickerTab value="start" iconPosition="start" icon={timeIcon} label={translations.start} className={classes.tab}/>
      <TimeRangePickerTab value="end" iconPosition="start" label={translations.end} icon={timeIcon} className={classes.tab}/>
    </TimeRangePickerTabsRoot>);
};
exports.TimeRangePickerTabs = TimeRangePickerTabs;
TimeRangePickerTabs.propTypes = {
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
     * Toggles visibility of the tabs allowing view switching.
     * @default `window.innerHeight < 667` for `DesktopTimeRangePicker` and `MobileTimeRangePicker`, `displayStaticWrapperAs === 'desktop'` for `StaticTimeRangePicker`
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
    timeIcon: prop_types_1.default.element,
};
