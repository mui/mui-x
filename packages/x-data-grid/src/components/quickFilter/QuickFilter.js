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
exports.QuickFilter = QuickFilter;
var React = require("react");
var prop_types_1 = require("prop-types");
var debounce_1 = require("@mui/utils/debounce");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useId_1 = require("@mui/utils/useId");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var QuickFilterContext_1 = require("./QuickFilterContext");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var filter_1 = require("../../hooks/features/filter");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var DEFAULT_PARSER = function (searchText) { return searchText.split(' ').filter(function (word) { return word !== ''; }); };
var DEFAULT_FORMATTER = function (values) { return values.join(' '); };
/**
 * The top level Quick Filter component that provides context to child components.
 * It renders a `<div />` element.
 *
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [QuickFilter API](https://mui.com/x/api/data-grid/quick-filter/)
 */
function QuickFilter(props) {
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var render = props.render, className = props.className, _a = props.parser, parser = _a === void 0 ? DEFAULT_PARSER : _a, _b = props.formatter, formatter = _b === void 0 ? DEFAULT_FORMATTER : _b, _c = props.debounceMs, debounceMs = _c === void 0 ? rootProps.filterDebounceMs : _c, defaultExpanded = props.defaultExpanded, expanded = props.expanded, onExpandedChange = props.onExpandedChange, other = __rest(props, ["render", "className", "parser", "formatter", "debounceMs", "defaultExpanded", "expanded", "onExpandedChange"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var controlRef = React.useRef(null);
    var triggerRef = React.useRef(null);
    var quickFilterValues = (0, useGridSelector_1.useGridSelector)(apiRef, filter_1.gridQuickFilterValuesSelector);
    var _d = React.useState(formatter(quickFilterValues !== null && quickFilterValues !== void 0 ? quickFilterValues : [])), value = _d[0], setValue = _d[1];
    var _e = React.useState(defaultExpanded !== null && defaultExpanded !== void 0 ? defaultExpanded : value.length > 0), internalExpanded = _e[0], setInternalExpanded = _e[1];
    var expandedValue = expanded !== null && expanded !== void 0 ? expanded : internalExpanded;
    var state = React.useMemo(function () { return ({
        value: value,
        expanded: expandedValue,
    }); }, [value, expandedValue]);
    var resolvedClassName = typeof className === 'function' ? className(state) : className;
    var ref = React.useRef(null);
    var controlId = (0, useId_1.default)();
    var handleExpandedChange = React.useCallback(function (newExpanded) {
        if (onExpandedChange) {
            onExpandedChange(newExpanded);
        }
        if (expanded === undefined) {
            setInternalExpanded(newExpanded);
        }
    }, [onExpandedChange, expanded]);
    var prevQuickFilterValuesRef = React.useRef(quickFilterValues);
    React.useEffect(function () {
        if (!(0, isDeepEqual_1.isDeepEqual)(prevQuickFilterValuesRef.current, quickFilterValues)) {
            // The model of quick filter value has been updated
            prevQuickFilterValuesRef.current = quickFilterValues;
            // Update the input value if needed to match the new model
            setValue(function (prevSearchValue) {
                return (0, isDeepEqual_1.isDeepEqual)(parser(prevSearchValue), quickFilterValues)
                    ? prevSearchValue
                    : formatter(quickFilterValues !== null && quickFilterValues !== void 0 ? quickFilterValues : []);
            });
        }
    }, [quickFilterValues, formatter, parser]);
    var isFirstRender = React.useRef(true);
    var previousExpandedValue = React.useRef(expandedValue);
    React.useEffect(function () {
        var _a;
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        // Ensure the expanded state has actually changed before focusing
        if (previousExpandedValue.current !== expandedValue) {
            if (expandedValue) {
                // Ensures the focus does not interupt CSS transitions and animations on the control
                requestAnimationFrame(function () {
                    var _a;
                    (_a = controlRef.current) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
                });
            }
            else {
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
            }
            previousExpandedValue.current = expandedValue;
        }
    }, [expandedValue]);
    var setQuickFilterValueDebounced = React.useMemo(function () {
        return (0, debounce_1.default)(function (newValue) {
            var newQuickFilterValues = parser(newValue);
            prevQuickFilterValuesRef.current = newQuickFilterValues;
            apiRef.current.setQuickFilterValues(newQuickFilterValues);
        }, debounceMs);
    }, [apiRef, debounceMs, parser]);
    React.useEffect(function () { return setQuickFilterValueDebounced.clear; }, [setQuickFilterValueDebounced]);
    var handleValueChange = React.useCallback(function (event) {
        var newValue = event.target.value;
        setValue(newValue);
        setQuickFilterValueDebounced(newValue);
    }, [setQuickFilterValueDebounced]);
    var handleClearValue = React.useCallback(function () {
        var _a;
        setValue('');
        apiRef.current.setQuickFilterValues([]);
        (_a = controlRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, [apiRef, controlRef]);
    var contextValue = React.useMemo(function () { return ({
        controlRef: controlRef,
        triggerRef: triggerRef,
        state: state,
        controlId: controlId,
        clearValue: handleClearValue,
        onValueChange: handleValueChange,
        onExpandedChange: handleExpandedChange,
    }); }, [controlId, state, handleValueChange, handleClearValue, handleExpandedChange]);
    (0, useEnhancedEffect_1.default)(function () {
        var _a;
        if (ref.current && triggerRef.current) {
            ref.current.style.setProperty('--trigger-width', "".concat((_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.offsetWidth, "px"));
        }
    }, []);
    var element = (0, useComponentRenderer_1.useComponentRenderer)('div', render, __assign(__assign({ className: resolvedClassName }, other), { ref: ref }), state);
    return <QuickFilterContext_1.QuickFilterContext.Provider value={contextValue}>{element}</QuickFilterContext_1.QuickFilterContext.Provider>;
}
QuickFilter.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    className: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    /**
     * The debounce time in milliseconds.
     * @default 150
     */
    debounceMs: prop_types_1.default.number,
    /**
     * The default expanded state of the quick filter control.
     * @default false
     */
    defaultExpanded: prop_types_1.default.bool,
    /**
     * The expanded state of the quick filter control.
     */
    expanded: prop_types_1.default.bool,
    /**
     * Function responsible for formatting values of quick filter in a string when the model is modified
     * @param {any[]} values The new values passed to the quick filter model
     * @returns {string} The string to display in the text field
     * @default (values: string[]) => values.join(' ')
     */
    formatter: prop_types_1.default.func,
    /**
     * Callback function that is called when the quick filter input is expanded or collapsed.
     * @param {boolean} expanded The new expanded state of the quick filter control
     */
    onExpandedChange: prop_types_1.default.func,
    /**
     * Function responsible for parsing text input in an array of independent values for quick filtering.
     * @param {string} input The value entered by the user
     * @returns {any[]} The array of value on which quick filter is applied
     * @default (searchText: string) => searchText.split(' ').filter((word) => word !== '')
     */
    parser: prop_types_1.default.func,
    /**
     * A function to customize rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
};
