import * as React from 'react';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
import { RichTreeView, richTreeViewClasses as classes } from '@mui/x-tree-view/RichTreeView';
import { describeConformance } from 'test/utils/describeConformance';

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

      expect(screen.queryByRole('tree')).to.equal(null);
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

      expect(screen.queryByRole('tree')).to.equal(null);

      act(() => {
        setProps({ loading: false });
      });

      expect(screen.getByRole('tree')).to.not.equal(null);
      expect(screen.getAllByRole('treeitem')).to.have.length(ITEMS.length);
    });

    it('should mark skeleton items as disabled via aria-disabled', () => {
      render(<RichTreeView items={[]} loading />);

      const skeletonItems = screen.getAllByRole('treeitem');
      skeletonItems.forEach((item) => {
        expect(item).to.have.attribute('aria-disabled');
      });
    });
  });
});
