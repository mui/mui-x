"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var describeTreeView_1 = require("test/utils/tree-view/describeTreeView");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var TreeItem_1 = require("@mui/x-tree-view/TreeItem");
var hooks_1 = require("@mui/x-tree-view/hooks");
var warning_1 = require("@mui/x-internals/warning");
/**
 * All tests related to keyboard navigation (e.g.: expanding using "Enter" and "ArrowRight")
 * are located in the `useTreeViewKeyboardNavigation.test.tsx` file.
 */
(0, describeTreeView_1.describeTreeView)('useTreeViewExpansion plugin', function (_a) {
    var render = _a.render;
    describe('model props (expandedItems, defaultExpandedItems, onExpandedItemsChange)', function () {
        beforeEach(function () {
            (0, warning_1.clearWarningsCache)();
        });
        it('should not expand items when no default state and no control state are defined', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
            });
            expect(view.isItemExpanded('1')).to.equal(false);
            expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2']);
        });
        it('should use the default state when defined', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                defaultExpandedItems: ['1'],
            });
            expect(view.isItemExpanded('1')).to.equal(true);
            expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1.1', '2']);
        });
        it('should use the controlled state when defined', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                expandedItems: ['1'],
            });
            expect(view.isItemExpanded('1')).to.equal(true);
            expect(view.getItemRoot('1.1')).toBeVisible();
        });
        it('should use the controlled state instead of the default state when both are defined', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                expandedItems: ['1'],
                defaultExpandedItems: ['2'],
            });
            expect(view.isItemExpanded('1')).to.equal(true);
        });
        it('should react to controlled state update', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                expandedItems: [],
            });
            view.setProps({ expandedItems: ['1'] });
            expect(view.isItemExpanded('1')).to.equal(true);
        });
        it('should call the onExpandedItemsChange callback when the model is updated (add expanded item to empty list)', function () {
            var onExpandedItemsChange = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                onExpandedItemsChange: onExpandedItemsChange,
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(onExpandedItemsChange.callCount).to.equal(1);
            expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal(['1']);
        });
        it('should call the onExpandedItemsChange callback when the model is updated (add expanded item to non-empty list)', function () {
            var onExpandedItemsChange = (0, sinon_1.spy)();
            var view = render({
                items: [
                    { id: '1', children: [{ id: '1.1' }] },
                    { id: '2', children: [{ id: '2.1' }] },
                ],
                onExpandedItemsChange: onExpandedItemsChange,
                defaultExpandedItems: ['1'],
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('2'));
            expect(onExpandedItemsChange.callCount).to.equal(1);
            expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal(['2', '1']);
        });
        it('should call the onExpandedItemsChange callback when the model is updated (remove expanded item)', function () {
            var onExpandedItemsChange = (0, sinon_1.spy)();
            var view = render({
                items: [
                    { id: '1', children: [{ id: '1.1' }] },
                    { id: '2', children: [{ id: '2.1' }] },
                ],
                onExpandedItemsChange: onExpandedItemsChange,
                defaultExpandedItems: ['1'],
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(onExpandedItemsChange.callCount).to.equal(1);
            expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal([]);
        });
        it('should warn when switching from controlled to uncontrolled', function () {
            var view = render({
                items: [{ id: '1' }],
                expandedItems: [],
            });
            expect(function () {
                view.setProps({ expandedItems: undefined });
            }).toErrorDev('MUI X: A component is changing the controlled expandedItems state of Tree View to be uncontrolled.');
        });
        it('should warn and not react to update when updating the default state', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                defaultExpandedItems: ['1'],
            });
            expect(function () {
                view.setProps({ defaultExpandedItems: ['2'] });
                expect(view.isItemExpanded('1')).to.equal(true);
                expect(view.isItemExpanded('2')).to.equal(false);
            }).toErrorDev('MUI X: A component is changing the default expandedItems state of an uncontrolled Tree View after being initialized. To suppress this warning opt to use a controlled Tree View.');
        });
    });
    describe('item click interaction', function () {
        it('should expand collapsed item when clicking on an item content', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
            });
            expect(view.isItemExpanded('1')).to.equal(false);
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(view.isItemExpanded('1')).to.equal(true);
        });
        it('should collapse expanded item when clicking on an item content', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                defaultExpandedItems: ['1'],
            });
            expect(view.isItemExpanded('1')).to.equal(true);
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(view.isItemExpanded('1')).to.equal(false);
        });
        it('should not expand collapsed item when clicking on a disabled item content', function () {
            var view = render({
                items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
            });
            expect(view.isItemExpanded('1')).to.equal(false);
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(view.isItemExpanded('1')).to.equal(false);
        });
        it('should not collapse expanded item when clicking on a disabled item', function () {
            var view = render({
                items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
                defaultExpandedItems: ['1'],
            });
            expect(view.isItemExpanded('1')).to.equal(true);
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(view.isItemExpanded('1')).to.equal(true);
        });
        it('should expand collapsed item when clicking on an item label', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
            });
            expect(view.isItemExpanded('1')).to.equal(false);
            internal_test_utils_1.fireEvent.click(view.getItemLabel('1'));
            expect(view.isItemExpanded('1')).to.equal(true);
        });
        it('should expand collapsed item when clicking on an item icon container', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
            });
            expect(view.isItemExpanded('1')).to.equal(false);
            internal_test_utils_1.fireEvent.click(view.getItemIconContainer('1'));
            expect(view.isItemExpanded('1')).to.equal(true);
        });
        it('should be able to limit the expansion to the icon', function () {
            var CustomTreeItem = React.forwardRef(function MyTreeItem(props, ref) {
                var interactions = (0, hooks_1.useTreeItemUtils)({
                    itemId: props.itemId,
                    children: props.children,
                }).interactions;
                var handleContentClick = function (event) {
                    event.defaultMuiPrevented = true;
                    interactions.handleSelection(event);
                };
                var handleIconContainerClick = function (event) {
                    interactions.handleExpansion(event);
                };
                return (<TreeItem_1.TreeItem {...props} ref={ref} slotProps={{
                        content: { onClick: handleContentClick },
                        iconContainer: { onClick: handleIconContainerClick },
                    }}/>);
            });
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                slots: { item: CustomTreeItem },
            });
            expect(view.isItemExpanded('1')).to.equal(false);
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(view.isItemExpanded('1')).to.equal(false);
            internal_test_utils_1.fireEvent.click(view.getItemIconContainer('1'));
            expect(view.isItemExpanded('1')).to.equal(true);
        });
    });
    // The `aria-expanded` attribute is used by the `response.isItemExpanded` method.
    // This `describe` only tests basics scenarios, more complex scenarios are tested in this file's other `describe`.
    describe('aria-expanded item attribute', function () {
        it('should have the attribute `aria-expanded=false` if collapsed', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
            });
            expect(view.getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
        });
        it('should have the attribute `aria-expanded=true` if expanded', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                defaultExpandedItems: ['1'],
            });
            expect(view.getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
        });
        it('should not have the attribute `aria-expanded` if no children are present', function () {
            var view = render({
                items: [{ id: '1' }],
            });
            expect(view.getItemRoot('1')).not.to.have.attribute('aria-expanded');
        });
    });
    describe('onItemExpansionToggle prop', function () {
        it('should call the onItemExpansionToggle callback when expanding an item', function () {
            var onItemExpansionToggle = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                onItemExpansionToggle: onItemExpansionToggle,
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(onItemExpansionToggle.callCount).to.equal(1);
            expect(onItemExpansionToggle.lastCall.args[1]).to.equal('1');
            expect(onItemExpansionToggle.lastCall.args[2]).to.equal(true);
        });
        it('should call the onItemExpansionToggle callback when collapsing an item', function () {
            var onItemExpansionToggle = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                defaultExpandedItems: ['1'],
                onItemExpansionToggle: onItemExpansionToggle,
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(onItemExpansionToggle.callCount).to.equal(1);
            expect(onItemExpansionToggle.lastCall.args[1]).to.equal('1');
            expect(onItemExpansionToggle.lastCall.args[2]).to.equal(false);
        });
    });
    describe('setItemExpansion() api method', function () {
        it('should expand a collapsed item when calling the setItemExpansion method with `shouldBeExpanded=true`', function () {
            var onItemExpansionToggle = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                onItemExpansionToggle: onItemExpansionToggle,
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.setItemExpansion({
                    event: {},
                    itemId: '1',
                    shouldBeExpanded: true,
                });
            });
            expect(view.isItemExpanded('1')).to.equal(true);
            expect(onItemExpansionToggle.callCount).to.equal(1);
            expect(onItemExpansionToggle.lastCall.args[1]).to.equal('1');
            expect(onItemExpansionToggle.lastCall.args[2]).to.equal(true);
        });
        it('should collapse an expanded item when calling the setItemExpansion method with `shouldBeExpanded=false`', function () {
            var onItemExpansionToggle = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                defaultExpandedItems: ['1'],
                onItemExpansionToggle: onItemExpansionToggle,
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.setItemExpansion({
                    event: {},
                    itemId: '1',
                    shouldBeExpanded: false,
                });
            });
            expect(view.isItemExpanded('1')).to.equal(false);
            expect(onItemExpansionToggle.callCount).to.equal(1);
            expect(onItemExpansionToggle.lastCall.args[1]).to.equal('1');
            expect(onItemExpansionToggle.lastCall.args[2]).to.equal(false);
        });
        it('should do nothing when calling the setItemExpansion method with `shouldBeExpanded=true` on an already expanded item', function () {
            var onItemExpansionToggle = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                defaultExpandedItems: ['1'],
                onItemExpansionToggle: onItemExpansionToggle,
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.setItemExpansion({
                    event: {},
                    itemId: '1',
                    shouldBeExpanded: true,
                });
            });
            expect(view.isItemExpanded('1')).to.equal(true);
            expect(onItemExpansionToggle.callCount).to.equal(0);
        });
        it('should do nothing when calling the setItemExpansion method with `shouldBeExpanded=false` on an already collapsed item', function () {
            var onItemExpansionToggle = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                onItemExpansionToggle: onItemExpansionToggle,
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.setItemExpansion({
                    event: {},
                    itemId: '1',
                    shouldBeExpanded: false,
                });
            });
            expect(view.isItemExpanded('1')).to.equal(false);
            expect(onItemExpansionToggle.callCount).to.equal(0);
        });
        it('should expand a collapsed item when shouldBeExpanded is not defined', function () {
            var onItemExpansionToggle = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                onItemExpansionToggle: onItemExpansionToggle,
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.setItemExpansion({
                    event: {},
                    itemId: '1',
                });
            });
            expect(view.isItemExpanded('1')).to.equal(true);
            expect(onItemExpansionToggle.callCount).to.equal(1);
        });
        it('should collapse an expanded item when shouldBeExpanded is not defined', function () {
            var onItemExpansionToggle = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                defaultExpandedItems: ['1'],
                onItemExpansionToggle: onItemExpansionToggle,
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.setItemExpansion({
                    event: {},
                    itemId: '1',
                });
            });
            expect(view.isItemExpanded('1')).to.equal(false);
            expect(onItemExpansionToggle.callCount).to.equal(1);
        });
    });
});
