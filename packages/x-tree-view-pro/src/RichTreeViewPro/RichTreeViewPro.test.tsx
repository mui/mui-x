import * as React from 'react';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import {
  RichTreeViewPro,
  richTreeViewProClasses as classes,
} from '@mui/x-tree-view-pro/RichTreeViewPro';
import { describeConformance } from 'test/utils/describeConformance';

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
    it('should render 5 skeleton items by default', () => {
      render(<RichTreeViewPro items={[]} loading disableVirtualization />);

      expect(screen.getAllByRole('treeitem')).to.have.length(5);
    });

    it('should render the number of skeleton items specified by loadingItemsCount', () => {
      render(<RichTreeViewPro items={[]} loading loadingItemsCount={3} disableVirtualization />);

      expect(screen.getAllByRole('treeitem')).to.have.length(3);
    });

    it('should mark skeleton items as disabled via aria-disabled', () => {
      render(<RichTreeViewPro items={[]} loading disableVirtualization />);

      screen.getAllByRole('treeitem').forEach((item) => {
        expect(item).to.have.attribute('aria-disabled', 'true');
      });
    });

    it('should not forward `loading` and `loadingItemsCount` to the DOM', () => {
      render(
        <RichTreeViewPro
          items={[{ id: '1', label: 'Item 1' }]}
          loading={false}
          loadingItemsCount={3}
          disableVirtualization
        />,
      );

      const tree = screen.getByRole('tree');
      expect(tree).not.to.have.attribute('loading');
      expect(tree).not.to.have.attribute('loadingitemscount');
    });
  });

  describe('loading prop + lazy loading (dataSource)', () => {
    it('should show the skeleton while the root items are being fetched by dataSource', async () => {
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

      // Root fetch is in-flight — expect the default 5-row skeleton, not a real tree
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

    it('should keep the skeleton visible when both loading and dataSource root fetch are active', async () => {
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

      // Both `loading` and the in-flight fetch indicate loading — skeleton shown
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

    it('should render an error Alert instead of the skeleton when the root dataSource fetch fails', async () => {
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
  });
});
