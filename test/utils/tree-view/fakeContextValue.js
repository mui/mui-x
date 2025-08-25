"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFakeContextValue = void 0;
var TreeViewStore_1 = require("@mui/x-tree-view/internals/utils/TreeViewStore");
var getFakeContextValue = function (features) {
    var _a;
    if (features === void 0) { features = {}; }
    return ({
        instance: {},
        publicAPI: {},
        runItemPlugins: function () { return ({
            rootRef: null,
            contentRef: null,
            propsEnhancers: {},
        }); },
        wrapItem: function (_a) {
            var children = _a.children;
            return children;
        },
        wrapRoot: function (_a) {
            var children = _a.children;
            return children;
        },
        rootRef: {
            current: null,
        },
        store: new TreeViewStore_1.TreeViewStore({
            cacheKey: { id: 1 },
            id: { treeId: 'mui-tree-view-1', providedTreeId: undefined },
            items: {
                disabledItemsFocusable: false,
                itemMetaLookup: {},
                itemModelLookup: {},
                itemOrderedChildrenIdsLookup: {},
                itemChildrenIndexesLookup: {},
                loading: false,
                error: null,
            },
            expansion: { expandedItems: [], expansionTrigger: 'content' },
            selection: {
                selectedItems: null,
                isEnabled: true,
                isMultiSelectEnabled: false,
                isCheckboxSelectionEnabled: (_a = features.checkboxSelection) !== null && _a !== void 0 ? _a : false,
                selectionPropagation: { parents: false, descendants: false },
            },
            focus: { focusedItemId: null },
        }),
    });
};
exports.getFakeContextValue = getFakeContextValue;
