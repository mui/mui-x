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
exports.DateRangePickerToolbar = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var Typography_1 = require("@mui/material/Typography");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var internals_1 = require("@mui/x-date-pickers/internals");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var dateRangePickerToolbarClasses_1 = require("./dateRangePickerToolbarClasses");
var hooks_2 = require("../hooks");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        container: ['container'],
    };
    return (0, composeClasses_1.default)(slots, dateRangePickerToolbarClasses_1.getDateRangePickerToolbarUtilityClass, classes);
};
var DateRangePickerToolbarRoot = (0, styles_1.styled)(internals_1.PickersToolbar, {
    name: 'MuiDateRangePickerToolbar',
    slot: 'Root',
})({});
var DateRangePickerToolbarContainer = (0, styles_1.styled)('div', {
    name: 'MuiDateRangePickerToolbar',
    slot: 'Container',
})({
    display: 'flex',
});
/**
 * Demos:
 *
 * - [DateRangePicker](https://mui.com/x/react-date-pickers/date-range-picker/)
 * - [Custom components](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [DateRangePickerToolbar API](https://mui.com/x/api/date-pickers/date-range-picker-toolbar/)
 */
var DateRangePickerToolbar = React.forwardRef(function DateRangePickerToolbar(inProps, ref) {
    var adapter = (0, hooks_1.usePickerAdapter)();
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiDateRangePickerToolbar' });
    var toolbarFormatProp = props.toolbarFormat, className = props.className, classesProp = props.classes, other = __rest(props, ["toolbarFormat", "className", "classes"]);
    var value = (0, hooks_1.usePickerContext)().value;
    var translations = (0, hooks_1.usePickerTranslations)();
    var ownerState = (0, internals_1.useToolbarOwnerState)();
    var _a = (0, hooks_2.usePickerRangePositionContext)(), rangePosition = _a.rangePosition, setRangePosition = _a.setRangePosition;
    var classes = useUtilityClasses(classesProp);
    // This can't be a default value when spreading because it breaks the API generation.
    var toolbarFormat = toolbarFormatProp !== null && toolbarFormatProp !== void 0 ? toolbarFormatProp : adapter.formats.shortDate;
    var formatDate = function (date, fallback) {
        if (!adapter.isValid(date)) {
            return fallback;
        }
        return adapter.formatByString(date, toolbarFormat);
    };
    return (<DateRangePickerToolbarRoot {...other} toolbarTitle={translations.dateRangePickerToolbarTitle} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} ref={ref}>
      <DateRangePickerToolbarContainer className={classes.container}>
        <internals_1.PickersToolbarButton variant={value[0] == null ? 'h6' : 'h5'} value={formatDate(value[0], translations.start)} selected={rangePosition === 'start'} onClick={function () { return setRangePosition('start'); }}/>
        <Typography_1.default variant="h5">&nbsp;{'–'}&nbsp;</Typography_1.default>
        <internals_1.PickersToolbarButton variant={value[1] == null ? 'h6' : 'h5'} value={formatDate(value[1], translations.end)} selected={rangePosition === 'end'} onClick={function () { return setRangePosition('end'); }}/>
      </DateRangePickerToolbarContainer>
    </DateRangePickerToolbarRoot>);
});
exports.DateRangePickerToolbar = DateRangePickerToolbar;
DateRangePickerToolbar.propTypes = {
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
     * If `true`, show the toolbar even in desktop mode.
     * @default `true` for Desktop, `false` for Mobile.
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
    titleId: prop_types_1.default.string,
    /**
     * Toolbar date format.
     */
    toolbarFormat: prop_types_1.default.string,
    /**
     * Toolbar value placeholder—it is displayed when the value is empty.
     * @default "––"
     */
    toolbarPlaceholder: prop_types_1.default.node,
};
