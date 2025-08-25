"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = Clock;
var React = require("react");
var clsx_1 = require("clsx");
var IconButton_1 = require("@mui/material/IconButton");
var Typography_1 = require("@mui/material/Typography");
var styles_1 = require("@mui/material/styles");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var composeClasses_1 = require("@mui/utils/composeClasses");
var ClockPointer_1 = require("./ClockPointer");
var hooks_1 = require("../hooks");
var shared_1 = require("./shared");
var clockClasses_1 = require("./clockClasses");
var date_utils_1 = require("../internals/utils/date-utils");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useUtilityClasses = function (classes, ownerState) {
    var slots = {
        root: ['root'],
        clock: ['clock'],
        wrapper: ['wrapper'],
        squareMask: ['squareMask'],
        pin: ['pin'],
        amButton: ['amButton', ownerState.clockMeridiemMode === 'am' && 'selected'],
        pmButton: ['pmButton', ownerState.clockMeridiemMode === 'pm' && 'selected'],
        meridiemText: ['meridiemText'],
    };
    return (0, composeClasses_1.default)(slots, clockClasses_1.getClockUtilityClass, classes);
};
var ClockRoot = (0, styles_1.styled)('div', {
    name: 'MuiClock',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: theme.spacing(2),
    });
});
var ClockClock = (0, styles_1.styled)('div', {
    name: 'MuiClock',
    slot: 'Clock',
})({
    backgroundColor: 'rgba(0,0,0,.07)',
    borderRadius: '50%',
    height: 220,
    width: 220,
    flexShrink: 0,
    position: 'relative',
    pointerEvents: 'none',
});
var ClockWrapper = (0, styles_1.styled)('div', {
    name: 'MuiClock',
    slot: 'Wrapper',
})({
    '&:focus': {
        outline: 'none',
    },
});
var ClockSquareMask = (0, styles_1.styled)('div', {
    name: 'MuiClock',
    slot: 'SquareMask',
})({
    width: '100%',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'auto',
    outline: 0,
    // Disable scroll capabilities.
    touchAction: 'none',
    userSelect: 'none',
    variants: [
        {
            props: { isClockDisabled: false },
            style: {
                '@media (pointer: fine)': {
                    cursor: 'pointer',
                    borderRadius: '50%',
                },
                '&:active': {
                    cursor: 'move',
                },
            },
        },
    ],
});
var ClockPin = (0, styles_1.styled)('div', {
    name: 'MuiClock',
    slot: 'Pin',
})(function (_a) {
    var theme = _a.theme;
    return ({
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: (theme.vars || theme).palette.primary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    });
});
var meridiemButtonCommonStyles = function (theme, clockMeridiemMode) { return ({
    zIndex: 1,
    bottom: 8,
    paddingLeft: 4,
    paddingRight: 4,
    width: shared_1.CLOCK_HOUR_WIDTH,
    variants: [
        {
            props: { clockMeridiemMode: clockMeridiemMode },
            style: {
                backgroundColor: (theme.vars || theme).palette.primary.main,
                color: (theme.vars || theme).palette.primary.contrastText,
                '&:hover': {
                    backgroundColor: (theme.vars || theme).palette.primary.light,
                },
            },
        },
    ],
}); };
var ClockAmButton = (0, styles_1.styled)(IconButton_1.default, {
    name: 'MuiClock',
    slot: 'AmButton',
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({}, meridiemButtonCommonStyles(theme, 'am')), { 
        // keeping it here to make TS happy
        position: 'absolute', left: 8 }));
});
var ClockPmButton = (0, styles_1.styled)(IconButton_1.default, {
    name: 'MuiClock',
    slot: 'PmButton',
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({}, meridiemButtonCommonStyles(theme, 'pm')), { 
        // keeping it here to make TS happy
        position: 'absolute', right: 8 }));
});
var ClockMeridiemText = (0, styles_1.styled)(Typography_1.default, {
    name: 'MuiClock',
    slot: 'MeridiemText',
})({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
});
/**
 * @ignore - internal component.
 */
