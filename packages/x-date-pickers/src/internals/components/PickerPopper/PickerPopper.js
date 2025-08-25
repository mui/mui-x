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
exports.PickerPopper = PickerPopper;
var React = require("react");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var Grow_1 = require("@mui/material/Grow");
var Fade_1 = require("@mui/material/Fade");
var Paper_1 = require("@mui/material/Paper");
var Popper_1 = require("@mui/material/Popper");
var Unstable_TrapFocus_1 = require("@mui/material/Unstable_TrapFocus");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var ownerDocument_1 = require("@mui/utils/ownerDocument");
var composeClasses_1 = require("@mui/utils/composeClasses");
var styles_1 = require("@mui/material/styles");
var pickerPopperClasses_1 = require("./pickerPopperClasses");
var utils_1 = require("../../utils/utils");
var usePickerPrivateContext_1 = require("../../hooks/usePickerPrivateContext");
var hooks_1 = require("../../../hooks");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        paper: ['paper'],
    };
    return (0, composeClasses_1.default)(slots, pickerPopperClasses_1.getPickerPopperUtilityClass, classes);
};
var PickerPopperRoot = (0, styles_1.styled)(Popper_1.default, {
    name: 'MuiPickerPopper',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        zIndex: theme.zIndex.modal,
    });
});
var PickerPopperPaper = (0, styles_1.styled)(Paper_1.default, {
    name: 'MuiPickerPopper',
    slot: 'Paper',
})({
    outline: 0,
    transformOrigin: 'top center',
    variants: [
        {
            props: function (_a) {
                var popperPlacement = _a.popperPlacement;
                return new Set(['top', 'top-start', 'top-end']).has(popperPlacement);
            },
            style: {
                transformOrigin: 'bottom center',
            },
        },
    ],
});
function clickedRootScrollbar(event, doc) {
    return (doc.documentElement.clientWidth < event.clientX ||
        doc.documentElement.clientHeight < event.clientY);
}
/**
 * Based on @mui/material/ClickAwayListener without the customization.
 * We can probably strip away even more since children won't be portaled.
 * @param {boolean} active Only listen to clicks when the popper is opened.
 * @param {(event: MouseEvent | TouchEvent) => void} onClickAway The callback to call when clicking outside the popper.
 * @returns {Array} The ref and event handler to listen to the outside clicks.
 */
