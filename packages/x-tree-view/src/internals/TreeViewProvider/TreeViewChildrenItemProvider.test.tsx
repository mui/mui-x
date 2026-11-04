import * as React from 'react';
import { act, createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import type { SimpleTreeViewApiRef } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { describe, it, expect } from 'vitest';

// In StrictMode, the double-invoked layout effects always call `unregisterChild` on a
// mount, which hides a missing refresh in `registerChild`. Run both states.
describe.each([true, false])('<TreeViewChildrenItemProvider /> (strict: %s)', (strict) => {
  const { render } = createRenderer({ strict });

  function createSuspender() {
    let resolvePromise: () => void = () => {};
    let isPending = true;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = () => {
        isPending = false;
        resolve();
      };
    });

    return {
      promise,
      resolve: () => resolvePromise(),
      get isPending() {
        return isPending;
      },
    };
  }

  /**
   * Renders `before`, `child` and `after` as siblings, `child` being the only one able to suspend.
   * When `nested` is `true`, the three of them are children of an expanded `parent` item.
   */
  function renderTreeWithSuspendingChild({ nested }: { nested: boolean }) {
    const suspender = createSuspender();
    const apiRef: SimpleTreeViewApiRef = { current: undefined };
    const suspendRef = { current: () => {} };

    // The state lives in `Child` so that suspending does not rerender the provider.
    function Child() {
      const [shouldSuspend, setShouldSuspend] = React.useState(false);
      React.useEffect(() => {
        suspendRef.current = () => setShouldSuspend(true);
      }, []);

      if (shouldSuspend && suspender.isPending) {
        throw suspender.promise;
      }

      return <TreeItem itemId="child" label="child" data-testid="child" />;
    }

    function App() {
      const siblings = (
        <React.Fragment>
          <TreeItem itemId="before" label="before" data-testid="before" />
          <React.Suspense fallback={<span>loading</span>}>
            <Child />
          </React.Suspense>
          <TreeItem itemId="after" label="after" data-testid="after" />
        </React.Fragment>
      );

      return (
        <SimpleTreeView apiRef={apiRef} defaultExpandedItems={['parent']}>
          {nested ? (
            <TreeItem itemId="parent" label="parent" data-testid="parent">
              {siblings}
            </TreeItem>
          ) : (
            siblings
          )}
        </SimpleTreeView>
      );
    }

    render(<App />);

    return {
      suspend: () => suspendRef.current(),
      suspender,
      getOrderedChildrenIds: () =>
        apiRef.current!.getItemOrderedChildrenIds!(nested ? 'parent' : null),
    };
  }

  [false, true].forEach((nested) => {
    it(`should drop a ${nested ? 'nested' : 'root'} child that suspends after it mounted and restore it once it resolves`, async () => {
      const { suspend, suspender, getOrderedChildrenIds } = renderTreeWithSuspendingChild({
        nested,
      });

      expect(getOrderedChildrenIds()).to.deep.equal(['before', 'child', 'after']);

      // Suspending an already-mounted item makes React hide its subtree and destroy
      // the layout effect that registered it, while leaving its element in the DOM.
      // The parent must not pick that element up as a child: its id no longer
      // resolves, and a nullish id points `itemsSelectors.itemOrderedChildrenIds`
      // back at the root of the tree, so the selection status traversal recurses
      // until the stack overflows.
      act(() => {
        suspend();
      });

      expect(screen.getByText('loading')).not.to.equal(null);
      expect(getOrderedChildrenIds()).to.deep.equal(['before', 'after']);

      // Neither suspending nor resolving rerenders the provider, so the child's
      // unregistration and registration alone must refresh the order, otherwise the
      // item is back on the screen but unreachable.
      await act(async () => {
        suspender.resolve();
        await suspender.promise;
      });

      expect(getOrderedChildrenIds()).to.deep.equal(['before', 'child', 'after']);

      act(() => {
        screen.getByTestId('before').focus();
      });
      fireEvent.keyDown(screen.getByTestId('before'), { key: 'ArrowDown' });
      expect(document.activeElement).to.equal(screen.getByTestId('child'));
    });
  });
});
