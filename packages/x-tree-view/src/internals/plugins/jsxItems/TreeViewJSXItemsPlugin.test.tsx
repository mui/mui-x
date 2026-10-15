import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import type { SimpleTreeViewApiRef } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { describe, it, expect, vi } from 'vitest';

function createSuspender() {
  let resolvePromise: () => void = () => {};
  let pending = true;
  const promise = new Promise<void>((resolve) => {
    resolvePromise = () => {
      pending = false;
      resolve();
    };
  });
  return {
    promise,
    resolve: () => resolvePromise(),
    get pending() {
      return pending;
    },
  };
}

describe('TreeViewJSXItemsPlugin', () => {
  const { render } = createRenderer();

  it('keeps custom and generated DOM ids ordered when the tree id changes', async () => {
    const apiRef: SimpleTreeViewApiRef = { current: undefined };
    function App() {
      const [changed, setChanged] = React.useState(false);
      return (
        <React.Fragment>
          <button type="button" onClick={() => setChanged(true)}>
            change ids
          </button>
          <SimpleTreeView
            apiRef={apiRef}
            id={changed ? 'second:tree' : 'first:tree'}
            defaultExpandedItems={['parent']}
          >
            <TreeItem itemId="before" label="before" />
            <TreeItem itemId="parent" id="custom:parent[0]" label="parent">
              <TreeItem
                itemId="custom"
                id={changed ? 'second:custom[0]' : 'first:custom[0]'}
                label="custom"
              />
              <TreeItem itemId="generated" label="generated" />
            </TreeItem>
            <TreeItem itemId="after" label="after" />
          </SimpleTreeView>
        </React.Fragment>
      );
    }

    const { user } = render(<App />);
    expect(apiRef.current!.getItemOrderedChildrenIds!(null)).to.deep.equal([
      'before',
      'parent',
      'after',
    ]);
    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal([
      'custom',
      'generated',
    ]);

    await user.click(screen.getByRole('button', { name: 'change ids' }));

    expect(apiRef.current!.getItemDOMElement!('generated')).to.have.attribute(
      'id',
      'second:tree-generated',
    );
    expect(apiRef.current!.getItemDOMElement!('custom')).to.have.attribute(
      'id',
      'second:custom[0]',
    );
    expect(apiRef.current!.getItemOrderedChildrenIds!(null)).to.deep.equal([
      'before',
      'parent',
      'after',
    ]);
    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal([
      'custom',
      'generated',
    ]);
    act(() => apiRef.current!.getItemDOMElement!('custom')!.focus());
    fireEvent.keyDown(apiRef.current!.getItemDOMElement!('custom')!, { key: 'ArrowDown' });
    expect(document.activeElement).to.equal(apiRef.current!.getItemDOMElement!('generated'));
  });

  it('restores a nested branch after repeated Suspense hide and reveal cycles', async () => {
    const apiRef: SimpleTreeViewApiRef = { current: undefined };
    let activeSuspender: ReturnType<typeof createSuspender> | null = null;

    function Branch({ suspender }: { suspender: ReturnType<typeof createSuspender> | null }) {
      if (suspender?.pending) {
        throw suspender.promise;
      }
      return (
        <TreeItem itemId="branch" label="branch">
          <TreeItem itemId="child" label="child" />
          <TreeItem itemId="nested" label="nested">
            <TreeItem itemId="grandchild" label="grandchild" />
          </TreeItem>
        </TreeItem>
      );
    }

    function App() {
      const [suspender, setSuspender] = React.useState<ReturnType<typeof createSuspender> | null>(
        null,
      );
      return (
        <React.Fragment>
          <button
            type="button"
            onClick={() => {
              activeSuspender = createSuspender();
              setSuspender(activeSuspender);
            }}
          >
            suspend branch
          </button>
          <SimpleTreeView apiRef={apiRef} defaultExpandedItems={['branch', 'nested']}>
            <TreeItem itemId="before" label="before" />
            <React.Suspense fallback={<span>loading branch</span>}>
              <Branch suspender={suspender} />
            </React.Suspense>
            <TreeItem itemId="after" label="after" />
          </SimpleTreeView>
        </React.Fragment>
      );
    }

    const { user } = render(<App />);
    async function suspendAndResume() {
      await user.click(screen.getByRole('button', { name: 'suspend branch' }));
      expect(screen.getByText('loading branch')).not.to.equal(null);
      expect(apiRef.current!.getItemOrderedChildrenIds!(null)).to.deep.equal(['before', 'after']);

      await act(async () => {
        activeSuspender!.resolve();
        await activeSuspender!.promise;
      });

      expect(screen.queryByText('loading branch')).to.equal(null);
      expect(apiRef.current!.getItemOrderedChildrenIds!(null)).to.deep.equal([
        'before',
        'branch',
        'after',
      ]);
      expect(apiRef.current!.getItemOrderedChildrenIds!('branch')).to.deep.equal([
        'child',
        'nested',
      ]);
      expect(apiRef.current!.getItemOrderedChildrenIds!('nested')).to.deep.equal(['grandchild']);
      act(() => apiRef.current!.getItemDOMElement!('before')!.focus());
      fireEvent.keyDown(apiRef.current!.getItemDOMElement!('before')!, { key: 'ArrowDown' });
      expect(document.activeElement).to.equal(apiRef.current!.getItemDOMElement!('branch'));
      fireEvent.keyDown(apiRef.current!.getItemDOMElement!('branch')!, { key: 'ArrowDown' });
      expect(document.activeElement).to.equal(apiRef.current!.getItemDOMElement!('child'));
    }

    await suspendAndResume();
    await suspendAndResume();
  });

  it('tracks insertions and removals driven only by a descendant component state', () => {
    const apiRef: SimpleTreeViewApiRef = { current: undefined };
    let setPresent: React.Dispatch<React.SetStateAction<boolean>> = () => {};

    function LocalItems() {
      const [present, updatePresent] = React.useState(false);
      React.useEffect(() => {
        setPresent = updatePresent;
      }, []);
      return present ? <TreeItem itemId="local" label="local" /> : null;
    }

    function Tree() {
      return (
        <SimpleTreeView apiRef={apiRef} defaultExpandedItems={['parent']}>
          <TreeItem itemId="parent" label="parent">
            <TreeItem itemId="before" label="before" />
            <LocalItems />
            <TreeItem itemId="after" label="after" />
          </TreeItem>
        </SimpleTreeView>
      );
    }

    render(<Tree />);
    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal(['before', 'after']);

    act(() => setPresent(true));

    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal([
      'before',
      'local',
      'after',
    ]);
    act(() => apiRef.current!.getItemDOMElement!('before')!.focus());
    fireEvent.keyDown(apiRef.current!.getItemDOMElement!('before')!, { key: 'ArrowDown' });
    expect(document.activeElement).to.equal(apiRef.current!.getItemDOMElement!('local'));

    act(() => setPresent(false));

    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal(['before', 'after']);
    act(() => apiRef.current!.getItemDOMElement!('before')!.focus());
    fireEvent.keyDown(apiRef.current!.getItemDOMElement!('before')!, { key: 'ArrowDown' });
    expect(document.activeElement).to.equal(apiRef.current!.getItemDOMElement!('after'));
  });

  it('does not include items from a nested independent tree with matching item ids', () => {
    const outerApiRef: SimpleTreeViewApiRef = { current: undefined };
    const innerApiRef: SimpleTreeViewApiRef = { current: undefined };

    render(
      <SimpleTreeView apiRef={outerApiRef} id="outer-tree">
        <TreeItem
          itemId="shared"
          label={
            <React.Fragment>
              outer shared
              <SimpleTreeView apiRef={innerApiRef} id="inner-tree">
                <TreeItem itemId="shared" label="inner shared" />
                <TreeItem itemId="inner-only" label="inner only" />
              </SimpleTreeView>
            </React.Fragment>
          }
        />
        <TreeItem itemId="outer-only" label="outer only" />
      </SimpleTreeView>,
    );

    expect(outerApiRef.current!.getItemOrderedChildrenIds!(null)).to.deep.equal([
      'shared',
      'outer-only',
    ]);
    expect(outerApiRef.current!.getItemOrderedChildrenIds!('shared')).to.deep.equal([]);
    expect(innerApiRef.current!.getItemOrderedChildrenIds!(null)).to.deep.equal([
      'shared',
      'inner-only',
    ]);
  });

  [false, true].forEach((nested) => {
    it(`should restore the order when a ${nested ? 'nested' : 'root'} item stops suspending`, async () => {
      const apiRef: SimpleTreeViewApiRef = { current: undefined };
      const suspender = createSuspender();

      function Child({ suspend }: { suspend: boolean }) {
        if (suspend && suspender.pending) {
          throw suspender.promise;
        }
        return <TreeItem itemId="child" label="child" />;
      }

      function App() {
        const [suspend, setSuspend] = React.useState(false);
        const siblings = (
          <React.Fragment>
            <TreeItem itemId="before" label="before" />
            <React.Suspense fallback={<span>loading child</span>}>
              <Child suspend={suspend} />
            </React.Suspense>
            <TreeItem itemId="after" label="after" />
          </React.Fragment>
        );
        return (
          <React.Fragment>
            <button type="button" onClick={() => setSuspend(true)}>
              suspend child
            </button>
            <SimpleTreeView apiRef={apiRef} defaultExpandedItems={['parent']}>
              {nested ? (
                <TreeItem itemId="parent" label="parent">
                  {siblings}
                </TreeItem>
              ) : (
                siblings
              )}
            </SimpleTreeView>
          </React.Fragment>
        );
      }

      const { user } = render(<App />);
      const parentId = nested ? 'parent' : null;
      expect(apiRef.current!.getItemOrderedChildrenIds!(parentId)).to.deep.equal([
        'before',
        'child',
        'after',
      ]);
      await user.click(screen.getByRole('button', { name: 'suspend child' }));

      // React leaves the hidden DOM behind while destroying its layout effects.
      expect(screen.getByText('loading child')).not.to.equal(null);
      expect(apiRef.current!.getItemOrderedChildrenIds!(parentId)).to.deep.equal([
        'before',
        'after',
      ]);
      act(() => apiRef.current!.getItemDOMElement!('before')!.focus());
      fireEvent.keyDown(apiRef.current!.getItemDOMElement!('before')!, { key: 'ArrowDown' });
      expect(document.activeElement).to.equal(apiRef.current!.getItemDOMElement!('after'));

      // Resolving the promise only rerenders the Suspense subtree.
      await act(async () => {
        suspender.resolve();
        await suspender.promise;
      });
      expect(screen.queryByText('loading child')).to.equal(null);
      expect(apiRef.current!.getItemOrderedChildrenIds!(parentId)).to.deep.equal([
        'before',
        'child',
        'after',
      ]);
      act(() => apiRef.current!.getItemDOMElement!('before')!.focus());
      fireEvent.keyDown(apiRef.current!.getItemDOMElement!('before')!, { key: 'ArrowDown' });
      expect(document.activeElement).to.equal(apiRef.current!.getItemDOMElement!('child'));
    });
  });

  it('should update keyed sibling order when their metadata is unchanged', () => {
    const apiRef: SimpleTreeViewApiRef = { current: undefined };
    const onSelectedItemsChange = vi.fn();
    let setReversed: React.Dispatch<React.SetStateAction<boolean>> = () => {};

    function LocalItems() {
      const [reversed, updateReversed] = React.useState(false);
      React.useEffect(() => {
        setReversed = updateReversed;
      }, []);
      const itemIds = reversed ? ['second', 'first'] : ['first', 'second'];
      return itemIds.map((itemId) => <TreeItem key={itemId} itemId={itemId} label={itemId} />);
    }

    render(
      <SimpleTreeView
        apiRef={apiRef}
        defaultExpandedItems={['parent']}
        multiSelect
        defaultSelectedItems={['parent', 'before', 'first', 'second', 'after']}
        selectionPropagation={{ descendants: true }}
        onSelectedItemsChange={onSelectedItemsChange}
      >
        <TreeItem itemId="parent" label="parent">
          <TreeItem itemId="before" label="before" />
          <LocalItems />
          <TreeItem itemId="after" label="after" />
        </TreeItem>
      </SimpleTreeView>,
    );
    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal([
      'before',
      'first',
      'second',
      'after',
    ]);

    onSelectedItemsChange.mockClear();
    // Only LocalItems rerenders, and the existing item instances keep their props.
    act(() => setReversed(true));

    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal([
      'before',
      'second',
      'first',
      'after',
    ]);
    expect(onSelectedItemsChange.mock.calls.length).to.equal(0);
    act(() => apiRef.current!.getItemDOMElement!('second')!.focus());
    fireEvent.keyDown(apiRef.current!.getItemDOMElement!('second')!, { key: 'ArrowDown' });
    expect(document.activeElement).to.equal(apiRef.current!.getItemDOMElement!('first'));
  });

  it('should propagate controlled selection to both newly populated parents in one callback', async () => {
    const apiRef: SimpleTreeViewApiRef<true> = { current: undefined };
    const onSelectedItemsChange = vi.fn();

    function App() {
      const [showChildren, setShowChildren] = React.useState(false);
      const [selectedItems, setSelectedItems] = React.useState(['first', 'second']);
      return (
        <React.Fragment>
          <button type="button" onClick={() => setShowChildren(true)}>
            add children
          </button>
          <SimpleTreeView
            apiRef={apiRef}
            multiSelect
            selectionPropagation={{ descendants: true }}
            defaultExpandedItems={['first', 'second']}
            selectedItems={selectedItems}
            onSelectedItemsChange={(event, itemIds) => {
              onSelectedItemsChange(event, itemIds);
              setSelectedItems(itemIds);
            }}
          >
            <TreeItem itemId="first" label="first">
              {showChildren && <TreeItem itemId="first-child" label="first child" />}
            </TreeItem>
            <TreeItem itemId="second" label="second">
              {showChildren && <TreeItem itemId="second-child" label="second child" />}
            </TreeItem>
          </SimpleTreeView>
        </React.Fragment>
      );
    }

    const { user } = render(<App />);
    onSelectedItemsChange.mockClear();
    await user.click(screen.getByRole('button', { name: 'add children' }));

    expect(onSelectedItemsChange.mock.calls.length).to.equal(1);
    expect(onSelectedItemsChange.mock.lastCall?.[1]).to.have.members([
      'first',
      'second',
      'first-child',
      'second-child',
    ]);
    expect(apiRef.current!.getItemSelection!('first-child')).to.equal('selected');
    expect(apiRef.current!.getItemSelection!('second-child')).to.equal('selected');
  });

  it('should update both parents when an item moves between them', async () => {
    const apiRef: SimpleTreeViewApiRef = { current: undefined };

    function App() {
      const [moved, setMoved] = React.useState(false);
      return (
        <React.Fragment>
          <button type="button" onClick={() => setMoved(true)}>
            move child
          </button>
          <SimpleTreeView apiRef={apiRef} defaultExpandedItems={['left', 'right']}>
            <TreeItem itemId="left" label="left">
              <TreeItem itemId="left-before" label="left before" />
              {!moved && <TreeItem itemId="moving" id="moving:dom-id" label="moving" />}
              <TreeItem itemId="left-after" label="left after" />
            </TreeItem>
            <TreeItem itemId="right" label="right">
              <TreeItem itemId="right-before" label="right before" />
              {moved && <TreeItem itemId="moving" id="moving:dom-id" label="moving" />}
              <TreeItem itemId="right-after" label="right after" />
            </TreeItem>
          </SimpleTreeView>
        </React.Fragment>
      );
    }

    const { user } = render(<App />);
    expect(apiRef.current!.getItemOrderedChildrenIds!('left')).to.deep.equal([
      'left-before',
      'moving',
      'left-after',
    ]);
    await user.click(screen.getByRole('button', { name: 'move child' }));

    expect(apiRef.current!.getItemOrderedChildrenIds!('left')).to.deep.equal([
      'left-before',
      'left-after',
    ]);
    expect(apiRef.current!.getItemOrderedChildrenIds!('right')).to.deep.equal([
      'right-before',
      'moving',
      'right-after',
    ]);
    expect(apiRef.current!.getParentId!('moving')).to.equal('right');
    act(() => apiRef.current!.getItemDOMElement!('right-before')!.focus());
    fireEvent.keyDown(apiRef.current!.getItemDOMElement!('right-before')!, { key: 'ArrowDown' });
    expect(document.activeElement).to.equal(apiRef.current!.getItemDOMElement!('moving'));
  });

  it('should preserve both items when their custom DOM ids are swapped', async () => {
    const apiRef: SimpleTreeViewApiRef = { current: undefined };

    function App() {
      const [swapped, setSwapped] = React.useState(false);
      return (
        <React.Fragment>
          <button type="button" onClick={() => setSwapped(true)}>
            swap DOM ids
          </button>
          <SimpleTreeView apiRef={apiRef}>
            <TreeItem itemId="first" id={swapped ? 'dom-b' : 'dom-a'} label="first" />
            <TreeItem itemId="second" id={swapped ? 'dom-a' : 'dom-b'} label="second" />
          </SimpleTreeView>
        </React.Fragment>
      );
    }

    const { user } = render(<App />);
    await user.click(screen.getByRole('button', { name: 'swap DOM ids' }));

    expect(apiRef.current!.getItemOrderedChildrenIds!(null)).to.deep.equal(['first', 'second']);
    expect(apiRef.current!.getItemDOMElement!('first')).to.have.attribute('id', 'dom-b');
    expect(apiRef.current!.getItemDOMElement!('second')).to.have.attribute('id', 'dom-a');
    act(() => apiRef.current!.getItemDOMElement!('first')!.focus());
    fireEvent.keyDown(apiRef.current!.getItemDOMElement!('first')!, { key: 'ArrowDown' });
    expect(document.activeElement).to.equal(apiRef.current!.getItemDOMElement!('second'));
  });

  it('should clear remembered children when a collapsed item becomes a leaf', async () => {
    const apiRef: SimpleTreeViewApiRef = { current: undefined };
    let setHasChildren: React.Dispatch<React.SetStateAction<boolean>> = () => {};

    function LocalParent() {
      const [hasChildren, updateHasChildren] = React.useState(true);
      React.useEffect(() => {
        setHasChildren = updateHasChildren;
      }, []);
      return (
        <TreeItem itemId="parent" label="parent" slotProps={{ groupTransition: { timeout: 0 } }}>
          {hasChildren ? <TreeItem itemId="child" label="child" /> : null}
        </TreeItem>
      );
    }

    render(
      <SimpleTreeView
        apiRef={apiRef}
        multiSelect
        defaultSelectedItems={['child']}
        defaultExpandedItems={['parent']}
      >
        <LocalParent />
      </SimpleTreeView>,
    );
    act(() => apiRef.current!.setItemExpansion!({ itemId: 'parent', shouldBeExpanded: false }));
    await waitFor(() => expect(apiRef.current!.getItem!('child')).to.equal(undefined));
    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal(['child']);
    expect(apiRef.current!.getItemSelection!('parent')).to.equal('indeterminate');

    // The child already unmounted during collapse; only its parent's metadata changes now.
    act(() => setHasChildren(false));

    expect(apiRef.current!.getItemDOMElement!('parent')).not.to.have.attribute('aria-expanded');
    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal([]);
    expect(apiRef.current!.getItemSelection!('parent')).to.equal('unselected');
  });

  it('should update a local branch when the tree is in a detached container', () => {
    const apiRef: SimpleTreeViewApiRef = { current: undefined };
    const container = document.createElement('div');
    let setPresent: React.Dispatch<React.SetStateAction<boolean>> = () => {};

    function LocalItems() {
      const [present, updatePresent] = React.useState(false);
      React.useEffect(() => {
        setPresent = updatePresent;
      }, []);
      return present ? <TreeItem itemId="local" label="local" /> : null;
    }

    render(
      <SimpleTreeView apiRef={apiRef} defaultExpandedItems={['parent']}>
        <TreeItem itemId="parent" label="parent">
          <TreeItem itemId="before" label="before" />
          <LocalItems />
          <TreeItem itemId="after" label="after" />
        </TreeItem>
      </SimpleTreeView>,
      { container },
    );
    expect(container.isConnected).to.equal(false);
    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal(['before', 'after']);

    act(() => setPresent(true));
    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal([
      'before',
      'local',
      'after',
    ]);

    act(() => setPresent(false));
    expect(apiRef.current!.getItemOrderedChildrenIds!('parent')).to.deep.equal(['before', 'after']);
  });
});
