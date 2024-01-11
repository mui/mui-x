import * as React from 'react';
import { TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import { UseTreeViewSelectionSignature } from '../useTreeViewSelection';

export interface UseTreeViewContextValueBuilderParameters {
  /**
   * The default icon used to collapse the node.
   */
  defaultCollapseIcon?: React.ReactNode;
  /**
   * The default icon displayed next to a end node. This is applied to all
   * tree nodes and can be overridden by the TreeItem `icon` prop.
   */
  defaultEndIcon?: React.ReactNode;
  /**
   * The default icon used to expand the node.
   */
  defaultExpandIcon?: React.ReactNode;
  /**
   * The default icon displayed next to a parent node. This is applied to all
   * parent nodes and can be overridden by the TreeItem `icon` prop.
   */
  defaultParentIcon?: React.ReactNode;
}

export type UseTreeViewContextValueBuilderDefaultizedParameters =
  UseTreeViewContextValueBuilderParameters;

export type UseTreeViewContextValueBuilderSignature = TreeViewPluginSignature<
  UseTreeViewContextValueBuilderParameters,
  UseTreeViewContextValueBuilderDefaultizedParameters,
  {},
  {},
  {},
  never,
  [UseTreeViewNodesSignature, UseTreeViewSelectionSignature]
>;
