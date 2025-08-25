"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var describeTreeView_1 = require("test/utils/tree-view/describeTreeView");
(0, describeTreeView_1.describeTreeView)('TreeViewStyleContext component', function (_a) {
    var render = _a.render;
    describe('slots (expandIcon, collapseIcon, endIcon, icon)', function () {
        var getIconTestId = function (view, itemId) { var _a; return (_a = view.getItemIconContainer(itemId).querySelector("div")) === null || _a === void 0 ? void 0 : _a.dataset.testid; };
        it('should render the expandIcon slot defined on the tree if no icon slot is defined on the item and the item is collapsed', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                slots: {
                    expandIcon: function () { return <div data-testid="treeExpandIcon"/>; },
                    collapseIcon: function () { return <div data-testid="treeCollapseIcon"/>; },
                    endIcon: function () { return <div data-testid="treeEndIcon"/>; },
                },
            });
            expect(getIconTestId(view, '1')).to.equal('treeExpandIcon');
        });
        it('should render the collapseIcon slot defined on the tree if no icon is defined on the item and the item is expanded', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                slots: {
                    expandIcon: function () { return <div data-testid="treeExpandIcon"/>; },
                    collapseIcon: function () { return <div data-testid="treeCollapseIcon"/>; },
                    endIcon: function () { return <div data-testid="treeEndIcon"/>; },
                },
                defaultExpandedItems: ['1'],
            });
            expect(getIconTestId(view, '1')).to.equal('treeCollapseIcon');
        });
        it('should render the endIcon slot defined on the tree if no icon is defined on the item and the item has no children', function () {
            var view = render({
                items: [{ id: '1' }],
                slots: {
                    expandIcon: function () { return <div data-testid="treeExpandIcon"/>; },
                    collapseIcon: function () { return <div data-testid="treeCollapseIcon"/>; },
                    endIcon: function () { return <div data-testid="treeEndIcon"/>; },
                },
            });
            expect(getIconTestId(view, '1')).to.equal('treeEndIcon');
        });
        it('should render the expandIcon slot defined on the item if the item is collapsed', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                slots: {
                    expandIcon: function () { return <div data-testid="treeExpandIcon"/>; },
                    collapseIcon: function () { return <div data-testid="treeCollapseIcon"/>; },
                    endIcon: function () { return <div data-testid="treeEndIcon"/>; },
                },
                slotProps: {
                    item: {
                        slots: {
                            expandIcon: function () { return <div data-testid="itemExpandIcon"/>; },
                            collapseIcon: function () { return <div data-testid="itemCollapseIcon"/>; },
                            endIcon: function () { return <div data-testid="itemEndIcon"/>; },
                        },
                    },
                },
            });
            expect(getIconTestId(view, '1')).to.equal('itemExpandIcon');
        });
        it('should render the collapseIcon slot defined on the item if the item is expanded', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                slots: {
                    expandIcon: function () { return <div data-testid="treeExpandIcon"/>; },
                    collapseIcon: function () { return <div data-testid="treeCollapseIcon"/>; },
                    endIcon: function () { return <div data-testid="treeEndIcon"/>; },
                },
                slotProps: {
                    item: {
                        slots: {
                            expandIcon: function () { return <div data-testid="itemExpandIcon"/>; },
                            collapseIcon: function () { return <div data-testid="itemCollapseIcon"/>; },
                            endIcon: function () { return <div data-testid="itemEndIcon"/>; },
                        },
                    },
                },
                defaultExpandedItems: ['1'],
            });
            expect(getIconTestId(view, '1')).to.equal('itemCollapseIcon');
        });
        it('should render the endIcon slot defined on the tree if the item has no children', function () {
            var view = render({
                items: [{ id: '1' }],
                slots: {
                    expandIcon: function () { return <div data-testid="treeExpandIcon"/>; },
                    collapseIcon: function () { return <div data-testid="treeCollapseIcon"/>; },
                    endIcon: function () { return <div data-testid="treeEndIcon"/>; },
                },
                slotProps: {
                    item: {
                        slots: {
                            expandIcon: function () { return <div data-testid="itemExpandIcon"/>; },
                            collapseIcon: function () { return <div data-testid="itemCollapseIcon"/>; },
                            endIcon: function () { return <div data-testid="itemEndIcon"/>; },
                        },
                    },
                },
            });
            expect(getIconTestId(view, '1')).to.equal('itemEndIcon');
        });
        it('should render the icon slot defined on the item if the item is collapsed', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                slots: {
                    expandIcon: function () { return <div data-testid="treeExpandIcon"/>; },
                    collapseIcon: function () { return <div data-testid="treeCollapseIcon"/>; },
                    endIcon: function () { return <div data-testid="treeEndIcon"/>; },
                },
                slotProps: {
                    item: {
                        slots: {
                            expandIcon: function () { return <div data-testid="itemExpandIcon"/>; },
                            collapseIcon: function () { return <div data-testid="itemCollapseIcon"/>; },
                            endIcon: function () { return <div data-testid="itemEndIcon"/>; },
                            icon: function () { return <div data-testid="itemIcon"/>; },
                        },
                    },
                },
            });
            expect(getIconTestId(view, '1')).to.equal('itemIcon');
        });
        it('should render the icon slot defined on the item if the item is expanded', function () {
            var view = render({
                items: [{ id: '1', children: [{ id: '1.1' }] }],
                slots: {
                    expandIcon: function () { return <div data-testid="treeExpandIcon"/>; },
                    collapseIcon: function () { return <div data-testid="treeCollapseIcon"/>; },
                    endIcon: function () { return <div data-testid="treeEndIcon"/>; },
                },
                slotProps: {
                    item: {
                        slots: {
                            expandIcon: function () { return <div data-testid="itemExpandIcon"/>; },
                            collapseIcon: function () { return <div data-testid="itemCollapseIcon"/>; },
                            endIcon: function () { return <div data-testid="itemEndIcon"/>; },
                            icon: function () { return <div data-testid="itemIcon"/>; },
                        },
                    },
                },
                defaultExpandedItems: ['1'],
            });
            expect(getIconTestId(view, '1')).to.equal('itemIcon');
        });
        it('should render the icon slot defined on the item if the item has no children', function () {
            var view = render({
                items: [{ id: '1' }],
                slots: {
                    expandIcon: function () { return <div data-testid="treeExpandIcon"/>; },
                    collapseIcon: function () { return <div data-testid="treeCollapseIcon"/>; },
                    endIcon: function () { return <div data-testid="treeEndIcon"/>; },
                },
                slotProps: {
                    item: {
                        slots: {
                            expandIcon: function () { return <div data-testid="itemExpandIcon"/>; },
                            collapseIcon: function () { return <div data-testid="itemCollapseIcon"/>; },
                            endIcon: function () { return <div data-testid="itemEndIcon"/>; },
                            icon: function () { return <div data-testid="itemIcon"/>; },
                        },
                    },
                },
            });
            expect(getIconTestId(view, '1')).to.equal('itemIcon');
        });
    });
});
