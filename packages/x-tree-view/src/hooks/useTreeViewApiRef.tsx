import * as React from 'react';
import { TreeViewAnyPluginSignature, TreeViewPublicAPI } from '../internals/models';
import { DefaultTreeViewPlugins } from '../internals';

/**
 * Hook that instantiates a [[TreeViewApiRef]].
 */
export const useTreeViewApiRef = <
  TPlugins extends readonly TreeViewAnyPluginSignature[] = DefaultTreeViewPlugins,
>() => React.useRef(undefined) as React.MutableRefObject<TreeViewPublicAPI<TPlugins> | undefined>;
