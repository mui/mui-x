import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useTreeView } from '@mui/x-tree-view/internals/useTreeView';
import { TreeViewProvider } from '@mui/x-tree-view/internals/TreeViewProvider';

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
  const expandedStr = JSON.stringify(models.expanded.value);

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

// This could be exported from the package in the future
const TreeViewRoot = styled('ul', {
  name: 'HeadlessTreeView',
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
  const themeProps = useThemeProps({ props: inProps, name: 'HeadlessTreeView' });
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
    items,
    logMessage,
    areLogsEnabled,
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
    logMessage,
    areLogsEnabled,
    items,
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

const ITEMS = [
  {
    nodeId: '1',
    label: 'Application',
    children: [{ nodeId: '2', label: 'Calendar' }],
  },
  {
    nodeId: '5',
    label: 'Documents',
    children: [
      { nodeId: '10', label: 'OSS' },
      { nodeId: '6', label: 'MUI', children: [{ nodeId: '8', label: 'index.js' }] },
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
