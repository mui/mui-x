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
exports.DateTimePickerToolbarOverrideContext = void 0;
exports.DateTimePickerToolbar = DateTimePickerToolbar;
var React = require("react");
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var createStyled_1 = require("@mui/system/createStyled");
var PickersToolbarText_1 = require("../internals/components/PickersToolbarText");
var PickersToolbar_1 = require("../internals/components/PickersToolbar");
var PickersToolbarButton_1 = require("../internals/components/PickersToolbarButton");
var hooks_1 = require("../hooks");
var dateTimePickerToolbarClasses_1 = require("./dateTimePickerToolbarClasses");
var date_helpers_hooks_1 = require("../internals/hooks/date-helpers-hooks");
var dimensions_1 = require("../internals/constants/dimensions");
var date_utils_1 = require("../internals/utils/date-utils");
var pickersToolbarTextClasses_1 = require("../internals/components/pickersToolbarTextClasses");
var pickersToolbarClasses_1 = require("../internals/components/pickersToolbarClasses");
var usePickerContext_1 = require("../hooks/usePickerContext");
var useToolbarOwnerState_1 = require("../internals/hooks/useToolbarOwnerState");
var useUtilityClasses = function (classes, ownerState) {
    var pickerOrientation = ownerState.pickerOrientation, toolbarDirection = ownerState.toolbarDirection;
    var slots = {
        root: ['root'],
        dateContainer: ['dateContainer'],
        timeContainer: ['timeContainer', toolbarDirection === 'rtl' && 'timeLabelReverse'],
        timeDigitsContainer: ['timeDigitsContainer', toolbarDirection === 'rtl' && 'timeLabelReverse'],
        separator: ['separator'],
        ampmSelection: ['ampmSelection', pickerOrientation === 'landscape' && 'ampmLandscape'],
        ampmLabel: ['ampmLabel'],
    };
    return (0, composeClasses_1.default)(slots, dateTimePickerToolbarClasses_1.getDateTimePickerToolbarUtilityClass, classes);
};
var DateTimePickerToolbarRoot = (0, styles_1.styled)(PickersToolbar_1.PickersToolbar, {
    name: 'MuiDateTimePickerToolbar',
    slot: 'Root',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'toolbarVariant'; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return ({
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: 'space-around',
        position: 'relative',
        variants: [
            {
                props: { toolbarVariant: 'desktop' },
                style: (_b = {
                        borderBottom: "1px solid ".concat((theme.vars || theme).palette.divider)
                    },
                    _b["& .".concat(pickersToolbarClasses_1.pickersToolbarClasses.content, " .").concat(pickersToolbarTextClasses_1.pickersToolbarTextClasses.root, "[data-selected]")] = {
                        color: (theme.vars || theme).palette.primary.main,
                        fontWeight: theme.typography.fontWeightBold,
                    },
                    _b),
            },
            {
                props: { toolbarVariant: 'desktop', pickerOrientation: 'landscape' },
                style: {
                    borderRight: "1px solid ".concat((theme.vars || theme).palette.divider),
                },
            },
            {
                props: { toolbarVariant: 'desktop', pickerOrientation: 'portrait' },
                style: {
                    paddingLeft: 24,
                    paddingRight: 0,
                },
            },
        ],
    });
});
var DateTimePickerToolbarDateContainer = (0, styles_1.styled)('div', {
    name: 'MuiDateTimePickerToolbar',
    slot: 'DateContainer',
})({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
});
var DateTimePickerToolbarTimeContainer = (0, styles_1.styled)('div', {
    name: 'MuiDateTimePickerToolbar',
    slot: 'TimeContainer',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'toolbarVariant'; },
})({
    display: 'flex',
    flexDirection: 'row',
    variants: [
        {
            props: { toolbarDirection: 'rtl' },
            style: {
                flexDirection: 'row-reverse',
            },
        },
        {
            props: { toolbarVariant: 'desktop', pickerOrientation: 'portrait' },
            style: {
                gap: 9,
                marginRight: 4,
                alignSelf: 'flex-end',
            },
        },
        {
            props: function (_a) {
                var pickerOrientation = _a.pickerOrientation, toolbarVariant = _a.toolbarVariant;
                return pickerOrientation === 'landscape' && toolbarVariant !== 'desktop';
            },
            style: {
                flexDirection: 'column',
            },
        },
        {
            props: function (_a) {
                var pickerOrientation = _a.pickerOrientation, toolbarVariant = _a.toolbarVariant, toolbarDirection = _a.toolbarDirection;
                return pickerOrientation === 'landscape' &&
                    toolbarVariant !== 'desktop' &&
                    toolbarDirection === 'rtl';
            },
            style: {
                flexDirection: 'column-reverse',
            },
        },
    ],
});
var DateTimePickerToolbarTimeDigitsContainer = (0, styles_1.styled)('div', {
    name: 'MuiDateTimePickerToolbar',
    slot: 'TimeDigitsContainer',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'toolbarVariant'; },
})({
    display: 'flex',
    variants: [
        {
            props: { toolbarDirection: 'rtl' },
            style: {
                flexDirection: 'row-reverse',
            },
        },
        {
            props: { toolbarVariant: 'desktop' },
            style: { gap: 1.5 },
        },
    ],
});
var DateTimePickerToolbarSeparator = (0, styles_1.styled)(PickersToolbarText_1.PickersToolbarText, {
    name: 'MuiDateTimePickerToolbar',
    slot: 'Separator',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'toolbarVariant'; },
})({
    margin: '0 4px 0 2px',
    cursor: 'default',
    variants: [
        {
            props: { toolbarVariant: 'desktop' },
            style: {
                margin: 0,
            },
        },
    ],
});
// Taken from TimePickerToolbar
var DateTimePickerToolbarAmPmSelection = (0, styles_1.styled)('div', {
    name: 'MuiDateTimePickerToolbar',
    slot: 'AmPmSelection',
    overridesResolver: function (props, styles) {
        var _a, _b;
        return [
            (_a = {}, _a[".".concat(dateTimePickerToolbarClasses_1.dateTimePickerToolbarClasses.ampmLabel)] = styles.ampmLabel, _a),
            (_b = {}, _b["&.".concat(dateTimePickerToolbarClasses_1.dateTimePickerToolbarClasses.ampmLandscape)] = styles.ampmLandscape, _b),
            styles.ampmSelection,
        ];
    },
})((_a = {
        display: 'flex',
        flexDirection: 'column',
        marginRight: 'auto',
        marginLeft: 12
    },
    _a["& .".concat(dateTimePickerToolbarClasses_1.dateTimePickerToolbarClasses.ampmLabel)] = {
        fontSize: 17,
    },
    _a.variants = [
        {
            props: { pickerOrientation: 'landscape' },
            style: {
                margin: '4px 0 auto',
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
            },
        },
    ],
    _a));
