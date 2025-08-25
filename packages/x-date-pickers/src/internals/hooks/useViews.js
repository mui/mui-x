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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useViews = useViews;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useControlled_1 = require("@mui/utils/useControlled");
var createStepNavigation_1 = require("../utils/createStepNavigation");
var warnedOnceNotValidView = false;
function useViews(_a) {
    var _b, _c;
    var onChange = _a.onChange, onViewChange = _a.onViewChange, openTo = _a.openTo, inView = _a.view, views = _a.views, autoFocus = _a.autoFocus, inFocusedView = _a.focusedView, onFocusedViewChange = _a.onFocusedViewChange, getStepNavigation = _a.getStepNavigation;
    if (process.env.NODE_ENV !== 'production') {
        if (!warnedOnceNotValidView) {
            if (inView != null && !views.includes(inView)) {
                console.warn("MUI X: `view=\"".concat(inView, "\"` is not a valid prop."), "It must be an element of `views=[\"".concat(views.join('", "'), "\"]`."));
                warnedOnceNotValidView = true;
            }
            if (inView == null && openTo != null && !views.includes(openTo)) {
                console.warn("MUI X: `openTo=\"".concat(openTo, "\"` is not a valid prop."), "It must be an element of `views=[\"".concat(views.join('", "'), "\"]`."));
                warnedOnceNotValidView = true;
            }
        }
    }
    var previousOpenTo = React.useRef(openTo);
    var previousViews = React.useRef(views);
    var defaultView = React.useRef(views.includes(openTo) ? openTo : views[0]);
    var _d = (0, useControlled_1.default)({
        name: 'useViews',
        state: 'view',
        controlled: inView,
        default: defaultView.current,
    }), view = _d[0], setView = _d[1];
    var defaultFocusedView = React.useRef(autoFocus ? view : null);
    var _e = (0, useControlled_1.default)({
        name: 'useViews',
        state: 'focusedView',
        controlled: inFocusedView,
        default: defaultFocusedView.current,
    }), focusedView = _e[0], setFocusedView = _e[1];
    var stepNavigation = getStepNavigation
        ? getStepNavigation({
            setView: setView,
            view: view,
            defaultView: defaultView.current,
            views: views,
        })
        : createStepNavigation_1.DEFAULT_STEP_NAVIGATION;
    React.useEffect(function () {
        // Update the current view when `openTo` or `views` props change
        if ((previousOpenTo.current && previousOpenTo.current !== openTo) ||
            (previousViews.current &&
                previousViews.current.some(function (previousView) { return !views.includes(previousView); }))) {
            setView(views.includes(openTo) ? openTo : views[0]);
            previousViews.current = views;
            previousOpenTo.current = openTo;
        }
    }, [openTo, setView, view, views]);
    var viewIndex = views.indexOf(view);
    var previousView = (_b = views[viewIndex - 1]) !== null && _b !== void 0 ? _b : null;
    var nextView = (_c = views[viewIndex + 1]) !== null && _c !== void 0 ? _c : null;
    var handleFocusedViewChange = (0, useEventCallback_1.default)(function (viewToFocus, hasFocus) {
        if (hasFocus) {
            // Focus event
            setFocusedView(viewToFocus);
        }
        else {
            // Blur event
            setFocusedView(function (prevFocusedView) { return (viewToFocus === prevFocusedView ? null : prevFocusedView); });
        }
        onFocusedViewChange === null || onFocusedViewChange === void 0 ? void 0 : onFocusedViewChange(viewToFocus, hasFocus);
    });
    var handleChangeView = (0, useEventCallback_1.default)(function (newView) {
        // always keep the focused view in sync
        handleFocusedViewChange(newView, true);
        if (newView === view) {
            return;
        }
        setView(newView);
        if (onViewChange) {
            onViewChange(newView);
        }
    });
    var goToNextView = (0, useEventCallback_1.default)(function () {
        if (nextView) {
            handleChangeView(nextView);
        }
    });
    var setValueAndGoToNextView = (0, useEventCallback_1.default)(function (value, currentViewSelectionState, selectedView) {
        var isSelectionFinishedOnCurrentView = currentViewSelectionState === 'finish';
        var hasMoreViews = selectedView
            ? // handles case like `DateTimePicker`, where a view might return a `finish` selection state
                // but when it's not the final view given all `views` -> overall selection state should be `partial`.
                views.indexOf(selectedView) < views.length - 1
            : Boolean(nextView);
        var globalSelectionState = isSelectionFinishedOnCurrentView && hasMoreViews ? 'partial' : currentViewSelectionState;
        onChange(value, globalSelectionState, selectedView);
        // The selected view can be different from the active view,
        // This can happen if multiple views are displayed, like in `DesktopDateTimePicker` or `MultiSectionDigitalClock`.
        var currentView = null;
        if (selectedView != null && selectedView !== view) {
            currentView = selectedView;
        }
        else if (isSelectionFinishedOnCurrentView) {
            currentView = view;
        }
        if (currentView == null) {
            return;
        }
        var viewToNavigateTo = views[views.indexOf(currentView) + 1];
        if (viewToNavigateTo == null ||
            !stepNavigation.areViewsInSameStep(currentView, viewToNavigateTo)) {
            return;
        }
        handleChangeView(viewToNavigateTo);
    });
    return __assign(__assign({}, stepNavigation), { view: view, setView: handleChangeView, focusedView: focusedView, setFocusedView: handleFocusedViewChange, nextView: nextView, previousView: previousView, 
        // Always return up-to-date default view instead of the initial one (i.e. defaultView.current)
        defaultView: views.includes(openTo) ? openTo : views[0], goToNextView: goToNextView, setValueAndGoToNextView: setValueAndGoToNextView });
}
