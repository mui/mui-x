"use strict";
'use client';
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
exports.ToolbarContext = void 0;
exports.useToolbarContext = useToolbarContext;
exports.ToolbarContextProvider = ToolbarContextProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
exports.ToolbarContext = React.createContext(undefined);
function useToolbarContext() {
    var context = React.useContext(exports.ToolbarContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. Toolbar subcomponents must be placed within a <Toolbar /> component.');
    }
    return context;
}
function ToolbarContextProvider(_a) {
    var children = _a.children;
    var _b = React.useState(null), focusableItemId = _b[0], setFocusableItemId = _b[1];
    var focusableItemIdRef = React.useRef(focusableItemId);
    var _c = React.useState([]), items = _c[0], setItems = _c[1];
    var getSortedItems = React.useCallback(function () { return items.sort(sortByDocumentPosition); }, [items]);
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
        focusableItemIdRef.current = focusableItemId;
    }, [focusableItemId]);
    React.useEffect(function () {
        var _a, _b;
        var sortedItems = getSortedItems();
        if (sortedItems.length > 0) {
            // Set initial focusable item
            if (!focusableItemIdRef.current) {
                setFocusableItemId(sortedItems[0].id);
                return;
            }
            var focusableItemIndex = sortedItems.findIndex(function (item) { return item.id === focusableItemIdRef.current; });
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
    }, [getSortedItems, findEnabledItem]);
    var contextValue = React.useMemo(function () { return ({
        focusableItemId: focusableItemId,
        registerItem: registerItem,
        unregisterItem: unregisterItem,
        onItemKeyDown: onItemKeyDown,
        onItemFocus: onItemFocus,
        onItemDisabled: onItemDisabled,
    }); }, [focusableItemId, registerItem, unregisterItem, onItemKeyDown, onItemFocus, onItemDisabled]);
    return (0, jsx_runtime_1.jsx)(exports.ToolbarContext.Provider, { value: contextValue, children: children });
}
/* eslint-disable no-bitwise */
function sortByDocumentPosition(a, b) {
    if (!a.ref.current || !b.ref.current) {
        return 0;
    }
    var position = a.ref.current.compareDocumentPosition(b.ref.current);
    if (!position) {
        return 0;
    }
    if (position & Node.DOCUMENT_POSITION_FOLLOWING ||
        position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        return -1;
    }
    if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
        return 1;
    }
    return 0;
}
