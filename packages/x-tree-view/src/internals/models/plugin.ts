import { TreeViewItemPlugin } from './itemPlugin';

export type TreeViewPlugin<TSignature extends TreeViewAnyPluginSignature> = {
  /**
   * The main function of the plugin that will be executed by the Tree View.
   *
   * This should be a valid React `use` function, as it will be executed in the render phase and can contain hooks.
   */
  (options: TreeViewPluginOptions<TSignature>): TreeViewResponse<TSignature>;
  /**
   * A function that receives the parameters and returns them after being processed with the default values.
   *
   * @param {TreeViewUsedParams<TSignature>} options The options object.
   * @param {TreeViewUsedParams<TSignature>['params']} options.params The parameters before being processed with the default values.
   * @returns {TSignature['paramsWithDefaults']} The parameters after being processed with the default values.
   */
  applyDefaultValuesToParams?: (options: {
    params: TreeViewUsedParams<TSignature>;
  }) => TSignature['paramsWithDefaults'];
  /**
   * The initial state is computed after the default values are applied.
   * It sets up the state for the first render.
   * Other state modifications have to be done in effects and so could not be applied on the initial render.
   *
   * @param {TreeViewUsedParamsWithDefaults<TSignature>} params The parameters after being processed with the default values.
   * @returns {TSignature['state']} The initial state of the plugin.
   */
  getInitialState?: (params: TreeViewUsedParamsWithDefaults<TSignature>) => TSignature['state'];
  /**
   * An object where each property used by the plugin is set to `true`.
   */
  params: Record<keyof TSignature['params'], true>;
  itemPlugin?: TreeViewItemPlugin;
  /**
   * Render function used to add React wrappers around the TreeItem.
   * @param {{ nodeId: TreeViewItemId; children: React.ReactNode; }} params The params of the item.
   * @returns {React.ReactNode} The wrapped item.
   */
  wrapItem?: TreeItemWrapper<[TSignature, ...TSignature['dependencies']]>;
  /**
   * Render function used to add React wrappers around the TreeView.
   * @param {{ children: React.ReactNode; }} params The params of the root.
   * @returns {React.ReactNode} The wrapped root.
   */
  wrapRoot?: TreeRootWrapper;
};
