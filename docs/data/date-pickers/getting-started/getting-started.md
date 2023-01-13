---
product: date-pickers
title: Date and Time Picker - Getting started
packageName: '@mui/x-date-pickers'
githubLabel: 'component: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog.html
---

# Date and Time Pickers - Getting Started

<p class="description">Get started with the Date and Time pickers. Install the package, configure your application and start using the components.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Installation

Using your favorite package manager, install:

- `@mui/x-date-pickers-pro` for the commercial version or `@mui/x-date-pickers` for the free community version.
- The [date library](/x/react-date-pickers/#date-library) to manipulate the date
  To make the Date and Time Pickers work, you need to install the following packages:

{{"component": "modules/components/PickersInstallationInstructions.js"}}

The Date and Time Pickers package has a peer dependency on `@mui/material`.
If you are not already using it in your project, you can install it with:

```sh
// with npm
npm install @mui/material @emotion/react @emotion/styled

// with yarn
yarn add @mui/material @emotion/react @emotion/styled
```

<!-- #react-peer-version -->

Please note that [react](https://www.npmjs.com/package/react) >= 17.0.2 and [react-dom](https://www.npmjs.com/package/react-dom) >= 17.0.2 are peer dependencies.

MUI is using [emotion](https://emotion.sh/docs/introduction) as a styling engine by default. If you want to use [`styled-components`](https://styled-components.com/) instead, run:

```sh
// with npm
npm install @mui/material @mui/styled-engine-sc styled-components

// with yarn
yarn add @mui/material @mui/styled-engine-sc styled-components
```

## Code setup

Before trying to render any component, you have to make sure that there is a `LocalizationProvider` upper in the React tree.
This component receives your chosen date library's adapter and makes it accessible to all the Date and Time Pickers component using React context.

The simplest way to use `LocalizationProvider` is to wrap your entire application in it.
You will then be able to use the Date and Time Pickers everywhere.

{{"component": "modules/components/PickersRenderingInstructions.js"}}

:::success

- All the adapters are exported by both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`:

  ```tsx
  import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
  import { AdapterDateFns } from '@mui/x-date-pickers-pro/`AdapterDayjs`';
  ```

- `LocalizationProvider` is exported by both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`:

  ```tsx
  import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
  import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
  ```

:::

:::info
If you need to use the Date and Time Pickers with a custom locale, have a look at the [Localized dates](/x/react-date-pickers/adapters-locale/) page.
:::

## Render your first component

To make sure that everything is set up correctly, try rendering a simple `DatePicker` component:

{{"demo": "FirstComponent.js"}}

## What's next ?

Continue to the [next page](/x/react-date-pickers/introduction/) and discover the components available and how to use them.
