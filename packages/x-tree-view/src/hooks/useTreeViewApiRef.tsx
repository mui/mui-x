import * as React from 'react';
import { TreeViewAnyPluginSignature, TreeViewPublicAPI } from '../internals/models';
import { RichTreeViewPluginSignatures } from '../RichTreeView/RichTreeView.plugins';

/**
 * Hook that instantiates a [[TreeViewApiRef]].
 */
export const useTreeViewApiRef = <
  TSignatures extends readonly TreeViewAnyPluginSignature[] = RichTreeViewPluginSignatures,
>() =>
  React.useRef(undefined) as React.MutableRefObject<TreeViewPublicAPI<TSignatures> | undefined>;
