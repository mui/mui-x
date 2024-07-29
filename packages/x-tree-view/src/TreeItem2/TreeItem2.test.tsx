import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { treeItemClasses as classes } from '@mui/x-tree-view/TreeItem';
import { TreeViewContext } from '@mui/x-tree-view/internals/TreeViewProvider/TreeViewContext';
import { describeConformance } from 'test/utils/describeConformance';
import { getFakeContextValue } from 'test/utils/tree-view/fakeContextValue';
import { describeSlotsConformance } from 'test/utils/describeSlotsConformance';

describe('<TreeItem2 />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeItem2 itemId="one" label="one" />, () => ({
    classes,
    inheritComponent: 'li',
    render: (item) => {
      return render(
        <TreeViewContext.Provider value={getFakeContextValue()}>{item}</TreeViewContext.Provider>,
      );
    },
    muiName: 'MuiTreeItem2',
    refInstanceof: window.HTMLLIElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));

  describeSlotsConformance({
    render,
    getElement: ({ props, slotName }) => (
      <TreeViewContext.Provider
        value={getFakeContextValue({ checkboxSelection: slotName === 'checkbox' })}
      >
        <TreeItem2 itemId="one" label="one" {...props} />
      </TreeViewContext.Provider>
    ),
    slots: {
      label: { className: classes.label },
      iconContainer: { className: classes.iconContainer },
      content: { className: classes.content },
      checkbox: { className: classes.checkbox },
    },
  });
});
