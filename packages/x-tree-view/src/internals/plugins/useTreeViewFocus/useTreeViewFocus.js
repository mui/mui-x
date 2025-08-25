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
exports.useTreeViewFocus = void 0;
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useInstanceEventHandler_1 = require("../../hooks/useInstanceEventHandler");
var useTreeViewFocus_selectors_1 = require("./useTreeViewFocus.selectors");
var useTreeViewExpansion_selectors_1 = require("../useTreeViewExpansion/useTreeViewExpansion.selectors");
var useTreeViewItems_selectors_1 = require("../useTreeViewItems/useTreeViewItems.selectors");
var useTreeViewFocus = function (_a) {
    var instance = _a.instance, params = _a.params, store = _a.store;
    var setFocusedItemId = (0, useEventCallback_1.default)(function (itemId) {
        store.update(function (prevState) {
            var focusedItemId = (0, useTreeViewFocus_selectors_1.selectorFocusedItemId)(prevState);
            if (focusedItemId === itemId) {
                return prevState;
            }
            return __assign(__assign({}, prevState), { focus: __assign(__assign({}, prevState.focus), { focusedItemId: itemId }) });
        });
    });
    var isItemVisible = function (itemId) {
        var itemMeta = (0, useTreeViewItems_selectors_1.selectorItemMeta)(store.value, itemId);
        return (itemMeta &&
            (itemMeta.parentId == null || (0, useTreeViewExpansion_selectors_1.selectorIsItemExpanded)(store.value, itemMeta.parentId)));
    };
    var innerFocusItem = function (event, itemId) {
        var itemElement = instance.getItemDOMElement(itemId);
        if (itemElement) {
            itemElement.focus();
        }
        setFocusedItemId(itemId);
        if (params.onItemFocus) {
            params.onItemFocus(event, itemId);
        }
    };
    var focusItem = (0, useEventCallback_1.default)(function (event, itemId) {
        // If we receive an itemId, and it is visible, the focus will be set to it
        if (isItemVisible(itemId)) {
            innerFocusItem(event, itemId);
        }
    });
    var removeFocusedItem = (0, useEventCallback_1.default)(function () {
        var focusedItemId = (0, useTreeViewFocus_selectors_1.selectorFocusedItemId)(store.value);
        if (focusedItemId == null) {
            return;
        }
        var itemMeta = (0, useTreeViewItems_selectors_1.selectorItemMeta)(store.value, focusedItemId);
        if (itemMeta) {
            var itemElement = instance.getItemDOMElement(focusedItemId);
            if (itemElement) {
                itemElement.blur();
            }
        }
        setFocusedItemId(null);
    });
    (0, useInstanceEventHandler_1.useInstanceEventHandler)(instance, 'removeItem', function (_a) {
        var id = _a.id;
        var focusedItemId = (0, useTreeViewFocus_selectors_1.selectorFocusedItemId)(store.value);
        var defaultFocusableItemId = (0, useTreeViewFocus_selectors_1.selectorDefaultFocusableItemId)(store.value);
        if (focusedItemId === id && defaultFocusableItemId != null) {
            innerFocusItem(null, defaultFocusableItemId);
        }
    });
    var createRootHandleFocus = function (otherHandlers) {
        return function (event) {
            var _a;
            (_a = otherHandlers.onFocus) === null || _a === void 0 ? void 0 : _a.call(otherHandlers, event);
            if (event.defaultMuiPrevented) {
                return;
            }
            // if the event bubbled (which is React specific) we don't want to steal focus
            var defaultFocusableItemId = (0, useTreeViewFocus_selectors_1.selectorDefaultFocusableItemId)(store.value);
            if (event.target === event.currentTarget && defaultFocusableItemId != null) {
                innerFocusItem(event, defaultFocusableItemId);
            }
        };
    };
    var createRootHandleBlur = function (otherHandlers) {
        return function (event) {
            var _a;
            (_a = otherHandlers.onBlur) === null || _a === void 0 ? void 0 : _a.call(otherHandlers, event);
            if (event.defaultMuiPrevented) {
                return;
            }
            setFocusedItemId(null);
        };
    };
    return {
        getRootProps: function (otherHandlers) { return ({
            onFocus: createRootHandleFocus(otherHandlers),
            onBlur: createRootHandleBlur(otherHandlers),
        }); },
        publicAPI: {
            focusItem: focusItem,
        },
        instance: {
            focusItem: focusItem,
            removeFocusedItem: removeFocusedItem,
        },
    };
};
exports.useTreeViewFocus = useTreeViewFocus;
exports.useTreeViewFocus.getInitialState = function () { return ({
    focus: { focusedItemId: null },
}); };
exports.useTreeViewFocus.params = {
    onItemFocus: true,
};
