"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var describeTreeView_1 = require("test/utils/tree-view/describeTreeView");
var TreeItem_1 = require("@mui/x-tree-view/TreeItem");
var skipIf_1 = require("test/utils/skipIf");
(0, describeTreeView_1.describeTreeView)('useTreeViewItems plugin', function (_a) {
    var render = _a.render, renderFromJSX = _a.renderFromJSX, treeViewComponentName = _a.treeViewComponentName, TreeViewComponent = _a.TreeViewComponent, TreeItemComponent = _a.TreeItemComponent;
    var isRichTreeView = treeViewComponentName.startsWith('RichTreeView');
    // can't catch render errors in the browser for unknown reason
    // tried try-catch + error boundary + window onError preventDefault
    it.skipIf(!skipIf_1.isJSDOM)('should throw an error when two items have the same ID', function () {
        if (treeViewComponentName === 'SimpleTreeView') {
            expect(function () {
                return render({ items: [{ id: '1' }, { id: '1' }], withErrorBoundary: true });
            }).toErrorDev([
                'Encountered two children with the same key, `1`',
                'MUI X: The Tree View component requires all items to have a unique `id` property.',
                'Alternatively, you can use the `getItemId` prop to specify a custom id for each item',
                internal_test_utils_1.reactMajor < 19 && "The above error occurred in the <ForwardRef(TreeItem2)> component",
                internal_test_utils_1.reactMajor < 19 && "The above error occurred in the <ForwardRef(TreeItem2)> component",
            ]);
        }
        else {
            expect(function () {
                return render({ items: [{ id: '1' }, { id: '1' }], withErrorBoundary: true });
            }).toErrorDev([
                'MUI X: The Tree View component requires all items to have a unique `id` property.',
                internal_test_utils_1.reactMajor < 19 &&
                    'MUI X: The Tree View component requires all items to have a unique `id` property.',
                internal_test_utils_1.reactMajor < 19 &&
                    "The above error occurred in the <ForwardRef(".concat(treeViewComponentName, "2)> component"),
            ]);
        }
    });
    // For now, only SimpleTreeView can use custom id attributes
    it.skipIf(isRichTreeView)('should be able to use a custom id attribute', function () {
        var view = render({
            items: [{ id: '1' }],
            slotProps: {
                item: {
                    id: 'customId',
                },
            },
        });
        expect(view.getItemRoot('1')).to.have.attribute('id', 'customId');
    });
    describe('items prop / JSX Tree Item', function () {
        it('should support removing an item', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
            });
            view.setItems([{ id: '1' }]);
            expect(view.getAllTreeItemIds()).to.deep.equal(['1']);
        });
        it('should support adding an item at the end', function () {
            var view = render({
                items: [{ id: '1' }],
            });
            view.setItems([{ id: '1' }, { id: '2' }]);
            expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2']);
        });
        it('should support adding an item at the beginning', function () {
            var view = render({
                items: [{ id: '2' }],
            });
            view.setItems([{ id: '1' }, { id: '2' }]);
            expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2']);
        });
        it('should update indexes when two items are swapped', function () {
            var onSelectedItemsChange = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                multiSelect: true,
                onSelectedItemsChange: onSelectedItemsChange,
            });
            view.setItems([{ id: '1' }, { id: '3' }, { id: '2' }]);
            expect(view.getAllTreeItemIds()).to.deep.equal(['1', '3', '2']);
            // Check if the internal state is updated by running a range selection
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            internal_test_utils_1.fireEvent.click(view.getItemContent('3'), { shiftKey: true });
            expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal(['1', '3']);
        });
        it('should not mark an item as expandable if its children is an empty array', function () {
            var view = render({
                items: [{ id: '1', children: [] }],
                defaultExpandedItems: ['1'],
            });
            expect(view.getItemRoot('1')).not.to.have.attribute('aria-expanded');
        });
        it.skipIf(isRichTreeView)('should mark an item as not expandable if it has only empty conditional arrays', function () {
            var view = renderFromJSX(<TreeViewComponent defaultExpandedItems={['1']}>
              <TreeItemComponent itemId="1" label="1" data-testid="1">
                {[]}
                {[]}
              </TreeItemComponent>
            </TreeViewComponent>);
            expect(view.isItemExpanded('1')).to.equal(false);
        });
        it.skipIf(isRichTreeView)('should mark an item as expandable if it has two array as children, one of which is empty (SimpleTreeView only)', function () {
            var view = renderFromJSX(<TreeViewComponent defaultExpandedItems={['1']}>
              <TreeItemComponent itemId="1" label="1" data-testid="1">
                {[]}
                {[<TreeItemComponent key="1.1" itemId="1.1"/>]}
              </TreeItemComponent>
            </TreeViewComponent>);
            expect(view.isItemExpanded('1')).to.equal(true);
        });
        it.skipIf(isRichTreeView)('should mark an item as not expandable if it has one array containing an empty array as a children (SimpleTreeView only)', function () {
            var view = renderFromJSX(<TreeViewComponent defaultExpandedItems={['1']}>
              <TreeItemComponent itemId="1" label="1" data-testid="1">
                {[[]]}
              </TreeItemComponent>
            </TreeViewComponent>);
            expect(view.isItemExpanded('1')).to.equal(false);
        });
        it.skipIf(!isRichTreeView)('should use getItemLabel to render the label', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
                getItemLabel: function (item) { return "Label: ".concat(item.id); },
            });
            expect(view.getItemContent('1')).to.have.text('Label: 1');
            expect(view.getItemContent('2')).to.have.text('Label: 2');
        });
        it.skipIf(!isRichTreeView)('should use getItemChildren to find children', function () {
            var items = [
                {
                    id: '1',
                    label: 'Node 1',
                    section: [
                        { id: '1.1', label: 'Child 1' },
                        { id: '1.2', label: 'Child 2' },
                    ],
                },
                { id: '2', label: 'Node 2' },
            ];
            var view = render({
                items: items,
                getItemChildren: function (item) { return item.section; },
                defaultExpandedItems: ['1'],
            });
            expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1.1', '1.2', '2']);
            expect(view.getItemContent('1.1')).to.have.text('Child 1');
            expect(view.getItemContent('1.2')).to.have.text('Child 2');
        });
    });
    describe('disabled prop', function () {
        it('should not have the attribute `aria-disabled` if disabled is not defined', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2', disabled: false }, { id: '3', disabled: true }],
            });
            expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');
            expect(view.getItemRoot('2')).not.to.have.attribute('aria-disabled');
            expect(view.getItemRoot('3')).to.have.attribute('aria-disabled');
        });
        it('should disable all descendants of a disabled item', function () {
            var view = render({
                items: [
                    { id: '1', disabled: true, children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] },
                ],
                defaultExpandedItems: ['1', '1.1'],
            });
            expect(view.getItemRoot('1')).to.have.attribute('aria-disabled', 'true');
            expect(view.getItemRoot('1.1')).to.have.attribute('aria-disabled', 'true');
            expect(view.getItemRoot('1.1.1')).to.have.attribute('aria-disabled', 'true');
        });
    });
    describe('onItemClick prop', function () {
        it('should call onItemClick when clicking on the content of an item', function () {
            var onItemClick = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1' }],
                onItemClick: onItemClick,
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(onItemClick.callCount).to.equal(1);
            expect(onItemClick.lastCall.lastArg).to.equal('1');
        });
        it('should not call onItemClick for the ancestors on the clicked item', function () {
            var onItemClick = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                defaultExpandedItems: ['1'],
                onItemClick: onItemClick,
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1.1'));
            expect(onItemClick.callCount).to.equal(1);
            expect(onItemClick.lastCall.lastArg).to.equal('1.1');
        });
    });
    describe('Memoization (Rich Tree View only)', function () {
        it.skipIf(!isRichTreeView)('should not re-render any children when the Tree View re-renders (flat tree)', function () {
            var spyLabel = (0, sinon_1.spy)(function (props) { return <TreeItem_1.TreeItemLabel {...props}/>; });
            var view = render({
                items: Array.from({ length: 10 }, function (_, i) { return ({ id: i.toString() }); }),
                slotProps: { item: { slots: { label: spyLabel } } },
            });
            spyLabel.resetHistory();
            view.setProps({ onClick: function () { } });
            var renders = spyLabel.getCalls().map(function (call) { return call.args[0].children; });
            expect(renders).to.deep.equal([]);
        });
        it.skipIf(!isRichTreeView)('should not re-render every children when updating the state on an item (flat tree)', function () {
            var spyLabel = (0, sinon_1.spy)(function (props) { return <TreeItem_1.TreeItemLabel {...props}/>; });
            var view = render({
                items: Array.from({ length: 10 }, function (_, i) { return ({ id: i.toString() }); }),
                selectedItems: [],
                slotProps: { item: { slots: { label: spyLabel } } },
            });
            spyLabel.resetHistory();
            view.setProps({ selectedItems: ['1'] });
            var renders = spyLabel.getCalls().map(function (call) { return call.args[0].children; });
            // 2 renders of the 1st item to remove to tabIndex={0}
            // 2 renders of the selected item to change its visual state
            expect(renders).to.deep.equal(['0', '0', '1', '1']);
        });
        it.skipIf(!isRichTreeView)('should not re-render any children when the Tree View re-renders (nested tree)', function () {
            var spyLabel = (0, sinon_1.spy)(function (props) { return <TreeItem_1.TreeItemLabel {...props}/>; });
            var view = render({
                items: Array.from({ length: 5 }, function (_, i) { return ({
                    id: i.toString(),
                    children: Array.from({ length: 5 }, function (_el, j) { return ({ id: "".concat(i, ".").concat(j) }); }),
                }); }),
                slotProps: { item: { slots: { label: spyLabel } } },
            });
            spyLabel.resetHistory();
            view.setProps({ onClick: function () { } });
            var renders = spyLabel.getCalls().map(function (call) { return call.args[0].children; });
            expect(renders).to.deep.equal([]);
        });
        it.skipIf(!isRichTreeView)('should not re-render every children when updating the state on an item (nested tree)', function () {
            var spyLabel = (0, sinon_1.spy)(function (props) { return <TreeItem_1.TreeItemLabel {...props}/>; });
            var view = render({
                items: Array.from({ length: 5 }, function (_, i) { return ({
                    id: i.toString(),
                    children: Array.from({ length: 5 }, function (_el, j) { return ({ id: "".concat(i, ".").concat(j) }); }),
                }); }),
                defaultExpandedItems: Array.from({ length: 5 }, function (_, i) { return i.toString(); }),
                selectedItems: [],
                slotProps: { item: { slots: { label: spyLabel } } },
            });
            spyLabel.resetHistory();
            view.setProps({ selectedItems: ['1'] });
            var renders = spyLabel.getCalls().map(function (call) { return call.args[0].children; });
            // 2 renders of the 1st item to remove to tabIndex={0}
            // 2 renders of the selected item to change its visual state
            expect(renders).to.deep.equal(['0', '0', '1', '1']);
        });
    });
    describe('API methods', function () {
        // This method is only usable with Rich Tree View components
        describe.skipIf(treeViewComponentName === 'SimpleTreeView')('getItem', function () {
            it('should return the tree', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                });
                expect(view.apiRef.current.getItem('1')).to.deep.equal({
                    id: '1',
                    children: [{ id: '1.1' }],
                });
            });
            it('should have up to date tree when props.items changes', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                });
                view.setItems([{ id: '1' }, { id: '2' }]);
                expect(view.apiRef.current.getItem('1')).to.deep.equal({ id: '1' });
            });
            it('should contain custom item properties', function () {
                var view = render({
                    items: [{ id: '1', customProp: 'foo' }],
                });
                expect(view.apiRef.current.getItem('1')).to.deep.equal({
                    id: '1',
                    customProp: 'foo',
                });
            });
        });
        describe('getItemDOMElement', function () {
            it('should return the DOM element of the item', function () {
                var view = render({
                    items: [{ id: '1' }],
                });
                expect(view.apiRef.current.getItemDOMElement('1')).to.equal(view.getItemRoot('1'));
            });
            it("should return the null when the item doesn't exist", function () {
                var view = render({
                    items: [{ id: '1' }],
                });
                expect(view.apiRef.current.getItemDOMElement('2')).to.equal(null);
            });
        });
        // This method is only usable with Rich Tree View components
        describe.skipIf(treeViewComponentName === 'SimpleTreeView')('getItemTree with RichTreeView', function () {
            it('should return the tree', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                });
                expect(view.apiRef.current.getItemTree()).to.deep.equal([
                    { id: '1', children: [{ id: '1.1' }] },
                    { id: '2' },
                ]);
            });
            it('should have up to date tree when props.items changes', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                });
                view.setItems([{ id: '1' }, { id: '2' }]);
                expect(view.apiRef.current.getItemTree()).to.deep.equal([{ id: '1' }, { id: '2' }]);
            });
            it('should contain custom item properties', function () {
                var view = render({
                    items: [{ id: '1', customProp: 'foo' }],
                });
                expect(view.apiRef.current.getItemTree()).to.deep.equal([
                    { id: '1', customProp: 'foo' },
                ]);
            });
        });
        // This method is only usable with Rich Tree View components
        describe.skipIf(treeViewComponentName === 'SimpleTreeView')('getItemOrderedChildrenIds', function () {
            it('should return the children of an item in their rendering order', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
                });
                expect(view.apiRef.current.getItemOrderedChildrenIds('1')).to.deep.equal([
                    '1.1',
                    '1.2',
                ]);
            });
            it('should work for the root items', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                });
                expect(view.apiRef.current.getItemOrderedChildrenIds(null)).to.deep.equal(['1', '2']);
            });
            it('should have up to date children when props.items changes', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                });
                view.setItems([{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }]);
                expect(view.apiRef.current.getItemOrderedChildrenIds('1')).to.deep.equal([
                    '1.1',
                    '1.2',
                ]);
            });
        });
        describe('setIsItemDisabled API method', function () {
            it('should disable an item when called with shouldBeDisabled=true', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                });
                expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setIsItemDisabled({ itemId: '1', shouldBeDisabled: true });
                });
                expect(view.getItemRoot('1')).to.have.attribute('aria-disabled', 'true');
                expect(view.getItemRoot('2')).not.to.have.attribute('aria-disabled');
            });
            it('should enable a disabled item when called with shouldBeDisabled=false', function () {
                var view = render({
                    items: [
                        { id: '1', disabled: true },
                        { id: '2', disabled: true },
                    ],
                });
                expect(view.getItemRoot('1')).to.have.attribute('aria-disabled', 'true');
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setIsItemDisabled({ itemId: '1', shouldBeDisabled: false });
                });
                expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');
                expect(view.getItemRoot('2')).to.have.attribute('aria-disabled', 'true');
            });
            it('should toggle disabled state when called without shouldBeDisabled parameter', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2', disabled: true }],
                });
                expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');
                expect(view.getItemRoot('2')).to.have.attribute('aria-disabled', 'true');
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setIsItemDisabled({ itemId: '1' });
                    view.apiRef.current.setIsItemDisabled({ itemId: '2' });
                });
                expect(view.getItemRoot('1')).to.have.attribute('aria-disabled', 'true');
                expect(view.getItemRoot('2')).not.to.have.attribute('aria-disabled');
            });
            it('should do nothing when called with non-existent itemId', function () {
                var view = render({
                    items: [{ id: '1' }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setIsItemDisabled({
                        itemId: 'non-existent',
                        shouldBeDisabled: true,
                    });
                });
                expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');
            });
        });
    });
    describe('lazy loading (dataSource)', function () {
        it.skipIf(treeViewComponentName !== 'RichTreeViewPro')('should not reset focus after lazy loading children when checkboxSelection is enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            function MyComponent() {
                var items = [
                    { id: '1', label: 'Node 1' },
                    { id: '2', label: 'Node with children' },
                ];
                var getChildrenCount = function (item) {
                    if (item.subField === 'child') {
                        return 0;
                    }
                    return 1;
                };
                var getTreeItems = function () {
                    return [{ id: '2.1', label: 'Child', subField: 'child' }];
                };
                return (<TreeViewComponent items={items} checkboxSelection getItemChildren={function (item) { return item.children || []; }} getItemId={function (item) { return item.id; }} getItemLabel={function (item) { return item.label; }} dataSource={{ getChildrenCount: getChildrenCount, getTreeItems: getTreeItems }} slotProps={{
                        item: function (ownerState) { return ({ 'data-testid': ownerState.itemId }); },
                    }}/>);
            }
            var view, expandIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderFromJSX(<MyComponent />);
                        internal_test_utils_1.fireEvent.focus(view.getItemRoot('2'));
                        expect(view.getFocusedItemId()).to.equal('2');
                        expandIcon = view
                            .getItemRoot('2')
                            .querySelector('[data-testid="TreeViewExpandIconIcon"]');
                        internal_test_utils_1.fireEvent.click(expandIcon);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(view.isItemExpanded('2')).to.equal(true);
                            })];
                    case 1:
                        _a.sent();
                        expect(!!view.getItemRoot('2.1')).to.equal(true);
                        expect(view.getFocusedItemId()).to.equal('2');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
