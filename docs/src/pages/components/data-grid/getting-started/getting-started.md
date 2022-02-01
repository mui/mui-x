---
title: Data Grid - Getting started
---

# Data Grid - Getting started

<p class="description">Get started with the last React data grid you will need. Install the package, configure the columns, provide rows and you are set.</p>

## Installation

Using your favorite package manager, install `@mui/x-data-grid-pro` for the full-featured enterprise grid, or `@mui/x-data-grid` for the free community version.

```sh
// with npm
npm install @mui/x-data-grid

// with yarn
yarn add @mui/x-data-grid
```

The grid has a peer dependency on one MUI component.
If you are not already using MUI in your project, you can install it with:

```sh
// with npm
npm install @mui/material

// with yarn
yarn add @mui/material
```

## Quickstart

First, you have to import the component as below.
To avoid name conflicts the component is named `DataGridPro` for the full-featured enterprise grid, and `DataGrid` for the free community version.

```js
import { DataGrid } from '@mui/x-data-grid';
```

### Define rows

Rows are key-value pair objects, mapping column names as keys with their values.
You should also provide an `id` property on each row to allow delta updates and better performance.

Here is an example

```js
const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];
```

### Define columns

Comparable to rows, columns are objects defined with a set of attributes of the `GridColDef` interface.
They are mapped to rows through their `field` property.

```tsx
const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];
```

You can import `GridColDef` to see all column properties.

### Demo

Putting it together, this all you need to get started, as you can see in this live and interactive demo:

```jsx
import React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];

export default function App() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
```

{{"demo": "pages/components/data-grid/getting-started/Codesandbox.js", "hideToolbar": true, "bg": true}}

## TypeScript

