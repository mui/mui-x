# Headless Data Grid Guidelines

## Plugin System Architecture

### Plugin Types

See `src/plugins/core/plugin.ts` for the `Plugin` interface and type helpers.

### Internal vs User Plugins

- **Internal plugins** (`src/plugins/internal/`): Always loaded (rows, columns). Added to `internalPlugins` array in `src/plugins/internal/index.ts`.
- **User plugins** (`src/plugins/`): Opt-in, passed via `useDataGrid({ plugins: [...] })`.

### Plugin Structure

```ts
const myPlugin = createPlugin<MyPluginType>()({
  name: 'myPlugin',
  dependencies: [otherPlugin], // optional, will be automatically included if declared here
  getInitialState: (state, params) => ({ ...state, myPlugin: { ... } }),
  use: (store, params, api) => ({
    myPlugin: { /* API methods and hooks */ }
  }),
});
```

### Key Patterns

- State is namespaced: `state.myPlugin.field`
- API is namespaced: `api.myPlugin.method()`
- Selectors use `createSelector` / `createSelectorMemoized` from `@base-ui/utils/store`
- Hooks use `useStore(store, selector)` for reactive subscriptions
- Internal plugin APIs (rows, columns) are always available in `use()`

### Plugin Exports

Never export plugins from the package entry point (`src/index.ts`). Plugins are meant to be imported by users directly from the plugins folder:

```ts
// Correct
import { sortingPlugin } from '@mui/x-data-grid-headless/plugins/sorting';

// Wrong - do not add to src/index.ts
import { sortingPlugin } from '@mui/x-data-grid-headless';
```

This design allows users to only import the plugins they need, enabling better tree-shaking and smaller bundle sizes.
