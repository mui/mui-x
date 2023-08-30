import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTreeView } from '@mui/x-tree-view/internals/useTreeView';
import { TreeViewProvider } from '@mui/x-tree-view/internals/TreeViewProvider';

import { TreeItem } from '@mui/x-tree-view/TreeItem';

/* eslint-disable */
import { DEFAULT_TREE_VIEW_PLUGINS } from '@mui/x-tree-view/internals/plugins/defaultPlugins';

if (false) {
  console.log(
    'This log is here to make sure the js version has a lint error, otherwise we have a CI error',
  );
}
/* eslint-enable */

const useTreeViewLogExpanded = ({ params, models }) => {
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
})({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  outline: 0,
});

const plugins = [...DEFAULT_TREE_VIEW_PLUGINS, useTreeViewLogExpanded];

function TreeView(inProps) {
  const themeProps = useThemeProps({ props: inProps, name: 'MuiTreeView' });
  const ownerState = themeProps;

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
  } = themeProps;

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
