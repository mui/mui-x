import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import {
  RichTreeViewPropsBase,
  RichTreeViewRoot,
} from '@mui/x-tree-view/RichTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  UseTreeViewExpansionSignature,
  TreeViewPlugin,
  TreeViewPluginSignature,
  DefaultTreeViewPluginParameters,
  DefaultTreeViewPluginSlotProps,
  DefaultTreeViewPluginSlots,
  DEFAULT_TREE_VIEW_PLUGINS,
  extractPluginParamsFromProps,
  useTreeView,
  TreeViewProvider,
} from '@mui/x-tree-view/internals';

interface TreeViewLogExpandedParameters {
  areLogsEnabled?: boolean;
  logMessage?: (message: string) => void;
}

interface TreeViewLogExpandedDefaultizedParameters {
  areLogsEnabled: boolean;
  logMessage?: (message: string) => void;
}

type TreeViewLogExpandedSignature = TreeViewPluginSignature<{
  // The parameters of this plugin as they are passed to `useTreeView`
  params: TreeViewLogExpandedParameters;
  // The parameters of this plugin as they are passed to the plugin after calling `plugin.getDefaultizedParams`
  defaultizedParams: TreeViewLogExpandedDefaultizedParameters;
  // Dependencies of this plugin (we need the expansion plugin to access its model)
  dependantPlugins: [UseTreeViewExpansionSignature];
}>;

const useTreeViewLogExpanded: TreeViewPlugin<TreeViewLogExpandedSignature> = ({
  params,
  models,
}) => {
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

export interface TreeViewProps<R extends {}, Multiple extends boolean | undefined>
  extends DefaultTreeViewPluginParameters<R, Multiple>,
    TreeViewLogExpandedParameters,
    RichTreeViewPropsBase {
  slots?: DefaultTreeViewPluginSlots;
  slotProps?: DefaultTreeViewPluginSlotProps;
}

const TREE_VIEW_PLUGINS = [
  ...DEFAULT_TREE_VIEW_PLUGINS,
  useTreeViewLogExpanded,
] as const;

function TreeView<R extends {}, Multiple extends boolean | undefined>(
  inProps: TreeViewProps<R, Multiple>,
) {
  const themeProps = useThemeProps({ props: inProps, name: 'HeadlessTreeView' });
  const ownerState = themeProps as TreeViewProps<any, any>;

  const { pluginParams, otherProps } = extractPluginParamsFromProps<
    typeof TREE_VIEW_PLUGINS,
    DefaultTreeViewPluginSlots,
    DefaultTreeViewPluginSlotProps,
    TreeViewProps<R, Multiple>
  >({
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

  const renderItem = ({
    children: itemChildren,
    ...itemProps
  }: ReturnType<typeof instance.getItemsToRender>[number]) => {
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

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
  const [logs, setLogs] = React.useState<string[]>([]);

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
