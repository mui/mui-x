import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTreeView } from '@mui/x-tree-view/internals/useTreeView';
import { TreeViewProvider } from '@mui/x-tree-view/internals/TreeViewProvider';
import { TreeViewPropsBase } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  TreeViewPlugin,
  TreeViewPluginSignature,
} from '@mui/x-tree-view/internals/models';
/* eslint-disable */
import {
  DefaultTreeViewPluginParameters,
  DEFAULT_TREE_VIEW_PLUGINS,
} from '@mui/x-tree-view/internals/plugins/defaultPlugins';
import { UseTreeViewExpansionSignature } from '@mui/x-tree-view/internals/plugins/useTreeViewExpansion';
if (false) {
  console.log(
    'This log is here to make sure the js version has a lint error, otherwise we have a CI error',
  );
}
/* eslint-enable */

interface TreeViewLogExpandedParameters {
  log?: boolean;
}

interface TreeViewLogExpandedDefaultizedParameters {
  log: boolean;
}

type TreeViewLogExpandedSignature = TreeViewPluginSignature<
  // The parameters of this plugin as they are passed to `usedTreeView`
  TreeViewLogExpandedParameters,
  // The parameters of this plugin as they are passed to the plugin after calling `plugin.getDefaultizedParams`
  TreeViewLogExpandedDefaultizedParameters,
  // Instance methods of this plugin: we don't have any
  {},
  // State of this plugin: we don't have any
  {},
  // Models of this plugin: we don't have any
  never,
  // Dependencies of this plugin (we need the expansion plugin to access its model)
  [UseTreeViewExpansionSignature]
>;

const useTreeViewLogExpanded: TreeViewPlugin<TreeViewLogExpandedSignature> = ({
  params,
  models,
}) => {
  React.useEffect(() => {
    if (params.log) {
      const log = console.log;
      log('Expanded items: ', models.expanded.value);
    }
  }, [models.expanded.value, params.log]);
};

// Sets the default value of this plugin parameters.
useTreeViewLogExpanded.getDefaultizedParams = (params) => ({
  ...params,
  log: false,
});

// This could be exported from the package in the future
const TreeViewRoot = styled('ul', {
  name: 'MuiTreeView',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: TreeViewProps<any> }>({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  outline: 0,
});

export interface TreeViewProps<Multiple extends boolean | undefined>
  extends DefaultTreeViewPluginParameters<Multiple>,
    TreeViewLogExpandedParameters,
    TreeViewPropsBase {}

const plugins = [...DEFAULT_TREE_VIEW_PLUGINS, useTreeViewLogExpanded] as const;

function TreeView<Multiple extends boolean | undefined>(
  inProps: TreeViewProps<Multiple>,
) {
  const themeProps = useThemeProps({ props: inProps, name: 'MuiTreeView' });
  const ownerState = themeProps as TreeViewProps<any>;

  const {
    // Headless implementation
    disabledItemsFocusable,
    expanded,
    defaultExpanded,
    onNodeToggle,
    onNodeFocus,
    disableSelection,
    defaultSelected,
    selected,
    multiSelect,
    onNodeSelect,
    id,
    defaultCollapseIcon,
    defaultEndIcon,
    defaultExpandIcon,
    defaultParentIcon,
    log,
    // Component implementation
    children,
    ...other
  } = themeProps as TreeViewProps<any>;

  const { getRootProps, contextValue } = useTreeView({
    disabledItemsFocusable,
    expanded,
    defaultExpanded,
    onNodeToggle,
    onNodeFocus,
    disableSelection,
    defaultSelected,
    selected,
    multiSelect,
    onNodeSelect,
    id,
    defaultCollapseIcon,
    defaultEndIcon,
    defaultExpandIcon,
    defaultParentIcon,
    log,
    plugins,
  });

  const rootProps = useSlotProps({
    elementType: TreeViewRoot,
    externalSlotProps: {},
    externalForwardedProps: other,
    getSlotProps: getRootProps,
    ownerState,
  });

  return (
    <TreeViewProvider value={contextValue}>
      <TreeViewRoot {...rootProps}>{children}</TreeViewRoot>
    </TreeViewProvider>
  );
}

export default function HeadlessTreeView() {
  return (
    <TreeView
      log
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <TreeItem nodeId="1" label="Applications">
        <TreeItem nodeId="2" label="Calendar" />
      </TreeItem>
      <TreeItem nodeId="5" label="Documents">
        <TreeItem nodeId="10" label="OSS" />
        <TreeItem nodeId="6" label="MUI">
          <TreeItem nodeId="8" label="index.js" />
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
}
