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
exports.TimeRangePickerToolbar = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var internals_1 = require("@mui/x-date-pickers/internals");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var timeRangePickerToolbarClasses_1 = require("./timeRangePickerToolbarClasses");
var hooks_2 = require("../hooks");
var useUtilityClasses = function (classes, ownerState) {
    var pickerVariant = ownerState.pickerVariant;
    var slots = {
        root: ['root'],
        container: ['container', pickerVariant],
        separator: ['separator'],
        timeContainer: ['timeContainer'],
    };
    return (0, composeClasses_1.default)(slots, timeRangePickerToolbarClasses_1.getTimeRangePickerToolbarUtilityClass, classes);
};
var TimeRangePickerToolbarRoot = (0, styles_1.styled)(internals_1.PickersToolbar, {
    name: 'MuiTimeRangePickerToolbar',
    slot: 'Root',
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            borderBottom: "1px solid ".concat((theme.vars || theme).palette.divider),
            padding: '12px 0px 8px 0px'
        },
        _b["& .".concat(internals_1.pickersToolbarClasses.content, " .").concat(internals_1.pickersToolbarTextClasses.root, "[data-selected]")] = {
            color: (theme.vars || theme).palette.primary.main,
            fontWeight: theme.typography.fontWeightBold,
        },
        _b["& .".concat(internals_1.pickersToolbarClasses.title)] = {
            paddingLeft: 12,
        },
        _b);
});
var TimeRangePickerToolbarContainer = (0, styles_1.styled)('div', {
    name: 'MuiTimeRangePickerToolbar',
    slot: 'Container',
    shouldForwardProp: function (prop) { return prop !== 'pickerVariant'; },
})({
    display: 'flex',
    flex: 1,
    variants: [
        {
            props: { pickerVariant: 'mobile' },
            style: {
                flexDirection: 'column',
                rowGap: 8,
            },
        },
        {
            props: { pickerVariant: 'desktop' },
            style: {
                flexDirection: 'row',
                gap: 1,
            },
        },
    ],
});
var TimeRangePickerToolbarTimeContainer = (0, styles_1.styled)('div', {
    name: 'MuiTimeRangePickerToolbar',
    slot: 'TimeContainer',
})({
    display: 'flex',
    justifyContent: 'space-around',
    flex: 1,
});
var TimeRangePickerToolbarSeparator = (0, styles_1.styled)(internals_1.PickersToolbarText, {
    name: 'MuiTimeRangePickerToolbar',
    slot: 'Separator',
})({
    cursor: 'default',
});
/**
 * @ignore - internal component
 */
