import { TreeViewContextValue } from '@mui/x-tree-view/internals/TreeViewProvider';
import { SimpleTreeViewPluginSignatures } from '@mui/x-tree-view/SimpleTreeView/SimpleTreeView.plugins';
import { TreeViewStore } from '@mui/x-tree-view/internals/utils/TreeViewStore';

export const getFakeContextValue = (
  features: { checkboxSelection?: boolean } = {},
): TreeViewContextValue<SimpleTreeViewPluginSignatures> => ({
  instance: {
    isItemExpandable: () => false,
  } as any,
  publicAPI: {} as any,
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
    onItemClick: () => {},
  },
  icons: {
    slots: {},
    slotProps: {},
  },
  selection: {
    multiSelect: false,
    checkboxSelection: features.checkboxSelection ?? false,
    disableSelection: false,
    selectionPropagation: {},
  },
  treeId: 'mui-tree-view-1',
  rootRef: {
    current: null,
  },
  expansion: { expansionTrigger: 'content' },
  store: new TreeViewStore({
    initialState: {
      cacheKey: { id: 1 },
      id: { treeId: 'mui-tree-view-1', providedTreeId: undefined },
      items: { itemMetaMap: {}, itemMap: {}, itemOrderedChildrenIds: {}, itemChildrenIndexes: {} },
      expansion: { expandedItemsMap: new Map() },
      selection: { selectedItemsMap: new Map() },
      focus: { focusedItemId: null, defaultFocusableItemId: null },
    },
    forceUpdate: () => {},
  }),
});
