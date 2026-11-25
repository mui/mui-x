import * as React from 'react';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
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
import { afterEach, describe, it, expect } from 'vitest';
import type { userEvent as BrowserUserEvent } from 'vitest/browser';
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
      expect(content).to.have.style('outline-offset', '-2px');
      expect(content).to.have.style('background-color', 'rgba(0, 0, 0, 0)');
    });

    it.skipIf(isJSDOM)(
      'draws the ring at full strength on a focused disabled item and fades its content',
      async () => {
        const { user } = render(
          <ThemeProvider theme={theme}>
            <SimpleTreeView disabledItemsFocusable>
              <TreeItem itemId="one" label="one" />
              <TreeItem itemId="two" label="two" disabled />
            </SimpleTreeView>
          </ThemeProvider>,
        );

        await user.keyboard('{Tab}');
        await user.keyboard('{ArrowDown}');

        const content = screen.getAllByRole('treeitem')[1].firstElementChild!;
        expect(content).to.have.style('outline-style', 'solid');
        expect(content).to.have.style('opacity', '1');
        expect(content.querySelector(`.${classes.label}`)).to.have.style('opacity', '0.38');
      },
    );

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

    describe.skipIf(isJSDOM)('after a real mouse click', () => {
      const sendRealInput = async (send: (input: typeof BrowserUserEvent) => Promise<void>) => {
        const { userEvent } = await import('vitest/browser');
        await act(() => send(userEvent));
      };

      afterEach(() => sendRealInput((input) => input.keyboard('{Tab}')));

      it('tints the focused item instead of drawing the ring', async () => {
        render(
          <ThemeProvider theme={theme}>
            <SimpleTreeView disableSelection>
              <TreeItem itemId="one" label="one" />
            </SimpleTreeView>
          </ThemeProvider>,
        );

        await sendRealInput((input) => input.click(screen.getByText('one')));

        const content = screen.getByRole('treeitem').firstElementChild;
        expect(content).to.have.style('outline-style', 'none');
        expect(content).to.have.style('background-color', 'rgba(0, 0, 0, 0.12)');
      });

      it('tints a selected item with the selected focus shade', async () => {
        render(
          <ThemeProvider theme={theme}>
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" />
            </SimpleTreeView>
          </ThemeProvider>,
        );

        await sendRealInput((input) => input.click(screen.getByText('one')));

        const content = screen.getByRole('treeitem').firstElementChild;
        expect(content).to.have.style('background-color', 'rgba(25, 118, 210, 0.2)');
      });

      it('draws the ring on the row once a clicked checkbox is used with the keyboard', async () => {
        render(
          <ThemeProvider theme={theme}>
            <SimpleTreeView checkboxSelection>
              <TreeItem itemId="one" label="one" />
            </SimpleTreeView>
          </ThemeProvider>,
        );

        const content = screen.getByRole('treeitem').firstElementChild!;
        await sendRealInput((input) => input.click(content.querySelector('input')!));
        expect(content).to.have.style('outline-style', 'none');

        await sendRealInput((input) => input.keyboard(' '));
        expect(content).to.have.style('outline-style', 'solid');
      });
    });
  });
});
