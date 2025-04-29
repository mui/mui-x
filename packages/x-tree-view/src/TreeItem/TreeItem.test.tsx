import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses as classes } from '@mui/x-tree-view/TreeItem';
import { TreeViewContext } from '@mui/x-tree-view/internals/TreeViewProvider/TreeViewContext';
import { describeConformance } from 'test/utils/describeConformance';
import { getFakeContextValue } from 'test/utils/tree-view/fakeContextValue';
import { describeSlotsConformance } from 'test/utils/describeSlotsConformance';

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
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
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
});
