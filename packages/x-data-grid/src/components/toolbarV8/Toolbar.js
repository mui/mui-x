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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var system_1 = require("@mui/system");
var composeClasses_1 = require("@mui/utils/composeClasses");
var clsx_1 = require("clsx");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var cssVariables_1 = require("../../constants/cssVariables");
var gridClasses_1 = require("../../constants/gridClasses");
var ToolbarContext_1 = require("./ToolbarContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var utils_1 = require("./utils");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['toolbar'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var ToolbarRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'Toolbar',
})({
    flex: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    gap: cssVariables_1.vars.spacing(0.25),
    padding: cssVariables_1.vars.spacing(0.75),
    minHeight: 52,
    boxSizing: 'border-box',
    borderBottom: "1px solid ".concat(cssVariables_1.vars.colors.border.base),
});
/**
 * The top level Toolbar component that provides context to child components.
 * It renders a styled `<div />` element.
 *
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [Toolbar API](https://mui.com/x/api/data-grid/toolbar/)
 */
var Toolbar = (0, forwardRef_1.forwardRef)(function Toolbar(props, ref) {
    var render = props.render, className = props.className, other = __rest(props, ["render", "className"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var _a = React.useState(null), focusableItemId = _a[0], setFocusableItemId = _a[1];
    var _b = React.useState([]), items = _b[0], setItems = _b[1];
    var getSortedItems = React.useCallback(function () { return items.sort(utils_1.sortByDocumentPosition); }, [items]);
    var findEnabledItem = React.useCallback(function (startIndex, step, wrap) {
        var _a, _b;
        if (wrap === void 0) { wrap = true; }
        var index = startIndex;
        var sortedItems = getSortedItems();
        var itemCount = sortedItems.length;
        // Look for enabled items in the specified direction
        for (var i = 0; i < itemCount; i += 1) {
            index += step;
            // Handle wrapping around the ends
            if (index >= itemCount) {
                if (!wrap) {
                    return -1;
                }
                index = 0;
            }
            else if (index < 0) {
                if (!wrap) {
                    return -1;
                }
                index = itemCount - 1;
            }
            // Return if we found an enabled item
            if (!((_a = sortedItems[index].ref.current) === null || _a === void 0 ? void 0 : _a.disabled) &&
                ((_b = sortedItems[index].ref.current) === null || _b === void 0 ? void 0 : _b.ariaDisabled) !== 'true') {
                return index;
            }
        }
        // If we've checked all items and found none enabled
        return -1;
    }, [getSortedItems]);
    var registerItem = React.useCallback(function (id, itemRef) {
        setItems(function (prevItems) { return __spreadArray(__spreadArray([], prevItems, true), [{ id: id, ref: itemRef }], false); });
    }, []);
    var unregisterItem = React.useCallback(function (id) {
        setItems(function (prevItems) { return prevItems.filter(function (i) { return i.id !== id; }); });
    }, []);
    var onItemKeyDown = React.useCallback(function (event) {
        var _a;
        if (!focusableItemId) {
            return;
        }
        var sortedItems = getSortedItems();
        var focusableItemIndex = sortedItems.findIndex(function (item) { return item.id === focusableItemId; });
        var newIndex = -1;
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            newIndex = findEnabledItem(focusableItemIndex, 1);
        }
        else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            newIndex = findEnabledItem(focusableItemIndex, -1);
        }
        else if (event.key === 'Home') {
            event.preventDefault();
            newIndex = findEnabledItem(-1, 1, false);
        }
        else if (event.key === 'End') {
            event.preventDefault();
            newIndex = findEnabledItem(sortedItems.length, -1, false);
        }
        // TODO: Check why this is necessary
        if (newIndex >= 0 && newIndex < sortedItems.length) {
            var item = sortedItems[newIndex];
            setFocusableItemId(item.id);
            (_a = item.ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [getSortedItems, focusableItemId, findEnabledItem]);
    var onItemFocus = React.useCallback(function (id) {
        if (focusableItemId !== id) {
            setFocusableItemId(id);
        }
    }, [focusableItemId, setFocusableItemId]);
    var onItemDisabled = React.useCallback(function (id) {
        var _a;
        var sortedItems = getSortedItems();
        var currentIndex = sortedItems.findIndex(function (item) { return item.id === id; });
        var newIndex = findEnabledItem(currentIndex, 1);
        if (newIndex >= 0 && newIndex < sortedItems.length) {
            var item = sortedItems[newIndex];
            setFocusableItemId(item.id);
            (_a = item.ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [getSortedItems, findEnabledItem]);
    React.useEffect(function () {
        var _a, _b;
        var sortedItems = getSortedItems();
        if (sortedItems.length > 0) {
            // Set initial focusable item
            if (!focusableItemId) {
                setFocusableItemId(sortedItems[0].id);
                return;
            }
            var focusableItemIndex = sortedItems.findIndex(function (item) { return item.id === focusableItemId; });
            if (!sortedItems[focusableItemIndex]) {
                // Last item has been removed from the items array
                var item = sortedItems[sortedItems.length - 1];
                if (item) {
                    setFocusableItemId(item.id);
                    (_a = item.ref.current) === null || _a === void 0 ? void 0 : _a.focus();
                }
            }
            else if (focusableItemIndex === -1) {
                // Focused item has been removed from the items array
                var item = sortedItems[focusableItemIndex];
                if (item) {
                    setFocusableItemId(item.id);
                    (_b = item.ref.current) === null || _b === void 0 ? void 0 : _b.focus();
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSortedItems, findEnabledItem]);
    var contextValue = React.useMemo(function () { return ({
        focusableItemId: focusableItemId,
        registerItem: registerItem,
        unregisterItem: unregisterItem,
        onItemKeyDown: onItemKeyDown,
        onItemFocus: onItemFocus,
        onItemDisabled: onItemDisabled,
    }); }, [focusableItemId, registerItem, unregisterItem, onItemKeyDown, onItemFocus, onItemDisabled]);
    var element = (0, useComponentRenderer_1.useComponentRenderer)(ToolbarRoot, render, __assign(__assign({ role: 'toolbar', 'aria-orientation': 'horizontal', 'aria-label': rootProps.label || undefined, className: (0, clsx_1.default)(classes.root, className) }, other), { ref: ref }));
    return <ToolbarContext_1.ToolbarContext.Provider value={contextValue}>{element}</ToolbarContext_1.ToolbarContext.Provider>;
});
exports.Toolbar = Toolbar;
Toolbar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * A function to customize rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
};
