'use client';
import * as React from 'react';
import { TreeViewItemId } from '../../models';
import { MinimalTreeViewState } from '../MinimalTreeViewStore';

export const TreeViewItemDepthContext = React.createContext<
  ((state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId) => number) | number
>(() => -1);
