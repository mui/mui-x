import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useTreeView } from '@mui/x-tree-view/internals/useTreeView';
import { TreeViewProvider } from '@mui/x-tree-view/internals/TreeViewProvider';
import { RichTreeViewRoot } from '@mui/x-tree-view/RichTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

/* eslint-disable */
import { DEFAULT_TREE_VIEW_PLUGINS } from '@mui/x-tree-view/internals/plugins/defaultPlugins';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
if (false) {
  console.log(
    'This log is here to make sure the js version has a lint error, otherwise we have a CI error',
  );
}
/* eslint-enable */

const useTreeViewLogExpanded = ({ params, models }) => {
  const expandedStr = JSON.stringify(models.expandedNodes.value);

  React.useEffect(() => {
    if (params.areLogsEnabled && params.logMessage) {
      params.logMessage(`Expanded items: ${expandedStr}`);
    }
  }, [expandedStr]); // eslint-disable-line react-hooks/exhaustive-deps
};

// Sets the default value of this plugin parameters.
useTreeViewLogExpanded.getDefaultizedParams = (params) => ({
  ...params,
  areLogsEnabled: params.areLogsEnabled ?? false,
});

const plugins = [...DEFAULT_TREE_VIEW_PLUGINS, useTreeViewLogExpanded];

function TreeView(inProps) {
  const themeProps = useThemeProps({ props: inProps, name: 'HeadlessTreeView' });
  const ownerState = themeProps;

  const {
    // Headless implementation
    disabledItemsFocusable,
    expandedNodes,
    defaultExpandedNodes,
    onExpandedNodesChange,
    onNodeExpansionToggle,
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
    items,
    logMessage,
    areLogsEnabled,
    // Component implementation
    children,
    ...other
  } = themeProps;

  const { getRootProps, contextValue, instance } = useTreeView({
    disabledItemsFocusable,
    expandedNodes,
    defaultExpandedNodes,
    onExpandedNodesChange,
    onNodeExpansionToggle,
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
    logMessage,
    areLogsEnabled,
    items,
    plugins,
  });

  const rootProps = useSlotProps({
    elementType: RichTreeViewRoot,
    externalSlotProps: {},
    externalForwardedProps: other,
    getSlotProps: getRootProps,
    ownerState,
  });

  const nodesToRender = instance.getNodesToRender();

  const renderNode = ({ children: itemChildren, ...itemProps }) => {
    return (
      <TreeItem key={itemProps.nodeId} {...itemProps}>
        {itemChildren?.map(renderNode)}
      </TreeItem>
    );
  };

  return (
    <TreeViewProvider value={contextValue}>
      <RichTreeViewRoot {...rootProps}>
        {nodesToRender.map(renderNode)}
      </RichTreeViewRoot>
    </TreeViewProvider>
  );
}

const ITEMS = [
  {
    id: '1',
    label: 'Applications',
    children: [{ id: '2', label: 'Calendar' }],
  },
  {
    id: '5',
    label: 'Documents',
    children: [
      { id: '10', label: 'OSS' },
      { id: '6', label: 'MUI', children: [{ id: '8', label: 'index.js' }] },
    ],
  },
];

export default function HeadlessTreeView() {
  const [logs, setLogs] = React.useState([]);

  return (
    <Stack spacing={2}>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        items={ITEMS}
        areLogsEnabled
        logMessage={(message) =>
          setLogs((prev) =>
            prev[prev.length - 1] === message ? prev : [...prev, message],
          )
        }
      />
      <Stack spacing={1}>
        {logs.map((log, index) => (
          <Typography key={index}>{log}</Typography>
        ))}
      </Stack>
    </Stack>
  );
}
