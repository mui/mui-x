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
exports.useTreeViewLabel = void 0;
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useTreeViewLabel_itemPlugin_1 = require("./useTreeViewLabel.itemPlugin");
var useTreeViewLabel_selectors_1 = require("./useTreeViewLabel.selectors");
var useTreeViewLabel = function (_a) {
    var store = _a.store, params = _a.params;
    var setEditedItem = function (editedItemId) {
        if (editedItemId !== null) {
            var isEditable = (0, useTreeViewLabel_selectors_1.selectorIsItemEditable)(store.value, editedItemId);
            if (!isEditable) {
                return;
            }
        }
        store.update(function (prevState) { return (__assign(__assign({}, prevState), { label: __assign(__assign({}, prevState.label), { editedItemId: editedItemId }) })); });
    };
    var updateItemLabel = function (itemId, label) {
        if (!label) {
            throw new Error([
                'MUI X: The Tree View component requires all items to have a `label` property.',
                'The label of an item cannot be empty.',
                itemId,
            ].join('\n'));
        }
        store.update(function (prevState) {
            var _a;
            var item = prevState.items.itemMetaLookup[itemId];
            if (item.label !== label) {
                return __assign(__assign({}, prevState), { items: __assign(__assign({}, prevState.items), { itemMetaLookup: __assign(__assign({}, prevState.items.itemMetaLookup), (_a = {}, _a[itemId] = __assign(__assign({}, item), { label: label }), _a)) }) });
            }
            return prevState;
        });
        if (params.onItemLabelChange) {
            params.onItemLabelChange(itemId, label);
        }
    };
    (0, useEnhancedEffect_1.default)(function () {
        store.update(function (prevState) { return (__assign(__assign({}, prevState), { label: __assign(__assign({}, prevState.label), { isItemEditable: params.isItemEditable }) })); });
    }, [store, params.isItemEditable]);
    return {
        instance: {
            setEditedItem: setEditedItem,
            updateItemLabel: updateItemLabel,
        },
        publicAPI: {
            setEditedItem: setEditedItem,
            updateItemLabel: updateItemLabel,
        },
    };
};
exports.useTreeViewLabel = useTreeViewLabel;
exports.useTreeViewLabel.itemPlugin = useTreeViewLabel_itemPlugin_1.useTreeViewLabelItemPlugin;
exports.useTreeViewLabel.applyDefaultValuesToParams = function (_a) {
    var _b;
    var params = _a.params;
    return (__assign(__assign({}, params), { isItemEditable: (_b = params.isItemEditable) !== null && _b !== void 0 ? _b : false }));
};
exports.useTreeViewLabel.getInitialState = function (params) { return ({
    label: {
        isItemEditable: params.isItemEditable,
        editedItemId: null,
    },
}); };
exports.useTreeViewLabel.params = {
    onItemLabelChange: true,
    isItemEditable: true,
};
