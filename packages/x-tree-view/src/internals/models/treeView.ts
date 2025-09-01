import { ReadonlyStore, Store } from '@mui/x-internals/store';
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
   * Only defined for `<RichTreeView />` and `<RichTreeViewPro />`.
   */
  depth?: number;
  /**
   * Only defined for `<RichTreeView />` and `<RichTreeViewPro />`.
   */
  label?: string;
}

export type TreeViewInstance<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> = MergeSignaturesProperty<[...TreeViewCorePluginSignatures, ...TSignatures], 'instance'> &
  Partial<MergeSignaturesProperty<TOptionalSignatures, 'instance'>>;

export type TreeViewPublicAPI<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> = MergeSignaturesProperty<[...TreeViewCorePluginSignatures, ...TSignatures], 'publicAPI'> &
  Partial<MergeSignaturesProperty<TOptionalSignatures, 'instance'>>;

export type TreeViewState<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> = MergeSignaturesProperty<[...TreeViewCorePluginSignatures, ...TSignatures], 'state'> &
  Partial<MergeSignaturesProperty<TOptionalSignatures, 'state'>>;

export type TreeViewStore<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> = Store<TreeViewState<TSignatures, TOptionalSignatures>>;

export type TreeViewReadonlyStore<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
> = ReadonlyStore<TreeViewState<TSignatures, TOptionalSignatures>>;
