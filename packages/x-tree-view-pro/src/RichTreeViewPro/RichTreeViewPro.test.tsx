import * as React from 'react';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
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

      // Root fetch is in-flight — expect skeleton, not a real tree
      expect(screen.queryByRole('tree')).to.equal(null);
      expect(screen.getAllByRole('treeitem').length).to.be.greaterThan(0);

      // Resolve the fetch and wait for the state update
      await act(async () => {
        resolveRootFetch([{ id: '1', label: 'Item 1', childrenCount: 0 }]);
        await new Promise((r) => {
          setTimeout(r, 1);
        });
      });

      // Real tree should now be visible
      expect(screen.getByRole('tree')).not.to.equal(null);
      expect(screen.getByRole('treeitem', { name: 'Item 1' })).not.to.equal(null);
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
      expect(screen.queryByRole('tree')).to.equal(null);

      // Resolve the fetch — but `loading` prop is still true
      await act(async () => {
        resolveRootFetch([{ id: '1', label: 'Item 1', childrenCount: 0 }]);
        await new Promise((r) => {
          setTimeout(r, 1);
        });
      });

      expect(screen.queryByRole('tree')).to.equal(null);

      // Clear the loading prop — tree should finally appear
      act(() => {
        setProps({ loading: false });
      });

      expect(screen.getByRole('tree')).not.to.equal(null);
    });
  });
});
