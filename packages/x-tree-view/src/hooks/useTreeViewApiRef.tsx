import * as React from 'react';
import { TreeViewAnyPluginSignature, TreeViewUsedPublicAPI } from '../internals/models';

/**
 * Hook that instantiates a [[TreeViewApiRef]].
 */
export const useTreeViewApiRef = <
  T extends TreeViewAnyPluginSignature,
  Api extends TreeViewUsedPublicAPI<T>,
>() => React.useRef(undefined) as React.MutableRefObject<Api>;