function TimeRangePickerToolbarTimeElement(props) {
    var value = props.value, ampm = props.ampm, onViewChange = props.onViewChange, view = props.view, separatorClasses = props.separatorClasses, toolbarPlaceholder = props.toolbarPlaceholder;
    var adapter = (0, hooks_1.usePickerAdapter)();
    var _a = (0, hooks_1.usePickerContext)(), variant = _a.variant, views = _a.views;
    var formatHours = function (time) {
        return ampm ? adapter.format(time, 'hours12h') : adapter.format(time, 'hours24h');
    };
    var meridiemMode = (0, internals_1.getMeridiem)(value, adapter);
    var sectionWidth = variant === 'desktop' ? internals_1.MULTI_SECTION_CLOCK_SECTION_WIDTH : '100%';
    return (<TimeRangePickerToolbarTimeContainer>
      {views.includes('hours') && (<React.Fragment>
          <internals_1.PickersToolbarButton variant="h5" width={sectionWidth} onClick={function () { return onViewChange('hours'); }} selected={view === 'hours'} value={adapter.isValid(value) ? formatHours(value) : toolbarPlaceholder}/>
          <TimeRangePickerToolbarSeparator variant="h5" value=":" className={separatorClasses}/>
          <internals_1.PickersToolbarButton variant="h5" width={sectionWidth} onClick={function () { return onViewChange('minutes'); }} selected={view === 'minutes' || (!views.includes('minutes') && view === 'hours')} value={adapter.isValid(value) ? adapter.format(value, 'minutes') : toolbarPlaceholder} disabled={!views.includes('minutes')}/>
        </React.Fragment>)}

      {views.includes('seconds') && (<React.Fragment>
          <TimeRangePickerToolbarSeparator variant="h5" value=":" className={separatorClasses}/>
          <internals_1.PickersToolbarButton variant="h5" width={sectionWidth} onClick={function () { return onViewChange('seconds'); }} selected={view === 'seconds'} value={value ? adapter.format(value, 'seconds') : toolbarPlaceholder}/>
        </React.Fragment>)}

      {ampm && (<internals_1.PickersToolbarButton variant="h5" onClick={function () { return onViewChange('meridiem'); }} selected={view === 'meridiem'} value={value && meridiemMode ? (0, internals_1.formatMeridiem)(adapter, meridiemMode) : toolbarPlaceholder} width={sectionWidth}/>)}
    </TimeRangePickerToolbarTimeContainer>);
}
TimeRangePickerToolbarTimeElement.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    ampm: prop_types_1.default.bool.isRequired,
    onViewChange: prop_types_1.default.func.isRequired,
    separatorClasses: prop_types_1.default.string.isRequired,
    /**
     * Toolbar value placeholder—it is displayed when the value is empty.
     * @default "––"
     */
    toolbarPlaceholder: prop_types_1.default.node,
    value: prop_types_1.default.object,
    view: prop_types_1.default.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
};
var TimeRangePickerToolbar = React.forwardRef(function TimeRangePickerToolbar(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiTimeRangePickerToolbar' });
    var className = props.className, ampm = props.ampm, _a = props.toolbarPlaceholder, toolbarPlaceholder = _a === void 0 ? '--' : _a, classesProp = props.classes, other = __rest(props, ["className", "ampm", "toolbarPlaceholder", "classes"]);
    var _b = (0, hooks_1.usePickerContext)(), value = _b.value, view = _b.view, setView = _b.setView;
    var translations = (0, hooks_1.usePickerTranslations)();
    var ownerState = (0, internals_1.useToolbarOwnerState)();
    var _c = (0, hooks_2.usePickerRangePositionContext)(), rangePosition = _c.rangePosition, setRangePosition = _c.setRangePosition;
    var classes = useUtilityClasses(classesProp, ownerState);
    var handleStartRangeViewChange = React.useCallback(function (newView) {
        if (rangePosition !== 'start') {
            setRangePosition('start');
        }
        setView(newView);
    }, [setRangePosition, setView, rangePosition]);
    var handleEndRangeViewChange = React.useCallback(function (newView) {
        if (rangePosition !== 'end') {
            setRangePosition('end');
        }
        setView(newView);
    }, [setRangePosition, setView, rangePosition]);
    if (!view) {
        return null;
    }
    return (<TimeRangePickerToolbarRoot {...other} toolbarTitle={translations.timeRangePickerToolbarTitle} className={(0, clsx_1.default)(className, classes.root)} ownerState={ownerState} ref={ref}>
      <TimeRangePickerToolbarContainer className={classes.container} pickerVariant={ownerState.pickerVariant}>
        <TimeRangePickerToolbarTimeElement view={rangePosition === 'start' ? view : undefined} value={value[0]} onViewChange={handleStartRangeViewChange} ampm={ampm} separatorClasses={classes.separator} toolbarPlaceholder={toolbarPlaceholder}/>
        <TimeRangePickerToolbarTimeElement view={rangePosition === 'end' ? view : undefined} value={value[1]} onViewChange={handleEndRangeViewChange} ampm={ampm} separatorClasses={classes.separator} toolbarPlaceholder={toolbarPlaceholder}/>
      </TimeRangePickerToolbarContainer>
    </TimeRangePickerToolbarRoot>);
});
exports.TimeRangePickerToolbar = TimeRangePickerToolbar;
TimeRangePickerToolbar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    ampm: prop_types_1.default.bool.isRequired,
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
     * Toolbar value placeholder—it is displayed when the value is empty.
     * @default "––"
     */
    toolbarPlaceholder: prop_types_1.default.node,
};
