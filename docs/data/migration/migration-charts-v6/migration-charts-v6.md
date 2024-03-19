---
productId: x-charts
---

# Migration from v6 to v7

<p class="description">This guide describes the changes needed to migrate Charts from v6 to v7.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-charts` from v6 to v7.
The change between v6 and v7 is mostly here to match the version with other MUI X packages.
No big breaking changes are expected.

## Start using the new release

In `package.json`, change the version of the charts package to `^7.0.0`.

```diff
-"@mui/x-charts": "6.x.x",
+"@mui/x-charts": "^7.0.0",
```

## Update `@mui/material` package

To have the option of using the latest API from `@mui/material`, the package peer dependency version has been updated to `^5.15.0`.
It is a change in minor version only, so it should not cause any breaking changes.
Please update your `@mui/material` package to this or a newer version.

## Breaking changes

Since `v7` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.

### Drop the legacy bundle

The support for IE11 has been removed from all MUI X packages.
The `legacy` bundle that used to support old browsers like IE11 is no longer included.

:::info
If you need support for IE11, you will need to keep using the latest version of the `v6` release.
:::

### Renaming

#### Types

Some types got renamed for coherence:

| v6                                | v7                       |
| :-------------------------------- | :----------------------- |
| `ChartsTooltipSlotComponentProps` | `ChartsTooltipSlotProps` |
| `ChartsTooltipSlotsComponent`     | `ChartsTooltipSlots`     |

#### Props

The Pie Chart `onClick` prop has been renamed `onItemClick` for consistency with other components.
The behavior of this prop remains the same.

### Animation

The Line Chart now have animation by default.
You can disable it with `skipAnimation` prop.
See [animation documentation](/x/react-charts/lines/#animation) for more information.
