'use client';
import * as React from 'react';
import type { TreeViewItemId } from '../../models';
import type { MinimalTreeViewState } from '../MinimalTreeViewStore';

export const TreeViewItemDepthContext = React.createContext<
  ((state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId) => number) | number
>(() => -1);
