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
exports.DatePickerToolbar = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var Typography_1 = require("@mui/material/Typography");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var PickersToolbar_1 = require("../internals/components/PickersToolbar");
var hooks_1 = require("../hooks");
var datePickerToolbarClasses_1 = require("./datePickerToolbarClasses");
var date_utils_1 = require("../internals/utils/date-utils");
var useToolbarOwnerState_1 = require("../internals/hooks/useToolbarOwnerState");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        title: ['title'],
    };
    return (0, composeClasses_1.default)(slots, datePickerToolbarClasses_1.getDatePickerToolbarUtilityClass, classes);
};
var DatePickerToolbarRoot = (0, styles_1.styled)(PickersToolbar_1.PickersToolbar, {
    name: 'MuiDatePickerToolbar',
    slot: 'Root',
})({});
var DatePickerToolbarTitle = (0, styles_1.styled)(Typography_1.default, {
    name: 'MuiDatePickerToolbar',
    slot: 'Title',
})({
    variants: [
        {
            props: { pickerOrientation: 'landscape' },
            style: {
                margin: 'auto 16px auto auto',
            },
        },
    ],
});
/**
 * Demos:
 *
 * - [DatePicker](https://mui.com/x/react-date-pickers/date-picker/)
 * - [Custom components](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [DatePickerToolbar API](https://mui.com/x/api/date-pickers/date-picker-toolbar/)
 */
exports.DatePickerToolbar = React.forwardRef(function DatePickerToolbar(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiDatePickerToolbar' });
    var toolbarFormat = props.toolbarFormat, _a = props.toolbarPlaceholder, toolbarPlaceholder = _a === void 0 ? '––' : _a, className = props.className, classesProp = props.classes, other = __rest(props, ["toolbarFormat", "toolbarPlaceholder", "className", "classes"]);
    var adapter = (0, hooks_1.usePickerAdapter)();
    var _b = (0, hooks_1.usePickerContext)(), value = _b.value, views = _b.views, orientation = _b.orientation;
    var translations = (0, hooks_1.usePickerTranslations)();
    var ownerState = (0, useToolbarOwnerState_1.useToolbarOwnerState)();
    var classes = useUtilityClasses(classesProp);
    var dateText = React.useMemo(function () {
        if (!adapter.isValid(value)) {
            return toolbarPlaceholder;
        }
        var formatFromViews = (0, date_utils_1.resolveDateFormat)(adapter, { format: toolbarFormat, views: views }, true);
        return adapter.formatByString(value, formatFromViews);
    }, [value, toolbarFormat, toolbarPlaceholder, adapter, views]);
    return (<DatePickerToolbarRoot ref={ref} toolbarTitle={translations.datePickerToolbarTitle} className={(0, clsx_1.default)(classes.root, className)} {...other}>
      <DatePickerToolbarTitle variant="h4" data-testid="datepicker-toolbar-date" align={orientation === 'landscape' ? 'left' : 'center'} ownerState={ownerState} className={classes.title}>
        {dateText}
      </DatePickerToolbarTitle>
    </DatePickerToolbarRoot>);
});
exports.DatePickerToolbar.propTypes = {
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
