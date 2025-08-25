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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimePickerToolbar = TimePickerToolbar;
var React = require("react");
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var PickersToolbarText_1 = require("../internals/components/PickersToolbarText");
var PickersToolbarButton_1 = require("../internals/components/PickersToolbarButton");
var PickersToolbar_1 = require("../internals/components/PickersToolbar");
var utils_1 = require("../internals/utils/utils");
var hooks_1 = require("../hooks");
var date_helpers_hooks_1 = require("../internals/hooks/date-helpers-hooks");
var timePickerToolbarClasses_1 = require("./timePickerToolbarClasses");
var date_utils_1 = require("../internals/utils/date-utils");
var useToolbarOwnerState_1 = require("../internals/hooks/useToolbarOwnerState");
var useUtilityClasses = function (classes, ownerState) {
    var pickerOrientation = ownerState.pickerOrientation, toolbarDirection = ownerState.toolbarDirection;
    var slots = {
        root: ['root'],
        separator: ['separator'],
        hourMinuteLabel: [
            'hourMinuteLabel',
            pickerOrientation === 'landscape' && 'hourMinuteLabelLandscape',
            toolbarDirection === 'rtl' && 'hourMinuteLabelReverse',
        ],
        ampmSelection: ['ampmSelection', pickerOrientation === 'landscape' && 'ampmLandscape'],
        ampmLabel: ['ampmLabel'],
    };
    return (0, composeClasses_1.default)(slots, timePickerToolbarClasses_1.getTimePickerToolbarUtilityClass, classes);
};
var TimePickerToolbarRoot = (0, styles_1.styled)(PickersToolbar_1.PickersToolbar, {
    name: 'MuiTimePickerToolbar',
    slot: 'Root',
})({});
var TimePickerToolbarSeparator = (0, styles_1.styled)(PickersToolbarText_1.PickersToolbarText, {
    name: 'MuiTimePickerToolbar',
    slot: 'Separator',
})({
    outline: 0,
    margin: '0 4px 0 2px',
    cursor: 'default',
});
var TimePickerToolbarHourMinuteLabel = (0, styles_1.styled)('div', {
    name: 'MuiTimePickerToolbar',
    slot: 'HourMinuteLabel',
    overridesResolver: function (props, styles) {
        var _a;
        return [
            (_a = {},
                _a["&.".concat(timePickerToolbarClasses_1.timePickerToolbarClasses.hourMinuteLabelLandscape)] = styles.hourMinuteLabelLandscape,
                _a["&.".concat(timePickerToolbarClasses_1.timePickerToolbarClasses.hourMinuteLabelReverse)] = styles.hourMinuteLabelReverse,
                _a),
            styles.hourMinuteLabel,
        ];
    },
})({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    variants: [
        {
            props: { toolbarDirection: 'rtl' },
            style: {
                flexDirection: 'row-reverse',
            },
        },
        {
            props: { pickerOrientation: 'landscape' },
            style: {
                marginTop: 'auto',
            },
        },
    ],
});
var TimePickerToolbarAmPmSelection = (0, styles_1.styled)('div', {
    name: 'MuiTimePickerToolbar',
    slot: 'AmPmSelection',
    overridesResolver: function (props, styles) {
        var _a, _b;
        return [
            (_a = {}, _a[".".concat(timePickerToolbarClasses_1.timePickerToolbarClasses.ampmLabel)] = styles.ampmLabel, _a),
            (_b = {}, _b["&.".concat(timePickerToolbarClasses_1.timePickerToolbarClasses.ampmLandscape)] = styles.ampmLandscape, _b),
            styles.ampmSelection,
        ];
    },
})((_a = {
        display: 'flex',
        flexDirection: 'column',
        marginRight: 'auto',
        marginLeft: 12
    },
    _a["& .".concat(timePickerToolbarClasses_1.timePickerToolbarClasses.ampmLabel)] = {
        fontSize: 17,
    },
    _a.variants = [
        {
            props: { pickerOrientation: 'landscape' },
            style: {
                margin: '4px 0 auto',
                flexDirection: 'row',
                justifyContent: 'space-around',
                flexBasis: '100%',
            },
        },
    ],
    _a));
