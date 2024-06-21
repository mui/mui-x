import { TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';

export interface UseTreeViewIdInstance {
  /**
   * Get the id attribute (i.e.: the `id` attribute passed to the DOM element) of a tree item.
   * If the user explicitly defined an id attribute, it will be returned.
   * Otherwise, the method created a unique id for the item based on the Tree View id attribute and the item `itemId`
   * @param {TreeViewItemId} itemId The id of the item to get the id attribute of.
   * @param {string | undefined} idAttribute The id attribute of the item if explicitly defined by the user.
   * @returns {string} The id attribute of the item.
   */
  getTreeItemIdAttribute: (itemId: TreeViewItemId, idAttribute: string | undefined) => string;
}

export interface UseTreeViewIdParameters {
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id?: string;
}

export type UseTreeViewIdDefaultizedParameters = UseTreeViewIdParameters;

export type UseTreeViewIdSignature = TreeViewPluginSignature<{
  params: UseTreeViewIdParameters;
  defaultizedParams: UseTreeViewIdDefaultizedParameters;
  instance: UseTreeViewIdInstance;
}>;
