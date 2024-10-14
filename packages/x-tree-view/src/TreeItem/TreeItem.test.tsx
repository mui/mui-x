import * as React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { createRenderer } from '@mui/internal-test-utils';
import { TreeItem, treeItemClasses as classes } from '@mui/x-tree-view/TreeItem';
import { TreeViewContext } from '@mui/x-tree-view/internals/TreeViewProvider/TreeViewContext';
import { describeConformance } from 'test/utils/describeConformance';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { getFakeContextValue } from 'test/utils/tree-view/fakeContextValue';

describeTreeView<[]>('TreeItem component', ({ render, treeItemComponentName }) => {
  describe('ContentComponent / ContentProps props (TreeItem only)', () => {
    it('should render TreeItem when itemId prop is escaping characters without throwing an error', function test() {
      if (treeItemComponentName === 'TreeItem2') {
        this.skip();
      }

      const view = render({
        items: [{ id: 'C:\\\\', label: 'ABCDEF' }],
      });

      expect(view.getItemContent('C:\\\\').textContent).to.equal('ABCDEF');
    });
  });
});

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

  describe('PropTypes warnings', () => {
    beforeEach(() => {
      PropTypes.resetWarningCache();
    });

    it('should warn if an onFocus callback is supplied', () => {
      expect(() => {
        PropTypes.checkPropTypes(
          TreeItem.propTypes,
          { itemId: 'one', onFocus: () => {} },
          'prop',
          'TreeItem',
        );
      }).toErrorDev('Failed prop type: The prop `onFocus` is not supported.');
    });
  });
});
