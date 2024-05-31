import * as React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { createRenderer } from '@mui/internal-test-utils';
import { SimpleTreeViewPlugins } from '@mui/x-tree-view/SimpleTreeView/SimpleTreeView.plugins';
import { TreeItem, treeItemClasses as classes } from '@mui/x-tree-view/TreeItem';
import { TreeViewContextValue } from '@mui/x-tree-view/internals/TreeViewProvider';
import { TreeViewContext } from '@mui/x-tree-view/internals/TreeViewProvider/TreeViewContext';
import { describeConformance } from 'test/utils/describeConformance';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';

const TEST_TREE_VIEW_CONTEXT_VALUE: TreeViewContextValue<SimpleTreeViewPlugins> = {
  instance: {
    isItemExpandable: () => false,
    isItemExpanded: () => false,
    isItemFocused: () => false,
    isItemSelected: () => false,
    isItemDisabled: (itemId: string | null): itemId is string => !!itemId,
    getTreeItemIdAttribute: () => '',
    mapFirstCharFromJSX: () => () => {},
    canItemBeTabbed: () => false,
  } as any,
  publicAPI: {
    focusItem: () => {},
    getItem: () => ({}),
    setItemExpansion: () => {},
  },
  runItemPlugins: () => ({ rootRef: null, contentRef: null }),
  wrapItem: ({ children }) => children,
  wrapRoot: ({ children }) => children,
  disabledItemsFocusable: false,
  indentationAtItemLevel: false,
  icons: {
    slots: {},
    slotProps: {},
  },
  selection: {
    multiSelect: false,
    checkboxSelection: false,
    disableSelection: false,
  },
  rootRef: {
    current: null,
  },
};

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

      const response = render({
        items: [{ id: '1' }],
        slotProps: { item: { ContentComponent } },
      });

      expect(response.getItemContent('1').textContent).to.equal('MOCK CONTENT COMPONENT');
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

      const response = render({
        items: [{ id: '1' }],
        slotProps: { item: { ContentComponent, ContentProps: { customProp: 'ABCDEF' } as any } },
      });

      expect(response.getItemContent('1').textContent).to.equal('ABCDEF');
    });
  });
});

describe('<TreeItem />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeItem itemId="one" label="one" />, () => ({
    classes,
    inheritComponent: 'li',
    wrapMount: (mount) => (item: React.ReactNode) => {
      const wrapper = mount(
        <TreeViewContext.Provider value={TEST_TREE_VIEW_CONTEXT_VALUE}>
          {item}
        </TreeViewContext.Provider>,
      );
      return wrapper.childAt(0);
    },
    render: (item) => {
      return render(
        <TreeViewContext.Provider value={TEST_TREE_VIEW_CONTEXT_VALUE}>
          {item}
        </TreeViewContext.Provider>,
      );
    },
    muiName: 'MuiTreeItem',
    refInstanceof: window.HTMLLIElement,
    skip: ['reactTestRenderer', 'componentProp', 'componentsProp', 'themeVariants'],
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
