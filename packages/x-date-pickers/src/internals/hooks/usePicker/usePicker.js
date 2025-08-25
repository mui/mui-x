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
exports.usePicker = void 0;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useId_1 = require("@mui/utils/useId");
var usePickerAdapter_1 = require("../../../hooks/usePickerAdapter");
var useReduceAnimations_1 = require("../useReduceAnimations");
var time_utils_1 = require("../../utils/time-utils");
var useViews_1 = require("../useViews");
var useOrientation_1 = require("./hooks/useOrientation");
var useValueAndOpenStates_1 = require("./hooks/useValueAndOpenStates");
var usePicker = function (_a) {
    var ref = _a.ref, props = _a.props, valueManager = _a.valueManager, valueType = _a.valueType, variant = _a.variant, validator = _a.validator, onPopperExited = _a.onPopperExited, autoFocusView = _a.autoFocusView, RendererInterceptor = _a.rendererInterceptor, localeText = _a.localeText, viewContainerRole = _a.viewContainerRole, getStepNavigation = _a.getStepNavigation;
    var 
    // View props
    views = props.views, viewProp = props.view, openTo = props.openTo, onViewChange = props.onViewChange, viewRenderers = props.viewRenderers, reduceAnimationsProp = props.reduceAnimations, orientationProp = props.orientation, disableOpenPicker = props.disableOpenPicker, closeOnSelect = props.closeOnSelect, 
    // Form props
    disabled = props.disabled, readOnly = props.readOnly, 
    // Field props
    formatDensity = props.formatDensity, enableAccessibleFieldDOMStructure = props.enableAccessibleFieldDOMStructure, selectedSections = props.selectedSections, onSelectedSectionsChange = props.onSelectedSectionsChange, format = props.format, label = props.label, 
    // Other props
    autoFocus = props.autoFocus, name = props.name;
    var className = props.className, sx = props.sx, propsToForwardToView = __rest(props, ["className", "sx"]);
    /**
     * TODO: Improve how we generate the aria-label and aria-labelledby attributes.
     */
    var labelId = (0, useId_1.default)();
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var reduceAnimations = (0, useReduceAnimations_1.useReduceAnimations)(reduceAnimationsProp);
    var orientation = (0, useOrientation_1.useOrientation)(views, orientationProp);
    var initialView = React.useRef(openTo !== null && openTo !== void 0 ? openTo : null).current;
    /**
     * Refs
     */
    var _b = React.useState(null), triggerElement = _b[0], triggerRef = _b[1];
    var popupRef = React.useRef(null);
    var fieldRef = React.useRef(null);
    var rootRefObject = React.useRef(null);
    var rootRef = (0, useForkRef_1.default)(ref, rootRefObject);
    var _c = (0, useValueAndOpenStates_1.useValueAndOpenStates)({
        props: props,
        valueManager: valueManager,
        validator: validator,
    }), timezone = _c.timezone, state = _c.state, setOpen = _c.setOpen, setValue = _c.setValue, setValueFromView = _c.setValueFromView, value = _c.value, viewValue = _c.viewValue;
    var _d = (0, useViews_1.useViews)({
        view: viewProp,
        views: views,
        openTo: openTo,
        onChange: setValueFromView,
        onViewChange: onViewChange,
        autoFocus: autoFocusView,
        getStepNavigation: getStepNavigation,
    }), view = _d.view, setView = _d.setView, defaultView = _d.defaultView, focusedView = _d.focusedView, setFocusedView = _d.setFocusedView, setValueAndGoToNextView = _d.setValueAndGoToNextView, goToNextStep = _d.goToNextStep, hasNextStep = _d.hasNextStep, hasSeveralSteps = _d.hasSeveralSteps;
    var clearValue = (0, useEventCallback_1.default)(function () { return setValue(valueManager.emptyValue); });
    var setValueToToday = (0, useEventCallback_1.default)(function () {
        return setValue(valueManager.getTodayValue(adapter, timezone, valueType));
    });
    var acceptValueChanges = (0, useEventCallback_1.default)(function () { return setValue(value); });
    var cancelValueChanges = (0, useEventCallback_1.default)(function () {
        return setValue(state.lastCommittedValue, { skipPublicationIfPristine: true });
    });
    var dismissViews = (0, useEventCallback_1.default)(function () {
        setValue(value, {
            skipPublicationIfPristine: true,
        });
    });
    var _e = React.useMemo(function () {
        return views.reduce(function (acc, viewForReduce) {
            var viewMode = viewRenderers[viewForReduce] == null ? 'field' : 'UI';
            acc.viewModeLookup[viewForReduce] = viewMode;
            if (viewMode === 'UI') {
                acc.hasUIView = true;
                if ((0, time_utils_1.isTimeView)(viewForReduce)) {
                    acc.timeViewsCount += 1;
                }
            }
            return acc;
        }, {
            hasUIView: false,
            viewModeLookup: {},
            timeViewsCount: 0,
        });
    }, [viewRenderers, views]), hasUIView = _e.hasUIView, viewModeLookup = _e.viewModeLookup, timeViewsCount = _e.timeViewsCount;
    var currentViewMode = viewModeLookup[view];
    var getCurrentViewMode = (0, useEventCallback_1.default)(function () { return currentViewMode; });
    var _f = React.useState(currentViewMode === 'UI' ? view : null), popperView = _f[0], setPopperView = _f[1];
    if (popperView !== view && viewModeLookup[view] === 'UI') {
        setPopperView(view);
    }
    (0, useEnhancedEffect_1.default)(function () {
        // Handle case of Date Time Picker without time renderers
        if (currentViewMode === 'field' && state.open) {
            setOpen(false);
            setTimeout(function () {
                var _a, _b;
                (_a = fieldRef === null || fieldRef === void 0 ? void 0 : fieldRef.current) === null || _a === void 0 ? void 0 : _a.setSelectedSections(view);
                // focusing the input before the range selection is done
                // calling it outside of timeout results in an inconsistent behavior between Safari And Chrome
                (_b = fieldRef === null || fieldRef === void 0 ? void 0 : fieldRef.current) === null || _b === void 0 ? void 0 : _b.focusField(view);
            });
        }
    }, [view]); // eslint-disable-line react-hooks/exhaustive-deps
    (0, useEnhancedEffect_1.default)(function () {
        if (!state.open) {
            return;
        }
        var newView = view;
        // If the current view is a field view, go to the last popper view
        if (currentViewMode === 'field' && popperView != null) {
            newView = popperView;
        }
        // If the current view is not the default view and both are UI views
        if (newView !== defaultView &&
            viewModeLookup[newView] === 'UI' &&
            viewModeLookup[defaultView] === 'UI') {
            newView = defaultView;
        }
        if (newView !== view) {
            setView(newView);
        }
        setFocusedView(newView, true);
    }, [state.open]); // eslint-disable-line react-hooks/exhaustive-deps
    var ownerState = React.useMemo(function () {
        var _a, _b;
        return ({
            isPickerValueEmpty: valueManager.areValuesEqual(adapter, value, valueManager.emptyValue),
            isPickerOpen: state.open,
            isPickerDisabled: (_a = props.disabled) !== null && _a !== void 0 ? _a : false,
            isPickerReadOnly: (_b = props.readOnly) !== null && _b !== void 0 ? _b : false,
            pickerOrientation: orientation,
            pickerVariant: variant,
        });
    }, [
        adapter,
        valueManager,
        value,
        state.open,
        orientation,
        variant,
        props.disabled,
        props.readOnly,
    ]);
    var triggerStatus = React.useMemo(function () {
        if (disableOpenPicker || !hasUIView) {
            return 'hidden';
        }
        if (disabled || readOnly) {
            return 'disabled';
        }
        return 'enabled';
    }, [disableOpenPicker, hasUIView, disabled, readOnly]);
    var wrappedGoToNextStep = (0, useEventCallback_1.default)(goToNextStep);
    var defaultActionBarActions = React.useMemo(function () {
        if (closeOnSelect && !hasSeveralSteps) {
            return [];
        }
        return ['cancel', 'nextOrAccept'];
    }, [closeOnSelect, hasSeveralSteps]);
    var actionsContextValue = React.useMemo(function () { return ({
        setValue: setValue,
        setOpen: setOpen,
        clearValue: clearValue,
        setValueToToday: setValueToToday,
        acceptValueChanges: acceptValueChanges,
        cancelValueChanges: cancelValueChanges,
        setView: setView,
        goToNextStep: wrappedGoToNextStep,
    }); }, [
        setValue,
        setOpen,
        clearValue,
        setValueToToday,
        acceptValueChanges,
        cancelValueChanges,
        setView,
        wrappedGoToNextStep,
    ]);
    var contextValue = React.useMemo(function () { return (__assign(__assign({}, actionsContextValue), { value: value, timezone: timezone, open: state.open, views: views, view: popperView, initialView: initialView, disabled: disabled !== null && disabled !== void 0 ? disabled : false, readOnly: readOnly !== null && readOnly !== void 0 ? readOnly : false, autoFocus: autoFocus !== null && autoFocus !== void 0 ? autoFocus : false, variant: variant, orientation: orientation, popupRef: popupRef, reduceAnimations: reduceAnimations, triggerRef: triggerRef, triggerStatus: triggerStatus, hasNextStep: hasNextStep, fieldFormat: format !== null && format !== void 0 ? format : '', name: name, label: label, rootSx: sx, rootRef: rootRef, rootClassName: className })); }, [
        actionsContextValue,
        value,
        rootRef,
        variant,
        orientation,
        reduceAnimations,
        disabled,
        readOnly,
        format,
        className,
        name,
        label,
        sx,
        triggerStatus,
        hasNextStep,
        timezone,
        state.open,
        popperView,
        views,
        initialView,
        autoFocus,
    ]);
    var privateContextValue = React.useMemo(function () { return ({
        dismissViews: dismissViews,
        ownerState: ownerState,
        hasUIView: hasUIView,
        getCurrentViewMode: getCurrentViewMode,
        rootRefObject: rootRefObject,
        labelId: labelId,
        triggerElement: triggerElement,
        viewContainerRole: viewContainerRole,
        defaultActionBarActions: defaultActionBarActions,
        onPopperExited: onPopperExited,
    }); }, [
        dismissViews,
        ownerState,
        hasUIView,
        getCurrentViewMode,
        labelId,
        triggerElement,
        viewContainerRole,
        defaultActionBarActions,
        onPopperExited,
    ]);
    var fieldPrivateContextValue = React.useMemo(function () { return ({
        formatDensity: formatDensity,
        enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
        selectedSections: selectedSections,
        onSelectedSectionsChange: onSelectedSectionsChange,
        fieldRef: fieldRef,
    }); }, [
        formatDensity,
        enableAccessibleFieldDOMStructure,
        selectedSections,
        onSelectedSectionsChange,
        fieldRef,
    ]);
    var isValidContextValue = function (testedValue) {
        var error = validator({
            adapter: adapter,
            value: testedValue,
            timezone: timezone,
            props: props,
        });
        return !valueManager.hasError(error);
    };
    var renderCurrentView = function () {
        if (popperView == null) {
            return null;
        }
        var renderer = viewRenderers[popperView];
        if (renderer == null) {
            return null;
        }
        var rendererProps = __assign(__assign(__assign({}, propsToForwardToView), { views: views, timezone: timezone, value: viewValue, onChange: setValueAndGoToNextView, view: popperView, onViewChange: setView, showViewSwitcher: timeViewsCount > 1, timeViewsCount: timeViewsCount }), (viewContainerRole === 'tooltip'
            ? { focusedView: null, onFocusedViewChange: function () { } }
            : {
                focusedView: focusedView,
                onFocusedViewChange: setFocusedView,
            }));
        if (RendererInterceptor) {
            return (<RendererInterceptor viewRenderers={viewRenderers} popperView={popperView} rendererProps={rendererProps}/>);
        }
        return renderer(rendererProps);
    };
    return {
        providerProps: {
            localeText: localeText,
            contextValue: contextValue,
            privateContextValue: privateContextValue,
            actionsContextValue: actionsContextValue,
            fieldPrivateContextValue: fieldPrivateContextValue,
            isValidContextValue: isValidContextValue,
        },
        renderCurrentView: renderCurrentView,
        ownerState: ownerState,
    };
};
exports.usePicker = usePicker;
