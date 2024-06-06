import * as React from 'react';
import { EventHandlers } from '@mui/base/utils';
import type { TreeViewContextValue } from '../TreeViewProvider';
import {
  TreeViewAnyPluginSignature,
  ConvertSignaturesIntoPlugins,
  MergeSignaturesProperty,
  TreeViewInstance,
  TreeViewPublicAPI,
  TreeViewExperimentalFeatures,
} from '../models';
import { TreeViewCorePluginSignatures } from '../corePlugins';

export type UseTreeViewParameters<TSignatures extends readonly TreeViewAnyPluginSignature[]> =
  UseTreeViewBaseParameters<TSignatures> &
    Omit<MergeSignaturesProperty<TSignatures, 'params'>, keyof UseTreeViewBaseParameters<any>>;

export interface UseTreeViewBaseParameters<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
> {
  apiRef: React.MutableRefObject<TreeViewPublicAPI<TSignatures>> | undefined;
  rootRef?: React.Ref<HTMLUListElement> | undefined;
  plugins: ConvertSignaturesIntoPlugins<TSignatures>;
  slots: MergeSignaturesProperty<TSignatures, 'slots'>;
  slotProps: MergeSignaturesProperty<TSignatures, 'slotProps'>;
  experimentalFeatures: TreeViewExperimentalFeatures<TSignatures>;
}

export type UseTreeViewDefaultizedParameters<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
> = UseTreeViewBaseParameters<TSignatures> &
  MergeSignaturesProperty<[...TreeViewCorePluginSignatures, ...TSignatures], 'defaultizedParams'>;

export interface UseTreeViewRootSlotProps
  extends Pick<
    React.HTMLAttributes<HTMLUListElement>,
    'onFocus' | 'onBlur' | 'onKeyDown' | 'id' | 'aria-multiselectable' | 'role' | 'tabIndex'
  > {
  ref: React.Ref<HTMLUListElement>;
}

export interface UseTreeViewReturnValue<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  getRootProps: <TOther extends EventHandlers = {}>(
    otherHandlers?: TOther,
  ) => UseTreeViewRootSlotProps;
  rootRef: React.RefCallback<HTMLUListElement> | null;
  contextValue: TreeViewContextValue<TSignatures>;
  instance: TreeViewInstance<TSignatures>;
}
