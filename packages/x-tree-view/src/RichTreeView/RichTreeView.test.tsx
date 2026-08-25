import * as React from 'react';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
import { RichTreeView, richTreeViewClasses as classes } from '@mui/x-tree-view/RichTreeView';
import { describeConformance } from 'test/utils/describeConformance';
import { describe, it, expect } from 'vitest';

const ITEMS = [
  { id: '1', label: 'Item 1' },
  { id: '2', label: 'Item 2' },
  { id: '3', label: 'Item 3' },
];

describe('<RichTreeView />', () => {
  const { render } = createRenderer();

  describeConformance(<RichTreeView items={[]} />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiRichTreeView',
    skip: ['componentProp', 'themeVariants'],
  }));

  it('should pass the id prop to the root element', () => {
    render(<RichTreeView id="test-id" items={[{ id: '1', label: 'Item 1' }]} />);

    expect(screen.getByRole('tree')).to.have.attribute('id', 'test-id');
  });

  describe('loading prop', () => {
    it('should not render tree items when loading', () => {
      render(<RichTreeView items={ITEMS} loading />);

      expect(screen.getByRole('tree')).to.have.attribute('aria-busy', 'true');
      expect(screen.queryByRole('treeitem', { name: 'Item 1' })).to.equal(null);
    });

    it('should render 5 skeleton items by default', () => {
      render(<RichTreeView items={[]} loading />);

      const skeletonItems = screen.getAllByRole('treeitem');
      expect(skeletonItems).to.have.length(5);
    });

    it('should render the number of skeleton items specified by loadingItemsCount', () => {
      render(<RichTreeView items={[]} loading loadingItemsCount={3} />);

      const skeletonItems = screen.getAllByRole('treeitem');
      expect(skeletonItems).to.have.length(3);
    });

    it('should render tree items when loading changes to false', () => {
      const { setProps } = render(<RichTreeView items={ITEMS} loading />);

      expect(screen.getByRole('tree')).to.have.attribute('aria-busy', 'true');

      act(() => {
        setProps({ loading: false });
      });

      expect(screen.getByRole('tree')).not.to.have.attribute('aria-busy');
      expect(screen.getAllByRole('treeitem')).to.have.length(ITEMS.length);
    });

    it('should mark skeleton items as disabled via aria-disabled', () => {
      render(<RichTreeView items={[]} loading />);

      const skeletonItems = screen.getAllByRole('treeitem');
      skeletonItems.forEach((item) => {
        expect(item).to.have.attribute('aria-disabled', 'true');
      });
    });

    it('should preserve the id prop on the skeleton root', () => {
      render(<RichTreeView items={[]} loading id="my-tree" />);

      expect(screen.getByRole('tree')).to.have.attribute('id', 'my-tree');
    });

    it('should preserve the className prop on the skeleton root', () => {
      render(<RichTreeView items={[]} loading className="my-tree" />);

      expect(screen.getByRole('tree')).to.have.class('my-tree');
      expect(screen.getByRole('tree')).to.have.class(classes.root);
    });

    it('should render tree items when loading changes from false to true', () => {
      const { setProps } = render(<RichTreeView items={ITEMS} loading={false} />);

      expect(screen.getAllByRole('treeitem')).to.have.length(ITEMS.length);

      act(() => {
        setProps({ loading: true });
      });

      expect(screen.getByRole('tree')).to.have.attribute('aria-busy', 'true');
      expect(screen.queryByRole('treeitem', { name: 'Item 1' })).to.equal(null);
    });

    it('should render an empty tree when loading is false and items is empty', () => {
      render(<RichTreeView items={[]} loading={false} />);

      expect(screen.getByRole('tree')).not.to.have.attribute('aria-busy');
      expect(screen.queryAllByRole('treeitem')).to.have.length(0);
    });

    it('should not forward `loading` and `loadingItemsCount` to the DOM', () => {
      render(<RichTreeView items={ITEMS} loading={false} loadingItemsCount={3} />);

      const tree = screen.getByRole('tree');
      expect(tree).not.to.have.attribute('loading');
      expect(tree).not.to.have.attribute('loadingitemscount');
    });
  });
});
