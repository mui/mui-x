import type { TreeViewAnyPluginSignature } from './plugin';
import type { MergeSignaturesProperty } from './helpers';
import type { TreeViewCorePluginSignatures } from '../corePlugins';

export interface TreeViewItemMeta {
  id: string;
  idAttribute: string | undefined;
  parentId: string | null;
  expandable: boolean;
  disabled: boolean;
  /**
   * Only defined for `RichTreeView` and `RichTreeViewPro`.
   */
  depth?: number;
  /**
   * Only defined for `RichTreeView` and `RichTreeViewPro`.
   */
  label?: string;
}

export interface TreeViewModel<TValue> {
  name: string;
  value: TValue;
  setControlledValue: (value: TValue | ((prevValue: TValue) => TValue)) => void;
}

export type TreeViewInstance<TSignatures extends readonly TreeViewAnyPluginSignature[]> =
  MergeSignaturesProperty<[...TreeViewCorePluginSignatures, ...TSignatures], 'instance'>;

export type TreeViewPublicAPI<TSignatures extends readonly TreeViewAnyPluginSignature[]> =
  MergeSignaturesProperty<[...TreeViewCorePluginSignatures, ...TSignatures], 'publicAPI'>;

export type TreeViewExperimentalFeatures<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
> = { [key in MergeSignaturesProperty<TSignatures, 'experimentalFeatures'>]?: boolean };