function Clock(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiClock' });
    var ampm = props.ampm, ampmInClock = props.ampmInClock, autoFocus = props.autoFocus, children = props.children, value = props.value, handleMeridiemChange = props.handleMeridiemChange, isTimeDisabled = props.isTimeDisabled, meridiemMode = props.meridiemMode, _a = props.minutesStep, minutesStep = _a === void 0 ? 1 : _a, onChange = props.onChange, selectedId = props.selectedId, type = props.type, viewValue = props.viewValue, _b = props.viewRange, minViewValue = _b[0], maxViewValue = _b[1], _c = props.disabled, disabled = _c === void 0 ? false : _c, readOnly = props.readOnly, className = props.className, classesProp = props.classes;
    var adapter = (0, hooks_1.usePickerAdapter)();
    var translations = (0, hooks_1.usePickerTranslations)();
    var pickerOwnerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var ownerState = __assign(__assign({}, pickerOwnerState), { isClockDisabled: disabled, clockMeridiemMode: meridiemMode });
    var isMoving = React.useRef(false);
    var classes = useUtilityClasses(classesProp, ownerState);
    var isSelectedTimeDisabled = isTimeDisabled(viewValue, type);
    var isPointerInner = !ampm && type === 'hours' && (viewValue < 1 || viewValue > 12);
    var handleValueChange = function (newValue, isFinish) {
        if (disabled || readOnly) {
            return;
        }
        if (isTimeDisabled(newValue, type)) {
            return;
        }
        onChange(newValue, isFinish);
    };
    var setTime = function (event, isFinish) {
        var _a = event, offsetX = _a.offsetX, offsetY = _a.offsetY;
        if (offsetX === undefined) {
            var rect = event.target.getBoundingClientRect();
            offsetX = event.changedTouches[0].clientX - rect.left;
            offsetY = event.changedTouches[0].clientY - rect.top;
        }
        var newSelectedValue = type === 'seconds' || type === 'minutes'
            ? (0, shared_1.getMinutes)(offsetX, offsetY, minutesStep)
            : (0, shared_1.getHours)(offsetX, offsetY, Boolean(ampm));
        handleValueChange(newSelectedValue, isFinish);
    };
    var handleTouchSelection = function (event) {
        isMoving.current = true;
        setTime(event, 'shallow');
    };
    var handleTouchEnd = function (event) {
        if (isMoving.current) {
            setTime(event, 'finish');
            isMoving.current = false;
        }
        event.preventDefault();
    };
    var handleMouseMove = function (event) {
        // event.buttons & PRIMARY_MOUSE_BUTTON
        if (event.buttons > 0) {
            setTime(event.nativeEvent, 'shallow');
        }
    };
    var handleMouseUp = function (event) {
        if (isMoving.current) {
            isMoving.current = false;
        }
        setTime(event.nativeEvent, 'finish');
    };
    var isPointerBetweenTwoClockValues = type === 'hours' ? false : viewValue % 5 !== 0;
    var keyboardControlStep = type === 'minutes' ? minutesStep : 1;
    var listboxRef = React.useRef(null);
    // Since this is rendered when a Popper is opened we can't use passive effects.
    // Focusing in passive effects in Popper causes scroll jump.
    (0, useEnhancedEffect_1.default)(function () {
        if (autoFocus) {
            // The ref not being resolved would be a bug in MUI.
            listboxRef.current.focus();
        }
    }, [autoFocus]);
    var clampValue = function (newValue) { return Math.max(minViewValue, Math.min(maxViewValue, newValue)); };
    var circleValue = function (newValue) { return (newValue + (maxViewValue + 1)) % (maxViewValue + 1); };
    var handleKeyDown = function (event) {
        // TODO: Why this early exit?
        if (isMoving.current) {
            return;
        }
        switch (event.key) {
            case 'Home':
                // reset both hours and minutes
                handleValueChange(minViewValue, 'partial');
                event.preventDefault();
                break;
            case 'End':
                handleValueChange(maxViewValue, 'partial');
                event.preventDefault();
                break;
            case 'ArrowUp':
                handleValueChange(circleValue(viewValue + keyboardControlStep), 'partial');
                event.preventDefault();
                break;
            case 'ArrowDown':
                handleValueChange(circleValue(viewValue - keyboardControlStep), 'partial');
                event.preventDefault();
                break;
            case 'PageUp':
                handleValueChange(clampValue(viewValue + 5), 'partial');
                event.preventDefault();
                break;
            case 'PageDown':
                handleValueChange(clampValue(viewValue - 5), 'partial');
                event.preventDefault();
                break;
            case 'Enter':
            case ' ':
                handleValueChange(viewValue, 'finish');
                event.preventDefault();
                break;
            default:
            // do nothing
        }
    };
    return (<ClockRoot className={(0, clsx_1.default)(classes.root, className)}>
      <ClockClock className={classes.clock}>
        <ClockSquareMask data-testid="clock" onTouchMove={handleTouchSelection} onTouchStart={handleTouchSelection} onTouchEnd={handleTouchEnd} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} ownerState={ownerState} className={classes.squareMask}/>
        {!isSelectedTimeDisabled && (<React.Fragment>
            <ClockPin className={classes.pin}/>
            {value != null && (<ClockPointer_1.ClockPointer type={type} viewValue={viewValue} isInner={isPointerInner} isBetweenTwoClockValues={isPointerBetweenTwoClockValues}/>)}
          </React.Fragment>)}
        <ClockWrapper aria-activedescendant={selectedId} aria-label={translations.clockLabelText(type, value == null ? null : adapter.format(value, ampm ? 'fullTime12h' : 'fullTime24h'))} ref={listboxRef} role="listbox" onKeyDown={handleKeyDown} tabIndex={0} className={classes.wrapper}>
          {children}
        </ClockWrapper>
      </ClockClock>
      {ampm && ampmInClock && (<React.Fragment>
          <ClockAmButton data-testid="in-clock-am-btn" onClick={readOnly ? undefined : function () { return handleMeridiemChange('am'); }} disabled={disabled || meridiemMode === null} ownerState={ownerState} className={classes.amButton} title={(0, date_utils_1.formatMeridiem)(adapter, 'am')}>
            <ClockMeridiemText variant="caption" className={classes.meridiemText}>
              {(0, date_utils_1.formatMeridiem)(adapter, 'am')}
            </ClockMeridiemText>
          </ClockAmButton>
          <ClockPmButton disabled={disabled || meridiemMode === null} data-testid="in-clock-pm-btn" onClick={readOnly ? undefined : function () { return handleMeridiemChange('pm'); }} ownerState={ownerState} className={classes.pmButton} title={(0, date_utils_1.formatMeridiem)(adapter, 'pm')}>
            <ClockMeridiemText variant="caption" className={classes.meridiemText}>
              {(0, date_utils_1.formatMeridiem)(adapter, 'pm')}
            </ClockMeridiemText>
          </ClockPmButton>
        </React.Fragment>)}
    </ClockRoot>);
}
