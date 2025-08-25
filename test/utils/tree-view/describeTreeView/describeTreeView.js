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
exports.describeTreeView = void 0;
var React = require("react");
var createDescribe_1 = require("@mui/internal-test-utils/createDescribe");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var RichTreeView_1 = require("@mui/x-tree-view/RichTreeView");
var RichTreeViewPro_1 = require("@mui/x-tree-view-pro/RichTreeViewPro");
var SimpleTreeView_1 = require("@mui/x-tree-view/SimpleTreeView");
var TreeItem_1 = require("@mui/x-tree-view/TreeItem");
var innerDescribeTreeView = function (message, testRunner) {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var getUtils = function (result, apiRef) {
        var getRoot = function () { return result.getByRole('tree'); };
        var getAllTreeItemIds = function () {
            return result.queryAllByRole('treeitem').map(function (item) { return item.dataset.testid; });
        };
        var getItemIdTree = function () {
            if (!apiRef) {
                throw new Error('Cannot use getItemIdTree in renderFromJSX because the apiRef is not defined');
            }
            var cleanItem = function (item) {
                if (item.children) {
                    return { id: item.id, children: item.children.map(cleanItem) };
                }
                return { id: item.id };
            };
            // @ts-ignore
            return apiRef.current.getItemTree().map(cleanItem);
        };
        var getFocusedItemId = function () {
            var activeElement = document.activeElement;
            if (!activeElement || !activeElement.classList.contains(TreeItem_1.treeItemClasses.root)) {
                return null;
            }
            return activeElement.dataset.testid;
        };
        var getItemRoot = function (id) { return result.getByTestId(id); };
        var getItemContent = function (id) {
            return getItemRoot(id).querySelector(".".concat(TreeItem_1.treeItemClasses.content));
        };
        var getItemCheckbox = function (id) {
            return getItemRoot(id).querySelector(".".concat(TreeItem_1.treeItemClasses.checkbox));
        };
        var getItemLabelInput = function (id) {
            return getItemRoot(id).querySelector(".".concat(TreeItem_1.treeItemClasses.labelInput));
        };
        var getItemCheckboxInput = function (id) {
            return getItemCheckbox(id).querySelector("input");
        };
        var getItemLabel = function (id) {
            return getItemRoot(id).querySelector(".".concat(TreeItem_1.treeItemClasses.label));
        };
        var getItemIconContainer = function (id) {
            return getItemRoot(id).querySelector(".".concat(TreeItem_1.treeItemClasses.iconContainer));
        };
        var isItemExpanded = function (id) { return getItemRoot(id).getAttribute('aria-expanded') === 'true'; };
        var isItemSelected = function (id) { return getItemRoot(id).getAttribute('aria-selected') === 'true'; };
        var getSelectedTreeItems = function () {
            return result
                .queryAllByRole('treeitem')
                .filter(function (item) { return item.getAttribute('aria-selected') === 'true'; })
                .map(function (item) { return item.dataset.testid; });
        };
        return {
            getRoot: getRoot,
            getAllTreeItemIds: getAllTreeItemIds,
            getFocusedItemId: getFocusedItemId,
            getItemRoot: getItemRoot,
            getItemContent: getItemContent,
            getItemCheckbox: getItemCheckbox,
            getItemCheckboxInput: getItemCheckboxInput,
            getItemLabel: getItemLabel,
            getItemIconContainer: getItemIconContainer,
            isItemExpanded: isItemExpanded,
            isItemSelected: isItemSelected,
            getSelectedTreeItems: getSelectedTreeItems,
            getItemLabelInput: getItemLabelInput,
            getItemIdTree: getItemIdTree,
        };
    };
    var jsxRenderer = function (element) {
        var result = render(element);
        return getUtils(result);
    };
    var createRendererForComponentWithItemsProp = function (TreeViewComponent) {
        var objectRenderer = function (_a) {
            var rawItems = _a.items, withErrorBoundary = _a.withErrorBoundary, slotProps = _a.slotProps, slots = _a.slots, other = __rest(_a, ["items", "withErrorBoundary", "slotProps", "slots"]);
            var items = rawItems;
            var apiRef = { current: undefined };
            var jsx = (<TreeViewComponent items={items} apiRef={apiRef} slots={__assign({ item: TreeItem_1.TreeItem }, slots)} slotProps={__assign(__assign({}, slotProps), { item: function (ownerState) {
                        return (__assign(__assign({}, slotProps === null || slotProps === void 0 ? void 0 : slotProps.item), { 'data-testid': ownerState.itemId }));
                    } })} getItemLabel={function (item) {
                    if (item.label) {
                        if (typeof item.label !== 'string') {
                            throw new Error('Only use string labels when testing RichTreeView(Pro)');
                        }
                        return item.label;
                    }
                    return item.id;
                }} isItemDisabled={function (item) { return !!item.disabled; }} {...other}/>);
            var result = render(withErrorBoundary ? <internal_test_utils_1.ErrorBoundary>{jsx}</internal_test_utils_1.ErrorBoundary> : jsx);
            return __assign({ setProps: result.setProps, setItems: function (newItems) { return result.setProps({ items: newItems }); }, apiRef: apiRef }, getUtils(result, apiRef));
        };
        return {
            render: objectRenderer,
            renderFromJSX: jsxRenderer,
        };
    };
    var createRenderersForComponentWithJSXItems = function (TreeViewComponent) {
        var objectRenderer = function (_a) {
            var _b;
            var rawItems = _a.items, withErrorBoundary = _a.withErrorBoundary, slots = _a.slots, slotProps = _a.slotProps, other = __rest(_a, ["items", "withErrorBoundary", "slots", "slotProps"]);
            var items = rawItems;
            var Item = (_b = slots === null || slots === void 0 ? void 0 : slots.item) !== null && _b !== void 0 ? _b : TreeItem_1.TreeItem;
            var apiRef = { current: undefined };
            var renderItem = function (item) {
                var _a, _b;
                return (<Item itemId={item.id} label={(_a = item.label) !== null && _a !== void 0 ? _a : item.id} disabled={item.disabled} data-testid={item.id} key={item.id} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.item}>
          {(_b = item.children) === null || _b === void 0 ? void 0 : _b.map(renderItem)}
        </Item>);
            };
            var jsx = (<TreeViewComponent slots={slots} slotProps={slotProps} apiRef={apiRef} {...other}>
          {items.map(renderItem)}
        </TreeViewComponent>);
            var result = render(withErrorBoundary ? <internal_test_utils_1.ErrorBoundary>{jsx}</internal_test_utils_1.ErrorBoundary> : jsx);
            return __assign({ setProps: result.setProps, setItems: function (newItems) { return result.setProps({ children: newItems.map(renderItem) }); }, apiRef: apiRef }, getUtils(result));
        };
        return {
            render: objectRenderer,
            renderFromJSX: jsxRenderer,
        };
    };
    describe(message, function () {
        describe('RichTreeView', function () {
            testRunner(__assign(__assign({}, createRendererForComponentWithItemsProp(RichTreeView_1.RichTreeView)), { treeViewComponentName: 'RichTreeView', TreeViewComponent: RichTreeView_1.RichTreeView, TreeItemComponent: TreeItem_1.TreeItem }));
        });
        describe('RichTreeViewPro', function () {
            testRunner(__assign(__assign({}, createRendererForComponentWithItemsProp(RichTreeViewPro_1.RichTreeViewPro)), { treeViewComponentName: 'RichTreeViewPro', TreeViewComponent: RichTreeViewPro_1.RichTreeViewPro, TreeItemComponent: TreeItem_1.TreeItem }));
        });
        describe('SimpleTreeView', function () {
            testRunner(__assign(__assign({}, createRenderersForComponentWithJSXItems(SimpleTreeView_1.SimpleTreeView)), { treeViewComponentName: 'SimpleTreeView', TreeViewComponent: SimpleTreeView_1.SimpleTreeView, TreeItemComponent: TreeItem_1.TreeItem }));
        });
    });
};
/**
 * Describe tests for the Tree View that will be executed with the following Tree View components:
 * - RichTreeView
 * - RichTreeViewPro
 * - SimpleTreeView
 *
 * Is used as follows:
 *
 * ```
 * describeTreeView('Title of the suite', ({ render }) => {
 *   it('should do something', () => {
 *     const { getItemRoot } = render({
 *       items: [{ id: '1', children: [{ id: '1.1' }] }],
 *       defaultExpandedItems: ['1'],
 *     });
 *   });
 * });
 * ```
 *
 * Several things to note:
 * - The `render` function takes an array of items, even for Simple Tree View
 * - Except for `items`, all the other properties passed to `render` will be forwarded to the Tree View as props
 * - If an item has no label, its `id` will be used as the label
 */
exports.describeTreeView = (0, createDescribe_1.default)('describeTreeView', innerDescribeTreeView);
