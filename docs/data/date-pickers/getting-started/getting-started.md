---
productId: x-date-pickers
title: Date and Time Pickers - Getting started
packageName: '@mui/x-date-pickers'
githubLabel: 'component: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
---

# Date and Time Pickers - Getting started

<p class="description">Install the Date and Time Pickers package and set up your date library to start building.</p>

## Installation

Install the base package (which can either be the free Community version or the paid Pro version) along with a required third-party date library.
The Pickers currently support [Day.js](https://day.js.org/), [date-fns](https://date-fns.org/), [Luxon](https://moment.github.io/luxon/#/), and [Moment.js](https://momentjs.com/).

Choose your packages and manager through the toggles below, then run the commands as provided to install:

<!-- #default-branch-switch -->

{{"component": "modules/components/PickersInstallationInstructions.js"}}

:::success
Not sure which date library to choose?
If you're starting from scratch with no other date libraries in your app, we recommend Day.js because of its small bundle size.
:::

### Peer dependencies

#### Material UI

The Date and Time Pickers have a peer dependency on `@mui/material`.
If you're not already using it, install it with the following command:

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/material @emotion/react @emotion/styled
```

```bash pnpm
pnpm add @mui/material @emotion/react @emotion/styled
```

```bash yarn
yarn add @mui/material @emotion/react @emotion/styled
```

</codeblock>

#### React

<!-- #react-peer-version -->

[`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) are also peer dependencies:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
},
```

## Date library adapter setup

To integrate your chosen date library with the Date and Time Pickers, you'll need to plug the corresponding adapter into a `LocalizationProvider` that wraps your Picker components.

Adapters are provided for each of the supported libraries, and all are exported by both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`—for example,`AdapterDayjs`, which is used throughout this documentation for [Day.js](https://day.js.org/) integration:

```tsx
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
```

### LocalizationProvider

The `LocalizationProvider` component is exported by both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`:

```tsx
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
```

:::warning
For practical purposes, each demo in the documentation has its own `LocalizationProvider` wrapper.
**We _do not_ recommend reproducing this pattern as-is.**
For almost all use cases, you should wrap your entire app with a single `LocalizationProvider` to avoid repeating boilerplate code in multiple places.
:::

{{"component": "modules/components/PickersRenderingInstructions.js"}}

:::info
To use the Date and Time Pickers with a custom locale, see [Date and format localization](/x/react-date-pickers/adapters-locale/).
:::

## Render your first component

To confirm that everything is set up correctly, try rendering a basic Date Picker component:

{{"demo": "FirstComponent.js"}}
