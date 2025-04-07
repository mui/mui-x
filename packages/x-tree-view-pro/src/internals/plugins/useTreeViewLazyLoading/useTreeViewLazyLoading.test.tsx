import { expect } from 'chai';
import { act, fireEvent } from '@mui/internal-test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { UseTreeViewLazyLoadingSignature } from '@mui/x-tree-view/internals';

type ItemType = TreeViewBaseItem<{
  id: string;
  label: string;
  childrenCount?: number;
}>;

const mockFetchData = async (): Promise<ItemType[]> => {
  const items = [
    {
      id: Math.random().toString(),
      label: Math.random().toString(),
      childrenCount: 1,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(items);
    }, 1000);
  });
};

describeTreeView<[UseTreeViewLazyLoadingSignature]>(
  'useTreeViewLabel plugin',
  ({ render, treeViewComponentName }) => {
    if (treeViewComponentName === 'SimpleTreeView' || treeViewComponentName === 'RichTreeView') {
      return;
    }
    describe('interaction', () => {
      it('should load children when expanding an item', async () => {
        const view = render({
          items: [{ id: '1', label: 'Item 1', childrenCount: 1 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);

        fireEvent.click(view.getItemContent('1'));

        // Wait for the mock fetch to complete
        await act(async () => {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 1000);
          });
        });

        expect(view.isItemExpanded('1')).to.equal(true);
        expect(view.getAllTreeItemIds().length).to.be.greaterThan(1);
      });

      it('should not load children if item has no children', async () => {
        const view = render({
          items: [{ id: '1', label: 'Item 1', childrenCount: 0 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);

        fireEvent.click(view.getItemContent('1'));

        // Wait for the mock fetch to complete
        await act(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);
      });

      it('should handle errors during fetching', async () => {
        const errorFetchData = async (): Promise<ItemType[]> => {
          return new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Failed to fetch data'));
            }, 1000);
          });
        };

        const view = render({
          items: [{ id: '1', label: 'Item 1', childrenCount: 1 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: errorFetchData,
          },
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);

        fireEvent.click(view.getItemContent('1'));

        // Wait for the mock fetch to complete
        await act(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);
      });
    });
  },
);
