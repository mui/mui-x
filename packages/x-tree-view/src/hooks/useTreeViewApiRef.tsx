'use client';
import * as React from 'react';
import { TreeViewAnyPluginSignature, TreeViewPublicAPI } from '../internals/models';
import { RichTreeViewPluginSignatures } from '../RichTreeView/RichTreeView.plugins';

/**
 * Hook that instantiates a [[TreeViewApiRef]].
 * @deprecated Use `useRichTreeViewApiRef()`, `useRichTreeViewProApiRef()` or `useSimpleTreeViewApiRef()` instead.
 */
export const useTreeViewApiRef = <
  TSignatures extends readonly TreeViewAnyPluginSignature[] = RichTreeViewPluginSignatures,
>() => React.useRef(undefined) as React.RefObject<TreeViewPublicAPI<TSignatures> | undefined>;
