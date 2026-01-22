# Headless Data Grid Guidelines

## Plugin Exports

Never export plugins from the package entry point (`src/index.ts`). Plugins are meant to be imported by users directly from the plugins folder:

```ts
// Correct
import { sortingPlugin } from '@mui/x-data-grid-headless/plugins/sorting';

// Wrong - do not add to src/index.ts
import { sortingPlugin } from '@mui/x-data-grid-headless';
```

This design allows users to only import the plugins they need, enabling better tree-shaking and smaller bundle sizes.
