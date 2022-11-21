# @mui/x-codemod

> Codemod scripts for MUI X

[![npm version](https://img.shields.io/npm/v/@mui/x-codemod.svg?style=flat-square)](https://www.npmjs.com/package/@mui/x-codemod)
[![npm downloads](https://img.shields.io/npm/dm/@mui/x-codemod.svg?style=flat-square)](https://www.npmjs.com/package/@mui/x-codemod)

This repository contains a collection of codemod scripts based for use with
[jscodeshift](https://github.com/facebook/jscodeshift) that help update MUI X APIs.

## Setup & run

<!-- #default-branch-switch -->

```bash
npx @mui/x-codemod <codemod> <paths...>

Applies a `@mui/x-codemod` to the specified paths

Positionals:
  codemod  The name of the codemod                                [string]
  paths    Paths forwarded to `jscodeshift`                       [string]

Options:
  --version     Show version number                                 [boolean]
  --help        Show help                                           [boolean]
  --parser      which parser for jscodeshift to use.
                                                    [string] [default: 'tsx']
  --jscodeshift Pass options directly to jscodeshift                  [array]

Examples:
  npx @mui/x-codemod v6.0.0/preset-safe src
  npx @mui/x-codemod v6.0.0/component-rename-prop src --
  --component=DataGrid --from=prop --to=newProp
```

### `jscodeshift` options

To pass more options directly to jscodeshift, use `--jscodeshift=...`. For example:

```sh
// single option
npx @mui/x-codemod --jscodeshift=--run-in-band
// multiple options
npx @mui/x-codemod --jscodeshift=--cpus=1 --jscodeshift=--print --jscodeshift=--dry --jscodeshift=--verbose=2
```

See all available options [here](https://github.com/facebook/jscodeshift#usage-cli).

### `Recast` Options

Options to [recast](https://github.com/benjamn/recast)'s printer can be provided
through jscodeshift's `printOptions` command line argument

```sh
npx @mui/x-codemod <transform> <path> --jscodeshift="--printOptions='{\"quote\":\"double\"}'"
```

## Included scripts

### v6.0.0

#### 🚀 `preset-safe`

A combination of all important transformers for migrating v5 to v6. ⚠️ This codemod should be run only once.

```sh
npx @mui/x-codemod v6.0.0/preset-safe <path|folder>
```

The list includes these transformers

- [`localization-provider-rename-locale`](#localization-provider-rename-locale)

#### `localization-provider-rename-locale`

Renames `locale` into `adapterLocale` (or `LocalizationProvider`)

```diff
 <LocalizationProvider
   dateAdapter={AdapterDayjs}
-  locale="fr"
+  adapterLocale="fr"
 >
   {children}
 </LocalizationProvider

```

```sh
npx @mui/x-codemod v6.0.0/localization-provider-rename-locale <path>
```

You can find more details about this breaking change in [the migration guide](https://next.mui.com/x/migration/migration-pickers-v5/#rename-the-locale-prop-on-localizationprovider).
