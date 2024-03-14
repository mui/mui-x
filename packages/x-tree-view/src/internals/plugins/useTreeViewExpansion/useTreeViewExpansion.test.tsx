import { expect } from 'chai';
import { spy } from 'sinon';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { UseTreeViewExpansionSignature } from '@mui/x-tree-view/internals';
import { act, fireEvent } from '@mui-internal/test-utils';

/**
 * All tests related to keyboard navigation (e.g.: expanding using "Enter" and "ArrowRight")
 * are located in the `useTreeViewKeyboardNavigation.test.tsx` file.
 */
describeTreeView<UseTreeViewExpansionSignature>('useTreeViewExpansion plugin', ({ render }) => {
  describe('expandedItems / defaultExpandedItems / onExpandedItemsChange props', () => {
    it('should not expand items when no default state and no control state are defined', () => {
      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(response.isItemExpanded('1')).to.equal(false);
      expect(response.getAllItemRoots()).to.have.length(2);
    });

    it('should use the default state when defined', () => {
      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedItems: ['1'],
      });

      expect(response.isItemExpanded('1')).to.equal(true);
      expect(response.getAllItemRoots()).to.have.length(3);
    });

    it('should use the control state when defined', () => {
      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        expandedItems: ['1'],
      });

      expect(response.isItemExpanded('1')).to.equal(true);
      expect(response.getItemRoot('1.1')).toBeVisible();
    });

    it('should use the control state upon the default state when both are defined', () => {
      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        expandedItems: ['1'],
        defaultExpandedItems: ['2'],
      });

      expect(response.isItemExpanded('1')).to.equal(true);
    });

    it('should react to control state update', () => {
      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        expandedItems: [],
      });

      response.setProps({ expandedItems: ['1'] });
      expect(response.isItemExpanded('1')).to.equal(true);
    });

    it('should call the onExpandedItemsChange callback when model is updated (add expanded item to empty list)', () => {
      const onExpandedItemsChange = spy();

      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        onExpandedItemsChange,
      });

      fireEvent.click(response.getItemContent('1'));
      act(() => {
        response.getRoot().focus();
      });

      expect(onExpandedItemsChange.callCount).to.equal(1);
      expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal(['1']);
    });

    it('should call the onExpandedItemsChange callback when model is updated (add expanded item no non-empty list)', () => {
      const onExpandedItemsChange = spy();

      const response = render({
        items: [
          { id: '1', children: [{ id: '1.1' }] },
          { id: '2', children: [{ id: '2.1' }] },
        ],
        onExpandedItemsChange,
        defaultExpandedItems: ['1'],
      });

      fireEvent.click(response.getItemContent('2'));
      act(() => {
        response.getRoot().focus();
      });

      expect(onExpandedItemsChange.callCount).to.equal(1);
      expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal(['2', '1']);
    });

    it('should call the onExpandedItemsChange callback when model is updated (remove expanded item)', () => {
      const onExpandedItemsChange = spy();

      const response = render({
        items: [
          { id: '1', children: [{ id: '1.1' }] },
          { id: '2', children: [{ id: '2.1' }] },
        ],
        onExpandedItemsChange,
        defaultExpandedItems: ['1'],
      });

      fireEvent.click(response.getItemContent('1'));
      act(() => {
        response.getRoot().focus();
      });

      expect(onExpandedItemsChange.callCount).to.equal(1);
      expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal([]);
    });

    it('should warn when switching from controlled to uncontrolled', () => {
      const response = render({
        items: [{ id: '1' }],
        expandedItems: [],
      });

      expect(() => {
        response.setProps({ expandedItems: undefined });
      }).toErrorDev(
        'MUI X: A component is changing the controlled expandedItems state of TreeView to be uncontrolled.',
      );
    });

    it('should warn and not react to update when updating the default state', () => {
      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedItems: ['1'],
      });

      expect(() => {
        response.setProps({ defaultExpandedItems: ['2'] });
        expect(response.isItemExpanded('1')).to.equal(true);
        expect(response.isItemExpanded('2')).to.equal(false);
      }).toErrorDev(
        'MUI X: A component is changing the default expandedItems state of an uncontrolled TreeView after being initialized. To suppress this warning opt to use a controlled TreeView.',
      );
    });
  });

  describe('click interactions', () => {
    it('should expand collapsed item when clicking on an item content', () => {
      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(response.isItemExpanded('1')).to.equal(false);
      fireEvent.click(response.getItemContent('1'));
      expect(response.isItemExpanded('1')).to.equal(true);
    });

    it('should collapse expanded item when clicking on an item content', () => {
      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedItems: ['1'],
      });

      expect(response.isItemExpanded('1')).to.equal(true);
      fireEvent.click(response.getItemContent('1'));
      expect(response.isItemExpanded('1')).to.equal(false);
    });

    it('should not expand collapsed item when clicking on a disabled item content', () => {
      const response = render({
        items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(response.isItemExpanded('1')).to.equal(false);
      fireEvent.click(response.getItemContent('1'));
      expect(response.isItemExpanded('1')).to.equal(false);
    });

    it('should not collapse expanded item when clicking on a disabled item', () => {
      const response = render({
        items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedItems: ['1'],
      });

      expect(response.isItemExpanded('1')).to.equal(true);
      fireEvent.click(response.getItemContent('1'));
      expect(response.isItemExpanded('1')).to.equal(true);
    });

    it('should expand collapsed item when clicking on an item label', () => {
      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(response.isItemExpanded('1')).to.equal(false);
      fireEvent.click(response.getItemLabel('1'));
      expect(response.isItemExpanded('1')).to.equal(true);
    });

    it('should expand collapsed item when clicking on an item icon container', () => {
      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(response.isItemExpanded('1')).to.equal(false);
      fireEvent.click(response.getItemIconContainer('1'));
      expect(response.isItemExpanded('1')).to.equal(true);
    });
  });

  describe('onItemExpansionToggle prop', () => {
    it('should call the onItemExpansionToggle callback when expanding an item', () => {
      const onItemExpansionToggle = spy();

      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        onItemExpansionToggle,
      });

      fireEvent.click(response.getItemContent('1'));
      expect(onItemExpansionToggle.callCount).to.equal(1);
      expect(onItemExpansionToggle.lastCall.args[1]).to.equal('1');
      expect(onItemExpansionToggle.lastCall.args[2]).to.equal(true);
    });

    it('should call the onItemExpansionToggle callback when collapsing an item', () => {
      const onItemExpansionToggle = spy();

      const response = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        defaultExpandedItems: ['1'],
        onItemExpansionToggle,
      });

      fireEvent.click(response.getItemContent('1'));
      expect(onItemExpansionToggle.callCount).to.equal(1);
      expect(onItemExpansionToggle.lastCall.args[1]).to.equal('1');
      expect(onItemExpansionToggle.lastCall.args[2]).to.equal(false);
    });
  });
});
