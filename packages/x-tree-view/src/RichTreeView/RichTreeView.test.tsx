import * as React from 'react';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
import { RichTreeView, richTreeViewClasses as classes } from '@mui/x-tree-view/RichTreeView';
import type { RichTreeViewApiRef } from '@mui/x-tree-view/RichTreeView';
import { TreeItemLoader } from '@mui/x-tree-view/TreeItemLoader';
import type { TreeItemLoaderProps } from '@mui/x-tree-view/TreeItemLoader';
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

    it('should render 5 item loaders by default', () => {
      render(<RichTreeView items={[]} loading />);

      const itemLoaders = screen.getAllByRole('treeitem');
      expect(itemLoaders).to.have.length(5);
    });

    it('should render the number of item loaders specified by `slotProps.loading.itemsCount`', () => {
      render(<RichTreeView items={[]} loading slotProps={{ loading: { itemsCount: 3 } }} />);

      const itemLoaders = screen.getAllByRole('treeitem');
      expect(itemLoaders).to.have.length(3);
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

    it('should initialize apiRef on mount while loading', () => {
      const apiRef: RichTreeViewApiRef = { current: undefined };
      render(<RichTreeView items={[]} loading apiRef={apiRef} />);

      expect(apiRef.current).not.to.equal(undefined);
      expect(apiRef.current!.focusItem).to.be.a('function');
    });

    it('should mark item loaders as disabled via aria-disabled', () => {
      render(<RichTreeView items={[]} loading />);

      const itemLoaders = screen.getAllByRole('treeitem');
      itemLoaders.forEach((item) => {
        expect(item).to.have.attribute('aria-disabled', 'true');
      });
    });

    it('should preserve the id prop on the loading root', () => {
      render(<RichTreeView items={[]} loading id="my-tree" />);

      expect(screen.getByRole('tree')).to.have.attribute('id', 'my-tree');
    });

    it('should preserve the className prop on the loading root', () => {
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

    it('should apply itemHeight to the item loaders', () => {
      render(<RichTreeView items={[]} loading itemHeight={40} />);

      const itemLoaders = screen.getAllByRole('treeitem');
      itemLoaders.forEach((item) => {
        expect(item.style.getPropertyValue('--TreeView-itemHeight')).to.equal('40px');
      });
    });

    it('should not set the item height variable on the item loaders when itemHeight is not set', () => {
      render(<RichTreeView items={[]} loading />);

      const itemLoaders = screen.getAllByRole('treeitem');
      itemLoaders.forEach((item) => {
        expect(item.style.getPropertyValue('--TreeView-itemHeight')).to.equal('');
      });
    });

    it('should use "Loading" as the accessible name when the tree has no label', () => {
      render(<RichTreeView items={[]} loading />);

      expect(screen.getByRole('tree')).to.have.attribute('aria-label', 'Loading');
    });

    it('should keep the aria-label provided by the consumer while loading', () => {
      render(<RichTreeView items={[]} loading aria-label="Files" />);

      expect(screen.getByRole('tree')).to.have.attribute('aria-label', 'Files');
    });

    it('should not add an aria-label when the consumer provides aria-labelledby', () => {
      render(
        <React.Fragment>
          <span id="tree-label">Files</span>
          <RichTreeView items={[]} loading aria-labelledby="tree-label" />
        </React.Fragment>,
      );

      const tree = screen.getByRole('tree');
      expect(tree).to.have.attribute('aria-labelledby', 'tree-label');
      expect(tree).not.to.have.attribute('aria-label');
    });

    it('should render a checkbox placeholder in each item loader when checkboxSelection is enabled', () => {
      render(<RichTreeView items={[]} loading checkboxSelection />);

      const itemLoaders = screen.getAllByRole('treeitem');
      itemLoaders.forEach((item) => {
        expect(item.querySelector('.MuiSkeleton-circular')).not.to.equal(null);
      });
    });

    it('should not render a checkbox placeholder when checkboxSelection is disabled', () => {
      render(<RichTreeView items={[]} loading />);

      const itemLoaders = screen.getAllByRole('treeitem');
      itemLoaders.forEach((item) => {
        expect(item.querySelector('.MuiSkeleton-circular')).to.equal(null);
      });
    });

    it('should render the loading rows with the `itemLoader` slot', () => {
      function CustomItemLoader(
        props: React.HTMLAttributes<HTMLLIElement> & { ownerState?: unknown },
      ) {
        const { ownerState, ...other } = props;
        return <li {...other} data-testid="custom-item-loader" />;
      }

      render(<RichTreeView items={[]} loading slots={{ itemLoader: CustomItemLoader }} />);

      expect(screen.getAllByTestId('custom-item-loader')).to.have.length(5);
    });

    it('should apply `slotProps.itemLoader` to each loading row', () => {
      render(
        <RichTreeView
          items={[]}
          loading
          slotProps={{
            itemLoader: (ownerState) => ({
              'data-index': ownerState.index,
              style: { opacity: 1 - ownerState.index * 0.1 },
            }),
          }}
        />,
      );

      const itemLoaders = screen.getAllByRole('treeitem');
      itemLoaders.forEach((item, index) => {
        expect(item).to.have.attribute('data-index', `${index}`);
        expect(item.style.opacity).to.equal(`${1 - index * 0.1}`);
        // The slot props style must merge with the internal style, not replace it.
        expect(item.style.getPropertyValue('--TreeView-itemDepth')).to.equal('0');
      });
    });

    it('should not forward `loading` to the DOM', () => {
      render(<RichTreeView items={ITEMS} loading={false} />);

      const tree = screen.getByRole('tree');
      expect(tree).not.to.have.attribute('loading');
    });

    it('should keep the row semantics when the `itemLoader` slot wraps `TreeItemLoader`', () => {
      function CustomItemLoader(props: TreeItemLoaderProps) {
        return (
          <TreeItemLoader {...props}>
            <span data-testid="custom-row-content" />
          </TreeItemLoader>
        );
      }

      render(
        <RichTreeView
          items={[]}
          loading
          itemHeight={40}
          slots={{ itemLoader: CustomItemLoader }}
        />,
      );

      const itemLoaders = screen.getAllByRole('treeitem');
      expect(itemLoaders).to.have.length(5);
      itemLoaders.forEach((item) => {
        expect(item).to.have.attribute('aria-disabled', 'true');
        expect(item.style.getPropertyValue('--TreeView-itemDepth')).to.equal('0');
        expect(item.style.getPropertyValue('--TreeView-itemHeight')).to.equal('40px');
        expect(item.querySelector('[data-testid="custom-row-content"]')).not.to.equal(null);
      });
    });

    it('should provide the layout information to `TreeItemLoader` rendered in a custom `loading` slot', () => {
      function CustomLoading(props: { itemsCount?: number }) {
        return (
          <React.Fragment>
            {Array.from({ length: props.itemsCount ?? 0 }, (_, index) => (
              <TreeItemLoader key={index} />
            ))}
          </React.Fragment>
        );
      }

      render(
        <RichTreeView
          items={[]}
          loading
          itemHeight={40}
          checkboxSelection
          slots={{ loading: CustomLoading }}
          slotProps={{ loading: { itemsCount: 3 } }}
        />,
      );

      const itemLoaders = screen.getAllByRole('treeitem');
      expect(itemLoaders).to.have.length(3);
      itemLoaders.forEach((item) => {
        expect(item).to.have.attribute('aria-disabled', 'true');
        expect(item.style.getPropertyValue('--TreeView-itemHeight')).to.equal('40px');
        // The checkbox placeholder of the default content comes from the context.
        expect(item.querySelector('.MuiSkeleton-circular')).not.to.equal(null);
      });
    });
  });
});
