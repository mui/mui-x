import { UseTreeViewStoreParameters } from '@mui/x-tree-view/internals';
import { SimpleTreeViewStore } from '@mui/x-tree-view/internals/SimpleTreeViewStore';
import { TreeViewContextValue } from '@mui/x-tree-view/internals/TreeViewProvider';

export const getFakeContextValue = (
  parameters: UseTreeViewStoreParameters<SimpleTreeViewStore<any>> = {},
): TreeViewContextValue<SimpleTreeViewStore<any>> => {
  const store = new SimpleTreeViewStore({ ...parameters, isRtl: false });

  return {
    store,
    publicAPI: store.buildPublicAPI(),
    runItemPlugins: () => ({
      rootRef: null,
      contentRef: null,
      propsEnhancers: {},
    }),
    wrapItem: ({ children }) => children,
    rootRef: {
      current: null,
    },
  };
};
