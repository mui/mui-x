import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { SimpleTreeView, simpleTreeViewClasses as classes } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { describeConformance } from 'test/utils/describeConformance';

describe('<SimpleTreeView />', () => {
  const { render } = createRenderer();

  describeConformance(<SimpleTreeView />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiSimpleTreeView',
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));

  it('should pass the id prop to the root element', () => {
    render(
      <SimpleTreeView id="test-id">
        <TreeItem itemId="1" label="Item 1" />
      </SimpleTreeView>,
    );

    expect(screen.getByRole('tree')).to.have.attribute('id', 'test-id');
  });
});
