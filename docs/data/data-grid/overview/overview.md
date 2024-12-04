---
title: React Data Grid component
githubLabel: 'component: data grid'
packageName: '@mui/x-data-grid'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
---

# MUI X Data Grid

<p class="description">A fast and extendable React data table and React data grid. It's a feature-rich component available with MIT or commercial licenses.</p>

The Data Grid component is built with React and TypeScript to provide a smooth UX for manipulating an unlimited set of data.
It features an intuitive API for real-time updates as well as theming and custom templates—all with blazing-fast performance.

{{"component": "@mui/docs/ComponentLinkHeader"}}

## Overview

The Data Grid presents information in a structured format of rows and columns.
The data is displayed in a user-friendly interface for efficient editing, reviewing, and analysis.

:::info
Visit the [installation guide](/x/react-data-grid/getting-started/#installation) to learn how to install the correct package version and dependencies.
:::

The component comes in three different versions, one available under MIT license and two available under commercial license.

## MIT license (free forever)

The MIT-licensed version (also referred to as the "Community version") is a stronger alternative to [plain data tables](/material-ui/react-table/#sorting-amp-selecting).
It's a clean abstraction with basic features like editing, pagination, column grouping, and single-column sorting and filtering.

```js
import { DataGrid } from '@mui/x-data-grid';
```

{{"demo": "DataGridDemo.js", "defaultCodeOpen": false, "bg": "inline"}}

## Commercial licenses

The commercially licensed versions are available in two plans: Pro and Premium.

### Pro plan [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

The Pro plan extends the features available in the Community version to support more complex use cases.
It adds features like advanced filtering, column pinning, column and row reordering, support for tree data, and virtualization to handle bigger datasets.

The demo below displays 31 columns and 100,000 rows—over 3 million cells in total.

```js
import { DataGridPro } from '@mui/x-data-grid-pro';
```

{{"demo": "DataGridProDemo.js", "defaultCodeOpen": false, "disableAd": true, "bg": "inline"}}

### Premium plan [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

The Premium plan includes everything from Pro, as well as advanced features for data analysis and large dataset management, like row grouping with aggregation functions (such as sum and average) and the ability to export to Excel files.

Visit the [showcase page](/x/react-data-grid/demo/) for a comprehensive overview of all features exclusive to this plan.

The demo below groups rows by commodity name, and uses an aggregation function to calculate the sum of quantities for each group and in total (displayed in a summary row).
You can experiment with grouping other columns in the columns' header menus.

And since you're here, try exporting to Excel and copying and pasting data from-to Excel tables.

```js
import { DataGridPremium } from '@mui/x-data-grid-premium';
```

{{"demo": "DataGridPremiumDemo.js", "defaultCodeOpen": false, "disableAd": true, "bg": "inline"}}

### MIT vs. commercial

Please see [the Licensing page](/x/introduction/licensing/) for details.
