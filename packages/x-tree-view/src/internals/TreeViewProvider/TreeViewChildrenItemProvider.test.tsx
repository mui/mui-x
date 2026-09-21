import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { describe, it, expect } from 'vitest';

describe('<TreeViewChildrenItemProvider />', () => {
  const { render } = createRenderer();

  it('should not register a suspended child that React kept in the DOM', async () => {
    let suspender: Promise<void> | undefined;

    function Child({ shouldSuspend }: { shouldSuspend: boolean }) {
      if (shouldSuspend) {
        // A promise that never settles keeps the boundary in its fallback state,
        // which is all this test needs.
        suspender ??= new Promise<void>(() => {});
        throw suspender;
      }

      return <TreeItem itemId="child" label="child" />;
    }

    function App() {
      const [shouldSuspend, setShouldSuspend] = React.useState(false);

      return (
        <React.Fragment>
          <button type="button" onClick={() => setShouldSuspend(true)}>
            suspend
          </button>
          <SimpleTreeView defaultExpandedItems={['parent']}>
            <TreeItem itemId="parent" label="parent">
              <React.Suspense fallback={<span>loading</span>}>
                <Child shouldSuspend={shouldSuspend} />
              </React.Suspense>
            </TreeItem>
          </SimpleTreeView>
        </React.Fragment>
      );
    }

    const { user } = render(<App />);
    expect(screen.getByText('child')).not.to.equal(null);

    // Suspending an already-mounted item makes React hide its subtree and destroy
    // the layout effect that registered it, while leaving its element in the DOM.
    // The parent must not pick that element up as a child: its id no longer
    // resolves, and a nullish id points `itemsSelectors.itemOrderedChildrenIds`
    // back at the root of the tree, so the selection status traversal recurses
    // until the stack overflows.
    await user.click(screen.getByRole('button', { name: 'suspend' }));

    expect(screen.getByText('loading')).not.to.equal(null);
    expect(screen.getByRole('tree')).not.to.equal(null);
  });
});
