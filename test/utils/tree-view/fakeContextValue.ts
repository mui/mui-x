import {
  SimpleTreeViewParameters,
  SimpleTreeViewStore,
} from '@mui/x-tree-view/internals/SimpleTreeViewStore';
import { TreeViewContextValue } from '@mui/x-tree-view/internals/TreeViewProvider';

export const getFakeContextValue = (
  parameters: SimpleTreeViewParameters<any> = {},
): TreeViewContextValue<SimpleTreeViewStore<any>> => ({
  publicAPI: {} as any,
  runItemPlugins: () => ({
    rootRef: null,
    contentRef: null,
    propsEnhancers: {},
  }),
  wrapItem: ({ children }) => children,
  rootRef: {
    current: null,
  },
  store: new SimpleTreeViewStore(parameters, false),
});
