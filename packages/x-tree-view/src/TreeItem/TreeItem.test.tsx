import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import {
  TreeItem,
  TreeItemContent,
  TreeItemLabel,
  TreeItemRoot,
  treeItemClasses as classes,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import type { UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import { describeConformance } from 'test/utils/describeConformance';
import { getFakeContextValue } from 'test/utils/tree-view/fakeContextValue';
import { describeSlotsConformance } from 'test/utils/describeSlotsConformance';
import { isJSDOM } from 'test/utils/skipIf';
// It's not publicly exported, so, using a relative import
import { describe, it, expect } from 'vitest';
import { TreeViewContext } from '../internals/TreeViewProvider/TreeViewContext';

describe('<TreeItem />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeItem itemId="one" label="one" />, () => ({
    classes,
    inheritComponent: 'li',
    render: (item) => {
      return render(
        <TreeViewContext.Provider value={getFakeContextValue()}>{item}</TreeViewContext.Provider>,
      );
    },
    muiName: 'MuiTreeItem',
    refInstanceof: window.HTMLLIElement,
    skip: ['componentProp', 'themeVariants'],
  }));

  describeSlotsConformance({
    render,
    getElement: ({ props, slotName }) => (
      <SimpleTreeView checkboxSelection={slotName === 'checkbox'}>
        <TreeItem itemId="one" label="one" {...props} />
      </SimpleTreeView>
    ),
    slots: {
      label: { className: classes.label },
      iconContainer: { className: classes.iconContainer },
      content: { className: classes.content },
      checkbox: { className: classes.checkbox },
    },
  });

  describe('theme.focusVisible', () => {
    const theme = createTheme({ focusVisible: { outlineColor: 'rgb(1, 2, 3)' } });

    const CustomTreeItem = React.forwardRef(function CustomTreeItem(
      props: Omit<UseTreeItemParameters, 'rootRef'>,
      ref: React.Ref<HTMLLIElement>,
    ) {
      const { getContextProviderProps, getRootProps, getContentProps, getLabelProps } = useTreeItem(
        { ...props, rootRef: ref },
      );

      return (
        <TreeItemProvider {...getContextProviderProps()}>
          <TreeItemRoot {...getRootProps()}>
            <TreeItemContent {...getContentProps()}>
              <TreeItemLabel {...getLabelProps()} />
            </TreeItemContent>
          </TreeItemRoot>
        </TreeItemProvider>
      );
    });

    it.skipIf(isJSDOM)('shows the ring on the content of a focused item', async () => {
      const { user } = render(
        <ThemeProvider theme={theme}>
          <SimpleTreeView>
            <TreeItem itemId="one" label="one" />
          </SimpleTreeView>
        </ThemeProvider>,
      );

      await user.keyboard('{Tab}');

      const content = screen.getByRole('treeitem').firstElementChild;
      expect(content).to.have.style('outline-style', 'solid');
      expect(content).to.have.style('outline-color', 'rgb(1, 2, 3)');
    });

    it.skipIf(isJSDOM)('shows the ring on an item built with useTreeItem', async () => {
      const { user } = render(
        <ThemeProvider theme={theme}>
          <SimpleTreeView>
            <CustomTreeItem itemId="one" label="one" />
          </SimpleTreeView>
        </ThemeProvider>,
      );

      await user.keyboard('{Tab}');

      const content = screen.getByRole('treeitem').firstElementChild;
      expect(content).to.have.style('outline-style', 'solid');
      expect(content).to.have.style('outline-color', 'rgb(1, 2, 3)');
    });
  });
});
