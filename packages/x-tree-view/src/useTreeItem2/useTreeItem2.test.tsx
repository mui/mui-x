import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent } from '@mui/monorepo/packages/test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { UseTreeViewExpansionSignature } from '@mui/x-tree-view/internals';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';

describeTreeView<[UseTreeViewExpansionSignature]>(
  'useTreeItem2 hook',
  ({ render, treeItemComponentName }) => {
    describe('role prop', () => {
      it('should have the role="treeitem" on the root slot', () => {
        const response = render({ items: [{ id: '1' }] });

        expect(response.getItemRoot('1')).to.have.attribute('role', 'treeitem');
      });

      it('should have the role "group" on the groupTransition slot if the item is expandable', () => {
        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
        });

        expect(
          response.getItemRoot('1').querySelector(`.${treeItemClasses.groupTransition}`),
        ).to.have.attribute('role', 'group');
      });
    });

    describe('onClick prop', () => {
      it('should call onClick when clicked, but not when children are clicked for TreeItem', () => {
        const onClick = spy();

        const response = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
          slotProps: {
            item: {
              onClick,
            },
          },
        });

        fireEvent.click(response.getItemContent('1.1'));
        expect(onClick.callCount).to.equal(treeItemComponentName === 'TreeItem' ? 1 : 2);
        expect(onClick.lastCall.firstArg.target.parentElement.dataset.testid).to.equal('1.1');
      });

      it('should call onClick even when the element is disabled', () => {
        const onClick = spy();

        const response = render({
          items: [{ id: '1', disabled: true }],
          slotProps: {
            item: {
              onClick,
            },
          },
        });

        fireEvent.click(response.getItemContent('1'));
        expect(onClick.callCount).to.equal(1);
      });
    });
  },
);
