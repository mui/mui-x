---
productId: x-data-grid
---

# Migration from v7 to v8

<p class="description">This guide describes the changes needed to migrate the Data Grid from v7 to v8.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-data-grid` from v7 to v8.

## Start using the new release

In `package.json`, change the version of the Data Grid package to `next`.

```diff
-"@mui/x-data-grid": "^7.0.0",
+"@mui/x-data-grid": "next",

-"@mui/x-data-grid-pro": "^7.0.0",
+"@mui/x-data-grid-pro": "next",

-"@mui/x-data-grid-premium": "^7.0.0",
+"@mui/x-data-grid-premium": "next",
```

Using `next` ensures that it will always use the latest v8 pre-release version, but you can also use a fixed version, like `8.0.0-alpha.0`.

## Breaking changes

Since v8 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v7 to v8.

### Selection

- The prop `indeterminateCheckboxAction` has been removed. Clicking on an indeterminate checkbox "selects" the unselected descendants.

<!-- ### Accessibility

TBD

### Editing

TBD

### Other exports

TBD

### CSS classes and styling

TBD

### Changes to the public API

TBD

### Changes to slots

TBD -->
