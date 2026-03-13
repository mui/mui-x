---
title: Date Pickers - Migration from v8 to v9
productId: x-date-pickers
---

# Migration from v8 to v9

<p class="description">This guide describes the changes needed to migrate the Date and Time Pickers from v8 to v9.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-date-pickers` from v8 to v9.

## Start using the new release

In `package.json`, change the version of the date pickers package to `next`.

```diff
-"@mui/x-date-pickers": "8.x.x",
+"@mui/x-date-pickers": "next",

-"@mui/x-date-pickers-pro": "8.x.x",
+"@mui/x-date-pickers-pro": "next",
```

Since `v9` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from `v8` to `v9`.

## Slots breaking changes

### Dialog slot

The `dialog` slot no longer receives the deprecated `TransitionComponent`, `TransitionProps`, and `PaperProps` props.
If you were passing a custom `dialog` slot, you need to update it to use `slots` and `slotProps` instead:

```diff
 function CustomDialog({
-  TransitionComponent,
-  TransitionProps,
-  PaperProps,
+  slots,
+  slotProps,
   ...props
 }) {
   // …your custom dialog implementation
 }

 <MobileDatePicker slots={{ dialog: CustomDialog }} />
```
