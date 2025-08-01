---
productId: x-tree-view
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Headless

Create your custom Tree View.

:::warning
The `useTreeView` hook is not public API for now,
this page is still a _Work in Progress_ and its content is not meant to be used in production.
:::

## Create a custom plugin

### Basic plugin

A custom plugins contains 2 required elements:

1. A hook that will be executed by the `useTreeView` hook:

   ```ts
   const useCustomPlugin = ({ params }) => {
     React.useEffect(() => {
       console.log(params.customParam);
     });

     return {};
   };
   ```

2. A property containing the params used by this topic:

   ```ts
   useCustomPlugin.params = {
     customParam: true,
   };
   ```

### Params default value

Use the `applyDefaultValuesToParams` property to set a default value to your plugin params:

```ts
const useCustomPlugin = ({ params }) => {
  React.useEffect(() => {
    console.log(params.customParam);
  });

  return {};
};

useCustomPlugin.params = { customParam: true };

useCustomPlugin.applyDefaultValuesToParams = ({ params }) => ({
  ...params,
  customParam: params.customParam ?? false,
});
```

### Use elements from another plugin

Your plugin can access the instance methods, the params and the state of any other plugin.

```ts
const useCustomPlugin = ({ store }) => {
  const handleSomeAction = () => {
    // Log the id of the items currently expanded
    console.log(store.value.expansion.expandedItems);

    // Check if an item is expanded
    const isExpanded = useSelector(selectorIsItemExpanded, 'some-item-id');
  };
};
```

### Define a plugin state

TODO

:::warning
Once `focusedItemId` becomes a model, we could consider removing the notion of state and just let each plugin define its state and provide methods in the instance to access / update it.
:::

### Populate the Tree View instance

The Tree View instance is an object accessible in all the plugins and in the Tree Item.
It is the main way a plugin can provide features to the rest of the component.

```ts
const useCustomPlugin = ({ store }) => {
  const toggleCustomModel = () =>
    store.update((prevState) => ({
      ...prevState,
      customModel: !prevState.customModel,
    }));

  return {
    instance: {
      toggleCustomModel,
    },
  };
};
```

You can then use this instance method in any other plugin:

```ts
const useOtherCustomPlugin = ({ instance }) => {
  const handleSomeAction = () => {
    instance.toggleCustomModel();
  };
};
```

### Emit and receive events

```ts
const useCustomPlugin = ({ store }) => {
  const toggleCustomModel = () => {
    const newValue = !selectorCustomModel(store.value);
    store.update((prevState) => ({
      ...prevState,
      customModel: newValue,
    }));
    publishTreeViewEvent(instance, 'toggleCustomModel', { value: newValue });
  };

  return {
    instance: {
      toggleCustomModel,
    },
  };
};
```

You can then subscribe to this event in any other plugin:

```ts
const useOtherCustomPlugin = ({ instance }) => {
  useInstanceEventHandler(instance, 'toggleCustomModel', ({ value }) => {
    console.log('New value of customModel', value);
  });
};
```

