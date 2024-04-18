import { expect } from 'chai';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';

describeTreeView('useTreeViewItems plugin', ({ render, treeViewComponent }) => {
  it('should throw an error when two items have the same ID', function test() {
    // TODO is this fixed?
    if (!/jsdom/.test(window.navigator.userAgent)) {
      // can't catch render errors in the browser for unknown reason
      // tried try-catch + error boundary + window onError preventDefault
      this.skip();
    }

    expect(() => render({ items: [{ id: '1' }, { id: '1' }], withErrorBoundary: true })).toErrorDev(
      [
        ...(treeViewComponent === 'SimpleTreeView'
          ? ['Encountered two children with the same key']
          : []),
        'MUI X: The Tree View component requires all items to have a unique `id` property.',
        'MUI X: The Tree View component requires all items to have a unique `id` property.',
        `The above error occurred in the <ForwardRef(${treeViewComponent})> component`,
      ],
    );
  });
});
