# Contributing to MUI X

## MUI X vs. MUI organization

MUI X is an extension of the core open-source libraries of the MUI organization (Material UI, Base UI, MUI System).
The repositories are part of the same codebase.
`mui/mui-x` imports the code infrastructure from [`mui/material-ui`](https://github.com/mui/material-ui).
You can find the "contributing" guide for the main repository in [mui/material-ui/CONTRIBUTING.md](https://github.com/mui/material-ui/blob/HEAD/CONTRIBUTING.md).

Most of the content in the main repository "contributing" guide applies to this repository.
There are, however, a few differences:

- The default GitHub branch might be different.
- The local documentation site opens on a different port: 3001 instead of 3000.
- You would need to sign a contributor license agreement (CLA) if the PR changes code located in the following folders: `x-data-grid-pro`, `x-data-grid-premium`, `x-date-pickers-pro`
- Testing see [/test/README.md](test/README.md) for details.

## Adding documentation demos

Demos use [`@mui/internal-docs-infra`](https://mui-internal.netlify.app/docs-infra/).
Author demos in TypeScript; JavaScript and code previews are generated automatically.
Do not add `.js` or `.preview` files.

### 1. Create the demo folder

Create a kebab-case folder under `demos/`, next to the Markdown page:

```text
docs/data/charts/bars/
├── bars.md
└── demos/
    └── custom-bars/
        ├── CustomBars.tsx
        ├── client.ts
        └── index.ts
```

### 2. Write the demo

In `CustomBars.tsx`, mark the code to display with focus comments:

```tsx
import { BarChart } from '@mui/x-charts/BarChart';

export default function CustomBars() {
  return (
    // @focus-start
    <BarChart xAxis={[{ data: ['A', 'B', 'C'] }]} series={[{ data: [4, 3, 5] }]} height={300} />
    // @focus-end
  );
}
```

Use `{/* @focus-start */}` and `{/* @focus-end */}` when placing markers inside JSX.
ESLint can add missing markers with `--fix`.

### 3. Add the entry points

In `client.ts`:

```ts
'use client';

import { createDemoClient } from '@mui/internal-core-docs/utils/createDemoClient';

export default createDemoClient(import.meta.url);
```

In `index.ts`:

```ts
import { createDemo } from '@mui/internal-core-docs/utils/createDemo';
import CustomBars from './CustomBars';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomBars, { ClientProvider });
```

### 4. Reference the demo from Markdown

Add this to `bars.md`. The `file://` path is relative to the Markdown file:

```md
{{"component": "file://./demos/custom-bars/index.ts"}}
```

Options such as `defaultCodeOpen`, `bg`, and `height` go in the same JSON object.
See [`DemoOptions`](https://github.com/mui/material-ui/blob/master/packages-internal/core-docs/src/DemoContent/DemoContent.tsx) for supported options.

### 5. Check the demo

Run `pnpm docs:dev` and open <http://localhost:3001/x/react-charts/bars/>.
Check the rendered demo, code viewer, live editor, and sandbox exports.
Run ESLint on the new files and `pnpm valelint` before submitting your PR.

## Experiments

Run `pnpm docs:dev` and open <http://localhost:3001/x/experiments/>.

Add pages to `docs/pages/x/experiments/<product>/` and demo components to `docs/data/experiments/<product>/`.
The app adds the sidebar automatically.
Restart the docs server after adding or renaming a page to update the sidebar.
