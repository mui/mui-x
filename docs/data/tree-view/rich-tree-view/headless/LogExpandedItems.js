import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RichTreeViewRoot } from '@mui/x-tree-view/RichTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  DEFAULT_TREE_VIEW_PLUGINS,
  extractPluginParamsFromProps,
  useTreeView,
  TreeViewProvider,
} from '@mui/x-tree-view/internals';

const useTreeViewLogExpanded = ({ params, models }) => {
  const expandedStr = JSON.stringify(models.expandedItems.value);

  React.useEffect(() => {
    if (params.areLogsEnabled && params.logMessage) {
      params.logMessage(`Expanded items: ${expandedStr}`);
    }
  }, [expandedStr]); // eslint-disable-line react-hooks/exhaustive-deps

  return {};
};

// Sets the default value of this plugin parameters.
useTreeViewLogExpanded.getDefaultizedParams = (params) => ({
  ...params,
  areLogsEnabled: params.areLogsEnabled ?? false,
});

useTreeViewLogExpanded.params = {
  areLogsEnabled: true,
  logMessage: true,
};

const TREE_VIEW_PLUGINS = [...DEFAULT_TREE_VIEW_PLUGINS, useTreeViewLogExpanded];

function TreeView(inProps) {
  const themeProps = useThemeProps({ props: inProps, name: 'HeadlessTreeView' });
  const ownerState = themeProps;

  const { pluginParams, otherProps } = extractPluginParamsFromProps({
    props: themeProps,
    plugins: TREE_VIEW_PLUGINS,
  });

  const { getRootProps, contextValue, instance } = useTreeView(pluginParams);

  const rootProps = useSlotProps({
    elementType: RichTreeViewRoot,
    externalSlotProps: {},
    externalForwardedProps: otherProps,
    getSlotProps: getRootProps,
    ownerState,
  });

  const itemsToRender = instance.getItemsToRender();

  const renderItem = ({ children: itemChildren, ...itemProps }) => {
    return (
      <TreeItem key={itemProps.itemId} {...itemProps}>
        {itemChildren?.map(renderItem)}
      </TreeItem>
    );
  };

  return (
    <TreeViewProvider value={contextValue}>
      <RichTreeViewRoot {...rootProps}>
        {itemsToRender.map(renderItem)}
      </RichTreeViewRoot>
    </TreeViewProvider>
  );
}

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function LogExpandedItems() {
  const [logs, setLogs] = React.useState([]);

  return (
    <Stack spacing={2}>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <TreeView
          items={MUI_X_PRODUCTS}
          areLogsEnabled
          logMessage={(message) =>
            setLogs((prev) =>
              prev[prev.length - 1] === message ? prev : [...prev, message],
            )
          }
        />
      </Box>
      <Stack spacing={1}>
        {logs.map((log, index) => (
          <Typography key={index}>{log}</Typography>
        ))}
      </Stack>
    </Stack>
  );
}
