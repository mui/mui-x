import { TreeViewContextValue } from '@mui/x-tree-view/internals/TreeViewProvider';
import { SimpleTreeViewPluginSignatures } from '@mui/x-tree-view/SimpleTreeView/SimpleTreeView.plugins';
import { TreeViewStore } from '@mui/x-tree-view/internals/utils/TreeViewStore';

export const getFakeContextValue = (
  features: { checkboxSelection?: boolean } = {},
): TreeViewContextValue<SimpleTreeViewPluginSignatures> => ({
  instance: {
    isItemExpandable: () => false,
    isItemExpanded: () => false,
    isItemDisabled: () => false,
    getTreeItemIdAttribute: () => '',
    mapFirstCharFromJSX: () => () => {},
  } as any,
  publicAPI: {
    focusItem: () => {},
    getItem: () => ({}),
    getItemOrderedChildrenIds: () => [],
    setItemExpansion: () => {},
    getItemDOMElement: () => null,
    selectItem: () => {},
    getItemTree: () => [],
  },
  runItemPlugins: () => ({
    rootRef: null,
    contentRef: null,
    propsEnhancers: {},
  }),
  wrapItem: ({ children }) => children,
  wrapRoot: ({ children }) => children,
  items: {
    disabledItemsFocusable: false,
    indentationAtItemLevel: false,
  },
  icons: {
    slots: {},
    slotProps: {},
  },
  selection: {
    multiSelect: false,
    checkboxSelection: features.checkboxSelection ?? false,
    disableSelection: false,
  },
  rootRef: {
    current: null,
  },
  expansion: { expansionTrigger: 'content' },
  store: new TreeViewStore({ initialState: {} as any, forceUpdate: () => {} }),
});
