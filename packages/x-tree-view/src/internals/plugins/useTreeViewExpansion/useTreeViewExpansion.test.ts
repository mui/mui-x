import { expect } from 'chai';
import { spy } from 'sinon';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { UseTreeViewExpansionSignature } from '@mui/x-tree-view/internals';
import { act, fireEvent } from '@mui-internal/test-utils';

/**
 * All tests related to keyboard navigation (e.g: expanding using "Enter" and "ArrowRight")
 * are located in the `useTreeViewKeyboardNavigation.test.ts` file.
 */
describeTreeView<UseTreeViewExpansionSignature>('useTreeViewExpansion plugin', ({ render }) => {
  describe('expandedItems / defaultExpandedItems / onExpandedItemsChange props', () => {
    it('should not expand items when no default state and no control state are defined', () => {
      const { getItemRoot, getAllItemRoots } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
      expect(getAllItemRoots()).to.have.length(2);
    });

    it('should use the default state when defined', () => {
      const { getItemRoot, getAllItemRoots } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedItems: ['1'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      expect(getAllItemRoots()).to.have.length(3);
    });

    it('should use the control state when defined', () => {
      const { getItemRoot } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        expandedItems: ['1'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      expect(getItemRoot('1.1')).toBeVisible();
    });

    it('should use the control state upon the default state when both are defined', () => {
      const { getItemRoot } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        expandedItems: ['1'],
        defaultExpandedItems: ['2'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
    });

    it('should react to control state update', () => {
      const { getItemRoot, setProps } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        expandedItems: [],
      });

      setProps({ expandedItems: ['1'] });
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
    });

    it('should call callback when expanded items are updated (add expanded item to empty list)', () => {
      const onExpandedItemsChange = spy();

      const { getItemContent, getRoot } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        onExpandedItemsChange,
      });

      fireEvent.click(getItemContent('1'));
      act(() => {
        getRoot().focus();
      });

      expect(onExpandedItemsChange.callCount).to.equal(1);
      expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal(['1']);
    });

    it('should call callback when expanded items are updated (add expanded item no non-empty list)', () => {
      const onExpandedItemsChange = spy();

      const { getItemContent, getRoot } = render({
        items: [
          { id: '1', children: [{ id: '1.1' }] },
          { id: '2', children: [{ id: '2.1' }] },
        ],
        onExpandedItemsChange,
        defaultExpandedItems: ['1'],
      });

      fireEvent.click(getItemContent('2'));
      act(() => {
        getRoot().focus();
      });

      expect(onExpandedItemsChange.callCount).to.equal(1);
      expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal(['2', '1']);
    });

    it('should call callback when expanded items are updated (remove expanded item)', () => {
      const onExpandedItemsChange = spy();

      const { getItemContent, getRoot } = render({
        items: [
          { id: '1', children: [{ id: '1.1' }] },
          { id: '2', children: [{ id: '2.1' }] },
        ],
        onExpandedItemsChange,
        defaultExpandedItems: ['1'],
      });

      fireEvent.click(getItemContent('1'));
      act(() => {
        getRoot().focus();
      });

      expect(onExpandedItemsChange.callCount).to.equal(1);
      expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal([]);
    });

    it('should warn when switching from controlled to uncontrolled', () => {
      const { setProps } = render({
        items: [{ id: '1' }],
        expandedItems: [],
      });

      expect(() => {
        setProps({ expandedItems: undefined });
      }).toErrorDev(
        'MUI X: A component is changing the controlled expandedItems state of TreeView to be uncontrolled.',
      );
    });

    it('should warn and not react to update when updating the default state', () => {
      const { getItemRoot, setProps } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedItems: ['1'],
      });

      expect(() => {
        setProps({ defaultExpandedItems: ['2'] });
        expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
        expect(getItemRoot('2')).not.to.have.attribute('aria-expanded', 'true');
      }).toErrorDev(
        'MUI X: A component is changing the default expandedItems state of an uncontrolled TreeView after being initialized. To suppress this warning opt to use a controlled TreeView.',
      );
    });
  });

  describe('click on item content', () => {
    it('should expand collapsed item when clicking on an item content', () => {
      const { getItemRoot, getItemContent } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
      fireEvent.click(getItemContent('1'));
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
    });

    it('should collapse expanded item when clicking on an item content', () => {
      const { getItemRoot, getItemContent } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedItems: ['1'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      fireEvent.click(getItemContent('1'));
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
    });

    it('should not expand collapsed item when clicking on a disabled item content', () => {
      const { getItemRoot, getItemContent } = render({
        items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
      fireEvent.click(getItemContent('1'));
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
    });

    it('should not collapse expanded item when clicking on a disabled item', () => {
      const { getItemRoot, getItemContent } = render({
        items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedItems: ['1'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      fireEvent.click(getItemContent('1'));
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
    });
  });
});
