import * as React from 'react';
import { expect } from 'chai';
import { act, fireEvent } from '@mui-internal/test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import {
  UseTreeViewExpansionSignature,
  UseTreeViewItemsSignature,
  UseTreeViewKeyboardNavigationSignature,
} from '@mui/x-tree-view/internals';

describeTreeView<
  [UseTreeViewKeyboardNavigationSignature, UseTreeViewItemsSignature, UseTreeViewExpansionSignature]
>('useTreeViewKeyboardNavigation', ({ render, treeViewComponent }) => {
  describe('Navigation (focus and expansion)', () => {
    describe('key: ArrowDown', () => {
      it('should move the focus to a sibling item', () => {
        const response = render({
          items: [{ id: '1' }, { id: '2' }],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'ArrowDown' });
        expect(response.getFocusedItemId()).to.equal('2');
      });

      it('should move the focus to a child item', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'ArrowDown' });
        expect(response.getFocusedItemId()).to.equal('1.1');
      });

      it('should move the focus to a child item with a dynamic tree', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          defaultExpandedItems: ['1'],
        });

        response.setItems([{ id: '2' }]);
        response.setItems([{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }]);
        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'ArrowDown' });
        expect(response.getFocusedItemId()).to.equal('1.1');
      });

      it("should move the focus to a parent's sibling", () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }, { id: '2' }] }],
          defaultExpandedItems: ['1'],
        });

        act(() => {
          response.getItemRoot('1.1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1.1'), { key: 'ArrowDown' });
        expect(response.getFocusedItemId()).to.equal('2');
      });
    });

    describe('key: ArrowUp', () => {
      it('should move the focus to a sibling item', () => {
        const response = render({
          items: [{ id: '1' }, { id: '2' }],
        });

        act(() => {
          response.getItemRoot('2').focus();
        });
        fireEvent.keyDown(response.getItemRoot('2'), { key: 'ArrowUp' });
        expect(response.getFocusedItemId()).to.equal('1');
      });

      it('should move the focus to a parent', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
        });

        act(() => {
          response.getItemRoot('1.1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1.1'), { key: 'ArrowUp' });
        expect(response.getFocusedItemId()).to.equal('1');
      });

      it("should move the focus to a sibling's child", () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          defaultExpandedItems: ['1'],
        });

        act(() => {
          response.getItemRoot('2').focus();
        });
        fireEvent.keyDown(response.getItemRoot('2'), { key: 'ArrowUp' });
        expect(response.getFocusedItemId()).to.equal('1.1');
      });
    });

    describe('key: ArrowRight', () => {
      it('should open the item and not move the focus if the focus is on a closed item', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'ArrowRight' });
        expect(response.isItemExpanded('1')).to.equal(true);
        expect(response.getFocusedItemId()).to.equal('1');
      });

      it('should move the focus to the first child if the focus is on an open item', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'ArrowRight' });
        expect(response.getFocusedItemId()).to.equal('1.1');
      });

      it('should do nothing if the focus is on a leaf', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
        });

        act(() => {
          response.getItemRoot('1.1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1.1'), { key: 'ArrowRight' });
        expect(response.getFocusedItemId()).to.equal('1.1');
      });
    });

    describe('key: ArrowLeft', () => {
      it('should close the item if the focus is on an open item', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'ArrowLeft' });
        expect(response.isItemExpanded('1')).to.equal(false);
      });

      it("should move focus to the item's parent if the focus is on a child item that is a leaf", () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
        });

        act(() => {
          response.getItemRoot('1.1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1.1'), { key: 'ArrowLeft' });
        expect(response.getFocusedItemId()).to.equal('1');
        expect(response.isItemExpanded('1')).to.equal(true);
      });

      it("should move the focus to the item's parent if the focus is on a child item that is closed", () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] }],
          defaultExpandedItems: ['1'],
        });

        act(() => {
          response.getItemRoot('1.1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1.1'), { key: 'ArrowLeft' });
        expect(response.getFocusedItemId()).to.equal('1');
        expect(response.isItemExpanded('1')).to.equal(true);
      });

      it('should do nothing if the focus is on a root item that is closed', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'ArrowLeft' });
        expect(response.getFocusedItemId()).to.equal('1');
        expect(response.isItemExpanded('1')).to.equal(false);
      });

      it('should do nothing if the focus is on a root item that is a leaf', () => {
        const response = render({
          items: [{ id: '1' }],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'ArrowLeft' });
        expect(response.getFocusedItemId()).to.equal('1');
      });
    });

    describe('key: Home', () => {
      it('should move the focus to the first item in the tree', () => {
        const response = render({
          items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
        });

        act(() => {
          response.getItemRoot('4').focus();
        });
        fireEvent.keyDown(response.getItemRoot('4'), { key: 'Home' });
        expect(response.getFocusedItemId()).to.equal('1');
      });
    });

    describe('key: End', () => {
      it('should move the focus to the last item in the tree when the last item is not expanded', () => {
        const response = render({
          items: [
            { id: '1' },
            { id: '2' },
            { id: '3' },
            { id: '4', children: [{ id: '4.1' }, { id: '4.2' }] },
          ],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'End' });
        expect(response.getFocusedItemId()).to.equal('4');
      });

      it('should live the focus to the last item in the tree when the last item is expanded', () => {
        const response = render({
          items: [
            { id: '1' },
            { id: '2' },
            { id: '3' },
            { id: '4', children: [{ id: '4.1', children: [{ id: '4.1.1' }] }] },
          ],
          defaultExpandedItems: ['4', '4.1'],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'End' });
        expect(response.getFocusedItemId()).to.equal('4.1.1');
      });
    });

    describe('key: * (asterisk)', () => {
      it('should expand all items that are at the same level as the current item', () => {
        const response = render({
          items: [
            { id: '1', children: [{ id: '1.1' }] },
            { id: '2', children: [{ id: '2.1' }] },
            { id: '3', children: [{ id: '3.1', children: [{ id: '3.1.1' }] }] },
            { id: '4' },
          ],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });

        expect(response.isItemExpanded('1')).to.equal(false);
        expect(response.isItemExpanded('2')).to.equal(false);
        expect(response.isItemExpanded('3')).to.equal(false);

        fireEvent.keyDown(response.getItemRoot('1'), { key: '*' });
        expect(response.isItemExpanded('1')).to.equal(true);
        expect(response.isItemExpanded('2')).to.equal(true);
        expect(response.isItemExpanded('3')).to.equal(true);
        expect(response.isItemExpanded('3.1')).to.equal(false);
      });
    });

    describe('key: Enter', () => {
      it('should expand an item with children if it is collapsed', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'Enter' });
        expect(response.isItemExpanded('1')).to.equal(true);
      });

      it('should collapse an item with children if it is expanded', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
        });

        act(() => {
          response.getItemRoot('1').focus();
        });
        fireEvent.keyDown(response.getItemRoot('1'), { key: 'Enter' });
        expect(response.isItemExpanded('1')).to.equal(false);
      });
    });
  });

  describe('Type-ahead', () => {
    it('should move the focus to the next item with a name that starts with the typed character', () => {
      const response = render({
        items: [
          { id: '1', label: 'one' },
          { id: '2', label: 'two' },
          { id: '3', label: 'three' },
          { id: '4', label: 'four' },
        ],
      });

      act(() => {
        response.getItemRoot('1').focus();
      });
      expect(response.getFocusedItemId()).to.equal('1');

      fireEvent.keyDown(response.getItemRoot('1'), { key: 't' });
      expect(response.getFocusedItemId()).to.equal('2');

      fireEvent.keyDown(response.getItemRoot('2'), { key: 'f' });
      expect(response.getFocusedItemId()).to.equal('4');

      fireEvent.keyDown(response.getItemRoot('4'), { key: 'o' });
      expect(response.getFocusedItemId()).to.equal('1');
    });

    it('should move to the next item in the displayed order when typing the same starting character', () => {
      const response = render({
        items: [{ id: 'A1' }, { id: 'B1' }, { id: 'A2' }, { id: 'B3' }, { id: 'B2' }],
      });

      act(() => {
        response.getItemRoot('A1').focus();
      });
      expect(response.getFocusedItemId()).to.equal('A1');

      fireEvent.keyDown(response.getItemRoot('A1'), { key: 'b' });
      expect(response.getFocusedItemId()).to.equal('B1');

      fireEvent.keyDown(response.getItemRoot('B1'), { key: 'b' });
      expect(response.getFocusedItemId()).to.equal('B3');

      fireEvent.keyDown(response.getItemRoot('B3'), { key: 'b' });
      expect(response.getFocusedItemId()).to.equal('B2');

      fireEvent.keyDown(response.getItemRoot('B2'), { key: 'b' });
      expect(response.getFocusedItemId()).to.equal('B1');
    });

    it('should work with capitalized label', () => {
      const response = render({
        items: [
          { id: '1', label: 'One' },
          { id: '2', label: 'Two' },
          { id: '3', label: 'Three' },
          { id: '4', label: 'Four' },
        ],
      });

      act(() => {
        response.getItemRoot('1').focus();
      });
      expect(response.getFocusedItemId()).to.equal('1');

      fireEvent.keyDown(response.getItemRoot('1'), { key: 't' });
      expect(response.getFocusedItemId()).to.equal('2');

      fireEvent.keyDown(response.getItemRoot('2'), { key: 'f' });
      expect(response.getFocusedItemId()).to.equal('4');

      fireEvent.keyDown(response.getItemRoot('4'), { key: 'o' });
      expect(response.getFocusedItemId()).to.equal('1');
    });

    it('should work with ReactElement label', function test() {
      // Only the SimpleTreeView can have React Element labels.
      if (treeViewComponent !== 'SimpleTreeView') {
        this.skip();
      }

      const response = render({
        items: [
          { id: '1', label: <span>one</span> },
          { id: '2', label: <span>two</span> },
          { id: '3', label: <span>three</span> },
          { id: '4', label: <span>four</span> },
        ],
      });

      act(() => {
        response.getItemRoot('1').focus();
      });
      expect(response.getFocusedItemId()).to.equal('1');

      fireEvent.keyDown(response.getItemRoot('1'), { key: 't' });
      expect(response.getFocusedItemId()).to.equal('2');

      fireEvent.keyDown(response.getItemRoot('2'), { key: 'f' });
      expect(response.getFocusedItemId()).to.equal('4');

      fireEvent.keyDown(response.getItemRoot('4'), { key: 'o' });
      expect(response.getFocusedItemId()).to.equal('1');
    });

    it('should work after adding / removing items', () => {
      const response = render({
        items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
      });

      act(() => {
        response.getItemRoot('1').focus();
      });

      fireEvent.keyDown(response.getItemRoot('1'), { key: '4' });
      expect(response.getFocusedItemId()).to.equal('4');

      response.setItems([{ id: '1' }, { id: '2' }, { id: '3' }]);
      expect(response.getFocusedItemId()).to.equal('1');

      fireEvent.keyDown(response.getItemRoot('1'), { key: '2' });
      expect(response.getFocusedItemId()).to.equal('2');

      response.setItems([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }]);
      expect(response.getFocusedItemId()).to.equal('2');

      fireEvent.keyDown(response.getItemRoot('2'), { key: '4' });
      expect(response.getFocusedItemId()).to.equal('4');
    });

    it('should not move focus when pressing a modifier key and a letter', () => {
      const response = render({
        items: [
          { id: '1', label: 'one' },
          { id: '2', label: 'two' },
          { id: '3', label: 'three' },
          { id: '4', label: 'four' },
        ],
      });

      act(() => {
        response.getItemRoot('1').focus();
      });
      expect(response.getFocusedItemId()).to.equal('1');

      fireEvent.keyDown(response.getItemRoot('1'), { key: 't', ctrlKey: true });
      expect(response.getFocusedItemId()).to.equal('1');

      fireEvent.keyDown(response.getItemRoot('1'), { key: 't', metaKey: true });
      expect(response.getFocusedItemId()).to.equal('1');

      fireEvent.keyDown(response.getItemRoot('1'), { key: 't', shiftKey: true });
      expect(response.getFocusedItemId()).to.equal('1');
    });

    it('should work on disabled item when disabledItemsFocusable={true}', () => {
      const response = render({
        items: [
          { id: '1', label: 'one', disabled: true },
          { id: '2', label: 'two', disabled: true },
          { id: '3', label: 'three', disabled: true },
          { id: '4', label: 'four', disabled: true },
        ],
        disabledItemsFocusable: true,
      });

      act(() => {
        response.getItemRoot('1').focus();
      });
      expect(response.getFocusedItemId()).to.equal('1');

      fireEvent.keyDown(response.getItemRoot('1'), { key: 't' });
      expect(response.getFocusedItemId()).to.equal('2');
    });

    it('should not move focus on disabled item when disabledItemsFocusable={false}', () => {
      const response = render({
        items: [
          { id: '1', label: 'one', disabled: true },
          { id: '2', label: 'two', disabled: true },
          { id: '3', label: 'three', disabled: true },
          { id: '4', label: 'four', disabled: true },
        ],
        disabledItemsFocusable: false,
      });

      act(() => {
        response.getItemRoot('1').focus();
      });
      expect(response.getFocusedItemId()).to.equal('1');

      fireEvent.keyDown(response.getItemRoot('1'), { key: 't' });
      expect(response.getFocusedItemId()).to.equal('1');
    });
  });
});
