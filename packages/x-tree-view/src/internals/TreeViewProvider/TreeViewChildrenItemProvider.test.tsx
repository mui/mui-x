import * as React from 'react';
import { act, createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { useSimpleTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { describe, it, expect } from 'vitest';

describe('<TreeViewChildrenItemProvider />', () => {
  const { render } = createRenderer();

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
    const apiRef: ReturnType<typeof useSimpleTreeViewApiRef> = { current: undefined };

    function Child({ shouldSuspend }: { shouldSuspend: boolean }) {
      if (shouldSuspend && suspender.isPending) {
        throw suspender.promise;
      }

      return <TreeItem itemId="child" label="child" data-testid="child" />;
    }

    function App() {
      const [shouldSuspend, setShouldSuspend] = React.useState(false);

      const siblings = (
        <React.Fragment>
          <TreeItem itemId="before" label="before" data-testid="before" />
          <React.Suspense fallback={<span>loading</span>}>
            <Child shouldSuspend={shouldSuspend} />
          </React.Suspense>
          <TreeItem itemId="after" label="after" data-testid="after" />
        </React.Fragment>
      );

      return (
        <React.Fragment>
          <button type="button" onClick={() => setShouldSuspend(true)}>
            suspend
          </button>
          <SimpleTreeView apiRef={apiRef} defaultExpandedItems={['parent']}>
            {nested ? (
              <TreeItem itemId="parent" label="parent" data-testid="parent">
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

    return {
      user,
      suspender,
      getOrderedChildrenIds: () =>
        apiRef.current!.getItemOrderedChildrenIds(nested ? 'parent' : null),
    };
  }

  [false, true].forEach((nested) => {
    it(`should drop a ${nested ? 'nested' : 'root'} child that suspends after it mounted and restore it once it resolves`, async () => {
      const { user, suspender, getOrderedChildrenIds } = renderTreeWithSuspendingChild({ nested });

      expect(getOrderedChildrenIds()).to.deep.equal(['before', 'child', 'after']);

      // Suspending an already-mounted item makes React hide its subtree and destroy
      // the layout effect that registered it, while leaving its element in the DOM.
      // The parent must not pick that element up as a child: its id no longer
      // resolves, and a nullish id points `itemsSelectors.itemOrderedChildrenIds`
      // back at the root of the tree, so the selection status traversal recurses
      // until the stack overflows.
      await user.click(screen.getByRole('button', { name: 'suspend' }));

      expect(screen.getByText('loading')).not.to.equal(null);
      expect(getOrderedChildrenIds()).to.deep.equal(['before', 'after']);

      // Resolving only rerenders the Suspense subtree, so the child registers itself
      // again without the provider rerendering. The order must pick that registration
      // up anyway, otherwise the item is back on the screen but unreachable.
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
