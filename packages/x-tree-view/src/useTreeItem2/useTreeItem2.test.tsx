import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { act, createEvent, fireEvent, screen } from '@mui/internal-test-utils';
import {
  describeTreeView,
  DescribeTreeViewRendererUtils,
} from 'test/utils/tree-view/describeTreeView';
import {
  UseTreeViewExpansionSignature,
  UseTreeViewIconsSignature,
} from '@mui/x-tree-view/internals';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';

describeTreeView<[UseTreeViewExpansionSignature, UseTreeViewIconsSignature]>(
  'useTreeItem2 hook',
  ({
    render,
    renderFromJSX,
    treeItemComponentName,
    TreeItemComponent,
    treeViewComponentName,
    TreeViewComponent,
  }) => {
    describe('role prop', () => {
      it('should have the role="treeitem" on the root slot', () => {
        const view = render({ items: [{ id: '1' }] });

        expect(view.getItemRoot('1')).to.have.attribute('role', 'treeitem');
      });

      it('should have the role "group" on the groupTransition slot if the item is expandable', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
        });

        expect(
          view.getItemRoot('1').querySelector(`.${treeItemClasses.groupTransition}`),
        ).to.have.attribute('role', 'group');
      });
    });

    describe('onClick prop', () => {
      it('should call onClick when clicked, but not when children are clicked for TreeItem', () => {
        const onClick = spy();

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
          slotProps: {
            item: {
              onClick,
            },
          },
        });

        fireEvent.click(view.getItemContent('1.1'));
        expect(onClick.callCount).to.equal(treeItemComponentName === 'TreeItem' ? 1 : 2);
        expect(onClick.lastCall.firstArg.target.parentElement.dataset.testid).to.equal('1.1');
      });

      it('should call onClick even when the element is disabled', () => {
        const onClick = spy();

        const view = render({
          items: [{ id: '1', disabled: true }],
          slotProps: {
            item: {
              onClick,
            },
          },
        });

        fireEvent.click(view.getItemContent('1'));
        expect(onClick.callCount).to.equal(1);
      });
    });

    it('should be able to type in a child input', () => {
      const view = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        defaultExpandedItems: ['1'],
        slotProps:
          treeItemComponentName === 'TreeItem2'
            ? {
                item: {
                  slots: {
                    label: () => <input type="text" className="icon-input " />,
                  },
                },
              }
            : {
                item: {
                  label: <input type="text" className="icon-input " />,
                },
              },
      });

      const input = view.getItemRoot('1.1').querySelector('.icon-input')!;
      const keydownEvent = createEvent.keyDown(input, {
        key: 'a',
      });

      const handlePreventDefault = spy();
      keydownEvent.preventDefault = handlePreventDefault;
      fireEvent(input, keydownEvent);
      expect(handlePreventDefault.callCount).to.equal(0);
    });

    it('should not focus steal', () => {
      let setActiveItemMounted;
      // a TreeItem whose mounted state we can control with `setActiveItemMounted`
      function ConditionallyMountedItem(props) {
        const [mounted, setMounted] = React.useState(true);
        if (props.itemId === '2') {
          setActiveItemMounted = setMounted;
        }

        if (!mounted) {
          return null;
        }
        return <TreeItemComponent {...props} />;
      }

      let view: DescribeTreeViewRendererUtils;
      if (treeViewComponentName === 'SimpleTreeView') {
        view = renderFromJSX(
          <React.Fragment>
            <button type="button">Some focusable element</button>
            <TreeViewComponent>
              <ConditionallyMountedItem itemId="1" label="1" data-testid="1" />
              <ConditionallyMountedItem itemId="2" label="2" data-testid="2" />
            </TreeViewComponent>
          </React.Fragment>,
        );
      } else {
        view = renderFromJSX(
          <React.Fragment>
            <button type="button">Some focusable element</button>
            <TreeViewComponent
              items={[{ id: '1' }, { id: '2' }]}
              slots={{
                item: ConditionallyMountedItem,
              }}
              slotProps={{
                item: (ownerState) => ({ 'data-testid': ownerState.itemId }) as any,
              }}
              getItemLabel={(item) => item.id}
            />
          </React.Fragment>,
        );
      }

      act(() => {
        view.getItemRoot('2').focus();
      });

      expect(view.getFocusedItemId()).to.equal('2');

      act(() => {
        screen.getByRole('button').focus();
      });

      expect(screen.getByRole('button')).toHaveFocus();

      act(() => {
        setActiveItemMounted(false);
      });
      act(() => {
        setActiveItemMounted(true);
      });

      expect(screen.getByRole('button')).toHaveFocus();
    });
  },
);
