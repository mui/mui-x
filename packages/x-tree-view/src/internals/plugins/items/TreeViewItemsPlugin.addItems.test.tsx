import { act, fireEvent } from '@mui/internal-test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import type { ExtendableRichTreeViewStore } from '@mui/x-tree-view/internals';
import { vi, it, expect } from 'vitest';

// `addItems` is a Rich Tree View only API. The Simple Tree View derives its items from JSX
// and does not expose it, so this suite is typed with the Rich store and skips the Simple variant.
describeTreeView<ExtendableRichTreeViewStore<any, any, any, any>>(
  'TreeViewItemsPlugin - addItems',
  ({ render, treeViewComponentName }) => {
    if (treeViewComponentName === 'SimpleTreeView') {
      return;
    }

    it('should add items at the root level', () => {
      const view = render({
        items: [{ id: '1' }],
      });

      act(() => {
        view.apiRef.current.addItems({ items: [{ id: '2' }, { id: '3' }] });
      });

      expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2', '3']);
    });

    it('should add items at the given index', () => {
      const view = render({
        items: [{ id: '1' }, { id: '3' }],
      });

      act(() => {
        view.apiRef.current.addItems({ items: [{ id: '2' }], index: 1 });
      });

      expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2', '3']);
    });

    it('should add items under a parent item and mark it as expandable', () => {
      const view = render({
        items: [{ id: '1' }],
        defaultExpandedItems: ['1'],
      });

      expect(view.getItemRoot('1')).not.to.have.attribute('aria-expanded');

      act(() => {
        view.apiRef.current.addItems({ items: [{ id: '1.1' }], parentId: '1' });
      });

      expect(view.getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1.1']);
    });

    it('should add nested items', () => {
      const view = render({
        items: [{ id: '1' }],
        defaultExpandedItems: ['2'],
      });

      act(() => {
        view.apiRef.current.addItems({ items: [{ id: '2', children: [{ id: '2.1' }] }] });
      });

      expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2', '2.1']);
      expect(view.getItemIdTree()).to.deep.equal([
        { id: '1' },
        { id: '2', children: [{ id: '2.1' }] },
      ]);
    });

    it('should update the indexes of the following siblings', () => {
      const onSelectedItemsChange = vi.fn();

      const view = render({
        items: [{ id: '1' }, { id: '3' }],
        multiSelect: true,
        onSelectedItemsChange,
      });

      act(() => {
        view.apiRef.current.addItems({ items: [{ id: '2' }], index: 1 });
      });

      // Check if the internal state is updated by running a range selection
      fireEvent.click(view.getItemContent('2'));
      fireEvent.click(view.getItemContent('3'), { shiftKey: true });
      expect(onSelectedItemsChange.mock.lastCall?.[1]).to.deep.equal(['2', '3']);
    });

    it('should support editing a newly added item', () => {
      const view = render({
        items: [{ id: '1' }],
        isItemEditable: () => true,
      });

      act(() => {
        view.apiRef.current.addItems({ items: [{ id: '2' }] });
        view.apiRef.current.setEditedItem('2');
      });

      expect(view.getItemLabelInput('2')).not.to.equal(null);
    });

    it('should throw an error when the parent item is not present in the tree', () => {
      const view = render({
        items: [{ id: '1' }],
      });

      expect(() =>
        view.apiRef.current.addItems({ items: [{ id: '2' }], parentId: 'unknown' }),
      ).to.throw(/it is not present in the tree/);
    });

    it('should throw an error when an item with the same id is already present in the tree', () => {
      const view = render({
        items: [{ id: '1' }],
      });

      expect(() => view.apiRef.current.addItems({ items: [{ id: '1' }] })).to.throw(
        /All items must have a unique `id` property/,
      );
    });

    it('should select the new items when their parent is selected and the selection propagates to the descendants', () => {
      const onSelectedItemsChange = vi.fn();

      const view = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        multiSelect: true,
        selectionPropagation: { descendants: true },
        defaultSelectedItems: ['1', '1.1'],
        onSelectedItemsChange,
      });

      act(() => {
        view.apiRef.current.addItems({
          items: [{ id: '1.2', children: [{ id: '1.2.1' }] }],
          parentId: '1',
        });
      });

      expect(onSelectedItemsChange.mock.lastCall?.[1]).to.deep.equal(['1', '1.1', '1.2', '1.2.1']);
    });

    it('should only toggle the new items, not the whole parent subtree', () => {
      const onItemSelectionToggle = vi.fn();

      const view = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        multiSelect: true,
        selectionPropagation: { descendants: true },
        defaultSelectedItems: ['1', '1.1'],
        onItemSelectionToggle,
      });

      act(() => {
        view.apiRef.current.addItems({
          items: [{ id: '1.2', children: [{ id: '1.2.1' }] }],
          parentId: '1',
        });
      });

      const toggled = onItemSelectionToggle.mock.calls.map((call) => call[1]);
      expect(toggled).to.deep.equal(['1.2', '1.2.1']);
    });

    it('should not select the new items when their parent is not selected', () => {
      const onSelectedItemsChange = vi.fn();

      const view = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        multiSelect: true,
        selectionPropagation: { descendants: true },
        onSelectedItemsChange,
      });

      act(() => {
        view.apiRef.current.addItems({ items: [{ id: '1.2' }], parentId: '1' });
      });

      expect(onSelectedItemsChange.mock.calls.length).to.equal(0);
    });

    it('should not select the new items when the selection does not propagate to the descendants', () => {
      const onSelectedItemsChange = vi.fn();

      const view = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        multiSelect: true,
        defaultSelectedItems: ['1'],
        onSelectedItemsChange,
      });

      act(() => {
        view.apiRef.current.addItems({ items: [{ id: '1.2' }], parentId: '1' });
      });

      expect(onSelectedItemsChange.mock.calls.length).to.equal(0);
    });

    it('should throw an error when the index is out of range', () => {
      const view = render({
        items: [{ id: '1' }],
      });

      expect(() => view.apiRef.current.addItems({ items: [{ id: '2' }], index: 2 })).to.throw(
        /it is out of range/,
      );
    });
  },
);
