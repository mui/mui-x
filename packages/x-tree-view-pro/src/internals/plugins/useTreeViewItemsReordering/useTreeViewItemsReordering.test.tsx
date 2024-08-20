import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, createEvent } from '@mui/internal-test-utils';
import { UseTreeViewItemsReorderingSignature } from '@mui/x-tree-view-pro/internals';
import { DragEventTypes, MockedDataTransfer } from 'test/utils/dragAndDrop';
import {
  UseTreeViewExpansionSignature,
  UseTreeViewItemsSignature,
} from '@mui/x-tree-view/internals';
import { chooseActionToApply } from './useTreeViewItemsReordering.utils';
import { TreeViewItemItemReorderingValidActions } from './useTreeViewItemsReordering.types';

interface DragEventOptions {
  /**
   * Coordinates of the mouse pointer relative to the target element.
   * @default: { x: targetWidth / 2, y: targetHeight / 2 }
   */
  coordinates?: { x: number; y: number };
}

const buildTreeViewDragInteractions = (dataTransfer: DataTransfer) => {
  const createFireEvent =
    (type: DragEventTypes) =>
    (target: HTMLElement, options: DragEventOptions = {}) => {
      const rect = target.getBoundingClientRect();
      const coordinates = options.coordinates ?? { x: rect.width / 2, y: rect.height / 2 };
      const createdEvent = createEvent[type](target, {
        clientX: rect.left + coordinates.x,
        clientY: rect.top + coordinates.y,
      });
      Object.defineProperty(createdEvent, 'dataTransfer', {
        value: dataTransfer,
      });

      return fireEvent(target, createdEvent);
    };

  const dragStart = createFireEvent('dragStart');
  const dragEnter = createFireEvent('dragEnter');
  const dragOver = createFireEvent('dragOver');
  const dragEnd = createFireEvent('dragEnd');

  return {
    fullDragSequence: (
      draggedItem: HTMLElement,
      targetItem: HTMLElement,
      options: DragEventOptions = {},
    ) => {
      dragStart(draggedItem);
      dragEnter(targetItem);
      dragOver(targetItem, { coordinates: options.coordinates });
      dragEnd(draggedItem);
    },
  };
};

describeTreeView<
  [UseTreeViewItemsReorderingSignature, UseTreeViewItemsSignature, UseTreeViewExpansionSignature]
