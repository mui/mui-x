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

In `package.json`, change the version of the Data Grid package to `^9.0.0`.

```diff
-"@mui/x-data-grid": "^8.x.x",
+"@mui/x-data-grid": "^9.0.0",

-"@mui/x-data-grid-pro": "^8.x.x",
+"@mui/x-data-grid-pro": "^9.0.0",

-"@mui/x-data-grid-premium": "^8.x.x",
+"@mui/x-data-grid-premium": "^9.0.0",
```

## Update `@mui/material` and `@mui/system` packages

The minimum supported version of `@mui/material` and `@mui/system` has been updated to `^7.3.0` or `^9.0.0`.
This change enables the opt-in [Native Color](/material-ui/customization/css-theme-variables/native-color/) feature, which replaces JavaScript color manipulation with native CSS.
The v5 and v6 versions are no longer supported.

If you are using `@mui/material` v5 or v6, you need to upgrade to at least v7.3.0.
Follow the [Material UI migration guide](/material-ui/migration/upgrade-to-v9/) to upgrade your implementation.

```diff
-"@mui/material": "^5.x.x",
+"@mui/material": "^7.3.0",

-"@mui/system": "^5.x.x",
+"@mui/system": "^7.3.0",
```

## Breaking changes

### Stabilized `experimentalFeatures`

The `charts` experimental feature flag has been removed. The charts integration is now controlled solely by the `chartsIntegration` prop on `DataGridPremium`.

If you were using `experimentalFeatures={{ charts: true }}`, you can remove it.

```diff
 <DataGridPremium
-  experimentalFeatures={{ charts: true }}
   chartsIntegration
   slots={{ chartsPanel: GridChartsPanel }}
 />
```

You can use this codemod to automatically remove the `charts` property from `experimentalFeatures`:

<!-- #npm-tag-reference -->

```bash
npx @mui/x-codemod@latest v9.0.0/data-grid/remove-stabilized-experimentalFeatures <path>
```

### Locale text changes

- The `filterPanelColumns` locale text key has been renamed to `filterPanelColumn` and the default value changed from "Columns" to "Column".

  If you have tests relying on this label, you may need to update them accordingly.

  ```diff
  -screen.getByRole('combobox', { name: 'Columns' });
  +screen.getByRole('combobox', { name: 'Column' });
  ```

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

### DOM changes

- The `.MuiDataGrid-virtualScrollerContent` node has been moved to be a direct child of `.MuiDataGrid-virtualScroller`. If you were using it to target the rows container, you can switch to `.MuiDataGrid-virtualScrollerRenderZone`.
- A new `div` node has been added as a direct child of `.MuiDataGrid-virtualScrollerContent`, for internal purposes.
- A new `div` node has been added to fill the scroll container's dimension, for internal purposes.
