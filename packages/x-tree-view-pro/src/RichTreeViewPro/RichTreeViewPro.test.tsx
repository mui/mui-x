import * as React from 'react';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import {
  RichTreeViewPro,
  richTreeViewProClasses as classes,
} from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeItemLoader } from '@mui/x-tree-view/TreeItemLoader';
import { describeConformance } from 'test/utils/describeConformance';
import { describe, it, expect } from 'vitest';

interface ItemType {
  id: string;
  label?: string;
  childrenCount?: number;
}

describe('<RichTreeViewPro />', () => {
  const { render } = createRenderer();

  describeConformance(<RichTreeViewPro items={[]} disableVirtualization />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiRichTreeViewPro',
    skip: ['componentProp', 'themeVariants'],
  }));

  it('should pass the id prop to the root element', () => {
    render(
      <RichTreeViewPro id="test-id" items={[{ id: '1', label: 'Item 1' }]} disableVirtualization />,
    );

    expect(screen.getByRole('tree')).to.have.attribute('id', 'test-id');
  });

  describe('loading prop', () => {
    it('should render 5 item loaders by default', () => {
      render(<RichTreeViewPro items={[]} loading disableVirtualization />);

      expect(screen.getAllByRole('treeitem')).to.have.length(5);
    });

    it('should render the number of item loaders specified by `slotProps.loading.itemsCount`', () => {
      render(
        <RichTreeViewPro
          items={[]}
          loading
          slotProps={{ loading: { itemsCount: 3 } }}
          disableVirtualization
        />,
      );

      expect(screen.getAllByRole('treeitem')).to.have.length(3);
    });

    it('should mark item loaders as disabled via aria-disabled', () => {
      render(<RichTreeViewPro items={[]} loading disableVirtualization />);

      screen.getAllByRole('treeitem').forEach((item) => {
        expect(item).to.have.attribute('aria-disabled', 'true');
      });
    });

    it('should not forward `loading` to the DOM', () => {
      render(
        <RichTreeViewPro
          items={[{ id: '1', label: 'Item 1' }]}
          loading={false}
          disableVirtualization
        />,
      );

      const tree = screen.getByRole('tree');
      expect(tree).not.to.have.attribute('loading');
    });
  });

  describe('loading prop + lazy loading (dataSource)', () => {
    it('should show the loading UI while the root items are being fetched by dataSource', async () => {
      let resolveRootFetch!: (items: ItemType[]) => void;
      const getTreeItems = () =>
        new Promise<ItemType[]>((resolve) => {
          resolveRootFetch = resolve;
        });

      render(
        <RichTreeViewPro
          items={[]}
          disableVirtualization
          dataSource={{
            getChildrenCount: (item) => item?.childrenCount ?? 0,
            getTreeItems,
          }}
        />,
      );

      // Root fetch is in-flight — expect the default 5 loading rows, not a real tree
      expect(screen.getByRole('tree')).to.have.attribute('aria-busy', 'true');
      expect(screen.getAllByRole('treeitem')).to.have.length(5);

      // Resolve the fetch and wait for the state update
      await act(async () => {
        resolveRootFetch([{ id: '1', label: 'Item 1', childrenCount: 0 }]);
      });

      // Real tree should now be visible
      await waitFor(() => {
        expect(screen.getByRole('treeitem', { name: 'Item 1' })).not.to.equal(null);
      });
      expect(screen.getByRole('tree')).not.to.have.attribute('aria-busy');
    });

    it('should keep the loading UI visible when both loading and dataSource root fetch are active', async () => {
      let resolveRootFetch!: (items: ItemType[]) => void;
      const getTreeItems = () =>
        new Promise<ItemType[]>((resolve) => {
          resolveRootFetch = resolve;
        });

      const { setProps } = render(
        <RichTreeViewPro
          items={[]}
          loading
          disableVirtualization
          dataSource={{
            getChildrenCount: (item) => item?.childrenCount ?? 0,
            getTreeItems,
          }}
        />,
      );

      // Both `loading` and the in-flight fetch indicate loading — loading UI shown
      expect(screen.getByRole('tree')).to.have.attribute('aria-busy', 'true');

      // Resolve the fetch — but `loading` prop is still true
      await act(async () => {
        resolveRootFetch([{ id: '1', label: 'Item 1', childrenCount: 0 }]);
      });

      expect(screen.getByRole('tree')).to.have.attribute('aria-busy', 'true');

      // Clear the loading prop — tree should finally appear
      act(() => {
        setProps({ loading: false });
      });

      await waitFor(() => {
        expect(screen.getByRole('tree')).not.to.have.attribute('aria-busy');
      });
      expect(screen.getByRole('treeitem', { name: 'Item 1' })).not.to.equal(null);
    });

    it('should render an error Alert instead of the loading UI when the root dataSource fetch fails', async () => {
      const getTreeItems = () =>
        new Promise<ItemType[]>((resolve, reject) => {
          reject(new Error('Failed to fetch root items'));
        });

      render(
        <RichTreeViewPro
          items={[]}
          disableVirtualization
          dataSource={{
            getChildrenCount: (item) => item?.childrenCount ?? 0,
            getTreeItems,
          }}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch root items')).not.to.equal(null);
      });
      expect(screen.queryByRole('tree')).to.equal(null);
    });

    it('should render the error Alert even when `loading` is still true', async () => {
      const getTreeItems = () =>
        new Promise<ItemType[]>((resolve, reject) => {
          reject(new Error('Failed to fetch root items'));
        });

      render(
        <RichTreeViewPro
          items={[]}
          loading
          disableVirtualization
          dataSource={{
            getChildrenCount: (item) => item?.childrenCount ?? 0,
            getTreeItems,
          }}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch root items')).not.to.equal(null);
      });
      expect(screen.queryByRole('tree')).to.equal(null);
    });

    it('should render the `loading` slot for the children of a lazily loading item', async () => {
      let resolveChildrenFetch!: (items: ItemType[]) => void;
      const getTreeItems = (parentId?: string | null) => {
        if (parentId == null) {
          return Promise.resolve([{ id: '1', label: 'Item 1', childrenCount: 3 }]);
        }
        return new Promise<ItemType[]>((resolve) => {
          resolveChildrenFetch = resolve;
        });
      };

      function CustomLoading(props: { itemsCount?: number }) {
        return (
          <React.Fragment>
            {Array.from({ length: props.itemsCount ?? 0 }, (_, index) => (
              <TreeItemLoader key={index}>
                <span data-testid="custom-loading-row-content" />
              </TreeItemLoader>
            ))}
          </React.Fragment>
        );
      }

      render(
        <RichTreeViewPro
          items={[]}
          disableVirtualization
          domStructure="nested"
          defaultExpandedItems={['1']}
          slots={{ loading: CustomLoading }}
          dataSource={{
            getChildrenCount: (item) => item?.childrenCount ?? 0,
            getTreeItems,
          }}
        />,
      );

      // Root items arrive, the children of the expanded item start loading.
      await waitFor(() => {
        expect(screen.getByRole('treeitem', { name: 'Item 1' })).not.to.equal(null);
      });

      // The `loading` slot renders one row per child reported by `getChildrenCount()`.
      const loadingRowContents = await screen.findAllByTestId('custom-loading-row-content');
      expect(loadingRowContents).to.have.length(3);
      loadingRowContents.forEach((content) => {
        const row = content.closest('li')!;
        expect(row).to.have.attribute('role', 'treeitem');
        expect(row.style.getPropertyValue('--TreeView-itemDepth')).to.equal('1');
      });

      await act(async () => {
        resolveChildrenFetch([
          { id: '1.1', label: 'Item 1.1', childrenCount: 0 },
          { id: '1.2', label: 'Item 1.2', childrenCount: 0 },
          { id: '1.3', label: 'Item 1.3', childrenCount: 0 },
        ]);
      });

      await waitFor(() => {
        expect(screen.getByRole('treeitem', { name: 'Item 1.1' })).not.to.equal(null);
      });
      expect(screen.queryByTestId('custom-loading-row-content')).to.equal(null);
    });
  });
});
