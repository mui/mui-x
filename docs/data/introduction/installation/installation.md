# Installation

<p class="description">Install the necessary packages to start building with MUI X components.</p>

MUI X packages are available through the free MIT-licensed Community Plan, or the commercially-licensed Pro and Premium Plans.
See [the licensing page](/x/introduction/licensing/) for complete details.

Note that you only need to install the packages corresponding to the components you're using—e.g. Data Grid users don't need to install Date and Time Pickers.

## Dependencies

MUI X components have a peer dependency on `@mui/material`.
To install Material UI, run:

With **npm**:

```sh
npm install @mui/material @emotion/react @emotion/styled
```

With **yarn**

```sh
yarn add @mui/material @emotion/react @emotion/styled
```

Material UI uses Emotion as its default style library.
If you prefer styled-components, run:

With **npm**

```sh
npm install @mui/material @mui/styled-engine-sc styled-components
```

With **yarn**

```sh
yarn add @mui/material @mui/styled-engine-sc styled-components
```

## Data Grid

### Free version

To install the free version of the data grid, run:

```sh
npm install @mui/x-data-grid
```

### Pro version

To install the Pro version, run:

```sh
npm install @mui/x-data-grid-pro
```

### Premium version

To install the Premium version, run:

```sh
npm install @mui/x-data-grid-premium
```

## Date and Time Pickers

### Date library

Date and Time Pickers require a third-party date library.
See [Getting started](/x/react-date-pickers/getting-started/) for complete support and usage details.

To install the adapter package for the library you want to use, run:

#### date-fns

```sh
npm install @date-io/date-fns
```

#### Day.js

```sh
npm install @date-io/dayjs
```

#### Luxon

```sh
npm install @date-io/luxon
```

#### Moment.js

```sh
npm install @date-io/moment
```

### Free version

To install the free version, run:

```sh
npm install @mui/x-date-pickers
```

### Pro version

To install the Pro version, run:

```sh
npm install @mui/x-date-pickers-pro
```
