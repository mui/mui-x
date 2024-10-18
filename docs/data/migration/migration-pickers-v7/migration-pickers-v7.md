---
productId: x-date-pickers
---

# Migration from v7 to v8

<p class="description">This guide describes the changes needed to migrate the Date and Time Pickers from v7 to v8.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-date-pickers` from v7 to v8.

## Start using the new release

In `package.json`, change the version of the date pickers package to `^8.0.0`.

```diff
-"@mui/x-date-pickers": "7.x.x",
+"@mui/x-date-pickers": "^8.0.0",
```

Since `v8` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from v7 to v8.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v8. You can run `v8.0.0/pickers/preset-safe` targeting only Date and Time Pickers or `v8.0.0/preset-safe` to target the other packages as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

<!-- #default-branch-switch -->

```bash
// Date and Time Pickers specific
npx @mui/x-codemod@latest v8.0.0/pickers/preset-safe <path>

// Target the other packages as well
npx @mui/x-codemod@latest v8.0.0/preset-safe <path>
```

:::info
If you want to run the transformers one by one, check out the transformers included in the [preset-safe codemod for pickers](https://github.com/mui/mui-x/blob/HEAD/packages/x-codemod/README.md#preset-safe-for-pickers-v800) for more details.
:::

Breaking changes that are handled by this codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen.

If you have already applied the `v8.0.0/pickers/preset-safe` (or `v8.0.0/preset-safe`) codemod, then you should not need to take any further action on these items.

All other changes must be handled manually.

:::warning
Not all use cases are covered by codemods. In some scenarios, like props spreading, cross-file dependencies, etc., the changes are not properly identified and therefore must be handled manually.

For example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.

```tsx
<DatePicker {...pickerProps} />
```

After running the codemods, make sure to test your application and that you don't have any console errors.

Feel free to [open an issue](https://github.com/mui/mui-x/issues/new/choose) for support if you need help to proceed with your migration.
:::

## Deprecated parameters used on translation keys functions

If you are using a Picker with controlled value and views and you need to compose some of the following translation keys: `openDatePickerDialogue`, `openTimePickerDialogue`, or `clockLabelText`, after upgrading to v8 you only need to pass the formatted value and the time view (only for `clockLabelText`):

```js
const translations = useTranslations();

const openDatePickerDialogue = translations.openDatePickerDialogue(
  value == null ? null : value.format('MM/DD/YYY'),
);
const openTimePickerDialogue = translations.openTimePickerDialogue(
  value == null ? null : value.format('HH:mm:ss'),
);
const clockLabelText = translations.clockLabelText(
  view,
  value == null ? null : value.format('HH:mm:ss'),
);
```

Also the following types and interfaces no longer receive a generic type parameter:

- `PickersComponentAgnosticLocaleText`
- `PickersInputComponentLocaleText`
- `PickersInputLocaleText`
- `PickersLocaleText`
- `PickersTranslationKeys`
