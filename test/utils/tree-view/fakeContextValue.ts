import { Store } from '@base-ui-components/utils/store';
import { TreeViewContextValue } from '@mui/x-tree-view/internals/TreeViewProvider';
import { SimpleTreeViewPluginSignatures } from '@mui/x-tree-view/SimpleTreeView/SimpleTreeView.plugins';

export const getFakeContextValue = (
  features: { checkboxSelection?: boolean } = {},
): TreeViewContextValue<SimpleTreeViewPluginSignatures> => ({
  instance: {} as any,
  publicAPI: {} as any,
  runItemPlugins: () => ({
    rootRef: null,
    contentRef: null,
    propsEnhancers: {},
  }),
  wrapItem: ({ children }) => children,
  wrapRoot: ({ children }) => children,
  rootRef: {
    current: null,
  },
  store: new Store({
    cacheKey: { id: 1 },
    id: { treeId: 'mui-tree-view-1', providedTreeId: undefined },
    items: {
      disabledItemsFocusable: false,
      itemMetaLookup: {},
      itemModelLookup: {},
      itemOrderedChildrenIdsLookup: {},
      itemChildrenIndexesLookup: {},
      loading: false,
      error: null,
      domStructure: 'nested',
    },
    expansion: { expandedItems: [], expansionTrigger: 'content' },
    selection: {
      selectedItems: null,
      isEnabled: true,
      isMultiSelectEnabled: false,
      isCheckboxSelectionEnabled: features.checkboxSelection ?? false,
      selectionPropagation: { parents: false, descendants: false },
    },
    focus: { focusedItemId: null },
  }) as any,
});
