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
exports.PickersArrowSwitcher = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var Typography_1 = require("@mui/material/Typography");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var IconButton_1 = require("@mui/material/IconButton");
var icons_1 = require("../../../icons");
var pickersArrowSwitcherClasses_1 = require("./pickersArrowSwitcherClasses");
var usePickerPrivateContext_1 = require("../../hooks/usePickerPrivateContext");
var PickersArrowSwitcherRoot = (0, styles_1.styled)('div', {
    name: 'MuiPickersArrowSwitcher',
    slot: 'Root',
})({
    display: 'flex',
});
var PickersArrowSwitcherSpacer = (0, styles_1.styled)('div', {
    name: 'MuiPickersArrowSwitcher',
    slot: 'Spacer',
})(function (_a) {
    var theme = _a.theme;
    return ({
        width: theme.spacing(3),
    });
});
var PickersArrowSwitcherButton = (0, styles_1.styled)(IconButton_1.default, {
    name: 'MuiPickersArrowSwitcher',
    slot: 'Button',
})({
    variants: [
        {
            props: { isButtonHidden: true },
            style: { visibility: 'hidden' },
        },
    ],
});
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        spacer: ['spacer'],
        button: ['button'],
        previousIconButton: ['previousIconButton'],
        nextIconButton: ['nextIconButton'],
        leftArrowIcon: ['leftArrowIcon'],
        rightArrowIcon: ['rightArrowIcon'],
    };
    return (0, composeClasses_1.default)(slots, pickersArrowSwitcherClasses_1.getPickersArrowSwitcherUtilityClass, classes);
};
exports.PickersArrowSwitcher = React.forwardRef(function PickersArrowSwitcher(inProps, ref) {
    var _a, _b, _c, _d, _e, _f;
    var isRtl = (0, RtlProvider_1.useRtl)();
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPickersArrowSwitcher' });
    var children = props.children, className = props.className, slots = props.slots, slotProps = props.slotProps, isNextDisabled = props.isNextDisabled, isNextHidden = props.isNextHidden, onGoToNext = props.onGoToNext, nextLabel = props.nextLabel, isPreviousDisabled = props.isPreviousDisabled, isPreviousHidden = props.isPreviousHidden, onGoToPrevious = props.onGoToPrevious, previousLabel = props.previousLabel, labelId = props.labelId, classesProp = props.classes, other = __rest(props, ["children", "className", "slots", "slotProps", "isNextDisabled", "isNextHidden", "onGoToNext", "nextLabel", "isPreviousDisabled", "isPreviousHidden", "onGoToPrevious", "previousLabel", "labelId", "classes"]);
    var ownerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var classes = useUtilityClasses(classesProp);
    var nextProps = {
        isDisabled: isNextDisabled,
        isHidden: isNextHidden,
        goTo: onGoToNext,
        label: nextLabel,
    };
    var previousProps = {
        isDisabled: isPreviousDisabled,
        isHidden: isPreviousHidden,
        goTo: onGoToPrevious,
        label: previousLabel,
    };
    var PreviousIconButton = (_a = slots === null || slots === void 0 ? void 0 : slots.previousIconButton) !== null && _a !== void 0 ? _a : PickersArrowSwitcherButton;
    var previousIconButtonProps = (0, useSlotProps_1.default)({
        elementType: PreviousIconButton,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.previousIconButton,
        additionalProps: {
            size: 'medium',
            title: previousProps.label,
            'aria-label': previousProps.label,
            disabled: previousProps.isDisabled,
            edge: 'end',
            onClick: previousProps.goTo,
        },
        ownerState: __assign(__assign({}, ownerState), { isButtonHidden: (_b = previousProps.isHidden) !== null && _b !== void 0 ? _b : false }),
        className: (0, clsx_1.default)(classes.button, classes.previousIconButton),
    });
    var NextIconButton = (_c = slots === null || slots === void 0 ? void 0 : slots.nextIconButton) !== null && _c !== void 0 ? _c : PickersArrowSwitcherButton;
    var nextIconButtonProps = (0, useSlotProps_1.default)({
        elementType: NextIconButton,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.nextIconButton,
        additionalProps: {
            size: 'medium',
            title: nextProps.label,
            'aria-label': nextProps.label,
            disabled: nextProps.isDisabled,
            edge: 'start',
            onClick: nextProps.goTo,
        },
        ownerState: __assign(__assign({}, ownerState), { isButtonHidden: (_d = nextProps.isHidden) !== null && _d !== void 0 ? _d : false }),
        className: (0, clsx_1.default)(classes.button, classes.nextIconButton),
    });
    var LeftArrowIcon = (_e = slots === null || slots === void 0 ? void 0 : slots.leftArrowIcon) !== null && _e !== void 0 ? _e : icons_1.ArrowLeftIcon;
    // The spread is here to avoid this bug mui/material-ui#34056
    var _g = (0, useSlotProps_1.default)({
        elementType: LeftArrowIcon,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.leftArrowIcon,
        additionalProps: {
            fontSize: 'inherit',
        },
        ownerState: ownerState,
        className: classes.leftArrowIcon,
    }), leftArrowIconOwnerState = _g.ownerState, leftArrowIconProps = __rest(_g, ["ownerState"]);
    var RightArrowIcon = (_f = slots === null || slots === void 0 ? void 0 : slots.rightArrowIcon) !== null && _f !== void 0 ? _f : icons_1.ArrowRightIcon;
    // The spread is here to avoid this bug mui/material-ui#34056
    var _h = (0, useSlotProps_1.default)({
        elementType: RightArrowIcon,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.rightArrowIcon,
        additionalProps: {
            fontSize: 'inherit',
        },
        ownerState: ownerState,
        className: classes.rightArrowIcon,
    }), rightArrowIconOwnerState = _h.ownerState, rightArrowIconProps = __rest(_h, ["ownerState"]);
    return (<PickersArrowSwitcherRoot ref={ref} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} {...other}>
      <PreviousIconButton {...previousIconButtonProps}>
        {isRtl ? (<RightArrowIcon {...rightArrowIconProps}/>) : (<LeftArrowIcon {...leftArrowIconProps}/>)}
      </PreviousIconButton>
      {children ? (<Typography_1.default variant="subtitle1" component="span" id={labelId}>
          {children}
        </Typography_1.default>) : (<PickersArrowSwitcherSpacer className={classes.spacer} ownerState={ownerState}/>)}
      <NextIconButton {...nextIconButtonProps}>
        {isRtl ? (<LeftArrowIcon {...leftArrowIconProps}/>) : (<RightArrowIcon {...rightArrowIconProps}/>)}
      </NextIconButton>
    </PickersArrowSwitcherRoot>);
});