function useClickAwayListener(active, onClickAway) {
    var movedRef = React.useRef(false);
    var syntheticEventRef = React.useRef(false);
    var nodeRef = React.useRef(null);
    var activatedRef = React.useRef(false);
    React.useEffect(function () {
        if (!active) {
            return undefined;
        }
        // Ensure that this hook is not "activated" synchronously.
        // https://github.com/facebook/react/issues/20074
        function armClickAwayListener() {
            activatedRef.current = true;
        }
        document.addEventListener('mousedown', armClickAwayListener, true);
        document.addEventListener('touchstart', armClickAwayListener, true);
        return function () {
            document.removeEventListener('mousedown', armClickAwayListener, true);
            document.removeEventListener('touchstart', armClickAwayListener, true);
            activatedRef.current = false;
        };
    }, [active]);
    // The handler doesn't take event.defaultPrevented into account:
    //
    // event.preventDefault() is meant to stop default behaviors like
    // clicking a checkbox to check it, hitting a button to submit a form,
    // and hitting left arrow to move the cursor in a text input etc.
    // Only special HTML elements have these default behaviors.
    var handleClickAway = (0, useEventCallback_1.default)(function (event) {
        if (!activatedRef.current) {
            return;
        }
        // Given developers can stop the propagation of the synthetic event,
        // we can only be confident with a positive value.
        var insideReactTree = syntheticEventRef.current;
        syntheticEventRef.current = false;
        var doc = (0, ownerDocument_1.default)(nodeRef.current);
        // 1. IE11 support, which trigger the handleClickAway even after the unbind
        // 2. The child might render null.
        // 3. Behave like a blur listener.
        if (!nodeRef.current ||
            // is a TouchEvent?
            ('clientX' in event && clickedRootScrollbar(event, doc))) {
            return;
        }
        // Do not act if user performed touchmove
        if (movedRef.current) {
            movedRef.current = false;
            return;
        }
        var insideDOM;
        // If not enough, can use https://github.com/DieterHolvoet/event-propagation-path/blob/master/propagationPath.js
        if (event.composedPath) {
            insideDOM = event.composedPath().indexOf(nodeRef.current) > -1;
        }
        else {
            insideDOM =
                !doc.documentElement.contains(event.target) ||
                    nodeRef.current.contains(event.target);
        }
        if (!insideDOM && !insideReactTree) {
            onClickAway(event);
        }
    });
    // Keep track of mouse/touch events that bubbled up through the portal.
    var handleSynthetic = function (event) {
        // Ignore events handled by our internal components
        if (!event.defaultMuiPrevented) {
            syntheticEventRef.current = true;
        }
    };
    React.useEffect(function () {
        if (active) {
            var doc_1 = (0, ownerDocument_1.default)(nodeRef.current);
            var handleTouchMove_1 = function () {
                movedRef.current = true;
            };
            doc_1.addEventListener('touchstart', handleClickAway);
            doc_1.addEventListener('touchmove', handleTouchMove_1);
            return function () {
                doc_1.removeEventListener('touchstart', handleClickAway);
                doc_1.removeEventListener('touchmove', handleTouchMove_1);
            };
        }
        return undefined;
    }, [active, handleClickAway]);
    React.useEffect(function () {
        // TODO This behavior is not tested automatically
        // It's unclear whether this is due to different update semantics in test (batched in act() vs discrete on click).
        // Or if this is a timing related issues due to different Transition components
        // Once we get rid of all the manual scheduling (for example setTimeout(update, 0)) we can revisit this code+test.
        if (active) {
            var doc_2 = (0, ownerDocument_1.default)(nodeRef.current);
            doc_2.addEventListener('click', handleClickAway);
            return function () {
                doc_2.removeEventListener('click', handleClickAway);
                // cleanup `handleClickAway`
                syntheticEventRef.current = false;
            };
        }
        return undefined;
    }, [active, handleClickAway]);
    return [nodeRef, handleSynthetic, handleSynthetic];
}
var PickerPopperPaperWrapper = React.forwardRef(function (props, ref) {
    var PaperComponent = props.PaperComponent, ownerState = props.ownerState, children = props.children, paperSlotProps = props.paperSlotProps, paperClasses = props.paperClasses, onPaperClick = props.onPaperClick, onPaperTouchStart = props.onPaperTouchStart, 
    // picks up the style props provided by `Transition`
    // https://mui.com/material-ui/transitions/#child-requirement
    other = __rest(props, ["PaperComponent", "ownerState", "children", "paperSlotProps", "paperClasses", "onPaperClick", "onPaperTouchStart"]);
    var paperProps = (0, useSlotProps_1.default)({
        elementType: PaperComponent,
        externalSlotProps: paperSlotProps,
        additionalProps: {
            tabIndex: -1,
            elevation: 8,
            ref: ref,
        },
        className: paperClasses,
        ownerState: ownerState,
    });
    return (<PaperComponent {...other} {...paperProps} onClick={function (event) {
            var _a;
            onPaperClick(event);
            (_a = paperProps.onClick) === null || _a === void 0 ? void 0 : _a.call(paperProps, event);
        }} onTouchStart={function (event) {
            var _a;
            onPaperTouchStart(event);
            (_a = paperProps.onTouchStart) === null || _a === void 0 ? void 0 : _a.call(paperProps, event);
        }} ownerState={ownerState}>
        {children}
      </PaperComponent>);
});
function PickerPopper(inProps) {
    var _a, _b, _c, _d;
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPickerPopper' });
    var children = props.children, _e = props.placement, placement = _e === void 0 ? 'bottom-start' : _e, slots = props.slots, slotProps = props.slotProps, classesProp = props.classes;
    var _f = (0, hooks_1.usePickerContext)(), open = _f.open, popupRef = _f.popupRef, reduceAnimations = _f.reduceAnimations;
    var _g = (0, usePickerPrivateContext_1.usePickerPrivateContext)(), pickerOwnerState = _g.ownerState, rootRefObject = _g.rootRefObject;
    var _h = (0, usePickerPrivateContext_1.usePickerPrivateContext)(), dismissViews = _h.dismissViews, getCurrentViewMode = _h.getCurrentViewMode, onPopperExited = _h.onPopperExited, triggerElement = _h.triggerElement, viewContainerRole = _h.viewContainerRole;
    React.useEffect(function () {
        function handleKeyDown(nativeEvent) {
            if (open && nativeEvent.key === 'Escape') {
                dismissViews();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return function () {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [dismissViews, open]);
    var lastFocusedElementRef = React.useRef(null);
    React.useEffect(function () {
        if (viewContainerRole === 'tooltip' || getCurrentViewMode() === 'field') {
            return;
        }
        if (open) {
            lastFocusedElementRef.current = (0, utils_1.getActiveElement)(rootRefObject.current);
        }
        else if (lastFocusedElementRef.current &&
            lastFocusedElementRef.current instanceof HTMLElement) {
            // make sure the button is flushed with updated label, before returning focus to it
            // avoids issue, where screen reader could fail to announce selected date after selection
            setTimeout(function () {
                if (lastFocusedElementRef.current instanceof HTMLElement) {
                    lastFocusedElementRef.current.focus();
                }
            });
        }
    }, [open, viewContainerRole, getCurrentViewMode, rootRefObject]);
    var classes = useUtilityClasses(classesProp);
    var handleClickAway = (0, useEventCallback_1.default)(function () {
        if (viewContainerRole === 'tooltip') {
            (0, utils_1.executeInTheNextEventLoopTick)(function () {
                var _a, _b;
                if (((_a = rootRefObject.current) === null || _a === void 0 ? void 0 : _a.contains((0, utils_1.getActiveElement)(rootRefObject.current))) ||
                    ((_b = popupRef.current) === null || _b === void 0 ? void 0 : _b.contains((0, utils_1.getActiveElement)(popupRef.current)))) {
                    return;
                }
                dismissViews();
            });
        }
        else {
            dismissViews();
        }
    });
    var _j = useClickAwayListener(open, handleClickAway), clickAwayRef = _j[0], onPaperClick = _j[1], onPaperTouchStart = _j[2];
    var paperRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(paperRef, popupRef);
    var handlePaperRef = (0, useForkRef_1.default)(handleRef, clickAwayRef);
    var handleKeyDown = function (event) {
        if (event.key === 'Escape') {
            // stop the propagation to avoid closing parent modal
            event.stopPropagation();
            dismissViews();
        }
    };
    var Transition = ((_a = slots === null || slots === void 0 ? void 0 : slots.desktopTransition) !== null && _a !== void 0 ? _a : reduceAnimations) ? Fade_1.default : Grow_1.default;
    var FocusTrap = (_b = slots === null || slots === void 0 ? void 0 : slots.desktopTrapFocus) !== null && _b !== void 0 ? _b : Unstable_TrapFocus_1.default;
    var Paper = (_c = slots === null || slots === void 0 ? void 0 : slots.desktopPaper) !== null && _c !== void 0 ? _c : PickerPopperPaper;
    var Popper = (_d = slots === null || slots === void 0 ? void 0 : slots.popper) !== null && _d !== void 0 ? _d : PickerPopperRoot;
    var popperProps = (0, useSlotProps_1.default)({
        elementType: Popper,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.popper,
        additionalProps: {
            transition: true,
            role: viewContainerRole == null ? undefined : viewContainerRole,
            open: open,
            placement: placement,
            anchorEl: triggerElement,
            onKeyDown: handleKeyDown,
        },
        className: classes.root,
        ownerState: pickerOwnerState,
    });
    var ownerState = React.useMemo(function () { return (__assign(__assign({}, pickerOwnerState), { popperPlacement: popperProps.placement })); }, [pickerOwnerState, popperProps.placement]);
    return (<Popper {...popperProps}>
      {function (_a) {
            var TransitionProps = _a.TransitionProps;
            return (<FocusTrap open={open} disableAutoFocus 
            // pickers are managing focus position manually
            // without this prop the focus is returned to the button before `aria-label` is updated
            // which would force screen readers to read too old label
            disableRestoreFocus disableEnforceFocus={viewContainerRole === 'tooltip'} isEnabled={function () { return true; }} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.desktopTrapFocus}>
          <Transition {...TransitionProps} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.desktopTransition} onExited={function (event) {
                    var _a, _b, _c;
                    onPopperExited === null || onPopperExited === void 0 ? void 0 : onPopperExited();
                    (_b = (_a = slotProps === null || slotProps === void 0 ? void 0 : slotProps.desktopTransition) === null || _a === void 0 ? void 0 : _a.onExited) === null || _b === void 0 ? void 0 : _b.call(_a, event);
                    (_c = TransitionProps === null || TransitionProps === void 0 ? void 0 : TransitionProps.onExited) === null || _c === void 0 ? void 0 : _c.call(TransitionProps);
                }}>
            <PickerPopperPaperWrapper PaperComponent={Paper} ownerState={ownerState} ref={handlePaperRef} onPaperClick={onPaperClick} onPaperTouchStart={onPaperTouchStart} paperClasses={classes.paper} paperSlotProps={slotProps === null || slotProps === void 0 ? void 0 : slotProps.desktopPaper}>
              {children}
            </PickerPopperPaperWrapper>
          </Transition>
        </FocusTrap>);
        }}
    </Popper>);
}
