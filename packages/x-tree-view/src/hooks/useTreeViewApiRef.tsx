'use client';
import * as React from 'react';
import { TreeViewAnyStore, TreeViewPublicAPI } from '../internals/models';
import { RichTreeViewStore } from '../internals/RichTreeViewStore';

/**
 * Hook that instantiates a [[TreeViewApiRef]].
 */
export const useTreeViewApiRef = <
  TStore extends TreeViewAnyStore = RichTreeViewStore<any, any>,
>() => React.useRef(undefined) as React.RefObject<TreeViewPublicAPI<TStore> | undefined>;
