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

To have the option of using the latest API from `@mui/material`, the package peer dependency version has been updated to `^5.15.14`.
It is a change in minor version only, so it should not cause any breaking changes.
Please update your `@mui/material` package to this or a newer version.

## Breaking changes

Since `v7` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.

### Drop the legacy bundle

The support for IE 11 has been removed from all MUI X packages.
The `legacy` bundle that used to support old browsers like IE 11 is no longer included.

:::info
If you need support for IE 11, you will need to keep using the latest version of the `v6` release.
:::

### Drop Webpack 4 support

Dropping old browsers support also means that we no longer transpile some features that are natively supported by modern browsers – like [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) and [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining).

These features are not supported by Webpack 4, so if you are using Webpack 4, you will need to transpile these features yourself or upgrade to Webpack 5.

Here is an example of how you can transpile these features on Webpack 4 using the `@babel/preset-env` preset:

```diff
 // webpack.config.js

 module.exports = (env) => ({
   // ...
   module: {
     rules: [
       {
         test: /\.[jt]sx?$/,
-        exclude: /node_modules/,
+        exclude: [
+          {
+            test: path.resolve(__dirname, 'node_modules'),
+            exclude: [path.resolve(__dirname, 'node_modules/@mui/x-charts')],
+          },
+        ],
       },
     ],
   },
 });
```

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
