import type { ProductFamily } from '../config';

export const treeViewFamily: ProductFamily = {
  section: 'tree-view',
  packages: ['x-tree-view', 'x-tree-view-pro'],
  includeUnstable: true,
  skipComponent: (_name, filePath) => filePath.includes('/components/'),
};