:::info
If you are using TypeScript, you need to define your dependencies in your plugin signature, see the [Plugin typing](/x/react-tree-view/rich-tree-view/headless/#plugin-typing) section for more information.
:::

### Pass props to your root element

Use the `getRootProps` property of your returned value to pass props to your root element:

```ts
const useCustomPlugin = ({ params }) => {
  return {
    getRootProps: () => ({
      'data-customparam': params.customParam,
    }),
  };
};
```

### Pass elements to the Tree Item

Use the `contextValue` property in the returned object to pass elements to the Tree Item:

:::warning
The context is private for now and cannot be accessed outside the provided plugins.
You need to modify the `useTreeItemState` hook to return the new value returned by your plugin.
:::

```tsx
const useCustomPlugin = ({ params }) => {
  return {
    contextValue: () => ({
      customPlugin: { enabled: true },
    }),
  };
};

function useTreeItemState(itemId: string) {
  const {
    customPlugin,
    // ...other elements returned by the context
  } = useTreeViewContext<DefaultTreeViewPluginSignatures>();

  // ...rest of the `useTreeItemState` hook content

  return {
    customPlugin,
    // ...other elements returned by `useTreeItemState`
  };
}

function TreeItemContent() {
  const {
    customPlugin,
    // ...other elements returned by `useTreeItemState`
  } = useTreeItemState(props.itemId);

  // Do something with customPlugin.enabled
}
```

### Plugin typing

The typing of a plugin is defined using its _signature_.
This type contains the following information:

```ts
type UseCustomPluginSignature = TreeViewPluginSignature<{
  // The params specific to your plugin before running `applyDefaultValuesToParams`
  params: UseCustomPluginParams;
  // The params specific to your plugins after running `applyDefaultValuesToParams`
  paramsWithDefaults: UseCustomPluginParamsWithDefaults;
  // The methods added to the Tree View instance by your plugin
  instance: UseCustomPluginInstance;
  // The events emitted by your plugin
  events: UseCustomPluginEvents;
  // The states defined by your plugin
  state: UseCustomPluginState;
  // The plugins this plugin needs to work correctly
  dependencies: UseCustomPluginDependantPlugins;
}>;
```

The most basic plugin would have the following signature:

```ts
type UseCustomPluginSignature = TreeViewPluginSignature<{}>;
```

The plugin built in the sections above would have the following signature:

```ts
type UseCustomPluginSignature = TreeViewPluginSignature<{
  params: {
    customParam?: boolean;
    customModel?: boolean;
    defaultCustomModel?: boolean;
  };
  // `customParam` and `defaultCustomModel` have a default value defined in `applyDefaultValuesToParams`
  paramsWithDefaults: {
    customParam: boolean;
    customModel?: boolean;
    defaultCustomModel: boolean;
  };
  instance: { toggleCustomModel: () => void };
  events: {
    toggleCustomModel: {
      params: { value: boolean };
    };
  };
  contextValue: { customPlugin: { enabled: boolean } };
  dependencies: [UseTreeViewExpansionSignature];
}>;
```

## Examples

### Log expanded items

Interact with the Tree View to see the expanded items being logged:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import {
  RichTreeViewPropsBase,
  RichTreeViewRoot,
  RICH_TREE_VIEW_PLUGINS,
  RichTreeViewPluginParameters,
} from '@mui/x-tree-view/RichTreeView';
import {
  UseTreeViewExpansionSignature,
  TreeViewPlugin,
  TreeViewPluginSignature,
  useTreeView,
  TreeViewProvider,
  ConvertPluginsIntoSignatures,
  RichTreeViewItems,
} from '@mui/x-tree-view/internals';

interface TreeViewLogExpandedParameters {
  areLogsEnabled?: boolean;
  logMessage?: (message: string) => void;
}

interface TreeViewLogExpandedParametersWithDefaults {
  areLogsEnabled: boolean;
  logMessage?: (message: string) => void;
}

type TreeViewLogExpandedSignature = TreeViewPluginSignature<{
  // The parameters of this plugin as they are passed to `useTreeView`
  params: TreeViewLogExpandedParameters;
  // The parameters of this plugin as they are passed to the plugin after calling `plugin.getDefaultizedParams`
  paramsWithDefaults: TreeViewLogExpandedParametersWithDefaults;
  // Dependencies of this plugin (we need the expansion plugin to access its model)
  dependencies: [UseTreeViewExpansionSignature];
}>;

const useTreeViewLogExpanded: TreeViewPlugin<TreeViewLogExpandedSignature> = ({
  params,
  store,
}) => {
  const expandedStr = JSON.stringify(store.value.expansion.expandedItems);

  React.useEffect(() => {
    if (params.areLogsEnabled && params.logMessage) {
      params.logMessage(`Expanded items: ${expandedStr}`);
    }
  }, [expandedStr]); // eslint-disable-line react-hooks/exhaustive-deps

  return {};
};

// Sets the default value of this plugin parameters.
useTreeViewLogExpanded.applyDefaultValuesToParams = ({ params }) => ({
  ...params,
  areLogsEnabled: params.areLogsEnabled ?? false,
});

useTreeViewLogExpanded.params = {
  areLogsEnabled: true,
  logMessage: true,
};

export interface TreeViewProps<R extends {}, Multiple extends boolean | undefined>
  extends RichTreeViewPluginParameters<R, Multiple>,
    TreeViewLogExpandedParameters,
    RichTreeViewPropsBase {}

const TREE_VIEW_PLUGINS = [
  ...RICH_TREE_VIEW_PLUGINS,
  useTreeViewLogExpanded,
] as const;

type TreeViewPluginSignatures = ConvertPluginsIntoSignatures<
  typeof TREE_VIEW_PLUGINS
>;

function TreeView<R extends {}, Multiple extends boolean | undefined>(
  props: TreeViewProps<R, Multiple>,
) {
  const { getRootProps, contextValue } = useTreeView<
    TreeViewPluginSignatures,
    // @ts-ignore
    typeof props
  >({
    plugins: TREE_VIEW_PLUGINS,
    props,
  });

  return (
    <TreeViewProvider
      contextValue={contextValue}
      classes={{}}
      slots={{}}
      slotProps={{}}
    >
      <RichTreeViewRoot {...getRootProps()}>
        <RichTreeViewItems slots={undefined} slotProps={undefined} />
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

```
