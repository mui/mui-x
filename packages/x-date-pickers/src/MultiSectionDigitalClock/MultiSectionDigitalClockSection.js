"use strict";
'use client';
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
exports.MultiSectionDigitalClockSection = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var MenuList_1 = require("@mui/material/MenuList");
var MenuItem_1 = require("@mui/material/MenuItem");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var multiSectionDigitalClockSectionClasses_1 = require("./multiSectionDigitalClockSectionClasses");
var dimensions_1 = require("../internals/constants/dimensions");
var utils_1 = require("../internals/utils/utils");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        item: ['item'],
    };
    return (0, composeClasses_1.default)(slots, multiSectionDigitalClockSectionClasses_1.getMultiSectionDigitalClockSectionUtilityClass, classes);
};
var MultiSectionDigitalClockSectionRoot = (0, styles_1.styled)(MenuList_1.default, {
    name: 'MuiMultiSectionDigitalClockSection',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        maxHeight: dimensions_1.DIGITAL_CLOCK_VIEW_HEIGHT,
        width: 56,
        padding: 0,
        overflow: 'hidden',
        scrollbarWidth: 'thin',
        '@media (prefers-reduced-motion: no-preference)': {
            scrollBehavior: 'auto',
        },
        '@media (pointer: fine)': {
            '&:hover': {
                overflowY: 'auto',
            },
        },
        '@media (pointer: none), (pointer: coarse)': {
            overflowY: 'auto',
        },
        '&:not(:first-of-type)': {
            borderLeft: "1px solid ".concat((theme.vars || theme).palette.divider),
        },
        '&::after': {
            display: 'block',
            content: '""',
            // subtracting the height of one item, extra margin and borders to make sure the max height is correct
            height: 'calc(100% - 40px - 6px)',
        },
        variants: [
            {
                props: { hasDigitalClockAlreadyBeenRendered: true },
                style: {
                    '@media (prefers-reduced-motion: no-preference)': {
                        scrollBehavior: 'smooth',
                    },
                },
            },
        ],
    });
});
var MultiSectionDigitalClockSectionItem = (0, styles_1.styled)(MenuItem_1.default, {
    name: 'MuiMultiSectionDigitalClockSection',
    slot: 'Item',
})(function (_a) {
    var theme = _a.theme;
    return ({
        padding: 8,
        margin: '2px 4px',
        width: dimensions_1.MULTI_SECTION_CLOCK_SECTION_WIDTH,
        justifyContent: 'center',
        '&:first-of-type': {
            marginTop: 4,
        },
        '&:hover': {
            backgroundColor: theme.vars
                ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.hoverOpacity, ")")
                : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        },
        '&.Mui-selected': {
            backgroundColor: (theme.vars || theme).palette.primary.main,
            color: (theme.vars || theme).palette.primary.contrastText,
            '&:focus-visible, &:hover': {
                backgroundColor: (theme.vars || theme).palette.primary.dark,
            },
        },
        '&.Mui-focusVisible': {
            backgroundColor: theme.vars
                ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.focusOpacity, ")")
                : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.focusOpacity),
        },
    });
});
/**
 * @ignore - internal component.
 */
exports.MultiSectionDigitalClockSection = React.forwardRef(function MultiSectionDigitalClockSection(inProps, ref) {
    var _a;
    var containerRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(ref, containerRef);
    var previousActive = React.useRef(null);
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiMultiSectionDigitalClockSection',
    });
    var autoFocus = props.autoFocus, onChange = props.onChange, className = props.className, classesProp = props.classes, disabled = props.disabled, readOnly = props.readOnly, items = props.items, active = props.active, slots = props.slots, slotProps = props.slotProps, skipDisabled = props.skipDisabled, other = __rest(props, ["autoFocus", "onChange", "className", "classes", "disabled", "readOnly", "items", "active", "slots", "slotProps", "skipDisabled"]);
    var pickerOwnerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var ownerState = __assign(__assign({}, pickerOwnerState), { hasDigitalClockAlreadyBeenRendered: !!containerRef.current });
    var classes = useUtilityClasses(classesProp);
    var DigitalClockSectionItem = (_a = slots === null || slots === void 0 ? void 0 : slots.digitalClockSectionItem) !== null && _a !== void 0 ? _a : MultiSectionDigitalClockSectionItem;
    (0, useEnhancedEffect_1.default)(function () {
        if (containerRef.current === null) {
            return;
        }
        var activeItem = containerRef.current.querySelector('[role="option"][tabindex="0"], [role="option"][aria-selected="true"]');
        if (active && autoFocus && activeItem) {
            activeItem.focus();
        }
        if (!activeItem || previousActive.current === activeItem) {
            return;
        }
        previousActive.current = activeItem;
        var offsetTop = activeItem.offsetTop;
        // Subtracting the 4px of extra margin intended for the first visible section item
        containerRef.current.scrollTop = offsetTop - 4;
    });
    var focusedOptionIndex = items.findIndex(function (item) { return item.isFocused(item.value); });
    var handleKeyDown = function (event) {
        switch (event.key) {
            case 'PageUp': {
                var newIndex = (0, utils_1.getFocusedListItemIndex)(containerRef.current) - 5;
                var children = containerRef.current.children;
                var newFocusedIndex = Math.max(0, newIndex);
                var childToFocus = children[newFocusedIndex];
                if (childToFocus) {
                    childToFocus.focus();
                }
                event.preventDefault();
                break;
            }
            case 'PageDown': {
                var newIndex = (0, utils_1.getFocusedListItemIndex)(containerRef.current) + 5;
                var children = containerRef.current.children;
                var newFocusedIndex = Math.min(children.length - 1, newIndex);
                var childToFocus = children[newFocusedIndex];
                if (childToFocus) {
                    childToFocus.focus();
                }
                event.preventDefault();
                break;
            }
            default:
        }
    };
    return (<MultiSectionDigitalClockSectionRoot ref={handleRef} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} autoFocusItem={autoFocus && active} role="listbox" onKeyDown={handleKeyDown} {...other}>
        {items.map(function (option, index) {
            var _a;
            var isItemDisabled = (_a = option.isDisabled) === null || _a === void 0 ? void 0 : _a.call(option, option.value);
            var isDisabled = disabled || isItemDisabled;
            if (skipDisabled && isDisabled) {
                return null;
            }
            var isSelected = option.isSelected(option.value);
            var tabIndex = focusedOptionIndex === index || (focusedOptionIndex === -1 && index === 0) ? 0 : -1;
            return (<DigitalClockSectionItem key={option.label} onClick={function () { return !readOnly && onChange(option.value); }} selected={isSelected} disabled={isDisabled} disableRipple={readOnly} role="option" 
            // aria-readonly is not supported here and does not have any effect
            aria-disabled={readOnly || isDisabled || undefined} aria-label={option.ariaLabel} aria-selected={isSelected} tabIndex={tabIndex} className={classes.item} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.digitalClockSectionItem}>
              {option.label}
            </DigitalClockSectionItem>);
        })}
      </MultiSectionDigitalClockSectionRoot>);
});
