import type { TreeViewAnyPluginSignature } from './plugin';
import type { MergePluginsProperty } from './helpers';

export interface TreeViewItemMeta {
  id: string;
  idAttribute: string | undefined;
  parentId: string | null;
  expandable: boolean;
  disabled: boolean;
  depth: number;
  /**
   * Only defined for `RichTreeView`.
   */
  label?: string;
}

export interface TreeViewModel<TValue> {
  name: string;
  value: TValue;
  setControlledValue: (value: TValue | ((prevValue: TValue) => TValue)) => void;
}

export type TreeViewInstance<TSignatures extends readonly TreeViewAnyPluginSignature[]> =
  MergePluginsProperty<TSignatures, 'instance'>;

export type TreeViewPublicAPI<TSignatures extends readonly TreeViewAnyPluginSignature[]> =
  MergePluginsProperty<TSignatures, 'publicAPI'>;

export type TreeViewExperimentalFeatures<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
> = { [key in MergePluginsProperty<TSignatures, 'experimentalFeatures'>]?: boolean };
