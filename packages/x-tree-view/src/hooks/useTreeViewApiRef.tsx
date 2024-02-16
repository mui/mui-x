import * as React from 'react';
import { TreeViewAnyPluginSignature, TreeViewUsedPublicAPI } from '../internals/models';

/**
 * Hook that instantiate a [[TreeViewApiRef]].
 */
export const useTreeViewApiRef = <
  T extends TreeViewAnyPluginSignature,
  Api extends TreeViewUsedPublicAPI<T>,
>() => React.useRef({}) as React.MutableRefObject<Api>;