/**
 * Demos:
 *
 * - [TimePicker](https://mui.com/x/react-date-pickers/time-picker/)
 * - [Custom components](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [TimePickerToolbar API](https://mui.com/x/api/date-pickers/time-picker-toolbar/)
 */
function TimePickerToolbar(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiTimePickerToolbar' });
    var ampm = props.ampm, ampmInClock = props.ampmInClock, className = props.className, classesProp = props.classes, other = __rest(props, ["ampm", "ampmInClock", "className", "classes"]);
    var adapter = (0, hooks_1.usePickerAdapter)();
    var translations = (0, hooks_1.usePickerTranslations)();
    var ownerState = (0, useToolbarOwnerState_1.useToolbarOwnerState)();
    var classes = useUtilityClasses(classesProp, ownerState);
    var _a = (0, hooks_1.usePickerContext)(), value = _a.value, setValue = _a.setValue, disabled = _a.disabled, readOnly = _a.readOnly, view = _a.view, setView = _a.setView, views = _a.views;
    var showAmPmControl = Boolean(ampm && !ampmInClock && views.includes('hours'));
    var _b = (0, date_helpers_hooks_1.useMeridiemMode)(value, ampm, function (newValue) {
        return setValue(newValue, { changeImportance: 'set' });
    }), meridiemMode = _b.meridiemMode, handleMeridiemChange = _b.handleMeridiemChange;
    var formatSection = function (format) {
        if (!adapter.isValid(value)) {
            return '--';
        }
        return adapter.format(value, format);
    };
    var separator = (<TimePickerToolbarSeparator tabIndex={-1} value=":" variant="h3" selected={false} className={classes.separator}/>);
    return (<TimePickerToolbarRoot landscapeDirection="row" toolbarTitle={translations.timePickerToolbarTitle} ownerState={ownerState} className={(0, clsx_1.default)(classes.root, className)} {...other}>
      <TimePickerToolbarHourMinuteLabel className={classes.hourMinuteLabel} ownerState={ownerState}>
        {(0, utils_1.arrayIncludes)(views, 'hours') && (<PickersToolbarButton_1.PickersToolbarButton data-testid="hours" tabIndex={-1} variant="h3" onClick={function () { return setView('hours'); }} selected={view === 'hours'} value={formatSection(ampm ? 'hours12h' : 'hours24h')}/>)}

        {(0, utils_1.arrayIncludes)(views, ['hours', 'minutes']) && separator}
        {(0, utils_1.arrayIncludes)(views, 'minutes') && (<PickersToolbarButton_1.PickersToolbarButton data-testid="minutes" tabIndex={-1} variant="h3" onClick={function () { return setView('minutes'); }} selected={view === 'minutes'} value={formatSection('minutes')}/>)}

        {(0, utils_1.arrayIncludes)(views, ['minutes', 'seconds']) && separator}
        {(0, utils_1.arrayIncludes)(views, 'seconds') && (<PickersToolbarButton_1.PickersToolbarButton data-testid="seconds" variant="h3" onClick={function () { return setView('seconds'); }} selected={view === 'seconds'} value={formatSection('seconds')}/>)}
      </TimePickerToolbarHourMinuteLabel>
      {showAmPmControl && (<TimePickerToolbarAmPmSelection className={classes.ampmSelection} ownerState={ownerState}>
          <PickersToolbarButton_1.PickersToolbarButton disableRipple variant="subtitle2" data-testid="toolbar-am-btn" selected={meridiemMode === 'am'} typographyClassName={classes.ampmLabel} value={(0, date_utils_1.formatMeridiem)(adapter, 'am')} onClick={readOnly ? undefined : function () { return handleMeridiemChange('am'); }} disabled={disabled}/>
          <PickersToolbarButton_1.PickersToolbarButton disableRipple variant="subtitle2" data-testid="toolbar-pm-btn" selected={meridiemMode === 'pm'} typographyClassName={classes.ampmLabel} value={(0, date_utils_1.formatMeridiem)(adapter, 'pm')} onClick={readOnly ? undefined : function () { return handleMeridiemChange('pm'); }} disabled={disabled}/>
        </TimePickerToolbarAmPmSelection>)}
    </TimePickerToolbarRoot>);
}
TimePickerToolbar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    ampm: prop_types_1.default.bool,
    ampmInClock: prop_types_1.default.bool,
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
