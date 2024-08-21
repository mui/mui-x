import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { UseTreeViewExpansionSignature } from '@mui/x-tree-view/internals';
import { act, fireEvent } from '@mui/internal-test-utils';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { UseTreeItem2ContentSlotOwnProps } from '@mui/x-tree-view/useTreeItem2';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';

/**
 * All tests related to keyboard navigation (e.g.: expanding using "Enter" and "ArrowRight")
 * are located in the `useTreeViewKeyboardNavigation.test.tsx` file.
 */
describeTreeView<[UseTreeViewExpansionSignature]>(
  'useTreeViewExpansion plugin',
  ({ render, setup }) => {
    describe('model props (expandedItems, defaultExpandedItems, onExpandedItemsChange)', () => {
      it('should not expand items when no default state and no control state are defined', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2']);
      });

      it('should use the default state when defined', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          defaultExpandedItems: ['1'],
        });

        expect(view.isItemExpanded('1')).to.equal(true);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1.1', '2']);
      });

      it('should use the controlled state when defined', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          expandedItems: ['1'],
        });

        expect(view.isItemExpanded('1')).to.equal(true);
        expect(view.getItemRoot('1.1')).toBeVisible();
      });

      it('should use the controlled state instead of the default state when both are defined', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          expandedItems: ['1'],
          defaultExpandedItems: ['2'],
        });

        expect(view.isItemExpanded('1')).to.equal(true);
      });

      it('should react to controlled state update', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          expandedItems: [],
        });

        view.setProps({ expandedItems: ['1'] });
        expect(view.isItemExpanded('1')).to.equal(true);
      });

      it('should call the onExpandedItemsChange callback when the model is updated (add expanded item to empty list)', () => {
        const onExpandedItemsChange = spy();

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          onExpandedItemsChange,
        });

        fireEvent.click(view.getItemContent('1'));

        expect(onExpandedItemsChange.callCount).to.equal(1);
        expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal(['1']);
      });

      it('should call the onExpandedItemsChange callback when the model is updated (add expanded item to non-empty list)', () => {
        const onExpandedItemsChange = spy();

        const view = render({
          items: [
            { id: '1', children: [{ id: '1.1' }] },
            { id: '2', children: [{ id: '2.1' }] },
          ],
          onExpandedItemsChange,
          defaultExpandedItems: ['1'],
        });

        fireEvent.click(view.getItemContent('2'));

        expect(onExpandedItemsChange.callCount).to.equal(1);
        expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal(['2', '1']);
      });

      it('should call the onExpandedItemsChange callback when the model is updated (remove expanded item)', () => {
        const onExpandedItemsChange = spy();

        const view = render({
          items: [
            { id: '1', children: [{ id: '1.1' }] },
            { id: '2', children: [{ id: '2.1' }] },
          ],
          onExpandedItemsChange,
          defaultExpandedItems: ['1'],
        });

        fireEvent.click(view.getItemContent('1'));

        expect(onExpandedItemsChange.callCount).to.equal(1);
        expect(onExpandedItemsChange.lastCall.args[1]).to.deep.equal([]);
      });

      it('should warn when switching from controlled to uncontrolled', () => {
        const view = render({
          items: [{ id: '1' }],
          expandedItems: [],
        });

        expect(() => {
          view.setProps({ expandedItems: undefined });
        }).toErrorDev(
          'MUI X: A component is changing the controlled expandedItems state of TreeView to be uncontrolled.',
        );
      });

      it('should warn and not react to update when updating the default state', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          defaultExpandedItems: ['1'],
        });

        expect(() => {
          view.setProps({ defaultExpandedItems: ['2'] });
          expect(view.isItemExpanded('1')).to.equal(true);
          expect(view.isItemExpanded('2')).to.equal(false);
        }).toErrorDev(
          'MUI X: A component is changing the default expandedItems state of an uncontrolled TreeView after being initialized. To suppress this warning opt to use a controlled TreeView.',
        );
      });
    });

    describe('item click interaction', () => {
      it('should expand collapsed item when clicking on an item content', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        fireEvent.click(view.getItemContent('1'));
        expect(view.isItemExpanded('1')).to.equal(true);
      });

      it('should collapse expanded item when clicking on an item content', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          defaultExpandedItems: ['1'],
        });

        expect(view.isItemExpanded('1')).to.equal(true);
        fireEvent.click(view.getItemContent('1'));
        expect(view.isItemExpanded('1')).to.equal(false);
      });

      it('should not expand collapsed item when clicking on a disabled item content', () => {
        const view = render({
          items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        fireEvent.click(view.getItemContent('1'));
        expect(view.isItemExpanded('1')).to.equal(false);
      });

      it('should not collapse expanded item when clicking on a disabled item', () => {
        const view = render({
          items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
          defaultExpandedItems: ['1'],
        });

        expect(view.isItemExpanded('1')).to.equal(true);
        fireEvent.click(view.getItemContent('1'));
        expect(view.isItemExpanded('1')).to.equal(true);
      });

      it('should expand collapsed item when clicking on an item label', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        fireEvent.click(view.getItemLabel('1'));
        expect(view.isItemExpanded('1')).to.equal(true);
      });

      it('should expand collapsed item when clicking on an item icon container', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        fireEvent.click(view.getItemIconContainer('1'));
        expect(view.isItemExpanded('1')).to.equal(true);
      });

      it('should be able to limit the expansion to the icon', function test() {
        // This test is not relevant for the TreeItem component.
        // We could create the equivalent test for it,
        // but it's not worth the effort given the complexity of the old behavior override.
        if (!setup.includes('TreeItem2')) {
          this.skip();
        }

        const CustomTreeItem = React.forwardRef(function MyTreeItem(
          props: TreeItem2Props,
          ref: React.Ref<HTMLLIElement>,
        ) {
          const { interactions } = useTreeItem2Utils({
            itemId: props.itemId,
            children: props.children,
          });

          const handleContentClick: UseTreeItem2ContentSlotOwnProps['onClick'] = (event) => {
            event.defaultMuiPrevented = true;
            interactions.handleSelection(event);
          };

          const handleIconContainerClick = (event: React.MouseEvent) => {
            interactions.handleExpansion(event);
          };

          return (
            <TreeItem2
              {...props}
              ref={ref}
              slotProps={{
                content: { onClick: handleContentClick },
                iconContainer: { onClick: handleIconContainerClick },
              }}
            />
          );
        });

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          slots: { item: CustomTreeItem },
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        fireEvent.click(view.getItemContent('1'));
        expect(view.isItemExpanded('1')).to.equal(false);
        fireEvent.click(view.getItemIconContainer('1'));
        expect(view.isItemExpanded('1')).to.equal(true);
      });
    });

    // The `aria-expanded` attribute is used by the `response.isItemExpanded` method.
    // This `describe` only tests basics scenarios, more complex scenarios are tested in this file's other `describe`.
    describe('aria-expanded item attribute', () => {
      it('should have the attribute `aria-expanded=false` if collapsed', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
        });

        expect(view.getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
      });

      it('should have the attribute `aria-expanded=true` if expanded', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
        });

        expect(view.getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      });

      it('should not have the attribute `aria-expanded` if no children are present', () => {
        const view = render({
          items: [{ id: '1' }],
        });

        expect(view.getItemRoot('1')).not.to.have.attribute('aria-expanded');
      });
    });

    describe('onItemExpansionToggle prop', () => {
      it('should call the onItemExpansionToggle callback when expanding an item', () => {
        const onItemExpansionToggle = spy();

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          onItemExpansionToggle,
        });

        fireEvent.click(view.getItemContent('1'));
        expect(onItemExpansionToggle.callCount).to.equal(1);
        expect(onItemExpansionToggle.lastCall.args[1]).to.equal('1');
        expect(onItemExpansionToggle.lastCall.args[2]).to.equal(true);
      });

      it('should call the onItemExpansionToggle callback when collapsing an item', () => {
        const onItemExpansionToggle = spy();

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
          onItemExpansionToggle,
        });

        fireEvent.click(view.getItemContent('1'));
        expect(onItemExpansionToggle.callCount).to.equal(1);
        expect(onItemExpansionToggle.lastCall.args[1]).to.equal('1');
        expect(onItemExpansionToggle.lastCall.args[2]).to.equal(false);
      });
    });

    describe('setItemExpansion api method', () => {
      it('should expand a collapsed item when calling the setItemExpansion method with `isExpanded=true`', () => {
        const onItemExpansionToggle = spy();

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          onItemExpansionToggle,
        });

        act(() => {
          view.apiRef.current.setItemExpansion({} as any, '1', true);
        });

        expect(view.isItemExpanded('1')).to.equal(true);
        expect(onItemExpansionToggle.callCount).to.equal(1);
        expect(onItemExpansionToggle.lastCall.args[1]).to.equal('1');
        expect(onItemExpansionToggle.lastCall.args[2]).to.equal(true);
      });

      it('should collapse an expanded item when calling the setItemExpansion method with `isExpanded=false`', () => {
        const onItemExpansionToggle = spy();

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
          onItemExpansionToggle,
        });

        act(() => {
          view.apiRef.current.setItemExpansion({} as any, '1', false);
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(onItemExpansionToggle.callCount).to.equal(1);
        expect(onItemExpansionToggle.lastCall.args[1]).to.equal('1');
        expect(onItemExpansionToggle.lastCall.args[2]).to.equal(false);
      });

      it('should do nothing when calling the setItemExpansion method with `isExpanded=true` on an already expanded item', () => {
        const onItemExpansionToggle = spy();

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
          onItemExpansionToggle,
        });

        act(() => {
          view.apiRef.current.setItemExpansion({} as any, '1', true);
        });

        expect(view.isItemExpanded('1')).to.equal(true);
        expect(onItemExpansionToggle.callCount).to.equal(0);
      });

      it('should do nothing when calling the setItemExpansion method with `isExpanded=false` on an already collapsed item', () => {
        const onItemExpansionToggle = spy();

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          onItemExpansionToggle,
        });

        act(() => {
          view.apiRef.current.setItemExpansion({} as any, '1', false);
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(onItemExpansionToggle.callCount).to.equal(0);
      });
    });
  },
);
