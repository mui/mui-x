import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesTreeItemProvider = createTypes(import.meta.url, TreeItemProvider);
