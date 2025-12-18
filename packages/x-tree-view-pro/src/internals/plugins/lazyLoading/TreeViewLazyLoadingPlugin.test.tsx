import { act, fireEvent, screen } from '@mui/internal-test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { RichTreeViewProStore } from '../../RichTreeViewProStore';

interface ItemType {
  id: string;
  childrenCount?: number;
  children?: ItemType[];
}

const mockFetchData = async (parentId): Promise<ItemType[]> => {
  const items = [
    {
      id: parentId == null ? '1' : `${parentId}-1`,
      childrenCount: 1,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(items), 0);
  });
};

async function awaitMockFetch() {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });
  });
}

describeTreeView<RichTreeViewProStore<any, any>>(
  'TreeViewLazyLoadingPlugin',
  ({ render, treeViewComponentName }) => {
    if (treeViewComponentName === 'SimpleTreeView' || treeViewComponentName === 'RichTreeView') {
      return;
    }

    describe('interaction', () => {
      it('should load children when expanding an item', async () => {
        const view = render({
          items: [{ id: '1', childrenCount: 1 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);

        fireEvent.click(view.getItemContent('1'));
        await awaitMockFetch();
        expect(view.isItemExpanded('1')).to.equal(true);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1-1']);
      });

      it('should not load children if item has no children', async () => {
        const view = render({
          items: [{ id: '1', childrenCount: 0 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);

        fireEvent.click(view.getItemContent('1'));
        await awaitMockFetch();
        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);
      });

      it('should load children if item has unknown children count', async () => {
        const view = render({
          items: [{ id: '1', childrenCount: -1 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);

        fireEvent.click(view.getItemContent('1'));
        await awaitMockFetch();
        expect(view.isItemExpanded('1')).to.equal(true);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1-1']);
      });

      it('should handle errors during fetching', async () => {
        const errorFetchData = async (): Promise<ItemType[]> => {
          return new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Failed to fetch data'));
            }, 0);
          });
        };

        const view = render({
          items: [{ id: '1', childrenCount: 1 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: errorFetchData,
          },
        });

        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);

        fireEvent.click(view.getItemContent('1'));
        await awaitMockFetch();
        expect(view.isItemExpanded('1')).to.equal(false);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);
      });

      it('should load expanded items on mount', async () => {
        const view = render({
          items: [{ id: '1', childrenCount: 1 }],
          defaultExpandedItems: ['1'],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        await awaitMockFetch();
        await screen.findByText('1-1');
        expect(view.isItemExpanded('1')).to.equal(true);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1-1']);
      });

      it('should load expanded items on mount (deeper items)', async () => {
        const view = render({
          items: [{ id: '1', childrenCount: 1, children: [{ id: '1-1' }] }],
          defaultExpandedItems: ['1', '1-1', '1-1-1'],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        await awaitMockFetch();
        await screen.findByText('1-1-1-1');
        expect(view.isItemExpanded('1')).to.equal(true);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1-1', '1-1-1', '1-1-1-1']);
      });

      it('should use the data from props.items on mount', () => {
        const view = render({
          items: [{ id: '1', childrenCount: 1, children: [{ id: '1-1' }] }],
          defaultExpandedItems: ['1'],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        expect(view.isItemExpanded('1')).to.equal(true);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1-1']);
      });

      it('should allow to mix props.items and fetched items on mount', async () => {
        const view = render({
          items: [
            { id: '1', childrenCount: 1, children: [{ id: '1-1' }] },
            { id: '2', childrenCount: 1 },
          ],
          defaultExpandedItems: ['1', '2'],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        expect(view.isItemExpanded('1')).to.equal(true);
        expect(view.isItemExpanded('2')).to.equal(true);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1-1', '2']);

        await awaitMockFetch();
        expect(view.isItemExpanded('1')).to.equal(true);
        expect(view.isItemExpanded('2')).to.equal(true);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1-1', '2', '2-1']);
      });
    });
    describe('updateItemChildren', () => {
      it('should refresh root children when updateItemChildren is called with null', async () => {
        const view = render({
          items: [{ id: 'initial', childrenCount: 0 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        expect(view.getAllTreeItemIds()).to.deep.equal(['initial']);

        await act(async () => {
          await view.apiRef.current.updateItemChildren(null);
        });

        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);
      });
      it('should refresh specific item children when updateItemChildren is called with an id', async () => {
        const view = render({
          items: [{ id: '1', childrenCount: 1 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
        });

        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);

        await act(async () => {
          await view.apiRef.current.updateItemChildren('1');
        });
        await awaitMockFetch();
        fireEvent.click(view.getItemContent('1'));
        await awaitMockFetch();

        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1-1']);
      });
    });
  },
);
