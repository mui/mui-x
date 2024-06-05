import * as React from 'react';
import { TreeViewAnyPluginSignature, TreeViewPublicAPI } from '../internals/models';
import { DefaultTreeViewPluginSignatures } from '../internals';

/**
 * Hook that instantiates a [[TreeViewApiRef]].
 */
export const useTreeViewApiRef = <
  TSignatures extends readonly TreeViewAnyPluginSignature[] = DefaultTreeViewPluginSignatures,
>() =>
  React.useRef(undefined) as React.MutableRefObject<TreeViewPublicAPI<TSignatures> | undefined>;
