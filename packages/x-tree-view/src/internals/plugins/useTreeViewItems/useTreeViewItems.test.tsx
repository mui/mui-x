import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, ErrorBoundary } from '@mui-internal/test-utils';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

describe('useTreeViewItems', () => {
  const { render } = createRenderer();

  it('should throw an error when two items have the same ID (items prop approach)', function test() {
    // TODO is this fixed?
    if (!/jsdom/.test(window.navigator.userAgent)) {
      // can't catch render errors in the browser for unknown reason
      // tried try-catch + error boundary + window onError preventDefault
      this.skip();
    }

    expect(() =>
      render(
        <ErrorBoundary>
          <RichTreeView
            items={[
              { id: '1', label: '1' },
              { id: '1', label: 'B' },
            ]}
          />
        </ErrorBoundary>,
      ),
    ).toErrorDev([
      'MUI X: The Tree View component requires all items to have a unique `id` property.',
      'MUI X: The Tree View component requires all items to have a unique `id` property.',
      'The above error occurred in the <ForwardRef(RichTreeView)> component:',
    ]);
  });

  it('should throw an error when two items have the same ID (JSX approach)', function test() {
    // TODO is this fixed?
    if (!/jsdom/.test(window.navigator.userAgent)) {
      // can't catch render errors in the browser for unknown reason
      // tried try-catch + error boundary + window onError preventDefault
      this.skip();
    }

    expect(() =>
      render(
        <ErrorBoundary>
          <SimpleTreeView>
            <TreeItem itemId="1" label="A" />
            <TreeItem itemId="1" label="B" />
          </SimpleTreeView>
        </ErrorBoundary>,
      ),
    ).toErrorDev([
      'MUI X: The Tree View component requires all items to have a unique `id` property.',
      'MUI X: The Tree View component requires all items to have a unique `id` property.',
      'The above error occurred in the <ForwardRef(SimpleTreeView)> component:',
    ]);
  });
});