/**
 * If `forceDesktopVariant` is set to `true`, the toolbar will always be rendered in the desktop mode.
 * If `onViewChange` is defined, the toolbar will call it instead of calling the default handler from `usePickerContext`.
 * This is used by the Date Time Range Picker Toolbar.
 */
exports.DateTimePickerToolbarOverrideContext = React.createContext(null);
/**
 * Demos:
 *
 * - [DateTimePicker](https://mui.com/x/react-date-pickers/date-time-picker/)
 * - [Custom components](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [DateTimePickerToolbar API](https://mui.com/x/api/date-pickers/date-time-picker-toolbar/)
 */
function DateTimePickerToolbar(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiDateTimePickerToolbar' });
    var ampm = props.ampm, ampmInClock = props.ampmInClock, toolbarFormat = props.toolbarFormat, _a = props.toolbarPlaceholder, toolbarPlaceholder = _a === void 0 ? '––' : _a, inToolbarTitle = props.toolbarTitle, className = props.className, classesProp = props.classes, other = __rest(props, ["ampm", "ampmInClock", "toolbarFormat", "toolbarPlaceholder", "toolbarTitle", "className", "classes"]);
    var _b = (0, usePickerContext_1.usePickerContext)(), valueContext = _b.value, setValueContext = _b.setValue, disabled = _b.disabled, readOnly = _b.readOnly, variant = _b.variant, orientation = _b.orientation, viewContext = _b.view, setViewContext = _b.setView, views = _b.views;
    var translations = (0, hooks_1.usePickerTranslations)();
    var ownerState = (0, useToolbarOwnerState_1.useToolbarOwnerState)();
    var classes = useUtilityClasses(classesProp, ownerState);
    var adapter = (0, hooks_1.usePickerAdapter)();
    var overrides = React.useContext(exports.DateTimePickerToolbarOverrideContext);
    var value = overrides ? overrides.value : valueContext;
    var setValue = overrides ? overrides.setValue : setValueContext;
    var view = overrides ? overrides.view : viewContext;
    var setView = overrides ? overrides.setView : setViewContext;
    var _c = (0, date_helpers_hooks_1.useMeridiemMode)(value, ampm, function (newValue) {
        return setValue(newValue, { changeImportance: 'set' });
    }), meridiemMode = _c.meridiemMode, handleMeridiemChange = _c.handleMeridiemChange;
    var toolbarVariant = (overrides === null || overrides === void 0 ? void 0 : overrides.forceDesktopVariant) ? 'desktop' : variant;
    var isDesktop = toolbarVariant === 'desktop';
    var showAmPmControl = Boolean(ampm && !ampmInClock);
    var toolbarTitle = inToolbarTitle !== null && inToolbarTitle !== void 0 ? inToolbarTitle : translations.dateTimePickerToolbarTitle;
    var dateText = React.useMemo(function () {
        if (!adapter.isValid(value)) {
            return toolbarPlaceholder;
        }
        if (toolbarFormat) {
            return adapter.formatByString(value, toolbarFormat);
        }
        return adapter.format(value, 'shortDate');
    }, [value, toolbarFormat, toolbarPlaceholder, adapter]);
    var formatSection = function (format, fallback) {
        if (!adapter.isValid(value)) {
            return fallback;
        }
        return adapter.format(value, format);
    };
    return (<DateTimePickerToolbarRoot className={(0, clsx_1.default)(classes.root, className)} toolbarTitle={toolbarTitle} toolbarVariant={toolbarVariant} {...other} ownerState={ownerState}>
      <DateTimePickerToolbarDateContainer className={classes.dateContainer} ownerState={ownerState}>
        {views.includes('year') && (<PickersToolbarButton_1.PickersToolbarButton tabIndex={-1} variant="subtitle1" data-testid="datetimepicker-toolbar-year" onClick={function () { return setView('year'); }} selected={view === 'year'} value={formatSection('year', '–')}/>)}

        {views.includes('day') && (<PickersToolbarButton_1.PickersToolbarButton tabIndex={-1} variant={isDesktop ? 'h5' : 'h4'} data-testid="datetimepicker-toolbar-day" onClick={function () { return setView('day'); }} selected={view === 'day'} value={dateText}/>)}
      </DateTimePickerToolbarDateContainer>
      <DateTimePickerToolbarTimeContainer className={classes.timeContainer} ownerState={ownerState} toolbarVariant={toolbarVariant}>
        <DateTimePickerToolbarTimeDigitsContainer className={classes.timeDigitsContainer} ownerState={ownerState} toolbarVariant={toolbarVariant}>
          {views.includes('hours') && (<React.Fragment>
              <PickersToolbarButton_1.PickersToolbarButton variant={isDesktop ? 'h5' : 'h3'} width={isDesktop && orientation === 'portrait'
                ? dimensions_1.MULTI_SECTION_CLOCK_SECTION_WIDTH
                : undefined} data-testid="hours" onClick={function () { return setView('hours'); }} selected={view === 'hours'} value={formatSection(ampm ? 'hours12h' : 'hours24h', '--')}/>
              <DateTimePickerToolbarSeparator variant={isDesktop ? 'h5' : 'h3'} value=":" className={classes.separator} ownerState={ownerState} toolbarVariant={toolbarVariant}/>
              <PickersToolbarButton_1.PickersToolbarButton variant={isDesktop ? 'h5' : 'h3'} width={isDesktop && orientation === 'portrait'
                ? dimensions_1.MULTI_SECTION_CLOCK_SECTION_WIDTH
                : undefined} data-testid="minutes" onClick={function () { return setView('minutes'); }} selected={view === 'minutes' || (!views.includes('minutes') && view === 'hours')} value={formatSection('minutes', '--')} disabled={!views.includes('minutes')}/>
            </React.Fragment>)}

          {views.includes('seconds') && (<React.Fragment>
              <DateTimePickerToolbarSeparator variant={isDesktop ? 'h5' : 'h3'} value=":" className={classes.separator} ownerState={ownerState} toolbarVariant={toolbarVariant}/>
              <PickersToolbarButton_1.PickersToolbarButton variant={isDesktop ? 'h5' : 'h3'} width={isDesktop && orientation === 'portrait'
                ? dimensions_1.MULTI_SECTION_CLOCK_SECTION_WIDTH
                : undefined} data-testid="seconds" onClick={function () { return setView('seconds'); }} selected={view === 'seconds'} value={formatSection('seconds', '--')}/>
            </React.Fragment>)}
        </DateTimePickerToolbarTimeDigitsContainer>
        {showAmPmControl && !isDesktop && (<DateTimePickerToolbarAmPmSelection className={classes.ampmSelection} ownerState={ownerState}>
            <PickersToolbarButton_1.PickersToolbarButton variant="subtitle2" selected={meridiemMode === 'am'} typographyClassName={classes.ampmLabel} value={(0, date_utils_1.formatMeridiem)(adapter, 'am')} onClick={readOnly ? undefined : function () { return handleMeridiemChange('am'); }} disabled={disabled}/>
            <PickersToolbarButton_1.PickersToolbarButton variant="subtitle2" selected={meridiemMode === 'pm'} typographyClassName={classes.ampmLabel} value={(0, date_utils_1.formatMeridiem)(adapter, 'pm')} onClick={readOnly ? undefined : function () { return handleMeridiemChange('pm'); }} disabled={disabled}/>
          </DateTimePickerToolbarAmPmSelection>)}

        {ampm && isDesktop && (<PickersToolbarButton_1.PickersToolbarButton variant="h5" data-testid="am-pm-view-button" onClick={function () { return setView('meridiem'); }} selected={view === 'meridiem'} value={value && meridiemMode ? (0, date_utils_1.formatMeridiem)(adapter, meridiemMode) : '--'} width={dimensions_1.MULTI_SECTION_CLOCK_SECTION_WIDTH}/>)}
      </DateTimePickerToolbarTimeContainer>
    </DateTimePickerToolbarRoot>);
}
DateTimePickerToolbar.propTypes = {
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
    /**
     * If provided, it will be used instead of `dateTimePickerToolbarTitle` from localization.
     */
    toolbarTitle: prop_types_1.default.node,
};
