import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent } from '@mui/internal-test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import {
  UseTreeViewExpansionSignature,
  UseTreeViewItemsSignature,
  UseTreeViewSelectionSignature,
} from '@mui/x-tree-view/internals';

describeTreeView<
  [UseTreeViewItemsSignature, UseTreeViewExpansionSignature, UseTreeViewSelectionSignature]
>(
  'useTreeViewItems plugin',
  ({ render, renderFromJSX, treeViewComponentName, TreeViewComponent, TreeItemComponent }) => {
    it('should throw an error when two items have the same ID', function test() {
      // TODO is this fixed?
      if (!/jsdom/.test(window.navigator.userAgent)) {
        // can't catch render errors in the browser for unknown reason
        // tried try-catch + error boundary + window onError preventDefault
        this.skip();
      }

      expect(() =>
        render({ items: [{ id: '1' }, { id: '1' }], withErrorBoundary: true }),
      ).toErrorDev([
        ...(treeViewComponentName === 'SimpleTreeView'
          ? ['Encountered two children with the same key']
          : []),
        'MUI X: The Tree View component requires all items to have a unique `id` property.',
        'MUI X: The Tree View component requires all items to have a unique `id` property.',
        `The above error occurred in the <ForwardRef(${treeViewComponentName})> component`,
      ]);
    });

    it('should be able to use a custom id attribute', function test() {
      // For now, only SimpleTreeView can use custom id attributes
      if (treeViewComponentName.startsWith('RichTreeView')) {
        this.skip();
      }

      const view = render({
        items: [{ id: '1' }],
        slotProps: {
          item: {
            id: 'customId',
          },
        },
      });

      expect(view.getItemRoot('1')).to.have.attribute('id', 'customId');
    });

    describe('items prop / JSX Tree Item', () => {
      it('should support removing an item', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
        });

        view.setItems([{ id: '1' }]);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);
      });

      it('should support adding an item at the end', () => {
        const view = render({
          items: [{ id: '1' }],
        });

        view.setItems([{ id: '1' }, { id: '2' }]);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2']);
      });

      it('should support adding an item at the beginning', () => {
        const view = render({
          items: [{ id: '2' }],
        });

        view.setItems([{ id: '1' }, { id: '2' }]);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2']);
      });

      it('should update indexes when two items are swapped', () => {
        const onSelectedItemsChange = spy();

        const view = render({
          items: [{ id: '1' }, { id: '2' }, { id: '3' }],
          multiSelect: true,
          onSelectedItemsChange,
        });

        view.setItems([{ id: '1' }, { id: '3' }, { id: '2' }]);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '3', '2']);

        // Check if the internal state is updated by running a range selection
        fireEvent.click(view.getItemContent('1'));
        fireEvent.click(view.getItemContent('3'), { shiftKey: true });
        expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal(['1', '3']);
      });

      it('should not mark an item as expandable if its children is an empty array', () => {
        const view = render({
          items: [{ id: '1', children: [] }],
          defaultExpandedItems: ['1'],
        });

        expect(view.getItemRoot('1')).not.to.have.attribute('aria-expanded');
      });

      it('should mark an item as not expandable if it has only empty conditional arrays', function test() {
        if (treeViewComponentName.startsWith('RichTreeView')) {
          this.skip();
        }

        const view = renderFromJSX(
          <TreeViewComponent defaultExpandedItems={['1']}>
            <TreeItemComponent itemId="1" label="1" data-testid="1">
              {[]}
              {[]}
            </TreeItemComponent>
          </TreeViewComponent>,
        );

        expect(view.isItemExpanded('1')).to.equal(false);
      });

      it('should mark an item as expandable if it has two array as children, one of which is empty (SimpleTreeView only)', function test() {
        if (treeViewComponentName.startsWith('RichTreeView')) {
          this.skip();
        }

        const view = renderFromJSX(
          <TreeViewComponent defaultExpandedItems={['1']}>
            <TreeItemComponent itemId="1" label="1" data-testid="1">
              {[]}
              {[<TreeItemComponent key="1.1" itemId="1.1" />]}
            </TreeItemComponent>
          </TreeViewComponent>,
        );

        expect(view.isItemExpanded('1')).to.equal(true);
      });

      it('should mark an item as not expandable if it has one array containing an empty array as a children (SimpleTreeView only)', function test() {
        if (treeViewComponentName.startsWith('RichTreeView')) {
          this.skip();
        }

        const view = renderFromJSX(
          <TreeViewComponent defaultExpandedItems={['1']}>
            <TreeItemComponent itemId="1" label="1" data-testid="1">
              {[[]]}
            </TreeItemComponent>
          </TreeViewComponent>,
        );

        expect(view.isItemExpanded('1')).to.equal(false);
      });
    });

    describe('disabled prop', () => {
      it('should not have the attribute `aria-disabled` if disabled is not defined', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2', disabled: false }, { id: '3', disabled: true }],
        });

        expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');
        expect(view.getItemRoot('2')).not.to.have.attribute('aria-disabled');
        expect(view.getItemRoot('3')).to.have.attribute('aria-disabled');
      });

      it('should disable all descendants of a disabled item', () => {
        const view = render({
          items: [
            { id: '1', disabled: true, children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] },
          ],
          defaultExpandedItems: ['1', '1.1'],
        });

        expect(view.getItemRoot('1')).to.have.attribute('aria-disabled', 'true');
        expect(view.getItemRoot('1.1')).to.have.attribute('aria-disabled', 'true');
        expect(view.getItemRoot('1.1.1')).to.have.attribute('aria-disabled', 'true');
      });
    });

    describe('onItemClick prop', () => {
      it('should call onItemClick when clicking on the content of an item', () => {
        const onItemClick = spy();

        const view = render({
          items: [{ id: '1' }],
          onItemClick,
        });

        fireEvent.click(view.getItemContent('1'));
        expect(onItemClick.callCount).to.equal(1);
        expect(onItemClick.lastCall.lastArg).to.equal('1');
      });

      it('should not call onItemClick for the ancestors on the clicked item', () => {
        const onItemClick = spy();

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
          onItemClick,
        });

        fireEvent.click(view.getItemContent('1.1'));
        expect(onItemClick.callCount).to.equal(1);
        expect(onItemClick.lastCall.lastArg).to.equal('1.1');
      });
    });

    describe('API methods', () => {
      describe('getItem', () => {
        // This method is only usable with Rich Tree View components
        if (treeViewComponentName === 'SimpleTreeView') {
          return;
        }

        it('should return the tree', () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          });

          expect(view.apiRef.current.getItem('1')).to.deep.equal({
            id: '1',
            children: [{ id: '1.1' }],
          });
        });

        it('should have up to date tree when props.items changes', () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          });

          view.setItems([{ id: '1' }, { id: '2' }]);

          expect(view.apiRef.current.getItem('1')).to.deep.equal({ id: '1' });
        });

        it('should contain custom item properties', () => {
          const view = render({
            items: [{ id: '1', customProp: 'foo' }],
          });

          expect(view.apiRef.current.getItem('1')).to.deep.equal({
            id: '1',
            customProp: 'foo',
          });
        });
      });

      describe('getItemDOMElement', () => {
        it('should return the DOM element of the item', () => {
          const view = render({
            items: [{ id: '1' }],
          });

          expect(view.apiRef.current.getItemDOMElement('1')).to.equal(view.getItemRoot('1'));
        });

        it("should return the null when the item doesn't exist", () => {
          const view = render({
            items: [{ id: '1' }],
          });

          expect(view.apiRef.current.getItemDOMElement('2')).to.equal(null);
        });
      });

      describe('getItemTree', () => {
        // This method is only usable with Rich Tree View components
        if (treeViewComponentName === 'SimpleTreeView') {
          return;
        }

        it('should return the tree', () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          });

          expect(view.apiRef.current.getItemTree()).to.deep.equal([
            { id: '1', children: [{ id: '1.1' }] },
            { id: '2' },
          ]);
        });

        it('should have up to date tree when props.items changes', () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          });

          view.setItems([{ id: '1' }, { id: '2' }]);

          expect(view.apiRef.current.getItemTree()).to.deep.equal([{ id: '1' }, { id: '2' }]);
        });

        it('should contain custom item properties', () => {
          const view = render({
            items: [{ id: '1', customProp: 'foo' }],
          });

          expect(view.apiRef.current.getItemTree()).to.deep.equal([{ id: '1', customProp: 'foo' }]);
        });
      });

      describe('getItemOrderedChildrenIds', () => {
        // This method is only usable with Rich Tree View components
        if (treeViewComponentName === 'SimpleTreeView') {
          return;
        }

        it('should return the children of an item in their rendering order', () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
          });

          expect(view.apiRef.current.getItemOrderedChildrenIds('1')).to.deep.equal(['1.1', '1.2']);
        });

        it('should work for the root items', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
          });

          expect(view.apiRef.current.getItemOrderedChildrenIds(null)).to.deep.equal(['1', '2']);
        });

        it('should have up to date children when props.items changes', () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          });

          view.setItems([{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }]);

          expect(view.apiRef.current.getItemOrderedChildrenIds('1')).to.deep.equal(['1.1', '1.2']);
        });
      });
    });
  },
);
