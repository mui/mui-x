---
productId: x-date-pickers
title: Date and Time Picker - Getting started
packageName: '@mui/x-date-pickers'
githubLabel: 'component: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
---

# Date and Time Pickers - Getting Started

<p class="description">Get started with the Date and Time Pickers. Install the package, configure your application and start using the components.</p>

## Installation

Using your favorite package manager, install:

- `@mui/x-date-pickers` for the free community version or `@mui/x-date-pickers-pro` for the commercial version.
- The date library to manipulate the date.

<!-- #default-branch-switch -->

{{"component": "modules/components/PickersInstallationInstructions.js"}}

:::info
If you need more information about the date library supported by the Date and Time Pickers,
take a look at the [dedicated section](/x/react-date-pickers/base-concepts/#date-library)
:::

The Date and Time Pickers package has a peer dependency on `@mui/material`.
If you are not already using it in your project, you can install it with:

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

<!-- #react-peer-version -->

Please note that [react](https://www.npmjs.com/package/react) and [react-dom](https://www.npmjs.com/package/react-dom) are peer dependencies too:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

### Style engine

Material UI is using [Emotion](https://emotion.sh/docs/introduction) as a styling engine by default. If you want to use [`styled-components`](https://styled-components.com/) instead, run:

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/styled-engine-sc styled-components
```

```bash pnpm
pnpm add @mui/styled-engine-sc styled-components
```

```bash yarn
yarn add @mui/styled-engine-sc styled-components
```

</codeblock>

Take a look at the [Styled engine guide](/material-ui/integrations/styled-components/) for more information about how to configure `styled-components` as the style engine.

## Setup your date library adapter

Before trying to render any component, you have to make sure that there is a `LocalizationProvider` upper in the React tree.
This component receives your chosen [date library's adapter](https://mui.com/x/react-date-pickers/#date-library) (the doc uses `AdapterDayjs` which is based on [dayjs](https://day.js.org/)) and makes it accessible to all the Date and Time Pickers component using React context.

Each demonstration in the documentation has its own `LocalizationProvider` wrapper.
This is **not** a pattern to reproduce.
The reason is to keep examples atomic and functional, especially when running in a CodeSandbox.

The general recommendation is to declare the `LocalizationProvider` once, wrapping your entire application.
Then, you don't need to repeat the boilerplate code for every Date and Time Picker in your application.

{{"component": "modules/components/PickersRenderingInstructions.js"}}

:::success

- All the adapters are exported by both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`:

  ```tsx
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
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

## What's next?

Continue to the [next page](/x/react-date-pickers/base-concepts/) and discover the components available and how to use them.