In order to benefit from the [CSS overrides](/customization/theme-components/#global-style-overrides) and [default prop customization](/customization/theme-components/#default-props) with the theme, TypeScript users need to import the following types.
Internally, it uses module augmentation to extend the default theme structure.

```tsx
// When using TypeScript 4.x and above
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';

const theme = createTheme({
  components: {
    // Use `MuiDataGrid` on both DataGrid and DataGridPro
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});
```

## Licenses

While MUI Core is entirely licensed under MIT, MUI X serves a part of its components under a commercial license.
Please pay attention to the license.

### Plans

The component comes [in different plans](/pricing/):

- **Community**: It's [MIT license](https://tldrlegal.com/license/mit-license). It's [free forever](https://www.notion.so/mui-org/Stewardship-542a2226043d4f4a96dfb429d16cf5bd) and available on npm as [`@mui/x-data-grid`](https://www.npmjs.com/package/@mui/x-data-grid). It currently includes the [DataGrid](/components/data-grid/#mit-version) component.
- **Pro** and **Premium**: It's a [commercial license](/x/license/). It's available on npm as [`@mui/x-data-grid-pro`](https://www.npmjs.com/package/@mui/x-data-grid-pro) and includes the [DataGridPro](/components/data-grid/#commercial-version) component.
  Features only available in the commercial version are suffixed in the documentation with the following marks:

  - <span class="plan-pro"></span>: For features exclusive to Pro and Premium plans.

    <div class="only-light-mode">
      <img src="/static/x/commercial-header-icon-light.png" style="width: 579px; margin-bottom: 2rem;" alt="">
    </div>
    <div class="only-dark-mode">
      <img src="/static/x/commercial-header-icon-dark.png" style="width: 560px; margin-bottom: 2rem;" alt="">
    </div>

  - <span class="plan-premium"></span>: For features exclusive to the Premium plan.

  You can check the [feature comparison](/components/data-grid/getting-started/#feature-comparison) for more details.
  See [Pricing](https://mui.com/store/items/material-ui-pro/) for details on purchasing licenses.

### MIT vs. commercial

_How do we decide if a feature is MIT or commercial?_

We have been building MIT React components since 2014,
and have learned much about the strengths and weaknesses of the MIT license model.
The health of this model is improving every day. As the community grows, it increases the probability that developers contribute improvements to the project.
However, we believe that we have reached the sustainability limits of what the model can support for advancing our mission forward. We have seen too many MIT licensed components moving slowly or getting abandoned. The community isn't contributing improvements as fast as the problems deserved to be solved.

We are using a commercial license to forward the development of the most advanced features, where the MIT model can't sustain it.
A solution to a problem should only be commercial if it has no MIT alternatives.

We provide three plans:

- **Community**. This plan contains the MIT components that are sustainable by the contributions of the open-source community. Free forever.
- **Pro**. This plan contains the features that are at the limit of what the open-source model can sustain. For instance, providing a very comprehensive set of components. From a price perspective, the plan is designed to be accessible to most professionals.
- **Premium**. This plan contains the most advanced features.

### Feature comparison

The following table summarizes the features available in the community `DataGrid` and enterprise `DataGridPro` components.
All the features of the community version are available in the enterprise one.
The enterprise components come in two plans: Pro and Premium.

| Features                                                                                  | Community | Pro <span class="plan-pro"></span> | Premium <span class="plan-premium"></span> |
| :---------------------------------------------------------------------------------------- | :-------: | :--------------------------------: | :----------------------------------------: |
| **Column**                                                                                |           |                                    |
| [Column groups](/components/data-grid/columns/#column-groups)                             |    🚧     |                 🚧                 |                     🚧                     |
| [Column spanning](/components/data-grid/columns/#column-spanning)                         |    🚧     |                 🚧                 |                     🚧                     |
| [Column resizing](/components/data-grid/columns/#column-resizing)                         |    ❌     |                 ✅                 |                     ✅                     |
| [Column reorder](/components/data-grid/columns/#column-reorder)                           |    ❌     |                 ✅                 |                     ✅                     |
| [Column pinning](/components/data-grid/columns/#column-pinning)                           |    ❌     |                 ✅                 |                     ✅                     |
| **Row**                                                                                   |           |                                    |                                            |
| [Row sorting](/components/data-grid/rows/#row-sorting)                                    |    ✅     |                 ✅                 |                     ✅                     |
| [Row height](/components/data-grid/rows/#row-height)                                      |    ✅     |                 ✅                 |                     ✅                     |
| [Row spanning](/components/data-grid/rows/#row-spanning)                                  |    🚧     |                 🚧                 |                     🚧                     |
| [Row reordering](/components/data-grid/rows/#row-reorder)                                 |    ❌     |                 🚧                 |                     🚧                     |
| [Row pinning](/components/data-grid/rows/#row-pinning)                                    |    ❌     |                 🚧                 |                     🚧                     |
| **Selection**                                                                             |           |                                    |                                            |
| [Single row selection](/components/data-grid/selection/#single-row-selection)             |    ✅     |                 ✅                 |                     ✅                     |
| [Checkbox selection](/components/data-grid/selection/#checkbox-selection)                 |    ✅     |                 ✅                 |                     ✅                     |
| [Multiple row selection](/components/data-grid/selection/#multiple-row-selection)         |    ❌     |                 ✅                 |                     ✅                     |
| [Cell range selection](/components/data-grid/selection/#range-selection)                  |    ❌     |                 ❌                 |                     🚧                     |
| **Filtering**                                                                             |           |                                    |                                            |
| [Quick filter](/components/data-grid/filtering/#quick-filter)                             |    🚧     |                 🚧                 |                     🚧                     |
| [Column filters](/components/data-grid/filtering/#column-filters)                         |    ✅     |                 ✅                 |                     ✅                     |
| [Multi-column filtering](/components/data-grid/filtering/#single-and-multi-filtering)     |    ❌     |                 ✅                 |                     ✅                     |
| **Pagination**                                                                            |           |                                    |                                            |
| [Pagination](/components/data-grid/pagination/)                                           |    ✅     |                 ✅                 |                     ✅                     |
| [Pagination > 100 rows per page](/components/data-grid/pagination/#paginate-gt-100-rows)  |    ❌     |                 ✅                 |                     ✅                     |
| **Editing**                                                                               |           |                                    |                                            |
| [Row editing](/components/data-grid/editing/#row-editing)                                 |    ✅     |                 ✅                 |                     ✅                     |
| [Cell editing](/components/data-grid/editing/#cell-editing)                               |    ✅     |                 ✅                 |                     ✅                     |
| **Import & export**                                                                       |           |                                    |                                            |
| [CSV export](/components/data-grid/export/#csv-export)                                    |    ✅     |                 ✅                 |                     ✅                     |
| [Print](/components/data-grid/export/#print)                                              |    ✅     |                 ✅                 |                     ✅                     |
| [Clipboard](/components/data-grid/export/#clipboard)                                      |    ❌     |                 🚧                 |                     🚧                     |
| [Excel export](/components/data-grid/export/#excel-export)                                |    ❌     |                 ❌                 |                     🚧                     |
| **Rendering**                                                                             |           |                                    |                                            |
| [Customizable components](/components/data-grid/components/)                              |    ✅     |                 ✅                 |                     ✅                     |
| [Column virtualization](/components/data-grid/virtualization/#column-virtualization)      |    ✅     |                 ✅                 |                     ✅                     |
| [Row virtualization > 100 rows](/components/data-grid/virtualization/#row-virtualization) |    ❌     |                 ✅                 |                     ✅                     |
| **Group & Pivot**                                                                         |           |                                    |                                            |
| [Tree data](/components/data-grid/group-pivot/#tree-data)                                 |    ❌     |                 ✅                 |                     ✅                     |
| [Master detail](/components/data-grid/group-pivot/#master-detail)                         |    ❌     |                 ✅                 |                     ✅                     |
| [Grouping](/components/data-grid/group-pivot/#grouping)                                   |    ❌     |                 ❌                 |                     🚧                     |
| [Aggregation](/components/data-grid/group-pivot/#aggregation)                             |    ❌     |                 ❌                 |                     🚧                     |
| [Pivoting](/components/data-grid/group-pivot/#pivoting)                                   |    ❌     |                 ❌                 |                     🚧                     |
| **Misc**                                                                                  |           |                                    |                                            |
| [Accessibility](/components/data-grid/accessibility/)                                     |    ✅     |                 ✅                 |                     ✅                     |
| [Keyboard navigation](/components/data-grid/accessibility/#keyboard-navigation)           |    ✅     |                 ✅                 |                     ✅                     |
| [Localization](/components/data-grid/localization/)                                       |    ✅     |                 ✅                 |                     ✅                     |

### Evaluation (trial) licenses

You are [free to install](https://mui.com/store/legal/mui-x-eula/#evaluation-trial-licenses) and try `DataGridPro` as long as it is not used for development of a feature intended for production.
Please take the component for a test run, no need to contact us.

## License key

For commercially licensed software, a license key is provided.
This removes the watermark and console warning when valid.
This license key is meant as a reminder for developers and their team to know when they forgot to license the software or renew the license.

### License key installation

Once you purchase a license, you'll receive a license key by email.
This key should be installed to remove the watermark and
console warnings.
You must set the license key before rendering the first component.
You only need to install the key once in your application.

```jsx
import { LicenseInfo } from '@mui/x-data-grid-pro';

LicenseInfo.setLicenseKey(
  'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
);
```

### Security

The check of the license key is done without making any network requests.

The license key is designed to be public, the only thing we ask of licensed users is to not proactively publicize their license key.
Exposing the license key in a JavaScript bundle is expected.

### Validation errors

If the validation of the license key fails, the component displays a watermark and provides a console warning in both development and production.
End users can still use the component.

Here are the different possible validation errors:

#### Missing license key

If the license key is missing, the component will look something like this:

<div class="only-light-mode">
  <img src="/static/x/watermark-light.png" style="width: 653px; margin-bottom: 2rem;" alt="" loading="lazy">
</div>
<div class="only-dark-mode">
  <img src="/static/x/watermark-dark.png" style="width: 645px; margin-bottom: 2rem;" alt="" loading="lazy">
</div>

> Note that you are still allowed to use the component for [evaluation purposes](#evaluation-trial-licenses) in this case.

#### License key expired

The licenses are perpetual, the license key will work forever with the current version of the software.

However, **access to updates/upgrades** is not perpetual.
Installing a version of the component released after the license key has expired will trigger a watermark and console message.
For example, if you purchase a one-year license today, you are not licensed to install a version released two years in the future, but you can optionally update to any version, including major versions, if it's released in the next 12 months.

#### Invalid license key

The license key you have installed is not as issued by MUI.

## Support

### GitHub

We use GitHub issues as a bug and feature request tracker. If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported or fixed](https://github.com/mui-org/material-ui-x/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aclosed). You can search through existing issues and pull requests to see if someone has reported one similar to yours.

[Open an issue](https://github.com/mui-org/material-ui-x/issues/new/choose)

### StackOverflow

For crowdsourced answers from expert MUI developers in our community.
StackOverflow is also visited from time to time by the maintainers of MUI.

[Post a question](https://stackoverflow.com/questions/tagged/mui)

### Professional support

When purchasing an MUI X Pro or Premium license you get access to professional support for a limited duration.
Support is available on multiple channels, but the recommended channel is GitHub issues.
If you need to share private information, you can also use email.

- **MUI X Pro**: No SLA is provided but MUI's maintainers give these issues more attention than the ones from the Community plan. The channels:
  - GitHub: [Open a new issue](https://github.com/mui-org/material-ui-x/issues/new/choose) and leave your Order ID.
  - Email (only to share private information): [Open a new issue](https://support.mui.com/hc/en-us/requests/new?tf_360023797420=mui_x) or send an email at x@mui.com.
- **MUI X Premium**: Same as MUI X Pro, but with priority over Pro, and a 48 hour SLA for the first answer.
  - GitHub: this plan is not available yet
  - Emails: this plan is not available yet
- **MUI X Premium Priority**: Same as MUI X Premium but with a 24 hours SLA for the first answer.
  - GitHub: this plan is not available yet
  - Emails: this plan is not available yet

## Roadmap

Here is [the public roadmap](https://github.com/mui-org/material-ui-x/projects/1). It's organized by quarter.

> ⚠️ **Disclaimer**: We operate in a dynamic environment, and things are subject to change. The information provided is intended to outline the general framework direction, for informational purposes only. We may decide to add or remove new items at any time, depending on our capability to deliver while meeting our quality standards. The development, releases, and timing of any features or functionality remains at the sole discretion of MUI. The roadmap does not represent a commitment, obligation, or promise to deliver at any time.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
