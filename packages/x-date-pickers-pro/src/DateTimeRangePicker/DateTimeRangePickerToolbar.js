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
exports.DateTimeRangePickerToolbar = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var internals_1 = require("@mui/x-date-pickers/internals");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var DateTimePicker_1 = require("@mui/x-date-pickers/DateTimePicker");
var dateTimeRangePickerToolbarClasses_1 = require("./dateTimeRangePickerToolbarClasses");
var date_range_manager_1 = require("../internals/utils/date-range-manager");
var hooks_2 = require("../hooks");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        startToolbar: ['startToolbar'],
        endToolbar: ['endToolbar'],
    };
    return (0, composeClasses_1.default)(slots, dateTimeRangePickerToolbarClasses_1.getDateTimeRangePickerToolbarUtilityClass, classes);
};
var DateTimeRangePickerToolbarRoot = (0, styles_1.styled)('div', {
    name: 'MuiDateTimeRangePickerToolbar',
    slot: 'Root',
})({
    display: 'flex',
    flexDirection: 'column',
});
var DateTimeRangePickerToolbarStart = (0, styles_1.styled)(DateTimePicker_1.DateTimePickerToolbar, {
    name: 'MuiDateTimeRangePickerToolbar',
    slot: 'StartToolbar',
})({
    borderBottom: 'none',
    paddingBottom: 0,
});
var DateTimeRangePickerToolbarEnd = (0, styles_1.styled)(DateTimePicker_1.DateTimePickerToolbar, {
    name: 'MuiDateTimeRangePickerToolbar',
    slot: 'EndToolbar',
})({});
var DateTimeRangePickerToolbar = React.forwardRef(function DateTimeRangePickerToolbar(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiDateTimeRangePickerToolbar' });
    var adapter = (0, hooks_1.usePickerAdapter)();
    var className = props.className, classesProp = props.classes, ampm = props.ampm, hidden = props.hidden, toolbarFormat = props.toolbarFormat, toolbarPlaceholder = props.toolbarPlaceholder, titleId = props.titleId, sx = props.sx, other = __rest(props, ["className", "classes", "ampm", "hidden", "toolbarFormat", "toolbarPlaceholder", "titleId", "sx"]);
    var _a = (0, hooks_1.usePickerContext)(), value = _a.value, setValue = _a.setValue, disabled = _a.disabled, readOnly = _a.readOnly, view = _a.view, setView = _a.setView, views = _a.views;
    var translations = (0, hooks_1.usePickerTranslations)();
    var ownerState = (0, internals_1.useToolbarOwnerState)();
    var _b = (0, hooks_2.usePickerRangePositionContext)(), rangePosition = _b.rangePosition, setRangePosition = _b.setRangePosition;
    var classes = useUtilityClasses(classesProp);
    var commonToolbarProps = {
        views: views,
        ampm: ampm,
        disabled: disabled,
        readOnly: readOnly,
        hidden: hidden,
        toolbarFormat: toolbarFormat,
        toolbarPlaceholder: toolbarPlaceholder,
    };
    var wrappedSetValue = React.useCallback(function (newDate) {
        var _a = (0, date_range_manager_1.calculateRangeChange)({
            newDate: newDate,
            adapter: adapter,
            range: value,
            rangePosition: rangePosition,
            allowRangeFlip: true,
        }), nextSelection = _a.nextSelection, newRange = _a.newRange;
        setRangePosition(nextSelection);
        setValue(newRange, { changeImportance: 'set' });
    }, [setValue, setRangePosition, value, rangePosition, adapter]);
    var startOverrides = React.useMemo(function () {
        var handleStartRangeViewChange = function (newView) {
            if (newView === 'year' || newView === 'month') {
                return;
            }
            if (rangePosition !== 'start') {
                setRangePosition('start');
            }
            setView(newView);
        };
        return {
            value: value[0],
            setValue: wrappedSetValue,
            forceDesktopVariant: true,
            setView: handleStartRangeViewChange,
            view: rangePosition === 'start' ? view : null,
        };
    }, [value, wrappedSetValue, rangePosition, view, setRangePosition, setView]);
    var endOverrides = React.useMemo(function () {
        var handleEndRangeViewChange = function (newView) {
            if (newView === 'year' || newView === 'month') {
                return;
            }
            if (rangePosition !== 'end') {
                setRangePosition('end');
            }
            setView(newView);
        };
        return {
            value: value[1],
            setValue: wrappedSetValue,
            forceDesktopVariant: true,
            setView: handleEndRangeViewChange,
            view: rangePosition === 'end' ? view : null,
        };
    }, [value, wrappedSetValue, rangePosition, view, setRangePosition, setView]);
    if (hidden) {
        return null;
    }
    return (<DateTimeRangePickerToolbarRoot className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} ref={ref} sx={sx} {...other}>
      <internals_1.DateTimePickerToolbarOverrideContext.Provider value={startOverrides}>
        <DateTimeRangePickerToolbarStart toolbarTitle={translations.start} ownerState={ownerState} className={classes.startToolbar} titleId={titleId ? "".concat(titleId, "-start-toolbar") : undefined} {...commonToolbarProps}/>
      </internals_1.DateTimePickerToolbarOverrideContext.Provider>
      <internals_1.DateTimePickerToolbarOverrideContext.Provider value={endOverrides}>
        <DateTimeRangePickerToolbarEnd toolbarTitle={translations.end} ownerState={ownerState} className={classes.endToolbar} titleId={titleId ? "".concat(titleId, "-end-toolbar") : undefined} {...commonToolbarProps}/>
      </internals_1.DateTimePickerToolbarOverrideContext.Provider>
    </DateTimeRangePickerToolbarRoot>);
});
exports.DateTimeRangePickerToolbar = DateTimeRangePickerToolbar;
DateTimeRangePickerToolbar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    ampm: prop_types_1.default.bool,
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
