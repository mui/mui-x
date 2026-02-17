---
title: Data Grid - Migration from v8 to v9
productId: x-data-grid
---

# Migration from v8 to v9

<p class="description">This guide describes the changes needed to migrate the Data Grid from v8 to v9.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-data-grid` from v8 to v9.

:::success
This guide is also available in <a href="https://raw.githubusercontent.com/mui/mui-x/refs/heads/master/docs/data/migration/migration-data-grid-v8/migration-data-grid-v8.md" target="_blank">Markdown format</a> to be referenced by AI tools like Copilot or Cursor to help you with the migration.
:::

## Start using the new release

In `package.json`, change the version of the Data Grid package to `next`.

```diff
-"@mui/x-data-grid": "^8.x.x",
+"@mui/x-data-grid": "next",

-"@mui/x-data-grid-pro": "^8.x.x",
+"@mui/x-data-grid-pro": "next",

-"@mui/x-data-grid-premium": "^8.x.x",
+"@mui/x-data-grid-premium": "next",
```

## Breaking changes

### Behavioral changes

- Pagination numbers are formatted by default.

  To disable the pagination formatting, provide the key and value to `localeText` prop:

  ```diff
  <DataGrid
  +  localeText={{
  +    paginationDisplayedRows: ({ from, to, count, estimated }) => {
  +      if (!estimated) {
  +        return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  +      }
  +      const estimatedLabel =
  +        estimated && estimated > to
  +          ? `around ${estimated}`
  +          : `more than ${to}`;
  +      return `${from}–${to} of ${count !== -1 ? count : estimatedLabel}`;
  +    }
  +  }}
  />
  ```