>('useTreeViewItemsReordering', ({ render, treeViewComponentName }) => {
  if (treeViewComponentName === 'SimpleTreeView' || treeViewComponentName === 'RichTreeView') {
    return;
  }

  let dragEvents: ReturnType<typeof buildTreeViewDragInteractions>;
  // eslint-disable-next-line mocha/no-top-level-hooks
  beforeEach(() => {
    const dataTransfer = new MockedDataTransfer();
    dragEvents = buildTreeViewDragInteractions(dataTransfer);
  });

  // eslint-disable-next-line mocha/no-top-level-hooks
  afterEach(() => {
    dragEvents = {} as typeof dragEvents;
  });

  describe('itemReordering prop', () => {
    it('should allow to drag and drop items when props.itemsReordering={true}', () => {
      const view = render({
        experimentalFeatures: { indentationAtItemLevel: true, itemsReordering: true },
        items: [{ id: '1' }, { id: '2' }, { id: '3' }],
        itemsReordering: true,
      });

      dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
      expect(view.getItemIdTree()).to.deep.equal([
        { id: '2', children: [{ id: '1' }] },
        { id: '3' },
      ]);
    });

    it('should not allow to drag and drop items when props.itemsReordering={false}', () => {
      const view = render({
        experimentalFeatures: { indentationAtItemLevel: true, itemsReordering: true },
        items: [{ id: '1' }, { id: '2' }, { id: '3' }],
        itemsReordering: false,
      });

      dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
      expect(view.getItemIdTree()).to.deep.equal([{ id: '1' }, { id: '2' }, { id: '3' }]);
    });

    it('should not allow to drag and drop items when props.itemsReordering is not defined', () => {
      const view = render({
        experimentalFeatures: { indentationAtItemLevel: true },
        items: [{ id: '1' }, { id: '2' }, { id: '3' }],
      });

      dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
      expect(view.getItemIdTree()).to.deep.equal([{ id: '1' }, { id: '2' }, { id: '3' }]);
    });

    it('should allow to expand the new parent of the dragged item when it was not expandable before', () => {
      const view = render({
        experimentalFeatures: { indentationAtItemLevel: true, itemsReordering: true },
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        itemsReordering: true,
        defaultExpandedItems: ['1'],
      });

      dragEvents.fullDragSequence(view.getItemRoot('1.1'), view.getItemContent('2'));

      fireEvent.focus(view.getItemRoot('2'));
      fireEvent.keyDown(view.getItemRoot('2'), { key: 'Enter' });

      expect(view.getItemIdTree()).to.deep.equal([
        { id: '1', children: [] },
        { id: '2', children: [{ id: '1.1' }] },
      ]);
    });
  });

  describe('onItemPositionChange prop', () => {
    it('should call onItemPositionChange when an item is moved', () => {
      const onItemPositionChange = spy();
      const view = render({
        experimentalFeatures: { indentationAtItemLevel: true, itemsReordering: true },
        items: [{ id: '1' }, { id: '2' }, { id: '3' }],
        itemsReordering: true,
        onItemPositionChange,
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

  describe('isItemReorderable prop', () => {
    it('should not allow to drag an item when isItemReorderable returns false', () => {
      const view = render({
        experimentalFeatures: { indentationAtItemLevel: true, itemsReordering: true },
        items: [{ id: '1' }, { id: '2' }, { id: '3' }],
        itemsReordering: true,
        canMoveItemToNewPosition: () => false,
      });

      dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
      expect(view.getItemIdTree()).to.deep.equal([{ id: '1' }, { id: '2' }, { id: '3' }]);
    });

    it('should allow to drag an item when isItemReorderable returns true', () => {
      const view = render({
        experimentalFeatures: { indentationAtItemLevel: true, itemsReordering: true },
        items: [{ id: '1' }, { id: '2' }, { id: '3' }],
        itemsReordering: true,
        canMoveItemToNewPosition: () => true,
      });

      dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
      expect(view.getItemIdTree()).to.deep.equal([
        { id: '2', children: [{ id: '1' }] },
        { id: '3' },
      ]);
    });
  });

  describe('canMoveItemToNewPosition prop', () => {
    it('should call canMoveItemToNewPosition with the correct parameters', () => {
      const canMoveItemToNewPosition = spy();
      const view = render({
        experimentalFeatures: { indentationAtItemLevel: true, itemsReordering: true },
        items: [{ id: '1' }, { id: '2' }, { id: '3' }],
        itemsReordering: true,
        canMoveItemToNewPosition,
      });

      dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
      expect(canMoveItemToNewPosition.lastCall.firstArg).to.deep.equal({
        itemId: '1',
        oldPosition: { parentId: null, index: 0 },
        newPosition: { parentId: null, index: 1 },
      });
    });

    it('should not allow to drop an item when canMoveItemToNewPosition returns false', () => {
      const view = render({
        experimentalFeatures: { indentationAtItemLevel: true, itemsReordering: true },
        items: [{ id: '1' }, { id: '2' }, { id: '3' }],
        itemsReordering: true,
        canMoveItemToNewPosition: () => false,
      });

      dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
      expect(view.getItemIdTree()).to.deep.equal([{ id: '1' }, { id: '2' }, { id: '3' }]);
    });

    it('should allow to drop an item when canMoveItemToNewPosition returns true', () => {
      const view = render({
        experimentalFeatures: { indentationAtItemLevel: true, itemsReordering: true },
        items: [{ id: '1' }, { id: '2' }, { id: '3' }],
        itemsReordering: true,
        canMoveItemToNewPosition: () => true,
      });

      dragEvents.fullDragSequence(view.getItemRoot('1'), view.getItemContent('2'));
      expect(view.getItemIdTree()).to.deep.equal([
        { id: '2', children: [{ id: '1' }] },
        { id: '3' },
      ]);
    });
  });
});

describe('getNewPosition util', () => {
  // The actions use the following tree when dropping "1.1" on "1.2":
  // - 1
  //   - 1.1
  //   - 1.2
  //   - 1.3
  // - 2
  const ALL_ACTIONS: TreeViewItemItemReorderingValidActions = {
    'reorder-above': { parentId: '1', index: 0 },
    'reorder-below': { parentId: '1', index: 1 },
    'make-child': { parentId: '1.2', index: 0 },
    'move-to-parent': { parentId: null, index: 2 },
  };

  const FAKE_CONTENT_ELEMENT = {} as HTMLDivElement;

  const COMMON_PROPERTIES = {
    itemChildrenIndentation: 12,
    validActions: ALL_ACTIONS,
    targetHeight: 100,
    targetDepth: 1,
    cursorY: 50,
    cursorX: 100,
    contentElement: FAKE_CONTENT_ELEMENT,
  };

  it('should choose the "reorder-above" action when the cursor is in the top quarter of the target item', () => {
    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 1,
      }),
    ).to.equal('reorder-above');

    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 24,
      }),
    ).to.equal('reorder-above');
  });

  it('should choose the "reorder-above" action when the cursor is in the top half of the target item and the "make-child" action is not valid', () => {
    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 25,
        validActions: { ...ALL_ACTIONS, 'make-child': undefined },
      }),
    ).to.equal('reorder-above');

    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 49,
        validActions: { ...ALL_ACTIONS, 'make-child': undefined },
      }),
    ).to.equal('reorder-above');
  });

  it('should choose the "reorder-below" action when the cursor is in the bottom quarter of the target item', () => {
    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 99,
      }),
    ).to.equal('reorder-below');

    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 76,
      }),
    ).to.equal('reorder-below');
  });

  it('should choose the "reorder-below" action when the cursor is in the bottom half of the target item and the "make-child" action is not valid', () => {
    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 75,
        validActions: { ...ALL_ACTIONS, 'make-child': undefined },
      }),
    ).to.equal('reorder-below');

    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 51,
        validActions: { ...ALL_ACTIONS, 'make-child': undefined },
      }),
    ).to.equal('reorder-below');

    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 50,
        validActions: { ...ALL_ACTIONS, 'make-child': undefined },
      }),
    ).to.equal('reorder-below');
  });

  it('should choose the "make-child" action when the cursor is in the middle of the target item', () => {
    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 25,
      }),
    ).to.equal('make-child');

    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 50,
      }),
    ).to.equal('make-child');

    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorY: 74,
      }),
    ).to.equal('make-child');
  });

  it('should choose the "move-to-parent" action when the cursor is inside the depth-offset of the target item', () => {
    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorX: 1,
        cursorY: 1,
      }),
    ).to.equal('move-to-parent');

    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorX: 11,
        cursorY: 1,
      }),
    ).to.equal('move-to-parent');

    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorX: 1,
        cursorY: 50,
      }),
    ).to.equal('move-to-parent');

    expect(
      chooseActionToApply({
        ...COMMON_PROPERTIES,
        cursorX: 1,
        cursorY: 99,
      }),
    ).to.equal('move-to-parent');
  });
});
