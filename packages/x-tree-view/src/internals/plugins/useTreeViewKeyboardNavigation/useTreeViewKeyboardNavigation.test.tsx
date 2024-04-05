import * as React from 'react';
import { expect } from 'chai';
import { act, createRenderer, fireEvent } from '@mui-internal/test-utils';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

describe('useTreeViewKeyboardNavigation', () => {
  const { render } = createRenderer();

  it('should work after adding / removing items', () => {
    const { getByRole, setProps } = render(
      <RichTreeView
        items={[
          { id: 'one', label: 'one' },
          { id: 'two', label: 'two' },
          { id: 'three', label: 'three' },
          { id: 'four', label: 'four' },
        ]}
      />,
    );

    act(() => {
      getByRole('treeitem', { name: 'one' }).focus();
    });

    fireEvent.keyDown(getByRole('treeitem', { name: 'one' }), { key: 'f' });
    expect(getByRole('treeitem', { name: 'four' })).toHaveFocus();

    setProps({
      items: [
        { id: 'one', label: 'one' },
        { id: 'two', label: 'two' },
        { id: 'three', label: 'three' },
      ],
    });
    expect(getByRole('treeitem', { name: 'one' })).toHaveFocus();

    fireEvent.keyDown(getByRole('treeitem', { name: 'one' }), { key: 't' });
    expect(getByRole('treeitem', { name: 'two' })).toHaveFocus();

    setProps({
      items: [
        { id: 'one', label: 'one' },
        { id: 'two', label: 'two' },
        { id: 'three', label: 'three' },
        { id: 'four', label: 'four' },
      ],
    });
    expect(getByRole('treeitem', { name: 'two' })).toHaveFocus();

    fireEvent.keyDown(getByRole('treeitem', { name: 'two' }), { key: 'f' });
    expect(getByRole('treeitem', { name: 'four' })).toHaveFocus();
  });
});
