import { act, fireEvent, screen } from '@mui/internal-test-utils';
import { spy } from 'sinon';
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
    describe('onItemsLazyLoaded', () => {
      it('should call onItemsLazyLoaded with (items, null) when root items are fetched', async () => {
        const onItemsLazyLoaded = spy();
        render({
          items: [],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
          onItemsLazyLoaded,
        });

        await awaitMockFetch();
        expect(onItemsLazyLoaded.callCount).to.equal(1);
        expect(onItemsLazyLoaded.lastCall.args[0]).to.deep.equal([{ id: '1', childrenCount: 1 }]);
        expect(onItemsLazyLoaded.lastCall.args[1]).to.equal(null);
      });

      it('should call onItemsLazyLoaded with (items, parentId) when child items are fetched', async () => {
        const onItemsLazyLoaded = spy();
        const view = render({
          items: [{ id: '1', childrenCount: 1 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
          onItemsLazyLoaded,
        });

        expect(onItemsLazyLoaded.callCount).to.equal(0);

        fireEvent.click(view.getItemContent('1'));
        await awaitMockFetch();
        expect(onItemsLazyLoaded.callCount).to.equal(1);
        expect(onItemsLazyLoaded.lastCall.args[0]).to.deep.equal([{ id: '1-1', childrenCount: 1 }]);
        expect(onItemsLazyLoaded.lastCall.args[1]).to.equal('1');
      });

      it('should call onItemsLazyLoaded on cache hit when the same item is expanded again', async () => {
        const onItemsLazyLoaded = spy();
        const view = render({
          items: [{ id: '1', childrenCount: 1 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: mockFetchData,
          },
          onItemsLazyLoaded,
        });

        // First expansion — server fetch
        fireEvent.click(view.getItemContent('1'));
        await awaitMockFetch();
        expect(onItemsLazyLoaded.callCount).to.equal(1);

        // Collapse
        fireEvent.click(view.getItemContent('1'));
        // Second expansion — cache hit
        fireEvent.click(view.getItemContent('1'));
        await awaitMockFetch();
        expect(onItemsLazyLoaded.callCount).to.equal(2);
        expect(onItemsLazyLoaded.lastCall.args[1]).to.equal('1');
      });

      it('should pre-cache inline nested children so expanding them requires no extra fetch', async () => {
        let fetchCount = 0;
        let view: ReturnType<typeof render>;
        const onItemsLazyLoaded = spy((items, _parentId) => {
          items.forEach((item) => {
            if (item.children && item.children.length > 0) {
              view.apiRef.current.setItemExpansion({
                event: {} as any,
                itemId: item.id,
                shouldBeExpanded: true,
              });
            }
          });
        });
        const fetchDataWithNested = async (parentId?: string): Promise<ItemType[]> => {
          fetchCount += 1;
          return new Promise((resolve) => {
            setTimeout(() => {
              if (parentId == null) {
                resolve([{ id: '1', childrenCount: 1 }]);
              } else {
                resolve([
                  {
                    id: `${parentId}-1`,
                    childrenCount: 1,
                    children: [{ id: `${parentId}-1-1`, childrenCount: 0 }],
                  },
                ]);
              }
            }, 0);
          });
        };

        view = render({
          items: [{ id: '1', childrenCount: 1 }],
          dataSource: {
            getChildrenCount: (item) => item?.childrenCount as number,
            getTreeItems: fetchDataWithNested,
          },
          onItemsLazyLoaded,
        });

        const fetchCountBefore = fetchCount;
        // Expand item '1' — fetches '1-1' (with nested '1-1-1')
        fireEvent.click(view.getItemContent('1'));
        await awaitMockFetch();
        // '1-1' should be auto-expanded from the callback without any additional fetch
        expect(fetchCount - fetchCountBefore).to.equal(1);
        expect(view.isItemExpanded('1-1')).to.equal(true);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1-1', '1-1-1']);
        // onItemsLazyLoaded should fire exactly once — not cascade for auto-expanded children
        expect(onItemsLazyLoaded.callCount).to.equal(1);
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
