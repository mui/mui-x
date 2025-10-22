'use client';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewIdSignature } from './useTreeViewId.types';

export const useTreeViewId: TreeViewPlugin<UseTreeViewIdSignature> = () => {
  return {};
};

useTreeViewId.params = {
  id: true,
};
