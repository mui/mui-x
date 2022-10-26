# Migration from v5 to v6

<p class="description">This guide describes the changes needed to migrate the Data Grid from v5 to v6.</p>

## Start using the alpha release

In `package.json`, change the version of the data grid package to `next`.

```diff
-"@mui/x-data-grid": "latest",
+"@mui/x-data-grid": "next",
```

Using `next` ensures that it will always use the latest v6 alpha release, but you can also use a fixed version, like `6.0.0-alpha.0`.

## Breaking changes

Since v6 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v5 to v6.

### Renamed props

- To avoid confusion with the props that will be added for the cell selection feature, some props related to row selection were renamed to have "row" in their name. The renamed props are the following:

  | Old name                   | New name                      |
  | -------------------------- | ----------------------------- |
  | `selectionModel`           | `rowSelectionModel`           |
  | `onSelectionModelChange`   | `onRowSelectionModelChange`   |
  | `disableSelectionOnClick`  | `disableRowSelectionOnClick`  |
  | `disableMultipleSelection` | `disableMultipleRowSelection` |

### State access

- The `gridSelectionStateSelector` selector was renamed to `gridRowSelectionStateSelector`.

### Events

- The `selectionChange` event was renamed to `rowSelectionChange`.

<!--
### CSS classes

TBD

### Virtualization

TBD

### Removed props

TBD

### `apiRef` methods

TBD

### Columns

TBD

### Other exports

TBD

### Removals from the public API

TBD
-->
