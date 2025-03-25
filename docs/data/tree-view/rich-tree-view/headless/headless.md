---
productId: x-tree-view
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Headless

<p class="description">Create your custom Tree View.</p>

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

Use the `getDefaultizedParams` property to set a default value to your plugin params:

```ts
const useCustomPlugin = ({ params }) => {
  React.useEffect(() => {
    console.log(params.customParam);
  });

  return {};
};

useCustomPlugin.params = { customParam: true };

useCustomPlugin.getDefaultizedParams = ({ params }) => ({
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
  // The params specific to your plugin before running `getDefaultizedParams`
  params: UseCustomPluginParams;
  // The params specific to your plugins after running `getDefaultizedParams`
  defaultizedParams: UseCustomPluginDefaultizedParams;
  // The methods added to the Tree View instance by your plugin
  instance: UseCustomPluginInstance;
  // The events emitted by your plugin
  events: UseCustomPluginEvents;
  // The states defined by your plugin
  state: UseCustomPluginState;
  // The context value defined by your plugin and passed to the items
  contextValue: UseCustomPluginContextValue;
  // The slots used by this plugin
  slots: UseCustomPluginSlots;
  // The slot props used by this plugin
  slotProps: UseCustomPluginSlotProps;
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
  // `customParam` and `defaultCustomModel` have a default value defined in `getDefaultizedParams`
  defaultizedParams: {
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

{{"demo": "LogExpandedItems.js"}}
