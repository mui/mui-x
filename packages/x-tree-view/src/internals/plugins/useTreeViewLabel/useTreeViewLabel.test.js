"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var describeTreeView_1 = require("test/utils/tree-view/describeTreeView");
(0, describeTreeView_1.describeTreeView)('useTreeViewLabel plugin', function (_a) {
    var render = _a.render, treeViewComponentName = _a.treeViewComponentName;
    var isSimpleTreeView = treeViewComponentName.startsWith('SimpleTreeView');
    describe.skipIf(isSimpleTreeView)('interaction', function () {
        describe('render labelInput when needed', function () {
            // This test is not relevant for the TreeItem component or the SimpleTreeView.
            it('should not render labelInput when double clicked if item is not editable', function () {
                var view = render({
                    items: [{ id: '1', editable: false }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                expect(view.getItemLabelInput('1')).to.equal(null);
            });
            it('should render labelInput when double clicked if item is editable', function () {
                var view = render({
                    items: [{ id: '1', editable: true }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                expect(view.getItemLabelInput('1')).not.to.equal(null);
            });
            it('should not render label when double clicked if item is editable', function () {
                var view = render({
                    items: [{ id: '1', editable: true }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                expect(view.getItemLabel('1')).to.equal(null);
            });
            it('should not render labelInput on Enter if item is not editable', function () {
                var view = render({
                    items: [{ id: '1', editable: false }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });
                expect(view.getItemLabelInput('1')).to.equal(null);
                expect(view.getItemLabel('1')).not.to.equal(null);
            });
            it('should render labelInput on Enter if item is editable', function () {
                var view = render({
                    items: [{ id: '1', editable: true }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });
                expect(view.getItemLabelInput('1')).not.to.equal(null);
            });
            it('should unmount labelInput after save', function () {
                var view = render({
                    items: [{ id: '1', label: 'test', editable: true }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                internal_test_utils_1.fireEvent.keyDown(view.getItemLabelInput('1'), { key: 'Enter' });
                expect(view.getItemLabelInput('1')).to.equal(null);
                expect(view.getItemLabel('1')).not.to.equal(null);
            });
            it('should unmount labelInput after cancel', function () {
                var view = render({
                    items: [{ id: '1', label: 'test', editable: true }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                internal_test_utils_1.fireEvent.keyDown(view.getItemLabelInput('1'), { key: 'Escape' });
                expect(view.getItemLabelInput('1')).to.equal(null);
                expect(view.getItemLabel('1')).not.to.equal(null);
            });
        });
        describe('labelInput value', function () {
            it('should equal label value on first render', function () {
                var view = render({
                    items: [{ id: '1', label: 'test', editable: true }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                expect(view.getItemLabelInput('1').value).to.equal('test');
            });
            it('should save new value on Enter', function () {
                var view = render({
                    items: [{ id: '1', label: 'test', editable: true }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                internal_test_utils_1.fireEvent.change(view.getItemLabelInput('1'), { target: { value: 'new value' } });
                internal_test_utils_1.fireEvent.keyDown(view.getItemLabelInput('1'), { key: 'Enter' });
                expect(view.getItemLabel('1').textContent).to.equal('new value');
            });
            it('should hold new value on render after save', function () {
                var view = render({
                    items: [{ id: '1', label: 'test', editable: true }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                internal_test_utils_1.fireEvent.change(view.getItemLabelInput('1'), { target: { value: 'new value' } });
                internal_test_utils_1.fireEvent.keyDown(view.getItemLabelInput('1'), { key: 'Enter' });
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                expect(view.getItemLabelInput('1').value).to.equal('new value');
            });
            it('should hold initial value on render after cancel', function () {
                var view = render({
                    items: [{ id: '1', label: 'test', editable: true }],
                    isItemEditable: function (item) { return item.editable; },
                });
                (0, internal_test_utils_1.act)(function () {
                    view.getItemRoot('1').focus();
                });
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                internal_test_utils_1.fireEvent.change(view.getItemLabelInput('1'), { target: { value: 'new value' } });
                internal_test_utils_1.fireEvent.keyDown(view.getItemLabelInput('1'), { key: 'Escape' });
                expect(view.getItemLabel('1').textContent).to.equal('test');
                internal_test_utils_1.fireEvent.doubleClick(view.getItemLabel('1'));
                expect(view.getItemLabelInput('1').value).to.equal('test');
            });
        });
    });
    describe.skipIf(isSimpleTreeView)('updateItemLabel public API method', function () {
        it('should change the label value', function () {
            var view = render({
                items: [{ id: '1', label: 'test' }],
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.updateItemLabel('1', 'new value');
            });
            expect(view.getItemLabel('1').textContent).to.equal('new value');
        });
    });
    describe.skipIf(isSimpleTreeView)('setEditedItem public API method', function () {
        it('should enter editing mode via setEditedItem if item is editable', function () {
            var view = render({
                items: [{ id: '1', editable: true }],
                isItemEditable: function (item) { return item.editable; },
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.setEditedItem('1');
            });
            expect(view.getItemLabelInput('1')).not.to.equal(null);
        });
        it('should not enter editing mode via setEditedItem if item is not editable', function () {
            var view = render({
                items: [{ id: '1', editable: false }],
                isItemEditable: function (item) { return item.editable; },
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.setEditedItem('1');
            });
            expect(view.getItemLabelInput('1')).to.equal(null);
        });
        it('should exit editing mode via setEditedItem(null)', function () {
            var view = render({
                items: [{ id: '1', editable: true }],
                isItemEditable: function (item) { return item.editable; },
            });
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.setEditedItem('1');
            });
            expect(view.getItemLabelInput('1')).not.to.equal(null);
            (0, internal_test_utils_1.act)(function () {
                view.apiRef.current.setEditedItem(null);
            });
            expect(view.getItemLabelInput('1')).to.equal(null);
        });
    });
});
