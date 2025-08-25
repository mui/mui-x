"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var describeTreeView_1 = require("test/utils/tree-view/describeTreeView");
/**
 * All tests related to keyboard navigation (e.g.: type-ahead when using `props.disabledItemsFocusable`)
 * are located in the `useTreeViewKeyboardNavigation.test.tsx` file.
 */
(0, describeTreeView_1.describeTreeView)('useTreeViewFocus plugin', function (_a) {
    var render = _a.render, renderFromJSX = _a.renderFromJSX, TreeItemComponent = _a.TreeItemComponent, treeViewComponentName = _a.treeViewComponentName, TreeViewComponent = _a.TreeViewComponent;
    describe('basic behavior', function () {
        it('should allow to focus an item', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
            });
            internal_test_utils_1.fireEvent.focus(view.getItemRoot('2'));
            expect(view.getFocusedItemId()).to.equal('2');
            internal_test_utils_1.fireEvent.focus(view.getItemRoot('1'));
            expect(view.getFocusedItemId()).to.equal('1');
        });
        it('should move the focus when the focused item is removed', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
            });
            internal_test_utils_1.fireEvent.focus(view.getItemRoot('2'));
            expect(view.getFocusedItemId()).to.equal('2');
            view.setItems([{ id: '1' }]);
            expect(view.getFocusedItemId()).to.equal('1');
        });
    });
    describe('tabIndex HTML attribute', function () {
        it('should set tabIndex={0} on the first item if none are selected', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
            });
            expect(view.getItemRoot('1').tabIndex).to.equal(0);
            expect(view.getItemRoot('2').tabIndex).to.equal(-1);
        });
        it('should set tabIndex={0} on the selected item (single selection)', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
                selectedItems: '2',
            });
            expect(view.getItemRoot('1').tabIndex).to.equal(-1);
            expect(view.getItemRoot('2').tabIndex).to.equal(0);
        });
        it('should set tabIndex={0} on the first selected item (multi selection)', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                selectedItems: ['2', '3'],
                multiSelect: true,
            });
            expect(view.getItemRoot('1').tabIndex).to.equal(-1);
            expect(view.getItemRoot('2').tabIndex).to.equal(0);
            expect(view.getItemRoot('3').tabIndex).to.equal(-1);
        });
        it('should set tabIndex={0} on the first item if selected item is not visible', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2', children: [{ id: '2.1' }] }],
                selectedItems: '2.1',
            });
            expect(view.getItemRoot('1').tabIndex).to.equal(0);
            expect(view.getItemRoot('2').tabIndex).to.equal(-1);
        });
        it('should set tabIndex={0} on the first item if no selected item is visible', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2', children: [{ id: '2.1' }, { id: '2.2' }] }],
                selectedItems: ['2.1', '2.2'],
                multiSelect: true,
            });
            expect(view.getItemRoot('1').tabIndex).to.equal(0);
            expect(view.getItemRoot('2').tabIndex).to.equal(-1);
        });
    });
    describe('focusItem api method', function () {
        it('should focus the item', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.focusItem({}, '2');
            });
            expect(view.getFocusedItemId()).to.equal('2');
        });
        it('should not focus item if parent is collapsed', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2', children: [{ id: '2.1' }] }],
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.focusItem({}, '2.1');
            });
            expect(view.getFocusedItemId()).to.equal(null);
        });
    });
    describe('onItemFocus prop', function () {
        it('should be called when an item is focused', function () {
            var onItemFocus = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1' }],
                onItemFocus: onItemFocus,
            });
            (0, internal_test_utils_1.act)(function () {
                view.getItemRoot('1').focus();
            });
            expect(onItemFocus.callCount).to.equal(1);
            expect(onItemFocus.lastCall.lastArg).to.equal('1');
        });
    });
    describe('disabledItemsFocusable prop', function () {
        describe('disabledItemFocusable={false}', function () {
            it('should prevent focus by mouse', function () {
                var view = render({
                    items: [{ id: '1', disabled: true }],
                    disabledItemsFocusable: false,
                });
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.getFocusedItemId()).to.equal(null);
            });
            it('should tab tabIndex={-1} on the disabled item and tabIndex={0} on the first non-disabled item', function () {
                var view = render({
                    items: [{ id: '1', disabled: true }, { id: '2' }, { id: '3' }],
                    disabledItemsFocusable: false,
                });
                expect(view.getItemRoot('1').tabIndex).to.equal(-1);
                expect(view.getItemRoot('2').tabIndex).to.equal(0);
                expect(view.getItemRoot('3').tabIndex).to.equal(-1);
            });
        });
        describe('disabledItemFocusable={true}', function () {
            it('should prevent focus by mouse', function () {
                var view = render({
                    items: [{ id: '1', disabled: true }],
                    disabledItemsFocusable: true,
                });
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.getFocusedItemId()).to.equal(null);
            });
            it('should tab tabIndex={0} on the disabled item and tabIndex={-1} on the other items', function () {
                var view = render({
                    items: [{ id: '1', disabled: true }, { id: '2' }, { id: '3' }],
                    disabledItemsFocusable: true,
                });
                expect(view.getItemRoot('1').tabIndex).to.equal(0);
                expect(view.getItemRoot('2').tabIndex).to.equal(-1);
                expect(view.getItemRoot('3').tabIndex).to.equal(-1);
            });
        });
    });
    it('should not error when component state changes', function () {
        var items = [{ id: '1', children: [{ id: '1.1' }] }];
        var getItemLabel = function (item) { return item.id; };
        function MyComponent() {
            var _a = React.useState(1), setState = _a[1];
            if (treeViewComponentName === 'SimpleTreeView') {
                return (<TreeViewComponent defaultExpandedItems={['1']} onItemFocus={function () {
                        setState(Math.random);
                    }}>
              <TreeItemComponent itemId="1" data-testid="1">
                <TreeItemComponent itemId="1.1" data-testid="1.1"/>
              </TreeItemComponent>
            </TreeViewComponent>);
            }
            return (<TreeViewComponent items={items} defaultExpandedItems={['1']} onItemFocus={function () {
                    setState(Math.random);
                }} slotProps={{
                    item: function (ownerState) { return ({ 'data-testid': ownerState.itemId }); },
                }} getItemLabel={getItemLabel}/>);
        }
        var view = renderFromJSX(<MyComponent />);
        internal_test_utils_1.fireEvent.focus(view.getItemRoot('1'));
        expect(view.getFocusedItemId()).to.equal('1');
        internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown' });
        expect(view.getFocusedItemId()).to.equal('1.1');
        internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1.1'), { key: 'ArrowUp' });
        expect(view.getFocusedItemId()).to.equal('1');
        internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown' });
        expect(view.getFocusedItemId()).to.equal('1.1');
    });
});
