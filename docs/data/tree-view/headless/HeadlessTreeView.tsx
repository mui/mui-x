import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeView } from '@mui/x-tree-view/internals/useTreeView';
import { TreeViewProvider } from '@mui/x-tree-view/internals/TreeViewProvider';
import {
  RichTreeViewPropsBase,
  RichTreeViewRoot,
} from '@mui/x-tree-view/RichTreeView';
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
import { extractPluginParamsFromProps } from '@mui/x-tree-view/internals/utils/extractPluginParamsFromProps';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
if (false) {
  console.log(
    'This log is here to make sure the js version has a lint error, otherwise we have a CI error',
  );
}
/* eslint-enable */

interface TreeViewLogExpandedParameters {
  areLogsEnabled?: boolean;
  logMessage?: (message: string) => void;
}

interface TreeViewLogExpandedDefaultizedParameters {
  areLogsEnabled: boolean;
  logMessage?: (message: string) => void;
}

type TreeViewLogExpandedSignature = TreeViewPluginSignature<
  // The parameters of this plugin as they are passed to `useTreeView`
  TreeViewLogExpandedParameters,
  // The parameters of this plugin as they are passed to the plugin after calling `plugin.getDefaultizedParams`
  TreeViewLogExpandedDefaultizedParameters,
  // Instance methods of this plugin: we don't have any
  {},
  // Events defined by this plugin: we don't have any
  {},
  // State defined by this plugin: we don't have any
  {},
  // Models defined by plugin: we don't have any
  never,
  // Dependencies of this plugin (we need the expansion plugin to access its model)
  [UseTreeViewExpansionSignature]
>;

const useTreeViewLogExpanded: TreeViewPlugin<TreeViewLogExpandedSignature> = ({
  params,
  models,
}) => {
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

useTreeViewLogExpanded.params = {
  areLogsEnabled: true,
  logMessage: true,
};

export interface TreeViewProps<R extends {}, Multiple extends boolean | undefined>
  extends DefaultTreeViewPluginParameters<R, Multiple>,
    TreeViewLogExpandedParameters,
    RichTreeViewPropsBase {}

const plugins = [...DEFAULT_TREE_VIEW_PLUGINS, useTreeViewLogExpanded] as const;

function TreeView<R extends {}, Multiple extends boolean | undefined>(
  inProps: TreeViewProps<R, Multiple>,
) {
  const themeProps = useThemeProps({ props: inProps, name: 'HeadlessTreeView' });
  const ownerState = themeProps as TreeViewProps<any, any>;

  const { pluginParams, otherProps } = extractPluginParamsFromProps({
    props: themeProps,
    plugins,
  });

  const { getRootProps, contextValue, instance } = useTreeView(pluginParams);

  const rootProps = useSlotProps({
    elementType: RichTreeViewRoot,
    externalSlotProps: {},
    externalForwardedProps: otherProps,
    getSlotProps: getRootProps,
    ownerState,
  });

  const nodesToRender = instance.getNodesToRender();

  const renderNode = ({
    children: itemChildren,
    ...itemProps
  }: ReturnType<typeof instance.getNodesToRender>[number]) => {
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

const ITEMS: TreeViewBaseItem[] = [
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
  const [logs, setLogs] = React.useState<string[]>([]);

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
