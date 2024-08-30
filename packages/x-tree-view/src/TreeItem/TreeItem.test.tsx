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
    it('should use the ContentComponent prop when defined', function test() {
      if (treeItemComponentName === 'TreeItem2') {
        this.skip();
      }

      const ContentComponent = React.forwardRef((props: any, ref: React.Ref<HTMLDivElement>) => (
        <div className={props.classes.root} ref={ref}>
          MOCK CONTENT COMPONENT
        </div>
      ));

      const view = render({
        items: [{ id: '1' }],
        slotProps: { item: { ContentComponent } },
      });

      expect(view.getItemContent('1').textContent).to.equal('MOCK CONTENT COMPONENT');
    });

    it('should use the ContentProps prop when defined', function test() {
      if (treeItemComponentName === 'TreeItem2') {
        this.skip();
      }

      const ContentComponent = React.forwardRef((props: any, ref: React.Ref<HTMLDivElement>) => (
        <div className={props.classes.root} ref={ref}>
          {props.customProp}
        </div>
      ));

      const view = render({
        items: [{ id: '1' }],
        slotProps: { item: { ContentComponent, ContentProps: { customProp: 'ABCDEF' } as any } },
      });

      expect(view.getItemContent('1').textContent).to.equal('ABCDEF');
    });

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

    it('should warn if an `ContentComponent` that does not hold a ref is used', () => {
      expect(() => {
        PropTypes.checkPropTypes(
          TreeItem.propTypes,
          { itemId: 'one', ContentComponent: () => {} },
          'prop',
          'TreeItem',
        );
      }).toErrorDev('Expected an element type that can hold a ref.');
    });
  });
});
