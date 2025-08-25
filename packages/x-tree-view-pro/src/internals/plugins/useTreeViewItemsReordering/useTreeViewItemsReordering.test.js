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
Object.defineProperty(exports, "__esModule", { value: true });
var describeTreeView_1 = require("test/utils/tree-view/describeTreeView");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var dragAndDrop_1 = require("test/utils/dragAndDrop");
var useTreeViewItemsReordering_utils_1 = require("./useTreeViewItemsReordering.utils");
var buildTreeViewDragInteractions = function (dataTransfer) {
    var createFireEvent = function (type) {
        return function (target, options) {
            var _a;
            if (options === void 0) { options = {}; }
            var rect = target.getBoundingClientRect();
            var coordinates = (_a = options.coordinates) !== null && _a !== void 0 ? _a : { x: rect.width / 2, y: rect.height / 2 };
            var createdEvent = internal_test_utils_1.createEvent[type](target, {
                clientX: rect.left + coordinates.x,
                clientY: rect.top + coordinates.y,
            });
            Object.defineProperty(createdEvent, 'dataTransfer', {
                value: dataTransfer,
            });
            return (0, internal_test_utils_1.fireEvent)(target, createdEvent);
        };
    };
    var dragStart = createFireEvent('dragStart');
    var dragEnter = createFireEvent('dragEnter');
    var dragOver = createFireEvent('dragOver');
    var dragEnd = createFireEvent('dragEnd');
    return {
        fullDragSequence: function (draggedItem, targetItem, options) {
            if (options === void 0) { options = {}; }
            dragStart(draggedItem);
            dragEnter(targetItem);
            dragOver(targetItem, { coordinates: options.coordinates });
            if (options.beforeDragEnd) {
                options.beforeDragEnd(dataTransfer);
            }
            dragEnd(draggedItem);
        },
    };
};
(0, describeTreeView_1.describeTreeView)('useTreeViewItemsReordering', function (_a) {
    var render = _a.render, treeViewComponentName = _a.treeViewComponentName;
    describe.skipIf(treeViewComponentName === 'SimpleTreeView' || treeViewComponentName === 'RichTreeView')('reordering', function () {
        var dragEvents;
        beforeEach(function () {
            var dataTransfer = new dragAndDrop_1.MockedDataTransfer();
            dataTransfer.dropEffect = 'move';
            dragEvents = buildTreeViewDragInteractions(dataTransfer);
        });
        afterEach(function () {
            dragEvents = {};
        });
        describe('itemReordering prop', function () {
            it('should allow to drag and drop items when props.itemsReordering={true}', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    itemsReordering: true,
                });
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
                expect(view.getItemIdTree()).to.deep.equal([
                    { id: '2', children: [{ id: '1' }] },
                    { id: '3' },
                ]);
            });
            it('should not allow to drag and drop items when props.itemsReordering={false}', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    itemsReordering: false,
                });
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
                expect(view.getItemIdTree()).to.deep.equal([{ id: '1' }, { id: '2' }, { id: '3' }]);
            });
            it('should not allow to drag and drop items when props.itemsReordering is not defined', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                });
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
                expect(view.getItemIdTree()).to.deep.equal([{ id: '1' }, { id: '2' }, { id: '3' }]);
            });
            it('should allow to expand the new parent of the dragged item when it was not expandable before', function () {
                var view = render({
                    items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
                    itemsReordering: true,
                    defaultExpandedItems: ['1'],
                });
                dragEvents.fullDragSequence(view.getItemRoot('1.1'), view.getItemContent('2'));
                internal_test_utils_1.fireEvent.focus(view.getItemRoot('2'));
                internal_test_utils_1.fireEvent.keyDown(view.getItemRoot('2'), { key: 'Enter' });
                expect(view.getItemIdTree()).to.deep.equal([
                    { id: '1' },
                    { id: '2', children: [{ id: '1.1' }] },
                ]);
            });
        });
        describe('onItemPositionChange prop', function () {
            it('should call onItemPositionChange when an item is moved', function () {
                var onItemPositionChange = (0, sinon_1.spy)();
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    itemsReordering: true,
                    onItemPositionChange: onItemPositionChange,
                });
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
                expect(onItemPositionChange.callCount).to.equal(1);
                expect(onItemPositionChange.lastCall.firstArg).to.deep.equal({
                    itemId: '1',
                    oldPosition: { parentId: null, index: 0 },
                    newPosition: { parentId: '2', index: 0 },
                });
            });
        });
        describe('isItemReorderable prop', function () {
            it('should not allow to drag an item when isItemReorderable returns false', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    itemsReordering: true,
                    isItemReorderable: function () { return false; },
                });
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
                expect(view.getItemIdTree()).to.deep.equal([{ id: '1' }, { id: '2' }, { id: '3' }]);
            });
            it('should allow to drag an item when isItemReorderable returns true', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    itemsReordering: true,
                    isItemReorderable: function () { return true; },
                });
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
                expect(view.getItemIdTree()).to.deep.equal([
                    { id: '2', children: [{ id: '1' }] },
                    { id: '3' },
                ]);
            });
        });
        describe('canMoveItemToNewPosition prop', function () {
            it('should call canMoveItemToNewPosition with the correct parameters', function () {
                var canMoveItemToNewPosition = (0, sinon_1.spy)();
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    itemsReordering: true,
                    canMoveItemToNewPosition: canMoveItemToNewPosition,
                });
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
                expect(canMoveItemToNewPosition.lastCall.firstArg).to.deep.equal({
                    itemId: '1',
                    oldPosition: { parentId: null, index: 0 },
                    newPosition: { parentId: null, index: 1 },
                });
            });
            it('should not allow to drop an item when canMoveItemToNewPosition returns false', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    itemsReordering: true,
                    canMoveItemToNewPosition: function () { return false; },
                });
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
                expect(view.getItemIdTree()).to.deep.equal([{ id: '1' }, { id: '2' }, { id: '3' }]);
            });
            it('should allow to drop an item when canMoveItemToNewPosition returns true', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    itemsReordering: true,
                    canMoveItemToNewPosition: function () { return true; },
                });
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
                expect(view.getItemIdTree()).to.deep.equal([
                    { id: '2', children: [{ id: '1' }] },
                    { id: '3' },
                ]);
            });
        });
        describe('dragend behavior', function () {
            it('should reset the drag-and-drop state when Escape is pressed', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    itemsReordering: true,
                });
                // Simulate the drag-and-drop sequence with Escape (dropEffect is "none")
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'), {
                    beforeDragEnd: function (dataTransfer) {
                        dataTransfer.dropEffect = 'none';
                    },
                });
                expect(view.getItemIdTree()).to.deep.equal([{ id: '1' }, { id: '2' }, { id: '3' }]);
            });
            it('should not reset the drag-and-drop state when the item is dropped successfully', function () {
                var view = render({
                    items: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    itemsReordering: true,
                });
                // Set dropEffect to "move" to simulate a successful drop
                dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'), {
                    beforeDragEnd: function (dataTransfer) {
                        dataTransfer.dropEffect = 'move';
                    },
                });
                expect(view.getItemIdTree()).to.deep.equal([
                    { id: '2', children: [{ id: '1' }] },
                    { id: '3' },
                ]);
            });
        });
    });
});
describe('getNewPosition util', function () {
    // The actions use the following tree when dropping "1.1" on "1.2":
    // - 1
    //   - 1.1
    //   - 1.2
    //   - 1.3
    // - 2
    var ALL_ACTIONS = {
        'reorder-above': { parentId: '1', index: 0 },
        'reorder-below': { parentId: '1', index: 1 },
        'make-child': { parentId: '1.2', index: 0 },
        'move-to-parent': { parentId: null, index: 2 },
    };
    var FAKE_CONTENT_ELEMENT = {};
    var COMMON_PROPERTIES = {
        itemChildrenIndentation: 12,
        validActions: ALL_ACTIONS,
        targetHeight: 100,
        targetDepth: 1,
        cursorY: 50,
        cursorX: 100,
        contentElement: FAKE_CONTENT_ELEMENT,
    };
    it('should choose the "reorder-above" action when the cursor is in the top quarter of the target item', function () {
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 1 }))).to.equal('reorder-above');
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 24 }))).to.equal('reorder-above');
    });
    it('should choose the "reorder-above" action when the cursor is in the top half of the target item and the "make-child" action is not valid', function () {
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 25, validActions: __assign(__assign({}, ALL_ACTIONS), { 'make-child': undefined }) }))).to.equal('reorder-above');
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 49, validActions: __assign(__assign({}, ALL_ACTIONS), { 'make-child': undefined }) }))).to.equal('reorder-above');
    });
    it('should choose the "reorder-below" action when the cursor is in the bottom quarter of the target item', function () {
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 99 }))).to.equal('reorder-below');
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 76 }))).to.equal('reorder-below');
    });
    it('should choose the "reorder-below" action when the cursor is in the bottom half of the target item and the "make-child" action is not valid', function () {
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 75, validActions: __assign(__assign({}, ALL_ACTIONS), { 'make-child': undefined }) }))).to.equal('reorder-below');
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 51, validActions: __assign(__assign({}, ALL_ACTIONS), { 'make-child': undefined }) }))).to.equal('reorder-below');
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 50, validActions: __assign(__assign({}, ALL_ACTIONS), { 'make-child': undefined }) }))).to.equal('reorder-below');
    });
    it('should choose the "make-child" action when the cursor is in the middle of the target item', function () {
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 25 }))).to.equal('make-child');
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 50 }))).to.equal('make-child');
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorY: 74 }))).to.equal('make-child');
    });
    it('should choose the "move-to-parent" action when the cursor is inside the depth-offset of the target item', function () {
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorX: 1, cursorY: 1 }))).to.equal('move-to-parent');
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorX: 11, cursorY: 1 }))).to.equal('move-to-parent');
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorX: 1, cursorY: 50 }))).to.equal('move-to-parent');
        expect((0, useTreeViewItemsReordering_utils_1.chooseActionToApply)(__assign(__assign({}, COMMON_PROPERTIES), { cursorX: 1, cursorY: 99 }))).to.equal('move-to-parent');
    });
});
