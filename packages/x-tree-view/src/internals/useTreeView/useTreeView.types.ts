import * as React from 'react';
import { EventHandlers } from '@mui/utils';
import type { TreeViewContextValue } from '../TreeViewProvider';
import {
  TreeViewAnyPluginSignature,
  ConvertSignaturesIntoPlugins,
  MergeSignaturesProperty,
  TreeViewInstance,
  TreeViewPublicAPI,
  TreeViewExperimentalFeatures,
} from '../models';

export interface UseTreeViewParameters<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TProps extends Partial<UseTreeViewBaseProps<TSignatures>>,
> {
  plugins: ConvertSignaturesIntoPlugins<TSignatures>;
  rootRef?: React.Ref<HTMLUListElement> | undefined;
  props: TProps; // Omit<MergeSignaturesProperty<TSignatures, 'params'>, keyof UseTreeViewBaseParameters<any>>
}

export interface UseTreeViewBaseProps<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  apiRef: React.MutableRefObject<TreeViewPublicAPI<TSignatures> | undefined> | undefined;
  slots: MergeSignaturesProperty<TSignatures, 'slots'>;
  slotProps: MergeSignaturesProperty<TSignatures, 'slotProps'>;
  experimentalFeatures: TreeViewExperimentalFeatures<TSignatures>;
}

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
