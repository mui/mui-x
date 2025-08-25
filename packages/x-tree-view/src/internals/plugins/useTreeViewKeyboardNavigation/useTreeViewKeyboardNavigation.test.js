"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var describeTreeView_1 = require("test/utils/tree-view/describeTreeView");
(0, describeTreeView_1.describeTreeView)('useTreeViewKeyboardNavigation', function (_a) {
    var render = _a.render, treeViewComponentName = _a.treeViewComponentName;
    describe('Navigation (focus and expansion)', function () {
        describe('key: ArrowDown', function () {
            it('should move the focus to a sibling item', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown' });
                expect(view.getFocusedItemId()).to.equal('2');
            });
            it('should move the focus to a child item', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown' });
                expect(view.getFocusedItemId()).to.equal('1.1');
            });
            it('should move the focus to a child item with a dynamic tree', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                    defaultExpandedItems: ['1'],
                });
                view.setItems([{ id: '2' }]);
                view.setItems([{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }]);
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown' });
                expect(view.getFocusedItemId()).to.equal('1.1');
            });
            it("should move the focus to a parent's sibling", function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }, { id: '2' }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1.1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1.1'), { key: 'ArrowDown' });
                expect(view.getFocusedItemId()).to.equal('2');
            });
            it('should skip disabled items', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown' });
                expect(view.getFocusedItemId()).to.equal('3');
            });
            it('should not skip disabled items if disabledItemsFocusable={true}', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
                    disabledItemsFocusable: true,
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown' });
                expect(view.getFocusedItemId()).to.equal('2');
            });
        });
        describe('key: ArrowUp', function () {
            it('should move the focus to a sibling item', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('2').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'ArrowUp' });
                expect(view.getFocusedItemId()).to.equal('1');
            });
            it('should move the focus to a parent', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1.1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1.1'), { key: 'ArrowUp' });
                expect(view.getFocusedItemId()).to.equal('1');
            });
            it("should move the focus to a sibling's child", function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('2').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'ArrowUp' });
                expect(view.getFocusedItemId()).to.equal('1.1');
            });
            it('should move the focus to the last visible and enabled descendant of the previous sibling', function () {
                var view = render({
                    items: [
                        {
                            id: '1',
                            children: [
                                { id: '1-1' },
                                {
                                    id: '1-2',
                                    children: [{ id: '1-2-1' }, { id: '1-2-2' }, { id: '1-2-3' }],
                                },
                            ],
                        },
                        { id: '2' },
                    ],
                    defaultExpandedItems: ['1', '1-2'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('2').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'ArrowUp' });
                expect(view.getFocusedItemId()).to.equal('1-2-3');
            });
            it('should move the focus to the last visible descendant of the previous sibling, skipping disabled items', function () {
                var view = render({
                    items: [
                        {
                            id: '1',
                            children: [
                                { id: '1-1' },
                                {
                                    id: '1-2',
                                    children: [{ id: '1-2-1' }, { id: '1-2-2' }, { id: '1-2-3', disabled: true }],
                                },
                            ],
                        },
                        { id: '2' },
                    ],
                    defaultExpandedItems: ['1', '1-2'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('2').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'ArrowUp' });
                expect(view.getFocusedItemId()).to.equal('1-2-2');
            });
            it('should skip disabled items', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('3').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), { key: 'ArrowUp' });
                expect(view.getFocusedItemId()).to.equal('1');
            });
            it('should not skip disabled items if disabledItemsFocusable={true}', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
                    disabledItemsFocusable: true,
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('3').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), { key: 'ArrowUp' });
                expect(view.getFocusedItemId()).to.equal('2');
            });
        });
        describe('key: ArrowRight', function () {
            it('should open the item and not move the focus if the focus is on a closed item', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowRight' });
                expect(view.isItemExpanded('1')).to.equal(true);
                expect(view.getFocusedItemId()).to.equal('1');
            });
            it('should not change focus if ctrl is pressed', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowRight', ctrlKey: true });
                expect(view.getFocusedItemId()).to.equal('1');
            });
            it('should move the focus to the first child if the focus is on an open item', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowRight' });
                expect(view.getFocusedItemId()).to.equal('1.1');
            });
            it('should do nothing if the focus is on a leaf', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1.1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1.1'), { key: 'ArrowRight' });
                expect(view.getFocusedItemId()).to.equal('1.1');
            });
            it('should not expand an item with children if it is collapsed but disabled even if disabledItemsFocusable={true}', function () {
                var view = render({
                    items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }],
                    disabledItemsFocusable: true,
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowRight' });
                expect(view.isItemExpanded('1')).to.equal(false);
            });
        });
        describe('key: ArrowLeft', function () {
            it('should close the item if the focus is on an open item', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowLeft' });
                expect(view.isItemExpanded('1')).to.equal(false);
            });
            it('should not change focus if ctrl is pressed', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1.1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1.1'), { key: 'ArrowLeft', ctrlKey: true });
                expect(view.getFocusedItemId()).to.equal('1.1');
            });
            it("should move focus to the item's parent if the focus is on a child item that is a leaf", function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1.1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1.1'), { key: 'ArrowLeft' });
                expect(view.getFocusedItemId()).to.equal('1');
                expect(view.isItemExpanded('1')).to.equal(true);
            });
            it("should move the focus to the item's parent if the focus is on a child item that is closed", function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1.1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1.1'), { key: 'ArrowLeft' });
                expect(view.getFocusedItemId()).to.equal('1');
                expect(view.isItemExpanded('1')).to.equal(true);
            });
            it('should do nothing if the focus is on a root item that is closed', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowLeft' });
                expect(view.getFocusedItemId()).to.equal('1');
                expect(view.isItemExpanded('1')).to.equal(false);
            });
            it('should do nothing if the focus is on a root item that is a leaf', function () {
                var view = render({
                    items: [{ id: '1' }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowLeft' });
                expect(view.getFocusedItemId()).to.equal('1');
            });
            it('should not collapse an item with children if it is collapsed but disabled even if disabledItemsFocusable={true}', function () {
                var view = render({
                    items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }],
                    defaultExpandedItems: ['1'],
                    disabledItemsFocusable: true,
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowLeft' });
                expect(view.isItemExpanded('1')).to.equal(true);
            });
        });
        describe('key: Home', function () {
            it('should move the focus to the first item in the tree', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('4').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('4'), { key: 'Home' });
                expect(view.getFocusedItemId()).to.equal('1');
            });
        });
        describe('key: End', function () {
            it('should move the focus to the last item in the tree when the last item is not expanded', function () {
                var view = render({
                    items: [
                        { id: '1' },
                        { id: '2' },
                        { id: '3' },
                        { id: '4', children: [{ id: '4.1' }, { id: '4.2' }] },
                    ],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'End' });
                expect(view.getFocusedItemId()).to.equal('4');
            });
            it('should move the focus to the last item in the tree when the last item is expanded', function () {
                var view = render({
                    items: [
                        { id: '1' },
                        { id: '2' },
                        { id: '3' },
                        { id: '4', children: [{ id: '4.1', children: [{ id: '4.1.1' }] }] },
                    ],
                    defaultExpandedItems: ['4', '4.1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'End' });
                expect(view.getFocusedItemId()).to.equal('4.1.1');
            });
        });
        describe('key: * (asterisk)', function () {
            it('should expand all items that are at the same depth as the current item (depth = 0)', function () {
                var view = render({
                    items: [
                        { id: '1', children: [{ id: '1.1' }] },
                        { id: '2', children: [{ id: '2.1' }] },
                        { id: '3', children: [{ id: '3.1', children: [{ id: '3.1.1' }] }] },
                        { id: '4' },
                    ],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                expect(view.isItemExpanded('1')).to.equal(false);
                expect(view.isItemExpanded('2')).to.equal(false);
                expect(view.isItemExpanded('3')).to.equal(false);
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: '*' });
                expect(view.isItemExpanded('1')).to.equal(true);
                expect(view.isItemExpanded('2')).to.equal(true);
                expect(view.isItemExpanded('3')).to.equal(true);
                expect(view.isItemExpanded('3.1')).to.equal(false);
            });
            it('should expand all items that are at the same depth as the current item (depth = 1)', function () {
                var view = render({
                    items: [
                        { id: '1', children: [{ id: '1.1' }] },
                        { id: '2', children: [{ id: '2.1' }] },
                        {
                            id: '3',
                            children: [
                                {
                                    id: '3.1',
                                    children: [{ id: '3.1.1' }, { id: '3.1.2', children: [{ id: '3.1.2.1' }] }],
                                },
                            ],
                        },
                        { id: '4' },
                    ],
                    defaultExpandedItems: ['3'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('3.1').focus();
                });
                expect(view.isItemExpanded('1')).to.equal(false);
                expect(view.isItemExpanded('2')).to.equal(false);
                expect(view.isItemExpanded('3')).to.equal(true);
                expect(view.isItemExpanded('3.1')).to.equal(false);
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3.1'), { key: '*' });
                expect(view.isItemExpanded('1')).to.equal(false);
                expect(view.isItemExpanded('2')).to.equal(false);
                expect(view.isItemExpanded('3')).to.equal(true);
                expect(view.isItemExpanded('3.1')).to.equal(true);
                expect(view.isItemExpanded('3.1.2')).to.equal(false);
            });
        });
        describe('key: Enter', function () {
            it('should expand an item with children if it is collapsed', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });
                expect(view.isItemExpanded('1')).to.equal(true);
            });
            it('should collapse an item with children if it is expanded', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }],
                    defaultExpandedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });
                expect(view.isItemExpanded('1')).to.equal(false);
            });
            it('should not expand an item with children if it is collapsed but disabled even if disabledItemsFocusable={true}', function () {
                var view = render({
                    items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }],
                    disabledItemsFocusable: true,
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });
                expect(view.isItemExpanded('1')).to.equal(false);
            });
        });
    });
    describe('Selection', function () {
        describe('single selection', function () {
            describe('key: Space', function () {
                it('should select the focused item when Space is pressed', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: ' ' });
                    expect(view.isItemSelected('1')).to.equal(true);
                });
                it('should un-select the focused item when Space is pressed', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        defaultSelectedItems: ['1'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: ' ' });
                    expect(view.isItemSelected('1')).to.equal(false);
                });
                it('should not select the focused item when Space is pressed and disableSelection={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        disableSelection: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: ' ' });
                    expect(view.isItemSelected('1')).to.equal(false);
                });
                it('should not select the focused item when Space is pressed and the item is disabled', function () {
                    var view = render({
                        items: [{ id: '1', disabled: true }, { id: '2' }],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: ' ' });
                    expect(view.isItemSelected('1')).to.equal(false);
                });
                it('should not select the focused item when Space is pressed and the item is disabled even if disabledItemsFocusable={true}', function () {
                    var view = render({
                        items: [{ id: '1', disabled: true }, { id: '2' }],
                        disabledItemsFocusable: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: ' ' });
                    expect(view.isItemSelected('1')).to.equal(false);
                });
            });
            describe('key: Enter', function () {
                it('should select the focused item when Enter is pressed', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });
                    expect(view.isItemSelected('1')).to.equal(true);
                });
                it('should not un-select the focused item when Enter is pressed', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        defaultSelectedItems: ['1'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });
                    expect(view.isItemSelected('1')).to.equal(true);
                });
                it('should not select the focused item when Enter is pressed and disableSelection={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        disableSelection: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });
                    expect(view.isItemSelected('1')).to.equal(false);
                });
                it('should not select the focused item when Enter is pressed and the item is disabled even if disabledItemsFocusable={true}', function () {
                    var view = render({
                        items: [{ id: '1', disabled: true }, { id: '2' }],
                        disabledItemsFocusable: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });
                    expect(view.isItemSelected('1')).to.equal(false);
                });
            });
        });
        describe('multi selection', function () {
            describe('key: Space', function () {
                it('should select the focused item without un-selecting the other selected items when Space is pressed', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        multiSelect: true,
                        defaultSelectedItems: ['1'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('2').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: ' ' });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
                });
                it('should un-select the focused item when Space is pressed', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        multiSelect: true,
                        defaultSelectedItems: ['1', '2'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: ' ' });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                });
                it('should select the focused item without un-selecting the other selected items when Space is pressed while holding Ctrl', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        multiSelect: true,
                        defaultSelectedItems: ['1'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('2').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: ' ', ctrlKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
                });
                it('should un-select the focused item when Space is pressed while holding Ctrl', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        multiSelect: true,
                        defaultSelectedItems: ['1', '2'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: ' ', ctrlKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                });
                it('should not select the focused item when Space is pressed and disableSelection={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        multiSelect: true,
                        disableSelection: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: ' ' });
                    expect(view.getSelectedTreeItems()).to.deep.equal([]);
                });
                it('should not select the focused item when Space is pressed and the item is disabled', function () {
                    var view = render({
                        items: [{ id: '1', disabled: true }, { id: '2' }],
                        multiSelect: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: ' ' });
                    expect(view.getSelectedTreeItems()).to.deep.equal([]);
                });
                it('should not select the focused item when Space is pressed and the item is disabled even if disabledItemsFocusable={true}', function () {
                    var view = render({
                        items: [{ id: '1', disabled: true }, { id: '2' }],
                        multiSelect: true,
                        disabledItemsFocusable: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: ' ' });
                    expect(view.getSelectedTreeItems()).to.deep.equal([]);
                });
            });
            describe('key: ArrowDown', function () {
                it('should expand the selection range when ArrowDown is pressed while holding Shift from a selected item', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        defaultSelectedItems: ['2'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('2').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'ArrowDown', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2', '3']);
                });
                it('should not un-select the item below the focused item when ArrowDown is pressed while holding Shift from a selected item', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        defaultSelectedItems: ['2', '3'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('2').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'ArrowDown', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2', '3']);
                });
                it('should un-select the focused item when ArrowDown is pressed while holding Shift and the item below have been selected in the same range', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        defaultSelectedItems: ['3'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('3').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), { key: 'ArrowUp', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2', '3']);
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'ArrowDown', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['3']);
                });
                it('should not select any item when ArrowDown is pressed while holding Shift and disabledSelection={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        multiSelect: true,
                        disableSelection: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal([]);
                });
                it('should select the next non-disabled item when ArrowDown is pressed while holding Shift', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
                        multiSelect: true,
                        defaultSelectedItems: ['1'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
                });
                it('should not select the next item when ArrowDown is pressed while holding Shift if the next item is disabled and disabledItemsFocusable={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
                        multiSelect: true,
                        disabledItemsFocusable: true,
                        defaultSelectedItems: ['1'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
                    expect(view.getFocusedItemId()).to.equal('2');
                });
                it('should select the next item when ArrowDown is pressed while holding Shift if the focused item is disabled and disabledItemsFocusable={true}', function () {
                    var view = render({
                        items: [{ id: '1', disabled: true }, { id: '2' }, { id: '3' }],
                        multiSelect: true,
                        disabledItemsFocusable: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'ArrowDown', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                });
            });
            describe('key: ArrowUp', function () {
                it('should expand the selection range when ArrowUp is pressed while holding Shift from a selected item', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        defaultSelectedItems: ['3'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('3').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), { key: 'ArrowUp', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2', '3']);
                });
                it('should not un-select the item above the focused item when ArrowUp is pressed while holding Shift from a selected item', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        defaultSelectedItems: ['2', '3'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('3').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), { key: 'ArrowUp', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2', '3']);
                });
                it('should un-select the focused item when ArrowUp is pressed while holding Shift and the item above have been selected in the same range', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        defaultSelectedItems: ['2'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('2').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'ArrowDown', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2', '3']);
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), { key: 'ArrowUp', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                });
                it('should not select any item when ArrowUp is pressed while holding Shift and disabledSelection={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }],
                        multiSelect: true,
                        disableSelection: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('2').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'ArrowUp', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal([]);
                });
                it('should select the next non-disabled item when ArrowUp is pressed while holding Shift', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
                        multiSelect: true,
                        defaultSelectedItems: ['3'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('3').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), { key: 'ArrowUp', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
                });
                it('should not select the next item when ArrowUp is pressed while holding Shift if the next item is disabled and disabledItemsFocusable={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
                        multiSelect: true,
                        disabledItemsFocusable: true,
                        defaultSelectedItems: ['3'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('3').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), { key: 'ArrowUp', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['3']);
                    expect(view.getFocusedItemId()).to.equal('2');
                });
                it('should select the previous item when ArrowUp is pressed while holding Shift if the focused item is disabled and disabledItemsFocusable={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3', disabled: true }],
                        multiSelect: true,
                        disabledItemsFocusable: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('3').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), { key: 'ArrowUp', shiftKey: true });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                });
            });
            describe('key: Home', function () {
                it('should select the focused item and all the items above when Home is pressed while holding Shift + Ctrl', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2', children: [{ id: '2.1' }] }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        defaultExpandedItems: ['2'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('3').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), {
                        key: 'Home',
                        shiftKey: true,
                        ctrlKey: true,
                    });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2', '2.1', '3']);
                });
                it('should not select any item when Home is pressed while holding Shift + Ctrl and disableSelection={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        disableSelection: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('3').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), {
                        key: 'Home',
                        shiftKey: true,
                        ctrlKey: true,
                    });
                    expect(view.getSelectedTreeItems()).to.deep.equal([]);
                });
                it('should not select disabled items when Home is pressed while holding Shift + Ctrl', function () {
                    var view = render({
                        items: [
                            { id: '1' },
                            { id: '2', disabled: true, children: [{ id: '2.1' }] },
                            { id: '3' },
                            { id: '4' },
                        ],
                        multiSelect: true,
                        defaultExpandedItems: ['2'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('3').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('3'), {
                        key: 'Home',
                        shiftKey: true,
                        ctrlKey: true,
                    });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
                });
            });
            describe('key: End', function () {
                it('should select the focused item and all the items below when End is pressed while holding Shift + Ctrl', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2', children: [{ id: '2.1' }] }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        defaultExpandedItems: ['2'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('2').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), {
                        key: 'End',
                        shiftKey: true,
                        ctrlKey: true,
                    });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2', '2.1', '3', '4']);
                });
                it('should not select any item when End is pressed while holding Shift + Ctrl and disableSelection={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        disableSelection: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('2').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), {
                        key: 'End',
                        shiftKey: true,
                        ctrlKey: true,
                    });
                    expect(view.getSelectedTreeItems()).to.deep.equal([]);
                });
                it('should not select disabled items when End is pressed while holding Shift + Ctrl', function () {
                    var view = render({
                        items: [
                            { id: '1' },
                            { id: '2' },
                            { id: '3', disabled: true, children: [{ id: '3.1' }] },
                            { id: '4' },
                        ],
                        multiSelect: true,
                        defaultExpandedItems: ['2'],
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('2').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), {
                        key: 'End',
                        shiftKey: true,
                        ctrlKey: true,
                    });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['2', '4']);
                });
            });
            describe('key: Ctrl + A', function () {
                it('should select all items when Ctrl + A is pressed', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), {
                        key: 'a',
                        keyCode: 65,
                        ctrlKey: true,
                    });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2', '3', '4']);
                });
                it('should not select any item when Ctrl + A is pressed and disableSelection={true}', function () {
                    var view = render({
                        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                        multiSelect: true,
                        disableSelection: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), {
                        key: 'a',
                        keyCode: 65,
                        ctrlKey: true,
                    });
                    expect(view.getSelectedTreeItems()).to.deep.equal([]);
                });
                it('should not select disabled items when Ctrl + A is pressed', function () {
                    var view = render({
                        items: [
                            { id: '1' },
                            { id: '2', disabled: true, children: [{ id: '2.1' }] },
                            { id: '3' },
                            { id: '4' },
                        ],
                        multiSelect: true,
                    });
                    (0, internal_test_utils_1.act)(function () {
                        view.getItemRoot('1').focus();
                    });
                    internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), {
                        key: 'a',
                        keyCode: 65,
                        ctrlKey: true,
                    });
                    expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3', '4']);
                });
            });
        });
    });
    describe('Type-ahead', function () {
        it('should move the focus to the next item with a name that starts with the typed character', function () {
            var view = render({
                items: [
                    { id: '1', label: 'one' },
                    { id: '2', label: 'two' },
                    { id: '3', label: 'three' },
                    { id: '4', label: 'four' },
                ],
            });
            (0, internal_test_utils_1.act)(function () {
                view.getItemRoot('1').focus();
            });
            expect(view.getFocusedItemId()).to.equal('1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 't' });
            expect(view.getFocusedItemId()).to.equal('2');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'f' });
            expect(view.getFocusedItemId()).to.equal('4');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('4'), { key: 'o' });
            expect(view.getFocusedItemId()).to.equal('1');
        });
        it('should move to the next item in the displayed order when typing the same starting character', function () {
            var view = render({
                items: [{ id: 'A1' }, { id: 'B1' }, { id: 'A2' }, { id: 'B3' }, { id: 'B2' }],
            });
            (0, internal_test_utils_1.act)(function () {
                view.getItemRoot('A1').focus();
            });
            expect(view.getFocusedItemId()).to.equal('A1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('A1'), { key: 'b' });
            expect(view.getFocusedItemId()).to.equal('B1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('B1'), { key: 'b' });
            expect(view.getFocusedItemId()).to.equal('B3');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('B3'), { key: 'b' });
            expect(view.getFocusedItemId()).to.equal('B2');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('B2'), { key: 'b' });
            expect(view.getFocusedItemId()).to.equal('B1');
        });
        it('should work with capitalized label', function () {
            var view = render({
                items: [
                    { id: '1', label: 'One' },
                    { id: '2', label: 'Two' },
                    { id: '3', label: 'Three' },
                    { id: '4', label: 'Four' },
                ],
            });
            (0, internal_test_utils_1.act)(function () {
                view.getItemRoot('1').focus();
            });
            expect(view.getFocusedItemId()).to.equal('1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 't' });
            expect(view.getFocusedItemId()).to.equal('2');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'f' });
            expect(view.getFocusedItemId()).to.equal('4');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('4'), { key: 'o' });
            expect(view.getFocusedItemId()).to.equal('1');
        });
        // Only the SimpleTreeView can have React Element labels.
        it.skipIf(treeViewComponentName !== 'SimpleTreeView')('should work with ReactElement label', function () {
            var view = render({
                items: [
                    { id: '1', label: <span>one</span> },
                    { id: '2', label: <span>two</span> },
                    { id: '3', label: <span>three</span> },
                    { id: '4', label: <span>four</span> },
                ],
            });
            (0, internal_test_utils_1.act)(function () {
                view.getItemRoot('1').focus();
            });
            expect(view.getFocusedItemId()).to.equal('1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 't' });
            expect(view.getFocusedItemId()).to.equal('2');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'f' });
            expect(view.getFocusedItemId()).to.equal('4');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('4'), { key: 'o' });
            expect(view.getFocusedItemId()).to.equal('1');
        });
        it('should work after adding / removing items', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
            });
            (0, internal_test_utils_1.act)(function () {
                view.getItemRoot('1').focus();
            });
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: '4' });
            expect(view.getFocusedItemId()).to.equal('4');
            view.setItems([{ id: '1' }, { id: '2' }, { id: '3' }]);
            expect(view.getFocusedItemId()).to.equal('1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: '2' });
            expect(view.getFocusedItemId()).to.equal('2');
            view.setItems([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }]);
            expect(view.getFocusedItemId()).to.equal('2');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: '4' });
            expect(view.getFocusedItemId()).to.equal('4');
        });
        it('should not move focus when a modifier key and a letter are pressed', function () {
            var view = render({
                items: [
                    { id: '1', label: 'one' },
                    { id: '2', label: 'two' },
                    { id: '3', label: 'three' },
                    { id: '4', label: 'four' },
                ],
            });
            (0, internal_test_utils_1.act)(function () {
                view.getItemRoot('1').focus();
            });
            expect(view.getFocusedItemId()).to.equal('1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 't', ctrlKey: true });
            expect(view.getFocusedItemId()).to.equal('1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 't', metaKey: true });
            expect(view.getFocusedItemId()).to.equal('1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 't', shiftKey: true });
            expect(view.getFocusedItemId()).to.equal('1');
        });
        it('should work on disabled item when disabledItemsFocusable={true}', function () {
            var view = render({
                items: [
                    { id: '1', label: 'one', disabled: true },
                    { id: '2', label: 'two', disabled: true },
                    { id: '3', label: 'three', disabled: true },
                    { id: '4', label: 'four', disabled: true },
                ],
                disabledItemsFocusable: true,
            });
            (0, internal_test_utils_1.act)(function () {
                view.getItemRoot('1').focus();
            });
            expect(view.getFocusedItemId()).to.equal('1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 't' });
            expect(view.getFocusedItemId()).to.equal('2');
        });
        it('should not move focus on disabled item when disabledItemsFocusable={false}', function () {
            var view = render({
                items: [
                    { id: '1', label: 'one', disabled: true },
                    { id: '2', label: 'two', disabled: true },
                    { id: '3', label: 'three', disabled: true },
                    { id: '4', label: 'four', disabled: true },
                ],
                disabledItemsFocusable: false,
            });
            (0, internal_test_utils_1.act)(function () {
                view.getItemRoot('1').focus();
            });
            expect(view.getFocusedItemId()).to.equal('1');
            internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 't' });
            expect(view.getFocusedItemId()).to.equal('1');
        });
    });
    describe('onKeyDown prop', function () {
        it('should call onKeyDown on the Tree View and the Tree Item when a key is pressed', function () {
            var handleTreeViewKeyDown = (0, sinon_1.spy)();
            var handleTreeItemKeyDown = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1' }],
                onKeyDown: handleTreeViewKeyDown,
                slotProps: { item: { onKeyDown: handleTreeItemKeyDown } },
            });
            var itemRoot = view.getItemRoot('1');
            (0, internal_test_utils_1.act)(function () {
                itemRoot.focus();
            });
            internal_test_utils_1.fireEvent.keyDown(itemRoot, { key: 'Enter' });
            internal_test_utils_1.fireEvent.keyDown(itemRoot, { key: 'A' });
            internal_test_utils_1.fireEvent.keyDown(itemRoot, { key: ']' });
            expect(handleTreeViewKeyDown.callCount).to.equal(3);
            expect(handleTreeItemKeyDown.callCount).to.equal(3);
        });
    });
});
