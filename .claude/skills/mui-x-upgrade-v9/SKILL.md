---
name: mui-x-upgrade-v9
description: Helps upgrade MUI X libraries (Data Grid, Date/Time Pickers, Charts, Tree View) from v8 to v9, including running codemods and applying manual migration steps.
---

Help the user upgrade their MUI X libraries from v8 to v9. Follow these steps:

## Step 1: Identify which packages are used

Check the user's `package.json` to determine which MUI X packages they use:

- `@mui/x-data-grid`, `@mui/x-data-grid-pro`, `@mui/x-data-grid-premium`
- `@mui/x-date-pickers`, `@mui/x-date-pickers-pro`
- `@mui/x-charts`, `@mui/x-charts-pro`
- `@mui/x-tree-view`, `@mui/x-tree-view-pro`

## Step 2: Read the migration guides for manual changes

Read the relevant migration guide(s) from this repo to identify any needed changes:

- [Data Grid](https://next.mui.com/x/migration/migration-data-grid-v8.md)
- [Date and Time Pickers](https://next.mui.com/x/migration/migration-pickers-v8.md)
- [Charts](https://next.mui.com/x/migration/migration-charts-v8.md)
- [Tree View](https://next.mui.com/x/migration/migration-tree-view-v8.md)

Read only the guides relevant to the packages the user has installed.

## Step 3: Check current versions

If user's packages are still on v8, they should first upgrade to the latest v8 version before moving to v9. This ensures they have all the latest bug fixes and deprecations in place, making the v9 upgrade smoother. Continue to step 4.

If user's packages are already on v9, go to step 7.

## Step 4: Update to latest v8 version

In the user's `package.json`, update the MUI X package versions to the latest v8 release (e.g., `^8.0.0`), then install using the available package manager.

## Step 5: Fix any deprecations in v8

Before upgrading to v9, ensure that all deprecation warnings from v8 are resolved. Replace the deprecated APIs with their recommended alternatives. This will help prevent issues when upgrading to v9, as some deprecated APIs may have been removed in the new version.

## Step 6: Suggest creating a pull request

If the user is working in a team or on a shared codebase, suggest creating a pull request for the upgrade. This allows for code review and testing before merging the changes into the main branch. It also provides an opportunity for other team members to provide feedback and catch any potential issues that may arise during the upgrade process.

Also allow the user to run the codemods directly instead if they prefer to handle the upgrade in a single step. However, running codemods without first addressing deprecations may lead to more complex issues, so it's generally recommended to follow the steps in order.

## Step 7: Run codemods

The `@mui/x-codemod` package provides automated codemods that handle many breaking changes. Run the preset-safe codemod first — it applies all safe transformations at once:

```bash
# Run all codemods for all MUI X packages
npx @mui/x-codemod@next v9.0.0/preset-safe <path|folder>

# Or run codemods for specific packages
npx @mui/x-codemod@next v9.0.0/charts/preset-safe <path|folder>
npx @mui/x-codemod@next v9.0.0/pickers/preset-safe <path|folder>
npx @mui/x-codemod@next v9.0.0/data-grid/remove-stabilized-experimentalFeatures <path|folder>
```

⚠️ The preset-safe codemod should only be run once.

## Step 8: Apply remaining manual changes

Help the user apply any breaking changes not covered by codemods. Search their codebase for affected APIs mentioned in the migration guides and update them.
