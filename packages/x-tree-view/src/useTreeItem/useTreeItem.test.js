"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var describeTreeView_1 = require("test/utils/tree-view/describeTreeView");
var TreeItem_1 = require("@mui/x-tree-view/TreeItem");
(0, describeTreeView_1.describeTreeView)('useTreeItem hook', function (_a) {
    var render = _a.render, renderFromJSX = _a.renderFromJSX, TreeItemComponent = _a.TreeItemComponent, treeViewComponentName = _a.treeViewComponentName, TreeViewComponent = _a.TreeViewComponent;
    describe('role prop', function () {
        it('should have the role="treeitem" on the root slot', function () {
            var view = render({ items: [{ id: '1' }] });
            expect(view.getItemRoot('1')).to.have.attribute('role', 'treeitem');
        });
        it('should have the role "group" on the groupTransition slot if the item is expandable', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                defaultExpandedItems: ['1'],
            });
            expect(view.getItemRoot('1').querySelector(".".concat(TreeItem_1.treeItemClasses.groupTransition))).to.have.attribute('role', 'group');
        });
    });
    describe('onClick prop', function () {
        it('should call onClick when clicked, but not when children are clicked for TreeItem', function () {
            var onClick = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                defaultExpandedItems: ['1'],
                slotProps: {
                    item: {
                        onClick: onClick,
                    },
                },
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1.1'));
            expect(onClick.callCount).to.equal(2);
            expect(onClick.lastCall.firstArg.target.parentElement.dataset.testid).to.equal('1.1');
        });
        it('should call onClick even when the element is disabled', function () {
            var onClick = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1', disabled: true }],
                slotProps: {
                    item: {
                        onClick: onClick,
                    },
                },
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(onClick.callCount).to.equal(1);
        });
    });
    it('should be able to type in a child input', function () {
        var view = render({
            items: [{ id: '1', children: [{ id: '1.1' }] }],
            defaultExpandedItems: ['1'],
            slotProps: {
                item: {
                    slots: {
                        label: function () { return <input type="text" className="icon-input "/>; },
                    },
                },
            },
        });
        var input = view.getItemRoot('1.1').querySelector('.icon-input');
        var keydownEvent = internal_test_utils_1.createEvent.keyDown(input, {
            key: 'a',
            keyCode: 65,
        });
        var handlePreventDefault = (0, sinon_1.spy)();
        keydownEvent.preventDefault = handlePreventDefault;
        (0, internal_test_utils_1.fireEvent)(input, keydownEvent);
        expect(handlePreventDefault.callCount).to.equal(0);
    });
    it('should not focus steal', function () {
        var setActiveItemMounted;
        // a TreeItem whose mounted state we can control with `setActiveItemMounted`
        function ConditionallyMountedItem(props) {
            var _a = React.useState(true), mounted = _a[0], setMounted = _a[1];
            if (props.itemId === '2') {
                // eslint-disable-next-line react-compiler/react-compiler
                setActiveItemMounted = setMounted;
            }
            if (!mounted) {
                return null;
            }
            return <TreeItemComponent {...props}/>;
        }
        var view;
        if (treeViewComponentName === 'SimpleTreeView') {
            view = renderFromJSX(<React.Fragment>
            <button type="button">Some focusable element</button>
            <TreeViewComponent>
              <ConditionallyMountedItem itemId="1" label="1" data-testid="1"/>
              <ConditionallyMountedItem itemId="2" label="2" data-testid="2"/>
            </TreeViewComponent>
          </React.Fragment>);
        }
        else {
            view = renderFromJSX(<React.Fragment>
            <button type="button">Some focusable element</button>
            <TreeViewComponent items={[{ id: '1' }, { id: '2' }]} slots={{
                    item: ConditionallyMountedItem,
                }} slotProps={{
                    item: function (ownerState) { return ({ 'data-testid': ownerState.itemId }); },
                }} getItemLabel={function (item) { return item.id; }}/>
          </React.Fragment>);
        }
        (0, internal_test_utils_1.act)(function () {
            view.getItemRoot('2').focus();
        });
        expect(view.getFocusedItemId()).to.equal('2');
        (0, internal_test_utils_1.act)(function () {
            internal_test_utils_1.screen.getByRole('button').focus();
        });
        expect(internal_test_utils_1.screen.getByRole('button')).toHaveFocus();
        (0, internal_test_utils_1.act)(function () {
            setActiveItemMounted(false);
        });
        (0, internal_test_utils_1.act)(function () {
            setActiveItemMounted(true);
        });
        expect(internal_test_utils_1.screen.getByRole('button')).toHaveFocus();
    });
});
