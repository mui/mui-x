"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var describeTreeView_1 = require("test/utils/tree-view/describeTreeView");
var warning_1 = require("@mui/x-internals/warning");
/**
 * All tests related to keyboard navigation (e.g.: selection using "Space")
 * are located in the `useTreeViewKeyboardNavigation.test.tsx` file.
 */
(0, describeTreeView_1.describeTreeView)('useTreeViewSelection plugin', function (_a) {
    var render = _a.render;
    describe('model props (selectedItems, defaultSelectedItems, onSelectedItemsChange)', function () {
        beforeEach(function () {
            (0, warning_1.clearWarningsCache)();
        });
        it('should not select items when no default state and no control state are defined', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
            });
            expect(view.isItemSelected('1')).to.equal(false);
        });
        it('should use the default state when defined', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
                defaultSelectedItems: ['1'],
            });
            expect(view.isItemSelected('1')).to.equal(true);
        });
        it('should use the controlled state when defined', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
                selectedItems: ['1'],
            });
            expect(view.isItemSelected('1')).to.equal(true);
        });
        it('should use the controlled state instead of the default state when both are defined', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
                selectedItems: ['1'],
                defaultSelectedItems: ['2'],
            });
            expect(view.isItemSelected('1')).to.equal(true);
        });
        it('should react to controlled state update', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
                selectedItems: [],
            });
            view.setProps({ selectedItems: ['1'] });
            expect(view.isItemSelected('1')).to.equal(true);
        });
        it('should call the onSelectedItemsChange callback when the model is updated (single selection and add selected item)', function () {
            var onSelectedItemsChange = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
                onSelectedItemsChange: onSelectedItemsChange,
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(onSelectedItemsChange.callCount).to.equal(1);
            expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal('1');
        });
        // TODO: Re-enable this test if we have a way to un-select an item in single selection.
        it.skip('should call onSelectedItemsChange callback when the model is updated (single selection and remove selected item', function () {
            var onSelectedItemsChange = (0, sinon_1.spy)();
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
                onSelectedItemsChange: onSelectedItemsChange,
                defaultSelectedItems: ['1'],
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(onSelectedItemsChange.callCount).to.equal(1);
            expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal([]);
        });
        it('should call the onSelectedItemsChange callback when the model is updated (multi selection and add selected item to empty list)', function () {
            var onSelectedItemsChange = (0, sinon_1.spy)();
            var view = render({
                multiSelect: true,
                items: [{ id: '1' }, { id: '2' }],
                onSelectedItemsChange: onSelectedItemsChange,
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(onSelectedItemsChange.callCount).to.equal(1);
            expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal(['1']);
        });
        it('should call the onSelectedItemsChange callback when the model is updated (multi selection and add selected item to non-empty list)', function () {
            var onSelectedItemsChange = (0, sinon_1.spy)();
            var view = render({
                multiSelect: true,
                items: [{ id: '1' }, { id: '2' }],
                onSelectedItemsChange: onSelectedItemsChange,
                defaultSelectedItems: ['1'],
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('2'), { ctrlKey: true });
            expect(onSelectedItemsChange.callCount).to.equal(1);
            expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal(['2', '1']);
        });
        it('should call the onSelectedItemsChange callback when the model is updated (multi selection and remove selected item)', function () {
            var onSelectedItemsChange = (0, sinon_1.spy)();
            var view = render({
                multiSelect: true,
                items: [{ id: '1' }, { id: '2' }],
                onSelectedItemsChange: onSelectedItemsChange,
                defaultSelectedItems: ['1'],
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'), { ctrlKey: true });
            expect(onSelectedItemsChange.callCount).to.equal(1);
            expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal([]);
        });
        it('should warn when switching from controlled to uncontrolled', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
                selectedItems: [],
            });
            expect(function () {
                view.setProps({ selectedItems: undefined });
            }).toErrorDev('MUI X: A component is changing the controlled selectedItems state of Tree View to be uncontrolled.');
        });
        it('should warn and not react to update when updating the default state', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
                defaultSelectedItems: ['1'],
            });
            expect(function () {
                view.setProps({ defaultSelectedItems: ['2'] });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
            }).toErrorDev('MUI X: A component is changing the default selectedItems state of an uncontrolled Tree View after being initialized. To suppress this warning opt to use a controlled Tree View.');
        });
    });
    describe('item click interaction', function () {
        describe('single selection', function () {
            it('should select un-selected item when clicking on an item content', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.isItemSelected('1')).to.equal(true);
            });
            it('should not un-select selected item when clicking on an item content', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: '1',
                });
                expect(view.isItemSelected('1')).to.equal(true);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.isItemSelected('1')).to.equal(true);
            });
            it('should not select an item when click and disableSelection', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    disableSelection: true,
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should not select an item when clicking on a disabled item content', function () {
                var view = render({
                    items: [{ id: '1', disabled: true }, { id: '2' }],
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
        });
        describe('multi selection', function () {
            it('should select un-selected item and remove other selected items when clicking on an item content', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['2'],
                });
                expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
            });
            it('should not un-select selected item when clicking on an item content', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['1'],
                });
                expect(view.isItemSelected('1')).to.equal(true);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.isItemSelected('1')).to.equal(true);
            });
            it('should un-select selected item when clicking on its content while holding Ctrl', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['1', '2'],
                });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'), { ctrlKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
            });
            it('should un-select selected item when clicking on its content while holding Meta', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['1', '2'],
                });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'), { metaKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
            });
            it('should not select an item when click and disableSelection', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }],
                    disableSelection: true,
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should not select an item when clicking on a disabled item content', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1', disabled: true }, { id: '2' }],
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should select un-selected item when clicking on its content while holding Ctrl', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    defaultSelectedItems: ['1'],
                });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('3'), { ctrlKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
            });
            it('should do nothing when clicking on an item content on a fresh tree whil holding Shift', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
                });
                internal_test_utils_1.fireEvent.click(view.getItemContent('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal([]);
            });
            it('should expand the selection range when clicking on an item content below the last selected item while holding Shift', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
                });
                internal_test_utils_1.fireEvent.click(view.getItemContent('2'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['2', '2.1', '3']);
            });
            it('should expand the selection range when clicking on an item content above the last selected item while holding Shift', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
                });
                internal_test_utils_1.fireEvent.click(view.getItemContent('3'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['3']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('2'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['2', '2.1', '3']);
            });
            it('should expand the selection range when clicking on an item content while holding Shift after un-selecting another item', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
                });
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('2'), { ctrlKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('2'), { ctrlKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2', '2.1', '3']);
            });
            it('should not expand the selection range when clicking on a disabled item content then clicking on an item content while holding Shift', function () {
                var view = render({
                    multiSelect: true,
                    items: [
                        { id: '1' },
                        { id: '2', disabled: true },
                        { id: '2.1' },
                        { id: '3' },
                        { id: '4' },
                    ],
                });
                internal_test_utils_1.fireEvent.click(view.getItemContent('2'));
                expect(view.getSelectedTreeItems()).to.deep.equal([]);
                internal_test_utils_1.fireEvent.click(view.getItemContent('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal([]);
            });
            it('should not expand the selection range when clicking on an item content then clicking a disabled item content while holding Shift', function () {
                var view = render({
                    multiSelect: true,
                    items: [
                        { id: '1' },
                        { id: '2' },
                        { id: '2.1' },
                        { id: '3', disabled: true },
                        { id: '4' },
                    ],
                });
                internal_test_utils_1.fireEvent.click(view.getItemContent('2'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
            });
            it('should not select disabled items that are part of the selected range', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
                });
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
                internal_test_utils_1.fireEvent.click(view.getItemContent('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
            });
            it('should not crash when selecting multiple items in a deeply nested tree', function () {
                var view = render({
                    multiSelect: true,
                    items: [
                        { id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] },
                        { id: '2' },
                    ],
                    defaultExpandedItems: ['1', '1.1'],
                });
                internal_test_utils_1.fireEvent.click(view.getItemContent('1.1.1'));
                internal_test_utils_1.fireEvent.click(view.getItemContent('2'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1.1.1', '2']);
            });
        });
    });
    describe('checkbox interaction', function () {
        describe('render checkbox when needed', function () {
            it('should not render a checkbox when checkboxSelection is not defined', function () {
                var view = render({
                    items: [{ id: '1' }],
                });
                expect(view.getItemCheckbox('1')).to.equal(null);
            });
            it('should not render a checkbox when checkboxSelection is false', function () {
                var view = render({
                    checkboxSelection: false,
                    items: [{ id: '1' }],
                });
                expect(view.getItemCheckbox('1')).to.equal(null);
            });
            it('should render a checkbox when checkboxSelection is true', function () {
                var view = render({
                    checkboxSelection: true,
                    items: [{ id: '1' }],
                });
                expect(view.getItemCheckbox('1')).not.to.equal(null);
            });
        });
        describe('single selection', function () {
            it('should not change selection when clicking on an item content', function () {
                var view = render({
                    checkboxSelection: true,
                    items: [{ id: '1' }],
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should select un-selected item when clicking on an item checkbox', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    checkboxSelection: true,
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.isItemSelected('1')).to.equal(true);
            });
            it('should un-select selected item when clicking on an item checkbox', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: '1',
                    checkboxSelection: true,
                });
                expect(view.isItemSelected('1')).to.equal(true);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should not select an item when click and disableSelection', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    disableSelection: true,
                    checkboxSelection: true,
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should not select an item when clicking on a disabled item checkbox', function () {
                var view = render({
                    items: [{ id: '1', disabled: true }, { id: '2' }],
                    checkboxSelection: true,
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
        });
        describe('multi selection', function () {
            it('should not change selection when clicking on an item content', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1' }],
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should select un-selected item and keep other items selected when clicking on an item checkbox', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['2'],
                });
                expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
            });
            it('should un-select selected item when clicking on an item checkbox', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['1'],
                });
                expect(view.isItemSelected('1')).to.equal(true);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should not select an item when click and disableSelection', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1' }, { id: '2' }],
                    disableSelection: true,
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should not select an item when clicking on a disabled item content', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1', disabled: true }, { id: '2' }],
                });
                expect(view.isItemSelected('1')).to.equal(false);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should expand the selection range when clicking on an item checkbox below the last selected item while holding Shift', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('2'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['2', '2.1', '3']);
            });
            it('should expand the selection range when clicking on an item checkbox above the last selected item while holding Shift', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('3'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['3']);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('2'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['2', '2.1', '3']);
            });
            it('should expand the selection range when clicking on an item checkbox while holding Shift after un-selecting another item', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('2'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('2'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2', '2.1', '3']);
            });
            it('should not expand the selection range when clicking on a disabled item checkbox then clicking on an item checkbox while holding Shift', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [
                        { id: '1' },
                        { id: '2', disabled: true },
                        { id: '2.1' },
                        { id: '3' },
                        { id: '4' },
                    ],
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('2'));
                expect(view.getSelectedTreeItems()).to.deep.equal([]);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal([]);
            });
            it('should not expand the selection range when clicking on an item checkbox then clicking a disabled item checkbox while holding Shift', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [
                        { id: '1' },
                        { id: '2' },
                        { id: '2.1' },
                        { id: '3', disabled: true },
                        { id: '4' },
                    ],
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('2'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
            });
            it('should not select disabled items that are part of the selected range', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('3'), { shiftKey: true });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
            });
            it('should not select the parent when selecting all the children', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }, { id: '2' }],
                    defaultSelectedItems: ['1.2'],
                    defaultExpandedItems: ['1'],
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1.1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1.1', '1.2']);
            });
            it('should set the parent checkbox as indeterminate when some children are selected but the parent is not', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }, { id: '2' }],
                    defaultSelectedItems: ['1.1'],
                    defaultExpandedItems: ['1'],
                });
                expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');
            });
            it('should keep the parent checkbox indeterminate after collapsing it and expanding another node', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [
                        { id: '1', children: [{ id: '1.1' }, { id: '1.2' }] },
                        { id: '2', children: [{ id: '2.1' }] },
                    ],
                    defaultSelectedItems: ['1.1'],
                    defaultExpandedItems: ['1'],
                });
                expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                internal_test_utils_1.fireEvent.click(view.getItemContent('2'));
                expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');
            });
            it('should keep parent indeterminate (3 levels) after collapsing the parent and expanding a sibling node', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [
                        {
                            id: '1',
                            children: [
                                { id: '1.1', children: [{ id: '1.1.1' }, { id: '1.1.2' }] },
                                { id: '1.2' },
                            ],
                        },
                        { id: '2', children: [{ id: '2.1' }] },
                    ],
                    defaultSelectedItems: ['1.1.1'],
                    defaultExpandedItems: ['1', '1.1'],
                });
                expect(view.getItemCheckboxInput('1.1').dataset.indeterminate).to.equal('true');
                expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');
                internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
                internal_test_utils_1.fireEvent.click(view.getItemContent('2'));
                expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');
            });
            it('should not set the parent checkbox as indeterminate when no child is selected and the parent is not either', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }, { id: '2' }],
                    defaultExpandedItems: ['1'],
                });
                expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('false');
            });
            it('should update the intermediate state of the parent when selecting a child', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1' }, { id: '2', children: [{ id: '2.1' }, { id: '2.2' }] }],
                    defaultExpandedItems: ['2'],
                });
                expect(view.getItemCheckboxInput('2').dataset.indeterminate).to.equal('false');
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('2.1'));
                expect(view.getItemCheckboxInput('2').dataset.indeterminate).to.equal('true');
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('2.1'));
                expect(view.getItemCheckboxInput('2').dataset.indeterminate).to.equal('false');
            });
        });
        describe('multi selection with selectionPropagation.descendants = true', function () {
            it('should select all the children when selecting a parent', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
                    defaultExpandedItems: ['1'],
                    selectionPropagation: { descendants: true },
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '1.1', '1.2']);
            });
            it('should deselect all the children when deselecting a parent', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
                    defaultSelectedItems: ['1', '1.1', '1.2'],
                    defaultExpandedItems: ['1'],
                    selectionPropagation: { descendants: true },
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1'));
                expect(view.getSelectedTreeItems()).to.deep.equal([]);
            });
            it('should not select the parent when selecting all the children', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
                    defaultSelectedItems: ['1.2'],
                    defaultExpandedItems: ['1'],
                    selectionPropagation: { descendants: true },
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1.1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1.1', '1.2']);
            });
            it('should not unselect the parent when unselecting a children', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
                    defaultSelectedItems: ['1', '1.1', '1.2'],
                    defaultExpandedItems: ['1'],
                    selectionPropagation: { descendants: true },
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1.1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '1.2']);
            });
        });
        describe('multi selection with selectionPropagation.parents = true', function () {
            it('should select all the parents when selecting a child', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] }],
                    defaultExpandedItems: ['1', '1.1'],
                    selectionPropagation: { parents: true },
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1.1.1'));
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '1.1', '1.1.1']);
            });
            it('should deselect all the parents when deselecting a child ', function () {
                var view = render({
                    multiSelect: true,
                    checkboxSelection: true,
                    items: [{ id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] }],
                    defaultSelectedItems: ['1', '1.1', '1.1.1'],
                    defaultExpandedItems: ['1', '1.1'],
                    selectionPropagation: { parents: true },
                });
                internal_test_utils_1.fireEvent.click(view.getItemCheckboxInput('1.1.1'));
                expect(view.getSelectedTreeItems()).to.deep.equal([]);
            });
        });
    });
    describe('aria-multiselectable tree attribute', function () {
        it('should have the attribute `aria-multiselectable=false if using single select`', function () {
            var view = render({
                items: [{ id: '1' }, { id: '2' }],
            });
            expect(view.getRoot()).to.have.attribute('aria-multiselectable', 'false');
        });
        it('should have the attribute `aria-multiselectable=true if using multi select`', function () {
            var view = render({ items: [{ id: '1' }, { id: '2' }], multiSelect: true });
            expect(view.getRoot()).to.have.attribute('aria-multiselectable', 'true');
        });
    });
    // The `aria-selected` attribute is used by the `view.isItemSelected` method.
    // This `describe` only tests basics scenarios, more complex scenarios are tested in this file's other `describe`.
    describe('aria-selected item attribute', function () {
        describe('single selection', function () {
            it('should have the attribute `aria-selected=false` if not selected', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                });
                expect(view.getItemRoot('1')).to.have.attribute('aria-selected', 'false');
            });
            it('should have the attribute `aria-selected=true` if selected', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: '1',
                });
                expect(view.getItemRoot('1')).to.have.attribute('aria-selected', 'true');
            });
        });
        describe('multi selection', function () {
            it('should have the attribute `aria-selected=false` if not selected', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }],
                });
                expect(view.getItemRoot('1')).to.have.attribute('aria-selected', 'false');
            });
            it('should have the attribute `aria-selected=true` if selected', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['1'],
                });
                expect(view.getItemRoot('1')).to.have.attribute('aria-selected', 'true');
            });
            it('should not have the attribute `aria-selected=false` if disabledSelection is true', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1' }, { id: '2' }],
                    disableSelection: true,
                });
                expect(view.getItemRoot('1')).not.to.have.attribute('aria-selected');
            });
            it('should not have the attribute `aria-selected=false` if the item is disabled', function () {
                var view = render({
                    multiSelect: true,
                    items: [{ id: '1', disabled: true }, { id: '2' }],
                });
                expect(view.getItemRoot('1')).not.to.have.attribute('aria-selected');
            });
        });
    });
    describe('onItemSelectionToggle prop', function () {
        it('should call the onItemSelectionToggle callback when selecting an item', function () {
            var onItemSelectionToggle = (0, sinon_1.spy)();
            var view = render({
                multiSelect: true,
                items: [{ id: '1' }, { id: '2' }],
                onItemSelectionToggle: onItemSelectionToggle,
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'));
            expect(onItemSelectionToggle.callCount).to.equal(1);
            expect(onItemSelectionToggle.lastCall.args[1]).to.equal('1');
            expect(onItemSelectionToggle.lastCall.args[2]).to.equal(true);
        });
        it('should call the onItemSelectionToggle callback when un-selecting an item', function () {
            var onItemSelectionToggle = (0, sinon_1.spy)();
            var view = render({
                multiSelect: true,
                items: [{ id: '1' }, { id: '2' }],
                defaultSelectedItems: ['1'],
                onItemSelectionToggle: onItemSelectionToggle,
            });
            internal_test_utils_1.fireEvent.click(view.getItemContent('1'), { ctrlKey: true });
            expect(onItemSelectionToggle.callCount).to.equal(1);
            expect(onItemSelectionToggle.lastCall.args[1]).to.equal('1');
            expect(onItemSelectionToggle.lastCall.args[2]).to.equal(false);
        });
    });
    describe('setItemSelection() api method', function () {
        describe('single selection', function () {
            it('should select un-selected item when shouldBeSelected is not defined', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setItemSelection({ itemId: '1', event: {} });
                });
                expect(view.isItemSelected('1')).to.equal(true);
            });
            it('should un-select selected item when shouldBeSelected is not defined', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['1'],
                });
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setItemSelection({ itemId: '1', event: {} });
                });
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should not select an item when disableSelection is true', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    disableSelection: true,
                });
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setItemSelection({ itemId: '1', event: {} });
                });
                expect(view.isItemSelected('1')).to.equal(false);
            });
            it('should not un-select an item when disableSelection is true', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['1'],
                    disableSelection: true,
                });
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setItemSelection({ itemId: '1', event: {} });
                });
                expect(view.isItemSelected('1')).to.equal(true);
            });
        });
        describe('multi selection', function () {
            it('should select un-selected item and remove other selected items when shouldBeSelected is not defined', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['2'],
                    multiSelect: true,
                });
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setItemSelection({ itemId: '1', event: {} });
                });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
            });
            it('should select un-selected item and keep other selected items when shouldBeSelected is not defined and keepExistingSelection is true', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    defaultSelectedItems: ['2'],
                    multiSelect: true,
                });
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setItemSelection({
                        itemId: '1',
                        event: {},
                        keepExistingSelection: true,
                    });
                });
                expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
            });
        });
        describe('onItemSelectionToggle prop', function () {
            it('should call call onItemSelectionToggle callback when selecting an item', function () {
                var event = {};
                var onItemSelectionToggle = (0, sinon_1.spy)();
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    onItemSelectionToggle: onItemSelectionToggle,
                });
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setItemSelection({ itemId: '1', event: event });
                });
                expect(onItemSelectionToggle.callCount).to.equal(1);
                expect(onItemSelectionToggle.lastCall.args[0]).to.equal(event);
                expect(onItemSelectionToggle.lastCall.args[1]).to.equal('1');
                expect(onItemSelectionToggle.lastCall.args[2]).to.equal(true);
            });
            it('should call call onItemSelectionToggle callback when un-selecting an item', function () {
                var event = {};
                var onItemSelectionToggle = (0, sinon_1.spy)();
                var view = render({
                    items: [{ id: '1' }, { id: '2' }],
                    onItemSelectionToggle: onItemSelectionToggle,
                    defaultSelectedItems: '1',
                });
                (0, internal_test_utils_1.act)(function () {
                    view.apiRef.current.setItemSelection({ itemId: '1', event: event });
                });
                expect(onItemSelectionToggle.callCount).to.equal(1);
                expect(onItemSelectionToggle.lastCall.args[0]).to.equal(event);
                expect(onItemSelectionToggle.lastCall.args[1]).to.equal('1');
                expect(onItemSelectionToggle.lastCall.args[2]).to.equal(false);
            });
        });
    });
});
