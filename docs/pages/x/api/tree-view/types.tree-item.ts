import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesTreeItem = createTypes(import.meta.url, TreeItem);
